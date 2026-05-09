import { CoachPanel } from '../components/CoachPanel'
import { ExerciseCard } from '../components/ExerciseCard'
import type { DaySchedule, Exercise } from '../types'

type Props = {
  childName: string
  fraction: number
  todayComplete: boolean
  doneToday: Set<string>
  voiceEnabled: boolean
  setVoiceEnabled: (v: boolean) => void
  onToggle: (id: string) => void
  daySchedule: DaySchedule
  level: number
  exercises: Exercise[]
}

const RING_R = 50
const RING_CIRCUM = 2 * Math.PI * RING_R

export function TodayScreen({
  childName,
  fraction,
  todayComplete,
  doneToday,
  voiceEnabled,
  setVoiceEnabled,
  onToggle,
  daySchedule,
  level,
  exercises,
}: Props) {
  const pct = Math.round(fraction * 100)
  const activeExerciseName = exercises.find((e) => !doneToday.has(e.id))?.name
  const dashOffset = RING_CIRCUM * (1 - fraction)

  return (
    <div className="screen scroll">
      <header className="hero">
        <div className="day-badge">
          {daySchedule.label} &mdash; {daySchedule.theme}
        </div>
        <p className="large-title">{childName}&apos;s workout</p>
        <p className="subtitle">Level {level} &bull; 10&ndash;15 min</p>

        <div className="progress-wrap" aria-label={`Workout progress ${pct} percent`}>
          <svg className="progress-ring-svg" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fa114f" />
                <stop offset="50%" stopColor="#ff6482" />
                <stop offset="100%" stopColor="#ff9f0a" />
              </linearGradient>
            </defs>
            <circle className="progress-ring-bg" cx="60" cy="60" r={RING_R} />
            <circle
              className="progress-ring-fill"
              cx="60"
              cy="60"
              r={RING_R}
              strokeDasharray={RING_CIRCUM}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="progress-label">{pct}%</span>
        </div>

        <p className="level-hint">Levels up every 2 weeks</p>
      </header>

      {todayComplete ? (
        <section className="celebrate" aria-live="polite">
          <p className="celebrate-title">All done today</p>
          <p className="celebrate-sub">Daily reward unlocked &bull; stars waiting in Stars tab.</p>
        </section>
      ) : null}

      <CoachPanel
        childName={childName}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        fraction={fraction}
        todayComplete={todayComplete}
        activeExerciseName={activeExerciseName}
      />

      <section aria-label="Exercises">
        <h2 className="section-title">Today&apos;s exercises</h2>
        <div className="ex-stack">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              done={doneToday.has(ex.id)}
              voiceEnabled={voiceEnabled}
              onToggle={() => onToggle(ex.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
