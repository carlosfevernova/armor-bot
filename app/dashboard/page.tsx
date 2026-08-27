import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Public dashboard — shows aggregate stats sourced from the `public_stats`
 * Supabase view. Zero PII, safe to expose without auth. Marketing signal
 * plus recruiter/investor consumption.
 */
export default async function PublicDashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: stats } = await supabase
    .from("public_stats")
    .select("installations, reviews, high_findings, medium_findings, files_scanned")
    .maybeSingle();

  const s = stats ?? {
    installations: 0,
    reviews: 0,
    high_findings: 0,
    medium_findings: 0,
    files_scanned: 0,
  };

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">armor-bot in production</h1>
        <p className="mt-2 text-muted">
          Live aggregate stats from every install. No repository names, no code — just totals.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Installations" value={s.installations} />
          <StatCard label="Reviews delivered" value={s.reviews} />
          <StatCard label="Files scanned" value={s.files_scanned} />
          <StatCard label="High-severity findings" value={s.high_findings} accent="err" />
          <StatCard label="Medium findings" value={s.medium_findings} accent="warn" />
          <StatCard label="Rulesets" value={6} />
        </div>

        <section className="mt-16 rounded-lg border border-border bg-panel/50 p-6">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">How this counter grows</h2>
          <ol className="space-y-2 text-sm text-muted">
            <li>1. Someone installs armor-bot on a repository via the GitHub Marketplace.</li>
            <li>2. Every new PR triggers a review — 3 to 8 seconds, streamed from Claude.</li>
            <li>3. Findings above the medium threshold are posted inline in the PR.</li>
            <li>4. Aggregate counters update in real time on this page.</li>
          </ol>
          <div className="mt-6">
            <Link
              href="https://github.com/marketplace/armor-bot"
              target="_blank"
              className="inline-block rounded-md bg-accent px-4 py-2 font-semibold text-bg hover:bg-accent-soft hover:text-white"
            >
              Install now — free for public repos →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "err" | "warn" }) {
  const color = accent === "err" ? "text-err" : accent === "warn" ? "text-warn" : "text-fg";
  return (
    <div className="rounded-lg border border-border bg-panel/50 p-5">
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}
