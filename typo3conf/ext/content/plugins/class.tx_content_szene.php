<?php
require_once(PATH_tslib.'class.tslib_pibase.php');

class tx_content_szene extends tslib_pibase {

		// Default extension plugin variables:
	var $prefixId = 'tx_content_szene'; // Same as class name
	var $scriptRelPath = 'plugins/class.tx_content_szene.php'; // Path to this script relative to the extension dir.
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
		

		if($this->cObj->data['border']){
			$border = explode(',', $this->cObj->data['border']);
			foreach($border as $i => $b){
				$image[] = '<div class="image" data-val="'.$i.'">'.$this->cObj->IMAGE(array(
				'file' => (basename($b) == $b ? 'fileadmin/user_upload/images/rahmen/'.$b : $b),
				
				'altText' => 'border',
				'titleText' => 'border'
			)).'</div>';
			}
			
		}

		if($this->cObj->data['sound']){
			$sound = '
				<audio id="player" src="fileadmin/user_upload/music/'.$this->cObj->data['sound'].'"></audio>
				<button style="position: absolute; z-index: 9999;" id="stop">Stop</button>';
		}

		if($this->cObj->data['images']){
			$imageCollection = explode(',', $this->cObj->data['images']);
			$j = 0;
			if($this->cObj->data['image_order'] && ($this->cObj->data['pid'] == '81')){
				$class = 'szene9';
			}elseif($this->cObj->data['image_order']){
				$class = 'imageOrder';
			}else{
				$class = '';
			}

			foreach($imageCollection as $imgCol){
				$collection[] = '
					<div class="opacity'.$j.' '.$class.'">
						<div>'
							.$this->cObj->IMAGE(array(
								'file' => (basename($imgCol) == $imgCol ? 'fileadmin/user_upload/images/content/'.$imgCol : $imgCol),
								
								'altText' => $imgCol,
								'titleText' => $imgCol,
								'params' => 'id="css-filter-blur" draggable="true"'
							)).'
						</div>
						<svg id="svg-image-blur">
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
						<style>
							#css-filter-blur { 
							  -webkit-transition: all 0.3s ease-out; 
							     -moz-transition: all 0.3s ease-out; 
							      -ms-transition: all 0.3s ease-out; 
							       -o-transition: all 0.3s ease-out; 
							          transition: all 0.3s ease-out;
							}
							#css-filter-blur.blured { -webkit-filter: blur(2px); filter: url(#blur-effect-1); }
							#css-filter-blur.sepia { -webkit-filter: sepia(100%); filter: url(#sepia);}
							#css-filter-blur.blau { -webkit-filter: hue-rotate(180deg); filter: url(#hue-rotate);}
				    	</style>
			    	</div>';

			    $j++;
			}
		}


		if($this->cObj->data['button_effect_one']){
			//print_r($this->cObj->data['button_effect_one']);
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_one']);
			$stmt->execute();
			$buttons1 = $stmt->fetchAll();
			
			foreach($buttons1 as $button1){
				$but1 = '<div class="button '.$button1['title'].'">'.$button1['title'].'</div>';
			}
		}

		if($this->cObj->data['button_effect_two']){
			//print_r($this->cObj->data['button_effect_two']);
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_two']);
			$stmt->execute();
			$buttons2 = $stmt->fetchAll();
			
			foreach($buttons2 as $button2){
				$but2 = '<div class="button '.$button2['title'].'">'.$button2['title'].'</div>';
			}
		}
 
 		if($this->cObj->data['button_effect_three']){
 			//print_r($this->cObj->data['button_effect_three']);
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_three']);
			$stmt->execute();
			$buttons3 = $stmt->fetchAll();
			
			foreach($buttons3 as $button3){
				$but3 = '<div class="button '.$button3['title'].'">'.$button3['title'].'</div>';
			}
		}

		if($this->cObj->data['button_effect_four']){
			//print_r($this->cObj->data['button_effect_four']);
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_four']);
			$stmt->execute();
			$buttons4 = $stmt->fetchAll();
			
			foreach($buttons4 as $button4){
				$but4 = '<div class="button '.$button4['title'].'">'.$button4['title'].'</div>';
			}
		}

		// var_dump($this->cObj->data);
		if($this->cObj->data['controls']){
		
			foreach(explode(',', $this->cObj->data['controls']) as $control){
				$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_controls','uid=:uid'.$this->cObj->enableFields('tx_controls'),'','','');
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
					// print_R($ctl['uid']);
					if($ctl['uid'] == 3 || $ctl['uid'] == 4){
						$upDown = 'path';
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

		if($this->cObj->data['image_order'] && ($this->cObj->data['pid'] != '81')){
			$collection = '
				<div class="opacityScrollable" id="scrollable">
					<div class="items">
						<div class="imageOrderLast opacity-1">
							<div>'
							.$this->cObj->IMAGE(array(
								'file' => 'fileadmin/images/rauchwolke-bg.png',
								
								'altText' => 'test',
								'titleText' => 'test',
							)).'
							</div>
						</div>
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left opacity" title="'.$controlText[1].'"></a>
				<a class="next browse right opacity" title="'.$controlText[2].'"></a>';
		}elseif($this->cObj->data['image_order'] && ($this->cObj->data['pid'] == '81')){
			$collection = '
				<div class="szene9Scrollable szene9" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left '.$inactive.'" title="'.$controlText[1].'"></a>
				<a class="next browse right '.$inactive.'" title="'.$controlText[2].'"></a>';
		}else{
			$collection = '
				<div class="scrollable" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left '.$inactive.'" title="'.$controlText[1].'"></a>
				<a class="next browse right '.$inactive.'" title="'.$controlText[2].'"></a>';
		}

		$content = '    
			<div class="scrollable-border" id="scrollable">
				<div class="items">
					'.implode('', $image).'
				</div>
			</div>
			'.$sound.
			$classA.
			$collection.'
			<div class="buttons">
				'.$but1.
				$but2.
				$but3.
				$but4.'
			</div>
			<div class="controls">
				<div class="control top '.$upDown.' '.$inactive.'" '.($controlText[0] ? 'title="'.$controlText[0].'"' : '').'></div>
				<div class="control bottom '.$upDown.' '.$inactive.'" '.($controlText[3] ? 'title="'.$controlText[3].'"' : '').'></div>
			</div>';

		return $content;
	}
	
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_szene.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_szene.php']);
}
?>