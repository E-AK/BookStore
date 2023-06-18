const TsLoader = require('ts-loader');

module.exports = {
    // Other webpack configuration options...
    mode: 'development',
    module: {
      rules: [
        // Other rules...
  
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
      ],
    },
  
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
  
    // Other webpack configuration options...
  };
  