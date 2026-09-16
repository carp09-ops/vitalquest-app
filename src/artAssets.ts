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
  branding:{
    icon192:`${BRAND_BASE}/icon-192.png`,
    icon512:`${BRAND_BASE}/icon-512.png`,
    appleTouch:`${BRAND_BASE}/apple-touch-icon.png`,
  },
} as const;
