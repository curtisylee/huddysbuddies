type Props = {
  isStarted: boolean
  paused: boolean
  phase: string
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onRestart: () => void
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
          Start again
        </button>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="workout-controls">
        <button type="button" className="ios-btn ios-btn-tint lg" onClick={onStart}>
          Start workout
        </button>
      </div>
    )
  }

  return (
    <div className="workout-controls">
      {paused ? (
        <button type="button" className="ios-btn ios-btn-tint lg" onClick={onResume}>
          Resume
        </button>
      ) : (
        <button type="button" className="ios-btn ios-btn-secondary lg" onClick={onPause}>
          Pause
        </button>
      )}
      <button type="button" className="ios-btn lg workout-restart-btn" onClick={onRestart}>
        Restart
      </button>
    </div>
  )
}
