import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ExternalLink } from 'lucide-react'
import IsoGlyph from '../components/IsoGlyph'
import { CtaBand, Faq, PageHero, Process, SectionHead, usePageMeta } from '../components/blocks'
import { SERVICES, serviceBySlug } from '../data/services'
import { SITE } from '../data/site'
import './ServiceDetail.css'

export default function ServiceDetail() {
  const { slug } = useParams()
  const s = serviceBySlug(slug)
  usePageMeta(s?.name, s?.summary)
  if (!s) return <Navigate to="/services" replace />

  const others = SERVICES.filter((x) => x.slug !== s.slug)
  const showDemo = s.slug === 'erp-systems' && SITE.erpDemoUrl

  return (
    <>
      <PageHero
        trail={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: s.name }]}
        eyebrow={s.name}
        title={s.title}
        lede={s.summary}
        glyph={s.glyph}
      >
        <Link to={`/contact?service=${s.slug}`} className="btn btn-primary">Discuss your project <ArrowRight aria-hidden="true" /></Link>
        {showDemo
          ? <a href={SITE.erpDemoUrl} className="btn btn-ghost" target="_blank" rel="noreferrer">Try the live ERP demo <ExternalLink aria-hidden="true" /></a>
          : <a href="#modules" className="btn btn-ghost">What's included</a>}
      </PageHero>

      {/* Who it's for */}
      <section className="section theme-light" aria-labelledby="fit-title">
        <div className="container sd-split">
          <SectionHead id="fit-title" eyebrow="Who it's for" title="Built for organisations like these." />
          <ul className="check-list sd-fit">
            {s.audience.map((a) => <li key={a}><Check aria-hidden="true" /> <span>{a}</span></li>)}
          </ul>
        </div>
      </section>

      {/* Spec sheet */}
      <section id="modules" className="section theme-light theme-paper" aria-labelledby="spec-title">
        <div className="container">
          <SectionHead
            id="spec-title"
            eyebrow="What's included"
            title="Specification."
            intro="Every engagement is scoped to your needs. These are the components we typically design and deliver."
          />
          <div className="spec" role="table" aria-label={`${s.name} components`}>
            <div className="spec-head" role="row">
              <span role="columnheader">Ref</span>
              <span role="columnheader">Component</span>
              <span role="columnheader">What it covers</span>
            </div>
            {s.modules.map((m) => (
              <div className="spec-row" role="row" key={m.code}>
                <span role="cell" className="spec-code mono">{m.code}</span>
                <span role="cell" className="spec-name">{m.name}</span>
                <span role="cell" className="spec-text">{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards + integrations */}
      <section className="section theme-dark lattice" aria-labelledby="std-title-sd">
        <div className="container sd-dual">
          <div>
            <p className="eyebrow">Built in as standard</p>
            <h2 className="h2 sd-dual-title" id="std-title-sd">Ready for real operations.</h2>
            <ul className="check-list sd-dual-list">
              {s.highlights.map((h) => <li key={h}><Check aria-hidden="true" /> <span>{h}</span></li>)}
            </ul>
          </div>
          <div className="sd-int">
            <p className="eyebrow">Connects with</p>
            <ul role="list" className="sd-int-grid">
              {s.integrations.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <p className="sd-int-note">Need a connection that is not listed? If it has an API, file export or database, we can usually integrate it.</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section theme-light" aria-labelledby="proc-title-sd">
        <div className="container">
          <SectionHead id="proc-title-sd" eyebrow="Delivery" title="How the project runs." />
          <Process />
        </div>
      </section>

      {/* FAQ */}
      <section className="section theme-light theme-paper" aria-labelledby="faq-title">
        <div className="container sd-split">
          <SectionHead id="faq-title" eyebrow="Questions" title="What clients ask before starting." />
          <Faq items={s.faqs} />
        </div>
      </section>

      {/* Related */}
      <section className="section-tight theme-light" aria-labelledby="rel-title">
        <div className="container">
          <h2 className="eyebrow sd-rel-title" id="rel-title">Other services</h2>
          <ul role="list" className="sd-rel">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/services/${o.slug}`} className="sd-rel-card">
                  <span className="sd-rel-art"><IsoGlyph boxes={o.glyph} /></span>
                  <span className="sd-rel-name">{o.name}</span>
                  <span className="sd-rel-text">{o.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand service={s.slug} title={`Let's scope your ${s.noun}.`} />
    </>
  )
}
