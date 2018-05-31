$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	var baseUrl = "http://360.whereq.com/pco/common/api/" + mid;
	init()

	function init() {
		orderStatus ()
	}
	function orderStatus () {
	    $.ajax({
	    	type: "POST",
	     	url: baseUrl + "/ticket/order/query.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.data.state == 'payed') {
	     			window.location.href = '/result.html?from=wechat&token=' + token + "&orderNo=" + orderNo;
		 		} else if (res.data.state == 'cancel') {
		 			window.location.href="/index.html";
		 		} else {
		 			orderInfo ()
		 		}
	      	}
	 	})		
 	};
 	function orderInfo () {
 		$.ajax({
		  	type: "GET",
		   	url: baseUrl + "/ticket/repay.json?number= " + Math.random(),
		   	headers: {
		        'x-access-token': token
		    },
		   	data: {'orderNo': orderNo},
		   	dataType: "json",
		   	// jsonp: "callback",
		   	success: function(res){
		   		if (res.code == 0) {
		 			renderOrderInfo (res)
		 			renderPayMethods (res)
		 			payTypeToggle ()
		 			modify ()
		 			pay ()
		 			setInterval(function(){
         				orderEach();
         			}, 3000)
		   		}
		   	}
	 	});
 	}
 	/**
 	 * [renderOrderInfo description]	渲染订单信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderOrderInfo (res) {
 		bindHtml("#register", res.data.order)
 	};
 	/**
 	 * [renderOrderInfo description]	渲染支付方式
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderPayMethods (res) {
 		var payMethods = res.data.payMethods;
 		var payMethodList = [];
 		for(i in payMethods){
 			var payMethod = {};
 			var key = payMethods[i];
 			payMethod[key] = true;
 			payMethodList.push(payMethod);
 		}
 		bindHtml("#payForm", {"payMethodList": payMethodList});
 	};
 	/**
 	 * [bindHtml description]			查询订单状态
 	 * @param  {[type]} domId [description]
 	 * @param  {[type]} data  [description]
 	 * @return {[type]}       [description]
 	 */
	function orderEach () {
 		$.ajax({
	    	type: "POST",
	     	url: baseUrl + "/ticket/order/query.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.data.state == 'cancel') {
		 			window.location.href="/order.html?token=" + token + "&orderNo=" + orderNo;
		 		}
	      	}
	 	})
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
 	/**
 	 * [payTypeToggle description]		切换支付方式
 	 * @return {[type]} [description]
 	 */
 	function payTypeToggle () {
 		$('.pay-item').eq(0).addClass('active');
 		// $('.pay').off();
 		$('.pay').on('click',function(){
 			$('.pay').removeClass('pay-active');
 			$(this).addClass('pay-active');
 		})
 		// $('.pay-item').off();
 		$('.pay-item').on('click',function(){
 			$('.pay-item').removeClass('active');
 			$(this).addClass('active');
 		})
 		// $('.pay-wrap .pay-type').off();
 		$('.pay-wrap .pay-type').on('click', function(){
 			if($(this).text().replace(/(^\s+)|(\s+$)/g,"") == "在线支付平台"){
 				console.log($(this).closest('.pay'))
 				$(this).closest('.pay').find('.pay-item').eq(0).addClass('active');
 			} else {
 				$(this).closest('.pay').addClass('active');
 			}
 		})
 	};
 	/**
 	 * [payTypeToggle description]		修改参会者信息
 	 * @return {[type]} [description]
 	 */
 	function modify () {
	 	$('.modify').on('click',function () {
	 		window.location.href="/buy.html?token=" + token + "&orderNo=" + orderNo;
	 	});
 	}
 	/**
 	 * [payTypeToggle description]		去支付
 	 * @return {[type]} [description]
 	 */
 	function pay () {
	 	$('#submit').on('click',function () {
	 		var payMethod = $('.pay-wrap .active').attr('paytype');
	 		submit (payMethod, $(this))
	 	});
 	}
 	function submit (payMethod, _t) {
		_t.attr('disabled',true).addClass('subDisabled')
	    $.ajax({
	    	type: "POST",
	     	url: baseUrl + "/ticket/repay.json?number= " + Math.random() + '&orderNo=' + orderNo + '&payMethod=' +payMethod,
            headers: {
		        'x-access-token': token
		    },
	     	data: {},
	     	dataType: "json",
	     	success: function(res){
	     		_t.removeAttr('disabled').removeClass('subDisabled')
	     		if (res.code == 0) {
	     			if (payMethod == "CodePay") {
	         			window.location.href = '/pay.html?token=' + token + "&orderNo=" + orderNo;
	         		} else if (payMethod == "AlipayQuick") {
	         			window.location.href = '/alipay.html?token=' + token + "&orderNo=" + orderNo;
	         		} else if (payMethod == "PayPal") {
	         			window.location.href = '/paypal.html?token=' + token + "&orderNo=" + orderNo;
	         		} else {
	         			window.location.href = '/scene.html?token=' + token + "&orderNo=" + orderNo;
	         		}
	     		}
	      	}
	 	})		
 	};
});