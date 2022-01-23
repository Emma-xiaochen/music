import cmLoginRequest from './index';

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        console.log(res.code);
        const code = res.code;
        resolve(code);
      },
      fail: err => {
        console.log(err);
        reject(err);
      }
    })
  })
}

export function codeToken(code) {
  return cmLoginRequest.post("/login", { code });
}