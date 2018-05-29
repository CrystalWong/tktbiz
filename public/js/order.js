$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	var baseUrl = "http://360.whereq.com/pco/common/api/" + mid;
	init()
	function init () {
		getData();
	}
	function getData () {
		// console.log(token)
		// console.log(orderNo)
	    $.ajax({
	    	type: "POST",
	     	// url: "/data/buy.json",
	     	url: baseUrl + "/ticket/order/query.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
				console.log(res)
	     		renderResultInfo (res)
	      	}
	 	})		
 	};
 	/**
 	 * [renderBuyerForm description]    渲染结果信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderResultInfo (res) {
 		if (res.data.state == 'ordered') {
 			res.data.state = '待支付'
 		} else if (res.data.state == 'confirm') {
 			res.data.state = '待确认'
 		} else if (res.data.state == 'payed') {
 			res.data.state = '已支付'
 		} else if (res.data.state == 'cancel') {
 			res.data.state = '已取消'
 			// $('.cancel').hide()
 		} 
 		bindHtml("#order", res.data)
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