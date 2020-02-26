import axios from 'axios'
import LocalStorageService from '@/services/localStorageService'

const service = axios.create({
  // baseURL: 'http://localhost:8080/api/v1',
  // baseURL: 'http://api.sm-admin-banner-service.svc.k8s.devel/api/v1',
  // headers: { Authorization: `Bearer SjXGagud3addBJsyBNtEsrxRqnyNLsVsr296afaB` }
})

// LocalstorageService
const localStorageService = LocalStorageService.getService();

// Request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorageService.getAccessToken();
    if (token) config.headers['Authorization'] = 'Bearer ' + token;

    return config;
  },
  error => {
    Promise.reject(error)
  });

// Response interceptor
axios.interceptors.response.use((response) => {
  return response
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await axios.post('/refresh', { "refresh": localStorageService.getRefreshToken() });
      if (res.status === 201) {
        // 1) put token to LocalStorage
        localStorageService.setToken(res.data);
        // 2) Change Authorization header
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
        // 3) return originalRequest object with Axios.
        return axios(originalRequest);
      }
    }
    // return Error object with Promise
    return Promise.reject(error);
 });


export default service