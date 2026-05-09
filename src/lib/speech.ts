let warned = false

export function cancelSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

export function speak(text: string, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.92
    u.pitch = 1.08
    const voices = window.speechSynthesis.getVoices()
    const preferred =
      voices.find((v) => /en-GB|en-US/.test(v.lang) && /Samantha|Karen|Google US English/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith('en'))
    if (preferred) u.voice = preferred
    window.speechSynthesis.speak(u)
  } catch {
    if (!warned && import.meta.env.DEV) {
      warned = true
      console.warn('Speech synthesis unavailable')
    }
  }
}

/** iOS loads voices async */
export function warmVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}
