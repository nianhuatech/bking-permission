var grid = $("#jqGrid");
$(function () {
    $("#jqGrid").jqGrid({
        url: site_url+'get_user_paging/',
        mtype: 'POST',
        datatype: "json",
        colModel: [			
        	{ label: '账号ID', name: 'op_id', index: 'op_id', width: 50, key: true },
        	{ label: '登陆名', name: 'login_code', index: 'login_code', width: 80 },	
        	{ label: '用户名', name: 'op_name', index: 'op_name', width: 80 }, 
        	{ label: '手机号', name: 'phone_id', index: 'phone_id', width: 80 }, 
			{ label: '邮箱', name: 'email', index: 'email', width: 80 }, 
			{ label: '创建时间', name: 'create_date', index: 'create_date', width: 80}, 
			{ label: '状态', name: 'status', index: 'status',width: 60, formatter: function(value, options, row){
				if (value == 0){
					return '<span class="label label-success">有效</span>';
				}else if(value == 1){
					return '<span class="label label-lock">锁定</span>';
				}else if(value == 2){
					return '<span class="label label-danger">无效</span>' ;
				}
					
			}},
        ],
		viewrecords: true,
        height: $(window).height()-130,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        //toolbar:[true,"top"],
        jsonReader : {
            root: "list",
            page: "pageNumber",
            total: "totalPage",
            records: "totalRow"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        },
        ajaxGridOptions:{
        	beforeSend:function(xhr, settings){
        		function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                function csrfSafeMethod(method) {
                    // these HTTP methods do not require CSRF protection
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                }
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    var csrftoken = getCookie('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
        	}
        }
    });
   // $('.grid-btn').appendTo('#t_jqGrid');
   // $('#t_jqGrid').append($('.grid-btn').html());
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

//菜单树
var menu_ztree;
var menu_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "priv_code",
            pIdKey: "parent_priv_code",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        enable:true,
        nocheckInherit:true
    }
};

//角色树
var role_ztree;
var role_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "role_code",
            pIdKey: "role_code",
            rootPId: 0
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        enable:true,
        nocheckInherit:true
    }
};

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
        	op_name: null,
        	login_code: null,
        	phone_id: null
        },
        showList: true,
        title:null,
        roleList:{},
        user:{
            status:0,
            org_id:null,
            bill_class:null,
            region_id:null,
            county_id:null,
        },
        op_password:'',
		newPassword:''
    },
    methods: {
        query: function () {
        	$("#jqGrid").jqGrid('setGridParam',{ 
                postData:{
                	'op_name': vm.q.op_name,
                	'login_code': vm.q.login_code,
                	'phone_id': vm.q.phone_id
                },
                page:1 
            }).trigger("reloadGrid");
        },
        exportGrid:function(){
        	var paras=$("#jqGrid").jqGrid("getGridParam");
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.roleList = {};
            $("#user_op_password").css("display","");
            $("#login_code").css("readonly","");
            vm.user = {op_id:null, status:0,org_id:'',bill_class:'',region_id:'',county_id:''};
        },
        asyncUser: function(){
        	//同步蓝鲸账号数据
            $.post(site_url+'do_async_operator/', function(r){
            	debugger
                if(r.code){
                	alert('同步账号成功', function(){
                        vm.reload();
                    });
                }else{
                	alert(r.msg, function(){
                        //vm.reload();
                    });
                }
            });
        },
        getDept: function(){
            //加载部门树
            $.get(site_url+'/rest/sysorg/list', function(r){
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
            $("#user_op_password").css("display","none");
            $("#login_code").attr("readonly","readonly");
            vm.showList = false;
            vm.title = "修改";
            vm.getUser(userId);
        },
        toLocked: function () {
            var userIds = getSelectedRows();
            if(userIds == null){
                return ;
            }
            confirm('确定要锁定选中的用户吗？', function(){
	            $.ajax({
	                type: "POST",
	                traditional:true,
                    url: site_url+"do_lock_user/",
                    dataType:'json',
                    async: true,
                    data:{userIds:userIds},
	                success: function(r){
	                    if(r.code){
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
                traditional:true,
                url: site_url+"do_unlock_user/",
                dataType:'json',
                async: true,
                data:{userIds:userIds},
                success: function(r){
                    if(r.code){
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
					var data = "op_password="+vm.op_password+"&newPassword="+vm.newPassword+"&op_id="+vm.user.op_id;
					$.ajax({
						type: "POST",
					    url: site_url+'updPwd/',
					    data: data,
					    dataType: "json",
					    success: function(result){
							if(result.code){
								layer.close(index);
								alert('修改成功', function(index){
									vm.reload();
								});
							}else{
								alert(result.msg);
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
                    traditional:true,
                    url: site_url+"do_del_user/",
                    dataType:'json',
                    async: true,
                    data:{userIds:userIds},
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
            var url = vm.user.op_id == null ? "do_add_user/" : "do_modify_user/";
            $.post(site_url+url,vm.user,function(res){
        		if (res.code) {	
        			alert('操作成功', function(){
                        vm.reload();
                    });
        		}else {
        			alert(res.msg);
        		}
        	}, 'json');
        },
        getUser: function(userId){
            $.post(site_url+'get_user/',{id:userId}, function(r){
            	if(r.code){
            		vm.user = r.list[0];
                    vm.user.password = null;
            	}else{
            		alert(r.msg);
            	}
                
            });
        },
        getRoleList: function(){
            $.get(site_url+'/rest/rssysrole/select', function(r){
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
        setRoles:function(){
        	var userId = getSelectedRow();
        	if(userId == null){
                return ;
            }
            vm.getRoleTree(userId);
            
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择角色",
                area: ['450px', '650px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#roleLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                	//获取选择的角色
                    var nodes = role_ztree.getCheckedNodes(true);
                    var roelList = new Array();
                    debugger
                    for(var i=0; i<nodes.length; i++) {
                    	roelList.push(nodes[i].role_code);
                    }
                    $.ajax({
                        type: "POST",
                        url: site_url+'do_add_op_role_grant/',
                        traditional:true,
                        dataType:'json',
                        async: true,
                        data:{userId:userId,roelList:roelList},
                        success: function(r){
                            if(r.code){
                                alert(r.msg, function(){
                                    vm.reload();
                                    layer.close(index);
                                });
                            }else{
                                alert(r.msg);
                                layer.close(index);
                            }
                        }
                    });
                }
            });
        },
        setMenus:function(){
        	var userId = getSelectedRow();
        	if(userId == null){
                return ;
            }
            vm.getMenuTree(userId);
            
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "查看菜单",
                area: ['450px', '650px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['取消'],
                btn1: function (index) {
                	layer.close(index);
                	//获取选择的菜单
                    /*var nodes = menu_ztree.getCheckedNodes(true);
                    var menuIdList = new Array();
                    debugger
                    for(var i=0; i<nodes.length; i++) {
                        menuIdList.push(nodes[i].id);
                    }
                    vm.user.menus = menuIdList;
                    $.ajax({
                        type: "POST",
                        url: site_url+'/rest/rssysuser/setUserMenus',
                        contentType: "application/json",
                        data: JSON.stringify(vm.user),
                        success: function(r){
                            if(r.code === 0){
                                alert('操作成功', function(){
                                    vm.reload();
                                    layer.close(index);
                                });
                            }else{
                                alert(r.msg);
                                layer.close(index);
                            }
                        }
                    });*/
                }
            });
            
        },
        getMenuTree: function(user_id) {
            //加载菜单树
            $.post(site_url+'get_user_priv/',{login_code:user_id}, function(r1){
            	debugger
                menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r1.list);
            	var menuIds = r1.list;
                for(var i=0; i<menuIds.length; i++) {
                    var node = menu_ztree.getNodeByParam("priv_code", menuIds[i].priv_code);
                    menu_ztree.checkNode(node, true, false);
                    menu_ztree.expandNode(node, true, false, true);
                }
            });
        },
        getRoleTree: function(user_id) {
            //加载角色树
            $.post(site_url+'get_curr_user_role/',function(r1){
            	debugger
                role_ztree = $.fn.zTree.init($("#roleTree"), menu_setting, r1.list);
            	$.post(site_url+'get_user_role/',{id:user_id},function(r){
            		var roleIds = r.list;
                    for(var i=0; i<roleIds.length; i++) {
                        var node = role_ztree.getNodeByParam("role_code", roleIds[i].role_code);
                        role_ztree.checkNode(node, true, false);
                        role_ztree.expandNode(node, true, false, true);
                    }
                });
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'userName': vm.q.userName},
                page:page
            }).trigger("reloadGrid");
        }
    }
});

$(document).ready(function () {
	setSelectData("get_dict_type","bill_class");
	setSelectData("get_dict_class","region_id");
	setSelectData("get_dict_type","county_id");
	setSelectData("get_dict_class","org_id");
});

function setSelectData(code, objId) {
	$.ajax({
		type: "POST",
        url: site_url+code+'/',
        dataType:'json',
        async: true,
        data:{},
	    success : function(r) {    
	    	var data = r.list;  
	    	var opts = "";  
	    	opts += "<option selected value=''>----------请选择----------</option>";
	    	for( var index = 0 ; index < data.length; index++ ){  
	    		var d = data[index];  
	    		opts += "<option value='"+d.dict_code+"'>"+d.dict_name+"</option>";  
	    	}
	    	// 查询界面  
	    	$("."+objId).append(opts);    
	  }    
	});
}