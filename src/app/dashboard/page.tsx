'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, BookOpen, Calendar, BarChart3, Lock, LogOut, ArrowRight } from 'lucide-react'
import { getUser, clearUser, formatJoinDate, firstName, type AIPEAUser } from '@/lib/auth'

const ORANGE     = '#E8501A'
const ORANGE_DIM = '#c94314'
const NAVY        = '#1B2A5E'
const WHITE       = '#ffffff'
const SURFACE     = '#f7f8fc'
const BORDER      = 'rgba(27,42,94,0.09)'
const TEXT        = '#111c42'
const MUTED       = 'rgba(17,28,66,0.52)'
const FAINT       = 'rgba(17,28,66,0.3)'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const dis = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const bod = 'var(--font-inter), sans-serif'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning,'
  if (h < 18) return 'Good afternoon,'
  return 'Good evening,'
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.span
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontFamily: dis, fontWeight: 800, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE }}
      >
        AIPEA
      </motion.span>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function DashNav({ user, onSignOut }: { user: AIPEAUser; onSignOut: () => void }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 60,
      padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <Link href="/" style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, textDecoration: 'none' }}>
        AIPEA
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 13, color: MUTED, fontFamily: bod }}>
          {user.name}
        </span>
        <button onClick={onSignOut}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '7px 14px', cursor: 'pointer', color: MUTED, fontSize: 12, fontFamily: bod, transition: '0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </nav>
  )
}

// ─── Credential card (dark accent) ──────────────────────────────────────────────

function CredentialCard({ user }: { user: AIPEAUser }) {
  const tierColor = user.tier === 'Fellow' ? ORANGE_DIM : user.tier === 'Professional' ? ORANGE : '#2d3f82'
  return (
    <div style={{
      position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 360,
      background: 'linear-gradient(145deg, #1B2A5E 0%, #111c42 55%, #071024 100%)',
      border: '1px solid rgba(255,255,255,0.14)',
      boxShadow: '0 28px 80px rgba(27,42,94,0.22)',
      padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 18%, rgba(232,80,26,0.38) 0%, transparent 38%)', pointerEvents: 'none' }} />
      <div className="aipea-spin" style={{ position: 'absolute', right: -60, top: -60, width: 220, height: 220, border: '1px dashed rgba(255,255,255,0.14)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: -50, bottom: -60, width: 180, height: 180, border: '1px solid rgba(255,255,255,0.09)', borderRadius: '50%' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', color: ORANGE }}>AIPEA</span>
          <div style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: dis, fontWeight: 800, fontSize: 12, color: '#fff' }}>
            {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontFamily: bod }}>{user.tier} Member</p>
        <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(22px,2.5vw,30px)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{user.name}</h3>
        <span style={{ display: 'inline-flex', marginTop: 12, background: tierColor, borderRadius: 100, padding: '5px 14px', fontFamily: dis, fontWeight: 700, fontSize: 11, color: '#fff' }}>
          {user.tier}
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontFamily: bod }}>
            <span>CPD Hours</span><span>0 / 100 hrs</span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
            <motion.div initial={{ width: '0%' }} animate={{ width: '4%' }} transition={{ duration: 1.2, delay: 0.6, ease: EASE }} style={{ height: '100%', background: ORANGE, borderRadius: 100 }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Member since', formatJoinDate(user.joinedAt)], ['Member ID', user.memberId]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: bod }}>{l}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2, fontFamily: bod, wordBreak: 'break-all' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 16 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: bod }}>
            Africa Institute of Personal &amp; Executive Assistants
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Feature card (light) ───────────────────────────────────────────────────────

function FeatureCard({ accent, icon, title, meta }: {
  accent: string
  icon: React.ReactNode
  title: string
  meta: string
}) {
  return (
    <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 168, transition: 'transform 0.22s, border-color 0.22s, box-shadow 0.22s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(27,42,94,0.2)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(27,42,94,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ height: 3, background: accent }} />
      <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${accent}16`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: `1px solid rgba(232,80,26,0.3)`, color: ORANGE, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, fontFamily: dis }}>
          <Lock size={9} strokeWidth={2.5} />Soon
        </span>
      </div>
      <div style={{ padding: '18px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
        <h3 style={{ fontFamily: dis, fontWeight: 700, fontSize: 17, color: TEXT, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{title}</h3>
        <p style={{ fontSize: 12, color: FAINT, fontFamily: bod }}>{meta}</p>
      </div>
    </div>
  )
}

// ─── Dashboard page ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const router  = useRouter()
  const [user, setUser] = useState<AIPEAUser | null>(null)

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.push('/sign-in')
      return
    }
    // One-time client-only read of the persisted session after mount — the
    // intended use of an effect, so the cascading-render rule doesn't apply.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(u)
  }, [router])

  function handleSignOut() {
    clearUser()
    router.push('/')
  }

  if (!user) return <LoadingScreen />

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: EASE },
  })

  return (
    <div style={{ minHeight: '100vh', background: WHITE }}>
      <DashNav user={user} onSignOut={handleSignOut} />

      {/* ── Hero welcome ───────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '78vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', background: WHITE }}>
        <div style={{ position: 'absolute', top: '36%', right: '8%', width: 520, height: 520, background: 'radial-gradient(circle, rgba(232,80,26,0.12) 0%, transparent 62%)', pointerEvents: 'none' }} />
        <div className="aipea-spin" style={{ position: 'absolute', top: '20%', right: '14%', width: 360, height: 360, border: '1px dashed rgba(232,80,26,0.22)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '-3%', top: '46%', transform: 'translateY(-50%)', fontFamily: dis, fontWeight: 800, fontSize: '22vw', color: 'rgba(17,28,66,0.03)', letterSpacing: '-0.08em', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>EA</div>

        {([{ top: 84, left: 40 }, { top: 84, right: 40 }, { bottom: 28, left: 40 }, { bottom: 28, right: 40 }] as const).map((pos, i) => (
          <span key={i} style={{ position: 'absolute', ...pos, fontFamily: 'monospace', fontSize: 11, color: FAINT, pointerEvents: 'none' }}>+</span>
        ))}

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 40px 64px' }}>
          <motion.p {...fade(0.1)} style={{ fontSize: 15, color: MUTED, fontFamily: bod, marginBottom: 4 }}>
            {greeting()}
          </motion.p>

          <motion.h1 {...fade(0.28)} style={{ fontFamily: dis, fontWeight: 800, lineHeight: 0.88, letterSpacing: '-0.03em', color: ORANGE, marginBottom: 28, fontSize: 'clamp(72px, 14vw, 180px)' }}>
            {firstName(user.name)}.
          </motion.h1>

          <motion.div {...fade(0.48)} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(232,80,26,0.1)', border: '1px solid rgba(232,80,26,0.25)', borderRadius: 100, padding: '7px 16px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE, boxShadow: '0 0 8px rgba(232,80,26,0.6)' }} />
              <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: TEXT }}>AIPEA {user.tier}</span>
            </span>
            <span style={{ fontSize: 13, color: FAINT, fontFamily: bod }}>{user.memberId}</span>
            <span style={{ fontSize: 13, color: FAINT, fontFamily: bod }}>· Active since {formatJoinDate(user.joinedAt)}</span>
          </motion.div>
        </div>
      </section>

      {/* ── Platform section ───────────────────────────────────────── */}
      <section style={{ background: SURFACE, borderTop: `1px solid ${BORDER}`, padding: '100px 40px 120px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          <motion.div {...fade(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, paddingBottom: 32, borderBottom: `1px solid ${BORDER}`, gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: FAINT, marginBottom: 8 }}>Your platform</p>
              <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(28px,3vw,44px)', color: TEXT, letterSpacing: '-0.02em', lineHeight: 1 }}>Your platform is being built.</h2>
            </div>
            <p style={{ fontSize: 14, color: MUTED, fontFamily: bod, maxWidth: 240, textAlign: 'right', lineHeight: 1.6 }}>Early members get access first.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, alignItems: 'start' }} className="aipea-dash-grid">
            <motion.div {...fade(0.08)}>
              <CredentialCard user={user} />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="aipea-dash-bento">
              {[
                { accent: ORANGE, icon: <Users     size={19} color={ORANGE} />, title: 'Member Directory',    meta: 'Connect across the network' },
                { accent: NAVY,   icon: <BarChart3 size={19} color={NAVY}   />, title: 'CPD Tracker',         meta: '100 hours per year'         },
                { accent: ORANGE, icon: <BookOpen  size={19} color={ORANGE} />, title: 'Course Library',      meta: 'Certification courses'      },
                { accent: NAVY,   icon: <Calendar  size={19} color={NAVY}   />, title: 'Events & Conference', meta: 'Next event: Q2 2026'        },
              ].map((card, i) => (
                <motion.div key={card.title} {...fade(0.12 + i * 0.08)}>
                  <FeatureCard {...card} />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div {...fade(0.44)} style={{ marginTop: 56, padding: '32px 40px', background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: dis, fontWeight: 700, fontSize: 18, color: TEXT }}>You&apos;re in early.</h3>
              <p style={{ fontSize: 14, color: MUTED, marginTop: 4, fontFamily: bod }}>Every feature first — at your current rate, forever.</p>
            </div>
            <Link href="/#membership" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ORANGE, color: '#fff', fontFamily: dis, fontWeight: 700, fontSize: 13, padding: '12px 24px', borderRadius: 8, textDecoration: 'none', transition: '0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = ORANGE_DIM)}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = ORANGE)}>
              Upgrade membership <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
