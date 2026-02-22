'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadResumes() }, [])

  const loadResumes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      const { data } = await supabase.from('resumes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
      setResumes(data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const deleteResume = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('resumes').delete().eq('id', id)
    setResumes(resumes.filter(r => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-soft px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
            <h1 className="font-medium">My Resumes</h1>
          </div>
          <Link href="/dashboard/resume/templates" className="bg-ink text-cream px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent">+ New</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
            <h2 className="text-xl font-medium mb-2">No resumes yet</h2>
            <Link href="/dashboard/resume/templates" className="bg-ink text-cream px-5 py-2.5 rounded-xl text-sm font-medium">Create Resume</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-soft overflow-hidden hover:shadow-lg">
                <div className="aspect-[3/4] bg-soft p-4"><div className="bg-white rounded-lg h-full shadow-sm p-4"><div className="h-3 bg-soft rounded w-1/2 mb-2"></div><div className="h-2 bg-soft rounded w-full mb-1"></div></div></div>
                <div className="p-4">
                  <h3 className="font-medium truncate">{r.title || 'Untitled'}</h3>
                  <p className="text-xs text-muted mt-1">{new Date(r.updated_at).toLocaleDateString()}</p>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/dashboard/resume/editor?id=${r.id}`} className="flex-1 text-center py-2 bg-soft rounded-lg text-sm font-medium hover:bg-ink hover:text-cream">Edit</Link>
                    <button onClick={() => deleteResume(r.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
