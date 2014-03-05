<?php

	/***************************************************************
	*  Copyright notice
	*
	*  Copyright (c) 2008, Daniel P�tzinger <daniel.poetzinger@aoemedia.de>
	*  All rights reserved
	*
	*  This script is part of the TYPO3 project. The TYPO3 project is
	*  free software; you can redistribute it and/or modify
	*  it under the terms of the GNU General Public License as published by
	*  the Free Software Foundation; either version 2 of the License, or
	*  (at your option) any later version.
	*
	*  The GNU General Public License can be found at
	*  http://www.gnu.org/copyleft/gpl.html.
	*
	*  This script is distributed in the hope that it will be useful,
	*  but WITHOUT ANY WARRANTY; without even the implied warranty of
	*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	*  GNU General Public License for more details.
	*
	*  This copyright notice MUST APPEAR in all copies of the script!
	***************************************************************/

	if (!defined('TYPO3_MODE'))
		die('Access denied.');

	/**
	 * Linkhandler to process custom linking to any kind of configured record.
	 *
	 * @author	Daniel Poetzinger <daniel.poetzinger@aoemedia.de>
	 * @author	Michael Klapper <michael.klapper@aoemedia.de>
	 * @version $Id: $
	 * @date 08.04.2009 - 15:06:25
	 * @package TYPO3
	 * @subpackage tx_linkhandler
	 * @access public
	 */
	class tx_linkhandler_handler {

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
		function main($linktxt, $conf, $linkHandlerKeyword, $linkHandlerValue, $linkParams, &$pObj, $isFlash = false) {
			$linkConfigArray = $GLOBALS['TSFE']->tmpl->setup['plugin.']['tx_linkhandler.'];
			$generatedLink = '';
			$furtherLinkParams = str_replace('record:' . $linkHandlerValue, '', $linkParams); // extract link params like "target", "css-class" or "title"
			list($recordTableName, $recordUid, $page) = t3lib_div::trimExplode(':', $linkHandlerValue);

			if (file_exists(PATH_typo3conf . 'CoolUriConf.xml')) {
				$xml = new SimpleXMLElement(file_get_contents(PATH_typo3conf . 'CoolUriConf.xml'));
			}

			$parts = $xml->uriparts->part;
			foreach ($parts as $key => $data) {
				if ($data->isDefaultForTable == $recordTableName) {
					$linkParam = $data->parameter;
					break;
				}
			}

			$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*', $recordTableName, 'uid="' . $recordUid . '"', '', '', '');
			$recordRow = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);


//			if (!$page)
//				$page = $recordRow['pid'];

			if ($page)
				$linkConfigArray[$recordTableName . '.']['parameter'] = $page;
			$linkConfigArray[$recordTableName . '.']['additionalParams'] .= '&' . $linkParam . '=' . $recordUid . $conf['additionalParams'];
			$linkConfigArray[$recordTableName . '.']['useCacheHash'] = 1;

			if ((is_array($linkConfigArray) && array_key_exists($recordTableName . '.', $linkConfigArray)) // record type link configuration available
				&& ((is_array($recordRow) && !empty($recordRow)) // recored available
				|| ((int)$linkConfigArray[$recordTableName . '.']['forceLink'] === 1) // if the record are hidden ore someting else, force link generation
				)) {
				$localcObj = t3lib_div::makeInstance('tslib_cObj');
				$localcObj = clone $pObj;

				$localcObj->start($recordRow, '');
				$linkConfigArray[$recordTableName . '.']['parameter'] .= $furtherLinkParams;

				// build the full link to the record
				$generatedLink = $localcObj->typoLink($linktxt, $linkConfigArray[$recordTableName . '.']);
				$pObj->lastTypoLinkUrl = $localcObj->lastTypoLinkUrl;
				$pObj->lastTypoLinkTarget = $localcObj->lastTypoLinkTarget;
				$pObj->lastTypoLinkLD = $localcObj->lastTypoLinkLD;

			}
			else {
				$generatedLink = $linktxt;
			}
			return $generatedLink;
		}
	}

	if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/linkhandler/class.tx_linkhandler_handler.php']) {
		include_once ($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/linkhandler/class.tx_linkhandler_handler.php']);
	}

?>