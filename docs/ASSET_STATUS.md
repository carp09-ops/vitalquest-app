# VitalQuest Asset Status

This file is the live inventory for production artwork so the repo reflects what is actually available versus what remains to reach the North Star.

## Implemented production baseline

- PWA / Home Screen icon family under `public/assets/branding/`
- Mythic Forge hero art — `public/art/v1/mythic-hero.webp`
- Mythic Forge world art — `public/art/v1/mythic-world.webp`
- Celestial Pulse world art — `public/art/v1/celestial-world.webp`
- Titan Core world art — `public/art/v1/titan-world.webp`
- Training hall art — `public/art/v1/training-hall.webp`
- Quest gate art — `public/art/v1/quest-gate.webp`
- Shared asset registry — `src/artAssets.ts`
- PWA manifest icon wiring and Apple Home Screen metadata
- Cache refresh strategy updated so new visual releases are not trapped behind the original static shell cache

## Current web compatibility wiring

Today, Train and Hero still contain some legacy asset URLs. For this visual catch-up release, those legacy public paths are intentionally populated with the new production imagery so the current UI receives the artwork immediately without destabilizing the screen components.

The next visual refactor should move every screen to `src/artAssets.ts` and then retire the legacy URLs.

## Legacy / interim files still in the repo

- SVG world/theme artwork under `public/art/`
- Earlier lightweight raster files and compatibility paths
- Temporary `.base64.txt` staging files under `public/art/v1/`; safe to remove after the asset migration is fully settled

These are not the visual North Star and should not be used for new screens.

## Still needed for the North Star

- Dedicated Push encounter art
- Dedicated Pull encounter art
- Dedicated Legs encounter art
- Dedicated Run / endurance encounter art
- Recovery encounter art
- Forge chamber art
- Dedicated Celestial and Titan hero/training/quest compositions
- Hero profile environment / portrait art by world
- Armory item art: helm, chest, bracers, boots, relic, aura
- XP / level / quest / streak / recovery / milestone medallions
- Loading / transition plates
- Locked / rare / epic / legendary visual states
- Higher-resolution master compositions with portrait-safe and landscape-safe crops

## Quality note

The newly supplied artwork is now the real Beta 1 visual baseline, but several source tiles are relatively small. They are appropriate for getting the web app visually aligned quickly; they are not yet the final full-resolution AAA production masters for every device and crop.

## Implementation rule

New visual work should use the shared asset map in `src/artAssets.ts`. Dynamic level, XP, quests, workout values, timers and rewards remain live React UI layered over artwork rather than baked into image files.
