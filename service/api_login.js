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

export function getUserInfo() {
  return  new Promise((resolve, reject) => {
    // 获得用户的信息
    wx.getUserProfile({
      desc: '你好啊，李银河',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
