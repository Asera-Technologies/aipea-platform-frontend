'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Download, Mail } from 'lucide-react'
import {
  PageShell, PageHero, SectionHeading, CTASection,
} from '@/components/site/PageKit'
import { Reveal } from '@/components/site/Reveal'
import { C, dis, bod, INNER, SECTION, EASE } from '@/components/site/tokens'
import { useAuth } from '@/hooks/useAuth'
import { saveScopeAudit, getAuthErrorMessage } from '@/lib/auth'
import { CONTACT, ORG } from '@/lib/facts'
import {
  HORIZON_OPTIONS, SCOPE_OPTIONS, resolveTrack,
  savePendingScopeAudit, getPendingScopeAudit, clearPendingScopeAudit,
  type HorizonId, type ScopeLevel, type TrackFinderResult,
} from '@/lib/trackFinder'

const PROSPECTUS_HREF = '/docs/aipea-2026-prospectus.pdf'
const JUSTIFICATION_MAIL = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Request: Letter to Your Boss Justification Pack')}&body=${encodeURIComponent('Hello Secretariat,\n\nI have completed my AIPEA Professional Scope Audit and would like the corporate justification pack to share with my HR Director / Executive.\n\nThank you.')}`

type Step = 'horizon' | 'scope' | 'result'

export default function TrackFinderPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [step, setStep] = useState<Step>('horizon')
  const [horizon, setHorizon] = useState<HorizonId | null>(null)
  const [scope, setScope] = useState<ScopeLevel | null>(null)
  const [result, setResult] = useState<TrackFinderResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [celebrateKey, setCelebrateKey] = useState(0)
  const resumedPending = useRef(false)

  // After sign-in / sign-up, resume a pending audit from sessionStorage.
  useEffect(() => {
    if (authLoading || !user || !profile || resumedPending.current) return
    const pending = getPendingScopeAudit()
    if (!pending) return
    resumedPending.current = true

    setHorizon(pending.horizon)
    setScope(pending.scope)
    setResult(resolveTrack(pending.horizon, pending.scope))
    setStep('result')
    setCelebrateKey((k) => k + 1)
    setSaving(true)
    setError('')

    void saveScopeAudit(pending.horizon, pending.scope)
      .then(() => {
        clearPendingScopeAudit()
        setSaved(true)
      })
      .catch((err) => setError(getAuthErrorMessage(err)))
      .finally(() => setSaving(false))
  }, [authLoading, user, profile])

  function chooseHorizon(id: HorizonId) {
    setHorizon(id)
    setScope(null)
    setResult(null)
    setSaved(false)
    setError('')
    setStep('scope')
  }

  function chooseScope(id: ScopeLevel) {
    if (!horizon) return
    const next = resolveTrack(horizon, id)
    setScope(id)
    setResult(next)
    setSaved(false)
    setError('')
    setStep('result')
    setCelebrateKey((k) => k + 1)
  }

  async function handleSave() {
    if (!horizon || !scope) return
    setError('')

    if (!user) {
      savePendingScopeAudit({ horizon, scope })
      router.push(`/sign-in?next=${encodeURIComponent('/certification/track-finder')}`)
      return
    }

    setSaving(true)
    try {
      await saveScopeAudit(horizon, scope)
      clearPendingScopeAudit()
      setSaved(true)
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Track Finder"
        title="Find your path by"
        highlight="the problems you solve."
        subtitle="AIPEA certification is not about how long you have held a title. Complete the Professional Scope Audit to map your operational footprint to the exact designation that fits."
        image="/images/conference/optimized/certification-hero.webp"
        primary={{ label: 'Start the audit', href: '#audit' }}
        secondary={{ label: 'See all designations', href: '/certification#strands' }}
      />

      <section id="audit" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Professional Scope Audit"
            title={step === 'result' ? 'Your recommended track.' : step === 'scope' ? 'Define your accountability.' : 'Select your operational horizon.'}
            aside={
              step === 'result'
                ? 'Based on the nature of the corporate problems you solve daily — not your job title.'
                : 'Two questions. One designation. No superficial title matching.'
            }
          />

          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
            {([
              { id: 'horizon', n: '01', label: 'Horizon' },
              { id: 'scope', n: '02', label: 'Scope' },
              { id: 'result', n: '03', label: 'Result' },
            ] as const).map((s) => {
              const active = step === s.id
              const done =
                (s.id === 'horizon' && horizon !== null) ||
                (s.id === 'scope' && scope !== null) ||
                (s.id === 'result' && result !== null)
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: active || done ? 1 : 0.4 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    fontFamily: dis, fontWeight: 800, fontSize: 11,
                    background: active ? C.orange : done ? C.navy : C.surface,
                    color: active || done ? C.white : C.muted,
                    border: `1px solid ${active ? C.orange : C.border}`,
                  }}>{done && !active ? <Check size={13} /> : s.n}</span>
                  <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: active ? C.orange : C.muted }}>{s.label}</span>
                </div>
              )
            })}
          </div>

          {step === 'horizon' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="aipea-feature-grid">
              {HORIZON_OPTIONS.map((opt, i) => (
                <Reveal key={opt.id} delay={0.06 * i}>
                  <button
                    type="button"
                    onClick={() => chooseHorizon(opt.id)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '28px 26px', borderRadius: 20, border: `1.5px solid ${C.border}`,
                      background: C.white, boxShadow: '0 12px 34px rgba(17,28,66,0.06)',
                      transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 48px rgba(27,42,94,0.12)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(17,28,66,0.06)' }}
                  >
                    <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginBottom: 10 }}>Option {opt.id}</p>
                    <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{opt.label}</h3>
                    <p style={{ fontFamily: bod, fontSize: 12.5, color: C.faint, marginTop: 6 }}>{opt.subtitle}</p>
                    <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.65, color: C.muted, marginTop: 14 }}>{opt.body}</p>
                  </button>
                </Reveal>
              ))}
            </div>
          )}

          {step === 'scope' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 920, margin: '0 auto' }} className="aipea-feature-grid">
              {SCOPE_OPTIONS.map((opt, i) => (
                <Reveal key={opt.id} delay={0.06 * i}>
                  <button
                    type="button"
                    onClick={() => chooseScope(opt.id)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '30px 28px', borderRadius: 20, border: `1.5px solid ${C.border}`,
                      background: C.white, boxShadow: '0 12px 34px rgba(17,28,66,0.06)',
                      transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 48px rgba(27,42,94,0.12)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(17,28,66,0.06)' }}
                  >
                    <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginBottom: 10 }}>{opt.label}</p>
                    <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, color: C.text, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{opt.subtitle}</h3>
                    <p style={{ fontFamily: bod, fontSize: 14, lineHeight: 1.7, color: C.muted, marginTop: 14 }}>{opt.body}</p>
                  </button>
                </Reveal>
              ))}
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: 8 }}>
                <button type="button" onClick={() => setStep('horizon')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: bod, fontSize: 13, color: C.muted, textDecoration: 'underline' }}>
                  ← Change operational horizon
                </button>
              </div>
            </div>
          )}

          {step === 'result' && result && (
            <Reveal>
              <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>
                <ResultConfetti burstKey={celebrateKey} />
                <motion.div
                  key={`result-card-${celebrateKey}`}
                  initial={{ opacity: 0, scale: 0.94, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{
                    position: 'relative', zIndex: 1, borderRadius: 24, border: `1px solid ${C.border}`,
                    background: C.white, overflow: 'hidden', boxShadow: '0 22px 60px rgba(17,28,66,0.10)',
                  }}
                >
                <div style={{ padding: '36px 40px', background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDark} 100%)`, color: C.white }}>
                  <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orangeOnDark }}>Recommended track</p>
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,3.4vw,40px)', letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 12 }}>
                    {result.track.name}
                  </h3>
                  <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 18, color: C.orangeOnDark, marginTop: 10 }}>
                    {result.track.acronym}
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}> · {result.strand.name}</span>
                  </p>
                </div>

                <div style={{ padding: '32px 40px', display: 'grid', gap: 22 }}>
                  <MetaRow label="Primary focus" value={result.coreFocus} />
                  <MetaRow label="Operational horizon" value={result.strand.horizon} />
                  <MetaRow label="Target accountability" value={result.track.scopeLabel} />
                  <MetaRow label="The problem you solve" value={result.problemSolved} />
                  <div>
                    <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.faint, marginBottom: 8 }}>Key capstone</p>
                    <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 17, color: C.text }}>{result.track.capstone.name}</p>
                    <p style={{ fontFamily: bod, fontSize: 14, lineHeight: 1.65, color: C.muted, marginTop: 6 }}>{result.track.capstone.desc}</p>
                  </div>

                  {error && (
                    <p style={{ fontFamily: bod, fontSize: 13, color: '#c0392b', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.18)', borderRadius: 8, padding: '12px 14px' }}>
                      {error}
                    </p>
                  )}

                  {saved ? (
                    <div style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.28)' }}>
                      <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.text }}>Audit saved to your member profile.</p>
                      <p style={{ fontFamily: bod, fontSize: 13.5, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
                        Your track results email is on its way to {profile?.email ?? 'your account email'}. You can also review this recommendation anytime from your dashboard.
                      </p>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                        <Link href="/dashboard" style={primaryBtn}>Go to dashboard <ArrowRight size={14} /></Link>
                        <a href={PROSPECTUS_HREF} download style={secondaryBtn}><Download size={14} /> Download prospectus</a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 14 }}>
                      <button type="button" onClick={() => void handleSave()} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.7 : 1, border: 'none', cursor: saving ? 'default' : 'pointer', width: '100%', justifyContent: 'center' }}>
                        {saving ? 'Saving your audit…' : user ? 'Save audit & email my results' : 'Sign in to save & email my results'}
                        {!saving && <ArrowRight size={14} />}
                      </button>
                      {!user && (
                        <p style={{ fontFamily: bod, fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 1.6 }}>
                          Anyone can run the audit. Saving it to your profile and receiving the post-audit email requires an AIPEA account.{' '}
                          <Link href={`/sign-up?next=${encodeURIComponent('/certification/track-finder')}`} style={{ color: C.orange, fontWeight: 600 }} onClick={() => { if (horizon && scope) savePendingScopeAudit({ horizon, scope }) }}>
                            Create a free Associate account →
                          </Link>
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button type="button" onClick={() => { setStep('horizon'); setHorizon(null); setScope(null); setResult(null); setSaved(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: bod, fontSize: 13, color: C.muted, textDecoration: 'underline' }}>
                          Retake the audit
                        </button>
                        <Link href="/certification#strands" style={{ fontFamily: bod, fontSize: 13, color: C.muted }}>Compare all designations</Link>
                      </div>
                    </div>
                  )}
                </div>
                </motion.div>
              </div>

              {saved && (
                <div style={{ maxWidth: 820, margin: '28px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="aipea-feature-grid">
                  <NextStepCard
                    icon={<Download size={18} color={C.orange} />}
                    title="Review your prospectus"
                    body={`Download the curriculum breakdown for the ${result.track.acronym} path.`}
                    href={PROSPECTUS_HREF}
                    cta="Download PDF"
                    download
                  />
                  <NextStepCard
                    icon={<Mail size={18} color={C.orange} />}
                    title="Justify corporate funding"
                    body="Over 80% of AIPEA delegates receive partial or full sponsorship from their employers. Request the Letter to Your Boss pack."
                    href={JUSTIFICATION_MAIL}
                    cta="Request justification pack"
                  />
                </div>
              )}
            </Reveal>
          )}
        </div>
      </section>

      <section style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="How placement works"
            title="A two-axis matrix, not a title quiz."
            aside={`${ORG.abbreviation} maps operational horizon against accountability scope to place you on one of six designations.`}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="aipea-feature-grid">
            {[
              { label: 'Horizon 1 · Tactical', a: 'CERTPA', b: 'SCPA' },
              { label: 'Horizon 2 · Strategic', a: 'CEA', b: 'SCEA' },
              { label: 'Horizon 3 · Institutional', a: 'CCoS', b: 'SCCoS' },
            ].map((row) => (
              <div key={row.label} style={{ padding: '22px 24px', borderRadius: 16, border: `1px solid ${C.border}`, background: C.bg }}>
                <p style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.orange }}>{row.label}</p>
                <p style={{ fontFamily: bod, fontSize: 13.5, color: C.muted, marginTop: 12 }}>Scope A → <strong style={{ color: C.text }}>{row.a}</strong></p>
                <p style={{ fontFamily: bod, fontSize: 13.5, color: C.muted, marginTop: 6 }}>Scope B → <strong style={{ color: C.text }}>{row.b}</strong></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to certify the value you already bring?"
        body="Save your audit, then talk to the Secretariat to lock in your preferred learning matrix for the next intake."
        primary={{ label: 'Talk to the Secretariat', href: '/about#contact' }}
        secondary={{ label: 'Explore certification', href: '/certification' }}
      />
    </PageShell>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.faint, marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: bod, fontSize: 15, lineHeight: 1.65, color: C.text }}>{value}</p>
    </div>
  )
}

type ConfettiPiece = {
  id: number
  x: number
  y: number
  rotate: number
  delay: number
  size: number
  color: string
  shape: 'rect' | 'circle' | 'strip'
}

const CONFETTI_COLORS = [C.orange, C.orangeOnDark, C.navy, C.navyDark, '#F6C344', '#ffffff']

function ResultConfetti({ burstKey }: { burstKey: number }) {
  const reduced = useReducedMotion()
  const pieces = useMemo<ConfettiPiece[]>(() => {
    if (reduced || burstKey === 0) return []
    return Array.from({ length: 48 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 48 + (i % 5) * 0.18
      const distance = 120 + (i % 7) * 38
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40 - (i % 4) * 18,
        rotate: (i * 47) % 360,
        delay: (i % 8) * 0.03,
        size: 6 + (i % 5) * 2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'strip' : 'rect',
      }
    })
  }, [burstKey, reduced])

  if (pieces.length === 0) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-48px -36px',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'visible',
      }}
    >
      {pieces.map((piece) => (
        <motion.span
          key={`${burstKey}-${piece.id}`}
          initial={{ opacity: 0, x: 0, y: 40, scale: 0.4, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: piece.x,
            y: [40, piece.y * 0.55, piece.y + 90],
            scale: [0.4, 1.05, 0.85],
            rotate: piece.rotate + 180,
          }}
          transition={{ duration: 1.55, delay: piece.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '18%',
            width: piece.shape === 'strip' ? piece.size * 0.45 : piece.size,
            height: piece.shape === 'strip' ? piece.size * 2.2 : piece.size,
            borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'strip' ? 2 : 3,
            background: piece.color,
            boxShadow: piece.color === '#ffffff' ? '0 0 0 1px rgba(17,28,66,0.12)' : undefined,
          }}
        />
      ))}
    </div>
  )
}

function NextStepCard({ icon, title, body, href, cta, download }: {
  icon: ReactNode; title: string; body: string; href: string; cta: string; download?: boolean
}) {
  return (
    <a href={href} download={download || undefined} style={{ textDecoration: 'none', padding: '22px 24px', borderRadius: 16, border: `1px solid ${C.border}`, background: C.bg, display: 'block' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', marginBottom: 14 }}>{icon}</div>
      <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 16, color: C.text }}>{title}</p>
      <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.65, color: C.muted, marginTop: 8 }}>{body}</p>
      <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 12.5, color: C.orange, marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{cta} <ArrowRight size={13} /></p>
    </a>
  )
}

const primaryBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: C.orange, color: C.white, fontFamily: dis, fontWeight: 700, fontSize: 14,
  padding: '14px 22px', borderRadius: 10, textDecoration: 'none',
}

const secondaryBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: C.white, color: C.text, fontFamily: dis, fontWeight: 700, fontSize: 13.5,
  padding: '13px 18px', borderRadius: 10, textDecoration: 'none',
  border: `1px solid ${C.borderHover}`,
}