# monolythcode.com

Company website for **Monolyth Code**: React 18 + Vite + React Router, deployed on Vercel.

## Pages
| Route | Page |
|---|---|
| `/` | Home: interactive module-rack hero, services, delivery process, standards, industries, engagement models |
| `/services` | Services overview with jump navigation |
| `/services/:slug` | Detail page for each service: who it's for, specification table, integrations, process, FAQ |
| `/about` | Story, roots, principles, how we work |
| `/contact` | Enquiry form (pre-selects the service when linked as `?service=erp-systems`) |
| `*` | 404 page |

## Edit content without touching layout
- **`src/data/site.js`**: company email, phone, location, hours, ERP demo link, social links, process, standards, industries, technology list.
- **`src/data/services.js`**: all five services (names, copy, modules, integrations, FAQs and the isometric glyph shapes). Home, Services, detail pages, menus, footer and the contact form are all generated from this file.

## Run locally
```bash
npm install
npm run dev          # http://localhost:5173
```
The contact form posts to `/api/contact`, a Vercel serverless function. It only runs on Vercel, or locally with `npx vercel dev`. Under `npm run dev` the form shows its "email us directly" fallback.

## Deploy
Push to `main`. Vercel builds automatically using `vercel.json`. That file also sets:
- SPA rewrites (every route serves `index.html`; `/api/*` is excluded)
- Security headers: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- Long-term caching for hashed assets

## Contact form email (one-time setup)
In Vercel, go to **Project → Settings → Environment Variables**, add the variables for one option below, then redeploy.

**Current setup: Formspree.** Add one variable, `FORMSPREE_ENDPOINT` = the form's endpoint (e.g. `https://formspree.io/f/abc123`). The recipient inbox is set in Formspree under the form's **Settings**. The endpoint is only used server-side by `api/contact.js`, so the bot checks cannot be bypassed. When this variable is set, the SMTP variables are ignored.

**Option A: Resend (works with Zoho's free plan, recommended).** Zoho's Forever Free plan does not allow SMTP logins (Zoho answers `554 5.7.8 Access Restricted`), so a sending service delivers the enquiry into your Zoho inbox instead. Create a free Resend account, add the domain `monolythcode.com`, add the DNS records it shows in Cloudflare (DNS only), wait for **Verified**, then create an API key with **Sending access**.

| Name | Value |
|---|---|
| `SMTP_HOST` | `smtp.resend.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `resend` |
| `SMTP_PASS` | The Resend API key (Secret type) |
| `SMTP_FROM` | `website@monolythcode.com` (any address on the verified domain) |
| `CONTACT_TO` | The Zoho inbox that should receive enquiries |

**Option B: Zoho SMTP (paid Zoho plan only).** Copy the server from Zoho Mail → Settings → Mail Accounts → SMTP (`smtppro.zoho.com` for paid organisation accounts; `.in` / `.eu` for India / EU data centres).

| Name | Value |
|---|---|
| `SMTP_HOST` | `smtppro.zoho.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `hello@monolythcode.com` |
| `SMTP_PASS` | An **app-specific password** generated while signed in as that user |
| `CONTACT_TO` | The inbox that should receive enquiries |

`SMTP_FROM` is optional when `SMTP_USER` is itself an email address. Every enquiry has the visitor as **Reply-To**, so pressing Reply answers them directly.

The endpoint validates input, limits field lengths, strips line breaks from header fields (to prevent header injection), and silently discards bots that fill the hidden honeypot field or submit in under 3 seconds.

### Bot protection (Cloudflare Turnstile)
In the Cloudflare dashboard open **Turnstile → Add widget**, add the hostnames `monolythcode.com` and `www.monolythcode.com`, choose **Managed** mode, then add both keys in Vercel and redeploy:

| Name | Value |
|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Site key (public, used at build time) |
| `TURNSTILE_SECRET_KEY` | Secret key (Secret type) |

Set both or neither. With only the secret set, every enquiry is rejected because the form cannot produce a token.

## Structure
```
api/contact.js          serverless email endpoint
public/                 favicons, logo SVGs, og-image, robots.txt, sitemap.xml
src/data/               editable content
src/lib/iso.js          isometric projection maths (matches the logo)
src/components/         Header (mega menu + mobile drawer), Footer, IsoRack, IsoGlyph, shared blocks
src/pages/              Home, Services, ServiceDetail, About, Contact, NotFound
src/styles/             design tokens + base styles
```
