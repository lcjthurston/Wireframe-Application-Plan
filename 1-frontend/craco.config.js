const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the sass-loader rule
      const sassRule = webpackConfig.module.rules
        .find(rule => rule.oneOf)
        ?.oneOf?.find(rule => 
          rule.test && rule.test.toString().includes('scss|sass')
        );

      if (sassRule && sassRule.use) {
        // Find the sass-loader in the use array
        const sassLoaderIndex = sassRule.use.findIndex(loader => 
          loader.loader && loader.loader.includes('sass-loader')
        );

        if (sassLoaderIndex !== -1) {
          // Update sass-loader options to use sass-embedded
          const sassLoader = sassRule.use[sassLoaderIndex];
          sassLoader.options = {
            ...sassLoader.options,
            implementation: require('sass-embedded'),
            sassOptions: {
              ...sassLoader.options?.sassOptions,
              // Use modern API
              api: 'modern',
              // Silence deprecation warnings
              silenceDeprecations: ['legacy-js-api'],
            },
          };
        }
      }

      return webpackConfig;
    },
  },
  devServer: {
    // Suppress webpack dev server logs for cleaner output
    client: {
      logging: 'warn',
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
    // Use modern setupMiddlewares instead of deprecated options
    setupMiddlewares: (middlewares, devServer) => {
      return middlewares;
    },
    // Disable deprecated options
    onBeforeSetupMiddleware: undefined,
    onAfterSetupMiddleware: undefined,
  },
};
