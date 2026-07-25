/**
 * AIPEA Track Finder — Professional Scope Audit engine.
 *
 * Source: [TF] AIPEA Track Finder + [DD] Deep Dive Role Descriptor Framework.
 * Placement is a 3×2 matrix: operational horizon × accountability scope.
 * Canonical PA base acronym is CERTPA (client direction, 2026-07-24).
 */

import { STRANDS, type Strand, type Track } from './facts'

export type HorizonId = 1 | 2 | 3
export type ScopeLevel = 'A' | 'B'

export type HorizonOption = {
  id: HorizonId
  label: string
  subtitle: string
  body: string
}

export type ScopeOption = {
  id: ScopeLevel
  label: string
  subtitle: string
  body: string
}

/** Step 1 copy from the Track Finder PDF. */
export const HORIZON_OPTIONS: HorizonOption[] = [
  {
    id: 1,
    label: 'Immediate & Tactical',
    subtitle: 'Day-to-day to Month-to-date',
    body: 'I take chaos, messy schedules, complex travel and unstructured task lists and turn them into absolute order, speed and daily operational flow.',
  },
  {
    id: 2,
    label: 'Strategic & Diplomatic',
    subtitle: 'Month-to-date to Quarter-to-date',
    body: 'I navigate corporate politics, align board and C-Suite stakeholders, synthesize complex data into executive briefs and track quarterly objectives.',
  },
  {
    id: 3,
    label: 'Systemic & Institutional',
    subtitle: 'Quarter-to-date to Multi-Year',
    body: 'I architect enterprise-wide workflows, build low-code automation pipelines, direct cross-functional teams, or secure institutional growth resources.',
  },
]

/** Step 2 copy from the Track Finder PDF. */
export const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'A',
    label: 'Scope Level A',
    subtitle: 'Individual & Execution Mastery',
    body: "My primary accountability is single-handedly executing tasks, protecting an executive's focus, managing individual logistics, or writing executive briefs.",
  },
  {
    id: 'B',
    label: 'Scope Level B',
    subtitle: 'Ecosystem, Resource & Team Leadership',
    body: 'My accountability extends to managing budgets, leading admin pools, managing vendor contracts, running board governance, or driving enterprise systems.',
  },
]

export type TrackFinderResult = {
  horizon: HorizonId
  scope: ScopeLevel
  strand: Strand
  track: Track
  /** Strand-level focus tailored for result / email pages. */
  coreFocus: string
  problemSolved: string
  /** Email: KEY_CORE_VALUE_DRIVER */
  coreValueDriver: string
  /** Email: DYNAMIC_BULLET_1..3 */
  bullets: [string, string, string]
}

const RESULT_COPY: Record<
  HorizonId,
  {
    coreFocus: string
    problemSolved: string
    coreValueDriver: string
    bullets: Record<ScopeLevel, [string, string, string]>
  }
> = {
  1: {
    coreFocus: 'Operational Fluidity & Executive Synchronization',
    problemSolved:
      'Taking unstructured, fast-moving daily tasks and applying tech, speed and gatekeeping diplomacy to create friction-free executive operations.',
    coreValueDriver: 'operational fluidity and executive synchronization',
    bullets: {
      A: [
        'Turning messy schedules, travel and inboxes into absolute daily order',
        'Protecting one executive’s focus through gatekeeping and tech enablement',
        'Delivering flawless individual execution under high-velocity pressure',
      ],
      B: [
        'Leading the junior admin pool and mentoring support colleagues',
        'Negotiating vendor contracts and managing office procurement budgets',
        'Designing scalable administrative systems that save the organisation real cost',
      ],
    },
  },
  2: {
    coreFocus: 'Strategic Alignment & Stakeholder Diplomacy',
    problemSolved:
      'Operating in the gray spaces of corporate politics, board dynamics, C-Suite brief synthesis and aligning cross-departmental KPIs with quarterly goals.',
    coreValueDriver: 'strategic alignment and stakeholder diplomacy',
    bullets: {
      A: [
        'Navigating corporate politics and high-touch stakeholder communication',
        'Synthesizing complex data into precise executive briefing notes',
        'Executing multi-country logistics against quarterly objectives',
      ],
      B: [
        'Commanding Board and AGM governance mechanics end to end',
        'Tracking division KPIs and aligning cross-departmental priorities',
        'Formulating board-level budgets and corporate variance tracking',
      ],
    },
  },
  3: {
    coreFocus: 'Enterprise Integration & Institutional Growth',
    problemSolved:
      'Serving as a strategic proxy and system architect—building automated tech pipelines, directing post-merger integrations and securing capital/grant resources.',
    coreValueDriver: 'enterprise integration and institutional growth',
    bullets: {
      A: [
        'Building low-code enterprise automation and support-layer project systems',
        'Deploying agile frameworks across operational teams',
        'Acting as a strategic proxy when the executive agenda must move at enterprise scale',
      ],
      B: [
        'Sourcing international grants, sponsorships and institutional funding',
        'Leading post-merger integrations and organisational redesign',
        'Lobbying and scale governance that shift how the enterprise operates',
      ],
    },
  },
}

export function resolveTrack(horizon: HorizonId, scope: ScopeLevel): TrackFinderResult {
  const strand = STRANDS[horizon - 1]
  const track = strand.tracks[scope === 'A' ? 0 : 1]
  const copy = RESULT_COPY[horizon]
  return {
    horizon,
    scope,
    strand,
    track,
    coreFocus: copy.coreFocus,
    problemSolved: copy.problemSolved,
    coreValueDriver: copy.coreValueDriver,
    bullets: copy.bullets[scope],
  }
}

export type PendingScopeAudit = {
  horizon: HorizonId
  scope: ScopeLevel
}

const PENDING_KEY = 'aipea_pending_scope_audit'

export function savePendingScopeAudit(pending: PendingScopeAudit): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
}

export function getPendingScopeAudit(): PendingScopeAudit | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingScopeAudit
    if (parsed.horizon !== 1 && parsed.horizon !== 2 && parsed.horizon !== 3) return null
    if (parsed.scope !== 'A' && parsed.scope !== 'B') return null
    return parsed
  } catch {
    return null
  }
}

export function clearPendingScopeAudit(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(PENDING_KEY)
}

/** Payload written to Firestore under users/{uid}/scopeAudits/{id}. */
export type ScopeAuditRecord = {
  horizon: HorizonId
  scope: ScopeLevel
  trackAcronym: string
  trackName: string
  strandId: string
  strandName: string
  coreFocus: string
  operationalHorizon: string
  targetAccountability: string
  coreValueDriver: string
  bullets: [string, string, string]
  createdAt: unknown
}

export function buildScopeAuditRecord(result: TrackFinderResult, createdAt: unknown): ScopeAuditRecord {
  return {
    horizon: result.horizon,
    scope: result.scope,
    trackAcronym: result.track.acronym,
    trackName: result.track.name,
    strandId: result.strand.id,
    strandName: result.strand.name,
    coreFocus: result.coreFocus,
    operationalHorizon: result.strand.horizon,
    targetAccountability: result.track.scopeLabel,
    coreValueDriver: result.coreValueDriver,
    bullets: result.bullets,
    createdAt,
  }
}
