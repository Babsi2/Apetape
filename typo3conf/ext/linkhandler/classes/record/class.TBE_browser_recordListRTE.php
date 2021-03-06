<?php
/***************************************************************
 *  Copyright notice
 *
 *  Copyright (c) 2008, Daniel P�tzinger <daniel.poetzinger@aoemedia.de>
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

if (!defined ('TYPO3_MODE'))
	die ('Access denied.');

/**
 * Class TBE_browser_recordListRTE extends TBE_browser_recordList
 * to return correct linkWraps for RTE link browser
 *
 * @author	Daniel Poetzinger (AOE media GmbH)
 * @version $Id: $
 * @date 08.04.2009 - 15:06:25
 * @package TYPO3
 * @subpackage tx_linkhandler
 * @access public
 */
class TBE_browser_recordListRTE extends TBE_browser_recordList {

	var $hookObj;
	var $addPassOnParams;

	/**
	 * set the parameters that should be added on the link, in order to keep the required vars for the linkwizard
	 */
	public function setAddPassOnParams($addPassOnParams) {
		$this->addPassOnParams=$addPassOnParams;
	}

	/**
	 * Returns the title (based on $code) of a record (from table $table) with the proper link around (that is for "pages"-records a link to the level of that record...)
	 *
	 * @param	string		Table name
	 * @param	integer		UID (not used here)
	 * @param	string		Title string
	 * @param	array		Records array (from table name)
	 * @return	string
	 */
	function linkWrapItems($table,$uid,$code,$row)	{
		global $TCA, $BACK_PATH;

		if (!$code) {
			$code = '<i>['.$GLOBALS['LANG']->sL('LLL:EXT:lang/locallang_core.php:labels.no_title',1).']</i>';
		} else {
			$code = htmlspecialchars(t3lib_div::fixed_lgd_cs($code,$this->fixedL));
		}


		if ($this->browselistObj->curUrlInfo['recordTable']==$table && $this->browselistObj->curUrlInfo['recordUid']==$uid)	{
			$curImg='<img'.t3lib_iconWorks::skinImg($BACK_PATH,'gfx/blinkarrow_right.gif','width="5" height="9"').' class="c-blinkArrowL" alt="" />';
		} else {
			$curImg='';
		}

		$title = t3lib_BEfunc::getRecordTitle($table,$row,FALSE,TRUE);
		$ficon = t3lib_iconWorks::getIcon($table,$row);

		if (@$this->browselistObj->mode=='rte') {
			//used in RTE mode:
			$aOnClick='return link_spec(\'record:'.$table.':'.$row['uid'].':\'+$(\'lhSelectedPage\').value);"';
			//$aOnClick = 'alert(\'record:'.$table.':'.$row['uid'].':\'+$(\'lhSelectedPage\').value)';
		}
		else {
			//used in wizard mode
			$aOnClick='return link_folder(\'record:'.$table.':'.$row['uid'].':\'+$(\'lhSelectedPage\').value);"';
			//$aOnClick = 'alert(\'record:'.$table.':'.$row['uid'].':\'+$(\'lhSelectedPage\').value)';
		}
		//$aOnClick = "return insertElement('".$table."', '".$row['uid']."', 'db', ".t3lib_div::quoteJSvalue($title).", '', '', '".$ficon."');";
		$ATag = '<a href="#" onclick="'.$aOnClick.'">';
		$ATag_e = '</a>';

		return
				$ATag.
				$code.$curImg.
				$ATag_e;
	}

	/**
	 * Returns additional, local GET parameters to include in the links of the record list.
	 *
	 * @return	string
	 */
	function ext_addP()	{

		$str = '&act='.$GLOBALS['SOBE']->browser->act.
				'&editorNo='.$this->browselistObj->editorNo.
				'&contentTypo3Language='.$this->browselistObj->contentTypo3Language.
				'&contentTypo3Charset='.$this->browselistObj->contentTypo3Charset.
				'&mode='.$GLOBALS['SOBE']->browser->mode.
				'&expandPage='.$GLOBALS['SOBE']->browser->expandPage.
				'&RTEtsConfigParams='.t3lib_div::_GP('RTEtsConfigParams').
				'&bparams='.rawurlencode($GLOBALS['SOBE']->browser->bparams).
				$this->addPassOnParams;
		return $str;
	}
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/linkhandler/classes/record/class.TBE_browser_recordListRTE.php']) {
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/linkhandler/classes/record/class.TBE_browser_recordListRTE.php']);
}

?>