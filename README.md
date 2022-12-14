<h1 align="center">新冠疫情可视化</h1>
<div style="display: flex;justify-content:center">
<img src="https://github.com/border1px/COVID-19-Visualization/blob/main/__imgs/img1.png?raw=true" style="width:45%;">
<img src="https://github.com/border1px/COVID-19-Visualization/blob/main/__imgs/img2.png?raw=true" style="width:45%;">
</div>
<div style="display: flex;justify-content:center">
<img src="https://github.com/border1px/COVID-19-Visualization/blob/main/__imgs/img3.png?raw=true" style="width:45%;">
<img src="https://github.com/border1px/COVID-19-Visualization/blob/main/__imgs/img4.png?raw=true" style="width:45%;">
</div>

## 背景
​		本项目是针对作者所处的城市（威海）开发的疫情可视化工具，相比头条、百度大厂的疫情地图更加垂直与敏捷。

​		2022年3月7日威海爆发了一次大范围的疫情，封城一个多月，为了能够让大家对疫情走向有直观的了解，特将卫健委发布的信息进行可视化。程序写的很粗糙，开发了几天就赶着上线，没有复杂的功能，代码也不多。


## 功能说明
- 风险地区标注
- 风险轨迹标注
- 用户当前位置标注(1km、3km)
- 每日新增统计报表
- 卫健委每日疫情新闻
- 计算用户与风险区域的距离
- ~~自动爬取数据（开源代码不包含此部分）~~


## 技术说明
开发方式：小程序云开发


## 数据库
在小程序的 `云开发—数据库` 中创建如下几张表，并导入 `__database` 文件夹下对应的数据

- lk-summary 
- lk-risk-areas-list 
- lk-areas
- lk-risk-tracks
- lk-risk-areas

数据库没有使用的内嵌文档的方式设计，结构偏关系型数据库。


## 云函数
将 `cloudfunctions` 下的几个云函数上传并部署到服务器即可：

- news
- risk-areas
- summary

查询通过`聚合`完成多表多条件的关联匹配，代码比较简单，就不赘述了。
