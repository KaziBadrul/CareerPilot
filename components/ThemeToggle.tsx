'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark'

const THEME_CHANGE_EVENT = 'careerpilot-theme-change'

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light')

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem('theme', nextTheme)
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 10000,
        width: '44px',
        height: '44px',
        borderRadius: '999px',
        border: '1px solid var(--border-2)',
        background: 'var(--surface-2)',
        color: 'var(--white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'var(--shadow)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = 'rgba(37,99,235,0.45)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border-2)'
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
