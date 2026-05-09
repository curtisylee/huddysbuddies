type Props = {
  isStarted: boolean
  paused: boolean
  phase: string
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onRestart: () => void
}

function PlayIcon() {
  return (
    <svg className="ctrl-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className="ctrl-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
    </svg>
  )
}

export function WorkoutControls({
  isStarted,
  paused,
  phase,
  onStart,
  onPause,
  onResume,
  onRestart,
}: Props) {
  if (phase === 'complete') {
    return (
      <div className="workout-controls">
        <button type="button" className="ios-btn ios-btn-tint lg" onClick={onRestart}>
          START AGAIN
        </button>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="workout-controls">
        <button type="button" className="ios-btn ios-btn-tint lg" onClick={onStart}>
          START WORKOUT
        </button>
      </div>
    )
  }

  return (
    <div className="workout-controls two-col">
      {paused ? (
        <button
          type="button"
          className="ios-btn ios-btn-tint lg ctrl-btn"
          onClick={onResume}
          aria-label="Resume"
        >
          <PlayIcon />
        </button>
      ) : (
        <button
          type="button"
          className="ios-btn ios-btn-secondary lg ctrl-btn"
          onClick={onPause}
          aria-label="Pause"
        >
          <PauseIcon />
        </button>
      )}
      <button type="button" className="ios-btn lg workout-restart-btn" onClick={onRestart}>
        RESTART
      </button>
    </div>
  )
}
