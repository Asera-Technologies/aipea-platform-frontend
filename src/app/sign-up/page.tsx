'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Starfield } from '@/components/ui/Starfield'
import { savePendingSignup, TIER_PRICING, formatCedis } from '@/lib/auth'

const ORANGE     = '#E8501A'
const ORANGE_DIM = '#c94314'
const NAVY_DARK  = '#111c42'
const NAVY_SURF  = '#16224d'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const bod = 'var(--font-inter), sans-serif'

const inputBase: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, padding: '14px 16px', fontSize: 14, color: '#fff', outline: 'none',
  transition: 'border-color 0.2s', fontFamily: bod,
}
const labelBase: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontFamily: bod,
}

type Tier = 'Associate' | 'Professional' | 'Fellow'

const TIERS: { id: Tier; price: string; desc: string }[] = [
  { id: 'Associate',    price: `${formatCedis(TIER_PRICING.Associate)}/yr`,    desc: 'Emerging EAs'    },
  { id: 'Professional', price: `${formatCedis(TIER_PRICING.Professional)}/yr`, desc: 'Established EAs' },
  { id: 'Fellow',       price: `${formatCedis(TIER_PRICING.Fellow)}/yr`,       desc: 'Senior / Leaders' },
]

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

    // Hold the registration details, then move to the payment step. The account
    // is only created once payment is confirmed on the checkout page.
    savePendingSignup({ name: name.trim(), email: email.trim(), country: country.trim(), tier })
    router.push('/checkout')
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = ORANGE)
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')

  return (
    <div style={{ minHeight: '100vh', background: NAVY_DARK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <Starfield />
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 600, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 68%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 480, height: 380, background: 'radial-gradient(ellipse at 0% 100%, rgba(232,80,26,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 520 }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, textDecoration: 'none' }}>
            AIPEA
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: NAVY_SURF, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
          {/* Top accent line */}
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }} />

          <div style={{ padding: '44px 40px' }}>
            <h1 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,4vw,40px)', color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 8 }}>
              Join AIPEA.
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36, fontFamily: bod }}>
              Create your professional membership account.
            </p>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Name + Email row */}
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

              {/* Country */}
              <div>
                <label style={labelBase}>Country</label>
                <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Ghana"
                  style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              </div>

              {/* Tier picker */}
              <div>
                <label style={labelBase}>Membership tier</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {TIERS.map(t => (
                    <button key={t.id} type="button" onClick={() => setTier(t.id)}
                      style={{
                        padding: '14px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: '0.2s',
                        border:   `1px solid ${tier === t.id ? ORANGE : 'rgba(255,255,255,0.08)'}`,
                        background: tier === t.id ? 'rgba(232,80,26,0.10)' : 'rgba(255,255,255,0.03)',
                      }}>
                      <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: tier === t.id ? ORANGE : 'rgba(255,255,255,0.55)' }}>{t.id}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3, fontFamily: bod }}>{t.price}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 1, fontFamily: bod }}>{t.desc}</p>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 8, fontFamily: bod }}>You can upgrade your tier at any time.</p>
              </div>

              {/* Password */}
              <div>
                <label style={labelBase}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" style={{ ...inputBase, paddingRight: 46 }} onFocus={onFocus} onBlur={onBlur} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: 13, color: '#ff7b7b', fontFamily: bod, marginTop: -6 }}>
                  {error}
                </motion.p>
              )}

              <button type="submit"
                style={{ width: '100%', background: ORANGE, color: '#fff', fontFamily: dis, fontWeight: 700, fontSize: 14, padding: '15px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', marginTop: 4 }}
                onMouseEnter={e => (e.currentTarget.style.background = ORANGE_DIM)}
                onMouseLeave={e => (e.currentTarget.style.background = ORANGE)}>
                Continue to payment <ArrowRight size={15} />
              </button>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontFamily: bod }}>
                Next: secure payment via Paystack. Your account is created once payment is confirmed.
              </p>
            </form>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', fontFamily: bod }}>
                Already a member?{' '}
                <Link href="/sign-in" style={{ color: ORANGE, fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
