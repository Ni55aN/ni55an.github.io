import { h, Attrs, Child } from 'easyhard'
import {  css, injectStyles } from 'easyhard-styles'

const linkStyles = css({
  $name: 'Link',
  color: '#888',
  textDecoration: 'blink',
  ':hover': {
    textDecoration: 'underline'
  }
})

export function Link(attrs: Attrs<'a'>, ...content: Child[]) {
  return h('a', attrs, injectStyles(linkStyles), ...content)
}
