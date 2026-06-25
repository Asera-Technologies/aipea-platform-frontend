'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { savePendingSignup, TIER_PRICING, formatCedis } from '@/lib/auth'
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

type Tier = 'Associate' | 'Professional' | 'Fellow'
const TIERS: { id: Tier; desc: string }[] = [
  { id: 'Associate',    desc: 'Emerging EAs'    },
  { id: 'Professional', desc: 'Established EAs' },
  { id: 'Fellow',       desc: 'Senior Leaders'  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUp() {
  const router = useRouter()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [country,  setCountry]  = useState('')
  const [tier,     setTier]     = useState<Tier>('Professional')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())    { setError('Please enter your full name.'); return }
    if (!email.trim())   { setError('Please enter your email.'); return }
    if (!country.trim()) { setError('Please enter your country.'); return }
    if (!password)       { setError('Please choose a password.'); return }
    savePendingSignup({ name: name.trim(), email: email.trim(), country: country.trim(), tier })
    router.push('/checkout')
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = ORANGE)
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(27,42,94,0.1)')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      <BrandPanel
        flex="0 0 42%"
        headline={<>Join Africa&apos;s leading professional community for EAs.</>}
        sub="Get certified, connected, and recognized. Create your account in under two minutes."
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 48px', overflowY: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ width: '100%', maxWidth: 480 }}>

          <div style={{ marginBottom: 36 }}>
                <Link href="/" style={{ fontFamily: bod, fontSize: 13, color: 'rgba(17,28,66,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = ORANGE)}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(17,28,66,0.55)')}>
                  ← Back to home
                </Link>
              </div>

              <h1 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(26px,3.2vw,38px)', color: NAVY_DARK, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 8 }}>
                Join AIPEA.
              </h1>
              <p style={{ fontFamily: bod, fontSize: 14, color: 'rgba(17,28,66,0.48)', marginBottom: 36 }}>
                Create your professional membership account.
              </p>

              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelBase}>Full name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Adwoa Mensah"
                      style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={labelBase}>Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                      style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                <div>
                  <label style={labelBase}>Country</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Ghana"
                    style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div>
                  <label style={labelBase}>Membership tier</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {TIERS.map(t => (
                      <button key={t.id} type="button" onClick={() => setTier(t.id)}
                        style={{
                          padding: '14px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                          transition: 'border-color 0.18s, background 0.18s',
                          border: `1px solid ${tier === t.id ? ORANGE : 'rgba(27,42,94,0.1)'}`,
                          background: tier === t.id ? 'rgba(232,80,26,0.06)' : '#f7f8fc',
                        }}>
                        <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: tier === t.id ? ORANGE : 'rgba(17,28,66,0.55)' }}>{t.id}</p>
                        <p style={{ fontFamily: bod, fontSize: 11, color: 'rgba(17,28,66,0.38)', marginTop: 3 }}>{formatCedis(TIER_PRICING[t.id])}/yr</p>
                        <p style={{ fontFamily: bod, fontSize: 10, color: 'rgba(17,28,66,0.28)', marginTop: 1 }}>{t.desc}</p>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontFamily: bod, fontSize: 11, color: 'rgba(17,28,66,0.28)', marginTop: 7 }}>You can upgrade your tier at any time.</p>
                </div>

                <div>
                  <label style={labelBase}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" style={{ ...inputBase, paddingRight: 46 }} onFocus={onFocus} onBlur={onBlur} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,28,66,0.28)', display: 'flex', alignItems: 'center' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ fontFamily: bod, fontSize: 13, color: '#c0392b', marginTop: -6 }}>
                    {error}
                  </motion.p>
                )}

                <button type="submit"
                  style={{ width: '100%', background: ORANGE, color: '#fff', fontFamily: dis, fontWeight: 700, fontSize: 14, padding: '14px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', marginTop: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.background = ORANGE_DIM)}
                  onMouseLeave={e => (e.currentTarget.style.background = ORANGE)}>
                  Continue to payment <ArrowRight size={15} />
                </button>

                <p style={{ fontFamily: bod, fontSize: 11, color: 'rgba(17,28,66,0.25)', textAlign: 'center' }}>
                  Secure payment via Paystack. Membership activates within 24 hours.
                </p>
              </form>

              <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(27,42,94,0.07)', textAlign: 'center' }}>
                <p style={{ fontFamily: bod, fontSize: 13, color: 'rgba(17,28,66,0.42)' }}>
                  Already a member?{' '}
                  <Link href="/sign-in" style={{ color: ORANGE, fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
                </p>
              </div>
        </motion.div>
      </div>
    </div>
  )
}
