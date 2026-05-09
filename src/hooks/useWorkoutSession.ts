import { useCallback, useEffect, useRef, useState } from 'react'
import type { Exercise, WorkoutPhase } from '../types'
import {
  TOTAL_WORKOUT_SECONDS,
  TRANSITION_SECONDS,
  SECONDS_PER_REP,
  REST_BETWEEN_SETS_SECONDS,
} from '../data/program'
import { speak, cancelSpeech } from '../lib/speech'
import {
  announceExercise,
  announceTransition,
  announceSetRest,
  announceWorkoutComplete,
  announceWorkoutStart,
} from '../lib/coachCopy'

function computeSetSeconds(exercise: Exercise): number {
  if (exercise.reps === 'hold') {
    return exercise.holdSeconds ?? 20
  }
  return (exercise.reps as number) * SECONDS_PER_REP
}

export function useWorkoutSession(
  exercises: Exercise[],
  voiceEnabled: boolean,
  childName: string,
  onExerciseComplete: (exerciseId: string) => void,
) {
  const [phase, setPhase] = useState<WorkoutPhase>('idle')
  const [paused, setPaused] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(TOTAL_WORKOUT_SECONDS)
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(0)
  const [completedIds, setCompletedIds] = useState<string[]>([])

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Refs to access latest state in the interval callback
  const phaseRef = useRef(phase)
  const pausedRef = useRef(paused)
  const currentExerciseIndexRef = useRef(currentExerciseIndex)
  const currentSetRef = useRef(currentSet)
  const totalSecondsLeftRef = useRef(totalSecondsLeft)
  const phaseSecondsLeftRef = useRef(phaseSecondsLeft)
  const completedIdsRef = useRef(completedIds)
  const voiceEnabledRef = useRef(voiceEnabled)

  phaseRef.current = phase
  pausedRef.current = paused
  currentExerciseIndexRef.current = currentExerciseIndex
  currentSetRef.current = currentSet
  totalSecondsLeftRef.current = totalSecondsLeft
  phaseSecondsLeftRef.current = phaseSecondsLeft
  completedIdsRef.current = completedIds
  voiceEnabledRef.current = voiceEnabled

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer])

  const say = useCallback((text: string) => {
    speak(text, voiceEnabledRef.current)
  }, [])

  const startExercise = useCallback(
    (idx: number) => {
      const ex = exercises[idx]
      if (!ex) return
      setCurrentExerciseIndex(idx)
      setCurrentSet(1)
      const sec = computeSetSeconds(ex)
      setPhaseSecondsLeft(sec)
      setPhase('exercising-set')
      say(announceExercise(ex))
    },
    [exercises, say],
  )

  const finishExercise = useCallback(
    (idx: number) => {
      const ex = exercises[idx]
      if (!ex) return
      onExerciseComplete(ex.id)
      setCompletedIds((prev) => [...prev, ex.id])
    },
    [exercises, onExerciseComplete],
  )

  const startTransition = useCallback(
    (nextIdx: number) => {
      const nextEx = exercises[nextIdx]
      if (nextEx) {
        say(announceTransition(nextEx.name))
      }
      setPhase('transition')
      setPhaseSecondsLeft(TRANSITION_SECONDS)
    },
    [exercises, say],
  )

  const completeWorkout = useCallback(() => {
    clearTimer()
    setPhase('complete')
    say(announceWorkoutComplete(childName))
  }, [clearTimer, say, childName])

  const tick = useCallback(() => {
    if (pausedRef.current) return

    const p = phaseRef.current
    if (p === 'idle' || p === 'complete') return

    // Decrement total timer
    const newTotal = totalSecondsLeftRef.current - 1
    setTotalSecondsLeft(newTotal)

    if (newTotal <= 0) {
      // Mark current exercise done if in progress
      const curIdx = currentExerciseIndexRef.current
      if (p === 'exercising-set' || p === 'exercising-rest') {
        const ex = exercises[curIdx]
        if (ex && !completedIdsRef.current.includes(ex.id)) {
          onExerciseComplete(ex.id)
          setCompletedIds((prev) => [...prev, ex.id])
        }
      }
      completeWorkout()
      return
    }

    // Decrement phase timer
    const newPhase = phaseSecondsLeftRef.current - 1
    setPhaseSecondsLeft(newPhase)

    // Voice countdown for hold exercises
    if (p === 'exercising-set') {
      const ex = exercises[currentExerciseIndexRef.current]
      if (ex && ex.reps === 'hold') {
        if (newPhase === 10 || newPhase === 5 || (newPhase <= 3 && newPhase > 0)) {
          say(String(newPhase))
        }
      }
    }

    if (newPhase > 0) return

    // Phase time expired — transition
    const curIdx = currentExerciseIndexRef.current
    const curSet = currentSetRef.current
    const ex = exercises[curIdx]

    if (p === 'exercising-set') {
      // Set finished
      if (ex && curSet < ex.sets) {
        // More sets remaining — rest between sets
        setPhase('exercising-rest')
        setPhaseSecondsLeft(REST_BETWEEN_SETS_SECONDS)
        say(announceSetRest(curSet + 1))
      } else {
        // Exercise fully done
        finishExercise(curIdx)
        if (curIdx < exercises.length - 1) {
          startTransition(curIdx + 1)
        } else {
          completeWorkout()
        }
      }
    } else if (p === 'exercising-rest') {
      // Rest over — start next set
      const nextSet = curSet + 1
      setCurrentSet(nextSet)
      if (ex) {
        const sec = computeSetSeconds(ex)
        setPhaseSecondsLeft(sec)
        setPhase('exercising-set')
        say(`Set ${nextSet}. Go!`)
      }
    } else if (p === 'transition') {
      // Transition over — start next exercise
      const nextIdx = curIdx + 1
      if (nextIdx < exercises.length) {
        startExercise(nextIdx)
      } else {
        completeWorkout()
      }
    }
  }, [exercises, onExerciseComplete, say, finishExercise, startTransition, startExercise, completeWorkout])

  const startTimer = useCallback(() => {
    clearTimer()
    intervalRef.current = setInterval(tick, 1000)
  }, [clearTimer, tick])

  const start = useCallback(() => {
    setTotalSecondsLeft(TOTAL_WORKOUT_SECONDS)
    setCompletedIds([])
    setPaused(false)
    say(announceWorkoutStart(childName))
    // Small delay so the start announcement plays before exercise announcement
    setTimeout(() => {
      startExercise(0)
      startTimer()
    }, 1500)
  }, [childName, say, startExercise, startTimer])

  const pause = useCallback(() => {
    setPaused(true)
    cancelSpeech()
  }, [])

  const resume = useCallback(() => {
    setPaused(false)
  }, [])

  const restart = useCallback(() => {
    clearTimer()
    cancelSpeech()
    setPhase('idle')
    setPaused(false)
    setCurrentExerciseIndex(0)
    setCurrentSet(1)
    setTotalSecondsLeft(TOTAL_WORKOUT_SECONDS)
    setPhaseSecondsLeft(0)
    setCompletedIds([])
  }, [clearTimer])

  const isStarted = phase !== 'idle'

  return {
    phase,
    paused,
    currentExerciseIndex,
    currentSet,
    totalSecondsLeft,
    phaseSecondsLeft,
    completedIds,
    isStarted,
    start,
    pause,
    resume,
    restart,
  }
}
