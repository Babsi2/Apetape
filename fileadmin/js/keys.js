$(document).ready(function(){
	var press = false;
	var timerId = 0;
	var timer = 0;
	var pressHold = 0;
	
	
	

    $(document).keydown(function(event){
    	if(!event){
			event = window.event;
		}
		if((event.keyCode == 74 && $('.button-1').hasClass('Blur-O-S')) || (event.keyCode == 75 && $('.button-2').hasClass('Blur-O-S')) || (event.keyCode == 76 && $('.button-3').hasClass('Blur-O-S')) || (event.keyCode == 79 && $('.button-4').hasClass('Blur-O-S')) ){
			console.log("taste k");
			pressHold = 0;
			setTimeout(function() {
		    	$('#content #inhalt .scrollable .items .active img').addClass('blured');
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
			   $('#content #inhalt .scrollable .items .active img').removeClass('blured');

			},10);
    	}else{
    		setTimeout(function(){
			   $('.buttons .button.Blur-O-S').removeClass('active');
			   $('#content #inhalt .scrollable .items .active img').removeClass('blured');

			},4000);
    	}
		
	    
	});	
	

    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Sepia')) || (event.keyCode == 75 && $('.button-2').hasClass('Sepia')) || (event.keyCode == 76 && $('.button-3').hasClass('Sepia')) || (event.keyCode == 79 && $('.button-4').hasClass('Sepia'))){
            if($('#content .buttons .button.Sepia').hasClass('active')){
                $('#content .buttons .button.Sepia').removeClass('active');
                $('#content #inhalt .scrollable .items .active img').removeClass('sepia');
                
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Sepia').addClass('active');
                $('#content #inhalt .scrollable .items .active img').addClass('sepia');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 
	
	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Blau')) || (event.keyCode == 75 && $('.button-2').hasClass('Blau')) || (event.keyCode == 76 && $('.button-3').hasClass('Blau')) || (event.keyCode == 79 && $('.button-4').hasClass('Blau'))){
            if($('#content .buttons .button.Blau').hasClass('active')){
                $('#content .buttons .button.Blau').removeClass('active');
                $('#content #inhalt .scrollable .items .active img').removeClass('blau');
                
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Blau').addClass('active');
                $('#content #inhalt .scrollable .items .active img').addClass('blau');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 

	
	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Zoom-p-h')) || (event.keyCode == 75 && $('.button-2').hasClass('Zoom-p-h')) || (event.keyCode == 76 && $('.button-3').hasClass('Zoom-p-h')) || (event.keyCode == 79 && $('.button-4').hasClass('Zoom-p-h')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .scrollable .items .active img').toggleClass('zoomed-p-h');
                    
                },timeoutZoom);
                $('.buttons .button.Zoom-p-h').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $('.buttons .button.Zoom-p-h').removeClass('active');
        if(press === true){
            $('#content #inhalt .scrollable .items .active img').removeClass('zoomed-p-h');
            press = false;
        }
    }); 
	
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Vibe')) || (event.keyCode == 75 && $('.button-2').hasClass('Vibe')) || (event.keyCode == 76 && $('.button-3').hasClass('Vibe')) || (event.keyCode == 79 && $('.button-4').hasClass('Vibe')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .scrollable .items .active img').toggleClass('vibe');
                    
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
            $('#content #inhalt .scrollable .items .active img').removeClass('vibe');
            press = false;
        }
    }); 
	
	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Stroboskop')) || (event.keyCode == 75 && $('.button-2').hasClass('Stroboskop')) || (event.keyCode == 76 && $('.button-3').hasClass('Stroboskop')) || (event.keyCode == 79 && $('.button-4').hasClass('Stroboskop')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .scrollable .items .active img').toggleClass('strobo');
                    
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
            $('#content #inhalt .scrollable .items .active img').removeClass('strobo');
            press = false;
        }
    }); 

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Opacity-on-off')) || (event.keyCode == 75 && $('.button-2').hasClass('Opacity-on-off')) || (event.keyCode == 76 && $('.button-3').hasClass('Opacity-on-off')) || (event.keyCode == 79 && $('.button-4').hasClass('Opacity-on-off'))){
            if($('#content .buttons .button.Opacity-on-off').hasClass('active')){
                $('#content .buttons .button.Opacity-on-off').removeClass('active');
                $('#content #inhalt .scrollable .items .active img').removeClass('opacified-o-n');
                
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Opacity-on-off').addClass('active');
                $('#content #inhalt .scrollable .items .active img').addClass('opacified-o-n');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Drop')) || (event.keyCode == 75 && $('.button-2').hasClass('Drop')) || (event.keyCode == 76 && $('.button-3').hasClass('Drop')) || (event.keyCode == 79 && $('.button-4').hasClass('Drop'))){
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
        if((event.keyCode == 74 && $('.button-1').hasClass('Opacity')) || (event.keyCode == 75 && $('.button-2').hasClass('Opacity')) || (event.keyCode == 76 && $('.button-3').hasClass('Opacity')) || (event.keyCode == 79 && $('.button-4').hasClass('Opacity')) ){
             
            timerId = setTimeout(function() {
                console.log("press&hold");
                $('#content #inhalt .scrollable .items .active img').addClass('opacified-o-s');
                press = true;
                $('.buttons .button.Opacity').addClass('active'); 
                console.log(press);  
            }, 500);
        }
    }).keyup(function(event){
        clearTimeout(timerId);
        console.log(press);
        if(press === true){
            $('#content #inhalt .scrollable .items .active img').removeClass('opacified-o-s').removeClass('opacified');
            $('.buttons .button.Opacity').removeClass('active');
            press = false;
        }else{
            console.log('opacity');
            $('.buttons .button.Opacity').addClass('active');
            $('#content #inhalt .scrollable .items .active img').addClass('opacified');
            setTimeout(function(){
               $('.buttons .button.Opacity').toggleClass('active');
               $('#content #inhalt .scrollable .items .active img').toggleClass('opacified').removeClass('opacified-o-s');

            },4000);
        }
    });

	$(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Gif-2')) || (event.keyCode == 75 && $('.button-2').hasClass('Gif-2')) || (event.keyCode == 76 && $('.button-3').hasClass('Gif-2')) || (event.keyCode == 79 && $('.button-4').hasClass('Gif-2'))){
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
        if((event.keyCode == 74 && $('.button-1').hasClass('Gif-1')) || (event.keyCode == 75 && $('.button-2').hasClass('Gif-1')) || (event.keyCode == 76 && $('.button-3').hasClass('Gif-1')) || (event.keyCode == 79 && $('.button-4').hasClass('Gif-1'))){
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
        if((event.keyCode == 74 && $('.button-1').hasClass('Gif-3')) || (event.keyCode == 75 && $('.button-2').hasClass('Gif-3')) || (event.keyCode == 76 && $('.button-3').hasClass('Gif-3')) || (event.keyCode == 79 && $('.button-4').hasClass('Gif-3'))){
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
});

