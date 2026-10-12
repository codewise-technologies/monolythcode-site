// Vercel serverless function: POST /api/contact
// Sends website enquiries to your inbox over SMTP.
// Configure in Vercel → Project → Settings → Environment Variables:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO
import nodemailer from 'nodemailer'

const LIMITS = { name: 120, email: 200, company: 160, phone: 40, service: 80, timeline: 60, message: 5000 }
const SINGLE_LINE = ['name', 'email', 'company', 'phone', 'service', 'timeline']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

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

  const { SMTP_HOST, SMTP_PORT = '465', SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Contact form: SMTP environment variables are not set')
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
    `Company:   ${v.company || '—'}`,
    `Phone:     ${v.phone || '—'}`,
    `Service:   ${v.service || 'Not sure yet'}`,
    `Timeline:  ${v.timeline || '—'}`,
    '',
    v.message,
    '',
    '— Sent from the contact form on monolythcode.com',
  ].join('\n')

  try {
    await transporter.sendMail({
      from: { name: 'Monolyth Code website', address: SMTP_USER },
      to: CONTACT_TO || SMTP_USER,
      replyTo: { name: v.name, address: v.email },
      subject: `New enquiry: ${v.service || 'General'} — ${v.name}${v.company ? ` (${v.company})` : ''}`,
      text,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact form: send failed', err?.message)
    return res.status(502).json({ error: 'Email could not be sent' })
  }
}
