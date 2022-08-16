const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  entry: {
    //index: './src/app4.js',  
    index: './src/bike-app.js',  
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Bike trak visualization',
      // only for app4
      //template: 'app4.html',
      meta: [
        {"description":"Bike trak visualization with DeckGL"},
        {"name":"viewport", "content":"width=device-width, initial-scale=1"},
        {"charset":"UTF-8"},
      ],
      // Only for leaflet 
      // adjust for other apps needing a custom template
      // remove if not required
      template: 'bike-app.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
      ],
    }),
  ],
  
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/", // normally unused or /
    clean: true,
  },
  devServer: {
    // location of static assets, if any
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  devtool: "inline-cheap-source-map",
  //mode: 'development',
  mode: 'production',
  module: {
    rules: [
      // image loader
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // babel loader
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },      
    ],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 20,
      maxInitialRequests: 20,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

