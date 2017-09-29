const webpack = require('webpack');
//打开浏览器
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

// 读取同一目录下的 base config
const config = require('./webpack.base.config');
// 端口
const port = 8088;

// 添加 webpack-dev-server 相关的配置项
config.devServer = {
	contentBase: 'dist',//默认情况下，将使用当前工作目录作为提供内容的目录，但是你可以修改为其他目录：
	inline:true,//设置为true，当源文件改变时会自动刷新页面
	compress: true,//一切服务都启用gzip 压缩
	port: port,//指定要监听请求的端口号
	watchContentBase: true,//告诉服务器监视那些通过 devServer.contentBase 选项提供的文件
	historyApiFallback: true,//当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
};

// 启用 HMR
config.plugins.push(
	new webpack.HotModuleReplacementPlugin()
);

// 添加 Sourcemap 支持
config.plugins.push(
	new webpack.SourceMapDevToolPlugin({
		filename: '[file].map',
		exclude: ['vendor.js'] // vendor 通常不需要 sourcemap
	})
);

// 打开浏览器
config.plugins.push(
	new OpenBrowserPlugin({url: 'http://localhost:'+port+'/views/examples/examples.html'})
);

module.exports = config;