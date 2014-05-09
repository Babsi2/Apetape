<?PHP

include_once(PATH_site . 'typo3/sysext/cms/tslib/class.tslib_content.php');
require_once (PATH_site . 'typo3/sysext/cms/tslib/class.tslib_fe.php');
require_once (PATH_site . 'typo3/sysext/cms/tslib/class.tslib_content.php');


class tx_BEFunctions implements t3lib_Singleton {


	function user_pathPosition($PA, $fobj){
		$uid = $PA['row']['uid'];
		$parentId = $PA['row']['parent'] == "" ? 0 : $PA['row']['parent'];
		$pid = $PA['row']['pid'] == "" ? 0 : $PA['row']['pid'];
		
		$res = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*', 'tt_content','pid=79 AND list_type="content_path" AND hidden=0 AND deleted=0','','','');
		$res->execute();
		$row = $res->fetch();
		
		$image = '../fileadmin/images/pfad_bg.jpg';
		
		
		$points = explode(',',$PA['row']['position']);
		for($i=0;$i<count($points);$i = $i+2){
			$x = $points[$i];
			$y = $points[$i+1];
			$dots .= '<div style="position:absolute; width:3px; height:3px; background:url(../fileadmin/images/be_dot.gif);position:absolute; top:'.$y.'px; left:'.$x.'px;"></div>';
		}
		
		$content ='
			<div id="teamPositionMap" style="background:url('.$image.'); width:1920px; height:1024px; position:relative;"
				onclick="getXYText(\'' . $uid . '\',event.offsetX?(event.offsetX):event.layerX,event.offsetY?(event.offsetY):event.layerY,\'' . $PA['table'] . '\',\'position\');">
			'.$dots.'
			</div><script src="../fileadmin/js/be.js" type="text/javascript"></script>
		';
		
		return $content;
	}
}

?>