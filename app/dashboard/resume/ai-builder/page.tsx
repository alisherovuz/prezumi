'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

const questions = [
  { id: 'jobTitle', question: "What's your desired job title?", placeholder: "e.g., Software Engineer" },
  { id: 'firstName', question: "What's your first name?", placeholder: "John" },
  { id: 'lastName', question: "And your last name?", placeholder: "Doe" },
  { id: 'email', question: "What's your email address?", placeholder: "john@example.com" },
  { id: 'experience', question: "Tell me about your work experience", placeholder: "I worked at Google as a Software Engineer for 3 years..." },
  { id: 'skills', question: "What are your key skills?", placeholder: "React, Node.js, Python..." },
]

export default function AIBuilderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [input, setInput] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    getSupabase().auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = '/auth/login'; return }
      setLoading(false)
    })
  }, [])

  const currentQuestion = questions[step]
  const isComplete = step >= questions.length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setAnswers({ ...answers, [currentQuestion.id]: input })
    setInput('')
    setStep(step + 1)
  }

  const handleGenerate = () => {
    setGenerating(true)
    localStorage.setItem('aiResumeData', JSON.stringify(answers))
    router.push('/dashboard/resume/editor?fromAI=true')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-soft px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-ink"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="font-medium">AI Resume Builder</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted mb-2">
            <span>Step {Math.min(step + 1, questions.length)} of {questions.length}</span>
            <span>{Math.round((step / questions.length) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-soft rounded-full overflow-hidden"><div className="h-full bg-accent transition-all duration-300" style={{ width: `${(step / questions.length) * 100}%` }}/></div>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 min-h-[400px]">
          <div className="space-y-4 mb-6">
            {questions.slice(0, step).map((q) => (
              <div key={q.id}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                  </div>
                  <p className="text-sm text-muted">{q.question}</p>
                </div>
                <div className="ml-11 bg-soft rounded-xl px-4 py-2"><p className="text-sm">{answers[q.id]}</p></div>
              </div>
            ))}
          </div>

          {!isComplete && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              </div>
              <p className="text-sm text-muted">{currentQuestion.question}</p>
            </div>
          )}

          {isComplete && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 className="text-xl font-medium mb-2">All set!</h2>
              <p className="text-muted mb-6">Click below to generate your resume</p>
              <button onClick={handleGenerate} disabled={generating} className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50">
                {generating ? <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Creating...</> : '✨ Generate Resume'}
              </button>
            </div>
          )}
        </div>

        {!isComplete && (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={currentQuestion.placeholder} className="flex-1 bg-white border border-soft rounded-xl px-4 py-3 text-sm focus:border-accent focus:outline-none" autoFocus/>
            <button type="submit" disabled={!input.trim()} className="bg-ink text-cream px-6 py-3 rounded-xl text-sm font-medium hover:bg-accent disabled:opacity-50">Next</button>
          </form>
        )}
      </div>
    </div>
  )
}
