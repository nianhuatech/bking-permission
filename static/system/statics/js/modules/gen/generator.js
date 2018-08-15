$(function () {
    $("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/sys/generator/list',
        datatype: "json",
        colModel: [			
			{ label: '表名', name: 'TABLENAME', width: 100, key: true ,align : 'center'},
			{ label: 'Engine', name: 'ENGINE', width: 70,align : 'center'},
			{ label: '表备注', name: 'TABLECOMMENT', width: 100 ,align : 'center'},
			{ label: '创建时间', name: 'CREATETIME', width: 100 ,align : 'center', 
	          	  formatter:function(value,row){
	          		  return moment(value).format("YYYY-MM-DD HH:mm:ss");
	          	  }
			}
        ],
		viewrecords: true,
        height: $(window).height()-300,
        rowNum: 20,
		rowList : [20,30,50,100,200],
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

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			tableName: null
		},
		showList: true,
		title: null
	},
	methods: {
		query: function () {
			$("#jqGrid").jqGrid('setGridParam',{ 
                postData:{'tableName': vm.q.tableName},
                page:1 
            }).trigger("reloadGrid");
		},
		generatorNoConfig: function() {
			var tableNames = getSelectedRows();
			if(tableNames == null){
				return ;
			}
			location.href = OLMT_CTX+"/rest/sys/generator/code?tables=" + JSON.stringify(tableNames);
			
		},
		generatorByConfig:function(){
			debugger
			var tableName = getSelectedRow();
			if(tableName == null){
				return ;
			}
			vm.showList = false;
			vm.title = "生成代码配置";
			getTableCls(this,tableName);
		},
		saveOrUpdate: function (event) {
			//var url = vm.rsSysLog.id == null ? "rssyslog/save" : "rssyslog/update";
			/*$.ajax({
				type: "POST",
			    url: OLMT_CTX+'/rest/'+ url,
			    contentType: "application/json",
			    data: JSON.stringify(vm.rsSysLog),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});*/
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
var mynewtable = null;
var generator_table="";
function getTableCls(obj,tablename){
	generator_table = tablename;
	if(mynewtable != null && mynewtable != undefined){
		var _this = $(obj),text = $(obj).text();
    	$(this).text('Loading...');
    	$.ajax({
			type: "POST",
		    url: OLMT_CTX+'/rest/sys/generator/getTableCls',
		    contentType: "application/json",
		    data: tablename,
    		/*complete: function (r) {
    			debugger
    			_this.text(text);
    			mynewtable.loadJsonData(r.list);
    		},*/
    		success: function(r){
    			//alert(1);
    			debugger
		    	if(r.code === 0){
		    		_this.text(text);
	    			mynewtable.loadJsonData(r.list);
				}else{
					alert(r.msg);
				}
			}
		});
    	//return false;
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
	    row_template: ['checkbox','checkbox','select_search', 'text', 'text','text', 'text','text', 'select','text'],
	    headerCols: ['是否表头','是否界面维护','是否查询条件','字段编码','字段类型','字段备注','界面元素名称','界面字段顺序','界面元素类型', '界面元素数据源编码'],
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
	    console.log(tData);
	    // 校验屏蔽
	    //if ( !mynewtable.isValidated() ){
	        //alert('Not validated');
	    //}
	    //e.preventDefault();
	    //直接下载代码
	    location.href = OLMT_CTX+"/rest/sys/generator/generatorByConfig?tData=" + JSON.stringify(tData)+"&table="+generator_table;
	   /* $.ajax({
    		url: OLMT_CTX+'/rest/sys/generator/generatorByConfig',
    		type: 	'POST',
    		data: 	{
    			ajax: true,
    			data: mynewtable.getJsonData()
    		},
    		complete: function (result) {
    			console.log('Server response', JSON.parse(result.responseText));
    		}
    	});
    	return false;*/
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
