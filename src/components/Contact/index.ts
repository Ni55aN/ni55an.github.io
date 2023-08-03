import { h } from 'easyhard'
import { injectStyles } from 'easyhard-styles'
import { Social, SocialItem } from './Social'
import { Email } from './Email'

export function Contact() {
  return h('div', {},
    injectStyles({
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '1em'
    }),
    Social(
      SocialItem({ title: 'GitHub', icon: 'github', link: 'https://github.com/ni55an' }),
      SocialItem({ title: 'Twitter', icon: 'twitter', link: 'https://twitter.com/ni55an_dev' }),
      SocialItem({ title: 'LinkedIn', icon: 'linkedin', link: 'https://www.linkedin.com/in/ni55an' }),
      SocialItem({ title: 'Medium', icon: 'medium', link: 'https://medium.com/@ni55an' })
    ),
    Email()
  )
}
