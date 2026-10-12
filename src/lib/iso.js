// Isometric projection helpers (true 30° isometric, matching the logo).
// World axes: +x runs to the screen's lower-right, +y to the lower-left, +z up.
export const C = Math.cos(Math.PI / 6)
export const S = 0.5

export const proj = (x, y, z) => [(x - y) * C, (x + y) * S - z]

export function boxFaces({ x = 0, y = 0, z = 0, w, d, h }) {
  return {
    top: [proj(x, y, z + h), proj(x + w, y, z + h), proj(x + w, y + d, z + h), proj(x, y + d, z + h)],
    left: [proj(x, y + d, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x, y + d, z + h)],
    right: [proj(x + w, y, z), proj(x + w, y + d, z), proj(x + w, y + d, z + h), proj(x + w, y, z + h)],
  }
}

// A rectangle painted on a face. Left face: a runs along x, b along z.
// Right face: a runs along y, b along z.
export function facePoly({ x = 0, y = 0, z = 0, w, d }, { face, a0, a1, b0, b1 }) {
  if (face === 'left') {
    const Y = y + d
    return [proj(x + a0, Y, z + b0), proj(x + a1, Y, z + b0), proj(x + a1, Y, z + b1), proj(x + a0, Y, z + b1)]
  }
  const X = x + w
  return [proj(X, y + a0, z + b0), proj(X, y + a1, z + b0), proj(X, y + a1, z + b1), proj(X, y + a0, z + b1)]
}

export const pts = (P, u = 1) => P.map(([a, b]) => `${(a * u).toFixed(2)},${(b * u).toFixed(2)}`).join(' ')

export function bounds(boxes, extra = []) {
  const xs = []
  const ys = []
  for (const b of boxes) {
    const f = boxFaces(b)
    for (const p of [...f.top, ...f.left, ...f.right]) { xs.push(p[0]); ys.push(p[1]) }
  }
  for (const p of extra) { xs.push(p[0]); ys.push(p[1]) }
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
}
