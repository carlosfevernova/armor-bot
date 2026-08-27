import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { Octokit } from "@octokit/rest";
import { ALL_RULES, buildSystemPrompt, buildUserMessage } from "./prompt";

const FindingSchema = z.object({
  ruleset: z.string(),
  ruleId: z.string(),
  severity: z.enum(["high", "medium", "low", "info"]),
  file: z.string(),
  line: z.number().int().positive(),
  title: z.string(),
  explanation: z.string(),
  suggestion: z.string().optional(),
  reference: z.string().optional(),
});

export type Finding = z.infer<typeof FindingSchema>;

/**
 * File extensions that armor-bot considers "relevant." Everything else is
 * dropped before we spend Claude tokens on it. Extend cautiously — every
 * added filetype linearly increases scan cost.
 */
const RELEVANT_EXTENSIONS = [
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json",
  ".yaml", ".yml",
  ".sql",
];

/**
 * Maximum diff size we send to Claude per PR. Larger PRs get chunked or
 * truncated. This keeps latency + cost bounded for outlier repos with
 * enormous changesets.
 */
const MAX_TOTAL_DIFF_CHARS = 80_000;

export interface ReviewInput {
  installationId: number;
  owner: string;
  repo: string;
  pullNumber: number;
  baseBranch: string;
  headSha: string;
}

export interface ReviewOutput {
  findings: readonly Finding[];
  filesScanned: number;
  filesSkipped: number;
  scanElapsedMs: number;
  truncated: boolean;
}

/** Filter a PR's file list to just the ones we scan, and cap total diff size. */
function collectRelevantFiles(
  files: Array<{ filename: string; patch?: string; status: string }>,
): { relevant: Array<{ path: string; patch: string }>; skipped: number; truncated: boolean } {
  const relevant: Array<{ path: string; patch: string }> = [];
  let totalChars = 0;
  let skipped = 0;
  let truncated = false;

  for (const f of files) {
    if (f.status === "removed") {
      skipped++;
      continue;
    }
    if (!RELEVANT_EXTENSIONS.some((ext) => f.filename.endsWith(ext))) {
      skipped++;
      continue;
    }
    if (!f.patch) {
      skipped++;
      continue;
    }
    if (totalChars + f.patch.length > MAX_TOTAL_DIFF_CHARS) {
      truncated = true;
      break;
    }
    relevant.push({ path: f.filename, patch: f.patch });
    totalChars += f.patch.length;
  }

  return { relevant, skipped, truncated };
}

/**
 * Fetch the PR's file list + diff, ask Claude to review it against our ruleset,
 * and return the validated findings.
 */
export async function reviewPullRequest(
  octokit: Octokit,
  input: ReviewInput,
): Promise<ReviewOutput> {
  const startedAt = Date.now();

  const { data: files } = await octokit.pulls.listFiles({
    owner: input.owner,
    repo: input.repo,
    pull_number: input.pullNumber,
    per_page: 300,
  });

  const { relevant, skipped, truncated } = collectRelevantFiles(files);

  if (relevant.length === 0) {
    return {
      findings: [],
      filesScanned: 0,
      filesSkipped: skipped,
      scanElapsedMs: Date.now() - startedAt,
      truncated,
    };
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage({
    repo: `${input.owner}/${input.repo}`,
    baseBranch: input.baseBranch,
    headSha: input.headSha,
    files: relevant,
  });

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-opus-4-7",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((c) => c.text)
    .join("");

  const findings = parseFindings(text);
  const validatedRuleIds = new Set(ALL_RULES.map((r) => r.id));

  const cleanFindings = findings.filter((f) => {
    if (!validatedRuleIds.has(f.ruleId)) return false;
    // Only keep findings that reference a file we actually scanned.
    return relevant.some((r) => r.path === f.file);
  });

  return {
    findings: cleanFindings,
    filesScanned: relevant.length,
    filesSkipped: skipped,
    scanElapsedMs: Date.now() - startedAt,
    truncated,
  };
}

/**
 * Extract a JSON array from Claude's response even if it wrapped the array in
 * a code fence or added a stray note. Tolerant parser so a formatting hiccup
 * doesn't cost the customer their review.
 */
function parseFindings(text: string): Finding[] {
  const stripped = text.trim();
  const candidates: string[] = [stripped];

  // Try to pull out the first JSON array from prose.
  const arrayMatch = stripped.match(/\[[\s\S]*\]/);
  if (arrayMatch) candidates.push(arrayMatch[0]);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (!Array.isArray(parsed)) continue;
      const results: Finding[] = [];
      for (const item of parsed) {
        const check = FindingSchema.safeParse(item);
        if (check.success) results.push(check.data);
      }
      return results;
    } catch {
      /* try next candidate */
    }
  }
  return [];
}
