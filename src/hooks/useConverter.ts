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

const DEBOUNCE_MS = 350

export function useConverter(initialFrom = 'usd', initialTo = 'ghs') {
  const [amount, setAmount]   = useState('1')
  const [from, setFrom]       = useState(initialFrom.toLowerCase())
  const [to, setTo]           = useState(initialTo.toLowerCase())
  const [cache, setCache]     = useState<RatesCache | null>(null)
  const [status, setStatus]   = useState<Status>('idle')
  const [error, setError]     = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadRates = useCallback(async (base: string) => {
    setStatus('loading')
    setError(null)
    try {
      const data = await fetchRates(base)
      setCache(data)
      setStatus('success')
    } catch (e) {
      setError('Could not load rates. Check your connection and try again.')
      setStatus('error')
    }
  }, [])

  // Reload when base currency changes
  useEffect(() => {
    loadRates(from)
  }, [from, loadRates])

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

  const rate = cache ? getRate(cache, to) : null
  const date = cache?.date ?? ''
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
