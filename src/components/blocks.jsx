import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Plus } from 'lucide-react'
import { PROCESS, SITE } from '../data/site'
import IsoGlyph from './IsoGlyph'
import './blocks.css'

/** Sets the document title and meta description for a page. */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : `${SITE.name} — ERP, hotel systems, mobile apps & custom software`
    const meta = document.querySelector('meta[name="description"]')
    if (meta && description) meta.setAttribute('content', description)
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', SITE.url + window.location.pathname.replace(/\/$/, ''))
  }, [title, description])
}

export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView(); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol role="list">
        {trail.map((t, i) => (
          <li key={t.label}>
            {t.to && i < trail.length - 1 ? <Link to={t.to}>{t.label}</Link> : <span aria-current="page">{t.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Dark hero used by inner pages. */
export function PageHero({ trail, eyebrow, title, lede, children, glyph }) {
  return (
    <section className="phero theme-dark lattice">
      <div className={`container phero-grid${glyph ? ' has-glyph' : ''}`}>
        <div className="phero-copy">
          {trail && <Breadcrumbs trail={trail} />}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="h1 phero-title">{title}</h1>
          {lede && <p className="lede phero-lede">{lede}</p>}
          {children && <div className="actions phero-actions">{children}</div>}
        </div>
        {glyph && (
          <div className="phero-art" aria-hidden="true">
            <IsoGlyph boxes={glyph} />
          </div>
        )}
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, intro, align = 'left', id }) {
  return (
    <header className={`shead shead-${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h2" id={id}>{title}</h2>
      {intro && <p className="lede shead-intro">{intro}</p>}
    </header>
  )
}

/** The delivery process. It is a real sequence, so steps are numbered. */
export function Process({ compact = false }) {
  return (
    <ol role="list" className={`process${compact ? ' process-compact' : ''}`}>
      {PROCESS.map((p, i) => (
        <li key={p.step} className="process-step">
          <div className="process-marker" aria-hidden="true">
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3 className="h3">{p.step}</h3>
          <p className="process-text">{p.text}</p>
          <dl className="process-meta">
            <div><dt>Output</dt><dd>{p.output}</dd></div>
            <div><dt>Typical</dt><dd>{p.typical}</dd></div>
          </dl>
        </li>
      ))}
    </ol>
  )
}

export function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq-item">
          <summary>
            <span>{f.q}</span>
            <Plus aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}

export function CtaBand({ title = 'Tell us what needs to run better.', text, service }) {
  const to = service ? `/contact?service=${service}` : '/contact'
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <h2 className="h2 cta-title">{title}</h2>
          <p className="cta-text">
            {text || `A 30-minute call with an engineer is the fastest way to find out what your business needs. We reply within ${SITE.replyPromise}.`}
          </p>
        </div>
        <div className="actions cta-actions">
          <Link to={to} className="btn btn-white">Book a consultation <ArrowRight aria-hidden="true" /></Link>
          <a href={`mailto:${SITE.email}`} className="cta-mail">{SITE.email}</a>
        </div>
      </div>
    </section>
  )
}
