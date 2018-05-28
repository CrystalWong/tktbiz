$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	init();
 	function init () {
 		orderStatus ()
 	};
 	function orderStatus () {
 		$('.info strong').text(orderNo)
	    $.ajax({
	    	type: "POST",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/order/query.json",
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
			 		countDown()
			 		getData();
		 		}
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
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/codepay/preorder.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	         	console.log(res, 33)
	         	if(res.code == '0'){
	         		var QRcode = '<img class="QRcode" src="http://whereq.360.cn:8080/pco/common/api/' + mid + '/ticket/codepay/barcode.png?codeURL=' + res.codeURL + '" width="30%" alt="支付二维码">'
	         		// var QRcode = $('.QRcode').attr('src', 'http://whereq.360.cn:8080/pco/common/api/' + mid + '/ticket/codepay/barcode.png?codeURL=' + res.codeURL)
	         		$(".pay").before(QRcode);
	         		var prepayId = res.prepayId;
         			setInterval(function(){
         				checkStatus(prepayId);
         			}, 3000)
	         	}
	      	}
	 	})		
 	}; 	
 	/**
 	 * [getData description] 		查询订单状态
 	 * @return {[type]} [description]
 	 */
 	function checkStatus (prepayId) {
 		// var prepayId = "wx23164514593542b92ac8bf1b3728804688";
 		// var orderNo = "BJROSE000210088";
 		var data = {
 			"orderNo": orderNo,
 			"prepayId": prepayId
 		}
	    $.ajax({
	    	type: "GET",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/codepay/status.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: data,
	     	dataType: "json",
	     	success: function(res){
	         	console.log(res, 55)
	         	if(res.code == '0'){
	         		if (res.state === "NOTPAY" || res.state === "USERPAYING") {
	         			return;
	         		} else {
	         			window.location.href = '/result.html?from=wechat&token=' + token + "&orderNo=" + orderNo;
	         		}
	         	}
	      	}
	 	})		
 	};

 	$('.pay').on('click', function () {
		// window.location.href = '/payment.html'
	})

	function countDown(){
		var num = 201
		name = setInterval(function() {
			num--;
			$('.info-time .red').text(num);// 你倒计时显示的地方元素
			if(num == 0){
				clearInterval(name);
				countDown()
				getData ();
			}
		}, 1000);
	}
})