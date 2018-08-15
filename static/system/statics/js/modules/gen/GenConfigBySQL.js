$(function () {
	$("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/rssyssqlreport/list',
        datatype: "json",
        colModel: [			
			{ label: 'ID主键', name: 'id', index: 'ID',align:"center", width: 50, key: true },
			{ label: '报表编码', name: 'code', index: 'CODE',align:"center", width: 80 }, 	
			{ label: '报表名称', name: 'name', index: 'NAME',align:"center", width: 80 }, 	
			{ label: '状态', name: 'status', index: 'STATUS',align:"center", width: 80, formatter: function(value, options, row){
				return value != 0 ? 
					'<span class="label label-danger">禁用</span>' : 
					'<span class="label label-success">正常</span>';
			}}, 			{ label: '创建时间', name: 'createdTime', index: 'CREATED_TIME',align:"center", width: 80 }, 	
			{ label: '创建人', name: 'createdBy', index: 'CREATED_BY',align:"center", width: 80 }, 		
			{ label: '最近修改人', name: 'updBy', index: 'UPD_BY',align:"center", width: 80 }, 		
			{ label: '最后更新时间', name: 'updTime', index: 'UPD_TIME',align:"center", width: 80 }, 		
			{ label: '备注', name: 'remarks', index: 'REMARKS',align:"center", width: 80 }        ],
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
var setting = {
	    data: {
	        simpleData: {
	            enable: true,
	            idKey: "id",
	            pIdKey: "pid",
	            rootPId: -1
	        },
	        key: {
	            url:"nourl"
	        }
	    }
	};
	var ztree;
var vm = new Vue({
	el:'#olmtapp',
	data:{
		q:{
			reportName: null
		},
		showList: true,
		title: null,
		rsSysSqlReport: {
			pName:null,
            pid:0,
            type:1,
            orderNum:0
        }
	},
	methods: {
		query: function () {
			$("#jqGrid").jqGrid('setGridParam',{ 
                postData:{'reportName': vm.q.reportName},
                page:1 
            }).trigger("reloadGrid");
		},
		toGeneratorConfig: function() {
			//var tableNames = getSelectedRows();
			//if(tableNames == null){
				//return ;
			//}
			vm.showList = false;
			vm.title = "根据SQL配置前台报表";
			$("#report_code").attr("readonly",false);
			oldSql="";
			vm.rsSysSqlReport = {pName:null,pid:0,type:1,orderNum:0};
            vm.getMenu();
		},
		exportGrid:function(){
        	var g_paras=$("#jqGrid").jqGrid("getGridParam","colModel");
        	var names = getJqTitles(g_paras);
        	var showNames = getJqLable(g_paras);
        	var para = getQueryOara();
        	$("body:eq(0)").append('<iframe id="_export_frame" style="display:none" width="500px" src="about:blank"></iframe>');
        	IframePost.doPost({ Url: OLMT_CTX+"/rest/rssyssqlreport/export", Target: "_export_frame", PostParams: {type:type,jgCols:names,showNames:showNames,para:JSON.stringify(para)} });
        },
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "报表字段修改";
            $("#report_code").attr("readonly",true);
            oldSql = "";
            vm.getInfo(id);
            vm.getMenu();
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: OLMT_CTX+"/rest/rssyssqlreport/delete",
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
			$.get(OLMT_CTX+"/rest/rssyssqlreport/info/"+id, function(r){
				//debugger
                vm.rsSysSqlReport = r.rsSysSqlReport;
                oldSql = r.rsSysSqlReport.sqlcontent;
				var cols = r.rsSysSqlReport.columns;
				loadEditData(cols);
            });
		},
		getMenu: function(menuId){
            //加载菜单树
        	//debugger
            $.get(OLMT_CTX+'/rest/rssysmenu/select', function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.menuList);
                debugger
                var node = ztree.getNodeByParam("id", vm.rsSysSqlReport.pid);
                ztree.selectNode(node);

                vm.rsSysSqlReport.pName = node.name;
            });
        },
		menuTree: function(){
			var node = ztree.getNodeByParam("id", vm.rsSysSqlReport.pid);
            ztree.selectNode(node);
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择菜单",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.rsSysSqlReport.pid = node[0].id;
                    vm.rsSysSqlReport.pName = node[0].name;

                    layer.close(index);
                }
            });
        },
		reload: function (event) {
			//debugger
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});
var mynewtable = null;
var oldSql = "";
var isLoadCols = false;
function loadEditData(cols){
	debugger
	var dataList = new Array();
	for(var i = 0; i < cols.length; i++){
		var obj = cols[i];
		var values = [];
		if(obj.tileShow == '1'){
			values.push(true);
		}else{
			values.push(false);
		}
		values.push(obj.searchShow);
		values.push(obj.code);
		values.push(obj.name);
		values.push(obj.seq);
		values.push(obj.htmlType);
		values.push(obj.htmlDataSrc);
		
		dataList.push(values);
	}
	if(mynewtable != null && mynewtable != undefined){
		mynewtable.loadData(dataList);
		//先屏蔽掉,行增减
		mynewtable.disabledAddbtn();
	}
}

/**
 * 获得sql的字段信息，根据原有字段配置判断是否有增删改字段
 * */
function getSQLClsForEdit(sql,code){
	debugger
	if(mynewtable != null && mynewtable != undefined){
		$.ajax({
			type: "POST",
		    url: OLMT_CTX+'/rest/sys/generator/getSQLClsByCode',
		    
		    data: {
		    	sql:sql,
		    	code:code
		    },
    		success: function(r){
		    	if(r.code === 0){
		    		isLoadCols = true;
	    			mynewtable.loadJsonData(r.list);
	    			//先屏蔽掉,行增减
	    			//mynewtable.disabledAddbtn();
				}else{
					alert(r.msg);
				}
			}
		});
	}
}

/**
 * 获得sql的字段信息，用于配置界面元素
 * */
function getSQLCls(sql){
	if(mynewtable != null && mynewtable != undefined){
		//var _this = $(obj),text = $(obj).text();
    	//$(this).text('Loading...');
    	$.ajax({
			type: "POST",
		    url: OLMT_CTX+'/rest/sys/generator/getSQLCls',
		    contentType: "application/json",
		    data: sql,
    		success: function(r){
		    	if(r.code === 0){
	    			mynewtable.loadJsonData(r.list);
				}else{
					alert(r.msg);
				}
			}
		});
	}
}
$(window).ready(function () {
	
	/**
	 * 有表头，无校验
	 * */
	$("#edittable2").editTable({
		data: [
			["01/01/2013","01/30/2013","50,00 €"],
			["02/01/2013","02/28/2013","50,00 €"]
		],
		headerCols: [
			'From',
			'To',
			'Price'
		],
		maxRows: 3
	});
	$("#edittable2").on("focusin", "td:nth-child(1) input, td:nth-child(2) input", function(){
	    $(this).datepicker();
	});
	
	/**
	 * 有表头，有检验
	 * */
	
	mynewtable = $('#edittable3').editTable({
	    field_templates: {
	        'checkbox' : {
	            html: '<input type="checkbox"/>',
	            getValue: function (input) {
	                return $(input).is(':checked');
	            },
	            setValue: function (input, value) {
	                if ( value ){
	                    return $(input).attr('checked', true);
	                }
	                return $(input).removeAttr('checked');
	            }
	        },
	        'textarea' : {
	            html: '<textarea/>',
	            getValue: function (input) {
	                return $(input).val();
	            },
	            setValue: function (input, value) {
	                return $(input).text(value);
	            }
	        },
	        'select' : {
	            html: '<select>'
	            	+'<option value="1">text</option>'
	            	+'<option value="2">select</option>'
	            	+'<option value="3">checkbox</option>'
	            	+'<option value="4">radio</option>'
	            	+'<option value="5">textarea</option>'
	            	+'<option value="6">date</option>'
	            	+'<option value="7">password</option>'
	            	+'<option value="8">image</option>'
	            	+'</select>',
	            getValue: function (input) {
	                return $(input).val();
	            },
	            setValue: function (input, value) {
	                var select = $(input);
	                select.find('option').filter(function() {
	                    return $(this).val() == value; 
	                }).attr('selected', true);
	                return select;
	            }
	        },
	        'select_search' : {
	            html: '<select>'
	            	+'<option value="1">是</option>'
	            	+'<option value="2">否</option>'
	            	+'</select>',
	            getValue: function (input) {
	                return $(input).val();
	            },
	            setValue: function (input, value) {
	                var select = $(input);
	                select.find('option').filter(function() {
	                    return $(this).val() == value; 
	                }).attr('selected', true);
	                return select;
	            }
	        }
	    },
	    row_template: ['checkbox','select_search','text', 'text','text', 'select','text'],
	    headerCols: ['是否表头','是否查询条件','字段编码','界面报表表头名称','界面报表表头顺序','界面查询元素类型', '界面元素数据源编码'],
	    first_row: false,
	    data: [
	        /*[false,"01/30/2013","50,00 €","Lorem ipsum...\n\nDonec in dui nisl. Nam ac libero eget magna iaculis faucibus eu non arcu. Proin sed diam ut nisl scelerisque fermentum."],
	        [true,"02/28/2013","50,00 €",'This is a <textarea>','All']*/
	    ],

	    // Checkbox validation
	    validate_field: function (col_id, value, col_type, $element) {
	        if ( col_type === 'checkbox' ) {
	            $element.parent('td').animate({'background-color':'#fff'});
	            if ( value === false ){
	                $element.parent('td').animate({'background-color':'#DB4A39'});
	                return false;
	            }
	        }
	        return true;
	    },
	    tableClass: 'inputtable custom'
	});

	// 根据配置去后台生成代码
	$('.toGenerator').click(function(e) {
	    // 获得数据，后台按既定顺序取值，必须确保顺序不能乱
		var tData=mynewtable.getData();
	    //console.log(tData);
	    //直接下载代码
	    //var para = "report_code="+vm.rsSysSqlReport.code+"&report_name="+vm.rsSysSqlReport.name+
	    //"&report_remarks="+vm.rsSysSqlReport.remarks+"&sqlcontent="+vm.rsSysSqlReport.sqlcontent;
	    //location.href = OLMT_CTX+"/rest/sys/generator/generatorReportByConfig?tData=" + JSON.stringify(tData)+"&table="+generator_table;
		//var url =  == null ? "rssyssqlreport/save" : "rssyssqlreport/update";
		if(vm.rsSysSqlReport.id != null){
			if(!isLoadCols && oldSql.toLowerCase() != vm.rsSysSqlReport.sqlcontent.toLowerCase()){
				alert('报表查询sql已经修改，请先加载解析SQL字段配置');
				return;
			}
			$.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/rssyssqlreport/update',
			    data: {
			    	report_id:vm.rsSysSqlReport.id,
			    	report_code:vm.rsSysSqlReport.code,
	    			report_name:vm.rsSysSqlReport.name,
	    			report_remarks:vm.rsSysSqlReport.remarks,
	    			sqlcontent:vm.rsSysSqlReport.sqlcontent,
	    			pMenuName:vm.rsSysSqlReport.pName,
	    			pMenuId:vm.rsSysSqlReport.pid,
	    			tData: JSON.stringify(tData)
			    },
			    success: function(r){
			    	debugger
			    	if(r.code == 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		}else if(vm.rsSysSqlReport.id == null){
			$.ajax({
	    		url: OLMT_CTX+"/rest/sys/generator/generatorReportByConfig",
	    		type: 	'POST',
	    		data: 	{
	    			report_code:vm.rsSysSqlReport.code,
	    			report_name:vm.rsSysSqlReport.name,
	    			report_remarks:vm.rsSysSqlReport.remarks,
	    			sqlcontent:vm.rsSysSqlReport.sqlcontent,
	    			pMenuName:vm.rsSysSqlReport.pName,
	    			pMenuId:vm.rsSysSqlReport.pid,
	    			tData: JSON.stringify(tData)
	    		},
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
		}
	});
	$('.getGeneratorConfig').click(function(e) {
		if(vm.rsSysSqlReport.id != null){
			if(vm.rsSysSqlReport.name == undefined || vm.rsSysSqlReport.name == ''){
				alert('报表名称不能为空！');
				return;
			}
			if(vm.rsSysSqlReport.sqlcontent == undefined || vm.rsSysSqlReport.sqlcontent == ''){
				alert('报表查询sql不能为空！');
				return;
			}
			getSQLClsForEdit(vm.rsSysSqlReport.sqlcontent,vm.rsSysSqlReport.code);
		}else{
			if(vm.rsSysSqlReport.code == undefined || vm.rsSysSqlReport.code == ''){
				alert('报表编码不能为空！');
				return;
			}
			if(vm.rsSysSqlReport.name == undefined || vm.rsSysSqlReport.name == ''){
				alert('报表名称不能为空！');
				return;
			}
			if(vm.rsSysSqlReport.sqlcontent == undefined || vm.rsSysSqlReport.sqlcontent == ''){
				alert('报表查询sql不能为空！');
				return;
			}
			getSQLCls(vm.rsSysSqlReport.sqlcontent);
		}
	});
	
    $('.loadjson').click(function () {
    	var _this = $(this),text = $(this).text();
    	$(this).text('Loading...');
    	$.ajax({
    		url: 	'test.html',
    		type: 	'POST',
    		data: 	{
    			ajax: true
    		},
    		complete: function (result) {
    			_this.text(text);
    			mynewtable.loadJsonData(result.responseText);
    		}
    	});
    	return false;
    });
    
    // Reset table data
    $('.reset').click(function () {
    	mynewtable.reset();
    	return false;
    });
    //屏蔽遮罩层
	/*$('.showcode').click(function () {
		$($(this).attr('href')).slideToggle(300);
		return false;
	});*/
	
});
