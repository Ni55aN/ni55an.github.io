import { h, Child } from 'easyhard'
import { injectStyles, css } from 'easyhard-styles'

const pageStyles = css({
  $name: 'Page',
  minHeight: '100vh',
  maxHeight: '100vh',
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto 1fr',
  gap: '0.5em',
  gridTemplateAreas: '"title head" "content content"',
  padding: '0.5em',
  boxSizing: 'border-box',
  overflow: 'hidden'
})


export function Page(...content: Child[]) {
  return h('div', {}, injectStyles(pageStyles), ...content)
}

const pageHeadStyles = css({
  gridArea: 'head'
})

export function PageHead(...content: Child[]) {
  return h('div', {}, injectStyles(pageHeadStyles), ...content)
}

const pageTitleStyles = css({
  $name: 'PageTitle',
  color: '#f9810c',
  fontSize: '64px',
  margin: '20px 0 0 40px',
  fontFamily: 'Amplify',
  display: 'block',
  lineHeight: '64px',
  fontStyle: 'normal',
  gridArea: 'title'
})

export function PageTitle(...content: Child[]) {
  return h('div', {}, injectStyles(pageTitleStyles), ...content)
}

const pageContentStyles = css({
  $name: 'PageContent',
  textAlign: 'center',
  gridArea: 'content',
  overflowX: 'hidden',
  overflowY: 'auto'
})

export function PageContent(...content: Child[]) {
  return h('div', {}, injectStyles(pageContentStyles), ...content)
}
