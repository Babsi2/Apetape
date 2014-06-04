function getKeys(){
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
        key1 = 85;
    }

    if(button2Key != ''){
        key2 = button2Key;
    }else{
        key2 = 73;
    }

    if(button3Key != ''){
        key3 = button3Key;
    }else{
        key3 = 79;
    }

    if(button4Key != ''){
        key4 = button4Key;
    }else{
        key4 = 80;
    }

    if(button5Key != ''){
        key5 = button5Key;
    }else{
        key5 = 32;
    }
    console.log(key1+' '+key2+' '+key3+' '+key4);
    $(document).keydown(function(event){
        
        if(!event){
            event = window.event;
        }
        console.log("hallo");
        if((event.keyCode == key1 && $('.button-1').hasClass('Blur-O-S')) || (event.keyCode == key2 && $('.button-2').hasClass('Blur-O-S')) || (event.keyCode == key3 && $('.button-3').hasClass('Blur-O-S')) || (event.keyCode == key4 && $('.button-4').hasClass('Blur-O-S')) ){
            console.log("blur");
            pressHold = 0;
            setTimeout(function() {
                $('#content #inhalt .opacityScrollable .items .active img').addClass('blured');
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
               $('#content #inhalt .opacityScrollable .items .active img').removeClass('blured');
               $('#content #inhalt .scrollable .items .active img').removeClass('blured');
            },10);
        }else{
            setTimeout(function(){
               $('.buttons .button.Blur-O-S').removeClass('active');
               $('#content #inhalt .opacityScrollable .items .active img').removeClass('blured');
               $('#content #inhalt .scrollable .items .active img').removeClass('blured');
            },4000);
        }
        
        
    }); 
    

    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Sepia')) || (event.keyCode == key2 && $('.button-2').hasClass('Sepia')) || (event.keyCode == key3 && $('.button-3').hasClass('Sepia')) || (event.keyCode == key4 && $('.button-4').hasClass('Sepia'))){
           console.log("sepia");
            if($('#content .buttons .button.Sepia').hasClass('active')){
                $('#content .buttons .button.Sepia').removeClass('active');
                $('#content #inhalt .opacityScrollable .items img').removeClass('sepia');
                $('#content #inhalt .scrollable .items img').removeClass('sepia');
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Sepia').addClass('active');
                $('#content #inhalt .opacityScrollable .items img').addClass('sepia');
                $('#content #inhalt .scrollable .items img').addClass('sepia');
                $('#content #inhalt .opacityScrollable .items img').removeClass('contrast');
                $('#content #inhalt .scrollable .items img').removeClass('contrast');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 
    
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Contrast')) || (event.keyCode == key2 && $('.button-2').hasClass('Contrast')) || (event.keyCode == key3 && $('.button-3').hasClass('Contrast')) || (event.keyCode == key4 && $('.button-4').hasClass('Contrast'))){
           console.log("blau");
            if($('#content .buttons .button.Contrast').hasClass('active')){
                $('#content .buttons .button.Contrast').removeClass('active');
                $('#content #inhalt .opacityScrollable .items img').removeClass('contrast');
                $('#content #inhalt .scrollable .items img').removeClass('contrast');
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Contrast').addClass('active');
                $('#content #inhalt .opacityScrollable .items img').addClass('contrast');
                $('#content #inhalt .scrollable .items img').addClass('contrast');
                $('#content #inhalt .opacityScrollable .items img').removeClass('sepia');
                $('#content #inhalt .scrollable .items img').removeClass('sepia');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 

    
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Zoom-p-h')) || (event.keyCode == key2 && $('.button-2').hasClass('Zoom-p-h')) || (event.keyCode == key3 && $('.button-3').hasClass('Zoom-p-h')) || (event.keyCode == key4 && $('.button-4').hasClass('Zoom-p-h')) ){
            console.log("zoom-p-h");
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .opacityScrollable .items .active img').toggleClass('zoomed-p-h');
                    $('#content #inhalt .scrollable .items .active img').toggleClass('zoomed-p-h');
                },200);
                $('.buttons .button.Zoom-p-h').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        press = true;
        $('.buttons .button.Zoom-p-h').removeClass('active');
        $('#content #inhalt .opacityScrollable .items .active img').removeClass('zoomed-p-h');
        $('#content #inhalt .scrollable .items .active img').removeClass('zoomed-p-h');
    }); 
    
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Vibe')) || (event.keyCode == key2 && $('.button-2').hasClass('Vibe')) || (event.keyCode == key3 && $('.button-3').hasClass('Vibe')) || (event.keyCode == key4 && $('.button-4').hasClass('Vibe')) ){
            console.log("vibe");
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .opacityScrollable .items .active img').toggleClass('vibe');
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
            $('#content #inhalt .opacityScrollable .items .active img').removeClass('vibe');
            $('#content #inhalt .scrollable .items .active img').removeClass('vibe');
        
    }); 
    
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Stroboskop')) || (event.keyCode == key2 && $('.button-2').hasClass('Stroboskop')) || (event.keyCode == key3 && $('.button-3').hasClass('Stroboskop')) || (event.keyCode == key4 && $('.button-4').hasClass('Stroboskop')) ){
            console.log("strobo");
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .overlayBlack').toggleClass('dropped').css('z-index', 11);
                    
                },50);
                $('.buttons .button.Stroboskop').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $('.buttons .button.Stroboskop').removeClass('active');
        if(!($('.buttons .button.Stroboskop').hasClass('active'))){
            $('#content #inhalt .overlayBlack').removeClass('dropped');
        }
        
    }); 

    $(document).keydown(function(){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Split')) || (event.keyCode == key2 && $('.button-2').hasClass('Split')) || (event.keyCode == key3 && $('.button-3').hasClass('Split')) || (event.keyCode == key4 && $('.button-4').hasClass('Split'))){
            if($(".buttons .button.Split").hasClass("active")){
                $(".buttons .button.Split").removeClass("active");
                $("#imageRed").css("display", "none");
                $('#imageGreen').css('display', 'none');
            }else{
                $(".buttons .button.Split").addClass("active");
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
                $('#content #inhalt .scrollable .items .active img').removeClass('opacified-o-n');
                $('.szene9Scrollable.szene9 .items .opacity0').removeClass('opacified-o-n');
                $('.szene9Scrollable.szene9 .items .opacity1').removeClass('opacified-o-n');
                $('.szene9Scrollable.szene9 .items .opacity2').removeClass('opacified-o-n');
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Opacity-on-off').addClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').addClass('opacified-o-n');
                $('#content #inhalt .scrollable .items .active img').addClass('opacified-o-n');
                $('.szene9Scrollable.szene9 .items .opacity0').addClass('opacified-o-n');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 

    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == key1 && $('.button-1').hasClass('Drop')) || (event.keyCode == key2 && $('.button-2').hasClass('Drop')) || (event.keyCode == key3 && $('.button-3').hasClass('Drop')) || (event.keyCode == key4 && $('.button-4').hasClass('Drop'))){
            console.log("drop");
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
                $('#content #inhalt .opacityScrollable .items .active img').addClass('opacified');
                $('#content #inhalt .scrollable .items .active img').addClass('opacified');
                $('.buttons .button.Opacity').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $('.buttons .button.Opacity').removeClass('active');
        $('#content #inhalt .opacityScrollable .items .active img').removeClass('opacified');
        $('#content #inhalt .scrollable .items .active img').removeClass('opacified');
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

    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        switch (event.keyCode){
            case 49:
                window.location.href="/apetape/apetape/kapitel-1";
                $('body').addClass('szeneChange');
                break;
            case 50:
                window.location.href="/apetape/apetape/kapitel-2";
                $('body').addClass('szeneChange');
                break;
            case 51:
                window.location.href="/apetape/apetape/kapitel-3";
                $('body').addClass('szeneChange');
                break;
            case 52:
                window.location.href="/apetape/apetape/kapitel-4";
                $('body').addClass('szeneChange');
                break;
            case 53:
                window.location.href="/apetape/apetape/kapitel-5";
                $('body').addClass('szeneChange');
                break;
            case 54:
                window.location.href="/apetape/apetape/kapitel-6";
                $('body').addClass('szeneChange');
                break;
            case 55:
                window.location.href="/apetape/apetape/kapitel-7";
                $('body').addClass('szeneChange');
                break;
            case 56:
                window.location.href="/apetape/apetape/kapitel-8";
                $('body').addClass('szeneChange');
                break;
            case 57:
                window.location.href="/apetape/apetape/kapitel-9";
                $('body').addClass('szeneChange');
                break;
            case 81:
                $('#complete_content #content #inhalt .path').css('display', 'block');
                $('#complete_content #content #inhalt .opacityScrollable.szene7').css('display', 'none');
                $('.buttons .button.Split').css('display', 'block').click();
                break;
            case 66:
                $('#conten #inhalt .overlayBlack').css('opacity',1);
                if($('#content #inhalt .overlayBlack').hasClass('start')){
                    $('#content #inhalt .overlayBlack').addClass('thatsIt');
                    $('#content #inhalt .overlayBlack').removeClass('start');
                }else if($('#content #inhalt .overlayBlack').hasClass('thatsIt')){
                    $('#content #inhalt .overlayBlack').removeClass('thatsIt');
                    $('#content #inhalt .overlayBlack').addClass('start');
                }else{
                    $('#content #inhalt .overlayBlack').addClass('start');
                }
                break;
        }
        
    })
}
$(document).ready(function(){

    getKeys();
    function overlayChange(link){
        var oldRef = link;
        var ref = oldRef.substring(0, oldRef.length - 5);
        console.log(ref);
        if(ref == "http://localhost/apetape/apetape/einstellungen"){
            $('#content').removeClass('szeneBegin').removeClass('szeneChangeFast');
            $.post( "index.php?eID=settings&link="+ref, function( data ) {
              $('#inhalt').html( data ); 
             
            }, "html");
        }else if(ref == "http://localhost/apetape/apetape/kapitel-2"){
            $.post( "index.php?eID=complete&link="+ref+"&click=true&path=false", function( data ) {
              $('#inhalt').html( data ); 
             
            });
        }else{
            $('#content').removeClass('szeneBegin').addClass('szeneChangeFast');
            $.post( "index.php?eID=complete&link="+ref+"&click=true&path=false", function( data ) {
              $('#inhalt').html( data ); 
             
            });
        }
    }

});

