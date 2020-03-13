import { MenuItem } from '@/models'

class LocalStorageService {
  setToken(tokenObj: {access_token: string, refresh_token: string, menu: MenuItem[] }) {
    localStorage.setItem('access_token', tokenObj.access_token);
    localStorage.setItem('refresh_token', tokenObj.refresh_token);
    localStorage.setItem('menu', JSON.stringify(tokenObj.menu));
  }
  getAccessToken() {
    return localStorage.getItem('access_token');
  }
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  getMenu() {
    return JSON.parse(localStorage.getItem('menu'))
  }
  getIsAuthorized() { return this.getAccessToken() && this.getRefreshToken() && this.getMenu() }
  clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('menu');
  }
}

export default new LocalStorageService
