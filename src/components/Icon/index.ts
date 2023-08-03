import { h } from 'easyhard'
import { IconName, IconPrefix, icon, library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faTwitter, faLinkedin, faMedium } from '@fortawesome/free-brands-svg-icons'

export type { IconName }

library.add(faGithub, faTwitter, faLinkedin, faMedium)

export function Icon({ name, prefix, size }: { prefix: IconPrefix, name: IconName, size: number }) {
  const svg = icon({ prefix, iconName: name }).node[0] as HTMLElement

  svg.style.width = '100%'
  svg.style.height = '100%'
  return h('span', {
    style: `
      display: inline-block;
      height: ${size}px;
      width: ${size}px;
    `
  }, svg)
}
