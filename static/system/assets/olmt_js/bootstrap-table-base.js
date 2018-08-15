/**
 * bootstrap-table 组件化 - 基础表格组件
 * @param table 表格id ，直接传入id即可，不需要加#
 * @param url 请求的url
 * @param columns 表头
 * @param hasCheckbox 是否显示Checkbox字段
 * @param toolbar 表格工具按钮容器id 直接传id即可
 * 
 * @date 2017-11-6
 * @author JayTan
 * */

(function () {  
    function init(table,url,columns,hasCheckbox,toolbar) {  
        $('#'+table).bootstrapTable({  
            url: url,                           //请求后台的URL（*）  
            method: 'post',                     //请求方式（*）  
            toolbar: '#'+toolbar,               //工具按钮用哪个容器  
            striped: true,                      //是否显示行间隔色  
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）  
            pagination: true,                   //是否显示分页（*）  
            sortable: false,                    //是否启用排序  
            sortOrder: "asc",                   //排序方式  
            queryParams: queryParams,           //传递参数（*），这里应该返回一个object，即形如{param1:val1,param2:val2}  
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）  
            pageNumber:1,                       //初始化加载第一页，默认第一页  
            pageSize: 2,                       //每页的记录行数（*）  
            pageList: [20, 50, 100],            //可供选择的每页的行数（*）  
            search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大  
            strictSearch: true,  
            showColumns: true,                  //是否显示所有的列  
            showRefresh: true,                  //是否显示刷新按钮  
            minimumCountColumns: 2,             //最少允许的列数  
            clickToSelect: true,                //是否启用点击选中行  
            //height: 500,                      	//行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度  
            uniqueId: columns[0].field,             //每一行的唯一标识，一般为主键列  
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮  
            cardView: false,                    //是否显示详细视图  
            detailView: true,                  //是否显示父子表   
            columns: createCols(columns,hasCheckbox),
            onEditableSave:editColumnsSave,
            onExpandRow:initSubTable,
            showExport: true,                     //是否显示导出
            exportDataType: "selected", 
        });  
    }
    function initSubTable(index,row,$detail) {  
        //initSubTableHtml(index,row,$detail);  
    	var parentid = row.MENU_ID;  
        var cur_table = $detail.html('<table style="padding-left: 45px;"></table>').find('table');//注意这个'table'不是一个id，他在任何情况下不需要改变  
        $(cur_table).bootstrapTable({  
            url:'',  
            method:'post',  
            queryParams:{strParentID:parentid},  
            ajaxOptions:{strParentID:parentid},  
            clickToSelect:true,  
            detailView:true,  
            uniqueId:"MENU_ID",  
            pageSize:10,  
            pageList:[10,25],  
            columns:[  
                {  
                    filed:'from',  
                    title:'from'  
                },  
                {  
                    field:'url',  
                    title:'url'  
                },  
                {  
                    field:'to',  
                    title:'to'  
                }  
            ],  
            onExpandRow:function (index,row,$Subdetail) {  
                initSubTable(index,row,$Subdetail);  
            }  
        });
    }
    function editColumnsSave(field,row,oldValue,$el) {  
        alert('修改 别名：'+oldValue+' 为 》》》'+row.realName);  
    } 
    function createCols(columns,hasCheckbox) {  
        if(columns == undefined || columns.length <=0 )  
            return null;  
        var arr = [];  
        if(hasCheckbox)  
        {  
            var objc = {};  
            objc.checkbox = true;  
            arr.push(objc);  
        } 
        //debugger
        for(var i = 0;i<columns.length;i++)  
        {  
            var obj = columns[i];  
            //obj.field = params[i];  
            //obj.title = titles[i];  
            arr.push(obj);  
        }  
        return arr;  
    }  
    //可发送给服务端的参数：limit->pageSize,offset->pageNumber,search->searchText,sort->sortName(字段),order->sortOrder('asc'或'desc')  
    function queryParams(params) {  
    	var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit,   //页面大小
                pageNumber: params.offset  //页码
            };
    	return temp;
    }  
    // 传'#table'  
    createBSTable = function (table,url,columns,hasCheckbox,toolbar) {  
    	//debugger
    	//alert("#"+table+"----------"+"#"+toolbar);
        init(table,url,columns,hasCheckbox,toolbar);  
    }  
  
})();  