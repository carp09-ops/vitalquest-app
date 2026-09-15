# VitalQuest Supabase Architecture Notes

## Trust boundary

The client owns the raw training facts it creates:

- workout_templates
- workout_template_exercises
- workout_sessions
- exercise_sets
- cardio_activities
- profile preferences

The server owns derived game state:

- xp_events
- attribute_events
- user_rewards
- user_quests

That means a completed workout can render optimistic XP immediately from the local game engine, while the cloud evaluator independently recomputes and persists the authoritative result.

## Why

If a public mobile client can directly insert its own XP and reward rows, a modified client can grant itself arbitrary levels and unlocks. Keeping derived tables read-only at the Data API boundary prevents that class of integrity problem.

## Offline sync contract

1. Generate UUIDs on-device.
2. Persist workout + sets locally first.
3. Add a local sync_outbox item.
4. Upsert raw workout facts to Supabase using the same UUIDs.
5. Trigger / invoke trusted evaluation.
6. Pull authoritative XP / attributes / rewards.
7. Mark local outbox item synced.
8. Reconcile optimistic local values if the authoritative evaluator differs.

POC 1 implements steps 1–3 locally. Steps 4–8 are the next build slice.
