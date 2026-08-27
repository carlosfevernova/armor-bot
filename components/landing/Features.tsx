const RULESETS = [
  {
    title: "vercel-armor",
    tag: "Resilience",
    body: "Missing timeouts on outbound fetch. No circuit breakers on flaky upstreams. `cache: 'no-store'` in the browser that breaks CDN collapsing. Missing `stale-if-error` header.",
    count: "8 rules",
  },
  {
    title: "mcp-armor",
    tag: "MCP security",
    body: "Tool arguments accepting free-form URLs (SSRF), path traversal in file operations, unbounded token schemas, missing Zod validation on tool inputs.",
    count: "12 rules",
  },
  {
    title: "next-16",
    tag: "Framework",
    body: "Cookie-bound Supabase clients used in the wrong runtime. `\"use server\"` actions leaking service-role. Server components fetching without cache-control. Missing dynamic export on force-dynamic routes.",
    count: "9 rules",
  },
  {
    title: "supabase-rls",
    tag: "Data",
    body: "Tables without RLS enabled. Policies that use `auth.uid()` on tables with no `user_id` column. Service-role clients imported into client bundles. Missing indexes on RLS-heavy queries.",
    count: "7 rules",
  },
  {
    title: "supply-chain",
    tag: "Dependencies",
    body: "Open CVEs in direct + transitive deps. Deprecated packages. `postinstall` scripts in packages that shouldn't need them. Version pins that block security patches.",
    count: "5 rules",
  },
  {
    title: "skill-kit",
    tag: "Claude skills",
    body: "SKILL.md frontmatter errors, missing progressive-disclosure hygiene, kebab-case name violations, description length outside sweet spot, no cross-links.",
    count: "11 rules",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          52 rules across 6 rulesets
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Every rule is derived from a real production incident, extracted into one of our
          open-source libraries, and enforced by armor-bot on every PR.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RULESETS.map((rs) => (
          <div
            key={rs.title}
            className="rounded-lg border border-border bg-panel/60 p-6 transition hover:border-accent/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <code className="text-sm font-semibold text-accent">{rs.title}</code>
              <span className="text-[10px] uppercase tracking-widest text-muted">{rs.count}</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">{rs.tag}</p>
            <p className="text-sm text-muted">{rs.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
