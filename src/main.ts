import { $, h } from 'easyhard'
import { Page } from './components/shared/Page'
import { css } from 'easyhard-styles'
import 'normalize.css'
import './assets/fonts/index.css'
import './assets/styles.css'
import { Logo } from './components/Logo'
import { Menu } from './components/Menu'
import { Skills } from './components/Skills'
import { map, tap } from 'rxjs/operators'
import { Frame } from './components/Frame'
import { Resume } from './components/Resume'
import { Contact } from './components/Contact'
import { About } from './components/About'

const bodyStyles = css({
  position: 'relative',
  margin: '0 auto',
  height: '100%',
  width: '100%',
  backgroundSize: '100%',
  backgroundAttachment: 'fixed',
  fontStyle: 'italic',
  fontFamily: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif'
})

document.body.classList.add(bodyStyles.className)


function App() {
  const active = $<string | null>(null)

  return h('div', { style: 'height: 100%' },
    Menu({
      active,
      select(id) {
        active.next(active.value === id ? null : id)
      },
    }),
    Page(
      { click: tap(() => active.next(null)) },
      Logo({
        opacity: active.pipe(map(active => active ? 0 : 1)),
        text: 'Vitaliy Stoliarov',
        duration: 3000
      })
    ),
    Frame({ open: active.pipe(map(id => id === 'about')) }, About()),
    Frame({ open: active.pipe(map(id => id === 'skills')) }, Skills()),
    Frame({ open: active.pipe(map(id => id === 'resume')) }, Resume()),
    Frame({ open: active.pipe(map(id => id === 'contact')) }, Contact())
  )
}

document.body.appendChild(App())
