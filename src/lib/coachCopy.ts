/** Arnold-style motivational lines for a ~10yo — fun and commanding */
export function coachLine(ctx: {
  childName: string
  fraction: number
  todayComplete: boolean
  exerciseName?: string
}): string {
  const { childName, fraction, todayComplete, exerciseName } = ctx
  if (todayComplete) {
    return `${childName}, you crushed it! You are a champion. I am very proud of you.`
  }
  if (exerciseName && fraction > 0) {
    const mid = [
      `Look at you go on those ${exerciseName}! You are a machine!`,
      `That form is fantastic, ${childName}. Keep pumping!`,
      `Now that is what I call effort! You are getting stronger every rep.`,
    ]
    return mid[Math.floor(Math.random() * mid.length)]!
  }
  if (fraction <= 0) {
    return `Hey ${childName}! Ten minutes is all it takes to build a champion. Let's pump it up!`
  }
  if (fraction < 0.5) {
    return `Great start! One rep at a time — that is how champions are built.`
  }
  if (fraction < 1) {
    return `Past halfway! No stopping now — finish strong like a champion!`
  }
  return `Last stretch — let's close it out! You've got this!`
}

export function cheerForRep(rep: number, target: number, name: string): string {
  if (rep >= target) return `${target}! Set complete! Excellent work.`
  if (rep % 4 === 0 && rep > 0) return `${rep}! Keep pumping those ${name}!`
  return String(rep)
}

// ---------------------------------------------------------------------------
// Guided workout announcements — Arnold style
// ---------------------------------------------------------------------------

import type { Exercise } from '../types'

export function announceExercise(exercise: Exercise): string {
  if (exercise.reps === 'hold') {
    const s = exercise.holdSeconds ?? 20
    return `Time for ${exercise.name}! ${exercise.sets} ${exercise.sets === 1 ? 'set' : 'sets'}, ${s} seconds each. Hold it strong!`
  }
  return `Time for ${exercise.name}! ${exercise.sets} ${exercise.sets === 1 ? 'set' : 'sets'} of ${exercise.reps} reps. Let's pump it!`
}

export function announceTransition(nextExerciseName: string): string {
  const phrases = [
    `Excellent work! Now we move to ${nextExerciseName}. Get ready!`,
    `You are a machine! Next up: ${nextExerciseName}!`,
    `That was fantastic! ${nextExerciseName} is next. Let's go!`,
  ]
  return phrases[Math.floor(Math.random() * phrases.length)]!
}

export function announceSetRest(_nextSetNumber: number): string {
  return `Take a breather. You have earned it.`
}

export function announceRestCountdown(secondsLeft: number): string {
  if (secondsLeft === 5) return `Next set starting in 5`
  if (secondsLeft === 1) return `1`
  return String(secondsLeft)
}

export function announceSetStart(setNumber: number): string {
  return `Set ${setNumber}. Go go go!`
}

export function announceWorkoutComplete(childName: string): string {
  return `Workout complete! ${childName}, you are a champion! I am very proud of you!`
}

export function announceWorkoutStart(childName: string): string {
  return `Come on ${childName}! It is time to pump it up! Ten minutes. Let's do this!`
}
