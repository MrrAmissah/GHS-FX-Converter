import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchRates, getRate, isCacheStale } from './rates'

// Mock localStorage
const store: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, val: string) => { store[key] = val },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { Object.keys(store).forEach(k => delete store[k]) },
}
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })

const MOCK_RATES = { ghs: 11.64, eur: 0.86, gbp: 0.74 }
const MOCK_RESPONSE = { date: '2026-05-27', usd: MOCK_RATES }

function makeFetch(responses: Array<{ ok: boolean; body?: unknown }>) {
  let call = 0
  return vi.fn(() => {
    const r = responses[Math.min(call++, responses.length - 1)]
    return Promise.resolve({
      ok: r.ok,
      status: r.ok ? 200 : 500,
      json: () => Promise.resolve(r.body ?? {}),
    })
  })
}

beforeEach(() => {
  localStorageMock.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchRates', () => {
  it('fetches from primary URL and caches result', async () => {
    global.fetch = makeFetch([{ ok: true, body: MOCK_RESPONSE }]) as typeof fetch

    const result = await fetchRates('usd')
    expect(result.rates.ghs).toBe(11.64)
    expect(result.date).toBe('2026-05-27')
    expect(result.base).toBe('usd')
    expect(localStorageMock.getItem('ghsfx_rates_v1_usd')).not.toBeNull()
  })

  it('falls back to secondary URL when primary fails', async () => {
    global.fetch = makeFetch([
      { ok: false },
      { ok: true, body: MOCK_RESPONSE },
    ]) as typeof fetch

    const result = await fetchRates('usd')
    expect(result.rates.ghs).toBe(11.64)
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(2)
  })

  it('returns cached data when cache is fresh', async () => {
    global.fetch = makeFetch([{ ok: true, body: MOCK_RESPONSE }]) as typeof fetch
    await fetchRates('usd')

    const fetchSpy = makeFetch([])
    global.fetch = fetchSpy as typeof fetch
    await fetchRates('usd')

    expect(fetchSpy.mock.calls).toHaveLength(0)
  })

  it('re-fetches when cache is expired', async () => {
    const stale = {
      base: 'usd',
      date: '2026-05-26',
      rates: MOCK_RATES,
      fetchedAt: Date.now() - 2 * 60 * 60 * 1000,
    }
    localStorageMock.setItem('ghsfx_rates_v1_usd', JSON.stringify(stale))

    global.fetch = makeFetch([{ ok: true, body: MOCK_RESPONSE }]) as typeof fetch
    const result = await fetchRates('usd')
    expect(result.date).toBe('2026-05-27')
  })

  it('returns stale cache when both URLs fail', async () => {
    const stale = {
      base: 'usd',
      date: '2026-05-26',
      rates: MOCK_RATES,
      fetchedAt: Date.now() - 2 * 60 * 60 * 1000,
    }
    localStorageMock.setItem('ghsfx_rates_v1_usd', JSON.stringify(stale))

    global.fetch = makeFetch([{ ok: false }, { ok: false }]) as typeof fetch
    const result = await fetchRates('usd')
    expect(result.rates.ghs).toBe(11.64)
  })

  it('throws when both URLs fail and no cache exists', async () => {
    global.fetch = makeFetch([{ ok: false }, { ok: false }]) as typeof fetch
    await expect(fetchRates('usd')).rejects.toBeTruthy()
  })
})

describe('getRate', () => {
  const cache = { base: 'usd', date: '2026-05-27', rates: MOCK_RATES, fetchedAt: Date.now() }

  it('returns the correct rate', () => {
    expect(getRate(cache, 'ghs')).toBe(11.64)
  })

  it('is case-insensitive', () => {
    expect(getRate(cache, 'GHS')).toBe(11.64)
  })

  it('returns null for unknown currency', () => {
    expect(getRate(cache, 'xyz')).toBeNull()
  })
})

describe('isCacheStale', () => {
  it('returns false for fresh cache', () => {
    const cache = { base: 'usd', date: '', rates: {}, fetchedAt: Date.now() }
    expect(isCacheStale(cache)).toBe(false)
  })

  it('returns true for expired cache', () => {
    const cache = { base: 'usd', date: '', rates: {}, fetchedAt: Date.now() - 2 * 60 * 60 * 1000 }
    expect(isCacheStale(cache)).toBe(true)
  })
})
