import type { HeroArchetype } from './heroEvolution';

export const APP_BASE='/vitalquest-app';
export const ART_BASE=`${APP_BASE}/art`;
export const BRAND_BASE=`${APP_BASE}/assets/branding`;

export const ART={
  worlds:{
    mystic:`${ART_BASE}/worlds/mystic/world.webp`,
    athlete:`${ART_BASE}/worlds/athlete/world.webp`,
    spartan:`${ART_BASE}/worlds/spartan/world.webp`,
  },
  hero:{
    mystic:`${ART_BASE}/worlds/mystic/hero.webp`,
    athlete:`${ART_BASE}/worlds/athlete/hero.webp`,
    spartan:`${ART_BASE}/worlds/spartan/hero.webp`,
  },
  loading:`${ART_BASE}/brand/loading-eclipse.webp`,
  training:{
    mystic:`${ART_BASE}/worlds/mystic/world.webp`,
    athlete:`${ART_BASE}/worlds/athlete/world.webp`,
    spartan:`${ART_BASE}/worlds/spartan/world.webp`,
  },
  quest:{
    mystic:`${ART_BASE}/worlds/mystic/world.webp`,
    athlete:`${ART_BASE}/worlds/athlete/world.webp`,
    spartan:`${ART_BASE}/worlds/spartan/world.webp`,
  },
  armory:{
    mystic:`${ART_BASE}/worlds/mystic/world.webp`,
    athlete:`${ART_BASE}/worlds/athlete/world.webp`,
    spartan:`${ART_BASE}/worlds/spartan/world.webp`,
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
  return ART.training[archetype] ?? ART.training.athlete;
}

export function questArtForArchetype(archetype:HeroArchetype){
  return ART.quest[archetype] ?? ART.quest.athlete;
}

export function armoryArtForArchetype(archetype:HeroArchetype){
  return ART.armory[archetype] ?? ART.armory.athlete;
}
