'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, type LucideProps } from 'lucide-react'
import { C, dis, bod, INNER, SECTION } from './tokens'
import { SiteNav } from './SiteNav'
import { SiteFooter } from './SiteFooter'
import { Reveal } from './Reveal'

type Icon = React.ComponentType<LucideProps>

// ─── Page shell ─────────────────────────────────────────────────────────────────

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="aipea" style={{ background: C.bg, color: C.text }}>
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  )
}

// ─── Page hero ──────────────────────────────────────────────────────────────────

export function PageHero({ eyebrow, title, highlight, subtitle, image, primary, secondary }: {
  eyebrow: string
  title: string
  highlight?: string
  subtitle: string
  image: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section style={{ position: 'relative', padding: '150px 40px 90px', background: C.surface, borderBottom: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, right: -80, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.12), transparent 68%)', pointerEvents: 'none' }} />
      <div style={{ ...INNER, position: 'relative', zIndex: 1 }}>
        <div className="aipea-pagehero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}>
          <div>
            <Reveal>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 26, height: 2, background: C.orange, borderRadius: 2 }} />
                <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>{eyebrow}</span>
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(38px,5vw,68px)', lineHeight: 0.98, letterSpacing: '-0.03em', color: C.text, marginTop: 22 }}>
                {title}{highlight && <> <span style={{ color: C.orange }}>{highlight}</span></>}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p style={{ fontFamily: bod, fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.7, color: C.muted, marginTop: 22, maxWidth: 520 }}>{subtitle}</p>
            </Reveal>
            {(primary || secondary) && (
              <Reveal delay={0.24}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
                  {primary && (
                    <Link href={primary.href}
                      style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '13px 28px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                      {primary.label} <ArrowRight size={15} />
                    </Link>
                  )}
                  {secondary && (
                    <Link href={secondary.href} style={{ fontFamily: bod, fontSize: 14, color: C.muted }}>{secondary.label} →</Link>
                  )}
                </div>
              </Reveal>
            )}
          </div>
          <Reveal from="right" delay={0.16} className="aipea-hero-visual">
            <div style={{ position: 'relative', height: 440, borderRadius: 26, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 30px 80px rgba(27,42,94,0.18)' }}>
              <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 46vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 12%, rgba(232,80,26,0.16), transparent 45%)' }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Section heading ────────────────────────────────────────────────────────────

export function SectionHeading({ eyebrow, title, aside, center = true }: {
  eyebrow: string; title: string; aside?: string; center?: boolean
}) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 760 : undefined, margin: center ? '0 auto 64px' : '0 0 56px' }}>
      <Reveal>
        <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>{eyebrow}</span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 style={{ fontFamily: dis, fontWeight: 800, color: C.text, fontSize: 'clamp(30px,4vw,52px)', lineHeight: 1.04, letterSpacing: '-0.03em', marginTop: 16 }}>{title}</h2>
      </Reveal>
      {aside && (
        <Reveal delay={0.14}>
          <p style={{ fontFamily: bod, fontSize: 16, lineHeight: 1.7, color: C.muted, marginTop: 18, maxWidth: center ? 560 : 620, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }}>{aside}</p>
        </Reveal>
      )}
    </div>
  )
}

// ─── Feature grid ───────────────────────────────────────────────────────────────

export type Feature = { icon: Icon; label: string; title: string; desc: string }

export function FeatureGrid({ items, columns = 3 }: { items: Feature[]; columns?: number }) {
  return (
    <div className="aipea-feature-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns},1fr)`, gap: 16 }}>
      {items.map((f, i) => {
        const Icon = f.icon
        return (
          <Reveal key={f.title} delay={0.06 * i} style={{ height: '100%' }}>
            <div style={{ height: '100%', padding: '30px 28px', borderRadius: 20, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.boxShadow = '0 14px 44px rgba(27,42,94,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', marginBottom: 22 }}>
                <Icon size={21} color={C.orange} />
              </div>
              <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginBottom: 10 }}>{f.label}</p>
              <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 20, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.text, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.65, color: C.muted }}>{f.desc}</p>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

// ─── Split feature (image + text) ───────────────────────────────────────────────

export function SplitFeature({ image, eyebrow, title, body, points, reverse = false, cta }: {
  image: string; eyebrow: string; title: string; body: string; points?: string[]; reverse?: boolean; cta?: { label: string; href: string }
}) {
  return (
    <div className="aipea-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
      <Reveal from={reverse ? 'right' : 'left'} style={{ order: reverse ? 2 : 1 }}>
        <div style={{ position: 'relative', height: 420, borderRadius: 24, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 24px 70px rgba(27,42,94,0.14)' }}>
          <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 46vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 14%, rgba(232,80,26,0.14), transparent 46%)' }} />
        </div>
      </Reveal>
      <Reveal from={reverse ? 'left' : 'right'} delay={0.1} style={{ order: reverse ? 1 : 2 }}>
        <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>{eyebrow}</span>
        <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(26px,3.2vw,42px)', lineHeight: 1.06, letterSpacing: '-0.03em', color: C.text, margin: '16px 0 18px' }}>{title}</h3>
        <p style={{ fontFamily: bod, fontSize: 15.5, lineHeight: 1.75, color: C.muted }}>{body}</p>
        {points && (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
            {points.map(p => (
              <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontFamily: bod, fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(232,80,26,0.12)', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Check size={12} color={C.orange} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <Link href={cta.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.white, background: C.orange, padding: '12px 24px', borderRadius: 100, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
            {cta.label} <ArrowRight size={15} />
          </Link>
        )}
      </Reveal>
    </div>
  )
}

// ─── Stat band ──────────────────────────────────────────────────────────────────

export function StatBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section style={{ padding: '0 40px' }}>
      <div style={INNER}>
        <div className="aipea-statband" style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length},1fr)`, gap: 24, padding: '44px 40px', borderRadius: 24, background: C.navyDark, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 20%, rgba(232,80,26,0.22), transparent 42%)' }} />
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.06 * i} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,4vw,46px)', color: C.orange, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontFamily: bod, fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA section ────────────────────────────────────────────────────────────────

export function CTASection({ title, body, primary, secondary }: {
  title: string; body: string; primary: { label: string; href: string }; secondary?: { label: string; href: string }
}) {
  return (
    <section style={{ ...SECTION, background: C.bg }}>
      <div style={INNER}>
        <Reveal>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, background: `linear-gradient(150deg, ${C.navy} 0%, ${C.navyDark} 60%, #071024 100%)`, padding: 'clamp(44px,6vw,80px)', textAlign: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 15%, rgba(232,80,26,0.3), transparent 40%)' }} />
            <div className="aipea-spin" style={{ position: 'absolute', top: -80, left: -80, width: 260, height: 260, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.14)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,58px)', lineHeight: 1.02, letterSpacing: '-0.035em', color: C.white, maxWidth: 760, margin: '0 auto' }}>{title}</h2>
              <p style={{ fontFamily: bod, fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginTop: 20, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>{body}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 34 }}>
                <Link href={primary.href}
                  style={{ fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.white, background: C.orange, padding: '14px 30px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.orangeDim)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                  {primary.label} <ArrowRight size={16} />
                </Link>
                {secondary && (
                  <Link href={secondary.href} style={{ fontFamily: bod, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{secondary.label} →</Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Pricing breakdown (comparison table) ───────────────────────────────────────

export type PriceTier = { name: string; blurb: string; price: string; cadence: string; featured?: boolean; href: string }
export type PriceRow = { feature: string; values: (boolean | string)[] }

function Cell({ v, featured }: { v: boolean | string; featured?: boolean }) {
  if (v === true) return (
    <span style={{ display: 'inline-grid', placeItems: 'center', width: 24, height: 24, borderRadius: '50%', background: featured ? C.orange : 'rgba(232,80,26,0.12)' }}>
      <Check size={14} color={featured ? C.white : C.orange} />
    </span>
  )
  if (v === false) return <span style={{ color: C.faint, fontSize: 18, lineHeight: 1 }}>—</span>
  return <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 13, color: featured ? C.orange : C.text }}>{v}</span>
}

export function PricingBreakdown({ tiers, rows, note }: { tiers: PriceTier[]; rows: PriceRow[]; note?: string }) {
  const cols = `minmax(200px, 1.4fr) ${tiers.map(() => 'minmax(140px, 1fr)').join(' ')}`
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 720, paddingTop: 18 }}>
        {/* Header: tier + price + CTA */}
        <div style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'stretch', gap: 0 }}>
          <div />
          {tiers.map(t => (
            <div key={t.name} style={{
              textAlign: 'center', padding: '26px 18px 24px', borderTopLeftRadius: 18, borderTopRightRadius: 18,
              background: t.featured ? 'rgba(232,80,26,0.06)' : 'transparent',
              border: t.featured ? `1px solid rgba(232,80,26,0.28)` : '1px solid transparent',
              borderBottom: 'none', position: 'relative',
            }}>
              {t.featured && (
                <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: C.navyDark, color: C.white, fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>Most popular</span>
              )}
              <div style={{ fontFamily: dis, fontWeight: 800, fontSize: 19, color: C.text }}>{t.name}</div>
              <div style={{ fontFamily: bod, fontSize: 11, color: C.muted, marginTop: 4 }}>{t.blurb}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginTop: 14 }}>
                <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 30, color: t.featured ? C.orange : C.text, letterSpacing: '-0.03em' }}>{t.price}</span>
                <span style={{ fontFamily: bod, fontSize: 12, color: C.muted }}>{t.cadence}</span>
              </div>
              <Link href={t.href} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, fontFamily: dis, fontWeight: 700, fontSize: 12.5, padding: '9px 18px', borderRadius: 999, transition: 'transform 0.2s', background: t.featured ? C.orange : C.white, color: t.featured ? C.white : C.text, border: t.featured ? 'none' : `1px solid ${C.border}` }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                Join {t.name}
              </Link>
            </div>
          ))}
        </div>
        {/* Rows */}
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {rows.map((r, ri) => (
            <div key={r.feature} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', background: ri % 2 ? C.surface : C.bg }}>
              <div style={{ fontFamily: bod, fontSize: 13.5, color: C.text, padding: '16px 18px', fontWeight: 500 }}>{r.feature}</div>
              {r.values.map((v, vi) => (
                <div key={vi} style={{
                  display: 'grid', placeItems: 'center', padding: '16px 12px', minHeight: 56,
                  background: tiers[vi]?.featured ? 'rgba(232,80,26,0.05)' : 'transparent',
                  borderLeft: tiers[vi]?.featured ? '1px solid rgba(232,80,26,0.28)' : '1px solid transparent',
                  borderRight: tiers[vi]?.featured ? '1px solid rgba(232,80,26,0.28)' : '1px solid transparent',
                  borderBottom: tiers[vi]?.featured && ri === rows.length - 1 ? '1px solid rgba(232,80,26,0.28)' : '1px solid transparent',
                  borderBottomLeftRadius: tiers[vi]?.featured && ri === rows.length - 1 ? 18 : 0,
                  borderBottomRightRadius: tiers[vi]?.featured && ri === rows.length - 1 ? 18 : 0,
                }}>
                  <Cell v={v} featured={tiers[vi]?.featured} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {note && <p style={{ fontFamily: bod, fontSize: 12, color: C.faint, textAlign: 'center', marginTop: 22 }}>{note}</p>}
    </div>
  )
}
