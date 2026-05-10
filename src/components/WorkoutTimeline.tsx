import type { Exercise, WorkoutPhase } from '../types'
import {
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
  phase: WorkoutPhase
  currentSet: number
  phaseSecondsLeft: number
  onSegmentTap: (idx: number) => void
}

function computeSetSeconds(ex: Exercise): number {
  return ex.reps === 'hold'
    ? (ex.holdSeconds ?? 20)
    : (ex.reps as number) * SECONDS_PER_REP
}

function estimateExerciseDuration(ex: Exercise): number {
  const setSeconds = computeSetSeconds(ex)
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
  phase,
  currentSet,
  phaseSecondsLeft,
  onSegmentTap,
}: Props) {
  const durations = exercises.map(estimateExerciseDuration)
  const transitionTotal = (exercises.length - 1) * TRANSITION_SECONDS
  const exerciseTotal = durations.reduce((a, b) => a + b, 0)
  const totalEstimated = exerciseTotal + transitionTotal
  const gapWidthPct = exercises.length > 1 ? (TRANSITION_SECONDS / totalEstimated) * 100 : 0

  // Compute cumulative start position for each exercise segment
  const segStartPct: number[] = []
  const segWidthPct: number[] = []
  let cum = 0
  for (let i = 0; i < exercises.length; i++) {
    segStartPct.push(cum)
    const w = (durations[i]! / totalEstimated) * 100
    segWidthPct.push(w)
    cum += w
    if (i < exercises.length - 1) {
      cum += gapWidthPct
    }
  }

  // Compute playhead position based on current exercise progress
  let playheadPct = 0
  if (phase === 'complete') {
    playheadPct = 100
  } else if (phase === 'transition') {
    // During transition, currentExerciseIndex still points to the just-completed exercise.
    // Playhead should be in the gap after that segment.
    const idx = currentExerciseIndex
    const segEnd = segStartPct[idx]! + segWidthPct[idx]!
    const gapElapsed = TRANSITION_SECONDS - phaseSecondsLeft
    const gapProgress = gapElapsed / TRANSITION_SECONDS
    playheadPct = segEnd + gapWidthPct * gapProgress
  } else if (phase === 'exercising-set' || phase === 'exercising-rest') {
    const idx = currentExerciseIndex
    const ex = exercises[idx]!
    const setSeconds = computeSetSeconds(ex)
    const totalDur = durations[idx]!

    let elapsed = 0
    if (phase === 'exercising-set') {
      const prevSets = currentSet - 1
      elapsed =
        prevSets * setSeconds +
        prevSets * REST_BETWEEN_SETS_SECONDS +
        (setSeconds - phaseSecondsLeft)
    } else {
      // exercising-rest: current set just finished, resting before next
      elapsed =
        currentSet * setSeconds +
        (currentSet - 1) * REST_BETWEEN_SETS_SECONDS +
        (REST_BETWEEN_SETS_SECONDS - phaseSecondsLeft)
    }

    const progress = Math.min(1, elapsed / totalDur)
    playheadPct = segStartPct[idx]! + segWidthPct[idx]! * progress
  }
  playheadPct = Math.min(100, Math.max(0, playheadPct))

  // Build segment data for rendering
  type Segment = {
    exerciseIdx: number  // -1 for gap
    widthPct: number
    color: string
    label: string
  }

  const segments: Segment[] = []
  exercises.forEach((ex, idx) => {
    segments.push({
      exerciseIdx: idx,
      widthPct: segWidthPct[idx]!,
      color: SEGMENT_COLORS[idx % SEGMENT_COLORS.length]!,
      label: abbreviate(ex.name),
    })
    if (idx < exercises.length - 1) {
      segments.push({ exerciseIdx: -1, widthPct: gapWidthPct, color: 'transparent', label: '' })
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
