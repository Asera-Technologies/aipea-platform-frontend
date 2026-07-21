'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUpAssociate, continueWithGoogle, getAuthErrorMessage } from '@/lib/auth'
import { BrandPanel } from '@/components/auth/BrandPanel'
import {
  AuthCard, AuthHeader, Field, PasswordField, ConsentCheckbox,
  FormError, PrimaryButton, GoogleButton, Divider, AuthFooterLink,
} from '@/components/auth/AuthKit'
import { C, bod } from '@/components/site/tokens'

// Every signup is a free Associate membership for now — the tier picker and
// the Paystack checkout step are parked until paid tiers are confirmed, so
// this form creates the account directly instead of routing via /checkout.

export default function SignUp() {
  const router = useRouter()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [country,  setCountry]  = useState('')
  const [password, setPassword] = useState('')
  const [newsletterConsent, setNewsletterConsent] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())        { setError('Please enter your full name.'); return }
    if (!email.trim())       { setError('Please enter your email.'); return }
    if (!country.trim())     { setError('Please enter your country.'); return }
    if (!password)           { setError('Please choose a password.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    try {
      await signUpAssociate({
        name: name.trim(),
        email: email.trim(),
        country: country.trim(),
        password,
        newsletterConsent,
      })
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
      await continueWithGoogle(newsletterConsent)
      router.push('/dashboard')
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setGoogleLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <BrandPanel
        flex="0 0 44%"
        headline={<>Join Africa&apos;s leading professional community for EAs.</>}
        sub="Get certified, connected, and recognised. Create your account in under two minutes."
      />

      <AuthCard>
        <AuthHeader
          eyebrow="Membership"
          title="Join"
          highlight="AIPEA."
          sub="Create your free Associate membership. No payment required."
        />

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="aipea-signup-row">
            <Field label="Full name" value={name} onChange={setName} placeholder="Adwoa Mensah" autoComplete="name" />
            <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />
          </div>

          <Field label="Country" value={country} onChange={setCountry} placeholder="Ghana" autoComplete="country-name" />

          <PasswordField label="Password" value={password} onChange={setPassword} autoComplete="new-password" />

          <ConsentCheckbox checked={newsletterConsent} onChange={setNewsletterConsent}>
            Send me AIPEA news, event invites, and the occasional newsletter. Unsubscribe anytime.
          </ConsentCheckbox>

          <FormError message={error} />

          <PrimaryButton loading={loading} loadingLabel="Creating your account…">
            Create free account
          </PrimaryButton>
        </form>

        <div style={{ margin: '22px 0' }}>
          <Divider label="or" />
        </div>

        <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Continue with Google" />

        <p style={{ fontFamily: bod, fontSize: 11.5, color: 'rgba(17,28,66,0.32)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          Your newsletter choice above applies either way.
        </p>

        <AuthFooterLink prompt="Already a member?" href="/sign-in" label="Sign in →" />
      </AuthCard>
    </div>
  )
}
