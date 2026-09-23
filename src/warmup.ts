export interface WarmupSet {
  weight: number;
  reps: number;
  label: string;
}

function roundTo5(value: number, min: number): number {
  return Math.max(min, Math.round(value / 5) * 5);
}

/**
 * Warm-up ramp for a working weight. Light loads get a single bar set;
 * heavier loads ramp bar × 10 → 40% × 8 → 60% × 5 → 80% × 3, with weights
 * rounded to the nearest 5, deduped, and never reaching the working weight.
 */
export function warmupRamp(workingWeight: number, opts?: { barWeight?: number }): WarmupSet[] {
  const barWeight = opts?.barWeight ?? 45;
  const safe = Number.isFinite(workingWeight) && workingWeight > 0 ? workingWeight : barWeight;

  if (safe < 95) {
    return [{ weight: barWeight, reps: 10, label: 'W1 · Bar × 10' }];
  }

  const plan = [
    { weight: barWeight, reps: 10 },
    { weight: roundTo5(safe * 0.4, barWeight), reps: 8 },
    { weight: roundTo5(safe * 0.6, barWeight), reps: 5 },
    { weight: roundTo5(safe * 0.8, barWeight), reps: 3 },
  ];

  const seen = new Set<number>();
  const sets: WarmupSet[] = [];
  for (const step of plan) {
    if (step.weight < safe && !seen.has(step.weight)) {
      seen.add(step.weight);
      sets.push({ ...step, label: `W${sets.length + 1}` });
    }
  }
  return sets.slice(0, 4);
}
