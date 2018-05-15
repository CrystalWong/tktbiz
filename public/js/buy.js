$(function(){
	console.log(sessionStorage.getItem("list"))
	$('#submit').on('click', function(){
		window.location.href = '/result.html'
	})
})