import cmRequest from './index'

export function getTopMV(offset, limit = 10) {
  return cmRequest.get("/top/mv", {
    offset,
    limit
  })
}