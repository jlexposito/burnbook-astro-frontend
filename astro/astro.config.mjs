import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import Compress from "astro-compress";
import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [icon(), solidJs(), tailwind({
    config: {
      path: './tailwind.config.cjs',
      applyBaseStyles: false /** disables the built-in stylesheet */
    }
  }), Compress()],
  adapter: cloudflare({
    imageService: "compile",
    runtime: {
      mode: "local",
      type: "pages",
    },
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml'
    },
    experimental: {
      manualChunks: ["sharp"]
    }
  })
});