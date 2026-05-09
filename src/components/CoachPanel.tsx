import { useEffect } from 'react'
import { coachLine } from '../lib/coachCopy'
import { speak, warmVoices } from '../lib/speech'
import './CoachPanel.css'

type Props = {
  childName: string
  voiceEnabled: boolean
  setVoiceEnabled: (v: boolean) => void
  fraction: number
  todayComplete: boolean
  activeExerciseName?: string
}

export function CoachPanel({
  childName,
  voiceEnabled,
  setVoiceEnabled,
  fraction,
  todayComplete,
  activeExerciseName,
}: Props) {
  const line = coachLine({
    childName,
    fraction,
    todayComplete,
    exerciseName: activeExerciseName,
  })

  useEffect(() => {
    warmVoices()
  }, [])

  const hearCoach = () => speak(line, voiceEnabled)

  return (
    <section className="coach-panel" aria-label="Virtual coach">
      <div className="coach-visual" aria-hidden>
        <div className="coach-bubble-face">
          <span className="coach-eye coach-eye-l" />
          <span className="coach-eye coach-eye-r" />
          <span className="coach-smile" />
        </div>
        <span className="coach-badge">Coach</span>
      </div>
      <div className="coach-copy">
        <p className="coach-message">{line}</p>
        <div className="coach-tools">
          <button type="button" className="ios-btn ios-btn-plain" onClick={hearCoach}>
            🔊 Hear coach
          </button>
          <label className="voice-toggle">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
            />
            <span>Voice on</span>
          </label>
        </div>
      </div>
    </section>
  )
}
