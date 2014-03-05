<?php
require_once(PATH_tslib.'class.tslib_pibase.php');

class tx_content_background extends tslib_pibase {

		// Default extension plugin variables:
	var $prefixId = 'tx_content_background'; // Same as class name
	var $scriptRelPath = 'plugins/class.tx_content_background.php'; // Path to this script relative to the extension dir.
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
		
				$image = $this->cObj->data['image'];
				$imgsrc = 'fileadmin/user_upload/images/content/'.$image;
 
				$img = array();
				$img['file'] = $imgsrc;
				//$img['file.']['maxW'] = '200';
				//$img['file.']['maxH'] = '108';
				
				$imagepath = $this->cObj->IMAGE($img);
				
			
				$content = $imagepath;
		
		

		return '<div class="menuBackground">'.$content.'</div>';
	}
	
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_background.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_background.php']);
}
?>