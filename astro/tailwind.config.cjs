/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		
		extend: {
			colors: {
				'primary': '#0b4141',
				'secondary': '#f2d349',
				'accent': '#ff6864',
				'accent-dark': '#c10015',
				'positive': '#21ba45',
				'negative': '#c10015',
				'dark': '#006a71',
			},
		},
	},
	plugins: [
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/forms"),
		function ({ addComponents, theme }) {
			addComponents({
			  '.btn': {
				padding: theme('spacing.4'),
				margin: 'auto'
			  }
			})
		  }
	],
}
