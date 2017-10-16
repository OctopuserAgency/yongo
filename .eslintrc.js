module.exports = {
	root: true,
	parser: 'typescript-eslint-parser',
	parserOptions: {
		sourceType: 'module'
	},
	extends: 'airbnb-base',
	'env': {
    'node': true,
	},
	// required to lint *.vue files
	plugins: [
		'html',
		'eslint-plugin-html'
	],
	// check if imports actually resolve
	'settings': {
		'import/resolver': {
			'webpack': {
				'config': 'webpack.js'
			},
    	'eslint-import-resolver-typescript': true
		}
	},
	// add your custom rules here
	'rules': {
		'strict': ['off'],
		'no-param-reassign': ['error', { 'props': false }],
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'no-unused-vars': ['off'],
		'no-undef': ['off'],
		// don't require .vue extension when importing
		'import/extensions': ['error', 'always', {
			'js': 'never',
			'ts': 'never',
			'vue': 'never'
		}],
		'import/no-extraneous-dependencies': ['off'],
		// allow debugger during development
		'no-debugger': ['warn']
	}
}
