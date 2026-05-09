let warned = false
let cachedVoice: SpeechSynthesisVoice | null = null

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice

  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  // Prefer a deep male English voice — closest to a commanding, natural tone
  const deepMale =
    voices.find((v) => /Daniel/i.test(v.name) && v.lang.startsWith('en')) ??      // macOS/iOS deep British male
    voices.find((v) => /Alex/i.test(v.name) && v.lang.startsWith('en')) ??         // macOS deep American male
    voices.find((v) => /Aaron/i.test(v.name) && v.lang.startsWith('en')) ??        // macOS male
    voices.find((v) => /Thomas/i.test(v.name) && v.lang.startsWith('en')) ??       // macOS male
    voices.find((v) => /Google UK English Male/i.test(v.name)) ??                  // Chrome deep male
    voices.find((v) => /Male/i.test(v.name) && v.lang.startsWith('en')) ??         // any English male
    voices.find((v) => v.lang.startsWith('en'))

  if (deepMale) cachedVoice = deepMale
  return cachedVoice
}

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
    u.rate = 0.95
    u.pitch = 0.85
    const voice = pickVoice()
    if (voice) u.voice = voice
    window.speechSynthesis.speak(u)
  } catch {
    if (!warned && import.meta.env.DEV) {
      warned = true
      console.warn('Speech synthesis unavailable')
    }
  }
}

/** iOS loads voices async — call early to warm the cache */
export function warmVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoice = null
    window.speechSynthesis.getVoices()
  })
}
