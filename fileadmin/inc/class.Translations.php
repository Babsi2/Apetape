<?PHP
	/**
	 * Class for retrieving from tx_translations
	 * uses an internal cache to avoid duplicate MySQL queries
	 * $Id$
	 */
	class Translations{
		protected static $cache = array();
		
		/**
		 * Returns a translation entry for the given key and language and optionally trims it
		 * @key key user-defined key for
		 * @type type optionally language to primary search for
		 * @trim trim optionally trim the result
		 */
		public static function Fetch($key, $type=0, $trim=true) {

			if (!$type)
				$type = $GLOBALS['TSFE']->type;
			if ($type==98)
				$type = $_GET['L'];
			
            if ($GLOBALS['TSFE']->config['config']['forceTranslation']) 
                $type = $GLOBALS['TSFE']->config['config']['forceTranslation'];
			
			if (!self::$cache[$key.$type]) {
				$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_translations','id="'. mysql_real_escape_string($key).'" AND sys_language_uid IN (-1,0,'. $type.') AND hidden=0 AND deleted=0','','sys_language_uid DESC','');
				$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
				if ($type > 0) $row = $GLOBALS['TSFE']->sys_page->getRecordOverlay('tx_translations', $row, $type, 'hideNonTranslated');
                
				if ($row == null)
					$row = array('translation' => 'TRANSLATE: ' . $key);				
				self::$cache[$key.$type] = $row;
			}
			else{
				$row = self::$cache[$key.$type];
			} 
			$string = $row['translation'];

			return $trim ? trim($string) : $string;
		}
	}

?>