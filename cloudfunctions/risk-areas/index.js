// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
//   let areaArr = [371002, 371003, 371082, 371083] // 环翠,文登,荣成,乳山

// 策略模式
const actionProcessor = {
  async index(params) { return await getRiskAreaIndex(params) },
  async list(params) { return await getRiskAreaList(params) }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, params } = event
  return await actionProcessor[action](params)
}

async function getRiskAreaList(params) {
  let res = null

  if (params && params.area_code) {
    res = await db.collection('lk-risk-areas-list').where({ area_code: area_code }).get()
  } else {
    res = await db.collection('lk-risk-areas-list').get()
  }
  return res.data
}

// async function getRiskAreaList(params) {
//   const { pageNo, pageSize } = params
//   let res = null

//   res = await db.collection('lk-risk-areas-list')
//     .where({ area_code: area_code })
//     .skip()
//     .limit(pageSize)
// 10*(n-1) +1 - 10*n
//     .get()
//   return res.data
// }

async function getRiskAreaIndex(params) {
  const res = await db.collection('lk-areas')
    .aggregate()   //这里是以user集合为主集合
    .lookup({
      from: 'lk-risk-tracks',  //要连接的集合名称
      localField: 'area_code',  //相对于user集合而言，trails就是本地字段
      foreignField: 'area_code',  //相对于user集合而言，risk-user-trail集合的_id就是外部字段
      as: 'tracks',  //指定匹配之后的数据存放在哪个字段
    })
    .lookup({
      from: 'lk-risk-areas',  //要连接的集合名称
      localField: 'area_code',  //相对于user集合而言，trails就是本地字段
      foreignField: 'area_code',  //相对于user集合而言，risk-user-trail集合的_id就是外部字段
      as: 'risk_areas',  //指定匹配之后的数据存放在哪个字段
    })
    .end()

    return res.list
}