import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { C, S, boxFaces, facePoly, proj, pts, bounds } from '../lib/iso'
import { SERVICES } from '../data/services'
import './IsoRack.css'

// Geometry (iso units)
const U = 34
const W = 5
const D = 5
const LH = 1.05   // module height
const GAP = 0.3   // gap between modules
const PULL = 1.35 // how far a module slides out
const CAP_GAP = 0.42

// Bottom-up order: custom software is the foundation, ERP sits at the top.
const LAYERS = [...SERVICES].reverse()
const topZ = LAYERS.length * (LH + GAP) - GAP
const CAP = { x: 0, y: 0, z: topZ + CAP_GAP, w: W, d: D, h: 0.28 }

const layerBox = (i) => ({ x: 0, y: 0, z: i * (LH + GAP), w: W, d: D, h: LH })
const dx = PULL * C * U
const dy = PULL * S * U

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function IsoRack() {
  const navigate = useNavigate()
  const [active, setActive] = useState(LAYERS.length - 1) // ERP
  const touched = useRef(false)

  // Gentle auto-cycle until the visitor interacts (never with reduced motion).
  useEffect(() => {
    if (reduceMotion()) return undefined
    const id = setInterval(() => {
      if (touched.current) return
      setActive((a) => (a - 1 + LAYERS.length) % LAYERS.length)
    }, 3400)
    return () => clearInterval(id)
  }, [])

  const engage = (i) => { touched.current = true; setActive(i) }

  const all = LAYERS.map((_, i) => layerBox(i))
  const b = bounds([...all, CAP], [proj(W + PULL, D, 0), proj(W + PULL, 0, topZ)])
  const pad = 0.5
  const vb = [(b.minX - pad) * U, (b.minY - pad) * U, (b.maxX - b.minX + 2 * pad) * U, (b.maxY - b.minY + 2 * pad) * U]
  const svc = LAYERS[active]

  return (
    <div className="rack" onPointerEnter={() => { touched.current = true }}>
      <svg className="rack-svg" viewBox={vb.map((n) => n.toFixed(1)).join(' ')} aria-hidden="true" focusable="false">
        {LAYERS.map((s, i) => {
          const box = layerBox(i)
          const f = boxFaces(box)
          const isOn = i === active
          // engraved label on the left face: local x follows the face, local y points down
          const [ex, ey] = proj(box.x + 0.42, box.y + box.d, box.z + LH * 0.3)
          const led = facePoly(box, { face: 'right', a0: 0.45, a1: 0.95, b0: LH * 0.38, b1: LH * 0.62 })
          const vent = [0, 1, 2].map((k) =>
            facePoly(box, { face: 'right', a0: 1.6 + k * 0.42, a1: 1.82 + k * 0.42, b0: LH * 0.3, b1: LH * 0.7 }))
          return (
            <g key={s.slug} className="rack-in" style={{ '--i': i }}>
              <g
                className={`rack-layer${isOn ? ' is-on' : ''}`}
                style={{ transform: isOn ? `translate(${dx}px, ${dy}px)` : 'translate(0px, 0px)' }}
                onPointerEnter={() => engage(i)}
                onClick={() => navigate(`/services/${s.slug}`)}
              >
                <polygon className="rack-left" points={pts(f.left, U)} />
                <polygon className="rack-right" points={pts(f.right, U)} />
                <polygon className="rack-top" points={pts(f.top, U)} />
                {vent.map((v, k) => <polygon key={k} className="rack-vent" points={pts(v, U)} />)}
                <polygon className="rack-led" points={pts(led, U)} />
                <text
                  className="rack-label"
                  transform={`matrix(${C} ${S} 0 1 ${(ex * U).toFixed(2)} ${(ey * U).toFixed(2)})`}
                >
                  {s.rack}
                </text>
              </g>
            </g>
          )
        })}
        <g className="rack-in rack-cap" style={{ '--i': LAYERS.length }}>
          {(() => {
            const f = boxFaces(CAP)
            return (
              <>
                <polygon className="cap-left" points={pts(f.left, U)} />
                <polygon className="cap-right" points={pts(f.right, U)} />
                <polygon className="cap-top" points={pts(f.top, U)} />
              </>
            )
          })()}
        </g>
      </svg>

      <div className="rack-caption" aria-live="polite">
        <p className="rack-caption-kicker mono">Module · {svc.rack}</p>
        <p className="rack-caption-title">{svc.name}</p>
        <p className="rack-caption-text">{svc.short}</p>
        <Link className="text-link" to={`/services/${svc.slug}`}>
          Explore {svc.lower} <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <nav className="rack-index" aria-label="Services">
        <ul role="list">
          {SERVICES.map((s) => {
            const i = LAYERS.indexOf(s)
            return (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className={i === active ? 'is-on' : ''}
                  onPointerEnter={() => engage(i)}
                  onFocus={() => engage(i)}
                >
                  {s.rack}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
