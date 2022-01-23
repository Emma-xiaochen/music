const BASE_URL = "http://123.207.32.32:9001";

const LOGIN_BASE_URL = "http://123.207.32.32:3000";

class CMRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        data: params, 
        success: (res) => {
          resolve(res.data);
        },
        fail: reject
        // fail: (err) => {
        //   reject(err);
        // }
      })
    })
  }
  get(url, params) {
    return this.request(url, "GET", params)
  }

  post(url, data) {
    return this.request(url, "POST", data)
  }
}

const cmRequest = new CMRequest(BASE_URL);

const cmLoginRequest = new CMRequest(LOGIN_BASE_URL);

export default cmRequest;
export{
  cmLoginRequest
};