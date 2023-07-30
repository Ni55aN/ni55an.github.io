import { h, $, onMount } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'
import { map } from 'rxjs/operators'
import { Observable, combineLatest } from 'rxjs'

const progressStyles = css({
  $name: 'Progress',
  display: 'flex',
  alignItems: 'center',
  transition: '.8s'
})

const progressLabelStyles = css({
  textAlign: 'right',
  flex: '1',
  marginRight: '1.5em',
  color: '#545454'
})

const progressIndicator = css({
  flex: '2',
  fontSize: '16px',
  background: '#888',
  color: '#545454',
  margin: '6px',
  position: 'relative',
  height: '14px',
  transition: '.8s'
})

export function Progress({ name, value, removed }: { name: string, value: $<number>, removed: Observable<boolean> }) {
  const mounted = $(false)
  const collapsed = combineLatest(removed, mounted).pipe(map(([a, b]) => a === b))

  const el = h('div', {},
    injectStyles(progressStyles, css({ height: collapsed.pipe(map(c => c ? '0' : '1.8em')), opacity: collapsed.pipe(map(c => c ? '0' : '1')) })),
    h('div', {}, injectStyles(progressLabelStyles), name),
    h('div', {}, injectStyles(progressIndicator),
      h('div', { style: value.pipe(map(v => `background-color: #f9950c; height: 100%; width: ${v * 100}%`)) },)
    )
  )
  onMount(el, () => setTimeout(() => { mounted.next(true) }))

  return el
}
