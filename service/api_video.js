import cmRequest from './index'

export function getTopMV(offset, limit = 10) {
  return cmRequest.get("/top/mv", {
    offset,
    limit
  })
}

/**
 * 请求MV的播放地址
 * @param {number} id MV的id
 */
export function getMVURL(id) {
  return cmRequest.get("/mv/url", {
    id
  })
}

/**
 * 请求MV数据
 * @param {number} mvid MV的id
 */
export function getMVDetail(mvid) {
  return cmRequest.get("/mv/detail", {
    mvid
  })
}

/**
 * 请求相关视频
 * @param {number} id 视频的id
 */
export function getRelatedVideo(id) {
  return cmRequest.get("/related/allvideo", {
    id
  })
}