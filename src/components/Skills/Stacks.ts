import { $, $$, $for, Child, h } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'
import { Item } from './types'
import { SkillGroup } from '../../consts/skills'
import { map } from 'rxjs/operators'
import { Progress } from './Progress'
import { getArrayChanges, delayRemove } from '../../utils/dynamic-array'
import { pipe } from 'rxjs'

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

function getSkillsForGroup(group: SkillGroup) {
  return function (items: Item[]) {
    return items.filter(item => item.value > group.threshold && group.names.includes(item.name))
  }
}

export function Stack(list: $<Item[]>, group: SkillGroup) {
  const skills = $$<{ name: string; value: $<number> }>([])

  return h('div', {}, injectStyles(scrollStyles),
    list.pipe(
      map(getSkillsForGroup(group)),
      map(updatedSkills => {
        const { added, removed, former } = getArrayChanges(updatedSkills, skills.value)

        added.forEach(skill => skills.insert({ name: skill.name, value: $(skill.value) }))
        removed.forEach(skill => skills.remove(skill))
        former.forEach(skill => skill.value.next(updatedSkills.find(item => item.name === skill.name)?.value || 0))
    
        return null
      })
    ),
    h('div', {}, injectStyles(stackStyles),
      $for(skills, pipe(delayRemove(3000), map(([props, removed]) => Progress({ ...props, removed }))), { detached: true })
    )
  )
}