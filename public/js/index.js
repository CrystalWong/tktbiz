$(function(){
	$('#submit').on('click', function(){
		window.location.href = '/buy.html'
	})
	$('#return-top .up').on('click', function(){
		$('html,body').animate({scrollTop:0}, 500);
	})
    $.ajax({
    	type: "GET",
     	url: "/data/index.json",
     	// url: "/data/event.json",
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
 			$('.add').on('click',add);
         	console.log(res)
      	}
 	});

 	function add (target) {
 		alert('添加')
 	}

})