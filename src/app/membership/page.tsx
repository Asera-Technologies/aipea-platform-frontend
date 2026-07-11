'use client'

import { Award, Users, TrendingUp, Megaphone, BadgeCheck, FolderOpen } from 'lucide-react'
import { C, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature,
  StatBand, CTASection, PricingBreakdown, type PriceTier, type PriceRow,
} from '@/components/site/PageKit'

const why = [
  { icon: Award,       label: 'Recognition', title: 'A credential that speaks for you', desc: 'Professional standing that employers and executives recognise across the continent.' },
  { icon: Users,       label: 'Community',   title: '5,000+ peers, one network',        desc: 'Connect with executive assistants in 33 countries who understand the role.' },
  { icon: TrendingUp,  label: 'Development',  title: 'Grow on a clear standard',         desc: 'CPD tracking, courses and pathways that turn experience into advancement.' },
  { icon: Megaphone,   label: 'Advocacy',    title: 'A voice for the profession',        desc: 'AIPEA champions the value of EAs to organisations and leaders across Africa.' },
]

const tiers: PriceTier[] = [
  { name: 'Associate',    blurb: 'For emerging EAs',    price: 'Free',   cadence: '', href: '/sign-up?tier=Associate' },
  { name: 'Professional', blurb: 'For established EAs',  price: '₵1,200', cadence: '/yr', href: '/sign-up?tier=Professional', featured: true },
  { name: 'Fellow',       blurb: 'For senior leaders',  price: '₵2,500', cadence: '/yr', href: '/sign-up?tier=Fellow' },
]

const rows: PriceRow[] = [
  { feature: 'Member directory listing',        values: [true, true, true] },
  { feature: 'CPD hours tracker',               values: [true, true, true] },
  { feature: 'Digital membership certificate',  values: [true, true, true] },
  { feature: 'Member events & community',       values: [true, true, true] },
  { feature: 'Annual conference discount',      values: ['10%', '25%', '40%'] },
  { feature: 'Course library access',           values: [false, true, true] },
  { feature: 'Priority application review',     values: [false, true, true] },
  { feature: 'Voting rights in AIPEA elections', values: [false, true, true] },
  { feature: 'Fellowship credential (post-nominals)', values: [false, false, true] },
  { feature: '1:1 mentorship matching',         values: [false, false, true] },
  { feature: 'Speaking & committee opportunities', values: [false, false, true] },
]

export default function MembershipPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Membership"
        title="Take your place in the"
        highlight="profession."
        subtitle="Join Africa's professional membership body for executive and personal assistants. Apply in under five minutes and be verified within 24 hours."
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
        { value: '5,000+', label: 'Members' },
        { value: '33', label: 'Countries' },
        { value: '12+', label: 'Years' },
        { value: '4.9/5', label: 'Member satisfaction' },
      ]} />

      <section id="tiers" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Membership tiers" title="Choose the membership that fits your stage." aside="Every tier includes the essentials — step up as your career grows." />
          <PricingBreakdown tiers={tiers} rows={rows} note="All payments processed securely via Paystack. Annual renewal. Cancel anytime." />
        </div>
      </section>

      <section id="benefits" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/membership-community.webp"
            eyebrow="Member benefits"
            title="Everything you need, in one seat."
            body="Your membership is more than a certificate. It's a working toolkit for the role — and a professional standing you can point to."
            points={[
              'Official AIPEA membership certificate and member ID',
              'Searchable directory listing seen by employers',
              'CPD hours tracker to evidence your growth',
              'Discounted access to the Annual Conference',
              'First access to the AIPEA course library (Professional+)',
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
            body="Every AIPEA member joins a verified directory spanning 33 countries — a place to find peers, mentors and opportunities, and to be found by the organisations looking for you."
            points={[
              'Verified professionals across the continent',
              'Filter by country, tier and specialism',
              'Opt-in visibility to hiring organisations',
            ]}
          />
        </div>
      </section>

      <CTASection
        title="Own your path. Claim your credential."
        body="Applications are reviewed within 24 hours. Your membership activates the moment you're approved."
        primary={{ label: 'Apply for membership', href: '/sign-up' }}
        secondary={{ label: 'Talk to the team', href: '/about#contact' }}
      />
    </PageShell>
  )
}
