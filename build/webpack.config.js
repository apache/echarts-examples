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
      rules: [
        {
          test: /\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /\.js$/,
          resourceQuery: {
            not: [/raw-pure/]
          },
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sassjs-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp)(\?.+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 5120,
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: '../asset',
                name: '[name].[ext]',
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.(svg|html)$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                // will be `true` in production
                // minimize: true
              }
            }
          ]
        },
        {
          resourceQuery: /raw-pure/,
          type: 'asset/source'
        },
        {
          resourceQuery: /raw-minify/,
          type: 'asset/source',
          use: [
            {
              loader: path.resolve(__dirname, './minify-loader.js'),
              /** @type {import('terser').MinifyOptions} */
              options: {
                compress: {
                  pure_funcs: ['console.debug', 'console.log']
                }
              }
            }
          ],
          enforce: 'post'
        }
      ]
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
    // Separate built ts transformer to be loaded async
    entry: path.resolve(__dirname, '../src/editor/transformTs.js'),
    stats: 'minimal',
    module: {
      rules: [
        {
          test: /\.m?js$/,
          include: /node_modules/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false
          }
        }
      ]
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
