export function SocialProof() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-widest text-muted">
          Built on the armor family — battle-tested in production
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted">
          <Repo href="https://github.com/carlosfevernova/vercel-armor" name="vercel-armor" tag="Resilience" />
          <Repo href="https://github.com/carlosfevernova/mcp-armor" name="mcp-armor" tag="MCP proxy" />
          <Repo href="https://github.com/carlosfevernova/skill-kit" name="skill-kit" tag="Claude Skills" />
          <Repo href="https://github.com/carlosfevernova/next-ai-armor" name="next-ai-armor" tag="Next 16 starter" />
          <Repo href="https://armor-dev-liard.vercel.app" name="armor.dev" tag="Hosted platform" />
        </div>
      </div>
    </section>
  );
}

function Repo({ name, href, tag }: { name: string; href: string; tag: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="min-w-[10rem] text-left transition hover:text-fg"
    >
      <div className="text-sm font-semibold text-fg">{name}</div>
      <div className="text-xs uppercase tracking-widest text-accent/70">{tag}</div>
    </a>
  );
}
