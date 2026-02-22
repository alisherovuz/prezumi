'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  
  const [portfolio, setPortfolio] = useState({ name: '', title: '', bio: '', email: '', linkedin: '', github: '', theme: 'light', accentColor: '#E85D04' })
  const [projects, setProjects] = useState<Array<{ id: string; title: string; description: string; link: string; tags: string }>>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = '/auth/login'; return }
      setIsPro(false)
      setLoading(false)
    })
  }, [])

  const addProject = () => {
    if (!isPro) { setShowUpgrade(true); return }
    setProjects([...projects, { id: Date.now().toString(), title: '', description: '', link: '', tags: '' }])
  }
  const updateProject = (id: string, field: string, value: string) => setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p))
  const removeProject = (id: string) => setProjects(projects.filter(p => p.id !== id))

  const publishSite = () => {
    if (!isPro) { setShowUpgrade(true); return }
    alert('Coming soon! Your site: prezumi.ai/' + portfolio.name.toLowerCase().replace(/\s/g, '-'))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="min-h-screen bg-soft">
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              </div>
              <h2 className="text-2xl font-medium mb-2">Upgrade to Pro</h2>
              <p className="text-muted mb-6">Portfolio Website is a Pro feature.</p>
              <div className="bg-soft rounded-2xl p-4 mb-6 text-left">
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Beautiful designs</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Free subdomain</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Project showcase</li>
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

      <header className="bg-white border-b border-soft px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="font-medium">Portfolio Website</h1>
          <span className="bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full">PRO</span>
        </div>
        <button onClick={publishSite} className="bg-ink text-cream px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent">Publish Site</button>
      </header>

      <div className="flex">
        <div className="w-1/2 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
          {!isPro && (
            <div className="bg-gradient-to-r from-accent to-orange-500 text-white rounded-2xl p-6 mb-6 flex items-center justify-between">
              <div><h2 className="font-medium text-lg mb-1">🔒 Pro Feature</h2><p className="text-white/80 text-sm">Upgrade to create your portfolio</p></div>
              <button onClick={() => setShowUpgrade(true)} className="bg-white text-accent px-4 py-2 rounded-xl text-sm font-medium">Upgrade</button>
            </div>
          )}

          <div className="flex gap-2 mb-6">
            {['hero', 'about', 'projects', 'contact'].map(s => (
              <button key={s} onClick={() => setActiveSection(s)} className={`px-4 py-2 rounded-xl text-sm capitalize ${activeSection === s ? 'bg-ink text-cream' : 'bg-white text-muted'}`}>{s}</button>
            ))}
          </div>

          {activeSection === 'hero' && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h2 className="font-medium">Hero Section</h2>
              <input type="text" value={portfolio.name} onChange={(e) => setPortfolio({...portfolio, name: e.target.value})} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Your Name"/>
              <input type="text" value={portfolio.title} onChange={(e) => setPortfolio({...portfolio, title: e.target.value})} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Your Title"/>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-medium mb-4">About</h2>
              <textarea value={portfolio.bio} onChange={(e) => setPortfolio({...portfolio, bio: e.target.value})} rows={6} className="w-full bg-soft rounded-xl px-4 py-3 text-sm resize-none" placeholder="Tell about yourself..."/>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center"><h2 className="font-medium">Projects</h2><button onClick={addProject} className="bg-ink text-cream px-3 py-1.5 rounded-lg text-sm">+ Add</button></div>
              {projects.length === 0 ? <div className="bg-white rounded-2xl p-8 text-center text-muted">No projects yet</div> : projects.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-muted">Project</span><button onClick={() => removeProject(p.id)} className="text-red-500 text-sm">Remove</button></div>
                  <input type="text" value={p.title} onChange={(e) => updateProject(p.id, 'title', e.target.value)} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Title"/>
                  <textarea value={p.description} onChange={(e) => updateProject(p.id, 'description', e.target.value)} rows={2} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm resize-none" placeholder="Description"/>
                  <input type="text" value={p.tags} onChange={(e) => updateProject(p.id, 'tags', e.target.value)} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="React, Node.js"/>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h2 className="font-medium">Contact</h2>
              <input type="email" value={portfolio.email} onChange={(e) => setPortfolio({...portfolio, email: e.target.value})} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Email"/>
              <input type="url" value={portfolio.linkedin} onChange={(e) => setPortfolio({...portfolio, linkedin: e.target.value})} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="LinkedIn URL"/>
              <input type="url" value={portfolio.github} onChange={(e) => setPortfolio({...portfolio, github: e.target.value})} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="GitHub URL"/>
            </div>
          )}
        </div>

        <div className="w-1/2 bg-white border-l border-soft p-6 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
          <h3 className="text-sm font-medium text-muted mb-4">Preview</h3>
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <div className="p-12 text-center border-b-4 border-accent">
              <h1 className="text-3xl font-bold mb-2">{portfolio.name || 'Your Name'}</h1>
              <p className="text-lg text-muted">{portfolio.title || 'Your Title'}</p>
            </div>
            {portfolio.bio && <div className="p-8"><h2 className="font-bold text-accent mb-3">About</h2><p className="text-sm text-muted">{portfolio.bio}</p></div>}
            {projects.length > 0 && (
              <div className="p-8">
                <h2 className="font-bold text-accent mb-4">Projects</h2>
                <div className="space-y-3">
                  {projects.map(p => (
                    <div key={p.id} className="p-4 bg-soft rounded-lg">
                      <h3 className="font-medium">{p.title || 'Project'}</h3>
                      <p className="text-xs text-muted mt-1">{p.description}</p>
                      {p.tags && <div className="flex gap-1 mt-2 flex-wrap">{p.tags.split(',').map((t, i) => <span key={i} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">{t.trim()}</span>)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-8 text-center text-sm text-muted">{portfolio.email || 'your@email.com'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
