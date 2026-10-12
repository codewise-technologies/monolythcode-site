import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import IsoScene from '../components/IsoScene'
import { SCENES } from '../data/scenes'
import { CtaBand, PageHero, SectionHead, usePageMeta } from '../components/blocks'
import { SERVICES } from '../data/services'
import { ENGAGEMENTS } from '../data/site'
import './Services.css'

export default function Services() {
  usePageMeta('Services', 'ERP systems, hotel management systems, Android and iOS apps, websites and custom software, designed, built and supported by Monolyth Code.')

  return (
    <>
      <PageHero
        trail={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        eyebrow="Services"
        title="Everything a growing business runs on."
        lede="From the system that keeps your books to the app in your customers' pockets, we design, build, connect and support the software at the core of your operations."
      >
        <Link to="/contact" className="btn btn-primary">Discuss your project <ArrowRight aria-hidden="true" /></Link>
      </PageHero>

      <nav className="svc-jump theme-dark" aria-label="Jump to a service">
        <div className="container">
          <ul role="list">
            {SERVICES.map((s) => (
              <li key={s.slug}><a href={`#${s.slug}`}>{s.name}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section theme-light">
        <div className="container svc-rows">
          {SERVICES.map((s, i) => (
            <article key={s.slug} id={s.slug} className={`svc-row${i % 2 ? ' is-flipped' : ''}`} aria-labelledby={`${s.slug}-title`}>
              <div className="svc-row-art theme-dark">
                <p className="svc-row-code mono">{s.rack}</p>
                <IsoScene items={SCENES[s.slug]} />
              </div>
              <div className="svc-row-copy">
                <h2 className="h2" id={`${s.slug}-title`}>{s.name}</h2>
                <p className="lede svc-row-lede">{s.summary}</p>
                <ul className="check-list svc-row-list">
                  {s.highlights.map((h) => (
                    <li key={h}><Check aria-hidden="true" /> <span>{h}</span></li>
                  ))}
                </ul>
                <ul role="list" className="svc-row-mods">
                  {s.modules.map((m) => <li key={m.code} className="mono">{m.name}</li>)}
                </ul>
                <div className="actions">
                  <Link to={`/services/${s.slug}`} className="btn btn-primary" aria-label={`View full details of ${s.lower}`}>
                    View full details <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link to={`/contact?service=${s.slug}`} className="btn btn-ghost" aria-label={`Discuss a ${s.noun} project`}>Discuss a project</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section theme-dark lattice" aria-labelledby="eng-title-2">
        <div className="container">
          <SectionHead id="eng-title-2" eyebrow="Engagement models" title="Choose the model that fits the work." />
          <ul role="list" className="eng-cols">
            {ENGAGEMENTS.map((e) => (
              <li key={e.name}>
                <h3 className="h3">{e.name}</h3>
                <p className="eng-cols-best mono">{e.best}</p>
                <ul role="list">{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Not sure which system you need?" text="Describe the problem rather than the solution. We will recommend the simplest system that solves it, even if that means a smaller project." />
    </>
  )
}
