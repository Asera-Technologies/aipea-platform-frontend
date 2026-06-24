'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Lock, ShieldCheck } from 'lucide-react'
import { Starfield } from '@/components/ui/Starfield'
import {
  getPendingSignup,
  clearPendingSignup,
  saveUser,
  generateMemberId,
  TIER_PRICING,
  formatCedis,
  type PendingSignup,
} from '@/lib/auth'

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
  transition: 'border-color 0.2s', fontFamily: bod, letterSpacing: '0.02em',
}
const labelBase: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontFamily: bod,
}

type Status = 'idle' | 'processing' | 'success'

// ── Input formatters ──────────────────────────────────────────────────────────
const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
const formatCvc = (v: string) => v.replace(/\D/g, '').slice(0, 4)

/**
 * Simulated charge. Replace the body with the Paystack inline call later — e.g.
 * resolve from the Paystack `onSuccess` callback and reject from `onClose`.
 */
function simulateCharge(): Promise<{ reference: string }> {
  return new Promise(resolve => {
    setTimeout(() => resolve({ reference: `SIM-${Date.now()}` }), 1800)
  })
}

export default function Checkout() {
  const router = useRouter()
  const [pending, setPending] = useState<PendingSignup | null>(null)
  const [cardName,   setCardName]   = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry,     setExpiry]     = useState('')
  const [cvc,        setCvc]        = useState('')
  const [status,     setStatus]     = useState<Status>('idle')
  const [error,      setError]      = useState('')

  useEffect(() => {
    const p = getPendingSignup()
    if (!p) {
      router.push('/sign-up')
      return
    }
    // One-time client-only read of the pending registration after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPending(p)
  }, [router])

  if (!pending) {
    return (
      <div style={{ minHeight: '100vh', background: NAVY_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontFamily: dis, fontWeight: 800, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE }}>
          AIPEA
        </motion.span>
      </div>
    )
  }

  const amount = TIER_PRICING[pending.tier]

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!pending) return
    if (!cardName.trim())                  { setError('Enter the cardholder name.'); return }
    if (cardNumber.replace(/\s/g, '').length < 12) { setError('Enter a valid card number.'); return }
    if (expiry.length < 5)                 { setError('Enter a valid expiry date.'); return }
    if (cvc.length < 3)                    { setError('Enter a valid CVC.'); return }

    setStatus('processing')

    // TODO: swap simulateCharge() for the Paystack inline checkout here.
    await simulateCharge()

    saveUser({
      name: pending.name,
      email: pending.email,
      country: pending.country,
      tier: pending.tier,
      memberId: generateMemberId(),
      joinedAt: new Date().toISOString(),
    })
    clearPendingSignup()

    setStatus('success')
    await new Promise(r => setTimeout(r, 1100))
    router.push('/dashboard')
  }

  const onFocus = (ev: React.FocusEvent<HTMLInputElement>) => (ev.target.style.borderColor = ORANGE)
  const onBlur  = (ev: React.FocusEvent<HTMLInputElement>) => (ev.target.style.borderColor = 'rgba(255,255,255,0.08)')
  const busy = status !== 'idle'

  return (
    <div style={{ minHeight: '100vh', background: NAVY_DARK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <Starfield />
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 600, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 68%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 480, height: 380, background: 'radial-gradient(ellipse at 100% 100%, rgba(232,80,26,0.14) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 880 }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, textDecoration: 'none' }}>
            AIPEA
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 20, alignItems: 'stretch' }} className="aipea-checkout-grid">
          {/* ── Order summary ───────────────────────────────────────── */}
          <div style={{ background: NAVY_SURF, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }} />
            <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: bod, marginBottom: 22 }}>
                Order summary
              </p>

              <h1 style={{ fontFamily: dis, fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                AIPEA {pending.tier}
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontFamily: bod }}>
                Annual membership · billed yearly
              </p>

              <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Member', pending.name],
                  ['Email', pending.email],
                  ['Country', pending.country],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13, fontFamily: bod }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: bod }}>Total due today</span>
                  <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 30, color: '#fff', letterSpacing: '-0.02em' }}>{formatCedis(amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Payment form ────────────────────────────────────────── */}
          <div style={{ background: NAVY_SURF, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }} />

            {status === 'success' ? (
              <div style={{ padding: '72px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18, minHeight: 360 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,80,26,0.12)', border: '1px solid rgba(232,80,26,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={28} color={ORANGE} strokeWidth={2.5} />
                </motion.div>
                <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '-0.02em' }}>Payment confirmed</h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: bod }}>Activating your membership…</p>
              </div>
            ) : (
              <form onSubmit={handlePay} noValidate style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>Payment details</h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontFamily: bod }}>
                    Test mode — no real charge. Use any card (e.g. 4242 4242 4242 4242).
                  </p>
                </div>

                <div>
                  <label style={labelBase}>Cardholder name</label>
                  <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder={pending.name} disabled={busy}
                    style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div>
                  <label style={labelBase}>Card number</label>
                  <input value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} inputMode="numeric"
                    placeholder="4242 4242 4242 4242" disabled={busy} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelBase}>Expiry</label>
                    <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} inputMode="numeric"
                      placeholder="MM/YY" disabled={busy} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={labelBase}>CVC</label>
                    <input value={cvc} onChange={e => setCvc(formatCvc(e.target.value))} inputMode="numeric"
                      placeholder="123" disabled={busy} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 13, color: '#ff7b7b', fontFamily: bod, marginTop: -4 }}>
                    {error}
                  </motion.p>
                )}

                <button type="submit" disabled={busy}
                  style={{ width: '100%', background: busy ? ORANGE_DIM : ORANGE, color: '#fff', fontFamily: dis, fontWeight: 700, fontSize: 14, padding: '15px', borderRadius: 8, border: 'none', cursor: busy ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', marginTop: 2 }}
                  onMouseEnter={e => { if (!busy) e.currentTarget.style.background = ORANGE_DIM }}
                  onMouseLeave={e => { if (!busy) e.currentTarget.style.background = ORANGE }}>
                  {status === 'processing'
                    ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>Processing…</motion.span>
                    : <><Lock size={14} /> Pay {formatCedis(amount)}</>
                  }
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 2 }}>
                  <ShieldCheck size={13} color="rgba(255,255,255,0.3)" />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontFamily: bod }}>Secured by Paystack · coming soon</span>
                </div>

                <Link href="/sign-up" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginTop: 2 }}>
                  <ArrowLeft size={13} /> Back to details
                </Link>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
