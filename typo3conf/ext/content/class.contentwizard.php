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
			'content_menu' => array(
				'icon'=>'gfx/c_wiz/sitemap.gif',
				'title'=>'Menü',
				'description'=>'Inhalts-Element Menüansicht aller Szenen',
//				'tt_content_defValues' => array(
//					'CType' => 'content_pi1',
//				),
				'params' => '&defVals[tt_content][list_type]=content_menu'
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
