import { h } from 'easyhard'
import { Links } from './Links'
import { injectStyles } from 'easyhard-styles'
import { Sticker, Stickers } from './Sticker'
import plantagoImg from '../../assets/img/work/plantago.png'
import myearthImg from '../../assets/img/work/myearth.png'
import goodviewImg from '../../assets/img/work/goodview.png'
import gamerImg from '../../assets/img/work/gamer.png'
import vkmusicImg from '../../assets/img/work/vkmusic.png'
import cleverTrelloImg from '../../assets/img/work/clever-trello.png'

export function Work() {
  return h('div', {}, injectStyles({
      maxHeight: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }),
    Stickers(
      Sticker({
        img: plantagoImg,
        link: 'http://github.com/ni55an/plantago',
        title: 'Plantago',
        description: 'Powerful 3D plants generator'
      }),
      Sticker({
        img: myearthImg,
        link: '',
        title: 'myEarth',
        description: 'Cross-platform application for viewing the Earth 3D'
      }),
      Sticker({
        img: goodviewImg,
        link: 'http://github.com/ni55an/goodview',
        title: 'Goodview',
        description: 'Library for viewing photos and panoramas with effects of depth and stereo<'
      }),
      Sticker({
        img: gamerImg,
        link: '',
        title: 'G AM ER',
        description: 'Telegram Bot that helps you with computer games'
      }),
      Sticker({
        img: vkmusicImg,
        link: 'http://vkmusic.ml',
        title: 'VK Music',
        description: 'Desktop music player from the social network VK'
      }),
      Sticker({
        img: cleverTrelloImg,
        link: 'https://github.com/Ni55aN/Clever-Trello',
        title: 'Clever Trello',
        description: 'Browser extension that improves functionality of the Trello for project management'
      })
    ),
    Links([
      { link: 'https://github.com/Ni55aN', text: 'github' },
      { link: 'https://gitlab.com/u/Ni55aN', text: 'gitlab' },
      { link: 'http://codepen.io/Ni55aN', text: 'codepen' },
      { link: 'https://behance.net/Ni55aN', text: 'behance' }
    ])
  )
}