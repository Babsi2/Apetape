<?php
if (!defined ('TYPO3_MODE')) {
	die ('Access denied.');
}

// Background Element
t3lib_extMgm::addPItoST43($_EXTKEY,'plugins/class.tx_content_background.php','_background','CType',1);

// Normal Content Element with Header, Subheader, Bodytext
t3lib_extMgm::addPItoST43($_EXTKEY,'plugins/class.tx_content_szene.php','_szene','CType',1);

// Menu on first page
t3lib_extMgm::addPItoST43($_EXTKEY,'plugins/class.tx_content_menu.php','_menu','list_type',1);

// Overlay
t3lib_extMgm::addPItoST43($_EXTKEY,'plugins/class.tx_content_overlay.php','_overlay','list_type',1);

/// Ausgabe
t3lib_extMgm::addPItoST43($_EXTKEY,'plugins/class.tx_content_path.php','_path','list_type',1);


// clear cache
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['clearCachePostProc'][] = 'EXT:content/class.content.php:&tx_content->clearCachePostProc';
// custom link parser for tel
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['tslib/class.tslib_content.php']['typolinkLinkHandler']['tel'] = 'EXT:content/class.content.php:&user_parseLinkReturnLink';
// custom link parser for sms
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['tslib/class.tslib_content.php']['typolinkLinkHandler']['sms'] = 'EXT:content/class.content.php:&user_parseLinkReturnLink';

$TYPO3_CONF_VARS['FE']['eID_include']['download'] = 'EXT:content/download.php';
?>