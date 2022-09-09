const crawlerService = require('./carwler.js')
const verifycodeService = require('./vertify.js')
const request = require('request')
const utils = require('./utils.js')
const $ = require('cheerio')

async function verify(html) {
  console.log('正在识别验证码!');
  const root = $.load(html);

  let image = 'http://mp.weixin.qq.com/' + root("#seccodeImage").attr('src');
  image = `http://mp.weixin.qq.com/mp/verifycode?cert=${(new Date).getTime() + Math.random()}`;
  const cert = image.split('=')[1];
  const jar = request.jar();
  const res = await crawlerService.request({
    uri: image,
    encoding: 'base64',
    jar: jar
  });
  const cookie = jar.getCookieString(image);
  const verifycode = '1234';
  // const verifycode = await verifycodeService.verity(res.body);
  // if (!verifycode) {
  //   console.log('验证码识别失败');
  //   return;
  // }

  const verifycode_url = `http://mp.weixin.qq.com/mp/verifycode?cert=${encodeURIComponent(cert)}&input=${encodeURIComponent(verifycode)}`;

  const result = await crawlerService.request({
    uri: verifycode_url,
    json: true,
    formData: {
      input: encodeURIComponent(verifycode),
      cert: encodeURIComponent(cert)
    },
    method: 'POST',
    headers: {
      "Cookie": cookie
    }
  });
  console.log(result.body);
  console.log('验证码识别成功');
}

async function search(keywrod) {
  keywrod = encodeURIComponent(keywrod);
  const url = `http://weixin.sogou.com/weixin?type=1&s_from=input&query=${keywrod}&ie=utf8&_sug_=n&_sug_type_=`;
  const res = await crawlerService.search(url);
  if (res.body.indexOf('此验证码用于确认这些请求是您的正常行为而不是自动程序发出的，需要您协助验证') > 0) {
    await verify(res.body)
  }

  // await verify(res.body)

}

(async function main() {
  await search('中国威海环翠')
})();