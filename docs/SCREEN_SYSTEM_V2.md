# VitalQuest Screen System V2

## Product Rule
VitalQuest uses one clean, premium app shell. Mystic, Athlete, and Spartan are hero archetypes, not full-app themes. The shell stays consistent across Today, Train, Quests, Armory, Hero, Insights, setup, and workout logging. Archetype expression is concentrated in the Hero system, character renders, gear, progression, unlocks, and restrained accent treatments.

## Global Shell

### Visual language
- Deep obsidian background
- Graphite and slate elevated surfaces
- Soft ivory primary text
- Muted steel secondary text
- Thin metallic borders
- Limited glow, used only for progress, focus, and hero-state emphasis
- One icon family with consistent stroke weight and angular HUD influence
- No mystical full-screen wallpaper as a default shell treatment
- No archetype-specific global navigation themes

### Navigation
- Floating bottom HUD rail
- Neutral dark base
- Active item uses a restrained accent line and brighter icon/text
- Today, Train, Quests, Armory, Hero icons remain archetype-neutral
- Safe-area aware on iPhone and iPad

### Core component hierarchy
1. Page header
2. Primary action or dominant module
3. Progress / status module
4. Supporting modules
5. Utility / secondary actions

### Archetype accent rules
- Mystic: teal/cyan with muted violet secondary
- Athlete: electric blue with silver/white; prestige gold only for milestone moments
- Spartan: bronze with weathered iron; restrained crimson for battle/prestige accents
- Archetype accents should never repaint the whole app shell

---

# TODAY

## Purpose
Daily command center. It should answer: what should I do today, what did I accomplish, and how is my hero progressing?

## Top section
### Header
- VitalQuest wordmark / compact logo
- Current level and XP progress
- Small hero archetype crest, not a themed background
- Optional streak indicator

### Primary module: Today's Mission
The dominant card on the screen.

Contains:
- Recommended workout or recovery action
- Why VitalQuest recommends it
- Expected XP range
- Primary attribute(s) likely to improve
- CTA: START ENCOUNTER

The recommendation should read as a fitness decision first and a game action second.

## Secondary module: Hero Momentum
Compact hero-progress preview, not the full Hero screen.

Contains:
- Small current hero portrait/render
- Current title
- Dominant attribute
- Nearest evolution threshold
- Example: `42 Strength XP to Power Tier III`

CTA: VIEW HERO

## Daily ledger
Four compact stats:
- Training logged today
- Resistance this week
- Recovery this week
- Current streak

Keep these clean and data-first.

## Active quests preview
Show 2–3 highest-relevance quests only.
- progress bar
- reward / unlock indicator
- no oversized fantasy treatment

CTA: VIEW ALL QUESTS

## Today should not contain
- giant world artwork
- three skin selectors
- dense analytics
- full Armory inventory

---

# TRAIN

## Purpose
Workout selection, workout generation, and entry into active encounters.

## Header
- TRAIN
- Short subcopy: `Choose the work. VitalQuest handles the progression.`

## Primary section: Recommended Encounter
Large clean card based on training intelligence.

Contains:
- Recommended modality / workout
- Why recommended
- Estimated duration
- Primary attributes affected
- Expected XP range
- START button

## Workout paths
Use a clean segmented or stacked selection system:
- Strength
- Endurance
- Recovery
- Forge Workout
- Custom Workout

### Strength
- Push
- Pull
- Legs

Each card should show:
- duration
- focus
- prior performance summary when available
- progression cue

## Forge
The Forge remains special, but the shell stays clean.
- AI-generated session
- clear constraints
- target XP / training goal
- equipment aware
- no magical furnace UI required

The word “Forge” can remain as product language without forcing the entire app into fantasy styling.

## Active encounter flow
Long term, convert to a guided workout flow:
1. Exercise intro
2. Active set entry
3. Rest state
4. Next set / next exercise
5. Finish encounter
6. XP + hero growth recap

For Beta 1, the current logging screen can stay temporarily.

## Train should not contain
- hero full-screen art
- giant world scenes
- archetype-specific workout UI

The workout engine is universal across all archetypes.

---

# QUESTS

## Purpose
Give training consistency and long-term goals a game structure.

## Header
- QUESTS
- Weekly completion summary
- Small rank / progress crest

## Quest categories
Use clear tabs or sections:
- Daily / Weekly
- Progression
- Milestones
- Hero Advancement

## Quest card anatomy
- Quest name
- concise description
- progress / target
- progress bar
- reward
- status: active / complete / claimed

## Examples
- Iron Week — complete 3 resistance sessions
- Five Ton Trial — move 10,000 lb this week
- Long Road — accumulate 15 lifetime miles
- Restoration Ritual — complete 3 recovery sessions
- Hero Advancement — reach next Strength visual tier

## Reward presentation
Rewards can include:
- XP
- title
- gear unlock
- hero cosmetic state
- archetype-specific item

The quest system itself remains visually neutral; archetype flavor appears in the reward.

## Completion animation
Use a short premium completion treatment:
- progress bar resolves
- restrained accent pulse
- reward reveal
- optional hero-change link

---

# ARMORY

## Purpose
Show what the user has earned and how progression changes the hero visually.

This is one of the strongest archetype-expression areas.

## Header
- ARMORY
- Current archetype
- Equipped / unlocked summary

## Hero loadout preview
Top module shows current character with equipped visual state.

Slots:
- Head
- Chest
- Arms
- Legs
- Primary
- Secondary
- Aura / prestige effect

Not every archetype needs literal armor in every slot. The slots represent visual loadout categories.

## Archetype translation
### Mystic
- enchanted clothing / armor
- relics
- runes
- weapons / magical tools
- aura effects

### Athlete
- performance kit
- footwear
- compression / training layers
- medals / bands / elite accessories
- prestige effects

### Spartan
- helm
- chest armor
- bracers
- greaves
- spear / sword
- shield
- battle markings / aura

## Item card anatomy
- item image/render
- name
- category
- locked / unlocked / equipped state
- unlock condition
- rarity or prestige only if meaningful

## Important rule
Armory items are earned from actual training progression, quests, milestones, and archetype evolution. Avoid arbitrary loot-box behavior.

## Locked items
Show exactly what is required:
- `120 Strength XP remaining`
- `Complete 4 more recovery sessions`
- `Reach Hero Form IV`

---

# HERO

## Purpose
The centerpiece of VitalQuest. This is where the user's training becomes a visible character.

## Top hero stage
Largest visual module in the app.

Contains:
- Full or 3/4 character render
- Archetype
- Current title
- Level
- Global form tier
- Current equipped visual state

This is where Mystic / Athlete / Spartan should feel dramatically different.

The surrounding shell remains neutral and premium.

## Evolution summary
Directly under the render:
- current form
- next form
- XP remaining to next global evolution
- dominant build identity

Examples:
- `Competitor → Performer`
- `318 XP to next form`
- `Current identity: Power-focused Athlete`

## Attribute growth
Five attributes:
- Strength
- Stamina
- Agility
- Vitality
- Discipline

Each row includes:
- current XP
- visual tier
- description of current appearance effect
- next threshold

Example:
`Strength — Tier II`
`Broader frame / stronger equipment profile`
`42 XP to Tier III`

## Recent evolution
Timeline of meaningful changes only:
- Strength Tier I → II
- New title unlocked
- Chest gear evolved
- Discipline crest unlocked

Do not list every +3 XP event here.

## Train next
Make the growth loop actionable.

Examples:
- `Train Push or Pull to accelerate Strength`
- `1 endurance session could reach Stamina Tier III`
- `2 streak days until Discipline prestige unlock`

CTA can deep-link into Train.

## Archetype selector
Accessible from Hero, not global navigation.

Rules:
- user can choose Mystic / Athlete / Spartan
- selection persists
- changing archetype changes visual translation, not earned XP
- progression history remains intact

If archetype switching is allowed freely, show it as “Change Hero Path,” not “Change Theme.”

---

# POST-WORKOUT GROWTH SUMMARY

## Purpose
Close the core loop immediately after a completed workout.

## Sequence
1. Encounter complete
2. XP banked
3. Attribute gains
4. Evolution recalculated
5. Visible hero changes shown

## Example
`+218 XP BANKED`
`Strength +24`
`Discipline +8`

Then:
`HERO UPDATED`
`Strength Tier I → Tier II`
`New Spartan loadout state: Reinforced Bracers`
`Title progress: 68% to Hoplite`

If no threshold is crossed:
`No new evolution this session`
`38 Strength XP to next visual tier`

The user should always leave knowing how today's work affected the hero.

---

# INSIGHTS / ANALYTICS

## Purpose
Provide deeper fitness intelligence without competing with the game loop.

## Visual direction
- cleanest screen in the app
- data-first
- neutral shell
- minimal archetype styling

Sections:
- volume trends
- workout frequency
- endurance trends
- PRs
- XP trust ledger
- progression history

Hero references can appear only where useful, such as:
`This month's training generated +312 Strength XP.`

---

# SETUP / PROFILE / EQUIPMENT

## Purpose
Utility workflows should stay straightforward.

Use:
- simple section headers
- compact cards
- clear toggles / selectors
- no fantasy scenes

Archetype selection belongs in profile / Hero settings but should preview the character style.

---

# ICON SYSTEM

## Bottom navigation
- Today: beacon / compass pulse
- Train: training crest
- Quests: objective / scroll marker
- Armory: chestplate / loadout symbol
- Hero: champion bust / crest

## Attributes
- Strength: force / bar / power mark
- Stamina: endurance pulse
- Agility: motion / speed mark
- Vitality: life / recovery symbol
- Discipline: rank / consistency crest

## Utility
- XP: clean medallion
- streak: restrained flame / momentum icon
- verification: shield-check
- insights: trend glyph
- lock: standardized lock
- reward: standardized unlock / award

All icons use one consistent family and stroke/weight system.

---

# IMPLEMENTATION ORDER

## Pass 1: shell cleanup
- retire world-heavy tab backgrounds
- define neutral shell tokens
- normalize cards, buttons, typography, borders
- standardize bottom navigation
- standardize icons

## Pass 2: archetype foundation
- persist Mystic / Athlete / Spartan choice
- remove old theme/skin terminology from product UI
- preserve existing XP and progression history
- add restrained archetype accent mapping

## Pass 3: Hero wiring
- connect `heroEvolution.ts` to Hero
- show current form, title, dominant identity, attribute tiers, next thresholds
- add archetype selector

## Pass 4: workout growth loop
- snapshot hero state before workout
- save workout and trusted XP
- recalculate hero state
- compare before/after
- show growth recap

## Pass 5: movement-domain refinement
- add push / pull / legs domain tracking
- use movement domains to influence more specific visual body / gear states

---

# Acceptance Criteria

The redesign is successful when:
1. The app looks coherent regardless of archetype.
2. An Athlete never appears trapped inside a fantasy-themed application shell.
3. A Mystic still feels distinctly magical on Hero / Armory / unlock surfaces.
4. A Spartan feels battle-forged without making utility screens look ancient.
5. Completing a workout changes progression immediately and visibly.
6. The user can explain in one sentence why their hero looks the way it does based on how they train.
7. Existing XP, trust, workout, quest, and progression foundations remain intact.

## Final product statement
**VitalQuest is a premium fitness RPG where real training builds a visible hero. The app stays clean; the hero carries the fantasy.**
