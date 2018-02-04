const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// HappyPack通过并行转换文件使初始webpack的构建更快。
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: require('os').cpus().length });
const {resolve} = require('./utils.js');

module.exports = {
   entry: {
      vendor: ['babel-polyfill', 'raf/polyfill', 'react', 'react-dom', 'react-router-dom', 'axios', 'classnames', 'autobind-decorator', 'styled-components']
   },
   output: {
      path: resolve('dist'),
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[name].js'
   },
   resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
         '@': resolve('src')
      }
   },
   module: {
      rules: [{
         test: /\.jsx?$/,
         use: ['happypack/loader'],
         include: [resolve('src')]
      }, {
         test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
         loader: 'url-loader',
         options: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]'
         }
      }, {
         test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
         loader: 'url-loader',
         options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
         }
      }]
   },
   plugins: [
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),

      new HappyPack({
         threadPool: happyThreadPool,
         loaders: ['babel-loader']
      }),

      new webpack.NamedModulesPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
         name: 'vendor',
         minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
         name: 'common',
         minChunks: 2
      }),
      new HtmlWebpackPlugin({
         template: 'index.html',
         title: 'Hot Module Replacement',
         chunks: ['common', 'vendor', 'app'],
         chunksSortMode: 'manual',
         inject: 'body'
      })
   ]
};
