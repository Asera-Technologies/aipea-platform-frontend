'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { Starfield } from '@/components/ui/Starfield'
import { saveUser, generateMemberId, firstName } from '@/lib/auth'

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
  { id: 'Associate',    price: '₵500/yr',   desc: 'Emerging EAs'    },
  { id: 'Professional', price: '₵1,200/yr', desc: 'Established EAs' },
  { id: 'Fellow',       price: '₵2,500/yr', desc: 'Senior / Leaders' },
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
  const [step,     setStep]     = useState<'form' | 'success'>('form')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())    { setError('Please enter your full name.'); return }
    if (!email.trim())   { setError('Please enter your email.'); return }
    if (!country.trim()) { setError('Please enter your country.'); return }
    if (!password)       { setError('Please choose a password.'); return }

    setStep('success')
    await new Promise(r => setTimeout(r, 1400))

    saveUser({
      name: name.trim(),
      email: email.trim(),
      tier,
      country: country.trim(),
      memberId: generateMemberId(),
      joinedAt: new Date().toISOString(),
    })

    router.push('/dashboard')
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

          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '44px 40px' }}>
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
                    Create my account <ArrowRight size={15} />
                  </button>

                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontFamily: bod }}>
                    Secure payment via Paystack. Membership activates within 24 hours.
                  </p>
                </form>

                <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', fontFamily: bod }}>
                    Already a member?{' '}
                    <Link href="/sign-in" style={{ color: ORANGE, fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}
                style={{ padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.1 }}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,80,26,0.12)', border: `1px solid rgba(232,80,26,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={28} color={ORANGE} strokeWidth={2.5} />
                </motion.div>
                <div>
                  <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ease: EASE }}
                    style={{ fontFamily: dis, fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: '-0.02em' }}>
                    Welcome to AIPEA, {firstName(name)}.
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8, fontFamily: bod }}>
                    Setting up your account…
                  </motion.p>
                </div>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
                  style={{ display: 'flex', gap: 6 }}>
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE, display: 'block' }} />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
