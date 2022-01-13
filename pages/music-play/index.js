// pages/music-play/index.js
import { NavBarHeight } from '../../constants/device-const';
import { getSongDetail } from '../../service/api_player'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1. 获取传入的id
    const id = options.id;
    this.setData({ id });

    // 2. 根据id获取歌曲信息
    this.getPageData(id);

    // 3. 动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = getApp().globalData.screenHeight;
    const statusBarHeight = getApp().globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRadio = globalData.deviceRadio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 });

    // 4. 创建播放器
    const audioContext = wx.createInnerAudioContext();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.play();
  },

  // 网络请求
  getPageData: function(id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0] })
    })
  },

  // 事件处理
  handleSwiperChange: function(event) {
    console.log(event);
    const current = event.detail.current;
    this.setData({ currentPage: current });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})