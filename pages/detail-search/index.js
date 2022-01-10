// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest } from '../../service/api_search'
import debounce from '../../util/debounce'

const debounceSearchSuggest = debounce(getSearchSuggest, 300);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [
      
    ],
    searchValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面的数据
    this.getPageData();
  },

  // 网络请求
  getPageData: function() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots });
    })
  },

  // 事件处理
  handleSearchChange: function(event) {
    // 1. 获取输入的关键字
    const searchValue = event.detail;
    // 2. 保存关键字
    this.setData({ searchValue });
    // 3. 判断关键字为空字符的处理逻辑
    if(!searchValue.length){
      this.setData({ suggestSongs: [] });
      return;
    };
    // 根据关键字进行搜索
    debounceSearchSuggest(searchValue).then(res => {
      // 1. 获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch;
      this.setData({ suggestSongs });
      
      // 2. 转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = [];
      for(const keyword of suggestKeywords) {
        const nodes = [];
        if(keyword.toUpperCase().startsWith(searchValue.toUpperCase())) {
          const key1 = keyword.slice(0, searchValue.length);
          const node1 = {
            name: "span",
            attrs: { style: "color: #26ce8a;" },
            children: [{ type: "text", text: key1 }]
          }
          nodes.push(node1);
          
          const key2 = keyword.slice(searchValue.length);
          const node2 = {
            name: "span",
            attrs: { style: "color: #000000;" },
            children: [{ type: "text", text: key2 }]
          }
          nodes.push(node2);
        } else {
          const node = {
            name: "span",
            attrs: { style: "color: #000000;" },
            children: [{ type: "text", text: keyword }]
          }
          nodes.push(node);
        }
        suggestSongsNodes.push(nodes);
      }
      this.setData({ suggestSongsNodes });
    })
  }
})