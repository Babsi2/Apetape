<?PHP
	require_once(PATH_site . '/fileadmin/inc/class.pBase.php');

	class BaseUtils extends pBase {
		/**
		 * @var tslib_cObj
		 */
		public $cObj;
		
		/**
		 * Header seperator used by generateHeader
		 *
		 * @var string
		 */
        protected $headerSeperator = "\n";
        
		////////////////////////////////////////////////////////////////////////////
		// Singleton Pattern Handling
		////////////////////////////////////////////////////////////////////////////
		/**
		 *
		 * @var Utils
		 */
		static protected $instance = null;
		
		protected function __construct($cObj) {
			$this->cObj = $cObj;
		}
		protected function __clone() {}
		
		/**
		 *
		 * @param tslib_cObj $cObj
		 * @return Utils
		 */
		public static function GetInstance($cObj=null) {
			if (null === self::$instance) {
				if ($cObj == null) {
					$cObj = t3lib_div::makeInstance('tslib_cObj');
				}
				self::$instance = new Utils($cObj);
			}
			return self::$instance;
		}
			
		////////////////////////////////////////////////////////////////////////////
		// Common used Functions
		////////////////////////////////////////////////////////////////////////////

		/**
		 * 
		 * @param string $marker
		 * @param string $content
		 * @param string $where
		 * @return string
		 */
		public function ReplaceMarker($marker, $content, $where) {
			return str_replace('###'.$this->cObj->caseshift($marker, 'upper').'###', $content, $where);
		}
		
		/**
		 * Builds the JSON inclusion code
		 *
		 * @param string $service
		 * @param string $method
		 * @param array $params
		 */
		public function BuildFlashJson($service, $method, $params=null) {
			if (is_array($params))
				$params2 = '_'.implode('_', $params);
			$result['script'] = '<script type="text/javascript" src="/typo3temp/amfphp/' . $service . '.' . $method . $params2 . '.js"></script>';
			
			if (is_array($params))
				$params2 = implode('', $params);
			$result['jsonId'] = $service.$method.$params2;
			
			return $result;
		}
		
		/**
		 * returns code for inseting a flash using swfobject
		 *
		 * @param string $swf
		 * @param string $targetId
		 * @param array $size
		 * @param array $flashVarsArray
		 * @param array $paramsArray
		 * @param array $attrArray
		 * @return string
		 */
		public function BuildFlash($swf, $targetId, $size, array $flashVarsArray, array $paramsArray=array(), array $attrArray=array(), $embedFunction=false){
			$swf = '/fileadmin/swf/'.$swf;
			
			$paramsArray = array_merge(array("menu" => "false", "wmode" => "transparent", "allowScriptAccess" => "always", "allowNetworkAccess" => "all"), $paramsArray);
			
            $parsedVars = $this->parseFlashVars($flashVarsArray);
            
			foreach($paramsArray as $k => $v)
				$params .= 'params.' . $k . ' = "'. $v . '";' . "\n";
			foreach($attrArray as $k => $v)
				$attrs .= 'attributes.' . $k . ' = "'. $v . '";' . "\n";
            
            $script = $parsedVars['scripts'];
            
            if ($embedFunction) {
                $jsOpenFunction = "function $embedFunction() {";
                $jsEndFunction = "}";
            }
            $script .= t3lib_div::wrapJS( <<<JS
                $jsOpenFunction
            	var flashvars = {$parsedVars['flashvars']};
				var params = {};
				$params
				var attributes = {};
				$attrs
                
                
                
				swfobject.embedSWF("$swf", "$targetId", "{$size[0]}", "{$size[1]}", "9.0.0", false, flashvars, params, attributes, showNoFlash);
                showNoFlash();
                
                        
                $jsEndFunction      
JS
);          


			
			return $script;
		}
		
		public function BuildFlashLegacy($swf, $targetId, $size, array $flashVarsArray, array $paramsArray=array(), array $attrArray=array()){
			$swf = '/fileadmin/swf/'.$swf;
			
			$paramsArray = array_merge(array("menu" => "false", "wmode" => "transparent", "allowScriptAccess" => "always", "allowNetworkAccess" => "all"), $paramsArray);
			
			foreach($flashVarsArray as $k => $v) {
				$flashvars .= 'flashvars.' . $k . ' = "'. $v . '";' . "\n";
			}
			foreach($paramsArray as $k => $v) {
				$params .= 'params.' . $k . ' = "'. $v . '";' . "\n";
			}
			foreach($attrArray as $k => $v) {
				$attrs .= 'attributes.' . $k . ' = "'. $v . '";' . "\n";
			}
			
			return <<< JS
			<script type="text/javascript" language="javascript">
				<!--
				var flashvars = {};
				{$flashvars}
				var params = {};
				{$params}
				var attributes = {};
				{$attrs}
				swfobject.embedSWF("{$swf}", "{$targetId}", "{$size[0]}", "{$size[1]}", "9.0.0", false, flashvars, params, attributes);
				// -->
			</script>
JS;
		}
		
/**
         * BaseUtils::parseFlashVars()
         * returns an array('flashvars' => string, scripts => string)
         * 
         * 
         * @param array $input
         * @return array
         */
        protected function parseFlashVars($input){
            foreach ($input['amf'] as $key=>$val){
                
                $params = $path = $serviceMethod = NULL;
                
                if($val['params']) $params = implode(',',$val['params']);
                if($val['pathToAMF']) $path = '#'.$val['pathToAMF'];
                $serviceMethod = explode('.',$key);
                
                $output['AMF_'.$serviceMethod[1]] = $key.':'.$params.$path;
            }
            
            foreach ($input['json'] as $key=>$val){
                $params = $serviceMethod = NULL;

                if($val['params']) {
                    $params = implode('',$val['params']);
                    $jsParams = implode('_',$val['params']);
                }
                
                $serviceMethod = explode('.',$key);
                $files .= '<script type="text/javascript" src="/typo3temp/amfphp/' . $key .'_'. $jsParams . '.js"></script>'; 
                $output['JSON_'.$serviceMethod[1]] = $serviceMethod[0].$serviceMethod[1].$params;
            }
            
            foreach ($input['xml'] as $key=>$val){
                
                $params = $serviceMethod = NULL;
                
                if($val['params']) $params = implode('',$params);
                $serviceMethod = explode('.',$key);
                
                $output['XML_'.$serviceMethod[1]] = $key.':'.$params;
            } 
            
            $retObj['flashvars'] = json_encode($output); 
            $retObj['scripts'] = $files;
            return $retObj;
            
        }
		
		/**
		 * Returns a config array from template section
		 * 
		 * @param string $key
		 * @return mixed
		 */
		public function getConfig($key=""){
			if ($key != "")
				return $GLOBALS['TSFE']->config['config'][$key];
			else
				return $GLOBALS['TSFE']->config['config'];
		}
		
		/**
		 * returns a formatted file size
		 *
		 * @param string $bytes
		 * @param int $decimal
		 * @return <type>
		 */
		public function HumanFileSize($bytes, $decimal = '0' ) {
			$bytes = filesize($bytes);

			$position = 0;
			$units = array(" Bytes", " KB", " MB", " GB", " TB");

			while( $bytes >= 1024 && ( $bytes / 1024 ) >= 1 ) {
				$bytes /= 1024;
				$position++;
			}

			return round($bytes,$decimal ).$units[$position];
		}
			
		/**
		 * Returns a file type icon for the given file
		 *
		 * @param string $file
		 * @param string $style
		 * @param string $alt
		 * @return string
		 */
		public function GetFileIcon($file, $style="", $alt="") {
			$ext = strtolower(substr($file,strrpos($file, ".")+1));
			$icon = 'fileadmin/images/file_icons/'.$ext.'.png';
			
			if (!file_exists(PATH_site.$icon)){
				$icon = 'fileadmin/images/file_icons/default.png';
				$ext = '';
			}
			$size = getimagesize(PATH_site.$icon);
			
			if ($alt)
				$ext = $alt;
			return '<img src="'.$icon.'" alt="'.$ext.'" '.$style.' title="'.$ext.'" '.$size[3].'>';
		}
		
		/**
		 * Legacy
		 * returns a translation entry for the given id
		 *
		 * @deprecated
		 *
		 * @param int $uid
		 * @param int $type
		 * @param boolean $trim
		 * @return string
		 */
		public function TranslationFetch($uid, $type=0, $trim=true) {

			if (!$type)
				$type = $GLOBALS['TSFE']->type;
			if ($type==98)
				$type = $_GET['L'];
			
			$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*','tx_translations','uid='.$uid,'','','');
			$row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
			$string = $row['translation'.$type];

			if(!$string)
				$string = $row['translation0'];

			return $trim ? trim($string) : $string;
		}

		/**
		 * returns a link for the given page id and appends linkParams
		 *
		 * @param int $id
		 * @param array $linkParams
		 * @param int $type
		 * @return string 
		 */
		public function MakeLink($id, $linkParams=array(), $type=-1) {
			
			ksort($linkParams);
			if (count($linkParams)>0){
				$cacheObj = t3lib_div::makeInstance('t3lib_cacheHash');
				$linkParams['cHash'] = $cacheObj->generateForParameters(http_build_query($linkParams));
			}
            
			if ($type==-1)
				$type = intval($GLOBALS['TSFE']->type);
			if	($type==98)
				$type = $_GET['L'];
            
			
			$linkParams['type'] = $type;
			$http = $_SERVER['HTTPS'] ? 'https://' : 'http://';
			
            
			$lnk = $this->cObj->getTypoLink_URL($id, $linkParams,'');
			
			if (in_array(strtolower(substr($lnk,0,4)), array('http', 'mail','java')))
				return $lnk;
			else {
				if (substr($lnk,0,1) != '/')
					$lnk = '/'.$lnk;
				
				return $lnk;
			}
		}

		/**
		 *
		 * @param array $array1
		 * @param array $array2
		 * @return array
		 */
		public function array_merge_recursive_distinct ( array &$array1, array &$array2 ) {
			$merged = $array1;

			foreach ( $array2 as $key => &$value ) {
				if ( is_array ( $value ) && isset ( $merged [$key] ) && is_array ( $merged [$key] ) ) {
					$merged [$key] = $this->array_merge_recursive_distinct ( $merged [$key], $value );
				}
				else {
					$merged [$key] = $value;
				}
			}

			return $merged;
		}

		/**
		 * returns a formatted html-table for the given typo3-table
		 *
		 * @param string $string
		 * @param string $width
		 * @param string $align
		 * @param string $style
		 * @param string $class
		 * @param string $lineChar
		 * @param string $borderColor
		 * @param string $tableWidth
		 * @return string
		 */
		public function GenerateTable($string, $width='',$align='',$style='',$class='contentTable',$lineChar="\n",$borderColor='',$tableWidth='') {
			$width = explode("|",$width);
			$align = explode("|",$align);
			$styles = explode("|",$style);
			$tablestr = explode($lineChar,$string);
			
			if ($width[0] + $width[1] + $width[2]<1)
				$tblwidth = '100%';
			else 
				$tblwidth = $width[0] + $width[1] + $width[2];
			
			$tableWidth = $tableWidth==""? $tblwidth :$tableWidth;
			
			$table = '<table style="width:'.$tableWidth.';" class="'.$class.'">';
			
			foreach ($tablestr as $rowkey => $row) {
				$cellstr = explode("|",$row);
				$table.= "<tr>";
				
				foreach ($cellstr as $cellkey => $cell) {
					
					$tClass = $cellkey == 0 ? 'first' : '';
					$tClass .= $rowkey % 2 == 0 ? '' : ' alt';
					
					$stylestr = $styles[$cellkey];
					if ($align[$cellkey])
						$stylestr .= ';text-align: '.$align[$cellkey].';';
					if ($width[$cellkey])
						$stylestr .= ';width: '.$width[$cellkey].'px;';
					
					if ($cell==""||$cell==" ")
						$cellstr = "&nbsp;";
					else
						$cellstr = $cell;

					$table .= '<td class="'.$tClass.'" style="'.$stylestr.'">'. $cellstr . '</td>';
				}
				
				$table.= "</tr>";
			}
			$table .= '</table>';
			
			return $table;
			
		}

		
		////////////////////////////////////////////////////////////////////////////
		// Common used image functions
		////////////////////////////////////////////////////////////////////////////

		
		/**
		 * measures the width of a given text/font-combination
		 *
		 * @param string $text
		 * @param string $font
		 * @param float $size
		 * @return int
		 */
		protected function textWidth($text,$font,$size) {
			$dims = @imagettfbbox($size,0,$font,$text);
			return $dims[4];
		}

		
		/**
		 * returns a formatted header
		 *
		 * @param string $text
		 * @param string $color
		 * @param int $fontsize
		 * @param int $length
		 * @param boolean $uppercase
		 * @param string $fontfile
		 * @param mixed $imgconf
		 * @param boolean $mergeConf
		 * @param boolean $asResource
		 * @return string
		 */
		public function generateHeader($text, $color='', $fontsize='', $length=45, $uppercase=false, $fontfile='', $imgconf=false, $mergeConf=false, $asResource=false) {
			if (is_array($imgconf)){
				if ($mergeConf) {
					$img = $GLOBALS['TSFE']->config['config']['HEADERIMG.'];
					$img = $this->array_merge_recursive_distinct($img, $imgconf);
				}
				else
					$img = $imgconf;
			}
			
			else if (is_string($imgconf))
				$img = $GLOBALS['TSFE']->config['config'][$imgconf.'.'];
			else
				$img = $GLOBALS['TSFE']->config['config']['HEADERIMG.'];
			
			$alttext = $text;
			$offset = 5;
			if ($uppercase==true){
				$text = $this->cObj->caseshift($text, 'upper');
				$offset = 3;
			}
			if ($fontfile)
				$img['file.']['10.']['fontFile'] = 'fileadmin/fonts/'.$fontfile;
			if ($fontsize)
				$img['file.']['10.']['fontSize'] = $fontsize;
			if ($color)
				$img['file.']['10.']['fontColor'] = $color;
			
			$text = wordwrap($text, $length, $this->headerSeperator, false);
			$texts = explode($this->headerSeperator, $text);
			$height = 0;
			$l = 0;
			
			for($i=1;$i<=count($texts);$i++) {
				if (strlen($texts[$i-1]) == 0)
					continue;
				if (!$img['file.'][($i*10)]) {
					$img['file.'][($i*10)] = 'TEXT';
					$img['file.'][($i*10).'.'] = $img['file.']['10.'];
                    $img['file.'][($i*10).'.']['fontColor'] = '#999999';
				}

				$img['file.'][($i*10).'.']['offset'] = '0,'.ceil($img['file.']['10.']['fontSize']*$i* 1 - 3);
				$img['file.'][($i*10).'.']['text'] = $texts[$i-1];

				$cWidth = strlen($texts[$i-1]);
				$l = ($oldWidth > $cWidth) ? $l : $i;
				$oldWidth = ($oldWidth > $cWidth) ? $oldWidth : $cWidth;
				$height += $img['file.']['10.']['fontSize'] * 1;
				
			}
			$img['file.']['XY'] = '['.($l * 10).'.w]+5,'.ceil($height+2);
			$img["altText"] = str_replace($this->headerSeperator, " \n", $alttext);
			$img["titleText"] = str_replace($this->headerSeperator, " \n", $alttext);
			
			if ($asResource)
				return $this->cObj->IMG_RESOURCE($img);
			else
				$image = $this->cObj->IMAGE($img);

			return '<span class="noprint">' . $image . '</span><span class="print">' . $text. '</span>';
		}
	}
?>