import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [solidJs(), tailwind(), compress()],
  adapter: node({
    mode: "standalone"
  })
});