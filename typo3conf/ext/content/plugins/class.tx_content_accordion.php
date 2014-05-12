<?php
require_once(PATH_tslib.'class.tslib_pibase.php');

class tx_content_accordion extends tslib_pibase {

		// Default extension plugin variables:
	var $prefixId = 'tx_content_accordion'; // Same as class name
	var $scriptRelPath = 'plugins/class.tx_content_accordion.php'; // Path to this script relative to the extension dir.
	var $extKey = 'content'; // The extension key.
	public $pi_checkCHash = TRUE;

	/**
	 *
	 * @var Utils 
	 */
	protected $uObj;
	
	/**
	 *
	 * @var View 
	 */
	protected $view;

	public function main($content, $conf) {
		
		#################################################################################
		$this->conf=$conf;
		$this->pi_setPiVarDefaults();
		$this->uObj = utils::GetInstance($this->cObj);
		$this->view = new  View($conf, $this->uObj);
		#################################################################################

		$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_accordion','pid=:pid','','sorting DESC','');
		$stmt->bindValue(':pid', $this->cObj->data['pid']);
		$stmt->execute();
		$accordions = $stmt->fetchAll();
		
		$javascript = t3lib_div::wrapJS('
			$(document).ready(function(){
				$(".section-1.ui-accordion-header").click(function(){
					if($(this).hasClass("ui-accordion-header-active")){
						if(!$(".text").hasClass("active")){
							$(".waiting").css("display", "block");
						}
						var imageAddr = "http://www.tranquilmusic.ca/images/cats/Cat2.JPG" + "?n=" + Math.random();
						var startTime, endTime;
						var downloadSize = 5616998;
						var download = new Image();
						download.onload = function () {
						    endTime = (new Date()).getTime();
						    showResults();
						}
						startTime = (new Date()).getTime();
						download.src = imageAddr;

						function showResults() {
						    var duration = (endTime - startTime) / 1000; //Math.round()
						    var bitsLoaded = downloadSize * 8;
						    var speedBps = (bitsLoaded / duration).toFixed(2);
						    var speedKbps = (speedBps / 1024).toFixed(2);
						    var speedMbps = (speedKbps / 1024).toFixed(2);
						    
							$(".waiting").css("display", "none");
							if(speedMbps >= 0.50){
  								console.log("zum Video");
  								$(".text").addClass("active").append("Sorry but your connection is too slow. You will be redirected to the default video in a few seconds!");
  								clearTimeout(this.downTimer);
	    						this.downTimer = setTimeout(function() {
  									
  									$(".section-0.ui-accordion-header").click();
  								},2000);
  								
							}else{
								console.log("kann weiter gehen");
								window.location.href = "http://localhost/apetape/index.php?id=6";
							}
						}
					}
						
					
				});
			});

		');
		
		foreach ($accordions as $as) {
			if($as['video']){
				$sections[] = array(
					'title' => $as['title'],
					'video' => $as['video']
				);
			}else{
				$sections[] = array(
					'title' => $as['title'],
					'text' => $javascript
				);
			}
		}
		
		$content .= $this->view->renderAccordion($sections,'accordion-'.$this->cObj->data['uid']);
		
		

		return '<div class="accordionMenue">'.$content.'</div>';
	}
	
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_accordion.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_accordion.php']);
}
?>