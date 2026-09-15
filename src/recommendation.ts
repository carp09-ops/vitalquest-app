import { ProgressionSnapshot } from './progression';

export type TrialId = 'push' | 'pull' | 'legs' | 'run' | 'recovery';

export type TrainingRecommendation = {
  templateId: TrialId;
  label: string;
  title: string;
  reason: string;
  attributeFocus: string;
};

export function getTrainingRecommendation(snapshot: ProgressionSnapshot): TrainingRecommendation {
  const strengthLead = snapshot.strengthXP - Math.max(snapshot.staminaXP, snapshot.agilityXP);
  const needsRecovery = snapshot.thisWeekWorkouts >= 3 && snapshot.thisWeekRecoverySessions === 0;
  const needsEndurance = snapshot.workoutCount >= 2 && snapshot.lifetimeMiles < Math.max(3, snapshot.workoutCount * 0.35) && strengthLead > 20;

  if (needsRecovery) {
    return {
      templateId: 'recovery',
      label: 'RECOVERY RECOMMENDED',
      title: 'Restore capacity before the next push.',
      reason: 'You have stacked multiple training encounters this week without a recovery session. A mobility protocol now supports Vitality and Discipline instead of adding more fatigue.',
      attributeFocus: 'VITALITY · DISCIPLINE',
    };
  }

  if (needsEndurance) {
    return {
      templateId: 'run',
      label: 'BALANCE RECOMMENDED',
      title: 'Build the engine behind the armor.',
      reason: 'Your Strength progression is outpacing endurance work. A run closes the attribute gap by adding Stamina and Agility XP.',
      attributeFocus: 'STAMINA · AGILITY',
    };
  }

  const rotation: TrialId[] = ['push', 'pull', 'legs'];
  const templateId = rotation[snapshot.workoutCount % rotation.length];
  const copy: Record<'push'|'pull'|'legs', Omit<TrainingRecommendation,'templateId'>> = {
    push: { label: 'PRIMARY TRIAL', title: 'Build pressing strength.', reason: 'Your current rotation points to Push Day. Previous working weights are ready so you can progress without rebuilding the session.', attributeFocus: 'STRENGTH · POWER' },
    pull: { label: 'PRIMARY TRIAL', title: 'Build pulling strength and control.', reason: 'Your current rotation points to Pull Day, balancing pressing work with back strength and control.', attributeFocus: 'STRENGTH · CONTROL' },
    legs: { label: 'PRIMARY TRIAL', title: 'Raise lower-body capacity.', reason: 'Your current rotation points to Leg Day, keeping total-body strength development balanced.', attributeFocus: 'STRENGTH · CAPACITY' },
  };

  return { templateId, ...copy[templateId] };
}
