# Sketch: pluggable trust verifiers

Prototype branch. Nothing here is wired into the app — `main` is untouched.

## The problem

Today `db.ts` assembles trust evidence inline: it calls the integrity check, the
HealthKit collector, hand-builds the `live_app` base evidence, priority-merges,
then scores. Adding a new verification source (Strava import, a wearable API)
means editing the scorer's source branches, the merge-priority function, and the
call site — the "new source" logic has no single home.

## The sketch

```
runTrustPipeline(rawXP, session, verifiers[])
  1. collect  — every verifier returns a Partial<VerificationEvidence>, in parallel;
                a throwing verifier contributes nothing instead of failing the session
  2. merge    — priority-ordered; higher priority wins `source`,
                sensorMinutes takes max, boolean flags OR
  3. score    — the existing evaluateXPTrust, completely untouched
```

- `types.ts` — the `TrustVerifier` interface. This is the whole contract.
- `verifiers.ts` — `manualEntryVerifier`, `liveAppVerifier` (cadence math extracted
  from what db.ts used to inline), `sessionIntegrityVerifier(db)` (factory so it
  takes a stub DB in tests).
- `sensorVerifiers.ts` — adapter making the existing HealthKit collector a
  verifier. Native code untouched.
- `pipeline.ts` — `runTrustPipeline` / `runTrustPipelineDetailed`
  (collect → merge → score → adjudicate).
- `rules.ts` — the scorer decomposed into 10 composable `ScoringRule`s, extracted
  1:1 from `evaluateXPTrust`. Demo output is byte-identical before/after.
- `scoring.ts` — `applyRules` + `adjudicate` (tier/multiplier thresholds).
- `demo.ts` — runnable proof. `npx tsc` then `node` on the compiled output.

Run it: `npx tsc --outDir /tmp/trust-demo && node /tmp/trust-demo/src/trust/demo.js`

## Tests

`npm test` (vitest). 63 tests across 6 files in `src/trust/__tests__/`:

- `rules.test.ts` — every scoring rule in isolation, including boundary values
- `scoring.test.ts` — tier/multiplier bands, confidence clamping, XP split
- `pipeline.test.ts` — merge precedence, failing-verifier isolation, custom rule
  sets, and **equivalence with the original `evaluateXPTrust`** on full sessions
- `verifiers.test.ts` — evidence each verifier produces
- `sessionIntegrity.test.ts` — duplicate/clock detection on the existing module
- `xpTrust.test.ts` — golden values for the untouched original scorer

## Cadence is derived, not declared (2026-09-22)

Set cadence (`setTimestamps` → coverage, median gap) is derived inside the
pipeline from the persisted set rows (`sessionSaveTrustInput`), not from
caller-computed `verificationEvidence` fields. The workout screens no longer
send `setTimestamps` / `medianSetGapSeconds` / `cadenceCoverage`; they pass
raw per-set `completedAt` (nullable) and the `?? completedAt` fallback for
persistence stays at the `exercise_sets` INSERT in `db.ts`.

Rules of the derivation, pinned by `cadenceDerivation.test.ts`:

- Only rows with a **real** `completedAt` count. Missing timestamps are
  ignored — they must never look like rushing (no false positives on bulk
  logs or data loss).
- Honest sessions score identically to the old caller-computed path.
- A caller that lies about cadence can no longer inflate its score
  (bodyweight case: 90 VERIFIED → 59 TRACKED, −30 XP).
- Timestamped manual entries now earn their cadence bonus automatically
  (60 TRACKED → 77 CORROBORATED, +30 XP).
- If a future caller does send cadence fields, `session_override`
  (priority 2) still wins over the derived values (priority 1) — an
  explicit, auditable override.

## What's intentionally not done

- GPS capture is session-scoped (it wraps a live `watchPositionAsync`), so a GPS
  verifier would wrap an already-captured result rather than collect post-hoc.
- No server-side adjudication yet — this stays client-side, same as today.

## Migration path (if this direction is liked)

1. Move `db.ts` lines ~147–151 onto `runTrustPipeline` (mechanical).
2. Delete the old inline assembly once the pipeline covers it.
3. Decompose the scorer into rules.
4. New sources become one-file PRs.
