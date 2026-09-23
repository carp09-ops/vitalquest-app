export interface PlateBreakdown {
  /** Plates on ONE side of the bar, descending. */
  perSide: number[];
  barWeight: number;
  targetWeight: number;
  actualWeight: number;
  /** True when the loaded bar matches the target within 0.01. */
  exact: boolean;
}

const DEFAULT_PLATES = [45, 35, 25, 10, 5, 2.5];

/**
 * Barbell plate calculator. Greedy largest-first: given a target weight,
 * returns the plates to load on each side. Everything is in pounds.
 */
export function plateBreakdown(
  targetWeight: number,
  opts?: { barWeight?: number; availablePlates?: number[] },
): PlateBreakdown {
  const barWeight = opts?.barWeight ?? 45;
  const plates = [...(opts?.availablePlates ?? DEFAULT_PLATES)]
    .filter((p) => Number.isFinite(p) && p > 0)
    .sort((a, b) => b - a);
  const safe = Number.isFinite(targetWeight) && targetWeight > 0 ? targetWeight : barWeight;

  if (safe <= barWeight) {
    return { perSide: [], barWeight, targetWeight: safe, actualWeight: barWeight, exact: safe === barWeight };
  }

  let remaining = (safe - barWeight) / 2;
  const perSide: number[] = [];
  for (const plate of plates) {
    while (remaining >= plate - 1e-9) {
      perSide.push(plate);
      remaining -= plate;
    }
  }
  const actualWeight = Math.round((barWeight + 2 * perSide.reduce((sum, p) => sum + p, 0)) * 100) / 100;
  return { perSide, barWeight, targetWeight: safe, actualWeight, exact: Math.abs(actualWeight - safe) < 0.01 };
}

/** "45 + 25 per side", "Bar only", or "45 per side (135 lb actual)" when inexact. */
export function plateLabel(b: PlateBreakdown): string {
  if (b.perSide.length === 0) return 'Bar only';
  const core = `${b.perSide.join(' + ')} per side`;
  return b.exact ? core : `${core} (${b.actualWeight} lb actual)`;
}
