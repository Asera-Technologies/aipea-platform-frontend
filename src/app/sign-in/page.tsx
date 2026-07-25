'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInMember, continueWithGoogle, completeGoogleRedirect, getAuthErrorMessage } from '@/lib/auth'
import { BrandPanel } from '@/components/auth/BrandPanel'
import {
  AuthCard, AuthHeader, Field, PasswordField,
  FormError, PrimaryButton, GoogleButton, Divider, AuthFooterLink, AuthRedirectOverlay,
} from '@/components/auth/AuthKit'
import { C, bod } from '@/components/site/tokens'

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/dashboard'
  return raw
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = safeNextPath(searchParams.get('next'))
  const signUpHref = nextPath === '/dashboard' ? '/sign-up' : `/sign-up?next=${encodeURIComponent(nextPath)}`
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    setGoogleLoading(true)
    completeGoogleRedirect()
      .then((completed) => {
        if (completed) { setRedirecting(true); router.push(nextPath) }
        else setGoogleLoading(false)
      })
      .catch((err) => {
        setError(getAuthErrorMessage(err))
        setGoogleLoading(false)
      })
  }, [router, nextPath])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await signInMember(email.trim(), password)
      setRedirecting(true)
      router.push(nextPath)
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await continueWithGoogle(false)
      setRedirecting(true)
      router.push(nextPath)
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setGoogleLoading(false)
    }
  }

  if (redirecting) {
    return (
      <AuthRedirectOverlay
        message={nextPath === '/dashboard' ? 'Loading your member dashboard' : 'Continuing where you left off'}
      />
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <BrandPanel
        flex="0 0 44%"
        headline={<>Africa&apos;s professional home for Executive Assistants.</>}
        sub="Welcome back. Sign in to manage your membership, credentials, and CPD."
      />

      <AuthCard>
        <AuthHeader
          eyebrow="Member access"
          title="Welcome"
          highlight="back."
          sub="Sign in to your AIPEA account."
        />

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />

          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            hint={<span style={{ fontFamily: bod, fontSize: 12, color: 'rgba(17,28,66,0.34)' }}>Forgot password?</span>}
          />

          <FormError message={error} />

          <PrimaryButton loading={loading} loadingLabel="Signing in…">
            Sign in
          </PrimaryButton>
        </form>

        <div style={{ margin: '22px 0' }}>
          <Divider label="or" />
        </div>

        <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Continue with Google" />

        <AuthFooterLink prompt="Don't have an account?" href={signUpHref} label="Join AIPEA →" />
      </AuthCard>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={<AuthRedirectOverlay message="Loading your member dashboard" />}>
      <SignInForm />
    </Suspense>
  )
}
