const $ = require('cheerio')

const html =`
<!DOCTYPE HTML>
    <html>
    <head>
        <meta charset="utf-8">
        <link rel="shortcut icon" href="//www.sogou.com/images/logo/new/favicon.ico?v=4" type="image/x-icon">
        <title>搜狗搜索</title>
        <link rel="stylesheet" href="static/css/anti.min.css?v=2"/>
        <script src="//dlweb.sogoucdn.com/common/lib/jquery/jquery-1.11.0.min.js"></script>
        <script src="static/js/antispider.min.js?v=3"></script>
        <script>
            var domain = getDomain();
            window.imgCode = -1;
    
            (function() {
                function checkSNUID() {
                    var cookieArr = document.cookie.split(; ),
                        count = 0;
    
                    for(var i = 0, len = cookieArr.length; i < len; i++) {
                        if (cookieArr[i].indexOf(SNUID=) > -1) {
                            count++;
                        }
                    }
    
                    return count > 1;
                }
    
                if(checkSNUID()) {
                    var date = new Date(), expires;
                    date.setTime(date.getTime() -100000);
    
                    expires = date.toGMTString();
    
                    document.cookie = SNUID=1;path=/;expires= + expires;
                    document.cookie = SNUID=1;path=/;expires= + expires + ;domain=.www.sogo.com;
                    document.cookie = SNUID=1;path=/;expires= + expires + ;domain=.weixin.sogo.com;
                    document.cookie = SNUID=1;path=/;expires= + expires + ;domain=.sogo.com;
                    document.cookie = SNUID=1;path=/;expires= + expires + ;domain=.www.sogou.com;
                    document.cookie = SNUID=1;path=/;expires= + expires + ;domain=.weixin.sogou.com;
                    document.cookie = SNUID=1;path=/;expires= + expires + ;domain=.sogou.com;
                    document.cookie = SNUID=1;path=/;expires= + expires + ;domain=.snapshot.sogoucdn.com;
    
                    sendLog(delSNUID);
                }
    
                if(getCookie(seccodeRight) === success) {
                    sendLog(verifyLoop);
    
                    setCookie(seccodeRight, 1, getUTCString(-1), location.hostname, /);
                }
    
                if(getCookie(refresh)) {
                    sendLog(refresh);
                }
            })();
    
            function setImgCode(code) {
                try {
                    var t = new Date().getTime() - imgRequestTime.getTime();
                } catch (e) {
                }
                window.imgCode = code;
            }
            sendLog(index);
    
            function changeImg2() {
            if(window.event) {
            window.event.returnValue=false
            }
            }
            var suuid = "";var auuid = "ed018769-a65f-4b65-a76c-5db103e787b0";    </script>
    </head>
    <body>
    <div class="header">
        <div class="logo">
            <a href="/">
                <img width="180" height="60" src="static/images/logo_180x60.png" srcset="static/images/logo_180x60@2x.png 2x">
            </a>
        </div>
        <div class="other"><span class="s1">您的访问出错了</span><span class="s2"><a href="/">返回首页&gt;&gt;</a></span></div>
    </div>
    <div class="content-box">
        <p class="ip-time-p">IP：221.2.157.165<br>访问时间：2021.09.02 10:09:54<br>VerifyCode：5db103e787b0<br>From：weixin.sogou.com</p>
        <p class="p2">用户您好，我们的系统检测到您网络中存在异常访问请求。<br>此验证码用于确认这些请求是您的正常行为而不是自动程序发出的，需要您协助验证。</p>
        <p class="p3"><label for="seccodeInput">验证码：</label></p>
        <form name="authform" method="POST" id="seccodeForm" action="/">
            <p class="p4">
                <input type=text name="c" value="" placeholder="请输入验证码" id="seccodeInput" autocomplete="off">
                <input type="hidden" name="tc" id="tc" value="">
                <input type="hidden" name="r" id="from" value="%2Fweixin%3Ftype%3D1%26s_from%3Dinput%26query%3D%E4%B8%AD%E5%9B%BD%E5%A8%81%E6%B5%B7%E7%8E%AF%E7%BF%A0%26ie%3Dutf8%26_sug_%3Dn%26_sug_type_%3D" >
                <input type="hidden" name="m" value="0" >            <span class="s1">
                    <script>imgRequestTime=new Date();</script>
                    <a onclick="changeImg2();" href="javascript:void(0)">
                        <img id="seccodeImage" onload="setImgCode(1)" onerror="setImgCode(0)" src="util/seccode.php?tc=1630548594" width="100" height="40" alt="请输入图中的验证码" title="请输入图中的验证码">
                    </a>
                </span>
                <a href="javascript:void(0);" id="change-img" onclick="changeImg2();" style="padding-left:50px;">换一张</a>
                <span class="s2" id="error-tips" style="display: none;"></span>
            </p>
        </form>
        <p class="p5">
            <a href="javascript:void(0);" id="submit">提交</a>
            <span>提交后没解决问题？欢迎<a href="http://fankui.help.sogou.com/index.php/web/web/index?type=10&anti_time=1630548594&domain=weixin.sogou.com&verifycode=5db103e787b0" target="_blank">反馈</a>。</span>
        </p>
    </div>
    <div id="ft"><a href="http://fuwu.sogou.com/" target="_blank">企业推广</a><a href="http://corp.sogou.com/" target="_blank">关于搜狗</a><a href="/docs/terms.htm?v=1" target="_blank">免责声明</a><a href="http://fankui.help.sogou.com/index.php/web/web/index?type=10&anti_time=1630548594&domain=weixin.sogou.com" target="_blank">意见反馈</a><br>&nbsp;&copy;&nbsp;2021<span id="footer-year"></span>&nbsp;Sogou Inc.&nbsp;-&nbsp;<a href="http://www.miibeian.gov.cn" target="_blank" class="g">京ICP证050897号</a>&nbsp;-&nbsp;京公网安备1100<span class="ba">00000025号</span></div>
    <script src="static/js/index.min.js?v=0.1.7"></script>
    </body>
    </html>
`;

const root = $.load(html);

console.log(root('#seccodeImage').src)