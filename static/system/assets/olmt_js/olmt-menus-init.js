//加载菜单
$(function() {
	 $.ajax({
 	   type : 'POST', 
        url : site_url+'get_curr_user_priv/',  
        processData : true,  
        dataType : 'json',  
        success : function(data) {
        	if(data.code){
        		mMenu._init(data.list,"side-menu");
        	}else{
        		alert('菜单加载失败:'+data.msg);
        	}
        },  
        error : function() {  
        	BS_openAlertErrMsg('菜单加载失败，已恢复默认菜单');  
        }  
    }); 
});
(function(window) {
    //"数据个是必须严格遵守固定的格式：";
	
    function mMenu() {
        // this._init(jsonData)
    };
    mMenu.prototype = {
        _init: function(jsonData,id) {
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
            		//var obj = obj2.item;
            		if ((Object.prototype.toString.call(obj) === '[object Object]' && obj.Childrens != undefined && obj.Childrens.length > 0)
            			|| (Object.prototype.toString.call(obj) === '[object Object]' && obj.parent_priv_code == 0)) {
            			if(obj.priv_uri != undefined && obj.priv_uri != ""){
            				if(obj.priv_icon != undefined && obj.priv_icon != ""){
            					treeElement.push('<li><a href="javascript:mainpageLoad("'+obj.priv_uri+'")"><i class="fa fa-th-large '+obj.priv_icon+'"></i><span class="nav-label">'+obj.priv_name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}else{
            					treeElement.push('<li><a href="javascript:mainpageLoad("'+obj.priv_uri+'")"><i class="fa fa-th-large "></i><span class="nav-label">'+obj.priv_name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}
            			}else{
            				if(obj.priv_icon != undefined && obj.priv_icon != ""){
            					treeElement.push('<li><a href="javascript:void(0);"><i class="fa fa-th-large '+obj.priv_icon+'"></i><span class="nav-label">'+obj.priv_name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}else{
            					treeElement.push('<li><a href="javascript:void(0);"><i class="fa fa-th-large"></i><span class="nav-label">'+obj.priv_name+'</span><span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">');
            				}
            			}
                        recursion(obj.Childrens, treeElement);
                        treeElement.push('</ul></li>');
                    }else {
                    	/*if(obj.priv_url.indexOf("druid") != -1){
                    		if(obj.priv_icon != undefined && obj.priv_icon != ""){
                    			treeElement.push('<li class="active"><a target="_blank" href="'+obj.priv_url+'">&nbsp;&nbsp;&nbsp;'+obj.priv_name+'</a></li>');
                    		}else{
                    			treeElement.push('<li class="active"><a class="fa fi-thumbnails icon-blue" target="_blank" href="'+obj.priv_url+'">&nbsp;&nbsp;&nbsp;'+obj.priv_name+'</a></li>');
                    		}
                    	}else{*/
                    		if(obj.priv_icon != undefined && obj.priv_icon != ""){
                    			treeElement.push('<li class="active"><a class="fa '+obj.priv_icon+'" href=javascript:mainpageLoad("'+obj.priv_uri+'")>&nbsp;&nbsp;&nbsp;'+obj.priv_name+'</a></li>');
                    		}else{
                    			treeElement.push('<li class="active"><a class="fa fi-thumbnails icon-blue" href=javascript:mainpageLoad("'+obj.priv_uri+'")>&nbsp;&nbsp;&nbsp;'+obj.priv_name+'</a></li>');
                    		}
                    	//}
                    }
            	});
            }
        }
    }
    window.mMenu = new mMenu();
})(window);