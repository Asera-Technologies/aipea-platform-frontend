'use client'

import { BookOpen, FileText, Newspaper, PlayCircle, ClipboardList, CalendarRange } from 'lucide-react'
import { C, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature, CTASection,
} from '@/components/site/PageKit'

const courses = [
  { icon: PlayCircle, label: 'Workshop · Q2 2026', title: 'Executive Communication Mastery', desc: 'Influence without authority and communicate up with confidence.' },
  { icon: CalendarRange, label: 'Seminar · Q3 2026', title: 'Calendar & Priorities Management', desc: 'Protect executive time and run a diary that scales.' },
  { icon: BookOpen, label: 'Cert prep · Q4 2026', title: 'Board & C-Suite Support', desc: 'Support senior leadership and earn a seat in the room.' },
]

const tools = [
  { icon: FileText, label: 'Template', title: 'Executive briefing pack', desc: 'A reusable structure for prepping any executive meeting.' },
  { icon: ClipboardList, label: 'Template', title: 'Travel & itinerary planner', desc: 'End-to-end travel coordination, standardised.' },
  { icon: CalendarRange, label: 'Template', title: 'Priorities & diary system', desc: 'A weekly operating rhythm for you and your executive.' },
  { icon: FileText, label: 'Checklist', title: 'Onboarding a new executive', desc: 'The first-90-days checklist for a new working relationship.' },
]

const insights = [
  { icon: Newspaper, label: 'Career', title: 'From support staff to strategic partner', desc: 'How the best assistants reframe the role — and get recognised for it.' },
  { icon: Newspaper, label: 'Standards', title: 'What certification really signals', desc: 'Why a credential changes the conversation with employers.' },
  { icon: Newspaper, label: 'Community', title: 'Voices from the network', desc: 'Members across Africa on growth, recognition and belonging.' },
]

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources"
        title="Tools for the role you"
        highlight="want."
        subtitle="Courses, templates, career guides and insights — a growing library built specifically for executive and personal assistants."
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=1100&fit=crop"
        primary={{ label: 'Browse the library', href: '#courses' }}
        secondary={{ label: 'Read insights', href: '#insights' }}
      />

      <section id="courses" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Course library" title="A curriculum built for African EAs." aside="CPD-aligned courses that turn experience into advancement. Members get first access." />
          <FeatureGrid items={courses} columns={3} />
        </div>
      </section>

      <section id="tools" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Templates & tools" title="Practical assets you can use today." aside="Battle-tested templates and checklists for the everyday work of executive support." />
          <FeatureGrid items={tools} columns={4} />
        </div>
      </section>

      <section id="guides" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&h=760&fit=crop"
            eyebrow="Career guides"
            title="Move from support to strategy."
            body="Our guides help you reframe the role, evidence your value, and make the case for the recognition and progression you've earned."
            points={[
              'Reframe your role and responsibilities',
              'Build the evidence for a promotion',
              'Negotiate with confidence, backed by AIPEA',
            ]}
            cta={{ label: 'Join to unlock guides', href: '/sign-up' }}
          />
        </div>
      </section>

      <section id="insights" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="News & insights" title="Stories from the profession." aside="Perspectives, member voices and updates from across the AIPEA network." />
          <FeatureGrid items={insights} columns={3} />
        </div>
      </section>

      <CTASection
        title="Everything an EA needs, in one place."
        body="Members unlock the full course library, templates and CPD tracking. Join AIPEA to open the library."
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'See membership tiers', href: '/membership#tiers' }}
      />
    </PageShell>
  )
}
