// Vercel serverless function: POST /api/contact
// Sends website enquiries to your inbox over SMTP.
// Configure in Vercel → Project → Settings → Environment Variables:
//   FORMSPREE_ENDPOINT (simplest), or SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, SMTP_FROM
//   TURNSTILE_SECRET_KEY (bot protection; pair with VITE_TURNSTILE_SITE_KEY)
import nodemailer from 'nodemailer'

const LIMITS = { name: 120, email: 200, company: 160, phone: 40, service: 80, timeline: 60, message: 5000 }
const SINGLE_LINE = ['name', 'email', 'company', 'phone', 'service', 'timeline']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MIN_FILL_MS = 3000

const clientIp = (req) => String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim() || undefined

async function verifyTurnstile(secret, token, ip) {
  if (!token || token.length > 2048) return false
  try {
    const form = new URLSearchParams({ secret, response: token })
    if (ip) form.set('remoteip', ip)
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
    const data = await r.json()
    return data.success === true
  } catch {
    return false // fail closed: if Cloudflare cannot be reached, do not send
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body || {}
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { return res.status(400).json({ error: 'Invalid request body' }) }
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (body.website) return res.status(200).json({ ok: true })

  // Timing: nobody types an enquiry in under 3 seconds. Pretend success, send nothing.
  const elapsed = Number(body.elapsed)
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return res.status(200).json({ ok: true })

  // Cloudflare Turnstile: verified server-side, so bots cannot skip it by posting directly.
  const { TURNSTILE_SECRET_KEY } = process.env
  if (TURNSTILE_SECRET_KEY) {
    const human = await verifyTurnstile(TURNSTILE_SECRET_KEY, String(body.token || ''), clientIp(req))
    if (!human) return res.status(403).json({ error: 'Security check failed' })
  }

  const v = {}
  for (const [key, max] of Object.entries(LIMITS)) {
    let val = String(body[key] ?? '').trim().slice(0, max)
    if (SINGLE_LINE.includes(key)) val = val.replace(/[\r\n\t]+/g, ' ') // block header injection
    v[key] = val
  }

  const errors = {}
  if (!v.name) errors.name = 'Name is required'
  if (!EMAIL_RE.test(v.email)) errors.email = 'A valid email is required'
  if (v.message.length < 20) errors.message = 'Message is too short'
  if (Object.keys(errors).length) return res.status(422).json({ error: 'Validation failed', fields: errors })

  const subject = `New enquiry: ${v.service || 'General'} from ${v.name}${v.company ? ` (${v.company})` : ''}`

  // Formspree: delivers the enquiry to the inbox set in the Formspree dashboard.
  // Called from here (not the browser) so the endpoint stays private and the checks above cannot be skipped.
  const { FORMSPREE_ENDPOINT } = process.env
  if (FORMSPREE_ENDPOINT) {
    if (!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(FORMSPREE_ENDPOINT)) {
      console.error('Contact form: FORMSPREE_ENDPOINT should look like https://formspree.io/f/abc123')
      return res.status(503).json({ error: 'Email delivery is not configured' })
    }
    try {
      const r = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: 'https://www.monolythcode.com/contact' },
        body: JSON.stringify({
          name: v.name,
          email: v.email, // Formspree uses this as Reply-To
          company: v.company || '-',
          phone: v.phone || '-',
          service: v.service || 'Not sure yet',
          timeline: v.timeline || '-',
          message: v.message,
          _subject: subject,
        }),
      })
      if (!r.ok) {
        console.error('Contact form: Formspree rejected the submission', r.status, (await r.text()).slice(0, 300))
        return res.status(502).json({ error: 'Email could not be sent' })
      }
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('Contact form: Formspree unreachable', err?.message)
      return res.status(502).json({ error: 'Email could not be sent' })
    }
  }

  const { SMTP_HOST, SMTP_PORT = '465', SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO } = process.env
  // SMTP_FROM is needed when the login is not an email address (e.g. Resend uses "resend")
  const fromAddress = SMTP_FROM || SMTP_USER
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_RE.test(fromAddress)) {
    console.error('Contact form: SMTP environment variables are missing, or SMTP_FROM is not an email address')
    return res.status(503).json({ error: 'Email delivery is not configured' })
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const text = [
    `Name:      ${v.name}`,
    `Email:     ${v.email}`,
    `Company:   ${v.company || '-'}`,
    `Phone:     ${v.phone || '-'}`,
    `Service:   ${v.service || 'Not sure yet'}`,
    `Timeline:  ${v.timeline || '-'}`,
    '',
    v.message,
    '',
    'Sent from the contact form on monolythcode.com',
  ].join('\n')

  try {
    await transporter.sendMail({
      from: { name: 'Monolyth Code website', address: fromAddress },
      to: CONTACT_TO || fromAddress,
      replyTo: { name: v.name, address: v.email },
      subject,
      text,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact form: send failed', err?.message)
    return res.status(502).json({ error: 'Email could not be sent' })
  }
}
