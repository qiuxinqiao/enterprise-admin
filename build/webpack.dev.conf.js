/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:48:36
 * @Description: 开发环境的webpack配置
 */
const utils = require('./utils');
const path = require('path');
const webpack = require('webpack');
const config = require('../config');
// webpack-merge是一个可以合并数组和对象的插件
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
// html-webpack-plugin用于将webpack编译打包后的产品文件注入到html模板中
// 即自动在index.html里面加上<link>和<script>标签引用webpack打包后的文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//一个输出webpack警告，错误的插件 用于更友好地输出webpack的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
//webpack的复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin');

//给每个入口页面(应用)加上dev-client，用于跟dev-server的热重载插件通信，实现热更新
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

function resolveApp(relativePath) {
    return path.resolve(relativePath);
}
//合并webpack.base.conf
module.exports = merge(baseWebpackConfig, {
    module: {//使用styleLoaders处理样式文件
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    // 浏览器sources加载 该项目的项目文件
    devtool: '#cheap-source-map',
    cache: true,
     // webpack插件
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jQuery': 'jquery'
        }),
          // 开启webpack热更新功能
        new webpack.HotModuleReplacementPlugin(),
        // webpack编译过程中出错的时候跳过报错阶段，不会阻塞编译，在编译结束后报错
        new webpack.NoEmitOnErrorsPlugin(),
        // 自动将依赖注入html模板，并输出最终的html文件到目标文件夹
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: resolveApp('favicon.ico'),//配置浏览器title图标
            inject: true,
            path:config.dev.staticPath
        }),
        new FriendlyErrorsPlugin(),//输出webpack的警告、错误等信息
        // 复制static静态文件 
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
    ]
})
