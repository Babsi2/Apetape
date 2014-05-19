<?php
if (!defined ('TYPO3_MODE')) die ('Access denied.');

$TCA["tx_midi"] = Array (
	"ctrl" => $TCA["tx_midi"]["ctrl"],
	"feInterface" => $TCA["tx_midi"]["feInterface"],
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
				'foreign_table' => 'tx_midi',
				'foreign_table_where' => 'AND tx_midi.pid=###CURRENT_PID### AND tx_midi.sys_language_uid IN (-1,0)',
			)
		),

		'l18n_diffsource' => array (
			'config' => array (
				'type' => 'passthrough'
			)
		),

		"szene1" => Array (
			"exclude" => 1,
			"label" => "Szene 1: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene2" => Array (
			"exclude" => 1,
			"label" => "Szene 2: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene3" => Array (
			"exclude" => 1,
			"label" => "Szene 3: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene4" => Array (
			"exclude" => 1,
			"label" => "Szene 4: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene5" => Array (
			"exclude" => 1,
			"label" => "Szene 5: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene6" => Array (
			"exclude" => 1,
			"label" => "Szene 6: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene7" => Array (
			"exclude" => 1,
			"label" => "Szene 7: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene8" => Array (
			"exclude" => 1,
			"label" => "Szene 8: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),

		"szene9" => Array (
			"exclude" => 1,
			"label" => "Szene 9: ",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"eval" => "required",
			)
		),
	),
	"types" => Array (
		"0" => Array("showitem" => "szene1, szene2, szene3, szene4, szene5, szene6, szene7, szene8, szene9")
	),
);

?>