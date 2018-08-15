var grid = $("#jqGrid");
$(function () {
    $("#jqGrid").jqGrid({
        url: OLMT_CTX+'/rest/rssysuser/list',
        datatype: "json",
        colModel: [			
        	{ label: 'id', name: 'id', index: 'ID', width: 50,align:"center", key: true },
        	{ label: '登陆名', name: 'loginName', index: 'LOGIN_NAME', width: 80 },	
        	{ label: '用户名', name: 'userName', index: 'USER_NAME', width: 80 }, 
        	{ label: '手机号', name: 'phone', index: 'PHONE', width: 80 }, 
			{ label: '邮箱', name: 'email', index: 'EMAIL', width: 80 }, 
			{ label: '地址', name: 'addr', index: 'ADDR', width: 80 },
			{ label: '所属部门', name: 'pName', width: 80 }, 
			{ label: '是否锁定', name: 'isLocked', index: 'IS_LOCKED', width: 80, formatter: function(value, options, row){
				return value != 0 ? 
						'<span class="label label-danger">已锁定</span>' : 
						'<span class="label label-success">未锁定</span>';
				}}, 			
			{ label: '创建时间', name: 'createTime', index: 'CREATE_TIME', width: 80}, 
			{ label: '状态', name: 'status', index: 'STATUS',width: 60, formatter: function(value, options, row){
				return value != 0 ? 
					'<span class="label label-danger">禁用</span>' : 
					'<span class="label label-success">正常</span>';
			}},
        ],
		viewrecords: true,
        height: $(window).height()-300,
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
   
   // $('.grid-btn').appendTo('#t_jqGrid');
   // $('#t_jqGrid').append($('.grid-btn').html());
    //var citys=[{city:"南京市"},{city:"无锡市"},{city:"苏州市"}];
    //for(var item in citys){
        //vm.items3.push( citys[item]);
    //}
    vm.items3=showSel("rs.code.demo");
});
$(document).ready(function () {
	$(".datetimepicker").datetimepicker({
        language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: 0,
        showMeridian: true
    });
    var start = null;
	var end = null;
	$('#createdTime_start').datetimepicker({
		language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: 0,
        showMeridian: true
	}).on('changeDate', function(ev) {
		var startTime = $("#createdTime_start").val();
		start = startTime;
		if (start > end) {
			alert("“开始时间 ”不能晚于“结束时间 ” ！");
			$("#createdTime_start").focus();
		}
	});
	$('#q_date_end').datetimepicker({
		language: "zh-CN",
		format: 'yyyy-mm-dd HH:mm:ss',
		weekStart: true,
        todayBtn:  true,
		autoclose: true,
		todayHighlight: true,
		startView: 2,
		forceParse: 0,
        showMeridian: true
	}).on('changeDate', function(ev) {
		var endTime = $("#q_date_end").val();
		end = endTime;
		if (end < start) {
			alert("“结束时间 ”不能早于“开始时间 ” ！");
			$("#createdTime_end").focus();
		} else {
		}
	});
});
function showSel(code){  
	$.ajax({
		type: "POST",
        url: OLMT_CTX+'/rest/sys/generator/getSelectData',
        contentType: "application/json",
        data: code,  
	    success : function(r) {    
	    	var data = r.list;  
	    	var opts = "";  
	    	
	    	for( var index = 0 ; index < data.length; index++ ){  
	    		var d = data[index];  
	    		//alert("<option value='"+d.KEY+"'>"+d.VALUE+"</option>");
	    		opts += "<option value='"+d.KEY+"'>"+d.VALUE+"</option>";  
	    	}
	    	// 查询界面  
	    	$("#addid").append(opts);    
	    	//$("#addid").selectpicker("refresh");
	  }    
	});    
} 

function getSelectData(code){
	$.ajax({
        type: "POST",
        url: OLMT_CTX+'/rest/sys/generator/getSelectData',
        contentType: "application/json",
        data: code,
        success: function(r){
        	debugger
            if(r.code == 0){
                return r.list;
            }else{
                return [];
            }
        }
    });
}

function getQueryOara(){
	var  para = {};
	if(document.getElementById("userName").value != ''
		&& document.getElementById("userName").value != undefined){
		para.userName=document.getElementById("userName").value;	
	}
	if(document.getElementById("loginName").value != ''
		&& document.getElementById("loginName").value != undefined){
		para.loginName=document.getElementById("loginName").value;	
	}
	if(document.getElementById("createdTime_start").value != ''
		&& document.getElementById("createdTime_start").value != undefined){
		para.q_date_start=document.getElementById("createdTime_start").value;	
	}
	if(document.getElementById("createdTime_end").value != ''
		&& document.getElementById("createdTime_end").value != undefined){
		para.q_date_end=document.getElementById("createdTime_end").value;	
	}
	if(document.getElementById("addid").value != ''
		&& document.getElementById("addid").value != undefined){
		para.orgId=document.getElementById("addid").value;	
	}
	return para;
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
    el:'#rrapp',
    data:{
        q:{
        	userName: null,
        	loginName:null
        },
        showList: true,
        title:null,
        roleList:{},
        user:{
            status:1,
            orgId:null,
            pName:null,
            roleList:[]
        },
        password:'',
		newPassword:'',
        /*preTitle:"联动下拉框",
        title0:"中心",
        title2:"地市",
        title3:"路段",
        countrys:[
            {country:"中国"},
            {country:"美国"},
            {country:"日本"}
        ],
        items2:[],*/
        items3:[]
        
    },
    methods: {
    	warn:toSelect2,
        warn2:toSelect3,
        warn3:recordSelect3,
        query: function () {
        	$("#jqGrid").jqGrid('setGridParam',{ 
                postData:getQueryOara(),
                page:1 
            }).trigger("reloadGrid");
           // vm.reload();
        },
        exportGrid:function(type){
        	//alert(vm.q.userName);
        	debugger
        	var g_paras=$("#jqGrid").jqGrid("getGridParam","colModel");
        	var names = getJqTitles(g_paras);
        	var showNames = getJqLable(g_paras);
        	var para = getQueryOara();
        	$("body:eq(0)").append('<iframe id="_export_frame" style="display:none" width="500px" src="about:blank"></iframe>');
        	IframePost.doPost({ Url: OLMT_CTX+"/rest/rssysuser/export", Target: "_export_frame", PostParams: {type:type,jgCols:names,showNames:showNames,para:JSON.stringify(para)} });
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.roleList = {};
            vm.user = {pName:null, id:null, status:1, roleList:[]};

            //获取角色信息
            this.getRoleList();

            vm.getDept();
        },
        getDept: function(){
            //加载部门树
            $.get(OLMT_CTX+'/rest/sysorg/list', function(r){
            	debugger
                ztree = $.fn.zTree.init($("#deptTree"), setting, r);
                var node = ztree.getNodeByParam("id", vm.user.orgId);
                if(node != null){
                    ztree.selectNode(node);

                    vm.user.pName = node.name;
                }
            })
        },
        update: function () {
            var userId = getSelectedRow();
            if(userId == null){
                return ;
            }

            vm.showList = false;
            vm.title = "修改";

            vm.getUser(userId);
            //获取角色信息
            this.getRoleList();
        },
        toLocked: function () {
            var userIds = getSelectedRows();
            if(userIds == null){
                return ;
            }
            confirm('确定要锁定选中的用户吗？', function(){
	            $.ajax({
	                type: "POST",
	                url: OLMT_CTX+'/rest/rssysuser/locked',
	                contentType: "application/json",
	                data: JSON.stringify(userIds),
	                success: function(r){
	                    if(r.code == 0){
	                        alert('用户锁定成功', function(){
	                            vm.reload();
	                        });
	                    }else{
	                        alert(r.msg);
	                    }
	                }
	            });
            });
        },
        
        toUnLocked: function () {
            var userIds = getSelectedRows();
            if(userIds == null){
                return ;
            }

            $.ajax({
                type: "POST",
                url: OLMT_CTX+'/rest/rssysuser/unlocked',
                contentType: "application/json",
                data: JSON.stringify(userIds),
                success: function(r){
                    if(r.code == 0){
                        alert('解锁成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        updatePassword: function(){
        	var userId = getSelectedRow();
        	if(userId == null){
                return ;
            }
            vm.getUser(userId);
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "修改密码",
				area: ['550px', '270px'],
				shadeClose: false,
				content: jQuery("#passwordLayer"),
				btn: ['修改','取消'],
				btn1: function (index) {
					var data = "password="+vm.password+"&newPassword="+vm.newPassword+"&user_id="+vm.user.id;
					$.ajax({
						type: "POST",
					    url: OLMT_CTX+'/rest/rssysuser/updPwd',
					    data: data,
					    dataType: "json",
					    success: function(result){
							if(result.code == 0){
								layer.close(index);
								layer.alert('修改成功', function(index){
									vm.reload();
								});
							}else{
								layer.alert(result.msg);
							}
						}
					});
	            }
			});
		},
        del: function () {
            var userIds = getSelectedRows();
            if(userIds == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: OLMT_CTX+'/rest/rssysuser/delete',
                    contentType: "application/json",
                    data: JSON.stringify(userIds),
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
            });
        },
        saveOrUpdate: function () {
            var url = vm.user.id == null ? "/save" : "/update";
            $.ajax({
                type: "POST",
                url: OLMT_CTX+'/rest/rssysuser' + url,
                contentType: "application/json",
                data: JSON.stringify(vm.user),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        getUser: function(userId){
            $.get(OLMT_CTX+'/rest/rssysuser/info/'+userId, function(r){
                vm.user = r.user;
                debugger
                vm.user.password = null;

                vm.getDept();
            });
        },
        getRoleList: function(){
            $.get(OLMT_CTX+'/rest/rssysrole/select', function(r){
                vm.roleList = r.list;
            });
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级部门
                    debugger
                    vm.user.orgId = node[0].id;
                    vm.user.pName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'loginNmae':vm.q.loginNmae,'userName': vm.q.userName},
                page:page
            }).trigger("reloadGrid");
        }
    }
});

function toSelect2(event){
	   vm.items2=[];
	   var content=event.target.text;
	   vm.title=content;
	   var provinces=[{province:"江苏省"},{province:"浙江省"},{province:"上海市"}];
	   for(var item in provinces){
	       vm.items2.push(provinces[item]);
	   }
	}

	function toSelect3(event){
	    vm.items3=[];

	    var content=event.target.text;
	    vm.title2=content;
	    var citys=[{city:"南京市"},{city:"无锡市"},{city:"苏州市"}];
	    for(var item in citys){
	        vm.items3.push( citys[item]);
	    }
	}

	function recordSelect3(event){
	    var content=event.target.text;
	    vm.title3=content;
	}