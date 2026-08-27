import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-muted">
        <div className="grid gap-6 sm:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-fg font-semibold">
              <span className="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-accent to-accent-soft" />
              armor<span className="text-accent">-bot</span>
            </Link>
            <p className="mt-3">
              The GitHub bot that catches the SSRF your human reviewers missed.
              <br />Built by Carlos F. Vernova.
            </p>
          </div>
          <FooterCol title="Product" links={[
            ["Pricing", "#pricing"],
            ["FAQ", "#faq"],
            ["Install", "https://github.com/marketplace/armor-bot"],
            ["Changelog", "/changelog"],
          ]} />
          <FooterCol title="Armor Family" links={[
            ["vercel-armor", "https://github.com/carlosfevernova/vercel-armor"],
            ["mcp-armor", "https://github.com/carlosfevernova/mcp-armor"],
            ["skill-kit", "https://github.com/carlosfevernova/skill-kit"],
            ["armor.dev", "https://armor-dev-liard.vercel.app"],
          ]} />
          <FooterCol title="Company" links={[
            ["Security", "/security"],
            ["Privacy", "/privacy"],
            ["Terms", "/terms"],
            ["Contact", "mailto:hello@armor-bot.dev"],
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p>&copy; 2026 armor-bot. All rights reserved.</p>
          <p>AI-powered · Built on the Armor Family.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-widest text-fg">{title}</p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-fg">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
