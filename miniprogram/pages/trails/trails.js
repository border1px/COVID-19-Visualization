const utils = require('../../utils/utils.js');
let RISK_AREA_MARKERS = []

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
    latitude_const: 37.490551,
    longitude_const: 122.112022,
    scale_const: 11,
    scale:11, 
    latitude: 37.469653,
    longitude: 122.151238,
    markers: [],
    pageNo: 1,
    pageSize: 10,
    scrollViewHeight: 500,
    inited: false,
    scaleLast: 11
  },
  scroll() {

  },
  reset() {
    this.setData({
      latitude: this.data.latitude_const,
      longitude: this.data.longitude_const,
      scale: 11
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
            strokeWidth: 1,level: 13,
            radius: 1000 // 半径
          },{
            latitude: this.data.latitude_user,
            longitude: this.data.longitude_user,
            color: '#618ED1', fillColor: '#618ED120',
            strokeWidth: 1,level: 13,
            radius: 3000 // 半径
          }]
        })
      }
    })
  },
  onLoad: function (options) {
    const latitude = wx.getStorageSync('latitude')
    const longitude = wx.getStorageSync('longitude')
    this.setData({ latitude_user: latitude, longitude_user: longitude })
    
    wx.getSystemInfo({
      success: (result) => {
        this.setData({ scrollViewHeight: result.screenHeight  })
      },
    })
    this.getRiskAreaList()

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
              this.getUserLocation().then(() => this.genCircleRange())
              // this.reload()
            },
            // 用户不同意授权
            fail(){
                wx.showModal({
                  title: '提示',
                  content: '此功能需获取位置信息，请授权',
                  success: res => {
                    if (res.confirm == false) {
                      return false;
                    }
                    wx.openSetting({
                      success(res) {
                        //如果再次拒绝则返回页面并提示
                        if (!res.authSetting['scope.userLocation']) {
                          wx.showToast({
                            title: '此功能需获取位置信息，请重新设置',
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
          this.getUserLocation().then(() => this.genCircleRange())
          // this.reload()
        }
      }
    })
  },
  bindChoiceArea: async function (event) {
    const { latitude, longitude } = event.currentTarget.dataset

    this.setData({
      latitude: latitude,
      longitude: longitude,
      scale: 14
    })
    this._triggerCallout(14)
  },
  // 风险区域列表
  getRiskAreaList: async function(area_code) {
    wx.showLoading({
      title: '加载中',
    })
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
      // this.getUserLocation().then(() => {
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
            zIndex: item.risk_level === 3 ? 10 : 9,
            iconPath: item.track_type === 1 ? '../../images/loc-virus.png' :  '../../images/loc-trail.png',
            width: item.track_type === 1 ? 30 : 20,
            height: item.track_type === 1 ? 30 : 20,
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
          inited: true
        })
        wx.hideLoading({
          success: (res) => {},
        })
      // })
    })
  },
  // 视野改变
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
})