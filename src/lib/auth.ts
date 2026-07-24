import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebase'

export type MembershipTier = 'Associate' | 'Professional' | 'Fellow'

export interface AssociateSignupInput {
  name: string
  email: string
  country: string
  password: string
  newsletterConsent: boolean
}

/** Adds the tier choice, used only by the (currently dormant) paid checkout. */
export interface PendingSignup extends AssociateSignupInput {
  tier: MembershipTier
}

export const TIER_PRICING: Record<MembershipTier, number> = {
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

/** Maps Firebase Auth error codes to messages safe to show in the UI. */
export function getAuthErrorMessage(err: unknown): string {
  const code = (err as { code?: string } | null | undefined)?.code
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/weak-password':
      return 'Please choose a password with at least 6 characters.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Please allow popups and try again.'
    case 'auth/account-exists-with-different-credential':
      return 'An account with this email already exists using a different sign-in method. Try signing in with your password instead.'
    case 'auth/unauthorized-domain':
      return 'This site isn’t authorized for Google sign-in yet. Add this domain in Firebase Console → Authentication → Settings → Authorized domains.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

/**
 * Creates a real Firebase Auth account + Firestore profile. This is the
 * Associate (free) signup path only — Firestore security rules only allow
 * a client to self-create a doc with tier 'Associate'/status 'active', so
 * this is intentionally not parameterised by pending.tier.
 */
export async function signUpAssociate(pending: AssociateSignupInput): Promise<void> {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), pending.email, pending.password)
  await updateProfile(credential.user, { displayName: pending.name })
  await setDoc(doc(getFirebaseDb(), 'users', credential.user.uid), {
    uid: credential.user.uid,
    name: pending.name,
    email: pending.email,
    country: pending.country,
    tier: 'Associate',
    status: 'active',
    newsletterConsent: pending.newsletterConsent,
    memberId: generateMemberId(),
    createdAt: serverTimestamp(),
  })
}

// Carries the newsletter-consent choice across a full-page redirect sign-in,
// since the redirect leaves and reloads the app before we can create the
// profile. Only set right before a redirect; read + cleared on return.
const GOOGLE_CONSENT_KEY = 'aipea_google_consent'

/**
 * Creates the Associate Firestore profile for a first-time Google user — the
 * same shape and rules-allowed fields as the password signup path, so the
 * existing onUserProfileCreated Cloud Function sends the welcome email with no
 * backend changes. No-op for returning users who already have a profile.
 */
async function ensureGoogleProfile(user: User, newsletterConsent: boolean): Promise<void> {
  const userRef = doc(getFirebaseDb(), 'users', user.uid)
  const existing = await getDoc(userRef)
  if (existing.exists()) return
  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'AIPEA Member',
    email: user.email ?? '',
    country: '',
    tier: 'Associate',
    status: 'active',
    newsletterConsent,
    memberId: generateMemberId(),
    createdAt: serverTimestamp(),
  })
}

/**
 * Google sign-in / signup. Tries the popup first; if the browser blocks the
 * popup (popup blockers, Safari/Brave defaults, mobile), it falls back to a
 * full-page redirect, which no browser can block. The redirect leaves the app,
 * so profile creation on return is handled by completeGoogleRedirect() — this
 * function does not resolve in the redirect case (the page navigates away).
 */
export async function continueWithGoogle(newsletterConsent = false): Promise<void> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  try {
    const credential = await signInWithPopup(auth, provider)
    await ensureGoogleProfile(credential.user, newsletterConsent)
  } catch (err) {
    const code = (err as { code?: string } | null)?.code
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-environment') {
      // Persist consent so completeGoogleRedirect() can apply it after return.
      try {
        localStorage.setItem(GOOGLE_CONSENT_KEY, newsletterConsent ? '1' : '0')
      } catch {
        // localStorage unavailable — profile just defaults to no consent.
      }
      await signInWithRedirect(auth, provider)
      return // page navigates away; nothing after this runs
    }
    throw err
  }
}

/**
 * Completes a redirect-based Google sign-in when the tab returns. Safe to call
 * on every mount of the auth pages: resolves to false when there is no pending
 * redirect result, true when a redirect sign-in just completed (profile
 * ensured). Rethrows real auth errors for the caller to surface.
 */
export async function completeGoogleRedirect(): Promise<boolean> {
  const result = await getRedirectResult(getFirebaseAuth())
  if (!result?.user) return false
  let consent = false
  try {
    consent = localStorage.getItem(GOOGLE_CONSENT_KEY) === '1'
    localStorage.removeItem(GOOGLE_CONSENT_KEY)
  } catch {
    // ignore storage errors; default consent already false
  }
  await ensureGoogleProfile(result.user, consent)
  return true
}

export async function signInMember(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
}

export async function signOutMember(): Promise<void> {
  await signOut(getFirebaseAuth())
}

// --- Paid-tier (Professional/Fellow) placeholder, kept fake on purpose ------
//
// Payment verification isn't wired up yet (see checkout/page.tsx) — there's
// no backend that confirms a Paystack transaction actually happened, so a
// "paid" signup can't be granted a real account the way Associate signups
// are. This local-only stand-in preserves today's demo behaviour for the
// paid flow without pretending it's a real, persisted membership. It's
// superseded once Paystack verification ships.

export interface FakePaidUser {
  name: string
  email: string
  tier: MembershipTier
  country?: string
  memberId: string
  joinedAt: string
}

export function saveFakePaidUser(user: FakePaidUser): void {
  localStorage.setItem('aipea_fake_paid_user', JSON.stringify(user))
}
