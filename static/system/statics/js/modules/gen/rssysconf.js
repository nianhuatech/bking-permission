//加载grid数据
$(function () {
    $("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/rssysconf/list',
        datatype: "json",
        colModel: [			
			{ label: 'ID编号', name: 'id', index: 'ID',align:"center", width: 50, key: true },
			{ label: '工作台编码', name: 'code', index: 'CODE',align:"center", width: 80 }, 			{ label: '工作台名称', name: 'name', index: 'NAME',align:"center", width: 80 }, 			{ label: '创建时间', name: 'createdTime', index: 'CREATED_TIME',align:"center", width: 80 }, 			{ label: '状态', name: 'status', index: 'STATUS',align:"center", width: 80, formatter: function(value, options, row){
				return value != 0 ? 
					'<span class="label label-danger">禁用</span>' : 
					'<span class="label label-success">正常</span>';
			}}, 			{ label: '备注', name: 'remarks', index: 'REMARKS',align:"center", width: 80 }, 			{ label: '最后更新时间', name: 'updTime', index: 'UPD_TIME',align:"center", width: 80 },         ],
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