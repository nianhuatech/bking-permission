//弹出窗口  
var Common = {  
    dialog:function(properties){  
        var width = window.screen.availWidth; //网页可见区域宽  
        var height = window.screen.availHeight; //网页可见区域高  
        var modal = false; /*非模态窗口*/  
        var winName = "_blank"; var scroll = "yes"; var resizable = "yes"; var status = "no"; var fullscreen = "no"; //var center = "yes"; var help = "no";  
        var url = properties.url; var id=""; var title=""; var lock = true; /*锁*/ var fieldId=""; var fieldName=""; var openerWin=null;  
        if (properties.modal != undefined) modal = properties.modal;  
        if (properties.fieldId != undefined) fieldId = properties.fieldId; // 字段ID  
        if (properties.fieldName != undefined) fieldName = properties.fieldName; // 字段名称  
        if (properties.width != undefined) width = properties.width;  
        if (properties.height != undefined) height = properties.height;  
        //if (properties.center != undefined) center = properties.center;  
        //if (properties.help != undefined) help = properties.help;  
        var iTop = (window.screen.height - height) / 2;  
        var iLeft = (window.screen.width - width) / 2;  
        if (properties.iTop != undefined) iTop = properties.iTop;  
        if (properties.iLeft != undefined) iLeft = properties.iLeft;  
        if (fieldId!="" && fieldName!=""){ // 存在参数  
            if (url.indexOf("?")>=0)  
                url = url +"&fieldId="+fieldId+"&fieldName="+fieldName;  
            else  
                url = url +"?fieldId="+fieldId+"&fieldName="+fieldName;  
        }  
        if(modal){  
            if (properties.id != undefined) id = properties.id;  
            if (properties.title != undefined) title = properties.title;  
            if (properties.lock != undefined) lock = properties.lock;  
            if (properties.openerWin != undefined) openerWin = properties.openerWin; //  父窗口对象  
            if (properties.width == undefined){  
                width = document.body.clientWidth; //网页可见区域宽  
                width = width - 80;  
            }  
            if (properties.height == undefined){  
                height = document.body.clientHeight; //网页可见区域高  
                height = height - 50;  
            }  
            if(openerWin == null){  
                $.dialog({ id:id, title:title, lock: lock, fixed: true, width: width+"px", height: height+"px", content: "url:"+url });  
            }else{  
                openerWin.$.dialog({ id:id, title:title, lock: lock, fixed: true, width: width+"px", height: height+"px", content: "url:"+url, parent:frameElement.api });  
            }  
            //return window.showModalDialog(url,window,"dialogLeft="+iLeft+";dialogTop="+iTop+";dialogWidth="+width+"px;dialogHeight="+height+"px;resizable="+resizable+";scroll="+scroll+";status="+status+";center="+center+";help="+help+";");  
        }else{  
            if (properties.winName != undefined) winName = properties.winName;  
            if (properties.scroll != undefined) scroll = properties.scroll;  
            if (properties.resizable != undefined) resizable = properties.resizable;  
            if (properties.status != undefined) status = properties.status;  
            if (properties.fullscreen != undefined) fullscreen = properties.fullscreen;  
            return window.open(url,winName,'height='+(height-80)+',width='+(width-10)+',top='+iTop+',left='+iLeft+',scrollbars='+scroll+',resizable='+resizable+',status='+status+',fullscreen='+fullscreen+',location=no,toolbar=no,menubar=no');  
        }  
    },  
    singleUserSelect:function(properties){ //单选用户  
        var fieldId = "", fieldName = "", param = "";  var openerWin=null;  
        var width = 600; //网页可见区域宽  
        var height = document.body.clientHeight-30; //网页可见区域高  
        if(properties != undefined){  
            if (properties.fieldId != undefined && properties.fieldName != undefined){  
                fieldId = properties.fieldId; // 字段ID  
                fieldName = properties.fieldName; // 字段名称  
                var userId = document.getElementById(fieldId).value;  
                var userName = encodeURI(encodeURI(document.getElementById(fieldName).value));//两次编码,后台解码  
                param = "&userId="+userId+"&userName="+userName+"&fieldId="+fieldId+"&fieldName="+fieldName;  
            }  
            if (properties.hideState != undefined) param += "&hideState="+properties.hideState; //隐藏状态，默认不显示隐藏；hideState=y显示隐藏组织、用户,  
            if (properties.dialogFrameId != undefined) param += "&dialogFrameId="+properties.dialogFrameId; // 窗口IFrame,ID  
            if (properties.width != undefined) width = properties.width;  
            if (properties.height != undefined) height = properties.height;  
            if (properties.openerWin != undefined) openerWin = properties.openerWin; //  父窗口对象  
        }  
        if(openerWin == null){  
        	BootstrapDialog.dialog({ id:"singleUserDLG", title:"人员选择框(单选)", lock: true, fixed: true, width: width+"px", height: height+"px", content: "url:"+ctx+"/sysorganization/userSelect.do?stype=single"+param });  
        }else{  
            openerWin.$.dialog({ id:"singleUserDLG", title:"人员选择框(单选)", lock: true, fixed: true, width: width+"px", height: height+"px", content: "url:"+ctx+"/sysorganization/userSelect.do?stype=single"+param, parent:frameElement.api });  
        } //return Common.dialog({url:ctx+"/sysorganization/userSelect.do?selectType=single"+param,width:600,height:600,modal:true});  
    },  
    multiUserSelect:function(properties){ //多选用户  
        var fieldId = "", fieldName = "", limitSize = 100, param = ""; var openerWin=null;  
        var width = 600; //网页可见区域宽  
        var height = document.body.clientHeight-30; //网页可见区域高  
        if(properties != undefined){  
            if (properties.fieldId != undefined && properties.fieldName != undefined){  
                fieldId = properties.fieldId; // 字段ID  
                fieldName = properties.fieldName; // 字段名称  
                var userId = document.getElementById(fieldId).value;  
                var userName = encodeURI(encodeURI(document.getElementById(fieldName).value));//两次编码,后台解码  
                param = "&userId="+userId+"&userName="+userName+"&fieldId="+fieldId+"&fieldName="+fieldName;  
            }  
            if (properties.hideState != undefined) param += "&hideState="+properties.hideState; //隐藏状态，默认不显示隐藏；hideState=y显示隐藏组织、用户,  
            if (properties.dialogFrameId != undefined) param += "&dialogFrameId="+properties.dialogFrameId; // 窗口IFrame,ID  
            if (properties.limitSize != undefined){ param += "&limitSize="+properties.limitSize; /*限制选择用户数*/ }else{ param += "&limitSize="+limitSize; /*默认100个用户*/ }  
            if (properties.lmtPersonId != undefined) param += "&lmtPersonId="+properties.lmtPersonId;  
            if (properties.lmtOrgId != undefined) param += "&lmtOrgId="+properties.lmtOrgId;  
            if (properties.lmtRoleId != undefined) param += "&lmtRoleId="+properties.lmtRoleId;  
            if (properties.width != undefined) width = properties.width;  
            if (properties.height != undefined) height = properties.height;  
            if (properties.openerWin != undefined) openerWin = properties.openerWin; //  父窗口对象  
        }else{  
            param = "&limitSize="+limitSize;  
        }  
        if(openerWin == null){  
            $.dialog({ id:"multiUserDLG", title:"人员选择框(多选)", lock: true, fixed: true, width: width+"px", height: height+"px", content: "url:"+ctx+"/sysorganization/userSelect.do?stype=multi"+param });  
        }else{  
            openerWin.$.dialog({ id:"multiUserDLG", title:"人员选择框(多选)", lock: true, fixed: true, width: width+"px", height: height+"px", content: "url:"+ctx+"/sysorganization/userSelect.do?stype=multi"+param, parent:frameElement.api });  
        }  
    },  
    clearFieldValue:function(properties){ //清空字段值  
        var fieldId=""; var fieldName="";  
        if (properties.fieldId != undefined) fieldId = properties.fieldId; // 字段ID  
        if (properties.fieldName != undefined) fieldName = properties.fieldName; // 字段名称  
        if(fieldId!="") $("#"+fieldId).val("");  
        if(fieldName!="") $("#"+fieldName).val("");  
    },  
    showBottomMsg:function(msg){ //底部居中提示,延迟4秒自动关闭  
        $.messager.show({title:"提示",msg:msg,showType:"slide",style:{right:"",top:"",bottom:-document.body.scrollTop-document.documentElement.scrollTop}});  
    },  
    clearForm:function(f_id){ //重置表单  
        var f = $("#"+f_id);  
        f.find(":input:hidden").each(function(i){  
           this.value="";  
        });  
        f.get(0).reset();  
    },  
    getFormJson:function(id){ //将form中的值转换为键值对,例如：{id:'1',name: 'name01'}  
        var paramJson = {};   
        var fields = $("#"+id).serializeArray(); //返回的JSON对象是由一个对象数组组成的 [ {name: 'firstname', value: 'Hello'}, {name: 'lastname', value: 'World'}, {name: 'alias'}, // this one was empty ]  
        jQuery.each(fields, function(i, field){   
            paramJson[this.name] = this.value || '';  
        });   
        return paramJson;  
    },  
    downloadFile:function(id){//公共附件下载  
        $("#frameForDownload").remove();  
        var iframe = document.createElement("iframe");  
        iframe.id = "frameForDownload";  
        iframe.src = ctx+"/filedownload?fileid="+id;  
        iframe.style.display = "none";  
        document.body.appendChild(iframe); //创建完成之后，添加到body中  
    },  
    colseDialog:function(){  
        frameElement.api.close(); // 关闭窗口  
    },  
    setTopDialog:function(){  
        frameElement.api.zindex(); // 置顶窗口  
    }  
};