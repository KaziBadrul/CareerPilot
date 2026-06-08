'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-body ${
        scrolled
          ? 'bg-navy border-b-[3px] border-black'
          : 'bg-transparent border-b-[3px] border-transparent'
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-[38px] h-[38px] bg-green border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0A0A0A] shrink-0">
            <Zap size={20} color="#0A0A0A" strokeWidth={3} />
          </div>
          <div className="leading-none">
            <div className="text-white text-[20px] font-black tracking-tight">
              CAREER
            </div>
            <div className="text-green text-[20px] font-black tracking-tight">
              PILOT
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted hover:text-white text-[13px] font-bold tracking-widest uppercase transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-muted hover:text-white text-[13px] font-bold tracking-widest uppercase transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-blue text-cream border-[3px] border-black px-6 py-2.5 text-[13px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] transition-all"
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden bg-transparent border-none text-white cursor-pointer p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} strokeWidth={3} color="#0A0A0A" className="dark:text-white" /> : <Menu size={28} strokeWidth={3} color="#0A0A0A" className="dark:text-white" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-2 border-t-[3px] border-black p-6">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-muted hover:text-white py-4 text-[15px] font-bold tracking-widest uppercase border-b-2 border-border-2"
            >
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-4 mt-8">
            <Link
              href="/login"
              className="text-white text-center p-4 border-[3px] border-black font-bold tracking-widest uppercase"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-blue text-cream text-center p-4 border-[3px] border-black font-black tracking-widest uppercase shadow-[4px_4px_0px_#0A0A0A]"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
