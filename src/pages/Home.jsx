import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import IsoRack from '../components/IsoRack'
import IsoGlyph from '../components/IsoGlyph'
import { CtaBand, Process, SectionHead, usePageMeta } from '../components/blocks'
import { SERVICES } from '../data/services'
import { ENGAGEMENTS, INDUSTRIES, SITE, STANDARDS, TECH } from '../data/site'
import './Home.css'

export default function Home() {
  usePageMeta(null, 'Monolyth Code designs and builds ERP systems, hotel management systems, Android and iOS apps, websites and custom software for growing businesses.')

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero theme-dark lattice">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{SITE.tagline}</p>
            <h1 className="display hero-title">
              Business software, engineered to <span className="accent-word">stand.</span>
            </h1>
            <p className="lede hero-lede">
              Monolyth Code designs and builds ERP platforms, hotel management systems, mobile apps, websites and
              custom software — integrated with each other, secured from the first commit, and owned by you.
            </p>
            <div className="actions hero-actions">
              <Link to="/contact" className="btn btn-primary">Book a consultation <ArrowRight aria-hidden="true" /></Link>
              <Link to="/services" className="btn btn-ghost">Explore services</Link>
            </div>
            <dl className="hero-facts">
              <div><dt>Based in</dt><dd>{SITE.location}</dd></div>
              <div><dt>Working with</dt><dd>Local & international clients</dd></div>
              <div><dt>You receive</dt><dd>Full source code & IP</dd></div>
            </dl>
          </div>
          <div className="hero-rack">
            <IsoRack />
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section theme-light" aria-labelledby="svc-title">
        <div className="container">
          <SectionHead
            id="svc-title"
            eyebrow="What we build"
            title="Five disciplines. One engineering standard."
            intro="Each service stands on its own — and every system we build is designed to connect with the others, so your business runs on one source of truth."
          />
          <ul role="list" className="svc-grid">
            {SERVICES.map((s, i) => (
              <li key={s.slug} className={`svc-card${i < 2 ? ' svc-card-wide' : ''}`}>
                <div className="svc-card-art"><IsoGlyph boxes={s.glyph} /></div>
                <p className="svc-card-code mono">{s.rack}</p>
                <h3 className="h3">
                  <Link to={`/services/${s.slug}`} className="svc-card-link">{s.name}</Link>
                </h3>
                <p className="svc-card-text">{i < 2 ? s.summary : s.short}</p>
                <p className="svc-card-modules mono">
                  {s.modules.slice(0, i < 2 ? 5 : 3).map((m) => m.name.split(' &')[0]).join(' · ')}
                </p>
                <span className="svc-card-more" aria-hidden="true">Explore <ArrowRight /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="section theme-dark lattice" aria-labelledby="process-title">
        <div className="container">
          <SectionHead
            id="process-title"
            eyebrow="How we deliver"
            title="A clear path from first call to a system your team relies on."
            intro="No black boxes. Every phase has a defined output you review and approve before we move on."
          />
          <Process />
        </div>
      </section>

      {/* ---------- Standards ---------- */}
      <section className="section theme-light" aria-labelledby="std-title">
        <div className="container std-layout">
          <SectionHead
            id="std-title"
            eyebrow="How we engineer"
            title="Commitments you can hold us to."
            intro="These are written into every proposal we send — not just this page."
          />
          <ul role="list" className="std-grid">
            {STANDARDS.map((s) => (
              <li key={s.title} className="std-item">
                <span className="std-cube" aria-hidden="true" />
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Industries + technology ---------- */}
      <section className="section theme-light theme-paper" aria-labelledby="ind-title">
        <div className="container ind-layout">
          <div>
            <SectionHead
              id="ind-title"
              eyebrow="Who we work with"
              title="Built for the businesses that keep the economy moving."
            />
            <ul role="list" className="ind-list">
              {INDUSTRIES.map((x) => (
                <li key={x.name}>
                  <span className="ind-name">{x.name}</span>
                  <span className="ind-text">{x.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="tech-panel theme-dark" aria-labelledby="tech-title">
            <p className="eyebrow" id="tech-title">Technology we work with</p>
            <ul role="list" className="tech-list">
              {TECH.map((t) => <li key={t} className="mono">{t}</li>)}
            </ul>
            <p className="tech-note">
              We choose proven, well-supported technology your future team can hire for — not whatever is fashionable this year.
            </p>
          </aside>
        </div>
      </section>

      {/* ---------- Engagement models ---------- */}
      <section className="section theme-dark" aria-labelledby="eng-title">
        <div className="container">
          <SectionHead
            id="eng-title"
            eyebrow="Ways to work with us"
            title="Choose the model that fits the work."
          />
          <ul role="list" className="eng-grid">
            {ENGAGEMENTS.map((e) => (
              <li key={e.name} className="eng-card">
                <h3 className="h3">{e.name}</h3>
                <p className="eng-best">{e.best}</p>
                <ul role="list" className="eng-points">
                  {e.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
