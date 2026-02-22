'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-cream">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl mb-2">Check your email</h1>
          <p className="text-muted mb-6">
            We sent a password reset link to<br/>
            <strong>{email}</strong>
          </p>
          <p className="text-sm text-muted mb-6">
            Didn't receive the email? Check your spam folder or{' '}
            <button onClick={() => setSent(false)} className="text-accent hover:underline">try again</button>
          </p>
          <Link href="/auth/login" className="text-accent hover:underline text-sm">
            ← Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-semibold text-2xl tracking-tight">
            Prezumi<span className="text-accent">.</span>
          </Link>
          <h1 className="font-serif text-3xl mt-6 mb-2">Forgot password?</h1>
          <p className="text-muted">No worries, we'll send you reset instructions</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-soft rounded-xl px-4 py-3 text-sm focus:border-accent focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-cream py-3 rounded-xl text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          <Link href="/auth/login" className="text-accent hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  )
}
