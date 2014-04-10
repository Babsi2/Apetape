<?php
class tx_content {

	/**
	 * Clear cache post processor.
	 * The same structure as t3lib_TCEmain::clear_cache
	 *
	 * @param	object		$_params: parameter array
	 * @param	object		$pObj: partent object
	 * @return	void
	 */
	// function clearCachePostProc(&$params, &$pObj) {
	// 	// force refresh minified files (CSS / JS)
	// 	touch(PATH_site.'fileadmin/min/');
	// }
}

class user_parseLinkReturnLink {

	/**
	 * Process the link generation
	 *
	 * @param string $linktxt
	 * @param array $conf
	 * @param string $linkHandlerKeyword Define the identifier that an record is given
	 * @param string $linkHandlerValue Table and uid of the requested record like "tt_news:2"
	 * @param string $linkParams Full link params like "record:tt_news:2"
	 * @param tslib_cObj $pObj
	 * @return string
	 */
	function main($linktxt, $conf, $linkHandlerKeyword, $linkHandlerValue, $linkParams, &$pObj) {
		return '<a href="'.$linkParams.'">'.$linktxt.'</a>';
	}
}
?>