// pages/music-play/index.js
// import { getSongDetail, getSongLyric } from '../../service/api_player'
// import { parseLyric } from '../../util/parse-lyric';
import { audioContext, playerStore } from '../../../store/index'

const playModeNames = ["order", "repeat", "random"];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 关于歌曲的
    id: 0,

    // 网络请求的
    currentSong: {},
    durationTime: 0, // 总时长
    lyricInfos: [], // 歌词数据
    
    currentTime: 0, // 当前播放的时间
    currentLyricIndex: 0, // 当前歌词索引
    currentLyricText: "", // 当前歌词文本

    isPlaying: false,
    playingName: "pause",

    playModeIndex: 0, // 播放模式
    playModeName: "order", // 播放模式名字

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

    // playerStore.dispatch("playMusicWithSongIdAction", { id });

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
    // this.setupAudioContextListener();
  },

  // -------------------------- [ 事件处理 ] --------------------------
  handleSwiperChange: function(event) {
    const current = event.detail.current;
    this.setData({ currentPage: current });
  },
  
  handleSliderChanging: function(event) {
    const value = event.detail.value;
    const currentTime = this.data.durationTime * value / 100; 
    this.setData({ isSliderChanging: true, currentTime });
  },

  handleSliderChange: function(event) {
    // 1. 获取slider变化的值
    const value = event.detail.value;

    // 2. 计算需要播放的createTime
    const createTime = this.data.durationTime * value / 100;

    // 3. 设置context播放currenTime位置的音乐
    // audioContext.pause();
    audioContext.seek(createTime / 1000);

    // 4. 记录最新的sliderValue，并且需要将isSliderChanging设置回false
    this.setData({ sliderValue: value, isSliderChanging: false });
  },

  handleBackClick: function() {
    wx.navigateBack();
  },

  handleModeBtnClick: function() {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1;
    if(playModeIndex === 3) playModeIndex = 0;
    
    // 设置playStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex);
  },

  handlePlayBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },

  // 监听上一首/下一首按钮
  handlePrevBtnClick: function() {
    playerStore.dispatch("changeNewMusicAction", false);
  },

  // 监听下一首按钮
  handleNextBtnClick: function() {
    playerStore.dispatch("changeNewMusicAction");
  },

  // -------------------------- [ 数据监听 ] --------------------------
  setupPlayerStoreListener: function() {
    // 1. 监听currentSong/durationTime/lyricInfos
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if(currentSong) this.setData({ currentSong });
      if(durationTime) this.setData({ durationTime });
      if(lyricInfos) this.setData({ lyricInfos });
    })

    // 2. 监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if(currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100;
        this.setData({ currentTime, sliderValue });
      }
      // 歌词变化
      if(currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 });
      }
      if(currentLyricText) {
        this.setData({ currentLyricText });
      }
    })

    // 3. 监听播放模式相关的数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if(playModeIndex !== undefined) {
        this.setData({ 
          playModeIndex, 
          playModeName: playModeNames[playModeIndex] 
        });
      }

      if(isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? "pause" : "resume"
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

})