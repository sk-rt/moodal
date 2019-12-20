const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = '';
let outputPath, devMode, sourceMap;
if (process.env.NODE_ENV === 'production') {
    outputPath = `${__dirname}/dist/${publicPath}`;
    devMode = 'production';
    sourceMap = false;
} else {
    outputPath = `${__dirname}/public/${publicPath}`;
    devMode = 'development';
    sourceMap = true;
}
module.exports = {
    entry: {
        main: `${__dirname}/src/js/main.js`
    },
    target: 'web',
    mode: devMode,
    devtool: sourceMap ? 'inline-source-map' : false,
    output: {
        path: outputPath,
        publicPath: publicPath,
        filename: 'js/[name][hash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },

            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: sourceMap,
                            url: false,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: sourceMap,
                            plugins: [require('autoprefixer')]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: sourceMap
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify(devMode)
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    devServer: {
        contentBase: `${__dirname}/public`,
        watchContentBase: true,
        open: true,
        host: '0.0.0.0',
        useLocalIp: true
    }
};
