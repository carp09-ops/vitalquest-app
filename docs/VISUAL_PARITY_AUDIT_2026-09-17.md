# VitalQuest Visual Parity Audit — 2026-09-17

Status: ACTIVE REMEDIATION

This audit treats `NORTH_STAR_IMPLEMENTATION_CONTRACT.md` and the approved QA concept board as the visual source of truth.

## Production artwork rule

All production artwork must be committed as real image files in Git and referenced through stable repo-backed paths. Do not introduce new base64/data-URI artwork for production screens.

Preferred source: `public/art/v1/` through `src/artAssets.ts`.

Dynamic UI data remains React UI layered over the art. Text, XP, levels, quest state, workout prescriptions, timers and rewards must not be baked into generated images.

## Shared plumbing

### Repo-backed world backgrounds — REMEDIATED
`WorldArt.tsx` must use `src/artAssets.ts`, not `vitalquestArt.ts` data URIs.

### Repo-backed hero portrait — REMEDIATED
`HeroPortrait.tsx` must use `src/artAssets.ts`, not `vitalquestArt.ts` data URIs.

### Repo-backed loading art — REMEDIATED
`BrandLoadingScreen.tsx` must use `src/artAssets.ts`, not data-URI branding art.

### Onboarding — IN REMEDIATION
Onboarding V4 uses repo-backed art paths. Verify deployed rendering on iPhone/iPad before marking complete.

## Primary screen parity

### Today — NOT VISUALLY COMPLETE
Contract requires: illustrated world/hero scene, greeting integrated into art, central level/progression device, RPG framing, quest/reward hierarchy.

Current screen is functionally strong but still primarily dashboard/card driven. It needs a dedicated cinematic hero/Arc composition above the fold and stronger RPG progression framing.

### Training — NOT VISUALLY COMPLETE
Contract requires: large illustrated workout/action card, discipline framing, workout purpose and preview embedded into a cinematic RPG card, strong themed CTA.

Current screen contains the right recommendation intelligence but lacks the dominant illustrated training composition.

### Active Workout — PARTIAL
The functional logger should remain fast and clean. Visual work still needs themed exercise framing, a more game-like primary interaction, stronger rest module treatment, and theatrical completion/reward reveal.

### Goals / Quests — NOT VISUALLY COMPLETE
Contract requires illustrated main quest key art and mission-contract presentation.

Current screen is data-card driven and has no meaningful key-art region. Add `ART.quest` as the main visual anchor and upgrade mission/reward framing.

### Rewards / Armory — NOT VISUALLY COMPLETE
Contract requires inventory/vault presentation, item art, rarity states, collectible inspection, and art-based skin previews.

Current screen still uses generic icons for most rewards. Dedicated item artwork and rarity treatments are required.

### Progress / Hero — PARTIAL
Current Progress has world artwork and RPG level/form systems, but hero/character art does not yet dominate the upper half as required. World-selection controls also still read more like UI cards than cinematic skin previews.

### Insights — PARTIAL
The approved QA board includes a visual hero/quote/scene module. Current analytics functionality is strong but presentation needs a cinematic visual anchor and better visual hierarchy.

## Missing production art inventory

1. Dedicated Athlete hero portrait/environment master
2. Dedicated Spartan hero portrait/environment master
3. Dedicated Mystic hero portrait/environment master at final resolution
4. Push encounter art
5. Pull encounter art
6. Legs encounter art
7. Endurance/run encounter art
8. Recovery encounter art
9. Rewards/Armory vault environment
10. Armory item art: helm, chest, bracers, boots, relic, aura
11. Quest/main-goal hero composition
12. Progress hero environment by world
13. Insights cinematic landscape/quote plate
14. XP / level / quest / streak / recovery / milestone medallion artwork
15. Locked / rare / epic / legendary visual states
16. Portrait-safe and landscape-safe high-resolution master crops

## Execution order

P0 — artwork reliability
- Eliminate remaining production dependencies on `vitalquestArt.ts`, `worldMystic.ts`, `worldAthlete.ts`, `worldSpartan.ts`, `brandLaunchAsset.ts`, and `brandCalibratingAsset.ts` from active routes/components.
- Route all active art through repo-backed asset maps.

P1 — above-the-fold parity
- Today
- Training
- Goals
- Rewards
- Progress

P2 — system moments
- Active Workout
- Workout completion/reward reveal
- Insights
- Loading/transitions

P3 — asset depth
- Dedicated encounter art
- Item/rarity art
- Medallions and seals
- Per-world final masters

## Definition of done

A visual issue is not complete because an asset exists or a commit mentions it. It is complete only after:

1. The actual deployed build renders the art on iPhone and iPad.
2. Artwork is repo-backed and survives a hard refresh/cache-busted URL.
3. No distortion or unintended stretching is visible.
4. The screen resembles the approved concept board at a glance.
5. The selected world changes artwork/material language, not merely accent color.
6. Meaningful key art appears above the fold on every primary screen.
7. Typecheck, Expo web export and GitHub Pages deploy pass.
