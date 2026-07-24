'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import { Layers, ClipboardCheck, BadgeCheck, ArrowRight, ArrowLeft, CornerRightDown } from 'lucide-react'
import { C, dis, bod, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, SplitFeature, StatBand, CTASection,
} from '@/components/site/PageKit'
import { Reveal } from '@/components/site/Reveal'
import { STRANDS, ASSESSMENT_STAGES, TRIMESTER_DELIVERABLES, CONTACT } from '@/lib/facts'

// This page previously sold "Associate / Professional / Fellow certification
// pathways", which conflated membership with credentials. The client was explicit
// that the two are separate. What follows is the actual framework: three strands,
// two accountability tracks each, six designations, each with its own capstone.

// One image per strand for the card headers, keyed by strand order. Reused from
// the existing photo library rather than pulling anything new.
const STRAND_IMAGES = [
  '/images/conference/optimized/membership-community.webp',
  '/images/conference/optimized/resources-workshop.webp',
  '/images/conference/optimized/about-team.webp',
]

// --- Assessment flow -----------------------------------------------------------
// The six stages read as a directional journey, not a row of tiles: a top row runs
// left-to-right, turns down on the right, and the bottom row runs back left — an
// S-path from Application to Certified. The final stage carries the orange accent.

function StageNode({ stage, highlight = false }: { stage: { n: string; name: string; desc: string }; highlight?: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 0, position: 'relative', padding: '30px 24px 26px', borderRadius: 20, border: `1px solid ${highlight ? 'rgba(232,80,26,0.4)' : C.border}`, background: highlight ? 'linear-gradient(180deg, rgba(232,80,26,0.07), rgba(232,80,26,0.02))' : C.bg, boxShadow: highlight ? '0 16px 40px rgba(232,80,26,0.14)' : '0 12px 34px rgba(17,28,66,0.06)' }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: '50%', background: highlight ? C.orange : `linear-gradient(150deg, ${C.navy}, ${C.navyDark})`, color: C.white, fontFamily: dis, fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', marginBottom: 18, boxShadow: highlight ? '0 8px 20px rgba(232,80,26,0.34)' : '0 8px 20px rgba(17,28,66,0.2)' }}>{stage.n}</span>
      <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: '-0.01em' }}>{stage.name}</h3>
      <p style={{ fontFamily: bod, fontSize: 12.5, lineHeight: 1.6, color: C.muted, marginTop: 8 }}>{stage.desc}</p>
    </div>
  )
}

function FlowArrow({ dir }: { dir: 'right' | 'left' }) {
  const Icon = dir === 'right' ? ArrowRight : ArrowLeft
  return (
    <span className="aipea-flow-arrow" style={{ flex: '0 0 auto', alignSelf: 'center', display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: C.bg, border: `1px solid ${C.borderHover}`, color: C.orange }}>
      <Icon size={16} />
    </span>
  )
}

export default function CertificationPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Certification"
        title="Certified on scope,"
        highlight="not on years served."
        subtitle="AIPEA certifications are built on capability and role scope. Your credential reflects the nature of the corporate problems you are hired to solve, not how long you have held a title."
        image="/images/conference/optimized/certification-hero.webp"
        primary={{ label: 'See the designations', href: '#strands' }}
        secondary={{ label: 'How assessment works', href: '#assessment' }}
      />

      <section id="credential" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/certification-credential.webp"
            eyebrow="The AIPEA credential"
            title="Accountability-based, not attendance-based."
            body="We are shifting the industry standard from passive conference attendance to accountability-based certification. When an HR Director sees an AIPEA credential, they know that individual has built, defended and deployed real-world corporate artifacts."
            points={[
              'Three professional strands, six designations',
              'Every track ends in a defended capstone',
              'Deliverables built for your current employer',
              'Duration from 6 to 12 months by strand',
            ]}
            cta={{ label: 'Start your application', href: '/sign-up' }}
          />
        </div>
      </section>

      {/* Strands and tracks ------------------------------------------------- */}
      <section id="strands" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Designations & tracks"
            title="Three strands. Two tracks in each."
            aside="Each strand is split into two accountability tracks, so your credential reflects the exact scope of value you carry into the executive office."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {STRANDS.map((strand, si) => (
              <Reveal key={strand.id} delay={0.06 * si}>
                <article style={{ borderRadius: 24, border: `1px solid ${C.border}`, background: C.bg, overflow: 'hidden', boxShadow: '0 18px 50px rgba(17,28,66,0.08)' }}>
                  {/* Strand header — the profession's photograph carries the band at
                      full strength behind a directional scrim, so the strand leads
                      with an image instead of a flat navy fill. */}
                  <header style={{ position: 'relative', padding: 'clamp(32px,3.6vw,52px)', overflow: 'hidden', color: C.white, minHeight: 'clamp(230px,24vw,300px)', display: 'flex', alignItems: 'flex-end' }}>
                    <Image
                      src={STRAND_IMAGES[si % STRAND_IMAGES.length]}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 1360px"
                      style={{ objectFit: 'cover', objectPosition: 'center 28%' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(9,14,33,0.94) 0%, rgba(13,24,49,0.82) 42%, rgba(27,42,94,0.42) 100%)` }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,14,33,0.72) 0%, transparent 45%)' }} />
                    <div style={{ position: 'absolute', top: -70, right: -70, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.34), transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 38, lineHeight: 1, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.34)' }}>{strand.n}</span>
                        <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(24px,2.8vw,34px)', letterSpacing: '-0.03em', color: C.white, lineHeight: 1.1 }}>{strand.name}</h3>
                        <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orangeOnDark, background: 'rgba(232,80,26,0.2)', border: '1px solid rgba(232,80,26,0.4)', padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{strand.duration}</span>
                      </div>
                      <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.orangeOnDark, marginTop: 14 }}>{strand.focus}</p>
                      <p style={{ fontFamily: bod, fontSize: 14.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.82)', marginTop: 10, maxWidth: 720 }}>{strand.audience}</p>
                      <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', marginTop: 14, fontStyle: 'italic' }}>
                        The question this role answers: “{strand.coreQuestion}”
                      </p>
                    </div>
                  </header>

                  {/* Two tracks stacked as a progression, not a left/right split:
                      Track A (individual mastery) then the senior Track B that builds
                      on it. Each track is one full-width horizontal band with a scope
                      rail on the left; a connector between them names the step up. */}
                  <div style={{ padding: 'clamp(22px,2.6vw,34px)' }}>
                    {strand.tracks.map((track, ti) => {
                      const senior = track.scope === 'B'
                      const accent = senior ? C.orange : C.navy
                      return (
                        <Fragment key={track.acronym}>
                          {ti === 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 4px 8px' }}>
                              <span style={{ width: 1, height: 26, background: C.border }} />
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.faint }}>
                                <CornerRightDown size={14} color={C.orange} /> The senior track builds on the above
                              </span>
                            </div>
                          )}
                          <div className="aipea-track-row" style={{ display: 'grid', gridTemplateColumns: '236px 1fr', gap: 'clamp(20px,2.4vw,36px)', padding: 'clamp(22px,2.4vw,30px)', borderRadius: 18, background: senior ? 'linear-gradient(120deg, rgba(232,80,26,0.06), rgba(232,80,26,0.015))' : 'linear-gradient(120deg, rgba(27,42,94,0.06), rgba(27,42,94,0.015))', border: `1px solid ${senior ? 'rgba(232,80,26,0.22)' : 'rgba(27,42,94,0.16)'}` }}>
                            {/* Scope rail */}
                            <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 18 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                                <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', color: C.text }}>{track.acronym}</span>
                                <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: senior ? C.orange : C.navy, background: senior ? 'rgba(232,80,26,0.1)' : 'rgba(27,42,94,0.07)', border: `1px solid ${senior ? 'rgba(232,80,26,0.28)' : 'rgba(27,42,94,0.16)'}`, padding: '4px 9px', borderRadius: 999 }}>Track {track.scope}</span>
                              </div>
                              <p style={{ fontFamily: bod, fontSize: 14.5, color: C.text, marginTop: 10, fontWeight: 600, lineHeight: 1.35 }}>{track.name}</p>
                              <p style={{ fontFamily: bod, fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>{track.scopeLabel}</p>
                            </div>
                            {/* Detail */}
                            <div>
                              <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginBottom: 8 }}>Accountabilities</p>
                              <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.7, color: C.muted }}>{track.accountabilities}</p>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 18 }}>
                                <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange }}>Capstone</p>
                                <span style={{ flex: 1, height: 1, background: C.border }} />
                              </div>
                              <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 15.5, color: C.text, lineHeight: 1.3, letterSpacing: '-0.01em', marginTop: 8 }}>{track.capstone.name}</p>
                              <p style={{ fontFamily: bod, fontSize: 13, lineHeight: 1.7, color: C.muted, marginTop: 6 }}>{track.capstone.desc}</p>
                            </div>
                          </div>
                        </Fragment>
                      )
                    })}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment --------------------------------------------------------- */}
      <section id="assessment" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="How assessment works"
            title="Six stages from application to designation."
            aside="No stage is skippable. The capstone is defended, not submitted."
          />
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Top row: 01 → 02 → 03, left to right */}
              <div className="aipea-flow-row">
                {ASSESSMENT_STAGES.slice(0, 3).map((stage, i) => (
                  <Fragment key={stage.n}>
                    <StageNode stage={stage} />
                    {i < 2 && <FlowArrow dir="right" />}
                  </Fragment>
                ))}
              </div>
              {/* The turn: the path drops down on the right into the bottom row */}
              <div className="aipea-flow-turn">
                <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: '50%', background: C.orange, color: C.white, boxShadow: '0 8px 22px rgba(232,80,26,0.32)' }}>
                  <CornerRightDown size={19} />
                </span>
              </div>
              {/* Bottom row: 04 → 05 → 06, laid out right to left so the flow
                  continues from the turn. DOM order stays numeric so it stacks
                  correctly on mobile. */}
              <div className="aipea-flow-row aipea-flow-rev" style={{ flexDirection: 'row-reverse' }}>
                {ASSESSMENT_STAGES.slice(3).map((stage, i, arr) => (
                  <Fragment key={stage.n}>
                    <StageNode stage={stage} highlight={i === arr.length - 1} />
                    {i < arr.length - 1 && <FlowArrow dir="left" />}
                  </Fragment>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trimester deliverables --------------------------------------------- */}
      <section id="artifacts" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="The trimester deliverable system"
            title="You build institutional artifacts, not lecture notes."
            aside="On the long-term tracks, every quarter produces something your employer can deploy — so the return on their investment starts before you qualify."
          />
          <div className="aipea-trimester-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {TRIMESTER_DELIVERABLES.map((t, i) => (
              <Reveal key={t.n} delay={0.06 * i} style={{ height: '100%' }}>
                <div style={{ height: '100%', padding: '28px 24px', borderRadius: 20, background: C.bg, border: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange }}>{t.n}</span>
                  <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 18, lineHeight: 1.25, letterSpacing: '-0.02em', color: C.text, marginTop: 14 }}>{t.deliverable}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatBand stats={[
        { value: 'Three strands', label: 'Personal Assistant, Executive Assistant and Chief of Staff.' },
        { value: 'Six designations', label: 'Two accountability tracks within every strand.' },
        { value: '6, 9 or 12 months', label: 'Track length set by the scope of the strand.' },
        { value: 'Defended capstones', label: 'Every designation ends in a live crucible or an oral defense.' },
      ]} />

      {/* Registry ----------------------------------------------------------- */}
      <section id="registry" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/recognition.jpg"
            eyebrow="The AIPEA Continental Registry"
            title="A cross-border register of licensed partners."
            body="The Registry is a directory of verified, licensed corporate partners, built so an AIPEA designation carries the same weight in Accra, Lagos, Abidjan or Nairobi. Digital verification for employers is in development."
            points={[
              'Every certified member holds a unique AIPEA member ID',
              'Built as a bilingual bridge for Anglophone and Francophone members',
              'Employer-facing credential verification is being built',
            ]}
            cta={{ label: 'Contact the Secretariat', href: '/about#contact' }}
          />
          {/* The client asked us to "build that in" — it is intent, not a live
              feature, so the page says exactly that rather than implying a
              working lookup exists. */}
          <Reveal delay={0.1}>
            <p style={{ fontFamily: bod, fontSize: 13, lineHeight: 1.7, color: C.faint, textAlign: 'center', maxWidth: 620, margin: '40px auto 0', padding: '16px 20px', border: `1px dashed ${C.border}`, borderRadius: 14 }}>
              Online credential lookup is not live yet. To verify a member&apos;s standing today,
              email <a href={`mailto:${CONTACT.email}`} style={{ color: C.orange, fontWeight: 600 }}>{CONTACT.email}</a> and the Secretariat will confirm it directly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CPD — defined as pending, not described ---------------------------- */}
      <section id="cpd" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Continuing professional development"
            title="The CPD framework is being defined."
            aside="AIPEA is finalising CPD hours, renewal periods and categories. We would rather publish the framework once than publish numbers that change."
          />
          <Reveal>
            <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gap: 12 }}>
              {[
                { icon: Layers, title: 'What is settled', desc: 'Certification is accountability-based, and designations are earned through assessed coursework and a defended capstone.' },
                { icon: ClipboardCheck, title: 'What is being defined', desc: 'The number of CPD hours, the renewal period and the categories that count toward them.' },
                { icon: BadgeCheck, title: 'What happens next', desc: 'The framework will be published here in full once the Governing Council signs it off.' },
              ].map((row, i) => {
                const Icon = row.icon
                return (
                  <div key={row.title} style={{ display: 'flex', gap: 18, padding: '22px 24px', borderRadius: 16, background: C.bg, border: `1px solid ${C.border}` }}>
                    <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center' }}>
                      <Icon size={19} color={C.orange} />
                    </span>
                    <span>
                      <span style={{ display: 'block', fontFamily: dis, fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: '-0.01em' }}>{row.title}</span>
                      <span style={{ display: 'block', fontFamily: bod, fontSize: 13.5, lineHeight: 1.7, color: C.muted, marginTop: 6 }}>{row.desc}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Certify the value you already bring."
        body="Tell us the scope you carry and the Secretariat will place you on the right track."
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'Explore membership', href: '/membership' }}
      />
    </PageShell>
  )
}
