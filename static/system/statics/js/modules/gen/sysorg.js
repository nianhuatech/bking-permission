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
        showList: true,
        title: null,
        dept:{
            pName:null,
            pid:0,
            orderNum:0
        }
    },
    methods: {
        getDept: function(){
            //加载部门树
            $.get(OLMT_CTX+'/rest/sysorg/select', function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r.deptList);
                var node = ztree.getNodeByParam("id", vm.dept.pid);
                ztree.selectNode(node);

                vm.dept.pName = node.name;
            })
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.dept = {pName:null,pid:0,orderNum:0};
            vm.getDept();
        },
        update: function () {
            var id = getDeptId();
            if(id == null){
                return ;
            }

            $.get(OLMT_CTX+'/rest/sysorg/info/'+id, function(r){
                vm.showList = false;
                vm.title = "修改";
                vm.dept = r.dept;

                vm.getDept();
            });
        },
        del: function () {
            var id = getDeptId();
            if(id == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
            	//alert(id);
                $.ajax({
                    type: "POST",
                    url: OLMT_CTX+'/rest/sysorg/delete',
                    contentType: "application/json",
                    data: JSON.stringify(id),
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
            });
        },
        saveOrUpdate: function (event) {
            var url = vm.dept.id == null ? "sysorg/save" : "sysorg/update";
            $.ajax({
                type: "POST",
                url: OLMT_CTX+'/rest/' + url,
                contentType: "application/json",
                data: JSON.stringify(vm.dept),
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
                    vm.dept.pid = node[0].id;
                    vm.dept.pName = node[0].name;

                    layer.close(index);
                }
            });
        },
        setMenus:function(){
        	var id = getDeptId();
            if(id == null){
                return ;
            }
            vm.getMenuTree(id);
            
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
                        menuIdList.push(nodes[i].id);
                    }
                    vm.dept.menus = menuIdList;
                    $.ajax({
                        type: "POST",
                        url: OLMT_CTX+'/rest/sysorg/setOrgMenus',
                        contentType: "application/json",
                        data: JSON.stringify(vm.dept),
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
                    });
                }
            });
            
        },
        getMenuTree: function(org_id) {
            //加载菜单树
            $.get(OLMT_CTX+'/rest/rssysmenu/list', function(r1){
            	debugger
                menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r1);
                $.get(OLMT_CTX+'/rest/sysorg/info/'+org_id, function(r){
                	debugger
                    vm.dept = r.dept;
                    //勾选角色所拥有的菜单
                    var menuIds = vm.dept.menus;
                    for(var i=0; i<menuIds.length; i++) {
                        var node = menu_ztree.getNodeByParam("id", menuIds[i]);
                        menu_ztree.checkNode(node, true, false);
                        menu_ztree.expandNode(node, true, false, true);
                    }
                });
            });
        },
        reload: function () {
            vm.showList = true;
            Dept.table.refresh();
        }
    }
});

//菜单树
var menu_ztree;
var menu_setting = {
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
        nocheckInherit:true
    }
};

var Dept = {
    id: "deptTable",
    table: null,
    layerIndex: -1
};

/**
 * 初始化表格的列
 */
Dept.initColumn = function () {
    var columns = [
        {field: 'selectItem', radio: true},
        {title: '部门ID', field: 'id', visible: false, align: 'center', valign: 'middle', width: '80px'},
        {title: '部门名称', field: 'name', align: 'center', valign: 'middle', sortable: true, width: '180px'},
        {title: '部门编码', field: 'code', align: 'center', valign: 'middle', sortable: true, width: '180px'},
        {title: '上级部门名称', field: 'pName', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '备注', field: 'remarks', align: 'center', valign: 'middle', sortable: true, width: '100px'}]
    return columns;
};


function getDeptId () {
    var selected = $('#deptTable').bootstrapTreeTable('getSelections');
    if (selected.length == 0) {
        alert("请选择一条记录");
        return false;
    } else {
        return selected[0].id;
    }
}


$(function () {
    $.get(OLMT_CTX+'/rest/sysorg/info', function(r){
        var colunms = Dept.initColumn();
        var table = new TreeTable(Dept.id, OLMT_CTX+'/rest/sysorg/list', colunms);
        table.setRootCodeValue(r.id);
        table.setExpandColumn(2);
        table.setIdField("id");
        table.setCodeField("id");
        table.setParentCodeField("pid");
        table.setExpandAll(false);
        table.setHeight($(window).height()-200);
        table.init();
        Dept.table = table;
    });
});
