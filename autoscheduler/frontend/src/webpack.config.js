module.exports = {
  mode: 'production', // Should we change this to development?

  // Enable sourcemaps for debugging webpack's output
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: '@teamsupercell/typings-for-css-modules-loader',
          },
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'camelCase',
              modules: {
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },

  // When importing a module whose path matches one of the following, just assume a corresponding
  // global variable exists and use that instead. This is important b/c it allows us to avoid
  // bundling all of our dependencies, which allows browsers to cache those libraries between builds
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
