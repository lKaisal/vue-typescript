const LocalStorageService = (function(){
  var _service;
  function _getService(this: { getService: () => any; setToken: (tokenObj: { token: string; refresh: string; }) => void; getAccessToken: () => string; getRefreshToken: () => string; clearToken: () => void; }) {
      if(!_service) {
        _service = this;
        return _service
    }
    return _service
  }
  function _setToken(tokenObj: {token: string, refresh: string}) {
    localStorage.setItem('token', tokenObj.token);
    localStorage.setItem('refresh', tokenObj.refresh);
  }
  function _getAccessToken() {
    return localStorage.getItem('token');
  }
  function _getRefreshToken() {
    return localStorage.getItem('refresh');
  }
  function _clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }
 return {
    getService : _getService,
    setToken : _setToken,
    getAccessToken : _getAccessToken,
    getRefreshToken : _getRefreshToken,
    clearToken : _clearToken
  }
 })();
 export default LocalStorageService;