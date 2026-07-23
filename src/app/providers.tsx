'use client'

import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'framer-motion'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* `reducedMotion="user"` lets framer-motion disable transform/layout
          animations for visitors who prefer reduced motion, at the animation
          layer — WITHOUT us branching the `initial` prop on useReducedMotion().
          Branching `initial` was rendering different HTML on the server (which
          can't know the OS preference) vs. a reduce-motion client, which tripped
          React's hydration check. Components now render a deterministic initial
          state and this handles the accessibility side globally. */}
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </ThemeProvider>
  )
}
