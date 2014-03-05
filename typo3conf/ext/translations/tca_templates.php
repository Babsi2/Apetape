<?php
	
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$TCA['tx_templates'] = array (
	'ctrl' => $TCA['tx_templates']['ctrl'],
	'feInterface' => $TCA['tx_templates']['feInterface'],
	'columns' => array (
		'hidden' => array (
			'exclude' => 1,
			'label'   => 'LLL:EXT:lang/locallang_general.xml:LGL.hidden',
			'config'  => array (
				'type' => 'check'
			)
		),

		"id" => Array (
			"exclude" => 1,
			"l10n_display" => "defaultAsReadonly",
			"label" => "Schlüssel",
			"config" => Array (
				"type" => "input",
				"size" => "30",
				"max" => '30',
				"eval" => "nospace,lower,required",
			)
		),
		
		"subject" => Array (
			"exclude" => 1,
			"label" => "Betreff",
			"config" => Array (
				"type" => "input",
				"size" => "30",
			)
		),


		'template' => array (
			'exclude' => 1,
			'label'   => 'Vorlage',
			'config'  => array (
				'type' => 'text',
				'rows' => 5,
				'cols' => 48
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
			
		'type' => array (
			'label'  => 'Typ',
			'config' => array (
				'type'    => 'select',
				'items'   => array(
					array(utf8_encode('Text-Vorlage'), '0'),
					array(utf8_encode('HTML-Vorlage'), '1'),
					array(utf8_encode('E-Mail'), '2'),
				)
			)
		),
	),
	'types' => array (
		'0' => array('showitem' => 'id;;2,template'),
		'1' => array('showitem' => 'id;;2,template;;;richtext[]:rte_transform[mode=ts];,config'),
		'2' => array('showitem' => 'id;;2,subject,template'),
	),
	'palettes' => array (
		'2' => array('showitem' => 'type,sys_language'),
	)
);
	
?>