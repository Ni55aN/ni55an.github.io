// TODO https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/19730001425.pdf

export function computeSkillDegradation(level: number, prevDate: number, currentDate: number, ) {
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365
  const duration = Math.abs(prevDate - currentDate)
  const k = 1 / (duration / millisecondsInYear)

  return level * Math.min(1, k)
}