import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getDaySchedule,
  getExerciseIdsForDay,
  getExercisesForDay,
  getLevel,
  PRIZES,
  STARS_DAILY_BONUS,
  STARS_PER_FULL_WORKOUT,
} from '../data/program'
import {
  computeStreak,
  countCompletedInMonth,
  countCompletedInWeek,
  dateKey,
  monthKey,
  weekStartKey,
} from '../lib/dates'
import { loadStoredState, saveStoredState } from '../lib/storage'
import type { StoredState } from '../types'

function uniqPush(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr : [...arr, v]
}

function allDoneForDay(done: string[] | undefined, exerciseIds: string[]): boolean {
  if (!done || done.length < exerciseIds.length) return false
  const set = new Set(done)
  return exerciseIds.every((id) => set.has(id))
}

export type ClaimableReward = {
  id: string
  title: string
  subtitle: string
  emoji: string
  stars: number
  kind: string
}

function buildClaimables(s: StoredState, today: string): ClaimableReward[] {
  const completedSet = new Set(s.completedDates)
  const streak = computeStreak(completedSet, today)
  const weekN = countCompletedInWeek(completedSet)
  const monthN = countCompletedInMonth(completedSet)
  const claimed = new Set(s.claimedRewardIds)

  const out: ClaimableReward[] = []

  const wk = weekStartKey()
  if (weekN >= 5 && !claimed.has(`weekly-${wk}`)) {
    out.push({
      id: `weekly-${wk}`,
      title: 'Week warrior',
      subtitle: `${weekN} workout days this week — nice consistency.`,
      emoji: '🛡️',
      stars: 8,
      kind: 'weekly',
    })
  }

  const mk = monthKey()
  if (monthN >= 18 && !claimed.has(`monthly-${mk}`)) {
    out.push({
      id: `monthly-${mk}`,
      title: 'Monthly legend',
      subtitle: `${monthN} days logged this month. Huge effort.`,
      emoji: '🌙',
      stars: 20,
      kind: 'monthly',
    })
  }

  const milestones: { id: string; need: boolean; title: string; subtitle: string; emoji: string; stars: number }[] = [
    { id: 'mile-streak-7', need: streak >= 7, title: '7-day streak', subtitle: 'Seven days in a row!', emoji: '🔥', stars: 5 },
    {
      id: 'mile-streak-14',
      need: streak >= 14,
      title: '14-day streak',
      subtitle: 'Two weeks strong.',
      emoji: '⚡',
      stars: 10,
    },
    {
      id: 'mile-streak-30',
      need: streak >= 30,
      title: '30-day streak',
      subtitle: 'Unstoppable habit.',
      emoji: '👑',
      stars: 25,
    },
    {
      id: 'mile-total-10',
      need: s.totalFinishedWorkouts >= 10,
      title: '10 workouts',
      subtitle: 'Double digits!',
      emoji: '🎯',
      stars: 5,
    },
    {
      id: 'mile-total-25',
      need: s.totalFinishedWorkouts >= 25,
      title: '25 workouts',
      subtitle: 'Building real strength.',
      emoji: '💪',
      stars: 12,
    },
    {
      id: 'mile-total-50',
      need: s.totalFinishedWorkouts >= 50,
      title: '50 workouts',
      subtitle: 'Hall of fame energy.',
      emoji: '🏅',
      stars: 30,
    },
  ]

  for (const m of milestones) {
    if (m.need && !claimed.has(m.id)) {
      out.push({
        id: m.id,
        title: m.title,
        subtitle: m.subtitle,
        emoji: m.emoji,
        stars: m.stars,
        kind: 'milestone',
      })
    }
  }

  return out
}

export function useWorkoutState(childName = 'Hudson') {
  const [state, setState] = useState<StoredState>(() => loadStoredState())

  useEffect(() => {
    saveStoredState(state)
  }, [state])

  const today = dateKey()
  const dayOfWeek = new Date().getDay()

  // Progression: level increases every 14 completed workouts
  const level = getLevel(state.totalFinishedWorkouts)
  const weekNumber = Math.ceil(level * 2 - 1) // approximate week display

  // Today's schedule and exercises
  const daySchedule = getDaySchedule(dayOfWeek)
  const todayExerciseIds = getExerciseIdsForDay(dayOfWeek)
  const todayExercises = useMemo(
    () => getExercisesForDay(dayOfWeek, level),
    [dayOfWeek, level],
  )

  const doneToday = state.progressByDate[today] ?? []

  const progressFraction = todayExerciseIds.length
    ? doneToday.filter((id) => todayExerciseIds.includes(id)).length / todayExerciseIds.length
    : 0

  const todayComplete = allDoneForDay(doneToday, todayExerciseIds)

  const completedSet = useMemo(() => new Set(state.completedDates), [state.completedDates])

  const streak = useMemo(() => computeStreak(completedSet, today), [completedSet, today])

  const claimables = useMemo(() => buildClaimables(state, today), [state, today])

  const toggleExercise = useCallback(
    (exerciseId: string) => {
      setState((prev) => {
        const cur = prev.progressByDate[today] ?? []
        const has = cur.includes(exerciseId)
        const nextList = has ? cur.filter((x) => x !== exerciseId) : uniqPush([...cur], exerciseId)

        let nextCompleted = [...prev.completedDates]
        let stars = prev.stars
        let totalFinished = prev.totalFinishedWorkouts

        const wasDayComplete = allDoneForDay(cur, todayExerciseIds)
        const nowDayComplete = allDoneForDay(nextList, todayExerciseIds)

        if (!wasDayComplete && nowDayComplete) {
          if (!nextCompleted.includes(today)) {
            nextCompleted = uniqPush(nextCompleted, today)
            stars += STARS_PER_FULL_WORKOUT + STARS_DAILY_BONUS
            totalFinished += 1
          }
        }

        if (wasDayComplete && !nowDayComplete) {
          nextCompleted = nextCompleted.filter((d) => d !== today)
        }

        return {
          ...prev,
          progressByDate: { ...prev.progressByDate, [today]: nextList },
          completedDates: nextCompleted,
          stars,
          totalFinishedWorkouts: totalFinished,
        }
      })
    },
    [today, todayExerciseIds],
  )

  const claimReward = useCallback((id: string, bonusStars: number) => {
    setState((prev) => {
      if (prev.claimedRewardIds.includes(id)) return prev
      return {
        ...prev,
        claimedRewardIds: uniqPush(prev.claimedRewardIds, id),
        stars: prev.stars + bonusStars,
      }
    })
  }, [])

  const redeemPrize = useCallback((prizeId: string): boolean => {
    const prize = PRIZES.find((p) => p.id === prizeId)
    if (!prize) return false
    let ok = false
    setState((prev) => {
      if (prev.stars < prize.starCost) return prev
      ok = true
      return { ...prev, stars: prev.stars - prize.starCost }
    })
    return ok
  }, [])

  const setVoiceEnabled = useCallback((on: boolean) => {
    setState((prev) => ({ ...prev, voiceEnabled: on }))
  }, [])

  return {
    state,
    today,
    childName,
    level,
    weekNumber,
    daySchedule,
    todayExercises,
    doneToday,
    progressFraction,
    todayComplete,
    streak,
    totalFinished: state.totalFinishedWorkouts,
    stars: state.stars,
    voiceEnabled: state.voiceEnabled,
    claimables,
    toggleExercise,
    claimReward,
    redeemPrize,
    setVoiceEnabled,
    weekDaysDone: countCompletedInWeek(completedSet),
    monthDaysDone: countCompletedInMonth(completedSet),
  }
}
