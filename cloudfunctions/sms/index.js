const cloud = require('wx-server-sdk')
const config= require("./config/config.js")
const tencentcloud = require("tencentcloud-sdk-Node.js");
const {secretId,secretKey} = config
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

exports.main = async (event, context) => {
  const smsClient = tencentcloud.sms.v20190711.Client;
  const models = tencentcloud.sms.v20190711.Models;
  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;

  let cred = new Credential(secretId,secretKey)
  let httpProfile = new HttpProfile();
  httpProfile.reqMethod = "POST";
  httpProfile.reqTimeout = 30;
  httpProfile.endpoint = "sms.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.signMethod = "HmacSHA256";
  clientProfile.httpProfile = httpProfile;
  let client = new smsClient(cred, "ap-guangzhou", clientProfile);
  let req = new models.SendSmsRequest();

  req.SmsSdkAppid = "1400364657";           // 创建应用环节里的SDKAppID
  req.Sign = "秋日可爱";                     // 签名内容
  req.ExtendCode = "";
  req.SenderId = "";
  req.SessionContext = "";
  req.PhoneNumberSet = ["+8618363116752"]; // 用户的手机号码
  req.TemplateID = "597853";               // 正文模板ID
  req.TemplateParamSet = ["1234","5"];     // 为模板内容里的变量，值为数组，有多少个变量就往数组里填多少个字符串

  client.SendSms(req, function (err, response) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(response.to_json_string());
  });

}