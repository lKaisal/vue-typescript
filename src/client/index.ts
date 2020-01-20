import axios from 'axios'
const service = axios.create({
  baseURL: 'http://api.sm-admin-banner-service.svc.k8s.devel/api/v1',
  // headers: {
  //   Authorization: 'SjXGagud3addBJsyBNtEsrxRqnyNLsVsr296afaB',
  // },
  // baseURL: 'http://localhost:8088'
})

export default service