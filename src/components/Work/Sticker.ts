import { $, h, Child, $provide, $inject } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { LinkIcon } from '../shared/LinkIcon'

const INFO_BLOCK_WIDTH = 10

const styles = css({
  $name: 'Sticker',
  outline: 'none',
  display: 'inline-table',
  margin: '0 3vw',
  paddingBottom: '5px',
  position: 'relative',
  transition: '.8s',
  borderRadius: '100px',
  cursor: 'pointer'
})

const imgStyles = css({
  $name: 'StickerImage',
  height: '12em',
  borderRadius: '50%',
  transition: '.8s',
  verticalAlign: 'middle',
  opacity: '0.75'
})

function Info({ link, title, description, focused }: { link: string, title: string, description: string, focused: Observable<boolean> }) {
  const titleElement = h('a', { target: '_blank', href: link }, injectStyles({
      fontSize: '22px',
      display: 'inline-block'
    }), title, LinkIcon())

  return h('div', {}, injectStyles({
    display: 'inline-block',
    color: '#7a7a7a',
    transition: '.8s',
    textAlign: 'left',
    verticalAlign: 'middle',
    paddingLeft: '10px',
    overflow: 'hidden',
    opacity: focused.pipe(map(f => f ? '1' : '0')),
    width: focused.pipe(map(f => f ? `${INFO_BLOCK_WIDTH}em` : 0)),
  }),
    h('div', {}, injectStyles({
        width: '10em',
        transition: '.8s'
      }),
      titleElement,
      h('div', {}, injectStyles({
        whiteSpace: 'normal',
        fontSize: '15px',
        display: 'block'
      }), description)
    )
)
}

const context = {}
type ContextValue = {focused: (v: boolean) => void}

export function Sticker({ img, link, title, description }: { img: string, link: string, title: string, description: string }) {
  const focused = $(false)
  const parentFocused = $<ContextValue>({ focused() {}})

  return h('div', {
    tabIndex: 0,
    focus() { focused.next(true); parentFocused.value.focused(true) },
    blur() { focused.next(false); parentFocused.value.focused(false) }
  },
    injectStyles(styles),
    $inject<ContextValue>(context, parentFocused),
    h('img', { src: img }, injectStyles(imgStyles, { filter: focused.pipe(map(f => `grayscale(${f ? 0 : 100}%)`)) })),
    Info({ focused, link, title, description })
  )
  
}

export function Stickers(...children: Child[]) {
  const focused = $(false)
  const value = $({ focused(v: boolean) { focused.next(v) } })

  return h('div', {},
    injectStyles(css({
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: focused.pipe(map(f => f ? '0 0' : `0 ${INFO_BLOCK_WIDTH/2}em`)),
      transition: '.8s',
      webkitMaskImage: 'linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)'
    })),
    $provide<ContextValue>(context, value),
    ...children
  )
}
