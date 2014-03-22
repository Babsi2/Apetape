var templates={},translations={},jsonObject={},browserName=navigator.appName,browserVer=parseInt(navigator.appVersion),version="",msie4=(browserName=="Microsoft Internet Explorer"&&browserVer>=4);if((browserName=="Netscape"&&browserVer>=3)||msie4||browserName=="Konqueror"||browserName=="Opera"){version="n3"}else{version="n2"}
function blurLink(o){if(msie4){o.blur()}}
function dChar(n,s,e,o){n=n+o;if(o>0&&n>e){n=s+(n-e-1)}else if(o<0&&n<s){n=e-(s-n-1)}return String.fromCharCode(n)}
function dString(e,o){var d='',l=e.length,i=0;for(;i<l;i++){var n=e.charCodeAt(i);if(n>=0x2B&&n<=0x3A){d+=dChar(n,0x2B,0x3A,o)}else if(n>=0x40&&n<=0x5A){d+=dChar(n,0x40,0x5A,o)}else if(n>=0x61&&n<=0x7A){d+=dChar(n,0x61,0x7A,o)}else{d+=e.charAt(i)}}return d}
function linkTo_UnCryptMailto(s){location.href=dString(s,-2)}
function GetJSON(i){return jsonObject[i]}
function isMobileDevice() {var ua = navigator.userAgent;return ua.search(/iPhone|iPod|iPad|BlackBerry|webOS|Android/i) !== -1;}

//Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

 
$(document).ready(function(){
	// var a = document.getElementById('player');
	// a.play();
	$('a.browse, .controls .control').tooltip();

	$('#content').css('height', $(window).height());
	$('#content #inhalt .scrollable .items img').css('height', $(window).height()+10);
	$('#content #inhalt .scrollable .items img').css('width', $(window).width());

	$('#content #inhalt .no-scrollable .items img').css('height', $(window).height()+10);
	$('#content #inhalt .no-scrollable .items img').css('width', $(window).width());

	$('#content #inhalt .opacityScrollable .items img').css('height', $(window).height()+10);
	$('#content #inhalt .opacityScrollable .items img').css('width', $(window).width());

	$('.scrollable').css('height', $(window).height());
	$(".scrollable").css('width', $(window).width());
	$('.scrollable .items div').first().addClass('active');
	$(".scrollable").scrollable({
		onSeek: function(){
			$('.scrollable .items div').removeClass('active');
			//$('.scrollable .items div img').removeClass('zoomed').removeClass('rotated').removeClass('blured').removeClass('opacified');
			$('.scrollable .items > div:nth-child(' + (this.getIndex()+1) + ')').addClass('active');
		}
	});

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
	var press = false;
	var timerId = 0;
	$('.buttons .button.Zoom').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			// $('#content #inhalt .scrollable .items .active').removeClass('unzoomed');
			// clearInterval(timerId);
			$('#content #inhalt .scrollable .items .active img').removeClass('zoomed');
			$('#content #inhalt .scrollable .items .active img').addClass('unzoomed');
		}else{
			console.log('zoom');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('zoomed');
			$('#content #inhalt .scrollable .items .active img').removeClass('unzoomed');
			// timerId = setInterval(function(){
			// 	$('#content #inhalt .scrollable .items .active.unzoomed img').toggleClass('zoomed');
			// },500);
			
		}
	});

	$('.buttons .button.Sepia').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('sepia');
		}else{
			console.log('sepia');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('sepia');
			
		}
	});

	$('.buttons .button.Blau').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('blau');

		}else{
			console.log('blau');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('blau');
			$('#content #inhalt .scrollable .items .active img').removeClass('sepia');
			$('.buttons .button.Sepia').removeClass('active');
		}
	});

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
	$('.buttons .button.Zoom-p-h').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	timerId = setInterval(function(){
	    		$('#content #inhalt .scrollable .items .active img').toggleClass('zoomed-p-h');
	    	},timeoutZoom);
	    	console.log(timeoutZoom)
	    	$('.buttons .button.Zoom-p-h').addClass('active');
	    	press = true; 
	    	console.log('press&hold');  
	    }, 100);
	}).mouseup(function(e) {
		clearInterval(timerId);
	    clearTimeout(this.downTimer);
	    console.log(press);
	    $(this).removeClass('active');
	    if(press === true){
	    	$('#content #inhalt .scrollable .items .active img').removeClass('zoomed-p-h');
	    	press = false;
	    }
	});

	$('.buttons .button.Vibe').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	timerId = setInterval(function(){
	    		$('#content #inhalt .scrollable .items .active img').toggleClass('vibe');
	    	},100);
	    	$('.buttons .button.Vibe').addClass('active');
	    	press = true; 
	    	console.log('press&hold');  
	    }, 100);
	}).mouseup(function(e) {
		clearInterval(timerId);
	    clearTimeout(this.downTimer);
	    console.log(press);
	    $(this).removeClass('active');
	    if(press === true){
	    	$('#content #inhalt .scrollable .items .active img').removeClass('vibe');
	    	press = false;
	    }
	});

	$('.buttons .button.Stroboskop').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	timerId = setInterval(function(){
	    		$('#content #inhalt .scrollable .items .active img').toggleClass('strobo');
	    	},50);
	    	$('.buttons .button.Stroboskop').addClass('active');
	    	press = true; 
	    	console.log('press&hold');  
	    }, 100);
	}).mouseup(function(e) {
		clearInterval(timerId);
	    clearTimeout(this.downTimer);
	    console.log(press);
	    $(this).removeClass('active');
	    if(press === true){
	    	$('#content #inhalt .scrollable .items .active img').removeClass('strobo');
	    	press = false;
	    }
	});
	
	$('.buttons .button.Blur-O-S').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	$('#content #inhalt .scrollable .items .active img').addClass('blured');
	    	press = true; 
	    	$('.buttons .button.Blur-O-S').addClass('active');
	    	console.log('press&hold');  
	    }, 500);
	}).mouseup(function(e) {
	    clearTimeout(this.downTimer);
	    console.log(press);
	    if(press === true){
	    	$('#content #inhalt .scrollable .items .active img').removeClass('blured');
	    	$(this).removeClass('active');
	    	press = false;
	    }else{
	    	console.log('blur');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('blured');
			setTimeout(function(){
			   $('.buttons .button.Blur-O-S').toggleClass('active');
			   $('#content #inhalt .scrollable .items .active img').toggleClass('blured');

			},4000);
	    }
	});

	$('.buttons .button.Rotate').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	timerId = setInterval(function(){
	    		var whichQuote = get_randomRotate();
	    		console.log(whichQuote);
	    		if(whichQuote === 1){
	    			$('#content #inhalt .scrollable .items .active img').toggleClass('rotated');
	    		}else if(whichQuote === 0){
	    			$('#content #inhalt .scrollable .items .active img').toggleClass('rotatedUZ');
	    		}
	    	},1000);
	    	$('.buttons .button.Rotate').addClass('active');
	    	press = true; 
	    	console.log('press&hold');  
	    }, 100);
	}).mouseup(function(e) {
		clearInterval(timerId);
	    clearTimeout(this.downTimer);
	    console.log(press);
	    $(this).removeClass('active');
	    if(press === true){
	    	$('#content #inhalt .scrollable .items .active img').removeClass('rotated').removeClass('rotatedUZ');
	    	press = false;
	    }
	});

	$('.buttons .button.Opacity-on-off').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('opacified-o-s');
		}else{
			console.log('rotate');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('opacified-o-s');
		}
		//$('#content #inhalt .imageCollection img.rotated').css('max-height', $(window).height()+200);
	});

	$('.buttons .button.Opacity').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	$('#content #inhalt .scrollable .items .active img').addClass('opacified-o-s');
	    	press = true;
	    	$('.buttons .button.Opacity').addClass('active'); 
	    	console.log('press&hold');  
	    }, 500);
	}).mouseup(function(e) {
	    clearTimeout(this.downTimer);
	    console.log(press);
	    if(press === true){
	    	$('#content #inhalt .scrollable .items .active img').removeClass('opacified-o-s');
	    	$(this).removeClass('active');
	    	press = false;
	    }else{
	    	console.log('opacity');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('opacified');
			setTimeout(function(){
			   $('.buttons .button.Opacity').toggleClass('active');
			   $('#content #inhalt .scrollable .items .active img').toggleClass('opacified');

			},4000);
	    }
	});

	$('.buttons .button.Drop').click(function() {
	    console.log('drop');
		$(this).addClass('active');
		$('#content #inhalt .overlay').addClass('dropped').css('z-index', 11);
		setTimeout(function(){
		   $('.buttons .button.Drop').toggleClass('active');
		   $('#content #inhalt .overlay').toggleClass('dropped').css('z-index', 0);
		},4000);
	});


});


$(window).resize(function(){
	$('#content').css('height', $('.image img').height());
	$('#content #inhalt .imageCollection img').css('height', $('.image img').height());
	$(".scrollable").scrollable('height', $('.image img').height());
});