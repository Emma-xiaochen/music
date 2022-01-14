import cmRequest from './index'

// 歌曲详情接口
export function getSongDetail(ids) {
  return cmRequest.get("/song/detail", {
    ids
  })
}

// 歌词信息
export function getSongLyric(id) {
  return cmRequest.get('/lyric', {
    id
  })
}