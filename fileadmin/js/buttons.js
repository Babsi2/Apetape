$(document).ready(function(){
	var press = false;
	var timerId = 0;
	var timer = 0;
	var pressHold = 0;
	
	
    
	$('.buttons .button.Sepia').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .opacityScrollable .items .active img').removeClass('sepia');
		}else{
			console.log('sepia');
			$(this).addClass('active');
			$('#content #inhalt .opacityScrollable .items .active img').addClass('sepia');
			
		}
	});

	$('.buttons .button.Blau').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .opacityScrollable .items .active img').removeClass('blau');

		}else{
			console.log('blau');
			$(this).addClass('active');
			$('#content #inhalt .opacityScrollable .items .active img').addClass('blau');
			$('#content #inhalt .opacityScrollable .items .active img').removeClass('sepia');
			$('.buttons .button.Sepia').removeClass('active');
		}
	});

	$('.buttons .button.Zoom-p-h').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	timerId = setInterval(function(){
	    		$('#content #inhalt .opacityScrollable .items .active img').toggleClass('zoomed-p-h');
	    	},800);
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
	    	$('#content #inhalt .opacityScrollable .items .active img').removeClass('zoomed-p-h');
	    	press = false;
	    }
	});

	$('.buttons .button.Vibe').on('mousedown touchstart',function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	timerId = setInterval(function(){
	    		$('#content #inhalt .opacityScrollable .items .active img').toggleClass('vibe');
	    	},100);
	    	$('.buttons .button.Vibe').addClass('active');
	    	press = true; 
	    	console.log('press&hold');  
	    }, 100);
	}).on('mouseup touchend', function(e) {
		clearInterval(timerId);
	    clearTimeout(this.downTimer);
	    console.log(press);
	    $(this).removeClass('active');
	    if(press === true){
	    	$('#content #inhalt .opacityScrollable .items .active img').removeClass('vibe');
	    	press = false;
	    }
	});

	$('.buttons .button.Stroboskop').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	timerId = setInterval(function(){
	    		$('#content #inhalt .overlayBlack').toggleClass('dropped').css('z-index', 11);
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
	    // if(press === true){
	    // 	$('#content #inhalt .overlayBlack').removeClass('strobo');
	    // 	press = false;
	    // }
	    $('#content #inhalt .overlayBlack').removeClass('dropped');
	});
	
	$('.buttons .button.Blur-O-S').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	$('#content #inhalt .opacityScrollable .items .active img').addClass('blured');
	    	press = true; 
	    	$('.buttons .button.Blur-O-S').addClass('active');
	    	console.log('press&hold');  
	    }, 500);
	}).mouseup(function(e) {
	    clearTimeout(this.downTimer);
	    console.log(press);
	    if(press === true){
	    	$('#content #inhalt .opacityScrollable .items .active img').removeClass('blured');
	    	$(this).removeClass('active');
	    	press = false;
	    }else{
	    	console.log('blur');
			$(this).addClass('active');
			$('#content #inhalt .opacityScrollable .items .active img').addClass('blured');
			setTimeout(function(){
			   $('.buttons .button.Blur-O-S').toggleClass('active');
			   $('#content #inhalt .opacityScrollable .items .active img').toggleClass('blured');

			},4000);
	    }
	});

	$(".buttons .button.Split").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#imageRed").css("display", "none");
			$('#imageGreen').css('display', 'none');
		}else{
			$(this).addClass("active");
			$("#imageRed").css({
				'display':'block',
				'-webkit-transition-property':'-webkit-transform',
				'-webkit-transition-duration':'0.5s',
				'-webkit-transition-timing-function':'ease-out',
				'-webkit-transform':'scale(2.5,2.5)'
			});;
			$('#imageGreen').css({
				'display':'block',
				'-webkit-transition-property':'-webkit-transform',
				'-webkit-transition-duration':'0.5s',
				'-webkit-transition-timing-function':'ease-out',
				'-webkit-transform':'scale(2.5,2.5)'
			});
			this.downTimer = setTimeout(function(){
				$("#imageRed").css({
					'-webkit-transform':'scale(1,1)'

				});
				$('#imageGreen').css({
					'-webkit-transform':'scale(1,1)'
				})
				
			},100);
		}
	});

	$('.buttons .button.Opacity-on-off').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt #scrollable .items .active').removeClass('opacified-o-n');
		}else{
			console.log('rotate');
			$(this).addClass('active');
			$('#content #inhalt #scrollable .items .active').addClass('opacified-o-n');
		}
		//$('#content #inhalt .imageCollection img.rotated').css('max-height', $(window).height()+200);
	});

	$('.buttons .button.Opacity').mousedown(function(e) {
	    clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	$('#content #inhalt .opacityScrollable .items .active img').addClass('opacified-o-s');
	    	press = true;
	    	$('.buttons .button.Opacity').addClass('active'); 
	    	console.log('press&hold');  
	    }, 500);
	}).mouseup(function(e) {
	    clearTimeout(this.downTimer);
	    console.log(press);
	    if(press === true){
	    	$('#content #inhalt .opacityScrollable .items .active img').removeClass('opacified-o-s');
	    	$(this).removeClass('active');
	    	press = false;
	    }else{
	    	console.log('opacity');
			$(this).addClass('active');
			$('#content #inhalt .opacityScrollable .items .active img').addClass('opacified');
			setTimeout(function(){
			   $('.buttons .button.Opacity').toggleClass('active');
			   $('#content #inhalt .opacityScrollable .items .active img').toggleClass('opacified');

			},4000);
	    }
	});

	$('.buttons .button.Opacity').on('touchstart', function(){ 
		clearTimeout(this.downTimer);
	    this.downTimer = setTimeout(function() {
	    	$('#content #inhalt .opacityScrollable .items .active img').addClass('opacified-o-s');
	    	$('.buttons .button.Opacity').addClass('active');  
	    }, 500);
	}).on('touchend', function(){
		clearTimeout(this.downTimer);
    	$('#content #inhalt .opacityScrollable .items .active img').removeClass('opacified-o-s');
    	$(this).removeClass('active');
	});

	$('.buttons .button.Drop').click(function() {
	    console.log('drop');
		$(this).addClass('active');
		$('#content #inhalt .overlay').addClass('dropped').css('z-index', 11);
		setTimeout(function(){
		   $('.buttons .button.Drop').toggleClass('active');
		   $('#content #inhalt .overlay').toggleClass('dropped').css('z-index', 0);
		},8000);
	});

	$('.szene9Scrollable.szene9 .items .szene9').css('opacity', 0);
	
	$('.szene9Scrollable.szene9 .items .szene9').first().addClass('active');
	$('.buttons .button.Gif-1').addClass('active');

	$('.buttons .button.Gif-2').click(function(){
		$('.buttons .button.Gif-1').removeClass('active');
		$('.buttons .button.Gif-3').removeClass('active');
		$('.szene9Scrollable.szene9 .items .opacity0').removeClass('active').removeClass('opacified-o-n');
		$('.szene9Scrollable.szene9 .items .opacity2').removeClass('active').removeClass('opacified-o-n');
		$('.szene9Scrollable.szene9 .items .opacity1').addClass('active');
		if($('.buttons .button.Opacity-on-off').hasClass('active')){
			$('.szene9Scrollable.szene9 .items .opacity1').addClass('opacified-o-n');
		}
		$(this).addClass('active');
	});

	$('.buttons .button.Gif-1').click(function(){
		$('.buttons .button.Gif-2').removeClass('active');
		$('.buttons .button.Gif-3').removeClass('active');
		$('.szene9Scrollable.szene9 .items .opacity1').removeClass('active').removeClass('opacified-o-n');
		$('.szene9Scrollable.szene9 .items .opacity2').removeClass('active').removeClass('opacified-o-n');
		$('.szene9Scrollable.szene9 .items .opacity0').addClass('active');
		if($('.buttons .button.Opacity-on-off').hasClass('active')){
			$('.szene9Scrollable.szene9 .items .opacity0').addClass('opacified-o-n');
		}
		$(this).addClass('active');
	});

	$('.buttons .button.Gif-3').click(function(){
		$('.buttons .button.Gif-1').removeClass('active');
		$('.buttons .button.Gif-2').removeClass('active');
		$('.szene9Scrollable.szene9 .items .opacity0').removeClass('active').removeClass('opacified-o-n');
		$('.szene9Scrollable.szene9 .items .opacity1').removeClass('active').removeClass('opacified-o-n');
		$('.szene9Scrollable.szene9 .items .opacity2').addClass('active');
		if($('.buttons .button.Opacity-on-off').hasClass('active')){
			$('.szene9Scrollable.szene9 .items .opacity2').addClass('opacified-o-n');
		}
		$(this).addClass('active');
	});

	$('.wuerd .button.wuerd').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			

		}else{
			console.log('wuerd');
			$(this).addClass('active');
		}
	});
});
	
