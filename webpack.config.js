/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.   */
/*! All Rights Reserved. */
/*! ************************************************************* */
var path = require('path');

module.exports = {
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: __dirname
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {url: false}
                    },
                    {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "static")
        },
        compress: true,
        port: 9003
    }
};