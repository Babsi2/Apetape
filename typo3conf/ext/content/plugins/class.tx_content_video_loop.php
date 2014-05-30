<?php
require_once(PATH_tslib.'class.tslib_pibase.php');

class tx_content_video_loop extends tslib_pibase {

		// Default extension plugin variables:
	var $prefixId = 'tx_content_video_loop'; // Same as class name
	var $scriptRelPath = 'plugins/class.tx_content_video_loop.php'; // Path to this script relative to the extension dir.
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
		
		$filetype = filetype("/apetape/fileadmin/user_upload/video/".$this->cObj->data['video']);
		$video = '
			<video autoplay loop>
			  <source src="/apetape/fileadmin/user_upload/video/'.$this->cObj->data['video'].'" type="video/mp4">
			Your browser does not support the video tag.
			</video>
		';

		return '<div class="overlay_video_loop">'.$video.'</div>';
	}
	
}
