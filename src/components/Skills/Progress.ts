import { h } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'

const progressStyles = css({
  $name: 'Progress',
  display: 'flex',
  alignItems: 'center'
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


export function Progress({ name, value }: { name: string, value: number }) {
  return h('div', {}, injectStyles(progressStyles),
    h('div', {}, injectStyles(progressLabelStyles), name),
    h('div', {}, injectStyles(progressIndicator),
      h('div', { style: `background-color: #f9950c; height: 100%; width: ${value*100}%` },)
    )
  )
}
