const { join } = require('path')

module.exports = {
  entry: [
    './src/front/index.js'
  ],
  output: {
    path: join(__dirname, '../../public'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
}
