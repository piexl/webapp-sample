const webpack = require('webpack');

// ��ȡͬһĿ¼�µ� base config
const config = require('./webpack.base.config');

// ѹ������js 
config.plugins.push(
	new webpack.optimize.UglifyJsPlugin()
);

module.exports = config;