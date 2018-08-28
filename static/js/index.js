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
	return site_url;
}

$(function(){
	searchApplyInfo();
});


function searchApplyInfo(){
	$('#page3').empty();
	$('#page3').scroPage({
	    url : site_url+"get_business_paging/",
	    asyncLoad : true,
	    asyncType : 'POST',
	    serverSidePage : false,
	    render : function(data){
	    	var tb = $('#dataGridTableJson tbody');
	    	$(tb).empty();
	    	//window.parent.hideLayerLoading();
	    	if(data && data.list && data.list.length > 0){
	    		$.each(data.list,function(i,row){
	    			var tr = $('<tr onclick="selectItem(\''+row.bis_id+'\',\''+row.bis_name+'\')">');
	    			
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
	    			$(tr).append('<td><input type="button" value="修改" onclick="updateInfo(\''+row.bis_id+'\',\''+row.bis_name+'\',\''+row.mark+'\',\''+row.status+'\');" class="button" style="margin-left: 15px;padding:0 7px;border:none;"/><input type="button" value="删除" onclick="deleteInfo(\''+row.bis_id+'\',\''+row.bis_name+'\');" class="button" style="margin-left: 15px;padding:0 7px;border:none;background-color:red;"/></td>');
	    			
	    			$(tb).append(tr);
	    		});
	    	}
	    	$("#pagerAddBtn").show();
	    },
	    params : function(){
	        return {
	        	bis_name:$("#search_name").val(),
	        };
	    }
	});
	
}

var selData = {};
function selectItem(id,name){
	//alert('id:'+id+'----name:'+name);
	selData["id"]=id;
	selData["name"]=name;
}

function callRetData(){
	return selData;
}

var index;
function showLoading(con,time){
	index = layer.msg(con,{icon: 16,shade: 0.2,time: time});
}
function hideLayerLoading(){
	layer.close(index);
}

//修改
function goClick(){
	$.ajax({
		type: 'POST',
	  	url: site_url+"do_modify_business/",
	  	data: {
	  		status:$('#status_div input:radio:checked').val(),
	  		bis_id:$("#modify_id").val(),
	  		bis_name:$("#modify_name").val(),
	  		mark:$("#modify_mark").val()
	  	},
	  	success: function(returnData){
			if(returnData=='false'){
				alert('修改失败');
				$(".modify_form").hide();
				$(".modify_mask").hide();
			}
			else{
				//alert(returnData.msg);
				searchApplyInfo();
				$(".modify_form").hide();
				$(".modify_mask").hide();
			}
		},
	  	dataType: 'json'
	});
}

function updateInfo(id,name,mark,status){
	$("#modify_name").val(name);
	$("#modify_mark").val(mark);
	$("#modify_id").val(id);
	$("input[name='status'][value="+status+"]").attr("checked",true); 
	$("#status_div").css("display","");
	$(".modify_form").show();
	$(".modify_mask").show();
}
//删除
function deleteInfo(id,name){
	$.ajax({
		type:"post",
		url: site_url+"do_del_business/",
		data: {
	  		bis_id:id,
	  		bis_name:name
	  },
	  	success: function(returnData){
			$(this).parent().remove()
   			if(returnData=="false"){
   				alert("删除失败");
   			}
   			else{
   				//alert(returnData.msg);
   				searchApplyInfo();
   			}
           
		},
	  	dataType: 'json'
	});
}

//搜索
function search(){
	searchApplyInfo();
}

/*function navType(type){
	debugger
    $.ajax({  
        type:"post",  
        url: site_url+"get_curr_user_priv/",
        success: function(returnData){
   			if(!returnData.code){
   				alert(returnData.msg);
   			}
   			else{
   				data = returnData.list;
   				for (var i=0;i<data.length;i++){
   					if(type == 1){
   						if(priv_code.id == type){
   							$("#textType").append("<ul><li><a href="+data[i].a_name+"></a><ul><li>"+data[i].li_name+"</li></ul></li></ul>")
   						}
   						else{
   							
   						}
   					}
   					else{
   						alert(returnData.msg);
   					}
   				}
   			}
		},
    });  
}; */ 





