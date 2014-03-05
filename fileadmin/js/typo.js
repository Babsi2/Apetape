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

	$('a.browse, .controls .control').tooltip();

	$('#content').css('height', $(window).height());
	$('#content #inhalt .scrollable .items img').css('height', $(window).height());
	$('#content #inhalt .scrollable .items img').css('width', $(window).width());

	$('.scrollable').css('height', $(window).height());
	$(".scrollable").css('width', $(window).width());
	$('.scrollable .items div').first().addClass('active');
	$(".scrollable").scrollable({
		onSeek: function(){
			$('.scrollable .items div').removeClass('active');
			$('.scrollable .items div img').removeClass('zoomed').removeClass('rotated').removeClass('blured').removeClass('opacified');
			$('.scrollable .items > div:nth-child(' + (this.getIndex()+1) + ')').addClass('active');
		}
	});

	var borderLength = $('.scrollable-border .items .image').length;
	var timeout = 5000;

	$('.controls .control.top').click(function(){
		timeout += 1000;
		console.log(timeout);
		if($('.controls .control.bottom').hasClass('disabled') && timeout > 0){
			$('.controls .control.bottom').removeClass('disabled');
		}else if(timeout === 10000){
			$(this).addClass('disabled');
		}
		
	})

	$('.controls .control.bottom').click(function(){
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



	$('.buttons .button.Zoom').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('zoomed');
		}else{
			console.log('zoom');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('zoomed');
		}
	});

	$('.buttons .button.Blur').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('blured');
		}else{
			console.log('blur');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('blured');
		}
	});

	$('.buttons .button.Rotate').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('rotated');
		}else{
			console.log('rotate');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('rotated');
		}
		//$('#content #inhalt .imageCollection img.rotated').css('max-height', $(window).height()+200);
	});

	$('.buttons .button.Opacity').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('opacified');
		}else{
			console.log('opacity');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('opacified');
		}
	});


});


$(window).resize(function(){
	$('#content').css('height', $('.image img').height());
	$('#content #inhalt .imageCollection img').css('height', $('.image img').height());
	$(".scrollable").scrollable('height', $('.image img').height());
});