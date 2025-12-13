/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,css}'],
//   safelist: [
//     { pattern: /bg-bk-accent/ },
//     { pattern: /hover:bg-bk-accent-hover/ },
//   ],
  theme: {
    extend: {
      colors: {
        'primary': '#541802',
        'primary-accent': '#722103',
        'secondary': '#DFB09F',
        'secondary-dark': '#E0A189',
        'secondary-dark-ring': '#541802',
        'secondary-contrast': '#541802',
        'bk-accent': '#ff6b00',          // add your custom color if not defined
        'bk-accent-hover': '#ff8500',    // add hover color
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addComponents, theme }) {
      addComponents({
        '.btn': {
          padding: theme('spacing.4'),
          margin: 'auto',
        },
      });
    },
  ],
};
