'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { savePendingSignup, continueWithGoogle, getAuthErrorMessage, TIER_PRICING, formatCedis } from '@/lib/auth'
import { BrandPanel } from '@/components/auth/BrandPanel'
import { GoogleGlyph } from '@/components/auth/GoogleGlyph'

const ORANGE     = '#E8501A'
const ORANGE_DIM = '#c94314'
const NAVY_DARK  = '#111c42'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = 'var(--font-syne), sans-serif'
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

// --- Page ---------------------------------------------------------------------

export default function SignUp() {
  const router = useRouter()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [country,  setCountry]  = useState('')
  const [tier,     setTier]     = useState<Tier>('Professional')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [newsletterConsent, setNewsletterConsent] = useState(false)
  const [error,    setError]    = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  // Preselect the membership tier from ?tier= (e.g. from the pricing table CTAs)
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tier')
    if (t === 'Associate' || t === 'Professional' || t === 'Fellow') setTier(t)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())    { setError('Please enter your full name.'); return }
    if (!email.trim())   { setError('Please enter your email.'); return }
    if (!country.trim()) { setError('Please enter your country.'); return }
    if (!password)       { setError('Please choose a password.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    savePendingSignup({
      name: name.trim(),
      email: email.trim(),
      country: country.trim(),
      tier,
      password,
      newsletterConsent,
    })
    router.push('/checkout')
  }

  async function handleGoogleSignUp() {
    setError('')
    setGoogleLoading(true)
    try {
      await continueWithGoogle()
      router.push('/dashboard')
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setGoogleLoading(false)
    }
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
              <p style={{ fontFamily: bod, fontSize: 14, color: 'rgba(17,28,66,0.48)', marginBottom: 28 }}>
                Create your professional membership account.
              </p>

              <button type="button" onClick={handleGoogleSignUp} disabled={googleLoading}
                style={{ width: '100%', background: '#fff', color: NAVY_DARK, fontFamily: dis, fontWeight: 700, fontSize: 14, padding: '13px', borderRadius: 8, border: '1px solid rgba(27,42,94,0.15)', cursor: googleLoading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.background = '#f7f8fc' }}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <GoogleGlyph />
                {googleLoading ? 'Opening Google…' : 'Continue with Google'}
              </button>
              <p style={{ fontFamily: bod, fontSize: 11.5, color: 'rgba(17,28,66,0.32)', textAlign: 'center', marginTop: 8 }}>
                Instantly creates a free Associate membership.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(27,42,94,0.09)' }} />
                <span style={{ fontFamily: bod, fontSize: 11.5, color: 'rgba(17,28,66,0.3)' }}>or sign up with email</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(27,42,94,0.09)' }} />
              </div>

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
                        <p style={{ fontFamily: bod, fontSize: 11, color: 'rgba(17,28,66,0.38)', marginTop: 3 }}>
                          {formatCedis(TIER_PRICING[t.id])}{TIER_PRICING[t.id] === 0 ? '' : '/yr'}
                        </p>
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

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newsletterConsent}
                    onChange={e => setNewsletterConsent(e.target.checked)}
                    style={{ marginTop: 2, width: 15, height: 15, accentColor: ORANGE, cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: bod, fontSize: 12.5, color: 'rgba(17,28,66,0.5)', lineHeight: 1.55 }}>
                    Send me AIPEA news, event invites, and the occasional newsletter. You can unsubscribe anytime.
                  </span>
                </label>

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
                  {TIER_PRICING[tier] === 0 ? 'Continue to activation' : 'Continue to payment'} <ArrowRight size={15} />
                </button>

                <p style={{ fontFamily: bod, fontSize: 11, color: 'rgba(17,28,66,0.25)', textAlign: 'center' }}>
                  {TIER_PRICING[tier] === 0
                    ? 'Associate membership is free. No payment required.'
                    : 'Secure payment via Paystack. Membership activates immediately.'}
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
