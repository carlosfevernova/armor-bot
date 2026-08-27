import Link from "next/link";
import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="hero-halo relative overflow-hidden">
      <div className="grid-backdrop absolute inset-0 opacity-30 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-panel/60 px-3 py-1 text-xs text-muted">
            <span className="pulse-ring inline-block h-2 w-2 rounded-full bg-ok" />
            <span>Vertical for Next.js 16 · Vercel · Supabase · MCP</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            The senior code reviewer
            <br />
            <span className="bg-gradient-to-br from-accent via-accent-soft to-accent-dim bg-clip-text text-transparent">
              that never sleeps.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            <strong className="text-fg">armor-bot</strong> reviews every pull request in your Next.js repo.
            Catches SSRF, missing circuit breakers, RLS leaks, MCP token bloat, and 20+ other
            production-grade patterns your human reviewers miss on Friday afternoons.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="https://github.com/marketplace/armor-bot"
              target="_blank"
              className="rounded-md bg-accent px-6 py-3 font-semibold text-bg hover:bg-accent-soft hover:text-white"
            >
              Install on GitHub →
            </Link>
            <span className="text-xs text-muted">or</span>
            <div className="max-w-xs">
              <WaitlistForm />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" />
              Free for open source
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" />
              $19/mo per private repo
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" />
              30s to install
            </span>
          </div>
        </div>

        {/* Screenshot mockup */}
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="pr-comment p-4">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="text-[#8b949e]">
                <strong className="text-white">armor-bot</strong> commented on <span className="text-[#58a6ff]">PR #142</span>
              </span>
              <span className="pr-severity-high inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold">
                4 blocking findings
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <FindingRow
                severity="high"
                file="app/api/checkout/route.ts"
                line="34"
                title="Missing timeout on outbound fetch to Stripe"
                explanation="Will cascade 504s to your users during Stripe outage. Use vercel-armor's abortableFetch."
              />
              <FindingRow
                severity="high"
                file="lib/supabase.ts"
                line="12"
                title="Service role client imported in a browser bundle"
                explanation="Full DB access exposed to client. Split into lib/supabase/{client,server}."
              />
              <FindingRow
                severity="medium"
                file="app/api/mcp/tools/route.ts"
                line="88"
                title="Tool argument accepts unvalidated URL"
                explanation="SSRF vector. Wrap with mcp-armor's scanToolInput before dispatch."
              />
              <FindingRow
                severity="medium"
                file="package.json"
                line="26"
                title="next@16.0.1 has 2 open CVEs"
                explanation="Bump to next@16.3.3 or apply monkey-patch (advisory link in details)."
              />
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-[#30363d] pt-3 text-[11px] text-[#8b949e]">
              <span>Ruleset:</span>
              <a className="text-[#58a6ff]" href="https://github.com/carlosfevernova/vercel-armor">vercel-armor</a>
              <span>·</span>
              <a className="text-[#58a6ff]" href="https://github.com/carlosfevernova/mcp-armor">mcp-armor</a>
              <span>·</span>
              <span>next16-supabase-mcp</span>
              <span className="ml-auto text-white">✓ 12 lines scanned in 3.4s</span>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Real screenshot format · <kbd>Cmd</kbd>+<kbd>K</kbd> to open the interactive demo
          </p>
        </div>
      </div>
    </section>
  );
}

function FindingRow({
  severity,
  file,
  line,
  title,
  explanation,
}: {
  severity: "high" | "medium";
  file: string;
  line: string;
  title: string;
  explanation: string;
}) {
  const cls = severity === "high" ? "pr-severity-high" : "pr-severity-medium";
  return (
    <div className="rounded border border-[#30363d] bg-[#0d1117] p-3">
      <div className="flex items-center gap-2 text-[11px]">
        <span className={`inline-block rounded-sm px-1.5 py-0.5 ${cls} font-semibold`}>{severity}</span>
        <span className="text-[#c9d1d9]">
          <code>{file}</code>:<code>{line}</code>
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-[12px] text-[#8b949e]">{explanation}</p>
    </div>
  );
}
