import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      colors: {
        navy: '#0A0A0A',
        blue: '#0047FF',
        cream: '#FFFEF0',
        green: '#C8FF00',
        orange: '#FF5500',
        mint: '#00CC88',
      },
      boxShadow: {
        'brutal': '4px 4px 0px #0A0A0A',
        'brutal-sm': '2px 2px 0px #0A0A0A',
        'brutal-lg': '8px 8px 0px #0A0A0A',
      },
      animation: {
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
