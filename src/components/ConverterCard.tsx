import { useRef } from 'react'
import CurrencySelect from './CurrencySelect'
import { formatRate, getCurrencyFlag } from '../lib/currency'
import type { Status, ConverterState } from '../hooks/useConverter'

interface Props extends ConverterState {
  setAmount: (v: string) => void
  setFrom: (v: string) => void
  setTo: (v: string) => void
  swap: () => void
  refresh: () => void
}

function Spinner() {
  return (
    <svg className="animate-spin text-teal" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function StatusBadge({ status, isStale, date, error, refresh }: {
  status: Status
  isStale: boolean
  date: string
  error: string | null
  refresh: () => void
}) {
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-xs text-fore-3">
        <Spinner />
        <span>Fetching live rates…</span>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-xs text-error">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L13 12H1L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="7" cy="10.5" r="0.7" fill="currentColor" />
        </svg>
        <span>{error}</span>
        <button onClick={refresh} className="ml-auto font-semibold underline underline-offset-2 hover:opacity-70">
          Retry
        </button>
      </div>
    )
  }
  if (isStale) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-warn">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 3v3.5L8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span>Cached · {date}</span>
      </div>
    )
  }
  if (status === 'success' && date) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-ok">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1" />
          <path d="M3.5 5.5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Live · {date}</span>
      </div>
    )
  }
  return null
}

export default function ConverterCard({
  amount, from, to, result, rate, date, status, error, isStale,
  setAmount, setFrom, setTo, swap, refresh,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const hasResult = result !== null && rate !== null && status !== 'loading'

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main card */}
      <div className="rounded-2xl border border-edge bg-panel shadow-xl shadow-slate/5">
        {/* Header */}
        <div className="border-b border-edge px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal text-white shadow-md shadow-teal/25">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10h14M3 10l3.5-3.5M3 10l3.5 3.5M17 10l-3.5-3.5M17 10l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-fore">GHS FX Converter</h1>
              <p className="text-xs text-fore-3">Live rates · Ghana Cedi focus</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6">
          {/* Amount input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-fore-3">
              Amount
            </label>
            <input
              id="amount"
              ref={inputRef}
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className={[
                'w-full rounded-xl border border-edge bg-canvas px-4 py-3.5',
                'text-2xl font-bold tabular-nums text-fore placeholder:text-fore-3',
                'outline-none shadow-sm transition-all',
                'focus:border-teal/60 focus:ring-2 focus:ring-teal/15 focus:bg-panel',
              ].join(' ')}
            />
          </div>

          {/* Currency selectors with swap */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <CurrencySelect id="from" label="From" value={from.toUpperCase()} onChange={setFrom} />

            <button
              onClick={swap}
              title="Swap currencies"
              className={[
                'mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center',
                'rounded-full border border-edge bg-raised text-fore-2 shadow-sm',
                'transition-all hover:border-teal/40 hover:bg-teal-soft hover:text-teal',
                'active:scale-95',
              ].join(' ')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <CurrencySelect id="to" label="To" value={to.toUpperCase()} onChange={setTo} />
          </div>

          {/* Status row */}
          <StatusBadge status={status} isStale={isStale} date={date} error={error} refresh={refresh} />

          {/* Result */}
          {hasResult && (
            <div className="rounded-xl border border-teal/20 bg-teal-soft px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-teal-dark">Converted amount</p>
                {date && (
                  <span className={[
                    'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                    isStale
                      ? 'bg-warn/10 text-warn'
                      : 'bg-ok/10 text-ok',
                  ].join(' ')}>
                    <span className={[
                      'h-1.5 w-1.5 rounded-full',
                      isStale ? 'bg-warn' : 'bg-ok',
                    ].join(' ')} />
                    {isStale ? 'Cached' : 'Live'} · {date}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold tabular-nums text-fore">
                {getCurrencyFlag(to)}{' '}
                {result!.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {' '}<span className="text-lg text-fore-2">{to.toUpperCase()}</span>
              </p>
              {rate !== null && (
                <p className="mt-2 text-xs text-fore-3">
                  {formatRate(from, to, rate)}
                </p>
              )}
            </div>
          )}

          {status === 'loading' && !hasResult && (
            <div className="flex h-20 items-center justify-center rounded-xl border border-edge bg-raised">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      {/* Popular pairs */}
      {status === 'success' && (
        <QuickPairs from={from} />
      )}
    </div>
  )
}

function QuickPairs({ from }: { from: string }) {
  const pairs = [
    { from: 'usd', to: 'ghs', label: 'USD → GHS' },
    { from: 'eur', to: 'ghs', label: 'EUR → GHS' },
    { from: 'gbp', to: 'ghs', label: 'GBP → GHS' },
    { from: 'ngn', to: 'ghs', label: 'NGN → GHS' },
    { from: 'cad', to: 'ghs', label: 'CAD → GHS' },
    { from: 'zar', to: 'ghs', label: 'ZAR → GHS' },
  ].filter(p => p.from !== from.toLowerCase())

  if (!pairs.length) return null

  return (
    <div className="mt-4">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-fore-3">
        Popular GHS pairs
      </p>
      <div className="flex flex-wrap gap-2">
        {pairs.slice(0, 5).map(p => (
          <a
            key={p.label}
            href={`?from=${p.from}&to=${p.to}`}
            className={[
              'rounded-full border border-edge bg-panel px-3 py-1.5 text-xs font-medium text-fore-2',
              'transition-all hover:border-teal/40 hover:bg-teal-soft hover:text-teal',
            ].join(' ')}
            onClick={e => {
              e.preventDefault()
              window.history.replaceState(null, '', `?from=${p.from}&to=${p.to}`)
              window.location.reload()
            }}
          >
            {getCurrencyFlag(p.from)} {p.label}
          </a>
        ))}
      </div>
    </div>
  )
}
