# VitalQuest XP Verification Beta Plan

## Purpose
Validate that VitalQuest rewards real work fairly, distinguishes stronger from weaker evidence, and resists casual abuse without making legitimate users feel punished.

## Beta principle
During beta, verification affects banked XP and provenance, but **no competitive rewards should depend on Verified XP yet**. We calibrate first, then turn on competitive consequences.

## Cohorts
Run at least 5 testers in each available cohort before changing trust thresholds.

1. **Manual-only** — web or native, no GPS/Health permissions.
2. **Live app** — resistance/recovery tracked in VitalQuest, no wearable.
3. **GPS** — endurance using live foreground GPS.
4. **Health** — iPhone/Apple Watch or Android wearable with HealthKit/Health Connect workout data.
5. **Mixed** — normal users who sometimes have sensors and sometimes do not.

## Required test sessions per tester
- 3 resistance sessions
- 2 endurance sessions
- 1 recovery session
- 1 deliberately incomplete session
- 1 deliberate abuse test

Target: 8+ scored encounters per tester.

## Known-good scenarios
A tester should complete these normally and record whether the result felt fair.

### Resistance
- normal 30–75 minute workout
- at least 6 working sets
- normal rest between sets
- one legitimate PR when applicable
- repeat a familiar lift at a similar load

Expected: live-app sessions should usually reach CORROBORATED/full-value XP when cadence and history are plausible. Health-backed sessions should generally reach VERIFIED.

### Endurance
- GPS run/walk of at least 15 minutes
- normal route, no pause manipulation
- compare VitalQuest distance with Apple Fitness / Strava / known route when possible

Expected: GPS should normally reach VERIFIED unless route/timing data are clearly poor or contradictory.

### Recovery
- complete at least 2 blocks
- spend the actual elapsed time in the encounter

Expected: live timing should prevent typed-duration inflation. Health evidence may upgrade provenance when available.

## Abuse scenarios
These are intentional and should be run only in beta accounts.

1. **Checkbox spam** — complete many lifting sets in under one minute.
2. **Impossible density** — report far more work units than duration supports.
3. **Load spike** — enter a working load far above established history.
4. **Manual run inflation** — type a strong distance/pace without GPS.
5. **Session overlap** — attempt to log two sessions covering the same time window.
6. **Clock mismatch** — manipulate entered duration vs actual live elapsed time when a path allows it.
7. **Duplicate session** — repeat substantially identical session data immediately.
8. **GPS non-movement** — start GPS verification but do not meaningfully move.

Expected: confidence should fall and some XP should be withheld. The UI should explain the reason without accusing the user of cheating.

## Metrics
Track these by modality and evidence source.

### Fairness
- % legitimate sessions receiving full XP
- % legitimate sessions incorrectly downgraded
- median confidence for legitimate sessions
- number of users who say the explanation was understandable

### Abuse resistance
- % deliberate abuse sessions downgraded
- XP withheld during abuse attempts
- false VERIFIED rate on known abuse scenarios

### Sensor quality
- GPS distance error vs comparison source
- Health workout match rate
- Health heart-rate corroboration rate
- permission-denial rate
- sensor-query failure rate

### Product friction
- % who connect Health
- % who enable GPS when offered
- completion rate after permission prompt
- number of workouts abandoned because verification felt intrusive

## Initial launch thresholds
Do not enable Verified-only leaderboards / guild damage / competitive rewards until the beta reaches all of these:

- >= 95% of legitimate sensor-backed sessions receive full-value XP
- >= 90% of legitimate live-app resistance sessions receive full-value XP
- <= 5% false downgrade rate for legitimate sessions
- >= 90% of intentional abuse sessions are downgraded or flagged
- < 2% known abuse sessions reach VERIFIED
- GPS median distance error <= 5% in normal outdoor tests
- Health workout match succeeds >= 90% when the workout is present and permission is granted

## Feedback prompts
After selected sessions ask only 3 questions:

1. **Did VitalQuest give this workout fair credit?** Yes / No
2. **Did the verification label make sense?** Yes / No
3. **Anything unusual about this session?** Optional text

Do not ask after every session; sample roughly 1 in 3 during beta.

## Beta phases

### Phase A — Internal calibration
Core testers only. Collect normal and deliberate-abuse sessions. Tune thresholds aggressively.

### Phase B — Trusted external beta
TestFlight cohort. No competitive consequences. Watch false downgrades and sensor failures.

### Phase C — Shadow competitive scoring
Calculate Verified XP / boss damage / leaderboard eligibility in the background but do not expose or enforce it. Compare expected vs actual.

### Phase D — Limited verified competition
Small opt-in event. Require VERIFIED or CORROBORATED evidence according to event rules. Keep appeals / manual review available.

## Data to preserve for debugging
For every beta verification record preserve:
- session id
- modality
- raw XP
- banked XP
- confidence
- tier
- evidence source
- reasons
- integrity flags
- set cadence summary (not raw health samples)
- sensor active minutes
- GPS point count / derived distance (not necessarily full route)
- app version

## Privacy rule
Raw HealthKit/Health Connect samples and precise GPS routes should remain on-device by default. Upload derived verification evidence only unless the tester explicitly opts into diagnostic sharing.

## Decision rule
If a legitimate user regularly loses XP for behavior that is normal for them, the system is wrong even if the anti-cheat rule is technically defensible. Prefer explainable, conservative trust adjustments over aggressive punishment.
