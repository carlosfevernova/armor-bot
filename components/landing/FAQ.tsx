const ITEMS = [
  {
    q: "How is this different from CodeRabbit or Codegen?",
    a: "CodeRabbit is horizontal — every language, every stack. armor-bot is vertical: Next.js 16 + Vercel + Supabase + MCP. Every rule is derived from a real production incident on this stack. If you're not shipping on this stack, use the horizontal tools.",
  },
  {
    q: "How do the rules stay up to date?",
    a: "The rules live in our open-source libraries (vercel-armor, mcp-armor, skill-kit). Every update to those libraries — driven by real incidents — flows into armor-bot's ruleset the same day. You're always current with the latest gotchas.",
  },
  {
    q: "Does armor-bot see my code?",
    a: "armor-bot only sees the diff of the PR, not the full codebase. The diff is sent to Anthropic's Claude with a system prompt and never persisted beyond the finding cache. We don't train on your code — Anthropic's zero-data-retention API is used.",
  },
  {
    q: "How many false positives should I expect?",
    a: "About 5-8% in our internal benchmark. Every rule is anchored to a specific runtime failure mode, so the false-positive rate is lower than lint-based tools. You can silence individual rules per-repo via .armor-bot.yml.",
  },
  {
    q: "Can I use my own OpenAI/Gemini/Groq key?",
    a: "Not in v0.1 — Claude's structured output + code diff generation is meaningfully better than alternatives for this task. We may add BYO-key in v0.2 for teams that want cost control.",
  },
  {
    q: "What's the config file look like?",
    a: "Optional. Add .armor-bot.yml at the repo root: enable/disable rulesets, silence specific findings, set severity thresholds. Sensible defaults work for 90% of repos.",
  },
  {
    q: "How fast is a review?",
    a: "3-8 seconds for a typical PR (< 200 lines changed). We fetch the diff, filter to relevant files, and stream Claude's analysis in parallel per ruleset.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Frequently answered</h2>
      </div>
      <div className="space-y-3">
        {ITEMS.map((it) => (
          <details key={it.q} className="group rounded-lg border border-border bg-panel/50 p-5">
            <summary className="cursor-pointer text-sm font-semibold text-fg">{it.q}</summary>
            <p className="mt-3 text-sm text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
