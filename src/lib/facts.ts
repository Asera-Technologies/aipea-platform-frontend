/**
 * AIPEA — single source of truth for every factual claim the site publishes.
 *
 * THE RULE: if a number, name, date, price or benefit appears anywhere in the UI,
 * it comes from this file, and the entry here carries the document that confirms
 * it. Nothing gets added without a source. If a client answer was "to be
 * confirmed", the fact belongs in `PENDING` below and the UI must say so plainly
 * rather than inventing a plausible-sounding value.
 *
 * Sources, as supplied by the client (2026-07-22):
 *   [CI]   AIPEA_Client_Information.pdf — the client's own annotated answers
 *   [ABT]  About AIPEA: The Story of Our Evolution
 *   [DES]  AIPEA Professional Designations & Tracks
 *   [TF]   AIPEA Track Finder
 *   [DD]   The Deep Dive Role Descriptor Framework
 *   [WHY]  Why Join AIPEA
 *   [PRO]  AIPEA 2026: The Global Standard for African Executive Excellence
 */

// --- Identity -------------------------------------------------------------------

export const ORG = {
  /** [CI §1] Client struck the "and" variant; this ampersand form is the approved one. */
  legalName: 'Africa Institute of Personal & Executive Assistants',
  abbreviation: 'AIPEA',
  /** [CI §1] LinkedIn said 2023; client corrected to 2024. */
  foundedYear: 2024,
  /** [CI §1] Confirmed verbatim. */
  tagline: 'Your Professional Development Partner for Personal/Executive Assistants & Chiefs of Staff',
  /** [CI §1] "None on the surface" — so the site claims no relationship with Five Six Five Ltd. */
  parentOrganisation: null,
} as const

// --- Contact --------------------------------------------------------------------

export const CONTACT = {
  /** [CI §2] The one address the client confirmed as live ("This is sorted now"). */
  email: 'info.aipea@fivesixfive.co',
  /** [CI §2] "Yes. Accra, Ghana. We will update soon." No street address approved yet. */
  location: 'Accra, Ghana',
  /** [CI §2] "Only LI for now" — every other social channel is unopened. */
  linkedin:
    'https://www.linkedin.com/company/africa-institute-of-personal-executive-assistants-aipea/',
} as const

// --- Published figures ----------------------------------------------------------

// [CI §9] Only what the client explicitly cleared for publication. Anything absent
// here (conference attendance, training-session counts, satisfaction scores,
// employer-recognition claims) was left unanswered and must not be stated.
export const FIGURES = {
  members: 50,
  countriesRepresented: ['Ghana'],
  /** [CI §9] "AIPEA is 2 years." */
  yearsActive: 2,
  /** [CI §9] "None for now." */
  partnerOrganisations: 0,
} as const

// --- The AIPEA DNA --------------------------------------------------------------

// [ABT] Growth / Value / Impact. Note [PRO] lists five values instead
// (Excellence, Fun, Growth, Authenticity, Integrity). The two documents disagree;
// the site publishes the [ABT] set because it is the more recent positioning and
// the one already carried through the brand. Flagged for client ruling.
export const DNA = [
  {
    title: 'Growth',
    body: 'Professional evolution is non-negotiable. Our accountability-based certification journeys expand skills, embrace technology and move careers from execution to enterprise leadership.',
  },
  {
    title: 'Value',
    body: 'We shift executive support from a cost centre to an indispensable business asset — members trained to generate tangible ROI for their executives and HR heads.',
  },
  {
    title: 'Impact',
    body: 'We measure success by the footprint members leave behind: driving organisational momentum, influencing decisions and shaping the future of African business.',
  },
] as const

/** [ABT] "Our Purpose", which replaces the older "Our Vision" framing. */
export const PURPOSE =
  'To be the premier continental authority and certifying body that transforms African business, administrative and operational support professionals into elite, strategic corporate business partners.'

/** [ABT] "Why we exist", which replaces the older "Our Mission" framing. */
export const WHY_WE_EXIST =
  'We exist to eliminate the gap between executive vision and daily execution. Through high-caliber certification, practical mastery and a powerful peer network, we equip business, administrative and operations professionals to command tech, lead resources and operate as strategic partners.'

// --- Certification: three strands, two tracks each -------------------------------

// [DES] + [TF] + [DD]. Acronym note: [DES] calls the Executive Assistant tracks
// CEP/SCEP, while [TF] and [DD] both call them CEA/SCEA. Two documents out of
// three agree on CEA/SCEA, so that is what the site uses. Same for the Chief of
// Staff senior track: [DES] says SCSOP, [TF] and [DD] say SCCoS.

export type Track = {
  acronym: string
  name: string
  scope: 'A' | 'B'
  scopeLabel: string
  accountabilities: string
  capstone: { name: string; desc: string }
}

export type Strand = {
  id: string
  n: string
  name: string
  focus: string
  horizon: string
  coreQuestion: string
  audience: string
  durationMonths: number
  duration: string
  tracks: [Track, Track]
}

export const STRANDS: Strand[] = [
  {
    id: 'personal-assistant',
    n: '01',
    name: 'Personal Assistant Strand',
    focus: 'Executive Synchronization & Operational Efficiency',
    horizon: 'Day-to-day to Month-to-date',
    coreQuestion: 'How do we execute this immediately and flawlessly?',
    audience:
      "For professionals whose primary accountability is the flawless execution and digital optimization of an individual executive's personal and professional ecosystem.",
    durationMonths: 6,
    duration: '6 months',
    tracks: [
      {
        acronym: 'CPA',
        name: 'Certified Personal Assistant',
        scope: 'A',
        scopeLabel: 'Individual & execution mastery',
        accountabilities:
          'Individual execution, gatekeeping, calendar engineering, inbox filtration and tech enablement using productivity tools and AI models.',
        capstone: {
          name: 'The 48-Hour Live Office Crucible',
          desc: 'A high-speed, simulated crisis testing individual execution under operational pressure.',
        },
      },
      {
        acronym: 'SCPA',
        name: 'Senior Certified Personal Assistant',
        scope: 'B',
        scopeLabel: 'Ecosystem, resource & team leadership',
        accountabilities:
          'Shifting from task execution to administrative leadership: office resource allocation, petty cash systems, vendor contract negotiations and mentoring the junior support pool.',
        capstone: {
          name: 'The Corporate Administrative Playbook',
          desc: "Designing a scalable, operational handbook tailored directly to your current employer's workflows.",
        },
      },
    ],
  },
  {
    id: 'executive-assistant',
    n: '02',
    name: 'Executive Assistant Strand',
    focus: 'C-Suite Synchronization & Tactical Partnership',
    horizon: 'Month-to-date to Quarter-to-date',
    coreQuestion: 'How does this interaction or decision impact our quarterly objectives?',
    audience:
      'For high-functioning partners to C-Suite executives, managing high-stakes stakeholder landscapes, cross-border logistics and strategic alignment.',
    durationMonths: 9,
    duration: '9 months',
    tracks: [
      {
        acronym: 'CEA',
        name: 'Certified Executive Assistant',
        scope: 'A',
        scopeLabel: 'Individual & execution mastery',
        accountabilities:
          'Boardroom diplomacy, managing high-net-worth individual interactions, predictive calendar architecture and using AI models to synthesize lengthy corporate data into briefing notes.',
        capstone: {
          name: 'The 48-Hour Live Boardroom Simulation',
          desc: "Managing an executive's complete communication and logistical response during a multi-country corporate incident.",
        },
      },
      {
        acronym: 'SCEA',
        name: 'Senior Certified Executive Assistant',
        scope: 'B',
        scopeLabel: 'Ecosystem, resource & team leadership',
        accountabilities:
          'Managing division budgets, leading corporate governance architectures for Board Meetings and AGMs, tracking post-meeting action items, and aligning cross-departmental KPIs.',
        capstone: {
          name: 'The Executive Office Operational Playbook',
          desc: 'An end-to-end organizational framework optimizing company-wide support workflows and risk mitigation models.',
        },
      },
    ],
  },
  {
    id: 'chief-of-staff',
    n: '03',
    name: 'Chief of Staff Strand',
    focus: 'Enterprise Integration, Institutional Growth & Scale Governance',
    horizon: 'Quarter-to-date to Multi-Year',
    coreQuestion: 'What institutional systems or resources must move to scale this vision?',
    audience:
      'Our premier Masterclass Fellowship tier. Operating on the academic and corporate footing of an Executive MBA, this strand is designed for the architects of the Executive Office.',
    durationMonths: 12,
    duration: '12 months (4 trimesters)',
    tracks: [
      {
        acronym: 'CCoS',
        name: 'Certified Chief of Staff',
        scope: 'A',
        scopeLabel: 'Individual & execution mastery',
        accountabilities:
          'Low-code enterprise automation pipelines (Zapier, Power Automate), agile project deployment (Scrum/Kanban) within support divisions, and executive proxy execution.',
        capstone: {
          name: 'The 48-Hour Live Enterprise Crucible',
          desc: 'Defending tactical and systemic decisions made during a total enterprise operational collapse before a panel of directors.',
        },
      },
      {
        acronym: 'SCCoS',
        name: 'Senior Certified Strategic Operations Partner',
        scope: 'B',
        scopeLabel: 'Ecosystem, resource & team leadership',
        accountabilities:
          'Sourcing international development grants and corporate sponsorships, managing post-merger integrations, organizational design, public sector lobbying, and scale governance.',
        capstone: {
          name: 'The Institutional Playbook & Oral Defense',
          desc: 'A comprehensive, multi-year asset deployment and resource optimization roadmap defended before the AIPEA Governing Council.',
        },
      },
    ],
  },
]

/** [DES] The trimester deliverable system, for long-term tracks. */
export const TRIMESTER_DELIVERABLES = [
  { n: 'Trimester 1', deliverable: 'Integration Blueprint & Tech Audit' },
  { n: 'Trimester 2', deliverable: 'Corporate Governance & Board Framework' },
  { n: 'Trimester 3', deliverable: 'Financial Strategy & Resource Model' },
  { n: 'Trimester 4', deliverable: 'Final Specialized Track Capstone' },
] as const

/** [CI §4] "Application, attendance, coursework, exam, assessment, certified." */
export const ASSESSMENT_STAGES = [
  { n: '01', name: 'Application', desc: 'Apply to the track that matches your operational scope.' },
  { n: '02', name: 'Attendance', desc: 'Attend the structured sessions across your track.' },
  { n: '03', name: 'Coursework', desc: 'Build the institutional artifacts your track requires.' },
  { n: '04', name: 'Exam', desc: 'Sit the written assessment for your designation.' },
  { n: '05', name: 'Assessment', desc: 'Defend your capstone before assessors.' },
  { n: '06', name: 'Certified', desc: 'Receive your designation and registry entry.' },
] as const

// --- Membership -----------------------------------------------------------------

// [CI §3]. Membership is NOT the same as a professional credential — the client was
// explicit about this, and the site must never present the tiers as certification
// pathways. Prices for Professional and Fellow were left blank by the client, so
// they are not published; those tiers route to contact instead.
export const MEMBERSHIP = {
  /** "Annual. On intake date so it is due a year from sign up." */
  renewal: 'Annual, from your intake date',
  tiers: [
    {
      name: 'Associate',
      blurb: 'Entry membership',
      /** "Yes. No hidden costs." */
      price: 'Free',
      cadence: '',
      priceConfirmed: true,
    },
    { name: 'Professional', blurb: 'Established professionals', price: 'On request', cadence: '', priceConfirmed: false },
    { name: 'Fellow', blurb: 'Senior practitioners', price: 'On request', cadence: '', priceConfirmed: false },
  ],
} as const

/**
 * [CI §3] Benefits confirmed by the client, and only those.
 * - Member ID: every member. Certificates: NOT automatic — issued only on
 *   successful completion of a certification course.
 * - Conference discounts: "from Professional membership upwards". No percentages
 *   were given, so none are published.
 * - Directory: real today, and employer-searchable ("We should be able to have it
 *   on now").
 * - Speaking opportunities: "at our events".
 * - Mentorship matching: "will come up soon" — listed as upcoming, not included.
 * - Voting rights: never confirmed. Removed from the site entirely.
 */
export const MEMBERSHIP_BENEFITS = [
  { feature: 'AIPEA member ID', values: [true, true, true] },
  { feature: 'Member directory listing', values: [true, true, true] },
  { feature: 'Employer-searchable directory', values: [true, true, true] },
  { feature: 'Member events & community', values: [true, true, true] },
  { feature: 'Speaking opportunities at AIPEA events', values: [true, true, true] },
  { feature: 'Conference discount', values: [false, true, true] },
  { feature: 'Mentorship matching (coming soon)', values: [false, true, true] },
] as const

// --- Events ---------------------------------------------------------------------

// [CI §5]. Note the naming: it is "PA Conference 2026" this year and migrates to
// "AIPEA Conference 2027" from next year. Never "AIPEA Annual Conference 2026".
export const CONFERENCE = {
  name: 'PA Conference 2026',
  startDate: new Date('2026-07-23T09:00:00'),
  dateLabel: '23–24 July 2026',
  days: 2,
  venue: 'Labadi Beach Hotel',
  city: 'Accra, Ghana',
  /** "Not yet." — so no member discount is advertised for this edition. */
  memberDiscount: null,
  /** Renaming from the 2027 edition onward. */
  futureName: 'AIPEA Conference 2027',
} as const

// --- Leadership -----------------------------------------------------------------

// [CI §7] Approved names and exact titles. Samuel Komlavi Tekpor is explicitly OUT
// of the organisation and must not appear anywhere on the site despite LinkedIn
// still naming him. Bios are pending — see PENDING.
export const LEADERSHIP = [
  {
    name: 'Madina Kadiatou Barry',
    title: 'Coordinating Consultant',
    // Her own supplied studio portrait. The earlier `leader-madina.jpg` (a
    // striped-dress stage shot) was a mislabel and has been removed.
    image: '/images/conference/optimized/leader-ama.webp',
    bio: null,
  },
  {
    name: 'Noreen Norkor Nortey',
    title: 'Operations Consultant',
    // Frame PA-CON-25-0818 from the Maame_Ekua_Gaisey conference set, confirmed
    // by the client (2026-07-22) as Noreen's photo.
    image: '/images/conference/optimized/leader-noreen.jpg',
    bio: null,
  },
] as const

/** [ABT] The Secretariat structure, as described in the client's own copy. */
export const SECRETARIAT = {
  headquarters: 'Accra, Ghana',
  roles: ['Secretariat Manager', 'Secretariat Coordinator'],
  council:
    'A Governing Council of seasoned corporate directors, leaders from academia, executive coaches and Chief of Staff veterans.',
} as const

// --- Not yet confirmed ----------------------------------------------------------

/**
 * Everything the client left open. The UI may say a thing is coming; it may not
 * describe what that thing will contain. Each entry names the answer we are
 * waiting on so this list can be worked through directly with the client.
 */
export const PENDING = {
  /** [CI §2] "Let me share 1 when I get into the office." */
  phoneAndWhatsApp: 'No number supplied — nothing published.',
  /** [CI §3] Left blank for Professional and Fellow. */
  tierPricing: 'Professional and Fellow prices not supplied — tiers route to contact.',
  /** [CI §4] "CPD will be defined. Document will be loaded in the folder." */
  cpdFramework: 'Hours, renewal period and categories all undefined.',
  /** [CI §4] "We should build that in." / "Yes. Let's do that." — intent, not a live system. */
  credentialVerification: 'Digital verification and the employer registry are planned, not live.',
  /** [CI §4] "I am lost on this." */
  fellowPostNominals: 'Post-nominals for Fellows not approved — not published.',
  /** [CI §5] "web link" — no ticket prices or registration URL supplied. */
  conferenceTickets: 'No ticket prices or registration link.',
  /** [CI §5] "All done with Yannick" — not yet supplied to us. */
  conferenceProgramme: 'Speaker list and agenda not in hand.',
  /** [CI §5] "annual calendar will be shared on the drive" */
  regionalMeetups: 'No confirmed meetups. The six city hubs previously on the site were invented.',
  /** [CI §5] "to be confirmed in the docs to be shared on the drive" */
  webinars: 'No confirmed webinars or masterclasses.',
  /** [CI §6] "tools to be loaded" */
  templatesAndTools: 'No templates supplied.',
  /** [CI §6] "not sure I get this" */
  careerGuides: 'Client did not recognise the category — nothing published.',
  /** [CI §7] "glean from LI" — not yet written or approved. */
  leadershipBios: 'No approved bios for either consultant.',
  /** [CI §7] Both headshots now supplied. Bios still outstanding. */
  leadershipHeadshots: 'Both leader photos supplied and in use.',
  /** [CI §7] "yes. Picture from Nasim." */
  founder: 'Founder may be named and quoted, but no name, quote or picture supplied.',
  /** [CI §8] "we will have these later." */
  governance:
    'Council members can be loaded from the brochure once supplied. Election process, code of conduct and complaints procedure all undefined.',
  /** [CI §10] "reach Yannick on same." */
  legalPolicies: 'Privacy policy, terms, refund policy and cookie notice all outstanding.',
  /** [CI §11] "Yannick, Percy, Nasim, Daniel should help with these." */
  testimonials: 'No real testimonials supplied — all placeholders removed.',
} as const
