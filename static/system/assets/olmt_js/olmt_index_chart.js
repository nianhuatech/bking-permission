var Container = document.getElementById('map_chart');
//用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
var resizeContainer = function() {
	Container.style.width = window.innerWidth / 3 + 'px';
	Container.style.height = window.innerHeight / 3 + 'px';
};
//设置容器高宽
resizeContainer();

var myChart = echarts.init(Container);

// 指定图表的配置项和数据
var option = {
	title : {
		text : 'ECharts',
		subtext : "纯属虚构",
		sublink : "http://www.baidu.com"
	},
	tooltip : {},
	legend : {
		data : [ '销量' ],
		height : Container.style.height,
		width : Container.style.width
	},
	xAxis : {
		data : [ "衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子" ]
	},
	yAxis : {},
	series : [ {
		name : '销量',
		type : 'bar',
		data : [ 5, 20, 36, 10, 10, 20 ]
	} ]
};
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
//用于使chart自适应高度和宽度
window.onresize = function() {
	//重置容器高宽
	resizeContainer();
	myChart.resize();
};