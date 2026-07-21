'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot, Timestamp } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase'
import type { MembershipTier } from '@/lib/auth'

export interface MemberProfile {
  uid: string
  name: string
  email: string
  country: string
  tier: MembershipTier
  status: 'active' | 'pending_payment'
  memberId: string
  joinedAt: string // ISO string
}

interface UseAuthResult {
  user: User | null
  profile: MemberProfile | null
  loading: boolean
}

/** Real Firebase Auth session + the matching users/{uid} Firestore profile. */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null)
  const [authResolved, setAuthResolved] = useState(false)
  const [profile, setProfile] = useState<MemberProfile | null>(null)

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      setUser(firebaseUser)
      setAuthResolved(true)
      if (!firebaseUser) setProfile(null)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    return onSnapshot(doc(getFirebaseDb(), 'users', user.uid), (snap) => {
      const data = snap.data()
      setProfile(
        data
          ? {
              uid: data.uid,
              name: data.name,
              email: data.email,
              country: data.country,
              tier: data.tier,
              status: data.status,
              memberId: data.memberId,
              joinedAt:
                data.createdAt instanceof Timestamp
                  ? data.createdAt.toDate().toISOString()
                  : new Date().toISOString(),
            }
          : null
      )
    })
  }, [user])

  // Still loading if auth state hasn't resolved yet, or a session exists
  // but its Firestore profile hasn't arrived (or belongs to a prior user).
  const loading = !authResolved || (user !== null && profile?.uid !== user.uid)

  return { user, profile, loading }
}
