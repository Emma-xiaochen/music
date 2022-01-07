import cmRequest from './index'

// 热门搜索接口
export function getSearchHot() {
  return cmRequest.get("/search/hot")
}

// 搜索建议接口
export function getSearchSuggest(keywords) {
  return cmRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}