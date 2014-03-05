<?PHP
	/**
	 * Class for retrieving from tx_templates
	 * uses an internal cache to avoid duplicate MySQL queries
	 * $Id$
	 */
	class Templates {
		protected static $cache = array();
		
		/**
		 * Returns a translation entry for the given key and language and optionally trims it
		 * @key key user-defined key for
		 * @type type optionally language to primary search for
		 * @trim trim optionally trim the result
		 */
		public static function Fetch($key, $type=0) {

			if (!$type && $GLOBALS['TSFE']->type)
				$type = $GLOBALS['TSFE']->type;
			if ($type==98)
				$type = $_GET['L'];
			
			if (!self::$cache[$key.$type]) {
				$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_templates','id="'.$key.'" AND sys_language_uid IN (-1,0) AND hidden=0 AND deleted=0','','sys_language_uid DESC','');
                $row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
				if ($GLOBALS['TSFE'])
					$row = $GLOBALS['TSFE']->sys_page->getRecordOverlay("tx_templates", $row, $type, 'hideNonTranslated');
				else{
					if($type != 0){
						$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_templates','l18n_parent="'.$row['uid'].'" AND sys_language_uid IN (-1,'.$type.') AND hidden=0 AND deleted=0','','sys_language_uid DESC','');
						$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
					}
				}
				self::$cache[$key.$type] = $row;
			}
			else{
				$row = self::$cache[$key.$type];
			} 

			if ($row['type'] == 2) return array('subject' => $row['subject'],'text' => $row['template']);
			else return $row['template'];
		}
	}

?>