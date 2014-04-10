$(document).ready(function(){
	var
    AUDIO_FILE = $('#player').attr('src'),
    dancer, kick,
    image = $('#css-filter-blur');
  /*
   * Dancer.js magic
   */
  // Dancer.setOptions({
  //   flashSWF : '/dancer/lib/soundmanager2.swf',
  //   flashJS  : '/dancer/lib/soundmanager2.js'
  // });
  
	dancer = new Dancer();

	dancer
	.load({ src: AUDIO_FILE });
	// console.log(this.getSpectrum());

	Dancer.isSupported() || loaded();
	!dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

	/*
	* Loading
	*/

	function loaded () {
	dancer.play();
	$('#stop').click(function(){
		dancer.pause();
	});
	}

	// For debugging
	window.dancer = dancer;

	$('.buttons .button.Zoom').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('#content #inhalt .scrollable .items .active img').removeClass('zoomed');
			$('#content #inhalt .scrollable .items .active img').css('-webkit-transform', '');
			$('#content #inhalt .scrollable .items .active img').css('transform', '');
			$('#content #inhalt .scrollable .items .active img').css('-ms-transform', '');
		}else{
			console.log('zoom');
			$(this).addClass('active');
			$('#content #inhalt .scrollable .items .active img').addClass('zoomed');
			dancer.zoom(image);
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
	    	},dancer.rotate());
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

	
});
