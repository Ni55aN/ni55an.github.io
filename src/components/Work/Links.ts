import { h } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'
import { Link } from '../shared/Link'

const styles = css({
  marginTop: '4vh',
  fontSize: '14px',
  color: '#c5c5c5'
})

export function Links(links: { link: string; text: string }[]) {
  return h('p', {}, injectStyles(styles),
    'See also my ',
    links.map(({ link, text }) =>	[Link({ target: '_blank', href: link }, text), ', ']),
  )
}