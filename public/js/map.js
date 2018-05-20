// 百度地图API功能
var map = new BMap.Map("allmap");    // 创建Map实例
var lng = "116.396428";
var lat = "40.007001";
var point = new BMap.Point(lng, lat);
map.centerAndZoom(point, 15);  // 初始化地图,设置中心点坐标和地图级别
map.centerAndZoom(point, 15);
map.addControl(new BMap.NavigationControl());
map.addControl(new BMap.ScaleControl());
map.addControl(new BMap.OverviewMapControl());
var marker = new BMap.Marker(point);
map.addOverlay(marker);
