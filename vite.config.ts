import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker'
import { VitePluginRadar } from 'vite-plugin-radar'
import { default as htmlPlugin, Options } from 'vite-plugin-html-config'

const title = 'Vitaliy Stoliarov | Software Engineer, creator of Rete.js'
const description = `\
I'm Vitaliy Stoliarov, a software engineer from Ukraine with a programming journey since 2011. \
Creator of Rete.js, a TypeScript-first framework for visual programming.\
`
const image = 'https://ni55an.dev/preview.png'
const author = 'ni55an_dev'

const htmlOptions: Options = {
  metas: [
    {
      name: 'description',
      content: description
    },
    {
      name: 'keywords',
      content: 'Vitaliy Stoliarov, software engineer, Ukraine, programming, Rete.js, visual programming interfaces'
    },
    {
      property: 'og:title',
      content: title
    },
    {
      property: 'og:description',
      content: description
    },
    {
      property: 'og:image',
      content: image
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://ni55an.dev'
    },
    {
      property: 'og:site_name',
      content: 'Ni55aN'
    },
    {
      property: 'og:locale',
      content: 'en_US'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:site',
      content: author
    },
    {
      name: 'twitter:creator',
      content: author
    },
    {
      name: 'twitter:title',
      content: title
    },
    {
      name: 'twitter:description',
      content: description
    },
    {
      name: 'twitter:image',
      content: image
    }
  ],
  links: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/logo.png'
    },
    {
      rel: 'preload',
      href: '/fonts/berlin.ttf',
      as: 'font',
      type: 'font/woff2',
      crossorigin: true
    },
    {
      rel: 'preload',
      href: '/mask.svg',
      as: 'image',
      type: 'image/svg+xml',
      crossorigin: true
    }
  ]
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint(),
    checker({
      typescript: true,
      overlay: false
    }),
    VitePluginRadar({
      analytics: {
        id: 'G-9Q2N23SRQJ',
      },
    }),
    htmlPlugin(htmlOptions)
  ],
});
