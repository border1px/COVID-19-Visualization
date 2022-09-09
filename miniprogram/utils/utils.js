const dayjs = require("dayjs");

/**
 * 
 * @param {*} startTime 
 * @param {*} endTime 
 * @return ['2021-07-31', '2021-08-01', '2021-08-02']
 */
export function genDateRangeText(startTime, endTime) {
  startTime = dayjs(startTime)
  endTime = dayjs(endTime)
  let range = []
  let delta = endTime.diff(startTime, 'day') + 1
  console.log(delta)
  for (let i = 0; i < delta; i++) {
    range.push(startTime.format('YYYY-MM-DD'))
    startTime = startTime.add(1, 'day')
  }

  return range
}


// 经纬度转换成三角函数中度分表形式。
function rad(d) {
  return d * Math.PI / 180.0; 
}
// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
export function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里

  var distance = s;
  var distance_str = "";

  if (parseInt(distance) >= 1) {
    distance_str = distance.toFixed(1) + "km";
  } else {
    distance_str = distance * 1000 + "m";
  }
  // console.info('lyj 距离是', s);
  // console.info('lyj 距离是', distance_str);
  return s.toFixed(2);
}

export function throttle(fn,wait){
  var timer = null;
  return function(){
    var context = this;
    var args = arguments;
    if(!timer){
      timer = setTimeout(function(){
        fn.apply(context,args);
        timer = null;
      },wait)
    }
  }
}
