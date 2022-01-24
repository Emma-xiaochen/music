import { cmLoginRequest } from './index';

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

export function codeToToken(code) {
  return cmLoginRequest.post("/login", { code });
}

export function checkToken() {
  return cmLoginRequest.post("/auth", {}, true);
}

export function postFavorRequest(id) {
  return cmLoginRequest.post("/auth", { id }, true);
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false);
      }
    })
  });
}
