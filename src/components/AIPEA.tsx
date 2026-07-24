'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  type Transition,
} from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Plus, Check, ChevronLeft, ChevronRight, Lock, Users, BookOpen, Calendar, GraduationCap, Mail, MapPin } from 'lucide-react'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'
import { PricingBreakdown, type PriceTier, type PriceRow } from '@/components/site/PageKit'
import { CONFERENCE, CONTACT, MEMBERSHIP_BENEFITS, STRANDS, LEADERSHIP, DNA } from '@/lib/facts'

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
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
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
      initial={{ opacity: 0, ...offset[from] }}
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
    initial: { opacity: 0, y: 22 },
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

// --- Hero ---------------------------------------------------------------------

const HERO_SLIDES = [
  {
    src: '/images/conference/optimized/hero-main-alt.webp',
    alt: 'Attendees gathered in the PA Conference hall',
    objectPosition: 'center center',
  },
  {
    src: '/images/conference/optimized/hero-crowd-1.jpg',
    alt: 'Delegates seated across the PA Conference hall in Accra',
    objectPosition: 'center 55%',
  },
  {
    src: '/images/conference/optimized/hero-crowd-2.jpg',
    alt: 'A full hall of delegates facing the main stage',
    objectPosition: 'center 55%',
  },
  {
    src: '/images/conference/optimized/hero-crowd-3.jpg',
    alt: 'Delegates at their tables during a conference session',
    objectPosition: 'center 55%',
  },
  {
    src: '/images/conference/optimized/hero-crowd-4.jpg',
    alt: 'The audience watching a speaker at the PA Conference',
    objectPosition: 'center 55%',
  },
]

function Hero() {
  const [heroIndex, setHeroIndex] = useState(0)
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE } satisfies Transition,
  })

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="aipea-hero-section" style={{ position: 'relative', overflow: 'hidden', background: C.white }}>

      {/* Soft orange glow bottom-right */}
      <div className="aipea-float" style={{ position: 'absolute', right: '8%', bottom: '10%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.22), rgba(232,80,26,0.06) 42%, transparent 70%)', opacity: 0.14, filter: 'blur(2px)', pointerEvents: 'none', zIndex: 1 }} />

      <div className="aipea-hero-visual" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Every slide stays mounted and crossfades on opacity. Swapping a single
            <Image> via AnimatePresence meant each photo only began downloading at
            the moment it became visible, so the transition showed a grey frame
            while it fetched. Mounted-and-eager costs one upfront load instead. */}
        {HERO_SLIDES.map((slide, i) => (
          <motion.div
            key={slide.src}
            initial={false}
            animate={{ opacity: i === heroIndex ? 1 : 0 }}
            transition={{ duration: 1.1, ease: EASE }}
            style={{ position: 'absolute', inset: 0 }}
            aria-hidden={i !== heroIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: slide.objectPosition }}
              {...(i === 0 ? { priority: true } : { loading: 'eager' as const })}
            />
          </motion.div>
        ))}

        {/* A light editorial grade keeps the conference photo visible while giving
            the hero copy enough contrast. */}
        <div style={{ position: 'absolute', inset: 0, background: C.navy, mixBlendMode: 'multiply', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(12,20,50,0.8) 0%, rgba(18,28,64,0.66) 34%, rgba(18,28,64,0.3) 64%, rgba(18,28,64,0.12) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,16,40,0.48) 0%, rgba(10,16,40,0.22) 34%, transparent 68%)' }} />
        {/* Top scrim: the nav is transparent over this image for the first 12px of
            scroll, and its light chrome needs something to sit against. */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,19,48,0.36) 0%, rgba(11,19,48,0.08) 14%, transparent 24%)' }} />
      </div>

      {/* Content: center-left, balanced by a compact conference card on the right. */}
      <div className="aipea-hero-content" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', minHeight: 'inherit', padding: '128px 40px 88px' }}>
        <div style={{ ...INNER, width: '100%' }}>
          <div className="aipea-hero-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.95fr) minmax(260px, 0.45fr)', gap: 48, alignItems: 'center' }}>
            <div>
              <motion.p {...fade(0.1)} style={{ fontFamily: dis, fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFB08F', marginBottom: S.sm, textShadow: '0 2px 16px rgba(0,0,0,0.42)' }}>
                Founding membership now open
              </motion.p>

              <motion.h1 {...fade(0.18)} className="aipea-hero-h1" style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(38px,5vw,76px)', lineHeight: 0.98, letterSpacing: '-0.04em', color: C.white, maxWidth: 860, textShadow: '0 4px 28px rgba(0,0,0,0.42)' }}>
                Africa&apos;s professional home for <span style={{ color: '#FF9A70' }}>Personal &amp; Executive Assistants.</span>
              </motion.h1>

              <motion.p {...fade(0.26)} className="aipea-hero-sub" style={{ fontFamily: bod, fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.65, color: 'rgba(255,255,255,0.9)', maxWidth: 560, marginTop: S.sm, textShadow: '0 2px 18px rgba(0,0,0,0.42)' }}>
                A member-based institute for learning, certification, networking, and professional growth across Africa.
              </motion.p>

              <motion.div {...fade(0.34)} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: S.md }}>
                <Link href="/sign-up"
                  style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '13px 28px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                  Join AIPEA <ArrowRight size={15} />
                </Link>
                <Link href="#membership" style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, border: '1px solid rgba(255,255,255,0.34)', padding: '12px 24px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                  Explore membership
                </Link>
              </motion.div>

              <motion.div {...fade(0.5)} className="aipea-hero-values" style={{ marginTop: S.xl }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(10,16,40,0.26)', backdropFilter: 'blur(12px)', borderRadius: 999, padding: '10px 18px', fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.76)' }}>
                  <span>Growth</span>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.orangeOnDark }} />
                  <span>Value</span>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.orangeOnDark }} />
                  <span>Impact</span>
                </div>
              </motion.div>
            </div>

            <motion.aside {...fade(0.42)} className="aipea-hero-card" style={{ justifySelf: 'end', width: 'min(100%, 340px)', borderRadius: 22, border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(10,16,40,0.46)', backdropFilter: 'blur(16px)', padding: 24, color: C.white }}>
              <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orangeOnDark, marginBottom: 16 }}>
                Confirmed event
              </p>
              <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 26, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 10 }}>
                {CONFERENCE.name}
              </h2>
              <p style={{ fontFamily: bod, fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
                {CONFERENCE.dateLabel}
                <br />
                {CONFERENCE.venue}, {CONFERENCE.city}
              </p>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.16)', margin: '20px 0' }} />
              <p style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.6 }}>
                Professional growth · Community · Impact
              </p>
            </motion.aside>
          </div>
        </div>
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
  return (
    <section style={{ padding: `${S.lg}px 40px ${S.section}px`, background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div ref={ref} style={{ ...INNER }}>
        {/* Full-width image with overlaid headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
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
              initial={{ opacity: 0, y: 28 }}
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
            Your title doesn&apos;t capture the value you bring. AIPEA equips you with accountability-based designations and a pan-African network built for the professionals who hold the executive office together.
          </p>
          <Link href="/sign-up"
            style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '12px 24px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
            Join AIPEA today <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// --- Pillar strip (ASAP homepage: Membership · Resources · Cert · Events) -----

const pillars = [
  { icon: Users,         label: 'Membership',    title: 'Connect, learn, and grow.',     desc: 'Join a pan-African community of executive professionals.', href: '#membership' },
  { icon: GraduationCap, label: 'Certification', title: 'Certified on scope, not years.', desc: 'Six designations across three professional strands.', href: '/certification' },
  { icon: BookOpen,      label: 'Resources',     title: 'Built to be deployed.',          desc: 'Every module ends in an artifact your employer can use.', href: '/resources' },
  { icon: Calendar,      label: 'Events',        title: 'Peer-to-peer, face-to-face.',    desc: `${CONFERENCE.name} — ${CONFERENCE.dateLabel}, Accra.`, href: '#events' },
]

function PillarStrip() {
  return (
    <section style={{ padding: `0 40px ${S.section}px`, background: C.bg }}>
      <div style={INNER}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="aipea-pillars-grid">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <ScrollReveal key={p.label} delay={0.06 * i}>
                {/* Solid navy cards: the client didn't want the off-white/grey
                    surface reading flat against the white page. A navy gradient with
                    an orange corner glow gives the strip depth and puts it on-brand. */}
                <a href={p.href} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 26px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.09)', background: `linear-gradient(155deg, ${C.navy} 0%, ${C.navyDark} 100%)`, textDecoration: 'none', transition: 'box-shadow 0.24s, transform 0.24s, border-color 0.24s', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(17,28,66,0.14)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,80,26,0.5)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(17,28,66,0.28)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(17,28,66,0.14)'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.28), transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', zIndex: 1, width: 44, height: 44, borderRadius: 12, background: 'rgba(232,80,26,0.16)', border: '1px solid rgba(232,80,26,0.28)', display: 'grid', placeItems: 'center', marginBottom: 20 }}>
                    <Icon size={20} color={C.orange} />
                  </div>
                  <p style={{ position: 'relative', zIndex: 1, fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orangeOnDark, marginBottom: 10 }}>{p.label}</p>
                  <h3 style={{ position: 'relative', zIndex: 1, fontFamily: dis, fontWeight: 800, fontSize: 20, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.white, marginBottom: 10 }}>{p.title}</h3>
                  <p style={{ position: 'relative', zIndex: 1, fontFamily: bod, fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.62)', flex: 1 }}>{p.desc}</p>
                  <span style={{ position: 'relative', zIndex: 1, fontFamily: dis, fontWeight: 700, fontSize: 12, color: C.orangeOnDark, marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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

// Sourced from facts.ts so the countdown, the hero card and the events page can
// never drift apart again.
const CONFERENCE_DATE = CONFERENCE.startDate

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
              {CONFERENCE.name}
            </h2>
            <p style={{ fontFamily: bod, fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 8 }}>
              {CONFERENCE.dateLabel} · {CONFERENCE.venue}, {CONFERENCE.city}
            </p>
            <p style={{ fontFamily: bod, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 420 }}>
              Two days with administrative and operational professionals from across the continent. Speaker line-up and registration details to be announced.
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
  { n: '1', title: 'Join AIPEA',        desc: 'Associate membership is free.', href: '/sign-up' },
  { n: '2', title: 'Get certified',     desc: 'Earn the designation for your scope.', href: '/certification' },
  { n: '3', title: 'Attend conference', desc: 'Meet peers across the continent.', href: '#events' },
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
          {/* Full-bleed photograph with the purpose statement overlaid, so the
              image carries the whole section rather than sitting as a banner
              above a separate text block. */}
          <Reveal style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', minHeight: 'clamp(460px,64vh,640px)', background: 'linear-gradient(135deg, #0d1831 0%, #1B2A5E 55%, #24396e 100%)' }}>
            <div className="aipea-about-photo" style={{ position: 'absolute', inset: 0 }}>
              <Image
                src="/images/conference/optimized/about-story.webp"
                alt="AIPEA members gathered at the annual conference in Accra"
                fill
                sizes="(max-width: 768px) 100vw, 1400px"
                style={{ objectFit: 'cover', objectPosition: 'center 62%' }}
              />
            </div>
            {/* Scrims: darken top (for the kicker) and bottom (for the statement)
                while leaving the photograph's midtones visible. */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,16,40,0.6) 0%, rgba(10,16,40,0.18) 22%, rgba(10,16,40,0.28) 55%, rgba(10,16,40,0.82) 100%)' }} />

            <div style={{ position: 'absolute', top: 26, left: 30, fontFamily: dis, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)' }}>
              AIPEA Community · PA Conference
            </div>

            <div style={{ position: 'absolute', top: 22, right: 30, display: 'flex', alignItems: 'center' }}>
              {([['AA', C.orange], ['JO', '#1B2A5E'], ['NK', '#059669'], ['FM', '#7c3aed'], ['TM', '#0891b2']] as [string, string][]).map(([ini, color], i) => (
                <div key={ini} style={{ width: 34, height: 34, borderRadius: '50%', background: color, border: '2.5px solid rgba(255,255,255,0.3)', display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 10, color: C.white, marginLeft: i > 0 ? -12 : 0, zIndex: 10 - i, position: 'relative' }}>{ini}</div>
              ))}
            </div>

            {/* Overlaid statement, anchored to the lower half of the image. */}
            <div style={{ position: 'absolute', left: 'clamp(28px,5vw,72px)', right: 'clamp(28px,5vw,72px)', bottom: 'clamp(36px,5vw,64px)', textAlign: 'center' }}>
              <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18 }}>Our purpose</p>
              <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,3.6vw,52px)', lineHeight: 1.08, letterSpacing: '-0.025em', color: C.white, maxWidth: 900, margin: '0 auto', textShadow: '0 2px 24px rgba(6,10,30,0.5)' }}>
                Where assistants and the leaders they support succeed together.
              </p>
              <p style={{ fontFamily: bod, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', maxWidth: 560, margin: '18px auto 0' }}>
                Professional recognition for the people behind executive performance.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
                <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.white, border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, padding: '8px 16px' }}>Rooted in Ghana</span>
                <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.white, border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, padding: '8px 16px' }}>Serving Africa</span>
              </div>
            </div>
          </Reveal>
      </div>
    </section>
  )
}

// --- Core values (from the AIPEA brochure) -------------------------------------

// The AIPEA DNA. Titles come from facts.ts; the three words under each are a
// house summary of the fuller descriptions there.
const coreValues = [
  { n: '01', title: DNA[0].title, words: ['Learn', 'Advance', 'Lead'] },
  { n: '02', title: DNA[1].title, words: ['Excellence', 'Integrity', 'ROI'] },
  { n: '03', title: DNA[2].title, words: ['Empower', 'Connect', 'Champion'] },
]

function ValueCard({ value }: { value: (typeof coreValues)[number] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <TiltCard>
      <div
        className="aipea-value-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', overflow: 'hidden', height: '100%', minHeight: 320, borderRadius: 22,
          border: `1px solid ${hovered ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.14)'}`,
          background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDark} 100%)`,
          color: C.white, padding: 34,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: hovered ? '0 32px 80px rgba(27,42,94,0.32)' : '0 12px 40px rgba(27,42,94,0.18)',
          transform: hovered ? 'translateY(-10px) scale(1.035)' : 'translateY(0) scale(1)',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}>
        <div className="aipea-spin" style={{
          position: 'absolute', top: -54, right: -54, width: 180, height: 180, borderRadius: '50%',
          border: `1px dashed ${hovered ? 'rgba(232,80,26,0.4)' : 'rgba(255,255,255,0.2)'}`,
          transition: 'border-color 0.4s ease',
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', marginTop: 6,
            background: C.orange,
            boxShadow: hovered ? '0 0 0 6px rgba(232,80,26,0.18)' : '0 0 0 0 rgba(232,80,26,0)',
            transition: 'box-shadow 0.5s ease',
          }} />
          <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 44, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.18)' }}>{value.n}</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 14, color: hovered ? C.orangeOnDark : C.white, transition: 'color 0.4s ease' }}>{value.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {value.words.map((w, wi) => (
              <motion.span key={w}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: wi * 0.12, ease: EASE }}
                style={{ fontFamily: dis, fontWeight: 700, fontSize: 19, letterSpacing: '-0.01em', color: hovered ? C.orangeOnDark : 'rgba(255,255,255,0.92)', transition: 'color 0.4s ease' }}>
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

// Associate is the only confirmed price. Professional and Fellow route to the
// Secretariat rather than publishing a figure the client has not given us.
const priceTiers: PriceTier[] = [
  { name: 'Associate',    blurb: 'Entry membership',        price: 'Free',       cadence: '', href: '/sign-up', featured: true, badge: 'Free to join' },
  { name: 'Professional', blurb: 'Established professionals', price: 'On request', cadence: '', href: '#contact', cta: 'Contact us' },
  { name: 'Fellow',       blurb: 'Senior practitioners',    price: 'On request', cadence: '', href: '#contact', cta: 'Contact us' },
]

const priceRows: PriceRow[] = MEMBERSHIP_BENEFITS.map(r => ({ ...r, values: [...r.values] }))

function PricingSection() {
  return (
    <section id="membership" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <SectionHeader align="center" statement="Choose the membership that fits your stage." aside="Membership is your standing in the institute. Certification is earned separately." />
        <PricingBreakdown tiers={priceTiers} rows={priceRows} note="Membership renews annually from your intake date. Professional and Fellow pricing is confirmed by the Secretariat on application." />
      </div>
    </section>
  )
}

// --- Courses ------------------------------------------------------------------

// These were three invented course titles with invented 2026 quarters. AIPEA's
// actual offer is the three certification strands.
const courses = STRANDS.map(s => ({ title: s.name, desc: s.focus, type: `${s.tracks[0].acronym} · ${s.tracks[1].acronym}`, when: s.duration }))

function Courses() {
  return (
    <section id="courses" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader align="center" nowrap statement="Three strands. Six designations." aside="Certified on scope, not on years served." />
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.2fr', gap: 22, alignItems: 'stretch' }} className="aipea-course-showcase">
          <Reveal from="left">
            <div className="aipea-course-hero" style={{ minHeight: 520, borderRadius: 24, padding: 38, background: `linear-gradient(145deg, ${C.navyDark} 0%, ${C.navy} 100%)`, color: C.white, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
                <Image
                  src="/images/conference/optimized/resources-workshop.webp"
                  alt="A skills session in progress at an AIPEA workshop"
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
                  <p style={{ fontFamily: bod, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginTop: 18, maxWidth: 420 }}>
                    Every module ends in a deliverable your employer can deploy — not a certificate of attendance.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 40 }}>
                  {['Live Crucibles', 'Corporate Playbooks', 'Board Frameworks', 'Oral Defense'].map((item, ci) => (
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

// Certificates are NOT issued on joining — the client was explicit that they come
// only on completing a certification. This flow describes membership only.
const steps = [
  { short: 'Account',   name: 'Create your account',   desc: 'Email or Google. Associate membership is free.', stat: 'Free to join.' },
  { short: 'Profile',   name: 'Complete your profile', desc: 'Tell us the scope you carry in your role.', stat: 'Under 5 minutes.' },
  { short: 'Member ID', name: 'Get your member ID',    desc: 'Issued on sign-up, and listed in the member directory.', stat: 'Issued instantly.' },
  { short: 'Track',     name: 'Choose a track',        desc: 'Apply for the certification that matches your scope.', stat: 'Six designations.' },
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
  const last = steps.length - 1
  const active = steps[open]
  return (
    <section id="process" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <SectionHeader align="center" statement="From sign-up to member ID in one sitting." aside="Free to join. Certification comes next." />

        {/* One continuous activation rail: four nodes on a single line that fills
            as it advances — the sequence read as one unbroken sitting, not two
            stacked lists. Auto-advances; pauses on hover; nodes are clickable. */}
        <Reveal>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ maxWidth: 980, margin: '0 auto' }}
          >
            <div className="aipea-rail" style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, padding: '8px 0 4px' }}>
              {/* Track (base line) — sits behind the node row, inset half a column
                  on each end so it spans node-centre to node-centre. */}
              <div className="aipea-rail-track" style={{ position: 'absolute', top: 30, left: `${100 / (steps.length * 2)}%`, right: `${100 / (steps.length * 2)}%`, height: 2, background: C.border, borderRadius: 2 }}>
                <motion.div
                  animate={{ width: `${(open / last) * 100}%` }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                  style={{ height: '100%', background: C.orange, borderRadius: 2 }}
                />
              </div>

              {steps.map((st, i) => {
                const done = i < open
                const isActive = i === open
                return (
                  <button
                    key={st.short}
                    onClick={() => setOpen(i)}
                    aria-label={`Step ${i + 1}: ${st.name}`}
                    className="aipea-rail-node"
                    style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                  >
                    <span
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        display: 'grid', placeItems: 'center',
                        fontFamily: dis, fontWeight: 800, fontSize: 14,
                        background: isActive ? C.orange : done ? '#fceae4' : C.bg,
                        color: isActive ? C.white : done ? C.orange : C.faint,
                        border: `2px solid ${isActive || done ? C.orange : C.border}`,
                        boxShadow: isActive ? '0 8px 24px rgba(232,80,26,0.28)' : 'none',
                        transition: 'background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.25s',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', color: isActive ? C.text : C.muted, textAlign: 'center', transition: 'color 0.25s' }}>
                      {st.short}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Single detail panel for the active step. */}
            <div style={{ marginTop: 28, borderRadius: 20, background: C.bg, border: `1px solid ${C.border}`, boxShadow: '0 10px 40px rgba(27,42,94,0.06)', overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={open}
                  initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="aipea-rail-detail"
                  style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(20px,3vw,40px)', alignItems: 'center', padding: 'clamp(28px,3.5vw,44px)' }}
                >
                  <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(56px,7vw,104px)', lineHeight: 0.8, letterSpacing: '-0.06em', color: 'rgba(232,80,26,0.16)' }}>
                    {String(open + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(24px,2.6vw,36px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: C.text }}>
                      {active.name}
                    </h3>
                    <p style={{ fontFamily: bod, fontSize: 15, color: C.muted, lineHeight: 1.7, maxWidth: 520, marginTop: 12 }}>
                      {active.desc}
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '7px 14px', borderRadius: 999, background: 'rgba(232,80,26,0.08)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange }} />
                      <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.orange }}>{active.stat}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Auto-advance timer bar spanning the panel foot. */}
              <div style={{ height: 3, background: C.border, overflow: 'hidden' }}>
                <motion.div
                  key={`${open}-${paused}-${reduced}`}
                  initial={{ width: '0%' }}
                  animate={{ width: paused || reduced ? '100%' : ['0%', '100%'] }}
                  transition={{ duration: paused || reduced ? 0 : 3.8, ease: 'linear' }}
                  style={{ height: '100%', background: C.orange }}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// --- Contact ------------------------------------------------------------------

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const inputStyle: React.CSSProperties = { width: '100%', background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '13px 16px', fontSize: 14, color: C.text, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s', fontFamily: bod }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint, marginBottom: 7 }
  type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  const onFocus = (e: React.FocusEvent<Field>) => {
    e.target.style.borderColor = C.orange
    e.target.style.boxShadow = '0 0 0 4px rgba(232,80,26,0.12)'
    e.target.style.background = C.bg
  }
  const onBlur = (e: React.FocusEvent<Field>) => {
    e.target.style.borderColor = C.border
    e.target.style.boxShadow = 'none'
    e.target.style.background = C.surface
  }
  const onHoverIn = (e: React.MouseEvent<Field>) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = C.borderHover }
  const onHoverOut = (e: React.MouseEvent<Field>) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = C.border }

  return (
    <section id="contact" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <ScrollReveal>
          <div style={{ maxWidth: 640, marginBottom: S.headerGap }}>
            <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange, marginBottom: 14 }}>Contact</p>
            <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(32px,4vw,52px)', color: C.text, lineHeight: 1.05, letterSpacing: '-0.03em' }}>Get in touch.</div>
            <p style={{ fontFamily: bod, fontSize: 16, lineHeight: 1.7, color: C.muted, marginTop: S.sm }}>Questions about membership, certification, or partnering with AIPEA? Send us a note and the team will get back to you.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', borderRadius: 24, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 24px 64px rgba(27,42,94,0.14)' }} className="aipea-contact-grid">
            <div style={{ background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDark} 100%)`, padding: 40, position: 'relative', overflow: 'hidden', color: C.white, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 10%, rgba(232,80,26,0.28), transparent 38%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orangeOnDark, marginBottom: 24 }}>Reach us directly</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { icon: Mail,   label: 'Email',       value: CONTACT.email },
                    { icon: MapPin, label: 'Head office', value: CONTACT.location },
                  ].map(c => {
                    const Ico = c.icon
                    return (
                      <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ico size={18} color={C.orangeOnDark} /></span>
                        <span>
                          <span style={{ display: 'block', fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.label}</span>
                          <span style={{ display: 'block', fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.white, marginTop: 2 }}>{c.value}</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <p style={{ position: 'relative', zIndex: 1, fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.7, marginTop: 28 }}>Prefer to join straight away? Associate membership is free — you can <Link href="/sign-up" style={{ color: C.orangeOnDark, fontWeight: 600 }}>sign up here</Link>.</p>
            </div>

            <div style={{ background: C.bg, padding: 42 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(232,80,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={26} color={C.orange} />
                  </div>
                  <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 20, color: C.text }}>Message sent</div>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginTop: 10 }}>Thanks for reaching out. The AIPEA team will get back to you as soon as we can.</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: '-0.01em' }}>Send us a message</div>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginBottom: 28, marginTop: 6 }}>We&apos;d love to hear from you.</p>
                  <div className="aipea-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div><label style={labelStyle}>Full name</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} placeholder="Adwoa Mensah" /></div>
                    <div><label style={labelStyle}>Email address</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} placeholder="you@email.com" /></div>
                  </div>
                  <div style={{ marginBottom: 16 }}><label style={labelStyle}>Subject</label>
                    <select style={inputStyle} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}><option>General enquiry</option><option>Membership</option><option>Certification</option><option>Events</option><option>Partnership</option><option>Press or media</option><option>Other</option></select>
                  </div>
                  <div style={{ marginBottom: 24 }}><label style={labelStyle}>Message</label>
                    <textarea rows={5} style={{ ...inputStyle, resize: 'vertical', minHeight: 120, lineHeight: 1.6 }} onFocus={onFocus} onBlur={onBlur} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} placeholder="How can we help?" />
                  </div>
                  <Magnetic strength={0.25} style={{ width: '100%' }}>
                    <button onClick={() => setSubmitted(true)}
                      style={{ width: '100%', background: C.orange, color: C.white, fontFamily: dis, fontWeight: 700, fontSize: 14, padding: 14, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                      Send message <ArrowRight size={15} />
                    </button>
                  </Magnetic>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
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

// Names and titles per the client's approved list. Bios are not yet approved, so
// the rotator carries a statement about the Secretariat rather than putting words
// in a named person's mouth.
const SECRETARIAT_STATEMENT =
  'The AIPEA Secretariat serves as your career advocate, your learning mentor and your community guide — backed by a Governing Council of corporate directors, academics, executive coaches and Chief of Staff veterans.'

const leaders = LEADERSHIP.map(l => ({
  name: l.name,
  title: l.title,
  image: l.image ?? '/images/conference/optimized/leader-ama.webp',
  bio: SECRETARIAT_STATEMENT,
}))

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
            <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,3.5vw,48px)', color: C.white, lineHeight: 1.1, letterSpacing: '-0.03em' }}>The Secretariat, headquartered in Accra.</h2>
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
                  initial={{ opacity: 0, scale: 1.04 }}
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
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                >
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(26px,2.6vw,36px)', color: C.white, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{leader.name}</h3>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.orange, fontWeight: 600, marginTop: 8 }}>{leader.title}</p>
                  <p style={{ fontFamily: bod, fontSize: 15.5, lineHeight: 1.8, color: 'rgba(255,255,255,0.62)', marginTop: S.md, maxWidth: 620 }}>{leader.bio}</p>
                </motion.div>
              </AnimatePresence>

              {leaders.length > 1 && (
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
              )}
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
