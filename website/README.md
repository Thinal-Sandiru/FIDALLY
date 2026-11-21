# FIDALLY Landing Page

Live site: https://myfidally.com (Cloudflare Pages)

## Structure
    public/                  the website (index.html, css, js, images)
    functions/api/waitlist.js  POST /api/waitlist on Cloudflare (stores emails in KV)
    functions/api/health.js    GET /api/health on Cloudflare
    server.js + mailer.js    local Node/Express version (optional)

## Deploy on Cloudflare Pages (Git)
1. Push this folder to GitHub.
2. Cloudflare -> Workers & Pages -> Create -> Pages -> Connect to Git -> pick the repo.
3. Build settings: Framework preset = None, Build command = (empty), Build output directory = `public`.
4. Deploy. The `functions/` folder is picked up automatically.
5. Storage -> KV -> create namespace `fidally-waitlist`.
6. Pages project -> Settings -> Bindings -> Add -> KV namespace:
   variable name `WAITLIST`, namespace `fidally-waitlist`. Then redeploy.
7. Pages project -> Custom domains -> add `myfidally.com` and `www.myfidally.com`.

Every push to the main branch redeploys the site.

## Welcome emails (optional)
Gmail/nodemailer does not run on Cloudflare, so emails go through Resend (resend.com, free tier).
1. Sign up at resend.com, add the domain `myfidally.com` and add the DNS records it shows in Cloudflare DNS.
2. Create an API key.
3. Pages project -> Settings -> Variables and Secrets:
   - `RESEND_API_KEY` (type: Secret) = your key
   - `MAIL_FROM` = `FIDALLY <hello@myfidally.com>`
4. Redeploy.
Without RESEND_API_KEY, signups still work; only the email is skipped.

## Viewing the waitlist
Storage -> KV -> fidally-waitlist -> each key is `email:<address>`.

## Run locally (Express)
    npm install
    npm start
Open http://localhost:3000. Copy `.env.example` to `.env` for Gmail emails.
Never commit `.env` or `data/waitlist.json`.
