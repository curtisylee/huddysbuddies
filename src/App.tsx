import { useMemo, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { useWorkoutState } from './hooks/useWorkoutState'
import { TodayScreen } from './screens/TodayScreen'
import { RewardsScreen } from './screens/RewardsScreen'
import { StarsScreen } from './screens/StarsScreen'
import type { TabId } from './types'
import './App.css'

/** Change if you like — used in coach voice lines */
const CHILD_NAME = 'Hudson'

export default function App() {
  const [tab, setTab] = useState<TabId>('today')
  const w = useWorkoutState(CHILD_NAME)

  const doneTodaySet = useMemo(() => new Set(w.doneToday), [w.doneToday])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ●
          </span>
          <span className="brand-text">Hudson Training</span>
        </div>
        <div className="quick-stats">
          <button type="button" className="chip" onClick={() => setTab('stars')} aria-label={`${w.stars} stars`}>
            <span aria-hidden>★</span>
            <span className="chip-strong">{w.stars}</span>
          </button>
          <button type="button" className="chip" onClick={() => setTab('rewards')} aria-label={`Streak ${w.streak} days`}>
            <span aria-hidden>🔥</span>
            <span className={w.streak > 0 ? 'chip-strong' : ''}>{w.streak} streak</span>
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
