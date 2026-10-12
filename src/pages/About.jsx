import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CtaBand, PageHero, Process, SectionHead, usePageMeta } from '../components/blocks'
import Terminal from '../components/Terminal'
import './About.css'

const PRINCIPLES = [
  { title: 'Clarity over jargon', text: 'You will always know what we are building, why, what it costs and where it stands, in plain language.' },
  { title: 'Solid before shiny', text: 'Reliability, security and maintainability come first. Visual polish matters, but never at the expense of a system that works.' },
  { title: 'Your system, your ownership', text: 'Code, data and documentation belong to you. We earn continued work by being useful, not by locking you in.' },
  { title: 'Partners for the long run', text: 'Software lives for years after launch. We design for the people who will run and extend it, including your future team.' },
]

const ROOTS = [
  { k: 'Uptime', v: 'We design for monitoring, backups and recovery before the first screen.' },
  { k: 'Access', v: 'Roles, permissions and audit trails are part of the data model, not an afterthought.' },
  { k: 'Upkeep', v: 'Clean architecture and documentation keep the cost of change low for years.' },
]

export default function About() {
  usePageMeta('About us', 'Monolyth Code is a software engineering company building ERP, hotel management, mobile, web and custom systems with roots in infrastructure and security engineering.')

  return (
    <>
      <PageHero
        trail={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        eyebrow="About Monolyth Code"
        title="An engineering company for businesses that need software to simply work."
        lede="We build the systems organisations run on, and we stay accountable for them long after launch."
        art={<Terminal />}
      />

      {/* Name & story */}
      <section className="section theme-light" aria-labelledby="story-title">
        <div className="container ab-story">
          <div className="ab-quote">
            <p className="eyebrow">Why "Monolyth"</p>
            <h2 className="h2" id="story-title">
              A monolith is a single, solid block that stands for centuries.
            </h2>
          </div>
          <div className="ab-story-text">
            <p className="body-text">
              Most businesses do not suffer from a lack of software. They suffer from too much of it: an accounting
              package here, a spreadsheet there, a booking tool that does not talk to either. Every gap between those
              systems is filled with manual work, re-keyed data and numbers nobody fully trusts.
            </p>
            <p className="body-text">
              We started Monolyth Code to build the opposite: one dependable system, engineered as a whole, that a
              business can stand on for years.
            </p>
            <p className="body-text">
              Today we design and build ERP platforms, hotel management systems, mobile apps, websites and custom software
              for clients around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Roots */}
      <section className="section theme-dark lattice" aria-labelledby="roots-title">
        <div className="container ab-roots">
          <div>
            <p className="eyebrow">Where we come from</p>
            <h2 className="h2 ab-roots-title" id="roots-title">Our roots are in infrastructure and security.</h2>
            <p className="lede">
              Before writing business software, our engineering background was in keeping networks, servers, firewalls
              and endpoints running for organisations every day. That shapes how we build: we think about what happens
              at 2 a.m. when something fails, not just how the demo looks.
            </p>
          </div>
          <dl className="ab-roots-list">
            {ROOTS.map((r) => (
              <div key={r.k}>
                <dt className="mono">{r.k}</dt>
                <dd>{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Principles */}
      <section className="section theme-light theme-paper" aria-labelledby="pr-title">
        <div className="container">
          <SectionHead id="pr-title" eyebrow="Principles" title="How we make decisions." />
          <ul role="list" className="ab-principles">
            {PRINCIPLES.map((p) => (
              <li key={p.title}>
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section theme-light" aria-labelledby="ab-proc-title">
        <div className="container">
          <SectionHead
            id="ab-proc-title"
            eyebrow="Working with us"
            title="One team, one point of contact, no surprises."
            intro="You get a named lead, weekly written updates and access to a staging environment where you can see progress for yourself."
          />
          <Process />
          <div className="ab-proc-cta">
            <Link to="/services" className="text-link">See what we build <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <CtaBand title="Let's talk about what you are building." />
    </>
  )
}
