import type { StoredState } from '../types'
import { dateKey } from './dates'

const KEY = 'hudson-workout-state-v1'

export const defaultStoredState = (): StoredState => ({
  version: 1,
  startDate: dateKey(),
  progressByDate: {},
  completedDates: [],
  stars: 0,
  claimedRewardIds: [],
  voiceEnabled: true,
  totalFinishedWorkouts: 0,
})

export function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultStoredState()
    const p = JSON.parse(raw) as Partial<StoredState>
    if (p.version !== 1) return defaultStoredState()
    return {
      ...defaultStoredState(),
      ...p,
      startDate: p.startDate ?? dateKey(),
      progressByDate: p.progressByDate ?? {},
      completedDates: Array.isArray(p.completedDates) ? p.completedDates : [],
      claimedRewardIds: Array.isArray(p.claimedRewardIds) ? p.claimedRewardIds : [],
    }
  } catch {
    return defaultStoredState()
  }
}

export function saveStoredState(s: StoredState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore quota */
  }
}
