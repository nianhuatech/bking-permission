$(function () {
    $("#jqGrid").jqGrid({
        url:site_url+'get_role_paging/',
        mtype: 'POST',
        datatype: "json",
        colModel: [
        	{ label: '角色ID', name: 'id', index: 'id', width: 50, key: true },
			{ label: '角色名', name: 'role_name', index: 'role_name', width: 80 }, 			
			{ label: '角色编号', name: 'role_code', index: 'role_code', width: 80 }, 			
			{ label: '备注', name: 'mark', index: 'mark', width: 80 }, 			
			{ label: '状态', name: 'status', index: 'status',width: 60, formatter: function(value, options, row){
				return value != 0 ? 
					'<span class="label label-danger">无效</span>' : 
					'<span class="label label-success">有效</span>';
				}
			},			
			{ label: '角色类别', name: 'role_type', index: 'role_type', width: 80 }, 			
			{ label: '创建时间', name: 'create_date', index: 'create_date', width: 80 }, 			
			{ label: '创建人', name: 'create_op', index: 'create_op', width: 80 }, 			
			{ label: '最后修改时间', name: 'upd_date', index: 'upd_date', width: 80 }, 			
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
});

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

//部门结构树
var dept_ztree;
var dept_setting = {
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

//数据树
var data_ztree;
var data_setting = {
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
    },
    check:{
        enable:true,
        nocheckInherit:true,
        chkboxType:{ "Y" : "", "N" : "" }
    }
};

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            role_name: null,
            role_code: null
        },
        showList: true,
        title:null,
        role:{
            orgId:null,
            oName:null
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            $("#status").css("display","none");
            vm.role = {role_name:null, id:null,status:null};
            //vm.getMenuTree(null);

            //vm.getDept();

            //vm.getDataTree();
        },
        getMenuTree:function(role_id){
        	//加载菜单树
            $.post(site_url+'get_curr_user_priv/',function(r1){
                menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r1.list);
                $.post(site_url+'get_role_priv/',{id:role_id},function(r){
                	debugger
                	var menuIds = r.list;
                    for(var i=0; i<menuIds.length; i++) {
                        var node = menu_ztree.getNodeByParam("priv_code", menuIds[i].priv_code);
                        menu_ztree.checkNode(node, true, false);
                        menu_ztree.expandNode(node, true, false, true);
                    }
                });
            	
            });
        },
        setPriv:function(){
        	var role_id = getSelectedRow();
        	if(role_id == null){
                return ;
            }
            vm.getMenuTree(role_id);
            
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择菜单",
                area: ['450px', '650px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                	//获取选择的菜单
                    var nodes = menu_ztree.getCheckedNodes(true);
                    var menuIdList = new Array();
                    debugger
                    for(var i=0; i<nodes.length; i++) {
                        menuIdList.push(nodes[i].priv_code);
                    }
                    $.ajax({
                        type: "POST",
                        url: site_url+'do_add_role_priv_grant/',
                        traditional:true,
                        dataType:'json',
                        async: true,
                        data:{role_id:role_id,menuIdList:menuIdList},
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
        update: function () {
            var roleId = getSelectedRow();
            if(roleId == null){
                return ;
            }
            $("#role_code").css("display","");
            $("#status").css("display","");
            vm.showList = false;
            vm.title = "修改";
            vm.getRole(roleId);
        },
        del: function () {
        	var roleId = getSelectedRows();
            if(roleId == null){
                return ;
            }
            debugger
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    traditional:true,
                    url: site_url+"do_del_role/",
                    dataType:'json',
                    async: true,
                    data:{ids:roleId},
                    success: function(r){
                        if(r.code){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            	/*$.post(site_url+"do_del_role/",{"id":roleId},function(res){
            		if (res.code) {	
            			alert(res.msg);
            			vm.reload();
            		}else {
            			alert(res.msg);
            		}
            	}, 'json');*/
            });
        },
        getRole: function(roleId){
            $.post(site_url+'get_role/',{"id":roleId}, function(r){
            	if(r.code){
            		debugger
            		vm.role = r.role[0];
            	}else{
            		alert(r.msg);
            	}
            });
        },
        saveOrUpdate: function () {
            /*//获取选择的菜单
            var nodes = menu_ztree.getCheckedNodes(true);
            var menuIdList = new Array();
            debugger
            for(var i=0; i<nodes.length; i++) {
                menuIdList.push(nodes[i].id);
            }
            vm.role.menuIdList = menuIdList;
            debugger
            //获取选择的数据
            var nodes = data_ztree.getCheckedNodes(true);
            var deptIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                deptIdList.push(nodes[i].id);
            }
            vm.role.deptIdList = deptIdList;*/
            //debugger
            //alert(JSON.stringify(vm.role));
            var url = vm.role.id == null ? "do_add_role/" : "do_modify_role/";
            $.post(site_url+url,vm.role,function(res){
        		if (res.code) {	
        			alert(res.msg);
        			vm.reload();
        		}else {
        			alert(res.msg);
        		}
        	}, 'json');
           
        },
        /*getMenuTree: function(roleId) {
            //加载菜单树
            $.get(site_url+'/rest/rssysmenu/list', function(r){
            	debugger
                menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r);
                //展开所有节点
                //menu_ztree.expandAll(true);

                if(roleId != null){
                    vm.getRole(roleId);
                }
            });
        },*/
        getDataTree: function(roleId) {
        	debugger
            //加载菜单树
            $.get(site_url+'/rest/sysorg/list', function(r){
            	debugger
                data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, r);
                //展开所有节点
                data_ztree.expandAll(true);
            });
        },
        getDept: function(){
            //加载部门树
            $.get(site_url+'/rest/sysorg/list', function(r){
            	debugger
                dept_ztree = $.fn.zTree.init($("#deptTree"), dept_setting, r);
                var node = dept_ztree.getNodeByParam("id", vm.role.orgId);
                if(node != null){
                    dept_ztree.selectNode(node);

                    vm.role.oName = node.name;
                }
            })
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
                    var node = dept_ztree.getSelectedNodes();
                    //选择上级部门
                    vm.role.orgId = node[0].id;
                    vm.role.oName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{
                	'role_name': vm.q.role_name,
                	'role_code': vm.q.role_code
                },
                page:page
            }).trigger("reloadGrid");
        }
    }
});