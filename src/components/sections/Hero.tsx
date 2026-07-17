'use client'

import { motion, type Transition } from 'framer-motion'
import { Starfield } from '@/components/ui/Starfield'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function fadeUp(delay: number) {
  return {
    initial:    { opacity: 0, y: 28 },
    animate:    { opacity: 1, y: 0  },
    transition: { duration: 0.85, delay, ease: EASE } satisfies Transition,
  }
}

const stats = [
  { value: 'Pan-African',     label: 'By design',       sub: 'the whole continent' },
  { value: 'One standard',    label: 'For the role',    sub: 'CPD-backed'          },
  { value: 'Founding cohort', label: 'Now forming',     sub: 'set the benchmark'   },
]

const corners = ['top-7 left-8', 'top-7 right-8', 'bottom-7 left-8', 'bottom-7 right-8']
const mids    = ['top-1/2 left-8 -translate-y-1/2', 'top-1/2 right-8 -translate-y-1/2']

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col" style={{ background: '#080808' }}>
      <Starfield />

      {/* Orange glow: bottom right ambient */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(circle at 100% 100%, rgba(232,80,26,0.10) 0%, transparent 58%)',
        }}
      />

      {/* Crosshair markers */}
      {[...corners, ...mids].map(pos => (
        <div
          key={pos}
          className={`absolute ${pos} font-mono text-xs pointer-events-none select-none hidden lg:block`}
          style={{ color: 'rgba(255,255,255,0.18)', lineHeight: 1 }}
        >
          +
        </div>
      ))}

      {/* Floating membership card: top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        className="absolute top-20 right-0 z-20 hidden lg:block"
      >
        <a
          href="#membership"
          className="flex items-stretch overflow-hidden"
          style={{
            width: 270,
            borderRadius: '12px 0 0 12px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRight: 'none',
            background: '#171717',
          }}
        >
          {/* Visual side: orange gradient with circle rings */}
          <div
            className="w-[112px] shrink-0 relative overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(150deg, #E8501A 0%, #5c1505 100%)' }}
          >
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute rounded-full border border-white"
                style={{ width: 80, height: 80, top: -16, right: -16 }}
              />
              <div
                className="absolute rounded-full border border-white"
                style={{ width: 44, height: 44, top: 14, right: 14 }}
              />
            </div>
            <div
              className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <span className="text-white text-xs font-display font-bold">EA</span>
            </div>
          </div>

          {/* Text side */}
          <div className="flex-1 flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-white text-xs font-display font-bold leading-tight">Fellow Membership</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>Now Open</p>
            </div>
            <span className="text-orange text-sm ml-3">→</span>
          </div>
        </a>
      </motion.div>

      {/* Main content: bottom-anchored */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 pt-28 px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid lg:grid-cols-[220px_1fr] gap-0 lg:gap-16 items-start">

            {/* Eyebrow: desktop */}
            <motion.div
              {...fadeUp(0.12)}
              className="hidden lg:flex flex-col gap-1.5 pt-4"
              style={{ borderLeft: '2px solid #E8501A', paddingLeft: 16 }}
            >
              <span className="text-sm font-body" style={{ color: 'rgba(255,255,255,0.48)' }}>
                You lead,
              </span>
              <span className="text-sm font-display font-bold text-white">
                we credential.
              </span>
            </motion.div>

            {/* Main block */}
            <div className="flex flex-col gap-10">

              {/* Headline */}
              <motion.h1
                {...fadeUp(0.22)}
                className="font-display font-bold text-white"
                style={{ fontSize: 'clamp(48px, 6.5vw, 90px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
              >
                <span className="block">Elevating the</span>
                <span className="block text-orange">executive assistant</span>
                <span className="block">profession.</span>
              </motion.h1>

              {/* CTA row */}
              <motion.div {...fadeUp(0.34)} className="flex items-center gap-6 flex-wrap">
                <span className="text-sm font-body" style={{ color: 'rgba(255,255,255,0.44)' }}>
                  Africa&apos;s professional membership body
                </span>
                <span className="h-px w-10 shrink-0" style={{ background: 'rgba(255,255,255,0.14)' }} />
                <a
                  href="#join"
                  className="flex items-center gap-2 bg-orange text-white font-display font-bold text-sm px-6 py-3 rounded-full transition-colors duration-200 hover:bg-orange-dim shrink-0"
                >
                  Apply Now →
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div {...fadeUp(0.46)} className="flex items-start gap-10 lg:gap-16">
                {stats.map(stat => (
                  <div key={stat.label}>
                    <p
                      className="font-display font-bold text-orange"
                      style={{ fontSize: 'clamp(20px, 2.2vw, 30px)' }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-white text-xs font-body mt-1.5">{stat.label}</p>
                    <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                      {stat.sub}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
