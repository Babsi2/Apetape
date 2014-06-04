<?php
/**
 * Klasse um Captchas zu generieren
 * @author Barbara Huber
 * @uses PHP>=5
 **/
class captcha {
	private $fonts = array('VERDANA0.TTF','lucon.ttf','times__0.ttf','GIL_____.TTF','CRYSTL_H.TTF');
	private $images = array(
		'background' => array('background1.png','background2.png'),
		'overlay' => array('overlay1.png','overlay2.png'),
	);

	private $colors = array('#333333','#dd0000','#666666');

	private $fontpath = 'fileadmin/fonts/captcha';
	private $imgpath = 'fileadmin/images/captcha';

	private $fontSize = 25;
	private $angle = array(-13,13);
	private $horizontalPos = array(-7,8);
	private $captchaLength = 5;

	private $captchaText;

	/**
	 * Konstruktor
	 * @access public
	 * @return captcha
	 */

	public function captcha($colors='') {
		session_start();
		if($colors)
			$this->colors = explode(',', $colors);

		unset($_SESSION['captcha_text']);
		$this->captchaText = $this->getRandomString($this->captchaLength);
		$_SESSION['captcha_text'] = $this->captchaText;

	}

	/**
	 * Gibt einen zufälligen String zurück
	 *
	 * @access private
	 * @param int $length
	 * @return string
	 *
	 */

	private function getRandomString($length)	{
		mt_srand((double)microtime(true)*1000000);

		$possible="ABCDEFGHJKLMNPRSTUVWXYZ23456789";
		$string="";
		while(strlen($string)<$length) {
			$string.= substr($possible,(mt_rand(0,(strlen($possible)*2)/2)),1);
		}
		return $string;
	}

	/**
	 *
	 * Generiert das Captcha
	 *
	 * @access public
	 */

	public function generateCaptcha(){
		// Zufallshintergrund
		mt_srand((double)microtime(true)*1000000);
		$backgroundfile = mt_rand(0, count($this->images['background'])-1);
		$backgroundfile = $this->images['background'][$backgroundfile];
		$background = imagecreatefrompng($_SERVER['DOCUMENT_ROOT'].'/'.$this->imgpath.'/'.$backgroundfile);

		$size = getimagesize($_SERVER['DOCUMENT_ROOT'].'/'.$this->imgpath.'/'.$backgroundfile);

		$overlayfile = mt_rand(0, count($this->images['overlay'])-1);
		$overlayfile = $this->images['overlay'][$overlayfile];
		$overlay = imagecreatefrompng($_SERVER['DOCUMENT_ROOT'].'/'.$this->imgpath.'/'.$overlayfile);

		$distance = (int)($size[0]/$this->captchaLength);
		// Text auf das Bild schreiben
		for($j=0;$j<$this->captchaLength;$j++){
			$color = mt_rand(0, count($this->colors)-1);
			$color = $this->colors[$color];
			$colordec = $this->hex2rgb($color);

			$textcolor = imagecolorallocate($background,$colordec[0],$colordec[1],$colordec[2]);

			$font = mt_rand(0, count($this->fonts)-1);
			$font = $_SERVER['DOCUMENT_ROOT'].'/'.$this->fontpath.'/'.$this->fonts[$font];

			imagettftext($background, $this->fontSize, mt_rand($this->angle[0], $this->angle[1]), $distance*($j), $this->fontSize+5+mt_rand($this->horizontalPos[0],$this->horizontalPos[1]), $textcolor , $font, $this->captchaText[$j]);
		}

		// Transparente Grafik drüberlegen
		imagecopy($background, $overlay, 0, 0, 0, 0, $size[0], $size[1]);

		// Bild ausgeben
		header("Content-type: image/png");
		imagepng($background);
		imagedestroy($background);

	}

	/**
	 * Wandelt Hexangaben von Farben (#000000) in ein dezimales Array für die Funktion imagecolorallocate() um
	 *
	 * @param string $hexColor
	 * @access private
	 * @return array
	 */

	private function hex2rgb($hexColor)	{
		$colordec = array(
			0 => hexdec(substr($hexColor,1,2)),
			1 => hexdec(substr($hexColor,3,2)),
			2 => hexdec(substr($hexColor,5,2))
		);

		return $colordec;
	}
}

$captcha = new captcha($_GET['color']);
$captcha->generateCaptcha();
//return explode(',',$_GET['color']);
?>