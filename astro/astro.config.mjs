import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import Compress from "astro-compress";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  integrations: [icon(), solidJs(), tailwind({
    config: {
      path: './tailwind.config.cjs',
      applyBaseStyles: false /** disables the built-in stylesheet */
    }
  }), Compress()]
});