const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: 'http://localhost:3001/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader', options: { rootMode: 'upward' } },
            },
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { modules: true, esModule: false },
                    },
                ],
            },

        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'mfeQuotes',
            filename: 'remoteEntry.js',
            exposes: {
                './QuotesApp': './src/QuotesApp',
            },
            remotes: {
                mfeStore: 'mfeStore@http://localhost:3005/remoteEntry.js',
            },
            shared: {
                react: { singleton: true, requiredVersion: '^19.0.0' },
                'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
                zustand: { singleton: true, requiredVersion: '^5.0.0' },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        port: 3001,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
};
