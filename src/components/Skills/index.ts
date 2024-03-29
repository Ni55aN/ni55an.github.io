import { css, injectStyles } from 'easyhard-styles'
import { h, $ } from 'easyhard'
import { groups } from '../../consts/skills'
import { SkillsTiming } from './timing'
import skills from '../../consts/skills'
import { Stacks, Stack } from './Stacks'
import { Item } from './types'

const styles = css({
  $name: 'Skills',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

export function Skills() {
  const list = $<Item[]>([])

  return h('div', {}, injectStyles(styles),
    Stacks(
      Stack(list, groups.languages),
      Stack(list, groups.techs),
      Stack(list, groups.tools)
    ),
    SkillsTiming(skills, { change(value) { list.next(value) } })
  )
}
