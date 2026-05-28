import { getCurrencyFlag, getCurrencyName } from '../lib/currency'

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'GHS', 'NGN', 'ZAR', 'CAD',
  'JPY', 'CNY', 'AED', 'KES', 'EGP', 'MAD', 'XOF', 'TZS',
]

interface Props {
  value: string
  onChange: (code: string) => void
  label: string
  id: string
}

export default function CurrencySelect({ value, onChange, label, id }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-fore-3">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl leading-none select-none">
          {getCurrencyFlag(value)}
        </span>
        <select
          id={id}
          value={value.toUpperCase()}
          onChange={e => onChange(e.target.value.toLowerCase())}
          className={[
            'w-full appearance-none rounded-xl border border-edge bg-panel py-3.5 pl-11 pr-9',
            'text-sm font-semibold text-fore shadow-sm outline-none',
            'transition-all focus:border-teal/60 focus:ring-2 focus:ring-teal/15',
            'hover:border-edge-hi',
          ].join(' ')}
        >
          {SUPPORTED_CURRENCIES.map(code => (
            <option key={code} value={code}>
              {code} — {getCurrencyName(code)}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fore-3"
          width="14" height="14" viewBox="0 0 14 14" fill="none"
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
