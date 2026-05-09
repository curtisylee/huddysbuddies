import { useState } from 'react'
import type { Exercise } from '../types'
import { RepPad } from './RepPad'
import { speak } from '../lib/speech'

type Props = {
  exercise: Exercise
  done: boolean
  voiceEnabled: boolean
  onToggle: () => void
}

function formatWork(exercise: Exercise): string {
  if (exercise.reps === 'hold') {
    const s = exercise.holdSeconds ?? 20
    return `${exercise.sets} x ${s}s hold`
  }
  return `${exercise.sets} x ${exercise.reps} reps`
}

export function ExerciseCard({ exercise, done, voiceEnabled, onToggle }: Props) {
  const [open, setOpen] = useState(false)

  const announce = () => {
    const head = `${exercise.name}. ${formatWork(exercise)}.`
    speak(`${head} ${exercise.cue} ${exercise.steps.join(' ')}`, voiceEnabled)
  }

  return (
    <article className={`ex-card ${done ? 'done' : ''}`}>
      <button
        type="button"
        className="ex-check"
        onClick={onToggle}
        aria-pressed={done}
        aria-label={`Mark ${exercise.name} ${done ? 'not done' : 'done'}`}
      >
        <svg className="ex-check-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </button>
      <div className="ex-body">
        <div className="ex-row">
          <div>
            <h3 className="ex-title">{exercise.name}</h3>
            <p className="ex-meta">{formatWork(exercise)}</p>
          </div>
          <button
            type="button"
            className="ios-btn ios-btn-secondary sm"
            onClick={() => {
              setOpen((o) => !o)
              if (!open) announce()
            }}
          >
            {open ? 'Hide' : 'Guide'}
          </button>
        </div>
        {open ? (
          <>
            <p className="ex-cue">{exercise.cue}</p>
            <ol className="ex-steps">
              {exercise.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <RepPad key={exercise.id} exercise={exercise} voiceEnabled={voiceEnabled} />
            <button type="button" className="ios-btn ios-btn-plain sm hear-steps" onClick={announce}>
              Hear all steps
            </button>
          </>
        ) : null}
      </div>
    </article>
  )
}
