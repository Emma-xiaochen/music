import { HYEventStore as cmEventStore } from 'hy-event-store';
import { getSongDetail, getSongLyric } from '../service/api_player';
import { parseLyric } from '../util/parse-lyric';

const audioContext = wx.createInnerAudioContext();

const playerStore = new cmEventStore({
  state: {
    id: 0, // 当前歌曲的id
    currentSong: {}, // 当前歌曲
    durationTime: 0, // 歌曲总时长
    lyricInfos: [], // 歌词数据

    currentTime: 0, // 当前播放的时间
    currentLyricIndex: 0, // 当前歌词索引
    currentLyricText: "", // 当前歌词文本

    playModeIndex: 0, // 0:循环播放 1:单曲循环 2:随机播放
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      ctx.id = id;

      // 1. 根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
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
      audioContext.autoplay = true;

      // 3. 监听audioContext一些事件
      this.dispatch("setupAudioContextListenerAction");
    },
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
    }
  }
});

export {
  audioContext,
  playerStore
}