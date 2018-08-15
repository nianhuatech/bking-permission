//加载grid数据
$(function () {
    $("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/sys/generator/queryDataByCode?reportCode='+reportObj.code,
        datatype: "json",
        colModel: getColModel(),
		viewrecords: true,
        height: $(window).height()-300,
        rowNum: 10,
		rowList : [20,50,100],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});
function getColModel(){
	debugger
	var cols = [];
	for(var i = 0;i < columnsObj.length;i++){
		/*if(columnsObj[i].tileShow == "1"){
			var  para = {};
			para.label=columnsObj[i].name;
			para.name=columnsObj[i].code;
			para.index=columnsObj[i].code;
			para.align="center";
			para.width='50';
			cols.push(para);
		}*/
		if(columnsObj[i].tileShow == "1"){
			if(columnsObj[i].code.indexOf("Time") > 0
				||columnsObj[i].code.indexOf("TIME") > 0
				||columnsObj[i].code.indexOf("time") > 0
				||columnsObj[i].code.indexOf("DATE") > 0
				||columnsObj[i].code.indexOf("date") > 0
				||columnsObj[i].code.indexOf("Date") > 0
			){
				cols.push({
					label:columnsObj[i].name,
					name:columnsObj[i].code,
					index:columnsObj[i].code,
					align:"center",
					width:'50',
					formatter:dateFmatter
				});
			}else{
				cols.push({
					label:columnsObj[i].name,
					name:columnsObj[i].code,
					index:columnsObj[i].code,
					align:"center",
					width:'50'
				});
			}
		}
		
	}
	debugger
	return cols;
}
function dateFmatter (cellvalue, options, rowObject){
	debugger
	return moment(cellvalue).format("YYYY-MM-DD HH:mm:ss");
}
//初始化查询条件元素
$(document).ready(function () {
	if(columnsObj != undefined && columnsObj.length > 0){
		var flag = 0;
		var k = 0;
		debugger
		for(var i = 0;i < columnsObj.length;i++){
			
			//查询条件-text类型
			if(columnsObj[i].searchShow == '1' && columnsObj[i].htmlType == '1'){
				flag = 1;
				if(k < 3){
					$("#search-1").append(createText(columnsObj[i].code,columnsObj[i].name));
					k++;
				}else{
					$("#adv-search-div").append(createText(columnsObj[i].code,columnsObj[i].name));
					k++;
				}
				
			}
			//select
			else if(columnsObj[i].searchShow == '1' 
				&& (columnsObj[i].htmlType == '2' || columnsObj[i].htmlType == '3' || columnsObj[i].htmlType == '4')){
				flag = 1;
				if(k < 3){
					$("#search-1").append(createSelect(columnsObj[i].code,columnsObj[i].name));
					setSelectData(columnsObj[i].htmlDataSrc,columnsObj[i].code);
					//$("#search-1").append(createText(columnsObj[i].code,columnsObj[i].name));
					k++;
				}else{
					$("#adv-search-div").append(createSelect(columnsObj[i].code,columnsObj[i].name));
					setSelectData(columnsObj[i].htmlDataSrc,columnsObj[i].code);
					//$("#adv-search-div").append(createText(columnsObj[i].code,columnsObj[i].name));
					k++;
				}
				
			}
			//textarea
			else if(columnsObj[i].searchShow == '1' && columnsObj[i].htmlType == '5'){
				flag = 1;
			}
			//date
			else if(columnsObj[i].searchShow == '1' && columnsObj[i].htmlType == '6'){
				flag = 1;
				if(k < 3){
					$("#search-1").append(createDate(columnsObj[i].code,columnsObj[i].name));
					setDatetimepicker(columnsObj[i].code);
					//$("#search-1").append(createText(columnsObj[i].code,columnsObj[i].name));
					k++;
				}else{
					$("#adv-search-div").append(createDate(columnsObj[i].code,columnsObj[i].name));
					setDatetimepicker(columnsObj[i].code);
					//$("#adv-search-div").append(createText(columnsObj[i].code,columnsObj[i].name));
					k++;
				}
			}
		}
		if(flag == 1){
			$("#search_div").css("display","");
			//$(".panel-body").append(createSearchBtn());
		}
	}
});

/**
 * 创建text元素
 * */
function createText(code,name){
	var text ='<!--text 文本类型-->'
	+'<div class="form-group">'+name+':'
	+'<input type="text" class="form-control" style="5px 2px 2px 2px;" name="'+code+'" id="'+code+'" @keyup.enter="query" placeholder="'+name+'">'
	+'</div>';
	
	return text;
}

function createSelect(code,name){
	var select ='<!--select 下拉类型-->'
	+'<div class="form-group">'+name+':'
	+'		 <select class="selectpicker form-control status" data-live-search="true" name="'+code+'"  id="'+code+'"></span>'
	+'		 </select>'
	+'</div>';
	
	return select;
}

function createDate(code,name){
	var date='<!--date 日期类型-->'
		+'<div class="form-group" style="padding: 5px 2px 2px 2px;">'+name+': '  
		+' <div class="input-group date datetimepicker_start" id="datetimepicker1"> ' 
		+'      <input type="text" class="form-control" id="'+code+'_start" readonly="readonly"/> ' 
		+'       <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>'
		+'		<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span> '
		+'   </div>'
		+'   	至  '
		+'   <div class="input-group date datetimepicker_end" id="datetimepicker2">'  
		+'      <input type="text" class="form-control" id="'+code+'_end" readonly="readonly"/>  '
		+'       <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>'
		+'		<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>'
		+'  </div>'
		+'</div>';
	return date;
}

function createSearchBtn(){
	var btn ='<a class="btn btn-default fi-magnifying-glass icon-green" style="float: right;" @click="query">查询</a>';
	return btn;
}

//初始化select控件数据
$(document).ready(function () {
	setSelectData("rs.code.status","status");
	setSelectData("rs.code.conf.data.clazz","clazz");
	setSelectData("rs.code.conf.exmode","executeMode");
});

function setSelectData(code,objId){  
	$.ajax({
		type: "POST",
        url: OLMT_CTX+'/rest/sys/generator/getSelectData',
        contentType: "application/json",
        data: code,  
	    success : function(r) {    
	    	var data = r.list;  
	    	var opts = "";  
	    	opts += "<option value=''>----------请选择----------</option>";
	    	for( var index = 0 ; index < data.length; index++ ){  
	    		var d = data[index];  
	    		//alert("<option value='"+d.KEY+"'>"+d.VALUE+"</option>");
	    		opts += "<option value='"+d.KEY+"'>"+d.VALUE+"</option>";  
	    	}
	    	// 查询界面  
	    	$("."+objId).append(opts);    
	    	//$("#addid").selectpicker("refresh");
	  }    
	});    
}

//设置日期控件
function setDatetimepicker(code){
	//datepicker
	$(".datetimepicker").datetimepicker({
        language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: true
    });
    var start = null;
	var end = null;
	$('.datetimepicker_start').datetimepicker({
		language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: true
	}).on('changeDate', function(ev) {
		var startTime = $("#"+code+"_start").val();
		start = startTime;
		if (start > end) {
			alert("“开始时间 ”不能晚于“结束时间 ” ！");
			$("#"+code+"_start").focus();
			$(".datetimepicker_end").datetimepicker("setStartDate",$("#"+code+"_start").val());
			$("#"+code+"_start").val($("#"+code+"_end").val());
		}
	});
	$('.datetimepicker_end').datetimepicker({
		language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: 0
	}).on('changeDate', function(ev) {
		var endTime = $("#"+code+"_end").val();
		end = endTime;
		if (end < start) {
			alert("“结束时间 ”不能早于“开始时间 ” ！");
			$(".datetimepicker_start").datetimepicker("setEndDate",$("#"+code+"_end").val());
			$("#"+code+"_end").focus();
			$("#"+code+"_end").val($("#"+code+"_start").val());
		} else {
		}
	});
	
	/*$(".datetimepicker_start").datetimepicker({
		language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: true
    }).on("click",function(){
        $(".datetimepicker_start").datetimepicker("setEndDate",$(".datetimepicker_end").val());
    });
    $(".datetimepicker_end").datetimepicker({
    	language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: true,
        startDate:new Date()
    }).on("click",function(){
        $(".datetimepicker_end").datetimepicker("setStartDate",$(".datetimepicker_start").val());
    });*/
}

//查询参数获取
function getQueryPara(){
	debugger
	var  para = {};
	para.reportCode=reportObj.code;
	if(columnsObj != undefined && columnsObj.length > 0){
		for(var i = 0;i < columnsObj.length;i++){
			if(columnsObj[i].searchShow == '1' && columnsObj[i].htmlType == '1'){
				if(document.getElementById(columnsObj[i].code).value != ''
					&& document.getElementById(columnsObj[i].code).value != undefined){
					para[columnsObj[i].code]=document.getElementById(columnsObj[i].code).value;
				}
			}
			//select
			else if(columnsObj[i].searchShow == '1' 
				&& (columnsObj[i].htmlType == '2' || columnsObj[i].htmlType == '3' || columnsObj[i].htmlType == '4')){
				if(document.getElementById(columnsObj[i].code).value != ''
					&& document.getElementById(columnsObj[i].code).value != undefined){
					para[columnsObj[i].code]=document.getElementById(columnsObj[i].code).value;	
				}
			}
			//textarea
			else if(columnsObj[i].searchShow == '1' && columnsObj[i].htmlType == '5'){
			}
			//date
			else if(columnsObj[i].searchShow == '1' && columnsObj[i].htmlType == '6'){
				if(document.getElementById(columnsObj[i].code+"_start").value != ''
					&& document.getElementById(columnsObj[i].code+"_start").value != undefined){
					para[columnsObj[i].code+"_start"]=document.getElementById(columnsObj[i].code+"_start").value;	
				}
				if(document.getElementById(columnsObj[i].code+"_end").value != ''
					&& document.getElementById(columnsObj[i].code+"_end").value != undefined){
					para[columnsObj[i].code+"_end"]=document.getElementById(columnsObj[i].code+"_end").value;	
				}
			}
		}
	}
	/*if(document.getElementById("code").value != ''
		&& document.getElementById("code").value != undefined){
		para.code=document.getElementById("code").value;	
	}
	if(document.getElementById("name").value != ''
		&& document.getElementById("name").value != undefined){
		para.name=document.getElementById("name").value;	
	}
	if(document.getElementById("createdTime_start").value != ''
		&& document.getElementById("createdTime_start").value != undefined){
		para.q_date_start=document.getElementById("createdTime_start").value;	
	}
	if(document.getElementById("createdTime_end").value != ''
		&& document.getElementById("createdTime_end").value != undefined){
		para.q_date_end=document.getElementById("createdTime_end").value;	
	}
	if(document.getElementById("status").value != ''
		&& document.getElementById("status").value != undefined){
		para.status=document.getElementById("status").value;	
	}*/
	return para;
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

var vm = new Vue({
	el:'#omltapp',
	data:{
		showList: true,
		title: null,
		rsSysConf: {}
	},
	methods: {
		query: function () {
			var postData = $('#jqGrid').jqGrid("getGridParam", "postData");  
            $.each(postData, function (k, v) {  
                delete postData[k];  
            });  
        	$("#jqGrid").jqGrid('setGridParam',{ 
                postData:getQueryPara(),
                page:1 
            }).trigger("reloadGrid");
        },
        exportGrid:function(type){
        	var g_paras=$("#jqGrid").jqGrid("getGridParam","colModel");
        	var names = getJqTitles(g_paras);
        	var showNames = getJqLable(g_paras);
        	var para = getQueryPara();
        	$("body:eq(0)").append('<iframe id="_export_frame" style="display:none" width="500px" src="about:blank"></iframe>');
        	IframePost.doPost({ Url: OLMT_CTX+"/rest/sys/generator/commonDataExport", Target: "_export_frame", PostParams: {type:type,jgCols:names,showNames:showNames,para:JSON.stringify(para)} });
        },
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:getQueryPara(),
                page:page
            }).trigger("reloadGrid");
		}
	}
});