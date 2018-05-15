$(function(){
	init();
	$('#submit').on('click', function(){
		window.location.href = '/result.html'
	});

 	function init () {
 		getData();
 	};
 	/**
 	 * [getData description] 		获取页面初始数据
 	 * @return {[type]} [description]
 	 */
 	function getData () {
	    $.ajax({
	    	type: "GET",
	     	url: "/data/buy.json",
	     	data: {},
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
 			console.log(attendForms[i])
 			for (var k=0; k < attendForms[i].num; k++) {
 				attendForms[i].formItemsBox.push({"formItems":attendForms[i].formItems})
 			}
 		}
 		var handleHelper_1 = Handlebars.registerHelper("addOne",function(index){
	        //返回+1之后的结果
	        return index+1;
		 }); 		
 		var handleHelper_2 = Handlebars.registerHelper("compareType",function(type){
	        return type === "list";
		 });
 		console.log({"attendForms": attendForms}, 999)
 		bindHtml("#attendForms", {"attendForms": attendForms});
 		// bindHtml("#attendForms", attendForms);
 	};
 	/**
 	 * [renderBuyerForm description]    渲染购票者信息
 	 * @param  {[type]} res [description]
 	 * @return {[type]}     [description]
 	 */
 	function renderBuyerForm (res) {
 		bindHtml("#buyerForm", res.data.buyerForm);
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
 	}

 	setTimeout(creatCopySele,500)

 	function creatCopySele () {
 		var htmlSele = $('.header-tit');
 		var htmlStr = '';
 		for(var i=0; i<htmlSele.length; i++) {
 			htmlStr +="<option value='"+ i +"'>" + htmlSele[i].innerText + "</option>";
 		}
 		var tarHtml = "<select class='copySele form-control'><option>请选择要复制的参会者信息</option>" + htmlStr + "</select>"
 		console.log(htmlSele, tarHtml)
		$('.copySele-wrap').html(tarHtml);
		$('.copySele-wrap').eq(0).html('')
		$('.copySele').change("change", function() {
			var tarIndex = $('.copySele').index(this);
			var index = $(this).children('option:selected').val();
			// console.log($('.copySele').index(this), 999)
			var inputs = $('.panel').eq(index).find("input")
			inputs.each(function(){
				var name = $(this).attr('posi')
				var value = $(this).val()
				$('.panel').eq(tarIndex+1).find("input[posi='" + name + "']").val(value);
			})
		})
 	}

})