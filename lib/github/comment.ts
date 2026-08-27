import type { Octokit } from "@octokit/rest";
import type { Finding } from "@/lib/analyze/reviewer";

/**
 * Post an aggregated review to the PR: one summary comment + inline comments
 * for each high/medium finding. GitHub's review API accepts up to 100 inline
 * comments at once so we chunk if the PR has more (extremely rare).
 */
export async function postReview(
  octokit: Octokit,
  opts: {
    owner: string;
    repo: string;
    pullNumber: number;
    commitSha: string;
    findings: readonly Finding[];
    scanElapsedMs: number;
  },
): Promise<void> {
  const { owner, repo, pullNumber, commitSha, findings, scanElapsedMs } = opts;

  const high = findings.filter((f) => f.severity === "high");
  const medium = findings.filter((f) => f.severity === "medium");
  const info = findings.filter((f) => f.severity === "low" || f.severity === "info");

  const summaryBody = buildSummary({ findings, high, medium, info, scanElapsedMs });
  const inlineComments = findings
    .filter((f) => f.severity === "high" || f.severity === "medium")
    .map((f) => ({
      path: f.file,
      line: f.line,
      body: buildInlineBody(f),
      side: "RIGHT" as const,
    }))
    .slice(0, 100);

  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: pullNumber,
    commit_id: commitSha,
    body: summaryBody,
    event: high.length > 0 ? "REQUEST_CHANGES" : "COMMENT",
    comments: inlineComments,
  });
}

function buildSummary(args: {
  findings: readonly Finding[];
  high: readonly Finding[];
  medium: readonly Finding[];
  info: readonly Finding[];
  scanElapsedMs: number;
}): string {
  const { findings, high, medium, info, scanElapsedMs } = args;
  if (findings.length === 0) {
    return [
      "## 🛡️ armor-bot",
      "",
      "No findings on this diff. Ship it.",
      "",
      `— ${(scanElapsedMs / 1000).toFixed(1)}s scan · [ruleset](https://armor-bot.vercel.app)`,
    ].join("\n");
  }

  const badge =
    high.length > 0
      ? `**${high.length} blocking finding${high.length === 1 ? "" : "s"}**`
      : `${medium.length} finding${medium.length === 1 ? "" : "s"} to review`;

  const rulesetSummary = Array.from(
    findings.reduce((m, f) => {
      m.set(f.ruleset, (m.get(f.ruleset) ?? 0) + 1);
      return m;
    }, new Map<string, number>()),
  )
    .map(([r, n]) => `\`${r}\`: ${n}`)
    .join(" · ");

  return [
    `## 🛡️ armor-bot — ${badge}`,
    "",
    `- 🔴 High: **${high.length}**`,
    `- 🟠 Medium: **${medium.length}**`,
    `- 🔵 Info: **${info.length}**`,
    "",
    `**Rulesets:** ${rulesetSummary}`,
    "",
    high.length > 0
      ? "Blocking findings marked as **Request changes**. Individual explanations + suggested fixes are inline below."
      : "No blocking findings. Non-blocking suggestions are inline below.",
    "",
    `<sub>${(scanElapsedMs / 1000).toFixed(1)}s scan · [why did I get this?](https://armor-bot.vercel.app/why) · [silence a rule](https://armor-bot.vercel.app/docs/config)</sub>`,
  ].join("\n");
}

function buildInlineBody(f: Finding): string {
  const severityEmoji = f.severity === "high" ? "🔴" : f.severity === "medium" ? "🟠" : "🔵";
  const rulesetTag = `\`${f.ruleset}\` · \`${f.ruleId}\``;
  const parts = [
    `${severityEmoji} **${f.title}**`,
    "",
    f.explanation,
    "",
  ];
  if (f.suggestion) {
    parts.push(
      "```suggestion",
      f.suggestion,
      "```",
      "",
    );
  }
  if (f.reference) {
    parts.push(`> Reference: ${f.reference}`);
    parts.push("");
  }
  parts.push(`<sub>${rulesetTag}</sub>`);
  return parts.join("\n");
}
