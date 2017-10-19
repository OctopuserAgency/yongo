const webpack = require('webpack');
const webpackConfig = require('./webpack.test');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['karma-typescript', 'mocha', 'chai', 'sinon'],
    files: [
      'src/**/*.ts',
      'tests/**/*.ts',
    ],
    exclude: [
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      'tests/**/*.ts': ['karma-typescript'],
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      devtool: 'inline-source-map',
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(ts|js)($|\?)/i,
        }),
      ],
    },
    webpackServer: {
      noInfo: true,
    },
    reporters: ['progress', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['jsdom'],
    singleRun: false,
    concurrency: Infinity,
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
  });
};
