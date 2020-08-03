import { MonotonicCubicSpline } from './spline';
import { h, $ } from 'easyhard';
import { Range } from '../shared/Range'
import { css, injectStyles } from 'easyhard-styles';
import { map } from 'rxjs/operators';

export type Item = { name: string; value: number }

const styles = css({
  margin: '1em 0'
})

const labelsStyles = css({
  $name: 'TimingLabels',
  display: 'flex',
  justifyContent: 'space-around',
  color: 'grey',
  fontSize: '0.8em',
  transition: '.8s'
})



function extractSplines(list: Item[], values: {[key: string]: any}) {
  const splines: {[key: string]: any} = {}

  for (let i = 0; i < list.length; i++) {
    const points_x = [];
    const points_y = [];

    const skillName = list[i].name

    for (let time in values)
      for (let name in values[time]) {
        if (skillName == name) {
          points_x.push(Date.parse(time));
          points_y.push(values[time][name]);
        }
      }

    if (points_x.length > 0) {
      points_x.push(points_x[points_x.length - 1] + 60 * 60 * 24 * 1000);
      points_y.push(points_y[points_y.length - 1]);

      splines[skillName] = new MonotonicCubicSpline(points_x, points_y);
    }
  }
  return splines
}

export function SkillsTiming(skills: {[key: string]: {[name: string]: number}}, props: { change?: (items: Item[]) => void } = {}) {
  const list = Object.keys(Object.entries(skills).reduce((acc, [time, skills]) => ({ ...acc, ...skills }), {})).map(name => ({ name, value: 0 }))
  const splines = extractSplines(list, skills)

  function update(time: string | number) {
    for (let i = 0; i < list.length; i++) {
      const skillName = list[i].name
      const spline = splines[skillName];
      let val = null;

      if (spline && (val = spline.interpolate(time)))
        list[i].value = val;
      else
        list[i].value = 0;
    }
    props.change && props.change(list)
  }

  // function highlight(match_array) {

  //   var list = list;

  //   if (match_array)
  //     for (var i = 0; i < list.length; i++) {

  //       var match = false;

  //       for (var j = 0; j < match_array.length; j++) {

  //         if (list[i].getAttribute('name') == match_array[j]) match = true;
  //       }

  //       if (!match)
  //         list[i].style.opacity = 0.5;
  //     }
  //   else
  //     for (var i = 0; i < list.length; i++)
  //       list[i].style.opacity = 1;
  // }

  const current_year = new Date().getFullYear();
  const labels = new Array(current_year - 2011 + 1).fill(0).map((_, i) => 2011 + i)
  const value = new Date().getTime()
  const active = $(false)

  update(value)

  return h('div', { mouseenter() { active.next(true) }, mouseleave() { active.next(false) }}, injectStyles(styles),
    Range({
      min: Date.parse("1 Jan 2011"),
      max: Date.parse("31 Dec " + current_year),
      value,
      change(e){ update((e.target as HTMLInputElement).value); },
      mousemove(e) { if ((e as MouseEvent).buttons > 0) update((e.target as HTMLInputElement).value); }
    }),
    h('div', { style: active.pipe(map(act => `opacity: ${act ? '100' : '0' }`)) }, injectStyles(labelsStyles), labels.map(label => h('div', {}, label)))
  )
}
