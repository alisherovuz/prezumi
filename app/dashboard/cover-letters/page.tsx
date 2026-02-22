'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function CoverLettersPage() {
  const [letters, setLetters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadLetters() }, [])

  const loadLetters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      const { data } = await supabase.from('cover_letters').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
      setLetters(data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const deleteLetter = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('cover_letters').delete().eq('id', id)
    setLetters(letters.filter(l => l.id !== id))
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-soft px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
            <h1 className="font-medium">Cover Letters</h1>
          </div>
          <Link href="/dashboard/cover-letter/new" className="bg-ink text-cream px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent">+ New</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : letters.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
            <h2 className="text-xl font-medium mb-2">No cover letters yet</h2>
            <Link href="/dashboard/cover-letter/new" className="bg-ink text-cream px-5 py-2.5 rounded-xl text-sm font-medium">Create Cover Letter</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-soft p-6 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center"><svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                  <button onClick={() => deleteLetter(l.id)} className="text-muted hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                </div>
                <h3 className="font-medium truncate">{l.title || 'Untitled'}</h3>
                <p className="text-sm text-muted mt-1">{l.company_name || 'No company'}</p>
                <p className="text-xs text-muted mt-1">{new Date(l.updated_at).toLocaleDateString()}</p>
                <Link href={`/dashboard/cover-letter/new?id=${l.id}`} className="block mt-4 text-center py-2 bg-soft rounded-lg text-sm font-medium hover:bg-ink hover:text-cream">Edit</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
