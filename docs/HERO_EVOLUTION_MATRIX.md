# VitalQuest Hero Evolution Matrix

## Product North Star
VitalQuest is a character-evolution fitness RPG. Real workouts create banked XP and attribute XP. Those values directly evolve the user's chosen hero archetype.

**Core loop:** Workout -> Evidence -> Banked XP -> Attribute XP -> Hero evolution -> Visible change.

The three archetypes are not cosmetic skins. They are distinct character fantasies driven by the same underlying progression engine.

- Mystic
- Athlete
- Spartan

## Shared progression model

### Global form tier
Global form uses the existing VitalQuest level curve.

| Form tier | Levels | Meaning |
|---|---:|---|
| 1 | 1-4 | Foundation |
| 2 | 5-8 | Developed |
| 3 | 9-12 | Elite |
| 4 | 13-16 | Mastery |
| 5 | 17+ | Legendary |

Global form controls the hero's primary physique stage, base gear quality, title family and environment prestige.

### Attribute visual tiers
Each existing attribute XP pool has five visual thresholds.

| Attribute tier | XP threshold |
|---|---:|
| 1 | 0 |
| 2 | 100 |
| 3 | 250 |
| 4 | 500 |
| 5 | 900 |

Attributes remain:
- Strength
- Stamina
- Agility
- Vitality
- Discipline

These are specialization layers on top of global form. Two Level 10 users can therefore look meaningfully different if one is strength-dominant and another is endurance-dominant.

## Mystic

| Tier | Title | Physique | Gear | Environment |
|---|---|---|---|---|
| 1 | Wanderer | Unforged adventurer | Travel leathers, dormant charm | Forest threshold |
| 2 | Runebound | Conditioned explorer | Runed bracers, awakened weapon | Ancient rune road |
| 3 | Spell Knight | Battle-ready champion | Enchanted cuirass, active relic | Enchanted stronghold |
| 4 | Realm Guardian | Powerful guardian | Guardian plate, radiant weapon | Guardian citadel |
| 5 | Ascended Champion | Mythic heroic form | Ascendant armor, legendary relic set | Ascendant realm |

### Mystic attribute translation
- Strength: heavier enchanted armor, weapon scale, stronger heroic silhouette
- Stamina: long-road aura, expedition readiness, enduring magical presence
- Agility: ranger-like movement, quickened posture, speed effects
- Vitality: healing glow, restored posture, life-energy aura
- Discipline: sigils, crests, title marks, ascendant prestige

## Athlete

| Tier | Title | Physique | Gear | Environment |
|---|---|---|---|---|
| 1 | Prospect | Developing athletic base | Foundational training kit | Local performance gym |
| 2 | Competitor | Visible training adaptation | Performance training kit | Advanced training center |
| 3 | Performer | Elite balanced build | Elite competition kit | Elite performance lab |
| 4 | All-Star | Professional-caliber physique | All-Star signature kit | Professional arena |
| 5 | Apex Athlete | Apex hybrid athlete | Apex performance set | Championship stage |

### Athlete attribute translation
- Strength: visible muscularity and power-athlete build
- Stamina: leaner conditioning, endurance-ready look, hybrid-athlete identity
- Agility: explosive posture, speed-oriented kit, sharper silhouette
- Vitality: freshness, recovery quality, game-ready presentation
- Discipline: captain marks, professional status, All-Star/franchise prestige

## Spartan

This is an original ancient-warrior archetype inspired by classical Spartan imagery and cinematic battlefield energy, not a reproduction of any copyrighted film character or costume.

| Tier | Title | Physique | Gear | Environment |
|---|---|---|---|---|
| 1 | Recruit | Unseasoned recruit | Training leathers, basic spear | Dust training yard |
| 2 | Hoplite | Hardened combat base | Bronze bracers, round shield | War camp |
| 3 | Shieldbearer | Battle-ready warrior | Hoplite armor, forged spear | Stone proving ground |
| 4 | War Captain | Commanding war physique | Captain armor, battle honors | Fortress battlement |
| 5 | Arena Legend | Legendary warrior form | Legendary war plate, ceremonial arsenal | Legendary arena |

### Spartan attribute translation
- Strength: denser warrior frame, heavier shield/spear presence
- Stamina: campaign conditioning and prolonged battle readiness
- Agility: faster spear stance, mobile shieldwork, skirmisher identity
- Vitality: restored battle condition, resilience, stronger posture
- Discipline: rank marks, unit insignia, captain honors, legendary standard

## Workout-to-growth mapping

### Resistance training
Resistance sessions currently feed Strength XP. That immediately affects all three archetypes' power presentation.

Future refinement should add movement-domain events so visual growth can distinguish:
- Push -> chest / shoulders / triceps / upper-power emphasis
- Pull -> back / biceps / grip / upper-back emphasis
- Legs -> lower-power / stance / base emphasis

Do not fake independent chest/back/leg development until these domains are recorded in the ledger.

### Endurance
- Stamina XP -> conditioning and endurance presentation
- Agility XP -> pace/speed presentation

### Recovery
- Vitality XP -> restored / healthy presentation
- Discipline XP -> prestige and consistency presentation

### Consistency
Discipline should increasingly reflect reliable completion, streaks and repeated training behavior. Competitive or social prestige must continue to respect the XP Trust system rather than awarding status from unverified taps.

## Post-workout growth summary
Every completed session should eventually return a growth delta in addition to raw XP information.

Example:

- +224 Banked XP
- +21 Strength XP
- Strength visual tier advanced 2 -> 3
- Hero update: Power-athlete build unlocked
- Gear update: Elite competition kit available
- Next evolution: 173 Strength XP to Tier 4

The result screen should only claim a visual change when a real threshold was crossed.

## Hero tab requirements
The Hero tab becomes the main progression hub and should show:

1. Current archetype and title
2. Current hero form render
3. Global form tier and next level milestone
4. Five attribute visual tiers
5. Dominant training identity
6. Latest visual evolution
7. Next closest evolution threshold
8. Archetype-specific gear/environment state
9. Recent training-driven changes

## Engine implementation
`src/heroEvolution.ts` is the first deterministic implementation.

It currently derives:
- archetype
- global form tier
- archetype title
- physique descriptor
- gear descriptor
- environment descriptor
- five attribute tiers
- current attribute visual descriptors
- XP remaining to each next threshold
- dominant attribute

This is intentionally derived from the existing progression snapshot so it does not create a competing XP ledger.

## Next implementation sequence

### Step 1: archetype persistence
Add `heroArchetype` to local profile/settings persistence. Default existing users to Mystic until they explicitly choose another path.

### Step 2: Hero tab integration
Replace hard-coded hero title/presentation with `deriveHeroEvolution(snapshot, heroArchetype)`.

### Step 3: archetype selector
Create a one-time selection experience plus a profile control for switching during Beta 1. Switching archetype changes presentation, not XP or progress.

### Step 4: workout growth delta
Compare hero state before and after session persistence and show threshold-crossing changes in completion screens.

### Step 5: movement-domain ledger
Add explicit push/pull/legs/body-domain progression events so physique growth can become anatomically directional instead of using aggregate Strength XP.

### Step 6: production character art
Create tiered character assets or composable layers for each archetype. The rendering system should consume hero state from `heroEvolution.ts` rather than embed progression rules in UI components.
