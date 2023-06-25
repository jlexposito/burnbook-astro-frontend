import type { AstroGlobal } from "astro";

export const setCache = {
  custom: (Astro: AstroGlobal, max_age: Number, stale: Number) => {
    if (import.meta.env.DEV) {
      return
    }
    let maximum_age = max_age || 3600;
    let stale_revalidate = stale || 600; 
    Astro.response.headers.set(
      "Cache-Control",
      `public, max-age=${maximum_age}, stale-while-revalidate=${stale_revalidate}`
    );
  },
  long: (Astro: AstroGlobal) => {
    if (import.meta.env.DEV) {
      return
    }
    Astro.response.headers.set(
      "Cache-Control",
      "public, max-age=480, stale-while-revalidate=120"
    );
  },

  short: (Astro: AstroGlobal) => {
    if (import.meta.env.DEV) {
      return
    }
    Astro.response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=3"
    );
  },
};