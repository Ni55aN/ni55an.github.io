import { h } from 'easyhard'
import { injectStyles } from 'easyhard-styles'

const email = 'stoliarov.v.s@gmail.com'

export function Email() {
  return h('a', { href: `mailto:${email}` },
    injectStyles({
      textAlign: 'center',
      color: 'rgb(30, 30, 30)',
      transition: 'all 0.4s ease-out',
      transformOrigin: 'center top',
      textDecoration: 'solid',
      fontSize: '1.2em',
      ':hover': {
        color: 'orange',
        // transform: 'scale(1.1)'
      }
    }),
    email
  )
}

