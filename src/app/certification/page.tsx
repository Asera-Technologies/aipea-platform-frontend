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
        subtitle="The AIPEA credential is a professional standard for executive and personal assistants: proof of competence that employers and executives understand."
        image="/images/conference/optimized/certification-hero.webp"
        primary={{ label: 'Explore pathways', href: '#pathways' }}
        secondary={{ label: 'Verify a credential', href: '#verify' }}
      />

      <section id="credential" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/certification-credential.webp"
            eyebrow="The AIPEA credential"
            title="A standard the profession can point to."
            body="Titles rarely capture the value an assistant brings. The AIPEA credential does. It is a verifiable mark of competence, ethics and continuing development, assessed against a clear framework."
            points={[
              'Assessed against the AIPEA professional standard',
              'Verifiable member ID and digital certificate',
              'Backed by a structured CPD framework',
              'Built to be recognised across the continent',
            ]}
            cta={{ label: 'Start your application', href: '/sign-up' }}
          />
        </div>
      </section>

      <section id="pathways" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Certification pathways" title="One standard. Three routes to it." aside="Choose the pathway that matches where you are, then grow into the next." />
          <FeatureGrid items={pathways} columns={3} />
        </div>
      </section>

      <section id="cpd" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            reverse
            image="/images/conference/optimized/certification-cpd.webp"
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
        { value: 'One standard', label: 'The same credential means the same thing in every market.' },
        { value: 'Three routes', label: 'A pathway matched to the experience you already have.' },
        { value: 'CPD-backed', label: 'Kept current through logged professional development.' },
        { value: 'Verifiable', label: 'Employers can check any credential against the registry.' },
      ]} />

      <section id="verify" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/certification-verify.webp"
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
        body="Join AIPEA and begin your certification pathway today. Membership activates immediately."
        primary={{ label: 'Get certified', href: '/sign-up' }}
        secondary={{ label: 'Compare tiers', href: '/membership#tiers' }}
      />
    </PageShell>
  )
}
