//加载grid数据
$(function () {
    $("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/rsscheduletasklog/list',
        datatype: "json",
        colModel: [			
			{ label: 'ID主键', name: 'id', index: 'ID',align:"center", width: 50, key: true },
			{ label: '任务ID', name: 'taskId', index: 'TASK_ID',align:"center", width: 80 }, 			{ label: '实体Bean名称', name: 'beanName', index: 'BEAN_NAME',align:"center", width: 80 }, 			{ label: '方法名', name: 'methodName', index: 'METHOD_NAME',align:"center", width: 80 }, 			{ label: '参数', name: 'params', index: 'PARAMS',align:"center", width: 80 }, 			{ label: '执行状态', name: 'status', index: 'STATUS',align:"center", width: 80, formatter: function(value, options, row){
				return value != 0 ? 
						'<span class="label label-danger pointer" onclick="vm.showError('+row.id+')">失败</span>': 
					'<span class="label label-success">成功</span>';
			}}, 			{ label: '创建时间', name: 'createdTime', index: 'CREATED_TIME',align:"center", width: 80 }, 			{ label: '失败信息', name: 'error', index: 'ERROR',align:"center", width: 80 }, 			{ label: '执行时间', name: 'times', index: 'TIMES',align:"center", width: 80 },         ],
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

//初始化select控件数据
$(document).ready(function () {
	setSelectData("rs.code.task.excu.staus","status");
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

//设置日期控件datetimepicker
$(document).ready(function () {
	//datetimepicker
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
		var startTime = $("#createdTime_start").val();
		start = startTime;
		if (start > end) {
			alert("“开始时间 ”不能晚于“结束时间 ” ！");
			$("#createdTime_start").focus();
			$(".datetimepicker_end").datetimepicker("setStartDate",$("#createdTime_start").val());
			$("#createdTime_start").val($("#createdTime_end").val());
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
		var endTime = $("#createdTime_end").val();
		end = endTime;
		if (end < start) {
			alert("“结束时间 ”不能早于“开始时间 ” ！");
			$(".datetimepicker_start").datetimepicker("setEndDate",$("#createdTime_end").val());
			$("#createdTime_end").focus();
			$("#createdTime_end").val($("#createdTime_start").val());
		} else {
		}
	});
	//下面的代码直接限定选择时间
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
});

//查询参数获取
function getQueryPara(){
	var  para = {};
	if(document.getElementById("beanName").value != ''
		&& document.getElementById("beanName").value != undefined){
		para.beanName=document.getElementById("beanName").value;	
	}
	if(document.getElementById("methodName").value != ''
		&& document.getElementById("methodName").value != undefined){
		para.methodName=document.getElementById("methodName").value;	
	}
	if(document.getElementById("status").value != ''
		&& document.getElementById("status").value != undefined){
		para.status=document.getElementById("status").value;	
	}
	if(document.getElementById("createdTime_start").value != ''
		&& document.getElementById("createdTime_start").value != undefined){
		para.q_date_start=document.getElementById("createdTime_start").value;	
	}
	if(document.getElementById("createdTime_end").value != ''
		&& document.getElementById("createdTime_end").value != undefined){
		para.q_date_end=document.getElementById("createdTime_end").value;	
	}
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
	el:'#olmtapp',
	data:{
		showList: true,
		title: null,
		rsScheduleTaskLog: {}
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
        	IframePost.doPost({ Url: OLMT_CTX+"/rest/rsscheduletasklog/export", Target: "_export_frame", PostParams: {type:type,jgCols:names,showNames:showNames,para:JSON.stringify(para)} });
        },
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.rsScheduleTaskLog = {};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.rsScheduleTaskLog.id == null ? "rsscheduletasklog/save" : "rsscheduletasklog/update";
			$.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/'+ url,
			    contentType: "application/json",
			    data: JSON.stringify(vm.rsScheduleTaskLog),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: OLMT_CTX+"/rest/rsscheduletasklog/delete",
				    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get(OLMT_CTX+"/rest/rsscheduletasklog/info/"+id, function(r){
                vm.rsScheduleTaskLog = r.rsScheduleTaskLog;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:getQueryPara(),
                page:page
            }).trigger("reloadGrid");
		},
		showError: function(logId) {
			$.get(OLMT_CTX+"/rest/rsscheduletasklog/info/"+logId, function(r){
				parent.layer.open({
				  title:'失败信息',
				  closeBtn:0,
				  content: r.rsScheduleTaskLog.error
				});
			});
		},
		back: function (event) {
			//history.go(-1);
			//history.back();
			$("#mainpage").load("rest/page/Mods/gen/rsscheduletask", function() {
				//alert( "Load dashboard." );
			});
		}
	}
});