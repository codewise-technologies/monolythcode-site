import { useEffect, useState } from 'react'

// ---- Edit these to suit ----------------------------------------------
const CONFIG = {
  contactEmail: 'hello@monolythcode.com',
  // Optional: set an ISO time to show a countdown, or null to hide it.
  // Example: '2026-10-13T09:00:00+05:30'
  backOnline: null,
}
// ----------------------------------------------------------------------

const LOG_LINES = [
  '$ systemctl stop monolyth-web',
  '> pulling latest build ........ ok',
  '> running migrations .......... ok',
  '> hardening config ............ ok',
  '> rebuilding the slab ......... in progress',
]

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  if (!target) return null
  const diff = Math.max(0, new Date(target).getTime() - now)
  const s = Math.floor(diff / 1000)
  return {
    done: diff === 0,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

function Terminal() {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown >= LOG_LINES.length) return
    const id = setTimeout(() => setShown((n) => n + 1), 650)
    return () => clearTimeout(id)
  }, [shown])

  return (
    <div className="terminal" aria-hidden="true">
      <div className="terminal__bar">
        <span /><span /><span />
        <em>monolyth@prod:~</em>
      </div>
      <pre className="terminal__body">
        {LOG_LINES.slice(0, shown).map((l, i) => (
          <div key={i} className={l.includes('in progress') ? 'is-active' : ''}>{l}</div>
        ))}
        <span className="cursor">█</span>
      </pre>
    </div>
  )
}

export default function App() {
  const cd = useCountdown(CONFIG.backOnline)
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <main className="page">
      <div className="grid-bg" aria-hidden="true" />

      <header className="brand">
        <span className="brand__mark" aria-hidden="true">M<b>Y</b>C</span>
        <span className="brand__name">
          Monol<b>y</b>th Code
        </span>
      </header>

      <section className="hero">
        <p className="eyebrow">
          <span className="pulse" /> Status: scheduled maintenance
        </p>
        <h1>
          We're reshaping
          <br />
          the mono<b>l</b><b className="y">y</b>th.
        </h1>
        <p className="lede">
          monolythcode.com is offline for upgrades. Everything will be back
          shortly — faster and more secure than before.
        </p>

        {cd && !cd.done && (
          <div className="countdown" role="timer" aria-label="Time until back online">
            {[['Days', cd.d], ['Hours', cd.h], ['Min', cd.m], ['Sec', cd.s]].map(([label, v]) => (
              <div key={label} className="countdown__cell">
                <strong>{pad(v)}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="progress" aria-hidden="true"><span /></div>

        <a className="cta" href={`mailto:${CONFIG.contactEmail}`}>
          Contact {CONFIG.contactEmail}
        </a>
      </section>

      <Terminal />

      <footer className="foot">
        © {new Date().getFullYear()} Monolyth Code · Built to last.
      </footer>
    </main>
  )
}
