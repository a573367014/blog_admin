process.env.NODE_ENV = 'development';
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const {resolve} = require('./utils.js');

baseConfig.entry['app'] = [
   'react-hot-loader/patch',
   resolve('src/main.js')
];

module.exports = merge(baseConfig, {
   devtool: 'cheap-module-eval-source-map',
   devServer: {
      contentBase: resolve('dist'),
      hot: true,
      port: 7070,
      proxy: {
         '/api': {
            target: 'http://localhost:5000',
            pathRewrite: {'^/api': ''}
         }
      }
   },
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader?sourceMap']
         }, {
            test: /\.less$/,
            use: ['style-loader', 'css-loader?sourceMap', 'less-loader']
         }, {
            test: /\.less$/,
            include: [resolve('src/views'), resolve('src/components')],
            use: [
               'style-loader',
               'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:7]',
               'less-loader'
            ]
         }
      ]
   },
   plugins: [
      new webpack.HotModuleReplacementPlugin()
   ]

});
