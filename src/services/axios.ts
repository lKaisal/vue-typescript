import axios, { AxiosResponse } from 'axios'
import LocalStorageService from '@/services/LocalStorageService'
import { LocalStorageObj, LocalStorageRefreshObj } from '@/models'

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

      const res: AxiosResponse<LocalStorageRefreshObj> = await axios.post('/refresh', { 'refresh': LocalStorageService.getRefreshToken() });

      if (res.status === 200) {
        // 1) put token to LocalStorage
        const { token, refresh, menu } = res.data
        const localStorageObj: LocalStorageObj = { access_token: token, refresh_token: refresh, menu }
        LocalStorageService.setToken(localStorageObj);

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