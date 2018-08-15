//加载grid数据
$(function () {
	$("#jqGrid_finished").jqGrid({
		url: OLMT_CTX+'/rest/processMgr/process/finishedProcess',
        datatype: "json",
        colModel: [ 
            {name : 'businessType',title : '单据类型',width : 80, align : 'center',
            	formatter:function(value, row, rowIndex){
            		if(value == 'vacation'){
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
            {name : 'startTime',label : '流程启动时间',width : 80,align : 'center',
            	formatter:function(value, row){
            		return moment(value).format("YYYY-MM-DD HH:mm:ss");
            	}
            },
            {name : 'endTime',label : '流程结束时间',width : 80,align : 'center',
            	formatter:function(value, row){
            		return moment(value).format("YYYY-MM-DD HH:mm:ss");
            	}
            },
            {name : 'deleteReason',label : '流程结束原因',width : 80,align : 'center'},
            {name : 'version',label : '流程版本',width : 80,align : 'center'}
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
        pager: "#jqGridPager_finished",
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
        	$("#jqGrid_finished").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
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