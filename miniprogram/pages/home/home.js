const app = getApp()
const utils = require('../../utils/utils.js');
const dayjs = require("dayjs");
let polyline = [{ 
  points: [],
  color: "#ff6600",
  width: 4,
  dottedLine: false,
  arrowLine: true,
  borderColor: "black",
  borderWidth: 5
}]
let RISK_AREA_MARKERS = []
let PATIENT_MARKERS = []

Page({
  onShareAppMessage: function () {
    return {
      title: '威海疫情可视化工具',
      desc: '威海疫情可视化工具',
      path: '/pages/home/home',
      imageUrl: "../../images/banner.png"
    }
  },
  onShareTimeline: function() {
    return {
      title: '威海疫情可视化工具',
      desc: '威海疫情可视化工具',
      path: '/pages/home/home',
      imageUrl: "../../images/banner.png"
    }
  },
  data: {
    isBgMask: false,
    isGuide:false,
    isRouteVisible:false,
    isTrailTxt: false,
    trailTxt: '',
    windowWidth:0,
    windowHeight:0,
    latitude_const: 37.490551,
    longitude_const: 122.112022,
    // latitude_const: 37.504752,
    // longitude_const: 122.122946,
    scale_const: 11,
    latitude_user: 0,
    longitude_user: 0,
    latitude: 37.469653,
    longitude: 122.151238,
    inited: false,
    positionid: 0,
    openid:'',
    isnavigateback: false,
    circles: [],
    markers: [],
    polyline: [],
    polygon: [],
    actDateRange:[],
    currentDate: '',
    summary: null,
    riskUser: null,
    riskUserList: null, // 用户列表
    currentUser: null, // 当前选择用户
    isChoiceUser: false,
    isAreaVisible: false,
    isCalloutVisible: false,
    area_code: 371002, // 默认风险区域为”环翠区“
    RISKAREAS_MAP: [
      { area_name: '环翠区', area_code: 371002 },
      { area_name: '文登区', area_code: 371003 },
      { area_name: '荣成市', area_code: 371082 },
      { area_name: '乳山市', area_code: 371083 }
    ],
    riskAreasList: null,
    riskAreaIndex: 0,
    scaleLast: 11,
    calloutPanel: {},
    RISK_LEVEL: {
      3: '高风险',
      2: '中风险'
    },
    TRAKE_TYPE: {
      2: '轨迹点',
      1: '确诊场所'
    },
    loading: false,
  },
  markertap(e) {
    // let target = this.data.markers.find(it => it.markerId === e.detail.markerId)
    // if (target) {
    //   wx.showModal({
    //     title: '信息',
    //     showCancel: false,
    //     content: target.description,
    //   })      
    // }
  },
  // marker点击弹框
  callouttap:function(e){
    let target = this.data.markers.find(it => it.id === e.detail.markerId)
    const { poi_name, township, risk_level, track_type, distance } = target
    this.setData({
      calloutPanel: { poi_name, township, risk_level, track_type, distance },
      isCalloutVisible: true 
    })

  },
  bindIntroduce:function(){
    wx.navigateTo({
      url: '../primary/pages/introduce/introduce',
    })
  },
  // 视野变化
  bindRegionChange(event) {
    if (this.data.inited && event.causedBy === 'scale' && event.type === 'end') {
      this.wxmap.getScale({
        success: res => {
          this._triggerCallout(res.scale)
        }
      })
    }
  },
  _triggerCallout(scale) {
    if (scale >= 13 && this.data.scaleLast < 13) {
      RISK_AREA_MARKERS.forEach(marker => {
        marker.callout.display = 'ALWAYS'
      })
    }
    if (scale < 13 && this.data.scaleLast >= 13) {
      RISK_AREA_MARKERS.forEach(marker => {
        marker.callout.display = 'BYCLICK'
      })
    }
    this.setData({ markers: RISK_AREA_MARKERS, scaleLast: scale })
  },
  async bindChangeAreaTab(event) {
    const { area_code, index } = event.currentTarget.dataset
    let result = []
    let confirm = 0, trail = 0
    this.setData({ 
      riskAreaIndex: index
    })

  },
  // 地图图中心点 ——> 用户所在坐标 
  bindMylocation: async function () {
    if (!this.data.latitude_user && !this.data.longitude_user) {
      await this.getUserLocation()
    }
    this.setData({
      latitude: this.data.latitude_user,
      longitude: this.data.longitude_user
    })
  },
  bindShowRiskAreaModal: async function(){
    if (!this.data.riskAreasList) {
      await this.getRiskAreasIndex()
    }
    this.setData({ isBgMask: true, isAreaVisible: true })
  },
  bindShowRouteModal: async function(){
    if (!this.data.riskUserList) {
      await this.getPatientList()
    }
    this.setData({ isBgMask: true, isRouteVisible: true })
  },
  bindAboutUs: function() {
    wx.navigateTo({  url: '../aboutUs/aboutUs' })
  },
  bindNewsList: function() {
    wx.navigateTo({ url: '../news/news' })
  },
  bindMoreTrails: function() {
    wx.setStorageSync('latitude', this.data.latitude_user)
    wx.setStorageSync('longitude', this.data.longitude_user)
    wx.navigateTo({ url: '../trails/trails' })
  },
  bindGotoPage(event) {
    const page = event.currentTarget.dataset.page
    app.globalData.toPageFlag = true

    if (this.data.summary.normal) {
      wx.navigateTo({ url: `../${page}/${page}` })
    } else {
      if (page === 'news') {
        wx.navigateTo({  url: '../aboutUs/aboutUs' })
      } else {
        wx.navigateTo({ url: `../${page}/${page}` })
      }
    }
  },
  // 选择用户
  bindChoiceUser: function(event) {
    const index = event.currentTarget.dataset.index
    const userData = this.data.riskUserList[index]
    this.setData({ 
      isBgMask: false,
      isRouteVisible: false, 
      currentUser: userData, 
      // scale: this.data.scale_const, 
      latitude: this.data.latitude_const, 
      longitude: this.data.longitude_const 
    })
    // this._triggerCallout(11)
    this.genRiskUserTrail(userData.userId)
  },
  // 清除用户互动轨迹
  clearUserRoute: function() {
    this.setData({ currentUser: null })
  },
  bindChoiceArea: async function (event) {
    const { latitude, longitude } = event.currentTarget.dataset
    this.clearUserRoute()

    this.setData({
      latitude: latitude,
      longitude: longitude,
      isAreaVisible: false,
      isBgMask: false,
      scale: 14
    })
    this._triggerCallout(14)
  },
  // 用户轨迹
  genRiskUserTrail: function(userId, startTime, endTime) {
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({
      name: 'patient',
      data: {
        action: 'trail',
        params: {
          userId: userId,
          startTime: startTime,
          endTime: endTime
        }
      }
    }).then(res => {
      wx.hideLoading({})
      let initMarkerId = 1
      let markers = []

      res.result.forEach(trail => {
        if(trail.isKey) {
          markers.push({
            id: initMarkerId++,
            startTime: trail.startTime,
            endTime: trail.endTime,
            latitude: trail.latitude,
            longitude: trail.longitude,
            description: trail.description,
            iconPath: '../../images/loc-trail.png',
            width: 30,
            height: 30,
            zIndex: 11,
            callout: {
              content: trail.locale, color: "black", fontsize: "14", borderRadius: "10", bGcolor: "#ffffff", padding: "10", 
              display: "ALWAYS"
            } 
          })
        }
      })

      PATIENT_MARKERS = markers
      this.setData({
        markers: [ 
          ...RISK_AREA_MARKERS, 
          ...markers 
        ]
      })
    })
  },

  // 获取患者列表
  getPatientList: async function() {
    wx.showLoading({
      title: '加载中',
    })
    return await wx.cloud.callFunction({
      name: 'patient',
      data: {
        action: 'list'
      }
    }).then(res => {
      wx.hideLoading({
        success: (res) => {},
      })
      this.setData({
        riskUserList: res.result
      })
    })
  },
  // 查看介绍
  bindShowDescription: function() {
    if (this.currentUser) return
    let trails = []
    let trailTxt = ''
    this.data.markers.forEach(trail => {
      // trailTxt += `${dayjs(trail.startTime).format('HH:mm')}，${trail.description}\r\n`
      trailTxt += `${trail.description}\r\n`
    })
    this.setData({ trailTxt: trailTxt ,isTrailTxt: true })
  },
  hideModal: function(event) {
    const targetKey = event.currentTarget.dataset.targetkey
    this.setData({ isBgMask: false, [targetKey]: false })
  },
  getSummary: async function() {
    return await wx.cloud.callFunction({
      name: 'summary'
    }).then(res => {
      this.setData({ summary: res.result })
    })
  },
  async getRiskAreasIndex() {
    wx.showLoading({ title: '加载中' })
    return wx.cloud.callFunction({
      name: 'risk-areas',
      data: {
        action: 'index'
      }
    }).then(res => {
      res.result.forEach(item => {

        // tracks
        item.tracks.forEach(track => {
          let poi = track.poi.split(',')
          track.longitude = parseFloat(poi[0])  // 经度
          track.latitude = parseFloat(poi[1])   // 纬度
          track.distance = utils.getDistance(this.data.latitude_user, this.data.longitude_user, track.latitude, track.longitude) || 0
        })

        item.risk_areas.forEach(area => {
          let poi = area.poi.split(',')
          area.longitude = parseFloat(poi[0])  // 经度
          area.latitude = parseFloat(poi[1])   // 纬度
          area.distance = utils.getDistance(this.data.latitude_user, this.data.longitude_user, area.latitude, area.longitude) || 0
        })
      })

      this.setData({ riskAreasList: res.result })
      wx.hideLoading()
    })
  },
  // 风险区域列表
  getRiskAreaList: async function(area_code) {
    let initMarkerId = 1
    let markers = []
    let tmpObj = null

    return await wx.cloud.callFunction({
      name: 'risk-areas',
      data: {
        action: 'list'
      },
      params: {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      }
    }).then(res => {
      let poi = null
      res.result.forEach(item => {
        // 风险区域与用户位置的距离。客户端计算（主要为减轻服务端压力）
        // risk_level: 3: 高风险区域; 2: 中风险区域
        // track_type: 2: 过去14天患者去过的地点; 1: 确诊场所

        poi = item.poi.split(',')
        item.longitude = parseFloat(poi[0])  // 经度
        item.latitude = parseFloat(poi[1])   // 纬度
        if (this.data.latitude_user && this.data.longitude_user) {
          item.distance = utils.getDistance(this.data.latitude_user, this.data.longitude_user, item.latitude, item.longitude)
        } else {
          item.distance = ''
        }

        function renderBgColor(item) {
          if (item.risk_level === 3 || item.track_type === 1) {
            return '#d81e06'
          }
          if (item.risk_level === 2 || item.track_type === 2) {
            return '#FF8C00'
          }
        }

        tmpObj = {
          id: initMarkerId++,
          latitude: item.latitude,
          longitude: item.longitude,
          area_code: item.area_code,
          area_name: item.area_name,
          poi_name: item.poi_name,
          distance: item.distance,
          township: item.township,
          track_type: item.track_type,
          risk_level: item.risk_level,
          zIndex: item.risk_level === 3 ? 10 : 9,
          iconPath: '../../images/loc-virus.png',
          width: 30,
          height: 30,
          callout: {
            content: item.poi_name, color: "#FFF", fontsize: "10", borderRadius: "10",padding: 6,display: "BYCLICK",
            bgColor: renderBgColor(item)
          } 
        }
        markers.push(tmpObj)
      })

      RISK_AREA_MARKERS = markers
      this.setData({
        markers: markers,
      })
    })
  },
  onShow() {
    // 子页面返回home页，不刷新
    if (!app.globalData.toPageFlag){
      this.reload()
    }
    app.globalData.toPageFlag = false
  },
  onLoad: async function (options) {
    var that = this;
    this.reload()

    //获取用户当前的授权状态
    wx.getSetting({
      success: res => {
        //若用户没有授权地理位置
        if (!res.authSetting['scope.userLocation']) {
          //在调用需授权 API 之前，提前向用户发起授权请求
          wx.authorize({
            scope: 'scope.userLocation',
            //用户同意授权
            success: res => {
              // 用户已经同意小程序使用地理位置，后续调用 wx.getLocation 接口不会弹窗询问
              this.getUserLocation().then(() => this.reload())
            },
            // 用户不同意授权
            fail(){
                wx.showModal({
                  title: '提示',
                  content: '统计您周边的疫情需获取位置信息，请授权',
                  success: res => {
                    if (res.confirm == false) {
                      return false;
                    }
                    wx.openSetting({
                      success(res) {
                        //如果再次拒绝则返回页面并提示
                        if (!res.authSetting['scope.userLocation']) {
                          wx.showToast({
                            title: '统计您周边的疫情需获取位置信息，请授权',
                            duration: 3000,
                            icon: 'none'
                          })
                        } else {
                          //允许授权，调用地图
                          that.onLoad()
                        }
                      }
                    })
                  }
                }) 
            }
          })
        }
        else {
          this.reload()
        }
      }
    })

    wx.getStorage({       //获取缓存判断是否是第一次进入，需不需要加载引导页面
      key: 'isGuide',
      success(res) {
        that.setData({ isGuide:false })
      },
      fail(){
        wx.setStorage({ key: 'isGuide', data: 'false', })
      }
    });

    that.setData({ scale: that.data.scale });
    that.setData({
      latitude: that.data.latitude,
      longitude: that.data.longitude
    })
  },
  reset() {
    RISK_AREA_MARKERS.forEach(item => {
      item.callout.display = 'BYCLICK'
    })
    this.setData({ latitude: this.data.latitude_const, longitude: this.data.longitude_const, scale: 11, markers: RISK_AREA_MARKERS })
  },
  async reload(init) {
    if (this.data.loading) return

    this.setData({ loading: true })
    wx.showLoading({ title: '数据加载中' })

    this.genCircleRange();
    Promise.all([
      this.getRiskAreaList(),
      this.getSummary()
    ]).then(() => {
      PATIENT_MARKERS = []
      this.setData({ 
        longitude: this.data.longitude_const, 
        latitude: this.data.latitude_const, 
        scale: this.data.scale_const ,
        currentUser: null,
        loading: false
      })
      setTimeout(() => this.setData({ inited: true }) , 1000)
      wx.hideLoading()
    })
  },
  // 获取用户位置
  getUserLocation() {
    return new Promise(resolve => {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: res => {
          this.setData({
            latitude_user: res.latitude, //纬度
            longitude_user: res.longitude,//经度
            scale: this.data.scale_const
          })
          resolve()
        }
      })
    })
  },
  // 生成半径2km、5km的圆形范围
  genCircleRange () {
    this.wxmap = wx.createMapContext('map')
    this.wxmap.getRegion({
      success: res => {
        this.setData({
          circles: [{
            latitude: this.data.latitude_user,
            longitude: this.data.longitude_user,
            color: '#618ED1', fillColor: '#618ED150',
            strokeWidth: 1,level: 15,
            radius: 1000 // 半径
          },{
            latitude: this.data.latitude_user,
            longitude: this.data.longitude_user,
            color: '#618ED1', fillColor: '#618ED120',
            strokeWidth: 1,level: 15,
            radius: 3000 // 半径
          }]
        })
      }
    })
  }
})
