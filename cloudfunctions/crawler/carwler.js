// import * as Crawler from 'crawler'
// import * as nodeRequest from 'request'
const nodeRequest = require('request')
const Crawler = require('crawler')

const crawler = new Crawler({
  maxConnections: 1
});

 async function request(options) {
  return new Promise((c, e) => {
    nodeRequest(options, (err, res, body) => {
      if (err) {
        e(err);
      } else {
        c(res);
      }
    });
  });
}

 async function search(options) {
  let _options;
  if (typeof options === 'string') {
    _options = { uri: options };
  } else {
    _options = options;
  }
  return new Promise((c, e) => {
    crawler.queue({
      ..._options,
      callback: (error, res, done) => {
        if (_options.callback) {
          _options.callback(error, res, done);
        }
        if (error) {
          e(error);
        } else {
          c(res);
        }
        done();
      }
    });
  });
}

module.exports.search = search;
module.exports.request = request;
