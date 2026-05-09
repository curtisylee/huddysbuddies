import type { DaySchedule, Exercise, ExerciseDefinition, Prize } from '../types'
import { parseDateKey } from '../lib/dates'

// ---------------------------------------------------------------------------
// Exercise definitions — base values are for Level 1 (beginner)
// ---------------------------------------------------------------------------

export const EXERCISE_DEFS: ExerciseDefinition[] = [
  {
    id: 'situps',
    name: 'Sit-ups',
    type: 'reps',
    baseValue: 10,
    increment: 2,
    cue: 'Squeeze your belly on the way up — control beats speed.',
    steps: [
      'Lie on your back, knees bent, feet flat on the floor.',
      'Cross arms over your chest or place hands by your ears.',
      'Curl all the way up until your elbows touch your knees, then lower slowly.',
    ],
  },
  {
    id: 'lunges',
    name: 'Lunges',
    type: 'reps',
    baseValue: 10,
    increment: 2,
    cue: 'Step forward softly — keep your chest tall.',
    steps: [
      'Stand tall, feet hip-width apart.',
      'Step one foot forward and lower until both knees bend to about 90 degrees.',
      'Push back to standing and switch legs. Count each leg as one rep.',
    ],
  },
  {
    id: 'planks',
    name: 'Plank hold',
    type: 'time',
    baseValue: 20,
    increment: 5,
    cue: 'Strong line from head to heels — breathe steady.',
    steps: [
      'Forearms on the floor, elbows under shoulders.',
      'Lift your body so it is straight like a board.',
      'Hold steady. Breathe in through your nose, out through your mouth.',
    ],
  },
  {
    id: 'squats',
    name: 'Squats',
    type: 'reps',
    baseValue: 10,
    increment: 2,
    cue: 'Sit back like there is a chair behind you.',
    steps: [
      'Feet shoulder-width apart, toes slightly out.',
      'Lower until thighs are close to parallel with the ground.',
      'Drive through your heels to stand back up. That is one rep.',
    ],
  },
  {
    id: 'jumps',
    name: 'Tuck jumps',
    type: 'reps',
    baseValue: 8,
    increment: 2,
    cue: 'Explode up — pull those knees high!',
    steps: [
      'Stand with feet shoulder-width apart.',
      'Bend your knees slightly, then jump as high as you can.',
      'Pull your knees toward your chest at the top, then land softly.',
    ],
  },
  {
    id: 'pushups',
    name: 'Push-ups',
    type: 'reps',
    baseValue: 5,
    increment: 2,
    cue: 'Body like a plank — chest to the floor, then press away.',
    steps: [
      'Hands under your shoulders, body straight from head to heels.',
      'Lower your chest toward the floor, keeping elbows at about 45 degrees.',
      'Press back up. Knees on the ground is totally fine — form first.',
    ],
  },
  {
    id: 'burpees',
    name: 'Burpees',
    type: 'reps',
    baseValue: 5,
    increment: 1,
    cue: 'Down, out, back, up, jump — one smooth flow.',
    steps: [
      'Squat down and place your hands on the floor.',
      'Jump or step your feet back into a plank position.',
      'Jump or step your feet back to your hands, then explode up with a jump.',
    ],
  },
  {
    id: 'jump-squats',
    name: 'Jump squats',
    type: 'reps',
    baseValue: 8,
    increment: 2,
    cue: 'Squat deep, then launch — land soft like a cat.',
    steps: [
      'Feet shoulder-width apart. Lower into a squat.',
      'Explode upward, jumping as high as you can.',
      'Land softly back into the squat position. That is one rep.',
    ],
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping jacks',
    type: 'reps',
    baseValue: 20,
    increment: 5,
    cue: 'Arms and legs out, then back — keep a rhythm.',
    steps: [
      'Stand with feet together, arms by your sides.',
      'Jump your feet apart while swinging arms overhead.',
      'Jump back to start. Keep a steady pace — breathe!',
    ],
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain climbers',
    type: 'reps',
    baseValue: 16,
    increment: 4,
    cue: 'Drive those knees — fast feet, stable hands.',
    steps: [
      'Start in a push-up position, hands under shoulders.',
      'Drive one knee toward your chest, then quickly switch legs.',
      'Each leg counts as one rep. Keep your hips level.',
    ],
  },
  {
    id: 'hip-bridges',
    name: 'Hip bridges',
    type: 'reps',
    baseValue: 10,
    increment: 2,
    cue: 'Squeeze your glutes hard at the top — pause and lower.',
    steps: [
      'Lie on your back, knees bent, feet flat on the floor.',
      'Lift your hips up high, squeezing your glutes at the top.',
      'Hold for a second, then lower slowly. That is one rep.',
    ],
  },
  {
    id: 'supermans',
    name: 'Supermans',
    type: 'reps',
    baseValue: 8,
    increment: 2,
    cue: 'Fly like a superhero — lift everything off the ground.',
    steps: [
      'Lie face down, arms stretched out in front of you.',
      'Lift your chest, arms, and legs off the floor at the same time.',
      'Hold for a second, then lower with control.',
    ],
  },
]

const DEFS_BY_ID = new Map(EXERCISE_DEFS.map((d) => [d.id, d]))

// ---------------------------------------------------------------------------
// Weekly schedule — same every week, exercises rotate by day theme
// ---------------------------------------------------------------------------

export const WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    dayIndex: 1, // Monday
    label: 'Monday',
    theme: 'Core',
    exerciseIds: ['situps', 'planks', 'mountain-climbers', 'hip-bridges', 'supermans'],
  },
  {
    dayIndex: 2, // Tuesday
    label: 'Tuesday',
    theme: 'Lower body',
    exerciseIds: ['squats', 'lunges', 'hip-bridges', 'jump-squats', 'jumps'],
  },
  {
    dayIndex: 3, // Wednesday
    label: 'Wednesday',
    theme: 'Cardio & full body',
    exerciseIds: ['jumping-jacks', 'burpees', 'mountain-climbers', 'pushups', 'planks'],
  },
  {
    dayIndex: 4, // Thursday
    label: 'Thursday',
    theme: 'Strength',
    exerciseIds: ['pushups', 'squats', 'situps', 'supermans', 'hip-bridges'],
  },
  {
    dayIndex: 5, // Friday
    label: 'Friday',
    theme: 'Explosive',
    exerciseIds: ['burpees', 'jump-squats', 'jumps', 'jumping-jacks', 'mountain-climbers'],
  },
  {
    dayIndex: 6, // Saturday
    label: 'Saturday',
    theme: 'Mixed',
    exerciseIds: ['lunges', 'pushups', 'planks', 'squats', 'jumping-jacks'],
  },
  {
    dayIndex: 0, // Sunday
    label: 'Sunday',
    theme: 'Active recovery',
    exerciseIds: ['supermans', 'hip-bridges', 'planks', 'lunges', 'situps'],
  },
]

const SCHEDULE_BY_DAY = new Map(WEEKLY_SCHEDULE.map((d) => [d.dayIndex, d]))

// ---------------------------------------------------------------------------
// Progression — level increases every 2 weeks
// ---------------------------------------------------------------------------

/** Returns 1-based level from the start date. Level 1 = weeks 1–2, etc. */
export function getLevel(startDate: string): number {
  const start = parseDateKey(startDate)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  return Math.floor(diffDays / 14) + 1
}

/** Number of sets for the given level */
function setsForLevel(level: number): number {
  if (level <= 4) return 2
  return 3
}

/** Build a renderable Exercise from a definition at a given level */
function buildExercise(def: ExerciseDefinition, level: number): Exercise {
  const sets = setsForLevel(level)
  const value = def.baseValue + (level - 1) * def.increment

  if (def.type === 'time') {
    return {
      id: def.id,
      name: def.name,
      sets,
      reps: 'hold',
      holdSeconds: value,
      cue: def.cue,
      steps: def.steps,
    }
  }

  return {
    id: def.id,
    name: def.name,
    sets,
    reps: value,
    cue: def.cue,
    steps: def.steps,
  }
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/** Get today's DaySchedule */
export function getDaySchedule(dayOfWeek?: number): DaySchedule {
  const day = dayOfWeek ?? new Date().getDay()
  return SCHEDULE_BY_DAY.get(day)!
}

/** Get the renderable Exercise list for a given day and level */
export function getExercisesForDay(dayOfWeek: number, level: number): Exercise[] {
  const schedule = SCHEDULE_BY_DAY.get(dayOfWeek)!
  return schedule.exerciseIds.map((id) => {
    const def = DEFS_BY_ID.get(id)!
    return buildExercise(def, level)
  })
}

/** Get exercise IDs for a given day */
export function getExerciseIdsForDay(dayOfWeek: number): string[] {
  return SCHEDULE_BY_DAY.get(dayOfWeek)!.exerciseIds
}

// ---------------------------------------------------------------------------
// Prizes & stars (unchanged)
// ---------------------------------------------------------------------------

export const PRIZES: Prize[] = [
  { id: 'p-sticker', label: 'Sticker pack pick', starCost: 8, emoji: '✨' },
  { id: 'p-outing', label: 'Choose the family movie', starCost: 15, emoji: '🎬' },
  { id: 'p-treat', label: 'Small treat (parent ok)', starCost: 20, emoji: '🍫' },
  { id: 'p-outing2', label: 'Park + favorite snack outing', starCost: 35, emoji: '🛝' },
  { id: 'p-goal', label: 'Big goal prize (agree first)', starCost: 60, emoji: '🏆' },
]

export const STARS_PER_FULL_WORKOUT = 3
export const STARS_DAILY_BONUS = 1
