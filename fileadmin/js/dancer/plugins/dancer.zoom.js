/*
 * Zoom plugin for dancer.js
 *
 * Usage of frequencies for scale:
 *
 * var dancer = new Dancer('song.ogg'),
 *     
 */

(function() {
  Dancer.addPlugin( 'zoom', function( image ) {
    // options = options || {};
    
    this.bind( 'update', function() {
      var spectrum = this.getSpectrum();
      // console.log(spectrum);

      $('#content img.zoomed').css('-webkit-transform', 'scale('+(1.00+(spectrum[1])) + ','+(1.00+(spectrum[1]))+')');
      $('#content img.zoomed').css('transform', 'scale('+(1.00+(spectrum[1])) + ','+(1.00+(spectrum[1]))+')');
      
    });

    return this;
  });
})();


  