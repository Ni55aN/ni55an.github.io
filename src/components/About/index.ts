import { h } from 'easyhard';
import { injectStyles } from 'easyhard-styles';

export function About() {
  const framePadding = { vertical: '15em', horizontal: '7em' }

  return h('div', {},
    injectStyles({
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: 'auto',
      height: '100%',
      fontSize: '1.2em',
      lineHeight: '1.7em',
      textAlign: 'justify',
      gap: '0.5em',
      padding: `0px calc(min(40vw - ${framePadding.horizontal}, 100vh - ${framePadding.vertical}) / 2)`,
      '@media': {
        query: {
          maxWidth: '500px',
        },
        fontSize: '1.1em',
      }
    }),
    h('div', {}, injectStyles({ color: 'rgb(90, 90, 90)' }), 'Hello there!'),
    h('div', {}, injectStyles({ fontSize: '1.2em' }), `I'm `, h('span', {}, injectStyles({ color: 'orange' }), 'Vitaliy Stoliarov'), `, a software engineer from Ukraine.`),
    h('div', {}, injectStyles({
      color: 'rgb(90, 90, 90)'
    }),
      `My journey into the world of programming began back in 2011. Since then, I've delved into various technologies, exploring their possibilities and honing my skills.`,
    ),
    h('div', {}, injectStyles({ color: 'rgb(90, 90, 90)' }),
      `Among my accomplishments, I'm the creator of `,
      h('a', { href: 'https://retejs.org', target: '_blank' }, injectStyles({ color: 'orange' }), `Rete.js`),
      ` – a TypeScript-first framework for creating visual programming interfaces.`
    )
  )
}
