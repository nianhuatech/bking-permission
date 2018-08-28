var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "priv_code",
            pIdKey: "parent_priv_code",
            rootPId: 0
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
        menu:{
        	pName:null,
            parent_priv_code:0,
            priv_type:1,
            orderNum:0
        }
    },
    methods: {
        getMenu: function(menuId){
            //加载菜单树
        	debugger
            $.post(site_url+'get_curr_user_priv/', function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.list);
                var node = ztree.getNodeByParam("priv_code", vm.menu.parent_priv_code);
                ztree.selectNode(node);
                debugger
                vm.menu.pName = node.name;
            })
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.menu = {pName:null,parent_priv_code:0,priv_type:1,orderNum:0};
            vm.getMenu();
        },
        update: function () {
            var menuId = getMenuId();
            if(menuId == null){
                return ;
            }

            $.post(site_url+'get_priv_by_id/',{id:menuId}, function(r){
            	debugger
                vm.showList = false;
                vm.title = "修改";
                vm.menu = r.list[0];

                vm.getMenu();
            });
        },
        del: function () {
            var menuId = getMenuId();
            if(menuId == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: site_url+'do_del_priv/',
                    dataType:'json',
                    async: true,
                    data:{id:menuId},
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
        saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }
            debugger
            alert(JSON.stringify(vm.menu));
            var url = vm.menu.id == null ? "do_add_priv/" : "do_modify_priv/";
            $.post(site_url+url,vm.menu,function(res){
        		if (res.code) {	
        			alert(res.msg);
        			vm.reload();
        		}else {
        			alert(res.msg);
        		}
        	}, 'json');
            /*$.ajax({
                type: "POST",
                url:  site_url+ url,
                contentType: "json",
                data: vm.menu,
                success: function(r){
                    if(r.code){
                        alert(r.msg, function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });*/
        },
        menuTree: function(){
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
                    vm.menu.parent_priv_code = node[0].priv_code;
                    vm.menu.pName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            Menu.table.refresh();
        },
        validator: function () {
            if(isBlank(vm.menu.priv_name)){
                alert("菜单名称不能为空");
                return true;
            }
            //debugger
            //菜单
            if(vm.menu.priv_type === 1 && isBlank(vm.menu.priv_uri) && vm.menu.parent_priv_code !=0){
                alert("菜单URL不能为空");
                return true;
            }
        }
    }
});


var Menu = {
    id: "menuTable",
    table: null,
    layerIndex: -1
};

/**
 * 初始化表格的列
 */
Menu.initColumn = function () {
    var columns = [
        {field: 'selectItem', radio: true},
        {title: '菜单ID', field: 'id', visible: false, align: 'center', valign: 'middle', width: '80px'},
        {title: '鉴权编码', field: 'priv_code', align: 'center', valign: 'middle', sortable: true},
        {title: '菜单名称', field: 'priv_name', align: 'center', valign: 'middle', sortable: true, width: '180px'},
        {title: '上级编码', field: 'parent_priv_code', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '菜单类别', field: 'priv_class', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '菜单URL', field: 'priv_uri', align: 'center', valign: 'middle', sortable: true, width: '160px'},
        {title: '图标', field: 'priv_icon', align: 'center', valign: 'middle', sortable: true, width: '80px', formatter: function(item, index){
            return item.priv_icon == null ? '' : '<i class="'+item.priv_icon+' fa-lg"></i>';
        }},
        {title: '类型', field: 'priv_type', align: 'center', valign: 'middle', sortable: true, width: '100px', formatter: function(item, index){
            if(item.priv_type == 1){
                return '<span class="label label-success">菜单</span>';
            }
            if(item.priv_type == 2){
                return '<span class="label label-warning">按钮</span>';
            }
        }},
        {title: '排序号', field: 'priv_sort', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '创建时间', field: 'create_date', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '创建人', field: 'create_op', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '修改时间', field: 'upd_date', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '备注', field: 'mark', align: 'center', valign: 'middle', sortable: true}]
    return columns;
};


function getMenuId () {
	debugger
    var selected = $('#menuTable').bootstrapTreeTable('getSelections');
    if (selected.length == 0) {
        alert("请选择一条记录");
        return false;
    } else {
        return selected[0].id;
    }
}


$(function () {
    var colunms = Menu.initColumn();
    var table = new TreeTable(Menu.id, site_url+'get_paging_privs/', colunms);
    table.setExpandColumn(2);
    table.setIdField("id");
    table.setCodeField("priv_code");
    table.setParentCodeField("parent_priv_code");
    table.setExpandAll(false);
    table.setHeight($(window).height()-120);
    table.init();
    Menu.table = table;
});

//初始化select控件数据
$(document).ready(function () {
	setSelectData("rs.code.status","priv_class");
});

function setSelectData(code, objId) {
	var opts = "";
	opts += "<option value=''>----------请选择----------</option>";
	opts += "<option value='system_permission'>权限系统</option>";
	// 查询界面  
	$("." + objId).append(opts);
	//$("#addid").selectpicker("refresh");
}