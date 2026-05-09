import { useEffect, useRef, useState } from 'react'
import type { Exercise } from '../types'
import { cheerForRep } from '../lib/coachCopy'
import { speak } from '../lib/speech'

type Props = {
  exercise: Exercise
  voiceEnabled: boolean
}

export function RepPad({ exercise, voiceEnabled }: Props) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const betweenSetsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdRoundRef = useRef(1)

  const isHold = exercise.reps === 'hold'
  const totalSets = exercise.sets
  const target = exercise.reps === 'hold' ? 0 : (exercise.reps as number)

  const [holdLeft, setHoldLeft] = useState<number | null>(null)
  const [holdRound, setHoldRound] = useState(1)

  const [rep, setRep] = useState({ setIdx: 1, count: 0, finished: false, rest: false })

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (betweenSetsTimer.current) clearTimeout(betweenSetsTimer.current)
    }
  }, [])

  if (isHold) {
    const startHoldTimer = () => {
      const sec = exercise.holdSeconds ?? 20
      if (timerRef.current) clearInterval(timerRef.current)

      setHoldLeft(sec)
      speak(`${sec} second hold — go!`, voiceEnabled)

      timerRef.current = setInterval(() => {
        setHoldLeft((left) => {
          if (left === null) return left
          if (left <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            speak(`Nice hold.`, voiceEnabled)

            const cur = holdRoundRef.current
            if (cur >= totalSets) {
              speak(`${exercise.name} holds complete.`, voiceEnabled)
              return 0
            }

            const next = cur + 1
            holdRoundRef.current = next
            setHoldRound(next)
            speak(`Tap start when you're ready for set ${next}.`, voiceEnabled)
            return null
          }

          const n = left - 1
          if (n === 10 || n === 5 || (n <= 3 && n > 0)) speak(String(n), voiceEnabled)
          return n
        })
      }, 1000)
    }

    return (
      <div className="rep-pad" role="region" aria-label="Hold timer">
        <p className="rep-meta">
          Set {Math.min(holdRound, totalSets)} of {totalSets} · {exercise.holdSeconds ?? 20}s holds
        </p>
        <div className="rep-controls">
          <button type="button" className="ios-btn ios-btn-tint lg" onClick={startHoldTimer}>
            {holdLeft === null || holdLeft === 0 ? 'Start hold timer' : `${holdLeft}s`}
          </button>
        </div>
      </div>
    )
  }

  const { setIdx, count, finished, rest } = rep

  const addRep = () => {
    if (finished || rest) return

    if (count < target - 1) {
      const next = count + 1
      speak(String(next), voiceEnabled)
      setRep({ ...rep, count: next })
      return
    }

    speak(cheerForRep(target, target, exercise.name), voiceEnabled)

    if (setIdx < totalSets) {
      setRep({ setIdx, count: target, finished: false, rest: true })
      const nextIdx = setIdx + 1
      betweenSetsTimer.current = setTimeout(() => {
        speak(`Set ${nextIdx}. Let's go.`, voiceEnabled)
        setRep({ setIdx: nextIdx, count: 0, finished: false, rest: false })
      }, 500)
      return
    }

    speak(`${exercise.name} complete — check it off when you're ready.`, voiceEnabled)
    setRep({ setIdx, count: target, finished: true, rest: false })
  }

  const canTap = !finished && !rest

  return (
    <div className="rep-pad" role="region" aria-label="Rep counter">
      <p className="rep-meta">
        Set {Math.min(setIdx, totalSets)} of {totalSets} · Target {target} reps each
      </p>
      <div className="rep-big" aria-live="polite">
        <span className="rep-num">{Math.min(count, target)}</span>
        <span className="rep-of">/</span>
        <span>{target}</span>
      </div>
      <div className="rep-controls">
        <button type="button" className="ios-btn ios-btn-tint lg" onClick={addRep} disabled={!canTap}>
          +1 Rep
        </button>
      </div>
      {finished ? (
        <p className="rep-done">All sets logged — tap the circle to check it done.</p>
      ) : null}
    </div>
  )
}
