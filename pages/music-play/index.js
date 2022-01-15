// pages/music-play/index.js
// import { getSongDetail, getSongLyric } from '../../service/api_player'
// import { parseLyric } from '../../util/parse-lyric';
import { audioContext, playerStore } from '../../store/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 关于歌曲的
    id: 0,

    // 网络请求的
    currentTime: 0, // 当前播放的时间
    durationTime: 0, // 总时长
    lyricInfos: [], // 歌词数据

    currentSong: {},
    currentLyricIndex: 0, // 当前歌词索引
    currentLyricText: "", // 当前歌词文本

    // 关于页面的
    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0, // 进度条进度
    isSliderChanging: false, // 进度条改变的状态
    lyricScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1. 获取传入的id
    const id = options.id;
    this.setData({ id });

    // 2. 根据id获取歌曲信息
    // this.getPageData(id);
    this.setupPlayerStoreListener();

    // 3. 动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRadio = globalData.deviceRadio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 });

    // 4. 使用audioContext播放歌曲
    // audioContext.stop();
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    // audioContext.autoplay = true;

    // 5. audioContext的事件监听
    this.setupAudioContextListener();
  },

  // -------------------------- [ 网络请求 ] --------------------------
  // getPageData: function(id) {
  //   getSongDetail(id).then(res => {
  //   this.setData({ currentSong: res.songs[0], durationTime: res.songs[0].dt })
  //   })

  //   getSongLyric(id).then(res => {
  //     const lyricString = res.lrc.lyric;
  //     const lyrics = parseLyric(lyricString);
  //     this.setData({ lyricInfos: lyrics });
  //   })
  // },

  // -------------------------- [ audio事件监听 ] --------------------------
  setupAudioContextListener: function() {
    audioContext.onCanplay(() => {
      audioContext.play();
    });

    // 监听当前时间改变
    audioContext.onTimeUpdate(() => {
      // 1. 获取当前时间
      const currentTime = audioContext.currentTime * 1000;

      // 2. 根据当前时间修改currentTime/sliderValue
      if(!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100;
        this.setData({ sliderValue, currentTime });
      }

      //  3. 根据当前时间去查找播放的歌词
      if(!this.data.lyricInfos.length) return;
      let i = 0;
      for(; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i];
        if(currentTime < lyricInfo.time) {
          break;
        }
      }

      // 设置当前歌词的索引和内容
      const currentIndex = i - 1;
      if(this.data.currentLyricInfo !== currentIndex) {
        const currentLyricInfo = this.data.lyricInfos[currentIndex];
        this.setData({ 
          currentLyricText: currentLyricInfo.text, 
          currentLyricIndex: currentIndex,
          lyricScrollTop: currentIndex * 35
        });
      }
    });
  },

  // -------------------------- [ 事件处理 ] --------------------------
  handleSwiperChange: function(event) {
    const current = event.detail.current;
    this.setData({ currentPage: current });
  },
  
  handleSliderChanging: function(event) {
    const value = event.detail.value;
    const currentTime = this.data.durationTime * value / 100; 
    this.setData({ isSliderChanging: true, currentTime, sliderValue: value });
  },

  handleSliderChange: function(event) {
    // 1. 获取slider变化的值
    const value = event.detail.value;

    // 2. 计算需要播放的createTime
    const createTime = this.data.durationTime * value / 100;

    // 3. 设置context播放currenTime位置的音乐
    audioContext.pause();
    audioContext.seek(createTime / 1000);

    // 4. 记录最新的sliderValue，并且需要将isSliderChanging设置回false
    this.setData({ sliderValue: value, isSliderChanging: false });
  },

  handleBackClick: function() {
    wx.navigateBack();
  },

  // -------------------------- [ 数据监听 ] --------------------------
  setupPlayerStoreListener: function() {
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if(currentSong) this.setData({ currentSong });
      if(durationTime) this.setData({ durationTime });
      if(lyricInfos) this.setData({ lyricInfos });
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

})