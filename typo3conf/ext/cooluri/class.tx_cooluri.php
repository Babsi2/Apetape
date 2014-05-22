<?php
/***************************************************************
 *  Copyright notice
 *
 *  (c) 2010 Jan Bednarik <info@bednarik.org>
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

require_once 'cooluri/link.Main.php';

class tx_cooluri {

    private static $pObj = null;

    /**
     * returns singleton instance
     * instance is stored in the session for non-logged users
     * this is because of developement, users that are logged in BE could be
     * editing the conf file, so they need to see the changes immediately
     */
    public function getTranslateInstance() {
        if (!empty($_SESSION['coolUriTransformerInstance']) && !empty($_SESSION['coolUriTransformerInstance']->conf) && !self::isBEUserLoggedIn()) {
            return $_SESSION['coolUriTransformerInstance'];
        }

        $this->confArray = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['cooluri']);
        if (file_exists($this->confArray['XMLPATH'].'CoolUriConf.xml'))
        $lt = Link_Translate::getInstance($this->confArray['XMLPATH'].'CoolUriConf.xml');
        elseif (file_exists(PATH_typo3conf.'CoolUriConf.xml'))
        $lt = Link_Translate::getInstance(PATH_typo3conf.'CoolUriConf.xml');
        elseif (file_exists(dirname(__FILE__).'/cooluri/CoolUriConf.xml'))
        $lt = Link_Translate::getInstance(dirname(__FILE__).'/cooluri/CoolUriConf.xml');
        else return false;

        if (!self::isBEUserLoggedIn()) {
            $_SESSION['coolUriTransformerInstance'] = @clone($lt);
        }
        return $lt;
    }

    public function cool2params($params, $ref) {

        self::$pObj = &$ref;

        if (!empty($params['pObj']->siteScript)) {
            $cond = $params['pObj']->siteScript && substr($params['pObj']->siteScript,0,9)!='index.php' && substr($params['pObj']->siteScript,0,1)!='?';
            $paramsinurl = '/'.$params['pObj']->siteScript;
            t3lib_div::devLog('SITESCRIPT: '.$paramsinurl,'CoolUri');
        } else {
            $cond = t3lib_div::getIndpEnv('REQUEST_URI') && substr(t3lib_div::getIndpEnv('REQUEST_URI'),1,9)!='index.php' && substr(t3lib_div::getIndpEnv('REQUEST_URI'),1,1)!='?';
            $paramsinurl = t3lib_div::getIndpEnv('REQUEST_URI');
            t3lib_div::devLog('REQUEST_URI: '.$paramsinurl,'CoolUri');
        }

        // check if the only param is the same as the TYPO3 site root
        if ($paramsinurl == substr(PATH_site, strlen(preg_replace('~/$~', '', $_SERVER['DOCUMENT_ROOT'])))) return;

        if ($cond)	{

            $lt = $this->getTranslateInstance();

            if (!$lt) return;

            if ($this->confArray['MULTIDOMAIN']) {
                t3lib_div::devLog('MultiDomain on','CoolUri');
                if (empty(Link_Translate::$conf->cache->prefix)) {
                    $domain = $_SERVER['SERVER_NAME'];
                    $res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','sys_domain','domainName=\''.$domain.'\' AND redirectTo<>\'\' AND hidden=0');
                    $row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
                    if ($row) {
                        $url = $row['redirectTo'].substr($paramsinurl,1);
                        if (empty($row['tx_jbstatuscode_code'])) {
                            Header('Location: '.t3lib_div::locationHeaderUrl($url));
                        } else {
                            Header('Location: '.t3lib_div::locationHeaderUrl($url),true,$row['tx_jbstatuscode_code']);
                        }
                        exit;
                    }
                    $this->simplexml_addChild(Link_Translate::$conf->cache,'prefix',$domain.'@');
                    t3lib_div::devLog('DOMAIN: '.$domain,'CoolUri');
                } else {
                    Link_Translate::$conf->cache->prefix = $_SERVER['SERVER_NAME'].'@';
                    t3lib_div::devLog('DOMAIN 2: '.$_SERVER['SERVER_NAME'],'CoolUri');
                }
            }

            $pars = $lt->cool2params($paramsinurl);


            $params['pObj']->id = $pars['id'];
            unset($pars['id']);
            $npars = $this->extractArraysFromParams($pars);
            t3lib_div::stripSlashesOnArray($npars);
            $params['pObj']->mergingWithGetVars($npars);

            // Re-create QUERY_STRING from Get vars for use with typoLink()
            $_SERVER['QUERY_STRING'] = $this->decodeSpURL_createQueryString($pars);
            t3lib_div::devLog('Resolved QS: '.$_SERVER['QUERY_STRING'],'CoolUri');
        }
    }

    /**
     * Generates a parameter string from an array recursively (function from RealUrl)
     *
     * @param	array		Array to generate strings from
     * @param	string		path to prepend to every parameter
     * @return	array		Array with parameter strings
     */
    private function decodeSpURL_createQueryStringParam($paramArr, $prependString = '') {
        if (!is_array($paramArr)) {
            return array($prependString . '=' . $paramArr);
        }

        if (count($paramArr) == 0) {
            return array();
        }

        $paramList = array();
        foreach ($paramArr as $var => $value) {
            $paramList = array_merge($paramList, $this->decodeSpURL_createQueryStringParam($value, $prependString . '[' . $var . ']'));
        }

        return $paramList;
    }
     
    /**
     * Re-creates QUERY_STRING for use with typoLink() (function from RealUrl)
     *
     * @param	array		List of Get vars
     * @return	string		QUERY_STRING value
     */
    private function decodeSpURL_createQueryString(&$getVars) {
        if (!is_array($getVars) || count($getVars) == 0) {
            return $_SERVER['QUERY_STRING'];
        }

        $parameters = array();
        foreach ($getVars as $var => $value) {
            $parameters = array_merge($parameters, $this->decodeSpURL_createQueryStringParam($value, $var));
        }

        $queryString = t3lib_div::getIndpEnv('QUERY_STRING');
        if ($queryString) {
            array_push($parameters, $queryString);
        }

        return implode('&', $parameters);
    }
     

    private function getShortcutpage($page) {
        $limit = 5;
        while (!empty($page['shortcut_mode']) && $page['shortcut_mode']==1 && $page['doktype']==4 && $limit>0) {
            if(!$GLOBALS['TSFE']->cObj){
                #print_r('Cooluri is scheisse!');
                $GLOBALS['TSFE']->cObj = t3lib_div::makeInstance('tslib_cObj');
            }
            $res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','pages','pid='.(int)$page['uid'].$GLOBALS['TSFE']->cObj->enableFields('pages'),'','sorting','1');
            $tmp = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
            if ($tmp) $page = $tmp;
            --$limit;
        }
        return $page;
    }

    private function simplexml_addChild($parent, $name, $value=''){
        $new_child = new SimpleXMLElement("<$name>$value</$name>");
        $node1 = dom_import_simplexml($parent);
        $dom_sxe = dom_import_simplexml($new_child);
        $node2 = $node1->ownerDocument->importNode($dom_sxe, true);
        $node1->appendChild($node2);
        return simplexml_import_dom($node2);
    }

    public function params2cool(&$params, $ref) {

        if (empty($GLOBALS['TSFE']->config['config']['tx_cooluri_enable']) || !$GLOBALS['TSFE']->config['config']['tx_cooluri_enable']) {
            return;
        }

        if (!empty($params['args']['page']['shortcut']) && $params['args']['page']['doktype']==4) {
            $shortcut = $params['args']['page']['shortcut'];
            $limit = 5;
            while (!empty($shortcut) && $limit>0) {
                $page = $GLOBALS['TSFE']->sys_page->getPage($shortcut);
                if (!$page) break;
                $shortcut = $page['shortcut'];
                $params['args']['page'] = $page;
                --$limit;
            }
        } elseif (!empty($params['args']['page']['shortcut_mode']) && $params['args']['page']['shortcut_mode']==1 && $params['args']['page']['doktype']==4) {
            $page = $this->getShortcutpage($params['args']['page']);
            $params['args']['page'] = $page;
        }

        if ($params['args']['page']['doktype']==3) {
            switch ($params['args']['page']['urltype']) {
                case 1: $url = 'http://'; break;
                case 4: $url = 'https://'; break;
                case 2: $url = 'ftp://'; break;
                case 3: $url = 'mailto:'; break;
            }
            $params['LD']['totalURL'] = $url.$params['args']['page']['url'];
            return;
        }

  if (!strstr($params['LD']['totalURL'],"type=")) $params['LD']['totalURL'].= "&type=0";
  
        $tu = explode('?',$params['LD']['totalURL']);

        t3lib_div::devLog('PARAMS URL: '.$params['LD']['totalURL'],'CoolUri');

        if (isset($tu[1])) {
            $anch = explode('#',$tu[1]);
            $pars = Link_Func::convertQuerystringToArray($tu[1]);

            $pars['id'] = $params['args']['page']['uid'];

            $lt = $this->getTranslateInstance();
            if (!$lt) return;

            if ($this->confArray['MULTIDOMAIN']) {
                t3lib_div::devLog('MultiDomain on','CoolUri');
                if (!empty($params['LD']['domain'])) {
                    $domain = $params['LD']['domain'];
                } else {
                    $domain = $this->getDomain((int)$pars['id']);
                }
                t3lib_div::devLog('Domain: '.$domain,'CoolUri');
                if (empty(Link_Translate::$conf->cache->prefix)) {
                    $this->simplexml_addChild(Link_Translate::$conf->cache,'prefix',$domain.'@');
                } else {
                    Link_Translate::$conf->cache->prefix = $domain.'@';
                }
            }
            
            $params['LD']['totalURL'] = $lt->params2cool($pars,'',false).(!empty($anch[1])?'#'.$anch[1]:'');

            t3lib_div::devLog('Found URL: '.$params['LD']['totalURL'],'CoolUri');

            if ($this->confArray['MULTIDOMAIN']) {
                $params['LD']['totalURL'] = explode('@',$params['LD']['totalURL']);
                $beforeat = $params['LD']['totalURL'][0];
                unset($params['LD']['totalURL'][0]);
                $afterat = implode('@',$params['LD']['totalURL']);
                if ($beforeat==$_SERVER['SERVER_NAME'])
                $params['LD']['totalURL'] = $afterat;
                else
                $params['LD']['totalURL'] = 'http://'.$beforeat.'/'.$afterat;
            }
        }
    }

    public function getDomain($id) {
        t3lib_div::devLog('Getting domain','CoolUri');
        if ($GLOBALS['TSFE']->showHiddenPage || self::isBEUserLoggedIn()) {
            $enable = ' AND pages.deleted=0';
            $enable2 = ' AND deleted=0';
        } else {
            $enable = ' AND pages.deleted=0 AND pages.hidden=0';
            $enable2 = ' AND deleted=0 AND hidden=0';
        }
        $db = &$GLOBALS['TYPO3_DB'];
        $max = 10;
        while ($max>0 && $id) {
             
            t3lib_div::devLog('Looking for domain on page '.$id,'CoolUri');

            $q = $db->exec_SELECTquery('pages.title, pages.pid, pages.is_siteroot, pages.uid AS id, sys_domain.domainName, sys_domain.redirectTo','pages LEFT JOIN sys_domain ON pages.uid=sys_domain.pid','pages.uid='.$id.$enable.' AND (sys_domain.hidden=0 OR sys_domain.hidden IS NULL)','','sys_domain.sorting');
            $page = $db->sql_fetch_assoc($q);

            $temp = $db->exec_SELECTquery('COUNT(*) as num','sys_template','pid='.$id.' AND root=1'.$enable2);
            $count = $db->sql_fetch_assoc($temp);

            if ($page['domainName'] && !$page['redirectTo']) {
                t3lib_div::devLog('Resolved domain: '.$page['domainName'],'CoolUri');
                return preg_replace('~^.*://(.*)/?$~','\\1',preg_replace('~/$~','',$page['domainName']));
            }

            if ($count['num']>0 || $page['is_siteroot']==1) {
                t3lib_div::devLog('Domain missing for ID '.$id.', using SERVER_NAME '.$_SERVER['SERVER_NAME'],'CoolUri');
                return $_SERVER['SERVER_NAME'];
            }


            $id = $page['pid'];
            --$max;
        }
        t3lib_div::devLog('Domain not found, using SERVER_NAME '.$_SERVER['SERVER_NAME'],'CoolUri');
        return $_SERVER['SERVER_NAME'];
    }

    public function goForRedirect($params, $ref) {
        if (empty($_GET['ADMCMD_prev']) && $GLOBALS['TSFE']->config['config']['tx_cooluri_enable']==1 && $GLOBALS['TSFE']->config['config']['redirectOldLinksToNew']==1 && t3lib_div::getIndpEnv('REQUEST_URI') && (substr(t3lib_div::getIndpEnv('REQUEST_URI'),1,9)=='index.php' || substr(t3lib_div::getIndpEnv('REQUEST_URI'),1,1)=='?')) {
            $ourl = t3lib_div::getIndpEnv('REQUEST_URI');
            $ss = explode('?',$ourl);
            if ($ss[1]) $pars = Link_Func::convertQuerystringToArray($ss[1]);

            $pageid = $pars['id'];
            if (!is_numeric($pageid)) {
                $pageid = $GLOBALS['TYPO3_DB']->fullQuoteStr($pageid,'pages');
                $q = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','pages','alias='.$pageid);
                $page = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($q);
                $pars['id'] = (int)$page['uid'];
            } else {
                $q = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','pages','uid='.(int)$pageid);
                $page = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($q);
                $pars['id'] = (int)$page['uid'];
            }
            // if a page is hidden, there won't be any redirect, because it would
            // redirect to the root
            if (!$page || $page['hidden']==1 || $page['deleted']==1) {
                return;
            }

            $params = Array();

            if ($pars) {
                $lt = $this->getTranslateInstance();

                if (!$lt) return;

                if ($this->confArray['MULTIDOMAIN']) {
                    if (empty(Link_Translate::$conf->cache->prefix)) {
                        $this->simplexml_addChild(Link_Translate::$conf->cache,'prefix',$this->getDomain((int)$pars['id']).'@');
                    } else {
                        Link_Translate::$conf->cache->prefix = $this->getDomain((int)$pars['id']).'@';
                    }
                }

                $url = $lt->params2coolForRedirect($pars);

                $parts = explode('?',$url);
                if (empty($parts[0])) return;

                if ($this->confArray['MULTIDOMAIN']) {
                    $url = explode('@',$url);
                    $url = 'http://'.$url[0].'/'.$url[1];
                }

                Link_Func::redirect($url);
            }
        }
    }

    public function getPageTitleBE($conf,$value) {
        if ($GLOBALS['TSFE']->showHiddenPage || self::isBEUserLoggedIn()) {
            $enable = ' AND deleted=0';
        } else {
            $enable = ' AND deleted=0 AND hidden=0';
        }
        $db = &$GLOBALS['TYPO3_DB'];

        if (empty($conf->alias)) $sel = (string)$conf->title;
        else $sel = (string)$conf->alias;

        $id = (int)$value[(string)$conf->saveto];

        $confArray = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['cooluri']);
        $langVar = $confArray['LANGID'];
  
  $value[$langVar] = $value['type']; 
  if ($value['type'] == 98) $value[$langVar] = $value['L']; 

        $langId = empty($value[$langVar])?false:$value[$langVar];
        $langId = (int)$langId;

        $pagepath = Array();

        if (empty($conf->alias)) $sel = (string)$conf->title;
        else $sel = (string)$conf->alias;
        $sel = t3lib_div::trimExplode(',',$sel);

        $max = 15;

        while ($max>0 && $id) {
            if (!is_numeric($id)){
                $id =  $GLOBALS['TSFE']->sys_page->getPageIdFromAlias($id);
            }
            $q = $db->exec_SELECTquery('*','pages','uid='.$id.$enable);
            $page = $db->sql_fetch_assoc($q);

            $temp = $db->exec_SELECTquery('COUNT(*) as num','sys_template','pid='.$id.' AND root=1'.$enable);
            $count = $db->sql_fetch_assoc($temp);

            if ($count['num']>0 || $page['is_siteroot']==1) { return $pagepath; }

            if ($langId) {
                $q = $db->exec_SELECTquery('*','pages_language_overlay','pid='.$id.' AND sys_language_uid='.$langId.$enable);
                $lo = $db->sql_fetch_assoc($q);
                if ($lo) {
                    unset($lo['uid']);
                    unset($lo['pid']);
                    $page = array_merge($page,$lo);
                }
            }
            if (!$page) break;

            if (($page['tx_cooluri_exclude']==1 && !empty($pagepath)) || $page['tx_cooluri_excludealways']) {
                ++$max;
                $id = $page['pid'];
                continue;
            }

            foreach ($sel as $s) {
                $trimmed = trim($page[$s]);
                if (!empty($trimmed)) {
                    $title = $trimmed;
                    break;
                }
            }

            if (!empty($conf->sanitize) && $conf->sanitize==1) {
                $pagepath[] = Link_Func::sanitize_title_with_dashes($title);
            } elseif (!empty($conf->t3conv) && $conf->t3conv==1) {
                $pagepath[] = Link_Func::specCharsToASCII($title);
            } elseif (!isset($conf->urlize) || $conf->urlize!=0) {
                $pagepath[] = Link_Func::URLize($title);
            } else {
                $pagepath[] = urlencode($title);
            }
            $id = $page['pid'];

            --$max;

            if (!empty($conf->maxsegments) && count($pagepath)>=(int)$conf->maxsegments) $max = 0;
        }
        return $pagepath;
    }

    public function getPageTitle($conf,$value) {
        return tx_cooluri::getPageTitleBE($conf,$value);
        // this function didn't work for pages with restricted access.
        // The BE function should work everywhere
    }

    private function extractArraysFromParams($params) {
        // turn array back into query string
        // so it can be used with parse_str
        if (empty($params)) {
            return Array();
        }
        foreach ($params as $k=>$v) $params[$k] = $k.'='.$v;
        $qs = implode('&',$params);
        parse_str($qs,$output);
        return $output;
    }

    private static function isBEUserLoggedIn() {
        if (self::$pObj==null) return false;
        return self::$pObj->beUserLogin;
    }


}
?>