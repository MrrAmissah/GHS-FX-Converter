import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchRates, getRate, isCacheStale, type RatesCache } from '../lib/rates'
import { convert } from '../lib/currency'

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface ConverterState {
  amount: string
  from: string
  to: string
  result: number | null
  rate: number | null
  date: string
  status: Status
  error: string | null
  isStale: boolean
  cache: RatesCache | null
}

const DEBOUNCE_MS   = 350
const REFRESH_MS    = 60 * 60 * 1000 // re-fetch every hour while tab is open

export function useConverter(initialFrom = 'usd', initialTo = 'ghs') {
  const [amount, setAmount] = useState('1')
  const [from, setFrom]     = useState(initialFrom.toLowerCase())
  const [to, setTo]         = useState(initialTo.toLowerCase())
  const [cache, setCache]   = useState<RatesCache | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError]   = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fromRef     = useRef(from)
  fromRef.current   = from

  const loadRates = useCallback(async (base: string, silent = false) => {
    if (!silent) setStatus('loading')
    setError(null)
    try {
      const data = await fetchRates(base)
      setCache(data)
      setStatus('success')
    } catch {
      setError('Could not load rates. Check your connection and try again.')
      setStatus('error')
    }
  }, [])

  // Initial fetch + refetch when base currency changes
  useEffect(() => {
    loadRates(from)
  }, [from, loadRates])

  // Auto-refresh every hour while the tab is open
  useEffect(() => {
    const id = setInterval(() => {
      loadRates(fromRef.current, true)
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [loadRates])

  // Refresh when user returns to the tab if rates have gone stale
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        fetchRates(fromRef.current).then(data => {
          setCache(data)
          setStatus('success')
        }).catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  const swap = useCallback(() => {
    setFrom(prev => {
      setTo(prev)
      return to
    })
  }, [to])

  const result = (() => {
    if (!cache) return null
    const rate = getRate(cache, to)
    if (rate === null) return null
    const num = parseFloat(amount)
    if (isNaN(num) || num < 0) return null
    return convert(num, rate)
  })()

  const rate    = cache ? getRate(cache, to) : null
  const date    = cache?.date ?? ''
  const isStale = cache ? isCacheStale(cache) : false

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {}, DEBOUNCE_MS)
  }, [])

  return {
    amount,
    from,
    to,
    result,
    rate,
    date,
    status,
    error,
    isStale,
    cache,
    setAmount: handleAmountChange,
    setFrom,
    setTo,
    swap,
    refresh: () => {
      setCache(null)
      loadRates(from)
    },
  }
}
