/**
 * 首页各模块初始化，首页要定时刷新
 * 100秒刷新一次
 */
$(function() {
	setInterval(function(){
		//设备实时运行情况
		initDevCurrRunInfo();
		//设备实时预警
		initDevCurrWarnInfo();
		//设备实时完好率
		initDevCurrIntactInfo();
		//实时机房环控
		initEngineRoomInfo();
		//设备实时故障top榜
		initDevCurrErrorTopInfo();
		//设备实时故障
		initDevCurrError();
		
		/**
		 * 	draw_allresdev_runinfo();
			draw_health_currval();
			draw_dev_res();
			draw_room_Info();
			drwMyRecord();
			drwAlar_Curr();
		 * */
	},1000 * 100);
});

function initDevCurrRunInfo(){
	var result = null;
	var arr_date = new Array();
	var total = 0;
	// 获得设备情况
	var a = getJsonListFromCodeSync("aibsm.code.allResdevRunInfo", function(data) {
		debugger
		for (var z = 0; data != null && z < data.length; z++) {
			var _obj = {
				value : data[z].COUNT,
				name : data[z].VALUE
			}
			total += data[z].COUNT;
			arr_date.push(_obj);
		}
	});
	var echar = echarts.init(document.getElementById("devRunInfo"));
	option = {
		    title : {
		        subtext: '设备总数：' + total,
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    color:['red', 'green','yellow','blueviolet'],
		    series : [
		        {
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:arr_date,
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                },
		                normal:{ 
		                    label:{ 
		                      show: true, 
		                        formatter: '{b} : {c} ({d}%)'  
		                     }, 
		                    labelLine :{show:true} 
		                  }
		            }
		        }
		    ]
		};
	echar.setOption(option);
}