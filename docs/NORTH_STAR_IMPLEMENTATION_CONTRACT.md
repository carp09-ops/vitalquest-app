# VitalQuest North Star Implementation Contract

Status: **NON-NEGOTIABLE**

The approved VitalQuest concept board is the visual source of truth. Production UI must reproduce its look and feel rather than reinterpret it as a conventional fitness application.

## Prime directive

VitalQuest must read as an **RPG first and a fitness product second**.

Do not replace illustrated RPG presentation with generic cards, plain gradients, dashboard tiles, or color-only skinning.

## Shared screen anatomy

The three worlds use the same functional information hierarchy. Their differentiation comes from artwork, framing, material language, typography, symbols, lighting, and reward presentation.

Do not invent materially different information layouts per skin unless required for responsive behavior.

### Today
1. Illustrated world/hero scene occupying the visual top of the experience.
2. Greeting / identity statement integrated into the art.
3. Large central Level medallion / circular progression display.
4. Four attribute/status medallions beneath the level.
5. Today's Quest as a framed contract/reward panel.
6. RPG framing and ornamental chrome around the entire composition.
7. Fitness numbers remain visible but are subordinate to character progression and quest framing.

### Train
1. 'Choose your trial/protocol/operation' framing.
2. Large illustrated workout card with character/action artwork.
3. Discipline/category tabs.
4. Workout name, purpose and exercise preview embedded into the RPG card.
5. Strong themed primary CTA.

### Workout
1. Functional logger remains clean and fast.
2. Exercise header uses themed RPG frame.
3. Large circular rep/set interaction is the visual focus.
4. Rest timer appears as a dedicated game system module.
5. Completion is theatrical: XP, attribute gain, streak, PR, quest advancement and reward reveal.

### Quests
1. Main Quest begins with illustrated key art.
2. Main quest contract and progression bar.
3. Daily/weekly quests appear as mission rows with reward icons and completion state.
4. Completed quests communicate prestige and permanence.

### Armory
1. Must look like an inventory/equipment vault, never Settings.
2. Gear slots and item art dominate.
3. Rarity language: Common / Uncommon / Rare / Epic / Legendary.
4. Item inspection card with explicit reward effect and Equip action.
5. Themes live as world skins inside the Armory but must be previewed as artwork, not swatches alone.

### Hero
1. Character art dominates the upper half.
2. Title/class/rank appear as RPG identity.
3. Level medallion overlays or anchors the portrait.
4. Attributes appear as character stats, not analytics.
5. Active title / equipment / achievements reinforce build identity.

## World art direction

### Mythic Forge
- Heroic fantasy citadel, forge fire, armor, dark mountain silhouettes.
- Gold ornamental frames, engraved metal, warm rim light, dark stone.
- Serif/display typography for major identity moments.
- Crest, shield, sword, flame, hammer and rune visual vocabulary.

### Celestial Pulse
- Sci-fantasy citadel, orbiting bodies, astral portals, luminous hero silhouettes.
- Cyan/blue glass frames with luminous edge lines and cosmic depth.
- Clean futuristic display typography.
- Orbital glyph, crystal, star, energy ring and constellation vocabulary.

### Titan Core
- Industrial performance bunker, arena lighting, training warrior imagery.
- Crimson rails, black carbon/steel surfaces, sharp rectangular framing.
- Condensed athletic typography.
- Gauntlet, plate, power, impact and engineered geometry vocabulary.

## Artwork requirement

Every primary screen must contain at least one meaningful illustrated/key-art region. Background gradients and textures do **not** satisfy this requirement by themselves.

Artwork must support the content and world identity:
- character / hero
- environment
- quest subject
- gear / reward
- training discipline

## UI chrome requirement

The board uses ornate and highly intentional chrome. Production components must include:
- themed border treatment
- corner ornaments / rails / notches
- rarity/reward accents
- medallions and seals
- section title framing
- layered surfaces

A plain rounded rectangle with a 1px border is not an acceptable final RPG component.

## Typography

Typography is part of the skin.

- Mythic Forge: dramatic serif/display title treatment + compact utility sans.
- Celestial Pulse: clean futuristic display treatment + high-legibility utility sans.
- Titan Core: condensed/athletic uppercase display treatment + utility sans.

## Validation checklist

Before calling any screen visually complete, verify:
- Would a user call this a game interface without being told?
- Is there meaningful artwork above the fold?
- Does the primary progression object feel like an RPG level/progression device?
- Are quests framed as missions/contracts rather than tasks?
- Do rewards look collectible?
- Does the selected world change artwork/material language, not just color?
- Does the screen visually resemble the approved board at a glance?

If any answer is no, the screen is not visually complete.
