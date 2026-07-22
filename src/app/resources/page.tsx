'use client'

import { FileText, Newspaper, GraduationCap } from 'lucide-react'
import { C, dis, bod, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature, CTASection, type Feature,
} from '@/components/site/PageKit'
import { Reveal } from '@/components/site/Reveal'
import { STRANDS, TRIMESTER_DELIVERABLES, CONTACT } from '@/lib/facts'

// The three "courses" this page used to advertise (Executive Communication
// Mastery, Calendar & Priorities Management, Board & C-Suite Support, each with a
// Q2/Q3/Q4 2026 date) were invented, as were four templates and three insight
// articles. AIPEA's actual learning offer is the certification strands, so that is
// what the library section now points at. Templates and insights are stated as
// forthcoming — the client's answers were "tools to be loaded" and, on career
// guides, "not sure I get this".

const strandCards: Feature[] = STRANDS.map(s => ({
  icon: GraduationCap,
  label: s.duration,
  title: s.name,
  desc: s.focus,
}))

function ComingSoon({ icon: Icon, title, body }: { icon: typeof FileText; title: string; body: string }) {
  return (
    <Reveal>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: 'clamp(36px,5vw,56px) clamp(24px,4vw,44px)', borderRadius: 22, border: `1px dashed ${C.borderHover}`, background: C.bg }}>
        <span style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', margin: '0 auto 22px' }}>
          <Icon size={23} color={C.orange} />
        </span>
        <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(20px,2.2vw,26px)', letterSpacing: '-0.02em', color: C.text, lineHeight: 1.2 }}>{title}</h3>
        <p style={{ fontFamily: bod, fontSize: 14.5, lineHeight: 1.75, color: C.muted, marginTop: 14 }}>{body}</p>
        <a href={`mailto:${CONTACT.email}`} style={{ display: 'inline-block', marginTop: 22, fontFamily: dis, fontWeight: 700, fontSize: 13, color: C.orange }}>
          Ask the Secretariat →
        </a>
      </div>
    </Reveal>
  )
}

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources"
        title="Built to be deployed,"
        highlight="not just studied."
        subtitle="AIPEA's learning model is not built on passive listening. Every module ends in a concrete deliverable that adds value to your current employer."
        image="/images/conference/optimized/resources-hero.webp"
        primary={{ label: 'See the tracks', href: '/certification#strands' }}
        secondary={{ label: 'What you build', href: '#artifacts' }}
      />

      <section id="courses" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Learning pathways"
            title="Three strands, tailored to your scope."
            aside="Specialised, modular pathways for personal assistants, executive assistants and chiefs of staff. Each runs 6, 9 or 12 months."
          />
          <FeatureGrid items={strandCards} columns={3} />
          <Reveal delay={0.12}>
            <p style={{ textAlign: 'center', marginTop: 34 }}>
              <a href="/certification#strands" style={{ fontFamily: dis, fontWeight: 700, fontSize: 14, color: C.orange }}>
                See all six designations →
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section id="artifacts" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SplitFeature
            reverse
            image="/images/conference/optimized/gallery-01.webp"
            eyebrow="Workplace-deployable artifacts"
            title="Every quarter produces something real."
            body="On the long-term tracks you build and deploy institutional artifacts every trimester, so your employer sees a return before you qualify."
            points={TRIMESTER_DELIVERABLES.map(t => `${t.n}: ${t.deliverable}`)}
            cta={{ label: 'Explore certification', href: '/certification' }}
          />
        </div>
      </section>

      <section id="tools" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="Templates & tools"
            title="A practical toolkit for members."
            aside="Reusable assets for the everyday work of executive support, available to members as they are released."
          />
          <ComingSoon
            icon={FileText}
            title="The member toolkit is being loaded."
            body="Templates and checklists are being prepared for the member library. Members are notified as each one is published."
          />
        </div>
      </section>

      <section id="insights" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading
            eyebrow="News & insights"
            title="Stories from the profession."
            aside="Perspectives and updates from across the AIPEA network."
          />
          <ComingSoon
            icon={Newspaper}
            title="The first pieces are being written."
            body="AIPEA will publish member voices, standards updates and news from the institute here."
          />
        </div>
      </section>

      <CTASection
        title="Turn your experience into a designation."
        body="Associate membership is free. Certification tracks open from there."
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'See membership tiers', href: '/membership#tiers' }}
      />
    </PageShell>
  )
}
