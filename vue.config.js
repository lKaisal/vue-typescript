module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://api.sm-admin-banner-service.svc.k8s.devel/api/v1',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
