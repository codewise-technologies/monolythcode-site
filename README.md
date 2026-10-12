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
In Vercel, go to **Project → Settings → Environment Variables** and add:

| Name | Example |
|---|---|
| `SMTP_HOST` | `smtppro.zoho.com` (Zoho organisation mailboxes; use `.in` / `.eu` if your Zoho data centre is India / EU) |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `hello@monolythcode.com` |
| `SMTP_PASS` | An **app-specific password** from Zoho (required when 2FA is on) |
| `CONTACT_TO` | The inbox that should receive enquiries |

Redeploy after adding them. If your Zoho plan does not allow SMTP access, use any transactional email provider's SMTP credentials instead. Only these variables change.

The endpoint validates input, limits field lengths, strips line breaks from header fields (to prevent header injection), and silently discards bots that fill the hidden honeypot field.

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
