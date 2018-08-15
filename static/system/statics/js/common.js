//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

var baseURL = "";

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost:8080/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

//全局配置
$.ajaxSetup({
	dataType: "json",
	cache: false
});

//重写alert
window.alert = function(msg, callback){
	parent.layer.alert(msg, function(index){
		parent.layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

/**
 * 重写confirm式样框
 * */
window.confirm = function(msg, callback){
	parent.layer.confirm(msg, {btn: ['确定','取消']},
	function(){//确定事件
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}


/**
 * 选择一条记录
 * */
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    
    return selectedIDs[0];
}

/**
 * 返回一行的数据
 * */
function getSelectedRowObj() {
	//debugger
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    var rowData = grid.jqGrid('getRowData',rowKey);

    return rowData;
}

/**
 * 返回所有选择行的数据
 * */
function getSelectedRowsObjs() {
	//debugger
    var grid = $("#jqGrid");
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length < 1){
    	alert("请至少选择一条记录");
    	return ;
    }
    var rets = [];
    for(var i=0;i<selectedIDs.length;i++){
    	var rowData = grid.jqGrid('getRowData',selectedIDs[i]);
    	rets.push(rowData);
    }
    

    return rets;
}

/**
 * 选择多条记录
 * */
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    return grid.getGridParam("selarrrow");
}

/**
 * 返回所有行的key(id)数据
 * */
function getAllRowIds() {
    var grid = $("#jqGrid");
	var ids = grid.jqGrid('getDataIDs');
    return ids;
}

/**
 * 返回所有行的某一字段数据集合，字段名称从外部传入
 * */
function getAllRowCols(name) {
	debugger
	var ret = [];
    var grid = $("#jqGrid");
    var ids = grid.jqGrid('getDataIDs');
    var len = ids.length;
    if(ids != undefined && len > 0){
    	for(var i=0; i<len; i++){
            var getRow = grid.getRowData(ids[i]);//获取当前的数据行 
            var colVal = getRow[name];
            ret.push(colVal);
       }
    }
    return ret;
}

function getJqLable(objs){
	var ret = "";
	for(var i=0;i<objs.length;i++){
		var obj = objs[i];
		if(obj.label != undefined){
			if(ret == ""){
				ret +=obj.name;
			}else{
				ret +="|"+obj.name;
			}
			
		}
	}
	return ret;
}

function getJqTitles(objs){
	var ret = "";
	for(var i=0;i<objs.length;i++){
		var obj = objs[i];
		if(obj.label != undefined){
			if(ret == ""){
				ret +=obj.label;
			}else{
				ret +="|"+obj.label;
			}
			
		}
	}
	return ret;
}

//判断是否为空
function isBlank(value) {
    return !value || !/\S/.test(value)
}