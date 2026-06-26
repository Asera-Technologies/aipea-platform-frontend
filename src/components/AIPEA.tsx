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
import { ArrowRight, Plus, Check, ChevronLeft, ChevronRight, Lock, TrendingUp, Award, Users, BookOpen, Calendar, GraduationCap } from 'lucide-react'

// ─── Tokens ───────────────────────────────────────────────────────────────────

const C = {
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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = 'var(--font-syne), sans-serif'
const bod = 'var(--font-inter), sans-serif'
const SECTION: React.CSSProperties = { padding: '120px 40px' }
const INNER: React.CSSProperties   = { maxWidth: 1400, margin: '0 auto' }

// ─── Utilities ────────────────────────────────────────────────────────────────

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

function CountUp({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' as `${number}px` })
  const reduced = useReducedMotion()
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const dur = reduced ? 0 : duration
    const start = performance.now()
    const tick = (now: number) => {
      const p = dur === 0 ? 1 : Math.min((now - start) / (dur * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, to, duration])
  return <span ref={ref}>{val.toLocaleString('en-US')}{suffix}</span>
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
    <span style={{ display: 'inline-grid', verticalAlign: 'top', ...style }}>
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

function Parallax({ children, amount = 50, style }: { children: React.ReactNode; amount?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])
  return <motion.div ref={ref} style={{ y: reduced ? 0 : y, ...style }}>{children}</motion.div>
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

function HeaderEyebrow({ number }: { number: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: C.orange }}>{number}</span>
      <span style={{ width: 22, height: 1, background: C.orange }} />
      <span style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.faint }}>AIPEA</span>
    </span>
  )
}

function SectionHeader({ number, statement, aside, align = 'split' }: {
  number: string; statement: string; aside: string; align?: 'split' | 'center' | 'stacked'
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
      <div ref={ref} style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 72px' }}>
        <motion.div {...rise(0)}><HeaderEyebrow number={number} /></motion.div>
        <motion.h2 {...rise(0.08)} style={{ fontFamily: dis, fontWeight: 800, color: C.text, fontSize: 'clamp(30px,4vw,56px)', lineHeight: 1.05, letterSpacing: '-0.03em', marginTop: 22 }}>{statement}</motion.h2>
        <motion.p {...rise(0.16)} style={{ fontFamily: bod, fontSize: 15, lineHeight: 1.7, color: C.muted, marginTop: 18 }}>{aside}</motion.p>
      </div>
    )
  }

  if (align === 'stacked') {
    return (
      <div ref={ref} style={{ marginBottom: 64 }}>
        <motion.div {...rise(0)} style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(60px,9vw,130px)', color: C.elevated, letterSpacing: '-0.06em', lineHeight: 0.8 }}>{number}</span>
          <span style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.orange }}>AIPEA</span>
        </motion.div>
        <motion.h2 {...rise(0.1)} style={{ fontFamily: dis, fontWeight: 800, color: C.text, fontSize: 'clamp(30px,4.4vw,62px)', lineHeight: 1.02, letterSpacing: '-0.035em', maxWidth: 880, marginTop: 12 }}>{statement}</motion.h2>
        <motion.p {...rise(0.18)} style={{ fontFamily: bod, fontSize: 15, lineHeight: 1.7, color: C.muted, marginTop: 20, maxWidth: 460 }}>{aside}</motion.p>
      </div>
    )
  }

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'flex-start', gap: 48, paddingBottom: 64, borderBottom: `1px solid ${C.border}`, marginBottom: 64, flexWrap: 'wrap' }}>
      <motion.div {...rise(0)} style={{ minWidth: 60, paddingTop: 4 }}>
        <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.faint }}>{number}</p>
        <p style={{ fontFamily: dis, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.orange, marginTop: 4 }}>AIPEA</p>
      </motion.div>
      <motion.h2 {...rise(0.08)} style={{ fontFamily: dis, fontWeight: 800, flex: 1, minWidth: 280, maxWidth: 540, color: C.text, fontSize: 'clamp(26px,3.2vw,44px)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>{statement}</motion.h2>
      <motion.p {...rise(0.16)} style={{ fontFamily: bod, fontSize: 14, lineHeight: 1.75, maxWidth: 240, alignSelf: 'flex-end', color: C.muted }}>{aside}</motion.p>
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

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className="aipea-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 60,
      padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
      transition: 'background 0.35s, border-color 0.35s',
    }}>
      <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>AIPEA</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Link href="/sign-in" style={{ fontFamily: bod, fontSize: 13, color: C.text, textDecoration: 'none', opacity: 0.7 }}>Sign in</Link>
        <Link href="/sign-up"
          style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: C.white, background: C.orange, padding: '9px 20px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'background 0.2s' }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = C.orangeDim)}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = C.orange)}>
          Join AIPEA <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  )
}

// ─── Hero visual — animated member network ────────────────────────────────────

const HERO_MEMBERS = [
  { initials: 'AA', name: 'Adwoa Akuffo',  role: 'EA to MD · Accra',       color: '#E8501A', dur: 6.2, pDel: 0.0 },
  { initials: 'JO', name: 'James Osei',    role: 'Chief of Staff · Lagos',  color: '#1B2A5E', dur: 7.0, pDel: 1.4 },
  { initials: 'NK', name: 'Nyambura K.',   role: 'Executive PA · Nairobi',  color: '#059669', dur: 5.8, pDel: 0.7 },
  { initials: 'FM', name: 'Fatima Moussa', role: 'PA to CEO · Cairo',       color: '#7c3aed', dur: 6.6, pDel: 2.0 },
  { initials: 'TM', name: 'Thandiwe M.',   role: 'EA · Johannesburg',       color: '#0891b2', dur: 7.4, pDel: 0.3 },
]

type HeroMember = typeof HERO_MEMBERS[0]

function MemberCard({ m, pos, delay }: { m: HeroMember; pos: React.CSSProperties; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.92 }}
      animate={{ opacity: 1, y: [0, -9, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.55, delay, ease: EASE },
        scale:   { duration: 0.55, delay, ease: EASE },
        y:       { duration: m.dur, delay: delay + 0.7, ease: 'easeInOut', repeat: Infinity, times: [0, 0.5, 1] },
      }}
      style={{
        position: 'absolute', background: C.white,
        border: `1px solid ${C.border}`, borderRadius: 14,
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 32px rgba(27,42,94,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
        minWidth: 204, ...pos,
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: m.color, display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 11, color: C.white, flexShrink: 0, boxShadow: `0 4px 10px ${m.color}55` }}>
        {m.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 12, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
        <div style={{ fontFamily: bod, fontSize: 11, color: C.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.role}</div>
      </div>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.7)', flexShrink: 0 }} />
    </motion.div>
  )
}

function HeroVisual() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 480 }}>
      {/* Rings */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 356, height: 356, borderRadius: '50%', border: `1px solid ${C.border}`, pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 226, height: 226, borderRadius: '50%', border: '1px dashed rgba(232,80,26,0.2)', pointerEvents: 'none' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '16%', right: '10%', width: 180, height: 180, background: 'radial-gradient(circle, rgba(232,80,26,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Centre badge */}
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }}>
        <div style={{ position: 'relative' }}>
          <motion.div animate={{ scale: [1, 1.35, 1], opacity: [0.28, 0, 0.28] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: -14, borderRadius: '50%', background: 'rgba(232,80,26,0.1)', pointerEvents: 'none' }} />
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.orange, display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 11, letterSpacing: '0.14em', color: C.white, boxShadow: '0 12px 44px rgba(232,80,26,0.38)' }}>
            AIPEA
          </div>
        </div>
      </motion.div>

      {/* Member cards */}
      <MemberCard m={HERO_MEMBERS[0]} delay={0.30} pos={{ top: '3%',   left: '0%'   }} />
      <MemberCard m={HERO_MEMBERS[1]} delay={0.45} pos={{ top: '23%',  right: '0%'  }} />
      <MemberCard m={HERO_MEMBERS[2]} delay={0.28} pos={{ top: '50%',  left: '2%'   }} />
      <MemberCard m={HERO_MEMBERS[3]} delay={0.58} pos={{ top: '70%',  right: '2%'  }} />
      <MemberCard m={HERO_MEMBERS[4]} delay={0.40} pos={{ bottom: '3%', left: '6%'  }} />

      {/* Live count */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.9, ease: EASE }}
        style={{ position: 'absolute', bottom: 0, right: 0, display: 'inline-flex', alignItems: 'center', gap: 8, background: C.navyDark, borderRadius: 100, padding: '8px 18px', boxShadow: '0 4px 20px rgba(17,28,66,0.22)' }}>
        <span className="aipea-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'block', flexShrink: 0 }} />
        <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, color: C.white, whiteSpace: 'nowrap' }}>5,000+ members across Africa</span>
      </motion.div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function ScrollWord({ children, index, progress }: { children: React.ReactNode; index: number; progress: MotionValue<number> }) {
  const start = 0.18 + index * 0.018
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

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE } satisfies Transition,
  })

  const introOpacity = useTransform(scrollYProgress, [0, 0.05, 0.11], [1, 1, 0])
  const introY       = useTransform(scrollYProgress, [0, 0.11], [0, -120])
  const introScale   = useTransform(scrollYProgress, [0, 0.11], [1, 0.96])
  const introVis     = useTransform(scrollYProgress, (v) => (v >= 0.13 ? 'hidden' : 'visible'))
  const stmtOpacity  = useTransform(scrollYProgress, [0.12, 0.18, 0.92, 0.97], [0, 1, 1, 0])
  const stmtY        = useTransform(scrollYProgress, [0.12, 0.22], [100, 0])
  const orangeY      = useTransform(scrollYProgress, [0.1, 0.8], [160, -100])
  const orangeOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.78], [0, 0.18, 0.1])

  const statement = ['Behind', "Africa's", 'most', 'powerful', 'executives', 'are', 'professionals', 'who', 'deserve', 'recognition.', 'We', 'provide', 'it.']

  return (
    <section ref={heroRef} style={{ position: 'relative', height: '280vh' }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden', background: C.white }}>

        {/* Aspirational hero background image */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=800&fit=crop"
            alt="Aspirational professional women"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Soft orange glow bottom-right */}
        <motion.div style={{ position: 'absolute', right: '8%', bottom: '10%', y: orangeY, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.22), rgba(232,80,26,0.06) 42%, transparent 70%)', opacity: orangeOpacity, filter: 'blur(2px)', pointerEvents: 'none' }} />

        {/* Phase 1 — intro */}
        <motion.div style={{ position: 'absolute', inset: 0, opacity: introOpacity, y: introY, scale: introScale, visibility: introVis }}>
          <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', ...INNER, padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '0 72px', alignItems: 'center' }} className="aipea-hero-grid">

            {/* Left: headline + CTA + stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <motion.div {...fade(0.08)} className="aipea-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-block', width: 28, height: 2, background: C.orange, borderRadius: 2 }} />
                <span style={{ fontFamily: bod, fontSize: 13, color: C.muted }}>Africa&apos;s professional membership body for EAs</span>
              </motion.div>

              <motion.h1 {...fade(0.18)} style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(42px,5.8vw,82px)', lineHeight: 0.94, letterSpacing: '-0.025em', color: C.text }}>
                <RotatingWord words={['Certifying', 'Elevating', 'Connecting', 'Championing']} style={{ color: C.orange }} /> the<br /><span style={{ color: C.orange }}>executive assistant</span><br />profession.
              </motion.h1>

              <motion.p {...fade(0.24)} style={{ fontFamily: bod, fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.65, color: C.muted, maxWidth: 480 }}>
                Take your place. Claim your credential. Own your path.
              </motion.p>

              <motion.div {...fade(0.30)} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <a href="#contact"
                  style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '13px 28px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.2s, transform 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.orange; e.currentTarget.style.transform = 'none' }}>
                  Apply for membership <ArrowRight size={15} />
                </a>
                <Link href="/sign-in" style={{ fontFamily: bod, fontSize: 14, color: C.muted, textDecoration: 'none' }}>Sign in →</Link>
              </motion.div>

              <motion.div {...fade(0.42)} style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                {([[5000, '+', 'Members'], [33, '', 'Countries'], [12, '+', 'Years']] as const).map(([n, s, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(20px,2.2vw,28px)', color: C.orange }}><CountUp to={n} suffix={s} /></div>
                    <div style={{ fontFamily: bod, fontSize: 12, color: C.muted, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: animated member network */}
            <motion.div className="aipea-hero-visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ position: 'relative' }}>
              <HeroVisual />
            </motion.div>
          </div>
        </motion.div>

        {/* Phase 2 — scroll statement */}
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 12, opacity: stmtOpacity, y: stmtY, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <div className="aipea-hero-inner" style={{ ...INNER, width: '100%', padding: '0 40px', transform: 'translateY(-4vh)' }}>
            <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 28 }}>
              AIPEA membership
            </p>
            <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(42px,6.5vw,84px)', lineHeight: 1.05, letterSpacing: '-0.04em', maxWidth: 1060, color: 'rgba(17,28,66,0.1)' }}>
              {statement.map((word, i) => (
                <ScrollWord key={`${word}-${i}`} index={i} progress={scrollYProgress}>{word}</ScrollWord>
              ))}
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

const marqueeItems = ['Pan-African Membership', 'CPD Certification', 'Annual Conference', 'Member Directory', 'Executive Excellence', 'Professional Development', 'Networking Events', 'Course Library']
const marqueeItemsB = ['Growth', 'Value', 'Impact', 'Recognition', 'Community', 'Mentorship', 'Certification', 'Advocacy']

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
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ background: C.surface, padding: '13px 0', overflow: 'hidden' }}>
        <MarqueeRow items={marqueeItems} />
      </div>
      <div style={{ background: C.orange, padding: '11px 0', overflow: 'hidden' }}>
        <MarqueeRow items={marqueeItemsB} reverse filled />
      </div>
    </div>
  )
}

// ─── Editorial moment (ASAP / Nova-style typographic break) ────────────────────

function EditorialMoment() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' as `${number}px` })
  const reduced = useReducedMotion()
  return (
    <section style={{ padding: '100px 40px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div ref={ref} style={{ ...INNER }}>
        {/* Full-width image with overlaid headline */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ position: 'relative', height: 480, borderRadius: 20, overflow: 'hidden', marginBottom: 48 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=480&fit=crop"
            alt="Professionals in a strategic boardroom meeting"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
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
        {/* Body text and CTA — centered below image */}
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
      </div>
    </section>
  )
}

// ─── Pillar strip (ASAP homepage: Membership · Resources · Cert · Events) ─────

const pillars = [
  { icon: Users,         label: 'Membership',    title: 'Connect, learn, and grow.',     desc: 'Join a pan-African community of executive professionals.', href: '#membership' },
  { icon: GraduationCap, label: 'Certification', title: 'Keep your career on standard.', desc: 'Earn credentials that employers and executives recognise.', href: '#membership' },
  { icon: BookOpen,      label: 'Resources',     title: 'Tools for the role you want.',  desc: 'Courses, CPD tracking, and a library built for EAs.', href: '#courses' },
  { icon: Calendar,      label: 'Events',        title: 'Peer-to-peer, face-to-face.',   desc: 'Annual conference and regional meetups across Africa.', href: '#events' },
]

function PillarStrip() {
  return (
    <section style={{ padding: '0 40px 100px', background: C.bg }}>
      <div style={INNER}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="aipea-pillars-grid">
          {pillars.map((p, i) => {
            const Icon = p.icon
            const pillarImages = [
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
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
                      style={{ objectFit: 'cover' }}
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

// ─── Event highlight (ASAP in-person event cards) ─────────────────────────────

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
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=600&fit=crop"
          alt="Professional conference background"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
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

// ─── Pathway strip (ASAP “What are you waiting for?”) ─────────────────────────

const pathwaySteps = [
  { n: '1', title: 'Join AIPEA',       desc: 'Choose your tier and apply.', href: '/sign-up' },
  { n: '2', title: 'Get certified',   desc: 'Earn your AIPEA credential.', href: '#membership' },
  { n: '3', title: 'Attend conference', desc: 'Meet peers across Africa.', href: '#events' },
]

function PathwayStrip() {
  return (
    <section style={{ padding: '80px 40px', background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={INNER}>
        <ScrollReveal>
          <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: C.text, letterSpacing: '-0.02em', marginBottom: 36, textAlign: 'center' }}>
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

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader number="001" align="stacked" statement="Africa's home for executive professionals." aside="One membership. Everything you need." />
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 18, alignItems: 'stretch' }} className="aipea-about-visual-grid">
            <Reveal from="left"><TiltCard><CredentialCard title="Professional recognition for the people behind executive performance." tier="Institutional standard" number="AIPEA-STD-001" /></TiltCard></Reveal>
            <Reveal from="right" delay={0.12} style={{ display: 'flex', flexDirection: 'column', border: `1px solid ${C.border}`, borderRadius: 22, background: C.surface, padding: 0, position: 'relative', overflow: 'hidden' }}>
              {/* Community photo element */}
              <div style={{ position: 'relative', height: 200, background: 'linear-gradient(135deg, #0d1831 0%, #1B2A5E 55%, #24396e 100%)', flexShrink: 0, overflow: 'hidden' }}>
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=200&fit=crop"
                  alt="Professional women in office setting"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover', opacity: 0.7 }}
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
                    <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 15, color: C.white, lineHeight: 1 }}>5,000+</div>
                    <div style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>members · 33 countries</div>
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

// ─── Core values (from the AIPEA brochure) ─────────────────────────────────────

const coreValues = [
  { n: '01', icon: TrendingUp, title: 'Growth', words: ['Learn', 'Advance', 'Lead'] },
  { n: '02', icon: Award,      title: 'Value',  words: ['Excellence', 'Integrity', 'You first'] },
  { n: '03', icon: Users,      title: 'Impact', words: ['Empower', 'Connect', 'Champion'] },
]

function CoreValues() {
  return (
    <section id="values" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader number="002" align="center" statement="The values behind the standard." aside="Three principles. Everything we build." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }} className="aipea-values-grid">
          {coreValues.map((v, i) => {
            const dark = i === 1
            const Icon = v.icon
            return (
              <ScrollReveal key={v.title} delay={0.1 * i}>
                <TiltCard>
                  <div style={{
                    position: 'relative', overflow: 'hidden', height: '100%', minHeight: 320, borderRadius: 22,
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : C.border}`,
                    background: dark ? `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDark} 100%)` : C.surface,
                    color: dark ? C.white : C.text, padding: 34,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    boxShadow: dark ? '0 28px 70px rgba(27,42,94,0.22)' : 'none',
                  }}>
                    <div className="aipea-spin" style={{ position: 'absolute', top: -54, right: -54, width: 180, height: 180, borderRadius: '50%', border: `1px dashed ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(232,80,26,0.28)'}` }} />
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center' }}>
                        <Icon size={22} color={C.orange} />
                      </div>
                      <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 44, letterSpacing: '-0.05em', color: dark ? 'rgba(255,255,255,0.18)' : C.elevated }}>{v.n}</span>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 14 }}>{v.title}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {v.words.map((w, wi) => (
                          <motion.span key={w}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.5, delay: wi * 0.12, ease: EASE }}
                            style={{ fontFamily: dis, fontWeight: 700, fontSize: 19, letterSpacing: '-0.01em', color: dark ? 'rgba(255,255,255,0.92)' : C.text }}>
                            <span style={{ color: C.orange, marginRight: 9 }}>·</span>{w}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Membership ───────────────────────────────────────────────────────────────

const tiers = [
  { name: 'Associate',    type: 'For emerging EAs',     price: '₵500',   perks: ['Member directory', 'CPD tracker', 'Digital certificate'],                         featured: false },
  { name: 'Professional', type: 'For established EAs',  price: '₵1,200', perks: ['All Associate benefits', 'Course access (coming soon)', 'Conference discount'],    featured: true  },
  { name: 'Fellow',       type: 'For senior leaders',   price: '₵2,500', perks: ['All Professional benefits', 'Fellowship credential', 'Mentorship access'],         featured: false },
]

function Membership() {
  return (
    <section id="membership" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <SectionHeader number="003" statement="Choose the membership that fits your stage." aside="Every tier includes the essentials." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 22, alignItems: 'stretch' }} className="aipea-membership-showcase">
          <Reveal from="left">
            <div style={{ height: '100%', minHeight: 580, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 36, borderRadius: 24, background: C.bg, border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
              {/* Subtle credential background */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.02, zIndex: 0 }}>
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=580&fit=crop"
                  alt=""
                  fill
                  sizes="500px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 260, height: 260, background: 'radial-gradient(circle at 100% 0%, rgba(232,80,26,0.06), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>Credential preview</p>
                <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,3.5vw,52px)', lineHeight: 0.96, letterSpacing: '-0.04em', color: C.text }}>
                  Membership should feel earned, not purchased.
                </h3>
              </div>
              <div style={{ position: 'relative', zIndex: 2, marginTop: 40 }}>
                <CredentialCard title="Adwoa Mensah, AIPEA Professional" tier="Professional member" number="AIPEA-2025-04821" compact />
              </div>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gap: 14 }}>
            {tiers.map((t, i) => (
              <Reveal key={t.name} from="right" delay={0.08 * i}>
                <div style={{
                  position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
                  padding: '32px 34px', borderRadius: 22, cursor: 'default',
                  border: `1px solid ${t.featured ? 'rgba(232,80,26,0.35)' : C.border}`,
                  background: t.featured ? `linear-gradient(135deg, ${C.orange} 0%, #b83a12 100%)` : C.bg,
                  boxShadow: t.featured ? '0 20px 60px rgba(232,80,26,0.18)' : 'none',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }} className="aipea-tier-row"
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.018)'; e.currentTarget.style.boxShadow = t.featured ? '0 28px 70px rgba(232,80,26,0.28)' : '0 16px 44px rgba(27,42,94,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = t.featured ? '0 20px 60px rgba(232,80,26,0.18)' : 'none' }}>
                  {t.featured && (
                    <span style={{ position: 'absolute', top: -11, right: 28, display: 'inline-flex', alignItems: 'center', gap: 7, background: C.navyDark, color: C.white, fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '6px 13px', borderRadius: 999 }}>
                      <span className="aipea-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange, display: 'block' }} />Most popular
                    </span>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 24, color: t.featured ? C.white : C.text }}>{t.name}</span>
                      <span style={{ fontFamily: bod, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.featured ? 'rgba(255,255,255,0.65)' : C.muted }}>{t.type}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 14 }}>
                      <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 38, lineHeight: 1, color: t.featured ? C.white : C.orange }}>{t.price}</span>
                      <span style={{ fontFamily: bod, fontSize: 13, color: t.featured ? 'rgba(255,255,255,0.65)' : C.muted }}>/year</span>
                    </div>
                  </div>
                  <div className="aipea-tier-perks" style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 240 }}>
                    {t.perks.map(p => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.featured ? C.white : C.orange, flexShrink: 0 }} />
                        <span style={{ fontFamily: bod, fontSize: 13, color: t.featured ? 'rgba(255,255,255,0.85)' : C.muted }}>{p}</span>
                      </div>
                    ))}
                    <a href="#contact" style={{ marginTop: 10, alignSelf: 'flex-start', fontFamily: dis, fontWeight: 700, fontSize: 12, padding: '10px 18px', borderRadius: 999, textDecoration: 'none', transition: 'transform 0.2s', background: t.featured ? C.white : C.orange, color: t.featured ? C.orange : C.white }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                      Join {t.name} →
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <p style={{ fontFamily: bod, fontSize: 12, color: C.faint, textAlign: 'center', marginTop: 24 }}>All payments processed securely via Paystack. Annual renewal. Cancel any time.</p>
      </div>
    </section>
  )
}

// ─── Courses ──────────────────────────────────────────────────────────────────

const courses = [
  { title: 'Executive Communication Mastery',  desc: 'Influence without authority.', type: 'Workshop',  when: 'Q2 2026' },
  { title: 'Calendar & Priorities Management', desc: 'Protect executive time.',       type: 'Seminar',   when: 'Q3 2026' },
  { title: 'Board & C-Suite Support',          desc: 'Support senior leadership.',     type: 'Cert prep', when: 'Q4 2026' },
]

function Courses() {
  return (
    <section id="courses" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader number="004" align="stacked" statement="A full course library. Coming soon." aside="Members get first access." />
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.2fr', gap: 22, alignItems: 'stretch' }} className="aipea-course-showcase">
          <Reveal from="left">
            <div style={{ minHeight: 520, borderRadius: 24, padding: 38, background: `linear-gradient(145deg, ${C.navyDark} 0%, ${C.navy} 100%)`, color: C.white, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=520&fit=crop"
                  alt="Professional training environment"
                  fill
                  sizes="600px"
                  style={{ objectFit: 'cover' }}
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

// ─── Member Directory Preview ─────────────────────────────────────────────────

const countryFeatures = [
  { country: 'Ghana',        members: '890',   image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&h=200&fit=crop&crop=faces&auto=format' },
  { country: 'South Africa', members: '1,200', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&auto=format' },
  { country: 'Nigeria',      members: '950',   image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces&auto=format' },
  { country: 'Kenya',        members: '670',   image: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=200&h=200&fit=crop&crop=faces&auto=format' },
  { country: 'Uganda',       members: '420',   image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=faces&auto=format' },
  { country: 'Egypt',        members: '780',   image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=faces&auto=format' },
]

function MemberDirectory() {
  return (
    <section style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <SectionHeader number="008" align="center" statement="A pan-African network." aside="Connected across 33 countries." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }} className="aipea-directory-grid">
          {countryFeatures.map((country, i) => (
            <ScrollReveal key={country.country} delay={0.05 * i}>
              <div style={{ borderRadius: 16, overflow: 'hidden', background: C.bg, border: `1px solid ${C.border}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(27,42,94,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ position: 'relative', height: 120 }}>
                  <Image
                    src={country.image}
                    alt={country.country}
                    fill
                    sizes="160px"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(27,42,94,0.6) 100%)' }} />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 4 }}>{country.country}</div>
                  <div style={{ fontFamily: bod, fontSize: 12, color: C.orange, fontWeight: 600 }}>{country.members} members</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Process ──────────────────────────────────────────────────────────────────

const steps = [
  { name: 'Choose your tier',         desc: 'Associate, Professional, or Fellow.', stat: '3 tiers.'             },
  { name: 'Complete your application', desc: 'Under 5 minutes. Verified in 24 hours.', stat: '< 5 minutes.'      },
  { name: 'Pay securely via Paystack', desc: 'Cards and mobile money. Cancel any time.', stat: 'Paystack secured.' },
  { name: 'Get your credentials',     desc: 'Certificate and member ID, instantly.', stat: 'Instant on approval.' },
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
        <SectionHeader number="005" align="center" statement="From application to member in under 24 hours." aside="Active before you close the tab." />
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 22, alignItems: 'stretch' }} className="aipea-process-grid">
          <Reveal from="left" delay={0.08}>
            <div style={{ minHeight: 580, borderRadius: 24, background: C.bg, border: `1px solid ${C.border}`, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              {/* Subtle background image */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.03, zIndex: 0 }}>
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=580&fit=crop"
                  alt=""
                  fill
                  sizes="500px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>Membership activation</p>
                <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,3.8vw,58px)', lineHeight: 0.95, letterSpacing: '-0.05em', color: C.text }}>
                  From applicant to recognized professional.
                </h3>
              </div>
              <div style={{ marginTop: 40, borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.surface }}>
                {[['Application', 'Profile submitted', '01'], ['Verification', 'Details reviewed', '02'], ['Payment', 'Paystack confirmed', '03'], ['Credential', 'Member ID issued', '04']].map(([title, detail, number], index) => (
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

// ─── Member Spotlight ─────────────────────────────────────────────────────────

const memberSpotlights = [
  {
    name: 'Amara Diallo',
    title: 'Executive Assistant to the MD',
    company: 'Ecobank Ghana',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces&auto=format',
    highlight: 'Promoted within 6 months',
    story: 'The AIPEA credential transformed how my organisation values the EA role.',
  },
  {
    name: 'Thandiwe Mokoena',
    title: 'PA to CEO',
    company: 'Standard Bank South Africa',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&crop=faces&auto=format',
    highlight: 'Board-level visibility',
    story: 'AIPEA gave me the framework to step into strategic leadership.',
  },
  {
    name: 'Fatima Al-Hassan',
    title: 'Executive PA',
    company: 'Dangote Group, Lagos',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces&auto=format',
    highlight: '35% salary increase',
    story: 'My AIPEA credentials became the evidence I needed for career advancement.',
  },
]

function MemberSpotlight() {
  return (
    <section style={{ ...SECTION, background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={INNER}>
        <SectionHeader number="007" align="center" statement="Member success stories." aside="Real professionals, real impact." />
        <div className="aipea-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {memberSpotlights.map((member, i) => (
            <ScrollReveal key={member.name} delay={0.08 * i}>
              <div style={{ borderRadius: 20, overflow: 'hidden', background: C.bg, border: `1px solid ${C.border}`, transition: 'transform 0.22s, box-shadow 0.22s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(27,42,94,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                {/* Member image */}
                <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'linear-gradient(135deg, #f7f8fc 0%, #eef1f8 100%)' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="400px"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  />
                </div>
                {/* Member info */}
                <div style={{ padding: 28 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(232,80,26,0.08)', color: C.orange, fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 100, marginBottom: 16 }}>
                    ✓ {member.highlight}
                  </div>
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, color: C.text, lineHeight: 1.1, marginBottom: 6 }}>{member.name}</h3>
                  <p style={{ fontFamily: bod, fontSize: 12, color: C.orange, fontWeight: 600, marginBottom: 4 }}>{member.title}</p>
                  <p style={{ fontFamily: bod, fontSize: 12, color: C.muted, marginBottom: 16 }}>{member.company}</p>
                  <p style={{ fontFamily: bod, fontSize: 14, lineHeight: 1.6, color: C.muted, fontStyle: 'italic' }}>&quot;{member.story}&quot;</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonialData = [
  {
    theme: 'Confidence',
    name: 'Amara Diallo',
    title: 'Executive Assistant to the MD',
    company: 'Ecobank Ghana',
    initials: 'AD',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces&auto=format',
    quote: '"Within six months of earning my AIPEA Professional credential, I was approached for a senior EA role I would never have been considered for before. The certificate changed how my entire organisation sees the EA function."',
  },
  {
    theme: 'Validation',
    name: 'Thandiwe Mokoena',
    title: 'Personal Assistant to the CEO',
    company: 'Standard Bank South Africa',
    initials: 'TM',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=faces&auto=format',
    quote: '"I used to struggle to get a seat at the table. Now I co-present at board meetings. AIPEA gave me the language, the framework, and the professional standing I couldn\'t claim on my own."',
  },
  {
    theme: 'Community',
    name: 'Fatima Al-Hassan',
    title: 'Executive PA',
    company: 'Dangote Group, Lagos',
    initials: 'FA',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces&auto=format',
    quote: '"The CPD framework restructured how I approach my role entirely. I\'ve logged 80 hours in eight months — and just negotiated a 35% salary increase using my AIPEA credentials as evidence."',
  },
]

function Testimonials() {
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (paused || reduced) return
    const id = setInterval(() => setCur(c => (c + 1) % testimonialData.length), 5000)
    return () => clearInterval(id)
  }, [paused, reduced])
  const t = testimonialData[cur]
  return (
    <section id="testimonials" style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <SectionHeader number="006" statement="What our members say." aside="Voices from across Africa." />
        <ScrollReveal delay={0.08}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 24, alignItems: 'stretch' }} className="aipea-testi-grid">
            <div>
              <div className="aipea-testi-left" style={{ minHeight: '56vh', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 32, position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Full-bleed background photo */}
                <AnimatePresence initial={false}>
                  <motion.div key={t.image} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }}
                    style={{ position: 'absolute', inset: 0 }}>
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,28,66,0.45) 0%, transparent 45%, rgba(8,14,38,0.82) 100%)', zIndex: 1 }} />
                {/* Theme label — top */}
                <AnimatePresence initial={false} mode="wait">
                  <motion.span key={t.theme} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}
                    style={{ position: 'relative', zIndex: 2, fontFamily: dis, fontWeight: 800, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.orange }}>
                    {t.theme}
                  </motion.span>
                </AnimatePresence>
                {/* Member info — bottom */}
                <AnimatePresence initial={false} mode="wait">
                  <motion.div key={t.initials} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                    style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 17, color: C.white }}>{t.name}</div>
                    <div style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{t.title}</div>
                    <div style={{ fontFamily: bod, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{t.company}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32, borderRadius: 24, background: C.surface, border: `1px solid ${C.border}`, padding: 40 }}
              onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <AnimatePresence initial={false} mode="wait">
                <motion.div key={t.theme} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.42, ease: EASE }}>
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,3.5vw,44px)', color: C.text, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>{t.theme}</h3>
                  <p style={{ fontFamily: bod, fontSize: 'clamp(16px,1.8vw,19px)', color: C.muted, lineHeight: 1.75, fontStyle: 'italic' }}>{t.quote}</p>
                </motion.div>
              </AnimatePresence>
              <div>
              <div style={{ height: 2, background: C.border, borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
                <motion.div key={`${cur}-${paused}`} initial={{ width: '0%' }} animate={{ width: paused || reduced ? '100%' : ['0%', '100%'] }} transition={{ duration: paused || reduced ? 0 : 5, ease: 'linear' }} style={{ height: '100%', background: C.orange }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {([{ fn: () => setCur(c => (c - 1 + testimonialData.length) % testimonialData.length), label: 'Previous', icon: <ChevronLeft size={16} /> }, { fn: () => setCur(c => (c + 1) % testimonialData.length), label: 'Next', icon: <ChevronRight size={16} /> }]).map(({ fn, label, icon }) => (
                  <button key={label} aria-label={label} onClick={fn}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.bg, color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text }}>
                    {icon}
                  </button>
                ))}
                <div style={{ display: 'flex', gap: 6, marginLeft: 6 }}>
                  {testimonialData.map((_, i) => (
                    <button key={i} aria-label={`Testimonial ${i + 1}`} onClick={() => setCur(i)}
                      style={{ height: 6, width: i === cur ? 20 : 6, borderRadius: i === cur ? 3 : '50%', background: i === cur ? C.orange : C.border, border: 'none', cursor: 'pointer', transition: '0.2s', padding: 0 }} />
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

const benefits = [
  'Official AIPEA membership certificate',
  'Digital member directory listing',
  'CPD hours tracker',
  'Access to member events and conference',
  'Course library — first access (Professional tier)',
]

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const inputStyle: React.CSSProperties = { width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '13px 16px', fontSize: 14, color: C.text, outline: 'none', transition: 'border-color 0.2s', fontFamily: bod }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint, marginBottom: 7 }
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = C.orange }
  const onBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = C.border }

  return (
    <section id="contact" style={{ ...SECTION, background: C.surface }}>
      <div style={INNER}>
        <ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'end', marginBottom: 64 }} className="aipea-contact-grid">
            <Parallax amount={36}>
              <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(56px,10vw,140px)', color: C.orange, lineHeight: 0.84, letterSpacing: '-0.06em' }}>Join<br />AIPEA.</div>
            </Parallax>
            <div style={{ borderRadius: 24, background: C.navyDark, color: C.white, padding: 34, minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 10%, rgba(232,80,26,0.32), transparent 34%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, color: C.orange, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Application desk</p>
                <h3 style={{ marginTop: 16, fontFamily: dis, fontWeight: 800, fontSize: 36, lineHeight: 0.95, letterSpacing: '-0.04em' }}>Review within 24 hours.</h3>
              </div>
              <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {['Apply', 'Review', 'Credential'].map((step, i) => (
                  <div key={step} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 14 }}>
                    <span style={{ display: 'block', fontFamily: dis, fontWeight: 800, color: C.orange, marginBottom: 10 }}>0{i + 1}</span>
                    <span style={{ fontFamily: bod, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 64, display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 24 }} className="aipea-contact-grid">
          <ScrollReveal delay={0.08}>
            <div style={{ borderRadius: 24, background: C.bg, border: `1px solid ${C.border}`, padding: 34, height: '100%', position: 'relative', overflow: 'hidden' }}>
              {/* Subtle benefits background */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.02, zIndex: 0 }}>
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=600&fit=crop"
                  alt=""
                  fill
                  sizes="500px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange, marginBottom: 20 }}>What you get</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {benefits.map(b => (
                    <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontFamily: bod, fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
                      <span style={{ fontFamily: dis, fontWeight: 700, color: C.orange, flexShrink: 0, marginTop: 1 }}>—</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 24, padding: 42 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(232,80,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={26} color={C.orange} />
                  </div>
                  <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 20, color: C.text }}>Application received</div>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginTop: 10 }}>We&apos;ll have your membership active within 24 hours.</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: '-0.01em' }}>Tell us about yourself</div>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, marginBottom: 28, marginTop: 6 }}>We&apos;ll get back to you within 24 hours.</p>
                  <div className="aipea-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div><label style={labelStyle}>Full name</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="Adwoa Mensah" /></div>
                    <div><label style={labelStyle}>Email address</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="you@email.com" /></div>
                  </div>
                  <div style={{ marginBottom: 16 }}><label style={labelStyle}>Country</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="Ghana" /></div>
                  <div style={{ marginBottom: 16 }}><label style={labelStyle}>Membership tier</label>
                    <select style={inputStyle} onFocus={onFocus} onBlur={onBlur}><option>Associate</option><option>Professional</option><option>Fellow</option></select>
                  </div>
                  <div style={{ marginBottom: 24 }}><label style={labelStyle}>How did you hear about AIPEA?</label>
                    <select style={inputStyle} onFocus={onFocus} onBlur={onBlur}><option>Social media</option><option>Colleague referral</option><option>Search engine</option><option>Event or conference</option><option>Other</option></select>
                  </div>
                  <Magnetic strength={0.25} style={{ width: '100%' }}>
                    <button onClick={() => setSubmitted(true)}
                      style={{ width: '100%', background: C.orange, color: C.white, fontFamily: dis, fontWeight: 700, fontSize: 14, padding: 14, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                      Apply for membership <ArrowRight size={15} />
                    </button>
                  </Magnetic>
                  <p style={{ fontFamily: bod, fontSize: 11, color: C.faint, textAlign: 'center', marginTop: 16 }}>Secure payment via Paystack. Membership activates within 24 hours.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

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

// ─── Leadership Section ───────────────────────────────────────────────────────

const leaders = [
  { name: 'Ama Mensah', title: 'Founder & Executive Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=faces&auto=format' },
  { name: 'Samuel Boateng', title: 'Director, Professional Standards', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces&auto=format' },
]

function LeadershipSection() {
  return (
    <section style={{ ...SECTION, background: C.navyDark }}>
      <div style={INNER}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange, marginBottom: 16 }}>Leadership</p>
            <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,3.5vw,48px)', color: C.white, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16 }}>Visionaries leading the profession forward.</h2>
            <p style={{ fontFamily: bod, fontSize: 15, color: 'rgba(255,255,255,0.52)', maxWidth: 480, margin: '0 auto' }}>Meet the team dedicated to elevating executive assistants across Africa.</p>
          </div>
        </ScrollReveal>
        <div className="aipea-leader-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
          {leaders.map((leader, i) => (
            <ScrollReveal key={leader.name} delay={0.1 * i}>
              <div style={{ position: 'relative', height: 420, borderRadius: 20, overflow: 'hidden' }}>
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,38,0.86) 0%, rgba(8,14,38,0.2) 38%, transparent 62%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px' }}>
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, color: C.white, lineHeight: 1.15 }}>{leader.name}</h3>
                  <p style={{ fontFamily: bod, fontSize: 13, color: C.orange, fontWeight: 600, marginTop: 6 }}>{leader.title}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const footerCols = [
  { h: 'Platform', links: ['Membership', 'Courses', 'Directory', 'Events']        },
  { h: 'Company',  links: ['About AIPEA', 'Our Mission', 'Governance', 'Contact'] },
  { h: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
]

function Footer() {
  return (
    <footer className="aipea-footer-wrap" style={{ background: C.navyDark, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: '64px 40px 36px' }}>
      <div style={INNER}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 64, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="aipea-footer-grid">
          <div>
            <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 15, color: C.orange, letterSpacing: '0.18em' }}>AIPEA</div>
            <p style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.38)', maxWidth: 220, marginTop: 16, lineHeight: 1.75 }}>Elevating the executive assistant profession across Africa. Setting the standard since 2013.</p>
          </div>
          {footerCols.map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 18 }}>{col.h}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.38)', display: 'block', marginBottom: 12, textDecoration: 'none', transition: '0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 28, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>&copy; 2025 Africa Institute of Professional &amp; Executive Assistants. All rights reserved.</span>
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Elevating the profession across Africa.</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function AIPEA() {
  return (
    <div className="aipea" style={{ background: C.bg, color: C.text }}>
      <Navbar />
      <Hero />
      <Marquee />
      <EditorialMoment />
      <PillarStrip />
      <About />
      <CoreValues />
      <Membership />
      <EventHighlight />
      <Courses />
      <MemberDirectory />
      <Process />
      <MemberSpotlight />
      <Testimonials />
      <LeadershipSection />
      <PathwayStrip />
      <Contact />
      <CTABanner />
      <Footer />
    </div>
  )
}
