import { h, Child, Attrs } from 'easyhard'
import { injectStyles, css } from 'easyhard-styles'

const pageStyles = css({
  $name: 'Page',
  minHeight: '100%',
  maxHeight: '100%',
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto 1fr',
  gap: '0.5em',
  gridTemplateAreas: '"title head" "content content"',
  boxSizing: 'border-box',
  overflow: 'hidden',
  zIndex: '1'
})


export function Page(attrs: Attrs<'div'>, ...content: Child[]) {
  return h('div', attrs, injectStyles(pageStyles), ...content)
}
