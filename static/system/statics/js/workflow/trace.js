function graphTrace(id) {
	debugger
    // 获取图片资源
    var imageUrl =  OLMT_CTX+'/rest/processMgr/process/processinstance?pid=' + id + '&type=png';
    
	$.ajax({
        type: "POST",
        url:  OLMT_CTX+'/rest/processMgr/process/trace/' + id,
        data: {},
        success: function (data) {
        	debugger
            var positionHtml = "";
            // 生成图片
            var varsArray = new Array();
            $.each(data, function(i, v) {
                var $positionDiv = $('<div/>', {
                    'class': 'activity-attr'
                }).css({
                    position: 'absolute',
                    left: (v.x),
                    top: (v.y),
                    width: (v.width),
                    height: (v.height),
                    backgroundColor: 'black',
                    opacity: 0,
                    zIndex: $.fn.qtip.zindex - 1
                });

                // 跟踪节点边框
                var $border = $('<div/>', {
                    'class': 'activity-attr-border'
                }).css({
                    position: 'absolute',
                    left: (v.x),
                    top: (v.y),
                    width: (v.width),
                    height: (v.height),
                    zIndex: $.fn.qtip.zindex - 2
                });

                if (v.currentActiviti) {
                    $border.addClass('ui-corner-all-12').css({
                        border: '3px solid #5A78FF'
                    });
                }
                positionHtml += $positionDiv.outerHTML() + $border.outerHTML();
                varsArray[varsArray.length] = v.vars;
            });
            debugger
            if ($('#workflowTraceDialog').length == 0) {
                $('<div/>', {
                    id: 'workflowTraceDialog',
                    //title: '查看流程节点信息',
                    style:'display: none;',
                    html: "<div><img src='" + imageUrl + "'style='left:0px; top:0px;' />" +
                    "<div id='processImageBorder'>" +
                    positionHtml +
                    "</div>" +
                    "</div>"
                }).appendTo('body');
            } else {
                $('#workflowTraceDialog img').attr('src', imageUrl);
                $('#workflowTraceDialog #processImageBorder').html(positionHtml);
            }

            // 设置每个节点的data
            $('#workflowTraceDialog .activity-attr').each(function(i, v) {
                $(this).data('vars', varsArray[i]);
            });
            
            // 此处用于显示每个节点的信息，如果不需要可以删除
            $('.activity-attr').on('mouseover',function(){
            	var vars = $(this).data('vars');
            	var tipContent = "";
                $.each(vars, function(varKey, varValue) {
                    if (varValue) {
                        tipContent += varKey + " : " + varValue + "<br/>";
                    }
                });
                var tip_index;
                if ($(this).data('hasTip')) {
                    layer.close($(this).data('tipIndex'));
                }
                tip_index = layer.tips(tipContent, this, {
                    tips: [1, '#3595CC'],
                    time: 400000
                });
                $(this).data('hasTip', true).data('tipIndex', tip_index);
            });
            
            //离开关闭 tips
            $('.activity-attr').on('mouseleave',function(){
            	layer.close($(this).data('tipIndex'));
            	$(this).data('hasTip', false);
            });
            
            layer.open({
        	   	type: 1,
        	    title: "查看流程",
        	    shadeClose: true,
        	    shade: 0.4,
        	    area: ['55%', '75%'],
        	    content: jQuery("#workflowTraceDialog"),
        	    btn: ['关闭'],
        	    yes: function(index){
        	    	layer.close(index);
        	    	
        	    },
        	    success:function(layero,index){
        	    	
        	    },
        	    cancel: function(){
        	        //右上角关闭回调
        	    }	    
	       });
           
        }
	});
    

}
