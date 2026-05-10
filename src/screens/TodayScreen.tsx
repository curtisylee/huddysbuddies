import { CoachPanel } from '../components/CoachPanel'
import { ExerciseCard } from '../components/ExerciseCard'
import { WorkoutControls } from '../components/WorkoutControls'
import { WorkoutTimeline } from '../components/WorkoutTimeline'
import { useWorkoutSession } from '../hooks/useWorkoutSession'
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
  const session = useWorkoutSession(exercises, voiceEnabled, childName, onToggle)

  function exerciseStatus(idx: number): 'upcoming' | 'active' | 'done' {
    if (session.completedIds.includes(exercises[idx]!.id) || doneToday.has(exercises[idx]!.id)) {
      return 'done'
    }
    if (session.isStarted && session.phase !== 'complete' && idx === session.currentExerciseIndex) {
      return 'active'
    }
    return 'upcoming'
  }

  function phaseLabel(idx: number): string | undefined {
    if (exerciseStatus(idx) !== 'active') return undefined
    if (session.phase === 'exercising-rest') return 'Rest'
    if (session.phase === 'transition') return 'Get ready'
    return `Set ${session.currentSet}`
  }

  const activeExerciseName = exercises.find((e) => !doneToday.has(e.id))?.name

  return (
    <div className="screen scroll">
      <header className={`hero ${session.isStarted ? 'tight' : ''}`}>
        <div className="day-badge">
          {daySchedule.label} &mdash; {daySchedule.theme}
        </div>
        <p className="large-title">{childName}&apos;s workout</p>
        <p className="subtitle">Level {level} &bull; 10 min</p>

        {session.isStarted && session.phase !== 'complete' ? (
          <WorkoutTimeline
            exercises={exercises}
            currentExerciseIndex={session.currentExerciseIndex}
            totalSecondsLeft={session.totalSecondsLeft}
            completedIds={session.completedIds}
            paused={session.paused}
            phase={session.phase}
            currentSet={session.currentSet}
            phaseSecondsLeft={session.phaseSecondsLeft}
            onSegmentTap={session.startFromExercise}
          />
        ) : null}

        {!session.isStarted && (
          <p className="level-hint">Levels up every 14 workouts</p>
        )}
      </header>

      {session.phase === 'complete' || todayComplete ? (
        <section className="celebrate" aria-live="polite">
          <p className="celebrate-title">All done today</p>
          <p className="celebrate-sub">Daily reward unlocked &bull; stars waiting in Stars tab.</p>
        </section>
      ) : null}

      <WorkoutControls
        isStarted={session.isStarted}
        paused={session.paused}
        phase={session.phase}
        onStart={session.start}
        onPause={session.pause}
        onResume={session.resume}
      />

      {/* Encouragement banner */}
      {session.currentPhrase && session.isStarted && (
        <div className="encouragement-banner" aria-live="polite" role="status">
          <span className="encouragement-text">{session.currentPhrase}</span>
        </div>
      )}

      {!session.isStarted && session.phase !== 'complete' && (
        <CoachPanel
          childName={childName}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          fraction={fraction}
          todayComplete={todayComplete}
          activeExerciseName={activeExerciseName}
        />
      )}

      <section aria-label="Exercises">
        <h2 className="section-title">Today&apos;s exercises</h2>
        <div className="ex-stack">
          {exercises.map((ex, idx) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              status={exerciseStatus(idx)}
              currentSet={session.currentSet}
              phaseSecondsLeft={
                idx === session.currentExerciseIndex && session.isStarted
                  ? session.phaseSecondsLeft
                  : undefined
              }
              phaseLabel={phaseLabel(idx)}
              onJumpTo={() => session.startFromExercise(idx)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
