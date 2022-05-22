const path = require("path");
const webpack = require('webpack');
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
} );

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "app.js",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin( {
      "process.env": dotenv.parsed
    } ),
  ],
};
