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
		 			payTypeToggle ()
		 			bindHtml("#register", res.data)
		 			setInterval(function(){
         				orderEach();
         			}, 3000)
		 		}
	      	}
	 	})		
 	};
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
 		$('.pay').on('click',function(){
 			$('.pay').removeClass('pay-active');
 			$(this).addClass('pay-active');
 		}) 
 		$('.pay-item').on('click',function(){
 			$('.pay-item').removeClass('active');
 			$(this).addClass('active');
 		})
 		$('.pay-wrap .pay-type').on('click', function(){
 			if($(this).text().replace(/(^\s+)|(\s+$)/g,"") == "在线支付平台"){
 				console.log($(this).closest('.pay'))
 				$(this).closest('.pay').find('.pay-item').eq(0).addClass('active');
 			}
 		})
 	};
 	/**
 	 * [payTypeToggle description]		修改参会者信息
 	 * @return {[type]} [description]
 	 */
 	$('.modify').on('click',function () {
 		window.location.href="/buy.html?token=" + token + "&orderNo=" + orderNo;
 	});
});