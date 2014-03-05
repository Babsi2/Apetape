<?php
if (!defined('PATH_typo3conf')) {
	die('Could not access this script directly!');
}

include PATH_site . 'typo3conf/localconf.php';
require_once (PATH_tslib . 'class.tslib_pibase.php');
require_once (PATH_tslib . 'class.tslib_fe.php');
require_once (PATH_t3lib . 'class.t3lib_page.php');
require_once (PATH_tslib . 'class.tslib_content.php');
require_once (PATH_t3lib . 'class.t3lib_stdgraphic.php');
require_once (PATH_tslib . 'class.tslib_gifbuilder.php');

session_start();

// setup db connection
tslib_eidtools::connectDB();

// create object instances
$type = t3lib_div::_GET('type') == '' ? 0 :  t3lib_div::_GET('type');
$id = t3lib_div::_GET('id') == '' ? 1 :  t3lib_div::_GET('id');

if (t3lib_div::compat_version('4.3')) {
	$TSFE = t3lib_div::makeInstance('tslib_fe', $TYPO3_CONF_VARS, $id, $type, true);
} else {
	$temp_TSFEclassName = t3lib_div::makeInstanceClassName('tslib_fe');
	$TSFE = new $temp_TSFEclassName($TYPO3_CONF_VARS, $id, $type, true);
}

// include templates
$TSFE->sys_page = t3lib_div::makeInstance('t3lib_pageSelect');
$TSFE->tmpl = t3lib_div::makeInstance('t3lib_tstemplate');
$TSFE->tmpl->init();

// include tca -> see index_ts.php
$TSFE->getCompressedTCarray();

// fetch rootline and extract ts setup
$TSFE->rootLine = $TSFE->sys_page->getRootLine(intval($id));
$TSFE->getConfigArray();

// $GLOBALS['TSFE'] initialisieren
$TSFE->connectToDB();
$TSFE->spamProtectEmailAddresses = 2;

// choose proper language
$TSFE->sys_page->sys_language_uid = $TSFE->type;

// initialise fe user
$TSFE->fe_user = tslib_eidtools::initFeUser();
$TSFE->fe_user->fetchGroupData();

setlocale(LC_ALL, $TSFE->tmpl->setup['seite.']['config.']['locale_all']);

require_once (PATH_site . 'fileadmin/inc/class.tx_FEFunctions.php');

/**
 * @var tslib_cObj
 */
$ajaxCobj = t3lib_div::makeInstance('tslib_cObj');
/**
 * @var Utils
 */
$ajaxUobj = Utils::getInstance($ajaxCobj);
$ajaxConf = $GLOBALS['TSFE']->config['config']['ajaxConf.'];
?>