'use client'

import React from 'react'
import Link from 'next/link'
import { C, dis, bod, INNER } from './tokens'
import { Logo } from './Logo'
import { ORG, CONTACT } from '@/lib/facts'

// LinkedIn is the only channel AIPEA has opened. The X, Instagram and Facebook
// icons that used to sit here all pointed back at this same LinkedIn URL, which
// advertised three profiles that do not exist. They come back when the accounts do.
const socials: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: 'LinkedIn',
    href: CONTACT.linkedin,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
    { label: 'Designations & tracks', href: '/certification#strands' },
    { label: 'PA Conference 2026', href: '/events#conference' },
    { label: 'Resources', href: '/resources' },
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
            <Logo height={58} />
            <p style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.62)', maxWidth: 240, marginTop: 16, lineHeight: 1.75 }}>
              {ORG.tagline}
            </p>
            <p style={{ fontFamily: bod, fontSize: 12.5, color: 'rgba(255,255,255,0.45)', maxWidth: 240, marginTop: 14, lineHeight: 1.7 }}>
              {CONTACT.location}
              <br />
              <a href={`mailto:${CONTACT.email}`} style={{ color: 'rgba(255,255,255,0.62)' }}>{CONTACT.email}</a>
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
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>&copy; {new Date().getFullYear()} {ORG.legalName}. All rights reserved.</span>
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Founded {ORG.foundedYear} · Headquartered in {CONTACT.location}</span>
        </div>
      </div>
    </footer>
  )
}
