$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	console.log(orderNo,token, 678)

	init();

	$('#submit').on('click', function(){
		// window.location.href = '/result.html'
		pay();
	});

 	function init () {
 		getData();
 		invTypeToggle();
 	};
 	/**
 	 * [getData description] 		获取页面初始数据
 	 * @return {[type]} [description]
 	 */
 	function getData () {
	    $.ajax({
	    	type: "POST",
	     	// url: "/data/buy.json",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/buy.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		renderOrderInfo(res);
	     		renderAttendForms(res);
	     		renderBuyerForm(res);
	         	console.log(res)
	      	}
	 	})		
 	};
 	/**
 	 * [renderOrderInfo description]	渲染订单信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderOrderInfo (res) {
 		var data = {
			"orderPrice": res.data.orderPrice,
			"orderItems": res.data.orderItems
		}
 		bindHtml("#orderInfo", data)
 	};
 	/**
 	 * [renderAttendForms description]	渲染参会者信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderAttendForms (res) {
 		var attendForms = res.data.attendForms
 		for (i in attendForms) {
 			attendForms[i].formItemsBox = [];
 			// console.log(attendForms[i])
 			for (var k=0; k < attendForms[i].num; k++) {
 				var formItems = attendForms[i].formItems;
 				for (var j=0; j < formItems.length; j++) {
 					var typeFlag = formItems[j].type;
 					formItems[j][typeFlag] = true;
 				}
 				attendForms[i].formItemsBox.push({"formItems":attendForms[i].formItems})
 			}
 		}
		// console.log(attendForms, 111)
 		var handleHelper_1 = Handlebars.registerHelper("addOne",function(index){
	        //返回+1之后的结果
	        return index+1;
		 }); 		
		
 		bindHtml("#attendForms", {"attendForms": attendForms});
 	};
 	/**
 	 * [renderBuyerForm description]    渲染购票者信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderBuyerForm (res) {
 		bindHtml("#buyerForm", {"buyerForm": res.data.buyerForm});
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
		creatCopySele();
 	}
 	/**
 	 * [creatCopySele description]     创建复制信息下拉框
 	 * @return {[type]} [description]
 	 */
 	function creatCopySele () {
 		var htmlSele = $('.header-tit');
 		var htmlStr = '';
 		for(var i=0; i<htmlSele.length; i++) {
 			htmlStr +="<option value='"+ i +"'>" + htmlSele[i].innerText + "</option>";
 		}
 		var tarHtml = "<select class='copySele form-control'><option>请选择要复制的参会者信息</option>" + htmlStr + "</select>"
 		// console.log(htmlSele, tarHtml)
		$('.copySele-wrap').html(tarHtml);
		$('.copySele-wrap').eq(0).html('')
		copyInfo();
		bindVld();
		upload();
 	}
 	/**
 	 * [copyInfo description]			实现信息复制功能
 	 * @return {[type]} [description]
 	 */
 	function copyInfo () {
		$('.copySele').on("change", function() {
			var tarIndex = $('.copySele').index(this);
			var index = $(this).children('option:selected').val();
			var doms = $('.panel').eq(index).find(".form-control")
			// console.log(doms, 99)
			doms.each(function(){
				var name = $(this).attr('posi')
				var value = $(this).val()
				$('.panel').eq(tarIndex+1).find("[posi='" + name + "']").val(value);
			})
		})
 	}
 	/**
 	 * [bindVld description]		绑定数据校验
 	 * @return {[type]} [description]
 	 */
 	function bindVld () {
		var inputs = $('.form-control:input');
		inputs.each(function(){
			$(this).on('blur', function() {
				var val = $(this).val();
				if(!val) {
					$(this).closest('.form-group').find('.hint').show();
				} else {
					$(this).closest('.form-group').find('.hint').hide();
				}
			})
		})
 	}
 	/**
 	 * [upload description]			模拟图片上传点击事件
 	 * @return {[type]} [description]
 	 */
 	function upload () {
 		$('.upload-dec').unbind('click');
 		$('.upload-dec').on('click', function () {
 			$(this).closest('.col-xs-10').find('.form-control').click();
 		})
 	}
 	/**
 	 * [invTypeToggle description]   发票信息展示切换
 	 * @return {[type]} [description]
 	 */
 	function invTypeToggle () {
 		$('.invType').unbind('click');
 		$('.invType').on('click', function () {
 			var index = $(this).index();
 			$('.invType').removeClass('invType-active');
 			$('.invType-info').removeClass('invType-info-active');
 			$('.invType').eq(index).addClass('invType-active');
 			$('.invType-info').eq(index).addClass('invType-info-active');
 		})
 		$('.acceptType .col-xs-2').unbind('click');
 		$('.acceptType .col-xs-2').on('click', function () {
 			var index = $(this).index();
 			$('.acceptType .col-xs-2').removeClass('acceptType-active');
 			$('.acceptType .col-xs-2').eq(index).addClass('acceptType-active');
 			if (index) {
 				$('.taxpayer').hide();
 			} else {
 				$('.taxpayer').show();
 			}
 		})
 		$('.getType').unbind('click');
 		$('.getType').on('click', function () {
 			var index = $(this).index();
 			$('.getType').removeClass('getType-active');
 			$('.getType').eq(index).addClass('getType-active');
 			if (index) {
 				$('.recieve').show();
 			} else {
 				$('.recieve').hide();
 			}
 		})
 	}
 	/**
 	 * [pay description]             去支付
 	 * @return {[type]} [description]
 	 */
 	function pay () {
 		// var payMethod = "CodePay";
 		var payMethod = "AlipayQuick";
 		var needInvoice = "true";
 		var sendAll = "true"
 		var buyer = getBuyer();
 		var invoice = getInvoice();
 		var ticketUsers = getTicketUsers();
 		var data = {
 			"buyer": buyer,
 			"invoice": invoice,
 			"needInvoice": needInvoice,
 			"orderNo": orderNo,
 			"payMethod": payMethod,
 			"sendAll": sendAll,
 			"ticketUsers": ticketUsers
 		}
 		// console.log(data, 123456)
	    $.ajax({
	    	type: "POST",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/pay.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: JSON.stringify(data),
	     	contentType: 'application/json',
	     	success: function(res){
	         	console.log(res)
	         	if(res.code == '0') {
	         		if (data.payMethod == "CodePay") {
	         			window.location.href = '/pay.html?token=' + token + "&orderNo=" + orderNo;
	         		} else if(data.payMethod == "AlipayQuick") {
	         			window.location.href = '/alipay.html?token=' + token + "&orderNo=" + orderNo;
	         		} else if(data.payMethod == "PayPal") {
	         			paypal();
	         		} else {
	         			window.location.href = '/result.html?token=' + token + "&orderNo=" + orderNo;
	         		}
	         	}
	      	}
	 	})
 	} 	
 	/**
 	 * [paypal description]      paypal支付
 	 */
 	function paypal () {
	    $.ajax({
	    	type: "GET",
	     	url: "http://whereq.360.cn:8080/pco/common/api/" + mid + "/ticket/paypal.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	         	console.log(res,777)
	      	}
	 	})
 	}
 	/**
 	 * [getBuyer description]		获取购票者信息
 	 * @return {[type]} [description]
 	 */
 	function getBuyer () {
 		var email = $('#buyerForm-wrap .email').val();
 		var mobile = $('#buyerForm-wrap .mobile').val();
 		var name = $('#buyerForm-wrap .name').val();
 		var buyer = {
 			"email": email,
 			"mobile": mobile,
 			"name": name
 		}
 		return buyer;
 	}
 	/**
 	 * [getInvoice description]		获取发票信息
 	 * @return {[type]} [description]
 	 */
 	function getInvoice () {
 		var type = $('.invType-active').text();
 		var takerType = $('.acceptType-active').text();
 		var title = $('.invType-info-active .title').val();
 		var serviceType = $('.invType-info-active .serviceType').val();
 		var taxpayerId = $('.invType-info-active .taxpayerId').val();
 		var remark = $('.invType-info-active .remark').val();
 		var companyRegAddress = $('.invType-info-active .companyRegAddress').val();
 		var companyFinanceTel = $('.invType-info-active .companyFinanceTel').val();
 		var bank = $('.invType-info-active .bank').val();
 		var bankNo = $('.invType-info-active .bankNo').val();
 		var getType = $('.getType-active').text();
 		var postName = $('.postName').val();
 		var postTel = $('.postTel').val();
 		var postProvince = "北京市";
 		var postCity = "北京市";
 		var postCounty = "朝阳区";
 		var postAddress = "博瑞大厦";
 		var invoice = {
 			"type": type,
 			"takerType": takerType,
 			"title": title,
 			"serviceType": serviceType,
 			"taxpayerId": taxpayerId,
 			"remark": remark,
 			"companyRegAddress": companyRegAddress,
 			"companyFinanceTel": companyFinanceTel,
 			"bank": bank,
 			"bankNo": bankNo,
 			"getType": getType,
 			"postName": postName,
 			"postTel": postTel,
 			"postProvince": postProvince,
 			"postCity": postCity,
 			"postCounty": postCounty,
 			"postAddress": postAddress
 		}
 		return invoice;
 	}
 	/**
 	 * [getTicketUsers description]    获取参会者信息
 	 * @return {[type]} [description]
 	 */
 	function getTicketUsers () {
 		var ticketUsers = [];
 		var attendants = $('#attendForms-wrap .panel');
 		for(var i=0; i<attendants.length; i++) {
 			var attendant = {};
 			var inputs = attendants.eq(i).find('.form-group input');
 			console.log(inputs.length, 897)
 			attendant["tid"] = attendants.eq(i).attr('tid');
 			for(var k=0; k<inputs.length; k++) {
 				var key = inputs.eq(k).attr('name');
 				var value = inputs.eq(k).val();
 				attendant[key] = value;
 			}
 			ticketUsers.push(attendant)
 		}
 		return ticketUsers;
 	}
})

