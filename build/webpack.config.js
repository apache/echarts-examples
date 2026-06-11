const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

const distPath = path.resolve(__dirname, '../public');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  let configLocal = {};
  if (isDev) {
    const configLocalPath = path.resolve(
      __dirname,
      '../config/config.local.js'
    );
    if (fs.existsSync(configLocalPath)) {
      configLocal = require(configLocalPath);
    }
  }

  return [
    {
      entry: path.resolve(__dirname, '../src/main.js'),
      mode: argv.mode || 'production',
      output: {
        publicPath: './',
        filename: 'example-bundle.js',
        path: path.resolve(distPath, 'js'),
        library: {
          name: 'echartsExample',
          type: 'var'
        }
      },
      stats: 'minimal',
      resolve: {
        fallback: {
          fs: false
        }
      },

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
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 5120
              }
            }
          },
          {
            test: /\.svg$/,
            type: 'asset/source'
          },
          {
            test: /\.html$/,
            use: ['html-loader']
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
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(argv.mode || 'production'),
          // It can be used in the code directly.
          CONFIG_LOCAL: JSON.stringify(configLocal)
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
          filename: '../css/example-bundle.css'
        })
      ]
    },
    {
      // Separate built ts transformer to be loaded async
      mode: argv.mode || 'production',
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
        path: path.resolve(distPath, 'js'),
        library: {
          name: 'echartsExampleTransformTs',
          export: 'default',
          type: 'var'
        }
      }
    }
  ];
};
