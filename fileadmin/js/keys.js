$(document).ready(function(){
	var press = false;
	var timerId = 0;
	var timer = 0;
	var pressHold = 0;
	
	
	var button1Key = $('.button-1').data("button1");
    var button2Key = $('.button-2').data("button2");
    var button3Key = $('.button-3').data("button3");
    var button4Key = $('.button-4').data("button4");
    var button5Key = $('.button-5').data("button5");
   

    if(button1Key != ''){
        key1 = button1Key;
    }else{
        key1 = 74;
    }

    if(button2Key != ''){
        key2 = button2Key;
    }else{
        key2 = 75;
    }

    if(button3Key != ''){
        key3 = button3Key;
    }else{
        key3 = 76;
    }

    if(button4Key != ''){
        key4 = button4Key;
    }else{
        key4 = 79;
    }

    if(button5Key != ''){
        key5 = button5Key;
    }else{
        key5 = 32;
    }

    $(document).keydown(function(event){
    	if(!event){
			event = window.event;
		}
		if((event.keyCode == key1 && $('.button-1').hasClass('Blur-O-S')) || (event.keyCode == key2 && $('.button-2').hasClass('Blur-O-S')) || (event.keyCode == key3 && $('.button-3').hasClass('Blur-O-S')) || (event.keyCode == key4 && $('.button-4').hasClass('Blur-O-S')) ){
			
			pressHold = 0;
			setTimeout(function() {
		    	$('#content #inhalt .opacityScrollable .items .active img').addClass('blured');
		    	press = true; 
		    	$('.buttons .button.Blur-O-S').addClass('active');
		    	pressHold ++; 
		    }, 500);
		}
    }).keyup(function(event){
    	press = false;

		if(pressHold > 0){
    		setTimeout(function(){
			   $('.buttons .button.Blur-O-S').removeClass('active');
			   $('#content #inhalt .opacityScrollable .items .active img').removeClass('blured');

			},10);
    	}else{
    		setTimeout(function(){
			   $('.buttons .button.Blur-O-S').removeClass('active');
			   $('#content #inhalt .opacityScrollable .items .active img').removeClass('blured');

			},4000);
    	}
		
	    
	});	
	

    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Sepia')) || (event.keyCode == key2 && $('.button-2').hasClass('Sepia')) || (event.keyCode == key3 && $('.button-3').hasClass('Sepia')) || (event.keyCode == key4 && $('.button-4').hasClass('Sepia'))){
            if($('#content .buttons .button.Sepia').hasClass('active')){
                $('#content .buttons .button.Sepia').removeClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').removeClass('sepia');
                
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Sepia').addClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').addClass('sepia');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 
	
	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Blau')) || (event.keyCode == key2 && $('.button-2').hasClass('Blau')) || (event.keyCode == key3 && $('.button-3').hasClass('Blau')) || (event.keyCode == key4 && $('.button-4').hasClass('Blau'))){
            if($('#content .buttons .button.Blau').hasClass('active')){
                $('#content .buttons .button.Blau').removeClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').removeClass('blau');
                
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Blau').addClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').addClass('blau');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 

	
	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Zoom-p-h')) || (event.keyCode == key2 && $('.button-2').hasClass('Zoom-p-h')) || (event.keyCode == key3 && $('.button-3').hasClass('Zoom-p-h')) || (event.keyCode == key4 && $('.button-4').hasClass('Zoom-p-h')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .opacityScrollable .items .active img').toggleClass('zoomed-p-h');
                    
                },500);
                $('.buttons .button.Zoom-p-h').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        press = true;
        $('.buttons .button.Zoom-p-h').removeClass('active');
        if(press == true){
            $('#content #inhalt .opacityScrollable .items .active img').removeClass('zoomed-p-h');
            press = false;
        }
        
    }); 
	
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Vibe')) || (event.keyCode == key2 && $('.button-2').hasClass('Vibe')) || (event.keyCode == key3 && $('.button-3').hasClass('Vibe')) || (event.keyCode == key4 && $('.button-4').hasClass('Vibe')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .opacityScrollable .items .active img').toggleClass('vibe');
                    
                },100);
                $('.buttons .button.Vibe').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $('.buttons .button.Vibe').removeClass('active');
        if(press === true){
            $('#content #inhalt .opacityScrollable .items .active img').removeClass('vibe');
            press = false;
        }
    }); 
	
	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Stroboskop')) || (event.keyCode == key2 && $('.button-2').hasClass('Stroboskop')) || (event.keyCode == key3 && $('.button-3').hasClass('Stroboskop')) || (event.keyCode == key4 && $('.button-4').hasClass('Stroboskop')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .opacityScrollable .items .active img').toggleClass('strobo');
                    
                },50);
                $('.buttons .button.Stroboskop').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $('.buttons .button.Stroboskop').removeClass('active');
        if(press === true){
            $('#content #inhalt .opacityScrollable .items .active img').removeClass('strobo');
            press = false;
        }
    }); 

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Opacity-on-off')) || (event.keyCode == key2 && $('.button-2').hasClass('Opacity-on-off')) || (event.keyCode == key3 && $('.button-3').hasClass('Opacity-on-off')) || (event.keyCode == key4 && $('.button-4').hasClass('Opacity-on-off'))){
            if($('#content .buttons .button.Opacity-on-off').hasClass('active')){
                $('#content .buttons .button.Opacity-on-off').removeClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').removeClass('opacified-o-n');
                
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Opacity-on-off').addClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').addClass('opacified-o-n');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Drop')) || (event.keyCode == key2 && $('.button-2').hasClass('Drop')) || (event.keyCode == key3 && $('.button-3').hasClass('Drop')) || (event.keyCode == key4 && $('.button-4').hasClass('Drop'))){
            $('.buttons .button.Drop').addClass('active');
			$('#content #inhalt .overlay').addClass('dropped').css('z-index', 11);
			setTimeout(function(){
			   $('.buttons .button.Drop').toggleClass('active');
			   $('#content #inhalt .overlay').toggleClass('dropped').css('z-index', 0);
			},4000);
        }
    }); 
	
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Opacity')) || (event.keyCode == key2 && $('.button-2').hasClass('Opacity')) || (event.keyCode == key3 && $('.button-3').hasClass('Opacity')) || (event.keyCode == key4 && $('.button-4').hasClass('Opacity')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                $('.buttons .button.Opacity').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $('.buttons .button.Opacity').removeClass('active');
        if(press === true){
            $('#content #inhalt .opacityScrollable .items .active img').removeClass('opacified');
            press = false;
        }
    }); 
	

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Gif-2')) || (event.keyCode == key2 && $('.button-2').hasClass('Gif-2')) || (event.keyCode == key3 && $('.button-3').hasClass('Gif-2')) || (event.keyCode == key4 && $('.button-4').hasClass('Gif-2'))){
            $('.buttons .button.Gif-1').removeClass('active');
			$('.buttons .button.Gif-3').removeClass('active');
			$('.szene9Scrollable.szene9 .items .opacity0').removeClass('active').removeClass('opacified-o-n');
			$('.szene9Scrollable.szene9 .items .opacity2').removeClass('active').removeClass('opacified-o-n');
			$('.szene9Scrollable.szene9 .items .opacity1').addClass('active');
			if($('.buttons .button.Opacity-on-off').hasClass('active')){
				$('.szene9Scrollable.szene9 .items .opacity1').addClass('opacified-o-n');
			}
			$('.buttons .button.Gif-2').addClass('active');
        }
    }); 

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Gif-1')) || (event.keyCode == key2 && $('.button-2').hasClass('Gif-1')) || (event.keyCode == key3 && $('.button-3').hasClass('Gif-1')) || (event.keyCode == key4 && $('.button-4').hasClass('Gif-1'))){
            $('.buttons .button.Gif-2').removeClass('active');
			$('.buttons .button.Gif-3').removeClass('active');
			$('.szene9Scrollable.szene9 .items .opacity1').removeClass('active').removeClass('opacified-o-n');
			$('.szene9Scrollable.szene9 .items .opacity2').removeClass('active').removeClass('opacified-o-n');
			$('.szene9Scrollable.szene9 .items .opacity0').addClass('active');
			if($('.buttons .button.Opacity-on-off').hasClass('active')){
				$('.szene9Scrollable.szene9 .items .opacity0').addClass('opacified-o-n');
			}
			$('.buttons .button.Gif-1').addClass('active');
        }
    }); 

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Gif-3')) || (event.keyCode == key2 && $('.button-2').hasClass('Gif-3')) || (event.keyCode == key3 && $('.button-3').hasClass('Gif-3')) || (event.keyCode == key4 && $('.button-4').hasClass('Gif-3'))){
            $('.buttons .button.Gif-1').removeClass('active');
			$('.buttons .button.Gif-2').removeClass('active');
			$('.szene9Scrollable.szene9 .items .opacity0').removeClass('active').removeClass('opacified-o-n');
			$('.szene9Scrollable.szene9 .items .opacity1').removeClass('active').removeClass('opacified-o-n');
			$('.szene9Scrollable.szene9 .items .opacity2').addClass('active');
			if($('.buttons .button.Opacity-on-off').hasClass('active')){
				$('.szene9Scrollable.szene9 .items .opacity2').addClass('opacified-o-n');
			}
			$('.buttons .button.Gif-3').addClass('active');
        }
    }); 

    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if(event.keyCode == key5 && $('.button-5').hasClass('wuerd')){
            $('.wuerd .button-5.wuerd').addClass('active');
            console.log("würd");
        }
    }); 
});

