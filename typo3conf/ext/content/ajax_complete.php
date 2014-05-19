<?php
if (!defined('PATH_typo3conf'))
	die('Could not access this script directly!');
require_once (PATH_site . 'fileadmin/inc/ajax-construct.php');

public function getVisuals(){
	print_r("funzt!");
	header("Location: localhost/apetape/index.php?id=6");
}
?>