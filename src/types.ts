/** Base definition of an exercise with progression info */
export type ExerciseDefinition = {
  id: string
  name: string
  type: 'reps' | 'time'
  /** Starting reps or seconds at level 1 */
  baseValue: number
  /** How much to add per level */
  increment: number
  cue: string
  steps: string[]
}

/** Computed exercise for display at a specific level */
export type Exercise = {
  id: string
  name: string
  sets: number
  reps: number | 'hold'
  /** Seconds per hold when reps === 'hold' */
  holdSeconds?: number
  cue: string
  steps: string[]
}

export type DaySchedule = {
  dayIndex: number // 0 = Sunday, 1 = Monday, ...
  label: string
  theme: string
  exerciseIds: string[]
}

export type Prize = {
  id: string
  label: string
  starCost: number
  emoji: string
}

export type StoredState = {
  version: 1
  /** YYYY-MM-DD when the program started — used for level calc */
  startDate: string
  /** YYYY-MM-DD keys -> completed exercise ids for that day */
  progressByDate: Record<string, string[]>
  /** Days when the full routine was finished */
  completedDates: string[]
  stars: number
  claimedRewardIds: string[]
  voiceEnabled: boolean
  totalFinishedWorkouts: number
}

export type TabId = 'today' | 'rewards' | 'stars'
