const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

const actionProcessor = {
  async list(params) { return await getNewsList(params) },
  async detail(params) { return await getNewsDetail(params) }
}

exports.main = async (event, context) => {
  const { action, params } = event
  return await actionProcessor[action](params)
}

async function getNewsList(params) {
  const { pageNo = 1, pageSize = 10, type = 0 } = params
  let res = null
  let total = 0

  if (type === 0) {
    total = await db.collection('lk-news').count()
    res = await db.collection('lk-news')
      .orderBy('publishTime', 'desc')
      .field({ title: true, publishTime: true, url: true, type: true})
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .get()
  } else {
    total = await db.collection('lk-news').where({ type: type }).count()
    res = await db.collection('lk-news')
      .orderBy('publishTime', 'desc')
      .field({ title: true, publishTime: true, url: true, type: true})
      .where({ type: type })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .get()
  }

  return {
    total: total,
    totalPage: Math.ceil(total.total / pageSize),
    pageNo: pageNo,
    pageSize: pageSize,
    data: res.data
  }
}

async function getNewsDetail(params) {
  const { id } = params
  const res = await db.collection('lk-news')
    .where({ _id: id })
    .get()
  return res.data
}