import cmRequest from './index'

export function getBanners() {
  return cmRequest.get("/banner", {
    type: 2
  })
}