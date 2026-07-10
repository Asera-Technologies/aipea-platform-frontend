export interface AIPEAUser {
  name: string
  email: string
  tier: 'Associate' | 'Professional' | 'Fellow'
  country?: string
  memberId: string
  joinedAt: string
}

export interface PendingSignup {
  name: string
  email: string
  country: string
  tier: AIPEAUser['tier']
}

export const TIER_PRICING: Record<AIPEAUser['tier'], number> = {
  Associate: 0,
  Professional: 1200,
  Fellow: 2500,
}

export function formatCedis(amount: number): string {
  return amount === 0 ? 'Free' : `₵${amount.toLocaleString('en-GH')}`
}

export function savePendingSignup(pending: PendingSignup): void {
  localStorage.setItem('aipea_pending', JSON.stringify(pending))
}

export function getPendingSignup(): PendingSignup | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('aipea_pending')
    return raw ? (JSON.parse(raw) as PendingSignup) : null
  } catch {
    return null
  }
}

export function clearPendingSignup(): void {
  localStorage.removeItem('aipea_pending')
}

export function getUser(): AIPEAUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('aipea_user')
    return raw ? (JSON.parse(raw) as AIPEAUser) : null
  } catch {
    return null
  }
}

export function saveUser(user: AIPEAUser): void {
  localStorage.setItem('aipea_user', JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem('aipea_user')
}

export function generateMemberId(): string {
  const year = new Date().getFullYear()
  return `AIPEA-${year}-${String(Math.floor(10000 + Math.random() * 90000))}`
}

export function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function firstName(name: string): string {
  return name.trim().split(' ')[0]
}
