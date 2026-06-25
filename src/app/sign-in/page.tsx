'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { getUser, saveUser, generateMemberId } from '@/lib/auth'
import { BrandPanel } from '@/components/auth/BrandPanel'

const ORANGE     = '#E8501A'
const ORANGE_DIM = '#c94314'
const NAVY_DARK  = '#111c42'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const bod = 'var(--font-inter), sans-serif'

const inputBase: React.CSSProperties = {
  width: '100%', background: '#f7f8fc', border: '1px solid rgba(27,42,94,0.1)',
  borderRadius: 8, padding: '13px 16px', fontSize: 14, color: NAVY_DARK,
  outline: 'none', transition: 'border-color 0.2s', fontFamily: bod,
}
const labelBase: React.CSSProperties = {
  display: 'block', fontFamily: dis, fontSize: 10, fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(17,28,66,0.38)', marginBottom: 7,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignIn() {
  const router  = useRouter()
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
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    saveUser({ name, email, tier: 'Associate', memberId: generateMemberId(), joinedAt: new Date().toISOString() })
    router.push('/dashboard')
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = ORANGE)
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(27,42,94,0.1)')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      <BrandPanel
        headline={<>Africa&apos;s professional home for Executive Assistants.</>}
        sub="Welcome back. Sign in to manage your membership, credentials, and CPD."
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', overflowY: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div style={{ marginBottom: 40 }}>
            <Link href="/" style={{ fontFamily: bod, fontSize: 13, color: 'rgba(17,28,66,0.4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ← Back to AIPEA
            </Link>
          </div>

          <h1 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,3.5vw,40px)', color: NAVY_DARK, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 10 }}>
            Welcome back.
          </h1>
          <p style={{ fontFamily: bod, fontSize: 14, color: 'rgba(17,28,66,0.48)', marginBottom: 40 }}>
            Sign in to your AIPEA account.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelBase}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com" autoComplete="email"
                style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ ...labelBase, marginBottom: 0 }}>Password</label>
                <span style={{ fontFamily: bod, fontSize: 12, color: 'rgba(17,28,66,0.32)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ ...inputBase, paddingRight: 46 }} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,28,66,0.28)', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: bod, fontSize: 13, color: '#c0392b', marginTop: -8 }}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? ORANGE_DIM : ORANGE, color: '#fff', fontFamily: dis, fontWeight: 700, fontSize: 14, padding: '14px', borderRadius: 8, border: 'none', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', marginTop: 4 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = ORANGE_DIM }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = ORANGE }}>
              {loading
                ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>Signing in…</motion.span>
                : <><span>Sign in</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid rgba(27,42,94,0.07)', textAlign: 'center' }}>
            <p style={{ fontFamily: bod, fontSize: 13, color: 'rgba(17,28,66,0.42)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" style={{ color: ORANGE, fontWeight: 600, textDecoration: 'none' }}>Join AIPEA →</Link>
            </p>
          </div>
          <p style={{ fontFamily: bod, textAlign: 'center', marginTop: 18, fontSize: 12, color: 'rgba(17,28,66,0.22)' }}>
            Demo: any email + any password
          </p>
        </motion.div>
      </div>
    </div>
  )
}
