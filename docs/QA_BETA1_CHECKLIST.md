# VitalQuest Beta 1 QA Checklist

## QA contract
A screen is not considered visually complete because the code exists. It must render correctly in the deployed build, load its repo-backed artwork, and match the approved cinematic/RPG direction on iPhone and iPad.

## 1. Onboarding
- Welcome art loads with no blank or stretched regions.
- Choose Your World renders Mystic / Athlete / Spartan artwork correctly.
- World selection changes the active visual identity.
- Archetype screen renders hero art without distortion.
- Equipment uses structured selection and fits mobile without clipping.
- Arc goal / days / experience persist.
- Reset baseline / recalibrate works without wiping progression.
- Calibration loading screen renders artwork and transitions correctly.

## 2. Today
- Cinematic hero/world art loads from repo-backed assets.
- Primary quest/session CTA is clearly dominant.
- Level and status medallions render cleanly.
- Arc progress never exceeds intended bounds.
- Today links to Training / Progress correctly.
- No dashboard-first regression.

## 3. Training
- Cinematic training hero loads.
- Recommended session is clear and actionable.
- 7-day plan renders correctly.
- Adaptive Builder opens and returns a valid generated plan.
- Custom Workout builder opens and produces a valid session.
- Equipment/loadout route opens and saves changes.

## 4. Goals
- Main quest art loads.
- Goal hierarchy is visually clear.
- Goal progress and completion state persist.
- No generic card-only regression.

## 5. Rewards
- Vault / collection presentation renders correctly.
- Reward states and rarity treatments are legible.
- Claimed / locked state persists.
- No generic icon-list regression.

## 6. Progress
- Hero/evolution identity is the dominant visual.
- Level, XP, form, attributes, and lifetime record render correctly.
- Switching world/archetype keeps progression data intact.
- Insights route opens correctly.

## 7. Insights
- Command-center hero renders.
- XP trust ledger values load.
- Fatigue / deload signal loads.
- Session trend renders without overflow.
- Exercise signals and recent encounters load.

## 8. Active workout
- Encounter shell renders before/around live workout UI.
- Prescribed sets and weights populate.
- Set completion works.
- PR toggle works.
- Rest timer works.
- Finish requires at least one completed set.
- Workout saves successfully.
- XP trust / awarded XP is calculated and displayed.

## 9. Generated workout
- Generated plan opens from Adaptive Builder.
- Encounter art loads.
- Set tracking works.
- Finish saves to the same progression ledger.
- Completion screen displays XP and progression recap.

## 10. Completion / rewards
- Completion state feels like a victory/reward moment.
- XP banked is visible.
- Attribute gains are visible.
- Progression recap is legible.
- Navigation back to Progress works.

## 11. Verification + Beta Feedback
- Verification route renders inside the cinematic trust shell.
- Beta Feedback renders inside the V3 field-report shell.
- Feedback category selection works.
- Feedback notes save locally.

## 12. Art-loading regression test
- No production screen relies on base64/data-URI artwork.
- All production art is loaded from repo-backed files.
- No blank images on GitHub Pages.
- No distorted/stretching images.
- `cover` crops preserve intended focal subject.

## 13. Responsive QA
Test at minimum:
- iPhone portrait
- iPhone landscape where supported
- iPad portrait
- iPad landscape

Verify:
- no text clipping
- no hidden CTAs behind bottom navigation
- no horizontal overflow
- no distorted art
- no unreadable overlays
- touch targets remain usable

## 14. Persistence / refresh
- Hard refresh does not lose onboarding/profile state.
- Closing and reopening preserves selected world and progression.
- Completed workouts persist.
- Equipment persists.
- Goal/Arc state persists.

## Blockers for Beta 1
Any of the following blocks the QA build:
- build/typecheck/export failure
- blank artwork
- broken onboarding
- cannot start or complete a workout
- workout does not save
- navigation trap
- major mobile overflow or hidden CTA
- progression data corruption

## Visual polish that may remain after Beta 1 starts
These can continue during QA if core flows are stable:
- bespoke reward artifact renders
- per-workout encounter art variants
- richer Athlete / Spartan hero evolutions
- completion/victory scene variants
- secondary animation polish
