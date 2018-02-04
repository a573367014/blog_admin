process.env.NODE_ENV = 'production';
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
//该插件是对“webpack hash”的改进：在主文件中获取到各异步模块的hash值
//然后将这些hash值与主文件的代码内容一同作为计算hash的参数
//这样就能保证主文件的hash值会跟随异步模块的修改而修改。
const baseConfig = require('./webpack.base.config.js');
const {resolve} = require('./utils.js');

baseConfig.entry['app'] = [
   resolve('src/main.js')
];

module.exports = merge(baseConfig, {
   devtool: 'source-map',
   output: {
      path: resolve('dist'),
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[name].[chunkhash].js'
   },
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: ['css-loader?sourceMap&minimize']
            })
         },
         {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: ['css-loader?sourceMap&minimize', 'less-loader']
            })
         },
         {
            test: /\.less$/,
            include: [resolve('src/views'), resolve('src/components')],
            use: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: ['css-loader?sourceMap&minimize&modules&localIdentName=[local]___[hash:base64:7]', 'less-loader']
            })
         }
      ]
   },
   plugins: [
      new CleanWebpackPlugin(['dist'], {
         root: process.cwd() // 必须设置运行的路径
      }),
      new WebpackMd5Hash(),
      new ExtractTextPlugin('css/all.[contenthash].css'),
      new CopyWebpackPlugin([{
         from: resolve('static'),
         to: resolve('dist/static')
      }]),
      new UglifyJsPlugin({
         parallel: false,
         sourceMap: false
      })
   ]

});
