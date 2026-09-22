import { liveAppVerifier, manualEntryVerifier, sessionIntegrityVerifier } from './verifiers'
import { runTrustPipeline } from './pipeline'
import type { XPTrustResult } from '../xpTrust'
import type { TrustSessionInput, TrustVerifier } from './types'

const MIN = 60000
const now = Date.now()
const iso = (t: number) => new Date(t).toISOString()

function liftSession(setTimestamps?: string[]): TrustSessionInput {
  return {
    modality: 'resistance',
    startedAt: iso(now - 45 * MIN),
    completedAt: iso(now),
    durationMinutes: 45,
    completedUnits: 12,
    totalVolume: 18500,
    setTimestamps,
  }
}

/** 12 sets, one every ~3.5 minutes — a believable lifting cadence. */
function realisticStamps(): string[] {
  const out: string[] = []
  for (let i = 0; i < 12; i++) out.push(iso(now - 45 * MIN + (i + 1) * 3.5 * MIN))
  return out
}

const emptyDb = { getAllAsync: async () => [] }
/** One prior session overlapping >35% of this one → duplicateDetected. */
const duplicateDb = {
  getAllAsync: async () => [
    { id: 'prior', started_at: iso(now - 60 * MIN), completedAt: iso(now - 20 * MIN), completed_at: iso(now - 20 * MIN) },
  ],
}

/**
 * The punchline of the sketch: a brand-new verification source, defined here
 * in the demo file, plugged into the pipeline with zero changes to any
 * existing file.
 */
const stravaImportVerifier: TrustVerifier = {
  id: 'strava_import',
  priority: 2,
  async collect() {
    return { source: 'gps', distanceMiles: 3.1, avgPaceSeconds: 542, sensorMinutes: 28 }
  },
}

function report(label: string, r: XPTrustResult) {
  console.log(`\n## ${label}`)
  console.log(`tier=${r.tier} confidence=${r.confidence} multiplier=${r.multiplier}`)
  console.log(`raw=${r.rawXP} awarded=${r.awardedXP} withheld=${r.withheldXP}`)
  console.log(`top reasons: ${r.reasons.slice(0, 2).join(' / ')}`)
}

async function main() {
  const rawXP = 120

  report(
    '1. Manual entry (typed in after the fact)',
    await runTrustPipeline(rawXP, liftSession(), [manualEntryVerifier, sessionIntegrityVerifier(emptyDb)]),
  )

  report(
    '2. Live-tracked (per-set timestamps from the app)',
    await runTrustPipeline(rawXP, liftSession(realisticStamps()), [
      manualEntryVerifier,
      liveAppVerifier,
      sessionIntegrityVerifier(emptyDb),
    ]),
  )

  report(
    '3. Live-tracked + duplicate session detected',
    await runTrustPipeline(rawXP, liftSession(realisticStamps()), [
      manualEntryVerifier,
      liveAppVerifier,
      sessionIntegrityVerifier(duplicateDb),
    ]),
  )

  const run: TrustSessionInput = {
    modality: 'endurance',
    startedAt: iso(now - 30 * MIN),
    completedAt: iso(now),
    durationMinutes: 30,
  }
  report(
    '4. New source plugged in: Strava import (no existing files changed)',
    await runTrustPipeline(90, run, [manualEntryVerifier, stravaImportVerifier, sessionIntegrityVerifier(emptyDb)]),
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
