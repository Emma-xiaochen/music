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
    }
  }
});

export {
  audioContext,
  playerStore
}