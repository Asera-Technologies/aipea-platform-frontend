'use client'

import Image from 'next/image'
import { ShieldCheck, Scale, UsersRound, Mail, MapPin } from 'lucide-react'
import { C, dis, bod, INNER, SECTION } from '@/components/site/tokens'
import {
  PageShell, PageHero, SectionHeading, FeatureGrid, SplitFeature, StatBand, CTASection,
} from '@/components/site/PageKit'
import { Reveal } from '@/components/site/Reveal'

const leaders = [
  { name: 'Ama Mensah',      title: 'Founder & Executive Director',     image: '/images/conference/optimized/leader-ama.webp' },
  { name: 'Samuel Boateng',  title: 'Director, Professional Standards',  image: '/images/conference/optimized/leader-samuel.webp' },
  { name: 'Nana Adjei',      title: 'Director, Partnerships & Events',    image: '/images/conference/optimized/leader-nana.webp' },
]

const governance = [
  { icon: UsersRound, label: 'Council',   title: 'Member council', desc: 'Elected members who guide AIPEA’s direction and hold it accountable to the profession.' },
  { icon: ShieldCheck, label: 'Standards', title: 'Standards board', desc: 'Practitioners who own the certification framework and keep it rigorous and relevant.' },
  { icon: Scale,      label: 'Ethics',    title: 'Ethics & conduct', desc: 'A clear code of professional conduct that every AIPEA member upholds.' },
]

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title="Championing Africa's"
        highlight="executive assistants."
        subtitle="AIPEA is the professional home for the people behind executive performance — rooted in Ghana, serving the whole continent."
        image="/images/conference/optimized/about-hero.webp"
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'Contact us', href: '#contact' }}
      />

      <section id="story" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SplitFeature
            image="/images/conference/optimized/about-story.webp"
            eyebrow="Our story"
            title="Rooted in Ghana. Serving Africa."
            body="AIPEA was founded to give executive and personal assistants what the profession had long lacked: a standard, a credential, and a community. Since 2013 we've grown into a pan-African body 5,000 members strong."
            points={[
              'Founded in Ghana in 2013',
              'A recognised professional standard for EAs',
              '5,000+ members across 33 countries',
            ]}
          />
        </div>
      </section>

      <StatBand stats={[
        { value: '2013', label: 'Founded' },
        { value: '5,000+', label: 'Members' },
        { value: '33', label: 'Countries' },
        { value: '3,200+', label: 'Credentials issued' },
      ]} />

      <section id="leadership" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Leadership" title="Visionaries leading the profession forward." aside="Meet the team dedicated to elevating executive assistants across Africa." />
          <div className="aipea-leader-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {leaders.map((leader, i) => (
              <Reveal key={leader.name} delay={0.1 * i}>
                <div style={{ position: 'relative', height: 420, borderRadius: 20, overflow: 'hidden' }}>
                  <Image src={leader.image} alt={leader.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,14,38,0.86) 0%, rgba(8,14,38,0.2) 40%, transparent 64%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 26px 30px' }}>
                    <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 21, color: C.white, lineHeight: 1.15 }}>{leader.name}</h3>
                    <p style={{ fontFamily: bod, fontSize: 13, color: C.orange, fontWeight: 600, marginTop: 6 }}>{leader.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="governance" style={{ ...SECTION, background: C.bg }}>
        <div style={INNER}>
          <SectionHeading eyebrow="Governance" title="Run by the profession, for the profession." aside="How AIPEA is structured to stay rigorous, relevant and accountable." />
          <FeatureGrid items={governance} columns={3} />
        </div>
      </section>

      <section id="contact" style={{ ...SECTION, background: C.surface }}>
        <div style={INNER}>
          <Reveal>
            <div className="aipea-contact-band" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 28, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <div style={{ padding: 'clamp(36px,4vw,56px)', background: C.bg }}>
                <span style={{ fontFamily: dis, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.orange }}>Contact us</span>
                <h3 style={{ fontFamily: dis, fontWeight: 800, fontSize: 'clamp(26px,3vw,40px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: C.text, margin: '16px 0 24px' }}>Talk to the AIPEA team.</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Mail size={18} color={C.orange} /></span>
                    <span>
                      <span style={{ display: 'block', fontFamily: bod, fontSize: 11, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</span>
                      <span style={{ display: 'block', fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.text, marginTop: 2 }}>hello@aipea.africa</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(232,80,26,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><MapPin size={18} color={C.orange} /></span>
                    <span>
                      <span style={{ display: 'block', fontFamily: bod, fontSize: 11, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Head office</span>
                      <span style={{ display: 'block', fontFamily: dis, fontWeight: 700, fontSize: 15, color: C.text, marginTop: 2 }}>Accra, Ghana</span>
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', minHeight: 300 }}>
                <Image src="/images/conference/optimized/about-team.webp" alt="AIPEA team" fill sizes="(max-width: 1024px) 100vw, 46vw" style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(17,28,66,0.28), transparent 60%)' }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Be part of what comes next."
        body="Join 5,000+ members shaping the future of the executive assistant profession across Africa."
        primary={{ label: 'Join AIPEA', href: '/sign-up' }}
        secondary={{ label: 'Explore membership', href: '/membership' }}
      />
    </PageShell>
  )
}
