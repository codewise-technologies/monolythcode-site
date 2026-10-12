import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { SERVICES } from '../data/services'
import { SITE } from '../data/site'
import IsoGlyph from './IsoGlyph'
import './Header.css'

export default function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)     // services mega menu (desktop)
  const [drawerOpen, setDrawerOpen] = useState(false) // mobile navigation
  const menuRef = useRef(null)
  const triggerRef = useRef(null)
  const closeTimer = useRef(null)
  const openedBy = useRef(null) // 'hover' | 'click'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close everything on navigation
  useEffect(() => { setMenuOpen(false); setDrawerOpen(false) }, [pathname])

  // lock page scroll behind the mobile drawer
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Escape + outside click for the mega menu
  useEffect(() => {
    if (!menuOpen && !drawerOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (menuOpen) { setMenuOpen(false); triggerRef.current?.focus() }
        setDrawerOpen(false)
      }
    }
    const onClick = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [menuOpen, drawerOpen])

  const hoverOpen = () => {
    clearTimeout(closeTimer.current)
    if (!menuOpen) openedBy.current = 'hover'
    setMenuOpen(true)
  }
  // A click after hover-open keeps the menu open (and pins it); otherwise it toggles.
  const clickToggle = () => {
    if (!menuOpen) { openedBy.current = 'click'; setMenuOpen(true) }
    else if (openedBy.current === 'hover') openedBy.current = 'click'
    else setMenuOpen(false)
  }
  const hoverClose = () => { closeTimer.current = setTimeout(() => setMenuOpen(false), 180) }
  const servicesActive = pathname.startsWith('/services')

  return (
    <>
    <header className={`hdr theme-dark${scrolled || drawerOpen ? ' is-scrolled' : ''}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="container hdr-bar">
        <Link to="/" className="hdr-logo" aria-label={`${SITE.name} — home`}>
          <img src="/brand/logo-on-dark.svg" alt="" width="220" height="30" />
        </Link>

        <nav className="hdr-nav" aria-label="Main">
          <ul role="list" className="hdr-links">
            <li className="hdr-has-menu" ref={menuRef} onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
              <button
                ref={triggerRef}
                type="button"
                className={`hdr-link${servicesActive ? ' is-active' : ''}`}
                aria-expanded={menuOpen}
                aria-controls="services-menu"
                onClick={clickToggle}
              >
                Services <ChevronDown aria-hidden="true" className={menuOpen ? 'is-flipped' : ''} />
              </button>
              <div id="services-menu" className={`mega${menuOpen ? ' is-open' : ''}`} hidden={!menuOpen}>
                <ul role="list" className="mega-grid">
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} className="mega-item">
                        <span className="mega-glyph"><IsoGlyph boxes={s.glyph} /></span>
                        <span>
                          <span className="mega-name">{s.name}</span>
                          <span className="mega-text">{s.short}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mega-aside">
                  <p className="mono mega-kicker">Not sure where to start?</p>
                  <p className="mega-aside-text">Most projects begin with a short discovery call. Tell us the problem — we will recommend the right system.</p>
                  <Link to="/services" className="text-link">All services overview <ArrowRight aria-hidden="true" /></Link>
                  <Link to="/contact" className="text-link">Talk to an engineer <ArrowRight aria-hidden="true" /></Link>
                </div>
              </div>
            </li>
            <li><NavLink to="/about" className="hdr-link">About</NavLink></li>
            <li><NavLink to="/contact" className="hdr-link">Contact</NavLink></li>
          </ul>
        </nav>

        <div className="hdr-cta">
          <Link to="/contact" className="btn btn-primary">Book a consultation</Link>
        </div>

        <button
          type="button"
          className="hdr-burger"
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setDrawerOpen((o) => !o)}
        >
          {drawerOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

    </header>
      <div id="mobile-nav" className={`drawer theme-dark${drawerOpen ? ' is-open' : ''}`} hidden={!drawerOpen}>
        <nav aria-label="Mobile" className="container">
          <p className="mono drawer-kicker">Services</p>
          <ul role="list" className="drawer-services">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`}>
                  <span className="drawer-glyph"><IsoGlyph boxes={s.glyph} /></span>
                  <span>{s.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul role="list" className="drawer-links">
            <li><Link to="/services">All services</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <Link to="/contact" className="btn btn-primary drawer-cta">Book a consultation</Link>
          <p className="drawer-meta mono">{SITE.email}</p>
        </nav>
      </div>
    </>
  )
}
