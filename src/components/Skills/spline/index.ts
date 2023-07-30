/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { MonotonicCubicSpline } from './spline';
import { Item } from '../types';
import { computeSkillDegradation } from './degradation';

const cache = new Map<string, any>()

export function clearCache() {
  return cache.clear()
}

export function extractSpline(skillName: Item['name'], values: { [key: string]: any }) {
  const pointsX = []
  const pointsY = []

  for (const time in values)
    for (const name in values[time]) {
      if (skillName == name) {
        pointsX.push(Date.parse(time))
        pointsY.push(values[time][name])
      }
    }

  if (pointsX.length > 0) {
    const prevValue = pointsY[pointsY.length - 1]
    const prevDate = pointsX[pointsX.length - 1]
    const currentDate = Date.now()

    pointsX.push(currentDate)
    pointsY.push(computeSkillDegradation(prevValue, prevDate, currentDate))

    return new MonotonicCubicSpline(pointsX, pointsY)
  }
  return null
}


export function extractCachedSpline(skillName: Item['name'], values: { [key: string]: any }) {
  if (cache.has(skillName)) return cache.get(skillName)
  const spline = extractSpline(skillName, values)

  cache.set(skillName, spline)
  return spline
}
