//加载菜单
$(function() {
	 $.ajax({
 	   type : 'POST', 
        url : site_url+'get_curr_user_priv/',  
        processData : true,  
        dataType : 'json',  
        success : function(data) {
        	if(data.code){
        		result = format_json_to_menu(data.list)
        		mMenu._init(result,"side-menu");
        	}else{
        		alert('菜单加载失败:'+data.msg);
        	}
        },  
        error : function() {  
        	BS_openAlertErrMsg('菜单加载失败，已恢复默认菜单');  
        }  
    }); 
});

/**
 * 格式化后台数据使之符合menu控件的数据格式
 * */
function format_json_to_menu(data){
	debugger
	var menus = [];
	for (var i = 0 ; i < data.length; i++){
		menu = [];
		if (data[i].parent_priv_code == "0" && data[i].type == 1){
			data[i].Childrens = JSON.stringify(getMenuChildrens(data,data[i].priv_code));
			menu = data[i];
			//menu[0].Childrens = JSON.stringify(getMenuChildrens(data,data[i].priv_code));
			menus.push(menu);
		}
	}
	return JSON.parse(JSON.stringify(menus));
}
/**获得下一及菜单列表*/
function getMenuChildrens(data,priv_code){
	debugger
	var menus = [];
	for (var i = 0 ; i < data.length; i++){
		menu = {};
		if(data[i].parent_priv_code == priv_code && data[i].type == 1){
			data[i].Childrens = JSON.stringify(getMenuChildrens(data,data[i].priv_code));
			menu = data[i];
			//menu.Childrens = "ssssss";
			menus.push(menu);
		}
	}
	return menus;
}


(function(window) {
    //"数据个是必须严格遵守固定的格式：";
	
    function mMenu() {
        // this._init(jsonData)
    };
    mMenu.prototype = {
        _init: function(jsonData,id) {
        	debugger
            //自适应高度
            //this.autoHeight();
            //生成菜单树,容器id，json数据
            this.initMenu(id, jsonData);
            //激活菜单层级 
            this.metisMenu(id);
            //追加tab
            //this.appendTab();
            //删除tab,传入父类id
           // this.deleteTab();
            //删除全部或其他
            //this.closeTabAllOrOther();
            //tab滑动效果
           // this.tabSlide();
            //点击tab关闭按钮，显示或关闭弹框
           // this.tabCloseBottomPopDownOrUp();
            //显示或隐藏菜单栏
            //this.showOrHideMenu();
            //点击tab的li剧中显示
            //this.clickTabLiCenter();
        },
        //点击tab关闭按钮，显示或关闭弹框
        
        //激活层级菜单
        metisMenu: function(id) {
            $('#'+id).metisMenu();
        },
        //初始化菜单
        initMenu: function(id, jsonData) {
            var treeElement = new Array();
            recursion(jsonData, treeElement);
            $("#" + id).append(treeElement.toString().replace(/\,/g, ''));
            debugger
            //递归菜单树
            function recursion(json, treeElement) {
            	$.each(json,function(i,obj){
            		debugger
            		//var obj = obj2.item;
            		if ((Object.prototype.toString.call(obj) === '[object Object]' && obj.Childrens != undefined && $.parseJSON(obj.Childrens).length > 0)
            			|| (Object.prototype.toString.call(obj) === '[object Object]' && obj.parent_priv_code == 0)) {
            			if(obj.uri != undefined && obj.uri != ""){
            				if(obj.priv_icon != undefined && obj.priv_icon != ""){
            					treeElement.push('<li><a href="javascript:mainpageLoad("'+obj.uri+'/")"><i class="fa fa-th-large '+obj.priv_icon+'"></i><span class="nav-label">'+obj.name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}else{
            					treeElement.push('<li><a href="javascript:mainpageLoad("'+obj.uri+'/")"><i class="fa fa-th-large "></i><span class="nav-label">'+obj.name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}
            			}else{
            				if(obj.priv_icon != undefined && obj.priv_icon != ""){
            					treeElement.push('<li><a href="javascript:void(0);"><i class="fa fa-th-large '+obj.priv_icon+'"></i><span class="nav-label">'+obj.name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}else{
            					treeElement.push('<li><a href="javascript:void(0);"><i class="fa fa-th-large"></i><span class="nav-label">'+obj.name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}
            			}
                        recursion($.parseJSON(obj.Childrens), treeElement);
                        treeElement.push('</ul></li>');
                    }else {
                    	/*if(obj.priv_url.indexOf("druid") != -1){
                    		if(obj.priv_icon != undefined && obj.priv_icon != ""){
                    			treeElement.push('<li class="active"><a target="_blank" href="'+obj.priv_url+'">&nbsp;&nbsp;&nbsp;'+obj.name+'</a></li>');
                    		}else{
                    			treeElement.push('<li class="active"><a class="fa fi-thumbnails icon-blue" target="_blank" href="'+obj.priv_url+'">&nbsp;&nbsp;&nbsp;'+obj.name+'</a></li>');
                    		}
                    	}else{*/
                    		if(obj.priv_icon != undefined && obj.priv_icon != ""){
                    			treeElement.push('<li class="active"><a class="fa '+obj.priv_icon+'" href=javascript:mainpageLoad("'+obj.uri+'/")>&nbsp;&nbsp;&nbsp;'+obj.name+'</a></li>');
                    		}else{
                    			treeElement.push('<li class="active"><a class="fa fi-thumbnails icon-blue" href=javascript:mainpageLoad("'+obj.uri+'/")>&nbsp;&nbsp;&nbsp;'+obj.name+'</a></li>');
                    		}
                    	//}
                    }
            	});
            }
        }
    }
    window.mMenu = new mMenu();
})(window);