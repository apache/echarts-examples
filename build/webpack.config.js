const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const distPath = path.resolve(__dirname, '../public');

module.exports = {
    entry: path.resolve(__dirname, '../src/main.js'),
    output: {
        filename: 'example-bundle.js',
        path: path.join(distPath, 'js'),
        library: 'echartsExample',
        libraryTarget: 'umd'
    },
    stats: 'minimal',
    module: {
        rules: [{
            test: /\.vue$/,
            use: ['vue-loader']
        }, {
            test: /\.js$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        }, {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sassjs-loader']
        }, {
            test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    outputPath: '../asset',
                    name: '[name].[ext]'
                }
            }]
        }]
    },
    externals: {
        vue: 'Vue'
    },
    plugins: [
        new webpack.IgnorePlugin(/^fs$/),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '../css/example-bundle.css'
        })
    ]
};
