const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ora = require('ora');
const webpack = require('webpack');

const spinner = ora('building...');
spinner.start();

const webpackConfig = {
  entry: './src/index.ts',
  target: 'node',
  devtool: 'source-map',
  externals: [nodeExternals()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'yongo',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js', '.ts'],
  },
  module: {
    rules: [
      /* {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ["transform-es2015-modules-commonjs"]
          },
        },
      }, */
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

webpack(webpackConfig, (err, stats) => {
  spinner.stop();
  if (err) throw err;
  const statsOutput = stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  });
  process.stdout.write(`${statsOutput}\n`);
});
