import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import Compress from "astro-compress";
import icon from "astro-icon";

import playformInline from "@playform/inline";

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), solidJs(), tailwind({
    config: {
      path: './tailwind.config.cjs',
      applyBaseStyles: false /** disables the built-in stylesheet */
    }
  }), Compress(), playformInline()]
});