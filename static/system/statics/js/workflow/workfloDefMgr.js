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
            	formatter:function(value, rowObject){
            		return moment(value).format("YYYY-MM-DD HH:mm:ss");
            	},
		    	unformat:function(value,  rowObject){
		    		//debugger
		    		return value;
		    	}
            },
            {name : 'suspended',label : '是否挂起',width : 45,align : 'center',
            	formatter:function(value, rowObject){
	        		if(value){
	        			return "<a href='javascript:void(0);' onclick=\"suspended('active','"+rowObject.rowId+"')\">激活</a>";
	        		}else{
	        			return "<a href='javascript:void(0);' onclick=\"suspended('suspend','"+rowObject.rowId+"')\">挂起</a>";  
	        		}
				},
		    	unformat:function(value,  rowObject){
		    		//debugger
		    		return value;
		    	}
            }
        ],
		viewrecords: true,
        height: $(window).height()-350,
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

//挂起、激活
function suspended( status, id ){
	var url_ = OLMT_CTX+'/rest/processMgr/process/updateProcessStatusByProInstanceId/active/'+id;
	if(status == "suspend"){
		url_ = OLMT_CTX+'/rest/processMgr/process/updateProcessStatusByProInstanceId/suspend/'+id;
	}
	$.ajax({
		type: "POST",
		url: url_,
		data: {},
		success: function (r) {
			if(r.code == 0){
                alert(r.msg, function(){
                	layer.close(index);
                });
            }else{
                alert(r.msg);
            }
		}
	});
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
        redeploy:function(type){
        	var rowObj = getSelectedRowObj();
            if(rowObj == null){
                return ;
            }
            debugger
            $.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/processMgr/redeploy/single?resourceName='+rowObj.resourceName+"&deploymentId="+rowObj.deploymentId+'&diagramResourceName='+rowObj.diagramResourceName,
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