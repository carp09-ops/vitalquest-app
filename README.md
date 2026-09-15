# VitalQuest

VitalQuest turns real-world training into RPG progression.

**Core loop:** Train → Log → Convert → Level → Unlock.

POC 1 is a native-first Expo / React Native build with local-first SQLite persistence.

## Run locally

```bash
git clone https://github.com/carp09-ops/vitalquest-app.git
cd vitalquest-app
npm install
npx expo start
```

The repository targets **Expo SDK 57**, React Native 0.86, and React 19.2. Dependency versions follow the current SDK 57 default template, with `expo-sqlite` added for persistent local storage.

## POC 1 — working loop

- Today dashboard with level, XP, streak, recommended workout and quest progress
- Train screen with Push / Pull / Legs / Endurance templates
- Active lifting logger with editable weight + reps
- Previous-set reference
- PR markers
- Auto-start 90-second rest timer
- Live workout tonnage
- Session XP and Strength XP calculation
- SQLite persistence for sessions, sets, XP events and attribute events
- Local sync outbox
- Post-workout progression result
- Hero screen
- Quest board
- Armory locked / in-progress / unlocked states

## Progression model

Character XP is intentionally separated from raw tonnage.

```text
Completion XP = 100
Work XP       = 6 × completed sets
Duration XP   = min(60, floor(duration minutes × 1.25))
PR XP         = 30 × PR count
Streak XP     = min(50, streak days × 5)
```

Strength XP for lifting sessions:

```text
Strength XP =
  12
  + 3 × completed sets
  + min(40, floor(total volume / 1500))
  + 10 × PR count
```

Game formulas live in `src/gameEngine.ts`.

## Data architecture

The local database is the first-write source during a workout:

```text
UI
↓
SQLite
↓
sync_outbox
↓
Supabase
```

`supabase/schema.sql` defines the first cloud contract for:

- profiles
- workout templates and template exercises
- workout sessions and exercise sets
- cardio activities
- XP and attribute event ledgers
- reward definitions and user rewards
- quest definitions and user quests
- ownership indexes and Row-Level Security

The cloud trust boundary is intentional: clients write raw training facts, while authoritative XP, attributes, quest state and rewards are designed to be written by a trusted evaluator after sync.

The schema is **prepared but not yet applied to a live Supabase project**.

## Next build slice

1. Supabase authentication
2. SQLite → Supabase outbox sync
3. Trusted workout evaluator for authoritative XP and rewards
4. Make Hero values derive from completed workouts
5. Reconciliation between optimistic local progression and cloud-authoritative progression

## Deferred until the core loop is validated

- HealthKit / Health Connect
- GPS run ingestion
- background notifications
- full character art and equipment renderer
- social parties and cooperative boss battles
