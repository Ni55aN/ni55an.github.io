import { h, $ } from 'easyhard';
import { Range } from '../Range'
import { css, injectStyles } from 'easyhard-styles';
import { map, tap } from 'rxjs/operators';

const styles = css({
  marginTop: '1em'
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
  const evenLabel = css({
    '@media': {
      query: {
        maxWidth: '500px'
      },
      display: 'none'
    }
  })

  return h('div', { pointerenter: tap(() => { active.next(true) }), pointerleave: tap(() => { active.next(false) }) }, injectStyles(styles),
    Range({
      min: from,
      max: until,
      value,
      change: tap((e) => { change((e.target as HTMLInputElement).value); }),
      mousemove: tap((e) => { if ((e as MouseEvent).buttons > 0) change((e.target as HTMLInputElement).value); })
    }),
    h('div', { style: active.pipe(map(act => `opacity: ${act ? '1' : '0.5'}`)) },
      injectStyles(labelsStyles),
      labels.map((label, i) => h('div', {}, i % 2 !== 0 ? injectStyles(evenLabel) : null, label))
    )
  )
}
