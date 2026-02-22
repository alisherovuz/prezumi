'use client'

import Link from 'next/link'
import { useState } from 'react'

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif font, centered header',
    headerBg: '#ffffff',
    headerColor: '#1a1a1a',
    accentColor: '#1a1a1a',
    free: true,
    popular: true
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold blue header, clean sans-serif',
    headerBg: '#2563eb',
    headerColor: '#ffffff',
    accentColor: '#2563eb',
    free: true
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Lots of whitespace, subtle styling',
    headerBg: '#ffffff',
    headerColor: '#374151',
    accentColor: '#9ca3af',
    free: true
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Dark header, corporate look',
    headerBg: '#1e293b',
    headerColor: '#ffffff',
    accentColor: '#0891b2',
    free: true
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful accents, unique layout',
    headerBg: '#7c3aed',
    headerColor: '#ffffff',
    accentColor: '#7c3aed',
    pro: true
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant design for senior roles',
    headerBg: '#0f172a',
    headerColor: '#fbbf24',
    accentColor: '#fbbf24',
    pro: true
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern design for developers',
    headerBg: '#059669',
    headerColor: '#ffffff',
    accentColor: '#059669',
    pro: true
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined',
    headerBg: '#be185d',
    headerColor: '#ffffff',
    accentColor: '#be185d',
    pro: true
  }
]

export default function TemplatesPage() {
  const [selected, setSelected] = useState('classic')
  const [showUpgrade, setShowUpgrade] = useState(false)

  const handleSelect = (t: typeof templates[0]) => {
    if (t.pro) { setShowUpgrade(true); return }
    setSelected(t.id)
  }

  return (
    <div className="min-h-screen bg-cream">
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-2xl font-medium mb-2">Premium Template</h2>
              <p className="text-muted mb-6">Upgrade to Pro to unlock all templates</p>
              <div className="flex gap-3">
                <button onClick={() => setShowUpgrade(false)} className="flex-1 py-3 border border-soft rounded-xl text-sm font-medium">Later</button>
                <Link href="/#pricing" className="flex-1 bg-accent text-white py-3 rounded-xl text-sm font-medium text-center">Upgrade $9/mo</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-soft px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
            <h1 className="font-medium">Choose Template</h1>
          </div>
          <Link href={`/dashboard/resume/editor?template=${selected}`} className="bg-ink text-cream px-5 py-2 rounded-xl text-sm font-medium hover:bg-accent">
            Continue with {templates.find(t => t.id === selected)?.name}
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-medium mb-2">Resume Templates</h2>
          <p className="text-muted">All templates are ATS-friendly. Each has a unique style.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all text-left group ${
                selected === t.id ? 'border-accent shadow-lg scale-[1.02]' : 'border-soft hover:border-gray-300'
              }`}
            >
              {/* Badges */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                {t.popular && <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">Popular</span>}
                {t.pro && <span className="bg-ink text-cream text-xs font-medium px-2 py-1 rounded-full">PRO</span>}
              </div>
              
              {/* Mini Preview */}
              <div className="aspect-[3/4] p-4 bg-gray-50">
                <div className="bg-white rounded-lg h-full shadow-sm overflow-hidden">
                  {/* Header preview */}
                  <div style={{ backgroundColor: t.headerBg, color: t.headerColor }} className="p-3 text-center">
                    <div className="h-2 rounded w-16 mx-auto mb-1" style={{ backgroundColor: t.headerColor, opacity: 0.9 }}></div>
                    <div className="h-1.5 rounded w-20 mx-auto" style={{ backgroundColor: t.headerColor, opacity: 0.5 }}></div>
                  </div>
                  {/* Content preview */}
                  <div className="p-3">
                    <div className="h-1.5 rounded w-12 mb-2" style={{ backgroundColor: t.accentColor }}></div>
                    <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6 mb-3"></div>
                    
                    <div className="h-1.5 rounded w-10 mb-2" style={{ backgroundColor: t.accentColor }}></div>
                    <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5 mb-3"></div>
                    
                    <div className="h-1.5 rounded w-8 mb-2" style={{ backgroundColor: t.accentColor }}></div>
                    <div className="flex gap-1 flex-wrap">
                      <div className="h-2 rounded-full w-8" style={{ backgroundColor: t.accentColor + '30' }}></div>
                      <div className="h-2 rounded-full w-6" style={{ backgroundColor: t.accentColor + '30' }}></div>
                      <div className="h-2 rounded-full w-10" style={{ backgroundColor: t.accentColor + '30' }}></div>
                    </div>
                  </div>
                </div>

                {t.pro && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">🔒 Pro</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-muted">{t.description}</p>
              </div>

              {/* Selected */}
              {selected === t.id && (
                <div className="absolute top-3 left-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Pro Banner */}
        <div className="mt-12 bg-gradient-to-r from-ink to-gray-800 text-cream rounded-3xl p-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-medium mb-2">Unlock All Templates</h3>
            <p className="text-cream/70">Plus LinkedIn Optimizer & Portfolio Website</p>
          </div>
          <Link href="/#pricing" className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 whitespace-nowrap">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  )
}
