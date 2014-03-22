<?php
if (!defined ('TYPO3_MODE')) die ('Access denied.');
require_once(PATH_site.'fileadmin/inc/class.tx_BEFunctions.php');

$TCA["tx_path"] = Array (
	"ctrl" => $TCA["tx_path"]["ctrl"],
	"feInterface" => $TCA["tx_path"]["feInterface"],
	"columns" => Array (
		"hidden" => Array (
			"exclude" => 1,
			"label" => "LLL:EXT:lang/locallang_general.xml:LGL.hidden",
			"config" => Array (
				"type" => "check",
				"default" => "0"
			)
		),

    	'sys_language_uid' => array (
			'exclude' => 1,
			'label' => 'LLL:EXT:lang/locallang_general.xml:LGL.language',
			'config' => array (
				'type' => 'select',
				'foreign_table' => 'sys_language',
				'foreign_table_where' => 'ORDER BY sys_language.title',
				'items' => array(
					array('LLL:EXT:lang/locallang_general.xml:LGL.allLanguages', -1),
				)
			)
		),

		'l18n_parent' => array (
			'displayCond' => 'FIELD:sys_language_uid:>:0',
			'exclude' => 1,
			'label' => 'LLL:EXT:lang/locallang_general.xml:LGL.l18n_parent',
			'config' => array (
				'type' => 'select',
				'items' => array (
					array('', 0),
				),
				'foreign_table' => 'tx_path',
				'foreign_table_where' => 'AND tx_path.pid=###CURRENT_PID### AND tx_path.sys_language_uid IN (-1,0)',
			)
		),

		'l18n_diffsource' => array (
			'config' => array (
				'type' => 'passthrough'
			)
		),

		"title" => Array (
			"exclude" => 1,
			"label" => "Name: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),
		
		"image" => Array (
			"label" => "Bild für Pfad:",
			"config" => Array (
				"type" => "group",
				"internal_type" => "file",
				"allowed" => "*",
				"max_size" => 50000,
				"uploadfolder" => "fileadmin/user_upload/path",
				"show_thumbs" => 1,
				"size" => 1,
				"minitems" => 0,
				"maxitems" => 1,
			)
		),
		
		// "image_detail" => Array (
		// 	"label" => "Bild für Detailseite:",
		// 	"config" => Array (
		// 		"type" => "group",
		// 		"internal_type" => "file",
		// 		"allowed" => "*",
		// 		"max_size" => 50000,
		// 		"uploadfolder" => "fileadmin/user_upload/path",
		// 		"show_thumbs" => 1,
		// 		"size" => 1,
		// 		"minitems" => 0,
		// 		"maxitems" => 1,
		// 	)
		// ),
		'position_image' => Array (
			'exclude' => 1,
			'label' => 'Position:',
			'config' => Array (
				'type' => 'user',
				'userFunc' => 'tx_BEFunctions->user_pathPosition'
			)
		),
		'position' => array(
			'exclude' => 1,
			'label' => 'Koordinaten: ',
			'config' => array(
				'type' => 'text',
			)
		),
	),
	"types" => Array (
		"0" => Array("showitem" => "
			--div--;Übersicht,title, image;;;;1-1-1,position_image,position,
			")
	),
);

?>