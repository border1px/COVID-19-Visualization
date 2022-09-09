var wxCharts = require('../../utils/wxcharts.js');

var lineChart = null;
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
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data 
      }
    });
  }, 
  genChartData() {
    let summary = wx.getStorageSync("summary");
    this.setData({ summary: summary })

    let data = {
      categories: [],
      datas: [
        [], // 0 确诊
        [] // 1 无症状
      ]
    }
    
    this.data.summary.all.forEach(item => {
      if (!item.history) {
        data.categories.push(item.date)
        data.datas[0].push(item.confirm)
        data.datas[1].push(item.symptomless)
      }
    })

    return data
  },
  bindShowRemark(event) {
    const { remark, confirm2 } = event.currentTarget.dataset
    if (remark) {
      wx.showModal({
        title: '详细信息',
        showCancel: false,
        content: remark
      })
      return
    }
    if (confirm2) {
      wx.showModal({
        title: '详细信息',
        showCancel: false,
        content: `有 ${this.data.summary.total.confirm2} 位无症状患者转为确诊病例。`
      })
    }
  },
  onLoad: function (e) {
    const allData = this.genChartData()

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
      
    // var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: allData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '确诊',
        color: '#FF0000',
        data: allData.datas[0]
      }, {
        name: '无症状',
        color: '#FF8C00',
        data: allData.datas[1]
      }],
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        title: '每日新增确诊/无症状人数',
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  }
});