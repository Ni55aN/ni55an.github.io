import { $, $$, $for, Child, h } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'
import { Item } from './types'
import { SkillGroup } from '../../consts/skills'
import { map } from 'rxjs/operators'
// import { Progress } from './Progress'
import { getArrayChanges } from '../../utils/dynamic-array'
// import { pipe } from 'rxjs'

const skillsStacksStyles = css({
  $name: 'Stacks',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gridTemplateRows: '1fr',
  overflow: 'auto',
  flex: '1',
  '@media': {
    query: {
      maxWidth: '500px'
    },
    display: 'block'
  }
})

const scrollStyles = css({
  $name: 'Scroll',
  overflow: 'auto',
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
  fontSize: '1.2em',
  textAlign: 'center',
  overflowX: 'hidden',
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
      $for(skills, v => h('div', {
        style: v.value.pipe(map(value => {
          return `
            opacity: ${value / (1 - group.threshold) - group.threshold};
            order: ${Math.floor(-value * 100)};
            margin: 0.5em 1em;
            transformOrigin: 50% 50%;
          `
        }))
      }, v.name))
    )
  )
}
