'use client'

import { useEffect, useRef } from 'react'

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Seeded LCG — same star positions every render
    let s = 42
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }

    const small   = Array.from({ length: 260 }, () => ({ xf: rand(), yf: rand(), r: rand() * 1.1 + 0.15, a: rand() * 0.65 + 0.15 }))
    const glowing = Array.from({ length: 14  }, () => ({ xf: rand(), yf: rand(), r: rand() * 2.2 + 1.2,  a: rand() * 0.55 + 0.3  }))

    function draw() {
      if (!canvas || !ctx) return
      const W = canvas.width  = window.innerWidth
      const H = canvas.height = window.innerHeight

      // Brand navy base gradient (matches the landing hero).
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, '#111c42')
      bg.addColorStop(1, '#071024')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Nebula glow — soft bright centre
      const ng = ctx.createRadialGradient(W * 0.5, H * 0.44, 0, W * 0.5, H * 0.44, W * 0.46)
      ng.addColorStop(0,    'rgba(255,255,255,0.052)')
      ng.addColorStop(0.42, 'rgba(255,255,255,0.016)')
      ng.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = ng
      ctx.fillRect(0, 0, W, H)

      // Glowing stars
      for (const g of glowing) {
        const x = g.xf * W, y = g.yf * H
        const gr = ctx.createRadialGradient(x, y, 0, x, y, g.r * 9)
        gr.addColorStop(0,    `rgba(255,255,255,${g.a.toFixed(2)})`)
        gr.addColorStop(0.28, `rgba(255,255,255,${(g.a * 0.22).toFixed(2)})`)
        gr.addColorStop(1,    'rgba(0,0,0,0)')
        ctx.fillStyle = gr
        ctx.beginPath()
        ctx.arc(x, y, g.r * 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, g.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        ctx.fill()
      }

      // Small stars
      for (const p of small) {
        ctx.beginPath()
        ctx.arc(p.xf * W, p.yf * H, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a.toFixed(2)})`
        ctx.fill()
      }
    }

    draw()

    let raf: number
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
