const app = getApp()

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    summary: {
      type: Object
    },
    router: {
      type: Boolean,
      value: true
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    bindGotoPage(event) {
      if (this.data.router) {
        const page = event.currentTarget.dataset.page
        app.globalData.toPageFlag = true
        wx.setStorageSync("summary", this.data.summary)
        if (this.data.summary.normal) {
          wx.navigateTo({ url: `../${page}/${page}` })
        }
      }
    },
    // bindShowCharts() {
    //   if (this.data.router) {
    //     wx.setStorageSync("summary", this.data.summary)
    //     wx.navigateTo({  url: '../charts/charts' })
    //   }
    // },
    // 这里是一个自定义方法
    bindWhyConfirm() {
      wx.showModal({
        title: '无症状转确诊',
        showCancel: false,
        content: `自2022.03.07日至今，共有 ${this.data.summary.total.confirm2} 位无症状患者转为确诊病例。` ,
      })
    },
  }
})
