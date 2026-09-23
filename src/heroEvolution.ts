import type { ProgressionSnapshot } from './progression';
import { cumulativeXpForLevel } from './gameEngine';

export type HeroArchetype = 'mystic' | 'athlete' | 'spartan';
export type HeroAttribute = 'strength' | 'stamina' | 'agility' | 'vitality' | 'discipline';
export type HeroTier = 1 | 2 | 3 | 4 | 5;

export const HERO_ARCHETYPES: Record<HeroArchetype, {
  name: string;
  fantasy: string;
  tierTitles: readonly [string, string, string, string, string];
  gear: readonly [string, string, string, string, string];
  environments: readonly [string, string, string, string, string];
  physique: readonly [string, string, string, string, string];
}> = {
  mystic: {
    name: 'Mystic',
    fantasy: 'A realm-bound champion whose real training awakens physique, relics, runes and magical prestige.',
    tierTitles: ['Wanderer', 'Runebound', 'Spell Knight', 'Realm Guardian', 'Ascended Champion'],
    gear: [
      'Travel leathers · dormant charm',
      'Runed bracers · awakened weapon',
      'Enchanted cuirass · active relic',
      'Guardian plate · radiant weapon',
      'Ascendant armor · legendary relic set',
    ],
    environments: [
      'Forest threshold',
      'Ancient rune road',
      'Enchanted stronghold',
      'Guardian citadel',
      'Ascendant realm',
    ],
    physique: [
      'Unforged adventurer',
      'Conditioned explorer',
      'Battle-ready champion',
      'Powerful guardian',
      'Mythic heroic form',
    ],
  },
  athlete: {
    name: 'Athlete',
    fantasy: 'A modern performance athlete whose physique, kit and status evolve with strength, conditioning and consistency.',
    tierTitles: ['Prospect', 'Competitor', 'Performer', 'All-Star', 'Apex Athlete'],
    gear: [
      'Foundational training kit',
      'Performance training kit',
      'Elite competition kit',
      'All-Star signature kit',
      'Apex performance set',
    ],
    environments: [
      'Local performance gym',
      'Advanced training center',
      'Elite performance lab',
      'Professional arena',
      'Championship stage',
    ],
    physique: [
      'Developing athletic base',
      'Visible training adaptation',
      'Elite balanced build',
      'Professional-caliber physique',
      'Apex hybrid athlete',
    ],
  },
  spartan: {
    name: 'Spartan',
    fantasy: 'An original ancient-warrior archetype forged by strength, endurance, restoration and disciplined repetition.',
    tierTitles: ['Recruit', 'Hoplite', 'Shieldbearer', 'War Captain', 'Arena Legend'],
    gear: [
      'Training leathers · basic spear',
      'Bronze bracers · round shield',
      'Hoplite armor · forged spear',
      'Captain armor · battle honors',
      'Legendary war plate · ceremonial arsenal',
    ],
    environments: [
      'Dust training yard',
      'War camp',
      'Stone proving ground',
      'Fortress battlement',
      'Legendary arena',
    ],
    physique: [
      'Unseasoned recruit',
      'Hardened combat base',
      'Battle-ready warrior',
      'Commanding war physique',
      'Legendary warrior form',
    ],
  },
};

export const ATTRIBUTE_THRESHOLDS = [0, 100, 250, 500, 900] as const;
export const FORM_LEVELS = [1, 5, 9, 13, 17] as const;

export const ATTRIBUTE_TIER_TITLES: Record<HeroAttribute, readonly [string, string, string, string, string]> = {
  strength: ['Untrained', 'Conditioned', 'Powerful', 'Elite', 'Mythic'],
  stamina: ['Winded', 'Steady', 'Enduring', 'Tireless', 'Inexhaustible'],
  agility: ['Stiff', 'Nimble', 'Explosive', 'Elusive', 'Untouchable'],
  vitality: ['Drained', 'Mending', 'Vibrant', 'Radiant', 'Evergreen'],
  discipline: ['Drifter', 'Committed', 'Disciplined', 'Unyielding', 'Legendary'],
};

export const ATTRIBUTE_VISUALS: Record<HeroArchetype, Record<HeroAttribute, readonly [string, string, string, string, string]>> = {
  mystic: {
    strength: ['Dormant power', 'Runed arms', 'Reinforced armor', 'Guardian strength', 'Titanic arcane presence'],
    stamina: ['Short-path traveler', 'Trail hardened', 'Long-road aura', 'Endurance mantle', 'Unfading expedition glow'],
    agility: ['Measured stance', 'Quickened posture', 'Ranger movement', 'Blink-fast silhouette', 'Preternatural speed'],
    vitality: ['Faint life spark', 'Restored glow', 'Healing aura', 'Radiant vitality', 'Evergreen restoration'],
    discipline: ['Unmarked', 'Initiate sigil', 'Oath insignia', 'Guardian crest', 'Ascendant halo'],
  },
  athlete: {
    strength: ['Developing frame', 'Visible power', 'Power-athlete build', 'Elite muscularity', 'Apex strength profile'],
    stamina: ['Base conditioning', 'Aerobic build', 'Hybrid conditioning', 'Elite engine', 'Championship endurance'],
    agility: ['Fundamental movement', 'Quick-footed', 'Explosive mover', 'Elite speed profile', 'Apex movement quality'],
    vitality: ['Training fatigue visible', 'Recovered', 'Game ready', 'Peak readiness', 'Championship freshness'],
    discipline: ['Prospect status', 'Team-standard', 'Captain marks', 'All-Star prestige', 'Franchise icon'],
  },
  spartan: {
    strength: ['Lean recruit', 'Hardened arms', 'Shieldbearer power', 'War-captain mass', 'Legendary battle physique'],
    stamina: ['Short-march ready', 'Campaign conditioned', 'Battle endurance', 'Siege-ready engine', 'Unbreakable endurance'],
    agility: ['Basic spear stance', 'Mobile hoplite', 'Fast shieldwork', 'Elite skirmisher', 'Lightning battlefield movement'],
    vitality: ['Battle worn', 'Recovered fighter', 'Resilient warrior', 'Iron constitution', 'Indomitable vitality'],
    discipline: ['No honors', 'Bronze mark', 'Unit insignia', 'Captain honors', 'Legend standard'],
  },
};

export function formTierForLevel(level: number): HeroTier {
  if (level >= 17) return 5;
  if (level >= 13) return 4;
  if (level >= 9) return 3;
  if (level >= 5) return 2;
  return 1;
}

export function nextHeroFormMilestone(level: number, totalXP: number, archetype: HeroArchetype) {
  const currentTier = formTierForLevel(level);
  if (currentTier >= 5) return null;
  const targetLevel = (FORM_LEVELS as readonly number[])[currentTier];
  const nextTitle = (HERO_ARCHETYPES[archetype].tierTitles as readonly string[])[currentTier];
  if (targetLevel == null || nextTitle == null) return null;
  const targetXP = cumulativeXpForLevel(targetLevel);
  return {
    targetLevel,
    targetXP,
    xpRemaining: Math.max(0, targetXP - totalXP),
    nextTier: (currentTier + 1) as HeroTier,
    nextTitle,
  };
}

export function attributeTierForXP(xp: number): HeroTier {
  if (xp >= ATTRIBUTE_THRESHOLDS[4]) return 5;
  if (xp >= ATTRIBUTE_THRESHOLDS[3]) return 4;
  if (xp >= ATTRIBUTE_THRESHOLDS[2]) return 3;
  if (xp >= ATTRIBUTE_THRESHOLDS[1]) return 2;
  return 1;
}

function nextAttributeThreshold(xp: number) {
  for (const threshold of ATTRIBUTE_THRESHOLDS.slice(1)) {
    if (xp < threshold) return threshold;
  }
  return null;
}

function attributeXP(snapshot: ProgressionSnapshot): Record<HeroAttribute, number> {
  return {
    strength: snapshot.strengthXP,
    stamina: snapshot.staminaXP,
    agility: snapshot.agilityXP,
    vitality: snapshot.vitalityXP,
    discipline: snapshot.disciplineXP,
  };
}

export interface AttributeTierUp {
  attribute: HeroAttribute;
  fromTier: HeroTier;
  toTier: HeroTier;
  title: string;
}

const isHeroAttribute = (value: string): value is HeroAttribute => value in ATTRIBUTE_TIER_TITLES;

export function detectAttributeTierUps(
  before: Record<HeroAttribute, number>,
  gains: Array<{ attribute: string; amount: number }>,
): AttributeTierUp[] {
  const result: AttributeTierUp[] = [];
  for (const gain of gains) {
    if (!isHeroAttribute(gain.attribute)) continue;
    const amount = Math.max(0, Math.floor(gain.amount));
    if (amount <= 0) continue;
    const fromTier = attributeTierForXP(before[gain.attribute] ?? 0);
    const toTier = attributeTierForXP((before[gain.attribute] ?? 0) + amount);
    if (toTier > fromTier) {
      result.push({ attribute: gain.attribute, fromTier, toTier, title: ATTRIBUTE_TIER_TITLES[gain.attribute][toTier - 1] });
    }
  }
  return result;
}

export function deriveHeroEvolution(snapshot: ProgressionSnapshot, archetype: HeroArchetype = 'mystic') {
  const config = HERO_ARCHETYPES[archetype];
  const formTier = formTierForLevel(snapshot.level);
  const xp = attributeXP(snapshot);
  const attributes = (Object.keys(xp) as HeroAttribute[]).reduce((result, attribute) => {
    const tier = attributeTierForXP(xp[attribute]);
    const nextThreshold = nextAttributeThreshold(xp[attribute]);
    result[attribute] = {
      xp: xp[attribute],
      tier,
      tierTitle: ATTRIBUTE_TIER_TITLES[attribute][tier - 1],
      visual: ATTRIBUTE_VISUALS[archetype][attribute][tier - 1],
      nextThreshold,
      xpToNext: nextThreshold == null ? 0 : Math.max(0, nextThreshold - xp[attribute]),
    };
    return result;
  }, {} as Record<HeroAttribute, { xp: number; tier: HeroTier; tierTitle: string; visual: string; nextThreshold: number | null; xpToNext: number }>);

  const dominantAttribute = (Object.keys(attributes) as HeroAttribute[]).sort((a, b) => {
    const normalizedA = attributes[a].tier * 1000 + attributes[a].xp;
    const normalizedB = attributes[b].tier * 1000 + attributes[b].xp;
    return normalizedB - normalizedA;
  })[0];

  return {
    archetype,
    archetypeName: config.name,
    formTier,
    title: config.tierTitles[formTier - 1],
    physique: config.physique[formTier - 1],
    gear: config.gear[formTier - 1],
    environment: config.environments[formTier - 1],
    dominantAttribute,
    attributes,
  };
}
