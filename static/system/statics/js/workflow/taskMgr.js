
//加载grid数据
$(function () {
	var action = "";
	if(showType == 'toDone'){
		action = OLMT_CTX+'/rest/processMgr/todoTask?showType='+showType;
		showToDoTask(action);
	}else if(showType == 'todayNew'){
		action = OLMT_CTX+'/rest/processMgr/todoTask?showType='+showType;
		showToDoTask(action);
	}else if(showType == 'finished'){
		action = OLMT_CTX+'/rest/processMgr/endTask?showType='+showType;
		showEndTask(action);
	}else if(showType == 'todayFinished'){
		action = OLMT_CTX+'/rest/processMgr/endTask?showType='+showType;
		showEndTask(action);
	}else {
		action = OLMT_CTX+'/rest/processMgr/todoTask?showType='+showType;
		showToDoTask(action);
	}
    
});

function showEndTask(action){
	$(".btn").css("display","none");
	$("#jqGrid").jqGrid({
        url: action,
        datatype: "json",
        colModel:[ 
            {name : 'businessType',label : '单据类型',width : 80,align : 'center',
            	formatter:function(value, options, row){
            		if(value == "vacation"){
            			return "请假申请";
            		}else if(value == "salary"){
            			return "薪资调整";
            		}else if(value == "expense"){
            			return "报销申请";
            		}
				}
            },
            {name : 'user_name',label : '申请人',width : 80,align : 'center'},                
            {name : 'title',label : '标题',width : 80,align : 'center'},
            {name : 'startTime',label : '任务开始时间',width : 80,align : 'center',
				formatter:function(value, options, row){
					return moment(value).format("YYYY-MM-DD HH:mm:ss");
				}
            },
            {name : 'claimTime',label : '任务签收时间',width : 80,align : 'center',
            	formatter:function(value, options, row){
            		if(value != null){
            			return moment(value).format("YYYY-MM-DD HH:mm:ss");
            		}else{
            			return "无需签收"
            		}
            	}
            },
            {name : 'endTime',label : '任务结束时间',width : 80,align : 'center',
            	formatter:function(value, options, row){
            		return moment(value).format("YYYY-MM-DD HH:mm:ss");
            	}
            },
            {name : 'deleteReason',label : '流程结束原因',width : 80,align : 'center',
            	formatter:function(value, options, row){
            		/** The reason why this task was deleted {'completed' | 'deleted' | any other user defined string }. */
            		return value;
            	}
            },
            {name : 'version',label : '流程版本号',width : 80,align : 'center'},
            {name : 'revoke',label : '操作',width : 80,align : 'center',
            	formatter:function(value, options, row){
            		return "<a href='javascript:void(0);' onclick=\"revoke('"+row.taskId+"','"+row.processInstanceId+"')\">撤销</a>";
            	}
            }
            
        ],
		viewrecords: true,
		height: $(window).height()-135,
        width:$(window).width()-150,
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
}

function showToDoTask(action){
	$("#jqGrid").jqGrid({
        url: action,
        datatype: "json",
        colModel:[ 
		        {name : 'taskId',label : '任务ID',width :  80,align : 'center'}
		        ,
				{name : 'assign',label : '任务状态',width :  80,align : 'center',
					formatter:function(value,  rowObject){
						if(value == null){
							return "待签收";
						}else{
							return "待办理";  
						}
					},
			    	unformat:function(value,  rowObject){
			    		//debugger
			    		return value;
			    	}
				},
                {name : 'businessType',label : '单据类型',width : 80,align : 'center',
                	formatter:function(value,  rowObject){
                		if(value == "vacation"){
                			return "请假申请";
                		}else if(value == "salary"){
                			return "薪资调整";
                		}else if(value == "expense"){
                			return "报销申请";
                		}
					},
			    	unformat:function(value,  rowObject){
			    		//debugger
			    		return value;
			    	}
                },
                {name : 'user_name',label : '申请人',width : 80,align : 'center'},                
                {name : 'title',label : '标题',width : 80,align : 'center'},
                {name : 'processInstanceId',label : '流程实例ID',width : 80,align : 'center'},
                {name : 'taskName',label : '当前节点',width : 80,align : 'center',
                	formatter:function(value,  rowObject,row){
                		debugger
                		return "<a class='trace' onclick=\"graphTrace('"+row.processInstanceId+"')\" id='diagram' href='javascript:void(0)' pid='"+row.id+"' pdid='"+row.processDefinitionId+"' title='see'>"+value+"</a>";
                	},
    		    	unformat:function(value,  rowObject){
    		    		//debugger
    		    		return value;
    		    	}
                },
                {name : 'owner',label : '负责人',width : 80,align : 'center',
                	formatter:function(value,  rowObject,row){
                		if(value != null && value != row.assign){
                			return row.assign+" (原执行人："+value+")";
                		}else{
                			return row.assign;
                		}
					},
			    	unformat:function(value,  rowObject){
			    		//debugger
			    		return value;
			    	}
                },  
                {name : 'createTime',label : '任务创建时间',width : 80,align : 'center',
					formatter:function(value,  rowObject,row){
						return moment(value).format("YYYY-MM-DD HH:mm:ss");
					},
			    	unformat:function(value,  rowObject){
			    		//debugger
			    		return value;
			    	}
                },
                {name : 'suspended',label : '流程状态',width : 80,align : 'center',
                	formatter:function(value,  rowObject){
                		if(value){
                			return "已挂起";
                		}else{
                			return "正常";  
                		}
                	},
    		    	unformat:function(value,  rowObject){
    		    		//debugger
    		    		return value;
    		    	}
                },{name : 'taskDefinitionKey',label : '处理类型',width : 80,align : 'center'
                	
                }
            ]
        	,
		viewrecords: true,
		height: $(window).height()-135,
        width:$(window).width()-150,
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
}

//初始化select控件数据
$(document).ready(function () {
	debugger
	setSelectData("rs.code.leave.type.query","leave_type");
	setSelectData("rs.code.leave.type.query","leave_type2");
});

function setSelectData(code,objId){  
	$.ajax({
		type: "POST",
        url: OLMT_CTX+'/rest/sys/generator/getSelectData',
        contentType: "application/json",
        data: code,  
	    success : function(r) {  
	    	debugger
	    	var data = r.list;  
	    	var opts = "";  
	    	opts += "<option value=''>----------请选择----------</option>";
	    	for( var index = 0 ; index < data.length; index++ ){  
	    		var d = data[index];  
	    		//alert("<option value='"+d.KEY+"'>"+d.VALUE+"</option>");
	    		opts += "<option value='"+d.KEY+"'>"+d.VALUE+"</option>";  
	    	}
	    	// 查询界面  
	    	$("#"+objId).append(opts);    
	    	//$("#addid").selectpicker("refresh");
	  }    
	});    
}

//设置日期控件
$(document).ready(function () {
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
	debugger
	var  para = {};
	if(document.getElementById("code").value != ''
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
	}
	return para;
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
        	$("#jqGrid").jqGrid('setGridParam',{ 
                postData:getQueryPara(),
                page:1 
            }).trigger("reloadGrid");
        },
        exportGrid:function(){
        	//alert(vm.q.userName);
        	var paras=$("#jqGrid").jqGrid("getGridParam");
        	//paras = paras.substring(paras.indexOf("?"));
    		//paras = encodeURI(paras);
        	//alert(paras);
        },
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.rsSysConf = {};
		},
		handleTask: function (event) {
			var row = getSelectedRowObj();
			debugger
		    if (row) {
		    	if(row.assign == null){
		    		alert("此任务您还没有签收，请【签收】任务后再处理任务！");
		    	}else{
		    		var _url;
		    		if("请假申请" == row.businessType){
		    			_url = OLMT_CTX+'/rest/processCommon/toApprovalLeaven/'+row.taskId;
		    			$.ajax({
		    				type: "POST",
		    			    url: _url,
		    			    data: {},
		    			    success: function(r){
		    			    	if(r.code === 0){
		    						var data = r.list;
		    						debugger
		    						var comments = data[1];
		    						var vacation = data[0];
		    						$("#vacationId").val(vacation.id);
		    						$('#leave_remarks').val(vacation.reason);
		    						$("#createdTime_start").val(vacation.startDate);
		    						$("#createdTime_end").val(vacation.endDate);
		    						$("#leave_days").val(vacation.leavenDays);
		    						$("#leave_type").val(vacation.vacType);
		    						if(comments != undefined && comments.length > 0){
		    							$("#noneComment").css('display','none');
		    							$("#asComment").css('display','');
		    							$("#asComment tbody").html('');
		    							for(var i= 0 ;i < comments.length;i++){
		    								var comment = '<tr>'
		    									+'<td>'+comments[i].userName+'</td>'
		    									+'<td>'+moment(comments[i].time).format("YYYY-MM-DD HH:mm:ss")+'</td>'
		    									+'<td>'+comments[i].content+'</td>'
		    									+'</tr>';
		    								$("#asComment tbody").append(comment);
		    							}
		    						}
		    						$("#vacationId2").val(vacation.id);
		    						$('#leave_remarks2').val(vacation.reason);
		    						$("#createdTime_start2").val(vacation.startDate);
		    						$("#createdTime_end2").val(vacation.endDate);
		    						$("#leave_days2").val(vacation.leavenDays);
		    						$("#leave_type2").val(vacation.vacType);
		    						if(comments != undefined && comments.length > 0){
		    							$("#noneComment2").css('display','none');
		    							$("#asComment2").css('display','');
		    							$("#asComment2 tbody").html('');
		    							for(var i= 0 ;i < comments.length;i++){
		    								var comment = '<tr>'
		    									+'<td>'+comments[i].userName+'</td>'
		    									+'<td>'+moment(comments[i].time).format("YYYY-MM-DD HH:mm:ss")+'</td>'
		    									+'<td>'+comments[i].content+'</td>'
		    									+'</tr>';
		    								$("#asComment2 tbody").append(comment);
		    							}
		    						}
		    						if(row.taskDefinitionKey.indexOf("modify") != -1){
		    							layer.open({
			    			        	   	type: 1,
			    			        	    title: "任务信息",
			    			        	    shadeClose: true,
			    			        	    shade: 0.4,
			    			        	    offset:'t',
			    			        	    area: ['55%', '90%'],
			    			        	    content: jQuery("#modifyLayer"),
			    			        	    btn: ['重新申请','取消申请','关闭'],
			    			        	    yes: function(index){
			    			        	    	$("#reApply").val("true");
			    			        	    	$("#processInstanceId").val(row.processInstanceId);
			    			        	    	//approvalFormInit( row.taskDefinitionKey, row.businessType, row.taskId );
			    			        	    	
			    			        	    	$.ajax({
			    			        	    		type: "POST",
			    			        	    	    url: OLMT_CTX+'/rest/processCommon/modifyLeave/'+row.taskId,
			    			        	    	    data: {vacationId:$('#vacationId2').val(),
			    			        	    	    	processInstanceId:$('#processInstanceId').val(),
			    			        	    	    	reApply:$('#reApply').val()
			    			        	    	    },
			    			        	    	    success: function(r){
			    			        	    			if(r.code == 0){
			    			        	    				alert(r.msg, function(index){
			    			        	    					$("#jqGrid").trigger("reloadGrid");
			    			        	    				});
			    			        	    				layer.close(index);
			    			        	    			}else{
			    			        	    				alert(r.msg);
			    			        	    			}
			    			        	    		}
			    			        	    	});
			    			        	    	
			    			        	    },
			    			        	    btn2: function(index){
			    			        	    	$("#reApply").val("false");
			    			        	    	$("#processInstanceId").val(row.processInstanceId);
			    			        	    	//approvalFormInit( row.taskDefinitionKey, row.businessType, row.taskId );
			    			        	    	$.ajax({
			    			        	    		type: "POST",
			    			        	    	    url: OLMT_CTX+'/rest/processCommon/modifyLeave/'+row.taskId,
			    			        	    	    data: {vacationId:$('#vacationId2').val(),
			    			        	    	    	processInstanceId:$('#processInstanceId').val(),
			    			        	    	    	reApply:$('#reApply').val()
			    			        	    	    },
			    			        	    	    success: function(r){
			    			        	    			if(r.code == 0){
			    			        	    				alert(r.msg, function(index){
			    			        	    					$("#jqGrid").trigger("reloadGrid");
			    			        	    				});
			    			        	    				layer.close(index);
			    			        	    			}else{
			    			        	    				alert(r.msg);
			    			        	    			}
			    			        	    		}
			    			        	    	});
			    			        	    },
			    			        	    btn3: function(index){
			    			        	    },
			    			        	    success:function(layero,index){
			    			        	    	setDatetimepicker("createdTime");
			    			        	    },
			    			        	    cancel: function(){
			    			        	        //右上角关闭回调
			    			        	    }	    
			    				       });
		    			    		}else{
		    			    			layer.open({
			    			        	   	type: 1,
			    			        	    title: "任务信息",
			    			        	    shadeClose: true,
			    			        	    shade: 0.4,
			    			        	    offset:'t',
			    			        	    area: ['55%', '90%'],
			    			        	    content: jQuery("#addLayer"),
			    			        	    btn: ['通过','不通过','关闭'],
			    			        	    yes: function(index){
			    			        	    	$("#completeFlag").val("true");
			    			        	    	approvalFormInit( row.taskDefinitionKey, row.businessType, row.taskId );
			    			        	    	layer.close(index);
			    			        	    },
			    			        	    btn2: function(index){
			    			        	    	$("#completeFlag").val("false");
			    			        	    	approvalFormInit( row.taskDefinitionKey, row.businessType, row.taskId );
			    			        	    	layer.close(index);
			    			        	    },
			    			        	    btn3: function(index){
			    			        	    	//alert('关闭');
			    			        	    },
			    			        	    success:function(layero,index){
			    			        	    	setDatetimepicker("createdTime");
			    			        	    	//setSelectData("rs.code.leave.type.query","leave_type");
			    			        	    },
			    			        	    cancel: function(){
			    			        	        //右上角关闭回调
			    			        	    }	    
			    				       });
		    			    		}
		    					}else{
		    						alert(r.msg);
		    					}
		    				}
		    			});
		    		}else if("salary" == row.businessType){
		    			_url = ctx + "/salaryAction/toApproval/"+row.taskId;
		    		}else if("expense" == row.businessType){
		    			_url = ctx + "/expenseAction/toApproval/"+row.taskId;
		    		}
		    		
		    	}
		    }
		},
		saveOrUpdate: function (event) {
			var url = vm.rsSysConf.id == null ? "rssysconf/save" : "rssysconf/update";
			$.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/'+ url,
			    contentType: "application/json",
			    data: JSON.stringify(vm.rsSysConf),
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
				    url: OLMT_CTX+"/rest/rssysconf/delete",
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
			$.get(OLMT_CTX+"/rest/rssysconf/info/"+id, function(r){
                vm.rsSysConf = r.rsSysConf;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});

//设置日期控件
function setDatetimepicker(code){
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
		debugger
		var startTime = $("."+code+"_start").val();
		start = startTime;
		if (start > end) {
			alert("“开始时间 ”不能晚于“结束时间 ” ！");
			$("."+code+"_start").focus();
			$(".datetimepicker_end").datetimepicker("setStartDate",$("."+code+"_start").val());
			$("."+code+"_start").val($("."+code+"_end").val());
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
			$(".datetimepicker_start").datetimepicker("setEndDate",$("."+code+"_end").val());
			$("."+code+"_end").focus();
			$("."+code+"_end").val($("."+code+"_start").val());
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

//初始化审批表单
function approvalFormInit( taskDefinitionKey, businessType, taskId ) {
	debugger
	var _url;
	if("请假申请" == businessType){
		//正常审批
		_url = OLMT_CTX+'/rest/processCommon/complateLeave/'+taskId;
		if("modifyApply" == taskDefinitionKey){
			//申请人修改申请
			_url = OLMT_CTX+'/rest/processCommon/modifyLeave/'+taskId;
			
		}
	}else if("salary" == businessType){
		//正常审批
		_url = ctx+'/salaryAction/complate/'+taskId;
		if("modifyApply" == taskDefinitionKey){
			//申请人修改申请
			_url = ctx+'/salaryAction/modifySalary/'+taskId;
		}
	}else if("expense" == businessType){
		//正常审批
		_url = ctx+'/expenseAction/complate/'+taskId;
	}
	
	$.ajax({
		type: "POST",
	    url: _url,
	    data: {vacationId:$('#vacationId').val(),
	    	content:$('#leave_comment').val(),
	    	completeFlag:$('#completeFlag').val()
	    },
	    success: function(r){
			if(r.code == 0){
				alert(r.msg, function(index){
					$("#jqGrid").trigger("reloadGrid");
				});
			}else{
				alert(r.msg);
			}
		}
	});
	
}