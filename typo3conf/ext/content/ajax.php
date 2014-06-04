<?php
if (!defined('PATH_typo3conf'))
	die('Could not access this script directly!');

require_once PATH_site.'fileadmin/inc/class.Utils.php';
require_once PATH_site.'fileadmin/inc/class.View.php';

/**
 * @var Utils 
 */
$uObj;


/**
 * @var View
 */
$view;


$uObj = utils::GetInstance($cObj);
$view = new  View($conf, $uObj);

$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_powermail_domain_model_mails','sender_ip=:server_address AND deleted=0 AND hidden=0','','ASC','');
$stmt->bindValue(':server_address', $_SERVER['REMOTE_ADDR']);
$stmt->execute();
$mail = $stmt->fetch();

$stm = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_powermail_domain_model_answers','mail=:server_address AND deleted=0 AND hidden=0','','ASC','');
$stm->bindValue(':server_address', $mail['uid']);
$stm->execute();
$answers = $stm->fetchAll();

if(!$answers){
  $ascButton1 = ord('U');
  $ascButton2 = ord('I');
  $ascButton3 = ord('O');
  $ascButton4 = ord('P');
}
    
  
foreach($answers as $answer){
  $key = ord(strtoupper($answer['value'])) ? ord(strtoupper($answer['value'])) : '';

  $stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_powermail_domain_model_fields','uid=:field AND deleted=0 AND hidden=0','','ASC','');
  $stmt->bindValue(':field', $answer['field']);
  $stmt->execute();
  $field = $stmt->fetch();
    
  if($field['title'] == "button_1"){
    $ascButton1 = $key;
  }else if($field['title'] == "button_2"){
    $ascButton2 = $key;
  }else if($field['title'] == "button_3"){
    $ascButton3 = $key;
  }else if($field['title'] == "button_4"){
    $ascButton4 = $key;
  }else if($field['title'] == "control_top"){
    $ascControl1 = $key;
  }else if($field['title'] == "control_left"){
    $ascControl2 = $key;
  }else if($field['title'] == "control_right"){
    $ascControl4 = $key;
  }else if($field['title'] == "control_bottom"){
    $ascControl3 = $key;
  }else if($field['title'] == "button_5"){
    $ascButton5 = $key;
  }
}

$link = $_GET['link'];
$link_array = explode('/', $link);
$page_links = explode('-', $link_array[4]);
$page_link = $page_links[0].' '.$page_links[1];

$arr = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','pages','pid=:pid AND hidden=0 AND deleted=0 AND doktype=1 AND NOT uid=:uid','','sorting DESC','');
$arr->bindValue(':pid', 2);
$arr->bindValue(':uid', 13);
$arr->execute();

$menues = $arr->fetchAll();

$page_menues = array_reverse($menues);
$clicked = $_GET['click'];
$path = $_GET['path'];
foreach($page_menues as $i => $pm){
	if(strtolower($pm['title']) == $page_link && $clicked==='false'){
		$i += 1;
		$pm_new = $page_menues[$i];
		$pid = $pm_new['uid'];
		$title = $pm_new['title'];
	}else if(strtolower($pm['title']) == $page_link && $clicked==='true'){
		$pid = $pm['uid'];
		$title = $pm['title'];
	}else{
		$pid = '';
		$title = '';
	}
	
	$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tt_content','pid=:pid AND hidden=0 AND deleted=0','','sorting DESC','');
	$stmt->bindValue(':pid', $pid);
	$stmt->execute();
	$pages = $stmt->fetchAll();

	foreach($pages as $page){
		$links_new = explode(' ',strtolower($title));
		$link_new = implode('-',$links_new);
		$navi = '
		$("#navi").click(function(){
			if($("#navi").hasClass("active")){
				$("#navi").removeClass("active").css("left","30px");
				$("#content-navi").css({
					"overflow":"hidden",
					"width":"0px"
				});
			}else{
				$("#navi").addClass("active").css("left", "250px");
				$("#content-navi").css({
					"overflow":"visible",
					"width":"240px"
				});
			}
		});

			if($("#navi").hasClass("active")){
				$("#navi").removeClass("active").css("left","30px");
				$("#content-navi").css({
					"overflow":"hidden",
					"width":"0px"
				});
			}
		';
		$javascript = '
			getButtons();
			getTypo();
			getControls();
			getKeys();
			getAudio();
		';
		
		$page_url = '
			<script>
				jQuery(document).ready(function(){
					$("#content").removeClass("szeneChangeFast").addClass("szeneBegin");
					history.pushState({},"","http://www.zac.co.at/apetape/'.$link_new.'");
					'.$navi.'
					$("#content #inhalt .opacityScrollable .items .imageOrder.opacity0").css("display", "block").addClass("active");
					'.$javascript.'
				});
			</script>
		';
		
		
		if($page['border']){
			$border = explode(',', $page['border']);
			foreach($border as $i => $b){
				$image[] = '
				<div class="image" data-val="'.$i.'">
					<img src="fileadmin/user_upload/images/rahmen/'.$b.'" alt="border" />
				</div>';
			}
			
		}

		if($page['sound']){
			$sounds = explode(',', $page['sound']);
			$sound = '
				<audio autoplay id="player">
				  <source src="fileadmin/user_upload/music/'.$sounds[0].'" type="audio/mpeg">
				  <source src="fileadmin/user_upload/music/'.$sounds[1].'" type="audio/ogg">
				 				Your browser does not support the audio element.
				</audio>';
				
		}

		if($page['images']){

			$imageCollection = explode(',', $page['images']);
			$j = 0;
			if($page['image_order'] && ($page['pid'] == '12')){
				$class = 'szene9';
			}elseif($page['image_order']){
				$class = 'imageOrder';
			}else{
				$class = '';
			}
			$collection = array();
			foreach($imageCollection as $imgCol){
				$collection[] = '
					<div class="opacity'.$j.' '.$class.'">
						<div>
							<img src="fileadmin/user_upload/images/content/'.$imgCol.'" alt="'.$imgCol.'" id="css-filter-blur" draggable="true"/>
						</div>
						<svg id="svg-image-blur" style="height: 1000px;">
						    <filter id="blur-effect-1">
						        <feGaussianBlur stdDeviation="2" />
						    </filter>
						    <filter id="sepia">
								<feColorMatrix values="0.393 0.769 0.189 0 0 0.349 0.686 0.168 0 0 0.272 0.534 0.131 0 0 0 0 0 1 0" type="matrix">
							</filter>
							<filter id="hue-rotate">
								<feColorMatrix values="180" type="hueRotate">
							</filter>
						</svg>
			    	</div>';

			    $j++;
			}
		}

		if($page['button_effect_one']){
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid AND deleted=0 AND hidden=0','','sorting ASC','');
			$stmt->bindValue(':uid', $page['button_effect_one']);
			$stmt->execute();
			$buttons1 = $stmt->fetchAll();
			
			foreach($buttons1 as $button1){
				$but1 = '<div class="button-1 button '.$button1['title'].'" data-button1 = "'.$ascButton1.'">'.$button1['title'].'</div>';
			}
		}

		if($page['button_effect_two']){
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid AND deleted=0 AND hidden=0','','sorting ASC','');
			$stmt->bindValue(':uid', $page['button_effect_two']);
			$stmt->execute();
			$buttons2 = $stmt->fetchAll();
			
			foreach($buttons2 as $button2){
				$but2 = '<div class="button-2 button '.$button2['title'].'" data-button2 = "'.$ascButton2.'">'.$button2['title'].'</div>';
			}
		}
 
 		if($page['button_effect_three']){
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid AND deleted=0 AND hidden=0','','sorting ASC','');
			$stmt->bindValue(':uid', $page['button_effect_three']);
			$stmt->execute();
			$buttons3 = $stmt->fetchAll();
			
			foreach($buttons3 as $button3){
				$but3 = '<div class="button-3 button '.$button3['title'].'" data-button3 = "'.$ascButton3.'">'.$button3['title'].'</div>';
			}
		}

		if($page['button_effect_four']){
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid AND deleted=0 AND hidden=0','','sorting ASC','');
			$stmt->bindValue(':uid', $page['button_effect_four']);
			$stmt->execute();
			$buttons4 = $stmt->fetchAll();
			
			foreach($buttons4 as $button4){
				$but4 = '<div class="button-4 button '.$button4['title'].'" data-button4 = "'.$ascButton4.'">'.$button4['title'].'</div>';
			}
		}

		if($page['wuerd']){
			$wuerd = '
				<div class="wuerdButton">
					<div class="button-5 button wuerd" data-button5 = "'.$ascButton5.'">Würd</div>
				</div>
			';
		}

		if($page['controls']){
		
			foreach(explode(',', $page['controls']) as $control){
				$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_controls','uid=:uid AND deleted=0 AND hidden=0','','','');
				$stmt->bindValue(':uid', $control);
				$stmt->execute();
				$controls = $stmt->fetchAll();
				foreach($controls as $ctl){
					if($ctl['text']){
						$controlText[] = $ctl['text'];
					}
					if($ctl['uid'] == 11 || $ctl['uid'] == 12 || $ctl['uid'] == 14 || $ctl['uid'] == 15){
						$inactive = 'disabled';
					}else{
						$inactive = '';
					}

					if($ctl['uid'] == 3 || $ctl['uid'] == 4){
						$upDown = 'pfad';
					}elseif($ctl['uid'] == 5 || $ctl['uid'] == 6){
						$upDown = 'zoom';
					}elseif($ctl['uid'] == 7 || $ctl['uid'] == 8){
						$upDown = 'random';
					}else{
						$upDown = '';
					}
				}
			}	
		}

		if($page['list_type'] == "content_overlay"){
			$overlay = '
				<div class="overlay"></div>
			';
		}else if($page['list_type'] == "content_overlayBlack"){
			$overlay = '
				<div class="overlayBlack"></div>
			';
		}

		if($page['CType'] == "content_video_loop"){
			$video = '
				<video autoplay loop style="display:block;">
				  <source src="fileadmin/user_upload/video/'.$page['video'].'" type="video/mp4">
				Your browser does not support the video tag.
				</video>
			';

			$videoOverlay = '<div class="overlay_video_loop">'.$video.'</div>';
		}

		if($page['CType'] == "content_text" && $title == 'Kapitel 9'){
			
			
			if ($page['header']) {
				$h1 = '<h1>' . nl2br($page['header']) . '</h1>';
			}
			if ($page['subheader']) {
				$h2 = '<h2>' . nl2br($page['subheader']) . '</h2>';
			}
				
			if ($page['bodytext']) {
				$textContent .= '<div class="bodytext">' .$page['bodytext']. '</div>';
			}
		
			$js = '<script>
					jQuery(document).ready(function(){
						function bottom() {
							window.setTimeout(function(){
								$("#bottom").scrollIntoView(180000, "linear");
							}, 3000);
						};
						bottom();

						window.setTimeout(function(){
							$("#conten #inhalt .overlayBlack").css("opacity",1);
				                if($("#content #inhalt .overlayBlack").hasClass("thatsIt")){
				                    $("#content #inhalt .overlayBlack").removeClass("thatsIt");
				                }else{
				                    $("#content #inhalt .overlayBlack").addClass("thatsIt");
				                }
						}, 183000);
					});
				</script>';

			$contentText = $js.'<div class="text">'.$h1.$h2.$textContent.'</div>';
		}
		if($page['list_type'] == "content_path" && $page['pid'] == 10){
			$res = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*', 'tx_path','pid=:pid','','','');
			$res->bindValue(':pid', $page['pid']);
			$res->execute();
			$row = $res->fetch();
			
			$coordinates = explode(',',$row['position']);

			
			for($i=0; $i < count($coordinates); $i++){
				$sum[] = $coordinates[$i].','.$coordinates[$i+1];
				$i++;
			}

			for($j=0; $j<count($sum); $j++){
				if($j == 0){
					$m = $sum[0];
				}else{
					$q[] = 'Q'.$sum[$j].' '.$sum[$j+1];
					$j++;
				}
			}


			$pathComplete = '
				<div class="path" style="z-index:979;">
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

					  

					    <image id="image" x="10" y="10" width="628" height="628" xlink:href="fileadmin/user_upload/path/'.$row['image'].'" />

					    <image id="imageRed" x="30" y="10" width="628" height="628" style="display:none;" xlink:href="fileadmin/user_upload/path/'.$row['red_image'].'"/>

					    <image id="imageGreen" x="50" y="10" width="628" height="628" style="display:none;" xlink:href="fileadmin/user_upload/path/'.$row['blue_image'].'"/>
					     
					    <animateMotion begin="1s" path="M '.$m.implode('',$q).'Z" dur="5s" rotate="auto" repeatCount="indefinite" fill="freeze" xlink:href="#image" />

					    <animateMotion begin="1s" path="M '.$m.implode('',$q).'Z" dur="20s"  repeatCount="indefinite" fill="freeze" xlink:href="#imageRed" />

					    <animateMotion begin="1s" path="M '.$m.implode('',$q).'Z" dur="10s"  repeatCount="indefinite" fill="freeze" xlink:href="#imageGreen" />

					</svg>
				</div>';
		}

		if($image){
			$imageBorder = '
				<div class="scrollable-border" id="scrollable">
					<div class="items">
						'.implode('', $image).'
					</div>
				</div>
			';
		}else{
			$imageBorder = '';
		}

		if($page['image_order'] && ($page['pid'] != '12')){
			$collectionAll = '
				<div class="opacityScrollable" id="scrollable">
					<div class="items">
						'.implode('',$collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left opacity" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right opacity" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}elseif($title == 'Kapitel 9'){
			$collectionAll = '
				<div class="szene9Scrollable szene9" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left '.$inactive.'" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right '.$inactive.'" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}elseif($page['pid'] == '10'){
			$collectionAll = '
				<div class="opacityScrollable szene7" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left '.$inactive.'" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right '.$inactive.'" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}else{
			$collectionAll = '
				<div class="scrollable" id="scrollable">
					<div class="items">
						'.implode('',$collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left '.$inactive.'" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right '.$inactive.'" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}

		
	}
}		

	$content = $imageBorder.$sound.
		$classA.
		$collectionAll.'
		<div class="buttons">
			'.$but1.
			$but2.
			$but3.
			$but4.'
		</div>
		'.$wuerd.'
		<div class="controls">
			<div class="control top '.$upDown.' '.$inactive.'" '.($controlText[0] ? 'title="'.$controlText[0].'"' : '').' data-controlTop="'.$ascControl1.'"></div>
			<div class="control bottom '.$upDown.' '.$inactive.'" '.($controlText[3] ? 'title="'.$controlText[3].'"' : '').' data-controlBottom="'.$ascControl3.'"></div>
		</div>'
	;

	print($content.$pathComplete.$overlay.$videoOverlay.$contentText.$page_url);
	
	
	
