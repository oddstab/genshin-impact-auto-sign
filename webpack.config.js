const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path")

const config = {
  entry: {
    background: "./src/background.ts",
    content: "./src/content.ts",
    popup: "./src/popup.ts",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ["ts-loader"],
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './public', to: './' }
      ]
    })
  ],
};

module.exports = config;
