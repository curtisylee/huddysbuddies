import type { ClaimableReward } from '../hooks/useWorkoutState'

type Props = {
  todayComplete: boolean
  streak: number
  weekDaysDone: number
  monthDaysDone: number
  totalFinished: number
  claimables: ClaimableReward[]
  claimReward: (id: string, stars: number) => void
}

export function RewardsScreen({
  todayComplete,
  streak,
  weekDaysDone,
  monthDaysDone,
  totalFinished,
  claimables,
  claimReward,
}: Props) {
  return (
    <div className="screen scroll rewards">
      <header className="hero tight">
        <p className="large-title">Trophies</p>
        <p className="subtitle">Daily sparkle, weekly chests, and big milestones.</p>
      </header>

      <section className="card-list">
        <article className="ios-card compact">
          <div className="rw-row">
            <span className="rw-icon" aria-hidden>
              📅
            </span>
            <div>
              <h3>Daily workout</h3>
              <p className="sub">Finish every exercise • earn stars automatically.</p>
            </div>
            <span className={`pill ${todayComplete ? 'pill-on' : ''}`}>{todayComplete ? 'Earned' : 'Locked'}</span>
          </div>
        </article>

        <article className="ios-card compact">
          <div className="rw-row">
            <span className="rw-icon" aria-hidden>
              🛡️
            </span>
            <div>
              <h3>This week</h3>
              <p className="sub">{weekDaysDone}/7 days logged • Claim at 5 days.</p>
            </div>
          </div>
          <div className="meter" aria-hidden>
            <span style={{ width: `${Math.min(100, (weekDaysDone / 5) * 100)}%` }} />
          </div>
        </article>

        <article className="ios-card compact">
          <div className="rw-row">
            <span className="rw-icon" aria-hidden>
              🌙
            </span>
            <div>
              <h3>This month</h3>
              <p className="sub">{monthDaysDone} days • Claim unlocks at 18 days.</p>
            </div>
          </div>
          <div className="meter" aria-hidden>
            <span style={{ width: `${Math.min(100, (monthDaysDone / 18) * 100)}%` }} />
          </div>
        </article>

        <article className="ios-card compact accent">
          <div className="rw-row tall">
            <span className="rw-icon" aria-hidden>
              🔁
            </span>
            <div>
              <h3>Streak radar</h3>
              <p className="sub">
                Current streak <strong>{streak}</strong> days • Total workouts <strong>{totalFinished}</strong>
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="claim-section">
        <h2 className="section-title">Ready to collect</h2>
        {claimables.length === 0 ? (
          <p className="empty-hint">Keep training — check back when you crush a milestone.</p>
        ) : (
          <div className="claim-grid">
            {claimables.map((c) => (
              <article key={c.id} className="ios-card reward-claim">
                <div className="rw-row tall">
                  <span className="rw-icon big" aria-hidden>
                    {c.emoji}
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p className="sub">{c.subtitle}</p>
                    <button
                      type="button"
                      className="ios-btn ios-btn-tint sm claim-btn"
                      onClick={() => claimReward(c.id, c.stars)}
                    >
                      Claim +{c.stars}★
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
