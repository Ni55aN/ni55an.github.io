import { css, injectStyles } from 'easyhard-styles'
import { h, Child } from 'easyhard'

export function Social(...children: Child[]) {
  return h('div', {}, injectStyles({
    display: 'inline-block'
  }), ...children)
}

const socialImgStyles = css({
  height: '48px',
  filter: 'grayscale(100%)',
  opacity: '0.7',
  transition: '.8s',
  margin: '1em 0.5em',
  ':hover': {
    filter: 'grayscale(0%)',
    opacity: '1'
  }
})

export function SocialItem({ link, img }: { link: string, img: string }) {
  return h('a', { target: '_blank', href: link },
    h('img', { src: img }, injectStyles(socialImgStyles))
  )
}