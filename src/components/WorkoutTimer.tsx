import { TOTAL_WORKOUT_SECONDS } from '../data/program'

type Props = {
  secondsLeft: number
  paused: boolean
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

const R = 68
const CIRCUM = 2 * Math.PI * R

export function WorkoutTimer({ secondsLeft, paused }: Props) {
  const fraction = secondsLeft / TOTAL_WORKOUT_SECONDS
  const dashOffset = CIRCUM * (1 - fraction)
  const urgent = secondsLeft <= 60

  return (
    <div className="workout-timer-wrap" aria-label={`${formatTime(secondsLeft)} remaining`}>
      <svg className="workout-timer-svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={urgent ? '#ff453a' : '#0a84ff'} />
            <stop offset="100%" stopColor={urgent ? '#ff9f0a' : '#5ac8fa'} />
          </linearGradient>
        </defs>
        <circle className="workout-timer-bg" cx="80" cy="80" r={R} />
        <circle
          className="workout-timer-fill"
          cx="80"
          cy="80"
          r={R}
          stroke="url(#timer-gradient)"
          strokeDasharray={CIRCUM}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="workout-timer-inner">
        <span className={`workout-timer-time ${urgent ? 'urgent' : ''}`}>
          {formatTime(secondsLeft)}
        </span>
        <span className="workout-timer-label">
          {paused ? 'Paused' : 'Remaining'}
        </span>
      </div>
    </div>
  )
}
