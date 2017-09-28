const webpack = require('webpack');

// 读取同一目录下的 base config
const config = require('./webpack.base.config');

// 压缩混淆js 
config.plugins.push(
	new webpack.optimize.UglifyJsPlugin()
);

module.exports = config;