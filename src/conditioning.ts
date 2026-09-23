/**
 * Structured conditioning workouts for VitalQuest.
 *
 * A pure data module: five coach-authored running sessions built from
 * time-boxed intensity segments. The run flow (EnduranceWorkoutV2) scores
 * distance/duration; these structures give that run a shape — warmup,
 * work, cooldown — so conditioning training has intent, not just mileage.
 *
 * Intensity vocabulary (RPE, 1–10):
 * - easy   ~3–4/10 · conversational pace · nose-breathing comfortable
 * - steady ~7/10   · comfortably hard · broken sentences, not chat
 * - hard   8–9/10  · fast but controlled · never an all-out sprint
 */

export type ConditioningIntensity = 'easy' | 'steady' | 'hard';

export interface ConditioningSegment {
  label: string;
  minutes: number;
  intensity: ConditioningIntensity;
  note: string;
}

export interface ConditioningStructure {
  id: string;
  name: string;
  tagline: string;
  description: string;
  segments: ConditioningSegment[];
}

function seg(label: string, minutes: number, intensity: ConditioningIntensity, note: string): ConditioningSegment {
  return { label, minutes, intensity, note };
}

const EASY_AEROBIC: ConditioningStructure = {
  id: 'easy-aerobic',
  name: 'Easy Aerobic',
  tagline: '35 minutes of conversational zone 2',
  description:
    'The aerobic base builder. Slow, steady volume is what raises your ceiling over months — ' +
    'this session should feel almost too easy. If you finish feeling like you could do it again, you did it right.',
  segments: [
    seg(
      'Warmup', 5, 'easy',
      'Start slower than you think. Let your breathing settle before the main block — the first 5 minutes of any run are the hardest, not the fastest.'
    ),
    seg(
      'Easy Aerobic', 25, 'easy',
      'Conversational pace the entire way: you should be able to speak in full sentences. If you are alone, the talk test still applies — try narrating your route out loud. RPE 3–4/10. Resist every urge to "make it count" by going faster; the adaptation here comes from duration at low intensity.'
    ),
    seg(
      'Cooldown', 5, 'easy',
      'Jog it out — do not stop dead. Keep moving for a full 5 minutes while your heart rate comes down, then walk the last minute if you like.'
    ),
  ],
};

const INTERVALS_3_2: ConditioningStructure = {
  id: 'intervals-3-2',
  name: '3/2 Intervals',
  tagline: '6 × (3 min hard / 2 min easy) — the classic threshold session',
  description:
    'Six 3-minute hard efforts with 2-minute easy jogs between. This is the highest-value session in the catalog: ' +
    'it pushes your lactate threshold up, which is what makes every pace feel easier over time.',
  segments: [
    seg(
      'Warmup', 8, 'easy',
      'Build gradually: 5 minutes genuinely easy, then 4 × 20-second strides (quick, relaxed, not sprinting) with easy jogging between. You should feel loose and warm before the first hard rep.'
    ),
    ...[1, 2, 3, 4, 5, 6].flatMap((n) => [
      seg(
        `Hard ${n}`, 3, 'hard',
        `Rep ${n} of 6. Fast but controlled — RPE 8–9/10, never a sprint. Pace discipline wins: rep 6 should feel like the same effort as rep 1. If you are fading by rep 4, you started too hot.`
      ),
      seg(
        `Easy ${n}`, 2, 'easy',
        `Jog it genuinely easy — shuffle if you must. The goal is to let your breathing mostly recover so the next hard rep is quality. Walking is fine if you need it.`
      ),
    ]),
    seg(
      'Cooldown', 5, 'easy',
      'Easy jog to flush the legs. Expect to feel worked but not wrecked — you should be recovered enough to train again in 48 hours.'
    ),
  ],
};

const TEMPO_20: ConditioningStructure = {
  id: 'tempo-20',
  name: 'Tempo 20',
  tagline: '20 minutes of comfortably hard, sandwiched in easy miles',
  description:
    'A sustained 20-minute effort at "comfortably hard" — the pace you could hold for about an hour in a race. ' +
    'Tempo runs teach your body to clear lactate at speed. Mentally, this is the session that makes you tougher.',
  segments: [
    seg(
      'Warmup', 10, 'easy',
      'Easy jogging, gradually finding rhythm. Finish the warmup with 3 × 20-second strides so the tempo pace does not shock the system.'
    ),
    seg(
      'Tempo', 20, 'steady',
      'Comfortably hard: RPE ~7/10. You could speak in broken sentences but not hold a conversation. Lock into a rhythm you can sustain the full 20 minutes — starting 10 seconds per mile too fast is the classic tempo mistake. Smooth and relentless.'
    ),
    seg(
      'Cooldown', 10, 'easy',
      'Long, easy cooldown — your legs will thank you tomorrow. This is where the session\'s fatigue gets processed, not in the tempo block itself.'
    ),
  ],
};

const PROGRESSION_30: ConditioningStructure = {
  id: 'progression-30',
  name: 'Progression 30',
  tagline: '30 minutes, faster every 10 — finish strong',
  description:
    'A 30-minute run that gets faster in three 10-minute blocks: easy, then steady, then strong. ' +
    'Progression runs teach pacing judgment and finish-on-empty-legs strength without the structure of formal intervals.',
  segments: [
    seg(
      'Block 1 — Easy', 10, 'easy',
      'Genuinely easy. Conversational, relaxed, RPE 3–4/10. Bank the freshness — you will spend it later. The discipline of this block is what makes the session work.'
    ),
    seg(
      'Block 2 — Steady', 10, 'steady',
      'Notch it up to comfortably hard, RPE ~7/10. You should notice the effort shift but still feel in control. This is roughly your tempo effort, held for 10 minutes.'
    ),
    seg(
      'Block 3 — Strong', 10, 'hard',
      'Strong but controlled: RPE 8/10, the fastest you can run while still holding form together. Not a sprint — if your stride is falling apart, back off 5%. Finish the last 2 minutes with your best posture of the day.'
    ),
  ],
};

const FARTLEK_25: ConditioningStructure = {
  id: 'fartlek-25',
  name: 'Fartlek 25',
  tagline: 'Playful surges — speed without the stopwatch',
  description:
    'Fartlek is Swedish for "speed play": 8 rounds of 2 easy minutes and 1 hard minute, surging by feel. ' +
    'No splits, no track — pick a landmark and run to it. The best session for runners who find intervals mentally tedious.',
  segments: [
    seg(
      'Warmup', 6, 'easy',
      'Easy jogging to find your legs. End the warmup with 3 × 20-second quick pickups so the first surge is not a surprise.'
    ),
    ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((n) => [
      seg(
        `Float ${n}`, 2, 'easy',
        `Round ${n} of 8. Easy running — recover until your breathing settles. You choose the route; keep it relaxed and rhythmic.`
      ),
      seg(
        `Surge ${n}`, 1, 'hard',
        `Pick a landmark — the next lamppost, the top of the rise — and run to it with purpose. RPE 8–9/10 but smooth: fast feet, tall posture, relaxed shoulders. Never an all-out sprint; you have 7 more of these.`
      ),
    ]),
    seg(
      'Cooldown', 5, 'easy',
      'Easy jog home. Fartlek should leave you pleasantly tired and a little exhilarated — if you are dreading the next one, your surges were too hard.'
    ),
  ],
};

export const CONDITIONING_STRUCTURES: ConditioningStructure[] = [
  EASY_AEROBIC,
  INTERVALS_3_2,
  TEMPO_20,
  PROGRESSION_30,
  FARTLEK_25,
];

export function totalMinutes(s: ConditioningStructure): number {
  return s.segments.reduce((sum, segment) => sum + segment.minutes, 0);
}

export function hardMinutes(s: ConditioningStructure): number {
  return s.segments.filter((segment) => segment.intensity === 'hard').reduce((sum, segment) => sum + segment.minutes, 0);
}
