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
                  {/* Strand header — a navy band carrying a photo of the profession,
                      so the card leads with an image and the whole strand reads as a
                      single object rather than a grey/white split. */}
                  <header style={{ position: 'relative', padding: 'clamp(30px,3.4vw,44px)', overflow: 'hidden', background: `linear-gradient(120deg, ${C.navyDark} 0%, ${C.navy} 100%)`, color: C.white }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.16 }}>
                      <Image
                        src={STRAND_IMAGES[si % STRAND_IMAGES.length]}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 1360px"
                        style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                      />
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(120deg, ${C.navyDark} 12%, rgba(27,42,94,0.55) 100%)` }} />
                    <div style={{ position: 'absolute', top: -70, right: -70, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,80,26,0.3), transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 34, lineHeight: 1, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.32)' }}>{strand.n}</span>
                        <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(22px,2.6vw,32px)', letterSpacing: '-0.03em', color: C.white, lineHeight: 1.1 }}>{strand.name}</h3>
                        <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orangeOnDark, background: 'rgba(232,80,26,0.18)', border: '1px solid rgba(232,80,26,0.35)', padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{strand.duration}</span>
                      </div>
                      <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.orangeOnDark, marginTop: 14 }}>{strand.focus}</p>
                      <p style={{ fontFamily: bod, fontSize: 14.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.72)', marginTop: 10, maxWidth: 760 }}>{strand.audience}</p>
                      <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.86)', marginTop: 14, fontStyle: 'italic' }}>
                        The question this role answers: “{strand.coreQuestion}”
                      </p>
                    </div>
                  </header>

                  {/* The two tracks, side by side — both on the card's white surface,
                      separated only by a hairline divider (no grey fill). */}
                  <div className="aipea-track-pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    {strand.tracks.map((track, ti) => (
                      <div key={track.acronym} style={{ padding: 'clamp(24px,2.6vw,34px)', borderLeft: ti === 1 ? `1px solid ${C.border}` : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: C.text }}>{track.acronym}</span>
                          <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.orange, background: 'rgba(232,80,26,0.08)', border: `1px solid rgba(232,80,26,0.2)`, padding: '4px 9px', borderRadius: 999 }}>Track {track.scope}</span>
                        </div>
                        <p style={{ fontFamily: bod, fontSize: 14, color: C.text, marginTop: 8, fontWeight: 600 }}>{track.name}</p>
                        <p style={{ fontFamily: bod, fontSize: 12, color: C.muted, marginTop: 4 }}>{track.scopeLabel}</p>

                        <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginTop: 22, marginBottom: 8 }}>Accountabilities</p>
                        <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.7, color: C.muted }}>{track.accountabilities}</p>

                        <p style={{ fontFamily: dis, fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginTop: 20, marginBottom: 8 }}>Capstone</p>
                        <p style={{ fontFamily: dis, fontWeight: 800, fontSize: 15, color: C.text, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{track.capstone.name}</p>
                        <p style={{ fontFamily: bod, fontSize: 13, lineHeight: 1.7, color: C.muted, marginTop: 6 }}>{track.capstone.desc}</p>
                      </div>
                    ))}
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
