/*
 * Rotate plugin for dancer.js
 *
 * Usage of frequencies for rotation:
 *
 * var dancer = new Dancer('song.ogg'),
 *     
 */

(function() {
  Dancer.addPlugin( 'rotate', function() {
    // options = options || {};
    
    this.bind( 'update', function() {
        var spectrum = this.getSpectrum();
       
        var values = 0;
        var length = spectrum.length;

        for(var i = 0; i < length; i++){
            values += spectrum[i]*10;
        }
        
        rotateTime = (values/length)*10000;
    });

    // return rotateTime;
  });
})();


 
  