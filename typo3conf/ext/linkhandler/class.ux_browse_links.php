<?php

class ux_browse_links extends browse_links {


        protected function areFieldChangeFunctionsValid($handleFlexformSections = FALSE) {
		$result = FALSE;

		if (isset($this->P['fieldChangeFunc']) && is_array($this->P['fieldChangeFunc']) && isset($this->P['fieldChangeFuncHash'])) {
			$matches = array();
			$pattern = '#\[el\]\[(([^]-]+-[^]-]+-)(idx\d+-)([^]]+))\]#i';

			$fieldChangeFunctions = $this->P['fieldChangeFunc'];

				// Special handling of flexform sections:
				// Field change functions are modified in JavaScript, thus the hash is always invalid
			if ($handleFlexformSections && preg_match($pattern, $this->P['itemName'], $matches)) {
				$originalName = $matches[1];
				$cleanedName = $matches[2] . $matches[4];

				foreach ($fieldChangeFunctions as &$value) {
					$value = str_replace($originalName, $cleanedName, $value);
				}
			}

			$result = ($this->P['fieldChangeFuncHash'] === t3lib_div::hmac(serialize($fieldChangeFunctions)));
		}
		
        //edit by CR
        if($_GET['act']=='record'){
            $result = 1;
        }
		return $result;
	}	
	

}


if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/linkhandler/patch/class.ux_browse_links.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/linkhandler/patch/class.ux_browse_links.php']);
}
?>