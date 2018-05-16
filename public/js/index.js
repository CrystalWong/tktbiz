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
 			$('.add').on('click', add);
 			$('.subtract').on('click',subtract);
    }
 	});

 	function add (target) {
 		var num = parseInt($(this).prev().text());
 		var minNum = parseInt($(this).prev().attr('data-minNum'));
 		var maxNum = parseInt($(this).prev().attr('data-maxNum'));
 		if (num == 0) {
 			num = minNum;
 		}else if (num < maxNum) {
 			num++;
 		}
 		$(this).prev().text(num)
 		calculation (num, $(this))
 	};

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
 		for(var i=0;i<tab.parents('.tickets').siblings().length;i++) {
 			var number = parseInt(tab.parents('.tickets').siblings().eq(i).find('.num').text())
	 		//计算优惠
	 		if (tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discounts')) {
	 			if(tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discountsType') == 1) {
	 				//每张优惠金额
	 				if(number >= tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discountsNum')) {
	 					discount += parseInt(tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discountsAmount')) * number
	 					if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
				 			//固定价格计算
				 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices2').text())
				 		} else {
				 			//阶梯价格计算
				 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices1').eq(currPriceIndex).text())
				 		}
				 		payment += prices * number - parseInt(tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discountsAmount')) * number
				 		console.log(payment)
	 				} else {
	 					//没有优惠
			 			if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
				 			//固定价格计算
				 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices2').text())
				 		} else {
				 			//阶梯价格计算
				 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices1').eq(currPriceIndex).text())
				 		}
				 		payment += prices * number
	 				}
		 		} else if (tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discountsType') == 2) {
		 			//赠送
	 				if(number >= tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discountsNum')) {
	 					if(tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-tieredPricing') == false){
	 						prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices2').text())
				 		} else if(tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-tieredPricing')){
				 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices1').eq(currPriceIndex).text())
				 		}
				 		var votes = number - tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-discountsNum')
				 		if( votes <= tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-freeNum')) {
				 			discount = votes * prices + discount
				 			// console.log(discount)
				 			payment += (number * prices) - (votes * prices)
				 		} else {
				 			discount = tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-freeNum') * prices  + discount
				 			payment += (number * prices) - (tab.parents('.tickets').siblings().eq(i).find('.list-inline').attr('data-freeNum') * prices)
				 		}
	 				}
	 				else {
	 					//没有优惠
			 			if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
				 			//固定价格计算
				 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices2').text())
				 		} else {
				 			//阶梯价格计算
				 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices1').eq(currPriceIndex).text())
				 		}
				 		payment += prices * number
	 				}
		 		}else {
					//没有优惠
		 			if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
			 			//固定价格计算
			 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices2').text())
			 		} else {
			 			//阶梯价格计算
			 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices1').eq(currPriceIndex).text())
			 		}
			 		payment += prices * number
				}
	 		} else {
	 			//没有优惠
	 			if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
		 			//固定价格计算
		 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices2').text())
		 		} else {
		 			//阶梯价格计算
		 			prices = parseInt(tab.parents('.tickets').siblings().eq(i).find('.prices1').eq(currPriceIndex).text())
		 		}
		 		payment += prices * number
	 		}
	 		sum += number
 		}
 		sum = num + sum
 		
 		if (tab.parent('.list-inline').attr('data-discounts')) {
 			if(tab.parent('.list-inline').attr('data-discountsType') == 1) {
 				//每张优惠金额
 				if(num >= tab.parent('.list-inline').attr('data-discountsNum')) {
 					if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
 						prices = parseInt(tab.parents('.tickets').find('.prices2').text())
			 		} else {
			 			prices = parseInt(tab.parents('.tickets').find('.prices1').eq(currPriceIndex).text())
			 		}
			 		discount = num * tab.parent('.list-inline').attr('data-discountsAmount') + discount
			 		payment += num * prices - num * tab.parent('.list-inline').attr('data-discountsAmount')
 				} else {
 					if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
			 			payment = num * parseInt(tab.parents('.tickets').find('.prices2').text()) + payment
			 		} else {
			 			payment = num * parseInt(tab.parents('.tickets').find('.prices1').eq(currPriceIndex).text()) + payment
			 		}
 				}
 			} else if (tab.parent('.list-inline').attr('data-discountsType') == 2) {
 				//赠送
 				if(num >= tab.parent('.list-inline').attr('data-discountsNum')) {
 					if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
 						prices = parseInt(tab.parents('.tickets').find('.prices2').text())
			 		} else {
			 			prices = parseInt(tab.parents('.tickets').find('.prices1').eq(currPriceIndex).text())
			 		}
			 		var votes = num - tab.parent('.list-inline').attr('data-discountsNum')
			 		if( votes <= tab.parents('.tickets').find('.list-inline').attr('data-freeNum')) {
			 			discount = votes * prices + discount
			 			payment = (num * prices) - (votes * prices) + payment
			 		} else {
			 			discount = tab.parents('.tickets').find('.list-inline').attr('data-freeNum') * prices  + discount
			 			payment = (num * prices) - (tab.parents('.tickets').find('.list-inline').attr('data-freeNum') * prices) + payment
			 		}
 				} else {
 					if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
			 			payment = num * parseInt(tab.parents('.tickets').find('.prices2').text()) + payment
			 		} else {
			 			payment = num * parseInt(tab.parents('.tickets').find('.prices1').eq(currPriceIndex).text()) + payment
			 		}
 				}
 			}else {
				if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
		 			payment = num * parseInt(tab.parents('.tickets').find('.prices2').text()) + payment
		 		} else {
		 			payment = num * parseInt(tab.parents('.tickets').find('.prices1').eq(currPriceIndex).text()) + payment
		 		}
			}
 		} else {
 			if(tab.parent('.list-inline').attr('data-tieredPricing') == 'false'){
	 			payment = num * parseInt(tab.parents('.tickets').find('.prices2').text()) + payment
	 		} else {
	 			payment = num * parseInt(tab.parents('.tickets').find('.prices1').eq(currPriceIndex).text()) + payment
	 		}
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
 			if (num < minNum) {
	 			num = 0;
	 		}
 		}
 		$(this).next().text(num)
 		calculation (num, $(this))
 	}

})