//$(function(){  
//      $.ajax({  
//          type:"GET",  
//          url:"r'^do_add_business/$', 'do_add_business'",
//          data:"null",
//          success: function(returnData){  
//              var str="<ul>";
//              $.each(returnData,function(i,n){  
//                  str+="<li>"+"ID："+n.id+"</li>";
//                  str+="<li>"+"标题："+n.title+"</li>";
//                  str+="<li>"+"地址："+n.url+"</li>";
//              });  
//              str+="</ul>";  
//              $("div").append(str);  
//          }  
//      });  
//  });  
//$(function(){
//      $("#page").paging({
//          total:20,
//          numberPage:10
//      }, function (msg) {//回调
//          $("#callBack span").text(msg)
//      });
//
//  });
function getRootPath() {
	/*var pathName = window.location.pathname.substring(1);
	var webName = pathName == '' ? '' : pathName.substring(0, pathName
			.indexOf('/'));
	if (webName == "") {
		return window.location.protocol + '//' + window.location.host;
	} else {
		return window.location.protocol + '//' + window.location.host + '/'
				+ webName;
	}*/
	return site_url;
}
function doClick(){
//$("#listForm").serialize();
/*alert($("#listForm").serialize());
var param={"busi_id":$("#firstname").val()};
alert(param);
	$.ajax({
		type: 'POST',
	  	url: window.parent.getRootPath()+"/do_add_business",
	  	data: param,
	  	success: function(returnData){
	  		eval();
			alert(returnData.msg);
		},
	  	dataType: 'json'
	});
	*/
}

$(function(){
	searchApplyInfo();
});


function searchApplyInfo(){
	$('#page3').empty();
	$('#page3').scroPage({
	    url : window.parent.getRootPath()+"get_business_paging/",
	    asyncLoad : true,
	    asyncType : 'POST',
	    serverSidePage : false,
	    render : function(data){
	    	var tb = $('#dataGridTableJson tbody');
	    	$(tb).empty();
	    	window.parent.hideLayerLoading();
	    	if(data && data.list && data.list.length > 0){
	    		$.each(data.list,function(i,row){
	    			var tr = $('<tr>');
	    			
	    			$(tr).append('<td>'+row.bis_id+'</td>');
	    			$(tr).append('<td>'+row.bis_name+'</td>');
	    			if(row.status==0){
	    				$(tr).append('<td>有效</td>');
	    			}else{
	    				$(tr).append('<td>无效</td>');
	    			}
	    			$(tr).append('<td>'+row.create_op+'</td>');
	    			$(tr).append('<td>'+row.create_date+'</td>');
	    			$(tr).append('<td>'+row.mark+'</td>');
	    			$(tr).append('<td><input type="button" value="修改" onclick="updateInfo(\''+row.bis_id+'\',\''+row.bis_name+'\',\''+row.mark+'\');" class="button" style="margin-left: 15px;"/><input type="button" value="删除" onclick="deleteInfo(\''+row.id+'\',\''+row.app_name+'\');" class="button" style="margin-left: 15px;"/></td>');
	    			
	    			$(tb).append(tr);
	    		});
	    	}
	    	$("#pagerAddBtn").show();
	    },
	    params : function(){
	        return {
	        	/*applyType:$("#applyType").val(),
	        	appName:$("#appName").val(),
	        	appIp:$("#appIp").val()*/
	        };
	    }
	});
	
}

function updateInfo(id,name,mark){
	$("#bis_name").val(name);
	$("#mark").val(mark);
	$("#bis_id").val(id);
	$("#status_div").css("display","");
	$(".form").show();
	$(".mask").show();
}



function showLayerLoading(con,time){
	layer.msg(con,{icon: 16,shade: 0.2,time: time});
}
function hideLayerLoading(){
	layer.closeAll();
}




