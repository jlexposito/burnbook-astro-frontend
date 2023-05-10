/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue, css}'],
	theme: {
		extend: {
			colors: {
				'primary': '#541802',
				'secondary': '#DFB09F',
				'secondary': '#DFB09F',
				'secondary-dark': '#E0A189',
				'secondary-dark-ring': '#E17D50',
				'secondary-contrast': '#541802',
			},
		},
	},
	plugins: [
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/forms"),
		function ({ addComponents, theme }) {
			addComponents({
			  '.bk-acent': {
				padding: theme('spacing.4'),
				margin: 'auto'
			  }
			})
		  }
	],
}
