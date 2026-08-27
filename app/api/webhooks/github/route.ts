import { NextRequest, NextResponse } from "next/server";
import { getInstallationOctokit } from "@/lib/github/app";
import { verifyGithubSignature } from "@/lib/github/webhook";
import { postReview } from "@/lib/github/comment";
import { reviewPullRequest } from "@/lib/analyze/reviewer";
import { createSupabaseServiceRole } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/github — receives every webhook from our GitHub App.
 *
 * Flow:
 *   1. Verify HMAC-SHA256 signature (drop malformed or unsigned payloads).
 *   2. Dispatch based on X-GitHub-Event header.
 *   3. For pull_request events: fetch diff, run Claude analysis, post review.
 *   4. Return 200 fast so GitHub doesn't retry (max 10s hard timeout on their end).
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyGithubSignature(rawBody, signature)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  const deliveryId = req.headers.get("x-github-delivery") ?? "unknown";
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    switch (event) {
      case "ping":
        return NextResponse.json({ ok: true, pong: "armor-bot ready" });
      case "installation":
        await handleInstallation(payload);
        return NextResponse.json({ ok: true });
      case "installation_repositories":
        await handleInstallationRepositories(payload);
        return NextResponse.json({ ok: true });
      case "pull_request":
        // Fire-and-forget the review so we return 200 before GitHub times out.
        // Vercel functions extend execution beyond the initial response via
        // `waitUntil` in a full app; for MVP we await and hope for a <10s scan.
        await handlePullRequest(payload).catch((err) =>
          console.error(`[armor-bot] review failed (delivery ${deliveryId}):`, err),
        );
        return NextResponse.json({ ok: true });
      default:
        return NextResponse.json({ ok: true, ignored: event });
    }
  } catch (err) {
    console.error(`[armor-bot] webhook handler failed (delivery ${deliveryId}):`, err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }
}

async function handleInstallation(payload: any) {
  if (payload.action !== "created" && payload.action !== "deleted") return;
  const db = createSupabaseServiceRole();
  if (payload.action === "created") {
    await db.from("installations").upsert({
      installation_id: payload.installation.id,
      account_login: payload.installation.account?.login ?? "unknown",
      account_type: payload.installation.account?.type ?? "User",
      target_type: payload.installation.target_type,
      repository_selection: payload.installation.repository_selection,
      created_at: new Date().toISOString(),
    });
  } else {
    await db
      .from("installations")
      .delete()
      .eq("installation_id", payload.installation.id);
  }
}

async function handleInstallationRepositories(payload: any) {
  // For MVP we just log — we already have the installation record.
  console.log(
    `[armor-bot] installation_repositories ${payload.action} for ${payload.installation?.id}`,
  );
}

async function handlePullRequest(payload: any) {
  const action = payload.action;
  if (action !== "opened" && action !== "synchronize" && action !== "reopened") return;

  const pr = payload.pull_request;
  const repo = payload.repository;
  const installationId = payload.installation?.id;
  if (!installationId) return;

  // Skip PRs from bots — we don't review our own bot's PRs or Dependabot output.
  const authorType = pr.user?.type;
  const authorLogin = (pr.user?.login ?? "").toLowerCase();
  if (authorType === "Bot" && authorLogin !== "armor-bot") return;

  const octokit = getInstallationOctokit(installationId);
  const review = await reviewPullRequest(octokit, {
    installationId,
    owner: repo.owner.login,
    repo: repo.name,
    pullNumber: pr.number,
    baseBranch: pr.base.ref,
    headSha: pr.head.sha,
  });

  await postReview(octokit, {
    owner: repo.owner.login,
    repo: repo.name,
    pullNumber: pr.number,
    commitSha: pr.head.sha,
    findings: review.findings,
    scanElapsedMs: review.scanElapsedMs,
  });

  // Persist the review summary. Even if the DB write fails, the customer got their review.
  try {
    const db = createSupabaseServiceRole();
    await db.from("reviews").insert({
      installation_id: installationId,
      owner: repo.owner.login,
      repo: repo.name,
      pull_number: pr.number,
      head_sha: pr.head.sha,
      files_scanned: review.filesScanned,
      files_skipped: review.filesSkipped,
      scan_elapsed_ms: review.scanElapsedMs,
      finding_counts: countBySeverity(review.findings),
      findings: review.findings,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[armor-bot] failed to persist review:", err);
  }
}

function countBySeverity(findings: readonly { severity: string }[]) {
  const counts = { high: 0, medium: 0, low: 0, info: 0 };
  for (const f of findings) {
    if (f.severity in counts) counts[f.severity as keyof typeof counts] += 1;
  }
  return counts;
}
