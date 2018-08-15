//加载grid数据
$(function () {
    $("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/rsscheduletask/list',
        datatype: "json",
        colModel: [			
			{ label: '任务ID', name: 'id', index: 'ID',align:"center", width: 50, key: true },
			{ label: '实体Bean名称', name: 'beanName', index: 'BEAN_NAME',align:"center", width: 80 }, 
			{ label: '方法名', name: 'methodName', index: 'METHOD_NAME',align:"center", width: 80 }, 
			{ label: '参数', name: 'params', index: 'PARAMS',align:"center", width: 80 }, 
			{ label: 'cron表达式（执行时间）', name: 'cronExp', index: 'CRON_EXP',align:"center", width: 80 }, 
			{ label: '任务状态', name: 'status', index: 'STATUS',align:"center", width: 80, formatter: function(value, options, row){
				return value != 0 ? 
					'<span class="label label-danger">暂停中</span>' : 
					'<span class="label label-success">运行中</span>';
			}}, 			{ label: '是否处理结果', name: 'resultHandle', index: 'RESULT_HANDLE',align:"center", width: 80 , formatter: function(value, options, row){
				return value != 0 ? 
						'<span class="label label-danger">不处理返回结果</span>' : 
						'<span class="label label-success">需处理返回结果</span>';
				}}, 
			{ label: '结果处理方法', name: 'handleMethodName', index: 'HANDLE_METHOD_NAME',align:"center", width: 80 }, 
			{ label: '结果处理cron表达式', name: 'handleCronExp', index: 'HANDLE_CRON_EXP',align:"center", width: 80 }, 		
			{ label: '备注', name: 'remarks', index: 'REMARKS',align:"center", width: 80 },  
		],
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
	setSelectData("rs.code.status","status");
	setSelectData("rs.code.task.result.handle","resultHandle");
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
	el:'#taskapp',
	data:{
		showList: true,
		title: null,
		rsScheduleTask: {}
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
        	IframePost.doPost({ Url: OLMT_CTX+"/rest/rsscheduletask/export", Target: "_export_frame", PostParams: {type:type,jgCols:names,showNames:showNames,para:JSON.stringify(para)} });
        },
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.rsScheduleTask = {};
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
			var url = vm.rsScheduleTask.id == null ? "rsscheduletask/save" : "rsscheduletask/update";
			$.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/'+ url,
			    contentType: "application/json",
			    data: JSON.stringify(vm.rsScheduleTask),
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
				    url: OLMT_CTX+"/rest/rsscheduletask/delete",
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
			$.get(OLMT_CTX+"/rest/rsscheduletask/info/"+id, function(r){
                vm.rsScheduleTask = r.rsScheduleTask;
            });
		},
		pause: function (event) {
			var jobIds = getSelectedRows();
			if(jobIds == null){
				return ;
			}
			
			confirm('确定要暂停选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: OLMT_CTX+'/rest/rsscheduletask/pause',
                    contentType: "application/json",
				    data: JSON.stringify(jobIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		resume: function (event) {
			var jobIds = getSelectedRows();
			if(jobIds == null){
				return ;
			}
			
			confirm('确定要恢复选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: OLMT_CTX+'/rest/rsscheduletask/resume',
                    contentType: "application/json",
				    data: JSON.stringify(jobIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		runOnce: function (event) {
			var jobIds = getSelectedRows();
			if(jobIds == null){
				return ;
			}
			
			confirm('确定要立即执行选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: OLMT_CTX+'/rest/rsscheduletask/run',
                    contentType: "application/json",
				    data: JSON.stringify(jobIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
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
		gotoLog:function(event){
			//window.parent.frames.location.href="rest/page/Mods/gen/rsscheduletasklog";
			$("#mainpage").load("rest/page/Mods/gen/rsscheduletasklog", function() {
				//alert( "Load dashboard." );
			});
		}
	}
});