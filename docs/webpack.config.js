const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = '';
const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

module.exports = {
  entry: {
    main: `${__dirname}/src/js/main.js`,
  },
  target: 'web',
  mode: isDevelopment ? environment : 'production',
  devtool: isDevelopment ? 'inline-source-map' : false,
  output: {
    path: isDevelopment
      ? `${__dirname}/public${publicPath}`
      : `${__dirname}/dist${publicPath}`,
    publicPath: publicPath,
    filename: 'js/[name][hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
              url: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify(environment),
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    contentBase: `${__dirname}/public`,
    watchContentBase: true,
    open: true,
    host: '0.0.0.0',
    useLocalIp: true,
  },
};
