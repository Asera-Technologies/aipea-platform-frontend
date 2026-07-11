'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ChevronDown, Menu, X,
  Users, TrendingUp, BadgeCheck, LayoutGrid,
  GraduationCap, Compass, ClipboardCheck, ShieldCheck,
  CalendarDays, MapPin, Video, CalendarClock,
  BookOpen, FileText, Lightbulb, Newspaper,
  Landmark, UsersRound, Scale, Mail,
  type LucideProps,
} from 'lucide-react'
import { C, dis, bod, INNER } from './tokens'

type Icon = React.ComponentType<LucideProps>

type SubLink = { label: string; desc: string; href: string; icon: Icon }
type NavItem = {
  label: string
  href: string
  links: SubLink[]
  featured: { eyebrow: string; title: string; desc: string; href: string; cta: string; image: string }
}

const NAV: NavItem[] = [
  {
    label: 'Membership', href: '/membership',
    links: [
      { label: 'Why join AIPEA',   desc: 'The case for professional membership.', href: '/membership#why',       icon: TrendingUp },
      { label: 'Membership tiers', desc: 'Associate, Professional & Fellow.',      href: '/membership#tiers',     icon: LayoutGrid },
      { label: 'Member benefits',  desc: 'Everything included with your seat.',    href: '/membership#benefits',  icon: BadgeCheck },
      { label: 'Member directory', desc: '5,000+ professionals across Africa.',    href: '/membership#directory', icon: Users },
    ],
    featured: { eyebrow: 'Join today', title: 'Take your place in the profession', desc: 'Apply in under five minutes and be verified within 24 hours.', href: '/membership', cta: 'Apply for membership', image: '/images/conference/optimized/nav-membership.webp' },
  },
  {
    label: 'Certification', href: '/certification',
    links: [
      { label: 'The AIPEA credential', desc: 'A recognised standard for EAs.',     href: '/certification#credential', icon: ShieldCheck },
      { label: 'Certification pathways', desc: 'Choose the route for your stage.',  href: '/certification#pathways',   icon: Compass },
      { label: 'CPD framework',        desc: 'Track and grow your practice hours.', href: '/certification#cpd',        icon: GraduationCap },
      { label: 'Verify a credential',  desc: 'Confirm any member’s standing.',      href: '/certification#verify',     icon: ClipboardCheck },
    ],
    featured: { eyebrow: 'Get certified', title: 'Keep your career on standard', desc: 'Earn a credential employers and executives recognise.', href: '/certification', cta: 'Explore certification', image: '/images/conference/optimized/nav-certification.webp' },
  },
  {
    label: 'Events', href: '/events',
    links: [
      { label: 'Annual Conference',   desc: 'Accra · September 2026.',            href: '/events#conference', icon: CalendarDays },
      { label: 'Regional meetups',    desc: 'Face-to-face across the continent.', href: '/events#regional',   icon: MapPin },
      { label: 'Webinars & masterclasses', desc: 'Learn live, from anywhere.',    href: '/events#webinars',   icon: Video },
      { label: 'Events calendar',     desc: 'Everything on one timeline.',        href: '/events#calendar',   icon: CalendarClock },
    ],
    featured: { eyebrow: 'Flagship event', title: 'AIPEA Annual Conference 2026', desc: 'Three days of executive excellence in Accra, Ghana.', href: '/events', cta: 'Register interest', image: '/images/conference/optimized/nav-events.webp' },
  },
  {
    label: 'Resources', href: '/resources',
    links: [
      { label: 'Course library',   desc: 'CPD-aligned learning for EAs.',   href: '/resources#courses',   icon: BookOpen },
      { label: 'Templates & tools', desc: 'Practical assets for the role.',  href: '/resources#tools',     icon: FileText },
      { label: 'Career guides',    desc: 'Move from support to strategy.',   href: '/resources#guides',    icon: Lightbulb },
      { label: 'News & insights',  desc: 'Stories from the profession.',     href: '/resources#insights',  icon: Newspaper },
    ],
    featured: { eyebrow: 'Members only', title: 'A library built for the role you want', desc: 'Courses, templates and CPD tracking in one place.', href: '/resources', cta: 'Browse resources', image: '/images/conference/optimized/nav-resources.webp' },
  },
  {
    label: 'About', href: '/about',
    links: [
      { label: 'Our story',   desc: 'Rooted in Ghana, serving Africa.', href: '/about#story',      icon: Landmark },
      { label: 'Leadership',  desc: 'The team behind the standard.',    href: '/about#leadership', icon: UsersRound },
      { label: 'Governance',  desc: 'How AIPEA is run and held to account.', href: '/about#governance', icon: Scale },
      { label: 'Contact us',  desc: 'Talk to the AIPEA team.',          href: '/about#contact',    icon: Mail },
    ],
    featured: { eyebrow: 'Our purpose', title: 'Championing Africa’s executive assistants', desc: 'A professional home for the people behind executive performance.', href: '/about', cta: 'About AIPEA', image: '/images/conference/optimized/nav-about.webp' },
  },
]

// ─── Mega panel ────────────────────────────────────────────────────────────────

function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 60 }}>
      <div style={{ ...INNER, padding: '0 40px' }}>
        <div className="aipea-megapanel" style={{
          marginTop: 8, background: C.white, border: `1px solid ${C.border}`, borderRadius: 20,
          boxShadow: '0 30px 80px rgba(17,28,66,0.16)', overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1.35fr 0.9fr',
        }}>
          {/* Links */}
          <div style={{ padding: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} className="aipea-megapanel-links">
            {item.links.map(l => {
              const Ico = l.icon
              return (
                <Link key={l.label} href={l.href} onClick={onNavigate}
                  style={{ display: 'flex', gap: 14, padding: '14px 16px', borderRadius: 14, transition: 'background 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 11, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center' }}>
                    <Ico size={18} color={C.orange} />
                  </span>
                  <span>
                    <span style={{ display: 'block', fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.text, letterSpacing: '-0.01em' }}>{l.label}</span>
                    <span style={{ display: 'block', fontFamily: bod, fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{l.desc}</span>
                  </span>
                </Link>
              )
            })}
          </div>
          {/* Featured */}
          <Link href={item.featured.href} onClick={onNavigate}
            className="aipea-megapanel-feature"
            style={{ position: 'relative', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 26, color: C.white, overflow: 'hidden' }}>
            <Image src={item.featured.image} alt="" fill sizes="420px" style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,38,0.9) 0%, rgba(8,14,38,0.35) 55%, rgba(8,14,38,0.25) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 12%, rgba(232,80,26,0.4), transparent 45%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>{item.featured.eyebrow}</span>
              <h4 style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 10 }}>{item.featured.title}</h4>
              <p style={{ fontFamily: bod, fontSize: 12.5, color: 'rgba(255,255,255,0.72)', marginTop: 8, lineHeight: 1.55 }}>{item.featured.desc}</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontFamily: dis, fontWeight: 700, fontSize: 12.5, color: C.white }}>
                {item.featured.cta} <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Mobile drawer ──────────────────────────────────────────────────────────────

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      style={{ position: 'fixed', inset: 0, top: 60, zIndex: 45, background: C.white, overflowY: 'auto', padding: '16px 20px 40px' }}>
      {NAV.map((item, i) => {
        const open = openIdx === i
        return (
          <div key={item.label} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button onClick={() => setOpenIdx(open ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: dis, fontWeight: 800, fontSize: 18, color: C.text }}>
              {item.label}
              <ChevronDown size={18} color={C.muted} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingBottom: 12 }}>
                    <Link href={item.href} onClick={onClose} style={{ display: 'block', padding: '10px 4px', fontFamily: dis, fontWeight: 700, fontSize: 13, color: C.orange }}>
                      All {item.label.toLowerCase()} →
                    </Link>
                    {item.links.map(l => (
                      <Link key={l.label} href={l.href} onClick={onClose}
                        style={{ display: 'block', padding: '10px 4px', fontFamily: bod, fontSize: 14, color: C.muted }}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
        <Link href="/sign-in" onClick={onClose} style={{ fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.text, textAlign: 'center', padding: '13px', border: `1px solid ${C.border}`, borderRadius: 999 }}>Sign in</Link>
        <Link href="/sign-up" onClick={onClose} style={{ fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.white, background: C.orange, textAlign: 'center', padding: '13px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>Join AIPEA <ArrowRight size={15} /></Link>
      </div>
    </motion.div>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────────

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const solid = scrolled || open !== null
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(null), 90)
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <div onMouseLeave={scheduleClose} onMouseEnter={cancelClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      <nav className="aipea-nav" style={{
        height: 60, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: solid ? 'rgba(255,255,255,0.94)' : 'transparent',
        backdropFilter: solid ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${solid ? C.border : 'transparent'}`,
        transition: 'background 0.35s, border-color 0.35s',
      }}>
        {/* Brand */}
        <Link href="/" onClick={() => setOpen(null)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>AIPEA</span>
          <span className="aipea-nav-tag" style={{ fontFamily: bod, fontSize: 11, color: C.muted, lineHeight: 1.15, borderLeft: `1px solid ${C.border}`, paddingLeft: 12, maxWidth: 150 }}>
            Africa Institute of Executive Assistants
          </span>
        </Link>

        {/* Desktop links */}
        <div className="aipea-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV.map((item, i) => (
            <div key={item.label} onMouseEnter={() => { cancelClose(); setOpen(i) }}>
              <Link href={item.href} onClick={() => setOpen(null)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 999, fontFamily: dis, fontWeight: 700, fontSize: 13.5, color: open === i ? C.orange : C.text, transition: 'color 0.18s' }}>
                {item.label}
                <ChevronDown size={13} style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.6 }} />
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="aipea-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link href="/sign-in" style={{ fontFamily: bod, fontSize: 13, color: C.text, opacity: 0.72 }}>Sign in</Link>
          <Link href="/sign-up"
            style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: C.white, background: C.orange, padding: '9px 20px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
            Join AIPEA <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="aipea-nav-burger" aria-label="Menu" onClick={() => setMobileOpen(v => !v)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: C.text, padding: 6 }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Desktop mega panel */}
      <AnimatePresence>
        {open !== null && (
          <MegaPanel item={NAV[open]} onNavigate={() => setOpen(null)} />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
