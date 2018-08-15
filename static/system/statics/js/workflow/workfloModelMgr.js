//加载grid数据
$(function () {
	$("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/workFolwModelAction/listModel',
        datatype: "json",
        colModel: [ 
            {name : 'id',label : 'ID编号',width: 50,align:"center", key: true},
            {name : 'key',label : 'KEY标识',width : 50,align : 'center'},
            {name : 'name', label : '名称', width : 80, align : 'center'},
            {name : 'version', label : '版本', width : 20, align : 'center'},
            {name : 'createTime',label : '创建时间',width : 80,align : 'center', 
          	  formatter:function(value,row){
          		  return moment(value).format("YYYY-MM-DD HH:mm:ss");
          	  }
            },
            {name : 'lastUpdateTime',label : '最后更新时间',width : 80,align : 'center',
          	  formatter:function(value,row){
          		  return moment(value).format("YYYY-MM-DD HH:mm:ss");
          	  }
            },
            {name : 'metaInfo', label : '元数据', width : 180, align : 'center'}
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
function getColModel(){
	var cols = [];
	for(var i = 0;i < columnsObj.length;i++){
		if(columnsObj[i].tileShow == "1"){
			var  para = {};
			para.label=columnsObj[i].name;
			para.name=columnsObj[i].code;
			para.index=columnsObj[i].code;
			para.align="center";
			para.width='50';
			cols.push(para);
		}
	}
	return cols;
}

//初始化查询条件元素
$(document).ready(function () {
	
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

$(function() {
    var progressbar = $( "#progressbar" );
    var progressLabel = $( ".progress-label" );
 
    progressbar.progressbar({
      value: false,
      change: function() {
        progressLabel.text( progressbar.progressbar( "value" ) + "%" );
      },
      complete: function() {
        progressLabel.text( "完成！" );
      }
    });
 
    function progress() {
      var val = progressbar.progressbar( "value" ) || 0;
 
      progressbar.progressbar( "value", val + 1 );
 
      if ( val < 99 ) {
        setTimeout( progress, 100 );
      }
    }
 
    //setTimeout( progress, 3000 );
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
		actModels: {},
		name:'',
		key:'',
		remarks:''
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
        exportModel:function(event){
        	var id = getSelectedRow();
            if(id == null){
                return ;
            }
            window.location.href=OLMT_CTX+'/rest/workFolwModelAction/export/'+id;
            //window.open(OLMT_CTX+'/rest/workFolwModelAction/export/'+id);
        },
        add:function(event){
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "新建模型",
				area: ['550px', '350px'],
				shadeClose: false,
				content: jQuery("#addLayer"),
				btn: ['确定','取消'],
				btn1: function (index) {
					debugger
					var data = "name="+vm.name+"&key="+vm.key+"&remarks="+vm.remarks;
					//window.location.href=OLMT_CTX+'/rest/workFolwModelAction/create?name='+vm.name+'&key='+vm.key+'&remarks='+vm.remarks;
					window.open(OLMT_CTX+'/rest/workFolwModelAction/create?name='+vm.name+'&key='+vm.key+'&remarks='+vm.remarks);
	            }
			});
        },
        update: function () {
            var id = getSelectedRow();
            if(id == null){
                return ;
            }
            //window.location.href=OLMT_CTX+'/rest/workFolwModelAction/edit?id='+id;
            window.open(OLMT_CTX+'/rest/workFolwModelAction/edit?id='+id);
        },
        del: function () {
            var id = getSelectedRow();
            if(id == null){
                return ;
            }
            $.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/workFolwModelAction/del',
			    contentType: "application/json",
                data: id,
                success: function(r){
                    if(r.code == 0){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
			});
        },
        deploy: function () {
            var id = getSelectedRow();
            if(id == null){
                return ;
            }
            debugger
            $.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/workFolwModelAction/deploy/'+id,
			    contentType: "application/json",
                data: {},
                success: function(r){
                    if(r.code == 0){
                        alert(r.msg, function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                },
                beforeSend:function(){
                	debugger
                	$("#progressbar").attr("display","");
        		},
        		complete: function(){
        			debugger
        			$("#progressbar").attr("display","none");
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