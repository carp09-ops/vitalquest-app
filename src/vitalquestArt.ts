import type { HeroArchetype } from './heroEvolution';
import { MYSTIC_WORLD } from './worldMystic';
import { ATHLETE_WORLD } from './worldAthlete';
import { SPARTAN_WORLD } from './worldSpartan';
import { BRAND_LAUNCH_IMAGE } from './brandLaunchAsset';
import { BRAND_CALIBRATING_IMAGE } from './brandCalibratingAsset';

/**
 * Canonical production artwork registry for VitalQuest.
 *
 * Keep screen/components pointed at this registry rather than importing
 * individual asset modules directly. This gives us one stable place to swap
 * storage format (embedded data URI -> public binary asset) without touching
 * the product UI.
 */
export const VITALQUEST_ART = {
  brand: {
    launch: BRAND_LAUNCH_IMAGE,
    calibrating: BRAND_CALIBRATING_IMAGE,
  },
  worlds: {
    mystic: MYSTIC_WORLD,
    athlete: ATHLETE_WORLD,
    spartan: SPARTAN_WORLD,
  } satisfies Record<HeroArchetype, string>,
} as const;

export function worldArtFor(archetype: HeroArchetype) {
  return VITALQUEST_ART.worlds[archetype];
}
