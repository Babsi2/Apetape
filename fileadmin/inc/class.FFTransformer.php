<?PHP
	/**
	 * Class for transforming flexform-xml into a config array
	 * $Id$
	 */
	class FFTransformer {
		
		/**
		 * Returns the transformed config array
		 * @param key flexform-xml
		 */
		public static function Transform(&$data, $sheet="sDEF", $lang="lDEF") {
			
			if ($data === "")
				return null;
			
			$data = t3lib_div::xml2array($data);
			
			if (!is_array($data))
				return null;
			
			foreach ($data['data'][$sheet][$lang] as $key => $value) {
				if ($value['vDEF'] != "")
					$result[$key] = $value['vDEF'];
			}
			
			$data = $result;
			
			return $result;
		}
	}

?>