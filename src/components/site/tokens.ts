// Shared AIPEA design tokens — single source of truth for the site chrome
// (nav, footer) and all standalone pages. Mirrors the palette used inside
// AIPEA.tsx so the homepage and sub-pages read as one system.

export const C = {
  orange:      '#E8501A',
  orangeDim:   '#c94314',
  navy:        '#1B2A5E',
  navyDark:    '#111c42',
  white:       '#ffffff',
  bg:          '#ffffff',
  surface:     '#f7f8fc',
  elevated:    '#eef1f8',
  text:        '#111c42',
  muted:       'rgba(17,28,66,0.52)',
  faint:       'rgba(17,28,66,0.2)',
  border:      'rgba(27,42,94,0.09)',
  borderHover: 'rgba(27,42,94,0.22)',
} as const

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const dis = 'var(--font-syne), sans-serif'
export const bod = 'var(--font-inter), sans-serif'

export const INNER: React.CSSProperties = { maxWidth: 1400, margin: '0 auto' }
export const SECTION: React.CSSProperties = { padding: '120px 40px' }
