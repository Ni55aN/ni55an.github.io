import { css, injectStyles } from 'easyhard-styles'
import { h, Child } from 'easyhard'
import { Icon, IconName } from '../Icon'

export function Social(...children: Child[]) {
  return h('div', {},
    injectStyles({
      display: 'flex',
      width: '100%',
      boxSizing: 'border-box',
      gap: '2em',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '@media': {
        query: {
          maxWidth: '500px'
        },
        gap: '1em',
      }
    }),
    ...children)
}

const linkStyles = css({
  color: 'rgb(30, 30, 30)',
  transition: 'all 0.4s ease-out',
  transformOrigin: 'center bottom',
  padding: '1em',
  ':hover': {
    color: 'orange',
    // transform: 'scale(1.2)'
  }
})

export function SocialItem({ title, link, icon }: { title: string, link: string, icon: IconName }) {
  return h('a', { href: link, target: '_blank', title: title },
    injectStyles(linkStyles),
    Icon({ name: icon, prefix: 'fab', size: 40 })
  )
}
