import { useEffect, useState } from 'react'

type Props = {
  childName: string
  starsEarned: number
  onDismiss: () => void
}

const CONFETTI_COUNT = 80
const CONFETTI_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#c77dff', '#ff9f1c', '#ff85a1', '#00d2ff',
  '#f72585', '#7209b7', '#3a0ca3', '#4cc9f0',
]

type Piece = {
  left: number
  delay: number
  duration: number
  color: string
  size: number
  rotation: number
  shape: 'square' | 'circle' | 'strip'
}

function playCheerSound() {
  try {
    const ctx = new AudioContext()

    // Simple celebratory fanfare: ascending major chord tones
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15)
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.05)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.15 + 0.6)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.15)
      osc.stop(ctx.currentTime + i * 0.15 + 0.6)
    })

    // Shimmer effect
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 2000 + Math.random() * 2000
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.5 + i * 0.08)
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.55 + i * 0.08)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8 + i * 0.08)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + 0.5 + i * 0.08)
      osc.stop(ctx.currentTime + 1 + i * 0.08)
    }

    // Clean up context after sounds finish
    setTimeout(() => ctx.close(), 3000)
  } catch {
    // Audio not available
  }
}

function createConfetti(): Piece[] {
  return Array.from({ length: CONFETTI_COUNT }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    shape: (['square', 'circle', 'strip'] as const)[Math.floor(Math.random() * 3)]!,
  }))
}

export function CompletionCelebration({ childName, starsEarned, onDismiss }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [confetti] = useState(createConfetti)

  useEffect(() => {
    playCheerSound()
    const t = setTimeout(() => setShowModal(true), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="celebration-overlay" aria-live="assertive">
      {/* Confetti */}
      <div className="confetti-container" aria-hidden="true">
        {confetti.map((p, i) => (
          <div
            key={i}
            className={`confetti-piece confetti-${p.shape}`}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              backgroundColor: p.color,
              width: p.shape === 'strip' ? p.size * 0.4 : p.size,
              height: p.shape === 'strip' ? p.size * 2 : p.size,
              '--rotation': `${p.rotation}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Modal popup */}
      {showModal && (
        <div className="celebration-modal-backdrop" onClick={onDismiss}>
          <div
            className="celebration-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Workout complete"
          >
            <div className="celebration-trophy">🏆</div>
            <h2 className="celebration-heading">Workout Complete!</h2>
            <p className="celebration-message">
              Great job {childName}! You earned {starsEarned} stars.
            </p>
            <div className="celebration-stars">
              {Array.from({ length: starsEarned }, (_, i) => (
                <span
                  key={i}
                  className="celebration-star"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <button className="celebration-dismiss" onClick={onDismiss}>
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
