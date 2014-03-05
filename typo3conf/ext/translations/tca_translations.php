<?php
if (!defined ('TYPO3_MODE')) die ('Access denied.');

$TCA["tx_translations"] = Array (
	"ctrl" => $TCA["tx_translations"]["ctrl"],
	"feInterface" => $TCA["tx_translations"]["feInterface"],
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
			'label'  => 'LLL:EXT:lang/locallang_general.xml:LGL.language',
			'config' => array (
				'type'                => 'select',
				'foreign_table'       => 'sys_language',
				'foreign_table_where' => 'ORDER BY sys_language.title',
				'items' => array(
					array('LLL:EXT:lang/locallang_general.xml:LGL.allLanguages', -1),
				)
			)
		),

		'l18n_parent' => array (
			'displayCond' => 'FIELD:sys_language_uid:>:0',
			'exclude'     => 1,
			'label'       => 'LLL:EXT:lang/locallang_general.xml:LGL.l18n_parent',
			'config'      => array (
				'type'  => 'select',
				'items' => array (
					array('', 0),
				),
				'foreign_table'       => 'tx_translations',
				'foreign_table_where' => 'AND tx_translations.pid=###CURRENT_PID### AND tx_translations.sys_language_uid IN (-1,0)',
			)
		),
		'l18n_diffsource' => array (
			'config' => array (
				'type' => 'passthrough'
			)
		),
		"id" => Array (
			"exclude" => 1,
			"l10n_display" => "defaultAsReadonly",
			"l10n_mode" => 'exclude',
			"label" => "Schlüssel",
				"config" => Array (
					"type" => "input",
					"size" => "30",
					"max" => '30',
					"eval" => "nospace,lower,required",
				)
		),

		"translation" => Array (
			"exclude" => 1,
			"label" => "Übersetzung",
				"config" => Array (
					"type" => "text",
					"cols" => "30",
					"rows" => "2",
				)
		),
	),
	"types" => Array (
		"0" => Array("showitem" => "id,sys_language_uid,l18n_parent,l18n_diffsource,translation")
	),
);
?>