'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Lock, ShieldCheck } from 'lucide-react'
import {
  getPendingSignup,
  clearPendingSignup,
  signUpAssociate,
  saveFakePaidUser,
  generateMemberId,
  getAuthErrorMessage,
  TIER_PRICING,
  formatCedis,
  type PendingSignup,
} from '@/lib/auth'

// --- Paystack types -----------------------------------------------------------

declare global {
  interface Window {
    PaystackPop: {
      setup(opts: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        firstname?: string
        lastname?: string
        metadata?: object
        callback: (resp: { reference: string }) => void
        onClose: () => void
      }): { openIframe(): void }
    }
  }
}

const PAYSTACK_PK = 'pk_test_ba70cf9c8c2fa86023db7c13dc59fde20e6fe119'

// --- Tokens -------------------------------------------------------------------

const ORANGE    = '#E8501A'
const ORANGE_DIM = '#c94314'
const NAVY_DARK = '#111c42'
const SURFACE   = '#f7f8fc'
const BORDER    = 'rgba(27,42,94,0.1)'
const MUTED     = 'rgba(17,28,66,0.5)'
const FAINT     = 'rgba(17,28,66,0.28)'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = 'var(--font-syne), sans-serif'
const bod = 'var(--font-inter), sans-serif'

type Status = 'idle' | 'processing' | 'success'

const TIER_PERKS: Record<PendingSignup['tier'], string[]> = {
  Associate:    ['Member directory listing', 'CPD hours tracker', 'Digital membership certificate'],
  Professional: ['All Associate benefits', 'Conference access & discount', 'Course library, first access'],
  Fellow:       ['All Professional benefits', 'Fellowship credential', 'Mentorship programme access'],
}

// --- Page ---------------------------------------------------------------------

export default function Checkout() {
  const router = useRouter()
  const [pending,      setPending]      = useState<PendingSignup | null>(null)
  const [scriptReady,  setScriptReady]  = useState(false)
  const [status,       setStatus]       = useState<Status>('idle')
  const [error,        setError]        = useState('')

  useEffect(() => {
    const p = getPendingSignup()
    if (!p) { router.push('/sign-up'); return }
    setPending(p)
  }, [router])

  async function activateAssociateMembership() {
    if (!pending) return
    try {
      await signUpAssociate(pending)
      clearPendingSignup()
      setStatus('success')
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch (err) {
      setStatus('idle')
      setError(getAuthErrorMessage(err))
    }
  }

  // Paid tiers (Professional/Fellow) aren't backed by real payment
  // verification yet — nothing server-side confirms the Paystack
  // transaction, so we can't grant a real persisted account the way the
  // free tier does. This keeps today's demo behaviour (local-only fake
  // activation) instead of pretending a paid membership was created;
  // superseded once Paystack verification ships server-side.
  function activatePaidMembershipFake() {
    if (!pending) return
    saveFakePaidUser({
      name:     pending.name,
      email:    pending.email,
      country:  pending.country,
      tier:     pending.tier,
      memberId: generateMemberId(),
      joinedAt: new Date().toISOString(),
    })
    clearPendingSignup()
    setStatus('success')
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  function handlePay() {
    if (!pending || status !== 'idle') return
    setError('')

    // Free tier: no payment required, create the real account immediately
    if (TIER_PRICING[pending.tier] === 0) {
      setStatus('processing')
      void activateAssociateMembership()
      return
    }

    if (!scriptReady) return
    setStatus('processing')

    const [first, ...rest] = pending.name.trim().split(' ')
    const handler = window.PaystackPop.setup({
      key:      PAYSTACK_PK,
      email:    pending.email,
      amount:   TIER_PRICING[pending.tier] * 100, // pesewas (GHS subunit)
      currency: 'GHS',
      ref:      `AIPEA-${Date.now()}`,
      firstname: first,
      lastname:  rest.join(' ') || undefined,
      metadata: {
        custom_fields: [
          { display_name: 'Membership Tier', variable_name: 'tier',    value: pending.tier    },
          { display_name: 'Country',         variable_name: 'country', value: pending.country },
        ],
      },
      callback(response) {
        // Payment confirmed: activate membership (fake, see comment above)
        activatePaidMembershipFake()
        void response.reference
      },
      onClose() {
        setStatus('idle')
        setError('Payment was cancelled. Try again when you\'re ready.')
      },
    })

    handler.openIframe()
  }

  if (!pending) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontFamily: dis, fontWeight: 800, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE }}>
          AIPEA
        </motion.span>
      </div>
    )
  }

  const amount = TIER_PRICING[pending.tier]
  const perks  = TIER_PERKS[pending.tier]
  const isFree = amount === 0

  const payDisabled = (!isFree && !scriptReady) || status === 'processing'

  return (
    <>
      {!isFree && (
        <Script
          src="https://js.paystack.co/v1/inline.js"
          onReady={() => setScriptReady(true)}
        />
      )}

      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ width: '100%', maxWidth: 860 }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link href="/" style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, textDecoration: 'none' }}>
              AIPEA
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 20, alignItems: 'stretch' }} className="aipea-checkout-grid">

            {/* -- Order summary --------------------------------------- */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_DIM})` }} />
              <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: FAINT, marginBottom: 22 }}>
                  Order summary
                </p>

                <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 24, color: NAVY_DARK, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  AIPEA {pending.tier}
                </h2>
                <p style={{ fontFamily: bod, fontSize: 13, color: MUTED, marginTop: 5 }}>
                  {isFree ? 'Free membership · no payment required' : 'Annual membership · billed yearly'}
                </p>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['Member', pending.name], ['Email', pending.email], ['Country', pending.country]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: bod, fontSize: 13 }}>
                      <span style={{ color: MUTED }}>{l}</span>
                      <span style={{ color: NAVY_DARK, fontWeight: 500, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: FAINT, marginBottom: 4 }}>
                    What&apos;s included
                  </p>
                  {perks.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(232,80,26,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={10} color={ORANGE} strokeWidth={2.5} />
                      </div>
                      <span style={{ fontFamily: bod, fontSize: 13, color: MUTED }}>{p}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                    <span style={{ fontFamily: bod, fontSize: 13, color: MUTED }}>Total due today</span>
                    <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 30, color: ORANGE, letterSpacing: '-0.02em' }}>{formatCedis(amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* -- Payment panel --------------------------------------- */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 60px rgba(27,42,94,0.07)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_DIM})` }} />

              {status === 'success' ? (
                <div style={{ flex: 1, padding: '72px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,80,26,0.09)', border: '1px solid rgba(232,80,26,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={28} color={ORANGE} strokeWidth={2.5} />
                  </motion.div>
                  <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 24, color: NAVY_DARK, letterSpacing: '-0.02em' }}>
                    {isFree ? 'Membership activated' : 'Payment confirmed'}
                  </h2>
                  <p style={{ fontFamily: bod, fontSize: 14, color: MUTED }}>
                    {isFree ? 'Redirecting to your dashboard…' : 'Activating your membership…'}
                  </p>
                </div>
              ) : (
                <div style={{ flex: 1, padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, color: NAVY_DARK, letterSpacing: '-0.02em' }}>
                      {isFree ? 'Activate your membership' : 'Complete your membership'}
                    </h2>
                    <p style={{ fontFamily: bod, fontSize: 13, color: MUTED, marginTop: 8, lineHeight: 1.65 }}>
                      {isFree
                        ? 'Your Associate membership is free. Click below to activate your account and access the member dashboard.'
                        : 'Click below to pay securely. Paystack\'s checkout handles your card details, and we never see them.'}
                    </p>

                    {!isFree && (
                      <>
                        <div style={{ marginTop: 28, padding: '18px 20px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                          <ShieldCheck size={20} color={ORANGE} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
                          <div>
                            <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: NAVY_DARK }}>Secured by Paystack</p>
                            <p style={{ fontFamily: bod, fontSize: 12, color: MUTED, marginTop: 3, lineHeight: 1.55 }}>
                              Your card details are entered directly in Paystack&apos;s encrypted iframe. PCI-DSS compliant.
                            </p>
                          </div>
                        </div>

                        <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(232,80,26,0.05)', border: '1px solid rgba(232,80,26,0.15)', borderRadius: 10 }}>
                          <p style={{ fontFamily: bod, fontSize: 12, color: MUTED, lineHeight: 1.55 }}>
                            <strong style={{ color: ORANGE }}>Test mode.</strong> Use card <strong>4084 0840 8408 4081</strong>, CVV <strong>408</strong>, PIN <strong>0000</strong>, any future expiry.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: 36 }}>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontFamily: bod, fontSize: 13, color: '#c0392b', marginBottom: 14 }}>
                        {error}
                      </motion.p>
                    )}

                    <button
                      onClick={handlePay}
                      disabled={payDisabled}
                      style={{
                        width: '100%', background: payDisabled ? ORANGE_DIM : ORANGE,
                        color: '#fff', fontFamily: dis, fontWeight: 700, fontSize: 15, padding: '16px',
                        borderRadius: 8, border: 'none', cursor: payDisabled ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => { if (!payDisabled) e.currentTarget.style.background = ORANGE_DIM }}
                      onMouseLeave={e => { if (!payDisabled) e.currentTarget.style.background = ORANGE }}>
                      {status === 'processing'
                        ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                            {isFree ? 'Activating membership…' : 'Opening Paystack…'}
                          </motion.span>
                        : !isFree && !scriptReady
                        ? 'Loading…'
                        : isFree
                        ? <><Check size={14} /> Activate free membership</>
                        : <><Lock size={14} /> Pay {formatCedis(amount)} with Paystack</>
                      }
                    </button>

                    <Link href="/sign-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: bod, fontSize: 13, color: MUTED, textDecoration: 'none', marginTop: 16 }}>
                      <ArrowLeft size={13} /> Back to details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
