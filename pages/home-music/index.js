// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from  '../../store/index'
import {} from '../../store/index'
import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../util/query-rect'
import throttle from '../../util/throttle'

const throttleQueryRect = throttle(queryRect, 1000, { trailing: true });

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0,
    banners: [],
    hotSongMenu: [],
    recommendSongs: [],
    recommendSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} },

    currentSong: {},
    isPlaying: false,
    playAnimState: "pause"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    playerStore.dispatch("playMusicWithSongIdAction", { id: 1842025914 })

    // 获取页面数据
    this.getPageData();

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction");

    // 从store获取共享的数据
    this.setupPlayerStoreListener();
  },

  // 网络请求
  getPageData: function() {
    getBanners().then(res => {
      this.setData({ banners: res.banners });
    })

    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists });
    })

    getSongMenu("华语").then(res => {
      this.setData({ recommendSongMenu: res.playlists });
    })
  },

  // 事件处理
  handleSearchClick: function() {
    wx.navigateTo({
      url: '/pages/detail-search/index'
    })
  },

  handleSwiperImageLoaded: function() {
    // 获取图片的高度(如何去获取某一个组件的高度)
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0];
      this.setData({ swiperHeight: rect.height });
    });
  },

  // 监听推荐歌曲中的更多的点击
  handleMoreClick: function() {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick: function(event) {
    const idx = event.currentTarget.dataset.idx;
    const rankingName = rankingMap[idx];
    this.navigateToDetailSongsPage(rankingName);
  },

  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`
    })
  },

  // 监听首页推荐歌曲的索引点击
  handleSongItemClick: function(event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playListSongs", this.data.recommendSongs);
    playerStore.setState("playListIndex", index);
  },

  // 监听首页播放按钮的点击
  handlePlayBtnClick: function(event) {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
    // Propagation 繁殖
    // event.stopPropagation();
  },

  // 监听播放工具栏点击跳转详情播放页
  handlePlayBarClick: function() {
    wx.navigateTo({
      url: `/pages/music-play/index?id=${this.data.currentSong.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // 卸载页面
  onUnload: function () {
    // 在销毁的时候取消监听，首页是可以不用取消的
    rankingStore.offState("newRanking", this.getNewRankingHandle);
  },

  setupPlayerStoreListener: function() {
    // 1. 排行榜监听
    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs })
    })
    rankingStore.onState("newRanking", this.gerRankingHandler(0));
    rankingStore.onState("originRanking", this.gerRankingHandler(2));
    rankingStore.onState("upRanking", this.gerRankingHandler(3));

    // 2. 播放器监听
    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if(currentSong) this.setData({  currentSong });
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playAnimState: isPlaying ? "running" : "paused"
        });
      }
    })
  },

  gerRankingHandler: function(idx) {
    return (res) => {
      if(Object.keys(res).length === 0) return;
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0, 3);
      const rankingObj = {name, coverImgUrl, playCount, songList};
      const newRankings = { ...this.data.rankings, [idx]: rankingObj };
      this.setData({ 
        rankings: newRankings
      })
    }
  }
})