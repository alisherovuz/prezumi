import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prezumi — AI Resume Builder',
  description: 'Create professional resumes, cover letters, and portfolios with AI assistance.',
  keywords: 'resume builder, AI resume, cover letter, portfolio, job application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink">{children}</body>
    </html>
  )
}
