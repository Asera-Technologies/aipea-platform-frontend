'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Transition,
} from 'framer-motion'
import Link from 'next/link'
import { Lock, ArrowRight, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  orange:      '#E8501A',
  orangeDim:   '#c94314',
  navy:        '#1B2A5E',
  navyDark:    '#111c42',
  white:       '#ffffff',
  void:        'var(--aipea-bg)',
  surface:     'var(--aipea-surface)',
  elevated:    'var(--aipea-elevated)',
  card:        'var(--aipea-card)',
  text:        'var(--aipea-text)',
  muted:       'var(--aipea-muted)',
  faint:       'var(--aipea-faint)',
  border:      'var(--aipea-border)',
  borderHover: 'var(--aipea-border-hover)',
} as const

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
// Coolvetica is not present in the project yet, so use a clean professional
// grotesk stack instead of falling back to the previous decorative display font.
const dis = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const bod = 'var(--font-inter), sans-serif'
const SECTION: React.CSSProperties = { padding: '120px 40px' }
const INNER: React.CSSProperties   = { maxWidth: 1400, margin: '0 auto' }

// ─── ScrollReveal ─────────────────────────────────────────────────────────────

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

// ─── Starfield canvas ─────────────────────────────────────────────────────────

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let s = 42
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    const small   = Array.from({ length: 320 }, () => ({ xf: rand(), yf: rand(), r: rand() * 0.9 + 0.15, a: rand() * 0.55 + 0.18 }))
    const glowing = Array.from({ length: 18  }, () => ({ xf: rand(), yf: rand(), r: rand() * 2.4 + 1.2,  a: rand() * 0.6  + 0.32 }))
    let raf: number
    const draw = () => {
      const W = canvas.width  = canvas.offsetWidth
      const H = canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      glowing.forEach(g => {
        const x = g.xf * W, y = g.yf * H, gr = g.r * 14
        const grad = ctx.createRadialGradient(x, y, 0, x, y, gr)
        grad.addColorStop(0, `rgba(255,255,255,${g.a})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(x, y, gr, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        ctx.beginPath(); ctx.arc(x, y, g.r, 0, Math.PI * 2); ctx.fill()
      })
      small.forEach(p => {
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.beginPath(); ctx.arc(p.xf * W, p.yf * H, p.r, 0, Math.PI * 2); ctx.fill()
      })
    }
    draw()
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [])
  return (
    <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ number, statement, aside }: { number: string; statement: string; aside: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 48, paddingBottom: 64, borderBottom: `1px solid ${C.border}`, marginBottom: 64, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 60, paddingTop: 4 }}>
        <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.faint }}>{number}</p>
        <p style={{ fontFamily: dis, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.orange, marginTop: 4 }}>AIPEA</p>
      </div>
      <h2 style={{ fontFamily: dis, fontWeight: 800, flex: 1, minWidth: 280, maxWidth: 560, color: C.text, fontSize: 'clamp(28px,3.5vw,46px)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>{statement}</h2>
      <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 260, alignSelf: 'flex-end', color: C.muted }}>{aside}</p>
    </div>
  )
}

function CredentialObject({
  title,
  tier,
  number,
  compact = false,
}: {
  title: string
  tier: string
  number: string
  compact?: boolean
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: compact ? 260 : 360,
        borderRadius: 22,
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${C.navy} 0%, ${C.navyDark} 58%, #071024 100%)`,
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 34px 100px rgba(27,42,94,0.25)',
        color: C.white,
        padding: compact ? 28 : 36,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(232,80,26,0.34), transparent 34%)' }} />
      <div style={{ position: 'absolute', right: -70, top: -70, width: 220, height: 220, border: '1px solid rgba(255,255,255,0.18)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: -60, bottom: -70, width: 220, height: 220, border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%' }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontFamily: dis, fontWeight: 800, letterSpacing: '0.18em', color: C.orange }}>AIPEA</div>
          <div style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800 }}>EA</div>
        </div>
        <div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{tier}</p>
          <h3 style={{ fontFamily: dis, fontSize: compact ? 24 : 34, lineHeight: 1, letterSpacing: '-0.03em', maxWidth: 420 }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 18 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{number}</span>
          <span style={{ fontSize: 11, color: C.orange, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Verified credential</span>
        </div>
      </div>
    </div>
  )
}

function LandscapeVisual() {
  const stats = [
    ['33', 'Countries'],
    ['5,000+', 'Members'],
    ['12+', 'Years'],
  ] as const

  return (
    <section style={{ ...SECTION, background: C.navyDark, color: C.white, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 40%, rgba(232,80,26,0.18), transparent 32%)' }} />
      <div style={{ ...INNER, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56, alignItems: 'center' }} className="aipea-landscape-grid">
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.orange, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 22 }}>Africa&apos;s executive assistant landscape</p>
            <h2 style={{ fontFamily: dis, fontSize: 'clamp(42px,6vw,86px)', lineHeight: 0.95, letterSpacing: '-0.05em', maxWidth: 720 }}>
              A professional body built across borders.
            </h2>
            <p style={{ marginTop: 28, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, maxWidth: 480 }}>
              AIPEA brings training, recognition, and career infrastructure into one pan-African credentialing experience.
            </p>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
            {stats.map(([value, label], index) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 24, padding: '42px 46px', borderBottom: index < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <span style={{ fontFamily: dis, fontSize: 'clamp(64px,8vw,116px)', lineHeight: 0.8, letterSpacing: '-0.07em', color: index === 1 ? C.orange : C.white }}>{value}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.16em', paddingBottom: 8 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 60,
      padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background:     scrolled ? 'var(--aipea-nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom:   `1px solid ${scrolled ? C.border : 'transparent'}`,
      transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
    }}>
      <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>AIPEA</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/sign-in" style={{ fontFamily: bod, fontSize: 13, color: C.text }}>
          Sign in
        </Link>
        <Link
          href="/sign-up"
          style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: C.white, background: C.orange, padding: '9px 18px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}
        >
          Join AIPEA <ArrowRight size={14} />
        </Link>
        <button
          type="button"
          onClick={onToggleTheme}
          style={{ border: `1px solid ${C.border}`, background: C.elevated, color: C.text, borderRadius: 999, padding: '8px 12px', fontFamily: bod, fontSize: 12, cursor: 'pointer' }}
        >
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
        <button aria-label="Menu" onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', width: 24, height: 16, position: 'relative' }}>
          <span style={{ position: 'absolute', top: 2,  left: 0, width: 24, height: 1, background: C.orange, transition: '0.3s', transform: open ? 'translateY(6px) rotate(45deg)'  : 'none' }} />
          <span style={{ position: 'absolute', top: 8,  right: 0, width: 14, height: 1, background: C.orange, transition: '0.3s', opacity: open ? 0 : 1 }} />
          <span style={{ position: 'absolute', top: 14, left: 0, width: 24, height: 1, background: C.orange, transition: '0.3s', transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function ScrollWord({
  children,
  index,
  progress,
}: {
  children: React.ReactNode
  index: number
  progress: MotionValue<number>
}) {
  const start = 0.2 + index * 0.02
  const opacity = useTransform(progress, [start, start + 0.045, start + 0.1], [0.2, 1, 1])
  const y = useTransform(progress, [start, start + 0.065], [46, 0])
  const scale = useTransform(progress, [start, start + 0.065], [0.94, 1])
  const blur = useTransform(progress, [start, start + 0.06], ['blur(10px)', 'blur(0px)'])
  const color = useTransform(progress, [start, start + 0.06], ['rgba(255,255,255,0.24)', 'rgba(255,255,255,1)'])
  const shadow = useTransform(progress, [start, start + 0.06], ['0 0 0 rgba(232,80,26,0)', '0 0 30px rgba(232,80,26,0.34)'])

  return (
    <motion.span
      style={{ display: 'inline-block', opacity, y, scale, filter: blur, color, textShadow: shadow, marginRight: '0.24em', whiteSpace: 'nowrap' }}
    >
      {children}
    </motion.span>
  )
}

function CredentialForms({ progress }: { progress: MotionValue<number> }) {
  const yLarge = useTransform(progress, [0.1, 0.72], [120, -90])
  const yMid = useTransform(progress, [0.08, 0.78], [190, -20])
  const ySmall = useTransform(progress, [0.12, 0.84], [230, 30])
  const opacity = useTransform(progress, [0.1, 0.22, 0.78, 0.94], [0, 1, 1, 0])
  const rotateLarge = useTransform(progress, [0.1, 0.88], [-16, 18])
  const rotateMid = useTransform(progress, [0.1, 0.88], [18, -12])

  const formStyle: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '28% 42% 34% 38%',
    background: 'linear-gradient(145deg, #E8501A 0%, #f46b35 45%, #9b2f10 100%)',
    boxShadow: '0 28px 80px rgba(232,80,26,0.32), inset 18px 18px 36px rgba(255,255,255,0.14), inset -18px -18px 32px rgba(68,16,2,0.34)',
    border: '1px solid rgba(255,255,255,0.18)',
  }

  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      <motion.div
        style={{
          ...formStyle,
          width: 150,
          height: 150,
          right: '11%',
          top: '36%',
          y: yLarge,
          rotate: rotateLarge,
        }}
      />
      <motion.div
        style={{
          ...formStyle,
          width: 92,
          height: 92,
          right: '29%',
          top: '51%',
          y: yMid,
          rotate: rotateMid,
          filter: 'blur(0.4px)',
        }}
      />
      <motion.div
        style={{
          ...formStyle,
          width: 72,
          height: 72,
          right: '7%',
          top: '57%',
          y: ySmall,
          opacity: 0.82,
          filter: 'blur(2px)',
        }}
      />
    </motion.div>
  )
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })
  const cross: React.CSSProperties = { position: 'absolute', fontFamily: 'monospace', fontSize: 11, color: 'var(--aipea-faint)', pointerEvents: 'none' }
  const fade = (delay: number) => ({
    initial:    { opacity: 0, y: 28 },
    animate:    { opacity: 1, y: 0  },
    transition: { duration: 0.85, delay, ease: EASE } satisfies Transition,
  })
  const introOpacity = useTransform(scrollYProgress, [0, 0.05, 0.11], [1, 1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.11], [0, -130])
  const introScale = useTransform(scrollYProgress, [0, 0.11], [1, 0.95])
  const introVisibility = useTransform(scrollYProgress, (v) => (v >= 0.13 ? 'hidden' : 'visible'))
  const statementOpacity = useTransform(scrollYProgress, [0.15, 0.22, 0.96, 1], [0, 1, 1, 0])
  const statementY = useTransform(scrollYProgress, [0.15, 0.26], [110, 0])
  const starScale = useTransform(scrollYProgress, [0, 1], [1, 1.26])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.32, 0.95, 0.6])
  const glowScale = useTransform(scrollYProgress, [0, 0.75], [0.85, 1.18])
  const orangeGlowY = useTransform(scrollYProgress, [0.1, 0.8], [180, -120])
  const orangeGlowX = useTransform(scrollYProgress, [0.1, 0.8], [100, -120])
  const orangeGlowOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.78], [0, 0.42, 0.24])
  const statement = ['We', 'set', 'the', 'standard', 'so', 'executive', 'assistants', 'can', 'lead', 'with', 'confidence.']

  return (
    <section ref={heroRef} style={{ position: 'relative', height: '240vh', background: C.navyDark }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden', background: `radial-gradient(circle at 52% 52%, rgba(255,255,255,0.08), transparent 34%), linear-gradient(135deg, ${C.navyDark} 0%, #071024 100%)` }}>
        <motion.div style={{ position: 'absolute', inset: 0, scale: starScale }}>
          <Starfield />
        </motion.div>

        {/* Nebula glow layers */}
        <motion.div style={{ position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%', scale: glowScale, width: 980, height: 760, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.015) 58%, transparent 76%)', opacity: glowOpacity, pointerEvents: 'none' }} />
        <motion.div style={{ position: 'absolute', right: '12%', top: '52%', x: orangeGlowX, y: orangeGlowY, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.42), rgba(232,80,26,0.12) 38%, transparent 70%)', opacity: orangeGlowOpacity, filter: 'blur(4px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 760, height: 620, background: 'radial-gradient(ellipse at 100% 100%, rgba(232,80,26,0.2) 0%, rgba(232,80,26,0.08) 35%, transparent 68%)', pointerEvents: 'none' }} />
        <CredentialForms progress={scrollYProgress} />

        {/* Crosshair markers */}
        <span style={{ ...cross, top: 28, left: 40, color: 'rgba(255,255,255,0.22)' }}>+</span>
        <span style={{ ...cross, top: 28, right: 40, color: 'rgba(255,255,255,0.22)' }}>+</span>
        <span style={{ ...cross, bottom: 28, left: 40, color: 'rgba(255,255,255,0.22)' }}>+</span>
        <span style={{ ...cross, bottom: 28, right: 40, color: 'rgba(255,255,255,0.22)' }}>+</span>
        <span style={{ ...cross, top: '50%', left: 40, transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)' }}>+</span>
        <span style={{ ...cross, top: '50%', right: 40, transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)' }}>+</span>

        {/* First-stage hero content */}
        <motion.div
          style={{ position: 'absolute', inset: 0, opacity: introOpacity, y: introY, scale: introScale, visibility: introVisibility }}
        >
          <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', ...INNER, padding: '0 40px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0 48px', alignItems: 'center' }} className="aipea-hero-grid">
            <motion.div {...fade(0.1)} style={{ borderLeft: `2px solid ${C.orange}`, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }} className="aipea-eyebrow">
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.58)' }}>You lead,</span>
              <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.white }}>we credential.</span>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              <motion.h1 {...fade(0.2)} style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(54px,7vw,96px)', lineHeight: 0.9, letterSpacing: '-0.025em', color: C.white }}>
                Elevating the<br /><span style={{ color: C.orange }}>executive assistant</span><br />profession.
              </motion.h1>

              <motion.div {...fade(0.35)} style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Africa&apos;s professional membership body</span>
                <span style={{ height: 1, width: 40, background: 'rgba(255,255,255,0.18)' }} />
                <a href="#contact"
                  style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '13px 28px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, transition: '0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.orange;    e.currentTarget.style.transform = 'none' }}>
                  Apply for membership <ArrowRight size={15} />
                </a>
              </motion.div>

              <motion.div {...fade(0.48)} style={{ display: 'flex', alignItems: 'flex-start', gap: 48, flexWrap: 'wrap' }}>
                {([['5,000+', 'Members', 'active professionals'], ['33', 'Countries', 'Pan-African reach'], ['12+', 'Years', 'of excellence']] as const).map(([v, l, sub]) => (
                  <div key={l}>
                    <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(22px,2.5vw,32px)', color: C.orange }}>{v}</div>
                    <div style={{ fontSize: 13, color: C.white, marginTop: 6 }}>{l}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll-stage statement */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 12,
            opacity: statementOpacity,
            y: statementY,
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ ...INNER, width: '100%', padding: '0 40px', transform: 'translateY(-4vh)' }}>
            <p style={{ fontFamily: bod, fontSize: 14, color: C.orange, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 28, fontWeight: 700 }}>
              AIPEA membership infrastructure
            </p>
            <h2 style={{ fontFamily: dis, fontWeight: 700, fontSize: 'clamp(46px,6.5vw,86px)', lineHeight: 1.05, letterSpacing: '-0.04em', maxWidth: 1060, color: 'rgba(255,255,255,0.32)' }}>
              {statement.map((word, index) => (
                <ScrollWord key={`${word}-${index}`} index={index} progress={scrollYProgress}>
                  {word}
                </ScrollWord>
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

function MarqueeRow() {
  return (
    <div style={{ display: 'flex', flexShrink: 0 }}>
      {marqueeItems.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 36px', fontFamily: dis, fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--aipea-muted)' }}>
          {it}<span style={{ width: 4, height: 4, borderRadius: '50%', background: C.orange, marginLeft: 36 }} />
        </span>
      ))}
    </div>
  )
}

function Marquee() {
  return (
    <div style={{ background: C.surface, borderTop: '1px solid var(--aipea-border)', borderBottom: '1px solid var(--aipea-border)', padding: '14px 0', overflow: 'hidden' }}>
      <div className="aipea-marquee" style={{ display: 'flex', width: 'max-content' }}><MarqueeRow /><MarqueeRow /></div>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" style={{ ...SECTION, background: C.void }}>
      <div style={INNER}>
        <SectionHeader number="001" statement="Building Africa's most respected community of executive professionals." aside="We set the standard for training, certification, and professional conduct for executive and personal assistants across the continent." />
        <ScrollReveal delay={0.08}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 18, alignItems: 'stretch' }} className="aipea-about-visual-grid">
            <CredentialObject title="Professional recognition for the people behind executive performance." tier="Institutional standard" number="AIPEA-STD-001" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', border: `1px solid var(--aipea-border)`, borderRadius: 22, overflow: 'hidden', background: C.surface }} className="aipea-stat-grid">
              {([['33+', 'Countries represented'], ['5,000+', 'Active members'], ['12+', 'Years establishing the standard'], ['100', 'CPD-hour annual tracker']] as const).map(([n, l], i) => (
                <div key={l} style={{ padding: '42px 38px', borderRight: i % 2 === 0 ? '1px solid var(--aipea-border)' : 'none', borderBottom: i < 2 ? '1px solid var(--aipea-border)' : 'none' }}>
                  <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(40px,5vw,68px)', color: i === 1 ? C.orange : C.text, letterSpacing: '-0.05em' }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'var(--aipea-muted)', marginTop: 12 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.16}>
          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }} className="aipea-about-visual-grid">
            <blockquote style={{ padding: 34, borderRadius: 22, background: C.elevated, border: `1px solid ${C.border}`, fontFamily: dis, fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(20px,2.4vw,30px)', color: C.text, lineHeight: 1.35 }}>
              &ldquo;Every executive assistant in Africa deserves access to world-class training, a respected credential, and a community that elevates their career.&rdquo;
            </blockquote>
            <div style={{ borderRadius: 22, border: `1px solid ${C.border}`, padding: 34, background: C.surface, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220 }}>
              <p style={{ fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Professional status system</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 28 }}>
                {['Certification', 'Directory', 'CPD'].map((item) => (
                  <div key={item} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, minHeight: 96 }}>
                    <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: C.orange, marginBottom: 16 }} />
                    <span style={{ fontFamily: dis, fontWeight: 700, color: C.text }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ─── Membership ───────────────────────────────────────────────────────────────

const tiers = [
  { name: 'Associate',    type: 'For emerging EAs',    price: '₵500',   perks: ['Member directory', 'CPD tracker', 'Digital certificate'],                    featured: false },
  { name: 'Professional', type: 'For established EAs', price: '₵1,200', perks: ['All Associate benefits', 'Course access (coming soon)', 'Conference discount'], featured: true  },
  { name: 'Fellow',       type: 'For senior / leaders', price: '₵2,500', perks: ['All Professional benefits', 'Fellowship credential', 'Mentorship access'],    featured: false },
]

function Membership() {
  return (
    <section id="membership" style={{ ...SECTION, background: C.elevated }}>
      <div style={INNER}>
        <SectionHeader number="002" statement="Choose the membership that fits your stage." aside="All tiers include access to the member directory, CPD tracking, and the annual conference." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 22, alignItems: 'stretch' }} className="aipea-membership-showcase">
          <ScrollReveal>
            <div style={{ height: '100%', minHeight: 620, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 36, borderRadius: 24, background: C.void, border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 72% 18%, rgba(232,80,26,0.16), transparent 34%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>Credential preview</p>
                <h3 style={{ fontFamily: dis, fontSize: 'clamp(34px,4vw,62px)', lineHeight: 0.96, letterSpacing: '-0.05em', color: C.text }}>
                  Membership should feel earned, not purchased.
                </h3>
              </div>
              <div style={{ position: 'relative', zIndex: 1, marginTop: 48 }}>
                <CredentialObject title="Adwoa Mensah, AIPEA Professional" tier="Professional member" number="AIPEA-2025-04821" compact />
              </div>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gap: 14 }}>
          {tiers.map((t, i) => (
            <ScrollReveal key={t.name} delay={0.08 * i}>
              <div
                className="aipea-tier-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 28,
                  alignItems: 'center',
                  padding: '34px 36px',
                  border: `1px solid ${t.featured ? 'rgba(232,80,26,0.42)' : C.border}`,
                  background: t.featured ? `linear-gradient(135deg, ${C.orange} 0%, #b83a12 100%)` : C.surface,
                  borderRadius: 22,
                  boxShadow: t.featured ? '0 26px 70px rgba(232,80,26,0.2)' : 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 26, color: t.featured ? C.white : C.text }}>{t.name}</div>
                    <div style={{ fontFamily: bod, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.featured ? 'rgba(255,255,255,0.72)' : C.muted }}>{t.type}</div>
                  </div>
                  <div style={{ marginTop: 18, display: 'flex', alignItems: 'end', gap: 8 }}>
                    <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 40, lineHeight: 1, color: t.featured ? C.white : C.orange }}>{t.price}</span>
                    <span style={{ fontSize: 13, color: t.featured ? 'rgba(255,255,255,0.72)' : C.muted, paddingBottom: 4 }}>/year</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 260 }}>
                  {t.perks.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.featured ? C.white : C.orange }} />
                      <span style={{ fontSize: 13, color: t.featured ? 'rgba(255,255,255,0.86)' : C.muted }}>{p}</span>
                    </div>
                  ))}
                  <a href="#contact" style={{ marginTop: 8, alignSelf: 'flex-start', fontFamily: dis, fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', padding: '11px 18px', borderRadius: 999, transition: '0.2s', whiteSpace: 'nowrap', background: t.featured ? C.white : C.orange, color: t.featured ? C.orange : C.white }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                    Join {t.name} →
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--aipea-faint)', textAlign: 'center', marginTop: 28 }}>All payments processed securely via Paystack. Annual renewal. Cancel any time.</p>
      </div>
    </section>
  )
}

// ─── Courses ──────────────────────────────────────────────────────────────────

const courses = [
  { strip: '#1B2A5E', title: 'Executive Communication Mastery',   desc: 'Confidently manage up, communicate strategy, and influence without authority.' },
  { strip: '#E8501A', title: 'Calendar & Priorities Management',  desc: 'Control complexity. Master the art of protecting executive time.'            },
  { strip: '#2d3f82', title: 'Board & C-Suite Support',           desc: 'The professional standard for supporting senior leadership.'                  },
]

function Courses() {
  return (
    <section id="courses" style={{ ...SECTION, background: C.void }}>
      <div style={INNER}>
        <SectionHeader number="003" statement="A full course library. Coming soon." aside="Professional members get first access when the library launches. Join now to secure your spot." />
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.2fr', gap: 22, alignItems: 'stretch' }} className="aipea-course-showcase">
          <ScrollReveal>
            <div style={{ minHeight: 560, borderRadius: 24, padding: 38, background: `linear-gradient(145deg, ${C.navyDark} 0%, ${C.navy} 100%)`, color: C.white, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 20%, rgba(232,80,26,0.32), transparent 34%)' }} />
              <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>Course library preview</p>
                  <h3 style={{ fontFamily: dis, fontSize: 'clamp(36px,4.5vw,68px)', lineHeight: 0.95, letterSpacing: '-0.06em', maxWidth: 520 }}>
                    A curriculum that feels like a professional publication.
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 44 }}>
                  {['CPD Ledger', 'Executive Tools', 'Board Support', 'Credential Path'].map((item) => (
                    <div key={item} style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 18, background: 'rgba(255,255,255,0.05)' }}>
                      <Lock size={14} color={C.orange} />
                      <p style={{ marginTop: 18, fontFamily: dis, fontWeight: 700 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gap: 14 }}>
            {courses.map((c, i) => (
              <ScrollReveal key={c.title} delay={0.08 * i}>
                <div
                  style={{ minHeight: 170, display: 'grid', gridTemplateColumns: '92px 1fr auto', gap: 24, alignItems: 'center', padding: '28px 32px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 22, overflow: 'hidden', transition: 'transform 0.25s, border-color 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C.borderHover }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = C.border }}
                >
                  <div style={{ fontFamily: dis, fontSize: 44, fontWeight: 800, color: i === 1 ? C.orange : C.navy, letterSpacing: '-0.08em' }}>
                    0{i + 1}
                  </div>
                  <div>
                    <span style={{ display: 'inline-flex', border: `1px solid ${C.orange}`, color: C.orange, fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, marginBottom: 14 }}>Coming soon</span>
                    <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 24, color: C.text, lineHeight: 1.05, letterSpacing: '-0.03em' }}>{c.title}</h3>
                    <p style={{ marginTop: 10, fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 520 }}>{c.desc}</p>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.elevated, display: 'grid', placeItems: 'center' }}>
                    <Lock size={15} color={C.orange} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <ScrollReveal delay={0.24}>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="#membership" style={{ fontSize: 13, color: C.orange, transition: '0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Join as a Professional member to get first access →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ─── Process ──────────────────────────────────────────────────────────────────

const steps = [
  { name: 'Choose your membership tier',  desc: 'Select Associate, Professional, or Fellow. Each comes with a different level of access and credentials.', stat: '3 tiers — pick the one that fits.' },
  { name: 'Complete your application',    desc: 'Fill in your professional profile. Takes under 5 minutes. We verify your details within 24 hours.',       stat: '< 5 min to apply.'             },
  { name: 'Pay securely via Paystack',    desc: 'All major cards and mobile money accepted. Annual subscription, cancel any time.',                         stat: 'Paystack secured.'              },
  { name: 'Get your member credentials', desc: 'Your digital AIPEA certificate, member number, and directory listing go live immediately on approval.',    stat: 'Instant on approval.'           },
]

function Process() {
  const [open, setOpen] = useState(0)
  return (
    <section id="process" style={{ ...SECTION, background: C.elevated }}>
      <div style={INNER}>
        <SectionHeader number="004" statement="From application to full member in under 24 hours." aside="A simple, fast process — your membership is active before you close the tab." />
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 22, alignItems: 'stretch' }} className="aipea-process-grid">

          {/* Credential card */}
          <ScrollReveal delay={0.08}>
            <div style={{ minHeight: 620, borderRadius: 24, background: C.void, border: `1px solid ${C.border}`, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 24% 18%, rgba(232,80,26,0.14), transparent 32%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>Membership activation</p>
                <h3 style={{ fontFamily: dis, fontSize: 'clamp(36px,4.2vw,64px)', lineHeight: 0.95, letterSpacing: '-0.06em', color: C.text }}>
                  The journey from applicant to recognized professional.
                </h3>
              </div>
              <div style={{ position: 'relative', zIndex: 1, marginTop: 46 }}>
                <div style={{ borderRadius: 22, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.surface }}>
                  {[
                    ['Application', 'Submitted profile and tier selection', '01'],
                    ['Verification', 'Professional details reviewed', '02'],
                    ['Payment', 'Secure Paystack confirmation', '03'],
                    ['Credential', 'Member number issued', '04'],
                  ].map(([title, detail, number], index) => (
                    <div key={title} style={{ display: 'grid', gridTemplateColumns: '70px 1fr auto', gap: 18, alignItems: 'center', padding: '22px 24px', borderBottom: index < 3 ? `1px solid ${C.border}` : 'none' }}>
                      <span style={{ fontFamily: dis, fontSize: 34, fontWeight: 800, color: index === 3 ? C.orange : C.faint, letterSpacing: '-0.06em' }}>{number}</span>
                      <span>
                        <strong style={{ display: 'block', fontFamily: dis, color: C.text, fontSize: 18 }}>{title}</strong>
                        <small style={{ display: 'block', color: C.muted, marginTop: 6, fontSize: 12 }}>{detail}</small>
                      </span>
                      <span style={{ width: 11, height: 11, borderRadius: '50%', background: index === 3 ? C.orange : C.border }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Steps accordion */}
          <ScrollReveal delay={0.16}>
            <div style={{ height: '100%', display: 'grid', gap: 12 }}>
              {steps.map((st, i) => {
                const active = open === i
                return (
                  <div key={st.name} onClick={() => setOpen(i)} style={{ padding: '28px 30px', border: `1px solid ${active ? 'rgba(232,80,26,0.42)' : C.border}`, borderRadius: 20, background: active ? C.surface : 'transparent', cursor: 'pointer', transition: 'background 0.25s, border-color 0.25s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                      <div>
                        <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: active ? C.orange : 'var(--aipea-faint)' }}>Step {String(i + 1).padStart(2, '0')}</div>
                        <div style={{ fontFamily: dis, fontWeight: 800, fontSize: active ? 26 : 20, color: active ? C.text : C.muted, marginTop: 8, letterSpacing: '-0.03em', transition: 'font-size 0.25s' }}>{st.name}</div>
                      </div>
                      <Plus size={20} style={{ color: active ? C.orange : 'var(--aipea-faint)', transform: active ? 'rotate(45deg)' : 'none', transition: '0.3s', flexShrink: 0 }} />
                    </div>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ overflow: 'hidden' }}>
                          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, maxWidth: 460, marginTop: 14 }}>{st.desc}</p>
                          <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, color: C.orange, letterSpacing: '0.08em', marginTop: 12 }}>{st.stat}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonialData = [
  { name: 'Amara Diallo',     title: 'Executive Assistant · Ghana',    initials: 'AD', quote: '“AIPEA gave my career a language. I went from being seen as support staff to being seen as a strategic partner. The certification changed everything.”' },
  { name: 'Thandiwe Mokoena', title: 'PA to CEO · South Africa',       initials: 'TM', quote: '“The network alone is worth the membership. I’ve connected with EAs across Lagos, Nairobi, and Johannesburg who’ve become colleagues and friends.”' },
  { name: 'Fatima Al-Hassan', title: 'Executive PA · Nigeria',         initials: 'FA', quote: '“I used to question whether I was ‘professional enough.’ AIPEA’s framework gave me confidence, structure, and a credential I’m proud to put after my name.”' },
]

function Testimonials() {
  const [cur, setCur] = useState(0)
  const t = testimonialData[cur]
  return (
    <section id="testimonials" style={{ ...SECTION, background: C.void }}>
      <div style={INNER}>
        <SectionHeader number="005" statement="What our members say." aside="Professionals from across Africa who shaped their careers through AIPEA." />
        <ScrollReveal delay={0.08}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 24, alignItems: 'stretch' }} className="aipea-testi-grid">
            {/* Left: photo placeholder + attribution */}
            <div>
              <div style={{ minHeight: '58vh', borderRadius: 24, overflow: 'hidden', background: `linear-gradient(160deg, ${C.navyDark} 0%, ${C.navy} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.14)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 72% 24%, rgba(232,80,26,0.32), transparent 34%)' }} />
                <div style={{ position: 'absolute', left: 28, top: 28, fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Member portrait</div>
                <AnimatePresence initial={false} mode="wait">
                  <motion.span key={t.initials} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4, ease: EASE }}
                    style={{ position: 'relative', zIndex: 1, fontFamily: dis, fontWeight: 800, fontSize: 'clamp(96px,14vw,180px)', color: 'rgba(255,255,255,0.1)', letterSpacing: '-0.12em' }}>{t.initials}</motion.span>
                </AnimatePresence>
                <div style={{ position: 'absolute', right: 26, bottom: 26, width: 96, height: 96, borderRadius: '50%', background: C.orange, display: 'grid', placeItems: 'center', color: C.white, fontFamily: dis, fontWeight: 800 }}>
                  AIPEA
                </div>
              </div>
              <AnimatePresence initial={false} mode="wait">
                <motion.div key={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ marginTop: 20 }}>
                  <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 16, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--aipea-muted)', marginTop: 4 }}>{t.title}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: quote + nav */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 48, borderRadius: 24, background: C.surface, border: `1px solid ${C.border}`, padding: 42 }}>
              <AnimatePresence initial={false} mode="wait">
                <motion.p key={t.quote} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.45, ease: EASE }}
                  style={{ fontFamily: dis, fontWeight: 800, fontStyle: 'italic', fontSize: 'clamp(28px,3.4vw,54px)', color: C.text, lineHeight: 1.05, letterSpacing: '-0.045em' }}>
                  {t.quote}
                </motion.p>
              </AnimatePresence>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {([
                  { icon: <ChevronLeft size={16} />, fn: () => setCur(c => (c - 1 + testimonialData.length) % testimonialData.length), label: 'Previous' },
                  { icon: <ChevronRight size={16} />, fn: () => setCur(c => (c + 1) % testimonialData.length), label: 'Next' },
                ]).map(({ icon, fn, label }) => (
                  <button key={label} aria-label={label} onClick={fn}
                    style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid var(--aipea-border-hover)', background: 'none', color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--aipea-border-hover)'; e.currentTarget.style.color = C.text }}>
                    {icon}
                  </button>
                ))}
                <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                  {testimonialData.map((_, i) => (
                    <button key={i} aria-label={`Go to testimonial ${i + 1}`} onClick={() => setCur(i)}
                      style={{ height: 6, width: i === cur ? 20 : 6, borderRadius: i === cur ? 3 : '50%', background: i === cur ? C.orange : 'var(--aipea-faint)', border: 'none', cursor: 'pointer', transition: '0.2s', padding: 0 }} />
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

// ─── Contact ──────────────────────────────────────────────────────────────────

const benefits = [
  'Official AIPEA membership certificate',
  'Digital member directory listing',
  'CPD hours tracker',
  'Access to member events and conference',
  'Course library access (Professional tier — coming soon)',
]

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const inputStyle: React.CSSProperties = { width: '100%', background: C.elevated, border: '1px solid var(--aipea-border)', borderRadius: 6, padding: '13px 16px', fontSize: 14, color: C.text, outline: 'none', transition: 'border-color 0.2s' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--aipea-muted)', marginBottom: 7 }
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = C.orange }
  const onBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = 'var(--aipea-border)' }

  return (
    <section id="contact" style={{ ...SECTION, background: C.elevated }}>
      <div style={INNER}>
        <ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 24, alignItems: 'end' }} className="aipea-contact-grid">
            <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(64px,12vw,160px)', color: C.orange, lineHeight: 0.82, letterSpacing: '-0.07em' }}>Join<br />AIPEA.</div>
            <div style={{ borderRadius: 24, background: C.navyDark, color: C.white, padding: 34, minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 10%, rgba(232,80,26,0.36), transparent 34%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 11, color: C.orange, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Application desk</p>
                <h3 style={{ marginTop: 18, fontFamily: dis, fontSize: 38, lineHeight: 0.95, letterSpacing: '-0.05em' }}>Review within 24 hours.</h3>
              </div>
              <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {['Apply', 'Review', 'Credential'].map((step, index) => (
                  <div key={step} style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 14 }}>
                    <span style={{ display: 'block', color: C.orange, fontFamily: dis, fontWeight: 800, marginBottom: 12 }}>0{index + 1}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 64, marginTop: 64, display: 'grid', gridTemplateColumns: '0.82fr 1.18fr', gap: 24 }} className="aipea-contact-grid">
          <ScrollReveal delay={0.08}>
            <div style={{ borderRadius: 24, background: C.surface, border: `1px solid ${C.border}`, padding: 34, height: '100%' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange, marginBottom: 20 }}>What you get</div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 36, maxWidth: 380 }}>Ready to join Africa&apos;s leading professional body for executive assistants? Apply today — we&apos;ll have your membership active within 24 hours.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {benefits.map(b => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, color: C.muted }}>
                  <span style={{ fontFamily: dis, fontWeight: 700, color: C.orange, flexShrink: 0 }}>—</span>{b}
                </li>
              ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <div style={{ background: C.surface, border: '1px solid var(--aipea-border)', borderRadius: 24, padding: 42 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(232,80,26,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={26} color={C.orange} />
                  </div>
                  <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 20, color: C.text }}>Application received</div>
                  <p style={{ fontSize: 13, color: 'var(--aipea-muted)', marginTop: 10 }}>We&apos;ll review your application and have your membership active within 24 hours.</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 20, color: C.text }}>Tell us about yourself</div>
                  <p style={{ fontSize: 13, color: 'var(--aipea-muted)', marginBottom: 28, marginTop: 6 }}>Fill out the form — we&apos;ll get back to you within 24 hours.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div><label style={labelStyle}>Full name</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="Adwoa Mensah" /></div>
                    <div><label style={labelStyle}>Email address</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="you@email.com" /></div>
                  </div>
                  <div style={{ marginBottom: 16 }}><label style={labelStyle}>Country</label><input style={inputStyle} onFocus={onFocus} onBlur={onBlur} placeholder="Ghana" /></div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Membership tier</label>
                    <select style={inputStyle} onFocus={onFocus} onBlur={onBlur}><option>Associate</option><option>Professional</option><option>Fellow</option></select>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>How did you hear about AIPEA?</label>
                    <select style={inputStyle} onFocus={onFocus} onBlur={onBlur}><option>Social media</option><option>Colleague referral</option><option>Search engine</option><option>Event or conference</option><option>Other</option></select>
                  </div>
                  <button onClick={() => setSubmitted(true)} style={{ width: '100%', background: C.orange, color: C.white, fontFamily: dis, fontWeight: 700, fontSize: 14, padding: 14, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                    onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                    Apply for membership <ArrowRight size={15} />
                  </button>
                  <p style={{ fontSize: 11, color: 'var(--aipea-faint)', textAlign: 'center', marginTop: 16 }}>Secure payment via Paystack. Membership activates within 24 hours.</p>
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
      Where <span style={{ color: C.navy, padding: '0 6px' }}>executive excellence</span> meets Africa.
      <span style={{ padding: '0 24px' }}>Join AIPEA today and <span style={{ color: C.navy }}>elevate your career.</span></span>
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

// ─── Footer ───────────────────────────────────────────────────────────────────

const footerCols = [
  { h: 'Platform', links: ['Membership', 'Courses', 'Directory', 'Events']                  },
  { h: 'Company',  links: ['About AIPEA', 'Our Mission', 'Governance', 'Contact']           },
  { h: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']           },
]

function Footer() {
  return (
    <footer style={{ background: C.navyDark, borderTop: '1px solid var(--aipea-border)', padding: '64px 40px 36px' }}>
      <div style={INNER}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 64, paddingBottom: 48, borderBottom: '1px solid var(--aipea-border)' }} className="aipea-footer-grid">
          <div>
            <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 15, color: C.orange, letterSpacing: '0.18em' }}>AIPEA</div>
            <p style={{ fontSize: 13, color: 'var(--aipea-muted)', maxWidth: 220, marginTop: 16, lineHeight: 1.7 }}>Elevating the executive assistant profession across Africa. Setting the standard since 2013.</p>
          </div>
          {footerCols.map(col => (
            <div key={col.h}>
              <div style={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--aipea-faint)', marginBottom: 18 }}>{col.h}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ fontSize: 13, color: 'var(--aipea-muted)', display: 'block', marginBottom: 12, transition: '0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--aipea-muted)')}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 28, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--aipea-faint)' }}>&copy; 2025 Africa Institute of Personal and Executive Assistants. All rights reserved.</span>
          <span style={{ fontSize: 11, color: 'var(--aipea-faint)' }}>Elevating the profession across Africa.</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function AIPEA() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const themeVars = {
    '--aipea-bg': theme === 'light' ? '#ffffff' : '#0a0f1e',
    '--aipea-surface': theme === 'light' ? '#f7f7f5' : '#111827',
    '--aipea-elevated': theme === 'light' ? '#eef0f8' : '#171717',
    '--aipea-card': theme === 'light' ? '#ffffff' : '#111827',
    '--aipea-text': theme === 'light' ? C.navyDark : '#ffffff',
    '--aipea-muted': theme === 'light' ? 'rgba(17,28,66,0.62)' : 'rgba(255,255,255,0.48)',
    '--aipea-faint': theme === 'light' ? 'rgba(17,28,66,0.22)' : 'rgba(255,255,255,0.2)',
    '--aipea-border': theme === 'light' ? 'rgba(27,42,94,0.12)' : 'rgba(255,255,255,0.08)',
    '--aipea-border-hover': theme === 'light' ? 'rgba(27,42,94,0.22)' : 'rgba(255,255,255,0.14)',
    '--aipea-nav-bg': theme === 'light' ? 'rgba(255,255,255,0.86)' : 'rgba(10,15,30,0.86)',
  } as React.CSSProperties

  return (
    <div className="aipea" data-theme={theme} style={{ ...themeVars, background: C.void, color: C.text }}>
      <Navbar theme={theme} onToggleTheme={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))} />
      <Hero />
      <Marquee />
      <About />
      <LandscapeVisual />
      <Membership />
      <Courses />
      <Process />
      <Testimonials />
      <Contact />
      <CTABanner />
      <Footer />
    </div>
  )
}
