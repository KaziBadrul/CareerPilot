import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareerPilot — Your Agentic Career Co-pilot',
  description: 'AI platform that hunts jobs, scores your fit, drafts your applications, and builds your learning roadmap.',
  openGraph: {
    title: 'CareerPilot',
    description: 'Your agentic career co-pilot powered by AI',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="grain">
      <body>{children}</body>
    </html>
  )
}
