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
		   		if (res.code == 0) {
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
		   		} else {
		   			dialog (res.msg, 'dialog')
		   		}
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
				$('.tickets').eq(q).find('.price').eq(res.data.currPriceIndex).css('font-weight','600').addClass('green').siblings('.price').addClass('decoration')
			}
		} else {
			$('.priceTitle').addClass('green').parents('thead').siblings('tbody').find('.price').css('font-weight','600').addClass('green')
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
		ares (res)
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
				dialog ('至少选择一张票', 'dialog')
			} else {
				var _t = $(this);
				_t.attr('disabled',true).addClass('subDisabled')
				$.ajax({
				  type: "POST",
				  url: baseUrl + "/ticket/checkout.json?code=" + coupon + "&number= " + Math.random(),
				  data: JSON.stringify(list),
				  dataType: "json",
				  contentType:'application/json;charset=utf-8',
				  // jsonp: "callback",
				  success: function(res){
				   	_t.removeAttr('disabled').removeClass('subDisabled')
				   	if (res.code == 0) {
				   		if (res.bcode == '1004') {
				   			dialog ('优惠码使用次数超过限制', 'dialog')
					   	} else {
					   		window.location.href = '/buy.html?token=' + res.data.token + '&orderNo=' + res.data.order.orderNo
					   	}
				   	} else if (res.code == '900') {
				   		dialog ('库存不足', 'dialog')
				   	} else {
				   		dialog (res.msg, 'dialog')
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
	$('.personal').on('click', function () {
		var r = confirm("确定去往个人中心吗？");
		if (r==true){
	    	window.location.href = '/personal.html';
	    } else{
	    	return;
	    }
		
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
		   		if (res.code == 0) {
		   			if (res.bcode) {
		   				if (res.bcode == '1001') {
				   			dialog ('优惠码或邀请码不存在', 'dialog')
				   		} else {
				   			dialog (res.bmsg, 'dialog')
				   		}
		   			} else {
						$('.coupon').hide().siblings('.use-coupon').show()
						dialog ('优惠码已生效，请选择相应优惠的门票', 'success_d')
			   			ares (res)
			   			calculation (res)
			   		}
		   		}else {
		   			dialog (res.msg, 'dialog')
		   		}
		   	}
 		});
 	});
 	function dialog (text,src) {
 		$('.dialog').find('p').text(text).prev('img').attr('src','/imgs/' + src + '.png').parent().fadeIn(500)
		setTimeout(function(){
			$('.dialog').fadeOut(500)
		},3000)
 	}
	function scrollTop () {
		if($(window).scrollTop() >= 200){
			$("#return-top .up").show(); // 开始淡入
			$('.buy').show().siblings('.none').hide();
		} else{
			$("#return-top .up").stop(true,true).hide(); // 如果小于等于 200 淡出
			$('.buy').stop(true,true).hide().siblings('.none').show(); // 如果小于等于 200 淡出
		}
		if($('#address').offset().top - $(window).scrollTop() <= 100) {
			$('.col-xs-2').removeClass('active')
			$('.address').addClass('active')
		} else {
			$('.col-xs-2').removeClass('active')
			$('.introduction').addClass('active')
		}
	};
	
	function ares (res) {
		for ( p in res.data.tickets) {
			var priceNow = $('.tickets').eq(p).find('.green .prices');
			var item = Number($('.tickets').eq(p).find('.green .preferential item').text());
			var promValue = Number(res.data.tickets[p].promValue);
			var type = res.data.tickets[p].promType;
			couponCode = true;
			promType += Number(res.data.tickets[p].promType)
			if (promType == 0) {
				couponCode = false;
			}
			if (type == 0 || !type) {
				priceNow.text(item).next().hide()
			} else if (type == 1) {
				priceNow.text(item - promValue).next().show()
			} else if (type == 2) {
				priceNow.text(item * Number(1 - promValue)).next().show()
			} else if (type == 3) {
				priceNow.text(promValue).next().show()
			} else if (type == 4) {
				priceNow.text(promValue).next().show()
			}
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

 	function toDecimal(x) {    
	    var val = Number(x)   
	    if(!isNaN(parseFloat(val))) {    
	       val = val.toFixed(2);//把 Number 四舍五入为指定小数位数的数字。
	    }  
	    return  val;     
	}

 	function calculation (res) {
 		var payment = 0;//实付金额
 		var discount = 0;//优惠金额
 		var amount;
 		//计算已选票数
 		for( i in res.data.tickets) {
 			var reduce = 0;
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
		 		console.log(reduce)
				discount += Number(reduce * number)
				payment += Number(price * number)
	 		}
 		}
 		//优惠特殊样式
		if (discount <= 0) {
			$('.discountMoney').hide().prev('.money').css('line-height','60px')
		} else {
			$('.discountMoney').show().css('line-height','30px').prev('.money').css('line-height','30px')
		}
 		$('.payment').text(toDecimal(payment))
 		$('.discount').text(toDecimal(discount))
 	};
})