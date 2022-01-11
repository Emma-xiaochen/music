import cmRequest from './index'

export function getSongDetail(ids) {
  return cmRequest.get("/song/detail", {
    ids
  })
}