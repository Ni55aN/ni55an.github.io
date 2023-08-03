import { h } from 'easyhard'
import { css, injectStyles } from 'easyhard-styles'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

const gradient = 'radial-gradient(at 50% 0%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 70%)'

const menuItemStyles = css({
  width: '6em',
  padding: '0.1em 0.2em 0.6em',
  fontSize: '2.2em',
  background: new Array(4).fill(gradient).join(', '),
  animation: 'fadeIn 3s ease-in-out',
  animationIterationCount: '1',
  textAlign: 'center',
  '@media': {
    query: {
      maxWidth: '500px'
    },
    fontSize: '1.9em'
  }
})
const menuLinkStyles = css({
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'Amplify',
  fontStyle: 'normal',
  width: '100%',
  color: 'rgb(90, 90, 90)',
  transition: 'transform  0.4s ease-in-out, color 0.4s ease-in-out',
  transformOrigin: 'center top',
  display: 'inline-block',
  pointerEvents: 'all',
  ':hover': {
    color: 'orange',
    transform: 'scale(1.2)'
  }
})


const Item = (text: string, active: Observable<boolean>, select: () => void) => h('div', {}, injectStyles(menuItemStyles),
  h('a', { click: tap(select), style: active.pipe(map(act => act ? 'color: orange;' : '')) }, injectStyles(menuLinkStyles), text)
)

export function Menu(props: { active: Observable<string | null>, select: (id: string) => void }) {

  return h('div', {},
    injectStyles({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '15',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '0 10vw',
      boxSizing: 'border-box',
      pointerEvents: 'none',
      '@media': {
        query: {
          maxWidth: '500px'
        },
        padding: '0 5vw'
      }
    }),
    Item('About', props.active.pipe(map(id => id === 'about')), () => props.select('about')),
    Item('Skills', props.active.pipe(map(id => id === 'skills')), () => props.select('skills')),
    Item('Resume', props.active.pipe(map(id => id === 'resume')), () => props.select('resume')),
    Item('Contact', props.active.pipe(map(id => id === 'contact')), () => props.select('contact'))
  )
}
