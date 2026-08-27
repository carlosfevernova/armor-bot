# armor-bot — setup checklist

Getting from repo-clone to running production requires 3 external accounts. Total time: ~40 minutes.

## ✅ Ya listo tras la sesión de shipping

- Landing pública compilando
- GitHub App webhook + Claude analyzer + rulesets
- Supabase schema para persistir installations + reviews
- Public stats view para la dashboard

## 🔧 Paso 1 — Crear el GitHub App (10 min)

1. Ve a https://github.com/settings/apps/new
2. **GitHub App name:** `armor-bot`
3. **Homepage URL:** `https://armor-bot.vercel.app` (o tu dominio custom)
4. **Webhook:** ✅ Active
5. **Webhook URL:** `https://armor-bot.vercel.app/api/webhooks/github`
6. **Webhook secret:** genera 32 chars random (`openssl rand -hex 16`), guardalo → será `GITHUB_WEBHOOK_SECRET`
7. **Repository permissions:**
   - Pull requests: **Read & write**
   - Contents: **Read**
   - Metadata: **Read** (auto)
8. **Subscribe to events:**
   - ✅ Pull request
   - ✅ Installation
   - ✅ Installation repositories
9. **Where can this GitHub App be installed?** Any account
10. Guardá y copiá:
    - **App ID** (arriba en la settings page) → `GITHUB_APP_ID`
    - **Private key** — click "Generate a private key" → descarga `.pem` → copialo entero → `GITHUB_APP_PRIVATE_KEY` (con `\n` literales para env vars)

## 🔧 Paso 2 — Supabase (5 min)

Ya tenés el patrón de armor.dev — usar mismo project si querés o crear nuevo.

1. Supabase dashboard → New project (o reusar existente)
2. SQL Editor → paste `supabase-schema.sql` → Run (confirmar el modal "destructive")
3. Settings → API Keys → copiá el publishable + secret keys

## 🔧 Paso 3 — Google AI Studio API key (2 min · GRATIS · sin tarjeta)

Usamos **Gemini 3.7 Flash** para las reviews. Free tier: 1500 requests/día + 1M tokens/día — más que suficiente para el MVP.

1. https://aistudio.google.com/app/apikey
2. Sign in con cuenta Google
3. **"Create API key"** → seleccioná un proyecto existente o "Create new project"
4. Copiá el key (empieza con `AIza...`) → será `GOOGLE_AI_API_KEY`

Si al futuro querés swap a Claude o GPT-5 para mejor calidad, dejamos preparado el toggle en v0.2.

## 🔧 Paso 4 — Deploy a Vercel (5 min)

```bash
cd C:\Users\carlo\Desktop\armor-bot
vercel --prod --yes --scope tequilera-barranca-s-projects
```

Después agregá todas las env vars via `vercel env add` (o dashboard):

```bash
printf "1234567" | vercel env add GITHUB_APP_ID production --scope tequilera-barranca-s-projects
printf "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----" | vercel env add GITHUB_APP_PRIVATE_KEY production --scope tequilera-barranca-s-projects
printf "your-webhook-secret" | vercel env add GITHUB_WEBHOOK_SECRET production --scope tequilera-barranca-s-projects
printf "AIza-xxxx" | vercel env add GOOGLE_AI_API_KEY production --scope tequilera-barranca-s-projects
printf "https://xxx.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --scope tequilera-barranca-s-projects
printf "sb_publishable_xxx" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --scope tequilera-barranca-s-projects
printf "sb_secret_xxx" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --scope tequilera-barranca-s-projects
printf "https://armor-bot.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production --scope tequilera-barranca-s-projects

# Redeploy after env vars set
vercel --prod --yes --scope tequilera-barranca-s-projects
```

## 🔧 Paso 5 — GitHub Marketplace listing (opcional, 15 min)

- https://github.com/settings/apps/armor-bot/marketplace-listing → apply
- Requires GitHub verification (email/phone), listing description, screenshots
- Once verified, the "Install" button en tu landing va a llevar directo al marketplace
- Free tier requires Marketplace approval; paid tiers can go live immediately

## 🔧 Paso 6 — Test end-to-end (10 min)

1. Instalá tu app en un repo de prueba tuyo (Settings → Applications → Install)
2. Creá un PR con un cambio problemático a propósito (agrega `fetch('http://api.slow.io')` sin timeout)
3. Verificá que:
   - GitHub muestra "armor-bot is reviewing..." en el PR
   - En 3-8s aparecen los inline comments
   - Supabase muestra la row en `reviews`
   - `/dashboard` muestra installations=1, reviews=1

## 🎨 Custom domain (opcional, ~$35/año)

- Vercel Domains → Buy `armor-bot.dev` (o el que quieras)
- Assign a project `armor-bot`
- Update `NEXT_PUBLIC_APP_URL` y el webhook URL del GitHub App

## 🚀 Marketing launch

Todo el playbook en `MARKETING.md`. Cronograma sugerido:
- Día 0 (Dom): X thread con 15s screencast
- Día 1 (Lun): Show HN
- Día 2 (Mar): r/nextjs + r/webdev
- Día 3 (Mié): LinkedIn
- Días 4-14: seguí el plan
