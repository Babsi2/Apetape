<?PHP

include_once(PATH_site . 'typo3/sysext/cms/tslib/class.tslib_content.php');
require_once (PATH_site . 'typo3/sysext/cms/tslib/class.tslib_fe.php');
require_once (PATH_site . 'typo3/sysext/cms/tslib/class.tslib_content.php');

class tx_BEFunctions implements t3lib_Singleton {

// 	function user_getcropparams($coords, $ratio, $crop) {

// 		if (!$coords)
// 			$coords = '0,0|' . (round($crop[0] / $ratio)) . ',' . (round($crop[1] / $ratio));

// 		$coords = explode('|', $coords);
// 		$coords1 = explode(',', $coords[0]);
// 		$coords2 = explode(',', $coords[1]);
// 		$coords3 = explode(',', $coords[2]);

// 		$coords = array(
// 			'x1' => round($coords1[0] / $ratio),
// 			'y1' => round($coords1[1] / $ratio),
// 			'x2' => round($coords2[0] / $ratio),
// 			'y2' => round($coords2[1] / $ratio),
// 			'x3' => round($coords3[0] / $ratio),
// 			'y3' => round($coords3[1] / $ratio),
// 			'minWidth' => round($crop[0] / $ratio),
// 			'minHeight' => round($crop[1] / $ratio),
// 				//'aspectRatio' => round($crop[0]/$ratio).':'.round($crop[1]/$ratio),
// 		);

// 		/*

// 		  foreach ($coords as $key=>$option){
// 		  if(!$option) unset($coords[$key]);
// 		  }
// 		 */

// 		$options = json_encode($coords);
// 		$options = str_replace('"', '', $options);
// 		$options = str_replace('}', ',aspectRatio: "' . $coords['minWidth'] . ':' . $coords['minHeight'] . '"}', $options);

// 		return $options;
// 	}

// 	function user_getcrop_products($PA, $fobj) {

// 		$uid = $PA['row']['uid'];
// 		$coords1 = $PA['row']['crop_coords_f1'];

// 		$res = mysql_query('SELECT * FROM '.$PA['table'].' WHERE uid=' . $uid . ' AND hidden=0 AND deleted=0 LIMIT 0,1');
// 		if ($res)
// 			$row = mysql_fetch_assoc($res);

// 		if ($row) {
// 			if($PA['table'] == 'tx_products') {
// 				$imgfile = 'fileadmin/user_upload/images/products/' . $row['image'];
// 			} elseif ($PA['table'] == 'tx_lmp_products') {
// 				$imgfile = 'fileadmin/user_upload/images/products/' . $row['image_right'];
// 			} elseif ($PA['table'] == 'tx_lmp_casings') {
// 				$imgfile = 'fileadmin/user_upload/lmp/casings/' . $row['image'];
// 			} else {
// 				$imgfile = 'fileadmin/user_upload/images/content/' . $row['tx_image'];
// 			}
// 		}

// 		if (($row['image'] || $row['tx_image'] || $row['image_right']) && file_exists(PATH_site . $imgfile)) {

// 			//get original Width
// 			list($ow, $oh) = getimagesize(PATH_site . $imgfile);
// 			// set maxW for thumb
// 			$maxW = 400;

// 			//ImageCrop
// 			$crop1 = array(375, 800);
// 			// calc & build params  
// 			$ratio = $ow / $maxW;
// 			$nw = round($ow * (1 / $ratio));
// 			$nh = round($oh * (1 / $ratio));

// 			$options1 = user_getcropparams($coords1, $ratio, $crop1);

// 			$params1 = <<< HTML
// id='crop_{$uid}_f1' class='be_crop' onload='initCropper("{$PA['table']}","{$uid}_f1",{$options1},{$ratio})'      
// HTML;


// 			$thumb1 = t3lib_befunc::getThumbnail($GLOBALS['BACK_PATH'] . 'thumbs.php', PATH_site . $imgfile, $params1, $nw . 'x' . $nh);


// 			$content = "<div>";
// 			$content.= "<div style='float:left;margin-right:20px'><b>Ãœbersicht</b><div style='position:relative;z-index:1;' id='parent_$uid" . "_f1'>$thumb1</div></div>";
// 			$content.= "<div style='clear:both'>&nbsp;</div></div>";
// 		} else {
// 			$content = 'Es ist kein Bild vorhanden';
// 		}

// 		return $content;
// 	}

// 	function user_getcrop_glossary($PA, $fobj) {

// 		$uid = $PA['row']['uid'];
// 		$coords1 = $PA['row']['crop_coords_f1'];

// 		$res = mysql_query('SELECT * FROM tx_glossary WHERE uid=' . $uid . ' AND hidden=0 AND deleted=0 LIMIT 0,1');
// 		if ($res)
// 			$row = mysql_fetch_assoc($res);
// 		//print_r($PA);
// 		$relpath = '../../../../';

// 		if ($row)
// 			$imgfile = 'fileadmin/user_upload/images/glossary/' . $row['image'];

// 		if ($row['image'] && file_exists(PATH_site . $imgfile)) {

// 			//get original Width
// 			list($ow, $oh) = getimagesize(PATH_site . $imgfile);
// 			// set maxW for thumb
// 			$maxW = 400;

// 			//ImageCrop
// 			$crop1 = array(250, 180);
// 			// calc & build params  
// 			$ratio = $ow / $maxW;
// 			$nw = round($ow * (1 / $ratio));
// 			$nh = round($oh * (1 / $ratio));

// 			$options1 = user_getcropparams($coords1, $ratio, $crop1);

// 			$params1 = <<< HTML
// id='crop_{$uid}_f1' class='be_crop' onload='initCropper("{$PA['table']}","{$uid}_f1",{$options1},{$ratio})'      
// HTML;


// 			$thumb1 = t3lib_befunc::getThumbnail($GLOBALS['BACK_PATH'] . 'thumbs.php', PATH_site . $imgfile, $params1, $nw . 'x' . $nh);


// 			$content = "<div>";
// 			$content.= "<div style='float:left;margin-right:20px'><b>Ãœbersicht</b><div style='position:relative;z-index:1;' id='parent_$uid" . "_f1'>$thumb1</div></div>";
// 			$content.= "<div style='clear:both'>&nbsp;</div></div>";
// 		} else {
// 			$content = 'Es ist kein Bild vorhanden';
// 		}

// 		return $content;
// 	}

// 	function user_getcrop($PA, $fobj) {



// 		$uid = $PA['row']['uid'];
// 		$coords1 = $PA['row']['crop_coords_f1'];
// 		$coords2 = $PA['row']['crop_coords_f2'];
// 		$coords3 = $PA['row']['crop_coords_f3'];




// 		$res = mysql_query('SELECT * FROM tx_recipe_images WHERE uid=' . $uid . ' AND hidden=0 AND deleted=0 LIMIT 0,1');
// 		if ($res)
// 			$row = mysql_fetch_assoc($res);
// 		//print_r($PA);
// 		$relpath = '../../../../';

// 		if ($row)
// 			$imgfile = 'fileadmin/user_upload/images/recipes/' . $row['recipe_image'];

// 		if ($row['recipe_image'] && file_exists(PATH_site . $imgfile)) {

// 			//get original Width
// 			list($ow, $oh) = getimagesize(PATH_site . $imgfile);
// 			// set maxW for thumb
// 			$maxW = 400;

// 			//ImageCrop
// 			$crop1 = array(118, 88);
// 			$crop2 = array(278, 188);
// 			$crop3 = array(228, 148);

// 			// calc & build params  
// 			$ratio = $ow / $maxW;
// 			$nw = round($ow * (1 / $ratio));
// 			$nh = round($oh * (1 / $ratio));

// 			$options1 = user_getcropparams($coords1, $ratio, $crop1);
// 			$options2 = user_getcropparams($coords2, $ratio, $crop2);
// 			$options3 = user_getcropparams($coords3, $ratio, $crop3);


// 			//echo $options1.'  ';
// 			//echo $options2.'  ';


// 			$params1 = <<< HTML
// 	id='crop_{$uid}_f1' class='be_crop' onload='initCropper("{$PA['table']}","{$uid}_f1",{$options1},{$ratio})'      
// HTML;

// 			$params2 = <<< HTML
// 	id='crop_{$uid}_f2' class='be_crop' onload='initCropper("{$PA['table']}","{$uid}_f2",{$options2},{$ratio})'      
// HTML;

// 			$params3 = <<< HTML
// 	id='crop_{$uid}_f3' class='be_crop' onload='initCropper("{$PA['table']}","{$uid}_f3",{$options3},{$ratio})'      
// HTML;
// 			$thumb1 = t3lib_befunc::getThumbnail($GLOBALS['BACK_PATH'] . 'thumbs.php', PATH_site . $imgfile, $params1, $nw . 'x' . $nh);
// 			$thumb2 = t3lib_befunc::getThumbnail($GLOBALS['BACK_PATH'] . 'thumbs.php', PATH_site . $imgfile, $params2, $nw . 'x' . $nh);
// 			$thumb3 = t3lib_befunc::getThumbnail($GLOBALS['BACK_PATH'] . 'thumbs.php', PATH_site . $imgfile, $params3, $nw . 'x' . $nh);


// 			$content = "<div>";
// 			$content.= "<div style='float:left;margin-right:20px'><b>ÃƒÅ“bersicht</b><div style='position:relative;z-index:1;' id='parent_$uid" . "_f1'>$thumb1</div></div>";
// 			$content.= "<div style='float:left;margin-right:20px'><b>Detailseite</b><div style='position:relative;z-index:1;' id='parent_$uid" . "_f2'>$thumb2</div></div>";
// 			$content.= "<div style='float:left'><b>verknÃƒÂ¼pftes Rezept</b><div style='position:relative;z-index:1;' id='parent_$uid" . "_f3'>$thumb3</div></div>";
// 			$content.= "<div style='clear:both'>&nbsp;</div></div>";
// 		} else {
// 			$content = 'Es ist kein Bild vorhanden';
// 		}

// 		return $content;
// 	}

// 	/*
// 	  function printAnArray($array){
// 	  foreach($array as $item){
// 	  if(is_array($item)) $content.= '<li>'.printArray($item).'</li>';
// 	  else $content.= '<li>'.$item.'</li>';
// 	  }
// 	  return '<ul>'.$content.'</ul>';
// 	  }
// 	 */

// 	function user_position($PA, $fobj) {
// 		$uid = $PA['row']['uid'];
// 		$parentId = $PA['row']['parent'] == "" ? 0 : $PA['row']['parent'];
// 		$pid = $PA['row']['parent_id'] == "" ? 0 : $PA['row']['parent_id'];

// 		$path = '/fileadmin/user_upload/images/start_features/';
// 		$whStr = 'width: 980px;height: 670px;';

// 		$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*', 'tx_start_features', 'uid=:uid', '', '', '');
// 		$stmt->bindValue(':uid', (int)$parentId, t3lib_db_PreparedStatement::PARAM_INT);
// 		$stmt->execute();
// 		$cRow = $stmt->fetch();
		
// 		list($img) = explode("|", $cRow['image']);
// 		if ($img)
// 			$image = $path . rawurlencode ($img);
// 		else
// 			$image = '/fileadmin/images/flash_default.jpg';

// 		$dot = '
// 			<div id="dot' . $uid . '" style="position: absolute;left:' . intval($PA['row']['pos_x']) . 'px;top:' . intval($PA['row']['pos_y']) . 'px;width: 20px;height: 20px;background:url(/fileadmin/images/hotspot.png)"  ></div>';


// 		$content .= '
// 			<br/><br/>
// 			<div id="pointer_div' . $uid . '" style="' . $whStr . 'position:relative;background:url(' .$image . ');" onclick="getXY(\'' . $uid . '\',event.offsetX?(event.offsetX):event.layerX,event.offsetY?(event.offsetY):event.layerY,\'' . $PA['table'] . '\',0,0,\'pos_x\',\'pos_y\');" >
// 				' . $dot . '
// 			</div>
			
// 			<br/>
// 			';
// 		return $content;
// 	}

	function user_pathPosition($PA, $fobj){
		$uid = $PA['row']['uid'];
		$parentId = $PA['row']['parent'] == "" ? 0 : $PA['row']['parent'];
		$pid = $PA['row']['pid'] == "" ? 0 : $PA['row']['pid'];
		
		$res = mysql_query('SELECT * FROM tt_content WHERE pid=79 AND list_type="content_path" AND hidden=0 AND deleted=0 LIMIT 0,1');
		if ($res)
			$row = mysql_fetch_assoc($res);
		
		$image = '../fileadmin/user_upload/images/content/background_02.jpg';
		
		// print_R($image);
		$points = explode(',',$PA['row']['position']);
		for($i=0;$i<count($points);$i = $i+2){
			$x = $points[$i];
			$y = $points[$i+1];
			$dots .= '<div style="position:absolute; width:3px; height:3px; background:url(../fileadmin/images/be_dot.gif);position:absolute; top:'.$y.'px; left:'.$x.'px;"></div>';
		}
		
		$content ='
			<div id="teamPositionMap" style="background:url('.$image.'); width:1280px; height:466px; position:relative;"
				onclick="console.log(event);getXYText(\'' . $uid . '\',event.offsetX?(event.offsetX):event.layerX,event.offsetY?(event.offsetY):event.layerY,\'' . $PA['table'] . '\',\'position\');">
			'.$dots.'
			</div>
		';
		
		return $content;
	}


	function user_ingredientsLabel(&$params, $pObj) {
		
		if($params['row']['uid']) {
			$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_recipe_ingredients','uid='.$params['row']['uid']);
			$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
			
			switch ($row['type']) {
				case 1: 
					if ($row['ingredient']) {
						$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_ingredients','uid='.intval(str_replace('tx_ingredients_','',$row['ingredient'])));
						$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
						$foreign_text = $row['ingredient_name'];                        
					}
					break;
				case 2:
					if ($row['product']) {
						$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_products','uid='.intval(str_replace('tx_products_','',$row['product'])));
						$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
						$foreign_text = $row['title'];                      
					}

					break;
				case 3:
					if ($row['recipe']) {
						$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_recipes','uid='.intval(str_replace('tx_recipes_','',$row['recipe'])));
						$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
						$foreign_text = $row['recipe_name'];               
					}
					break;
				default: break;
			}
			if($foreign_text) $params['title'] = $foreign_text; 
			else $params['title'] = '[Kein Titel]';
		}
	}
	
}

?>