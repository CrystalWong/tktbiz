$(function(){
	var type;
	var arr = [];
	init()
	function init () {
		bindVld ();
		mailAutoComplete ();
	}
	
	$(window).scroll(function(){
		// 滚动条距离顶部的距离 大于 200px时
		if($(window).scrollTop() >= 200){
			$("#return-top").show(); // 开始淡入
		} else{
			$("#return-top").stop(true,true).hide(); // 如果小于等于 200 淡出
		}
		if($(window).scrollTop() >= $('.banner').height() + 60){
			$('#orderInfo-left').addClass('fixed_left')
			$('#orderInfo-right').addClass('fixed_right')
		} else{
			$('#orderInfo-left').removeClass('fixed_left')
			$('#orderInfo-right').removeClass('fixed_right')
		}
	})
	//点击 up
	$('#return-top').on('click', function(){
		$('html,body').animate({scrollTop:0}, 500);
	});
	$('.nav').on('click',function () {
		var listType = $(this).attr('listType');
		list (listType)
		bodyRight (listType)
	})
	$('.infoNav').on('click',function () {
		var listType = $(this).attr('listType');
		bodyRight (listType)
	})
	/**
 	 * [radioComplete description]   选择日期
 	 * @return {[type]} [description]
 	 */
	$('.acceptType .accept').unbind('click');
	$('.acceptType .accept').on('click', function () {
		var index = $(this).index();
		$('.acceptType .accept').removeClass('acceptType-active');
		$('.acceptType .accept').eq(index).addClass('acceptType-active');
	})
	/**
 	 * [listComplete description]   切换展示信息
 	 * @return {[type]} [description]
 	 */
	function list (listType) {
		$('.nav').removeClass('box_left_action2');
		$('.nav[listType= '+ listType +']').addClass('box_left_action2');
	}
	function bodyRight (listType) {
		$('.box_right').removeClass('box_right_action');
		$('.box_right[listType= '+ listType +']').addClass('box_right_action');
		if (listType == 'order' || listType == 'ticket') {
			type = listType
		}
	}
	/**
 	 * [backComplete description]   修改参会信息返回
 	 * @return {[type]} [description]
 	 */
	$('.box_right_info .backs').on('click', function () {
		bodyRight (type)
	})
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
		if(!val || val == '请选择') {
			dom.closest('.form-group').find('.hint').show();
			arr.push(dom)
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
 	 * [checkEmail description]          校验邮箱
 	 * @param  {[type]} dom [description]
 	 * @param  {[type]} val [description]
 	 * @return {[type]}     [description]
 	 */
 	function checkEmail (dom) {
 		var val = dom.val();
 		console.log(val,88)
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
});