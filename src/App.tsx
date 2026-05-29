import { useState, useEffect } from 'react'
import ConverterCard from './components/ConverterCard'
import { useConverter } from './hooks/useConverter'
import { SUPPORTED_CURRENCIES } from './components/CurrencySelect'
import { getCurrencyFlag, getCurrencyName } from './lib/currency'

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

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-fore/40 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-edge bg-panel shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-edge bg-panel px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal text-white shadow-md shadow-teal/25">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <line x1="8" y1="7" x2="8" y2="11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="4.8" r="0.8" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-fore">About GHS FX</h2>
              <p className="text-xs text-fore-3">Live Ghana Cedi Converter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-edge text-fore-3 transition-colors hover:border-teal/40 hover:text-teal"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1.5" y1="1.5" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="10.5" y1="1.5" x2="1.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* What it does */}
          <div>
            <h3 className="mb-2 text-sm font-bold text-fore">What This Tool Does</h3>
            <p className="text-sm leading-relaxed text-fore-2">
              GHS FX converts any amount between the{' '}
              <span className="font-semibold text-teal">Ghana Cedi (GHS)</span> and 15+ global
              currencies using live exchange rates. Rates update automatically every hour and
              whenever you switch back to the tab.
            </p>
          </div>

          {/* How rates work */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-fore">How Rates Are Fetched</h3>
            <ol className="flex flex-col gap-2">
              {[
                ['Live fetch', 'Rates are pulled from the free fawazahmed0/exchange-api on every page load.'],
                ['Automatic failover', 'If the primary CDN is unreachable, a fallback URL is tried before showing an error.'],
                ['1-hour cache', 'Successful responses are stored in your browser so the app works even if you go offline briefly.'],
                ['Auto-refresh', 'While the tab is open, rates silently refresh every hour. Switching back to the tab also triggers a check.'],
                ['Stale badge', 'If cached rates are being used instead of live ones, an amber "Cached" badge appears on the result.'],
              ].map(([step, desc], i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-fore-2">
                    <span className="font-semibold text-fore">{step}</span> - {desc}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Supported currencies */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-fore">Supported Currencies</h3>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {SUPPORTED_CURRENCIES.map(code => (
                <div
                  key={code}
                  className={[
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs',
                    code === 'GHS'
                      ? 'border-teal/30 bg-teal/10 font-semibold text-teal'
                      : 'border-edge bg-raised text-fore-2',
                  ].join(' ')}
                >
                  <span className="text-base leading-none">{getCurrencyFlag(code)}</span>
                  <span>{code}</span>
                  <span className="truncate text-fore-3">{getCurrencyName(code)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-teal/20 bg-teal-soft px-4 py-3">
            <p className="text-xs font-semibold text-teal-dark mb-1">Disclaimer</p>
            <p className="text-xs leading-relaxed text-fore-3">
              Rates are provided for reference only. Always confirm with your bank or a licensed
              financial institution before making any transactions.
            </p>
          </div>

          {/* Credits */}
          <div className="flex flex-col items-center gap-3 border-t border-edge pt-5 text-center">
            <p className="text-xs text-fore-3">
              Rate data from{' '}
              <a
                href="https://github.com/fawazahmed0/exchange-api"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal hover:underline"
              >
                fawazahmed0/exchange-api
              </a>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-fore-3">Built by</span>
              <span className="text-sm font-bold text-teal">MrrAmissah</span>
              <a
                href="https://www.linkedin.com/in/prince-kofi-frimpong-amissah/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-edge text-fore-3 transition-colors hover:border-teal/40 hover:text-teal"
                title="LinkedIn"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://github.com/MrrAmissah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-edge text-fore-3 transition-colors hover:border-teal/40 hover:text-teal"
                title="GitHub"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const [theme, setTheme]       = useState<'light' | 'dark'>('light')
  const [showAbout, setShowAbout] = useState(false)
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAbout(true)}
              className="flex h-8 items-center gap-1.5 rounded-full border border-edge bg-raised px-3 text-xs font-semibold text-fore-3 transition-colors hover:border-teal/40 hover:text-teal"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="6" y1="5.5" x2="6" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="6" cy="3.5" r="0.6" fill="currentColor" />
              </svg>
              About
            </button>
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-edge bg-raised text-fore-3 transition-colors hover:border-teal/40 hover:text-teal"
              title="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
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
      <main className="mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-8">
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

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  )
}
