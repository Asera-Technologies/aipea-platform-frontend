'use client'

import React from 'react'
import Link from 'next/link'
import { C, dis, bod, INNER } from './tokens'

// TODO: swap these placeholder hrefs for the real profiles once we have them. All point to LinkedIn for now.
const AIPEA_LINKEDIN = 'https://www.linkedin.com/company/africa-institute-of-personal-executive-assistants-aipea/?viewAsMember=true'

const socials: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: 'LinkedIn',
    href: AIPEA_LINKEDIN,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: AIPEA_LINKEDIN,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: AIPEA_LINKEDIN,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.4" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: AIPEA_LINKEDIN,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.916 3.777-3.916 1.094 0 2.238.196 2.238.196v2.474h-1.26c-1.243 0-1.63.775-1.63 1.57v1.89h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
      </svg>
    ),
  },
]

const footerCols: { h: string; links: { label: string; href: string }[] }[] = [
  { h: 'Membership', links: [
    { label: 'Why join AIPEA', href: '/membership#why' },
    { label: 'Membership tiers', href: '/membership#tiers' },
    { label: 'Member benefits', href: '/membership#benefits' },
    { label: 'Member directory', href: '/membership#directory' },
  ] },
  { h: 'Explore', links: [
    { label: 'Certification', href: '/certification' },
    { label: 'Events', href: '/events' },
    { label: 'Resources', href: '/resources' },
    { label: 'Course library', href: '/resources#courses' },
  ] },
  { h: 'Institute', links: [
    { label: 'Our story', href: '/about#story' },
    { label: 'Leadership', href: '/about#leadership' },
    { label: 'Governance', href: '/about#governance' },
    { label: 'Contact us', href: '/about#contact' },
  ] },
  { h: 'Account', links: [
    { label: 'Sign in', href: '/sign-in' },
    { label: 'Join AIPEA', href: '/sign-up' },
  ] },
]

export function SiteFooter() {
  return (
    <footer className="aipea-footer-wrap" style={{ background: C.navyDark, borderTop: '1px solid rgba(255,255,255,0.1)', padding: '64px 40px 36px' }}>
      <div style={INNER}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.12)' }} className="aipea-footer-grid">
          <div>
            <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 15, color: C.orange, letterSpacing: '0.18em' }}>AIPEA</div>
            <p style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.62)', maxWidth: 240, marginTop: 16, lineHeight: 1.75 }}>
              Elevating the executive assistant profession across Africa. Setting the standard for the role.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s, border-color 0.2s, background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.white; e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.background = C.orange }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.background = 'transparent' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {footerCols.map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 18 }}>{col.h}</div>
              {col.links.map(l => (
                <Link key={l.label} href={l.href}
                  style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.62)', display: 'block', marginBottom: 12, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.62)')}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 28, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>&copy; 2025 Africa Institute of Professional &amp; Executive Assistants. All rights reserved.</span>
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Elevating the profession across Africa.</span>
        </div>
      </div>
    </footer>
  )
}
