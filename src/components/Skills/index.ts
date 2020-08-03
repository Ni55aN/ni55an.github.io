import { css, injectStyles } from 'easyhard-styles'
import { h, $ } from 'easyhard'
import { groups } from '../../consts/skills'
import { SkillsTiming, Item } from './timing'
import skills from '../../consts/skills'
import { Stacks, Stack } from './Stacks'

const styles = css({
  $name: 'Skills',
  height: '100%',
  display: 'grid',
  gridTemplateRows: '1fr auto'
})

export function Skills() {
  const list = $<Item[]>([])

  return h('div', {}, injectStyles(styles),
    Stacks(
      Stack(list, groups.languages),
      Stack(list, groups.techs),
      Stack(list, groups.devops),
      Stack(list, groups.tools)
    ),
    SkillsTiming(skills, { change(value) { list.next(value) } })
  )
}
