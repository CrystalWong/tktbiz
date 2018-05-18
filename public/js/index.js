$(function(){
	//点击提交
	$('#submit').on('click', function(){
		var list = {
			payment: $('.payment').text(),
			data: []
		};
		var currPriceIndex = $('.tickets').parents('.table').attr('data-currPriceIndex');
		var prices = 0;
		for(var j=0;j<$('.tickets').length;j++) {
			if($('.tickets').eq(j).find('.num').text() != 0){
				if($('.tickets').eq(j).find('.list-inline').attr('data-tieredPricing') == false){
		 			//固定价格计算
		 			prices = $('.tickets').eq(j).find('.prices2').text()
		 		} else if($('.tickets').eq(j).find('.list-inline').attr('data-tieredPricing')){
		 			//阶梯价格计算
		 			prices = $('.tickets').eq(j).find('.prices1').eq(currPriceIndex).text()
		 		}
				list.data.push({
					id: $('.tickets').eq(j).attr('data-id'),
					num: $('.tickets').eq(j).find('.num').text(),
					prices: prices
				})
			}
		}
		var str = JSON.stringify(list)
		sessionStorage.setItem("list", str)
		window.location.href = '/buy.html'
	});

	$('#return-top .up').on('click', function(){
		$('html,body').animate({scrollTop:0}, 500);
	})

	$('.tab').on('click',function() {
 		$(this).addClass('active').siblings('.tab').removeClass('active');
 	});

	var minus='/imgs/minus.png';
	var minus_no='/imgs/minus_no.png';
	var plus='/imgs/plus.png';
	var plus_no='/imgs/plus_no.png';
	init();

	function init() {
		$.ajax({
	  	type: "GET",
	   	// url: "/data/index.json",
	   	url: "/data/event.json",
	   	data: {},
	   	dataType: "json",
	   	success: function(res){
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
	 			// console.log(res)
	 			//特殊样式
	 			if (res.data.tieredPricing) {
	 				$('.tieredPricingTitles').eq(res.data.currPriceIndex).addClass('green').siblings('.tieredPricingTitles, .priceTitle').addClass('decoration-color')
	 				for( q in res.data.tickets) {
	 					$('.tickets').eq(q).find('.prices1').eq(res.data.currPriceIndex).addClass('green').siblings('.price').addClass('decoration')
	 				}
	 			} else {
	 				$('.priceTitle').addClass('green').parents('thead').siblings('tbody').find('.prices2').addClass('green')
	 			}
	 			//优惠特殊样式
	 			if($('.discount').text()==0){
	 				$('.discount').addClass('decoration')
	 			}
	 			$('.add').on('click', add);
	 			$('.subtract').on('click',subtract);
	    }
	 	});
	};
  

 	function add (target) {
 		console.log(minus)
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
 		calculation (num, $(this))
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

 	function calculation (num, tab) {
 		var sum = 0; //已选票数
 		// var prices1 = 0;
 		var prices = 0;
 		var amount = 0;
 		// var payment1 = 0;//实付金额
 		var payment = 0;//实付金额
 		var discount = 0;//优惠金额
 		var currPriceIndex = tab.parents('.table').attr('data-currPriceIndex')
 		//计算已选票数
 		for(var i=0;i<tab.parents('.tickets').siblings('.tickets').length;i++) {
 			var number = parseInt(tab.parents('.tickets').siblings('.tickets').eq(i).find('.num').text())
	 		//计算优惠
	 		if (tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-discounts')) {
	 			if(tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-discountsType') == 1) {
	 				//每张优惠金额
	 				if(number >= tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-discountsNum')) {
	 					discount += parseInt(tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-discountsAmount')) * number
				 		payment += unit (tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline'), tab.parents('.tickets').siblings('.tickets').eq(i), tab, currPriceIndex, prices) * number - parseInt(tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-discountsAmount')) * number
	 				} else {
	 					//没有优惠
				 		payment += unit (tab.parent('.list-inline'), tab.parents('.tickets').siblings('.tickets').eq(i), tab, currPriceIndex, prices) * number
	 				}
		 		} else if (tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-discountsType') == 2) {
		 			//赠送
	 				if(number >= tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-discountsNum')) {
				 		discount = tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-freeNum') * unit (tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline'), tab.parents('.tickets').siblings('.tickets').eq(i), tab, currPriceIndex, prices)  + discount
				 		payment += number * unit (tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline'), tab.parents('.tickets').siblings('.tickets').eq(i), tab, currPriceIndex, prices)
				 		sum += parseInt(tab.parents('.tickets').siblings('.tickets').eq(i).find('.list-inline').attr('data-freeNum'))
	 				}else {
	 					//没有优惠
				 		payment += unit (tab.parent('.list-inline'), tab.parents('.tickets').siblings('.tickets').eq(i), tab, currPriceIndex, prices) * number
	 				}
		 		}else {
					//没有优惠
			 		payment += unit (tab.parent('.list-inline'), tab.parents('.tickets').siblings('.tickets').eq(i), tab, currPriceIndex, prices) * number
				}
	 		} else {
	 			//没有优惠
		 		payment += unit (tab.parent('.list-inline'), tab.parents('.tickets').siblings('.tickets').eq(i), tab, currPriceIndex, prices) * number
	 		}
	 		sum += number
 		}
 		sum = num + sum
 		
 		if (tab.parent('.list-inline').attr('data-discounts')) {
 			if(tab.parent('.list-inline').attr('data-discountsType') == 1) {
 				//每张优惠金额
 				if(num >= tab.parent('.list-inline').attr('data-discountsNum')) {
			 		discount = num * tab.parent('.list-inline').attr('data-discountsAmount') + discount
			 		payment += num * unit (tab.parent('.list-inline'), tab.parents('.tickets'), tab, currPriceIndex, prices) - num * tab.parent('.list-inline').attr('data-discountsAmount')
 				} else {
			 		payment += num * unit (tab.parent('.list-inline'), tab.parents('.tickets'), tab, currPriceIndex, prices)
 				}
 			} else if (tab.parent('.list-inline').attr('data-discountsType') == 2) {
 				//赠送
 				if(num >= tab.parent('.list-inline').attr('data-discountsNum')) {
			 		discount = tab.parents('.tickets').find('.list-inline').attr('data-freeNum') * unit (tab.parent('.list-inline'), tab.parents('.tickets'), tab, currPriceIndex, prices)  + discount
			 		payment = num * unit (tab.parent('.list-inline'), tab.parents('.tickets'), tab, currPriceIndex, prices) + payment
			 		sum += parseInt(tab.parents('.tickets').find('.list-inline').attr('data-freeNum'))
 				} else {
			 		payment += num * unit (tab.parent('.list-inline'), tab.parents('.tickets'), tab, currPriceIndex, prices)
 				}
 			}else {
		 		payment += num * unit (tab.parent('.list-inline'), tab.parents('.tickets'), tab, currPriceIndex, prices)
			}
 		} else {
	 		payment += num * unit (tab.parent('.list-inline'), tab.parents('.tickets'), tab, currPriceIndex, prices)
 		}
 		//优惠特殊样式
		if (discount==0) {
			$('.discount').addClass('decoration')
		} else {
			$('.discount').removeClass('decoration')
		}
 		$('.count .num span').text(sum)
 		$('.payment').text(payment)
 		$('.discount').text(discount)
 	};

 	function subtract (target) {
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
 		calculation (num, $(this))
 	}

})