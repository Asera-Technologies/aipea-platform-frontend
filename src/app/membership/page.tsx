'use client'

import { Award, Users, TrendingUp, Megaphone, BadgeCheck, FolderOpen } from 'lucide-react'
import { C, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature,
  StatBand, CTASection, PricingBreakdown, type PriceTier, type PriceRow,
} from '@/components/site/PageKit'
import { MEMBERSHIP, MEMBERSHIP_BENEFITS, FIGURES } from '@/lib/facts'

const why = [
  { icon: Award,       label: 'Recognition', title: 'A credential that speaks for you', desc: 'Accountability-based designations that state your exact level of strategic impact.' },
  { icon: Users,       label: 'Community',   title: 'Peers who know the role',          desc: 'A member network and events built for people who do this work every day.' },
  { icon: TrendingUp,  label: 'Development',  title: 'Grow on a clear standard',         desc: 'Certification tracks that turn the scope you already carry into a recognised designation.' },
  { icon: Megaphone,   label: 'Advocacy',    title: 'A voice for the profession',        desc: 'AIPEA champions the value of EAs to organisations and leaders across Africa.' },
]

// Associate is the only tier whose price the client supplied ("Yes. No hidden
// costs."). Professional and Fellow were left blank, so they carry no figure and
// route to the Secretariat rather than to a checkout that would need one.
const tiers: PriceTier[] = [
  { name: 'Associate',    blurb: 'Entry membership',        price: 'Free',       cadence: '', href: '/sign-up', featured: true, badge: 'Free to join' },
  { name: 'Professional', blurb: 'Established professionals', price: 'On request', cadence: '', href: '/about#contact', cta: 'Contact us' },
  { name: 'Fellow',       blurb: 'Senior practitioners',    price: 'On request', cadence: '', href: '/about#contact', cta: 'Contact us' },
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

      <section id="why" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Why join AIPEA" title="Membership that works as hard as you do." aside="Four reasons executive assistants across Africa make AIPEA their professional home." />
          <FeatureGrid items={why} columns={4} />
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
          <PricingBreakdown tiers={tiers} rows={rows} note={`Membership renews annually from your intake date. Professional and Fellow pricing is confirmed by the Secretariat on application.`} />
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
