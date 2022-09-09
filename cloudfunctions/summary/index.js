const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await db.collection('lk-summary')
    .orderBy('date', 'asc')
    .get()

  let result = {
    normal: true,
    lastUpdateTime: '',
    total: { confirm: 0, symptomless: 0, heal: 0, dead: 0 },
    today: { storeConfirm: 0, confirm: 0, symptomless: 0, heal: 0, dead: 0 },
    all: res.data
  }
  // 累计所有
  res.data.forEach(item => {
    result.total.confirm2 = res.data.reduce((total, curr) => (total + (curr.confirm2 || 0)), 0)
    result.total.confirm += item.confirm
    result.total.symptomless += item.symptomless
    result.total.heal += item.heal
    result.total.dead += item.dead
  })
  // 无症状转确诊，需要减掉无症状的数量
  result.total.symptomless -= (result.total.confirm2 || 0)

  // 今日
  let lastest = res.data[res.data.length - 1]
  if (checkYesterdayPublished(lastest)) {
    result.today = {
      date: lastest['date'],
      valid: true,
      confirm: lastest['confirm'],
      symptomless: lastest['symptomless'],
      heal: lastest['heal'],
      dead: lastest['dead'],
      storeConfirm: res.data.reduce((total, curr) => (!curr.history && (total + curr.confirm)), 0)
    }
  } else {
    result.today = {
      valid: false, confirm: 0, symptomless: 0, heal: 0, dead: 0, 
      storeConfirm: res.data.reduce((total, curr) => (!curr.history && (total + curr.confirm)), 0)
    }
  }
  result.normal = res.data[0]['normal']
  result.lastUpdateTime = lastest['lastUpdateTime']

  return result
}

function checkYesterdayPublished(lastest) {
  var timezone = 8; //目标时区时间，东八区
  var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
  var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
  var today = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);

  today.setTime(today.getTime()-24*60*60*1000);
  let year = today.getFullYear()
  let month = ('0' + (today.getMonth() + 1)).slice(-2)
  let day = ('0' + today.getDate()).slice(-2)
  var yesterday = `${year}-${month}-${day}`

  return lastest['date'] === yesterday ? true : false
}