import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

// Inline Web Worker — not throttled in background tabs unlike setInterval
function createTickerWorker(intervalMs: number): Worker {
  const code = `let id=null;self.onmessage=e=>{if(e.data==='start'){if(id)clearInterval(id);id=setInterval(()=>self.postMessage('t'),${intervalMs})}else if(e.data==='stop'){if(id){clearInterval(id);id=null}}}`
  const blob = new Blob([code], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

function computeSetSeconds(exercise: Exercise): number {
  if (exercise.reps === 'hold') {
    return exercise.holdSeconds ?? 20
  }
  const perRep = exercise.secondsPerRep ?? SECONDS_PER_REP
  // +1 buffer so the final rep is never clipped by timing jitter
  return Math.ceil((exercise.reps as number) * perRep) + 1
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

  const workerRef = useRef<Worker | null>(null)
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
  const lastRepRef = useRef(0)      // last rep number we announced
  const exerciseStartRef = useRef(0) // when current exercise started (for hold delay)
  const finishedIdsRef = useRef(new Set<string>()) // guard against double-finish

  const clearTimer = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage('stop')
      workerRef.current.terminate()
      workerRef.current = null
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

  // Speak without cancelling previous speech — used for rep/hold/rest counts
  const count = useCallback((text: string) => {
    speak(text, voiceEnabledRef.current, false)
  }, [])

  const startExercise = useCallback(
    (idx: number) => {
      const ex = exercises[idx]
      if (!ex) return
      setCurrentExerciseIndex(idx)
      setCurrentSet(1)
      const sec = computeSetSeconds(ex)
      setPhaseSecondsLeft(sec)
      phaseEndRef.current = Date.now() + sec * 1000
      lastVoiceSecRef.current = sec + 1 // +1 so the first second is announced
      setPhase('exercising-set')
      lastRepRef.current = 0
      exerciseStartRef.current = Date.now()
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
      if (finishedIdsRef.current.has(ex.id)) return
      finishedIdsRef.current.add(ex.id)
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
      lastVoiceSecRef.current = TRANSITION_SECONDS + 1
    },
    [exercises, say, showPhrase],
  )

  const completeWorkout = useCallback(() => {
    clearTimer()
    // Mark every exercise done so stars are always awarded
    exercises.forEach((_, i) => finishExercise(i))
    setPhase('complete')
    say(announceWorkoutComplete(childName))
    const phrase = 'you are a champion!'
    showPhrase(phrase)
    say(phrase)
  }, [clearTimer, exercises, finishExercise, say, childName, showPhrase])

  const tick = useCallback(() => {
    if (pausedRef.current) return

    const p = phaseRef.current
    if (p === 'idle' || p === 'complete') return

    const now = Date.now()

    // Compute total remaining from wall clock
    const newTotal = Math.max(0, Math.ceil((totalEndRef.current - now) / 1000))
    setTotalSecondsLeft(newTotal)

    if (newTotal <= 0) {
      // completeWorkout finishes all remaining exercises before ending
      completeWorkout()
      return
    }

    // Compute phase remaining from wall clock
    const newPhase = Math.max(0, Math.ceil((phaseEndRef.current - now) / 1000))
    setPhaseSecondsLeft(newPhase)

    // Rep counting — runs every tick (250ms) for sub-second accuracy
    // No newPhase > 0 guard: the final rep lands exactly when the phase expires
    if (p === 'exercising-set') {
      const ex = exercises[currentExerciseIndexRef.current]
      if (ex && ex.reps !== 'hold') {
        const perRep = ex.secondsPerRep ?? SECONDS_PER_REP
        const target = ex.reps as number
        const totalSetMs = computeSetSeconds(ex) * 1000
        const elapsedMs = totalSetMs - (phaseEndRef.current - now)
        const repNow = Math.min(target, Math.floor(elapsedMs / (perRep * 1000)))
        if (repNow > lastRepRef.current && repNow > 0) {
          lastRepRef.current = repNow
          count(String(repNow))
        }
      }
    }

    // Voice announcements — only when the second value actually changes
    if (newPhase > 0 && newPhase !== lastVoiceSecRef.current) {
      lastVoiceSecRef.current = newPhase

      if (p === 'exercising-set') {
        const ex = exercises[currentExerciseIndexRef.current]
        if (ex && ex.reps === 'hold') {
          // Delay voice counting 3s so the exercise announcement finishes first
          const elapsed = now - exerciseStartRef.current
          if (elapsed >= 3000) {
            count(String(newPhase))
          }
        }
      }

      if (p === 'exercising-rest' && newPhase <= 5) {
        count(announceRestCountdown(newPhase))
      }
    }

    if (newPhase > 0) return

    // Phase time expired — transition
    const curIdx = currentExerciseIndexRef.current
    const curSet = currentSetRef.current
    const ex = exercises[curIdx]

    if (p === 'exercising-set') {
      // Set finished — delay announcement so the last count finishes speaking
      if (ex && curSet < ex.sets) {
        // More sets remaining — rest between sets
        setPhase('exercising-rest')
        setPhaseSecondsLeft(REST_BETWEEN_SETS_SECONDS)
        phaseEndRef.current = now + REST_BETWEEN_SETS_SECONDS * 1000
        lastVoiceSecRef.current = REST_BETWEEN_SETS_SECONDS + 1
        setTimeout(() => say(announceSetRest(curSet + 1)), 500)
      } else {
        // Exercise fully done
        finishExercise(curIdx)
        if (curIdx < exercises.length - 1) {
          setTimeout(() => startTransition(curIdx + 1), 500)
        } else {
          setTimeout(() => completeWorkout(), 500)
        }
      }
    } else if (p === 'exercising-rest') {
      // Rest over — start next set, delay so last countdown finishes
      const nextSet = curSet + 1
      setCurrentSet(nextSet)
      if (ex) {
        const sec = computeSetSeconds(ex)
        setPhaseSecondsLeft(sec)
        setPhase('exercising-set')
        phaseEndRef.current = now + sec * 1000
        lastVoiceSecRef.current = sec + 1 // +1 so the first second is announced
        lastRepRef.current = 0
        exerciseStartRef.current = now // reset for hold counting delay
        setTimeout(() => say(announceSetStart(nextSet)), 500)
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
  }, [exercises, say, count, finishExercise, startTransition, startExercise, completeWorkout])

  const tickRef = useRef(tick)

  useLayoutEffect(() => {
    phaseRef.current = phase
    pausedRef.current = paused
    currentExerciseIndexRef.current = currentExerciseIndex
    currentSetRef.current = currentSet
    completedIdsRef.current = completedIds
    voiceEnabledRef.current = voiceEnabled
    tickRef.current = tick
  })

  const startTimer = useCallback(() => {
    clearTimer()
    const w = createTickerWorker(250)
    w.onmessage = () => tickRef.current()
    w.postMessage('start')
    workerRef.current = w
  }, [clearTimer])

  const start = useCallback(() => {
    setTotalSecondsLeft(TOTAL_WORKOUT_SECONDS)
    setCompletedIds([])
    finishedIdsRef.current.clear()
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
