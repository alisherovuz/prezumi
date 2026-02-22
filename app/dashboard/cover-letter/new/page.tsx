'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function NewCoverLetterPage() {
  const searchParams = useSearchParams()
  const letterId = searchParams.get('id')
  
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [targetJob, setTargetJob] = useState('')
  const [company, setCompany] = useState('')
  const [hiringManager, setHiringManager] = useState('')
  const [yourName, setYourName] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [keySkills, setKeySkills] = useState('')
  const [experience, setExperience] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => { if (letterId) loadLetter(letterId) }, [letterId])

  const loadLetter = async (id: string) => {
    try {
      const { data } = await getSupabase().from('cover_letters').select('*').eq('id', id).single()
      if (data) {
        setTargetJob(data.job_title || '')
        setCompany(data.company_name || '')
        setContent(data.content || '')
      }
    } catch (e) { console.error(e) }
  }

  const generateWithAI = async () => {
    if (!targetJob || !company) return alert('Enter job title and company')
    setGenerating(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cover_letter', context: { targetJob, company, jobTitle: currentRole, skills: keySkills, experience } })
      })
      const data = await res.json()
      if (data.success) setContent(data.content)
      else alert(data.error || 'Failed')
    } catch { alert('Error') }
    finally { setGenerating(false) }
  }

  const saveLetter = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await getSupabase().auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      
      const letterData = {
        user_id: user.id,
        title: `${company} - ${targetJob}`,
        company_name: company,
        job_title: targetJob,
        content,
        updated_at: new Date().toISOString()
      }

      if (letterId) {
        await getSupabase().from('cover_letters').update(letterData).eq('id', letterId)
      } else {
        await getSupabase().from('cover_letters').insert(letterData)
      }
      alert('Saved!')
    } catch (e: any) { alert(e.message || 'Failed') }
    finally { setSaving(false) }
  }

  const downloadPDF = () => {
    const w = window.open('', '_blank')
    if (!w) return alert('Allow popups')
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    w.document.write(`<!DOCTYPE html><html><head><title>Cover Letter</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;line-height:1.8;padding:60px;max-width:700px;margin:0 auto;color:#333}.date{color:#666;margin-bottom:30px}.recipient{margin-bottom:30px}.recipient p{margin-bottom:3px}.greeting{margin-bottom:20px}.content p{margin-bottom:15px;text-align:justify}.closing{margin-top:30px}.signature{margin-top:40px;font-weight:bold}</style></head><body><div class="date">${today}</div><div class="recipient"><p>${hiringManager || 'Hiring Manager'}</p><p>${company}</p></div><p class="greeting">Dear ${hiringManager || 'Hiring Manager'},</p><div class="content">${content.split('\n\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')}</div><div class="closing"><p>Sincerely,</p><p class="signature">${yourName || 'Your Name'}</p></div></body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 300)
  }

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-soft">
      <header className="bg-white border-b border-soft px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cover-letters" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="font-medium">Cover Letter</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={downloadPDF} disabled={!content} className="px-4 py-2 border border-soft rounded-lg text-sm font-medium hover:bg-soft disabled:opacity-50">Download</button>
          <button onClick={saveLetter} disabled={saving || !content} className="bg-ink text-cream px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </header>

      <div className="flex">
        <div className="w-1/2 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
          <div className="max-w-lg mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h2 className="font-medium">Job Details</h2>
              <input value={targetJob} onChange={e => setTargetJob(e.target.value)} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Job Title"/>
              <input value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Company Name"/>
              <input value={hiringManager} onChange={e => setHiringManager(e.target.value)} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Hiring Manager (optional)"/>
            </div>

            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h2 className="font-medium">Your Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <input value={yourName} onChange={e => setYourName(e.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Your Name"/>
                <input value={currentRole} onChange={e => setCurrentRole(e.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Current Role"/>
              </div>
              <input value={keySkills} onChange={e => setKeySkills(e.target.value)} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Key Skills"/>
              <textarea value={experience} onChange={e => setExperience(e.target.value)} rows={2} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm resize-none" placeholder="Experience highlights..."/>
            </div>

            <button onClick={generateWithAI} disabled={generating} className="w-full flex items-center justify-center gap-2 bg-accent text-white py-4 rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50">
              {generating ? 'Generating...' : '✨ Generate with AI'}
            </button>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between mb-4"><h2 className="font-medium">Content</h2><span className="text-xs text-muted">{content.split(/\s+/).filter(Boolean).length} words</span></div>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={12} className="w-full bg-soft rounded-xl px-4 py-3 text-sm resize-none" placeholder="Write or generate your cover letter..."/>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-white border-l border-soft p-6 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
          <h3 className="text-sm font-medium text-muted mb-4">Preview</h3>
          <div className="border border-soft rounded-xl p-8 min-h-[600px]" style={{ fontFamily: 'Georgia, serif', lineHeight: 1.8 }}>
            <p className="text-sm text-gray-500 mb-6">{today}</p>
            <div className="mb-6"><p>{hiringManager || 'Hiring Manager'}</p><p className="text-gray-600">{company || 'Company Name'}</p></div>
            <p className="mb-4">Dear {hiringManager || 'Hiring Manager'},</p>
            <div className="space-y-4 text-gray-700 mb-6">
              {content ? content.split('\n\n').filter(p => p.trim()).map((p, i) => <p key={i}>{p}</p>) : <p className="text-gray-400 italic">Your letter preview...</p>}
            </div>
            <div className="mt-8"><p className="mb-4">Sincerely,</p><p className="font-medium">{yourName || 'Your Name'}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
