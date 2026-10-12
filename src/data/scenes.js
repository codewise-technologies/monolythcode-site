// ---------------------------------------------------------------
// Isometric scenes for the Services page and service-page heroes.
// Units: x runs to the lower-right, y to the lower-left, z up.
// Items are drawn in order, back to front.
// ---------------------------------------------------------------

const vents = (n, a, b0, b1, step = 0.38) =>
  Array.from({ length: n }, (_, i) => ({ face: 'right', a0: a + i * step, a1: a + i * step + 0.18, b0, b1, tone: 'ink' }))

const slab = (z, label, extra = {}) => ({
  kind: 'box', x: 0, y: 0, z, w: 4, d: 4, h: 0.9,
  labels: [{ face: 'left', text: label, a: 0.35, b: 0.3 }],
  windows: [{ face: 'right', a0: 0.4, a1: 0.75, b0: 0.36, b1: 0.56, tone: extra.accent ? 'accent' : 'ink' }, ...vents(4, 1.6, 0.28, 0.62)],
  ...extra,
})

const grid = (cols, rows, a, b, aStep, bStep, aw, bh, face, lit = []) =>
  Array.from({ length: cols }).flatMap((_, i) => Array.from({ length: rows }).map((__, j) => ({
    face, a0: a + i * aStep, a1: a + i * aStep + aw, b0: b + j * bStep, b1: b + j * bStep + bh,
    tone: lit.some(([li, lj]) => li === i && lj === j) ? 'lit' : 'win',
  })))

export const SCENES = {
  // Three ERP modules stacked into one system, fed by a POS terminal and a warehouse.
  'erp-systems': [
    { kind: 'plate', x: -0.8, y: -0.8, w: 8.8, d: 8.8 },
    { kind: 'line', pts: [[4, 1.7, 0.02], [6, 1.7, 0.02]] },
    { kind: 'line', pts: [[1.7, 4, 0.02], [1.7, 6, 0.02]] },
    slab(0, 'INVENTORY'),
    slab(1.25, 'FINANCE'),
    slab(2.5, 'SALES · CRM', { accent: true }),
    { kind: 'shadow', x: 1.45, y: 1.45, z: 3.4, w: 1.1, d: 1.1, float: true },
    { kind: 'box', x: 1.45, y: 1.45, z: 4.35, w: 1.1, d: 1.1, h: 1.1, tone: 'blue', float: true },
    {
      kind: 'box', x: 6, y: 1.05, z: 0, w: 1.3, d: 1.3, h: 1.45, tone: 'dark', labels: [{ face: 'left', text: 'POS', a: 0.2, b: 0.2, size: 0.34 }],
      windows: [{ face: 'left', a0: 0.18, a1: 1.12, b0: 0.62, b1: 1.25, tone: 'accent' }],
    },
    {
      kind: 'box', x: 1.05, y: 6, z: 0, w: 1.3, d: 1.3, h: 1.1, labels: [{ face: 'left', text: 'STOCK', a: 0.15, b: 0.2, size: 0.32 }],
      windows: [{ face: 'right', a0: 0.25, a1: 1.05, b0: 0.55, b1: 0.62, tone: 'ink' }, { face: 'right', a0: 0.25, a1: 1.05, b0: 0.75, b1: 0.82, tone: 'ink' }],
    },
  ],

  // Hotel tower on a podium with a lit lobby, canopy, side wing and a floating key card.
  'hotel-management-systems': [
    { kind: 'plate', x: -0.8, y: -0.8, w: 9.4, d: 6.4 },
    {
      kind: 'box', x: 0, y: 0, z: 0, w: 5.4, d: 3.6, h: 1.1,
      windows: [
        { face: 'left', a0: 0.35, a1: 1.55, b0: 0.12, b1: 0.85, tone: 'lit' },
        { face: 'left', a0: 1.85, a1: 3.55, b0: 0.12, b1: 0.85, tone: 'accent' },
        { face: 'left', a0: 3.85, a1: 5.05, b0: 0.12, b1: 0.85, tone: 'lit' },
        { face: 'right', a0: 0.35, a1: 3.25, b0: 0.3, b1: 0.75, tone: 'win' },
      ],
    },
    {
      kind: 'box', x: 0.9, y: 0.6, z: 1.1, w: 3.2, d: 2.2, h: 4.6, accent: true,
      windows: [
        ...grid(3, 5, 0.35, 0.4, 1.0, 0.85, 0.55, 0.5, 'left', [[0, 1], [2, 3], [1, 4], [2, 0], [0, 3]]),
        ...grid(2, 5, 0.35, 0.4, 0.95, 0.85, 0.5, 0.5, 'right', [[1, 2], [0, 4]]),
      ],
    },
    { kind: 'box', x: 1.7, y: 1.0, z: 5.7, w: 1.3, d: 1.1, h: 0.45, tone: 'dark' },
    { kind: 'box', x: 1.9, y: 3.6, z: 0.85, w: 1.6, d: 0.85, h: 0.14, tone: 'blue' },
    {
      kind: 'box', x: 5.9, y: 0.3, z: 0, w: 1.8, d: 2.8, h: 2.5,
      windows: [
        ...grid(1, 2, 0.4, 0.45, 0, 1.0, 1.0, 0.55, 'left', [[0, 0]]),
        ...grid(2, 2, 0.4, 0.45, 1.1, 1.0, 0.7, 0.55, 'right', [[1, 1]]),
      ],
    },
    { kind: 'shadow', x: 6.3, y: 1.0, z: 2.5, w: 1.0, d: 0.5, float: true },
    {
      kind: 'box', x: 6.3, y: 1.2, z: 3.4, w: 1.05, d: 0.12, h: 0.68, tone: 'blue', float: true,
      windows: [{ face: 'left', a0: 0.12, a1: 0.42, b0: 0.38, b1: 0.56, tone: 'screen' }],
    },
  ],

  // A tablet dashboard and a phone app, synced to an API server, with a notification badge.
  'mobile-apps': [
    { kind: 'plate', x: -1.4, y: -0.8, w: 10.6, d: 4.8 },
    { kind: 'line', pts: [[6.6, 1.2, 0.02], [4.9, 1.2, 0.02], [4.9, 1.6, 0.02]] },
    { kind: 'shadow', x: 6.25, y: 1.25, z: 0, w: 0.7, d: 0.7, float: true },
    {
      kind: 'box', x: 6.6, y: -0.2, z: 0, w: 1.4, d: 1.4, h: 2.6, labels: [{ face: 'left', text: 'API', a: 0.3, b: 0.3, size: 0.36 }],
      windows: [
        { face: 'left', a0: 0.25, a1: 1.15, b0: 1.0, b1: 1.12, tone: 'ink' },
        { face: 'left', a0: 0.25, a1: 1.15, b0: 1.35, b1: 1.47, tone: 'ink' },
        { face: 'left', a0: 0.25, a1: 1.15, b0: 1.7, b1: 1.82, tone: 'ink' },
        { face: 'left', a0: 0.25, a1: 0.45, b0: 2.1, b1: 2.3, tone: 'accent' },
        ...vents(3, 0.3, 0.8, 2.2),
      ],
    },
    {
      kind: 'box', x: -0.6, y: 0, z: 0, w: 3.6, d: 0.3, h: 4.4, tone: 'dark',
      windows: [
        { face: 'left', a0: 0.2, a1: 3.4, b0: 0.3, b1: 4.1, tone: 'screen' },
        { face: 'left', a0: 0.35, a1: 3.25, b0: 3.55, b1: 3.95, tone: 'accent' },
        { face: 'left', a0: 0.5, a1: 3.1, b0: 3.0, b1: 3.25, tone: 'muted' },
        { face: 'left', a0: 0.5, a1: 0.8, b0: 0.6, b1: 1.6, tone: 'ink' },
        { face: 'left', a0: 1.0, a1: 1.3, b0: 0.6, b1: 2.2, tone: 'ink' },
        { face: 'left', a0: 1.5, a1: 1.8, b0: 0.6, b1: 1.9, tone: 'ink' },
        { face: 'left', a0: 2.0, a1: 2.3, b0: 0.6, b1: 2.7, tone: 'accent' },
        { face: 'left', a0: 2.5, a1: 2.8, b0: 0.6, b1: 2.4, tone: 'ink' },
      ],
    },
    {
      kind: 'box', x: 3.8, y: 1.6, z: 0, w: 2.1, d: 0.3, h: 4.2, tone: 'dark',
      windows: [
        { face: 'left', a0: 0.15, a1: 1.95, b0: 0.3, b1: 3.9, tone: 'screen' },
        { face: 'left', a0: 0.3, a1: 1.8, b0: 3.35, b1: 3.7, tone: 'accent' },
        { face: 'left', a0: 0.3, a1: 1.8, b0: 2.45, b1: 3.1, tone: 'muted' },
        { face: 'left', a0: 0.3, a1: 1.8, b0: 1.6, b1: 2.25, tone: 'muted' },
        { face: 'left', a0: 0.3, a1: 1.8, b0: 0.55, b1: 0.9, tone: 'accent' },
      ],
    },
    { kind: 'box', x: 6.25, y: 1.25, z: 4.3, w: 0.7, d: 0.7, h: 0.7, tone: 'blue', float: true },
  ],

  // A web server feeding a browser window, with a floating code panel.
  'web-development': [
    { kind: 'plate', x: -0.8, y: -0.6, w: 9.9, d: 5.4 },
    { kind: 'line', pts: [[1.6, 0.8, 0.02], [3.3, 0.8, 0.02], [3.3, 2.0, 0.02]] },
    {
      kind: 'box', x: 0, y: 0, z: 0, w: 1.6, d: 1.6, h: 3.4, labels: [{ face: 'left', text: 'WEB', a: 0.3, b: 0.3, size: 0.38 }],
      windows: [
        ...[0, 1, 2, 3].map((k) => ({ face: 'left', a0: 0.25, a1: 1.05, b0: 1.0 + k * 0.5, b1: 1.25 + k * 0.5, tone: 'ink' })),
        ...[0, 1, 2, 3].map((k) => ({ face: 'left', a0: 1.15, a1: 1.32, b0: 1.04 + k * 0.5, b1: 1.21 + k * 0.5, tone: k === 1 ? 'accent' : 'lit' })),
        ...vents(3, 0.3, 1.0, 3.0),
      ],
    },
    { kind: 'box', x: 3.4, y: 2.0, z: 0, w: 2.2, d: 1.8, h: 0.22 },
    { kind: 'box', x: 4.3, y: 2.55, z: 0.22, w: 0.45, d: 0.35, h: 0.55 },
    {
      kind: 'box', x: 1.9, y: 2.9, z: 0.77, w: 5.4, d: 0.35, h: 3.8, tone: 'dark',
      windows: [
        { face: 'left', a0: 0.2, a1: 5.2, b0: 0.2, b1: 3.6, tone: 'screen' },
        { face: 'left', a0: 0.2, a1: 5.2, b0: 3.2, b1: 3.6, tone: 'ink' },
        { face: 'left', a0: 0.35, a1: 0.5, b0: 3.33, b1: 3.48, tone: 'accent' },
        { face: 'left', a0: 0.8, a1: 3.6, b0: 3.3, b1: 3.5, tone: 'muted' },
        { face: 'left', a0: 0.5, a1: 2.9, b0: 1.9, b1: 2.9, tone: 'accent' },
        { face: 'left', a0: 3.2, a1: 4.9, b0: 2.6, b1: 2.75, tone: 'ink' },
        { face: 'left', a0: 3.2, a1: 4.6, b0: 2.3, b1: 2.45, tone: 'ink' },
        { face: 'left', a0: 3.2, a1: 4.9, b0: 2.0, b1: 2.15, tone: 'ink' },
        { face: 'left', a0: 3.2, a1: 4.1, b0: 1.45, b1: 1.75, tone: 'accent' },
        { face: 'left', a0: 0.5, a1: 1.6, b0: 0.5, b1: 1.5, tone: 'muted' },
        { face: 'left', a0: 1.85, a1: 2.95, b0: 0.5, b1: 1.5, tone: 'muted' },
        { face: 'left', a0: 3.2, a1: 4.9, b0: 0.5, b1: 1.2, tone: 'muted' },
      ],
    },
    {
      kind: 'box', x: 6.6, y: 4.0, z: 2.0, w: 2.3, d: 0.18, h: 1.7, tone: 'dark', float: true,
      windows: [
        { face: 'left', a0: 0.2, a1: 0.9, b0: 1.3, b1: 1.42, tone: 'accent' },
        { face: 'left', a0: 0.45, a1: 1.9, b0: 1.05, b1: 1.17, tone: 'muted' },
        { face: 'left', a0: 0.45, a1: 1.5, b0: 0.8, b1: 0.92, tone: 'lit' },
        { face: 'left', a0: 0.45, a1: 1.7, b0: 0.55, b1: 0.67, tone: 'muted' },
        { face: 'left', a0: 0.2, a1: 0.7, b0: 0.3, b1: 0.42, tone: 'accent' },
      ],
    },
  ],

  // A bespoke piece slotting into the core system, connected to an API and a database.
  'custom-software': [
    { kind: 'plate', x: -0.8, y: -0.8, w: 9.2, d: 8.2 },
    { kind: 'line', pts: [[4, 1.0, 0.02], [5.6, 1.0, 0.02]] },
    { kind: 'line', pts: [[1.2, 4, 0.02], [1.2, 5.2, 0.02]] },
    {
      kind: 'box', x: 0, y: 0, z: 0, w: 4, d: 4, h: 1.2, labels: [{ face: 'left', text: 'CORE SYSTEM', a: 0.35, b: 0.42 }],
      windows: [...vents(5, 1.4, 0.3, 0.9)],
    },
    { kind: 'box', x: 0, y: 0, z: 1.2, w: 4, d: 2, h: 1.4, windows: [{ face: 'left', a0: 2.3, a1: 3.7, b0: 0.45, b1: 0.95, tone: 'win' }] },
    { kind: 'shadow', x: 2, y: 2, z: 1.2, w: 2, d: 2, float: true },
    { kind: 'box', x: 0, y: 2, z: 1.2, w: 2, d: 2, h: 1.4, windows: [{ face: 'left', a0: 0.35, a1: 1.65, b0: 0.45, b1: 0.95, tone: 'win' }] },
    {
      kind: 'box', x: 5.6, y: 0.3, z: 0, w: 1.5, d: 1.5, h: 1.5, tone: 'dark', labels: [{ face: 'left', text: 'API', a: 0.3, b: 0.3, size: 0.36 }],
      windows: [{ face: 'left', a0: 0.25, a1: 1.25, b0: 0.85, b1: 1.2, tone: 'accent' }],
    },
    {
      kind: 'box', x: 0.6, y: 5.2, z: 0, w: 1.3, d: 1.3, h: 1.3, labels: [{ face: 'left', text: 'DATA', a: 0.2, b: 0.25, size: 0.32 }],
      windows: [{ face: 'right', a0: 0.25, a1: 1.05, b0: 0.6, b1: 0.68, tone: 'ink' }, { face: 'right', a0: 0.25, a1: 1.05, b0: 0.85, b1: 0.93, tone: 'ink' }],
    },
    { kind: 'box', x: 2, y: 2, z: 3.4, w: 2, d: 2, h: 1.4, tone: 'blue', float: true, labels: [{ face: 'left', text: 'YOURS', a: 0.3, b: 0.5, size: 0.4 }] },
  ],
}
