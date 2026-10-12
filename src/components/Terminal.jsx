import { useEffect, useState } from 'react'
import { Minus, Square, X } from 'lucide-react'
import './Terminal.css'

// What the terminal "runs". cmd lines are typed out; the rest print line by line.
const SCRIPT = [
  { type: 'cmd', text: 'monolyth --about' },
  { type: 'kv', k: 'company', v: 'Monolyth Code' },
  { type: 'kv', k: 'builds', v: 'ERP · hotel systems · mobile · web · custom' },
  { type: 'kv', k: 'approach', v: 'secure by default, built to last' },
  { type: 'kv', k: 'ownership', v: 'your code, your data' },
  { type: 'gap' },
  { type: 'cmd', text: 'monolyth deploy --env production' },
  { type: 'ok', text: 'tests passed' },
  { type: 'ok', text: 'security checks passed' },
  { type: 'ok', text: 'backups verified' },
  { type: 'ok', text: 'live and monitored' },
]

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Terminal() {
  const instant = reduceMotion()
  const [line, setLine] = useState(instant ? SCRIPT.length : 0) // lines fully shown
  const [chars, setChars] = useState(0)                         // chars typed on the current cmd

  useEffect(() => {
    if (line >= SCRIPT.length) return undefined
    const cur = SCRIPT[line]
    let t
    if (cur.type === 'cmd' && chars < cur.text.length) {
      t = setTimeout(() => setChars((c) => c + 1), line === 0 && chars === 0 ? 700 : 42)
    } else {
      t = setTimeout(() => { setLine((l) => l + 1); setChars(0) }, cur.type === 'cmd' ? 420 : 170)
    }
    return () => clearTimeout(t)
  }, [line, chars])

  const done = line >= SCRIPT.length
  const cur = SCRIPT[line]

  return (
    <div className="term" aria-hidden="true">
      <div className="term-bar">
        <span className="term-title">monolyth@build: ~</span>
        <span className="term-controls"><Minus /><Square /><X /></span>
      </div>
      <div className="term-body">
        {SCRIPT.slice(0, line).map((l, i) => <Line key={i} l={l} />)}
        {!done && cur.type === 'cmd' && (
          <div className="term-line">
            <span className="term-prompt">~ $</span> <span className="term-cmd">{cur.text.slice(0, chars)}</span>
            <span className="term-cursor" />
          </div>
        )}
        {done && (
          <div className="term-line">
            <span className="term-prompt">~ $</span> <span className="term-cursor" />
          </div>
        )}
      </div>
    </div>
  )
}

function Line({ l }) {
  if (l.type === 'cmd') return <div className="term-line"><span className="term-prompt">~ $</span> <span className="term-cmd">{l.text}</span></div>
  if (l.type === 'kv') return <div className="term-line term-kv"><span className="term-k">{l.k}</span><span className="term-v">{l.v}</span></div>
  if (l.type === 'ok') return <div className="term-line"><span className="term-ok">✔</span> <span className="term-out">{l.text}</span></div>
  return <div className="term-line term-gap" />
}
