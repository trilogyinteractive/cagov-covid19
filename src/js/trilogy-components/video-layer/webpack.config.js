const path = require('path');

module.exports = {
    entry: [
      __dirname + '/styles/index.scss',
      __dirname + '/js/index.js'
    ],
    output: {
      path: path.resolve(__dirname, 'dist'), 
      filename: 'index.min.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: []
        },{
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: { outputPath: './', name: '[name].min.css'}
            },
            'sass-loader'
          ]
        }
      ]
    }
};
