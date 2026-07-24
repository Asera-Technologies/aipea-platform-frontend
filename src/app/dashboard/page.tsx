'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Users, BookOpen, Calendar, BarChart3, LogOut, ArrowRight } from 'lucide-react'
import { signOutMember, formatJoinDate, firstName } from '@/lib/auth'
import { useAuth, type MemberProfile } from '@/hooks/useAuth'
import { C, dis, bod, EASE } from '@/components/site/tokens'
import { Logo } from '@/components/site/Logo'

// Local aliases so the diff against the rest of this file stays small —
// values are the shared tokens, not re-declared constants.
const ORANGE     = C.orange
const ORANGE_DIM = C.orangeDim
const NAVY       = C.navy
const NAVY_DARK  = C.navyDark
const WHITE      = C.white
const SURFACE    = C.surface
const BORDER     = C.border
const TEXT       = C.text
const MUTED      = C.muted
const FAINT      = C.faint
// Brand orange fails WCAG AA at small sizes directly on navy (see tokens.ts) —
// use this instead of ORANGE for text sitting on the dark hero/card/nav surfaces.
const ORANGE_ON_DARK = C.orangeOnDark

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning,'
  if (h < 18) return 'Good afternoon,'
  return 'Good evening,'
}

// --- Loading ------------------------------------------------------------------

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

// --- Navbar -------------------------------------------------------------------

function DashNav({ user, onSignOut }: { user: MemberProfile; onSignOut: () => void }) {
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <nav className="aipea-dash-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 64,
      padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(17,28,66,0.97)', backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
        <Logo height={50} priority />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(232,80,26,0.18)', border: '1px solid rgba(232,80,26,0.36)', display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 11, color: ORANGE_ON_DARK, flexShrink: 0 }}>
            {initials}
          </div>
          <span className="aipea-dash-name" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: bod, whiteSpace: 'nowrap' }}>{user.name}</span>
        </div>
        <button onClick={onSignOut}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(255,255,255,0.11)', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: bod, whiteSpace: 'nowrap', flexShrink: 0, transition: 'border-color 0.2s, color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </nav>
  )
}

// --- Credential card ----------------------------------------------------------

const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace'

function CredentialCard({ user }: { user: MemberProfile }) {
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const reduced = useReducedMotion()
  return (
    <div style={{
      position: 'relative', borderRadius: 22, overflow: 'hidden',
      background: 'linear-gradient(145deg, #1e3070 0%, #111c42 55%, #071024 100%)',
      border: '1px solid rgba(255,255,255,0.16)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
      padding: '30px 32px 26px', display: 'flex', flexDirection: 'column', gap: 26,
    }}>
      {/* glows */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 15%, rgba(232,80,26,0.45) 0%, transparent 42%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 85%, rgba(27,42,94,0.6) 0%, transparent 50%)', pointerEvents: 'none' }} />
      {/* Guilloché — faint diagonal engine-turning, the security-print texture of
          a real credential. Pure CSS repeating gradient, very low opacity. */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 8px)' }} />
      {/* One-shot holographic sheen sweeping across on load. */}
      {!reduced && (
        <motion.div
          initial={{ x: '-140%' }}
          animate={{ x: '140%' }}
          transition={{ duration: 1.5, delay: 0.5, ease: EASE }}
          style={{ position: 'absolute', top: 0, bottom: 0, width: '55%', background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.16), transparent)', pointerEvents: 'none', transform: 'skewX(-18deg)' }}
        />
      )}

      {/* Top row: wordmark + chip */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE_ON_DARK }}>AIPEA</span>
        {/* EMV-style chip */}
        <div style={{ width: 40, height: 30, borderRadius: 7, background: 'linear-gradient(135deg, #e9c46a 0%, #d4a437 45%, #b8860b 100%)', border: '1px solid rgba(255,255,255,0.35)', position: 'relative', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5)' }}>
          <div style={{ position: 'absolute', inset: '6px 0', borderTop: '1px solid rgba(90,60,0,0.4)', borderBottom: '1px solid rgba(90,60,0,0.4)' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(90,60,0,0.4)' }} />
        </div>
      </div>

      {/* Name + tier */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: bod, fontSize: 10, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
          {user.tier} Member
        </p>
        <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(22px, 2.4vw, 30px)', color: WHITE, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {user.name}
        </h3>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.32)', borderRadius: 100, padding: '5px 13px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 7px rgba(34,197,94,0.8)', flexShrink: 0 }} />
          <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.88)' }}>Active · {user.tier}</span>
        </div>
      </div>

      {/* Member ID — embossed, monospaced, the way it reads on a card face */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: bod, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Member ID</div>
        <div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.94)', textShadow: '0 1px 0 rgba(0,0,0,0.4)' }}>{user.memberId}</div>
      </div>

      {/* Footer meta */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.26)', fontFamily: bod, marginBottom: 3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Member since</div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{formatJoinDate(user.joinedAt)}</div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', fontFamily: dis, fontWeight: 800, fontSize: 12, color: WHITE, flexShrink: 0 }}>
          {initials}
        </div>
      </div>
      <span style={{ position: 'relative', zIndex: 1, fontSize: 9, color: 'rgba(255,255,255,0.16)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: bod }}>
        Africa Institute of Personal &amp; Executive Assistants
      </span>
    </div>
  )
}

// --- Stat tile ----------------------------------------------------------------

function StatTile({ label, value, sub, leftBorder }: { label: string; value: string; sub?: string; leftBorder?: string }) {
  return (
    <div style={{
      background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 14,
      borderLeft: leftBorder ? `3px solid ${leftBorder}` : `1px solid ${BORDER}`,
      padding: '22px 24px',
    }}>
      <p style={{ fontFamily: bod, fontSize: 10, color: FAINT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</p>
      <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, color: leftBorder === ORANGE ? ORANGE : TEXT, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: bod, fontSize: 12, color: MUTED, marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

// --- CPD tile (has progress bar) ---------------------------------------------

function CPDTile() {
  return (
    <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${NAVY_DARK}`, borderRadius: 14, padding: '22px 24px' }}>
      <p style={{ fontFamily: bod, fontSize: 10, color: FAINT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>CPD Progress</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        {/* AIPEA has not yet defined CPD hours, renewal period or categories, so
            the tile shows the tracker as pending rather than inventing a target. */}
        <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, color: TEXT, letterSpacing: '-0.02em', lineHeight: 1 }}>0</span>
        <span style={{ fontFamily: bod, fontSize: 13, color: MUTED }}> hrs logged</span>
      </div>
      <div style={{ marginTop: 12, height: 3, background: SURFACE, borderRadius: 100, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: '0%' }} transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
          style={{ height: '100%', background: NAVY_DARK, borderRadius: 100 }} />
      </div>
      <p style={{ fontFamily: bod, fontSize: 12, color: MUTED, marginTop: 8 }}>Annual target. Logs open soon.</p>
    </div>
  )
}

// --- Feature card -------------------------------------------------------------

// Status encodes the real build state of each feature, so the roadmap tells the
// member the truth about what's live vs coming rather than a flat "soon".
type FeatureStatus = 'Building' | 'Planned'
const STATUS_STYLE: Record<FeatureStatus, { fg: string; bg: string; bd: string }> = {
  Building: { fg: '#b45309', bg: 'rgba(232,80,26,0.09)', bd: 'rgba(232,80,26,0.28)' },
  Planned:  { fg: FAINT, bg: 'rgba(17,28,66,0.05)', bd: BORDER },
}

function FeatureCard({ iconColor, icon, title, desc, status, step }: { iconColor: string; icon: React.ReactNode; title: string; desc: string; status: FeatureStatus; step: string }) {
  const s = STATUS_STYLE[status]
  return (
    <div style={{ position: 'relative', background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflow: 'hidden', transition: 'box-shadow 0.22s, border-color 0.22s, transform 0.22s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 14px 40px rgba(27,42,94,0.1)'; e.currentTarget.style.borderColor = 'rgba(27,42,94,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'none' }}>
      {/* Ghost step number — quiet ordering cue for the roadmap. */}
      <span style={{ position: 'absolute', top: 10, right: 16, fontFamily: dis, fontWeight: 800, fontSize: 44, lineHeight: 1, letterSpacing: '-0.05em', color: 'rgba(17,28,66,0.045)' }}>{step}</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${iconColor}12`, border: `1px solid ${iconColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: dis, fontWeight: 700, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.fg, background: s.bg, border: `1px solid ${s.bd}`, borderRadius: 999, padding: '4px 10px' }}>
          {status === 'Building' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e8501a' }} />}
          {status}
        </span>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontFamily: dis, fontWeight: 700, fontSize: 15.5, color: TEXT, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{title}</h3>
        <p style={{ fontFamily: bod, fontSize: 13, color: MUTED, marginTop: 6, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  )
}

// --- Dashboard ----------------------------------------------------------------

export default function Dashboard() {
  const router = useRouter()
  const { user: authUser, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading && !authUser) router.push('/sign-in')
  }, [loading, authUser, router])

  function handleSignOut() {
    void signOutMember().then(() => router.push('/'))
  }

  if (loading || !profile) return <LoadingScreen />
  const user = profile

  const f = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.72, delay, ease: EASE },
  })

  return (
    <div style={{ minHeight: '100vh', background: WHITE }}>
      <DashNav user={user} onSignOut={handleSignOut} />

      {/* -- Hero: navy banner ---------------------------------------- */}
      <section style={{ background: `linear-gradient(140deg, #0d1831 0%, ${NAVY} 55%, #162552 100%)`, position: 'relative', overflow: 'hidden', paddingTop: 64 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 75% 55%, rgba(232,80,26,0.22) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 12% 20%, rgba(255,255,255,0.04) 0%, transparent 45%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '72px 48px 88px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 64, alignItems: 'center' }} className="aipea-dash-hero">

          {/* Left: greeting */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.p {...f(0.04)} style={{ fontFamily: bod, fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
              {greeting()}
            </motion.p>
            <motion.h1 {...f(0.14)} style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(44px, 5.5vw, 74px)', color: WHITE, letterSpacing: '-0.025em', lineHeight: 1.04, marginBottom: 28 }}>
              {firstName(user.name)}.
            </motion.h1>

            <motion.div {...f(0.26)} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)', borderRadius: 100, padding: '6px 14px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.7)', flexShrink: 0 }} />
                <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.88)' }}>Active Member</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(232,80,26,0.14)', border: '1px solid rgba(232,80,26,0.32)', borderRadius: 100, padding: '6px 14px' }}>
                <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 12, color: ORANGE_ON_DARK }}>AIPEA {user.tier}</span>
              </div>
            </motion.div>

            <motion.div {...f(0.36)} style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{user.memberId}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
              <span style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Since {formatJoinDate(user.joinedAt)}</span>
              {user.country && <>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
                <span style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{user.country}</span>
              </>}
            </motion.div>
          </div>

          {/* Right: credential card */}
          <motion.div {...f(0.22)} style={{ position: 'relative', zIndex: 1 }}>
            <CredentialCard user={user} />
          </motion.div>
        </div>
      </section>

      {/* -- Stats row ----------------------------------------------- */}
      <section style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: '28px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="aipea-stats-row">
          <CPDTile />
          <StatTile label="Membership" value="Active" sub={user.tier === 'Associate' ? 'Free · renews annually' : 'Renews annually from your intake date'} leftBorder={ORANGE} />
          <StatTile label="Tier" value={user.tier} sub="Compare available tiers" />
          <StatTile label="Member since" value={formatJoinDate(user.joinedAt)} sub="Founding cohort" />
        </div>
      </section>

      {/* -- Platform features --------------------------------------- */}
      <section style={{ background: WHITE, padding: '80px 48px 100px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, paddingBottom: 28, borderBottom: `1px solid ${BORDER}`, gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, marginBottom: 8 }}>Your platform roadmap</p>
              <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(24px, 2.8vw, 36px)', color: TEXT, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                What we&apos;re building for you.
              </h2>
            </div>
            <p style={{ fontFamily: bod, fontSize: 14, color: MUTED, maxWidth: 210, textAlign: 'right', lineHeight: 1.65 }}>
              As a founding member, each drops for you first.
            </p>
          </div>

          {/* Feature roadmap — status-tagged so each card states its real build state */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }} className="aipea-features-row">
            {([
              { iconColor: ORANGE,    icon: <Users     size={18} color={ORANGE} />,    title: 'Member Directory',    desc: 'Connect with executive assistants across the AIPEA network as it grows.', status: 'Building' as const },
              { iconColor: NAVY_DARK, icon: <BarChart3 size={18} color={NAVY_DARK} />, title: 'CPD Tracker',         desc: 'Log your professional development hours once the CPD framework is finalised.', status: 'Building' as const },
              { iconColor: '#7c3aed', icon: <BookOpen  size={18} color="#7c3aed" />,   title: 'Course Library',      desc: 'Certification-backed courses built specifically for assistants in Africa.', status: 'Planned' as const },
              { iconColor: '#059669', icon: <Calendar  size={18} color="#059669" />,   title: 'Events & Conference', desc: 'PA Conference 2026 in Accra, plus member meetups as the calendar is confirmed.', status: 'Building' as const },
            ]).map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62, delay: 0.08 + i * 0.07, ease: EASE }} style={{ height: '100%' }}>
                <FeatureCard {...card} step={String(i + 1).padStart(2, '0')} />
              </motion.div>
            ))}
          </div>

          {/* Early member strip */}
          <div style={{ marginTop: 44, padding: '28px 36px', background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ORANGE}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: dis, fontWeight: 700, fontSize: 17, color: TEXT, letterSpacing: '-0.01em' }}>You joined early.</h3>
              <p style={{ fontFamily: bod, fontSize: 14, color: MUTED, marginTop: 4 }}>Every feature comes to you first, at your current rate, permanently.</p>
            </div>
            <Link href="/#membership"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ORANGE, color: WHITE, fontFamily: dis, fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = ORANGE_DIM)}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = ORANGE)}>
              Compare membership tiers <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
