import Compress from 'astro-compress'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import sitemap from '@astrojs/sitemap'
import solidJs from '@astrojs/solid-js'

export default defineConfig({
  site: 'https://burnbook.zh0nb.com',
  devToolbar: {
    enabled: false,
  },

  integrations: [
    icon(),
    solidJs(),
    Compress(),
    sitemap(),
  ],

  vite: {
    plugins: [
      tailwindcss({
        config: './tailwind.config.cjs',
      }),
    ],
    resolve: {
      alias: {
        '@styles': path.resolve('./src/styles'),
      },
    },
  },
})
