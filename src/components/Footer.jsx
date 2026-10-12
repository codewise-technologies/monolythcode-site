import { Link } from 'react-router-dom'
import { SERVICES } from '../data/services'
import { SITE } from '../data/site'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="ftr theme-dark lattice">
      <div className="container">
        <div className="ftr-top">
          <div className="ftr-brand">
            <img src="/brand/logo-tagline-on-dark.svg" alt={SITE.name} width="300" height="56" />
            <p className="ftr-statement">
              Business software engineered as one solid system. Designed, built, secured and supported by one accountable team.
            </p>
          </div>

          <nav className="ftr-col" aria-label="Services">
            <p className="ftr-head mono">Services</p>
            <ul role="list">
              {SERVICES.map((s) => (
                <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </nav>

          <nav className="ftr-col" aria-label="Company">
            <p className="ftr-head mono">Company</p>
            <ul role="list">
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/services">All services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              {SITE.erpDemoUrl && <li><a href={SITE.erpDemoUrl} target="_blank" rel="noreferrer">ERP live demo</a></li>}
              {SITE.social.linkedin && <li><a href={SITE.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
              {SITE.social.github && <li><a href={SITE.social.github} target="_blank" rel="noreferrer">GitHub</a></li>}
            </ul>
          </nav>

          <div className="ftr-col">
            <p className="ftr-head mono">Contact</p>
            <ul role="list">
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              {SITE.phone && <li><a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a></li>}
              <li className="ftr-plain">{SITE.location}</li>
              <li className="ftr-plain">{SITE.serving}</li>
            </ul>
          </div>
        </div>

        <div className="ftr-bottom">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p className="mono">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
