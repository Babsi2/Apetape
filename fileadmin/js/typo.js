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

var page = {
	current: false,
	next: false,
	content_open: false
}

var debugging = false;

function debug(msg) {
	if (debugging) {
		console.log(msg);
	}
}

// function showContent(content) {
// 	// Set static constant
// 	page.content_open = true;
// 	console.log(content);
// 	// Re-populate inner content element
// 	//$("#complete_content").html(content);
// 	// Slide down content pane
// 	//$("#contentWrap").slideDown("slow");
// }
function getTypo(){

	$('body').css('height', $(window).height());
	$('a.browse, .controls .control').tooltip();

	$('.accordion').accordion({
		active:false,
		collapsible: true,
		heightStyle: "fill"
	});

	//$('.accordionMenue .accordion.ui-accordion').css('height', $(window).height() - 55);
	$('.accordionMenue .section-0.ui-accordion-content').css('height', $(window).height() - 349);
	$('.accordionMenue .section-1.ui-accordion-content').css('height', $(window).height() - 349);
	// $('#content').css('height', $(window).height()-18);
	$('#content #inhalt .scrollable .items img').css('height', $(window).height());
	$('#content #inhalt .scrollable .items img').css('width', $(window).width());

	$('#content #inhalt .scrollable-border .items img').css('height', $(window).height());
	//$('#content #inhalt .scrollable-border .items img').css('width', $(window).width());

	$('#content #inhalt .no-scrollable .items img').css('height', $(window).height());
	$('#content #inhalt .no-scrollable .items img').css('width', $(window).width());

	$('#content #inhalt .opacityScrollable .items img').css('height', $(window).height());
	$('#content #inhalt .opacityScrollable .items img').css('width', $(window).width());

	//$('.menuBackground img').css('width', $(window).width());

	$('.scrollable').css('height', $(document).height()+30);
	$(".scrollable").css('width', $(window).width());
	$('.scrollable .items div').first().addClass('active');
	// $(".scrollable").scrollable({
	// 	onSeek: function(){
	// 		$('.scrollable .items div').removeClass('active');
	// 		//$('.scrollable .items div img').removeClass('zoomed').removeClass('rotated').removeClass('blured').removeClass('opacified');
	// 		$('.scrollable .items > div:nth-child(' + (this.getIndex()+1) + ')').addClass('active');
	// 	}
	// });
	
	if($(window).width() > 980){
		$('#navi').click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active').css('left','36px');
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
	}else{
		$('#navi').click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active').css('left','36px');
				$('#content-navi').css({
					'overflow':'hidden',
					'width':'0px'
				});
			}else{
				$(this).addClass('active').css('left','150px');
				$('#content-navi').css({
					'overflow':'visible',
					'width':'140px'
				});
			}
		})
	}
	

	
	$('#contentWrap #content-navi .accordion-menu .accordion-sub-content a').click(function(event){
		console.log(window.location.href);
		event.preventDefault();
		var oldRef = $(this)[0].href;
		var ref = oldRef.substring(0, oldRef.length - 5);
		console.log(ref);
		if(ref == "http://www.zac.co.at/apetape/einstellungen"){
			$('#content').removeClass('szeneBegin').removeClass('szeneChangeFast');
			window.location.href="http://www.zac.co.at/apetape/einstellungen";
		}else if(ref == "http://www.zac.co.at/apetape/kapitel-2"){
			$.post(window.location.href+"/index.php?eID=complete&link="+ref+"&click=true&path=false", function( data ) {
		      $('#inhalt').html( data ); 
		     
		    });
		}else{
			$('#content').removeClass('szeneBegin').addClass('szeneChangeFast');
			$.post(window.location.href+"/index.php?eID=complete&link="+ref+"&click=true&path=false", function( data ) {
		      $('#inhalt').html( data ); 
		     
		    });
		}
	});

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
	  	x = event.pageX;
	    y = event.pageY - $(window).scrollTop();
	  }
	  
	  // Ausgabemeldung zusammenstellen
	  // var out = 'Mausposition: ' + x + ', ' + y;
	  // Ausgabe im dafür vorgesehenen SPAN-Element
	  $('.szene9Scrollable.szene9 .items img').css('left', x);
	  $('.szene9Scrollable.szene9 .items img').css('top', y);
	  // document.getElementById ('info').firstChild.data = out;
	}

	// Event-Handler für das onMousemove-Event des Body-Tags
	// festlegen
	document.body.onmousemove = show_position;
	document.body.ontouchmove = show_position;

	$('#complete_content #content #inhalt .text').css('display', 'block	');
	$(window).resize(function(){
		$('#content').css('height', $('.image img').height());
		$('#content #inhalt .imageCollection img').css('height', $('.image img').height());
		$(".scrollable").scrollable('height', $('.image img').height());
		$('#content #inhalt .opacityScrollable .items img').css('height', $(window).height());
		$('#content #inhalt .opacityScrollable .items img').css('width', $(window).width());
		$('#content #inhalt .scrollable .items img').css('height', $(window).height());
		$('#content #inhalt .scrollable .items img').css('width', $(window).width());
		$('.menuBackground img').css('width', $(window).width());
	});


}

$(document).ready(function(){
	getTypo();
});

function bottom() {
	window.setTimeout(function(){
		$('#bottom').scrollIntoView(180000, 'linear');
	}, 3000);

	window.setTimeout(function(){
		$("#conten #inhalt .overlayBlack").css("opacity",1);
            if($("#content #inhalt .overlayBlack").hasClass("thatsIt")){
                $("#content #inhalt .overlayBlack").removeClass("thatsIt");
            }else{
                $("#content #inhalt .overlayBlack").addClass("thatsIt");
            }
	}, 183000);
};

function loadInteractive(){
	$(".section-1.ui-accordion-header").click(function(){
		console.log('interactive');
		console.log(navigator.vendor);
		if(navigator.vendor == "Apple Computer, Inc." || navigator.vendor == "Opera Software ASA" || navigator.vendor == "Google Inc."){
			if($(this).hasClass("ui-accordion-header-active") && !$(".javascript").hasClass("active")){
				$(".waiting").css("display", "block");
				// window.location.hash = "/";
				var imageAddr = "http://www.tranquilmusic.ca/images/cats/Cat2.JPG" + "?n=" + Math.random();
				var startTime, endTime;
				var downloadSize = 5616998;
				var download = new Image();
				download.onload = function () {
				    endTime = (new Date()).getTime();
				    showResults();
				}
				startTime = (new Date()).getTime();
				download.src = imageAddr;

				function showResults() {
				    var duration = (endTime - startTime) / 1000; //Math.round()
				    var bitsLoaded = downloadSize * 8;
				    var speedBps = (bitsLoaded / duration).toFixed(2);
				    var speedKbps = (speedBps / 1024).toFixed(2);
				    var speedMbps = (speedKbps / 1024).toFixed(2);
				   
					$(".waiting").css("display", "none");
					if(speedMbps >= 0.50){
							console.log("zum Video");
							$(".javascript").addClass("active").append("Sorry but your connection is too slow. You will be redirected to the default video in a few seconds!");
							clearTimeout(this.downTimer);
						this.downTimer = setTimeout(function() {
								
								$(".section-1.ui-accordion-header").click();
							},2000);
							
					}else{
						console.log("kann weiter gehen");
						//window.location.href = "/index.php?id=6";
						$(".javascript").addClass("active").append("Okey your Connection is fast enough. <a href='http://www.zac.co.at/apetape/kapitel-1' class='accLink'>Here</a> You can go to the interactive show.");
					}
				}
			}
		}else{
			console.log("zum Video");
			$(".javascript").addClass("active").append("Sorry but you don't use Safari, Opera or Chrome. You will be redirected to the default video in a few seconds!");
			clearTimeout(this.downTimer);
			this.downTimer = setTimeout(function() {
				
				$(".section-0.ui-accordion-header").click();
			},2000);
		}
	});
}

function changeChapter(){
	console.log("hallo Kapitel 7");
}


