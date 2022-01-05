import cmRequest from './index'

// 轮播图接口
export function getBanners() {
  return cmRequest.get("/banner", {
    type: 2
  })
}

// 歌曲排行接口
export function getRankings(idx) {
  return cmRequest.get("/top/list", {
    idx
  })
}

// cat -> category 类别
export function getSongMenu(cat="全部", limit=5, offset=0) {
  return cmRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}