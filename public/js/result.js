$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	var bodyStr = location.href.split('?')[1];
	var baseUrl = "http://360.whereq.com/pco/common/api/" + mid;
	init();
 	function init () {
 		if (bodyStr && bodyStr.indexOf("out_trade_no") >= 0) {
 			checkAliSignStr(bodyStr);
 		} else if (bodyStr && bodyStr.indexOf("item_number") >= 0) {
 			checkPaypalSignStr(bodyStr);
 		} else if (bodyStr && bodyStr.indexOf("wechat") >= 0) {
 			wechat();
 		} else {
 			localPay();
 		}
 	};
 	/**
 	 * [checkAliSignStr description]     验证支付宝签名
 	 * @return {[type]} [description]
 	 */
 	function checkAliSignStr (bodyStr) {
	    $.ajax({
	    	type: "GET",
	     	url: baseUrl + "/ticket/alipay/return.json?" + bodyStr,
	     	data: {},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.code == 0) {
	     			renderResultInfo(res);
	     		} else if (res.code == "408") {
	     			alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
	      	}
	 	})
 	}; 	
 	/**
 	 * [checkPaypalSignStr description]     验证paypal签名
 	 * @return {[type]} [description]
 	 */
 	function checkPaypalSignStr (bodyStr) {
	    $.ajax({
	    	type: "GET",
	     	url: baseUrl + "/ticket/paypal/return.json?" + bodyStr,
	     	data: {},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.code == 0) {
	     			renderResultInfo(res);
	     		} else if (res.code == "408") {
	     			alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
	      	}
	 	})
 	};
 	/**
 	 * [wechat description] 		微信支付
 	 * @return {[type]} [description]
 	 */
 	function wechat () {
	    $.ajax({
	    	type: "GET",
	     	url: baseUrl + "/ticket/codepay/return.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.code == 0) {
	     			renderResultInfo(res);
	     		} else if (res.code == "408") {
	     			alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
	      	}
	 	})		
 	};
 	/**
 	 * [localPay description] 		现场支付
 	 * @return {[type]} [description]
 	 */
 	function localPay () {
	    $.ajax({
	    	type: "GET",
	     	url: baseUrl + "/ticket/localpay/return.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.code == 0) {
	     			renderResultInfo(res);
	     		} else if (res.code == "408") {
	     			alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
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