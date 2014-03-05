<?php
if (!defined ('PATH_typo3conf'))
	die ('Could not access this script directly!');

if (file_exists(PATH_site.'fileadmin/user_upload/downloads/'.basename($_GET['file']))) {
	header("Cache-Control: no-cache, must-revalidate");
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
	header('Content-Type: application/octet-stream');
	if (file_exists(PATH_site.'fileadmin/user_upload/downloads/'.basename($_GET['file']))) {
		$fullpath = PATH_site.'fileadmin/user_upload/downloads/'.basename($_GET['file']);
	}

	header('Content-Disposition: attachment; filename="'.basename($_GET['file']).'"');
	header("Content-Length: ".filesize($fullpath));

	readfile($fullpath);
}
?>