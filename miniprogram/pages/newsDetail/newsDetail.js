// pages/newsDetail/newsDetail.js
Page({
  onShareAppMessage: function () {
    return {
      title: '威海疫情可视化工具',
      desc: '威海疫情可视化工具',
      path: '/pages/home/home',
      imageUrl: "../../images/banner.png"
    }
  },
  onShareAppMessage: function () {
    return {
      title: '威海疫情可视化工具',
      desc: '威海疫情可视化工具',
      path: '/pages/home/home',
      imageUrl: "../../images/banner.png"
    }
  },
  data: {
    article: {}
  },
  onLoad: function (options) {
    this.getNewDetail(options.id)
  },
  getNewDetail(id) {
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({
      name: 'news',
      data: {
        action: 'detail',
        params: {
          id: id
        }
      }
    }).then(res => {
      this.setData({ article: res.result[0] })
      wx.hideLoading()
    })
  }
})