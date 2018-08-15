//加载grid数据
$(function () {
	$("#jqGrid_runing").jqGrid({
        url: OLMT_CTX+'/rest/processMgr/process/runningProcess',
        datatype: "json",
        colModel: [ 
        		{name : 'id',label : '执行ID',width : 50,align : 'center', key: true},
                {name : 'processInstanceId',label : '流程实例ID',width : 120,align : 'center'},
                {name : 'processDefinitionId',label : '流程定义ID',width : 120,align : 'center'},
                {name : 'activityId',label : 'activityId',width : 80,align : 'center'},
                {name : 'taskName',label : '当前节点',width : 80,align : 'center',
                	formatter:function(value,  rowObject){
                		return "<a class='trace' onclick=\"graphTrace('"+rowObject.rowId+"')\" id='diagram' href='#' pid='"+rowObject.rowId+"' pdid='"+rowObject.rowId+"' title='see'>"+value+"</a>";
					}
                },
                {name : 'suspended',label : '挂起/激活',width : 80,align : 'center',
                	formatter:function(value,  rowObject){
		        		if(value){
		        			return "<a href='javascript:void(0);' onclick=\"suspended('active','"+rowObject.rowId+"')\">激活</a>";
		        		}else{
		        			return "<a href='javascript:void(0);' onclick=\"suspended('suspend','"+rowObject.rowId+"')\">挂起</a>";  
		        		}
					}
                }
           
        ],
		viewrecords: true,
        height: $(window).height()-350,
        width:$(window).width()-160,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 35, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager_runing",
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
        	$("#jqGrid_runing").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
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
                	$("#jqGrid_runing").jqGrid("setGridParam", { postData: getQueryPara() }).trigger("reloadGrid");;
                	layer.close(index);
                });
            }else{
                alert(r.msg);
            }
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