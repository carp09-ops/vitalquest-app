import { describe, expect, it } from 'vitest'
import { evaluateSessionIntegrity } from '../../sessionIntegrity'

const MIN = 60000
const t0 = Date.now()
const iso = (t: number) => new Date(t).toISOString()

const base = {
  startedAt: iso(t0),
  completedAt: iso(t0 + 100 * MIN),
  durationMinutes: 100,
}

describe('evaluateSessionIntegrity', () => {
  it('detects a duplicate when a prior session overlaps >35%', async () => {
    const db = {
      getAllAsync: async () => [{ id: 'prior', started_at: iso(t0 - 50 * MIN), completed_at: iso(t0 + 36 * MIN) }],
    }
    const r = await evaluateSessionIntegrity(db as never, base)
    expect(r.duplicateDetected).toBe(true)
  })
  it('does not flag a 34% overlap as a duplicate', async () => {
    const db = {
      getAllAsync: async () => [{ id: 'prior', started_at: iso(t0 - 50 * MIN), completed_at: iso(t0 + 34 * MIN) }],
    }
    const r = await evaluateSessionIntegrity(db as never, base)
    expect(r.duplicateDetected).toBe(false)
  })
  it('ignores non-overlapping history', async () => {
    const db = {
      getAllAsync: async () => [{ id: 'old', started_at: iso(t0 - 300 * MIN), completed_at: iso(t0 - 200 * MIN) }],
    }
    const r = await evaluateSessionIntegrity(db as never, base)
    expect(r.duplicateDetected).toBe(false)
    expect(r.clockMismatch).toBe(false)
  })
  it('flags clock mismatch beyond the tolerance band', async () => {
    const db = { getAllAsync: async () => [] }
    const r = await evaluateSessionIntegrity(db as never, {
      startedAt: iso(t0),
      completedAt: iso(t0 + 100 * MIN),
      durationMinutes: 45,
    })
    expect(r.clockMismatch).toBe(true)
  })
  it('accepts consistent timestamps', async () => {
    const db = { getAllAsync: async () => [] }
    const r = await evaluateSessionIntegrity(db as never, base)
    expect(r.clockMismatch).toBe(false)
  })
  it('fails closed on invalid input: unverifiable clock is flagged, no false duplicate', async () => {
    const db = { getAllAsync: async () => [] }
    const r = await evaluateSessionIntegrity(db as never, {
      startedAt: 'bogus',
      completedAt: 'also-bogus',
      durationMinutes: 45,
    })
    expect(r).toEqual({ duplicateDetected: false, clockMismatch: true, overlapCount: 0, overlapSeconds: 0 })
  })
})
