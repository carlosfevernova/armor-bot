import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-accent to-accent-soft" />
          <span>armor<span className="text-accent">-bot</span></span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <a href="#pricing" className="text-muted hover:text-fg">Pricing</a>
          <a href="#faq" className="text-muted hover:text-fg">FAQ</a>
          <Link href="https://github.com/carlosfevernova/mcp-armor" target="_blank" className="text-muted hover:text-fg">
            OSS
          </Link>
          <Link
            href="https://github.com/marketplace/armor-bot"
            target="_blank"
            className="rounded-md bg-accent px-3 py-1.5 font-semibold text-bg hover:bg-accent-soft hover:text-white"
          >
            Install →
          </Link>
        </div>
      </div>
    </nav>
  );
}
