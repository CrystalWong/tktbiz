$(function(){
	init()
	function init() {
		minutes ()
	}
	function minutes () {
	    var m=29;
	    var s=59;
	    setInterval(function(){
	        s--;
	        if(s<0){
	            s=59;
	            m--;
	        }
	        if (m == 0) {
	        	window.location.href = "/index.html"
	        }
	    },1000)
	}
});