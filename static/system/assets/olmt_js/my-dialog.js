/*-------------------------------------------------01.对话框:消息框BootstrapDialog-------------------------------------------------*/

/**
 * 对话框:提示消息框,两秒后自动消失
 * @author JayTan
 * @param str
 */
function BS_openAlertMsg(str){
	var dlg = BootstrapDialog.show({
		title:'提示信息',
	    message: str
	});
	setTimeout(function(){
	    dlg.close();
	},2000);
}

function BS_openAlertMsg_V2(str){
	var dlg = BootstrapDialog.show({
		type:BootstrapDialog.TYPE_DANGER,
		title:'提示信息',
	    message: str
	});
	setTimeout(function(){
	    dlg.close();
	},2000);
}

function BS_openAlertMsg_V3(str){
	var dlg = BootstrapDialog.show({
		type:BootstrapDialog.TYPE_SUCCESS,
		title:'提示信息',
	    message: str
	});
	setTimeout(function(){
	    dlg.close();
	},2000);
}

/**
 * 对话框:提示消息框,两秒后自动消失
 * @author JayTan
 * @param str
 */
function BS_openAlertErrMsg(str){
	var dlg = BootstrapDialog.show({
		type : BootstrapDialog.TYPE_DANGER,
		title:'错误信息',
	    message: str
	});
	setTimeout(function(){
	    dlg.close();
	},2000);
}

/**
 * 弹出错误提示的登录框，调用方式：BS_openErrorMsg("错误提示",testFunc);/BS_openErrorMsg("错误提示");
 * @param str 显示字符串
 * @param func 对话框关闭时带入callback方法
 * 
 * @author JayTan
 * */
function BS_openErrorMsg(str, func) {
    // 调用show方法
    BootstrapDialog.show({
        type : BootstrapDialog.TYPE_DANGER,
        title : '错误提示 ',
        message : str,
        size : BootstrapDialog.SIZE_SMALL,//size为小，默认的对话框比较宽
        buttons : [ {// 设置关闭按钮
            label : '关闭',
            action : function(dialogItself) {
                dialogItself.close();
            }
        } ],
        // 对话框关闭时带入callback方法
        onhide : func
    });
}

/**
 * confirm确认选择框 ，
 * 调用方式：BS_openConfirmMsg("选择确认",testFuncOk,testFuncClose);/BS_openConfirmMsg("选择确认",testFuncOk);
 * @param str 显示信息
 * @param funcok 点击确认执行的回调函数
 * @param funcclose 点击关闭执行的回调函数
 * 
 * @author JayTan
 * */
function BS_openConfirmMsg(str, funcok, funcclose) {
    BootstrapDialog.confirm({
        title : '选择确认',
        message : str,
        type : BootstrapDialog.TYPE_PRIMARY, // <-- Default value is
        // BootstrapDialog.TYPE_PRIMARY
        closable : true, // <-- Default value is false，点击对话框以外的页面内容可关闭
        draggable : true, // <-- Default value is false，可拖拽
        btnCancelLabel : '取消', // <-- Default value is 'Cancel',
        btnOKLabel : '确定', // <-- Default value is 'OK',
        btnOKClass : 'btn-warning', // <-- If you didn't specify it, dialog type
        size : BootstrapDialog.SIZE_SMALL,
        // 对话框关闭的时候执行方法
        //onhide : funcclose,
        callback : function(result) {
            // 点击确定按钮时，result为true
            if (result) {
                // 执行方法
                funcok.call();
            }else{
            	funcclose.call();
            }
        }
    });
}
/**
 * 如果你希望点击取消的时候不做任何回调操作，那么可以使用下面的方法，反则使用上面的方法
 * */
function BS_openConfirmMsg(str, funcok) {
    BootstrapDialog.confirm({
        title : '选择确认',
        message : str,
        type : BootstrapDialog.TYPE_PRIMARY, // <-- Default value is
        // BootstrapDialog.TYPE_PRIMARY
        closable : true, // <-- Default value is false，点击对话框以外的页面内容可关闭
        draggable : true, // <-- Default value is false，可拖拽
        btnCancelLabel : '取消', // <-- Default value is 'Cancel',
        btnOKLabel : '确定', // <-- Default value is 'OK',
        btnOKClass : 'btn-warning', // <-- If you didn't specify it, dialog type
        size : BootstrapDialog.SIZE_SMALL,
        // 对话框关闭的时候执行方法
        onhide : function(){},
        callback : function(result) {
            // 点击确定按钮时，result为true
            if (result) {
                // 执行方法
                funcok.call();
            }
        }
    });
}
/**
 * 功能和上面得函数一样，只是这个方法显示的是黄色背景标题栏
 * */
function BS_openConfirmMsg_v2(str, funcok, funcclose) {
    BootstrapDialog.confirm({
        title : '选择确认',
        message : str,
        type : BootstrapDialog.TYPE_WARNING,
        closable : true, // <-- Default value is false，点击对话框以外的页面内容可关闭
        draggable : true, // <-- Default value is false，可拖拽
        btnCancelLabel : '取消', // <-- Default value is 'Cancel',
        btnOKLabel : '确定', // <-- Default value is 'OK',
        btnOKClass : 'btn-warning', // <-- If you didn't specify it, dialog type
        size : BootstrapDialog.SIZE_SMALL,
        // 对话框关闭的时候执行方法
        //onhide : funcclose,
        callback : function(result) {
            // 点击确定按钮时，result为true
            if (result) {
                // 执行方法
                funcok.call();
            }else{
            	funcclose.call();
            }
        }
    });
}
/**
 * 如果你希望点击取消的时候不做任何回调操作，那么可以使用下面的方法，反则使用上面的方法
 * */
function BS_openConfirmMsg_v2(str, funcok) {
    BootstrapDialog.confirm({
        title : '选择确认',
        message : str,
        type : BootstrapDialog.TYPE_WARNING,
        closable : true, // <-- Default value is false，点击对话框以外的页面内容可关闭
        draggable : true, // <-- Default value is false，可拖拽
        btnCancelLabel : '取消', // <-- Default value is 'Cancel',
        btnOKLabel : '确定', // <-- Default value is 'OK',
        btnOKClass : 'btn-warning', // <-- If you didn't specify it, dialog type
        size : BootstrapDialog.SIZE_SMALL,
        // 对话框关闭的时候执行方法
        onhide : function(){},
        callback : function(result) {
            // 点击确定按钮时，result为true
            if (result) {
                // 执行方法
                funcok.call();
            }
        }
    });
}

/**
 * 成功提示对话框，3秒后自动关闭
 *    调用方式 ：BS_openSuccessMsg("操作成功",testFunc)/BS_openSuccessMsg("操作成功")
 * @param str 提示信息
 * @param func 窗口关闭执行的回调函数
 * 
 * @author JayTan
 * */
function BS_openSuccessMsg(str, func) {
    BootstrapDialog.show({
        type : BootstrapDialog.TYPE_SUCCESS,
        title : '操作成功 ',
        message : str,
        size : BootstrapDialog.SIZE_SMALL,
        buttons : [ {
            label : '确定',
            action : function(dialogItself) {
                dialogItself.close();
            }
        } ],
        // 指定时间内可自动关闭
        onshown : function(dialogRef) {
            setTimeout(function() {
                dialogRef.close();
            }, 2000);
        },
        onhide : func
    });
}


/*-------------------------------------------------02.对话框:消息框toastr-------------------------------------------------*/
/**
 * 设置toastr的显示位置和提示类别
 * @param status 提示类别: 1：success,2:info,3:warning,4:error
 * @param pos 显示位置: 1:Top Right,2:Bottom Right,3:Bottom Left,
 * 					 4:Top Left,5:Top Full Width,6:Bottom Full Width,
 * 					 7:Top Center,8:Bottom Center
 * */
function TS_setToastrmessageOpts(status,pos,str){
	var pos_str = "toast-top-center";
	if(1 == pos){
		pos_str = "toast-top-right";
	}else if(2 == pos){
		pos_str = "toast-botton-right";
	}else if(3 == pos){
		pos_str = "toast-bottom-left";
	}else if(4 == pos){
		pos_str = "toast-top-left";
	}else if(5 == pos){
		pos_str = "toast-top-full-width";
	}else if(6 == pos){
		pos_str = "toast-bottom-full-width";
	}else if(7 == pos){
		pos_str = "toast-top-center";
	}else if(8 == pos){
		pos_str = "toast-bottom-center";
	}
	
	toastr.options = {  
			closeButton: false,  
            debug: false,  
            progressBar: false,  
            positionClass: pos_str,  
            onclick: null,  
            showDuration: "300",  
            hideDuration: "1000",  
            timeOut: "3000",  
            extendedTimeOut: "1000",  
            showEasing: "swing",  
            hideEasing: "linear",  
            showMethod: "fadeIn",  
            hideMethod: "fadeOut"  
    };
	//var $toast = toastr['error']('123', 'title');
	
	if(1 == status){
		toastr.success(str,"成功");
	}else if(2 == status){
		toastr.info(str,"提示");
	}else if(3 == status){
		toastr.warning(str,"警告");
	}else if(4 == status){
		toastr.error(str,"错误");
	}
}
/**
 * 根据参数显示位置和提示类别
 * @param status 提示类别: 1：success,2:info,3:warning,4:error
 * @param pos 显示位置: 1:Top Right,2:Bottom Right,3:Bottom Left,
 * 					 4:Top Left,5:Top Full Width,6:Bottom Full Width,
 * 					 7:Top Center,8:Bottom Center
 * */
function TS_openAlertMsg(str,status,pos){
	TS_setToastrmessageOpts(status,pos,str);
}


/*****************************************页面加载对话框***********************************************/
/**
 * 对话框:加载URL页面窗口[window,当前窗口]
 * 
 * <P>
 * ok回调函数若返回false，则窗口会继续停留；否则默认关闭
 * </P>
 * 
 * @param t
 *            标题
 * @param u
 *            URL地址
 * @param ok
 *            确定按钮回调函数
 * @param cancel
 *            取消按钮回调函数
 * @param w
 *            宽，默认500px
 * @param h
 *            高，默认200px
 */
function openSelfHtmlDialog(t, u, ok, cancel, w, h)
{
	$.get(u.url(), function(data)
	{
		showAICFDialogInWindow(t, data, ok, cancel, w, h);
	});
}

/**
 * 打开一个能返回操作值的dialog，需要被打开页面定义返回必要数据的方法callRetData(固定名称),
 * 在需要的地方统一调用该方法弹出层或得返回值，不能用window.open() 和 window.showModalDialog()
 * @param url 弹出层界面url
 * @param w 弹出层宽度 按百分比使用值在【0~100之间】
 * @param h 弹出层高度 按百分比使用值在【0~100之间】
 * @param title 弹出层标题
 * @param setRetData 弹出页返回参数信息后的回调方法，该方法要求必须定义callRetData 方法，否则返回失败
 * 			若不需要返回值加载页弹窗，请调用openDialogWin方法
 * 调用方式：openVretDialogWin("rest/page/userinfo",45,90,"用户管理","setRetData_test");
 * @author JayTan
 * 
 * */
function openVretDialogWin(url,w,h,title,setRetData){
	layer.open({
	    type: 2,
	    title: title,
	    shadeClose: true,
	    shade: 0.4,
	    area: [w+'%', h+'%'],
	    content: url,
	    btn: ['确定','关闭'],
	    yes: function(index){
	        //当点击‘确定’按钮的时候，获取弹出层返回的值
	        var ret_value = window["layui-layer-iframe" + index].callRetData();
	        //打印返回的值，看是否有我们想返回的值。
	        //console.log(res);
	        //最后关闭弹出层
	        layer.close(index);
	        //return setRetData(ret_value);
	        eval(setRetData+"(ret_value)"); 
	    },
	    cancel: function(){
	        //右上角关闭回调
	    }
	});
}
/**
 * @param callFunc 点击确定的回调方法
 * 调用方式：openScreenWindow("rest/page/userinfo",45,90,"用户管理","testFuncC");
 * @author JayTan
 * */
function openDialogWin(url,w,h,title,callFunc){
	layer.open({
	    type: 2,
	    title: title,
	    shadeClose: true,
	    shade: 0.4,
	    area: [w+'%', h+'%'],
	    content: url,
	    btn: ['确定','关闭'],
	    yes: function(index){
	        //关闭弹出层
	        layer.close(index);
	        //最后回调
	        eval(callFunc+"()");
	    },
	    cancel: function(){
	        //右上角关闭回调
	    }
	});
}
/**
 * 打开一个新窗口，大小及样式和浏览器类似
 * */
function openScreenWindow(url, width, height, args, bReplace)
{
	args = args || "_blank";
	var swidth = window.screen.availWidth;
	var sheight = window.screen.availHeight;
	//alert(swidth +"----"+sheight);
	var Wwidth = width || 0;
	var Wheight = height || 0;
	if (Wwidth <= 0 || Wwidth > swidth)
	{
		Wwidth = parseInt(parseFloat(swidth) * 0.95);
	}
	if (Wheight <= 0 || Wheight > sheight)
	{
		Wheight = parseInt(parseFloat(sheight) * 0.90);
	}
	var iTop = (sheight - Wheight) / 2; // 获得窗口的垂直位置;
	if (iTop > 25)
	{
		iTop = iTop - 25;
	}
	var iLeft = (swidth - Wwidth) / 2; // 获得窗口的水平位置; 

	if (url.indexOf("http:")!=0)
		url = OLMT_CTX + "/" + url;
	var vReturnValue = window.open(url, args, "height=" + sheight + ",width=" + swidth 
			+ ",status=yes,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no", bReplace);
	vReturnValue.focus();
	return 'true';
}



