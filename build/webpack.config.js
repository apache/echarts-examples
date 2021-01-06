const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const distPath = path.resolve(__dirname, '../public');

module.exports = [
    {
        entry: path.resolve(__dirname, '../src/main.js'),
        output: {
            publicPath: './',
            filename: 'example-bundle.js',
            path: path.join(distPath, 'js'),
            library: 'echartsExample',
            libraryTarget: 'var'
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
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2)(\?.+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        outputPath: '../asset',
                        name: '[name].[ext]'
                    }
                }]
            }, {
                test: /\.svg$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
              },]
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
    },
    {
        // Sepearte built ts transformer to be loaded async
        entry: path.resolve(__dirname, '../src/editor/transformTs.js'),
        stats: 'minimal',
        module: {
            rules: [{
                test: /\.m?js$/,
                include: /node_modules/,
                type: 'javascript/auto',
                resolve: {
                    fullySpecified: false
                }
            }]
        },
        output: {
            filename: 'example-transform-ts-bundle.js',
            path: path.join(distPath, 'js'),
            library: 'echartsExampleTransformTs',
            libraryExport: 'default',
            libraryTarget: 'var'
        }
    }
];
