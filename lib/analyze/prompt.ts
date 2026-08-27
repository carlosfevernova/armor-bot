import { NEXT16_RULES } from "./rulesets/next16";
import { RESILIENCE_RULES } from "./rulesets/resilience";
import { MCP_RULES } from "./rulesets/mcp";
import { SUPABASE_RULES } from "./rulesets/supabase";
import { SUPPLY_CHAIN_RULES } from "./rulesets/supply-chain";

export interface RuleDefinition {
  id: string;
  ruleset: string;
  severity: "high" | "medium" | "low" | "info";
  what: string;
  why: string;
  fix?: string;
  reference?: string;
}

/** All rules, flattened. Used to build the Claude system prompt. */
export const ALL_RULES: readonly RuleDefinition[] = [
  ...NEXT16_RULES,
  ...RESILIENCE_RULES,
  ...MCP_RULES,
  ...SUPABASE_RULES,
  ...SUPPLY_CHAIN_RULES,
];

/**
 * Build the system prompt for Claude. We list every rule with its ID so Claude
 * can reference the exact rule that fired. Keeping this deterministic and
 * bounded (~52 rules → ~4-6K tokens) is essential for tight latency.
 */
export function buildSystemPrompt(): string {
  const rulesByRuleset = ALL_RULES.reduce((m, r) => {
    if (!m.has(r.ruleset)) m.set(r.ruleset, []);
    m.get(r.ruleset)!.push(r);
    return m;
  }, new Map<string, RuleDefinition[]>());

  const rulesetSections = Array.from(rulesByRuleset.entries())
    .map(([ruleset, rules]) => {
      const lines = rules.map(
        (r) =>
          `- **${r.id}** (${r.severity.toUpperCase()}): ${r.what}\n  WHY: ${r.why}${r.fix ? `\n  FIX: ${r.fix}` : ""}`,
      );
      return `### Ruleset: \`${ruleset}\`\n${lines.join("\n")}`;
    })
    .join("\n\n");

  return `You are armor-bot, a senior code reviewer specialized in Next.js 16 + Vercel + Supabase + MCP applications. You review one pull request diff at a time.

Your job:
1. Read the PR diff.
2. Identify every finding that matches one of the rules below.
3. Return a JSON array (no prose) of findings — one entry per issue, with the exact rule ID.

Only report findings that clearly match a rule. False positives destroy trust; err on the side of NOT reporting when uncertain. If the diff is clean, return \`[]\`.

For each finding, return this shape:
\`\`\`json
{
  "ruleset": "<ruleset name from list below>",
  "ruleId": "<rule ID from list below>",
  "severity": "high" | "medium" | "low" | "info",
  "file": "<relative path from diff>",
  "line": <integer, right-side line number>,
  "title": "<10-word summary>",
  "explanation": "<one to three sentences: the WHY, referencing the specific failure mode>",
  "suggestion": "<optional: the exact code that should replace the flagged line, no fences>",
  "reference": "<optional: link to the OSS lib docs>"
}
\`\`\`

## The rules

${rulesetSections}

Return ONLY the JSON array. No preamble, no summary, no code fences around the array.`;
}

/**
 * Build the user message with the PR context. We include:
 *  - the head SHA (helps Claude reason about commit-scoped context)
 *  - the diff, formatted with clear file boundaries
 *  - the target branch (repo defaults matter — main vs. next)
 */
export function buildUserMessage(opts: {
  repo: string;
  baseBranch: string;
  headSha: string;
  files: Array<{ path: string; patch: string }>;
}): string {
  const lines = [
    `Repository: ${opts.repo}`,
    `Target branch: ${opts.baseBranch}`,
    `Head commit: ${opts.headSha}`,
    "",
    "## Diff",
    "",
  ];
  for (const f of opts.files) {
    lines.push(`### ${f.path}`);
    lines.push("```diff");
    lines.push(f.patch);
    lines.push("```");
    lines.push("");
  }
  return lines.join("\n");
}
