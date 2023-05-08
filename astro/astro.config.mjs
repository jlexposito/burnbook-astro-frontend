import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import compress from "astro-compress";

import purgecss from "astro-purgecss";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://burnbook.zh0nb.com",
  integrations: [solidJs(), tailwind(), compress(), purgecss()],
  adapter: node({
    mode: "standalone"
  })
});