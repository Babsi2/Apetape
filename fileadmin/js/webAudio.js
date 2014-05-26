var rotateTime, timerId, press;

function get_randomRotate()
{
    var ranNum = Math.floor(Math.random()*2);
    return ranNum;
}

$(function () {
    // Future-proofing...
    var context;
    if (typeof AudioContext !== "undefined") {
        context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        context = new webkitAudioContext();
    } else {
        $(".hideIfNoApi").hide();
        $(".showIfNoApi").show();
        return;
    }

    // Overkill - if we've got Web Audio API, surely we've got requestAnimationFrame. Surely?...
    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                    || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    
    // Create the analyser
    var analyser = context.createAnalyser();
    analyser.fftSize = 64;
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    // console.log(analyser);
    // Set up the visualisation elements
  
    // Get the frequency data and update the visualisation
    function update() {
        requestAnimationFrame(update);

        analyser.getByteFrequencyData(frequencyData);
       
        var values = 0;
        var length = frequencyData.length;

        for(var i = 0; i < length; i++){
            values += frequencyData[i];
        }
        // console.log(values+' length: '+length);
        rotateTime = (values/length)*10;
        // console.log(analyser.getByteFrequencyData(frequencyData));
        $('#content #inhalt .scrollable .items .active img.zoomed').css('-webkit-transform', 'scale('+(1.00+(frequencyData[0]/3000*5+0.1)) + ','+(1.00+(frequencyData[0]/3000*5+0.1))+')');
        // console.log($('#player')[0].ended);
        // if($('#player')[0].ended === true){
        //     change();
        // }
    };

    // Hook up the audio routing...
    // player -> analyser -> speakers
  // (Do this after the player is ready to play - https://code.google.com/p/chromium/issues/detail?id=112368#c4)
  $("#player").bind('canplay', function() {
    var source = context.createMediaElementSource(this);
    source.connect(analyser);
    analyser.connect(context.destination);
    
  });

    // Kick it off...
    update();
});

function change(){
    console.log("change");
    $('body').addClass('szeneChange');
    window.location.href = "/apetape/szene-3.html";
}
$(document).ready(function(){
    if($('#player')[0] !== undefined){
        timerId = setInterval(function(){
            if($('#player')[0].ended == false){
                console.log($('#player')[0].ended);
            }else{
                console.log("I am True");
                change();
            }
        },300);
    }

    $('#content .buttons .button.Zoom').click(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#content #inhalt .opacityScrollable .items .active img').removeClass('zoomed').removeAttr('style');
            $('#content #inhalt .opacityScrollable .items .active img').css('height', $(document).height()+10);
            $('#content #inhalt .opacityScrollable .items .active img').css('width', $(window).width());
            // $('#content img').addClass('unzoomed');
        }else{
            // console.log('zoom');
            $(this).addClass('active');
            $('#content #inhalt .opacityScrollable .items .active img').addClass('zoomed');
            // $('#content img').removeClass('unzoomed');
        }
    });
    
    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Zoom')) || (event.keyCode == 75 && $('.button-2').hasClass('Zoom')) || (event.keyCode == 76 && $('.button-3').hasClass('Zoom')) || (event.keyCode == 153 && $('.button-4').hasClass('Zoom'))){
            if($('#content .buttons .button.Zoom').hasClass('active')){
                $('#content .buttons .button.Zoom').removeClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').removeClass('zoomed').removeAttr('style');
                $('#content #inhalt .opacityScrollable .items .active img').css('height', $(document).height()+10);
                $('#content #inhalt .opacityScrollable .items .active img').css('width', $(window).width());
                // $('#content img').addClass('unzoomed');
            }else{
                // console.log('zoom');
                $('#content .buttons .button.Zoom').addClass('active');
                $('#content #inhalt .opacityScrollable .items .active img').addClass('zoomed');
                // $('#content img').removeClass('unzoomed');
            }
        }
    }); 

    $('#content .buttons .button.Rotate').mousedown(function(e) {
        clearTimeout(this.downTimer);
        this.downTimer = setTimeout(function() {
            timerId = setInterval(function(){
                var whichQuote = get_randomRotate();
                // console.log(rotateTime);
                if(whichQuote === 1){
                    $('#content #inhalt .opacityScrollable .items .active img').toggleClass('rotated');
                }else if(whichQuote === 0){
                    $('#content #inhalt .opacityScrollable .items .active img').toggleClass('rotatedUZ');
                }
            },rotateTime);
            $('.buttons .button.Rotate').addClass('active');
            press = true;  
        }, 100);
    }).mouseup(function(e) {
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $(this).removeClass('active');
        if(press === true){
            $('#content #inhalt .opacityScrollable .items .active img').removeClass('rotated').removeClass('rotatedUZ');
            press = false;
        }
    });

    $(document).keydown(function(event){
        if(!event){
            event = window.event;
        }
        if((event.keyCode == 74 && $('.button-1').hasClass('Rotate')) || (event.keyCode == 75 && $('.button-2').hasClass('Rotate')) || (event.keyCode == 76 && $('.button-3').hasClass('Rotate')) || (event.keyCode == 79 && $('.button-4').hasClass('Rotate')) ){
            
            clearTimeout(this.downTimer);
            this.downTimer = setTimeout(function() {
                timerId = setInterval(function(){
                  
                    $('#content #inhalt .scrollable .items .active img').toggleClass('rotated');
                    
                },rotateTime);
                $('.buttons .button.Rotate').addClass('active');
                press = true;  
            }, 100);
        }
    }).keyup(function(event){
        clearInterval(timerId);
        clearTimeout(this.downTimer);
        $('.buttons .button.Rotate').removeClass('active');
        if(press === true){
            $('#content #inhalt .scrollable .items .active img').removeClass('rotated');
            press = false;
        }
    }); 

     
})