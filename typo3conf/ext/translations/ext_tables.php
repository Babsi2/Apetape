<?php
if (!defined ('TYPO3_MODE')) die ('Access denied.');

#############################################################################################################

$TCA["tx_translations"] = Array (
	"ctrl" => Array (
		'title' => 'Datensatz - Übersetzung',
		'label' => 'translation',
		'tstamp' => 'tstamp',
		'crdate' => 'crdate',
		'cruser_id' => 'cruser_id',
		"sortby" => "sorting",
		"delete" => "deleted",
		"languageField" => "sys_language_uid",
		"transOrigPointerField" => "l18n_parent",
		"enablecolumns" => Array (
			"disabled" => "hidden",
		),
		'searchFields' => 'id,translation',
		"dynamicConfigFile" => t3lib_extMgm::extPath($_EXTKEY)."tca_translations.php",
		"iconfile" => t3lib_extMgm::extRelPath($_EXTKEY)."tx_translations.gif",
	),
);


t3lib_extMgm::allowTableOnStandardPages('tx_templates');
t3lib_extMgm::addToInsertRecords('tx_templates');


$TCA['tx_templates'] = Array (
	'ctrl' => Array (
		'title' => 'Datensatz - Vorlage',
		'label' => 'id',
		'label_alt' => 'type',
		'label_alt_force' => true,
		'tstamp' => 'tstamp',
		'crdate' => 'crdate',
		'cruser_id' => 'cruser_id',
		'delete' => 'deleted',
		'default_sortby' => 'id',
		'dividers2tabs' => 2,
		'type' => 'type',
		'languageField' => 'sys_language_uid',
		"transOrigPointerField" => "l18n_parent",
		'enablecolumns' => Array (
			'disabled' => 'hidden',
		),
		'searchFields' => 'id,template,subject',
		'dynamicConfigFile' => t3lib_extMgm::extPath($_EXTKEY).'tca_templates.php',
		'iconfile' => t3lib_extMgm::extRelPath($_EXTKEY).'tx_templates.gif',
	),
);


#############################################################################################################
?>