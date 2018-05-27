$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	$('.again').on('click', function () {
		window.location.href = '/payment.html'
	})
	$('.cancel').on('click', function () {
		window.location.href = '/index.html'
	})
	init()
	function init () {
		getData();
	}
	function getData () {
		console.log(token)
		console.log(orderNo)
	    $.ajax({
	    	type: "POST",
	     	// url: "/data/buy.json",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/order/query.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		bindHtml("#order", res.data.order)
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
})