export function WhySection() {
  return (
    <section className="border-y border-border bg-panel/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Your reviewers ship what they can spot.
            </h2>
            <p className="mt-4 text-muted">
              A senior reviewer at 4pm on Friday won&apos;t notice the timeout missing on your
              Stripe fetch. Your CI won&apos;t either — it&apos;s a runtime pattern, not a lint rule.
              <strong className="text-fg"> armor-bot notices.</strong>
            </p>
            <p className="mt-4 text-muted">
              We&apos;re not another generic PR reviewer. We&apos;re vertical: Next.js 16 · Vercel · Supabase · MCP.
              Every rule is written by someone who has been paged at 3am because that exact bug shipped.
            </p>
          </div>
          <div className="space-y-6">
            <QAItem
              title="Runtime patterns, not lint rules"
              body="Missing circuit breakers, no stale-if-error cache headers, tool schemas with SSRF gadgets. Static analyzers don't catch these. armor-bot does, using Claude + the vercel-armor + mcp-armor ruleset."
            />
            <QAItem
              title="Human-readable explanations"
              body="Every finding comes with an explanation of WHY it matters — including the exact failure mode in production. No cryptic error codes."
            />
            <QAItem
              title="Applied suggestions"
              body="For every high-severity finding, armor-bot generates a code diff you can apply with one click. No copy-paste."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function QAItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-panel/60 p-5">
      <p className="text-sm font-semibold text-fg">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}
