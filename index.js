function hideScroll(){
		
	document.body.style.overflow='hidden';
}
		
var scrollTop = 0;
		
function setScroll(targetDelta){
		
	var newScrollTop = scrollTop + targetDelta;
	if(newScrollTop >= 0 && newScrollTop < document.body.scrollHeight )
		scrollTop =newScrollTop;
				
}
		
function smoothScroll(){
		
	requestAnimationFrame(smoothScroll);
			
	var delta = (scrollTop-document.body.scrollTop)/10;
	document.body.scrollTop += delta>0?Math.ceil(delta):Math.floor(delta);
}

function init(){
	
	//hideScroll();
	smoothScroll();
			
	window.addEventListener('mousewheel',function(e){
			
		e.preventDefault();
		setScroll(Math.sign(e.deltaY)*document.getElementsByClassName('page')[0].clientHeight);
			
	},false);
	
	window.addEventListener('resize',function(e){
		
		
	});
	
	window.onscroll = function(e){
		
		console.log(e);
	}
	
}