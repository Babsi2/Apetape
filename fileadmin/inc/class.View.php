<?PHP

/**
 * Class for common rendering and layout functions
 */
class View extends pBase {

	protected $conf;

	/** @var Utils */
	protected $uObj;

	/** @var tslib_cObj */
	protected $cObj;

	/**
	 * 
	 */
	public function __construct($conf=false, $uObj=false) {
		$this->uObj = Utils::GetInstance($cObj);
		$this->cObj = $this->uObj->cObj;
		$this->conf = $conf;
	}
	
	/**
	 * Prepares Text for output (e.g. replaces Wiberg with WIBERG) and applies stdWrap
	 * 
	 * @param type $text
	 * @return type
	 */
	public function prepareText($text) {
		return $this->cObj->stdWrap($text, $this->conf['general_stdWrap.']);
	}
	
	/**
	 * Renders Text with header, subheader and bodytext. 
	 *
	 * @param array $data
	 * 		header -> title
	 * 		subheader -> subtitle
	 * 		bodytext -> bodytext prepareText is applied
	 * 
	 * @return string
	 */
	public function renderText($data) {

		if ($data['header']) {
			$h1 = '<h1 class="trade-gothic">' . nl2br($data['header']) . '</h1>';
		}
		if ($data['subheader']) {
			$h2 = '<h2>' . nl2br($data['subheader']) . '</h2>';
		}
			
		if ($data['bodytext']) {
			$textContent .= '<div class="text">' . $this->prepareText($data['bodytext']) . '</div>';
		}
		
		return <<< HTML
{$h1}
{$h2}
{$textContent}
HTML;
	}
	
	public function renderAccordion($sections, $name) {
	
	
		foreach ($sections as $key => $section) {
			// print_R($section);
			if($section['video']){
				$video = '
					<video width="960" height="720" controls>
					  <source src="/apetape/fileadmin/user_upload/video/'.$section['video'].'" type="video/mp4">
					Your browser does not support the video tag.
					</video>
				';
			}

			if($section['title']){
				
				$header = '
					<h3 class="section-'.$key.'">
						'.$section['title'].'
					</h3>
				';
			}
			// var_dump($video);
				
			if($section['video'] && $section['title']) {
				$accordionContent[] = $header.'
					<div class="section-'.$key.'">
						<div class="video">
							'.$video.'
						</div>
						<div class="text_text">
							'.$this->renderText(array('bodytext' => $section['content'])).'
						</div>
						<div class="clear"></div>
					</div>
				';		
				
			}
			else{

				$accordionContent[] = $header.'
				<div class="section-'.$key.'">
					<span class="waiting"></span>
					<div class="text">
						'.$section['text'].'
					</div>
				</div>
				';	
				
			}
						
				
		}
			
		$content = '
				<div id="'.$name.'" class="accordion"  >
					'.implode("", $accordionContent).'
				</div>
		';
		
		return $content;
	}
	
	public function renderHeader($headers, $name) {
	
		foreach ($headers as $key => $header) {
						
				$sliderContent[] = '<div>'.$this->renderText(array('bodytext' => $header['content'])).'</div>';	
			}
			
		if(count($headers)>1){
			$scrollable = '
				<div class="scrollable" id="scrollable">
					<div class="items">
						  '.implode("", $sliderContent).'
					</div>
				</div>';
		}else{
			$scrollable = '
				<div class="no-scrollable" id="scrollable">
					<div class="items">
						  '.implode("", $sliderContent).'
					</div>
				</div>';
		}
		$content = '
				<div id="'.$name.'">
					<div class="scroll">
						'.$scrollable.'
					</div>
				</div>
		';
		
		return $content;
	}

	public function getContentNavi() {
		// print_R("hallo");
		$uObj = Utils::GetInstance();
		// $pid = $this->projectPIDs['page_root'];
		$test = array();
		$i = 0;
		$sideIndex = 0;
		$test[] = $GLOBALS['TSFE']->sys_page->getMenu(1);
		
		if ($test) {
			$subNaviAttribute .= ' data-sub-navi="'.($i + 1).'" ';

			$subMenu = '';
			foreach ($test[0] as $subNaviItemData) {
				// print_R($subNaviItemData);
				if ($subNaviItemData['nav_hide'] === 1) {
					continue;
				}
				
				$language = $subNaviItemData['_PAGES_OVERLAY_LANGUAGE'] ? $subNaviItemData['_PAGES_OVERLAY_LANGUAGE'] : 0;
				$subNaviItemURL = $this->cObj->getTypoLink_URL($subNaviItemData['uid'],$language);
				
				if($subNaviItemData['nav_hide'] == 0){
					$subMenu .= '
							<a href="'.$subNaviItemURL.'" class="sub accordion-entry '.$subNaviItemClasss.'">
								<span class="accordion-bar">
									<span class="title">'.$subNaviItemData['title'].'</span>
								</span>
							</a>
						';
				}	
			}

			if ($subMenu && $GLOBALS['TSFE']->id != 1) {
				$mainMenu .= '
						<div class="accordion-sub-content">
							'.$subMenu.'
						</div>
					';
				
			}
		}

		if($GLOBALS['TSFE']->id != 1){
			$page = 'pageActive';
		}

		$mainMenu .= '</div>';

		$html = '
				<div class="accordion-menu '.$page.'">
					'.$mainMenu.'
				</div>
			';

		return $javascript.$html;
	}
	
}

?>