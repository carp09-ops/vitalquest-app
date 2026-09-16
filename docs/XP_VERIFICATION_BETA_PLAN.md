# VitalQuest XP Verification Beta Plan

## Beta 1 scope — Web only
Beta 1 runs entirely in the VitalQuest web app. TestFlight, Apple Watch, HealthKit, Health Connect and native-only verification are intentionally deferred to Beta 2.

The purpose of Beta 1 is to validate the product before adding native hardware variables:
- Is the training loop compelling?
- Does XP feel fair and understandable?
- Do levels, attributes, quests and rewards progress at the right pace?
- Can live-app evidence distinguish normal training from obvious abuse?
- Does browser GPS provide useful endurance verification where supported?
- Do users understand Raw XP, Banked XP, confidence and provenance?

## Beta 1 principle
Verification can affect banked XP and provenance, but there are **no competitive consequences**. No leaderboards, guild damage, PvP or exclusive rewards should depend on verification tiers during Beta 1.

HealthKit / Apple Watch / Health Connect are not required and are not part of Beta 1 success criteria.

## Beta 1 tester cohorts
Use the same web URL for everyone. Recruit at least 10–15 testers total before making major trust-threshold changes.

1. **Manual-first** — users who primarily enter endurance or training data manually.
2. **Live resistance** — users who run lifting encounters inside VitalQuest and complete sets as they train.
3. **Live recovery** — users who complete recovery encounters with the live encounter clock.
4. **Browser GPS** — endurance testers using browser/device location where permission and browser support allow it.
5. **Mixed normal use** — users who naturally move between the above modes.

## Required Beta 1 sessions per tester
Aim for at least:
- 3 resistance sessions
- 2 endurance sessions
- 1 recovery session
- 1 deliberately incomplete session
- 1 deliberate abuse test

Target: 8+ scored encounters per tester.

## Known-good scenarios

### Resistance
- normal 30–75 minute workout
- at least 6 working sets
- normal rest between sets
- one legitimate PR when applicable
- repeat a familiar lift at a similar load

Expected: legitimate live-app sessions should usually reach CORROBORATED / full-value XP when cadence, elapsed time and history are plausible.

### Endurance
Two valid Beta 1 paths:

**Manual**
- enter real distance and duration after completing the activity
- expect reduced provenance because there is no independent evidence

**Browser GPS**
- start the GPS-verified encounter in VitalQuest
- complete a normal route of at least 10–15 minutes where practical
- compare VitalQuest distance against a known route or another fitness app if available

Expected: browser GPS should strengthen confidence when route-derived distance, time and movement are coherent. Manual entry should remain usable but should not masquerade as independent proof.

### Recovery
- complete at least 2 blocks
- remain in the encounter for the actual recovery session

Expected: actual elapsed time and completed-block timing should control progression rather than typed duration.

## Beta 1 abuse scenarios
These are intentional and should only be performed as test scenarios.

1. **Checkbox spam** — complete many lifting sets in under one minute.
2. **Impossible density** — report far more work units than elapsed time supports.
3. **Load spike** — enter a working load far above established history.
4. **Manual run inflation** — type a strong distance/pace without GPS.
5. **Session overlap** — log two sessions covering the same time window.
6. **Clock mismatch** — attempt to create a session whose claimed duration conflicts with timestamps.
7. **Duplicate session** — repeat substantially identical session data immediately.
8. **GPS non-movement** — start browser GPS verification but do not meaningfully move.

Expected: confidence should fall and some XP should be withheld. The UI should explain the evidence issue without accusing the user of cheating.

## Beta 1 metrics

### Product value
- % testers who complete 3+ workouts
- workouts per tester per week
- % who return after first session
- % who open Hero / Quests / Armory after earning XP
- qualitative response to the RPG progression loop

### XP economy
- median raw XP by modality
- median banked XP by modality
- levels gained per week
- time / sessions to first major unlock
- whether any workout type dominates XP unfairly
- whether generated workouts hit reasonable reward ranges

### Trust fairness
- % legitimate live-app sessions receiving full XP
- % legitimate sessions incorrectly downgraded
- median confidence for legitimate sessions
- % testers who understand why XP was withheld

### Abuse resistance
- % deliberate abuse scenarios downgraded
- XP withheld during abuse attempts
- false high-confidence rate on known abuse scenarios

### Browser GPS
- GPS-start success rate
- distance error vs comparison source where available
- permission-denial rate
- GPS session abandonment rate

### Friction
- workout completion rate
- abandoned sessions
- places where users say logging interrupts training
- screens users do not understand without explanation

## Beta 1 initial thresholds
Before moving to Beta 2, target:
- >= 90% of legitimate live-app resistance sessions receive full-value XP
- <= 5% false downgrade rate for clearly legitimate live sessions
- >= 90% of intentional abuse scenarios are downgraded or flagged
- >= 80% of testers understand the Raw XP -> Banked XP explanation without coaching
- no major modality produces obviously disproportionate XP for comparable effort
- browser GPS is reliable enough to keep, or is explicitly deferred without blocking Beta 2

These are calibration thresholds, not public promises.

## Feedback prompts
After selected sessions ask only:
1. **Did VitalQuest give this workout fair credit?** Yes / No
2. **Did the XP / verification explanation make sense?** Yes / No
3. **Anything unusual about this session?** Optional text

Do not ask after every session. Sample roughly 1 in 3 during Beta 1.

Also collect a short end-of-week pulse:
- Did XP make you want to train again?
- Did the RPG layer feel meaningful or decorative?
- What felt tedious?
- What reward or progression did you care about most?

## Beta phases

### Beta 1A — Web internal calibration
Core testers. Normal sessions plus deliberate abuse scenarios. Tune XP and trust rules quickly.

### Beta 1B — Web external beta
Broader invited web testers. Focus on retention, usability, XP pacing and false downgrades. Still no competitive consequences.

### Beta 2 — Native verification beta
Move to TestFlight / native builds. Add HealthKit, Apple Watch, Health Connect and native sensor verification as active beta variables.

### Beta 3 — Shadow competitive scoring
Calculate competitive Verified XP, boss damage and leaderboard eligibility in the background without enforcement.

### Beta 4 — Limited verified competition
Small opt-in events using the calibrated server-authoritative trust model.

## Data to preserve for Beta 1 debugging
For each scored session preserve:
- session id
- modality
- raw XP
- banked XP
- confidence
- tier
- evidence source
- reasons
- integrity flags
- set cadence summary
- elapsed time
- browser GPS derived distance / point count when used
- app version when available

Do not require native health data for Beta 1.

## Privacy rule
Browser GPS should be used only while the endurance encounter is active. Preserve derived distance / verification evidence by default rather than unnecessary precise route history. Native health and wearable data remain Beta 2 concerns.

## Decision rule
If a legitimate user regularly loses XP for normal behavior, the system is wrong even if the anti-abuse rule is technically defensible. Prefer explainable, conservative trust adjustments over aggressive punishment.
