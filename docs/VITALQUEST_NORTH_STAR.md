# VitalQuest Visual North Star

Status: **locked direction for the fresh redesign**  
Scope of first implementation pass: **Today only**  
Core navigation: **Today · Train · Quests · Armory · Hero**

## Product visual thesis

VitalQuest is a fitness RPG, not a fitness dashboard with fantasy decoration. Every screen must communicate game-world identity before it communicates data. Real fitness data should feel native to an RPG HUD: progression, attributes, quests, rewards, streaks and inventory are game systems powered by real effort.

The rendering stack is fixed:

**ART LAYER → MATERIAL / CHROME LAYER → LIVE DATA HUD → INTERACTION LAYER**

Artwork is environmental and cinematic. Dynamic copy and data are always live UI. Artwork never contains user names, current stats, XP values, quest state, workout names or any other dynamic product content.

## Quality bar

The target is premium AAA-game-inspired UI:

- cinematic environmental artwork with depth, atmosphere and focal lighting
- illustrated / rendered game-quality icons, medallions, reward badges and inventory items
- translucent but substantial HUD materials with edge treatments and layered borders
- typography that feels authored for a game interface rather than a generic SaaS product
- careful density: large moments of art, compact information plates, strong hierarchy
- physical depth through shadow, glow, internal highlights, texture and separation
- micro-motion for reveal, XP change, level-up, reward unlock, selection and press states
- responsive composition built independently for mobile and iPad / desktop widths

Do **not** substitute primitive CSS illustrations, emojis, generic flat cards, simplistic SVG artwork, or color-only theme swaps for visual production.

## Three world skins

All worlds share the same information architecture and data contracts. They do not share the same art direction.

### Mythic Forge

**Fantasy / iron / ember / mastery**

- Environment: volcanic citadels, mountain foundries, warrior silhouettes, smoky sunrise
- Materials: blackened steel, carved iron, burnished brass, worn leather, ember glass
- Lighting: warm directional firelight against charcoal shadow
- Icon language: heraldic medallions, embossed metal, engraved symbols
- Motion: ember drift, heat bloom, deliberate heavy reveal
- Typography: high-contrast classical display face paired with compact technical labels
- Core emotional signal: earned strength

### Celestial Pulse

**Luminous / elevated / rhythmic / restorative**

- Environment: floating celestial architecture, cloud cities, luminous sky bridges
- Materials: pale metal, crystal, opalescent glass, soft illuminated inlays
- Lighting: cool high-key atmosphere with radiant highlights and violet-blue depth
- Icon language: astral seals, polished luminous medallions, orbit / wing motifs
- Motion: soft pulse, parallax drift, graceful light sweep
- Typography: elegant modern display with airy letterspacing
- Core emotional signal: ascent through consistency

### Titan Core

**Industrial / orbital / engineered / relentless**

- Environment: orbital megastructure, vertical reactors, dark futuristic fortress architecture
- Materials: carbon ceramic, gunmetal, machined alloy, cyan energy channels
- Lighting: cold hard edge light with controlled amber reactor accents
- Icon language: military-industrial insignia, machined badges, compact telemetry
- Motion: scan sweep, energy surge, fast mechanical transitions
- Typography: condensed technical display plus neutral telemetry labels
- Core emotional signal: engineered capability

## Today screen composition

Today must make the app read as a real game in the first second.

### 1. World header
- VitalQuest wordmark
- short brand creed
- compact three-world skin control
- no dashboard-style utility clutter

### 2. Cinematic hero
- dominant art plate
- current campaign / realm overline
- authored motivational headline
- live hero identity HUD
- level medallion + XP progress
- four attribute plates
- streak / workout / quest mini-metrics

On iPad / desktop, art and HUD sit in a single cinematic composition. On mobile, the artwork remains dominant while HUD modules stack below it without losing material continuity.

### 3. Today’s Focus
- real workout artwork
- live workout title and muscle-group summary
- exercise count, duration and XP
- unmistakable primary Start Workout CTA

### 4. Active Quest
- quest medallion / art
- live quest goal
- progress + reward
- jump to quest chain

### 5. Daily Rituals
- lightweight daily behavior objectives
- streak state
- fast visual completion scan

### 6. Weekly progression
- workouts
- total volume
- distance
- XP gained
- later connected directly to stored workout data

### 7. VitalQuest principle
A compact authored statement reinforcing that in-game progression is earned through real-world action.

## Asset system

### Environmental art
Naming:
- `world/<world>/today/hero`
- `world/<world>/train/hero`
- `world/<world>/quests/hero`
- `world/<world>/armory/hero`
- `world/<world>/hero/hero`

Requirements:
- no baked-in UI or dynamic text
- composition leaves intentional zones for HUD
- source master at 4K landscape plus portrait-safe crop
- atmosphere must survive center / cover cropping

### Gameplay iconography
Families:
- attributes: Strength, Stamina, Agility, Vitality / Discipline
- navigation: Today, Train, Quests, Armory, Hero
- systems: XP, level, streak, trophy, reward, timer, volume, distance
- quest rarity / state
- inventory rarity / slot
- achievement badges

Icons should be delivered as rendered raster assets or detailed production vectors intended as icons, not improvised geometric illustrations.

### Reward and inventory art
Each collectible receives:
- unlocked artwork
- locked silhouette
- rarity treatment
- optional glow / animated aura
- small-grid crop
- detail-view crop

### Material kit
Each world owns:
- primary panel material
- elevated panel material
- inset plate
- button surface
- active navigation treatment
- border / trim behavior
- glow behavior
- locked-state treatment

Material can be composed with CSS / React Native primitives because it is chrome, not artwork. It must remain subordinate to the art layer.

## Typography hierarchy

1. **World / hero display** — cinematic, expressive, largest
2. **Module title** — strong authored game UI
3. **HUD numeric** — compact, extremely legible
4. **System label** — uppercase, tracked, small
5. **Body / help text** — readable, quiet, secondary

Never let tiny labels become the primary way information is understood.

## Responsive rules

### Mobile
- hero artwork first
- HUD stacks with 2×2 attribute grid
- one-column major modules
- large thumb-safe primary CTA
- persistent bottom nav
- no horizontal overflow

### iPad / wide web
- one cinematic hero frame with art left and HUD right
- three-column Focus / Quest / Ritual composition
- four-column weekly progression
- preserve large artwork rather than stretching mobile cards across empty width

## Motion language

Initial target:
- skin change: art / HUD reveal with short spring
- CTA press: 1–2% compression + light response
- XP: animated fill and numeric transition
- stat change: short bar interpolation
- level-up: full-screen announcement, restrained particle / light treatment
- reward unlock: medallion reveal, rarity flare, haptic on native

Motion should feel expensive and intentional. Avoid constant ambient motion that competes with workout logging.

## Data and implementation boundaries

The Today redesign is a presentation layer over existing / future product logic. The visual system must not hard-code data into images. Today can use temporary seeded values while the data contracts are being connected, but every visible statistic remains React text / UI.

Initial live-data contract to formalize next:
- hero level / XP
- mapped attribute values
- active streak
- weekly workout count
- weekly volume
- weekly endurance distance
- active quest progress
- Today workout prescription
- daily ritual completion state

## Acceptance gate before other screens

Do not redesign Train, Quests, Armory or Hero until Today passes these checks:

- first impression reads as an RPG without explanation
- artwork is dominant and production-quality
- live HUD remains readable over / beside artwork
- mobile and iPad layouts both feel intentionally designed
- skin switching changes environmental identity, not merely color
- navigation icons look like game assets, not placeholder symbols
- primary workout action is obvious in under two seconds
- no dynamic text is baked into art
- no regression in the Start Workout route
- no simplistic SVG / emoji / CSS-shape artwork is introduced

Once Today is accepted, the same layer model and asset taxonomy becomes the template for the remaining screens.
