//加载grid数据
$(function () {
	$("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/processMgr/process/listProcess',
        datatype: "json",
        colModel: [ 
            {name : 'id',label : '定义Id标识',width : 50,align : 'center', key: true},
            {name : 'deploymentId',label : '部署Id标识',width : 50,align : 'center'},
            {name : 'name',label : '名称',width : 80,align : 'center'},
            {name : 'key',label : 'key标识',width : 80,align : 'center'},
		    {name : 'version',label : '版本号',width : 20,align : 'center'},
            {name : 'resourceName',label : 'XML',width : 85,align : 'center',
		    	formatter:function(value,  rowObject){
		    		//debugger
		    		return '<a id="tip"  title="点击查看流程XML信息" href="javascript:void(0)" onclick="showXml('+"'"+rowObject.rowId+"'"+')">'+value+'</a>'
		    		//return "<a id='tip' target='_blank' title='点击查看' href='rest/processMgr/process/processdefinition?processDefinitionId="+rowObject.rowId+"&resourceType=xml'>"+value+"</a>"
		    	},
		    	unformat:function(value,  rowObject){
		    		//debugger
		    		return value;
		    	}
            },
            {name : 'diagramResourceName',label : '图片',width : 85,align : 'center',
		    	formatter:function(value, rowObject){
		    		//return "<a id='tip' target='_blank' title='点击查看' href='rest/processMgr/process/processdefinition?processDefinitionId="+rowObject.rowId+"&resourceType=image'>"+value+"</a>"
		    		return '<a id="tip"  title="点击查看图片" href="javascript:void(0)" onclick="showImg('+"'"+rowObject.rowId+"'"+')">'+value+'</a>'
		    	},
		    	unformat:function(value,  rowObject){
		    		//debugger
		    		return value;
		    	}
            },
            {name : 'deploymentTime',label : '部署时间',width : 80,align : 'center',
            	formatter:function(value, row){
            		return moment(value).format("YYYY-MM-DD HH:mm:ss");
            	},
		    	unformat:function(value,  rowObject){
		    		//debugger
		    		return value;
		    	}
            },
            {name : 'suspended',label : '是否挂起',width : 45,align : 'center',
	          	formatter:function(value, row){
	        		if(value){
	        			return "<a href='javascript:void(0);' onclick=\"suspended('active','"+row.id+"')\">激活</a>";
	        		}else{
	        			return "<a href='javascript:void(0);' onclick=\"suspended('suspend','"+row.id+"')\">挂起</a>";  
	        		}
				},
		    	unformat:function(value,  rowObject){
		    		//debugger
		    		return value;
		    	}
            }
        ],
		viewrecords: true,
        height: $(window).height()-135,
        width:$(window).width()-150,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 35, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        //toolbar:[true,"top"],
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
	    	$("#"+objId).append(opts);    
	    	//$("#addid").selectpicker("refresh");
	  }    
	});    
}
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

function showXml(rowId){
	//var url = OLMT_CTX+ '/rest/processMgr/process/processdefinition?processDefinitionId='+rowId+'&resourceType=xml';
	openScreenWindow('rest/processMgr/process/processdefinition?processDefinitionId='+rowId+'&resourceType=xml', $(window).width()-300, $(window).height()-300)
	/*layer.open({
	    type: 2,
	    title: "流程XML信息查看",
	    shadeClose: true,
	    shade: 0.4,
	    area: ['85%', '85%'],
	    content: url,
	    btn: ['确定','关闭'],
	    yes: function(index){
	        //最后关闭弹出层
	        layer.close(index);
	    },
	    cancel: function(){
	        //右上角关闭回调
	    }
	});*/
}
function showImg(rowId){
	debugger
	var url = OLMT_CTX+ '/rest/processMgr/process/processdefinition?processDefinitionId='+rowId+'&resourceType=image';
	layer.open({
	    type: 2,
	    title: "流程图片查看",
	    shadeClose: true,
	    shade: 0.4,
	    area: ['55%', '75%'],
	    content: url,
	    btn: ['关闭'],
	    yes: function(index){
	       
	        //最后关闭弹出层
	        layer.close(index);
	       
	    },
	    cancel: function(){
	        //右上角关闭回调
	    }
	});
}

//查询参数获取
function getQueryPara(){
	
	return {};
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
        add:function(type){
        	layer.open({
        	    type: 1,
        	    title: "新建请假申请",
        	    shadeClose: true,
        	    shade: 0.4,
        	    area: ['55%', '75%'],
        	    offset: 't',
        	    content: jQuery("#addLayer"),
        	    btn: ['提交','取消'],
        	    yes: function(index){
        	    	$.ajax({
        		        type: "POST",
        		        url: OLMT_CTX+"/rest/processCommon/saveLeaven",
        		        data: $('#myform').serialize(),
        		        success: function (r) {
        		        	debugger
        		        	if(r.code == 0){
        		                alert(r.msg, function(){
        		                	layer.close(index);
        		                });
        		            }else{
        		                alert(r.msg);
        		            }
        		        }
        		    });
        	    },
        	    success:function(layero,index){
        	    	setDatetimepicker("createdTime");
        	    	debugger
        	    	$("#createdTime_end").val("");
        	    	$("#createdTime_start").val("");
        	    	$('#leave_days').val("");
        	    	$('#leave_type').val("");
        	    	$('#leave_remarks').val("");
        	    },
        	    cancel: function(){
        	        //右上角关闭回调
        	    }
        	});
        },
        convert:function(type){
        	var id = getSelectedRow();
            if(id == null){
                return ;
            }
            debugger
            $.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/processMgr/convert_to_model?processDefinitionId='+id,
                data: {
                },
                success: function(r){
                    if(r.code == 0){
                        alert(r.msg, function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
			});
        },
        del:function(type){
        	var rowObj = getSelectedRowObj();
            if(rowObj == null){
                return ;
            }
            confirm('您确定要删除选中流程信息? 此操作同时也会删除与此流程相关的所有审批数据！', function(){
            		confirm('再次确认！, 请再次确认您的选择，此操作很重要!', function(){
            			
            				$.ajax({
                                type: "POST",
                                url: OLMT_CTX+'/rest/processMgr/process/del?deploymentId='+rowObj.deploymentId,
                                data: {},
                                success: function(r){
                                    if(r.code == 0){
                                        alert(r.msg, function(){
                                            vm.reload();
                                        });
                                    }else{
                                        alert(r.msg);
                                    }
                                }
                            });
                	});
            });
        },
        deploy:function(type){
        	$("#deployFieldset").toggle("normal");
        },
        deployAll:function(type){
        	 $.ajax({
 				type: "POST",
 			    url: OLMT_CTX+'/rest/processMgr/redeploy/all',
                 data: {
                 },
                 success: function(r){
                     if(r.code == 0){
                         alert(r.msg, function(){
                             vm.reload();
                         });
                     }else{
                         alert(r.msg);
                     }
                 }
 			});
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