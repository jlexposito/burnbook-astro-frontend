import { defineConfig } from 'astro/config'
import Compress from 'astro-compress'
import icon from 'astro-icon'
import solidJs from '@astrojs/solid-js'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  devToolbar: {
    enabled: false,
  },

  integrations: [
    icon(),
    solidJs(),
    Compress(),
  ],

  vite: {
    plugins: [
      tailwindcss({
        config: './tailwind.config.cjs',
      }),
    ],
  },
})
