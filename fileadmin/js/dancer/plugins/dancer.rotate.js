/*
 * Rotate plugin for dancer.js
 *
 * Usage of frequencies for rotation:
 *
 * var dancer = new Dancer('song.ogg'),
 *     
 */

(function() {
  Dancer.addPlugin( 'rotate', function( image ) {
    // options = options || {};
    
    this.bind( 'update', function() {
    var spectrum = this.getSpectrum();
    // console.log(spectrum);

    var values = 0;
    var length = spectrum.length;

    for(var i = 0; i < length; i++){
        values += spectrum[i]*10;
    }
    // console.log(values+' length: '+length);
    rotateTime = (values/length)*10000;
    console.log(rotateTime);
    // console.log(analyser.getByteFrequencyData(frequencyData));
    });

    return rotateTime;
  });
})();


 
  