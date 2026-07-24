'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInMember, continueWithGoogle, completeGoogleRedirect, getAuthErrorMessage } from '@/lib/auth'
import { BrandPanel } from '@/components/auth/BrandPanel'
import {
  AuthCard, AuthHeader, Field, PasswordField,
  FormError, PrimaryButton, GoogleButton, Divider, AuthFooterLink,
} from '@/components/auth/AuthKit'
import { C, bod, dis } from '@/components/site/tokens'

export default function SignIn() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  // Stays true from the moment auth succeeds until the dashboard takes over, so
  // the sign-in form never flashes back during the navigation + auth rehydrate.
  const [redirecting, setRedirecting] = useState(false)

  // Finish a redirect-based Google sign-in when the tab returns from Google.
  useEffect(() => {
    setGoogleLoading(true)
    completeGoogleRedirect()
      .then((completed) => {
        if (completed) { setRedirecting(true); router.push('/dashboard') }
        else setGoogleLoading(false)
      })
      .catch((err) => {
        setError(getAuthErrorMessage(err))
        setGoogleLoading(false)
      })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await signInMember(email.trim(), password)
      setRedirecting(true)
      router.push('/dashboard')
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      // Existing members keep whatever preference they signed up with; this
      // flag only applies if Google creates a brand-new profile.
      await continueWithGoogle(false)
      setRedirecting(true)
      router.push('/dashboard')
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setGoogleLoading(false)
    }
  }

  if (redirecting) return <RedirectOverlay />

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

        <AuthFooterLink prompt="Don't have an account?" href="/sign-up" label="Join AIPEA →" />
      </AuthCard>
    </div>
  )
}

// Full-screen brand veil shown from the instant auth succeeds until the
// dashboard mounts, so the sign-in form never reappears mid-navigation.
function RedirectOverlay() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes aipeaPulse{0%,100%{opacity:.25}50%{opacity:1}}`}</style>
      <span style={{
        fontFamily: dis, fontWeight: 800, fontSize: 16, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: C.orange, animation: 'aipeaPulse 1.4s ease-in-out infinite',
      }}>
        AIPEA
      </span>
    </div>
  )
}
