# VitalQuest North Star

Status: **LOCKED PRODUCT DIRECTION**

VitalQuest is a real-world fitness RPG. The product should feel like a premium game whose inputs happen to be real training, not a fitness tracker with decorative gamification.

## Core UX principle

**The skeleton stays fixed. The skin changes.**

All themes share the same information architecture, interaction patterns, spacing logic, progression hierarchy, and navigation. A theme may change colors, typography treatment, textures, imagery, icon treatment, glow/material language, and copy flavor — never where core actions live.

## Primary navigation

1. **Today** — daily command center
2. **Train** — choose/start training and enter the active logger
3. **Quests** — daily, weekly, and main objectives
4. **Armory** — gear, badges, titles, and themes
5. **Hero** — level, XP, attributes, records, and long-term identity

## Screen blueprint

### Today
Purpose: answer three questions instantly — *What should I do? How am I doing? What am I chasing?*

Required hierarchy:
- VitalQuest wordmark / current level
- contextual greeting or daily statement
- dominant daily progress ring
- four quick signals: movement, training, recovery, quest/energy signal
- recommended workout CTA
- streak / momentum block
- active quest preview
- immediate route to Train

The Today screen should feel like a game hub, not an analytics dashboard.

### Train
Purpose: get into useful training with minimal friction.

Required hierarchy:
- workout mode / template categories
- recommended template
- recent templates
- estimated duration / working-set preview / XP opportunity
- clear Start action
- create/customize template action

### Active Workout Logger
Purpose: disappear into the background while the user is training.

Required hierarchy:
- compact session header and Finish action
- unobtrusive rest timer
- exercise identity and previous performance
- weight / reps / RPE or completion interaction
- fast set completion
- add exercise action
- live session volume / set count
- completion payoff screen with XP, stat gain, PRs, quest progress, streak effects

Rule: **training is focused; rewards are theatrical.**

### Quests
Purpose: translate healthy behavior into clear short- and medium-term objectives.

Required hierarchy:
- Main Quest hero card
- Daily quests
- Weekly / multi-session quests
- completed history
- reward preview
- progress bars / objective counts

Future: guild and cooperative quests layer into this screen rather than creating a separate app section.

### Armory
Purpose: make achievement tangible and personalization desirable.

Tabs:
- Gear
- Badges
- Titles
- Themes

Themes are first-class Armory items, not buried in Settings. In the MVP, all three North Star skins are available immediately so users can choose an identity without artificial friction.

### Hero
Purpose: make the user's long-term physical journey feel like a character sheet.

Required hierarchy:
- Hero identity / active title / class
- level and XP progression
- five attributes: Strength, Stamina, Agility, Power, Discipline
- streak and session count
- career stats
- achievements / titles
- recent progression events

## North Star theme skins

### Mythic Forge
**Brand line:** Forged in discipline. Rewarded like a legend.

Mood: premium fantasy, forged metal, dark stone, warm cinematic light, restrained heraldry.

Palette:
- Obsidian `#0B0F14`
- Iron `#1A232E`
- Parchment `#F3EBDD`
- Molten Gold `#D6A04C`
- Ember Red `#B85B4B`
- Moss Steel `#5F7C73`

Material language: forged steel, dark rock, leather, gold etching, banners, subtle ember glow.

### Celestial Pulse
**Brand line:** Precision training under a cosmic horizon.

Mood: celestial, luminous, glass HUDs, eclipse glow, scientific optimism, soft depth.

Palette:
- Midnight Navy `#0D1321`
- Eclipse Blue `#1D3557`
- Lunar Silver `#D9E3F0`
- Solar Amber `#F2B950`
- Aurora Teal `#49A7A3`
- Energy Coral `#E76F51`

Material language: deep space, eclipse light, layered glass, star-map linework, brushed metal.

### Titan Core
**Brand line:** Built for power. Measured with purpose.

Mood: athletic, aggressive, modern, performance-first, monumental without becoming gamer-neon.

Palette:
- Carbon Black `#0A0A0B`
- Basalt `#23262D`
- Bone White `#EDE7DA`
- Crimson Iron `#9F3E44`
- Electric Lime `#9ACD32`
- Steel Blue `#5C7EA6`

Material language: carbon fiber, stone, brushed steel, sparks, hard-edged performance graphics.

## Shared component system

Every screen should be built from reusable primitives:
- AppShell
- BrandHeader
- SectionHeader
- SurfaceCard
- HeroCard
- ProgressRing
- ProgressBar
- StatTile
- QuestCard
- WorkoutCard
- ExerciseRow
- RewardTile
- ThemeCard
- SegmentedTabs
- PrimaryAction
- BottomNavigation

Components consume semantic theme tokens. Screens must not hard-code theme-specific hex values.

## Theme token contract

Each theme supplies semantic tokens for:
- background
- surface
- surfaceElevated
- border
- text
- muted
- accent
- accentSoft
- secondary
- positive
- danger
- strength
- stamina
- agility
- power
- discipline
- navBackground
- heroSurface

## Rollout

### North Star Pass 1
- semantic theme architecture
- persistent theme selection
- navigation ordering
- Today rebuilt to mockup hierarchy
- Armory Theme Vault

### North Star Pass 2
- Train + active logger rebuild
- reward/completion animation architecture

### North Star Pass 3
- Quests + Hero rebuild
- all five screens fully theme-reactive

### North Star Pass 4
- image/texture assets per theme
- polished animation and transitions
- responsive iPad / phone tuning

## Guardrails

- No generic neon gamer UI.
- No raw analytics-first homepage.
- No theme-specific screen forks.
- No pay-to-win equipment.
- No visual flourish that makes gym-floor logging slower.
- RPG language should elevate real effort, never obscure what the user actually did.
