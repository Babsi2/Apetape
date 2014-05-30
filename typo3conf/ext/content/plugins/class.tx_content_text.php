<?php
use TYPO3\CMS\Frontend\Plugin\AbstractPlugin;

class tx_content_text extends AbstractPlugin {

		// Default extension plugin variables:
	// var $prefixId = 'tx_content_accordion'; // Same as class name
	// var $scriptRelPath = 'plugins/class.tx_content_accordion.php'; // Path to this script relative to the extension dir.
	// var $extKey = 'content'; // The extension key.
	// public $pi_checkCHash = TRUE;

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

		
		
		$content = $this->view->renderText($this->cObj->data);
		
		
		$top = '<div id="top"></div>';
		$javascript = t3lib_div::wrapJS("
			$(document).ready(function(){

				bottom();

			});
			
		");

		return $javascript.$top.'<div class="text">'.$content.'</div>';
	}
	
}