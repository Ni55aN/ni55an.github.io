import { h, Child, onMount, onDestroy } from 'easyhard'
import { Page, PageTitle, PageContent, PageHead } from './components/shared/Page'
import { injectStyles, css } from 'easyhard-styles'
import { Logo } from './components/Logo'
import { Skills } from './components/Skills'
import 'normalize.css'
import { Work } from './components/Work'
import { Contact } from './components/Contact'
import './analytics'
import { usePageScroll } from './utils/scroll'
import { Background } from './components/Background'
import bgImg from './assets/img/bg.jpg'
import './assets/fonts/amplify.css'

const bodyStyles = css({
  position: 'relative',
  margin: '0 auto',
  // overflowX: 'hidden',
  height: '100%',
  width: '100%',
  backgroundImage: `url('${bgImg}')`,
  backgroundSize: '100%',
  backgroundAttachment: 'fixed',
  fontStyle: 'italic',
  fontFamily: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif'
})

document.body.classList.add(bodyStyles.className)

const bioStyles = css({
  textAlign: 'justify',
  display: 'block',
  color: '#888',
  padding: '5%',
  maxWidth: '380px',
  width: '40%',
  margin: 'auto'
})

function Bio() {
  return h('div', {}, injectStyles(bioStyles),
    'Hello, my name is Vitaliy Stoliarov. I\'m a Full Stack developer from Ukraine, intrested in programming, design and technology. I like cars, music, films and videogames.'
  )
}

function PageWithLogo(...content: Child[]) {
  return Page(
    injectStyles({ padding: 0 }),
    ...content
  )
}

function App() {
  const pages = [
    PageWithLogo(
      Logo({ text: 'Vitaliy Stolyarov', duration: 3000, ondone() {
        // setTimeout(() => scroll.top === 0 && scroll.down(), 1000) // TODO
      }})
    ),
    Page(
      PageTitle('About'),
      PageHead(Bio()),
      PageContent(
        Skills()
      )
    ),
    Page(
      PageTitle('Work'),
      PageContent(
        Work()
      )
    ),
    Page(
      PageTitle('Contact'),
      PageContent(
        Contact()
      )
    )
  ]

  const scroll = usePageScroll(pages, 1 / 10)
  const background = new Background()

  return h('div', {},
    onMount(() => {
      background.init()
      scroll.mount()
    }),
    onDestroy(() => {
      scroll.destroy()
    }),
    pages
  )
}

document.body.appendChild(App())