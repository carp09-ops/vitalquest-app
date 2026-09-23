import type { HeroArchetype } from './heroEvolution';

export const APP_BASE = __DEV__ ? '' : '/vitalquest-app';
export const ART_BASE=`${APP_BASE}/art`;
export const LEGACY_ART_BASE=`${ART_BASE}/v1`;
export const BRAND_BASE=`${APP_BASE}/assets/branding`;

const WORLD_ART={
  mystic:`${ART_BASE}/worlds/mystic/world.webp`,
  athlete:`${ART_BASE}/worlds/athlete/world.webp`,
  spartan:`${ART_BASE}/worlds/spartan/world.webp`,
} as const;

const HERO_ART={
  mystic:`${ART_BASE}/worlds/mystic/hero.webp`,
  athlete:`${ART_BASE}/worlds/athlete/hero.webp`,
  spartan:`${ART_BASE}/worlds/spartan/hero.webp`,
} as const;

export type TabArtKey='today'|'trials'|'quests'|'armory'|'hero';

type TabArtSet=Record<TabArtKey,string>;

const TAB_ART:Record<HeroArchetype,TabArtSet>={
  mystic:{
    today:`${ART_BASE}/tabs/mystic/tab-today.webp`,
    trials:`${ART_BASE}/tabs/mystic/tab-trials.webp`,
    quests:`${ART_BASE}/tabs/mystic/tab-quests.webp`,
    armory:`${ART_BASE}/tabs/mystic/tab-armory.webp`,
    hero:`${ART_BASE}/tabs/mystic/tab-hero.webp`,
  },
  athlete:{
    today:`${ART_BASE}/tabs/athlete/tab-today.webp`,
    trials:`${ART_BASE}/tabs/athlete/tab-trials.webp`,
    quests:`${ART_BASE}/tabs/athlete/tab-quests.webp`,
    armory:`${ART_BASE}/tabs/athlete/tab-armory.webp`,
    hero:`${ART_BASE}/tabs/athlete/tab-hero.webp`,
  },
  spartan:{
    today:`${ART_BASE}/tabs/spartan/tab-today.webp`,
    trials:`${ART_BASE}/tabs/spartan/tab-trials.webp`,
    quests:`${ART_BASE}/tabs/spartan/tab-quests.webp`,
    armory:`${ART_BASE}/tabs/spartan/tab-armory.webp`,
    hero:`${ART_BASE}/tabs/spartan/tab-hero.webp`,
  },
} as const;

const TAB_ROUTE_TO_KEY:Record<string,TabArtKey>={
  train:'trials',
  quests:'quests',
  armory:'armory',
  hero:'hero',
};

/** Distinct artwork for a world + tab. Falls back to the athlete world. */
export function tabArtFor(archetype:HeroArchetype,tab:TabArtKey):string{
  return TAB_ART[archetype]?.[tab] ?? TAB_ART.athlete[tab];
}

/** Distinct world artwork per tab route and chosen world: index->today, train->trials, etc. */
export function tabArtForRoute(route:string|null|undefined,archetype:HeroArchetype='athlete'):string{
  return tabArtFor(archetype,TAB_ROUTE_TO_KEY[route ?? ''] ?? 'today');
}

export const ART={
  worlds:WORLD_ART,
  hero:HERO_ART,
  tabArt:TAB_ART,
  loading:`${ART_BASE}/brand/loading-eclipse.webp`,

  // World-aware scene registries. New cinematic surfaces should use the helpers below.
  trainingWorld:WORLD_ART,
  questWorld:WORLD_ART,
  armoryWorld:WORLD_ART,

  // Compatibility assets retained for existing V3 surfaces while they are migrated.
  training:`${LEGACY_ART_BASE}/training-hall.webp`,
  quest:`${LEGACY_ART_BASE}/quest-gate.webp`,
  encounters:{
    push:`${LEGACY_ART_BASE}/training-hall.webp`,
    pull:`${LEGACY_ART_BASE}/training-hall.webp`,
    legs:`${LEGACY_ART_BASE}/training-hall.webp`,
    run:`${LEGACY_ART_BASE}/mythic-world.webp`,
    recovery:`${LEGACY_ART_BASE}/mythic-world.webp`,
  },
  armory:{
    hall:`${LEGACY_ART_BASE}/mythic-world.webp`,
    gearFallback:`${LEGACY_ART_BASE}/mythic-hero.webp`,
  },
  branding:{
    icon192:`${BRAND_BASE}/icon-192.png`,
    icon512:`${BRAND_BASE}/icon-512.png`,
    appleTouch:`${BRAND_BASE}/apple-touch-icon.png`,
  },
} as const;

export function worldArtForArchetype(archetype:HeroArchetype){
  return ART.worlds[archetype] ?? ART.worlds.athlete;
}

export function heroArtForArchetype(archetype:HeroArchetype){
  return ART.hero[archetype] ?? ART.hero.athlete;
}

export function trainingArtForArchetype(archetype:HeroArchetype){
  return ART.trainingWorld[archetype] ?? ART.trainingWorld.athlete;
}

export function questArtForArchetype(archetype:HeroArchetype){
  return ART.questWorld[archetype] ?? ART.questWorld.athlete;
}

export function armoryArtForArchetype(archetype:HeroArchetype){
  return ART.armoryWorld[archetype] ?? ART.armoryWorld.athlete;
}
