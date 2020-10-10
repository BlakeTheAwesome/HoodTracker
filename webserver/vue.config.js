module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  },
};
