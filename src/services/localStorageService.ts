const LocalStorageService = (function(){
  var _service;

  function _getService(this: { getService: () => any; setToken: (tokenObj: { access_token: string; refresh_token: string; }) => void; getAccessToken: () => string; getRefreshToken: () => string; clearToken: () => void; }) {
      if(!_service) {
        _service = this;
        return _service
    }
    return _service
  }
  function _setToken(tokenObj: {access_token: string, refresh_token: string}) {
    localStorage.setItem('access_token', tokenObj.access_token);
    localStorage.setItem('refresh_token', tokenObj.refresh_token);
  }
  function _getAccessToken() {
    return localStorage.getItem('access_token');
  }
  function _getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  function _clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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

type LocalStorageService = {
  getService: void
}