import { MonotonicCubicSpline } from './spline';
import { TimingRange } from '../shared/TimingRange';

export type Item = { name: string; value: number }

function extractSpline(skillName: Item['name'], values: {[key: string]: any}) {
  const pointsX = [];
  const pointsY = [];

  for (let time in values)
    for (let name in values[time]) {
      if (skillName == name) {
        pointsX.push(Date.parse(time));
        pointsY.push(values[time][name]);
      }
    }

  if (pointsX.length > 0) {
    pointsX.push(Date.now());
    pointsY.push(pointsY[pointsY.length - 1]);

    return new MonotonicCubicSpline(pointsX, pointsY);
  }
  return null
}

export function SkillsTiming(skills: {[key: string]: {[name: string]: number}}, props: { change?: (items: Item[]) => void } = {}) {
  const skillNames = Object.keys(Object.entries(skills).reduce((acc, [time, skills]) => ({ ...acc, ...skills }), {}))
  const splines = skillNames.map(name => ({ name, spline: extractSpline(name, skills) }))

  function update(time: string | number) {
    const skillValues = skillNames.map(name => {
      const spline = splines.find(item => item.name === name)?.spline;

      return {
        name,
        value: spline ? spline.interpolate(time) : 0
      }
    })
    props.change && props.change(skillValues)
  }

  const currentYear = new Date().getFullYear();
  const labels = new Array(currentYear - 2011 + 1).fill(0).map((_, i) => String(2011 + i))
  const currentDate = new Date().getTime()

  update(currentDate)

  return TimingRange({
    from: Date.parse("1 Jan 2011"),
    until: Date.parse("31 Dec " + currentYear),
    value: currentDate,
    labels,
    change: update
  })
}
