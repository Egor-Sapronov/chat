'use strict';

let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let webpack = require('webpack');

module.exports = {
	context: path.join(__dirname, 'client/src'),
	entry: {
		index: './index.js'
	},
	output: {
		path: path.join(__dirname, 'client/dist'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.js']
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exlude: /node_modules/
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("[name].css")
	]
};