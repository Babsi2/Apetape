<?php
require_once(PATH_tslib.'class.tslib_pibase.php');

class tx_content_menu extends tslib_pibase {

		// Default extension plugin variables:
	var $prefixId = 'tx_content_menu'; // Same as class name
	var $scriptRelPath = 'plugins/class.tx_content_menu.php'; // Path to this script relative to the extension dir.
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
		$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','pages','doktype = 1 AND pid=:pid'.$this->cObj->enableFields('pages'),'','sorting ASC','');
		$stmt->bindValue(':pid', $this->cObj->data['pid']);
		$stmt->execute();
		$menues = $stmt->fetchAll();

		// foreach($menues as $i => $menu){
		// 	//print_R($menu['uid']);
		// 	$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tt_content','CType LIKE "%szene" AND pid=:pid'.$this->cObj->enableFields('tt_content'),'','sorting ASC','');
		// 	$stmt->bindValue(':pid', $menu['uid']);
		// 	$stmt->execute();
		// 	$szenes = $stmt->fetchAll();
		// 	foreach($szenes as $j => $szene){
		// 		$image = explode(',',$szene['images']);
		// 		$imgsrc = 'fileadmin/user_upload/images/content/'.$image[0];
 
		// 		$img = array();
		// 		$img['file'] = $imgsrc;
		// 		$img['file.']['maxW'] = '200';
		// 		//$img['file.']['maxH'] = '108';
				
		// 		$link = $this->cObj->getTypoLink_URL($szene['pid'],0);
		// 		$imagepath = '<a href="'.$link.'">'.$this->cObj->IMAGE($img).'<span class="textSzene">'.$szene['header'].'</span></a>';
				
			
		// 		$content[] = '
		// 			<div class="menue">
		// 				'.$imagepath.'</div>';
		// 	}
		// }
		
		$content = 
			'<div class="accordion">
				<h3 class="first">DEFAULT VIDEO</h3>
				<div class="first">Test</div>
				<h3 class="second">INTERACTIVE</h3>
				<div class="second">TEST TEST</div>
			</div>';

		return '<div class="szeneMenue">'.$content.'</div>';
	}
	
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_menu.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_menu.php']);
}
?>