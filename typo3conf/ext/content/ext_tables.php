<?php

require_once(PATH_site.'fileadmin/inc/class.tx_BEFunctions.php');

$temp = Array (
	'menu_item' => array(
		'exclude' => 1,
		'label' => 'Menüicon',
		'config' => Array(
			'type' => 'group',
			'internal_type' => 'file',
			'allowed' => $GLOBALS["TYPO3_CONF_VARS"]["GFX"]["imagefile_ext"],
			'max_size' => 500000,
			'uploadfolder' => 'fileadmin/user_upload/images/menu_items',
			'size' => 1,
			'maxitems' => 1,
			'show_thumbs' => '1'
		)
	),
);
 

t3lib_div::loadTCA("pages");
t3lib_extMgm::addTCAcolumns("pages",$temp,1);
t3lib_extMgm::addToAllTCAtypes("pages","--div--;Navigation,menu_item");

$temp = Array (
	'border' => array(
		'exclude' => 1,
		'label' => 'Rahmen',
		'config' => Array(
			'type' => 'group',
			'internal_type' => 'file',
			'allowed' => $GLOBALS["TYPO3_CONF_VARS"]["GFX"]["imagefile_ext"],
			'max_size' => 5000000,
			'uploadfolder' => 'fileadmin/user_upload/images/rahmen',
			'size' => 6,
			'maxitems' => 10,
			'show_thumbs' => '4'
		)
	),
	
	'images' => array(
		'exclude' => 1,
		'label' => 'Bilder',
		'config' => Array(
			'type' => 'group',
			'internal_type' => 'file',
			'allowed' => $GLOBALS["TYPO3_CONF_VARS"]["GFX"]["imagefile_ext"],
			'max_size' => 500000,
			'uploadfolder' => 'fileadmin/user_upload/images/content',
			'size' => 6,
			'maxitems' => 100,
			'show_thumbs' => '6'
		)
	),

	'image_order' => array(
		'exclude' => 1,
		'label' => 'Bilder hintereinander anordnen',
		'config' => Array(
			'type' => 'check',
			'default' => 0
		)
	),

	'image' => array(
		'exclude' => 1,
		'label' => 'Background Menü',
		'config' => Array(
			'type' => 'group',
			'internal_type' => 'file',
			'allowed' => $GLOBALS["TYPO3_CONF_VARS"]["GFX"]["imagefile_ext"],
			'max_size' => 500000,
			'uploadfolder' => 'fileadmin/user_upload/images/content',
			'size' => 1,
			'maxitems' => 1,
			'show_thumbs' => '1'
		)
	),

	'sound' => array(
		'exclude' => 1,
		'label' => 'Musik',
		'config' => Array(
			'type' => 'group',
			'internal_type' => 'file',

			'allowed' => 'MP3',
			'max_size' => 500000,
			'uploadfolder' => 'fileadmin/user_upload/music',
			'size' => 1,
			'minitems' => 1,
			'maxitems' => 1,
		),
	),
	
	'img_title' => array(
		'label' => 'Bildtitel (Alt-Tag)',
		'config' => array(
        'type' => 'text',
        'cols' => '40',
        'rows' => '100',
		'eval' => 'required'
		)
	),

	'linklist' => array(
		'label' => 'Menü Links (Szene 1 bis n, in jeder Zeile ein Link)',
		'config' => array(
        'type' => 'text',
        'cols' => '40',
        'rows' => '100',
		'eval' => 'required'
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
	
	'link' => Array (
		'exclude' => 1,
		'label' => 'Link',
		'config' => Array (
			'type' => 'input',
			'size' => '50',
			'max' => '255',
			'checkbox' => '',
			'eval' => 'trim',
			'wizards' => Array(
				'_PADDING' => 2,
				'link' => Array(
					'type' => 'popup',
					'title' => 'Link',
					'icon' => 'link_popup.gif',
					'script' => 'browse_links.php?mode=wizard',
					'JSopenParams' => 'height=600,width=500,status=0,menubar=0,scrollbars=1'
				)
			)
		)
	),
	
	'button_effect_one' => Array(
		'label' => 'Button Effect eins',
		'config' => Array(
			'type' => 'select',
			'foreign_table' => 'tx_button',
			'maxitems' => 1,
			'minitems' => 0,
		)
	),

	'button_effect_two' => Array(
		'label' => 'Button Effect zwei',
		'config' => Array(
			'type' => 'select',
			'foreign_table' => 'tx_button',
			'maxitems' => 1,
			'minitems' => 0
		)
	),

	'button_effect_three' => Array(
		'label' => 'Button Effect drei',
		'config' => Array(
			'type' => 'select',
			'foreign_table' => 'tx_button',
			'maxitems' => 1,
			'minitems' => 0
		)
	),

	'button_effect_four' => Array(
		'label' => 'Button Effect vier',
		'config' => Array(
			'type' => 'select',
			'foreign_table' => 'tx_button',
			'maxitems' => 1,
			'minitems' => 0
		)
	),

	'wuerd' => array(
		'exclude' => 1,
		'label' => 'Würd Button',
		'config' => Array(
			'type' => 'check',
			'default' => 0
		)
	),

	'controls' => array(
   		'exclude' => 1,
   		'label' => 'Control Effects (folgende Reihenfolge: oben, links, rechts, untent)',
   		'config' => array(
           	'type' => 'select',
           	'size' => 4,
           	'maxitems' => 4,
            'foreign_table' => 'tx_controls',
            'foreign_table_where' => 'ORDER BY tx_controls.title',
   ),

   	"image_path" => Array (
		"label" => "Hintergrund für Pfad:",
		"config" => Array (
			"type" => "group",
			"internal_type" => "file",
			"allowed" => "*",
			"max_size" => 50000,
			"uploadfolder" => "fileadmin/user_upload/images",
			"show_thumbs" => 1,
			"size" => 1,
			"minitems" => 0,
			"maxitems" => 1,
		)
	),
	'position_image' => Array (
		'exclude' => 1,
		'label' => 'Position:',
		'config' => Array (
			'type' => 'user',
			'userFunc' => 'tx_BEFunctions-> user_pathPosition'
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


	
);


t3lib_div::loadTCA("tt_content");
t3lib_extMgm::addTCAcolumns("tt_content", $temp, 1);


$temp = Array (
	'template' => Array(
		'exclude' => 1,
		'label' => 'Template',
		'config' => Array(
			"type" => "select",
			'suppress_icons' => 1,
			'items' => Array(
				array('', 0),
			),
			"fileFolder" => "fileadmin/templates/",
		)
	),
);


t3lib_div::loadTCA("backend_layout");
t3lib_extMgm::addTCAcolumns("backend_layout",$temp,1);
t3lib_extMgm::addToAllTCAtypes("backend_layout",'template');

$TCA['tt_content']['columns']['header']['config']['type'] = 'text';
$TCA['tt_content']['columns']['header']['config']['rows'] = '1';
$TCA['tt_content']['columns']['header']['config']['cols'] = '30';

$TCA['fe_users']['columns']['password']['config']['eval'] = 'nospace,required,md5,password';

#############################################################################################################
# body background
$TCA['tt_content']['types'][$_EXTKEY.'_background']['showitem']='CType;;14;,header,image';
t3lib_extMgm::addPlugin(Array('Backgroundelement', $_EXTKEY.'_background'),'CType');

# Text Element
$TCA['tt_content']['types'][$_EXTKEY.'_szene']['showitem']='CType;;14;,header,border, images, image_order, sound, button_effect_one, button_effect_two, button_effect_three, button_effect_four, wuerd, controls';
t3lib_extMgm::addPlugin(Array('Szenenelement', $_EXTKEY.'_szene'),'CType');

# Accordion
$TCA['tt_content']['types']['list']['subtypes_excludelist'][$_EXTKEY.'_accordion']='';
$TCA['tt_content']['types']['list']['subtypes_addlist'][$_EXTKEY.'_accordion']='';
t3lib_extMgm::addPlugin(Array('Akkordion', $_EXTKEY.'_accordion'),'list_type');

#Overlay element
$TCA['tt_content']['types']['list']['subtypes_excludelist'][$_EXTKEY.'_overlay']='';
$TCA['tt_content']['types']['list']['subtypes_addlist'][$_EXTKEY.'_overlay']='';
t3lib_extMgm::addPlugin(Array('Overlay', $_EXTKEY.'_overlay'),'list_type');

# body background
$TCA['tt_content']['types'][$_EXTKEY.'_background']['showitem']='CType;;14;,header,image';
t3lib_extMgm::addPlugin(Array('Backgroundelement', $_EXTKEY.'_background'),'CType');

$TCA['tt_content']['types']['list']['subtypes_excludelist'][$_EXTKEY.'_path']='layout,select_key';
$TCA['tt_content']['types']['list']['subtypes_addlist'][$_EXTKEY.'_path']='tree';
t3lib_extMgm::addPlugin(Array('Pfad: Ausgabe', $_EXTKEY.'_path'),'list_type');

# body settings
$TCA['tt_content']['types'][$_EXTKEY.'_settings']['showitem']='CType;;14;,header,bodytext,config';
t3lib_extMgm::addPlugin(Array('Tastenbelegung', $_EXTKEY.'_settings'),'CType');

# video loop
$TCA['tt_content']['types'][$_EXTKEY.'_video_loop']['showitem']='CType;;14;,video';
t3lib_extMgm::addPlugin(Array('Overlay Video Loop', $_EXTKEY.'_video_loop'),'CType');

#############################################################################################################

t3lib_extMgm::allowTableOnStandardPages("tx_button");
t3lib_extMgm::addToInsertRecords("tx_button");

$TCA["tx_button"] = Array (
	"ctrl" => Array (
		'title' => 'Datensatz: Button',
		'label' => 'title',
		'tstamp' => 'tstamp',
		'crdate' => 'crdate',
		'cruser_id' => 'cruser_id',
		'sortby' => 'sorting',
		'dividers2tabs' => 1,
		'type' => 'record_type',
		'delete' => 'deleted',
		'languageField' => 'sys_language_uid',
		'transOrigPointerField' => 'l10n_parent',
		'transOrigDiffSourceField' => 'l10n_diffsource',
		"enablecolumns" => Array (
			"disabled" => "hidden",
			"starttime" => "starttime",
			"endtime" => "endtime",
		),
		'searchFields' => 'title,bodytext',
		"dynamicConfigFile" => t3lib_extMgm::extPath($_EXTKEY)."tca/tca_button.php",
		"iconfile" => t3lib_extMgm::extRelPath($_EXTKEY)."tca/button.png",
	),
);

#############################################################################################################

t3lib_extMgm::allowTableOnStandardPages("tx_controls");
t3lib_extMgm::addToInsertRecords("tx_controls");

$TCA["tx_controls"] = Array (
	"ctrl" => Array (
		'title' => 'Datensatz: Controls',
		'label' => 'title',
		'tstamp' => 'tstamp',
		'crdate' => 'crdate',
		'cruser_id' => 'cruser_id',
		'sortby' => 'sorting',
		'dividers2tabs' => 1,
		'type' => 'record_type',
		'delete' => 'deleted',
		'languageField' => 'sys_language_uid',
		'transOrigPointerField' => 'l10n_parent',
		'transOrigDiffSourceField' => 'l10n_diffsource',
		"enablecolumns" => Array (
			"disabled" => "hidden",
			"starttime" => "starttime",
			"endtime" => "endtime",
		),
		'searchFields' => 'title,bodytext',
		"dynamicConfigFile" => t3lib_extMgm::extPath($_EXTKEY)."tca/tca_controls.php",
		"iconfile" => t3lib_extMgm::extRelPath($_EXTKEY)."tca/move.gif",
	),
);

#############################################################################################################

t3lib_extMgm::allowTableOnStandardPages("tx_path");
t3lib_extMgm::addToInsertRecords("tx_path");

	$TCA["tx_path"] = Array (
		"ctrl" => Array (
			'title' => 'Datensatz: Pfad',
			'label' => 'title',
			'tstamp' => 'tstamp',
			'crdate' => 'crdate',
			'cruser_id' => 'cruser_id',
			"sortby" => "sorting",
			"delete" => "deleted",
			"dividers2tabs" => "1",
			'languageField' => 'sys_language_uid',
		  	'transOrigPointerField' => 'l18n_parent',
		  	'transOrigDiffSourceField' => 'l18n_diffsource',
			"enablecolumns" => Array (
				"disabled" => "hidden",
				"starttime" => "starttime",
				"endtime" => "endtime",
			),
			"dynamicConfigFile" => t3lib_extMgm::extPath($_EXTKEY)."tca/tca_path.php",
			"iconfile" => t3lib_extMgm::extRelPath($_EXTKEY)."tca/tx_path.png",
		),
	);

#############################################################################################################

t3lib_extMgm::allowTableOnStandardPages("tx_accordion");
t3lib_extMgm::addToInsertRecords("tx_accordion");

	$TCA["tx_accordion"] = Array (
		"ctrl" => Array (
			'title' => 'Datensatz: Akkordion',
			'label' => 'title',
			'tstamp' => 'tstamp',
			'crdate' => 'crdate',
			'cruser_id' => 'cruser_id',
			"sortby" => "sorting",
			"delete" => "deleted",
			"dividers2tabs" => "1",
			'type' => 'record_type',
			'languageField' => 'sys_language_uid',
		  	'transOrigPointerField' => 'l18n_parent',
		  	'transOrigDiffSourceField' => 'l18n_diffsource',
			"enablecolumns" => Array (
				"disabled" => "hidden",
				"starttime" => "starttime",
				"endtime" => "endtime",
			),
			"dynamicConfigFile" => t3lib_extMgm::extPath($_EXTKEY)."tca/tca_accordion.php",
			"iconfile" => t3lib_extMgm::extRelPath($_EXTKEY)."tca/tx_accordion.png",
		),
	);

#############################################################################################################

require_once(t3lib_extMgm::extPath($_EXTKEY).'class.contentwizard.php');
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['cms']['db_new_content_el']['wizardItemsHook'][] = 'user_contentWizard';
?>