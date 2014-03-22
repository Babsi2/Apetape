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

		// if($_GET['teamID'])
		// 	$content = $this->renderTeamDetail($this->team->getTeamMember(intval(t3lib_div::_GP('teamID'))));
		// else
		// 	$content = $this->renderTeamOverview ($this->team->getTeamMembers($this->cObj->data['pid']));
		
		// return $content;

		// print_R($this->cObj->data);
	}
	
// 	function renderTeamOverview($members){
// 		$img = 'fileadmin/user_upload/images/content/'.$this->cObj->data['tx_image'];
// 		$size = getimagesize($img);
// 		$image = '<img id="members_all" src="'.$img.'" usemap="#members" />';

// 		foreach($members as $m){
// 			$m = $GLOBALS['TSFE']->sys_page->getRecordOverlay("tx_team", $m, $GLOBALS['TSFE']->config['config']['sys_language_uid'], 'hideNonTranslated');
// 			$sum = 0;
// 			$pos = explode(',',$m['position']);
// 			for($i=0;$i<count($pos);$i+=2){
// 				$sum += $pos[$i];
// 			$infoX = $sum*2 / count($pos);
// 			$cls = $infoX > 810 ? 'right' : '';
// 			$infoX = $infoX >800 ? $infoX - 300: $infoX+100;
			
// 			$overid = Link_Func::URLize($m['title']);
// 			$overlays .= '
// 				<div id="'.$overid.'" class="overlay ready">
// 					<img id="members_all" class="ready" src="fileadmin/user_upload/images/team/'.$m['image'].'" usemap="#members"/>
// 					<div class="infobox '.$cls.'" style="left:'.$infoX.'px;">
// 						<div class="inner">
// 							<h1 class="coltext">'.$m['title'].'</h1>
// 							<div class="text">'.$m['shorttext'].'</div>
// 						</div>
// 					</div>
// 				</div>
// 			';
			
// 			$link = $this->uObj->MakeLink($GLOBALS['TSFE']->id,array('teamID'=>$m['uid']));
// 			$maps .= '<area shape="poly" coords="'.$m['position'].'" href="'.$link.'" rel="'.$overid.'"/>';
// 		}

// 		$content = '
// 			<script type="text/javascript">
// 				var lastView = 1000;
// 				if(navigator.appName=="Microsoft Internet Explorer"){
// 					var fadeTime = 0;
// 				}
// 				else{
// 					var fadeTime=300;
// 				}
// 				$(document).ready(function(e){
// 					$(\'area\').mouseover(function(){
						
// //						lastView = Date.now();
// 						lastView = new Date().getTime();
// 						$(\'#\'+$(this).attr(\'rel\')).fadeIn(fadeTime,function(){triggerOut=true;});
// 					}).mouseout(function(e){
// //						if( (Date.now()-lastView) > 120 ){
// 							$(\'#\'+$(this).attr(\'rel\')).fadeOut(fadeTime);
// //						}
// 					});
// 				});
// 			</script>
// 			<div class="team" style="width:'.$size[0].'px; height:'.$size[1].'px;" onmouseover="$(\'#members_all\').fadeTo(0,0.55);" onmouseout="$(\'#members_all\').fadeTo(0,1);">
// 				'.$image.'
// 				'.$overlays.'
// 				<map name="members">'.$maps.'</map>
// 			</div>
// 		';
		
// 		return $content;
// 	}
	
// 	function renderTeamDetail($m){
// 		$content = '
// 			<div class="team-detail">
// 				<div class="image fl">
// 					'.$this->cObj->IMAGE(array(
// 						'file' => 'fileadmin/user_upload/images/team/'.$m['image_detail'],
// 						'altText' => $m['title'],
// 						'titleText' => $m['title']
// 				)).'
// 				</div>
// 				<div class="text fl">
// 					<div class="header">
// 						<h1 class="coltext">'.$m['title'].'</h1>
// 						<h2>'.$m['subtitle'].'</h2>
// 					</div>
// 					'.$this->cObj->stdWrap($this->view->prepareText($m['bodytext']),$this->conf['general_stdWrap.']).'
// 				</div>
// 				<div class="backlink">
// 					<a href="'.$this->cObj->getTypoLink_URL($GLOBALS['TSFE']->id).'" class="" alt="'.Translations::Fetch('back_to_overview').'" title="'.Translations::Fetch('back_to_overview').'">
// 						<b>'.Translations::Fetch('back_to_overview').'</b>
// 					</a>
// 				</div>
// 				<div class="clear"></div>
// 			</div>
// 		';
		
// 		return $content;
// 	}
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_path.php']) {
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_path.php']);
}
?>