import { MenuItem, LocalStorage } from '@/models'

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
    return localStorage.getItem('menu') && JSON.parse(localStorage.getItem('menu'))
  }
  getIsAuthorized() { return this.getAccessToken() && this.getRefreshToken() && this.getMenu() }
  getAllData() {
    if (this.getIsAuthorized()) {
      const data: LocalStorage = { access_token: this.getAccessToken(), refresh_token: this.getRefreshToken(), menu: this.getMenu() }
  
      return data
    }
  }
  clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('menu');
  }
}

export default new LocalStorageService
