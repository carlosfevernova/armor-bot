import Link from "next/link";

const TIERS = [
  {
    name: "Open Source",
    price: "$0",
    period: "forever",
    tagline: "For public repositories.",
    features: [
      "Unlimited PR reviews",
      "All 52 rules",
      "Claude-generated explanations",
      "Applied suggestions",
      "Public repo badge",
    ],
    cta: "Install free",
    href: "https://github.com/apps/armor-review-bot/installations/new",
    highlight: false,
  },
  {
    name: "Private",
    price: "$19",
    period: "/mo · per private repo",
    tagline: "For solo devs shipping paid products.",
    features: [
      "Everything in OSS",
      "Private repositories",
      "Custom .armor-bot.yml config",
      "Findings history dashboard",
      "Email support",
    ],
    cta: "Start private",
    href: "/signup?plan=private",
    highlight: true,
  },
  {
    name: "Team",
    price: "$199",
    period: "/mo · unlimited repos",
    tagline: "For teams shipping in production.",
    features: [
      "Everything in Private",
      "Unlimited private repositories",
      "Includes Team tier of armor.dev",
      "Slack + Sentry integrations",
      "SLA-backed support",
    ],
    cta: "Start team",
    href: "/signup?plan=team",
    highlight: false,
  },
];

export function PricingCards() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Straight pricing. No seat charges.</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Free forever for open-source repositories. We only charge for private codebases.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              "relative rounded-xl border p-8 " +
              (tier.highlight
                ? "border-accent/60 bg-panel/80 ring-1 ring-accent/40"
                : "border-border bg-panel/50")
            }
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-bg">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="mt-1 text-sm text-muted">{tier.tagline}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
              <span className="text-muted text-sm">{tier.period}</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2 text-muted">
                  <span className="text-accent">→</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              target={tier.href.startsWith("http") ? "_blank" : undefined}
              className={
                "mt-8 inline-block w-full rounded-md px-4 py-3 text-center font-semibold transition " +
                (tier.highlight
                  ? "bg-accent text-bg hover:bg-accent-soft hover:text-white"
                  : "border border-border text-fg hover:border-accent/60")
              }
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
