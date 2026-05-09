import { PRIZES } from '../data/program'

type Props = {
  stars: number
  redeemPrize: (prizeId: string) => boolean
}

export function StarsScreen({ stars, redeemPrize }: Props) {
  return (
    <div className="screen scroll stars-screen">
      <header className="hero tight balance-hero">
        <p className="large-title">Star bank</p>
        <div className="balance-pill">
          <span className="star-glyph" aria-hidden>
            ★
          </span>
          <span className="balance-num">{stars}</span>
          <span className="balance-lab">stars to spend</span>
        </div>
        <p className="subtitle">Earn stars on every finished workout • pick prizes with a parent.</p>
      </header>

      <section>
        <h2 className="section-title">Prize lane</h2>
        <div className="prize-grid">
          {PRIZES.map((p) => (
            <article key={p.id} className="ios-card prize">
              <span className="prize-emoji" aria-hidden>
                {p.emoji}
              </span>
              <h3>{p.label}</h3>
              <p className="sub price">{p.starCost} stars</p>
              <button
                type="button"
                className="ios-btn ios-btn-tint prize-btn"
                disabled={stars < p.starCost}
                onClick={() => redeemPrize(p.id)}
              >
                Redeem
              </button>
            </article>
          ))}
        </div>
        {stars < 8 ? (
          <p className="empty-hint">Keep finishing workouts — the first redeem unlocks fast.</p>
        ) : null}
      </section>
    </div>
  )
}
