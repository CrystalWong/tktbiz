$(function(){
	var mid = "083c18e8554a88fbf0b3a367e76bb488";
	var url = location.search;
	var orderNo = url.split('&orderNo=')[1];
	var tokenStr = url.split('&orderNo=')[0];
	var token = tokenStr.split('token=')[1];
	var baseUrl = "http://360.whereq.com/pco/common/api/" + mid;
	var arr = [];
	init();
	$(window).scroll(function(){
		// 滚动条距离顶部的距离 大于 200px时
		if($(window).scrollTop() >= 200){
			$("#return-top").show(); // 开始淡入
		} else{
			$("#return-top").stop(true,true).hide(); // 如果小于等于 200 淡出
		}
		if($(window).scrollTop() >= $('.banner').height() + 30){
			$('#orderInfo-wrap').addClass('fixed')
		} else{
			$('#orderInfo-wrap').removeClass('fixed')
		}
	});

	//点击 up
	$('#return-top').on('click', function(){
		$('html,body').animate({scrollTop:0}, 500);
	});
	/**
 	 * [invoiceToggle description]		关闭弹框
 	 * @return {[type]} [description]
 	 */
	$('.subclose').on('click', function(){
		$('.dialog').hide()
	});

	$('#myModal .btn-primary').on('click', function(){
		window.location.href = '/index.html#enroll';
	});

	$('.dialog .sure').on('click', function(){
		$('.invType').removeClass('invType-active');
		$('.invType-info').removeClass('invType-info-active');
		$('.invType-info').eq(0).addClass('invType-info-active');
		$('.invType').eq(0).addClass('invType-active');
		$('#invEleMobile').hide();
		$('#gettype-wrap').show();
		$('.dialog').hide()
	});
	/**
	 * [bindPay description]         绑定去付款
	 * @return {[type]} [description]
	 */
	function bindPay () {
		$('#submit').off();
		$('#submit').on('click', function(){
			pay();
		});	
	}


 	function init () {
   		orderStatus ()
   		address ()
 	};
 	/**
 	 * [orderStatus description]    查询订单状态
 	 * @return {[type]} [description]
 	 */
 	function orderStatus () {
	    $.ajax({
	    	type: "POST",
	     	url: baseUrl + "/ticket/order/query.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.code == 0) {
	     			if (res.data.payMethod == 'LocalePay') {
	     				window.location.href = '/scene.html?from=wechat&token=' + token + "&orderNo=" + orderNo;
	     			} else {
	     				if (res.data.state == 'payed') {
			     			window.location.href = '/result.html?from=wechat&token=' + token + "&orderNo=" + orderNo;
				 		} else if (res.data.state == 'cancel') {
				 			window.location.href="/index.html";
				 		} else {
				 			getData();
					 		// payTypeToggle();
					 		invoiceToggle();
					 		invTypeToggle();
						 	$('#toggle-event').on('change', function() {
						 		invoiceToggle();
					    	})
				 		}
	     			}
	     		} else if (res.code == "408") {
	     			alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
	      	}
	 	})		
 	};
 	/**
 	 * [invoiceToggle description]		查询订单状态
 	 * @return {[type]} [description]
 	 */
 	// function orderEach () {
 	// 	$.ajax({
	 //    	type: "POST",
	 //     	url: baseUrl + "/ticket/order/query.json",
  //           headers: {
		//         'x-access-token': token
		//     },
	 //     	data: {'orderNo': orderNo},
	 //     	dataType: "json",
	 //     	success: function(res){
	 //     		if (res.code == 0) {
	 //     			if (res.data.state == 'cancel') {
		// 	 			window.location.href="/index.html";
		// 	 		}
	 //     		} else if (res.code == "408") {
	 //     			alert('token已失效，请重新提交')
	 //         		window.location.href="/index.html"
	 //         	} else {
	 //         		alert(res.msg)
	 //         	}
	 //      	}
	 // 	})
 	// };
 	/**
 	 * [invoiceToggle description]		控制发票面板展示
 	 * @return {[type]} [description]
 	 */
 	function invoiceToggle () {
 		if($('#toggle-event').prop('checked')) {
 			$('#invoice').show();	
 		} else {
 			$('#invoice').hide();
 		}
 	}
 	/**
 	 * [bindSendToggle description]		绑定电子票是否发送给每个参会者监听
 	 * @return {[type]} [description]
 	 */  
 	function bindSendToggle () {
 		$('.sendTkt').off();
    	$('.sendTkt').on('click', function() {
 			sendToggle();
		}) 		
 	} 
 	/**
 	 * [sendToggle description]		电子票是否发送给每个参会者展示控制
 	 * @return {[type]} [description]
 	 */
 	function sendToggle () {
 		if($('.sendTkt input').prop('checked')) {
 			$('.sendTkt-inner').show();
 		} else {
 			$('.sendTkt-inner').hide();
 		}
 	}
 	/**
 	 * [getData description] 		获取页面初始数据
 	 * @return {[type]} [description]
 	 */
 	function getData () {
	    $.ajax({
	    	type: "POST",
	     	url: baseUrl + "/ticket/buy.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: {'orderNo': orderNo},
	     	dataType: "json",
	     	success: function(res){
	     		if (res.code == 0) {
	     			if (Number(res.data.order.orderAmt) !== 0){
		     			$('#submit').text('去付款')
		     			renderPayMethods(res);
		     			$('.invoice').show()
		     		}
		     		renderOrderInfo(res);
		     		renderAttendForms(res);
		     		renderBuyerForm(res);
		     		if(res.data.invoiceForm) {
		     			rewriteInvoice(res.data.invoiceForm);
		     		}

	     		} else if (res.code == "408") {
	     			alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
	      	}
	 	})		
 	};
 	/**
 	 * [renderPayMethods description]    回显支付方式
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderPayMethods (res) {
 		var payMethods = res.data.payMethods;
 		var payMethodList = [];
 		for(i in payMethods){
 			var payMethod = {};
 			var key = payMethods[i];
 			payMethod[key] = true;
 			payMethodList.push(payMethod);
 		}
 		bindHtml("#payForm", {"payMethodList": payMethodList}, '', res);
 	};
 	/**
 	 * [renderOrderInfo description]	渲染订单信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderOrderInfo (res) {
 		bindHtml("#orderInfo", res.data.order, '', res)
 	};
 	/**
 	 * [renderAttendForms description]	渲染参会者信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderAttendForms (res) {
 		var attendForms = res.data.attendForms;
 		for(var i=0; i<attendForms.length; i++) {
 			var formItems = attendForms[i].formItems;
 			for(var k=0; k<formItems.length; k++) {
 				var typeFlag = formItems[k].type;
				formItems[k][typeFlag] = true;
 			}
 		}
 		bindHtml("#attendForms", {"attendForms": attendForms}, '', res);
 	};
 	/**
 	 * [renderBuyerForm description]    渲染购票者信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderBuyerForm (res) {
 		bindHtml("#buyerForm", {"buyerForm": res.data.buyerForm}, '', res);
 	};
 	/**
 	 * [bindHtml description]			数据注入html模版
 	 * @param  {[type]} domId [description]
 	 * @param  {[type]} data  [description]
 	 * @return {[type]}       [description]
 	 */
 	function bindHtml (domId, data, helper, res) {
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
		bindSendToggle();
		bindUpload();
		mailAutoComplete();
 		payTypeToggle();
 		bindPay();
 		rewriteAll(res);
 		radioToggle();
 	};
 	/**
 	 * [radioToggle description]     radio选中状态切换
 	 * @return {[type]} [description]
 	 */
 	function radioToggle () {
 		var radios = $('.dateRadio');
 		radios.each(function(){
 			var radioItems = $(this).find('.dateRadio-item');
 			radioItems.off();
 			radioItems.on('click',function(){
 				radioItems.removeClass('active');
 				$(this).addClass('active');
 			})
 		})
 	};
 	/**
 	 * [rewriteAll description]      全局数据回写
 	 * @return {[type]} [description]
 	 */
 	function rewriteAll (res) {
 		rewriteSelect();
 		rewriteRadio();
 		if(res.data.currPayMethod){
 			rewritePay(res.data.currPayMethod);
 		}
 	};
 	/**
 	 * [rewriteSelect description]  select数据回写
 	 * @return {[type]} [description]
 	 */
 	function rewriteSelect () {
 		var selects = $('select');
 		selects.each(function(){
 			var value = $(this).attr('rewrite');
 			if (value) {
 				$(this).val(value);
 			}
 		})
 	};
 	/**
 	 * [rewriteRadio description]  radio数据回写
 	 * @return {[type]} [description]
 	 */
 	function rewriteRadio () {
 		var targets = $('.dateRadio');
 		targets.each(function(){
 			var value = $(this).attr('rewrite');
 			if(value) {
 				// $("input[name='radio']:checked").val()
 				// var name = $(this).find('.form-control').eq(0).attr('name');
 				$(".form-control[value='" + value + "']").addClass('active');
 			}
 		})
 	};
 	/**
 	 * [rewriteInvoice description]  发票信息回写
 	 * @return {[type]} [description]
 	 */
 	function rewriteInvoice (info) {
 		$('#toggle-event').bootstrapToggle('on');
 		var type = info.type;
 		var takerType = info.takerType;
 		var getType = info.getType;
 		$(".invType[invtype='"+ type +"']").click();
 		if(type !== '2') {
 			$(".invType-info-active .accept[accepttype='"+ takerType +"']").click();
 			if(type == '3') {
 				$(".invType-info-active .mobile").val(info.mobile);
 			}
 		} else {
 			$(".invType-info-active .companyRegAddress").val(info.companyRegAddress);
 			$(".invType-info-active .companyFinanceTel").val(info.companyFinanceTel);
 			$(".invType-info-active .bank").val(info.bank);
 			$(".invType-info-active .bankNo").val(info.bankNo);
 		}
 		$(".invType-info-active .title").val(info.title);
 		$(".invType-info-active .serviceType").val(info.serviceType);
 		$(".invType-info-active .taxpayerId").val(info.taxpayerId);
 		$(".invType-info-active .remark").val(info.remark);
 		if(type !== '3') {
 			$('#gettype-wrap').show();
 			$(".getType[getType='"+ getType +"']").click();
 			if(getType == '2') {
 				$('.postName').val(info.postName);
 				$('.postTel').val(info.postTel);
 				$('.postAddress').val(info.postAddress);
 				$('#input_province').val(info.postProvince);
 				$('#input_province').change();
 				$('#input_city').val(info.postCity);
 				$('#input_city').change();
 				$('#input_area').val(info.postCounty);
 			}
 		}

 	};
 	/**
 	 * [rewritePay description]     支付方式回写
 	 * @return {[type]} [description]
 	 */
 	function rewritePay (payMethod) {
 		var target = $(".pay-item[paytype='"+ payMethod +"']");
 		$('.pay-item').removeClass('active');
 		target.addClass('active');
 	}
 	/**
 	 * [creatCopySele description]     创建复制信息下拉框
 	 * @return {[type]} [description]
 	 */
 	function creatCopySele () {
 		var htmlSele = $('#attendForms-wrap .header-tit');
 		var htmlStr = '';
 		for(var i=0; i<htmlSele.length; i++) {
 			htmlStr +="<option value='"+ i +"'>" + htmlSele[i].innerText + "</option>";
 		}
 		var tarHtml = "<select class='copySele form-control'><option>请选择要复制的参会者信息</option>" + htmlStr + "</select>"
		$('.copySele-wrap').html(tarHtml);
		$('.copySele-wrap').eq(0).html('');
		copyInfo();
		bindVld();
		deleCurrOption();
 	}
 	/**
 	 * [deleCurrOption description]   删除复制当前panel信息选项
 	 * @return {[type]} [description]
 	 */
 	function deleCurrOption () {
 		var panel = $('.panel');
 		for (var i=0; i < panel.length; i++) {
 			panel.eq(i+1).find('option[value="'+ (i+1) +'"]').remove();
 		}
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
			if(doms.length) {
				doms.each(function(){
					var name = $(this).attr('posi');
					var type = $(this).attr('type');
					var value = $(this).val();
					var headerTit = $('.panel').eq(tarIndex+1).find('.header-tit').text();
					if(headerTit == '购票者信息') {
						$('.panel').eq(tarIndex+1).find("[posi='" + name + "']").val(value);
					} else {
						if(name !== "name" && name !== "mobile" && name !== "email") {
							if(type == "file") {
								var path = $(this).attr('path');
								var target = $('.panel').eq(tarIndex+1).find("[posi='" + name + "']");
								target.attr('path',path);
								target.closest('.upload-wrap').find('.upload-text').text(path);
							} else {
								$('.panel').eq(tarIndex+1).find("[posi='" + name + "']").val(value);
							}
						}
					}
				});
			} else {
				var domsWrap = $(this).closest('.panel').find('.form-horizontal');
				var doms = domsWrap.find('.form-control');
				doms.each(function(){
					var type = $(this).attr('type');
					if(type == "file") {
						$(this).attr('path', '');
						$(this).closest('.upload-wrap').find('.upload-text').text('上传您的学生证扫描件');
					} else {
						$(this).val('');
					}
				});
			}
		})
 	}
 	/**
 	 * [bindVld description]		blur绑定数据校验
 	 * @return {[type]} [description]
 	 */
 	function bindVld () {
		var inputs = $('.form-group .form-control:input');
		inputs.each(function(){
			$(this).off('blur');
			$(this).on('blur', function() {
				checkAll($(this));
			})
		})
 	}
 	/**
 	 * [checkAll description]          全局校验
 	 * @param  {[type]} dom [description]
 	 * @return {[type]}     [description]
 	 */
 	function checkAll(dom){
 		var val = '';
 		var type = dom.attr('type');
 		if(type == 'file') {
 			val = dom.attr('path');
 		} else if (type == 'radio') {
 			var val = dom.closest('.dateRadio').find('.active').length;
 		} else {
 			val = dom.val();
 		}
		if(!val || val == '请选择') {
			dom.closest('.form-group').find('.hint').show();
			if (type == 'radio') {
				var hideInput = dom.closest('.dateRadio').find('select');
				arr.push(hideInput);
			} else {
				arr.push(dom);
			}
		} else {
			dom.closest('.form-group').find('.hint').hide();
		}

		var name = dom.attr('name');
		if(name === 'name') {
			checkName(dom, val);
		}
		if(name === 'mobile') {
			checkMobile(dom, val);
		}
		if(name === 'email') {
			checkEmail(dom, val);
		}
		if(val && name === 'bankNo') {
			checkBankNo(dom, val);
		}
 	}
 	/**
 	 * [checkBankNo description]         校验银行卡号
 	 * @param  {[type]} dom [description]
 	 * @return {[type]}     [description]
 	 */
 	function checkBankNo (dom, val) {
 		var reg = /^[0-9]*$/;
 		if (reg.test(val)){
		    dom.closest('.form-group').find('.hint').text('');
		    dom.closest('.form-group').find('.hint').hide();
		} else {
			dom.closest('.form-group').find('.hint').text('请输入正确格式的 银行卡号');
		    dom.closest('.form-group').find('.hint').show();
		    arr.push(dom)
		}
 	};
 	/**
 	 * [checkEmail description]          校验邮箱
 	 * @param  {[type]} dom [description]
 	 * @param  {[type]} val [description]
 	 * @return {[type]}     [description]
 	 */
 	function checkEmail (dom) {
 		var val = dom.val();
 		var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
		if (reg.test(val)){
		    dom.closest('.form-group').find('.hint').text('');
		    dom.closest('.form-group').find('.hint').hide();
		} else {
			dom.closest('.form-group').find('.hint').text('请输入正确格式的 邮箱');
		    dom.closest('.form-group').find('.hint').show();
		    arr.push(dom)
		}
 	} 
 	/**
 	 * [checkName description]          校验姓名
 	 * @param  {[type]} dom [description]
 	 * @param  {[type]} val [description]
 	 * @return {[type]}     [description]
 	 */
 	function checkName (dom, val) {
 		var reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;  //只包括英文字母与汉字
		if (val && !reg.test(val)){
		    dom.closest('.form-group').find('.hint').text('请输入正确格式的 姓名 只限英文和汉字');
		    dom.closest('.form-group').find('.hint').show();
		    arr.push(dom)
		}
 	}
 	/**
 	 * [checkMobile description]         校验手机号
 	 * @param  {[type]} dom [description]
 	 * @param  {[type]} val [description]
 	 * @return {[type]}     [description]
 	 */
 	function checkMobile (dom, val) {
 		var reg = /^1[345678]{1}\d{9}$/
      	if (val && !reg.test(val)) {
        	dom.closest('.form-group').find('.hint').text('请输入正确的手机号');
		    dom.closest('.form-group').find('.hint').show();
		    arr.push(dom)
      	}
 	}
 	/**
 	 * [bindUpload description]        绑定文件上传
 	 * @return {[type]} [description]
 	 */
 	function bindUpload () {
 		$(".upload-wrap").off();
		$(".upload-wrap").on("change", "input[type=file]", function(e) {
			var imgObj = e.target.files[0];
			// var name = imgObj.name;
			var domWrap = e.target.closest('.upload-wrap');
			// $(domWrap).find('.upload-text').text(name);
			var formData = new FormData();
			formData.append('file', imgObj);
			$.ajax({
				headers: {
			        'x-access-token': token
			    },
			    url: baseUrl + "/ticket/upload.json",
			    type: 'POST',
			    cache: false,
			    data: formData,
			    processData: false,
			    contentType: false
			}).done(function(res) {
				// console.log(res);
				if (res.code == 0) {
					$(domWrap).find('.upload-text').text(res.path);
					// $(e.target).attr('picName', name);
					$(e.target).attr('path', res.path);
					alert('上传成功')
				} else if (res.code == "408") {
					alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
			}).fail(function(res) {
				alert(res.msg);
			});               
	    });
 	}
 	/**
 	 * [invTypeToggle description]   发票信息展示切换
 	 * @return {[type]} [description]
 	 */
 	function invTypeToggle () {
 		$('.invType').unbind('click');
 		$('.invType').on('click', function () {
 			var index = $(this).index();
 			if(index == 2) {
 				$('.invType').removeClass('invType-active');
 				$('.invType-info').removeClass('invType-info-active');
 				$('.invType-info').eq(0).addClass('invType-info-active');
 				$('.invType').eq(index).addClass('invType-active');
 				$('#invEleMobile').show();
 				$('#gettype-wrap').hide();
 			} else if(index == 0 && $('#invEleMobile').is(':visible')){
 				$('.dialog').show();
 			} else {
 				$('#invEleMobile').hide();
 				$('#gettype-wrap').show();
 				$('.invType').removeClass('invType-active');
 				$('.invType-info').removeClass('invType-info-active');
 				$('.invType').eq(index).addClass('invType-active');
 				$('.invType-info').eq(index).addClass('invType-info-active');
 			}
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
 		arr = []
 		var payMethod = $('.pay-wrap .active').attr('paytype');
 		var needInvoice = $('#toggle-event').prop('checked');
 		var sendAll = $('.sendTkt input').prop('checked');
 		var ticketUsers = getTicketUsers();
 		var buyer = getBuyer();
 		var invoice = {};
 		if(needInvoice == true) {
 			invoice = getInvoice();
 		}
 		var data = {
 			"buyer": buyer,
 			"invoice": invoice,
 			"needInvoice": needInvoice,
 			"orderNo": orderNo,
 			"payMethod": payMethod,
 			"sendAll": sendAll,
 			"ticketUsers": ticketUsers
 		}
 		console.log(data, 23456)
 		if(buyer && ticketUsers && invoice){
 			console.log("有效的购票者信息！");
 			submit(data);
 		} else {
 			arr[0].focus()
 		}
 	};
 	/**
 	 * [submit description]              提交购票信息
 	 * @param  {[type]} data [description]
 	 * @return {[type]}      [description]
 	 */
 	function submit (data) {
	    $.ajax({
	    	type: "POST",
	     	url: baseUrl + "/ticket/pay.json",
            headers: {
		        'x-access-token': token
		    },
	     	data: JSON.stringify(data),
	     	contentType: 'application/json',
	     	success: function(res){
	         	if(res.code == '0') {
	         		if (data.payMethod == "CodePay") {
	         			window.location.href = '/pay.html?token=' + token + "&orderNo=" + orderNo;
	         		} else if(data.payMethod == "AlipayQuick") {
	         			window.location.href = '/alipay.html?token=' + token + "&orderNo=" + orderNo;
	         		} else if(data.payMethod == "PayPal") {
	         			window.location.href = '/paypal.html?token=' + token + "&orderNo=" + orderNo;
	         		} else if(data.payMethod == "LocalePay") {
	         			window.location.href = '/scene.html?token=' + token + "&orderNo=" + orderNo;
	         		} else {
	         			window.location.href = '/result.html?token=' + token + "&orderNo=" + orderNo;
	         		}
	         	} else if (res.code == "408") {
	         		alert('token已失效，请重新提交')
	         		window.location.href="/index.html"
	         	} else {
	         		alert(res.msg)
	         	}
	      	}
	 	})
 	}
 	/**
 	 * [getBuyer description]		获取购票者信息
 	 * @return {[type]} [description]
 	 */
 	function getBuyer () {
 		var doms = $('#buyerForm-wrap .required').closest('.form-group').find('.form-control');
 		doms.each(function(){
 			checkAll($(this));
 		});
 		var showFlag = $('#buyerForm-wrap .required').is(':visible');
 		if(showFlag) {
 			return false;
 		}
 		var email = $('#buyerForm-wrap .email').val();
 		var mobile = $('#buyerForm-wrap .mobile').val();
 		var name = $('#buyerForm-wrap .name').val();
 		var buyer = {
 			"email": email,
 			"mobile": mobile,
 			"name": name
 		}
 		return buyer;
 	};
 	/**
 	 * [getInvoice description]		获取发票信息
 	 * @return {[type]} [description]
 	 */
 	function getInvoice () {
 		var doms = $('.invType-info-active .required').closest('.form-group').find('.form-control');
 		doms.each(function(){
 			var dom = $(this);
 			if (dom.hasClass('.taxpayerId') && dom.is(':hidden')) {
 				return true;
 			} else {
 				checkAll(dom);
 			}
 		});
 		var showFlag = $('.invType-info-active .required').is(':visible');
 		if(showFlag) {
 			return false;
 		}
 		var showFlagRecieve = $('.recieve').is(':visible');
 		if(showFlagRecieve) {
 			var domsRecieve = $('.recieve .required').closest('.form-group').find('.form-control');
 			domsRecieve.each(function(){
 				var domRecieve = $(this);
 				checkAll(domRecieve);
 			})
	 		var showFlag2 = $('.recieve .required').is(':visible');
	 		if(showFlag2) {
	 			return false;
	 		}
 		}
 		var type = $('.invType-active').attr('invType');
 		var takerType = $('.acceptType-active').attr('acceptType');
 		var title = $('.invType-info-active .title').val();
 		var serviceType = $('.invType-info-active .serviceType').val();
 		var taxpayerId = $('.invType-info-active .taxpayerId').val();
 		var remark = $('.invType-info-active .remark').val();
 		var companyRegAddress = $('.invType-info-active .companyRegAddress').val();
 		var companyFinanceTel = $('.invType-info-active .companyFinanceTel').val();
 		var bank = $('.invType-info-active .bank').val();
 		var bankNo = $('.invType-info-active .bankNo').val();
 		var getType = $('.getType-active').attr('getType');
 		var postName = $('.postName').val();
 		var postTel = $('.postTel').val();
 		var postProvince = $('#input_province').val();
 		var postCity = $('#input_city').val();
 		var postCounty = $('#input_area').val();
 		var postAddress = $('.postAddress').val();
 		var mobile = $('#invEleMobile input').val();
 		var invoice = {
 			"type": type || '',
 			"takerType": takerType || '',
 			"title": title || '',
 			"serviceType": serviceType || '',
 			"taxpayerId": taxpayerId || '',
 			"remark": remark || '',
 			"companyRegAddress": companyRegAddress || '',
 			"companyFinanceTel": companyFinanceTel || '',
 			"bank": bank || '',
 			"bankNo": bankNo || '',
 			"getType": getType || '',
 			"postName": postName || '',
 			"postTel": postTel || '',
 			"postProvince": postProvince || '',
 			"postCity": postCity || '',
 			"postCounty": postCounty || '',
 			"postAddress": postAddress || '',
 			"mobile": mobile || ''
 		}
 		return invoice;
 	};
 	/**
 	 * [getTicketUsers description]    获取参会者信息
 	 * @return {[type]} [description]
 	 */
 	function getTicketUsers () {
 		var doms = $('#attendForms-wrap .required').closest('.form-group').find('.form-control');
 		doms.each(function(){
 			checkAll($(this));
 		});
 		var showFlag = $('#attendForms-wrap .required').is(':visible');
 		if(showFlag) {
 			return false;
 		}
 		var ticketUsers = [];
 		var attendants = $('#attendForms-wrap .panel');
 		for(var i=0; i<attendants.length; i++) {
 			var attendant = {};
 			var inputs = attendants.eq(i).find('.form-group .form-control');
 			// console.log(inputs.length, 897)
 			attendant["tid"] = attendants.eq(i).attr('tid');
 			attendant["uid"] = attendants.eq(i).attr('uid') || '';
 			for(var k=0; k<inputs.length; k++) {
 				var key = inputs.eq(k).attr('name');
 				var type = inputs.eq(k).attr('type');
 				if(type == "file") {
 					var value = inputs.eq(k).attr("path");
 				} else if(type == "radio"){
 					// var value = $("input[name='" + key + "']:checked").val();
 					var value = $(".active[name='" + key + "']").attr("value");
 				} else {
 					var value = inputs.eq(k).val();
 				}
 				if(!attendant[key]) {
 					attendant[key] = value;
 				}
 			}
 			ticketUsers.push(attendant)
 		}
 		return ticketUsers;
 	};
 	/**
 	 * [payTypeToggle description]		切换支付方式
 	 * @return {[type]} [description]
 	 */
 	function payTypeToggle () {
 		$('.pay-item').eq(0).addClass('active');
 		$('.pay').on('click',function(){
 			$('.pay').removeClass('pay-active');
 			$(this).addClass('pay-active');
 		})
 		$('.pay-item').on('click',function(){
 			$('.pay-item').removeClass('active');
 			$(this).addClass('active');
 		})
 		$('.pay-wrap .pay-type').on('click', function(){
 			if($(this).text().replace(/(^\s+)|(\s+$)/g,"") == "在线支付平台"){
 				$(this).closest('.pay').find('.pay-item').eq(0).addClass('active');
 			} else {
 				$(this).closest('.pay').addClass('active');
 			}
 		})
 	};
 	/**
 	 * [mailAutoComplete description]   邮箱自动补全
 	 * @return {[type]} [description]
 	 */
 	function mailAutoComplete () {
 		var emailDoms = $('input[type=email]');
 		emailDoms.each(function(){
 			var dom = $(this);
			var mail = new hcMailCompletion(dom,function(){
				checkEmail(dom);
			});
			mail.run();
 		})
 	}
 	/**
 	 * [addressComplete description]   三级联动
 	 * @return {[type]} [description]
 	 */
 	function address () {
 		var html = "";
	    $("#input_city").append(html);
	    $("#input_area").append(html);
	    $.each(pdata,function(idx,item){
	        if (parseInt(item.level) == 0) {
	            html += "<option value="+item.code+" >"+ item.names +"</option> ";
	        }
	    });
	    $("#input_province").append(html);
	    $("#input_province").change(function(){
	        if ($(this).val() == "") return;
	        $("#input_city option").remove();
	        $("#input_area option").remove();
	        //var code = $(this).find("option:selected").attr("exid");
	        var code = $(this).find("option:selected").val();
	        code = code.substring(0,2);
	        var html = "<option value=''>--请选择--</option>";
	        $("#input_area option").append(html);
	        $.each(pdata,function(idx,item){
	            if (parseInt(item.level) == 1 && code == item.code.substring(0,2)) {
	                html +="<option value="+item.code+" >"+ item.names +"</option> ";
	            }
	        });
	        $("#input_city ").append(html);
	    });
	    $("#input_city").change(function(){
	        if ($(this).val() == "") return;
	        $("#input_area option").remove();
	        var code = $(this).find("option:selected").val();
	        code = code.substring(0,4);
	        var html = "<option value=''>--请选择--</option>";
	        $.each(pdata,function(idx,item){
	            if (parseInt(item.level) == 2 && code == item.code.substring(0,4)) {
	                html +="<option value="+item.code+" >"+ item.names +"</option> ";
	            }
	        });
	        $("#input_area").append(html);
	    });
 	}
	 	
})

