'use client'

import { Award, Users, TrendingUp, Megaphone } from 'lucide-react'
import { C, dis, bod, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, SplitFeature,
  StatBand, CTASection, PricingBreakdown, type PriceTier, type PriceRow,
} from '@/components/site/PageKit'
import { Reveal } from '@/components/site/Reveal'
import { MEMBERSHIP, MEMBERSHIP_BENEFITS, FIGURES, WHY_WE_EXIST } from '@/lib/facts'

// [WHY] Four pillars from Why Join AIPEA. Post-nominals and salary-bracket claims
// stay out — the client has not cleared them. Continental Registry is framed as
// the goal already published elsewhere on the site.
const why = [
  {
    icon: Award,
    label: 'Recognition',
    title: 'Earn the credence you have already worked for',
    desc: 'You protect bottom lines, synchronise C-Suite priorities and drive operational momentum. AIPEA gives that experience formal corporate backing.',
    points: [
      'Accountability-based designations that signal your exact level of strategic impact',
      'A verified place on the AIPEA Continental Registry as it is built',
      'Recognition measured by scope and execution, not years at a desk',
    ],
  },
  {
    icon: Users,
    label: 'Community',
    title: 'Your continental network of peers',
    desc: 'A trusted ecosystem across Africa and the diaspora — built for people who do this work every day, not for corporate fluff.',
    points: [
      'The Pan-African Bridge across West, East, Central, South and North Africa — Anglophone and Francophone',
      'Physical and virtual meetups grounded in authenticity and peer exchange',
      'Priority access and member rates for the annual Pan-African Conference',
    ],
  },
  {
    icon: TrendingUp,
    label: 'Development',
    title: 'Continuous growth for the modern economy',
    desc: 'AIPEA is a growth engine of workplace-ready skills you can deploy the next morning — not passive listening.',
    points: [
      'Structured 6, 9 and 12-month tracks for Personal Assistants, Executive Assistants and Chiefs of Staff',
      'AI and tech synchronisation for the modern executive office',
      'Every module ends in a workplace-deployable artifact your employer can use',
    ],
  },
  {
    icon: Megaphone,
    label: 'Advocacy',
    title: 'A unified voice for the profession',
    desc: 'AIPEA elevates how organisations view, compensate and empower executive support professionals across the continent.',
    points: [
      'Direct engagement with corporate leaders, HR heads and boards to redefine industry standards',
      'Membership that signals integrity, confidentiality and institutional trust',
      'Transparent career pathways from junior associate through to Chief of Staff',
    ],
  },
]

// Published membership pricing. Paid tiers still route through the Secretariat
// until checkout has real payment verification.
const tiers: PriceTier[] = [
  { name: 'Associate',    blurb: 'Entry membership',        price: 'Free',       cadence: '', href: '/sign-up', featured: true, badge: 'Free to join' },
  { name: 'Professional', blurb: 'Established professionals', price: 'Ghc 1,200', cadence: '', href: '/about#contact', cta: 'Contact us' },
  { name: 'Fellow',       blurb: 'Senior practitioners',    price: 'Ghc 2,000', cadence: '', href: '/about#contact', cta: 'Contact us' },
]

// Only benefits the client confirmed. Removed: a CPD tracker (framework still
// undefined), an automatic membership certificate (certificates are issued on
// completing a certification, not on joining), specific conference discount
// percentages (none were given), voting rights (never confirmed) and Fellow
// post-nominals ("I am lost on this").
const rows: PriceRow[] = [...MEMBERSHIP_BENEFITS.map(r => ({ ...r, values: [...r.values] }))]

export default function MembershipPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Membership"
        title="Take your place in the"
        highlight="profession."
        subtitle="Join the professional body for personal and executive assistants across Africa. Associate membership is free, and your AIPEA member ID is issued when you sign up."
        image="/images/conference/optimized/membership-hero.webp"
        primary={{ label: 'Apply for membership', href: '/sign-up' }}
        secondary={{ label: 'Compare tiers', href: '#tiers' }}
      />

      <section id="exist" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Why we exist"
            title="Eliminate the gap between executive vision and daily execution."
            aside={WHY_WE_EXIST}
          />
        </div>
      </section>

      <section id="why" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Why join AIPEA"
            title="We are licensing your future potential."
            aside="Whether you are stepping on as an Associate or architecting the C-Suite as a Chief of Staff, AIPEA moves you from taking orders to owning business value."
          />
          <div className="aipea-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {why.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.label} delay={0.06 * i} style={{ height: '100%' }}>
                  <div
                    style={{
                      height: '100%', padding: '32px 30px', borderRadius: 20,
                      border: `1px solid ${C.border}`, background: C.bg,
                      boxShadow: '0 12px 34px rgba(17,28,66,0.06)',
                    }}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', marginBottom: 22 }}>
                      <Icon size={21} color={C.orange} />
                    </div>
                    <p style={{ fontFamily: dis, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.orange, marginBottom: 10 }}>{item.label}</p>
                    <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.text, marginBottom: 12 }}>{item.title}</h3>
                    <p style={{ fontFamily: bod, fontSize: 14, lineHeight: 1.7, color: C.muted, marginBottom: 18 }}>{item.desc}</p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
                      {item.points.map((point) => (
                        <li key={point} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange, marginTop: 7, flexShrink: 0 }} />
                          <span style={{ fontFamily: bod, fontSize: 13.5, lineHeight: 1.6, color: C.text }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <StatBand stats={[
        { value: 'Three tiers', label: 'Associate, Professional and Fellow.' },
        { value: 'Associate is free', label: 'No cost and no hidden charges. Step up when you are ready.' },
        { value: `${FIGURES.members}+ members`, label: 'The founding cohort, currently based in Ghana.' },
        { value: MEMBERSHIP.renewal, label: 'Membership runs a year from the date you join.' },
      ]} />

      <section id="tiers" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Membership tiers" title="Choose the membership that fits your stage." aside="Membership is not the same as a professional credential. Your tier sets your standing in the institute; your designation is earned through certification." />
          <PricingBreakdown tiers={tiers} rows={rows} note={`Membership renews annually from your intake date. Professional and Fellow applications are completed through the Secretariat.`} />
        </div>
      </section>

      <section id="benefits" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/membership-community.webp"
            eyebrow="Member benefits"
            title="Everything you need, in one seat."
            body="Membership gives you standing in the institute, a place in the member directory and access to the community. Certification is separate, and earned."
            points={[
              'A unique AIPEA member ID, issued on joining',
              'A directory listing that employers can search',
              'Speaking opportunities at AIPEA events',
              'Conference discounts from Professional membership upwards',
              'Certificates are issued on completing a certification, not on joining',
            ]}
            cta={{ label: 'Apply for membership', href: '/sign-up' }}
          />
        </div>
      </section>

      <section id="directory" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SplitFeature
            reverse
            image="/images/conference/optimized/membership-benefits.webp"
            eyebrow="Member directory"
            title="A pan-African network, one search away."
            body="Every AIPEA member joins the register: a place to find peers and opportunities, and to be found by the organisations looking for you. The long-term goal is the AIPEA Continental Registry, spanning Anglophone and Francophone Africa."
            points={[
              'Every member listed with a verified member ID',
              'Searchable by employers',
              `Currently ${FIGURES.members} members, based in Ghana`,
            ]}
          />
        </div>
      </section>

      <CTASection
        title="Own your path. Claim your credential."
        body="Associate membership is free and activates as soon as you sign up."
        primary={{ label: 'Apply for membership', href: '/sign-up' }}
        secondary={{ label: 'Talk to the team', href: '/about#contact' }}
      />
    </PageShell>
  )
}
