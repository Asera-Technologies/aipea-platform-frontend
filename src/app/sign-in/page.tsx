'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Starfield } from '@/components/ui/Starfield'
import { getUser, saveUser, generateMemberId } from '@/lib/auth'

const ORANGE     = '#E8501A'
const ORANGE_DIM = '#c94314'
const NAVY_DARK  = '#111c42'
const NAVY_SURF  = '#16224d'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const bod = 'var(--font-inter), sans-serif'

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '14px 16px',
  fontSize: 14,
  color: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: bod,
}

const labelBase: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  marginBottom: 8,
  fontFamily: bod,
}

export default function SignIn() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 900))

    const stored = getUser()
    if (stored && stored.email.toLowerCase() === email.toLowerCase()) {
      router.push('/dashboard')
      return
    }

    // Demo: accept any credentials, create a session
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    saveUser({ name, email, tier: 'Associate', memberId: generateMemberId(), joinedAt: new Date().toISOString() })
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: NAVY_DARK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <Starfield />

      {/* Glow layers */}
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 600, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 68%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 480, height: 380, background: 'radial-gradient(ellipse at 100% 100%, rgba(232,80,26,0.14) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 460 }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, textDecoration: 'none' }}>
            AIPEA
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: NAVY_SURF, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle top glow */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(232,80,26,0.5), transparent)' }} />

          <h1 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,4vw,40px)', color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 8 }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36, fontFamily: bod }}>
            Sign in to your AIPEA account.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelBase}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com" autoComplete="email"
                style={inputBase}
                onFocus={e => (e.target.style.borderColor = ORANGE)}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ ...labelBase, marginBottom: 0 }}>Password</label>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontFamily: bod, cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ ...inputBase, paddingRight: 46 }}
                  onFocus={e => (e.target.style.borderColor = ORANGE)}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 13, color: '#ff7b7b', fontFamily: bod, marginTop: -8 }}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? ORANGE_DIM : ORANGE, color: '#fff', fontFamily: dis, fontWeight: 700, fontSize: 14, padding: '15px', borderRadius: 8, border: 'none', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s, transform 0.15s', marginTop: 4 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = ORANGE_DIM }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = ORANGE }}>
              {loading
                ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>Signing in…</motion.span>
                : <><span>Sign in</span><ArrowRight size={15} /></>
              }
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', fontFamily: bod }}>
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" style={{ color: ORANGE, fontWeight: 600, textDecoration: 'none' }}>
                Create one →
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.18)', fontFamily: bod }}>
          Demo: any email + any password
        </p>
      </motion.div>
    </div>
  )
}
