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
              {/* Teddy — goldendoodle face */}
              <circle cx="12" cy="12" r="9" fill="#d4a043" />
              <ellipse cx="5.5" cy="12" rx="3" ry="5" fill="#b8883a" />
              <ellipse cx="18.5" cy="12" rx="3" ry="5" fill="#b8883a" />
              <circle cx="12" cy="13.5" r="5.5" fill="#e8c88d" />
              <circle cx="9.5" cy="10.5" r="1.5" fill="#2d1a0e" />
              <circle cx="14.5" cy="10.5" r="1.5" fill="#2d1a0e" />
              <circle cx="10" cy="10" r="0.5" fill="#fff" />
              <circle cx="15" cy="10" r="0.5" fill="#fff" />
              <ellipse cx="12" cy="14" rx="2" ry="1.3" fill="#2d1a0e" />
              <path d="M 10 16 Q 12 18 14 16" stroke="#2d1a0e" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span className="brand-text">Huddy&apos;s Gym Buddies</span>
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
