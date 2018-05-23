$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	init();
 	function init () {
 		AlipayQuick();
 	};
 	/**
 	 * [AlipayQuick description]      支付宝支付
 	 */
 	function AlipayQuick () {
	    $.ajax({
	    	type: "GET",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/alipay/pay.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	         	console.log(res,666)
	         	if(res.code == "0") {
	         		document.write(res.html);
	         	}
	      	}
	 	})
 	} 	
})