import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Globe, Mail, Phone } from 'lucide-react'
import { PageHero, usePageMeta } from '../components/blocks'
import Turnstile from '../components/Turnstile'
import { SERVICES } from '../data/services'
import { SITE } from '../data/site'
import './Contact.css'

const TIMELINES = ['As soon as possible', 'Within 3 months', 'Just exploring options']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Cloudflare Turnstile public site key, set in Vercel as VITE_TURNSTILE_SITE_KEY. No key = no widget.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

const NEXT = [
  { t: 'We reply', d: `An engineer reads your message and replies within ${SITE.replyPromise}.` },
  { t: 'Discovery call', d: 'A 30-minute call to understand your goals, constraints and current systems.' },
  { t: 'Written proposal', d: 'A scope document with milestones, timeline and a fixed quote. No obligation.' },
]

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Enter your name.'
  if (!v.email.trim()) e.email = 'Enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter an email address like name@company.com.'
  if (v.message.trim().length < 20) e.message = 'Tell us a little more (at least 20 characters).'
  return e
}

export default function Contact() {
  usePageMeta('Contact', `Talk to Monolyth Code about your ERP, hotel management, mobile app, website or custom software project. We reply within ${SITE.replyPromise}.`)
  const [params] = useSearchParams()
  const preset = SERVICES.find((s) => s.slug === params.get('service'))?.name || ''

  const [values, setValues] = useState({ name: '', email: '', company: '', phone: '', service: preset, timeline: '', message: '', website: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed | verify | captcha
  const [token, setToken] = useState('')
  const [resetSignal, setResetSignal] = useState(0)
  const startedAt = useRef(Date.now())

  const set = (k) => (ev) => {
    setValues((v) => ({ ...v, [k]: ev.target.value }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate(values)
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus()
      return
    }
    if (TURNSTILE_SITE_KEY && !token) {
      setStatus('verify')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, token, elapsed: Date.now() - startedAt.current }),
      })
      if (res.status === 403) {
        setStatus('captcha')
      } else if (!res.ok) {
        throw new Error(String(res.status))
      } else {
        setStatus('sent')
        return
      }
    } catch {
      setStatus('failed')
    }
    // a Turnstile token works once, so get a fresh one before the next attempt
    setToken('')
    setResetSignal((n) => n + 1)
  }

  const field = (k, label, props = {}, optional = false) => (
    <div className={`field${errors[k] ? ' has-error' : ''}`}>
      <label htmlFor={`f-${k}`}>{label}{optional && <span className="field-opt"> (optional)</span>}</label>
      <input
        id={`f-${k}`}
        value={values[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? 'true' : undefined}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        {...props}
      />
      {errors[k] && <p className="field-error" id={`e-${k}`}><AlertCircle aria-hidden="true" /> {errors[k]}</p>}
    </div>
  )

  return (
    <>
      <PageHero
        trail={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Contact"
        title="Tell us what needs to run better."
        lede={`Share a few details about your project. An engineer, not a sales script, will reply within ${SITE.replyPromise}.`}
      />

      <section className="section theme-light">
        <div className="container ct-layout">
          <div className="ct-form-wrap">
            {status === 'sent' ? (
              <div className="ct-done" role="status">
                <CheckCircle2 aria-hidden="true" />
                <h2 className="h3">Enquiry sent.</h2>
                <p>Thank you, {values.name.split(' ')[0]}. We will reply to <strong>{values.email}</strong> within {SITE.replyPromise}.</p>
              </div>
            ) : (
              <form className="ct-form" onSubmit={onSubmit} noValidate>
                <h2 className="h3 ct-form-title">Project enquiry</h2>
                <div className="ct-row">
                  {field('name', 'Full name', { autoComplete: 'name', required: true })}
                  {field('email', 'Work email', { type: 'email', autoComplete: 'email', required: true })}
                </div>
                <div className="ct-row">
                  {field('company', 'Company', { autoComplete: 'organization' }, true)}
                  {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' }, true)}
                </div>
                <div className="ct-row">
                  <div className="field">
                    <label htmlFor="f-service">Service</label>
                    <select id="f-service" value={values.service} onChange={set('service')}>
                      <option value="">Not sure yet</option>
                      {SERVICES.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="f-timeline">Timeline<span className="field-opt"> (optional)</span></label>
                    <select id="f-timeline" value={values.timeline} onChange={set('timeline')}>
                      <option value="">Select a timeline</option>
                      {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className={`field${errors.message ? ' has-error' : ''}`}>
                  <label htmlFor="f-message">What do you need?</label>
                  <textarea
                    id="f-message"
                    rows={6}
                    value={values.message}
                    onChange={set('message')}
                    placeholder="For example: we run three branches on spreadsheets and need stock and sales in one system."
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby={errors.message ? 'e-message' : undefined}
                  />
                  {errors.message && <p className="field-error" id="e-message"><AlertCircle aria-hidden="true" /> {errors.message}</p>}
                </div>
                {/* spam trap: hidden from people, filled by bots */}
                <div className="ct-hp" aria-hidden="true">
                  <label htmlFor="f-website">Website</label>
                  <input id="f-website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
                </div>
                {TURNSTILE_SITE_KEY && (
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onToken={(t) => { setToken(t); if (status === 'verify') setStatus('idle') }}
                    onExpire={() => setToken('')}
                    onError={() => setToken('')}
                    resetSignal={resetSignal}
                  />
                )}
                {status === 'verify' && (
                  <p className="ct-fail" role="alert">
                    <AlertCircle aria-hidden="true" />
                    <span>Complete the security check above, then select Send enquiry.</span>
                  </p>
                )}
                {status === 'captcha' && (
                  <p className="ct-fail" role="alert">
                    <AlertCircle aria-hidden="true" />
                    <span>The security check did not pass. Complete it again, then select Send enquiry.</span>
                  </p>
                )}
                {status === 'failed' && (
                  <p className="ct-fail" role="alert">
                    <AlertCircle aria-hidden="true" />
                    <span>Your enquiry was not sent because the form service is unavailable. Email us directly at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</span>
                  </p>
                )}
                <div className="ct-submit">
                  <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : <>Send enquiry <ArrowRight aria-hidden="true" /></>}
                  </button>
                  <p className="ct-privacy">We only use these details to reply to your enquiry.{TURNSTILE_SITE_KEY && ' Protected by Cloudflare Turnstile.'}</p>
                </div>
              </form>
            )}
          </div>

          <aside className="ct-aside" aria-label="What happens next and direct contact">
            <div className="ct-card theme-dark">
              <p className="eyebrow">What happens next</p>
              <ol role="list" className="ct-next">
                {NEXT.map((n, i) => (
                  <li key={n.t}>
                    <span className="ct-next-n mono">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="ct-next-t">{n.t}</p>
                      <p className="ct-next-d">{n.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <ul role="list" className="ct-direct">
              <li><Mail aria-hidden="true" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              {SITE.phone && <li><Phone aria-hidden="true" /><a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a></li>}
              <li><Globe aria-hidden="true" /><span>{SITE.serving}</span></li>
              <li><Clock aria-hidden="true" /><span>{SITE.hours}</span></li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
