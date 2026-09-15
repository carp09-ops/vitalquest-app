# VitalQuest Production Asset System

VitalQuest renders in four layers, in this order:

1. **ART LAYER** — cinematic artwork only. No baked-in level, XP, quest, workout, stat, navigation, timer, or reward text.
2. **MATERIAL / CHROME LAYER** — frames, metals, glass, engraved edges, borders, vignettes, glows, separators, and world-specific surface treatments.
3. **LIVE DATA HUD** — React-rendered level, XP, attributes, streaks, workout prescriptions, quest progress, reward values, and status.
4. **INTERACTION LAYER** — motion, pressed states, transitions, haptics/native hooks, timers, and navigation.

## Three world identities

### Mythic Forge
Dark stone, scorched mountains, forged iron, warm bronze/gold, ember light, monumental fantasy architecture, weathered leather, heraldic medallions.

### Celestial Pulse
Luminous sky realms, floating architecture, astral observatories, pearl/silver materials, translucent blue-white energy, elegant celestial geometry, restrained cosmic glow.

### Titan Core
Monolithic near-future training citadels, black alloy, machined titanium, engineered cyan energy, industrial scale, hard precision, dense technical materials.

A skin changes the world itself — environment art, materials, icon treatment, framing, lighting, transition behavior, and atmosphere. It is never a color-only theme.

## Required art families per world

- Today hero / campaign environment
- Workout focus environments for Push, Pull, Legs, Cardio / Run
- Quest-chain key art
- Reward / milestone medallions
- Armory item art: helm, chest, boots, bracers, weapon / relic, aura
- Attribute icon family: Strength, Stamina, Agility, Vitality / Discipline
- XP and level medallions
- Streak and achievement art
- Loading / transition environment plate
- Empty, locked, rare, epic, legendary item states

## Production rules

- Raster cinematic art should be WebP or AVIF where platform support permits.
- Produce wide and portrait-safe compositions rather than relying on a single crop.
- Keep focal subjects away from live-data safe zones.
- No dynamic UI text inside artwork.
- No emoji art.
- No primitive CSS/SVG illustration used as replacement for commissioned/generated artwork.
- Simple geometry is allowed only as HUD chrome, layout, masks, progress tracks, glows, and interaction feedback.
- Every asset needs a clear semantic name, world, usage, aspect target, and safe-area notes.

## Today quality gate

Today is the North Star. Train, Quests, Armory, and Hero do not receive a full visual rebuild until Today passes phone and iPad visual QA and reads immediately as an RPG even with fitness-specific labels removed.
