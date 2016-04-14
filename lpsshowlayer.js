(function ($) {
    $.fn.lpsShowLayer = function (obj) {
        /***author:刘丕水
        date:2014/10/9 星期四
        使用方法：$(doc).showLpsLayer({
        });
        ***/
		var obj=$.extend({
				address:$(this).attr("src"),//默认为$(this)的src地址
				closeBtnStyle:"",//可通过样式display来控制标题和关闭按钮的显示隐藏
				closeLayer:false,//默认0，不关闭遮罩层
				layerPadding:"60px",//默认为60px不支持百分比
				stretch:false,//默认false,不拉伸图片;只有type为img的情况下有效
				title:$(this).attr("alt"),//默认为$(this)的alt
				titleStyle:"",//可通过样式display来控制标题和关闭按钮的显示隐藏
				layerBoxStyle:"box-shadow:0 4px 16px #000;",//layerbox的样式,默认有阴影,可自定义
				layerCoverStyle:"",//可通过样式display来控制遮罩层半透明背景的显示隐藏，默认显示
				type:"img",//默认为img
				show:function(){},//function(data){data.close()}；data为{close:closeLpsLayers}
				html:"",//自定义内部html代码，默认为空
				drag:false,//是否支持拖拽
				resize:false//是否支持改变大小
		},obj);
		/***添加DOM元素开始***/
		var layerNum="";
		var rootId="LpsLayer";//ID如果重复直接换此ID;
		for(var layerNum;$("#LpsLayer"+layerNum).length>0;layerNum++){}
        $("body").append("<div style='width: 100%; height: 100%; position: absolute; background: none; top: 0; left: 0; z-index: 9999;' id='"+rootId+layerNum+"'><div id='"+rootId+"Con"+layerNum+"' style='position: relative;height:100%;'><div id='"+rootId+"Title"+layerNum+"' style='overflow: hidden; background: #eee; height: 30px; line-height: 30px;width: 100%;'><span style='padding:0 26px 0 10px;display:block;'>"+(obj.title?obj.title:"")+"</span></div><span style='border: 1px solid #ccc; background: #fff; font-family: Microsoft Yahei; position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; line-height: 20px; text-align: center; cursor: pointer;' id='"+rootId+"Close"+layerNum+"'>X</span><div id='"+rootId+"ConInner"+layerNum+"' style='overflow:hidden;background:#fff;'></div><i id='"+rootId+"resizebtn"+layerNum+"' style='display:none;position:absolute;right:0;bottom:0;height:0;line-height:1px;border-bottom:12px solid #000;border-left:12px solid transparent;_border-left-color:#fff;z-index:10;cursor:nw-resize;'></i></div></div><div style='position: absolute; z-index: 999; background: #ccc; opacity: 0.6; filter: alpha(opacity=60); top: 0; left: 0; width: 100%; height: 100%;' id='"+rootId+"Cover"+layerNum+"'></div>");
		(obj.type == "img") ? $("#"+rootId+"ConInner"+layerNum).html("<img style='display:block;margin:0 auto;height:100%;' src='"+obj.address+"'/>") : $("#"+rootId+"ConInner"+layerNum).html("<iframe style='width:100%;height:100%;' frameBorder='0' src='"+obj.address+"'></iframe>");
		/***添加DOM元素结束***/
		/***获取须操作jquery dom对象***/
		var myObj={
				html            :$("html"),
				body            :function(){return this.html.find("body")},
				btnclose        :function(){return this.html.find("#"+rootId+"Close"+layerNum)},
//				content         :function(){var that=this;return that.html.find("#"+rootId+"Con"+layerNum)},
				contentinner    :function(){return this.html.find("#"+rootId+"ConInner"+layerNum)},
				iframe          :function(){return this.contentinner().find("iframe")},
				img             :function(){return this.contentinner().find("img")},
				layer           :function(){return this.html.find("#"+rootId+layerNum)},
				layercover      :function(){return this.html.find("#"+rootId+"Cover"+layerNum)},
				title           :function(){return this.html.find("#"+rootId+"Title"+layerNum)},
//				titletext       :function(){var that=this;return that.title().find("span")},
				resizebtn       :function(){return this.html.find("#"+rootId+"resizebtn"+layerNum)},
				win             :$(window)
		};
		//添加标题样式
		if(obj.titleStyle){myObj.title()[0].style.cssText += ";"+obj.titleStyle};
		//添加关闭按钮样式
		if(obj.closeBtnStyle){myObj.btnclose()[0].style.cssText += ";"+obj.closeBtnStyle};
		//添加背景遮罩层样式
		if(obj.layerCoverStyle){myObj.layercover()[0].style.cssText += ";"+obj.layerCoverStyle};
		//添加layerBox样式
		if(obj.layerBoxStyle){myObj.layer()[0].style.cssText += ";"+obj.layerBoxStyle};

		///显示遮罩层函数
        var lpsLayerShow = function () {
            myObj.html.css("overflow", "hidden");
            myObj.body().css("overflow", "hidden");
			var layerStyleSize=function(){
				var topN = myObj.win.scrollTop();
				var leftN = myObj.win.scrollLeft();
				myObj.layercover().css({"top":topN,"height":myObj.win.height()});
				myObj.layer().css({"overflow":"hidden","top":topN+parseInt(obj.layerPadding),"left":leftN+parseInt(obj.layerPadding),"width":myObj.win.width()-parseInt(obj.layerPadding)*2,"height":(myObj.win.height()-parseInt(obj.layerPadding)*2)});
				myObj.contentinner().height(myObj.win.height()-parseInt(obj.layerPadding)*2 - myObj.title().innerHeight());
			}
			layerStyleSize();
            myObj.win.resize(function () {layerStyleSize();});
			if (obj.type == "img" && !obj.stretch) {
                var imgLocation=function () {
                var conRate = myObj.contentinner().width()/myObj.contentinner().height()*1;
                var imgRate = parseInt(myObj.img().width())/parseInt(myObj.img().height());
				conRate / imgRate > 1 ? myObj.img().css({ "width": "", "height":myObj.contentinner().height() }) : myObj.img().css({ "width": myObj.contentinner().width(), "height": "" });
				}
                imgLocation();
                myObj.win.resize(function () { imgLocation(); });

            }else{
				myObj.img().css({"width":"100%","height":"100%"});
			}
        };
        //关闭遮罩层函数;
         var closeLpsLayers = function () {
            $("#"+rootId+layerNum).remove();
            $("#"+rootId+"Cover"+layerNum).remove();
			var layerNumExist="";//判断是否还有未关闭的层，如没有，则取消html及body的overflow:hidden;
			for(var layerNumExist;$("#"+rootId+layerNumExist).length>0;layerNumExist++){}
			if(layerNumExist==""){
				myObj.html.css("overflow", "");
				myObj.body().css("overflow", "");
			};
        };
		if (obj.closeLayer) {
            closeLpsLayers();
			return;
		}
        //obj.address ? address = obj.address : $(this).attr("src") ? address = $(this).attr("src") : address = prompt("缺少地址(address),请输入图片或者iframe地址", "http://www.baidu.com"); //如果未设定则获取$(this)的地址,如果$(this)没有地址则提示加上地址;
        //$(this).attr("src")?address=$(this).attr("src"):address=obj.address;
        if (obj.type == "img") {
            if (obj.address) {
                var imgsrcArr = obj.address.split('/');
                var imgName = imgsrcArr[imgsrcArr.length - 1].toLowerCase(); //获取图片名字
                if (!/\.(gif|jpg|jpeg|png|pic)$/.test(imgName)) {
						closeLpsLayers();
						return false;
                }
                ;
            }
            ;
        }
        ;
        lpsLayerShow();
		/***拖动层***/
		if(obj.drag){
			myObj.title().css("cursor","move")
			var isMouseDown=false;
			myObj.title().mousedown(function(e){
				myObj.layer().appendTo(myObj.body());
				myObj.layercover().css("height","100%");
				isMouseDown=true;
				var eOrgX=e.pageX,eOrgY=e.pageY,layerX=myObj.layer().offset().left,layerY=myObj.layer().offset().top;
				myObj.html.mousemove(function(e){
					if(isMouseDown){
					myObj.layer().css({"left":layerX+e.pageX-eOrgX,"top":layerY+e.pageY-eOrgY});
						if(/MSIE/.test(navigator.userAgent)){
							e.preventDefault();
						}
						return false;
					}
				});
			myObj.html.mouseup(function(){
				myObj.html.unbind("mousemove");
				isMouseDown=false;
			});
			});
		};

		//拖动右下角改变大小;
        if(obj.resize){
			var isResizeMouseDown=false;
			myObj.layer().hover(function(){myObj.resizebtn().css("display","block")},function(){myObj.resizebtn().css("display","none")});
			myObj.resizebtn().mousedown(function(e){
				isResizeMouseDown=true;
				var eOrgX=e.pageX,eOrgY=e.pageY,layerW=myObj.layer().width(),layerH=myObj.layer().height();
					myObj.html.mousemove(function(e){
					if (obj.type == "img" && !obj.stretch) {
						var conRate = myObj.contentinner().width()/myObj.contentinner().height()*1;
						var imgRate = parseInt(myObj.img().width())/parseInt(myObj.img().height());
						conRate / imgRate > 1 ? myObj.img().css({ "width": "", "height":myObj.contentinner().height() }) : myObj.img().css({ "width": myObj.contentinner().width(), "height": "" });
					}else{
						myObj.img().css({"width":"100%","height":"100%"});
					}
						if(isResizeMouseDown){
						myObj.layer().css({"width":layerW+e.pageX-eOrgX,"height":layerH+e.pageY-eOrgY});
						myObj.contentinner().css("height",myObj.layer().height()-myObj.title().height());
						if(/MSIE/.test(navigator.userAgent)){
							e.preventDefault();
						}
						return false;
						}
					});
				myObj.html.mouseup(function(){
					myObj.html.unbind("mousemove");
					isResizeMouseDown=false;
				});
			});
		};
        myObj.btnclose().click(function (e) {
            closeLpsLayers();
            e.stopPropagation();
        });
        obj.show({close:closeLpsLayers});
        myObj.html.bind("click keydown", function (e) {
            if ($(e.target).attr("id") == rootId+"Cover"+layerNum || e.keyCode == "27") {
                closeLpsLayers();
                e.stopPropagation();
            }
        });
	if(obj.html){$("#"+rootId+"ConInner"+layerNum).html(obj.html);};//防止未解析完执行obj.html内的脚本，所以必须放在最后
    }
    $.lpsShowLayer=$.fn.lpsShowLayer;
})(jQuery);
