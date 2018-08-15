var bpmn_datagrid;
var bpmn_dialog;
var model_dialog;
var model_form;
var model_width = 0;

var group_datagrid;

//加载grid数据
$(function () {
	$("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/processMgr/process/listProcess',
        datatype: "json",
        colModel: [ 
            {name : 'id',label : 'ID标识',width : 50,align : 'center', key: true},
            {name : 'name',label : '名称',width : 80,align : 'center'},
            {name : 'key',label : 'key标识',width : 80,align : 'center'},
            {name : 'resourceName',label : 'XML',width : 85,align : 'center',
		    	formatter:function(value,  rowObject){
		    		//debugger
		    		//return "<a id='tip' target='_blank' title='点击查看' href='rest/processMgr/process/processdefinition?processDefinitionId="+rowObject.rowId+"&resourceType=xml'>"+value+"</a>"
		    		return '<a id="tip"  title="点击查看流程XML信息" href="javascript:void(0)" onclick="showXml('+"'"+rowObject.rowId+"'"+')">'+value+'</a>'
		    	},
		    	unformat:function(value,  rowObject){
		    		//debugger
		    		return value;
		    	}
            },
            {name : 'diagramResourceName',label : '图片',width : 85,align : 'center',
		    	formatter:function(value, rowObject){
		    		return '<a id="tip"  title="点击查看图片" href="javascript:void(0)" onclick="showImg('+"'"+rowObject.rowId+"'"+')">'+value+'</a>'
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


//组合流程节点
function outputData( obj ){
	//debugger
	var taskDefKey = obj.taskDefKey;
	var taskType = obj.taskType;
	//普通用户节点
	var modal = 
	'<td>\
		<table style="border: 2px solid;padding: 5px;margin: 5px; width: 280px;" class="well well-small">\
		<tr>\
			<td>名称:</td>\
			<td>'+obj.taskName+'</td>\
		</tr>\
		<tr><td colspan="2" style="height: 10px"></td></tr>\
		<tr>\
			<td>类型:</td>\
			<td>\
				<input type="radio" name="'+taskDefKey+'_taskType" value="assignee" id="assignee" onclick="chooseUser(false,\''+taskDefKey+'\');" />人员\
		        <input type="radio" name="'+taskDefKey+'_taskType" value="candidateUser" id="candidateUser" onclick="chooseUser(true,\''+taskDefKey+'\');" />候选人\
		        <input type="radio" name="'+taskDefKey+'_taskType" value="candidateGroup" id="candidateGroup" onclick="chooseGroup(\''+taskDefKey+'\');" />候选组\
			</td>\
		</tr>\
		<tr><td colspan="2" style="height: 10px"></td></tr>\
		<tr>\
			<td>选择:</td>\
			<td>\
				<input type="text" id="'+taskDefKey+'_name" name="'+taskDefKey+'_name" readonly class="easyui-textbox"/>\
				<a href="#" onclick="clearChoose(\''+taskDefKey+'\');" class="easyui-linkbutton">清空</a>\
				<input type="hidden" id="'+taskDefKey+'_id" name="'+taskDefKey+'_id" class="easyui-textbox"/>\
			</td>\
		</tr>\
		</table>\
	</td>\
	';
	//修改任务的节点已经在配置文件的 initiator 中设置，此处不用选择任务办理人。
	var modify = 
		'<td>\
		<table style="border: 2px solid;padding: 5px;margin: 5px; width: 280px;" class="easyui-propertygrid well well-small">\
		<tr>\
			<td>名称:</td>\
			<td>'+obj.taskName+'</td>\
		</tr>\
		<tr><td colspan="2" style="height: 10px"></td></tr>\
		<tr>\
			<td>类型:</td>\
			<td>\
				任务发起人\
				<input type="hidden" value="modify" name="'+taskDefKey+'_taskType" />\
			</td>\
		</tr>\
		<tr><td colspan="2" style="height: 10px"></td></tr>\
		<tr>\
			<td>选择:</td>\
			<td>\
				<input type="text" id="'+taskDefKey+'_name" value="任务发起人" name="'+taskDefKey+'_name" readonly="readonly" class="easyui-textbox"/>\
				<input type="hidden" id="'+taskDefKey+'_id" value="0" name="'+taskDefKey+'_id" class="easyui-textbox"/>\
			</td>\
		</tr>\
		</table>\
	</td>\
	';
	if(taskDefKey == "modifyApply"){
		$(modify).appendTo($("#modelTable"));
	}else{
		var modal = $(modal).appendTo($("#modelTable"));
		if(taskType == "assignee"){
    		modal.find("table input[id=assignee]").attr("checked","checked");
		}else if(taskType == "candidateUser"){
			modal.find("table input[id=candidateUser]").attr("checked","checked");
		}else if(taskType == "candidateGroup"){
			modal.find("table input[id=candidateGroup]").attr("checked","checked");
		}
		modal.find("table input[id="+taskDefKey+"_name]").attr("value",obj.candidateName);
		modal.find("table input[id="+taskDefKey+"_id]").attr("value",obj.candidateIds);
	}
}
function clearChoose(taskDefKey){
	$("#"+taskDefKey+"_id").val("");
	$("#"+taskDefKey+"_name").val("");
}
function initModelTable( procDefKey ){
	debugger
	layer.open({
		type: 1,
		skin: 'layui-layer-molv',
		title: "流程节点权限设定",
		area: [model_width+'px', '450px'],
		offset: ['50%', '15%'],
		shadeClose: false,
		content: jQuery("#dialogLayer"),
		btn: ['提交','取消'],
		btn1: function (index) {
			$.ajax({
		        type: "POST",
		        url: OLMT_CTX+"/rest/userProcessMgr/setProcessPermission?procDefKey="+procDefKey,
		        data: $('#model_form').serialize(),
		        success: function (r) {
		        	if(r.code == 0){
		                alert(r.msg, function(){
		                	layer.close(index);
		                	$("#modelTable").html("");
		                	model_width=0;
		                });
		            }else{
		                alert(r.msg);
		            }
		        }
		    });
        },
        btn2:function(index){
        	$("#modelTable").html("");
        	model_width=0;
        },
        cancel: function(){
	        //右上角关闭回调
        	$("#modelTable").html("");
        	model_width=0;
	    }
	});
    //显示节点信息
	
}

//候选人变淡初始化
function userFormInit( multiSelect, taskDefKey ) {
    user_form = $('#user_form').form({
        url: ctx+'/userAction/chooseUser_page?flag='+multiSelect+'&key='+taskDefKey,
        onSubmit: function (param) {
            $.messager.progress({
                title: '提示信息！',
                text: '数据处理中，请稍后....'
            });
            var isValid = $(this).form('validate');
            if (!isValid) {
                $.messager.progress('close');
            }
            return isValid;
        },
        success: function (data) {
            $.messager.progress('close');
            var json = $.parseJSON(data);
            if (json.status) {
                user_dialog.dialog('destroy');//销毁对话框
                user_datagrid.datagrid('reload');//重新加载列表数据

            } 
            $.messager.show({
				title : json.title,
				msg : json.message,
				timeout : 1000 * 2
			});
        }
    });
}

//选择人或候选人
function chooseUser( multiSelect, taskDefKey ){
	//弹出对话窗口
	//debugger
	var url =OLMT_CTX+ "/rest/page/userChoose?multiSelect="+multiSelect+"&taskDefKey="+taskDefKey;
	//openVretDialogWin(url,55,55,"用户选择","setRetDataUser");
	layer.open({
	    type: 2,
	    title: "用户选择",
	    shadeClose: true,
	    shade: 0.4,
	    area: ['55%', '55%'],
	    offset: 'rt',
	    content: url,
	    btn: ['确定','关闭'],
	    yes: function(index){
	        //当点击‘确定’按钮的时候，获取弹出层返回的值
	        var ret_value = window["layui-layer-iframe" + index].callRetData();
	        //打印返回的值，看是否有我们想返回的值。
	        //console.log(res);
	        //最后关闭弹出层
	        layer.close(index);
	        //return setRetData(ret_value);
	        eval("setRetDataRoles(ret_value)"); 
	    },
	    cancel: function(){
	        //右上角关闭回调
	    	
	    }
	});
}

function setRetDataUser(data){
	debugger
	alert(data[0].userName);
}

function setRetDataRoles(data){
	debugger
	//alert(data[0].userName);
}

//选择候选组
function chooseGroup( taskDefKey ){
	var url =OLMT_CTX+ "/rest/page/roleChoose?taskDefKey="+taskDefKey;
	//openVretDialogWin(url,55,55,"角色选择","setRetDataRoles");
	layer.open({
	    type: 2,
	    title: "角色选择",
	    shadeClose: true,
	    shade: 0.4,
	    area: ['55%', '55%'],
	    offset: 'rt',
	    content: url,
	    btn: ['确定','关闭'],
	    yes: function(index){
	        //当点击‘确定’按钮的时候，获取弹出层返回的值
	        var ret_value = window["layui-layer-iframe" + index].callRetData();
	        //打印返回的值，看是否有我们想返回的值。
	        //console.log(res);
	        //最后关闭弹出层
	        layer.close(index);
	        //return setRetData(ret_value);
	        eval("setRetDataRoles(ret_value)"); 
	    },
	    cancel: function(){
	        //右上角关闭回调
	    	
	    }
	});
}

//取出候选组的值
function getValue(taskDefKey){
    var ids='';
    var names='';
    var checked = $("input[name=groupIds]:checked");//获取所有被选中的标签元素
    for(i=0;i<checked.length;i++){
     	//将所有被选中的标签元素的值保存成一个字符串，以逗号隔开
   	 	var obj = checked[i].value.split("_");
        if(i<checked.length-1){
           ids+=obj[0]+',';
           names+=obj[1]+',';
        }else{
           ids+=obj[0];
           names+=obj[1];
        }
    }
    $("#"+taskDefKey+"_id").val(ids);
	$("#"+taskDefKey+"_name").val(names); 
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
        initialization:function(type){
        	var keys = getAllRowCols("key");
            if(keys == null){
            	alert("获取所有key字段信息失败");
                return ;
            }
            $.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/userProcessMgr/initUserTask?keys='+keys,
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
        },
        loadBpmn:function(type){
        	var id = getSelectedRow();
            if(id == null){
                return ;
            }
            //debugger
            $.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/userProcessMgr/loadSingleToUserTask?processDefinitionId='+id,
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
        setAuthor:function(type){
        	var rowObj = getSelectedRowObj();
            if(rowObj == null){
                return ;
            }
            $.ajax({
    			type: "POST", 
    			url: OLMT_CTX+'/rest/userProcessMgr/listUserTask',
    			data: {procDefKey: rowObj.key},
    			success: function (data) {
    				if(data.length == 0){
    					alert('请先【加载】所选流程定义文件，再设定审批人员！');
    					return;
    				}else{
    					debugger
    					for(var i=0;i<data.length;i++) {  
    						//逐个显示审批人员
    						outputData(data[i]);
    						model_width += 300;	//每个节点的宽度
    					}
    					//显示model
    					initModelTable(rowObj.key);
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