# VitalQuest progression loop

VitalQuest progression is event-driven and offline-first. SQLite is the local source of truth; screens derive their current state from persisted workout, XP, and attribute events rather than maintaining independent counters.

## Core loop

1. A workout is completed and persisted as a `workout_sessions` row plus its completed `exercise_sets`.
2. The session writes a general XP event into `xp_events`.
3. The session writes one or more typed attribute events into `attribute_events` (Strength today; Stamina/Agility/Vitality/Discipline can use the same contract later).
4. A sync-outbox record is created in the same transaction.
5. `getProgressionSnapshot()` aggregates the event ledger into the current hero state.
6. Screens refresh that snapshot whenever they receive focus, so Today, Quests, Armory, and Hero agree immediately after returning from a completed workout.

## Current derived progression

- Level and level progress: derived from lifetime XP using the level curve in `gameEngine.ts`.
- Strength: derived from persisted Strength attribute XP.
- Stamina / Agility: supported by the event model but remain at baseline until endurance/mobility sessions begin writing those gains.
- Discipline / vitality presentation: derived from consistency and streak state at the UI layer for now.
- Streak: consecutive distinct workout dates, allowing the streak to remain active if the most recent workout was yesterday.
- Weekly workout quest: three sessions since the current Monday.
- Five-Ton Trial: 10,000 lb of weekly resistance volume.
- Veteran Path: 25 lifetime sessions.

## Current unlock rules

- Iron Initiate: first completed workout.
- The Relentless: seven-day workout streak.
- Forged Helm: ten completed workouts.
- Titan Plate: 100,000 lb lifetime resistance volume.
- Ember Aura: 5,000 lifetime XP (evaluated by the Armory UI today).
- Roadrunner Greaves: becomes available once Agility XP exists.

These thresholds are product-tuning values, not permanent balance decisions.

## Invariants

- No screen owns canonical XP, level, workout count, quest progress, or unlock state.
- Dynamic progression values must not be baked into artwork.
- Completing one workout must never require a network connection for local progression to update.
- New activity types should extend `attributeGains`; do not add a new persistence path for every attribute.
- Server sync should reconcile event identity, not replace the local gameplay model.

## Next mechanics pass

1. Remove the temporary fixed streak value still used when calculating the workout-completion XP bonus and source it from the ledger.
2. Add endurance session persistence (distance, duration, pace) and write Stamina / Agility attribute gains.
3. Add mobility / recovery session persistence and Vitality / Discipline gains.
4. Add explicit quest-completion events so one-time quest rewards cannot be granted twice.
5. Add reward-unlock events/dates for permanent history and achievement presentation.
6. Add cloud reconciliation around the existing `sync_outbox`.
