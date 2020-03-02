module.exports = {
  devServer: {
    // port: 8080,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      },
      '/refresh': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      }
    }
  },
}
