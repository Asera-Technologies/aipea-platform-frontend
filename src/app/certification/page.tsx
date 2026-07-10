'use client'

import { Compass, Target, Award } from 'lucide-react'
import { C, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature,
  StatBand, CTASection,
} from '@/components/site/PageKit'

const pathways = [
  { icon: Compass, label: 'Entry', title: 'Associate pathway', desc: 'For emerging assistants building a professional foundation. Evidence your practice and start your CPD record.' },
  { icon: Target,  label: 'Core',  title: 'Professional pathway', desc: 'For established EAs. Demonstrate competence against the AIPEA standard and earn the Professional credential.' },
  { icon: Award,   label: 'Senior', title: 'Fellowship pathway', desc: 'For senior leaders. Recognition of sustained excellence, with post-nominal standing and peer assessment.' },
]

export default function CertificationPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Certification"
        title="Keep your career on"
        highlight="standard."
        subtitle="The AIPEA credential is a recognised professional standard for executive and personal assistants — proof of competence that employers and executives understand."
        image="https://images.unsplash.com/photo-1653566031587-74f7d86a2e71?w=900&h=1100&fit=crop"
        primary={{ label: 'Explore pathways', href: '#pathways' }}
        secondary={{ label: 'Verify a credential', href: '#verify' }}
      />

      <section id="credential" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&h=760&fit=crop"
            eyebrow="The AIPEA credential"
            title="A standard the profession can point to."
            body="Titles rarely capture the value an assistant brings. The AIPEA credential does — a verifiable mark of competence, ethics and continuing development, assessed against a clear framework."
            points={[
              'Assessed against the AIPEA professional standard',
              'Verifiable member ID and digital certificate',
              'Backed by a structured CPD framework',
              'Recognised across 33 countries',
            ]}
            cta={{ label: 'Start your application', href: '/sign-up' }}
          />
        </div>
      </section>

      <section id="pathways" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Certification pathways" title="One standard. Three routes to it." aside="Choose the pathway that matches where you are — and grow into the next." />
          <FeatureGrid items={pathways} columns={3} />
        </div>
      </section>

      <section id="cpd" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            reverse
            image="https://images.unsplash.com/photo-1573164574511-73c773193279?w=900&h=760&fit=crop"
            eyebrow="CPD framework"
            title="Turn everyday practice into evidence."
            body="Continuing Professional Development keeps your credential current. Log hours, categorise your learning, and evidence your growth for renewals, reviews and promotions."
            points={[
              'Log CPD hours across structured categories',
              'Annual review keeps your standing current',
              'Export a clean record for employers',
            ]}
          />
        </div>
      </section>

      <StatBand stats={[
        { value: '3,200+', label: 'Credentials issued' },
        { value: '98%', label: 'Employer recognition' },
        { value: '140k', label: 'CPD hours logged' },
        { value: '33', label: 'Countries' },
      ]} />

      <section id="verify" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SplitFeature
            image="https://images.unsplash.com/photo-1573164574397-dd250bc8a598?w=900&h=760&fit=crop"
            eyebrow="Verify a credential"
            title="Confirm any member's standing in seconds."
            body="Hiring an AIPEA member? Every credential carries a unique member ID. Employers and executives can confirm a member's tier and good standing directly with the institute."
            points={[
              'Unique, verifiable AIPEA member ID',
              'Confirm tier and current standing',
              'Trusted by organisations across Africa',
            ]}
            cta={{ label: 'Contact the registry', href: '/about#contact' }}
          />
        </div>
      </section>

      <CTASection
        title="Certify the value you already bring."
        body="Apply for membership and begin your certification pathway today — reviewed within 24 hours."
        primary={{ label: 'Get certified', href: '/sign-up' }}
        secondary={{ label: 'Compare tiers', href: '/membership#tiers' }}
      />
    </PageShell>
  )
}
