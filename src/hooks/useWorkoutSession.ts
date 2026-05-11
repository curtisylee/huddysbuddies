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
  announceRestCountdown,
  announceSetStart,
  announceWorkoutComplete,
  announceWorkoutStart,
  pickEncouragement,
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
  const [currentPhrase, setCurrentPhrase] = useState<string | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phraseClearRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refs to access latest state in the interval callback
  const phaseRef = useRef(phase)
  const pausedRef = useRef(paused)
  const currentExerciseIndexRef = useRef(currentExerciseIndex)
  const currentSetRef = useRef(currentSet)
  const completedIdsRef = useRef(completedIds)
  const voiceEnabledRef = useRef(voiceEnabled)

  // Wall-clock timestamps for accurate timing across background tabs
  const totalEndRef = useRef(0)   // Date.now() when total timer expires
  const phaseEndRef = useRef(0)   // Date.now() when current phase expires
  const pauseStartRef = useRef(0) // Date.now() when pause started
  const lastVoiceSecRef = useRef(-1) // last phase second we announced (dedup)

  phaseRef.current = phase
  pausedRef.current = paused
  currentExerciseIndexRef.current = currentExerciseIndex
  currentSetRef.current = currentSet
  completedIdsRef.current = completedIds
  voiceEnabledRef.current = voiceEnabled

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const showPhrase = useCallback((phrase: string) => {
    if (phraseClearRef.current) clearTimeout(phraseClearRef.current)
    setCurrentPhrase(phrase)
    phraseClearRef.current = setTimeout(() => setCurrentPhrase(null), 3000)
  }, [])

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimer()
    if (phraseClearRef.current) clearTimeout(phraseClearRef.current)
  }, [clearTimer])

  const say = useCallback((text: string) => {
    speak(text, voiceEnabledRef.current)
  }, [])

  // Show encouragement on screen AND speak it aloud
  const encourage = useCallback(() => {
    const phrase = pickEncouragement()
    showPhrase(phrase)
    say(phrase)
  }, [showPhrase, say])

  const startExercise = useCallback(
    (idx: number) => {
      const ex = exercises[idx]
      if (!ex) return
      setCurrentExerciseIndex(idx)
      setCurrentSet(1)
      const sec = computeSetSeconds(ex)
      setPhaseSecondsLeft(sec)
      phaseEndRef.current = Date.now() + sec * 1000
      lastVoiceSecRef.current = sec
      setPhase('exercising-set')
      say(announceExercise(ex))
      // Show encouragement as text only — speaking it would cancel the
      // exercise announcement since speak() cancels previous speech
      showPhrase(pickEncouragement())
    },
    [exercises, say, showPhrase],
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
        showPhrase(pickEncouragement())
      }
      setPhase('transition')
      setPhaseSecondsLeft(TRANSITION_SECONDS)
      phaseEndRef.current = Date.now() + TRANSITION_SECONDS * 1000
      lastVoiceSecRef.current = TRANSITION_SECONDS
    },
    [exercises, say, showPhrase],
  )

  const completeWorkout = useCallback(() => {
    clearTimer()
    setPhase('complete')
    say(announceWorkoutComplete(childName))
    const phrase = 'you are a champion!'
    showPhrase(phrase)
    say(phrase)
  }, [clearTimer, say, childName, showPhrase])

  const tick = useCallback(() => {
    if (pausedRef.current) return

    const p = phaseRef.current
    if (p === 'idle' || p === 'complete') return

    const now = Date.now()

    // Compute total remaining from wall clock
    const newTotal = Math.max(0, Math.ceil((totalEndRef.current - now) / 1000))
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

    // Compute phase remaining from wall clock
    const newPhase = Math.max(0, Math.ceil((phaseEndRef.current - now) / 1000))
    setPhaseSecondsLeft(newPhase)

    // Voice announcements — only when the second value actually changes
    if (newPhase > 0 && newPhase !== lastVoiceSecRef.current) {
      lastVoiceSecRef.current = newPhase

      if (p === 'exercising-set') {
        const ex = exercises[currentExerciseIndexRef.current]
        if (ex) {
          if (ex.reps === 'hold') {
            if (newPhase === 20 || newPhase === 15 || newPhase === 10) {
              say(String(newPhase))
            } else if (newPhase <= 5) {
              say(String(newPhase))
            }
          } else {
            const totalSetSeconds = computeSetSeconds(ex)
            const elapsed = totalSetSeconds - newPhase
            if (elapsed > 0 && elapsed % SECONDS_PER_REP === 0) {
              const repNum = elapsed / SECONDS_PER_REP
              say(String(repNum))
            }
          }
        }
      }

      if (p === 'exercising-rest' && newPhase <= 5) {
        say(announceRestCountdown(newPhase))
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
        phaseEndRef.current = now + REST_BETWEEN_SETS_SECONDS * 1000
        lastVoiceSecRef.current = REST_BETWEEN_SETS_SECONDS
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
        phaseEndRef.current = now + sec * 1000
        lastVoiceSecRef.current = sec
        say(announceSetStart(nextSet))
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

  // Catch up immediately when the tab becomes visible again
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !pausedRef.current) {
        tick()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [tick])

  const startTimer = useCallback(() => {
    clearTimer()
    intervalRef.current = setInterval(tick, 1000)
  }, [clearTimer, tick])

  const start = useCallback(() => {
    setTotalSecondsLeft(TOTAL_WORKOUT_SECONDS)
    setCompletedIds([])
    setPaused(false)
    setCurrentPhrase(null)
    say(announceWorkoutStart(childName))
    setTimeout(() => {
      totalEndRef.current = Date.now() + TOTAL_WORKOUT_SECONDS * 1000
      startExercise(0)
      startTimer()
    }, 1500)
  }, [childName, say, startExercise, startTimer])

  const startFromExercise = useCallback(
    (idx: number) => {
      const ex = exercises[idx]
      if (!ex) return
      cancelSpeech()
      // If idle, initialize total timer
      if (phaseRef.current === 'idle') {
        setTotalSecondsLeft(TOTAL_WORKOUT_SECONDS)
        totalEndRef.current = Date.now() + TOTAL_WORKOUT_SECONDS * 1000
        setCompletedIds([])
      }
      setPaused(false)
      startExercise(idx)
      startTimer()
    },
    [exercises, startExercise, startTimer],
  )

  const pause = useCallback(() => {
    setPaused(true)
    pauseStartRef.current = Date.now()
    cancelSpeech()
  }, [])

  const resume = useCallback(() => {
    // Shift end timestamps forward by the paused duration
    const pausedMs = Date.now() - pauseStartRef.current
    totalEndRef.current += pausedMs
    phaseEndRef.current += pausedMs
    setPaused(false)
  }, [])

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
    currentPhrase,
    start,
    pause,
    resume,
    startFromExercise,
  }
}
