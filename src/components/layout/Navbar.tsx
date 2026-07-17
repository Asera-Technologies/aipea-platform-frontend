'use client'

import { useState, useEffect } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 lg:px-16 h-16 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(8,8,8,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      {/* Wordmark */}
      <a href="#" className="font-display font-bold text-orange tracking-widest text-sm uppercase">
        AIPEA
      </a>

      {/* Hamburger: 3 lines, middle shorter */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
        className="flex flex-col gap-[6px] cursor-pointer group"
      >
        <span
          className="block h-px bg-orange transition-all duration-300"
          style={{
            width: 24,
            transform: open ? 'rotate(45deg) translate(4px, 5px)' : 'none',
          }}
        />
        <span
          className="block h-px bg-orange transition-all duration-300"
          style={{
            width: 16,
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block h-px bg-orange transition-all duration-300"
          style={{
            width: 24,
            transform: open ? 'rotate(-45deg) translate(4px, -5px)' : 'none',
          }}
        />
      </button>
    </header>
  )
}
