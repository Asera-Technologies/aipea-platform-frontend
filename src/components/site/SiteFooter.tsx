'use client'

import React from 'react'
import Link from 'next/link'
import { C, dis, bod, INNER } from './tokens'

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
    <footer className="aipea-footer-wrap" style={{ background: C.navyDark, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 40px 36px' }}>
      <div style={INNER}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="aipea-footer-grid">
          <div>
            <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 15, color: C.orange, letterSpacing: '0.18em' }}>AIPEA</div>
            <p style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.38)', maxWidth: 240, marginTop: 16, lineHeight: 1.75 }}>
              Elevating the executive assistant profession across Africa. Setting the standard since 2013.
            </p>
          </div>
          {footerCols.map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 18 }}>{col.h}</div>
              {col.links.map(l => (
                <Link key={l.label} href={l.href}
                  style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.38)', display: 'block', marginBottom: 12, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 28, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>&copy; 2025 Africa Institute of Professional &amp; Executive Assistants. All rights reserved.</span>
          <span style={{ fontFamily: bod, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Elevating the profession across Africa.</span>
        </div>
      </div>
    </footer>
  )
}
