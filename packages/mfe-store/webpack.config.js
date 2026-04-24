const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: 'http://localhost:3005/',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'mfeStore',
            filename: 'remoteEntry.js',
            exposes: {
                './store': './src/store.js',
            },
            shared: {},
        }),
    ],
    devServer: {
        port: 3005,
        headers: { 'Access-Control-Allow-Origin': '*' },
    },
};
