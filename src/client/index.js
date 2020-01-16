import axios from 'axios'  
const service = axios.create({
  // baseURL: 'http://api.sm-admin-banner-service.svc.k8s.devel/api/v1/'
  baseURL: '/'
})
service.interceptors.response.use(res => res.data, err => {
    console.log("err", err)
}) 

export default service