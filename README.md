# armor-bot

**The senior code reviewer that never sleeps.**

GitHub App that reviews every pull request in Next.js 16 + Vercel + Supabase + MCP repositories using Claude. Catches SSRF, missing circuit breakers, RLS leaks, MCP token bloat, and 50+ other production patterns your human reviewers miss.

## 🎯 What's included

- **6 rulesets, ~52 rules** — each derived from a real production incident, sourced from our open-source libraries
- **Claude Opus 4.7** — reads the diff, generates human explanations, produces applied code suggestions
- **Inline PR reviews** — high-severity findings block merge as `REQUEST_CHANGES`; medium/low are advisory
- **GitHub App marketplace listing** — install with one click, revoke with one click

## 💰 Pricing

- Open Source: **$0/forever** for public repos
- Private: **$19/mo** per private repo
- Team: **$199/mo** unlimited repos + Team tier of armor.dev

## 🏗️ Local setup

```bash
git clone https://github.com/carlosfevernova/armor-bot
cd armor-bot
npm install
cp .env.example .env.local
# fill in GitHub App creds + Anthropic + Supabase
npm run dev
```

Apply DB schema:

```bash
# Paste supabase-schema.sql into Supabase SQL Editor once
```

## 🔐 Creating the GitHub App

See `SETUP.md` for the full walkthrough. Highlights:
- Create a new GitHub App at https://github.com/settings/apps/new
- Permissions: `Pull requests: Read & write` · `Contents: Read` · `Metadata: Read`
- Subscribe to events: `Pull request`, `Installation`, `Installation repositories`
- Webhook URL: `https://<your-domain>/api/webhooks/github`
- Generate a private key and set `GITHUB_APP_PRIVATE_KEY`

## 📁 Directory layout

```
app/
  page.tsx                        # landing (Hero, Features, Pricing, FAQ, Waitlist)
  dashboard/page.tsx              # public stats (installations, reviews, findings)
  api/
    waitlist/route.ts             # POST /api/waitlist
    webhooks/github/route.ts      # GitHub App webhook receiver
components/
  landing/*.tsx                   # Nav, Hero, WhySection, Features, PricingCards, SocialProof, FAQ, Footer, WaitlistForm
lib/
  supabase/{client,server}.ts     # browser / server / service-role
  github/
    app.ts                        # GitHub App JWT + installation Octokit
    webhook.ts                    # HMAC-SHA256 signature verification
    comment.ts                    # inline + summary PR review poster
  analyze/
    prompt.ts                     # system prompt builder (52 rules)
    reviewer.ts                   # diff fetch → Claude → structured findings
    rulesets/
      next16.ts                   # 9 Next.js 16 rules
      resilience.ts               # 8 vercel-armor rules
      mcp.ts                      # 12 mcp-armor rules
      supabase.ts                 # 7 Supabase RLS rules
      supply-chain.ts             # 5 CVE / dependency rules
supabase-schema.sql               # waitlist + installations + reviews + public_stats view
MARKETING.md                      # launch copy (Show HN, X thread, Reddit, LinkedIn)
```

## 🚧 v0.1 scope

- ✅ Public landing + waitlist
- ✅ GitHub App webhook receiver with signature verification
- ✅ Claude-powered PR analysis with 52 rules
- ✅ Inline PR review comments with severity + suggested fix
- ✅ Public dashboard with aggregate stats

## 🛣️ Roadmap

- **v0.2** — `.armor-bot.yml` config for per-repo rule silencing, Slack integration
- **v0.3** — Auto-fix PR mode (bot opens PRs against your PRs with the fixes applied)
- **v0.4** — Ruleset marketplace (community-contributed rules for other stacks)

## 📄 License

Source-available under a proprietary license (see `LICENSE`). Personal use OK; commercial requires paid license.

The open-source foundations (`vercel-armor`, `mcp-armor`, `skill-kit`, `next-ai-armor`) are MIT-licensed.
