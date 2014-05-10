<?php
if (!defined ('TYPO3_MODE')) die ('Access denied.');

$TCA["tx_accordion"] = Array (
	"ctrl" => $TCA["tx_accordion"]["ctrl"],
	"feInterface" => $TCA["tx_accordion"]["feInterface"],
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
				'foreign_table' => 'tx_accordion',
				'foreign_table_where' => 'AND tx_accordion.pid=###CURRENT_PID### AND tx_accordion.sys_language_uid IN (-1,0)',
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
		
		"video" => Array (
			"label" => "Video:",
			"config" => Array (
				"type" => "group",
				"internal_type" => "file",
				"allowed" => "*",
				"max_size" => 50000,
				"uploadfolder" => "fileadmin/user_upload/video",
				"show_thumbs" => 1,
				"size" => 1,
				"minitems" => 0,
				"maxitems" => 1,
			)
		),		
	),
	"types" => Array (
		"0" => Array("showitem" => "
			--div--;Accordion,title, video,
			")
	),
);

?>