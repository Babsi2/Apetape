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
			
			$image = $this->cObj->IMAGE(array(
				'file' => (basename($section['image']) == $section['image'] ? 'fileadmin/user_upload/images/content/'.$section['image'] : $section['image']),
				'file.' => array(
					'width' => '157c',
					'height' => '108c'
				),
				'altText' => $section['title'],
				'titleText' => $section['title']
			));
			
			if($section['content']){
				
				$header = '
					<h3 class="helvetica-roman">
						<div class="title">
							'.$section['title'].'
						</div>
					</h3>
				';
			}elseif(!$section['content']){
				
				$header = '
					<div class="hlvetica-roman no-text">
						<div class="title no-text">
							'.$section['title'].'
						</div>
					</div>';
			}
			
				
			if($image) {
				$accordionContent[] = $header.'
					<div class="section">
						<div class="text_image">
							'.$image.'
						</div>
						<div class="text_text">
							'.$this->renderText(array('bodytext' => $section['content'])).'
						</div>
						<div class="clear"></div>
					</div>
				';		
			}
			else if ($section['content'] == '') {
				$accordionContent[] = $header.'<div></div>';
			}
			
			else{
				$accordionContent[] = $header.'
				<div class="section">
					<div class="text_text no_image">
						'.$this->renderText(array('bodytext' => $section['content'])).'
					</div>
					<div class="clear"></div>
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
	
}

?>