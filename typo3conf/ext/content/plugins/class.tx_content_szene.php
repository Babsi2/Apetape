<?php
use TYPO3\CMS\Frontend\Plugin\AbstractPlugin;

class tx_content_szene extends AbstractPlugin {


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

		if($this->cObj->data['border']){
			$border = explode(',', $this->cObj->data['border']);
			foreach($border as $i => $b){
				$image[] = '<div class="image" data-val="'.$i.'">'.$this->cObj->IMAGE(array(
				'file' => (basename($b) == $b ? 'fileadmin/user_upload/images/rahmen/'.$b : $b),
				
				'altText' => 'border',
			)).'</div>';
			}
			
		}

		if($this->cObj->data['sound']){
			$sounds = explode(',', $this->cObj->data['sound']);

			$sound = '
				<audio autoplay id="player" >
				  <source src="fileadmin/user_upload/music/'.$sounds[0].'" type="audio/mpeg">
				  <source src="fileadmin/user_upload/music/'.$sounds[1].'" type="audio/ogg">
				 				Your browser does not support the audio element.
				</audio>';
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


		if($this->cObj->data['button_effect_one']){
			//print_r($this->cObj->data['button_effect_one']);
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_one']);
			$stmt->execute();
			$buttons1 = $stmt->fetchAll();
			
			foreach($buttons1 as $button1){
				$but1 = '<div class="button-1 button '.$button1['title'].'" data-button1 = "'.$ascButton1.'">'.$button1['title'].'</div>';
			}
		}

		if($this->cObj->data['button_effect_two']){
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_two']);
			$stmt->execute();
			$buttons2 = $stmt->fetchAll();
			
			foreach($buttons2 as $button2){
				$but2 = '<div class="button-2 button '.$button2['title'].'" data-button2 = "'.$ascButton2.'">'.$button2['title'].'</div>';
			}
		}
 
 		if($this->cObj->data['button_effect_three']){
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_three']);
			$stmt->execute();
			$buttons3 = $stmt->fetchAll();
			
			foreach($buttons3 as $button3){
				$but3 = '<div class="button-3 button '.$button3['title'].'" data-button3 = "'.$ascButton3.'">'.$button3['title'].'</div>';
			}
		}

		if($this->cObj->data['button_effect_four']){
			$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_button','uid=:uid'.$this->cObj->enableFields('tx_button'),'','sorting ASC','');
			$stmt->bindValue(':uid', $this->cObj->data['button_effect_four']);
			$stmt->execute();
			$buttons4 = $stmt->fetchAll();
			
			foreach($buttons4 as $button4){
				$but4 = '<div class="button-4 button '.$button4['title'].'" data-button4 = "'.$ascButton4.'">'.$button4['title'].'</div>';
			}
		}

		if($this->cObj->data['wuerd']){
			$wuerd = '
				<div class="wuerdButton">
					<div class="button-5 button wuerd" data-button5 = "'.$ascButton5.'">Würd</div>
				</div>
			';
		}
		
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

		if($this->cObj->data['image_order'] && ($this->cObj->data['pid'] != '12') && ($this->cObj->data['pid'] != '10')){
			$collection = '
				<div class="opacityScrollable" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left opacity" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right opacity" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}elseif($this->cObj->data['image_order'] && ($this->cObj->data['pid'] == '12')){
			$collection = '
				<div class="szene9Scrollable szene9" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left '.$inactive.'" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right '.$inactive.'" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}elseif($this->cObj->data['pid'] == '10'){
			$collection = '
				<div class="opacityScrollable szene7" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left opacity" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right opacity" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}else{
			$collection = '
				<div class="scrollable" id="scrollable">
					<div class="items">
						'.implode('', $collection).'
					</div>
				</div>';
			$classA = '
				<a class="prev browse left '.$inactive.'" title="'.$controlText[1].'" data-controlLeft = "'.$ascControl2.'"></a>
				<a class="next browse right '.$inactive.'" title="'.$controlText[2].'" data-controlRight = "'.$ascControl4.'"></a>';
		}

		$content = $imageBorder.$sound.
			$classA.
			$collection.'
			<div class="buttons">
				'.$but1.
				$but2.
				$but3.
				$but4.'
			</div>
			'.$wuerd.'
			<div class="controls">
				<div class="control top '.$upDown.' '.$inactive.'" '.($controlText[0] ? 'title="'.$controlText[0].'"' : '').' data-controlTop="'.$ascControl1.'""></div>
				<div class="control bottom '.$upDown.' '.$inactive.'" '.($controlText[3] ? 'title="'.$controlText[3].'"' : '').' data-controlBottom="'.$ascControl3.'"></div>
			</div>';

		return $content;
	}
	
}
