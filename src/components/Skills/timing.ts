
import { TimingRange } from '../shared/TimingRange';
import { Item } from './types';
import { extractCachedSpline } from './spline/index';

const FROM_YEAR = 2011
const UNTIL_YEAR = new Date().getFullYear()

export function SkillsTiming(skills: {[key: string]: {[name: string]: number}}, props: { change?: (items: Item[]) => void } = {}) {
  const skillNames = Object.keys(Object.entries(skills).reduce((acc, [time, skills]) => ({ ...acc, ...skills }), {}))

  function update(time: string | number) {
    const skillValues = skillNames.map(name => {
      const spline = extractCachedSpline(name, skills)

      return {
        name,
        value: spline ? spline.interpolate(time) : 0
      }
    })
    props.change && props.change(skillValues)
  }

  const currentYear = new Date().getFullYear();
  const labels = new Array(currentYear - FROM_YEAR + 1).fill(0).map((_, i) => String(FROM_YEAR + i))
  const currentDate = new Date().getTime()

  update(currentDate)

  return TimingRange({
    from: Date.parse(`1 Jan ${FROM_YEAR}`),
    until: Date.parse(`31 Dec ${UNTIL_YEAR}`),
    value: currentDate,
    labels,
    change: update
  })
}
