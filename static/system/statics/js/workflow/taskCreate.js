function addTab(type){
	var url = '';
	if(type == "qingjia"){
		url = OLMT_CTX+'/rest/page/business/workflow/InitLeave';
		$('#mainFrameTabs').bTabsAdd("qingjia","请假列表",url,"");
	}else if(type == "baoxiao"){
		url = OLMT_CTX+'/rest/page/business/workflow/InitResement';
		$('#mainFrameTabs').bTabsAdd("baoxiao","报销列表",url,"");
	}else{
		url = OLMT_CTX+'/rest/page/business/workflow/InitLeave';
		$('#mainFrameTabs').bTabsAdd("qingjia","请假列表",url,"");
	}
}