	var borderLength = $('.scrollable-border .items .image').length;
	var timeout = 5000;

	$('.controls .control.top.random').click(function(){
		timeout += 1000;
		console.log(timeout);
		if($('.controls .control.bottom').hasClass('disabled') && timeout > 0){
			$('.controls .control.bottom').removeClass('disabled');
		}else if(timeout === 10000){
			$(this).addClass('disabled');
		}
		
	})

	$('.controls .control.bottom.random').click(function(){
		timeout -= 1000;
		console.log(timeout);
		if($('.controls .control.top').hasClass('disabled') && timeout < 10000){
			$('.controls .control.top').removeClass('disabled');
		}else if(timeout === 0){
			$(this).addClass('disabled');
		}
	})

	function get_random()
	{
	    var ranNum = Math.floor(Math.random()*borderLength);
	    return ranNum;
	}

	function get_randomRotate()
	{
	    var ranNum = Math.floor(Math.random()*2);
	    return ranNum;
	}

	function getaQuote()
	{
		$('.scrollable-border .items .image img').css('display', 'none');
		var whichQuote = get_random();
	    var quote = $('.scrollable-border .items .image img')
	    // console.log(quote[whichQuote]);
	    $(quote[whichQuote]).css('display', 'block');
		window.setTimeout(getaQuote, timeout);
	}
	window.setTimeout(getaQuote, 1);

	var i = 0;
	var length = $('#content #inhalt .opacityScrollable .items .imageOrder').length-1;
	$('#content #inhalt .opacityScrollable .items .imageOrder.opacity0').css('display', 'block');
	$('.prev.browse.left.opacity').addClass('disabled');
	
	$('.next.browse.right.opacity').click(function(e){
		$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(600);

		i++;
		if($('.prev.browse.left.opacity').hasClass('disabled') && i >= 1){
			$('.prev.browse.left.opacity').removeClass('disabled');
		}
		if(i >= length){
			$(this).addClass('disabled').css('cursor', 'default');
			$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(300);
			$('#content #inhalt .opacityScrollable .items .imageOrder.opacity'+length).fadeIn(600);
			$('#content #inhalt .opacityScrollable .items .imageOrderLast.opacity-1').css('z-index', 9);
			i = 3;
		}else{
			$('#content #inhalt .opacityScrollable .items .imageOrder.opacity'+i).fadeIn(600);
		}
		console.log(i);
		
	})

	$('.prev.browse.left.opacity').click(function(e){
		$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(600);
		i--;
		if($('.next.browse.right.opacity').hasClass('disabled') && i !== length){
			$('.next.browse.right.opacity').removeClass('disabled');
			$('#content #inhalt .opacityScrollable .items .imageOrderLast.opacity-1').css('z-index', 11);
		}
		if(i <= 0){
			$(this).addClass('disabled').css('cursor', 'default');
			$('#content #inhalt .opacityScrollable .items .imageOrder').fadeOut(300);
			$('#content #inhalt .opacityScrollable .items .imageOrder.opacity0').fadeIn(600);
			i = 0;
		}else{
			$('#content #inhalt .opacityScrollable .items .imageOrder.opacity'+i).fadeIn(600);
		}
		console.log(i);
	})

	var timeoutZoom = 1000;
	$('.controls .control.top.zoom').click(function(){
		timeoutZoom += 100;
		console.log(timeoutZoom);
		if($('.controls .control.bottom.zoom').hasClass('disabled') && timeoutZoom > 0){
			$('.controls .control.bottom.zoom').removeClass('disabled');
		}else if(timeoutZoom === 1000){
			$(this).addClass('disabled');
		}
		
	})
	$('.controls .control.bottom.zoom').click(function(){
		timeoutZoom -= 100;
		console.log(timeoutZoom);
		if($('.controls .control.top.zoom').hasClass('disabled') && timeoutZoom < 1000){
			$('.controls .control.top.zoom').removeClass('disabled');
		}else if(timeoutZoom === 0){
			$(this).addClass('disabled');
		}
	})