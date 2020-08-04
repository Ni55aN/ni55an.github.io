import { h, $ } from 'easyhard';
import { Range } from '../Range'
import { css, injectStyles } from 'easyhard-styles';
import { map } from 'rxjs/operators';

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

export function TimingRange({ from, until, value, labels, change }: { from: number; until: number; value: number; labels: string[]; change: (value: string) => void }) {
  const active = $(false)

  return h('div', { mouseenter() { active.next(true) }, mouseleave() { active.next(false) }}, injectStyles(styles),
    Range({
      min: from,
      max: until,
      value,
      change(e){ change((e.target as HTMLInputElement).value); },
      mousemove(e) { if ((e as MouseEvent).buttons > 0) change((e.target as HTMLInputElement).value); }
    }),
    h('div', { style: active.pipe(map(act => `opacity: ${act ? '100' : '0' }`)) }, injectStyles(labelsStyles), labels.map(label => h('div', {}, label)))
  )
}
