const webpack = require('webpack');
//�������
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

// ��ȡͬһĿ¼�µ� base config
const config = require('./webpack.base.config');
// �˿�
const port = 8088;

// ��� webpack-dev-server ��ص�������
config.devServer = {
	contentBase: 'dist',//Ĭ������£���ʹ�õ�ǰ����Ŀ¼��Ϊ�ṩ���ݵ�Ŀ¼������������޸�Ϊ����Ŀ¼��
	inline:true,//����Ϊtrue����Դ�ļ��ı�ʱ���Զ�ˢ��ҳ��
	compress: true,//һ�з�������gzip ѹ��
	port: port,//ָ��Ҫ��������Ķ˿ں�
	watchContentBase: true,//���߷�����������Щͨ�� devServer.contentBase ѡ���ṩ���ļ�
	historyApiFallback: true,//��ʹ�� HTML5 History API ʱ������� 404 ��Ӧ��������Ҫ�����Ϊ index.html
};

// ���� HMR
config.plugins.push(
	new webpack.HotModuleReplacementPlugin()
);

// ��� Sourcemap ֧��
config.plugins.push(
	new webpack.SourceMapDevToolPlugin({
		filename: '[file].map',
		exclude: ['vendor.js'] // vendor ͨ������Ҫ sourcemap
	})
);

// �������
config.plugins.push(
	new OpenBrowserPlugin({url: 'http://localhost:'+port})
);

module.exports = config;