<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$confArr = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['linkhandler']);


//add linkhandler for "record"
//require_once(t3lib_extMgm::extPath($_EXTKEY) . 'class.tx_linkhandler_handler.php');
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['tslib/class.tslib_content.php']['typolinkLinkHandler']['record'] = 'EXT:linkhandler/class.tx_linkhandler_handler.php:&tx_linkhandler_handler';

//register hook
//$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['ext/rtehtmlarea/mod3/class.tx_rtehtmlarea_browse_links.php']['browseLinksHook'][]='EXT:linkhandler/class.tx_linkhandler_browselinkshooks.php:tx_linkhandler_browselinkshooks';
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['typo3/class.browse_links.php']['browseLinksHook'][]='EXT:linkhandler/class.tx_linkhandler_browselinkshooks.php:tx_linkhandler_browselinkshooks';

/*
t3lib_extMgm::addPageTSConfig('
RTE.default.tx_linkhandler {
 record {
	 label=Datensätze
	 listTables=*
 }
}

mod.tx_linkhandler {
	record {
		label=Datensätze
		listTables=*
	}
}');*/

//edit by CR
	$TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['typo3/class.browse_links.php']=t3lib_extMgm::extPath($_EXTKEY) . 'class.ux_browse_links.php';
?>