import axios from 'axios'
import LocalStorageService from '@/services/LocalStorageService'

const service = axios.create({
  headers: { 'Cache-Control': 'no-cache' },
})

// Request interceptor
service.interceptors.request.use(
  config => {
    const token = LocalStorageService.getAccessToken();
    if (token) config.headers['Authorization'] = 'Bearer ' + token;

    return config;
  },
  error => {
    Promise.reject(error)
  });

// Response interceptor
service.interceptors.response.use((response) => {
  return response
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const res = await axios.post('/refresh', { 'refresh': LocalStorageService.getRefreshToken() });
      // return Promise.reject(error)
      if (res.status === 200) {
        // 1) put token to LocalStorage
        LocalStorageService.setToken({access_token: res.data.token, refresh_token: res.data.refresh});
        // 2) Change Authorization header
        originalRequest.headers['Authorization'] = 'Bearer ' + LocalStorageService.getAccessToken();
        // 3) return originalRequest object with Axios.
        return axios(originalRequest);
      }
    }
    // return Error object with Promise
    return Promise.reject(error);
 });


export default service