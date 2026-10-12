import { boxFaces, facePoly, pts, bounds } from '../lib/iso'

const U = 10 // drawing unit -> SVG user units

/** Renders a list of isometric boxes. Colours come from the section theme (--iso-*). */
export default function IsoGlyph({ boxes, className = '', title }) {
  const b = bounds(boxes)
  const pad = 0.4
  const vb = [(b.minX - pad) * U, (b.minY - pad) * U, (b.maxX - b.minX + 2 * pad) * U, (b.maxY - b.minY + 2 * pad) * U]
  return (
    <svg
      className={`iso-glyph ${className}`}
      viewBox={vb.map((n) => n.toFixed(1)).join(' ')}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {boxes.map((box, i) => {
        const f = boxFaces(box)
        return (
          <g key={i}>
            <polygon className="iso-left" points={pts(f.left, U)} />
            <polygon className="iso-right" points={pts(f.right, U)} />
            <polygon className={box.accent ? 'iso-top-accent' : 'iso-top'} points={pts(f.top, U)} />
            {box.windows?.map((w, j) => (
              <polygon key={j} className={w.tone === 'accent' ? 'iso-win-accent' : 'iso-win'} points={pts(facePoly(box, w), U)} />
            ))}
          </g>
        )
      })}
    </svg>
  )
}
