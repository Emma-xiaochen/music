// pages/home-music/index.js
import { rankingStore } from  '../../store/ranking-store'

import { getBanners } from '../../service/api_music'
import queryRect from '../../util/query-rect'
import throttle from '../../util/throttle'

const throttleQueryRect = throttle(queryRect);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0,
    banners: [],
    recommendSongs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData();

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction");

    // 从store获取共享的数据
    rankingStore.onState("hotRanking", (res) => {
      console.log("home-music:", res);
      if(!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      console.log(recommendSongs);
      this.setData({ recommendSongs })
    })
  },

  // 网络请求
  getPageData: function() {
    getBanners().then(res => {
      // setData是同步的还是异步的
      // setData在设置data数据上，是同步的
      // 通过最新的数据对wxml进行渲染，渲染的过程是异步
      this.setData({ banners: res.banners });

      // react -> setState是异步的
      // this.setState({ name: })
      // console.log(this.state.name);
    })
  },

  // 事件处理
  handleSearchClick: function() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  handleSwiperImageLoading: function() {
    // 获取图片的高度(如何去获取某一个组件的高度)
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0];
      this.setData({ swiperHeight: rect.height });
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})