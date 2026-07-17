'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const ORANGE    = '#E8501A'
const NAVY_DARK = '#111c42'
const dis = 'var(--font-syne), sans-serif'
const bod = 'var(--font-inter), sans-serif'

const SLIDES = [
  {
    src: '/images/conference/optimized/auth-conference.webp',
    alt: 'AIPEA conference attendees in session',
    local: true,
  },
  {
    src: '/images/conference/optimized/auth-workshop.webp',
    alt: 'AIPEA members taking part in a workshop',
    local: true,
  },
  {
    src: '/images/conference/optimized/auth-stage.webp',
    alt: 'AIPEA members on stage at the conference',
    local: true,
  },
  {
    src: '/images/conference/optimized/events-speaker.webp',
    alt: 'AIPEA speaker addressing conference delegates',
    local: true,
  },
]

const INTERVAL_MS = 5500

function RotatingSeal() {
  return (
    <div style={{ position: 'relative', width: 92, height: 92 }}>
      <div className="aipea-spin" style={{ position: 'absolute', inset: 0 }}>
        <svg viewBox="0 0 100 100" width="92" height="92">
          <defs>
            <path id="aipea-seal-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
          </defs>
          <text fontSize="8.4" fontWeight={700} letterSpacing="2.6" fill="rgba(255,255,255,0.62)" fontFamily={dis}>
            <textPath href="#aipea-seal-path" startOffset="0%">
              AIPEA • PROFESSIONAL MEMBERSHIP •
            </textPath>
          </text>
        </svg>
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: ORANGE, display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 10, color: '#fff', letterSpacing: '0.04em' }}>EA</span>
      </div>
    </div>
  )
}

export function BrandPanel({ headline, sub, flex = '0 0 46%' }: {
  headline: React.ReactNode
  sub: string
  flex?: string
}) {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setCurrent(i => (i + 1) % SLIDES.length), INTERVAL_MS)
    return () => clearTimeout(t)
  }, [current, paused])

  return (
    <div
      className="aipea-auth-panel"
      style={{ flex, minHeight: '100vh', position: 'relative', overflow: 'hidden', background: NAVY_DARK }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* -- Slideshow images -- */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: INTERVAL_MS / 1000 + 1.5, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image
              src={SLIDES[current].src}
              alt={SLIDES[current].alt}
              fill
              priority={current === 0}
              sizes="50vw"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* -- Overlays -- */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,28,66,0.62) 0%, rgba(17,28,66,0.12) 26%, rgba(17,28,66,0.28) 58%, rgba(8,14,38,0.94) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 88%, rgba(232,80,26,0.34), transparent 46%)' }} />

      {/* -- Content -- */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '46px 50px' }}>

        {/* top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none' }}>AIPEA</Link>
          <RotatingSeal />
        </div>

        {/* bottom: headline + dots */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ width: 46, height: 3, background: ORANGE, marginBottom: 24 }} />
            <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(26px,2.6vw,40px)', color: '#fff', lineHeight: 1.12, letterSpacing: '-0.025em', maxWidth: 420 }}>
              {headline}
            </h2>
            <p style={{ fontFamily: bod, fontSize: 14.5, color: 'rgba(255,255,255,0.62)', lineHeight: 1.7, maxWidth: 360, marginTop: 18 }}>
              {sub}
            </p>
          </motion.div>

          {/* slide dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setPaused(false) }}
                aria-label={`Slide ${i + 1}`}
                style={{
                  padding: 0, border: 'none', cursor: 'pointer', borderRadius: 99,
                  background: 'none', display: 'flex', alignItems: 'center',
                }}
              >
                <motion.span
                  animate={{
                    width:   i === current ? 28 : 8,
                    opacity: i === current ? 1  : 0.38,
                    background: i === current ? ORANGE : '#fff',
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block', height: 8, borderRadius: 99 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
