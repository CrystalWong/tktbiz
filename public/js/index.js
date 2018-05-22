$(function(){
	var minus='/imgs/minus.png';
	var minus_no='/imgs/minus_no.png';
	var plus='/imgs/plus.png';
	var plus_no='/imgs/plus_no.png';
	init();

	//点击提交
	$('#submit').on('click', function(){
		var list = [];
		var currPriceIndex = $('.tickets').parents('.table').attr('data-currPriceIndex');
		var prices = 0;
		for(var j=0;j<$('.tickets').length;j++) {
			if($('.tickets').eq(j).find('.num').text() != 0){
				list.push({
					'ticketId': $('.tickets').eq(j).attr('data-id'),
					'num': $('.tickets').eq(j).find('.num').text()
				})
			}
		}
		if ($('.payment').text() == 0) {
			$('.dialog').fadeIn(500)
			setTimeout(function(){
				$('.dialog').fadeOut(500)
			},3000)
		} else {
			console.log(list)
			// window.location.href = '/buy.html'
			$.ajax({
		  	type: "POST",
		   	url: "http://whereq.360.cn:8080/pco/common/api/083c18e8554a88fbf0b3a367e76bb488/ticket/checkout.json",
		   	data: JSON.stringify(list),
		   	dataType: "json",
		   	contentType:'application/json;charset=utf-8',
		   	// jsonp: "callback",
		   	success: function(res){
		   		console.log(res)
		   		window.location.href = '/buy.html?token=' + res.data.token + '&orderNo=' + res.data.orderNo
		    }
		 	});
		}
	});

	$('.subclose').on('click', function(){
		$('.dialog').fadeOut(500)
	})

	$('#return-top .up').on('click', function(){
		$('html,body').animate({scrollTop:0}, 500);
	})

	$('.tab').on('click',function() {
 		$(this).addClass('active').siblings('.tab').removeClass('active');
 	});

 	// 滑动滚动条
	$(window).scroll(function(){
	// 滚动条距离顶部的距离 大于 200px时
		if($(window).scrollTop() >= 200){
			$("#return-top").fadeIn(1000); // 开始淡入
		} else{
			$("#return-top").stop(true,true).fadeOut(1000); // 如果小于等于 200 淡出
		}
	});

	function init() {
		$.ajax({
		  	type: "GET",
		   	// url: "/data/index.json",
		   	// url: "/data/event.json",
		   	url: "http://whereq.360.cn:8080/pco/common/api/083c18e8554a88fbf0b3a367e76bb488/ticket/list.json",
		   	data: {},
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
		 			add(res)
		 			subtract(res)
		    }
	 	});
	};
  
	function specialStyle (res) {
		if (res.data.tieredPricing) {
			$('.tieredPricingTitles').eq(res.data.currPriceIndex).addClass('green').siblings('.tieredPricingTitles, .priceTitle').addClass('decoration-color')
			for( q in res.data.tickets) {
				$('.tickets').eq(q).find('.prices1').eq(res.data.currPriceIndex).addClass('green').siblings('.price').addClass('decoration')
			}
		} else {
			$('.priceTitle').addClass('green').parents('thead').siblings('tbody').find('.prices2').addClass('green')
		}
		$('.tickets').mouseover( function () {
			$(this).find('.pover').show()
		}).mouseout( function () {
			$(this).find('.pover').hide()
		});
	};

 	function add (res) {
 		$('.add').on('click', function () {
 			var num = parseInt($(this).prev().text());
	 		var minNum = parseInt($(this).prev().attr('data-minNum'));
	 		var maxNum = parseInt($(this).prev().attr('data-maxNum'));
	 		if (num == 0) {
	 			num = minNum;
	 			$(this).removeClass('disabled').siblings('.subtract').removeClass('disabled').find('img').attr('src', minus);
	 		}else if (num < maxNum) {
	 			num++;
	 			$(this).siblings('.subtract').removeClass('disabled');
	 			if(num == maxNum){
	 				$(this).addClass('disabled').find('img').attr('src', plus_no);
	 			}
	 		} else {
	 			$(this).addClass('disabled').find('img').attr('src', plus_no);
	 		}
	 		$(this).prev().text(num)
	 		calculation (num, $(this), res)
 		});
 	};

 	function subtract (res) {
 		$('.subtract').on('click',function () {
 			var num = parseInt($(this).next().text());
	 		var minNum = parseInt($(this).next().attr('data-minNum'));
	 		if (num != 0) {
	 			num = num-1;
	 			$(this).removeClass('disabled').siblings('.add').removeClass('disabled').find('img').attr('src', plus);
	 			if (num < minNum) {
		 			num = 0;
		 			$(this).addClass('disabled').find('img').attr('src', minus_no);
		 		}
	 		}
	 		$(this).next().text(num)
	 		calculation (num, $(this), res)
 		});
 	};

 	function unit (label1, label2, tab, currPriceIndex, prices) {
 		if(label1.attr('data-tieredPricing') == 'false'){
 			//固定价格计算
 			prices = parseInt(label2.find('.prices2').text())
 		} else {
 			//阶梯价格计算
 			prices = parseInt(label2.find('.prices1').eq(currPriceIndex).text())
 		}
 		return prices;
 	}

 	function calculation (num, tab, res) {
 		var prices = 0;
 		var price = 0;
 		var amount = 0;
 		var payment = 0;//实付金额
 		var discount = 0;//优惠金额
 		var ticket = tab.parents('.tickets')
 		var listInline = tab.parent('.list-inline')
 		var currPriceIndex = tab.parents('.table').attr('data-currPriceIndex')
 		//计算已选票数
 		for(var i=0;i<ticket.siblings('.tickets').length;i++) {
 			var tickets = ticket.siblings('.tickets').eq(i)
 			var number = parseInt(tickets.find('.num').text())
 			var listInlines = tickets.find('.list-inline')
	 		//计算优惠
	 		if (listInlines.attr('data-discounts')) {
	 			if(listInlines.attr('data-discountsType') == 1) {
	 				//每张优惠金额
	 				if(number >= listInlines.attr('data-discountsNum')) {
	 					discount += parseInt(listInlines.attr('data-discountsAmount')) * number
	 				}
	 				payment += unit (listInlines, tickets, tab, currPriceIndex, prices) * number
		 		}
		 		else {
					//没有优惠
			 		payment += unit (listInline, tickets, tab, currPriceIndex, prices) * number
				}
	 		}
	 		else {
	 			//没有优惠
		 		payment += unit (listInline, tickets, tab, currPriceIndex, prices) * number
	 		}
 		}
 		if (listInline.attr('data-discounts')) {
 			if(listInline.attr('data-discountsType') == 1) {
 				//每张优惠金额
 				if(num >= listInline.attr('data-discountsNum')) {
			 		discount = num * listInline.attr('data-discountsAmount') + discount
			 		if (ticket.find('.green').text() == res.data.tickets[ticket.index('.tickets')].prices[res.data.currPriceIndex]) {
			 			price = unit (listInline, ticket, tab, currPriceIndex, prices) - listInline.attr('data-discountsAmount')
				 		ticket.find('.green').text(price)
			 		}
			 		payment += num * unit (listInline, ticket, tab, currPriceIndex, prices)
 				} else {
 					price = res.data.tickets[ticket.index('.tickets')].prices[res.data.currPriceIndex]
				 	ticket.find('.green').text(price)
			 		payment += num * unit (listInline, ticket, tab, currPriceIndex, prices)
 				}
 			}
 			else {
		 		payment += num * unit (listInline, ticket, tab, currPriceIndex, prices)
			}
 		} else {
	 		payment += num * unit (listInline, ticket, tab, currPriceIndex, prices)
 		}
 		//优惠特殊样式
		if (discount == 0) {
			$('.discountMoney').hide().prev('.money').css('line-height','60px')
		} else {
			$('.discountMoney').show().css('line-height','30px').prev('.money').css('line-height','30px')
		}
 		$('.payment').text(payment)
 		$('.discount').text(discount)
 	};
})