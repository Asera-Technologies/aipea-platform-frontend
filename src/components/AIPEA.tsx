'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
  type Transition,
} from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Plus, Check, ChevronLeft, ChevronRight, Lock, Users, BookOpen, Calendar, GraduationCap } from 'lucide-react'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'
import { PricingBreakdown, type PriceTier, type PriceRow } from '@/components/site/PageKit'

// --- Tokens -------------------------------------------------------------------

const C = {
  orange:      '#E8501A',
  orangeDim:   '#c94314',
  // Brand orange only reaches 3.6:1 on navy, which fails WCAG AA for text under
  // ~19px. Use this tint for small orange text on a dark surface (5.9:1).
  orangeOnDark:'#FF8A5B',
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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = 'var(--font-syne), sans-serif'
const bod = 'var(--font-inter), sans-serif'

// Spacing scale. Every gap on the page is one of these steps, so the rhythm is a
// decision rather than an accumulation of one-off numbers. Steps roughly follow a
// 1.5x ratio off an 8px base; `section` and `headerGap` are the two that set the
// page's overall density.
const S = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
  section: 88,   // vertical padding inside a section
  headerGap: 44, // section header to its content
} as const

const SECTION: React.CSSProperties = { padding: `${S.section}px 40px` }
const INNER: React.CSSProperties   = { maxWidth: 1400, margin: '0 auto' }

// AIPEA is a young body. Everything below is phrased as intent so the site never
// claims a membership, a footprint or a track record that does not exist yet.
// If real figures arrive, they belong here and nowhere else.
// Labels are kept to one line each so the three sub-lines share a baseline.
const VISION = [
  { label: 'Pan-African', sub: 'Built for the whole continent from day one.' },
  { label: 'One standard', sub: 'A single CPD-backed credential for the role.' },
  { label: 'Founding cohort', sub: 'Join the members who set the benchmark.' },
] as const

// --- Utilities ----------------------------------------------------------------

function ScrollReveal({ children, delay = 0, style, className }: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' as `${number}px` })
  const reduced = useReducedMotion()
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 28 }}
      transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: EASE } satisfies Transition}
    >
      {children}
    </motion.div>
  )
}

function TiltCard({ children, max = 5, style }: { children: React.ReactNode; max?: number; style?: React.CSSProperties }) {
  const reduced = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sRx = useSpring(rx, { stiffness: 150, damping: 16 })
  const sRy = useSpring(ry, { stiffness: 150, damping: 16 })
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  function reset() { rx.set(0); ry.set(0) }
  return (
    <motion.div onMouseMove={onMove} onMouseLeave={reset}
      style={{ height: '100%', rotateX: reduced ? 0 : sRx, rotateY: reduced ? 0 : sRy, transformPerspective: 1000, ...style }}>
      {children}
    </motion.div>
  )
}

function RotatingWord({ words, style }: { words: string[]; style?: React.CSSProperties }) {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI(v => (v + 1) % words.length), 2200)
    return () => clearInterval(id)
  }, [reduced, words.length])
  return (
    <span style={{ display: 'inline-grid', verticalAlign: 'top', justifyItems: 'start', ...style }}>
      {/* Hidden copies hold the column at the widest word so the following text never shifts. */}
      {words.map(w => (
        <span key={w} aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden', whiteSpace: 'nowrap' }}>{w}</span>
      ))}
      <AnimatePresence mode="wait">
        <motion.span key={words[i]}
          initial={{ y: '0.7em', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-0.7em', opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ gridArea: '1 / 1', whiteSpace: 'nowrap' }}>
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

type Dir = 'up' | 'left' | 'right' | 'scale'
function Reveal({ children, delay = 0, from = 'up', style, className }: {
  children: React.ReactNode; delay?: number; from?: Dir; style?: React.CSSProperties; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' as `${number}px` })
  const reduced = useReducedMotion()
  const offset: Record<Dir, Record<string, number>> = { up: { y: 30 }, left: { x: -44 }, right: { x: 44 }, scale: { scale: 0.92 } }
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={reduced ? { opacity: 0 } : { opacity: 0, ...offset[from] }}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
      transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: EASE } satisfies Transition}>
      {children}
    </motion.div>
  )
}

function Magnetic({ children, strength = 0.35, style }: { children: React.ReactNode; strength?: number; style?: React.CSSProperties }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })
  function move(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  function reset() { x.set(0); y.set(0) }
  return (
    <motion.div onMouseMove={reduced ? undefined : move} onMouseLeave={reset}
      style={{ display: 'inline-block', x: reduced ? 0 : sx, y: reduced ? 0 : sy, ...style }}>
      {children}
    </motion.div>
  )
}

function SectionHeader({ statement, aside, align = 'split', nowrap = false }: {
  statement: string; aside: string; align?: 'split' | 'center' | 'stacked'; nowrap?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' as `${number}px` })
  const reduced = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: EASE } satisfies Transition,
  })

  if (align === 'center') {
    return (
      <div ref={ref} style={{ textAlign: 'center', maxWidth: nowrap ? 'none' : 720, margin: `0 auto ${S.headerGap}px` }}>
        <motion.h2 {...rise(0)} style={{ fontFamily: dis, fontWeight: 800, color: C.text, fontSize: nowrap ? 'clamp(22px,3.4vw,56px)' : 'clamp(30px,4vw,56px)', lineHeight: 1.05, letterSpacing: '-0.03em', whiteSpace: nowrap ? 'nowrap' : 'normal' }}>{statement}</motion.h2>
        <motion.p {...rise(0.08)} style={{ fontFamily: bod, fontSize: 15, lineHeight: 1.7, color: C.muted, marginTop: S.xs }}>{aside}</motion.p>
      </div>
    )
  }

  if (align === 'stacked') {
    return (
      <div ref={ref} style={{ marginBottom: S.headerGap }}>
        <motion.h2 {...rise(0)} style={{ fontFamily: dis, fontWeight: 800, color: C.text, fontSize: 'clamp(30px,4.4vw,62px)', lineHeight: 1.02, letterSpacing: '-0.035em', maxWidth: 880 }}>{statement}</motion.h2>
        <motion.p {...rise(0.08)} style={{ fontFamily: bod, fontSize: 15, lineHeight: 1.7, color: C.muted, marginTop: S.xs, maxWidth: 460 }}>{aside}</motion.p>
      </div>
    )
  }

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'flex-end', gap: S.lg, paddingBottom: S.md, borderBottom: `1px solid ${C.border}`, marginBottom: S.headerGap, flexWrap: 'wrap' }}>
      <motion.h2 {...rise(0)} style={{ fontFamily: dis, fontWeight: 800, flex: 1, minWidth: 280, maxWidth: 620, color: C.text, fontSize: 'clamp(26px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>{statement}</motion.h2>
      <motion.p {...rise(0.08)} style={{ fontFamily: bod, fontSize: 14, lineHeight: 1.75, maxWidth: 240, color: C.muted }}>{aside}</motion.p>
    </div>
  )
}

function CredentialCard({ title, tier, number, compact = false }: {
  title: string; tier: string; number: string; compact?: boolean
}) {
  return (
    <div style={{
      position: 'relative', minHeight: compact ? 260 : 360, borderRadius: 22,
      overflow: 'hidden',
      background: `linear-gradient(145deg, ${C.navy} 0%, ${C.navyDark} 58%, #071024 100%)`,
      border: '1px solid rgba(255,255,255,0.14)',
      boxShadow: '0 28px 80px rgba(27,42,94,0.2)',
      color: C.white, padding: compact ? 28 : 36,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(232,80,26,0.32), transparent 34%)' }} />
      <div style={{ position: 'absolute', right: -70, top: -70, width: 220, height: 220, border: '1px solid rgba(255,255,255,0.14)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: -60, bottom: -70, width: 220, height: 220, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: dis, fontWeight: 800, letterSpacing: '0.18em', color: C.orange }}>AIPEA</span>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 11 }}>EA</div>
        </div>
        <div>
          <p style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{tier}</p>
          <h3 style={{ fontFamily: dis, fontSize: compact ? 22 : 32, lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 400 }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
          <span style={{ fontFamily: bod, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{number}</span>
          <span style={{ fontFamily: bod, fontSize: 11, color: C.orange, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Verified credential</span>
        </div>
      </div>
    </div>
  )
}

// --- Hero ---------------------------------------------------------------------

function ScrollWord({ children, index, progress }: { children: React.ReactNode; index: number; progress: MotionValue<number> }) {
  const start = 0.12 + index * 0.055
  const opacity = useTransform(progress, [start, start + 0.06, start + 0.18], [0.08, 1, 1])
  const y = useTransform(progress, [start, start + 0.14], [40, 0])
  const scale = useTransform(progress, [start, start + 0.14], [0.94, 1])
  const blur = useTransform(progress, [start, start + 0.18], ['blur(5px)', 'blur(0px)'])
  const color = useTransform(progress, [start, start + 0.16], ['rgba(17,28,66,0.08)', 'rgba(17,28,66,0.95)'])
  return (
    <motion.span style={{ display: 'inline-block', opacity, y, scale, filter: blur, color, marginRight: '0.24em', whiteSpace: 'nowrap' }}>
      {children}
    </motion.span>
  )
}


function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })
  // The spring does double duty: it smooths the scroll input, and it keeps every
  // derived value on the JS animation loop. Without it framer offloads opacity/
  // transform/filter to the browser's native ScrollTimeline, which goes inactive at
  // the sticky boundary and snaps the whole statement invisible: the blank flash.
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 36, mass: 0.6 })

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE } satisfies Transition,
  })

  // The two phases hand off with no empty frame: the statement ghosts in while the
  // intro is still leaving, the word cascade fills the entire remaining scroll, and
  // the statement never fades out; it is still on screen when the sticky container
  // releases and the next section pushes in.
  const introOpacity = useTransform(progress, [0, 0.02, 0.09], [1, 1, 0])
  const introY       = useTransform(progress, [0, 0.09], [0, -110])
  const introScale   = useTransform(progress, [0, 0.09], [1, 0.97])
  const introVis     = useTransform(progress, (v) => (v >= 0.1 ? 'hidden' : 'visible'))
  const stmtOpacity  = useTransform(progress, [0.02, 0.09], [0, 1])
  const stmtY        = useTransform(progress, [0.02, 0.12], [60, 0])
  const orangeY      = useTransform(progress, [0.02, 0.85], [160, -100])
  const orangeOpacity = useTransform(progress, [0.02, 0.2, 0.85], [0, 0.18, 0.1])

  const statement = ['Behind', "Africa's", 'most', 'powerful', 'executives', 'are', 'professionals', 'who', 'deserve', 'recognition.', 'We', 'provide', 'it.']

  return (
    <section ref={heroRef} className="aipea-hero-section" style={{ position: 'relative' }}>
      <div className="aipea-hero-sticky" style={{ position: 'sticky', top: 0, width: '100%', overflow: 'hidden', background: C.white }}>

        {/* Aspirational hero background image */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          <Image
            src="/images/conference/optimized/hero-main.webp"
            alt="AIPEA members in a boardroom meeting"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>

        {/* Soft orange glow bottom-right */}
        <motion.div style={{ position: 'absolute', right: '8%', bottom: '10%', y: orangeY, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.22), rgba(232,80,26,0.06) 42%, transparent 70%)', opacity: orangeOpacity, filter: 'blur(2px)', pointerEvents: 'none' }} />

        {/* Phase 1: intro. Full-bleed photograph with the content bottom-anchored on a
            navy gradient. The whole layer fades out into Phase 2, which is why the
            statement below can stay dark-on-white without a background cut. */}
        <motion.div style={{ position: 'absolute', inset: 0, opacity: introOpacity, y: introY, scale: introScale, visibility: introVis }}>

          <div className="aipea-hero-visual" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* Slow settle rather than a bounce. Sits under the grade so the whole
                frame moves as one image, not a photo sliding behind a filter. */}
            <motion.div
              initial={{ scale: 1.06 }} animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src="/images/conference/optimized/hero-main.webp"
                alt="The AIPEA annual conference in session in Accra"
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: '62% 26%' }}
                priority
              />
            </motion.div>

            {/* Navy multiply grade pulls the photo into the site palette instead of
                letting it read as a stock image dropped into the layout. */}
            <div style={{ position: 'absolute', inset: 0, background: C.navy, mixBlendMode: 'multiply', opacity: 0.22 }} />
            {/* Navy rising from the floor of the frame: this is what carries the text,
                rather than a solid box behind it. */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,42,94,0.97) 0%, rgba(27,42,94,0.95) 28%, rgba(27,42,94,0.9) 42%, rgba(27,42,94,0.72) 52%, rgba(27,42,94,0.5) 62%, rgba(27,42,94,0.28) 74%, rgba(27,42,94,0.1) 87%, rgba(27,42,94,0) 100%)' }} />
            {/* Top scrim: the nav is transparent over this image for the first 12px of
                scroll, and its light chrome needs something to sit against. */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,19,48,0.52) 0%, rgba(11,19,48,0.12) 12%, transparent 22%)' }} />
          </div>

          {/* Content: bottom-left, inside the same 40px gutter as every other section. */}
          <div className="aipea-hero-content" style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'flex-end', padding: '0 40px 76px' }}>
            <div style={{ ...INNER, width: '100%' }}>
              <motion.p {...fade(0.1)} style={{ fontFamily: dis, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orangeOnDark, marginBottom: S.sm }}>
                Founding membership now open
              </motion.p>

              {/* The rotating word owns line 1, so its varying width only affects the
                  natural ragged line end. "the" is pinned at the start of line 2 and
                  can never move. Sized so "the executive assistant" fits on one line. */}
              <motion.h1 {...fade(0.18)} className="aipea-hero-h1" style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(31px,4vw,60px)', lineHeight: 1.04, letterSpacing: '-0.025em', color: C.white, maxWidth: 900 }}>
                <RotatingWord words={['Certifying', 'Elevating', 'Connecting', 'Championing']} style={{ color: C.orange }} /><br />the <span style={{ color: C.orange }}>executive assistant</span><br />profession.
              </motion.h1>

              <motion.p {...fade(0.26)} className="aipea-hero-sub" style={{ fontFamily: bod, fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.65, color: 'rgba(255,255,255,0.74)', maxWidth: 460, marginTop: S.sm }}>
                Take your place. Claim your credential. Own your path.
              </motion.p>

              <motion.div {...fade(0.34)} style={{ marginTop: S.md }}>
                <Link href="/sign-up"
                  style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '13px 28px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                  Join AIPEA <ArrowRight size={15} />
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* Phase 2: scroll statement */}
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 12, opacity: stmtOpacity, y: stmtY, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <div className="aipea-hero-inner" style={{ width: '100%', padding: '0 40px' }}>
            <div style={{ ...INNER }}>
            <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 22, textAlign: 'center' }}>
              AIPEA membership
            </p>
            <h2 className="aipea-statement" style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(44px,6.6vw,100px)', lineHeight: 1.03, letterSpacing: '-0.035em', maxWidth: 1240, margin: '0 auto', textAlign: 'center', color: 'rgba(17,28,66,0.1)' }}>
              {statement.map((word, i) => (
                <ScrollWord key={`${word}-${i}`} index={i} progress={progress}>{word}</ScrollWord>
              ))}
            </h2>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// --- Marquee ------------------------------------------------------------------

const marqueeItemsB = ['Growth', 'Value', 'Impact', 'Recognition', 'Community', 'Mentorship', 'Certification', 'Advocacy']

// Client asked for both hero marquee bands gone. The services band is deleted; this
// values band is kept but off. Flip to true to restore it.
const SHOW_VALUES_MARQUEE: boolean = false

function MarqueeRow({ items, reverse = false, filled = false }: { items: string[]; reverse?: boolean; filled?: boolean }) {
  const row = (
    <div style={{ display: 'flex', flexShrink: 0 }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 28px', fontFamily: dis, fontWeight: 700, fontSize: filled ? 13 : 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: filled ? C.white : C.muted }}>
          {it}<span style={{ width: 5, height: 5, borderRadius: '50%', background: filled ? C.white : C.orange, marginLeft: 28, flexShrink: 0 }} />
        </span>
      ))}
    </div>
  )
  return (
    <div className={reverse ? 'aipea-marquee-rev' : 'aipea-marquee'} style={{ display: 'flex', width: 'max-content' }}>{row}{row}</div>
  )
}

function Marquee() {
  if (!SHOW_VALUES_MARQUEE) return null
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ background: C.orange, padding: '11px 0', overflow: 'hidden' }}>
        <MarqueeRow items={marqueeItemsB} reverse filled />
      </div>
    </div>
  )
}

// --- Editorial moment (ASAP / Nova-style typographic break) --------------------

function EditorialMoment() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' as `${number}px` })
  const reduced = useReducedMotion()
  return (
    <section style={{ padding: `${S.lg}px 40px ${S.section}px`, background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div ref={ref} style={{ ...INNER }}>
        {/* Full-width image with overlaid headline */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ position: 'relative', height: 480, borderRadius: 20, overflow: 'hidden', marginBottom: S.lg }}
        >
          <Image
            src="/images/conference/optimized/hero-banner.webp"
            alt="Professionals in a strategic boardroom meeting"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
          {/* Base dim */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,14,38,0.52)' }} />
          {/* Bottom gradient for text legibility */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,38,0.82) 0%, rgba(8,14,38,0.18) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48, textAlign: 'center' }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
              style={{ fontFamily: bod, fontSize: 14, color: 'rgba(255,255,255,0.72)', marginBottom: 16, letterSpacing: '0.04em' }}
            >
              Rewrite your role.
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: reduced ? 0 : 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
              style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(36px,5.5vw,72px)', lineHeight: 0.95, letterSpacing: '-0.035em', color: C.white }}
            >
              Go from support staff<br />to <span style={{ color: C.orange }}>strategic partner.</span>
            </motion.h2>
          </div>
        </motion.div>
        {/* Body text and CTA, centered below image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
          style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}
        >
          <p style={{ fontFamily: bod, fontSize: 16, lineHeight: 1.75, color: C.muted, marginBottom: 28 }}>
            Your title doesn&apos;t capture the value you bring. AIPEA equips you with credentials, CPD, and a pan-African network built for executive assistants who lead from behind the desk.
          </p>
          <Link href="/sign-up"
            style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '12px 24px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
            Join AIPEA today <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Moved down from the hero: on a full-bleed photo these sat too high in the
            frame to stay legible. They read better here on white anyway. */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
          className="aipea-vision-row"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: S.lg, maxWidth: 940, margin: `${S.xl}px auto 0`, paddingTop: S.md, borderTop: `1px solid ${C.border}` }}
        >
          {VISION.map(v => (
            <div key={v.label}>
              <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 17, color: C.orange, lineHeight: 1.25 }}>{v.label}</div>
              <div style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>{v.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// --- Pillar strip (ASAP homepage: Membership · Resources · Cert · Events) -----

const pillars = [
  { icon: Users,         label: 'Membership',    title: 'Connect, learn, and grow.',     desc: 'Join a pan-African community of executive professionals.', href: '#membership' },
  { icon: GraduationCap, label: 'Certification', title: 'Keep your career on standard.', desc: 'Earn credentials that employers and executives recognise.', href: '#membership' },
  { icon: BookOpen,      label: 'Resources',     title: 'Tools for the role you want.',  desc: 'Courses, CPD tracking, and a library built for EAs.', href: '#courses' },
  { icon: Calendar,      label: 'Events',        title: 'Peer-to-peer, face-to-face.',   desc: 'Annual conference and regional meetups across Africa.', href: '#events' },
]

function PillarStrip() {
  return (
    <section style={{ padding: `0 40px ${S.section}px`, background: C.bg }}>
      <div style={INNER}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="aipea-pillars-grid">
          {pillars.map((p, i) => {
            const Icon = p.icon
            const pillarImages = [
              '/images/conference/optimized/gallery-01.webp',
              '/images/conference/optimized/gallery-02.webp',
              '/images/conference/optimized/gallery-03.webp',
              '/images/conference/optimized/gallery-04.webp',
            ]
            return (
              <ScrollReveal key={p.label} delay={0.06 * i}>
                <a href={p.href} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 26px', borderRadius: 18, border: `1px solid ${C.border}`, background: C.surface, textDecoration: 'none', transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.boxShadow = '0 12px 40px rgba(27,42,94,0.07)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
                  {/* Subtle background image */}
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.04, zIndex: 0 }}>
                    <Image
                      src={pillarImages[i]}
                      alt=""
                      fill
                      sizes="300px"
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  </div>
                  <div style={{ position: 'relative', zIndex: 1, width: 44, height: 44, borderRadius: 12, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', marginBottom: 20 }}>
                    <Icon size={20} color={C.orange} />
                  </div>
                  <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginBottom: 10 }}>{p.label}</p>
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.text, marginBottom: 10 }}>{p.title}</h3>
                  <p style={{ fontFamily: bod, fontSize: 13, lineHeight: 1.65, color: C.muted, flex: 1 }}>{p.desc}</p>
                  <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 12, color: C.orange, marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Learn more <ArrowRight size={13} />
                  </span>
                </a>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// --- Event highlight (ASAP in-person event cards) -----------------------------

function useCountdown(target: Date) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now())
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return left
}

const CONFERENCE_DATE = new Date('2026-09-15T09:00:00')

function EventHighlight() {
  const { d, h, m, s } = useCountdown(CONFERENCE_DATE)
  const units = [['Days', d], ['Hrs', h], ['Min', m], ['Sec', s]] as const
  return (
    <section id="events" style={{ ...SECTION, background: C.navyDark, color: C.white, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 78% 30%, rgba(232,80,26,0.2), transparent 40%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
        <Image
          src="/images/conference/optimized/events-hero.webp"
          alt="Professional conference background"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>
      <div style={{ ...INNER, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="aipea-event-grid">
          <ScrollReveal>
            <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Join us in person</p>
            <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1.02, letterSpacing: '-0.03em', marginBottom: 16 }}>
              AIPEA Annual Conference
            </h2>
            <p style={{ fontFamily: bod, fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 8 }}>Accra, Ghana · September 2026</p>
            <p style={{ fontFamily: bod, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 420 }}>
              Connect with executive assistants across Africa. Elevate your skills, expand your network, and learn from industry leaders.
            </p>
            <a href="#contact"
              style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.navyDark, background: C.white, padding: '13px 26px', borderRadius: 8, textDecoration: 'none', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
              Register interest <ArrowRight size={15} />
            </a>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', padding: '36px 32px' }}>
              <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>Conference opens in</p>
              <div className="aipea-countdown" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {units.map(([label, val]) => (
                  <div key={label} style={{ textAlign: 'center', padding: '18px 8px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1, letterSpacing: '-0.04em', color: val > 0 || label === 'Sec' ? C.white : 'rgba(255,255,255,0.25)' }}>
                      {String(val).padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// --- Pathway strip (ASAP “What are you waiting for?”) -------------------------

const pathwaySteps = [
  { n: '1', title: 'Join AIPEA',       desc: 'Choose your tier and apply.', href: '/sign-up' },
  { n: '2', title: 'Get certified',   desc: 'Earn your AIPEA credential.', href: '#membership' },
  { n: '3', title: 'Attend conference', desc: 'Meet peers across Africa.', href: '#events' },
]

function PathwayStrip() {
  return (
    <section style={{ padding: `${S.xl}px 40px`, background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={INNER}>
        <ScrollReveal>
          <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: C.text, letterSpacing: '-0.02em', marginBottom: S.md, textAlign: 'center' }}>
            What are you waiting for?
          </p>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="aipea-pathway-grid">
          {pathwaySteps.map((step, i) => (
            <ScrollReveal key={step.n} delay={0.08 * i}>
              <Link href={step.href}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 18, padding: '28px 26px', borderRadius: 16, background: C.bg, border: `1px solid ${C.border}`, textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,80,26,0.35)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,42,94,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}>
                <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 32, lineHeight: 1, color: C.orange, letterSpacing: '-0.04em', flexShrink: 0 }}>{step.n}</span>
                <div>
                  <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 18, color: C.text, letterSpacing: '-0.01em' }}>{step.title}</div>
                  <div style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.55 }}>{step.desc}</div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- About --------------------------------------------------------------------

function About() {
  return (
    <section id="about" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader align="center" statement="Africa's home for executive professionals." aside="One membership. Everything you need." />
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 18, alignItems: 'stretch' }} className="aipea-about-visual-grid">
            <Reveal from="left"><TiltCard><CredentialCard title="Professional recognition for the people behind executive performance." tier="Institutional standard" number="AIPEA-STD-001" /></TiltCard></Reveal>
            <Reveal from="right" delay={0.12} style={{ display: 'flex', flexDirection: 'column', border: `1px solid ${C.border}`, borderRadius: 22, background: C.surface, padding: 0, position: 'relative', overflow: 'hidden' }}>
              {/* Community photo element */}
              <div style={{ position: 'relative', height: 200, background: 'linear-gradient(135deg, #0d1831 0%, #1B2A5E 55%, #24396e 100%)', flexShrink: 0, overflow: 'hidden' }}>
                <Image
                  src="/images/conference/optimized/events-stage.webp"
                  alt="AIPEA members in a boardroom meeting"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.7 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(27,42,94,0.45) 0%, rgba(27,42,94,0.35) 55%, rgba(36,57,110,0.4) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 12px)' }} />
                <div style={{ position: 'absolute', top: 20, left: 24, fontFamily: dis, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', zIndex: 2 }}>
                  AIPEA Community · 2025
                </div>
                <div style={{ position: 'absolute', bottom: 24, left: 24, display: 'flex', alignItems: 'center', zIndex: 2 }}>
                  {([['AA', C.orange], ['JO', '#1B2A5E'], ['NK', '#059669'], ['FM', '#7c3aed'], ['TM', '#0891b2']] as [string, string][]).map(([ini, color], i) => (
                    <div key={ini} style={{ width: 40, height: 40, borderRadius: '50%', background: color, border: '2.5px solid rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 11, color: C.white, marginLeft: i > 0 ? -14 : 0, zIndex: 10 - i, position: 'relative' }}>{ini}</div>
                  ))}
                  <div style={{ marginLeft: 16 }}>
                    <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 15, color: C.white, lineHeight: 1 }}>Founding cohort</div>
                    <div style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>now forming across Africa</div>
                  </div>
                </div>
              </div>

              {/* Text section */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, padding: 'clamp(28px,3.5vw,44px)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: '50%', border: `1px solid ${C.border}`, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18 }}>Our purpose</p>
                  <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(24px,2.8vw,40px)', lineHeight: 1.12, letterSpacing: '-0.02em', color: C.text }}>
                    Where assistants and the leaders they support succeed together.
                  </p>
                </div>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.text, border: `1px solid ${C.border}`, borderRadius: 999, padding: '8px 16px' }}>Rooted in Ghana</span>
                  <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.text, border: `1px solid ${C.border}`, borderRadius: 999, padding: '8px 16px' }}>Serving Africa</span>
                </div>
              </div>
            </Reveal>
          </div>
      </div>
    </section>
  )
}

// --- Core values (from the AIPEA brochure) -------------------------------------

const coreValues = [
  { n: '01', title: 'Growth', words: ['Learn', 'Advance', 'Lead'] },
  { n: '02', title: 'Value',  words: ['Excellence', 'Integrity', 'You first'] },
  { n: '03', title: 'Impact', words: ['Empower', 'Connect', 'Champion'] },
]

function ValueCard({ value }: { value: (typeof coreValues)[number] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <TiltCard>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', overflow: 'hidden', height: '100%', minHeight: 320, borderRadius: 22,
          border: `1px solid ${hovered ? 'rgba(255,255,255,0.14)' : C.border}`,
          background: hovered ? `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDark} 100%)` : C.surface,
          color: hovered ? C.white : C.text, padding: 34,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: hovered ? '0 32px 80px rgba(27,42,94,0.32)' : '0 1px 0 rgba(17,28,66,0.03)',
          transform: hovered ? 'translateY(-10px) scale(1.035)' : 'translateY(0) scale(1)',
          transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), color 0.5s ease',
        }}>
        <div className="aipea-spin" style={{
          position: 'absolute', top: -54, right: -54, width: 180, height: 180, borderRadius: '50%',
          border: `1px dashed ${hovered ? 'rgba(255,255,255,0.2)' : 'rgba(232,80,26,0.28)'}`,
          transition: 'border-color 0.5s ease',
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', marginTop: 6,
            background: C.orange,
            boxShadow: hovered ? '0 0 0 6px rgba(232,80,26,0.18)' : '0 0 0 0 rgba(232,80,26,0)',
            transition: 'box-shadow 0.5s ease',
          }} />
          <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 44, letterSpacing: '-0.05em', color: hovered ? 'rgba(255,255,255,0.18)' : C.elevated, transition: 'color 0.5s ease' }}>{value.n}</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 14 }}>{value.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {value.words.map((w, wi) => (
              <motion.span key={w}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: wi * 0.12, ease: EASE }}
                style={{ fontFamily: dis, fontWeight: 700, fontSize: 19, letterSpacing: '-0.01em', color: hovered ? 'rgba(255,255,255,0.92)' : C.text, transition: 'color 0.5s ease' }}>
                <span style={{ color: C.orange, marginRight: 9 }}>·</span>{w}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

function CoreValues() {
  return (
    <section id="values" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader align="center" statement="The values behind the standard." aside="Three principles. Everything we build." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }} className="aipea-values-grid">
          {coreValues.map((v, i) => (
            <ScrollReveal key={v.title} delay={0.1 * i}>
              <ValueCard value={v} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Pricing breakdown (detailed tier comparison) -----------------------------

const priceTiers: PriceTier[] = [
  { name: 'Associate',    blurb: 'For emerging EAs',    price: 'Free',   cadence: '', href: '/sign-up?tier=Associate' },
  { name: 'Professional', blurb: 'For established EAs',  price: '₵1,200', cadence: '/yr', href: '/sign-up?tier=Professional', featured: true },
  { name: 'Fellow',       blurb: 'For senior leaders',  price: '₵2,500', cadence: '/yr', href: '/sign-up?tier=Fellow' },
]

const priceRows: PriceRow[] = [
  { feature: 'Member directory listing',              values: [true, true, true] },
  { feature: 'CPD hours tracker',                     values: [true, true, true] },
  { feature: 'Digital membership certificate',        values: [true, true, true] },
  { feature: 'Member events & community',             values: [true, true, true] },
  { feature: 'Annual conference discount',            values: ['10%', '25%', '40%'] },
  { feature: 'Course library access',                 values: [false, true, true] },
  { feature: 'Priority conference booking',           values: [false, true, true] },
  { feature: 'Voting rights in AIPEA elections',      values: [false, true, true] },
  { feature: 'Fellowship credential (post-nominals)', values: [false, false, true] },
  { feature: '1:1 mentorship matching',               values: [false, false, true] },
  { feature: 'Speaking & committee opportunities',    values: [false, false, true] },
]

function PricingSection() {
  return (
    <section id="membership" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <SectionHeader align="center" statement="Choose the membership that fits your stage." aside="Every tier includes the essentials, compared line by line." />
        <PricingBreakdown tiers={priceTiers} rows={priceRows} note="All payments processed securely via Paystack. Annual renewal. Cancel anytime." />
      </div>
    </section>
  )
}

// --- Courses ------------------------------------------------------------------

const courses = [
  { title: 'Executive Communication Mastery',  desc: 'Influence without authority.', type: 'Workshop',  when: 'Q2 2026' },
  { title: 'Calendar & Priorities Management', desc: 'Protect executive time.',       type: 'Seminar',   when: 'Q3 2026' },
  { title: 'Board & C-Suite Support',          desc: 'Support senior leadership.',     type: 'Cert prep', when: 'Q4 2026' },
]

function Courses() {
  return (
    <section id="courses" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader align="center" nowrap statement="A full course library. Coming soon." aside="Members get first access." />
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.2fr', gap: 22, alignItems: 'stretch' }} className="aipea-course-showcase">
          <Reveal from="left">
            <div style={{ minHeight: 520, borderRadius: 24, padding: 38, background: `linear-gradient(145deg, ${C.navyDark} 0%, ${C.navy} 100%)`, color: C.white, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
                <Image
                  src="/images/conference/optimized/resources-hero.webp"
                  alt="Professional training environment"
                  fill
                  sizes="600px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 20%, rgba(232,80,26,0.28), transparent 34%)' }} />
              <div className="aipea-spin-rev" style={{ position: 'absolute', bottom: -80, right: -80, width: 260, height: 260, borderRadius: '50%', border: '1px dashed rgba(232,80,26,0.32)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>Course library</p>
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(32px,4vw,60px)', lineHeight: 0.95, letterSpacing: '-0.05em' }}>
                    A curriculum built for Africa&apos;s executive assistants.
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 40 }}>
                  {['CPD Ledger', 'Executive Tools', 'Board Support', 'Credential Path'].map((item, ci) => (
                    <motion.div key={item}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: ci * 0.1, ease: EASE }}
                      style={{ position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 16, background: 'rgba(255,255,255,0.04)' }}>
                      <Lock size={13} color={C.orange} />
                      <p style={{ marginTop: 16, fontFamily: dis, fontWeight: 700, fontSize: 14 }}>{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gap: 14 }}>
            {courses.map((c, i) => (
              <Reveal key={c.title} from="right" delay={0.08 * i}>
                <div className="aipea-course-item" style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 22, alignItems: 'center', padding: '26px 30px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, minHeight: 160, transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.boxShadow = '0 12px 40px rgba(27,42,94,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ fontFamily: dis, fontSize: 42, fontWeight: 800, color: i === 1 ? C.orange : C.elevated, letterSpacing: '-0.08em' }}>0{i + 1}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', background: 'rgba(232,80,26,0.08)', color: C.orange, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, fontFamily: dis }}>{c.type}</span>
                      <span style={{ fontFamily: bod, fontSize: 12, color: C.faint }}>{c.when}</span>
                    </div>
                    <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, color: C.text, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{c.title}</h3>
                    <p style={{ fontFamily: bod, marginTop: 8, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{c.desc}</p>
                  </div>
                  <div className="aipea-course-lock" style={{ width: 44, height: 44, borderRadius: '50%', background: C.surface, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Lock size={14} color={C.orange} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Process ------------------------------------------------------------------

const steps = [
  { name: 'Choose your tier',         desc: 'Associate, Professional, or Fellow.', stat: '3 tiers.'             },
  { name: 'Complete your details',    desc: 'Under 5 minutes. No waiting list.', stat: '< 5 minutes.'           },
  { name: 'Pay securely via Paystack', desc: 'Cards and mobile money. Cancel any time.', stat: 'Paystack secured.' },
  { name: 'Get your credentials',     desc: 'Certificate and member ID, instantly.', stat: 'Instant.'            },
]

function Process() {
  const [open, setOpen] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (paused || reduced) return
    const id = setInterval(() => setOpen(o => (o + 1) % steps.length), 3800)
    return () => clearInterval(id)
  }, [paused, reduced])
  return (
    <section id="process" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <SectionHeader align="center" statement="From sign-up to credentialed member in one sitting." aside="Active before you close the tab." />
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 22, alignItems: 'stretch' }} className="aipea-process-grid">
          <Reveal from="left" delay={0.08}>
            <div style={{ minHeight: 580, borderRadius: 24, background: C.bg, border: `1px solid ${C.border}`, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              {/* Subtle background image */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.03, zIndex: 0 }}>
                <Image
                  src="/images/conference/optimized/membership-community.webp"
                  alt=""
                  fill
                  sizes="500px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>Membership activation</p>
                <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,3.8vw,58px)', lineHeight: 0.95, letterSpacing: '-0.05em', color: C.text }}>
                  From applicant to recognized professional.
                </h3>
              </div>
              <div style={{ marginTop: 40, borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.surface }}>
                {[['Tier', 'Membership chosen', '01'], ['Details', 'Profile completed', '02'], ['Payment', 'Paystack confirmed', '03'], ['Credential', 'Member ID issued', '04']].map(([title, detail, number], index) => (
                  <div key={title} className="aipea-process-item" style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 16, alignItems: 'center', padding: '20px 22px', borderBottom: index < 3 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ fontFamily: dis, fontSize: 30, fontWeight: 800, color: index === 3 ? C.orange : C.elevated, letterSpacing: '-0.06em' }}>{number}</span>
                    <span>
                      <strong style={{ display: 'block', fontFamily: dis, color: C.text, fontSize: 16 }}>{title}</strong>
                      <small style={{ display: 'block', fontFamily: bod, color: C.muted, marginTop: 4, fontSize: 12 }}>{detail}</small>
                    </span>
                    <span className="aipea-process-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: index === 3 ? C.orange : C.border, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal from="right" delay={0.16}>
            <div style={{ height: '100%', display: 'grid', gap: 12 }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              {steps.map((st, i) => {
                const active = open === i
                return (
                  <div key={st.name} onClick={() => setOpen(i)}
                    style={{ padding: '26px 28px', border: `1px solid ${active ? 'rgba(232,80,26,0.35)' : C.border}`, borderRadius: 18, background: active ? C.bg : 'transparent', cursor: 'pointer', transition: 'background 0.22s, border-color 0.22s', boxShadow: active ? '0 8px 30px rgba(27,42,94,0.07)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                      <div>
                        <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: active ? C.orange : C.faint }}>Step {String(i + 1).padStart(2, '0')}</div>
                        <div style={{ fontFamily: dis, fontWeight: 800, fontSize: active ? 24 : 18, color: active ? C.text : C.muted, marginTop: 6, letterSpacing: '-0.02em', transition: 'font-size 0.22s' }}>{st.name}</div>
                      </div>
                      <Plus size={18} style={{ color: active ? C.orange : C.faint, transform: active ? 'rotate(45deg)' : 'none', transition: '0.25s', flexShrink: 0, marginTop: 4 }} />
                    </div>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} style={{ overflow: 'hidden' }}>
                          <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, lineHeight: 1.75, maxWidth: 420, marginTop: 12 }}>{st.desc}</p>
                          <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, color: C.orange, letterSpacing: '0.08em', marginTop: 10 }}>{st.stat}</p>
                          <div style={{ height: 2, background: C.border, borderRadius: 2, marginTop: 16, overflow: 'hidden' }}>
                            <motion.div key={`${open}-${paused}`} initial={{ width: '0%' }} animate={{ width: paused || reduced ? '100%' : ['0%', '100%'] }} transition={{ duration: paused || reduced ? 0 : 3.8, ease: 'linear' }} style={{ height: '100%', background: C.orange }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// --- Contact ------------------------------------------------------------------

const benefits = [
  'Official AIPEA membership certificate',
  'Digital member directory listing',
  'CPD hours tracker',
  'Access to member events and conference',
  'Course library, first access (Professional tier)',
]

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const inputStyle: React.CSSProperties = { width: '100%', background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '13px 16px', fontSize: 14, color: C.text, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s', fontFamily: bod }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint, marginBottom: 7 }
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = C.orange
    e.target.style.boxShadow = '0 0 0 4px rgba(232,80,26,0.12)'
    e.target.style.background = C.bg
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = C.border
    e.target.style.boxShadow = 'none'
    e.target.style.background = C.surface
  }
  const onHoverIn = (e: React.MouseEvent<HTMLInputElement | HTMLSelectElement>) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = C.borderHover }
  const onHoverOut = (e: React.MouseEvent<HTMLInputElement | HTMLSelectElement>) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = C.border }

  return (
    <section id="contact" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <ScrollReveal>
          <div style={{ maxWidth: 640, marginBottom: S.headerGap }}>
            <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(48px,7vw,92px)', color: C.orange, lineHeight: 0.9, letterSpacing: '-0.05em' }}>Join AIPEA.</div>
            <p style={{ fontFamily: bod, fontSize: 16, lineHeight: 1.7, color: C.muted, marginTop: S.sm }}>Pick your tier, pay securely, and your credential is issued on the spot.</p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: S.md }} className="aipea-contact-grid">
          <ScrollReveal delay={0.08}>
            <div style={{ borderRadius: 24, background: C.bg, border: `1px solid ${C.border}`, padding: 34, height: '100%', position: 'relative', overflow: 'hidden' }}>
              {/* Subtle benefits background */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.02, zIndex: 0 }}>
                <Image
                  src="/images/conference/optimized/about-story.webp"
                  alt=""
                  fill
                  sizes="500px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange, marginBottom: 20 }}>What you get</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {benefits.map(b => (
                    <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontFamily: bod, fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
                      <Check size={15} color={C.orange} style={{ flexShrink: 0, marginTop: 3 }} />{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <div style={{ background: C.bg, border: `1px solid ${C.borderHover}`, borderRadius: 24, padding: 42, boxShadow: '0 24px 64px rgba(27,42,94,0.12)' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(232,80,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={26} color={C.orange} />
                  </div>
                  <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 20, color: C.text }}>Details received</div>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginTop: 10 }}>Complete payment and your membership activates immediately.</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: '-0.01em' }}>Tell us about yourself</div>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginBottom: 28, marginTop: 6 }}>Takes about two minutes.</p>
                  <div className="aipea-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div><label style={labelStyle}>Full name</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} placeholder="Adwoa Mensah" /></div>
                    <div><label style={labelStyle}>Email address</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} placeholder="you@email.com" /></div>
                  </div>
                  <div style={{ marginBottom: 16 }}><label style={labelStyle}>Country</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} placeholder="Ghana" /></div>
                  <div style={{ marginBottom: 16 }}><label style={labelStyle}>Membership tier</label>
                    <select style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}><option>Associate</option><option>Professional</option><option>Fellow</option></select>
                  </div>
                  <div style={{ marginBottom: 24 }}><label style={labelStyle}>How did you hear about AIPEA?</label>
                    <select style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}><option>Social media</option><option>Colleague referral</option><option>Search engine</option><option>Event or conference</option><option>Other</option></select>
                  </div>
                  <Magnetic strength={0.25} style={{ width: '100%' }}>
                    <button onClick={() => setSubmitted(true)}
                      style={{ width: '100%', background: C.orange, color: C.white, fontFamily: dis, fontWeight: 700, fontSize: 14, padding: 14, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                      Apply for membership <ArrowRight size={15} />
                    </button>
                  </Magnetic>
                  <p style={{ fontFamily: bod, fontSize: 11, color: C.faint, textAlign: 'center', marginTop: 16 }}>Secure payment via Paystack. Membership activates immediately.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// --- CTA Banner ---------------------------------------------------------------

function CTABanner() {
  const chunk = (
    <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, padding: '0 28px' }}>
      Where <span style={{ color: C.navyDark, padding: '0 6px' }}>executive excellence</span> meets Africa.
      <span style={{ padding: '0 24px' }}>Join AIPEA and <span style={{ color: C.navyDark }}>elevate your career.</span></span>
    </span>
  )
  return (
    <div style={{ background: C.orange, padding: '20px 0', overflow: 'hidden' }}>
      <div className="aipea-marquee-fast" style={{ display: 'flex', width: 'max-content' }}>
        {chunk}{chunk}{chunk}{chunk}
      </div>
    </div>
  )
}

// --- Leadership Section -------------------------------------------------------

// PLACEHOLDER COPY. Names, titles and bios are all stand-ins pending real copy from
// AIPEA; the photographs are of real people, so nothing here should ship as-is.
const leaders = [
  {
    name: 'Ama Mensah',
    title: 'Founder & Executive Director',
    image: '/images/conference/optimized/leader-ama.webp',
    bio: 'Ama spent two decades supporting chief executives across Ghana\'s banking and energy sectors before founding AIPEA. She built the institute around a conviction formed over those years: that the people holding the executive office together were doing professional work without professional standing. She leads AIPEA\'s advocacy with employers and its work on the credential framework.',
  },
  {
    name: 'Samuel Boateng',
    title: 'Director, Professional Standards',
    image: '/images/conference/optimized/leader-samuel.webp',
    bio: 'Samuel oversees the competence framework that sits behind every AIPEA credential, from the assessment rubric to the CPD requirements that keep it current. He came to the institute from corporate learning and development, where he spent years watching capable assistants get passed over for lack of anything verifiable to point to. He is responsible for making sure the credential means the same thing in every market.',
  },
  {
    name: 'Nana Adjei',
    title: 'Head of Member Experience',
    image: '/images/conference/optimized/leader-nana.webp',
    bio: 'Nana runs the programmes members actually touch: the directory, the mentorship pairings, the regional meetups and the annual conference. Her focus is the first year of membership, on the principle that a credential is only worth what the community around it is worth. She joined AIPEA from association management and events.',
  },
]

function LeadershipSection() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const leader = leaders[i]

  // Long enough to read a four-line bio without feeling hurried; pauses on hover or
  // focus, and stops for good once someone picks a leader themselves.
  const [userPicked, setUserPicked] = useState(false)
  useEffect(() => {
    if (paused || reduced || userPicked) return
    const id = setInterval(() => setI(v => (v + 1) % leaders.length), 11000)
    return () => clearInterval(id)
  }, [paused, reduced, userPicked])

  const go = (next: number) => { setUserPicked(true); setI((next + leaders.length) % leaders.length) }

  return (
    <section style={{ ...SECTION, background: C.navyDark }}>
      <div style={INNER}>
        <ScrollReveal>
          <div style={{ maxWidth: 640, marginBottom: S.headerGap }}>
            <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange, marginBottom: S.xs }}>Leadership</p>
            <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,3.5vw,48px)', color: C.white, lineHeight: 1.1, letterSpacing: '-0.03em' }}>Visionaries leading the profession forward.</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div
            className="aipea-leader-rotator"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            style={{ display: 'grid', gridTemplateColumns: '0.72fr 1fr', gap: S.lg, alignItems: 'stretch' }}
          >
            {/* Portrait */}
            <div style={{ position: 'relative', minHeight: 460, borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 420px"
                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  />
                </motion.div>
              </AnimatePresence>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,38,0.5) 0%, transparent 45%)', pointerEvents: 'none' }} />
            </div>

            {/* Bio. Top-aligned rather than space-between: the bios are short, and
                pushing the controls to the portrait's full height opened a dead gap. */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                >
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(26px,2.6vw,36px)', color: C.white, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{leader.name}</h3>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.orange, fontWeight: 600, marginTop: 8 }}>{leader.title}</p>
                  <p style={{ fontFamily: bod, fontSize: 15.5, lineHeight: 1.8, color: 'rgba(255,255,255,0.62)', marginTop: S.md, maxWidth: 620 }}>{leader.bio}</p>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S.md, marginTop: S.lg, paddingTop: S.md, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: S.md, flexWrap: 'wrap' }}>
                  {leaders.map((l, idx) => (
                    <button
                      key={l.name}
                      onClick={() => go(idx)}
                      aria-current={idx === i}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                        fontFamily: dis, fontWeight: 700, fontSize: 12, letterSpacing: '0.04em',
                        color: idx === i ? C.white : 'rgba(255,255,255,0.38)',
                        borderBottom: `2px solid ${idx === i ? C.orange : 'transparent'}`,
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([['Previous leader', -1, ChevronLeft], ['Next leader', 1, ChevronRight]] as const).map(([label, dir, Icon]) => (
                    <button
                      key={label}
                      onClick={() => go(i + dir)}
                      aria-label={label}
                      style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', background: 'none', color: C.white, cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'background 0.2s, border-color 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.orange; e.currentTarget.style.borderColor = C.orange }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// --- Root ---------------------------------------------------------------------

export function AIPEA() {
  return (
    <div className="aipea" style={{ background: C.bg, color: C.text }}>
      <SiteNav overDark />
      <Hero />
      <Marquee />
      <EditorialMoment />
      <PillarStrip />
      <About />
      <CoreValues />
      <PricingSection />
      <EventHighlight />
      <Courses />
      <Process />
      <LeadershipSection />
      <PathwayStrip />
      <Contact />
      <CTABanner />
      <SiteFooter />
    </div>
  )
}
