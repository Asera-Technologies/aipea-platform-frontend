'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { C, dis, bod, EASE } from '@/components/site/tokens'
import { GoogleGlyph } from './GoogleGlyph'

// Shared building blocks for /sign-in and /sign-up so both auth screens read
// as the same system as the marketing pages: the eyebrow rule from PageHero,
// the same display type scale, and the shared palette from tokens.ts.

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 48px 56px', overflowY: 'auto' }}>
      {/* Pinned to the top rather than sitting in the centred stack: the two
          auth screens have different form heights, so an in-flow back link
          lands at a different height on each, and it would otherwise lead the
          reading order ahead of the headline. Centred wrapper keeps it flush
          with the form column's left edge. */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, padding: '0 48px', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: 452 }}>
          <span style={{ pointerEvents: 'auto', display: 'inline-block' }}><BackHome /></span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ width: '100%', maxWidth: 452 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function BackHome() {
  return (
    <Link
      href="/"
      style={{ fontFamily: bod, fontSize: 13, color: C.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color 0.2s' }}
      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = C.orange)}
      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = C.muted)}
    >
      <ArrowRight size={13} style={{ transform: 'rotate(180deg)' }} /> Back to home
    </Link>
  )
}

export function AuthHeader({ eyebrow, title, highlight, sub }: {
  eyebrow: string
  title: string
  highlight?: string
  sub: string
}) {
  return (
    <div style={{ marginBottom: 30 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ width: 26, height: 2, background: C.orange, borderRadius: 2 }} />
        <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>
          {eyebrow}
        </span>
      </span>
      <h1 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,3.6vw,44px)', color: C.text, letterSpacing: '-0.03em', lineHeight: 0.98 }}>
        {title}{highlight && <> <span style={{ color: C.orange }}>{highlight}</span></>}
      </h1>
      <p style={{ fontFamily: bod, fontSize: 14.5, color: C.muted, lineHeight: 1.65, marginTop: 14 }}>
        {sub}
      </p>
    </div>
  )
}

const LABEL: React.CSSProperties = {
  display: 'block', fontFamily: dis, fontSize: 10, fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,28,66,0.42)', marginBottom: 8,
}

// Fields are white with a defined outline, not grey fills — the client wanted the
// inputs to read as pronounced, tactile fields. The border carries the box; a soft
// resting shadow lifts it off the page and the orange ring takes over on focus.
const FIELD_BORDER = 'rgba(27,42,94,0.18)'

const INPUT: React.CSSProperties = {
  width: '100%', background: C.white, border: `1.5px solid ${FIELD_BORDER}`,
  borderRadius: 12, padding: '15px 17px', fontSize: 14.5, color: C.text,
  outline: 'none', fontFamily: bod,
  boxShadow: '0 1px 2px rgba(17,28,66,0.04)',
  transition: 'border-color 0.18s, box-shadow 0.18s',
}

function focusOn(el: HTMLInputElement) {
  el.style.borderColor = C.orange
  el.style.boxShadow = '0 0 0 3px rgba(232,80,26,0.15)'
}
function focusOff(el: HTMLInputElement) {
  el.style.borderColor = FIELD_BORDER
  el.style.boxShadow = '0 1px 2px rgba(17,28,66,0.04)'
}

export function Field({ label, type = 'text', value, onChange, placeholder, autoComplete }: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={INPUT}
        onFocus={e => focusOn(e.target)}
        onBlur={e => focusOff(e.target)}
      />
    </div>
  )
}

export function PasswordField({ label, value, onChange, placeholder = '••••••••', autoComplete, hint }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  hint?: React.ReactNode
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ ...LABEL, marginBottom: 0 }}>{label}</label>
        {hint}
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{ ...INPUT, paddingRight: 48 }}
          onFocus={e => focusOn(e.target)}
          onBlur={e => focusOff(e.target)}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(17,28,66,0.3)', display: 'flex', alignItems: 'center' }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export function ConsentCheckbox({ checked, onChange, children }: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 11, cursor: 'pointer' }}>
      {/* Native input kept for keyboard/screen-reader semantics, visually
          replaced by the box below so it matches the brand rather than the OS. */}
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 16, height: 16, margin: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          marginTop: 1, width: 17, height: 17, borderRadius: 5, flexShrink: 0,
          border: `1.5px solid ${checked ? C.orange : 'rgba(27,42,94,0.24)'}`,
          background: checked ? C.orange : C.white,
          display: 'grid', placeItems: 'center',
          transition: 'background 0.16s, border-color 0.16s',
        }}
      >
        {checked && <Check size={11} color={C.white} strokeWidth={3.2} />}
      </span>
      <span style={{ fontFamily: bod, fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
        {children}
      </span>
    </label>
  )
}

export function FormError({ message }: { message: string }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ fontFamily: bod, fontSize: 13, color: '#c0392b', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.18)', borderRadius: 8, padding: '11px 14px', lineHeight: 1.55 }}
    >
      {message}
    </motion.p>
  )
}

export function PrimaryButton({ children, loading, loadingLabel, disabled }: {
  children: React.ReactNode
  loading?: boolean
  loadingLabel?: string
  disabled?: boolean
}) {
  const off = loading || disabled
  const [hover, setHover] = useState(false)
  return (
    <button
      type="submit"
      disabled={off}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', background: off || hover ? C.orangeDim : C.orange, color: C.white,
        fontFamily: dis, fontWeight: 700, fontSize: 14.5, padding: '15px', borderRadius: 10,
        border: 'none', cursor: off ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        transition: 'background 0.2s, box-shadow 0.2s',
        boxShadow: hover && !off ? '0 10px 26px rgba(232,80,26,0.28)' : '0 2px 8px rgba(232,80,26,0.16)',
      }}
    >
      {loading ? (
        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          {loadingLabel}
        </motion.span>
      ) : (
        <>
          <span>{children}</span>
          <motion.span animate={{ x: hover ? 3 : 0 }} transition={{ duration: 0.22, ease: EASE }} style={{ display: 'flex' }}>
            <ArrowRight size={15} />
          </motion.span>
        </>
      )}
    </button>
  )
}

export function GoogleButton({ onClick, loading, label }: {
  onClick: () => void
  loading?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', background: C.white, color: C.text, fontFamily: dis, fontWeight: 700,
        fontSize: 14.5, padding: '14px', borderRadius: 10, border: `1px solid ${C.borderHover}`,
        cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 10, transition: 'background 0.18s, border-color 0.18s',
      }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = 'rgba(27,42,94,0.34)' } }}
      onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.borderColor = C.borderHover }}
    >
      <GoogleGlyph />
      {loading ? 'Opening Google…' : label}
    </button>
  )
}

export function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ fontFamily: bod, fontSize: 11.5, color: 'rgba(17,28,66,0.34)' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  )
}

export function AuthFooterLink({ prompt, href, label }: { prompt: string; href: string; label: string }) {
  return (
    <div style={{ marginTop: 30, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
      <p style={{ fontFamily: bod, fontSize: 13.5, color: C.muted }}>
        {prompt}{' '}
        <Link href={href} style={{ color: C.orange, fontWeight: 600, textDecoration: 'none' }}>{label}</Link>
      </p>
    </div>
  )
}
