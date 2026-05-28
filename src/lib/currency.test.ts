import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { convert, formatMoney } from './currency'

describe('convert', () => {
  it('multiplies amount by rate and rounds to 2 decimals', () => {
    expect(convert(100, 11.6484)).toBe(1164.84)
  })

  it('handles zero amount', () => {
    expect(convert(0, 15)).toBe(0)
  })

  it('handles large amounts', () => {
    expect(convert(1_000_000, 1.23456)).toBe(1_234_560)
  })

  it('rounds fractional results correctly', () => {
    expect(convert(1, 3.333)).toBe(3.33)
    expect(convert(2, 1.555)).toBe(3.11)
  })

  it('returns 0 for non-positive rate', () => {
    expect(convert(100, 0)).toBe(0)
    expect(convert(100, -5)).toBe(0)
  })

  it('returns 0 for non-finite inputs', () => {
    expect(convert(Infinity, 1)).toBe(0)
    expect(convert(NaN, 1)).toBe(0)
    expect(convert(1, NaN)).toBe(0)
  })

  it('handles 1-to-1 rate', () => {
    expect(convert(42.50, 1)).toBe(42.50)
  })
})

describe('formatMoney', () => {
  it('formats USD with 2 decimal places', () => {
    const result = formatMoney(1234.5, 'USD')
    expect(result).toContain('1,234.50')
  })

  it('formats GHS', () => {
    const result = formatMoney(500, 'GHS')
    expect(result).toContain('500.00')
  })

  it('formats zero', () => {
    const result = formatMoney(0, 'USD')
    expect(result).toContain('0.00')
  })

  it('formats large amounts with commas', () => {
    const result = formatMoney(1_000_000, 'USD')
    expect(result).toContain('1,000,000.00')
  })

  it('falls back gracefully for non-finite input', () => {
    expect(formatMoney(Infinity, 'USD')).toBe('--')
  })

  it('falls back for unknown currency codes', () => {
    const result = formatMoney(100, 'XYZ')
    expect(result).toBeTruthy()
  })
})
