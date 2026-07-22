'use client'

import Image from 'next/image'
import { ShieldCheck, Scale, UsersRound, Mail, MapPin } from 'lucide-react'
import { C, dis, bod, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature, StatBand, CTASection,
} from '@/components/site/PageKit'
import { Reveal } from '@/components/site/Reveal'
import { ORG, CONTACT, FIGURES, DNA, PURPOSE, LEADERSHIP, SECRETARIAT } from '@/lib/facts'

const governance = [
  { icon: UsersRound, label: 'Council',   title: 'Governing Council', desc: SECRETARIAT.council },
  { icon: ShieldCheck, label: 'Secretariat', title: 'The Secretariat', desc: `Headquartered in ${SECRETARIAT.headquarters}, led by a Secretariat Manager and assisted by a Secretariat Coordinator.` },
  { icon: Scale,      label: 'Standards', title: 'Standards & conduct', desc: 'The code of conduct, complaints procedure and election process are being formalised and will be published in full.' },
]

/** Not every approved leader has an approved headshot yet, so the card falls back
 *  to a monogram rather than borrowing someone else's photograph. */
function LeaderCard({ leader }: { leader: (typeof LEADERSHIP)[number] }) {
  const initials = leader.name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div style={{ position: 'relative', height: 420, borderRadius: 20, overflow: 'hidden', background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDark} 100%)` }}>
      {leader.image ? (
        <Image src={leader.image} alt={leader.name} fill sizes="(max-width: 768px) 100vw, 420px" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 64, letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.16)' }}>{initials}</span>
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,38,0.86) 0%, rgba(8,14,38,0.2) 40%, transparent 64%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 26px 30px' }}>
        <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 21, color: C.white, lineHeight: 1.15 }}>{leader.name}</h3>
        <p style={{ fontFamily: bod, fontSize: 13, color: C.orange, fontWeight: 600, marginTop: 6 }}>{leader.title}</p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title="Championing Africa's"
        highlight="executive assistants."
        subtitle={`${ORG.legalName}. ${ORG.tagline}.`}
        image="/images/conference/optimized/about-hero.webp"
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'Contact us', href: '#contact' }}
      />

      <section id="story" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/auth-conference.webp"
            imagePosition="center 78%"
            eyebrow="Our story"
            title="A continental movement, not just an institute."
            body="AIPEA grew out of a legacy of gathering Africa's finest administrative talent at our annual conference, and was formally established as a professional institute to solve one corporate problem: the evolution of administrative professionals into strategic business partners and leaders."
            points={[
              `Established ${ORG.foundedYear}, headquartered in ${CONTACT.location}`,
              'Accountability-based certification, not conference attendance',
              'Building a bilingual bridge across Anglophone and Francophone Africa',
            ]}
          />
        </div>
      </section>

      <StatBand stats={[
        { value: `Founded ${ORG.foundedYear}`, label: `${FIGURES.yearsActive} years as a professional institute, based in Accra.` },
        { value: `${FIGURES.members}+ members`, label: 'The founding cohort, who set the benchmark everyone else meets.' },
        { value: 'Six designations', label: 'Across the PA, EA and Chief of Staff strands.' },
        { value: 'Pan-African in scope', label: 'Built for the whole continent rather than one market.' },
      ]} />

      {/* Purpose and DNA --------------------------------------------------- */}
      <section id="purpose" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Our purpose"
            title="Where executive vision meets daily execution."
            aside={PURPOSE}
          />
          <div className="aipea-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {DNA.map((v, i) => (
              <Reveal key={v.title} delay={0.06 * i} style={{ height: '100%' }}>
                <div style={{ height: '100%', padding: '32px 28px', borderRadius: 20, background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDark} 100%)`, color: C.white }}>
                  <span style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orangeOnDark }}>The AIPEA DNA</span>
                  <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', marginTop: 14 }}>{v.title}</h3>
                  <p style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.66)', marginTop: 12 }}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="leadership" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="The Secretariat"
            title="Your career advocates and community guides."
            aside={`The ${ORG.abbreviation} Secretariat is based in ${SECRETARIAT.headquarters} and backed by a Governing Council.`}
          />
          <div className="aipea-leader-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${LEADERSHIP.length}, minmax(0, 380px))`, justifyContent: 'center', gap: 24 }}>
            {LEADERSHIP.map((leader, i) => (
              <Reveal key={leader.name} delay={0.1 * i}>
                <LeaderCard leader={leader} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="governance" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Governance"
            title="Run by the profession, for the profession."
            aside="How AIPEA is structured to stay rigorous, relevant and accountable."
          />
          <FeatureGrid items={governance} columns={3} />
          {/* The client's answer on governance was "we will have these later", so
              the page names the structures without describing procedures that do
              not exist yet. */}
          <Reveal delay={0.12}>
            <p style={{ fontFamily: bod, fontSize: 13, lineHeight: 1.7, color: C.faint, textAlign: 'center', maxWidth: 620, margin: '32px auto 0' }}>
              Council membership, the election process and the full code of conduct are being
              formalised. They will be published here once ratified.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="contact" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <Reveal>
            <div className="aipea-contact-band" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 28, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <div style={{ padding: 'clamp(36px,4vw,56px)', background: C.surface }}>
                <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>Contact us</span>
                <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(26px,3vw,40px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: C.text, margin: '16px 0 24px' }}>Talk to the Secretariat.</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Mail size={18} color={C.orange} /></span>
                    <span>
                      <span style={{ display: 'block', fontFamily: bod, fontSize: 11, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</span>
                      <a href={`mailto:${CONTACT.email}`} style={{ display: 'block', fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.text, marginTop: 2 }}>{CONTACT.email}</a>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><MapPin size={18} color={C.orange} /></span>
                    <span>
                      <span style={{ display: 'block', fontFamily: bod, fontSize: 11, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Head office</span>
                      <span style={{ display: 'block', fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.text, marginTop: 2 }}>{CONTACT.location}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', minHeight: 300 }}>
                <Image src="/images/conference/optimized/about-team.webp" alt="AIPEA members at the annual conference" fill sizes="(max-width: 1024px) 100vw, 46vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(17,28,66,0.28), transparent 60%)' }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Ready to claim your seat at the decision-making table?"
        body="Join the members shaping the future of the executive assistant profession across Africa."
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'Explore membership', href: '/membership' }}
      />
    </PageShell>
  )
}
