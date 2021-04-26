let path = require('path')

let common = {
	entry: {
		results: './cmp/index.ts',
		submitted: './cmp/submitted.ts',

	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../api/dist')
	},
	module: {
		rules: [{
			test: /\.ts$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		}],
	},
	resolve: {
		extensions: ['.ts']
	}
}

let dev = {
	...common,
	mode: 'development',
	devtool: 'inline-source-map'
}

let prod = {
	...common,
	mode: 'production'
}

module.exports = (env, argv) => ({ ...common, ...(argv.mode === 'production' ? prod : dev) })