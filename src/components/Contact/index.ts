import { h } from 'easyhard'
import { Terminal } from './Terminal'
import { Social, SocialItem } from './Social'
import vkImg from '../../assets/img/social/vk.png'
import telegramImg from '../../assets/img/social/telegram.png'
import askfmImg from '../../assets/img/social/askfm.png'
import wiselikeImg from '../../assets/img/social/wiselike.png'
import inImg from '../../assets/img/social/in.png'

export function Contact() {
  return h('div', {},
    Terminal({ name: "Ni55aN@github", path: '~' }),
    Social(
      SocialItem({ link: 'http://vk.com/ni55an', img: vkImg }),
      SocialItem({ link: 'https://telegram.me/Ni55aN', img: telegramImg }),
      SocialItem({ link: 'http://ask.fm/Ni55aN', img: askfmImg }),
      SocialItem({ link: 'https://wiselike.com/vitalij-stolyarov', img: wiselikeImg }),
      SocialItem({ link: 'https://www.linkedin.com/in/ni55an', img: inImg }),
    )
  )
}
