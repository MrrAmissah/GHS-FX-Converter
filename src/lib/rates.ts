const PRIMARY   = (base: string) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`
const FALLBACK  = (base: string) => `https://latest.currency-api.pages.dev/v1/currencies/${base.toLowerCase()}.json`

const CACHE_KEY     = 'ghsfx_rates_v1'
const CACHE_MAX_AGE = 60 * 60 * 1000 // 1 hour

export interface RatesCache {
  base: string
  date: string
  rates: Record<string, number>
  fetchedAt: number
}

function readCache(base: string): RatesCache | null {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${base.toLowerCase()}`)
    if (!raw) return null
    const parsed: RatesCache = JSON.parse(raw)
    if (parsed.base?.toLowerCase() !== base.toLowerCase()) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(cache: RatesCache): void {
  try {
    localStorage.setItem(`${CACHE_KEY}_${cache.base.toLowerCase()}`, JSON.stringify(cache))
  } catch {
    // storage quota — silently ignore
  }
}

async function fetchFromUrl(url: string, base: string): Promise<{ date: string; rates: Record<string, number> }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const rates = json[base.toLowerCase()]
  if (!rates || typeof rates !== 'object') throw new Error('Unexpected response shape')
  return { date: json.date as string, rates: rates as Record<string, number> }
}

export async function fetchRates(base: string): Promise<RatesCache> {
  const cached = readCache(base)
  if (cached && Date.now() - cached.fetchedAt < CACHE_MAX_AGE) return cached

  let lastError: unknown
  for (const url of [PRIMARY(base), FALLBACK(base)]) {
    try {
      const { date, rates } = await fetchFromUrl(url, base)
      const entry: RatesCache = { base: base.toLowerCase(), date, rates, fetchedAt: Date.now() }
      writeCache(entry)
      return entry
    } catch (e) {
      lastError = e
    }
  }

  // Both URLs failed — return stale cache if available
  if (cached) return { ...cached, fetchedAt: cached.fetchedAt }

  throw lastError
}

export function getRate(cache: RatesCache, to: string): number | null {
  return cache.rates[to.toLowerCase()] ?? null
}

export function isCacheStale(cache: RatesCache): boolean {
  return Date.now() - cache.fetchedAt >= CACHE_MAX_AGE
}
