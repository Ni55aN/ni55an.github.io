import { h } from 'easyhard';
import { css, injectStyles } from 'easyhard-styles';

const arrowStyles = css({
  position: 'absolute',
  top: '10%',
  right: '20%',
  height: 'calc(50vh - 3em)',
  maxHeight: 'calc((25vh + 25vw) / 2)',
  '@media': {
    query: {
      maxWidth: '700px'
    },
    right: '5%',
    transform: ' rotate(345deg)'
  }
})


export function Resume() {
  return h('div', {},
    injectStyles({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      fontSize: '1.2em',
      textAlign: 'center',
    }),
    h('img', { src: './arrow.svg' }, injectStyles(arrowStyles)),
    h('div', {},
      'Please contact me to receive my resume'
    )
  )
}
