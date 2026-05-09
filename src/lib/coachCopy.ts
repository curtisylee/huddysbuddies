/** Fun, age-appropriate lines for ~10yo — tweak anytime */
export function coachLine(ctx: {
  childName: string
  fraction: number
  todayComplete: boolean
  exerciseName?: string
}): string {
  const { childName, fraction, todayComplete, exerciseName } = ctx
  if (todayComplete) {
    return `${childName}, you finished the whole workout. That takes grit — I'm proud of you.`
  }
  if (exerciseName && fraction > 0) {
    const mid = [
      `Smooth moves on ${exerciseName}. Control beats speed.`,
      `Great focus. Breathe steady — you've got this, ${childName}.`,
      `That's the kind of effort that builds superpowers.`,
    ]
    return mid[Math.floor(Math.random() * mid.length)]!
  }
  if (fraction <= 0) {
    return `Hey ${childName}! Ten minutes today is enough to get stronger — tap an exercise when you're ready.`
  }
  if (fraction < 0.5) {
    return `Nice start! One rep at a time is how champions train.`
  }
  if (fraction < 1) {
    return `Past halfway — finish strong and you'll unlock today's stars.`
  }
  return `Last stretch — let's close it out clean.`
}

export function cheerForRep(rep: number, target: number, name: string): string {
  if (rep >= target) return `${target}! Set complete — quick rest if you need it.`
  if (rep % 4 === 0 && rep > 0) return `${rep} — staying strong on ${name}.`
  return String(rep)
}
