import Link from 'next/link'

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-4xl">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-ink mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl mb-4">Choose your path</h1>
          <p className="text-muted">How would you like to create your resume?</p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Templates */}
          <Link
            href="/auth/register?method=templates"
            className="group bg-white rounded-3xl p-8 border-2 border-soft hover:border-accent transition-all"
          >
            <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
              <svg className="w-8 h-8 text-ink group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h2 className="font-medium text-xl mb-2">Start with Templates</h2>
            <p className="text-muted text-sm mb-4">
              Choose from our collection of professional, ATS-optimized templates and customize them your way.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                8+ professional templates
              </li>
              <li className="flex items-center gap-2 text-muted">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full control over design
              </li>
              <li className="flex items-center gap-2 text-muted">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Best for: Experienced professionals
              </li>
            </ul>
          </Link>

          {/* AI Builder */}
          <Link
            href="/auth/register?method=ai"
            className="group bg-ink text-cream rounded-3xl p-8 border-2 border-ink hover:bg-accent hover:border-accent transition-all relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
              Recommended
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h2 className="font-medium text-xl mb-2">AI Resume Builder</h2>
            <p className="text-cream/70 text-sm mb-4">
              Let AI guide you through the process and generate professional content based on your experience.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-cream/70">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                AI-generated content
              </li>
              <li className="flex items-center gap-2 text-cream/70">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Step-by-step guidance
              </li>
              <li className="flex items-center gap-2 text-cream/70">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Best for: First-time users
              </li>
            </ul>
          </Link>
        </div>
      </div>
    </div>
  )
}
