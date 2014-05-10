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
		
		foreach ($accordions as $as) {
			$sections[] = array(
				'title' => $as['title'],
				'video' => $as['video']
			);
		}
		
		$content .= $this->view->renderAccordion($sections,'accordion-'.$this->cObj->data['uid']);
		
		

		return '<div class="accordionMenue">'.$content.'</div>';
	}
	
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_accordion.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_accordion.php']);
}
?>