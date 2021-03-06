<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$TCA['tx_button'] = Array (

	'ctrl' => $TCA['tx_button']['ctrl'],
	'feInterface' => $TCA['tx_button']['feInterface'],
	'columns' => Array (

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
				'foreign_table'       => 'tx_button',
				'foreign_table_where' => 'AND tx_button.pid=###CURRENT_PID### AND tx_button.sys_language_uid IN (-1,0)',
			)
		),
			
		'l18n_diffsource' => array (
			'config' => array (
				'type' => 'passthrough'
			)
		),
	
		'hidden' => array (
			'exclude' => 1,
			'label'   => 'LLL:EXT:lang/locallang_general.xml:LGL.hidden',
			'config'  => array (
				'type'    => 'check',
				'default' => '0'
			)
		),
		
		'title' => Array (
			'exclude' => 1,
			'label' => 'Überschrift:',
			'config' => Array (
				'type' => 'input',
				'size' => 30,
				'eval' => 'unique',
			)
		),
	),
	'types' => Array (
		'0' => Array('showitem' => 'title'),
	),
);


?>