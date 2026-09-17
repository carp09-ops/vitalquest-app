import type { HeroArchetype } from './heroEvolution';

export const ART_BASE='/vitalquest-app/art/v1';
export const BRAND_BASE='/vitalquest-app/assets/branding';

export const ART={
  worlds:{
    mythicForge:`${ART_BASE}/mythic-world.webp`,
    celestialPulse:`${ART_BASE}/celestial-world.webp`,
    titanCore:`${ART_BASE}/titan-world.webp`,
  },
  hero:{
    mythicForge:`${ART_BASE}/mythic-hero.webp`,
    celestialPulse:`${ART_BASE}/celestial-world.webp`,
    titanCore:`${ART_BASE}/titan-world.webp`,
  },
  training:`${ART_BASE}/training-hall.webp`,
  quest:`${ART_BASE}/quest-gate.webp`,
  encounters:{
    push:`${ART_BASE}/training-hall.webp`,
    pull:`${ART_BASE}/training-hall.webp`,
    legs:`${ART_BASE}/training-hall.webp`,
    run:`${ART_BASE}/mythic-world.webp`,
    recovery:`${ART_BASE}/mythic-world.webp`,
  },
  armory:{
    hall:`${ART_BASE}/mythic-world.webp`,
    gearFallback:`${ART_BASE}/mythic-hero.webp`,
  },
  loading:`${ART_BASE}/mythic-world.webp`,
  branding:{
    icon192:`${BRAND_BASE}/icon-192.png`,
    icon512:`${BRAND_BASE}/icon-512.png`,
    appleTouch:`${BRAND_BASE}/apple-touch-icon.png`,
  },
} as const;

export function worldArtForArchetype(archetype:HeroArchetype){
  if(archetype==='mystic')return ART.worlds.mythicForge;
  if(archetype==='spartan')return ART.worlds.titanCore;
  return ART.worlds.celestialPulse;
}

export function heroArtForArchetype(archetype:HeroArchetype){
  if(archetype==='mystic')return ART.hero.mythicForge;
  if(archetype==='spartan')return ART.hero.titanCore;
  return ART.hero.celestialPulse;
}
