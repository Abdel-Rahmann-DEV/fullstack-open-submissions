const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
module.exports = (env, argv) => {
   const isProduction = argv.mode === 'production';
   const backend_url = argv.mode === 'production' ? 'https://notes2023.fly.dev/api/notes' : 'http://localhost:3001/notes';

   return {
      entry: './src/index.js',
      output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'main.js',
      },
      module: {
         rules: [
            {
               test: /\.js$/,
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
               },
            },
            {
               test: /\.css$/,
               use: ['style-loader', 'css-loader'],
            },
         ],
      },
      plugins: [
         new CompressionPlugin(),
         new webpack.DefinePlugin({
            BACKEND_URL: JSON.stringify(backend_url),
         }),
      ],
      optimization: {
         minimize: true,
         minimizer: [
            new TerserPlugin({
               terserOptions: {
                  compress: {},
                  output: {
                     comments: false, // Remove comments
                  },
               },
            }),
         ],
      },
      devServer: {
         static: path.resolve(__dirname, 'build'),
         compress: true,
         port: 3000,
      },
      devtool: isProduction ? false : 'source-map',
   };
};
