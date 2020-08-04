import { $, Child, h } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'
import { Item } from './types'
import { SkillGroup } from '../../consts/skills'
import { throttleTime, map } from 'rxjs/operators'
import { Progress } from './Progress'

const skillsStacksStyles = css({
  $name: 'Stacks',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gridTemplateRows: '1fr',
  overflow: 'auto'
})

const scrollStyles = css({
  $name: 'Scroll',
  overflowY: 'auto',
  webkitMaskImage: 'linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)'
})

export function Stacks(...content: Child[]) {
  return h('div', {}, injectStyles(skillsStacksStyles), ...content)
}

const stackStyles = css({
  $name: 'Stack',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '100%',
  padding: '1em 0',
  boxSizing: 'border-box',
  minWidth: '22em'
})


export function Stack(list: $<Item[]>, group: SkillGroup) {
  const filtered = list.pipe(
    throttleTime(16, undefined, { trailing: true }),
    map(items => items.filter(item => item.value > group.threshold && group.names.includes(item.name)))
  )

  return h('div', {}, injectStyles(scrollStyles), filtered.pipe(map(items => {
    return h('div', {}, injectStyles(stackStyles), items.map(({ name, value }) => Progress({ name, value })))
  })))
}