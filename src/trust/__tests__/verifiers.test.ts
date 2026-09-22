import { describe, expect, it } from 'vitest'
import { liveAppVerifier, manualEntryVerifier, sessionIntegrityVerifier } from '../verifiers'

const MIN = 60000
const now = Date.now()
const iso = (t: number) => new Date(t).toISOString()

const session = {
  modality: 'resistance' as const,
  startedAt: iso(now - 45 * MIN),
  completedAt: iso(now),
  durationMinutes: 45,
  completedUnits: 12,
  totalVolume: 18500,
}

describe('manualEntryVerifier', () => {
  it('passes the session fields through with lowest precedence', async () => {
    expect(manualEntryVerifier.priority).toBe(0)
    const e = await manualEntryVerifier.collect(session)
    expect(e).toMatchObject({
      source: 'manual_entry',
      modality: 'resistance',
      durationMinutes: 45,
      completedUnits: 12,
      totalVolume: 18500,
    })
  })
})

describe('liveAppVerifier', () => {
  const stamps = Array.from({ length: 12 }, (_, i) => iso(now - 45 * MIN + (i + 1) * 3.5 * MIN))
  it('derives cadence evidence from set timestamps', async () => {
    const e = await liveAppVerifier.collect({ ...session, setTimestamps: stamps })
    expect(e.source).toBe('live_app')
    expect(e.liveTracked).toBe(true)
    expect(e.cadenceCoverage).toBe(1)
    expect(e.medianSetGapSeconds).toBe(210)
    expect(e.setTimestamps).toEqual(stamps)
  })
  it('handles unsorted timestamps', async () => {
    const e = await liveAppVerifier.collect({ ...session, setTimestamps: [...stamps].reverse() })
    expect(e.medianSetGapSeconds).toBe(210)
  })
  it('reports no live tracking without timestamps', async () => {
    const e = await liveAppVerifier.collect(session)
    expect(e.liveTracked).toBe(false)
    expect(e.cadenceCoverage).toBe(0)
    expect(e.medianSetGapSeconds).toBe(0)
  })
})

describe('sessionIntegrityVerifier', () => {
  it('flags a duplicate session from the DB', async () => {
    const db = {
      getAllAsync: async () => [
        { id: 'prior', started_at: iso(now - 60 * MIN), completed_at: iso(now - 20 * MIN) },
      ],
    }
    const e = await sessionIntegrityVerifier(db).collect(session)
    expect(e.duplicateDetected).toBe(true)
  })
  it('is clean when the DB has no overlap', async () => {
    const e = await sessionIntegrityVerifier({ getAllAsync: async () => [] }).collect(session)
    expect(e.duplicateDetected).toBe(false)
    expect(e.clockMismatch).toBe(false)
  })
  it('flags clock mismatch when elapsed time disagrees with duration', async () => {
    const skewed = { ...session, completedAt: iso(now - 45 * MIN + 99 * MIN) }
    const e = await sessionIntegrityVerifier({ getAllAsync: async () => [] }).collect(skewed)
    expect(e.clockMismatch).toBe(true)
  })
})
