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

		// $image = '<div class="pathImage">'.$this->cObj->IMAGE(array(
		// 		'file' => (basename($row['image']) == $row['image'] ? 'fileadmin/user_upload/path/'.$row['image'] : $row['image']),
				
		// 		'altText' => 'path Image',
		// 		'titleText' => 'path Image'
		// 	)).'</div>';
		// print_R($q);
		$content = '
			<div class="path">
				<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
				<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
				    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
				<svg xmlns="http://www.w3.org/2000/svg"
				     xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
				         width="1920" height="1000"
				         viewBox="0 0 1920 1000"  >

				  <!-- Background -->
				  <!--<rect x="0" y="0" width="100%" height="100%" fill="url(#rulerPattern)" stroke="black" />-->

				  <!-- Transform Animation Example -->

				  <rect id="startButton" x="120" y="20" width="60" height="20" fill="green" />

				    <image id="image" x="10" y="10" width="80" height="80" xlink:href="fileadmin/user_upload/path/'.$row['image'].'" />
				    
				    <animateMotion begin="startButton.click" path="M '.$m.implode('',$q).'Z" dur="5s" rotatae="auto" fill="freeze" xlink:href="#image" />

				</svg>
			</div>';

		return($content);
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