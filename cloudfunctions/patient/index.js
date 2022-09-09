// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

const actionProcessor = {
  async list(params) { return await getPatientList(params) },
  async trail(params) { return await getPatientTrail(params) }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, params } = event
  return await actionProcessor[action](params)
}

async function getPatientList(params) {
  const res = await db.collection('lk-patient')
    .where({
      _id: _.exists(true)
    })
    .field({
      trails: 0
    })
    .get()

    return res.data
}

async function getPatientTrail(params) {
  const { userId, startTime, endTime } = params
  let res = null
  if (startTime || endTime) {
    res = await db.collection('risk-user-trail')
    .where({
      userId: userId,
      startTime: _.gt(new Date(startTime)),
      endTime: _.lt(new Date(endTime))
    })
    .get()
  } else {
    res = await db.collection('risk-user-trail')
    .where({
      userId: userId
    })
    .get()
  }

  // 百度地图拾取的坐标，用在腾讯地图中会有偏差
  res.data.forEach(item => {
    if (item.from === 'baidu') {
      item.latitude = item.latitude - 0.0060;
      item.longitude = item.longitude - 0.0065;
    }
  })

  return res.data
}

async function lookup() {
  const res = await db.collection('risk-user')
    .aggregate()   //这里是以user集合为主集合
    .lookup({
      from: 'risk-user-trail',  //要连接的集合名称
      localField: 'trails',  //相对于user集合而言，trails就是本地字段
      foreignField: '_id',  //相对于user集合而言，risk-user-trail集合的_id就是外部字段
      as: 'trails',  //指定匹配之后的数据存放在哪个字段
    })
    .match({       //类似于where，对记录进行筛选
      userId: userId,
      // "trails.startTime": _.gt(new Date(startTime)),
      // "trails.endTime": _.lt(new Date(endTime))
    })
    .project({
      trails: {
        $filter: {
          input: "$trails",
          as: "item",
          cond: {
            "$item.startTime": _.gt(new Date(startTime)),
            "$item.endTime": _.lt(new Date(endTime))
          }
        }
     }
    })
    .end()
  return res
}