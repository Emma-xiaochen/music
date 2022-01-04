import cmRequest from './index'

// 轮播图接口
export function getBanners() {
  return cmRequest.get("/banner", {
    type: 2
  })
}

// 歌曲排行接口
export function getRanking() {
  return cmRequest.get("/top/list", {
    idx: 1
  })
}

export function getSongMenu(cat="全部", limit=5, offset=0) {
  return cmRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}