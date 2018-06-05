$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	var baseUrl = "http://360.whereq.com/pco/common/api/" + mid;
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
	     	url: baseUrl + "/ticket/paypal/pay.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	         	console.log(res,666)
	         	if(res.code == "0") {
	         		document.write(res.html);
	         	} else if (res.code == "408") {
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
	      	}
	 	})
 	} 	
})