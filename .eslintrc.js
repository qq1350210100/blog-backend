module.exports = {
	env: {
		browser: true,
		es6: true
	},
	extends: [
		// "eslint:recommended",
		// 'plugin:react/recommended'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: false
		},
		ecmaVersion: 2019,
		sourceType: 'module'
	},
	plugins: [
		'prettier', 
		// 'react', 
		// 'react-hooks'
	],
	parser: 'babel-eslint',
	rules: {
		'react/prop-types': 0,
		'react-hooks/rules-of-hooks': 'error',
		quotes: ['warn', 'single'],
		semi: ['warn', 'never']
	}
}
