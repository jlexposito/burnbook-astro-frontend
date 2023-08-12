module.exports = {
  plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      autoprefixer: {},
      tailwindcss: {},
  },
};
//module.exports = {
//	plugins: {
//		"tailwindcss/nesting": "postcss-nesting",
//		tailwindcss: {
//			config: require("path").join(__dirname, "tailwind.config.cjs"),
//		},
//		"postcss-preset-env": {
//			stage: 1,
//			features: {
//				"nesting-rules": false,
//			},
//		},
//	},
//}