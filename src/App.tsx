import { useState, useEffect } from 'react'
import ConverterCard from './components/ConverterCard'
import { useConverter } from './hooks/useConverter'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2.93" y1="2.93" x2="4.34" y2="4.34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="11.66" y1="11.66" x2="13.07" y2="13.07" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2.93" y1="13.07" x2="4.34" y2="11.66" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="11.66" y1="4.34" x2="13.07" y2="2.93" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 10.5A6 6 0 015.5 2.5a6 6 0 108 8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getInitialPair(): { from: string; to: string } {
  const params = new URLSearchParams(window.location.search)
  return {
    from: params.get('from') ?? 'usd',
    to: params.get('to') ?? 'ghs',
  }
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { from, to } = getInitialPair()
  const converter = useConverter(from, to)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-edge/70 bg-panel/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white text-sm font-bold shadow-sm shadow-teal/25 select-none">
              ₵
            </div>
            <span className="text-sm font-bold text-fore">GHS FX</span>
            <span className="hidden rounded-full bg-teal-soft px-2 py-0.5 text-xs font-semibold text-teal-dark sm:block">
              Ghana Cedi Focus
            </span>
          </div>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-edge bg-raised text-fore-3 transition-colors hover:border-teal/40 hover:text-teal"
            title="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-edge/40 bg-gradient-to-b from-teal/5 to-transparent py-8 text-center">
        <h2 className="text-2xl font-bold text-fore sm:text-3xl">
          Live Currency Converter
        </h2>
        <p className="mt-1.5 text-sm text-fore-3">
          Real-time rates · 15+ currencies · Ghana Cedi always available
        </p>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <ConverterCard {...converter} />
      </main>

      {/* Footer */}
      <footer className="border-t border-edge/50 py-6 text-center">
        <p className="text-xs text-fore-3">
          Rates from{' '}
          <a
            href="https://github.com/fawazahmed0/exchange-api"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal hover:underline"
          >
            fawazahmed0/exchange-api
          </a>
          {' '}· Refreshed every hour · Estimate only
        </p>
      </footer>
    </div>
  )
}
