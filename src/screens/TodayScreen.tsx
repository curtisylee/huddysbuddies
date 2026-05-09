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

  return (
    <div className="screen scroll">
      <header className="hero">
        <p className="large-title">{childName}&apos;s move time</p>
        <p className="subtitle">
          {daySchedule.label} &mdash; {daySchedule.theme} &bull; Level {level}
        </p>
        <div className="progress-wrap" aria-label={`Workout progress ${pct} percent`}>
          <div
            className="progress-ring"
            style={{
              background: `conic-gradient(var(--tint) ${pct}%, var(--fill-tertiary) 0)`,
            }}
          />
          <span className="progress-label">{pct}%</span>
        </div>
        <p className="level-hint">
          Level up every 2 weeks &bull; next level at {level * 14 - 13} days
        </p>
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
        <h2 className="section-title">Today&apos;s checklist</h2>
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
