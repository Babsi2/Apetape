<?php

/*
 * This procedure in eIDs is in most recent Projects pretty much the same, so maybe we could make it a standard?
 * it includes the storesessondata,flush,close,exit commands at the end.
 * the actual eID-script only has to define the allowed controller-classes (which should be registered in ext_autoload) like:
 
	 <?php
	if (!defined('PATH_typo3conf'))
		die('Could not access this script directly!');

	$controllers = array(
		'controllerclassone',
		'controllerclasstwo',
	);

	include(PATH_site . 'fileadmin/inc/ajax-script.php');
	?>
 *
 */


if (!defined('PATH_typo3conf'))
	die('Could not access this script directly!');
require_once(PATH_site . 'fileadmin/inc/ajax-construct.php');

$controller = t3lib_div::_GP('controller');
$action = t3lib_div::_GP('action');
$values = array_merge(t3lib_div::_GET(),t3lib_div::_POST());
$cType = t3lib_div::_GP('contentType');

if ($cType == '')
	$cType = 'json';

if (in_array(strtolower($controller), $controllers)) {
	
	$c = t3lib_div::makeInstance($controller);
	$data = call_user_func_array(array($c, $action), array($values) );


	if ($cType=='json') {
		header ('Content-Type: application/json;charset=UTF-8');
		echo json_encode($data);
	} elseif ($cType=='html') {
		header ('Content-Type: text/html;charset=UTF-8');
		echo $data;
	} elseif ($cType == 'javascript') {
		header ('Content-Type: text/javascript;charset=UTF-8');
		echo $data;
	} elseif($cType == 'debug') {
		echo '<pre>'.print_r($data,true).'</pre>';
	}
}

$GLOBALS['TSFE']->storeSessionData();

mysql_close();
flush();
ob_flush();
exit;

?>