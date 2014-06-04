var timeout = 500;
var i = 0;

var timeoutZoom = 1000;

function getControls(){
	
	if($('#content #inhalt #scrollable').hasClass('opacityScrollable')){
		var length = $('#content #inhalt .opacityScrollable .items .imageOrder').length-1;
	}else if($('#content #inhalt #scrollable').hasClass('scrollable')){
		var length = $('#content #inhalt .scrollable .items .imageOrder').length-1;
	}
	

	var borderLength = $('.scrollable-border .items .image').length;
	
	
	var control1 = $('.control.top').data("controltop") ? $('.control.top').data("controltop") : 87;
    var control2 = $('.prev.left').data("controlleft") ? $('.prev.left').data("controlleft") : 65;
    var control3 = $('.control.bottom').data("controlbottom") ? $('.control.bottom').data("controlbottom") : 83;
    var control4 = $('.next.right').data("controlright") ? $('.next.right').data("controlright") : 68;

	$('.controls .control.bottom.random').click(function(){
		clickBottomRandom();
	});

	$('.controls .control.top.random').click(function(){
		clickTopRandom();
	});

	function get_random(){
	    var ranNum = Math.floor(Math.random()*borderLength);
	    return ranNum;
	}

	function get_randomRotate(){
	    var ranNum = Math.floor(Math.random()*2);
	    return ranNum;
	}

	function getaQuote(){
		$('.scrollable-border .items .image img').css('display', 'none');
		var whichQuote = get_random();
	    var quote = $('.scrollable-border .items .image img')
	    // console.log(quote[whichQuote]);
	    $(quote[whichQuote]).css('display', 'block');
		window.setTimeout(getaQuote, timeout);
	}
	window.setTimeout(getaQuote, 1);

	

	$('#content #inhalt .opacityScrollable .items .imageOrder.opacity0').css('display', 'block').addClass('active');
	$('.prev.browse.left.opacity').addClass('disabled');
	
	$('.next.browse.right').click(function(){
		clickRight(length);
	})

	$('.prev.browse.left').click(function(){
		clickLeft(length);
	})

	$('.controls .control.top.zoom').click(function(){
		clickTopZoom();
	})

	$('.controls .control.bottom.zoom').click(function(){
		clickBottomZoom();
	});

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if(event.keyCode == control1){
        	if($('.control.top').hasClass('random')){
        		clickTopRandom();
        	}else if($('.control.top').hasClass('zoom')){
        		clickTopZoom();
        	}
        }else if(event.keyCode == control3){
        	if($('.control.bottom').hasClass('random')){
        		clickBottomRandom();
        	}else if($('.control.bottom').hasClass('zoom')){
        		clickBottomZoom();
        	}
        }else if(event.keyCode == control2){
        	clickLeft(length);
        }else if(event.keyCode == control4){
        	clickRight(length);
        }
    }); 
}
$(document).ready(function(){	
	
	getControls();
});

function clickTopZoom(){
	timeoutZoom += 100;
	if($('.controls .control.bottom.zoom').hasClass('disabled') && timeoutZoom > 0){
		$('.controls .control.bottom.zoom').removeClass('disabled');
	}else if(timeoutZoom === 1000){
		$(this).addClass('disabled');
	}
};

function clickBottomZoom(){
	timeoutZoom -= 100;
	if($('.controls .control.top.zoom').hasClass('disabled') && timeoutZoom < 1000){
		$('.controls .control.top.zoom').removeClass('disabled');
	}else if(timeoutZoom === 0){
		$(this).addClass('disabled');
	}
};

function clickTopRandom(){
	timeout -= 100;
	if($('.controls .control.bottom').hasClass('disabled') && timeout < 2000){
		
		$('.controls .control.bottom').removeClass('disabled');
	}else if(timeout === 0){
		$('.controls .control.bottom').addClass('disabled');
	}
};

function clickBottomRandom(){
	timeout += 100;
	if($('.controls .control.top').hasClass('disabled') && timeout > 0){
		
		$('.controls .control.top').removeClass('disabled');
	}else if(timeout === 2000){
		$('.controls .control.top').addClass('disabled');
		timeout = 2000;
	}
};

function clickLeft(length){
	$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(600).removeClass('active');
	$('#content #inhalt .scrollable .items .imageOrder').fadeOut(600).removeClass('active');
	i=i-1;
	if($('.next.browse.right.opacity').hasClass('disabled') && i <= length){
		$('.next.browse.right.opacity').removeClass('disabled');
		$('#content #inhalt .opacityScrollable .items .imageOrderLast.opacity-1').css('z-index', 11);
	}else if($('.next.browse.right').hasClass('disabled') && i <= length){
		$('.next.browse.right').removeClass('disabled');
		$('#content #inhalt .scrollable .items .imageOrderLast.opacity-1').css('z-index', 11);
	}
	if(i <= 0){
		$('.prev.browse.left.opacity').addClass('disabled').css('cursor', 'default');
		$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(300).removeClass('active');
		$('#content #inhalt .opacityScrollable .items .imageOrder.opacity0').fadeIn(600).addClass('active');
		$('.prev.browse.left').addClass('disabled').css('cursor', 'default');
		$('#content #inhalt .scrollable .items .imageOrder').fadeOut(300).removeClass('active');
		$('#content #inhalt .scrollable .items .imageOrder.opacity0').fadeIn(600).addClass('active');
		i = 0;
	}else{
		$('#content #inhalt .opacityScrollable .items .imageOrder.opacity'+i).fadeIn(600).addClass('active');
		$('#content #inhalt .scrollable .items .imageOrder.opacity'+i).fadeIn(600).addClass('active');
	}
};

function clickRight(length){
	$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(600).removeClass('active');
	$('#content #inhalt .scrollable .items .imageOrder').fadeOut(600).removeClass('active');

	i=i+1;
	if($('.prev.browse.left.opacity').hasClass('disabled') && i >= 1){
		$('.prev.browse.left.opacity').removeClass('disabled');
	}else if($('.prev.browse.left').hasClass('disabled') && i >= 1){
		$('.prev.browse.left').removeClass('disabled');
	}
	if(i >= length){
		$('.next.browse.right.opacity').addClass('disabled').css('cursor', 'default');
		$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(300).removeClass('active');
		$('#content #inhalt .opacityScrollable .items .imageOrder.opacity'+length).fadeIn(600).addClass('active');
		$('#content #inhalt .opacityScrollable .items .imageOrderLast.opacity-1').css('z-index', 9);
		$('.next.browse.right').addClass('disabled').css('cursor', 'default');
		$('#content #inhalt .scrollable .items .imageOrder').fadeOut(300).removeClass('active');
		$('#content #inhalt .scrollable .items .imageOrder.opacity'+length).fadeIn(600).addClass('active');
		$('#content #inhalt .scrollable .items .imageOrderLast.opacity-1').css('z-index', 9);
		i=length;
	}else{
		$('#content #inhalt .opacityScrollable .items .imageOrder.opacity'+i).fadeIn(600).addClass('active');
		$('#content #inhalt .scrollable .items .imageOrder.opacity'+i).fadeIn(600).addClass('active');
	}
};