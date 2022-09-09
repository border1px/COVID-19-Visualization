const utils = require('../../utils/utils.js');

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
    currType: 0,
    list: [],
    clientHeight: 0,
    types:[
      { label: '全部', value: 0 },
      { label: '病例统计', value: 1 },
      { label: '病例轨迹', value: 2 },
      { label: '发布会', value: 3 },
      { label: '通告', value: 4 }
    ],
    loading: false,
    pageNo: 1,
    pageSize: 10,
    totalPage: 0
  },
  onLoad: function (options) {
    this.init()
    this.getNewsList()
  },
  init() {
    wx.getSystemInfo({ 
      success: res => { 
        this.setData({ 
          clientHeight: res.windowHeight - 60
        }); 
      } 
    })
  },
  async bindChangeType(event) {
    const { type } = event.currentTarget.dataset
    this.setData({ currType: type, pageNo: 1 })
    await this.getNewsList()
  },
  async getNewsList(loadmore) {
    const that = this
    wx.showLoading({ title: '加载中' })
    return wx.cloud.callFunction({
      name: 'news',
      data: {
        action: 'list',
        params: {
          pageNo: this.data.pageNo,
          pageSize: this.data.pageSize,
          type: this.data.currType
        }
      }
    }).then(res => {
      if (loadmore) {
        that.setData({ list: [...this.data.list, ...res.result.data], totalPage: res.result.totalPage })
      } else {
        that.setData({ list: res.result.data, totalPage: res.result.totalPage })
      }
      wx.hideLoading()
    })

  },
  loadMore() {
    if (this.data.pageNo >= this.data.totalPage) {
      // wx.showToast({ title: '没有更多了' })
      return
    }
    if (!this.data.loading) {
      this.setData({ loading: true, pageNo: this.data.pageNo + 1 })
      this.getNewsList(true).then(() => {
        this.setData({ loading: false })
      })
    }
  }
})