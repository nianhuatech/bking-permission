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
				return value != 0 ? 
					'<span class="label label-danger">无效</span>' : 
					'<span class="label label-success">有效</span>';
			}},
        ],
		viewrecords: true,
        height: $(window).height()-300,
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
            status:1,
            orgId:null,
            pName:null,
            roleList:[]
        },
        password:'',
		newPassword:''
        /*preTitle:"联动下拉框",
        title0:"中心",
        title2:"地市",
        title3:"路段",
        countrys:[
            {country:"中国"},
            {country:"美国"},
            {country:"日本"}
        ],
        items2:[],
        items3:[]*/
        
    },
    methods: {
    	warn:toSelect2,
        warn2:toSelect3,
        warn3:recordSelect3,
        query: function () {
        	$("#jqGrid").jqGrid('setGridParam',{ 
                postData:{
                	'op_name': vm.q.op_name,
                	'login_code': vm.q.login_code,
                	'phone_id': vm.q.phone_id
                },
                page:1 
            }).trigger("reloadGrid");
           // vm.reload();
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
            vm.roleList = {};
            vm.user = {pName:null, id:null, status:1, roleList:[]};

            //获取角色信息
            this.getRoleList();

            vm.getDept();
        },
        asyncUser: function(){
        	//加载部门树
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
            $("#password").attr("readonly","readonly");
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
	                url: site_url+'/rest/rssysuser/locked',
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
                url: site_url+'/rest/rssysuser/unlocked',
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
					    url: site_url+'/rest/rssysuser/updPwd',
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
                    url: site_url+'/rest/rssysuser/delete',
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
                url: site_url+'/rest/rssysuser' + url,
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
            $.get(site_url+'/rest/rssysuser/info/'+userId, function(r){
                vm.user = r.user;
                debugger
                vm.user.password = null;

                vm.getDept();
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