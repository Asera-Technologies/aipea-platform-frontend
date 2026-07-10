'use client'

import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion, type Transition } from 'framer-motion'
import { EASE } from './tokens'

type Dir = 'up' | 'left' | 'right' | 'scale'

const offset: Record<Dir, Record<string, number>> = {
  up: { y: 30 }, left: { x: -44 }, right: { x: 44 }, scale: { scale: 0.92 },
}

/** Fade + directional slide on scroll-into-view. Matches the homepage Reveal. */
export function Reveal({ children, delay = 0, from = 'up', style, className }: {
  children: React.ReactNode; delay?: number; from?: Dir; style?: React.CSSProperties; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' as `${number}px` })
  const reduced = useReducedMotion()
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={reduced ? { opacity: 0 } : { opacity: 0, ...offset[from] }}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
      transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: EASE } satisfies Transition}>
      {children}
    </motion.div>
  )
}
