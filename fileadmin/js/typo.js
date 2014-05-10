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

	$('body').css('height', $(window).height());
	$('a.browse, .controls .control').tooltip();

	$('.accordion').accordion({
		active:false,
		collapsible: true
	});

	// $('#content').css('height', $(window).height()-18);
	$('#content #inhalt .scrollable .items img').css('height', $(window).height());
	$('#content #inhalt .scrollable .items img').css('width', $(window).width());

	$('#content #inhalt .scrollable-border .items img').css('height', $(window).height());
	$('#content #inhalt .scrollable-border .items img').css('width', $(window).width());

	$('#content #inhalt .no-scrollable .items img').css('height', $(window).height());
	$('#content #inhalt .no-scrollable .items img').css('width', $(window).width());

	$('#content #inhalt .opacityScrollable .items img').css('height', $(window).height());
	$('#content #inhalt .opacityScrollable .items img').css('width', $(window).width());

	$('#content #inhalt .menuBackground img').css('height', $(window).height());

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
	
	$('#navi').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active').css('left','0px');
			$('#content-navi').css({
				'overflow':'hidden',
				'width':'0px'
			});
		}else{
			$(this).addClass('active').css('left','250px');
			$('#content-navi').css({
				'overflow':'visible',
				'width':'240px'
			});
		}
	})

	if($('#content-navi .accordion-menu').hasClass('pageActive')){
		$('#content-navi').show();
		$('#navi').show();
	}else{
		$('#content-navi').hide();
		$('#navi').hide();
	}

	function show_position (event) {
	  // X- und Y-Position des Mauscursors in Abhängigkeit des
	  // Browsers ermitteln
	  if(isMobileDevice === true){
	  	var x = event.touches[0].pageX;
		var y = event.touches[0].pageY;
	  }else{
	  	x = document.all ? event.offsetX : event.pageX;
	    y = document.all ? event.offsetY : event.pageY;
	  }
	  
	  // Ausgabemeldung zusammenstellen
	  // var out = 'Mausposition: ' + x + ', ' + y;
	  // Ausgabe im dafür vorgesehenen SPAN-Element
	  $('.szene9Scrollable.szene9 .items .szene9').css('left', x);
	  $('.szene9Scrollable.szene9 .items .szene9').css('top', y);
	  // document.getElementById ('info').firstChild.data = out;
	}

	// Event-Handler für das onMousemove-Event des Body-Tags
	// festlegen
	document.body.onmousemove = show_position;
	document.body.ontouchmove = show_position;

});

$(window).resize(function(){
	$('#content').css('height', $('.image img').height());
	$('#content #inhalt .imageCollection img').css('height', $('.image img').height());
	$(".scrollable").scrollable('height', $('.image img').height());
});