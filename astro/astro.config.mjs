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
    sitemap({
      filter: (page) => {
        // Normalize the page URL to a pathname
        const pathname = new URL(page, 'https://burnbook.zh0nb.com').pathname

        // Exclude login page(s)
        if (pathname === '/login' || pathname === '/login/') return false

        // Exclude all /recipes/*/edit pages
        if (pathname.startsWith('/recipes/') && pathname.includes('/edit')) return false

        // Include everything else
        return true
      },
    }),
  ],

  vite: {
    plugins: [
      tailwindcss({
        config: './tailwind.config.cjs',
      }),
    ],
    resolve: {
      alias: {
        '@styles': path.resolve('./src/styles'), // adjust path to your styles folder
      },
    },
  },
})
