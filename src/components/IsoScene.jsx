import { C, S, boxFaces, facePoly, proj, pts } from '../lib/iso'
import './IsoScene.css'

const U = 10

// Text engraved on a face. Left face runs along +x, right face along -y.
function labelTransform(b, l) {
  if (l.face === 'right') {
    const [ex, ey] = proj(b.x + b.w, b.y + b.d - l.a, b.z + l.b)
    return `matrix(${C} ${-S} 0 1 ${(ex * U).toFixed(2)} ${(ey * U).toFixed(2)})`
  }
  const [ex, ey] = proj(b.x + l.a, b.y + b.d, b.z + l.b)
  return `matrix(${C} ${S} 0 1 ${(ex * U).toFixed(2)} ${(ey * U).toFixed(2)})`
}

function Box({ b }) {
  const f = boxFaces(b)
  const tone = b.tone || 'default'
  return (
    <g className={`sc-box sc-${tone}${b.accent ? ' sc-accent' : ''}`}>
      <polygon className="sc-left" points={pts(f.left, U)} />
      <polygon className="sc-right" points={pts(f.right, U)} />
      <polygon className="sc-top" points={pts(f.top, U)} />
      {b.windows?.map((w, i) => (
        <polygon key={i} className={`sc-win sc-win-${w.tone || 'win'}`} points={pts(facePoly(b, w), U)} />
      ))}
      {b.labels?.map((l, i) => (
        <text key={i} className="sc-label" transform={labelTransform(b, l)} style={{ fontSize: `${(l.size || 0.42) * U}px` }}>
          {l.text}
        </text>
      ))}
    </g>
  )
}

function Plate({ p }) {
  const box = { x: p.x, y: p.y, z: -0.35, w: p.w, d: p.d, h: 0.35, tone: 'plate' }
  const lines = []
  for (let i = 1; i < p.w; i += 1) lines.push([proj(p.x + i, p.y, 0), proj(p.x + i, p.y + p.d, 0)])
  for (let j = 1; j < p.d; j += 1) lines.push([proj(p.x, p.y + j, 0), proj(p.x + p.w, p.y + j, 0)])
  return (
    <g>
      <Box b={box} />
      {lines.map((l, i) => <polyline key={i} className="sc-grid" points={pts(l, U)} />)}
    </g>
  )
}

/** Isometric illustration built from plates, boxes, floor lines and shadows. */
export default function IsoScene({ items, className = '', title }) {
  // bounds from every projected point
  const xs = []
  const ys = []
  const add = (P) => P.forEach(([a, b]) => { xs.push(a); ys.push(b) })
  for (const it of items) {
    if (it.kind === 'plate') add(Object.values(boxFaces({ ...it, z: -0.35, h: 0.35 })).flat())
    if (it.kind === 'box') add(Object.values(boxFaces(it)).flat())
    if (it.kind === 'line') add(it.pts.map((p) => proj(...p)))
  }
  const pad = 0.6
  const vb = [(Math.min(...xs) - pad) * U, (Math.min(...ys) - pad - 0.8) * U, (Math.max(...xs) - Math.min(...xs) + 2 * pad) * U, (Math.max(...ys) - Math.min(...ys) + 2 * pad + 0.8) * U]

  return (
    <svg
      className={`iso-scene ${className}`}
      viewBox={vb.map((n) => n.toFixed(1)).join(' ')}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {items.map((it, i) => {
        if (it.kind === 'plate') return <Plate key={i} p={it} />
        if (it.kind === 'line') {
          return <polyline key={i} className={`sc-line sc-line-${it.tone || 'accent'}`} points={pts(it.pts.map((p) => proj(...p)), U)} />
        }
        if (it.kind === 'shadow') {
          const P = [proj(it.x, it.y, it.z || 0), proj(it.x + it.w, it.y, it.z || 0), proj(it.x + it.w, it.y + it.d, it.z || 0), proj(it.x, it.y + it.d, it.z || 0)]
          return <polygon key={i} className={`sc-shadow${it.float ? ' sc-shadow-float' : ''}`} points={pts(P, U)} />
        }
        const box = <Box b={it} />
        return it.float ? <g key={i} className="sc-float">{box}</g> : <g key={i}>{box}</g>
      })}
    </svg>
  )
}
