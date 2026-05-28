export function convert(amount: number, rate: number): number {
  if (!isFinite(amount) || !isFinite(rate) || rate <= 0) return 0
  return Math.round(amount * rate * 100) / 100
}

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  GHS: 'Ghana Cedi',
  NGN: 'Nigerian Naira',
  ZAR: 'South African Rand',
  CAD: 'Canadian Dollar',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  AED: 'UAE Dirham',
  XOF: 'West African CFA',
  KES: 'Kenyan Shilling',
  EGP: 'Egyptian Pound',
  MAD: 'Moroccan Dirham',
  TZS: 'Tanzanian Shilling',
}

const CURRENCY_FLAGS: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  GHS: '🇬🇭',
  NGN: '🇳🇬',
  ZAR: '🇿🇦',
  CAD: '🇨🇦',
  JPY: '🇯🇵',
  CNY: '🇨🇳',
  AED: '🇦🇪',
  XOF: '🌍',
  KES: '🇰🇪',
  EGP: '🇪🇬',
  MAD: '🇲🇦',
  TZS: '🇹🇿',
}

export function getCurrencyName(code: string): string {
  return CURRENCY_NAMES[code.toUpperCase()] ?? code.toUpperCase()
}

export function getCurrencyFlag(code: string): string {
  return CURRENCY_FLAGS[code.toUpperCase()] ?? '🌐'
}

export function formatMoney(amount: number, currencyCode: string): string {
  if (!isFinite(amount)) return '--'
  const code = currencyCode.toUpperCase()

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${code} ${amount.toFixed(2)}`
  }
}

export function formatRate(from: string, to: string, rate: number): string {
  return `1 ${from.toUpperCase()} = ${rate.toFixed(4)} ${to.toUpperCase()}`
}
