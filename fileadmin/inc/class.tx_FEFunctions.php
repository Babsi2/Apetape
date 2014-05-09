<?PHP
require_once(PATH_site . 'fileadmin/inc/class.Utils.php');
// require_once(PATH_site . 'fileadmin/inc/class.Translations.php');
require_once(PATH_site . 'fileadmin/inc/class.Table.php');
require_once(PATH_site . 'fileadmin/inc/class.View.php');

class tx_FEFunctions implements t3lib_Singleton {

	/**
	 * @var Utils 
	 */
	protected $uObj;

	/**
	 * holds the Pagetitle
	 * @var array
	 */
	protected static $cache;

	public function __construct() {
		$this->uObj = Utils::GetInstance();
		$this->view = new View($GLOBALS['TSFE']->config['config']['fefuncConf.'], $this->uObj);
	}

	public function getContentNavi() {
		// TODO merge
//		$render = Render::getInstance();
		return $this->view->getContentNavi();
	}

	public function getPageTitle($paramArray=false, $uid=false, $nobase=false) {
		if (!is_array($paramArray))
			$paramArray = t3lib_div::_GET();
		if (!$uid)
			$uid = $GLOBALS['TSFE']->id;

		if (self::$cache['pageTitle'][$uid][serialize($paramArray)])
			return self::$cache['pageTitle'][$uid][serialize($paramArray)];

		if ($GLOBALS['TSFE']->page["subtitle"] && $GLOBALS['TSFE']->page["uid"] == 1) {
			$content = $GLOBALS['TSFE']->page["title"] . " - " . $GLOBALS['TSFE']->page["subtitle"];
		} else {
			$rootline = $GLOBALS["TSFE"]->sys_page->getRootline($uid);
			foreach ($rootline as $value) {
				$page = $GLOBALS["TSFE"]->sys_page->getPage($value['uid']);

				if ($value['doktype'] == 254 || $page['tx_cooluri_exclude']) {
					continue;
				} else {
					if ($page['title'])
						$titles[] = $page['title'];
				}
			}

			if( $nobase )
			{	
				$key = end( array_keys($titles) );
				if( $key !== 0 ) 
				{
					unset( $titles[ $key ] );
				}
			}

			$content = @implode(' - ', $titles);
		}

		$extraParams = array();

		foreach ($extraParams as $column) {
			$table = $column['table'];

			if ($paramArray[$column['parameter']]) {
				if ($column['noType'])
					$langId = 0;
				elseif (isset($paramArray['L']))
					$langId = $paramArray['L'];
				elseif (isset($GLOBALS['TSFE']->config['config']['forceTranslation']))
					$langId = $GLOBALS['TSFE']->config['config']['forceTranslation'];
				else
					$langId = $GLOBALS['TSFE']->type;

				$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery($column['column'], $table, '(uid="' . intval($paramArray[$column['parameter']]) . '" OR l18n_parent="' . intval($paramArray[$column['parameter']]) . '") AND sys_language_uid in (-1, ' . $langId . ')'.$this->uObj->cObj->enableFields($table), '', '', '');
				$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
				if ($row[$column['column']]) {
					$content = $row[$column['column']] . " - " . $content;
				}
			}
		}
  
		$content = strip_tags($content);
		
		self::$cache['pageTitle'][$uid][serialize($paramArray)] = $content;

		return $content;
	}

	// public function getCopyright() {
	// 	return strftime(Translations::Fetch('copyright'));
	// }	
	
	
	public function getLogo($content, $conf, $pathOnly = false) {
		$type = $GLOBALS['TSFE']->type ? $GLOBALS['TSFE']->type : 0;

		if (isset($_GET['L'])) {
			$type = $_GET['L'];
		}

		$img['file'] = 'fileadmin/images/logo.png';
		$img['altText'] = $this->getpageTitle(array(), 1);
		$img['titleText'] = $img['altText'];
		
		if($conf['file']) $img['file'] = 'fileadmin/images/'.$conf['file'];
		
		if ($pathOnly){
			return $img['file'];
		}
	
		$link = $this->cObj->getTypoLink_URL(1,$type);
		$logo = '<a href="' . $link . '" ><img src="' . $img['file'] . '" alt="'.$img['altText'].'" title="'.$img['titleText'].'" /></a>';

		if($content) $logo = '<li class="logo" >'.$logo.'</li>';
		
		return $content.$logo;
	}
	
}

/**
 * Generates the page title, just forwarding to tx_FEFunctions::getPageTitle (needed for indexed_search)
 * user_getpageTitle()
 * 
 * @param mixed $paramArray
 * @param int $uid
 * @param boolean $nobase
 * @return string
 * 
 * @see tx_FEFunctions::getpageTitle
 */
function user_getpageTitle($paramArray=false, $uid=false, $nobase=false) {
	$fe = t3lib_div::makeInstance('tx_FEFunctions');
	return $fe->getpageTitle($paramArray, $uid, $nobase);
}

?>