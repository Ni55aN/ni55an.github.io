import { h } from 'easyhard'
import { Terminal } from './Terminal'
import { Social, SocialItem } from './Social'

export function Contact() {
  return h('div', {},
    Terminal({ name: "Ni55aN@github", path: '~' }),
    Social(
      SocialItem({ link: 'http://vk.com/ni55an', img: 'img/social/vk.png' }),
      SocialItem({ link: 'https://telegram.me/Ni55aN', img: 'img/social/telegram.png' }),
      SocialItem({ link: 'http://ask.fm/Ni55aN', img: 'img/social/askfm.png' }),
      SocialItem({ link: 'https://wiselike.com/vitalij-stolyarov', img: 'img/social/wiselike.png' }),
      SocialItem({ link: 'https://www.linkedin.com/in/ni55an', img: 'img/social/in.png' }),
    )
  )
}
