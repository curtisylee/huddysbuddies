import { useEffect, useRef, useState } from 'react'
import type { Exercise } from '../types'
import { SECONDS_PER_REP } from '../data/program'

type Props = {
  exercise: Exercise
  status: 'upcoming' | 'active' | 'done'
  currentSet?: number
  phaseSecondsLeft?: number
  phaseLabel?: string
  paused?: boolean
  onJumpTo?: () => void
}

function formatWork(exercise: Exercise): string {
  if (exercise.reps === 'hold') {
    const s = exercise.holdSeconds ?? 20
    return `${exercise.sets} x ${s}s hold`
  }
  return `${exercise.sets} x ${exercise.reps} reps`
}

function formatPhaseTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m > 0) return `${m}:${String(sec).padStart(2, '0')}`
  return `${sec}s`
}

export function ExerciseCard({
  exercise,
  status,
  currentSet,
  phaseSecondsLeft,
  phaseLabel,
  paused,
  onJumpTo,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef<HTMLElement>(null)

  // Auto-expand and scroll into view when active
  useEffect(() => {
    if (status === 'active') {
      setExpanded(true)
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [status])

  const handleClick = () => {
    if (status === 'active' && onJumpTo) {
      onJumpTo()
    } else {
      setExpanded((o) => !o)
    }
  }

  return (
    <article
      ref={cardRef}
      className={`ex-card ex-${status}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="ex-status-icon">
        {status === 'done' ? (
          <svg className="ex-check-icon show" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="4 12 10 18 20 6" />
          </svg>
        ) : status === 'active' ? (
          <div className="ex-active-dot" />
        ) : (
          <div className="ex-upcoming-dot" />
        )}
      </div>
      <div className="ex-body">
        <div className="ex-row">
          <div>
            <h3 className="ex-title">{exercise.name}</h3>
            <p className="ex-meta">{formatWork(exercise)}</p>
          </div>
          {status === 'active' && phaseSecondsLeft !== undefined && (
            <div className="ex-live-info">
              <span className="ex-live-time">{formatPhaseTime(phaseSecondsLeft)}</span>
              <span className="ex-live-label">
                {phaseLabel ?? `Set ${currentSet ?? 1}`}
              </span>
            </div>
          )}
        </div>

        {expanded && (
          <div className="ex-expanded">
            <div className="ex-gif-wrap">
              <img
                className={`ex-exercise-img ex-anim-${exercise.id}${
                  status === 'active' && phaseLabel?.startsWith('Set') && !paused
                    ? ' ex-animating'
                    : ''
                }`}
                style={
                  status === 'active' && phaseLabel?.startsWith('Set')
                    ? ({
                        '--anim-dur': `${exercise.reps === 'hold' ? 3 : (exercise.secondsPerRep ?? SECONDS_PER_REP)}s`,
                      } as React.CSSProperties)
                    : undefined
                }
                src={`/exercises/${exercise.id}.png`}
                alt={`${exercise.name} demonstration`}
              />
            </div>
            <p className="ex-cue">{exercise.cue}</p>
          </div>
        )}
      </div>
    </article>
  )
}
