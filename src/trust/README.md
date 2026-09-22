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
- `pipeline.ts` — the three-stage pipeline.
- `demo.ts` — runnable proof. `npx tsc` then `node` on the compiled output.

Run it: `npx tsc --outDir /tmp/trust-demo && node /tmp/trust-demo/src/trust/demo.js`

## What's intentionally not done

- The scorer (`evaluateXPTrust`) is still one big function. The natural follow-up
  is decomposing it into composable `ScoringRule`s — same plug-in idea, applied
  to scoring. Left out to keep the slice reviewable.
- GPS capture is session-scoped (it wraps a live `watchPositionAsync`), so a GPS
  verifier would wrap an already-captured result rather than collect post-hoc.
- No server-side adjudication yet — this stays client-side, same as today.

## Migration path (if this direction is liked)

1. Move `db.ts` lines ~147–151 onto `runTrustPipeline` (mechanical).
2. Delete the old inline assembly once the pipeline covers it.
3. Decompose the scorer into rules.
4. New sources become one-file PRs.
