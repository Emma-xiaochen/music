import { HYEventStore as cmEventStore } from 'hy-event-store';
import { getSongDetail, getSongLyric } from '../service/api_player';
import { parseLyric } from '../util/parse-lyric';

// const audioContext = wx.createInnerAudioContext(); // audioContext
const audioContext = wx.getBackgroundAudioManager(); // audioContext

const playerStore = new cmEventStore({
  state: {
    isFirstPlay: true, // 是否是第一次播放
    isStopping: false, // 是否停止状态

    id: 0, // 当前歌曲的id
    currentSong: {}, // 当前歌曲
    durationTime: 0, // 歌曲总时长
    lyricInfos: [], // 歌词数据

    currentTime: 0, // 当前播放的时间
    currentLyricIndex: 0, // 当前歌词索引
    currentLyricText: "", // 当前歌词文本

    isPlaying: false,  // 播放状态

    playModeIndex: 0, // 0:循环播放 1:单曲循环 2:随机播放
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    // 1. 监听歌曲可以播放
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if(ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true);
        return;
      }
      ctx.id = id;

      // 0. 修改播放状态
      ctx.isPlaying = true;
      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = "";


      // 1. 根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        audioContext.title = res.songs[0].name;
      })
      // 请求歌词
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric;
        const lyrics = parseLyric(lyricString);
        ctx.lyricInfos = lyrics;
      })

      // 2. 播放对应id的歌曲
      audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title = id;
      audioContext.autoplay = true;

      // 3. 监听audioContext一些事件
      if(ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFirstPlay = false;
      }
    },

    // 2. 监听时间改变
    setupAudioContextListenerAction(ctx) {
      // 1. 监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play();
      });
  
      // 2. 监听当前时间改变
      audioContext.onTimeUpdate(() => {
        // 1. 获取当前时间
        const currentTime = audioContext.currentTime * 1000;
  
        // 2. 根据当前时间修改currentTime
        ctx.currentTime = currentTime;
  
        //  3. 根据当前时间去查找播放的歌词
        if(!ctx.lyricInfos.length) return;
        let i = 0;
        for(; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i];
          if(currentTime < lyricInfo.time) {
            break;
          }
        }
  
        // 设置当前歌词的索引和内容
        const currentIndex = i - 1;
        if(ctx.currentLyricInfo !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex];
          ctx.currentLyricIndex = currentIndex;
          ctx.currentLyricText = currentLyricInfo.text;
        }
      });

      // 3. 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction");
      })

      // 4. 监听音乐暂停/播放/停止
      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      })
      // 停止状态
      audioContext.onStop(() => {
        ctx.isPlaying = false;
        ctx.isStopping = true;
      })
    },    

    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying;
      if(ctx.isPlaying && ctx.isStopping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = currentSong.name;
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
      if(ctx.isStopping) {
        audioContext.seek(ctx.currentTime);
        ctx.isStopping = false;
      }
    },

    changeNewMusicAction(ctx, isNext = true) {
      // 1. 获取当前索引
      let index = ctx.playListIndex;

      // 2. 根据不同的播放模式，获取下一首歌索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext? index + 1 : index -  1;
          if(index === -1) index = ctx.playListSongs.length - 1;
          if(index === ctx.playListSongs.length) index = 0;
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length);
          break;
      }
      
      // 3. 获取歌曲
      let currentSong = ctx.playListSongs[index];
      if(!currentSong) {
        currentSong = ctx.currentSong;
      } else {
        // 记录最新的索引
        ctx.playListIndex = index;
      }

      // 4. 播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true });
    }
  }
});

export {
  audioContext,
  playerStore
}