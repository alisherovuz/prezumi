import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-cream/80 backdrop-blur-md border-b border-soft">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl tracking-tight">
            Prezumi<span className="text-accent">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-muted hover:text-ink transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm text-muted hover:text-ink transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-accent transition-colors">Log in</Link>
            <Link href="/get-started" className="bg-ink text-cream px-4 py-2 rounded-full text-sm font-medium hover:bg-accent transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-soft px-4 py-2 rounded-full text-sm mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            AI-Powered Resume Builder
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight">
            Your career story,<br />
            <span className="italic">beautifully told</span>
          </h1>
          
          <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
            Create stunning resumes, compelling cover letters, and professional portfolios 
            with the help of AI. Stand out from the crowd and land your dream job.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-started" className="w-full sm:w-auto bg-ink text-cream px-8 py-4 rounded-full text-sm font-medium hover:bg-accent transition-all hover:scale-105">
              Create Your Resume — Free
            </Link>
            <Link href="/features" className="w-full sm:w-auto border border-ink px-8 py-4 rounded-full text-sm font-medium hover:bg-ink hover:text-cream transition-colors">
              See How It Works
            </Link>
          </div>
          
          <p className="text-xs text-muted mt-6">No credit card required • Free forever for basic use</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-16">
            Everything you need to <span className="italic">get hired</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Resume Builder */}
            <div className="bg-cream rounded-3xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Resume Builder</h3>
              <p className="text-sm text-muted">AI-powered content generation with ATS-optimized templates</p>
            </div>

            {/* Cover Letter */}
            <div className="bg-cream rounded-3xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Cover Letters</h3>
              <p className="text-sm text-muted">Generate tailored cover letters for each job application</p>
            </div>

            {/* LinkedIn */}
            <div className="bg-cream rounded-3xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">LinkedIn Optimizer</h3>
              <p className="text-sm text-muted">Optimize your profile for maximum visibility</p>
            </div>

            {/* Portfolio */}
            <div className="bg-cream rounded-3xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Portfolio Website</h3>
              <p className="text-sm text-muted">Create a stunning personal website in minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted text-center mb-16">Start free, upgrade when you need more</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-soft">
              <h3 className="font-medium text-lg mb-2">Free</h3>
              <p className="text-muted text-sm mb-6">Perfect to get started</p>
              <p className="text-4xl font-medium mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1 Resume
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1 Cover Letter
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic Templates
                </li>
              </ul>
              <Link href="/get-started" className="block text-center py-3 border border-ink rounded-full text-sm font-medium hover:bg-ink hover:text-cream transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-ink text-cream rounded-3xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="font-medium text-lg mb-2">Pro</h3>
              <p className="text-cream/60 text-sm mb-6">For serious job seekers</p>
              <p className="text-4xl font-medium mb-6">$9<span className="text-lg font-normal text-cream/60">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited Resumes
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited Cover Letters
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Templates
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  LinkedIn Optimizer
                </li>
              </ul>
              <Link href="/get-started" className="block text-center py-3 bg-accent rounded-full text-sm font-medium hover:bg-white hover:text-ink transition-colors">
                Start Pro Trial
              </Link>
            </div>

            {/* Lifetime */}
            <div className="bg-white rounded-3xl p-8 border border-soft">
              <h3 className="font-medium text-lg mb-2">Lifetime</h3>
              <p className="text-muted text-sm mb-6">Pay once, use forever</p>
              <p className="text-4xl font-medium mb-6">$49</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Portfolio Website
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom Domain
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority Support
                </li>
              </ul>
              <Link href="/get-started" className="block text-center py-3 border border-ink rounded-full text-sm font-medium hover:bg-ink hover:text-cream transition-colors">
                Get Lifetime Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-ink text-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl mb-6">
            Ready to land your <span className="italic">dream job?</span>
          </h2>
          <p className="text-cream/60 mb-10">
            Join thousands of professionals who have already upgraded their career materials with Prezumi.
          </p>
          <Link href="/get-started" className="inline-block bg-accent text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white hover:text-ink transition-colors">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-soft">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted">© 2024 Prezumi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted hover:text-ink">Privacy</Link>
            <Link href="/terms" className="text-sm text-muted hover:text-ink">Terms</Link>
            <Link href="mailto:support@prezumi.ai" className="text-sm text-muted hover:text-ink">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
