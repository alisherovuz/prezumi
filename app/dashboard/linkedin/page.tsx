'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LinkedInPage() {
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [jobTitle, setJobTitle] = useState('')
  const [headlines, setHeadlines] = useState<string[]>([])
  const [summary, setSummary] = useState('')
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = '/auth/login'; return }
      setIsPro(false)
      setLoading(false)
    })
  }, [])

  const generateHeadline = async () => {
    if (!isPro) { setShowUpgrade(true); return }
    if (!jobTitle) return alert('Enter your job title first')
    setGenerating('headline')
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'linkedin_headline', context: { jobTitle } }) })
      const data = await res.json()
      if (data.success) setHeadlines(data.content.split('\n').filter((h: string) => h.trim()))
      else alert(data.error)
    } catch { alert('Failed to generate') }
    finally { setGenerating(null) }
  }

  const generateSummary = async () => {
    if (!isPro) { setShowUpgrade(true); return }
    if (!jobTitle) return alert('Enter your job title first')
    setGenerating('summary')
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'linkedin_summary', context: { jobTitle } }) })
      const data = await res.json()
      if (data.success) setSummary(data.content)
      else alert(data.error)
    } catch { alert('Failed to generate') }
    finally { setGenerating(null) }
  }

  const copy = (text: string) => { navigator.clipboard.writeText(text); alert('Copied!') }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="min-h-screen bg-cream">
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <h2 className="text-2xl font-medium mb-2">Upgrade to Pro</h2>
              <p className="text-muted mb-6">LinkedIn Optimizer is a Pro feature.</p>
              <div className="bg-soft rounded-2xl p-4 mb-6 text-left">
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>LinkedIn Optimizer</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Portfolio Website</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Premium Templates</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUpgrade(false)} className="flex-1 py-3 border border-soft rounded-xl text-sm font-medium">Later</button>
                <Link href="/#pricing" className="flex-1 bg-accent text-white py-3 rounded-xl text-sm font-medium text-center">Upgrade — $9/mo</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-soft px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <svg className="w-6 h-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          <h1 className="font-medium">LinkedIn Optimizer</h1>
          <span className="bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full">PRO</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-8 space-y-6">
        {!isPro && (
          <div className="bg-gradient-to-r from-accent to-orange-500 text-white rounded-2xl p-6 flex items-center justify-between">
            <div><h2 className="font-medium text-lg mb-1">🔒 Pro Feature</h2><p className="text-white/80 text-sm">Upgrade to unlock</p></div>
            <button onClick={() => setShowUpgrade(true)} className="bg-white text-accent px-4 py-2 rounded-xl text-sm font-medium">Upgrade</button>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6">
          <label className="block text-sm font-medium mb-2">Your Job Title</label>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full bg-soft border-none rounded-xl px-4 py-3 text-sm" placeholder="e.g., Senior Software Engineer"/>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="font-medium">LinkedIn Headline</h2><p className="text-sm text-muted">Max 120 characters</p></div>
            <button onClick={generateHeadline} disabled={generating === 'headline'} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">{generating === 'headline' ? 'Generating...' : '✨ Generate'}</button>
          </div>
          {headlines.length > 0 ? (
            <div className="space-y-3">{headlines.map((h, i) => <div key={i} className="flex items-center gap-3 p-3 bg-soft rounded-xl"><p className="flex-1 text-sm">{h.replace(/^\d+\.\s*/, '')}</p><button onClick={() => copy(h.replace(/^\d+\.\s*/, ''))} className="text-accent text-xs hover:underline">Copy</button></div>)}</div>
          ) : <p className="text-muted text-sm italic">Click Generate to create headline options</p>}
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="font-medium">About Section</h2><p className="text-sm text-muted">Max 2,600 characters</p></div>
            <button onClick={generateSummary} disabled={generating === 'summary'} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">{generating === 'summary' ? 'Generating...' : '✨ Generate'}</button>
          </div>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={8} className="w-full bg-soft border-none rounded-xl px-4 py-3 text-sm resize-none" placeholder="Your LinkedIn About section..."/>
          {summary && <div className="flex justify-between items-center mt-3"><span className="text-xs text-muted">{summary.length} / 2,600</span><button onClick={() => copy(summary)} className="text-accent text-sm hover:underline">Copy</button></div>}
        </div>

        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="font-medium mb-3">💡 LinkedIn Tips</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>• Use keywords recruiters search for</li>
            <li>• Start your About with a hook</li>
            <li>• Include achievements with numbers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
