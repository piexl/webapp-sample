// 清除webpack打包文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 简化了HTML文件的创建，以便为您的webpack包提供服务
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 提取样式文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');


// 配置常量
// 源代码的根目录（本地物理文件路径）
const SRC_PATH = path.resolve('./src');
// node依赖模块
const NODE_MODULES = path.resolve('./node_modules');
// 打包后的资源根目录（本地物理文件路径）
const ASSETS_BUILD_PATH = path.resolve('./dist');
// 资源根目录（可以是 CDN 上的绝对路径，或相对路径）
const ASSETS_PUBLIC_PATH = 'static/';

//处理css样式
const cssLoaderConfig = {
	loader: 'css-loader',
	options: {
		minimize: false,// 压缩 css
		importLoaders:1 ,// 处理样式中import引入进来的文件,
		url: true, // 配置生成的标识符(ident)
	}
}

//浏览器前缀自动补全
const postcssLoaderConfig = {
	loader: 'postcss-loader',//自动添加前缀的插件
	options: {
		plugins: function () {
			return [require('autoprefixer')];
		}
	}
}

//分离样式
const extractCSS = new ExtractTextPlugin({
	filename:ASSETS_PUBLIC_PATH+'css/[name].[hash:7].css',
	allChunks:true,
});

//获取多级的入口文件
function getMultiEntry(globPath){
  	var entries = {},
    	basename, tmp, pathname;
  	glob.sync(globPath).forEach(function (entry) {
    	basename = path.basename(entry, path.extname(entry));
    	tmp = entry.split('/').splice(-4);
	
		var pathsrc = tmp[0]+'/'+tmp[1];
		if( tmp[0] == 'src' ){
			pathsrc = tmp[1];
		}
		// console.log(pathsrc)
    	pathname = basename; // 正确输出js和html的路径
    	entries[pathname] = entry;
    	// console.log(pathname+'-----------'+entry);
  	});
  	return entries;
}

// 获得入口js文件
function getEntries(){
	let entries =  getMultiEntry(SRC_PATH+'/views/**/*.js');
	console.log('entries',entries)
	// 注意 entry 中的路径都是相对于 SRC_PATH 的路径
	entries['common'] = './assets/js/common.js';//项目公共资源
	entries['app'] = './assets/js/app.js';//主页入口
	entries['vendor'] = ['./vendor/flexible.js'];// 第三方依赖名
	return entries;
}

module.exports = {
	context: SRC_PATH,
	entry:getEntries(),
	output:{
		filename:ASSETS_PUBLIC_PATH+'js/[name].bundle.js', //打包后输出文件的文件名
		path:ASSETS_BUILD_PATH, //打包后的文件存放的地方
		publicPath:''
	},
	module:{
		rules:[
			{
		  		test: /\.json$/,
		  		use: 'json-loader'
			},
	      	{
	      		test:/\.js$/,
				exclude: NODE_MODULES,// 排除node_modules目录下的文件
				include: SRC_PATH, // 只对src目录下的文件进行处理
				use:[{
			        loader: 'babel-loader',
			        options: {
			        	presets: ['env']
			        }
			    }]
	      	},
      	    {
      	        test: /\.(jpe?g|png|gif|svg)$/i,
      	        use:[{
					loader:'url-loader',
					options:{	
						limit:8192,
						name:ASSETS_PUBLIC_PATH+'images/[name].[hash:7].[ext]'
					}
				},'image-webpack-loader']
      	    },
      		{
      			test: /\.(woff2?|eot|ttf|otf)$/,
      	        use:[{
					loader:'url-loader',
					options:{	
						limit:8192,
						name:ASSETS_PUBLIC_PATH+'fonts/[name].[hash:7].[ext]'
					}
				}]
      		},
	      	{
	      		test:/\.css$/,
	      		use:extractCSS.extract([
      				cssLoaderConfig,
      				postcssLoaderConfig,
      			])
	      	},
	      	{
	      		test:/\.less$/,
	      		use:extractCSS.extract([
      				cssLoaderConfig,
      				postcssLoaderConfig,
      				'less-loader',
	      		])
	      	},
	      	{
	      		test:/\.scss$/,
	      		use:extractCSS.extract([
      				cssLoaderConfig,
      				postcssLoaderConfig,
      				'sass-loader',
	      		])
	      	},
	      	{
	      		test: /\.html$/,
	      		use: [{
	      			loader: 'html-loader',
	      			options: {
	      				minimize: false //是否压缩html
	      			}
	      		}]
	      	}
		]
	},
	plugins:[
		extractCSS,
		// 自动加载模块
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		// 每次打包前，先清空原来目录中的内容
		new CleanWebpackPlugin([ASSETS_BUILD_PATH], { verbose: false }),
		// 启用 CommonChunkPlugin
		new webpack.optimize.CommonsChunkPlugin({
		    name: 'vendor',
		    minChunks: Infinity
		})
	]
};

// 获得入口页面文件
let pages = getMultiEntry(SRC_PATH+'/views/**/*.html');
for (var pathname in pages) {
	// 配置生成的html文件，定义路径等
  	var conf = {
    	filename: pathname + '.html',// 打包路径
    	template: pages[pathname], // 模板路径
  	};
  	// console.log('conf',conf);
  	// 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  	module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

