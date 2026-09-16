# VitalQuest XP Trust Model

## Product principle
VitalQuest progression should represent work that actually happened, not claims that were easy to enter.

Every activity has two values:
- **Raw XP**: the value of the reported workout if fully trusted.
- **Banked XP**: the amount actually added to progression after evidence is evaluated.

VitalQuest also stores a confidence score, verification tier, multiplier, evidence payload, and human-readable reasons.

## Trust tiers

### SELF_REPORTED
After-the-fact or weakly evidenced activity. It can contribute to personal progression, but it is discounted and is not sufficient for competitive verified systems.

### TRACKED
The session has meaningful application-level evidence, but the work is not independently corroborated. Examples: live app timing without sensor proof, plausible manual activity details, or partial tracking.

### CORROBORATED
Multiple signals agree strongly enough that the session receives full-value personal XP. Examples include live tracked resistance work with plausible elapsed time, multiple completed sets, plausible work density, and consistent resistance volume.

### VERIFIED
Independent device evidence supports the session. Examples: HealthKit workout records, GPS traces, wearable heart-rate/activity duration, or another trusted provider. Verified does not earn more XP than identical corroborated work; it earns higher trust.

## Economy rule
- SELF_REPORTED: 55% of raw XP
- TRACKED: 75% of raw XP
- CORROBORATED: 100% of raw XP
- VERIFIED: 100% of raw XP

Verification should never create bonus power for owning a device. Instead, Verified XP becomes the standard for competitive leaderboards, guild contributions, boss damage, public records, and anti-cheat-sensitive systems.

## Evidence signals implemented now
- activity source
- live-app tracking flag
- elapsed duration plausibility
- completed work units
- work density
- lifting volume plausibility
- endurance distance
- endurance pace plausibility
- recovery duration
- sensor-active minutes (contract ready)
- duplicate detection flag (contract ready)
- clock mismatch flag (contract ready)
- implausible performance spike flag (contract ready)

## Anti-abuse philosophy
Do not rely on a single detector. A legitimate workout can look unusual. Use multiple independent signals, degrade confidence gradually, and preserve the reason trail.

Hard competitive eligibility can be stricter than personal progression. Personal users should not lose all credit because a sensor disconnected; competitive systems should not accept weak self-report evidence as equivalent to independently verified work.

## Resistance verification path
Current web phase can establish corroborated confidence from:
1. session starts before work is logged
2. elapsed session time is plausible
3. multiple sets are completed during the session
4. reported volume is plausible
5. progression is consistent with prior exercise history

Native phase should add:
1. per-set monotonic timestamps
2. foreground/background session continuity
3. wearable heart-rate/activity minutes when available
4. Apple Health workout corroboration
5. optional gym/equipment integrations in the future

A phone cannot prove that a barbell physically moved by itself. Truly high-confidence resistance verification therefore requires independent physiological/device evidence or trusted equipment telemetry. VitalQuest should describe this honestly rather than claim perfect proof.

## Endurance verification path
Manual distance/time entry is self-reported or tracked evidence and is discounted.

Native GPS/HealthKit should validate:
- route distance
- elapsed vs moving time
- pace plausibility
- GPS continuity
- teleport/outlier filtering
- overlapping duplicate activities
- optional wearable heart rate

A valid device-backed route can qualify as VERIFIED.

## Recovery verification path
Recovery/mobility has intrinsically weaker physical evidence. Full personal XP may be corroborated by live elapsed time and completed protocol blocks; competitive contribution from recovery should be capped or require connected activity evidence if ever used competitively.

## Competitive systems
The following should eventually use **Verified XP**, not total personal XP:
- public leaderboards
- guild rankings
- boss damage
- PvP or asynchronous competitive ladders
- public records / verified badges
- reward systems with real monetary value

Personal hero level may include corroborated XP. The UI should display verified share so users understand the difference.

## Auditability
Every saved session verification record contains:
- session id
- raw XP
- awarded XP
- withheld XP
- confidence 0–100
- multiplier
- tier
- evidence JSON
- reason list
- creation timestamp

The sync payload carries the same trust metadata so a future server can re-score or reject client-side claims.

## Server authority phase
When cloud accounts arrive, the client must stop being authoritative for competitive XP. The server should:
1. receive immutable activity evidence/events
2. deduplicate sessions
3. verify provider signatures/tokens when available
4. recompute trust score and XP server-side
5. reject impossible overlaps/timestamp manipulation
6. maintain an append-only XP ledger
7. expose appeal/review paths for anomalous legitimate sessions

## North-star rule
**The user may report work. VitalQuest decides how much of that work it can trust.**
