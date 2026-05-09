/** Local calendar date YYYY-MM-DD */
export function dateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Monday-based week id: YYYY-MM-DD of Monday */
export function weekStartKey(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  return dateKey(x)
}

export function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function datesInWeek(mondayDate: Date): string[] {
  const keys: string[] = []
  for (let i = 0; i < 7; i++) {
    const x = new Date(mondayDate)
    x.setDate(mondayDate.getDate() + i)
    keys.push(dateKey(x))
  }
  return keys
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

export function countCompletedInWeek(completedDates: Set<string>, d = new Date()): number {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dayOfWeek = day.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(day)
  monday.setDate(day.getDate() + mondayOffset)
  let n = 0
  for (let i = 0; i < 7; i++) {
    const x = new Date(monday)
    x.setDate(monday.getDate() + i)
    if (completedDates.has(dateKey(x))) n++
  }
  return n
}

export function countCompletedInMonth(completedDates: Set<string>, d = new Date()): number {
  const y = d.getFullYear()
  const m = d.getMonth()
  const last = new Date(y, m + 1, 0).getDate()
  let n = 0
  for (let day = 1; day <= last; day++) {
    const key = dateKey(new Date(y, m, day))
    if (completedDates.has(key)) n++
  }
  return n
}

/** Current streak ending today or yesterday */
export function computeStreak(completedDates: Set<string>, today = dateKey()): number {
  let streak = 0
  let cursor = parseDateKey(today)
  const yesterday = new Date(cursor)
  yesterday.setDate(yesterday.getDate() - 1)
  const check = completedDates.has(today)
    ? today
    : completedDates.has(dateKey(yesterday))
      ? dateKey(yesterday)
      : null
  if (!check) return 0

  cursor = parseDateKey(check)
  while (completedDates.has(dateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
