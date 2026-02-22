'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [resumes, setResumes] = useState<any[]>([])
  const [coverLetters, setCoverLetters] = useState<any[]>([])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      
      setUser(user)
      await loadDocuments(user.id)
    } catch (error) {
      console.error('Auth error:', error)
      window.location.href = '/auth/login'
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async (userId: string) => {
    try {
      const [resumeRes, coverRes] = await Promise.all([
        supabase.from('resumes').select('*').eq('user_id', userId).order('updated_at', { ascending: false }).limit(5),
        supabase.from('cover_letters').select('*').eq('user_id', userId).order('updated_at', { ascending: false }).limit(5)
      ])
      
      setResumes(resumeRes.data || [])
      setCoverLetters(coverRes.data || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-soft flex flex-col fixed h-full">
        <div className="p-6 border-b border-soft">
          <Link href="/" className="font-semibold text-xl tracking-tight">
            Prezumi<span className="text-accent">.</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-soft text-ink font-medium">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link href="/dashboard/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:bg-soft transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Resumes
          </Link>

          <Link href="/dashboard/cover-letters" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:bg-soft transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Cover Letters
          </Link>

          <Link href="/dashboard/linkedin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:bg-soft transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
            <span className="ml-auto text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">PRO</span>
          </Link>

          <Link href="/dashboard/portfolio" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:bg-soft transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            Portfolio
            <span className="ml-auto text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">PRO</span>
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-medium">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userName}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-muted hover:text-ink transition-colors" title="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium">Dashboard</h1>
            <p className="text-muted text-sm">Welcome back, {userName}! 👋</p>
          </div>
          <Link href="/dashboard/resume/templates" className="flex items-center gap-2 bg-ink text-cream px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Resume
          </Link>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/resume/templates" className="bg-white rounded-2xl p-5 border border-soft hover:border-accent hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-soft rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <svg className="w-6 h-6 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Choose Template</h3>
              <p className="text-sm text-muted">Start with a design</p>
            </Link>

            <Link href="/dashboard/resume/ai-builder" className="bg-white rounded-2xl p-5 border border-soft hover:border-accent hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                </svg>
              </div>
              <h3 className="font-medium mb-1">AI Resume Builder</h3>
              <p className="text-sm text-muted">Let AI help you</p>
            </Link>

            <Link href="/dashboard/cover-letter/new" className="bg-white rounded-2xl p-5 border border-soft hover:border-accent hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-soft rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <svg className="w-6 h-6 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Cover Letter</h3>
              <p className="text-sm text-muted">Generate with AI</p>
            </Link>

            <Link href="/dashboard/linkedin" className="bg-white rounded-2xl p-5 border border-soft hover:border-accent hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-soft rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <svg className="w-6 h-6 group-hover:text-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <h3 className="font-medium mb-1">LinkedIn</h3>
              <p className="text-sm text-muted">Optimize profile</p>
            </Link>
          </div>
        </section>

        {/* Recent Documents */}
        <section>
          <h2 className="text-lg font-medium mb-4">Recent Documents</h2>
          {resumes.length === 0 && coverLetters.length === 0 ? (
            <div className="bg-white rounded-2xl border border-soft p-12 text-center">
              <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No documents yet</h3>
              <p className="text-muted text-sm mb-6">Create your first resume to get started.</p>
              <Link href="/dashboard/resume/templates" className="bg-ink text-cream px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent transition-colors">
                Create Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map(resume => (
                <div key={resume.id} className="bg-white rounded-2xl border border-soft p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-soft rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{resume.title || 'Untitled Resume'}</h3>
                      <p className="text-xs text-muted">Resume • {new Date(resume.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/resume/editor?id=${resume.id}`} className="block text-center py-2 bg-soft rounded-lg text-sm font-medium hover:bg-ink hover:text-cream transition-colors">
                    Edit
                  </Link>
                </div>
              ))}
              {coverLetters.map(letter => (
                <div key={letter.id} className="bg-white rounded-2xl border border-soft p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{letter.title || 'Untitled Letter'}</h3>
                      <p className="text-xs text-muted">Cover Letter • {new Date(letter.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/cover-letter/new?id=${letter.id}`} className="block text-center py-2 bg-soft rounded-lg text-sm font-medium hover:bg-ink hover:text-cream transition-colors">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
