var path = require('path');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var rucksack = require('rucksack-css');
var postcssImport = require('postcss-import');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relativePath = isInNodeModules ? '../../..' : '..';
var isInDebugMode = process.argv.some(arg =>
  arg.indexOf('--debug-template') > -1
);
if (isInDebugMode) {
  relativePath = '../template';
}
var srcPath = path.resolve(__dirname, relativePath, 'src');
var nodeModulesPath = path.join(__dirname, '..', 'node_modules');
var indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html');
var faviconPath = path.resolve(__dirname, relativePath, 'favicon.ico');
var buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..',
  'build');

module.exports = {
  devtool: 'eval',
  entry: [
    require.resolve('webpack-dev-server/client') + '?http://localhost:3000',
    require.resolve('webpack/hot/dev-server'),
    path.join(srcPath, 'index')
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: buildPath,
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.css'],
    alias: {
      reeeset: nodeModulesPath + "reeeset/dist/reeeset.min.css"
    }
  },
  resolveLoader: {
    root: nodeModulesPath,
    moduleTemplates: ['*-loader']
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      include: srcPath,
    }],
    loaders: [{
      test: /\.js$/,
      include: srcPath,
      loader: 'babel',
      query: require('./babel.dev')
    }, {
      test: /\.css$/,
      include: srcPath,
      loader: 'style!css!postcss'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: 'file',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url?limit=10000'
    }]
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss: function() {
    return [
      postcssImport({
        onImport: function(files) {
          files.forEach(this.addDependency);
        }.bind(this)
      }),
      autoprefixer(),
      precss(),
      rucksack()
    ];
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      favicon: faviconPath,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    // Note: only CSS is currently hot reloaded
    new webpack.HotModuleReplacementPlugin()
  ]
};