# armor-bot — launch pack

## 📖 Explicación simple

**ES:** armor-bot es como poner un revisor senior de código en cada uno de tus pull requests, disponible 24/7, especializado en Next.js + Vercel + Supabase + MCP. Encuentra los bugs que tu equipo pasa por alto los viernes a las 4pm porque están cansados. Cada finding viene con explicación humana + código de solución para aplicar con un click.

**EN:** armor-bot is like putting a senior reviewer on every pull request, available 24/7, specialized in Next.js + Vercel + Supabase + MCP. It catches the bugs your team misses at 4pm on Fridays. Every finding comes with a human explanation + a one-click applied code fix.

## 🎬 The 15-second wow moment

**Screencast script:**

```
Second 0-1: Dev pushes a commit → PR opens on GitHub
Second 2-4: armor-bot avatar appears with "checking..." indicator
Second 5-10: Zoom on 4 red review comments appearing inline
  - "🔴 missing timeout on /api/checkout"
  - "🔴 service_role imported in client bundle"
  - "🟠 SSRF vector in MCP tool"
  - "🟠 CVE in next@16.0.1"
Second 11-13: Dev hovers "Apply suggestion" → green diff → merge unblocks
Second 14-15: Fade to armor-bot logo + "Install → free for public repos"
```

**Zero narration. Text callouts only.**

## 🚀 14-day launch plan

| Day | Channel | Content |
|---|---|---|
| 0 (Sun) | X thread | 15s video + hook + 5-tweet story |
| 1 (Mon) | Show HN | Detailed technical writeup + benchmarks |
| 2 (Tue) | Reddit r/nextjs + r/webdev | Vertical-narrow story |
| 3 (Wed) | LinkedIn | Compliance angle for engineering leaders |
| 4 (Thu) | GitHub Marketplace | Ensure listing is verified |
| 5 (Fri) | DM tour | 10 humans (list below) |
| 8 (Mon) | IndieHackers Marketplace | Business angle |
| 10 (Wed) | r/mcp + Builder Radar DM | MCP-specific angle |
| 14 (Sun) | X retrospective | Week 2 numbers, learnings |

## 📱 Platform: X / Twitter (launch thread, 5 tweets)

**T1 (hook + video)**
> This is a screenshot of my code review last week.
>
> The bot found 4 things my 2 human reviewers missed. Including an SSRF vector nobody would have caught until it was in prod.
>
> Meet armor-bot 🛡️
>
> [attach 15s video]

**T2 (why vertical)**
> Every existing PR reviewer is horizontal — every language, every stack.
>
> armor-bot is vertical: Next.js 16 + Vercel + Supabase + MCP.
>
> Every rule comes from a real production incident on this exact stack. Written by someone who got paged for it.

**T3 (the ruleset)**
> 52 rules across 6 rulesets:
>
> · vercel-armor · resilience (missing timeouts, circuit breakers)
> · mcp-armor · MCP security (SSRF, injection, token bloat)
> · next16 · framework gotchas (RLS leaks, edge/node mismatches)
> · supabase-rls · data (missing RLS, wrong policies)
> · skill-kit · Claude Skills (SKILL.md hygiene)
> · supply-chain · CVEs + deprecated deps

**T4 (mechanics)**
> How it works:
>
> 1. You install the GitHub App (free for public repos)
> 2. Every PR triggers a review — 3-8 seconds
> 3. Claude generates human-readable findings + code suggestions
> 4. High-severity findings block merge as `Request changes`
>
> No config needed. Sensible defaults.

**T5 (CTA)**
> Free forever for open source. $19/mo per private repo. $199/mo for teams (includes armor.dev).
>
> Install: [github.com/marketplace/armor-bot]
> Landing: [armor-bot.vercel.app]
> Source: [github.com/carlosfevernova/armor-bot]
>
> RTs pinned. First install gets a shoutout.

## 📱 Platform: Hacker News — Show HN

**Title:** Show HN: armor-bot – Claude-powered PR reviewer specifically for Next.js + Vercel + Supabase + MCP

**Body (under 200 words):**

I've been reviewing my own PRs for months and hitting the same 6 categories of miss:

1. Timeout missing on outbound fetch → cascades 504s in prod
2. `next/headers` imported at top of a file used by a client component → build breaks
3. Supabase service_role imported into the browser bundle → credential leak
4. MCP tool arg accepts free-form URLs → SSRF vector
5. RLS policy uses `auth.uid()` on a table without `user_id` column → silent empty results
6. `next@16.0.x` with open CVE

Every one of these is a real incident that shipped. Static analyzers don't catch them — they're runtime patterns.

`armor-bot` is a GitHub App that reviews every PR against 52 rules extracted from these incidents. Claude reads the diff, generates human explanations, and produces code diffs you can apply with a click. 3-8 seconds per PR.

Vertical, not horizontal. Every rule is anchored to a real failure mode on the Next.js + Vercel + Supabase + MCP stack.

Free forever for open source. $19/mo per private repo. Team tier includes armor.dev (SBOM + cost attribution).

Landing: https://armor-bot.vercel.app
Repo: https://github.com/carlosfevernova/armor-bot

Feedback on the ruleset especially welcome.

## 📱 Platform: Reddit r/nextjs

**Title:** [OSS + hosted] I built a Claude-powered PR reviewer that catches the Next 16 gotchas you keep missing

**Body:**

Kept hitting the same issues in code review:

- `next/headers` polluting the client bundle
- Server actions not marked `"use server"` and silently converting to client handlers
- Route handlers that use `cookies()` but forgot `dynamic = "force-dynamic"`
- Supabase service_role client leaking into the browser bundle
- CVEs in transitive deps

Wrote `armor-bot` — a GitHub App that reviews every PR against 9 Next 16-specific rules + 43 more across vercel-armor, mcp-armor, supabase, and supply-chain rulesets.

Claude reads the diff → generates the finding with a WHY explanation → produces a code diff you apply with one click.

3-8s per PR. Free for public repos.

- Landing: https://armor-bot.vercel.app
- Repo: https://github.com/carlosfevernova/armor-bot
- Install: https://github.com/marketplace/armor-bot

Rules live in the OSS libraries — happy to accept PRs for new patterns you're catching manually.

## 📱 Platform: LinkedIn — engineering leader angle

**Post:**

I shipped 4 open source libraries in the "armor family" over the last two weeks. Every one is now enforced by my newest tool, `armor-bot`.

armor-bot is a GitHub App that reviews every pull request in Next.js + Vercel + Supabase + MCP repositories. It uses Claude to read the diff, generate a human explanation of why an issue matters, and produce a code diff the developer can apply with one click.

52 rules across 6 rulesets. Each rule comes from a real production incident I lived through.

Why vertical? Because horizontal PR bots don't catch runtime patterns. They catch lint. armor-bot catches:
- Missing timeouts on outbound fetches (cascades 504s)
- MCP tools with SSRF gadgets (36.7% of public MCP servers have this)
- Supabase RLS policies referencing columns that don't exist (silent empty responses)
- CVEs in transitive deps
- Server actions that silently fall back to client handlers

Free for open source repositories. $19/mo per private repo. $199/mo for teams (includes armor.dev SBOM generation).

If you're an engineering leader shipping AI-adjacent applications on this stack, this is the layer that catches what your 4pm-Friday reviewer misses.

Landing: https://armor-bot.vercel.app
Install: github.com/marketplace/armor-bot

## 💬 10 humans to DM

1. **Boris Cherny** (Anthropic devrel) — "vertical reviewer for the Anthropic-native stack"
2. **Guillermo Rauch** (Vercel) — "the reviewer that enforces Vercel best practices"
3. **Kent C. Dodds** — Next.js educator, high-signal amplifier
4. **Marc Lou** (ShipFast) — solo founder solidarity
5. **Simon Willison** — MCP posts, high-signal amp
6. **Malte Ubl** (Vercel CTO) — technical validation
7. **Author of Builder Radar** — MCP-adjacent newsletter feature
8. **Ants Uunmaa** (Bytes newsletter) — JavaScript ecosystem newsletter
9. **Ram Rachum** (CodeRabbit founder) — competitive courtesy DM, may retweet
10. **Amir Salihefendić** (Doist / Todoist founder) — solo founder amplifier

## 📊 Metrics to hit by Day 14

- **200** waitlist signups
- **50** GitHub App installations
- **500** PR reviews delivered
- **1** paying customer
- **1,000** combined stars across armor-family repos
- **1** mention in a newsletter (Bytes, JS Weekly, Rundown AI, Builder Radar)

Miss all six → the story is wrong; pivot.
Hit 3+ → the story is right; double down on the winning channel.
Hit all 6 → hire a first paid marketer.
