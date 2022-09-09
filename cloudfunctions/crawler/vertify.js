const crawlerService = require('./carwler.js');
const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf-8'));

const ruokuai_config = {
  username: config.ruokuai.username,
  password: config.ruokuai.password,
  typeid: '3040',
  timeout: 70,
  softid: '87007',
  softkey: '3395464a397f44778a8d74149dc3ff85',
};

 async function verity(base64) {
  const ruokuaiRes = await crawlerService.request({
    uri: 'http://api.ruokuai.com/create.json',
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'zh-cn',
      'Host': 'api.ruokuai.com'
    },
    json: true,
    formData: {
      ...ruokuai_config,
      image: {
        value: base64,
        options: {
          filename: '1.jpg',
          contentType: 'application/octet-stream',
          header: {
            'Content-Transfer-Encoding': 'base64'
          }
        }
      }
    }
  });
  return ruokuaiRes.body.Result;
}

module.exports.verity = verity;
