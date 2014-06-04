<?php
require_once(PATH_site.'typo3/interfaces/interface.cms_newcontentelementwizarditemshook.php');
class user_contentWizard implements cms_newContentElementWizardsHook{
	function manipulateWizardItems(&$wizardItems, &$parentObject) {
		
//		debug($wizardItems);
		
		$wizardItems = array(
			'content' => array("header"=>"Inhaltselemente"),
			'content_szene' => array(
				'icon'=>'gfx/c_wiz/regular_text.gif',
				'title'=>'Szene',
				'description'=>'Inhalts-Element mit Audio, Bilder und controls',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][CType]=content_szene'
			),
			'content_path' => array(
				'icon'=>'gfx/c_wiz/sitemap.gif',
				'title'=>'Pfad',
				'description'=>'Inhalts-Element Pfad',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][list_type]=content_path'
			),
			'content_overlay' => array(
				'icon'=>'gfx/c_wiz/div.gif',
				'title'=>'Overlay',
				'description'=>'Inhalts-Element Overlay',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][list_type]=content_overlay'
			),
			'content_overlayBlack' => array(
				'icon'=>'gfx/c_wiz/div.gif',
				'title'=>'Overlay Schwarz',
				'description'=>'Inhalts-Element Overlay Schwarz',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][list_type]=content_overlayBlack'
			),
			'content_accordion' => array(
				'icon'=>'gfx/c_wiz/bullet_list.gif',
				'title'=>'Akkordion',
				'description'=>'Inhalts-Element Akkordion',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][CType]=content_accordion'
			),
			'content_text' => array(
				'icon'=>'gfx/c_wiz/regular_text.gif',
				'title'=>'Textelement',
				'description'=>'Inhalts-Element Text',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][CType]=content_text'
			),
			'content_video_loop' => array(
				'icon'=>'gfx/c_wiz/div.gif',
				'title'=>'Video Overlay',
				'description'=>'Inhalts-Element Video Overlay',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][CType]=content_video_loop'
			),
			'content_settings' => array(
				'icon'=>'gfx/c_wiz/table.gif',
				'title'=>'Einstellungen',
				'description'=>'Inhalts-Element Einstellungen',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][CType]=content_settings'
			),
			'plugins_1' => array(
			'icon'=>'gfx/c_wiz/user_defined.gif',
			'title'=>'Allgemeines Plug-In',
			'description'=>'Wählen Sie diesen Elementtyp, um ein Plug-In einzufügen, das nicht bei den Optionen oben aufgeführt ist.',
			'tt_content_defValues' => array(
				'CType' => 'list',
			),
			'params' => '&defVals[tt_content][CType]=list'
		),
			
		);

		return;
	}
}
?>
