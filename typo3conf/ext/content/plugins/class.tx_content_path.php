<?php
require_once(PATH_tslib.'class.tslib_pibase.php');
// require_once(t3lib_extMgm::extPath('team') . 'res/class.Team.php');

class tx_content_path extends tslib_pibase {

	var $prefixId = 'tx_content_path';
	var $scriptRelPath = 'plugins/class.tx_content_path.php';
	var $extKey = 'content';
	var $pi_checkCHash = TRUE;
	var $uObj;
	var $view;

	function main($content,$conf) {

		#################################################################################
		$this->conf=$conf;
		$this->pi_setPiVarDefaults();
		$this->uObj = utils::GetInstance($this->cObj);
		$this->view = new View($this->conf, $this->uObj);
		// $this->team = new Team($this->uObj);
		#################################################################################

		// print_R($this->cObj->data);

		$res = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*', 'tx_path','pid=:pid','','','');
		$res->bindValue(':pid', $this->cObj->data['pid']);
		$res->execute();
		$row = $res->fetch();

		$coordinates = explode(',',$row['position']);
		// print_R($coordinates);

		
		for($i=0; $i < count($coordinates); $i++){
			$sum[] = $coordinates[$i].','.$coordinates[$i+1];
			$i++;
		}

		// print_R($sum);

		for($j=0; $j<count($sum); $j++){
			if($j == 0){
				$m = $sum[0];
			}else{
				$q[] = 'Q'.$sum[$j].' '.$sum[$j+1];
				$j++;
			}
		}

		$javascript = t3lib_div::wrapJS('
			$(document).ready(function{
				
			})	
		');

		$content = '
			<div class="path" style="z-index:979;">
				<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
				<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
				    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
				<svg xmlns="http://www.w3.org/2000/svg"
				     xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
				         width="1920" height="1080"
				         viewBox="0 0 1920 1080"  >

				  <!-- Background -->
				  <!--<rect x="0" y="0" width="100%" height="100%" fill="url(#rulerPattern)" stroke="black" />-->

				  <!-- Transform Animation Example -->

				  

				    <image id="image" x="10" y="10" width="628" height="628" xlink:href="fileadmin/user_upload/path/'.$row['image'].'" />

				    <image id="imageRed" x="30" y="10" width="628" height="628" style="display:none;" xlink:href="fileadmin/user_upload/path/'.$row['red_image'].'"/>

				    <image id="imageGreen" x="50" y="10" width="628" height="628" style="display:none;" xlink:href="fileadmin/user_upload/path/'.$row['blue_image'].'"/>
				     
				    <animateMotion begin="1s" path="M '.$m.implode('',$q).'Z" dur="5s" rotate="auto" repeatCount="indefinite" fill="freeze" xlink:href="#image" />

				    <animateMotion begin="1s" path="M '.$m.implode('',$q).'Z" dur="5s" rotate="auto" repeatCount="indefinite" fill="freeze" xlink:href="#imageRed" />

				    <animateMotion begin="1s" path="M '.$m.implode('',$q).'Z" dur="4s" rotate="auto" repeatCount="indefinite" fill="freeze" xlink:href="#imageGreen" />

				</svg>
			</div>';

		return($content);

	}

}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_path.php']) {
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_path.php']);
}
?>