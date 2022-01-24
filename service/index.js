import { TOKEN_KEY } from '../constants/token-const';

const token = wx.getStorageSync(TOKEN_KEY);

const BASE_URL = "http://123.207.32.32:9001";

// 已经部署好的
const LOGIN_BASE_URL = "http://123.207.32.32:3000";
// 登录服务器代码,自己部署
// const LOGIN_BASE_URL = "http://localhost:3000"

class CMRequest {
  constructor(baseURL, authHeader = {}) {
    this.baseURL = baseURL;
    this.authHeader = authHeader;
  }
  
  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, header } : header;

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        header: finalHeader,
        data: params, 
        success: (res) => {
          resolve(res.data);
        },
        // fail: reject
        fail: (err) => {
          reject(err);
        }
      })
    })
  }
  get(url, params, isAuth = false, header) {
    return this.request(url, "GET", params, isAuth, header);
  }

  post(url, data, isAuth = false, header) {
    return this.request(url, "POST", data, isAuth, header);
  }
}

const cmRequest = new CMRequest(BASE_URL);

const cmLoginRequest = new CMRequest(LOGIN_BASE_URL, {
  token
});

export default cmRequest;
export{
  cmLoginRequest
}