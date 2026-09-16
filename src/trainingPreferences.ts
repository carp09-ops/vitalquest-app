export type EquipmentId = 'barbell' | 'dumbbells' | 'bench' | 'rack' | 'cables' | 'machines' | 'pullup' | 'cardio' | 'bodyweight';

export const EQUIPMENT_OPTIONS: Array<{id:EquipmentId;label:string;description:string}> = [
  {id:'barbell',label:'Barbell + Plates',description:'Bench, squat, deadlift, rows and overhead work.'},
  {id:'dumbbells',label:'Dumbbells',description:'Presses, rows, curls, split squats and accessory work.'},
  {id:'bench',label:'Adjustable Bench',description:'Flat and incline pressing plus supported movements.'},
  {id:'rack',label:'Squat / Power Rack',description:'Barbell squats, rack pulls and overhead work.'},
  {id:'cables',label:'Cable Station',description:'Pulldowns, rows and cable accessories.'},
  {id:'machines',label:'Machines',description:'Leg press, hamstring curl and selectorized work.'},
  {id:'pullup',label:'Pull-up Bar',description:'Pull-ups, chin-ups and hanging work.'},
  {id:'cardio',label:'Cardio / Outdoor',description:'Running, walking, biking and conditioning.'},
  {id:'bodyweight',label:'Bodyweight Space',description:'Mobility, recovery and no-equipment movements.'},
];

export const DEFAULT_EQUIPMENT: EquipmentId[] = ['barbell','dumbbells','bench','rack','cables','machines','pullup','cardio','bodyweight'];

export type CustomWorkoutExercise = {
  id:string;
  name:string;
  muscle:string;
  prescribedSets:number;
  targetReps:number;
};

export type CustomWorkoutTemplate = {
  id:string;
  name:string;
  createdAt:string;
  exercises:CustomWorkoutExercise[];
};

export type ExerciseCatalogItem = {
  id:string;
  name:string;
  muscle:string;
  equipment:EquipmentId[];
  defaultSets:number;
  defaultReps:number;
};

export const EXERCISE_CATALOG:ExerciseCatalogItem[] = [
  {id:'bench',name:'Barbell Bench Press',muscle:'Chest · Strength',equipment:['barbell','bench'],defaultSets:3,defaultReps:8},
  {id:'row',name:'Barbell Row',muscle:'Back · Strength',equipment:['barbell'],defaultSets:3,defaultReps:8},
  {id:'ohp',name:'Overhead Press',muscle:'Shoulders · Power',equipment:['barbell'],defaultSets:3,defaultReps:8},
  {id:'incline-db',name:'Incline Dumbbell Press',muscle:'Chest · Volume',equipment:['dumbbells','bench'],defaultSets:3,defaultReps:10},
  {id:'pulldown',name:'Lat Pulldown',muscle:'Back · Control',equipment:['cables'],defaultSets:3,defaultReps:10},
  {id:'curl',name:'Dumbbell Curl',muscle:'Biceps · Accessory',equipment:['dumbbells'],defaultSets:3,defaultReps:10},
  {id:'squat',name:'Back Squat',muscle:'Quads · Strength',equipment:['barbell','rack'],defaultSets:3,defaultReps:6},
  {id:'rdl',name:'Romanian Deadlift',muscle:'Hamstrings · Strength',equipment:['barbell'],defaultSets:3,defaultReps:8},
  {id:'split-squat',name:'Bulgarian Split Squat',muscle:'Legs · Stability',equipment:['dumbbells','bench'],defaultSets:3,defaultReps:10},
  {id:'leg-press',name:'Leg Press',muscle:'Quads · Volume',equipment:['machines'],defaultSets:3,defaultReps:10},
  {id:'ham-curl',name:'Hamstring Curl',muscle:'Hamstrings · Accessory',equipment:['machines'],defaultSets:3,defaultReps:10},
  {id:'calf',name:'Standing Calf Raise',muscle:'Calves · Capacity',equipment:['machines'],defaultSets:3,defaultReps:12},
  {id:'pullup',name:'Pull-up',muscle:'Back · Bodyweight',equipment:['pullup'],defaultSets:3,defaultReps:8},
  {id:'pushup',name:'Push-up',muscle:'Chest · Bodyweight',equipment:['bodyweight'],defaultSets:3,defaultReps:12},
  {id:'lunge',name:'Walking Lunge',muscle:'Legs · Bodyweight',equipment:['bodyweight'],defaultSets:3,defaultReps:10},
  {id:'carry',name:'Farmer Carry',muscle:'Grip · Conditioning',equipment:['dumbbells'],defaultSets:3,defaultReps:10},
];

export function equipmentSupports(required:EquipmentId[], available:EquipmentId[]) {
  return required.every(id=>available.includes(id));
}
