$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	var bodyStr = location.href.split('?');
	init();
 	function init () {
 		if (bodyStr) {

 		} else {
 			getData();
 		}
 	};
 	/**
 	 * [checkSignStr description]     验证支付宝签名
 	 * @return {[type]} [description]
 	 */
 	function checkSignStr () {
	    $.ajax({
	    	type: "GET",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/payResult.json",
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		renderResultInfo(res);
	      	}
	 	})
 	};
 	/**
 	 * [getData description] 		预下单，获取付款二维码
 	 * @return {[type]} [description]
 	 */
 	function getData () {
	    $.ajax({
	    	type: "GET",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/payResult.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		renderResultInfo(res);
	      	}
	 	})		
 	};
  	/**
 	 * [renderBuyerForm description]    渲染结果信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderResultInfo (res) {
 		bindHtml("#resultInfo", res.data);
 	};	
 	/**
 	 * [bindHtml description]			数据注入html模版
 	 * @param  {[type]} domId [description]
 	 * @param  {[type]} data  [description]
 	 * @return {[type]}       [description]
 	 */
 	function bindHtml (domId, data, helper) {
 		var tpl =  $(domId).html();
		//预编译模板
		var template = Handlebars.compile(tpl);
		//上下文数据
		var context = data
		//匹配json内容
		var html = template(context);
		//输入模板
		$(domId + "-wrap").html(html);
 	}
})