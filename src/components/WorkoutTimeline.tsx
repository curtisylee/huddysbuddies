import type { Exercise } from '../types'
import {
  TOTAL_WORKOUT_SECONDS,
  TRANSITION_SECONDS,
  SECONDS_PER_REP,
  REST_BETWEEN_SETS_SECONDS,
} from '../data/program'

const SEGMENT_COLORS = [
  '#ff6b6b', // coral red
  '#ffd93d', // yellow
  '#6bcb77', // green
  '#4d96ff', // blue
  '#c77dff', // purple
  '#ff9f1c', // orange
]

type Props = {
  exercises: Exercise[]
  currentExerciseIndex: number
  totalSecondsLeft: number
  completedIds: string[]
  paused: boolean
  onSegmentTap: (idx: number) => void
}

function estimateExerciseDuration(ex: Exercise): number {
  const setSeconds =
    ex.reps === 'hold'
      ? (ex.holdSeconds ?? 20)
      : (ex.reps as number) * SECONDS_PER_REP
  const restSeconds = (ex.sets - 1) * REST_BETWEEN_SETS_SECONDS
  return ex.sets * setSeconds + restSeconds
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function abbreviate(name: string): string {
  // Use first word, or first 5 chars if single word
  const first = name.split(' ')[0]!
  return first.length > 6 ? first.slice(0, 5) : first
}

export function WorkoutTimeline({
  exercises,
  currentExerciseIndex,
  totalSecondsLeft,
  completedIds,
  paused,
  onSegmentTap,
}: Props) {
  const durations = exercises.map(estimateExerciseDuration)
  const transitionTotal = (exercises.length - 1) * TRANSITION_SECONDS
  const exerciseTotal = durations.reduce((a, b) => a + b, 0)
  const totalEstimated = exerciseTotal + transitionTotal

  const elapsed = TOTAL_WORKOUT_SECONDS - totalSecondsLeft
  const playheadPct = Math.min(100, (elapsed / TOTAL_WORKOUT_SECONDS) * 100)

  // Build segment data
  type Segment = {
    exerciseIdx: number  // -1 for gap
    widthPct: number
    color: string
    label: string
  }

  const segments: Segment[] = []
  exercises.forEach((ex, idx) => {
    const exPct = (durations[idx]! / totalEstimated) * 100
    segments.push({
      exerciseIdx: idx,
      widthPct: exPct,
      color: SEGMENT_COLORS[idx % SEGMENT_COLORS.length]!,
      label: abbreviate(ex.name),
    })
    if (idx < exercises.length - 1) {
      const gapPct = (TRANSITION_SECONDS / totalEstimated) * 100
      segments.push({ exerciseIdx: -1, widthPct: gapPct, color: 'transparent', label: '' })
    }
  })

  return (
    <div className="workout-timeline-wrap" aria-label="Workout timeline">
      {/* Labels */}
      <div className="timeline-labels">
        {segments.map((s, i) =>
          s.exerciseIdx >= 0 ? (
            <span
              key={i}
              className="timeline-label"
              style={{ width: `${s.widthPct}%` }}
            >
              {s.widthPct > 8 ? s.label : ''}
            </span>
          ) : (
            <span key={i} style={{ width: `${s.widthPct}%` }} />
          ),
        )}
      </div>

      {/* Bar */}
      <div className="timeline-bar" role="group">
        {segments.map((s, i) => {
          if (s.exerciseIdx < 0) {
            return <div key={i} className="timeline-gap" style={{ flexBasis: `${s.widthPct}%` }} />
          }
          const idx = s.exerciseIdx
          const isDone = completedIds.includes(exercises[idx]!.id)
          const isActive = idx === currentExerciseIndex && !isDone
          const cls = isDone
            ? 'timeline-seg timeline-seg-done'
            : isActive
              ? 'timeline-seg timeline-seg-active'
              : 'timeline-seg timeline-seg-upcoming'

          return (
            <button
              key={i}
              type="button"
              className={cls}
              style={
                {
                  flexBasis: `${s.widthPct}%`,
                  '--seg-color': s.color,
                } as React.CSSProperties
              }
              onClick={(e) => {
                e.stopPropagation()
                onSegmentTap(idx)
              }}
              title={exercises[idx]!.name}
              aria-label={`Jump to ${exercises[idx]!.name}`}
              aria-current={isActive ? 'true' : undefined}
            />
          )
        })}

        {/* Playhead */}
        <div
          className={`timeline-playhead ${paused ? 'timeline-playhead-paused' : ''}`}
          style={{ left: `${playheadPct}%` }}
          aria-hidden
        />
      </div>

      {/* Time remaining */}
      <div className="timeline-time-remaining">
        <span>{formatTime(totalSecondsLeft)}</span>
        <span className="timeline-time-label">{paused ? 'paused' : 'remaining'}</span>
      </div>
    </div>
  )
}
