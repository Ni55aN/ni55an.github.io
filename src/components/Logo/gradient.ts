import { h } from 'easyhard';
import { injectStyles } from 'easyhard-styles';

export function createOverlayGradient() {
  return h('div', {},
    injectStyles({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(-65deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
      zIndex: '10'
    })
  )
}
