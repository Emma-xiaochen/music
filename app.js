// app.js
import { getLoginCode, codeToToken } from './service/api_login'; 
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0
  },
  onLaunch: function() {
    // 1. 获取了设备信息
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;

    const deviceRadio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRadio = deviceRadio;

    //  2. 让用户默认进行登录
    this.loginAction();
  },
  loginAction: async function() {
    // 1.获取code
    const code = await getLoginCode();
    console.log(code);

    // 2. 将code发送给服务器
    const result = await codeToToken(code);
    console.log(result);
  }
})
