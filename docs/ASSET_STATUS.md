# VitalQuest Asset Status

This file is the live inventory for production artwork. It is intentionally explicit so the repo reflects what is actually available versus what remains placeholder work.

## Production baseline assets

- Branding / PWA icon family — pending binary asset commit
- Mythic Forge hero art — pending binary asset commit
- Mythic Forge world art — pending binary asset commit
- Celestial Pulse world art — pending binary asset commit
- Titan Core world art — pending binary asset commit
- Training hall art — pending binary asset commit
- Quest gate art — pending binary asset commit

## Existing legacy / interim assets

- `public/art/premium/mythic-hero.jpg`
- `public/art/premium/mythic-quest.jpg`
- `public/art/today-celestial-premium.webp`
- `public/art/today-titan-premium.webp`
- SVG world/theme artwork under `public/art/`

These should be treated as interim assets once the production baseline above is committed and wired.

## Still needed for the North Star

- Push encounter art
- Pull encounter art
- Legs encounter art
- Run / endurance encounter art
- Recovery encounter art
- Forge chamber art
- Hero profile environment / portrait art by world
- Armory item art: helm, chest, bracers, boots, relic, aura
- XP / level / quest / streak / recovery / milestone medallions
- Loading / transition plates
- Locked / rare / epic / legendary visual states
- Portrait-safe and landscape-safe variants for major environments

## Implementation rule

Screens should use the shared asset map in `src/artAssets.ts` rather than hard-coded URLs. Dynamic data remains live React UI layered over artwork.
