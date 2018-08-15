/**
 * Created by ze on 2015/11/17.
 */
jQuery(document).ready(function () {
//下拉菜单dropmenu出现在浏览器之外的处理
    $(".dropdown-toggle").on("click",function(){
       // var sel = $(this);
        var self = $(this).next($('.dropdown-menu')), selfh = self.height()+15, selfw = self.width();
        var win = $(window), ww = win.width(), wh = win.height(), wl = win.scrollLeft(), wt = win.scrollTop();
        var st = self.offset().top, sl = self.offset().left;
        //判断宽度超出
        if(ww + selfw  > ww + wl){
            self.css({"left":"-"+ selfw/2 + "px"});
        }
        //判断高度超出
        if(st - selfh > wh){
            self.css({"top":"-"+ selfh + "px"});
        }

    })
    // Tooltip
    jQuery('.tooltips').tooltip({container: 'body'});

// Popover
    jQuery('.popovers').popover();

// Close Button in Panels
    jQuery('.panel .panel-close').click(function () {
        jQuery(this).closest('.panel').fadeOut(200);
        return false;
    });

// Minimize Button in Panels
    jQuery('.minimize').click(function () {
        var t = jQuery(this);
        var p = t.closest('.panel');
        if (!jQuery(this).hasClass('maximize')) {
            p.find('.panel-body, .panel-footer').slideUp(200);
            t.addClass('maximize');
            t.html('+');
        } else {
            p.find('.panel-body, .panel-footer').slideDown(200);
            t.removeClass('maximize');
            t.html('−');
        }
        return false;
    });

})

//table列表的全选
var all = $("input[name='check-all']");
var list = $("input[name='check-list']");
$(all).click(function(){
    if(this.checked){
        $(list).attr("checked", true);
    }else{
        $(list).attr("checked", false);
    }
});




