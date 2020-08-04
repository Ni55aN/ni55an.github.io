import { MonotonicCubicSpline } from './spline';
import { Item } from '../types';

const cache = new Map<string, any>()

export function clearCache() {
  return cache.clear()
}

export function extractSpline(skillName: Item['name'], values: { [key: string]: any }) {
  const pointsX = []
  const pointsY = []

  for (let time in values)
    for (let name in values[time]) {
      if (skillName == name) {
        pointsX.push(Date.parse(time))
        pointsY.push(values[time][name])
      }
    }

  if (pointsX.length > 0) {
    pointsX.push(Date.now())
    pointsY.push(pointsY[pointsY.length - 1])

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