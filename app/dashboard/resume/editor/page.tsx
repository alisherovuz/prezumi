'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Experience { id: string; title: string; company: string; startDate: string; endDate: string; description: string }
interface Education { id: string; degree: string; field: string; institution: string; year: string }

// Template styles configuration
const templateStyles = {
  classic: {
    name: 'Classic',
    font: 'Georgia, serif',
    headerAlign: 'center',
    headerBg: 'transparent',
    headerColor: '#1a1a1a',
    accentColor: '#1a1a1a',
    borderStyle: '2px solid #1a1a1a',
    sectionStyle: 'border-bottom'
  },
  modern: {
    name: 'Modern',
    font: 'system-ui, -apple-system, sans-serif',
    headerAlign: 'left',
    headerBg: '#2563eb',
    headerColor: '#ffffff',
    accentColor: '#2563eb',
    borderStyle: 'none',
    sectionStyle: 'colored-title'
  },
  minimal: {
    name: 'Minimal',
    font: 'Inter, system-ui, sans-serif',
    headerAlign: 'left',
    headerBg: 'transparent',
    headerColor: '#374151',
    accentColor: '#6b7280',
    borderStyle: '1px solid #e5e7eb',
    sectionStyle: 'simple'
  },
  professional: {
    name: 'Professional',
    font: 'Cambria, Georgia, serif',
    headerAlign: 'center',
    headerBg: '#1e293b',
    headerColor: '#ffffff',
    accentColor: '#0891b2',
    borderStyle: 'none',
    sectionStyle: 'uppercase-title'
  }
}

export default function ResumeEditorPage() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('id')
  
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('personal')
  const [template, setTemplate] = useState<keyof typeof templateStyles>('classic')
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '', lastName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', website: ''
  })
  const [summary, setSummary] = useState('')
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState('')

  useEffect(() => { if (resumeId) loadResume(resumeId) }, [resumeId])

  const loadResume = async (id: string) => {
    try {
      const { data } = await supabase.from('resumes').select('*').eq('id', id).single()
      if (data) {
        setTemplate((data.template as keyof typeof templateStyles) || 'classic')
        setPersonalInfo(data.personal_info || {})
        setSummary(data.summary || '')
        setExperience(data.experience || [])
        setEducation(data.education || [])
        setSkills(data.skills || '')
      }
    } catch (e) { console.error(e) }
  }

  const addExperience = () => setExperience([...experience, { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' }])
  const removeExperience = (id: string) => setExperience(experience.filter(e => e.id !== id))
  const updateExperience = (id: string, field: string, value: string) => setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e))
  
  const addEducation = () => setEducation([...education, { id: Date.now().toString(), degree: '', field: '', institution: '', year: '' }])
  const removeEducation = (id: string) => setEducation(education.filter(e => e.id !== id))
  const updateEducation = (id: string, field: string, value: string) => setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e))

  const generateWithAI = async (type: string, context?: any) => {
    if (!personalInfo.jobTitle) return alert('Add job title first')
    setGenerating(type)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context: { jobTitle: personalInfo.jobTitle, ...context } })
      })
      const data = await res.json()
      if (data.success) {
        if (type === 'summary') setSummary(data.content)
        else if (type === 'skills') setSkills(data.content)
        else if (type === 'experience' && context?.expId) updateExperience(context.expId, 'description', data.content)
      } else alert(data.error || 'Failed')
    } catch { alert('Error') }
    finally { setGenerating(null) }
  }

  const saveResume = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      const resumeData = {
        user_id: user.id, title: `${personalInfo.firstName} ${personalInfo.lastName} Resume`.trim() || 'Untitled',
        template, personal_info: personalInfo, summary, experience, education, skills, updated_at: new Date().toISOString()
      }
      if (resumeId) await supabase.from('resumes').update(resumeData).eq('id', resumeId)
      else await supabase.from('resumes').insert(resumeData)
      alert('Saved!')
    } catch (e: any) { alert(e.message || 'Failed') }
    finally { setSaving(false) }
  }

  const downloadPDF = () => {
    const w = window.open('', '_blank')
    if (!w) return alert('Allow popups')
    const style = templateStyles[template]
    
    const css = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: ${style.font}; line-height: 1.6; color: #333; }
      .page { max-width: 800px; margin: 0 auto; padding: 40px; }
      .header { text-align: ${style.headerAlign}; padding: 30px; margin: -40px -40px 30px -40px;
        background: ${style.headerBg}; color: ${style.headerColor}; }
      .name { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
      .title { font-size: 18px; opacity: 0.9; margin-bottom: 10px; }
      .contact { font-size: 13px; opacity: 0.8; }
      .contact span { margin: 0 8px; }
      .section { margin-bottom: 25px; }
      .section-title { font-size: 14px; font-weight: bold; color: ${style.accentColor}; margin-bottom: 12px;
        ${style.sectionStyle === 'border-bottom' ? 'border-bottom: 1px solid #ddd; padding-bottom: 5px;' : ''}
        ${style.sectionStyle === 'uppercase-title' ? 'text-transform: uppercase; letter-spacing: 2px;' : ''}
        ${style.sectionStyle === 'colored-title' ? `background: ${style.accentColor}10; padding: 8px 12px; border-radius: 4px;` : ''} }
      .item { margin-bottom: 18px; }
      .item-header { display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 5px; }
      .item-title { font-weight: bold; font-size: 15px; }
      .item-sub { color: #666; }
      .item-date { font-size: 13px; color: #888; }
      .item-desc { font-size: 14px; white-space: pre-line; margin-top: 8px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .skill-tag { background: ${style.accentColor}15; color: ${style.accentColor}; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
      ${template === 'minimal' ? '.section-title { font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; }' : ''}
      @media print { body { padding: 0; } .page { padding: 20px; } .header { margin: -20px -20px 20px -20px; } }
    `
    
    const html = `<!DOCTYPE html><html><head><title>Resume</title><style>${css}</style></head><body><div class="page">
      <div class="header">
        <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
        ${personalInfo.jobTitle ? `<div class="title">${personalInfo.jobTitle}</div>` : ''}
        <div class="contact">${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).map(c => `<span>${c}</span>`).join('')}</div>
      </div>
      ${summary ? `<div class="section"><div class="section-title">Professional Summary</div><p style="font-size:14px">${summary}</p></div>` : ''}
      ${experience.length ? `<div class="section"><div class="section-title">Experience</div>
        ${experience.map(e => `<div class="item"><div class="item-header"><div><span class="item-title">${e.title}</span> <span class="item-sub">at ${e.company}</span></div><span class="item-date">${e.startDate} – ${e.endDate}</span></div>${e.description ? `<div class="item-desc">${e.description}</div>` : ''}</div>`).join('')}</div>` : ''}
      ${education.length ? `<div class="section"><div class="section-title">Education</div>
        ${education.map(e => `<div class="item"><div class="item-header"><div><span class="item-title">${e.degree}${e.field ? ` in ${e.field}` : ''}</span> <span class="item-sub">– ${e.institution}</span></div><span class="item-date">${e.year}</span></div></div>`).join('')}</div>` : ''}
      ${skills ? `<div class="section"><div class="section-title">Skills</div><div class="skills-list">${skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</div></div>` : ''}
    </div></body></html>`
    
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 300)
  }

  const style = templateStyles[template]

  // Preview styles based on template
  const getPreviewStyles = () => {
    switch(template) {
      case 'modern':
        return { header: 'bg-blue-600 text-white p-6 -mx-8 -mt-8 mb-6', title: 'text-blue-600 font-semibold', skillBg: 'bg-blue-100 text-blue-700' }
      case 'minimal':
        return { header: 'border-b pb-4 mb-6', title: 'text-gray-400 text-xs uppercase tracking-wider', skillBg: 'bg-gray-100 text-gray-600' }
      case 'professional':
        return { header: 'bg-slate-800 text-white p-6 -mx-8 -mt-8 mb-6', title: 'text-cyan-600 font-bold uppercase tracking-widest text-xs', skillBg: 'bg-cyan-100 text-cyan-700' }
      default: // classic
        return { header: 'text-center border-b-2 border-gray-800 pb-6 mb-6', title: 'font-semibold border-b pb-1 mb-3', skillBg: 'bg-gray-200 text-gray-700' }
    }
  }
  const previewStyle = getPreviewStyles()

  return (
    <div className="min-h-screen bg-soft">
      <header className="bg-white border-b border-soft px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="font-medium">Resume Editor</h1>
        </div>
        <div className="flex items-center gap-3">
          <select value={template} onChange={e => setTemplate(e.target.value as keyof typeof templateStyles)} className="bg-soft rounded-lg px-3 py-2 text-sm border-none">
            <option value="classic">📄 Classic</option>
            <option value="modern">🎨 Modern</option>
            <option value="minimal">✨ Minimal</option>
            <option value="professional">💼 Professional</option>
          </select>
          <button onClick={saveResume} disabled={saving} className="px-4 py-2 border border-soft rounded-lg text-sm font-medium hover:bg-soft disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          <button onClick={downloadPDF} className="flex items-center gap-2 bg-ink text-cream px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>PDF
          </button>
        </div>
      </header>

      <div className="flex">
        <div className="w-1/2 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
          <div className="flex gap-2 mb-6 flex-wrap">
            {[{id:'personal',icon:'👤'},{id:'summary',icon:'📝'},{id:'experience',icon:'💼'},{id:'education',icon:'🎓'},{id:'skills',icon:'⚡'}].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm capitalize ${activeTab === t.id ? 'bg-ink text-cream' : 'bg-white text-muted'}`}>{t.icon} {t.id}</button>
            ))}
          </div>

          {activeTab === 'personal' && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h2 className="font-medium text-lg">Personal Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <input value={personalInfo.firstName} onChange={e => setPersonalInfo({...personalInfo, firstName: e.target.value})} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="First Name"/>
                <input value={personalInfo.lastName} onChange={e => setPersonalInfo({...personalInfo, lastName: e.target.value})} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Last Name"/>
              </div>
              <input value={personalInfo.jobTitle} onChange={e => setPersonalInfo({...personalInfo, jobTitle: e.target.value})} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Job Title (important for AI)"/>
              <div className="grid grid-cols-2 gap-4">
                <input type="email" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Email"/>
                <input value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Phone"/>
              </div>
              <input value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} className="w-full bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Location"/>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between mb-4"><h2 className="font-medium">Summary</h2><button onClick={() => generateWithAI('summary')} disabled={!!generating} className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50">{generating === 'summary' ? '...' : '✨ Generate'}</button></div>
              <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={6} className="w-full bg-soft rounded-xl px-4 py-3 text-sm resize-none" placeholder="Professional summary..."/>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="font-medium">Experience</h2><button onClick={addExperience} className="bg-ink text-cream px-3 py-1.5 rounded-lg text-sm">+ Add</button></div>
              {experience.length === 0 ? <div className="bg-white rounded-2xl p-8 text-center text-muted">No experience yet</div> : experience.map((e, i) => (
                <div key={e.id} className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between"><span className="text-sm text-muted">#{i+1}</span><button onClick={() => removeExperience(e.id)} className="text-red-500 text-sm">Remove</button></div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={e.title} onChange={ev => updateExperience(e.id, 'title', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Title"/>
                    <input value={e.company} onChange={ev => updateExperience(e.id, 'company', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Company"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={e.startDate} onChange={ev => updateExperience(e.id, 'startDate', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Start (Jan 2020)"/>
                    <input value={e.endDate} onChange={ev => updateExperience(e.id, 'endDate', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="End (Present)"/>
                  </div>
                  <div className="flex justify-between"><span className="text-sm">Description</span><button onClick={() => generateWithAI('experience', {expId: e.id, title: e.title})} disabled={!!generating} className="text-accent text-xs disabled:opacity-50">{generating ? '...' : '✨ AI'}</button></div>
                  <textarea value={e.description} onChange={ev => updateExperience(e.id, 'description', ev.target.value)} rows={3} className="w-full bg-soft rounded-xl px-4 py-3 text-sm resize-none" placeholder="• Led team of 5 engineers..."/>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between"><h2 className="font-medium">Education</h2><button onClick={addEducation} className="bg-ink text-cream px-3 py-1.5 rounded-lg text-sm">+ Add</button></div>
              {education.length === 0 ? <div className="bg-white rounded-2xl p-8 text-center text-muted">No education yet</div> : education.map((e, i) => (
                <div key={e.id} className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between"><span className="text-sm text-muted">#{i+1}</span><button onClick={() => removeEducation(e.id)} className="text-red-500 text-sm">Remove</button></div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={e.degree} onChange={ev => updateEducation(e.id, 'degree', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Degree"/>
                    <input value={e.field} onChange={ev => updateEducation(e.id, 'field', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="Field"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={e.institution} onChange={ev => updateEducation(e.id, 'institution', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="University"/>
                    <input value={e.year} onChange={ev => updateEducation(e.id, 'year', ev.target.value)} className="bg-soft rounded-xl px-4 py-2.5 text-sm" placeholder="2020"/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between mb-4"><h2 className="font-medium">Skills</h2><button onClick={() => generateWithAI('skills')} disabled={!!generating} className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50">{generating === 'skills' ? '...' : '✨ Suggest'}</button></div>
              <textarea value={skills} onChange={e => setSkills(e.target.value)} rows={4} className="w-full bg-soft rounded-xl px-4 py-3 text-sm resize-none" placeholder="React, Node.js, TypeScript, Python..."/>
              <p className="text-xs text-muted mt-2">Separate with commas</p>
            </div>
          )}
        </div>

        {/* Live Preview - changes based on template */}
        <div className="w-1/2 bg-white border-l border-soft p-6 overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-muted">Preview</h3>
            <span className="text-xs bg-soft px-2 py-1 rounded">{style.name}</span>
          </div>
          
          <div className="border border-soft rounded-xl p-8 min-h-[700px] overflow-hidden" style={{ fontFamily: style.font }}>
            {/* Header - different per template */}
            <div className={previewStyle.header} style={template === 'modern' || template === 'professional' ? { marginLeft: '-2rem', marginRight: '-2rem', marginTop: '-2rem', padding: '1.5rem 2rem' } : {}}>
              <h1 className={`text-2xl font-bold ${template === 'minimal' ? 'text-gray-800' : ''}`}>{personalInfo.firstName || 'Your'} {personalInfo.lastName || 'Name'}</h1>
              {personalInfo.jobTitle && <p className={`mt-1 ${template === 'modern' || template === 'professional' ? 'opacity-90' : 'text-gray-600'}`}>{personalInfo.jobTitle}</p>}
              <div className={`text-sm mt-2 ${template === 'modern' || template === 'professional' ? 'opacity-80' : 'text-gray-500'}`}>
                {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' • ')}
              </div>
            </div>

            {summary && (
              <div className="mb-6">
                <h2 className={`text-sm mb-2 ${previewStyle.title}`}>Summary</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div className="mb-6">
                <h2 className={`text-sm mb-3 ${previewStyle.title}`}>Experience</h2>
                {experience.map(e => (
                  <div key={e.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold">{e.title || 'Position'}</span>
                        <span className="text-gray-500"> at {e.company || 'Company'}</span>
                      </div>
                      <span className="text-xs text-gray-400">{e.startDate} – {e.endDate}</span>
                    </div>
                    {e.description && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{e.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div className="mb-6">
                <h2 className={`text-sm mb-3 ${previewStyle.title}`}>Education</h2>
                {education.map(e => (
                  <div key={e.id} className="mb-3 flex justify-between">
                    <div>
                      <span className="font-semibold">{e.degree}{e.field && ` in ${e.field}`}</span>
                      <span className="text-gray-500"> – {e.institution}</span>
                    </div>
                    <span className="text-xs text-gray-400">{e.year}</span>
                  </div>
                ))}
              </div>
            )}

            {skills && (
              <div>
                <h2 className={`text-sm mb-3 ${previewStyle.title}`}>Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.split(',').map((s, i) => (
                    <span key={i} className={`text-xs px-3 py-1 rounded-full ${previewStyle.skillBg}`}>{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {!summary && !experience.length && !education.length && !skills && (
              <div className="text-center text-gray-400 py-16">
                <p className="text-lg mb-2">Start adding your info</p>
                <p className="text-sm">Switch templates to see different styles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
