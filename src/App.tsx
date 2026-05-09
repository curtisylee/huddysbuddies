import { useMemo, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { useWorkoutState } from './hooks/useWorkoutState'
import { TodayScreen } from './screens/TodayScreen'
import { RewardsScreen } from './screens/RewardsScreen'
import { StarsScreen } from './screens/StarsScreen'
import type { TabId } from './types'
import './App.css'

const CHILD_NAME = 'Hudson'

export default function App() {
  const [tab, setTab] = useState<TabId>('today')
  const w = useWorkoutState(CHILD_NAME)

  const doneTodaySet = useMemo(() => new Set(w.doneToday), [w.doneToday])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <div className="brand-icon" aria-hidden>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6.99 8.48v5h2v-3.5l1.8-.7-1.6 8.1-4.9-1-.4 2 6.49 1z" />
            </svg>
          </div>
          <span className="brand-text">Hudson Training</span>
        </div>
        <div className="quick-stats">
          <button type="button" className="chip" onClick={() => setTab('stars')} aria-label={`${w.stars} stars`}>
            <span aria-hidden>&#9733;</span>
            <span className="chip-strong">{w.stars}</span>
          </button>
          <button type="button" className="chip" onClick={() => setTab('rewards')} aria-label={`Streak ${w.streak} days`}>
            <span className="chip-strong">{w.streak}</span>
            <span>day streak</span>
          </button>
        </div>
      </header>

      <main className="shell-main">
        {tab === 'today' ? (
          <TodayScreen
            childName={CHILD_NAME}
            fraction={w.progressFraction}
            todayComplete={w.todayComplete}
            doneToday={doneTodaySet}
            voiceEnabled={w.voiceEnabled}
            setVoiceEnabled={w.setVoiceEnabled}
            onToggle={w.toggleExercise}
            daySchedule={w.daySchedule}
            level={w.level}
            exercises={w.todayExercises}
          />
        ) : null}
        {tab === 'rewards' ? (
          <RewardsScreen
            todayComplete={w.todayComplete}
            streak={w.streak}
            weekDaysDone={w.weekDaysDone}
            monthDaysDone={w.monthDaysDone}
            totalFinished={w.totalFinished}
            claimables={w.claimables}
            claimReward={w.claimReward}
          />
        ) : null}
        {tab === 'stars' ? <StarsScreen stars={w.stars} redeemPrize={w.redeemPrize} /> : null}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}
