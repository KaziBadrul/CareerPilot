import type { Metadata } from 'next'
import { ThemeToggle } from '@/components/ThemeToggle'
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
    <html lang="en" className="grain" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.dataset.theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
              } catch (_) {
                document.documentElement.dataset.theme = 'light';
              }
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  )
}
