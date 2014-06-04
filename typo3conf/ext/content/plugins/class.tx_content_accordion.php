<?php
use TYPO3\CMS\Frontend\Plugin\AbstractPlugin;

class tx_content_accordion extends AbstractPlugin {


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

		$stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_accordion','pid=:pid','','sorting DESC','');
		$stmt->bindValue(':pid', $this->cObj->data['pid']);
		$stmt->execute();
		$accordions = $stmt->fetchAll();
		
		$javascript = t3lib_div::wrapJS('
			$(document).ready(function(){
				loadInteractive();
			});

		');
		
		foreach ($accordions as $as) {
			if($as['text']){
				$sections[] = array(
					'title' => $as['title'],
					'text' => $as['text']
				);
			}else if($as['video']){
				$section[] = array(
					'title' => $as['title'],
					'video' => $as['video']
				);
			}else if($as['text'] == '' && $as['video'] == 0){
				$sections[] = array(
					'title' => $as['title'],
					'javascript' => $javascript
				);
			}
		}
		
		$content .= $this->view->renderAccordion($sections,'accordion-'.$this->cObj->data['uid']);
		
		

		return '<div class="accordionMenue">'.$content.'</div>';
	}
	
}

