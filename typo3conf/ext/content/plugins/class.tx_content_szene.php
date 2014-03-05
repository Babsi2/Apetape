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
				<audio autobuffer>
				  	<source src="fileadmin/user_upload/music/'.$this->cObj->data['sound'].'" type="audio/mpeg">
				</audio>';
		}

		if($this->cObj->data['images']){
			$imageCollection = explode(',', $this->cObj->data['images']);
			foreach($imageCollection as $j => $imgCol){
				$collection[] = '<div>'.$this->cObj->IMAGE(array(
				'file' => (basename($imgCol) == $imgCol ? 'fileadmin/user_upload/images/content/'.$imgCol : $imgCol),
				
				'altText' => $imgCol,
				'titleText' => $imgCol
			)).'</div>';
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
				}
			}
			
				//$controlText = $controls[0];
				
			//print_R($controlText);	
		}

		//print_R($controlText);
		$content = '
			<div class="scrollable-border" id="scrollable">
				<div class="items">
					'.implode('', $image).'
				</div>
			</div>
			'.$sound.'
			<a class="prev browse left" title="'.$controlText[1].'"></a>
			<a class="next browse right" title="'.$controlText[2].'"></a>
			<div class="scrollable" id="scrollable">
				<div class="items">
					'.implode('', $collection).'
				</div>
			</div>
			
			<div class="buttons">
				'.$but1.
				$but2.
				$but3.
				$but4.'
			</div>
			<div class="controls">
				<div class="control top" title="'.$controlText[0].'"></div>
				<div class="control bottom" title="'.$controlText[3].'"></div>
			</div>';

		return $content;
	}
	
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_szene.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/content/plugins/class.tx_content_szene.php']);
}
?>