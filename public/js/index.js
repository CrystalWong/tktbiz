$(function(){
	var minus='/imgs/minus.png';
	var minus_no='/imgs/minus_no.png';
	var plus='/imgs/plus.png';
	var plus_no='/imgs/plus_no.png';
	var mid = '083c18e8554a88fbf0b3a367e76bb488';
	var couponCode = false;
	var promType = 0;
	var coupon;
	var baseUrl = "http://360.whereq.com/pco/common/api/" + mid;
	init();

	function init() {
		$.ajax({
	  	type: "GET",
	   	// url: "/data/index.json?number= " + Math.random(),
	   	// url: "/data/event.json?number= " + Math.random(),
	   	url: baseUrl + "/ticket/list.json?number= " + Math.random(),
	   	data: {
	   		code:coupon
	   	},
	   	dataType: "json",
	   	// jsonp: "callback",
	   	success: function(res){
	   		// console.log(res)
	   		var tpl =  $("#list").html();
				//预编译模板
				var template = Handlebars.compile(tpl);
				//模拟json数据
				var context = res;
				//匹配json内容
				var html = template(context);
				//输入模板
				$('#list-wrap').html(html);
	 			$("[data-toggle='popover']").popover();
	 			//特殊样式
	 			specialStyle(res)
	 			//各点击事件
	 			click(res)
	    }
	 	});
	};

	function specialStyle (res) {
		scrollTop()
		// 滑动滚动条
		$(window).scroll(function(){
			scrollTop()
		});
		//单价样式
		if (res.data.tieredPricing) {
			$('.tieredPricingTitles').eq(res.data.currPriceIndex).addClass('green').siblings('.tieredPricingTitles, .priceTitle').addClass('decoration-color')
			for( q in res.data.tickets) {
				$('.tickets').eq(q).find('.price').eq(res.data.currPriceIndex).addClass('green').siblings('.price').addClass('decoration')
			}
		} else {
			$('.priceTitle').addClass('green').parents('thead').siblings('tbody').find('.price').addClass('green')
		}
		//滑过整行显示备注
		$('.tickets').mouseover( function () {
			$(this).find('.pover').show()
		}).mouseout( function () {
			$(this).find('.pover').hide()
		});
		//微信微博分享
		$('.weibo').mouseover( function () {
			$(this).find('p').show().siblings().hide()
		}).mouseout( function () {
			$(this).find('p').hide().siblings().show()
		});
		//微信微博分享
		$('.weixin').mouseover( function () {
			$(this).find('p').show().siblings().hide()
			$('#wechat-code').show()
		}).mouseout( function () {
			$(this).find('p').hide().siblings().show()
			$('#wechat-code').hide()
		});
		for( k in res.data.tickets) {
			ares (res, k)
		}
	};

	function click (res) {
		//点击提交
		$('#submit').on('click', function(){
			var list = [];
			var quantum = 0;
			var currPriceIndex = $('.tickets').parents('.table').attr('data-currPriceIndex');
			var prices = 0;
			for( j in res.data.tickets) {
				quantum +=  Number($('.tickets').eq(j).find('.num').text())
				if($('.tickets').eq(j).find('.num').text() != 0){
					list.push({
						'ticketId': $('.tickets').eq(j).attr('data-id'),
						'num': $('.tickets').eq(j).find('.num').text()
					})
				}
			}
			if (quantum == 0) {
				$('.dialog').find('p').text('至少选择一张票').parent().fadeIn(500)
				setTimeout(function(){
					$('.dialog').fadeOut(500)
				},3000)
			} else {
				$.ajax({
				  type: "POST",
				  url: baseUrl + "/ticket/checkout.json?code=" + coupon + "&number= " + Math.random(),
				  data: JSON.stringify(list),
				  dataType: "json",
				  contentType:'application/json;charset=utf-8',
				  // jsonp: "callback",
				  success: function(res){
				   	// console.log(res)
				   	if (res.bcode == '1004') {
				   		$('.dialog').find('p').text('优惠码使用次数超过限制').parent().fadeIn(500)
			   			setTimeout(function(){
								$('.dialog').fadeOut(500)
							},3000)
				   	} else {
				   		window.location.href = '/buy.html?token=' + res.data.token + '&orderNo=' + res.data.orderNo
				   	}
				  }
			 	});
			}
		});
	 	//增加门票
		$('.add').on('click', function () {
 			var num = Number($(this).prev().text());
	 		var minNum = Number($(this).prev().attr('data-minNum'));
	 		var maxNum = Number($(this).prev().attr('data-maxNum'));
	 		if (num == 0) {
	 			num = minNum;
	 			$(this).removeClass('disabled').siblings('.subtract').removeClass('disabled').find('img').attr('src', minus);
	 			if(num == maxNum){
	 				$(this).addClass('disabled').find('img').attr('src', plus_no);
	 			}
	 		} else if (num < maxNum) {
	 			num++;
	 			$(this).siblings('.subtract').removeClass('disabled');
	 			if(num == maxNum){
	 				$(this).addClass('disabled').find('img').attr('src', plus_no);
	 			}
	 		} else {
	 			$(this).addClass('disabled').find('img').attr('src', plus_no);
	 		}
	 		$(this).prev().text(num)
	 		calculation (res)
 		});
		//删除门票
		$('.subtract').on('click', function () {
 			var num = Number($(this).next().text());
	 		var minNum = Number($(this).next().attr('data-minNum'));
	 		if (num != 0) {
	 			num = num-1;
	 			$(this).removeClass('disabled').siblings('.add').removeClass('disabled').find('img').attr('src', plus);
	 			if (num < minNum) {
		 			num = 0;
		 			$(this).addClass('disabled').find('img').attr('src', minus_no);
		 		}
	 		}
	 		$(this).next().text(num)
	 		calculation (res)
 		});
	};

	//点击刷新首页
	$('.home').on('click', function () {
		window.location.href = '/index.html';
	});
	//点击关闭弹出框
	$('.subclose').on('click', function(){
		$('.dialog').fadeOut(500)
	});
	//点击 up
	$('#return-top .up').on('click', function(){
		$('html,body').animate({scrollTop:0}, 500);
	});
	//点击导航栏
	$('.tab').on('click', function () {
 		$(this).addClass('active').siblings('.tab').removeClass('active');
 	});
 	//点击使用优惠
 	$('.use-coupon').on('click', function () {
 		$(this).hide().siblings().show()
 	})
 	$('.cancel').on('click', function () {
 		$(this).parent('.coupon').hide().siblings().show()
 	})
 	//点击确定使用优惠
 	$('.sure').on('click', function () {
 		coupon = $('#coupon').val()
 		$.ajax({
	  	type: "GET",
	   	// url: "/data/index.json?number= " + Math.random(),
	   	// url: "/data/event.json?number= " + Math.random(),
	   	url: baseUrl + "/ticket/list.json?number= " + Math.random(),
	   	data: {
	   		code:coupon
	   	},
	   	dataType: "json",
	   	// jsonp: "callback",
	   	success: function(res){
	   		if (res.bcode == '1001') {
	   			$('.dialog').find('p').text('优惠码或邀请码不存在').parent().fadeIn(500)
	   			setTimeout(function(){
						$('.dialog').fadeOut(500)
					},3000)
	   		} else if (res.bcode == '1002' || res.bcode == '1003') {
	   			$('.dialog').find('p').text('优惠码或邀请码已超过使用期限或次数').parent().fadeIn(500)
	   			setTimeout(function(){
						$('.dialog').fadeOut(500)
					},3000)
	   		} else {
					$('.coupon').hide().siblings('.use-coupon').show()
	   			$('.dialog').find('p').text('优惠码已生效，请选择相应优惠的门票').parent().fadeIn(500)
	   			setTimeout(function(){
						$('.dialog').fadeOut(500)
					},3000)
	   			for ( p in res.data.tickets) {
						ares (res, p)
					}
	   			calculation (res)
	   		}
	   	}
 		});
 	});

	function scrollTop () {
		if($(window).scrollTop() >= 200){
			$("#return-top .up").show(); // 开始淡入
			$('.buy').show().siblings('.none').hide();
		} else{
			$("#return-top .up").stop(true,true).hide(); // 如果小于等于 200 淡出
			$('.buy').stop(true,true).hide().siblings('.none').show(); // 如果小于等于 200 淡出
		}
		if($('#address').offset().top - $(window).scrollTop() <= 100) {
			$('.col-xs-3').removeClass('active')
			$('.address').addClass('active')
		} else {
			$('.col-xs-3').removeClass('active')
			$('.introduction').addClass('active')
		}
	};
	
	function ares (res, p) {
		couponCode = true;
		promType += Number(res.data.tickets[p].promType)
		if (promType == 0) {
			couponCode = false;
		}
		if (res.data.tickets[p].promType == 0 || !res.data.tickets[p].promType) {
			$('.tickets').eq(p).find('.green .prices').text(Number($('.tickets').eq(p).find('.green .preferential item').text())).next().hide()
		} else if (res.data.tickets[p].promType == 1) {
			$('.tickets').eq(p).find('.green .prices').text(Number($('.tickets').eq(p).find('.green .preferential item').text()) - Number(res.data.tickets[p].promValue)).next().show()
		} else if (res.data.tickets[p].promType == 2) {
			$('.tickets').eq(p).find('.green .prices').text(Number($('.tickets').eq(p).find('.green .preferential item').text()) * Number(1 - res.data.tickets[p].promValue)).next().show()
		} else if (res.data.tickets[p].promType == 3) {
			$('.tickets').eq(p).find('.green .prices').text(res.data.tickets[p].promValue).next().show()
		} else if (res.data.tickets[p].promType == 4) {
			$('.tickets').eq(p).find('.green .prices').text(res.data.tickets[p].promValue).next().show()
		}
	};

 	function units (res, i) {
 		var prices;
 		if(res.data.tieredPricing){
 			//阶梯价格计算
 			prices = Number(res.data.tickets[i].prices[res.data.currPriceIndex]);
 		} else {
 			//固定价格计算
 			prices = Number(res.data.tickets[i].price);
 		}
 		return prices;
 	};

 	function calculation (res) {
 		var payment = 0;//实付金额
 		var discount = 0;//优惠金额
 		var amount;
 		var reduce = 0;
 		//计算已选票数
 		for( i in res.data.tickets) {
	 		if (res.data.tickets[i].open) {
	 			var number = Number($('.tickets').eq(i).find('.num').text())
	 			if (couponCode) {
	 				reduce = Number($('.tickets').eq(i).find('.green .preferential item').text()) - Number($('.tickets').eq(i).find('.green .prices').text())
	 			} else {
			 		if (res.data.tickets[i].discounts) {
			 			if(res.data.tickets[i].discountsType == 1) {
			 				//每张优惠金额
			 				amount = units (res, i)
			 				if(number >= res.data.tickets[i].discountsNum) {
			 					reduce = Number(res.data.tickets[i].discountsAmount)
			 					amount = units (res, i) - Number(res.data.tickets[i].discountsAmount)
			 				}
			 				$('.tickets').eq(i).find('.green .prices').text(amount)
				 		}
			 		}
	 			}
		 		var price = Number($('.tickets').eq(i).find('.green .prices').text())
				discount += Number(reduce * number)
				payment += price * number
	 		}
 		}
 		//优惠特殊样式
		if (discount <= 0) {
			$('.discountMoney').hide().prev('.money').css('line-height','60px')
		} else {
			$('.discountMoney').show().css('line-height','30px').prev('.money').css('line-height','30px')
		}
 		$('.payment').text(payment)
 		$('.discount').text(discount)
 	};
})