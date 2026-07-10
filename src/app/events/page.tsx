'use client'

import { MapPin, Video } from 'lucide-react'
import { C, dis, bod, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature, CTASection,
} from '@/components/site/PageKit'
import { Reveal } from '@/components/site/Reveal'

const regional = [
  { icon: MapPin, label: 'Ghana',        title: 'Accra hub',        desc: 'Monthly meetups and the annual flagship conference.' },
  { icon: MapPin, label: 'Nigeria',      title: 'Lagos hub',        desc: 'Quarterly gatherings for West Africa members.' },
  { icon: MapPin, label: 'Kenya',        title: 'Nairobi hub',      desc: 'East Africa network events and workshops.' },
  { icon: MapPin, label: 'South Africa', title: 'Johannesburg hub', desc: 'Southern Africa meetups and masterclasses.' },
  { icon: MapPin, label: 'Egypt',        title: 'Cairo hub',        desc: 'North Africa community sessions.' },
  { icon: MapPin, label: 'Rwanda',       title: 'Kigali hub',       desc: 'Emerging community, growing fast.' },
]

const webinars = [
  { icon: Video, label: 'Free · Live', title: 'Managing up with confidence', desc: 'Influence without authority — a practical masterclass for EAs.' },
  { icon: Video, label: 'Members only', title: 'The strategic calendar', desc: 'Protect executive time and run a diary that scales.' },
  { icon: Video, label: 'Free · Live', title: 'Board & C-suite support', desc: 'What senior leadership really needs from their assistant.' },
]

const calendar = [
  { date: 'MAR 2026', title: 'Managing up with confidence', place: 'Online webinar', type: 'Webinar' },
  { date: 'APR 2026', title: 'Lagos regional meetup', place: 'Lagos, Nigeria', type: 'Meetup' },
  { date: 'JUN 2026', title: 'The strategic calendar', place: 'Online masterclass', type: 'Masterclass' },
  { date: 'SEP 2026', title: 'AIPEA Annual Conference', place: 'Accra, Ghana', type: 'Conference' },
  { date: 'NOV 2026', title: 'Nairobi regional meetup', place: 'Nairobi, Kenya', type: 'Meetup' },
]

export default function EventsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Events"
        title="Where the profession"
        highlight="comes together."
        subtitle="From the flagship Annual Conference in Accra to regional meetups and live masterclasses — AIPEA brings executive assistants across Africa face to face."
        image="https://images.unsplash.com/photo-1573164574397-dd250bc8a598?w=900&h=1100&fit=crop"
        primary={{ label: 'Register interest', href: '#conference' }}
        secondary={{ label: 'See the calendar', href: '#calendar' }}
      />

      <section id="conference" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=760&fit=crop"
            eyebrow="Flagship event"
            title="AIPEA Annual Conference 2026."
            body="Three days of keynotes, workshops and networking in Accra, Ghana. The largest gathering of executive assistants on the continent — and the best place to grow your standing and your network."
            points={[
              'Accra, Ghana · September 2026',
              'Keynotes from executives and industry leaders',
              'Hands-on workshops and CPD-eligible sessions',
              'Member discounts of up to 40%',
            ]}
            cta={{ label: 'Register interest', href: '/sign-up' }}
          />
        </div>
      </section>

      <section id="regional" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Regional meetups" title="A hub near you, across the continent." aside="Face-to-face community events hosted by AIPEA members in cities across Africa." />
          <FeatureGrid items={regional} columns={3} />
        </div>
      </section>

      <section id="webinars" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Webinars & masterclasses" title="Learn live, from anywhere." aside="Short, practical sessions led by senior practitioners — many free to attend." />
          <FeatureGrid items={webinars} columns={3} />
        </div>
      </section>

      <section id="calendar" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Events calendar" title="Everything on one timeline." aside="Upcoming AIPEA events across the continent." />
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {calendar.map((ev, i) => (
              <Reveal key={ev.title} delay={0.05 * i}>
                <div className="aipea-cal-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, alignItems: 'center', padding: '22px 26px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.boxShadow = '0 10px 34px rgba(27,42,94,0.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}>
                  <span style={{ fontFamily: dis, fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', color: C.orange }}>{ev.date}</span>
                  <span>
                    <span style={{ display: 'block', fontFamily: dis, fontWeight: 800, fontSize: 17, color: C.text, letterSpacing: '-0.01em' }}>{ev.title}</span>
                    <span style={{ display: 'block', fontFamily: bod, fontSize: 13, color: C.muted, marginTop: 3 }}>{ev.place}</span>
                  </span>
                  <span className="aipea-cal-type" style={{ fontFamily: dis, fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.orange, background: 'rgba(232,80,26,0.08)', padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{ev.type}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Save your seat at the table."
        body="Members get priority access and deep discounts on every AIPEA event. Join today."
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'Explore membership', href: '/membership' }}
      />
    </PageShell>
  )
}
