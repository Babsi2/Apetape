<?PHP

/***************************************************************
 * Form Handling System
 * $Id: class.forms.php 17 2010-05-05 12:01:16Z mwallner $
 ***************************************************************/

require_once (PATH_site . 'fileadmin/inc/class.phpmailer.php');
require_once (PATH_site . 'fileadmin/inc/class.Validator.php');
require_once (PATH_site . 'fileadmin/inc/recaptchalib.php');

/**
 * Form Handling System
 * Forms
 *
 * @package pixelart typo3 framework
 * @author Michael Wallner
 * @copyright 2012
 * @version $Id: class.forms.php 18 2010-05-05 12:01:16Z mwallner $
 * @access public
 */
class Forms {
	public $config;
	/** @var Utils*/
	protected $uObj;

	protected $errors;
	protected $items;

	/**
	 * Creates a new Form Object with the specified configuration
	 *
	 * @param array $config
	 * @return void
	 */
	public function Forms(array $config) {
		$this->config = $config;

		if (!$this->config['form']['encType'])
		$this->config['form']['encType'] = 'application/x-www-form-urlencoded';
		$this->config['form']['charset'] = 'utf-8';
		$this->uObj = utils::GetInstance();
	}

	/////////////////////////////////////////////////////////////////////////////
	// Defining Form Elements
	/////////////////////////////////////////////////////////////////////////////


	/////////////////////////////////////////////////////////////////////////////
	// Rendering
	/////////////////////////////////////////////////////////////////////////////
	/**
	 * Main render function of the form content.
	 * It renders the columns into the specified template and returns it
	 * Forms::Render()
	 *
	 * @return string
	 */
	public function Render() {
		// Assign Template
		session_start();
		$this->config['form']['renderStartTime'] = $_SESSION['form_rendering_start'] = time();
		$template = $this->replaceWithValues($this->config['form']['template']);
		// Display all error messages together
		if ($this->config['errors'] && $this->config['form']['singleError']) {
			$template = str_replace('###ERRORS###', '<div class="error">' . implode('<br />', $this->config['errors']) . '</div>', $template);
		}
		// process each column
		foreach ($this->config['columns'] as $name => $item) {
			if (!$item['config']['type'] || in_array($item['config']['type'], array('passthrough', 'const')))
				continue;
			$tmpId = $this->BuildId($name);

			if ($item['config']['validate']) {
				$validates = explode(";", $item['config']['validate']);

				if (in_array($item['config']['type'], array('input', 'select', 'text', 'check', 'radio')))
					$item['config']['onfocus'] .= 'curFieldValue = $(\'#' . $tmpId . '\').val();';
				$item['config']['onchange'] .= $this->config['form']['id'] . 'validator.validate2(\'' . $tmpId . '\', this);';

				unset($validates);
			}

			if ($item['config']['inlineLabel']) {
				$item['label'] = $this->replaceWithValues($item['label']);

				if ($this->isRequiredField($item))
					$item['label'] .= $this->config['form']['requiredSuffix'];

				if (!($_GET['success'] == $this->config['form']['success'] && ($this->config['form']['method'] == 'post' && $_POST))) {
					$item['config']['default'] = $item['label'];
					$item['config']['onfocus'] .= $this->config['form']['id'] . 'util.setBlank(this,\'' . $item['label'] . '\');';
					$item['config']['onblur'] = $this->config['form']['id'] . 'util.setDefault(this,\'' . $item['label'] . '\');' . $item['config']['onblur'];
				}
				elseif ($item['value'] == "" || $item['value'] == $item['label']) {
					$item['config']['default'] = $item['label'];
					$item['config']['onfocus'] .= $this->config['form']['id'] . 'util.setBlank(this,\'' . $item['label'] . '\');';
					$item['config']['onblur'] = $this->config['form']['id'] . 'util.setDefault(this,\'' . $item['label'] . '\');' . $item['config']['onblur'];
				}
			}

			/* 
			 * edit by RP
			 * check if there is a display condition
			 */
			$condData = array();
			$this->evalDisplayCondition($item['config']['displayCond'],$condData);
			$conditionWrap = array();
			if($condData){
				$conditionWrap = $this->splitConf($condData['wrap'], 1);
				$this->addAdditionalJS('condition-'.$tmpId,$condData['js']);
			}
			
			$curObj['label'] = $conditionWrap[0][0].$this->RenderLabel($item['label'], $tmpId, $this->config['form']['labelSuffix'], $item['config']).$conditionWrap[0][1];
			$curObj['field'] = $conditionWrap[0][0].call_user_func_array(array($this, 'Render' . $item['config']['type']), array($tmpId, $item)).$conditionWrap[0][1];

			if ($this->config['errors'][$name] && !$this->config['form']['singleError']){
				$wrap = $this->splitConf($this->config['form']['errorWrap'], count($this->config['errors'][$name]));
				//foreach ($this->config['errors'][$name] as $key => &$error) {
					$error = $wrap[$key][0] . end($this->config['errors'][$name]) . $wrap[$key][1];
				//}

				$curObj['field'] .= '<div class="error" id="' . $tmpId . '-error">' . $error . '</div>';
			}
				
			//$retObj[] = $curObj['label'] . $curObj['field'];
			$template = str_replace('###' . strtoupper($name) . '_LABEL###', $curObj['label'], $template);
			$template = str_replace('###' . strtoupper($name) . '###', $curObj['field'], $template);
		}

		// render general form content
		$template = str_replace('###SUBMIT###', $this->renderSubmit(), $template);

		// Compatibility Break
		$template = preg_replace_callback('/###LLL:(\w*)###/', create_function('$id', 'return Translations::Fetch($id[1]);'), $template);
		$template = preg_replace_callback('/###TMPL:(\w*)###/', create_function('$id', 'return nl2br(Templates::Fetch($id[1]));'), $template);
		$formContent = preg_replace('/###[^#]*###/', '', $template);

		// generate target linkd
		if (is_numeric($this->config['form']['action'])) {
			$linkParams = array();
			/*if ($this->config['form']['success'])
				$linkParams['success'] = $this->config['form']['success'];*/
                
			$this->config['form']['action'] = $this->uObj->makeLink($this->config['form']['action'], $linkParams);
		} else {
			 
			/*if ($this->config['form']['success']) {
				if (strpos($this->config['form']['action'], '?') === false)
					$this->config['form']['action'] .= '?success=' . $this->config['form']['success'];
				else
					$this->config['form']['action'] .= '&success=' . $this->config['form']['success'];
			}*/
        }

		if ($this->config['form']['onsubmit']) {
			$onSubmit = 'onsubmit="' .$this->config['form']['onsubmit']. '"';
		}
		
		if ($this->config['form']['target']) {
			$target = 'target="' .$this->config['form']['target']. '"';
		}
		
		//enable custom Recaptcha
		$custom = "
			var RecaptchaOptions = {
				theme : 'custom',
				custom_theme_widget: 'recaptcha_widget',
				lang: '" . $GLOBALS['TSFE']->config['config']['language'] . "'
			};";

		$formHeader = '<script type="text/javascript">'.$custom.'</script><form id="' . $this->config['form']['id'] . '" '.$target.' '.$onSubmit.' name="' . $this->config['form']['id'] . '" ' . $this->getAttributes($this->config['form']) . ' enctype="' . $this->config['form']['encType'] . '"  method="' . $this->config['form']['method'] . '" action="' . $this->config['form']['action'] . '" accept-charset="' . $this->config['form']['charset'] . '">';

		if ($this->config['form']['disableDoubleSubmit'])
			$formHeader .= $this->renderDisableDoubleSubmit();

		if (!$this->config['form']['disableCSRF']) {
			if (isset($this->config['errors']['csrf'])) {
				$formHeader .= '<div class="error" id="' . $this->BuildId('csrf') . '-error">'.($this->config['form']['errorMessages']['csrf'] == "" ? 'CSRF Error!' : $this->config['form']['errorMessages']['csrf']).'</div>';
			}
			$formHeader .= $this->RenderCsrf($this->BuildId('csrf'), array());
		}

		return $formHeader . $formContent . '</form>' . $this->RenderJs();
	}

	/**
	 * Generates the js code and wrap for conditional fields in FE form
	 * based on the displayCondition option
	 *	example: FIELD:foobar:=:5 -> only display field if the value of foobar is 5
	 * 
	 * rule types : FIELD,EMAIL
	 * example see salzburg-ag-new -> jobs_pi4
	 * 
	 * @param string $conditionString
	 * @param array &$condData -> passed by reference
	 * 
	 * @return boolean -> visibility of field
	 */
	protected function evalDisplayCondition($conditionString,&$condData){
		// if there is no displayCondition field is visible
		if(!$conditionString) return true;
		
		list($ruleType,$fieldName,$operator,$comparisonValue) = explode(':',$conditionString);
		$condData = array();
		$visible = true;
		
		switch ($operator) {
			case '=':
				if($ruleType == 'FIELD'){
					$condData['wrap'][] = $fieldName.'-condition '.$fieldName.'-'.$comparisonValue;
					$condData['js'] = "
						$('#".$this->config['form']['id']."-".$fieldName."').change(function(){
							$('.".$fieldName."-condition').hide();$('.".$fieldName."-'+$(this).val()).show();
						});
					";
				}
				
				$visible = $this->config['columns'][$fieldName]['value'] == $comparisonValue;
				break;
			case 'IN':
				if($ruleType == 'FIELD'){
					$values = explode(',',$comparisonValue);
					foreach($values as $v){
						$condData['wrap'][] = $fieldName.'-condition '.$fieldName.'-'.$v;
					}
					$condData['js'] = "
						$('#".$this->config['form']['id']."-".$fieldName."').change(function(){
							$('.".$fieldName."-condition').hide();$('.".$fieldName."-'+$(this).val()).show();
						});
					";
				}
				
				$visible = in_array($this->config['columns'][$fieldName]['value'],$values);
				break;
			case '>':
				// TODO: implementation for FIELD width js
				$visible = $this->config['columns'][$fieldName]['value'] > $comparisonValue;
				break;
			case '<':
				// TODO: implementation for FIELD width js
				$visible = $this->config['columns'][$fieldName]['value'] < $comparisonValue;
				break;
		}
		
		if($ruleType == 'FIELD') $condData['wrap'] = '<div class="conditionfield '.implode(' ',$condData['wrap']).'">|</div>';
			
		
		return $visible;
	}
	
	protected function isRequiredField($item) {
		return strpos($item['config']['validate'], 'required', 0) !== false;
	}

	/**
	 * Returns the required javascript code
	 * Forms::renderJs()
	 * @return string
	 */
	protected function renderJs() {
		$c = $this->config['columns'];

		foreach ($c as $key => &$value) {
			//$value['valueText'] = str_replace('"', "\"", $value['valueText']);
			
			$value['config']['default'] = str_replace(array(';', ':', '\\'), array('&#058;', '&#059;', '&#092;'), $value['config']['default']);
			$value['config']['default'] = htmlentities($value['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false);
			$value['config']['default'] = str_replace(array('&amp;#058;', '&amp;#059;', '&amp;#092;'), array('&#058;', '&#059;', '&#092;'), $value['config']['default']);
			
			$value['value'] = $value['config']['default'];
			unset($value['config']['items']);
			unset($value['config']['wrap']);
			unset($value['config']['inputContainer']);
			unset($value['valueText']);
			//print_r($value);
		}

		$config = str_replace("'", "\'", json_encode($c));
		return '<script type="text/javascript">
var '.
			$this->config['form']['id'] .'validator = new FormValidator(\''.$this->config['form']['id'] .'\', '.$config.');var '
			.$this->config['form']['id'] .'util = new FormUtils(); '. implode("\n", $this->config['additionalJS']) . '
</script>';
	}
    
    protected function addAdditionalJS($id, $js) {
        if (!$this->config['additionalJS'][$id])
            $this->config['additionalJS'][$id] = $js;
    }

	/**
	 * Returns the the html attribute string for the given configuration
	 * Forms::getAttributes()
	 * @param array $config
	 * @return
	 */
	protected function getAttributes($config) {
		$attributes = array('autocomplete',  'class', 'style', 'size', 'maxlength', 'cols', 'rows', 'onchange', 'disabled', 'readonly', 'onclick', 'ondblclick', 'onfocus', 'onblur', 'onmousedown', 'onmouseup', 'onkeydown', 'onkeyup', 'onkeypress', 'onmouseover', 'onmouseout', 'onmousemove', 'tabindex', 'placeholder'); //Tabindex added - fk
		foreach ($attributes as $attribute) {
			$attribValue = '';

			if ($this->config['defaults'][$attribute]['*'] != '')
				$attribValue .= $this->replaceWithValues($this->config['defaults'][$attribute]['*']) . ' ';

			if ($this->config['defaults'][$attribute][$config['type']] != '')
				$attribValue .= $this->replaceWithValues($this->config['defaults'][$attribute][$config['type']]) . ' ';

			if ($config[$attribute])
				$attribValue .= ' ' . $this->replaceWithValues($config[$attribute]);

			if ($attribValue)
				$content .= ' ' . $attribute . '="' . trim($attribValue) . '" ';
		}
		return $content;
	}

	/**
	 * Returns a user generated function's result
	 * Forms::RenderOutput()
	 *
	 * @param int $id
	 * @param array $item
	 * @return string
	 */
	protected function RenderOutput($id, $item) {
	   if($item['config']['userFunc']){
    		if (!is_array($item['config']['userFunc']))
    			$item['config']['userFunc'] = explode('->', $item['config']['userFunc']);
    
    		$func = $item['config']['userFunc'];
    		return call_user_func_array(array($func[0], $func[1]), array($item));
	   }
        else return $item['config']['value'];
	}

	/**
	 * Returns a text input field
	 */
	protected function RenderInput($id, $item) {
		$item['config']['default'] = str_replace(array(';', ':', '\\'), array('&#058;', '&#059;', '&#092;'), $item['config']['default']);
		$def = $item['config']['default'] ? 'value="' . htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '"' : '';
		$def = str_replace(array('&amp;#058;', '&amp;#059;', '&amp;#092;'), array('&#058;', '&#059;', '&#092;'), $def);
		
		return '<input type="text" id="' . $id . '" ' . $def . '  name="' . $id . '" ' . $this->getAttributes($item['config']) . '/>';
	}
	
	/**
	 * Returns a HTML5 email input field
	 */
	protected function RenderEmail($id, $item) {
		$item['config']['default'] = str_replace(array(';', ':', '\\'), array('&#058;', '&#059;', '&#092;'), $item['config']['default']);
		$def = $item['config']['default'] ? 'value="' . htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '"' : '';
		$def = str_replace(array('&amp;#058;', '&amp;#059;', '&amp;#092;'), array('&#058;', '&#059;', '&#092;'), $def);
		
		return '<input type="email" id="' . $id . '" ' . $def . '  name="' . $id . '" ' . $this->getAttributes($item['config']) . '/>';
	}
    
	/**
	 * Returns a text input field
	 */
	protected function RenderPassword($id, $item) {
		$item['config']['default'] = str_replace(array(';', ':', '\\'), array('&#058;', '&#059;', '&#092;'), $item['config']['default']);
		$def = $item['config']['default'] ? 'value="' . htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '"' : '';
		$def = str_replace(array('&amp;#058;', '&amp;#059;', '&amp;#092;'), array('&#058;', '&#059;', '&#092;'), $def);
		
		return '<input type="password" id="' . $id . '" ' . $def . '  name="' . $id . '" ' . $this->getAttributes($item['config']) . '/>';
	}

	/**
	 * Returns a textarea field
	 */
	protected function RenderText($id, $item) {
		$item['config']['default'] = preg_replace("/\s+/", " ", $item['config']['default']);
		$item['config']['default'] = str_replace(array(';', ':', '\\'), array('&#058;', '&#059;', '&#092;'), $item['config']['default']);
		$item['config']['default'] = htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false);
		$item['config']['default'] = str_replace(array('&amp;#058;', '&amp;#059;', '&amp;#092;'), array('&#058;', '&#059;', '&#092;'), $item['config']['default']);
		
        return '<textarea id="' . $id . '" name="' . $id . '" ' . $this->getAttributes($item['config']) . '>' . $item['config']['default'] . '</textarea>';
	}

	
	protected function RenderCsrf($id, $item) {
		session_start();
		$csrfToken = hash('sha256', uniqid('csrf', true));
		$_SESSION['csrf_token'] = $csrfToken;
		return '<input type="hidden" id="' . $id . '" name="' . $id . '" value="' .$csrfToken . '"/>';
		
	}

	/**
	 * Render a input with an calendar
	 */
	protected function RenderCalendar($id, $item) {
		if(empty($item['config']['format'])) $item['config']['format'] = 'D, dd.mm.yy';
		if(empty($item['config']['phpFormat'])) $item['config']['phpFormat'] = '%a, %d.%m.%Y';
		
		$def = $item['config']['default'] ? 'value="' . (intval($item['config']['default']) * 1000) . '"' : '';
		if ($item['config']['default'] > 0) {
			$def2 = strftime( $item['config']['phpFormat'], intval($item['config']['default']));
		} else {
			$def2 = htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false);
		}

		if ($GLOBALS['TSFE']->config['config']['language'] == 'en'){
			$lang = '';
		}else {
			$script = '<script type="text/javascript" src="fileadmin/js/i18n/jquery.ui.datepicker-'.$GLOBALS['TSFE']->config['config']['language'].'.js"></script>';
			$lang = $GLOBALS['TSFE']->config['config']['language'];
		}

		if ($item['config']['dependsOn']) {
			$minDate = ",\r\n\t\t\t\t\t".'minDate: $("#'.$this->BuildId($item['config']['dependsOn']).'Text").datepicker( "getDate" )';
			$addJs = '
			$("#'.$this->BuildId($item['config']['dependsOn']).'Text").datepicker( "option" ,"onSelect",
				function(dateText, inst) {
					var tmpDate = $(this).datepicker("getDate");
					tmpDate.setDate(tmpDate.getDate()+1);
					$("#' . $id . 'Text").datepicker( "option" , "minDate", tmpDate);
				}
			);
			';
		} else if($item['config']['minDate']) {
			$minDate = ",\r\n\t\t\t\t\t".'minDate: '.$item['config']['minDate'];
		}

		if(is_array($item['config']['additionalOptions'])) {
			foreach ($item['config']['additionalOptions'] as $key => $value) {
				$addOptions[] = $key.': '.$value;
			}
			$addOptions = ",\r\n\t\t\t\t\t".implode(",\r\n", $addOptions);
		}


		return '<input type="text" id="' . $id . 'Text" readonly="readonly" value="' . $def2 . '" name="' . $id . 'Text" ' . $this->getAttributes($item['config']) . '/>
			<input type="hidden" name="' . $id . '" id="' . $id . '" ' . $def . '/>
			'.$script.t3lib_div::wrapJS('
			$(document).ready(function() {
				$("#' . $id . 'Text").datepicker({
					dateFormat: "'.$item['config']['format'].'",
					altField: "#' . $id . '",
					altFormat: "@"'.$minDate.$addOptions.'
				});
				$.datepicker.setDefaults( $.datepicker.regional[ "'.$lang.'" ] );
				'.$addJs.'
			});
		');
	}

	/**
	 * Returns a date selection field, with three select boxes for day, month, year
	 */
	protected function RenderDate($id, $item) {

		$item['config']['noValueLabels'] = $this->replaceWithValues($item['config']['noValueLabels']);
		$labels = explode("|", $item['config']['noValueLabels']);
		$item['config']['onchange'] = 'UpdateDate(\'' . $id . '\');' . $item['config']['onchange'];

		if ($item['config']['default'] && is_long($item['config']['default']))
			$item['config']['default'] = strftime('%d.%m.%Y', $item['config']['default']);
		$dates = explode('.', $item['config']['default']);

		if (is_array($item['config']['style']))
			$tmpStyles = $item['config']['style'];

		if ($tmpStyles)
			$item['config']['style'] = $tmpStyles[0];

		$content .= '<select id="' . $id . 'day" name="' . $id . 'day" ' . $this->getAttributes($item['config']) . '>' . $this->getDayOptionString($dates[0], $labels[0]) . '</select>';
		if ($tmpStyles)
			$item['config']['style'] = $tmpStyles[1];
		$content .= '<select id="' . $id . 'month" name="' . $id . 'month" ' . $this->getAttributes($item['config']) . '>' . $this->getMonthOptionString($dates[1], $labels[1]) . '</select>';
		if ($tmpStyles)
			$item['config']['style'] = $tmpStyles[2];
		$content .= '<select id="' . $id . 'year" name="' . $id . 'year" ' . $this->getAttributes($item['config']) . '>' . $this->getYearOptionString($dates[2], $item['config']['order'], $item['config']['min'], $item['config']['max'], $labels[2]) . '</select>';

		$content .= '<input type="hidden" name="' . $id . '" id="' . $id . '" ' . $this->getAttributes($item['config']) . ' value="' . htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '"/>';

		return $content;
	}

	/**
	 * Returns options for a select field
	 */
	protected function RenderOption($config, $default) {
		$isOpen = false;
		$this->execIProcFunc($config);

		if (!is_array($config['items']) && $config['items'] != '')
			$config['items'] = $this->getTranslationItems($config['items']);

		if (is_array($config['range'])) {
			$valueParams = explode(",",$config['range']['value']);
			$valueParams[2] = $valueParams[2] == null ? 1 : $valueParams[2];
			$values = range($valueParams[0], $valueParams[1], $valueParams[2]);
			foreach ($values as $value) {
				$fValue = $config['range']['valueFormat'] == "" ? $value : sprintf($config['range']['valueFormat'], $value);
				$config['items'][] = array($fValue, $value);
			}
		}


		if ($config['items'] != '') {
			foreach ($config['items'] as $item) {

					$cmpValue = $config['saveText'] ? $item[0] : $item[1];					
					if (is_array($default)) {
						$selected = in_array($cmpValue, $default) ? ' selected="selected" ' : '';	
					}
					else {
						$selected = ($default == $cmpValue) ? ' selected="selected" ' : '';	
					}

				$item[0] = $this->replaceWithValues($item[0]);

				if ($item[1] != '0' && $item[1] == '--div--') {

						if ($isOpen)
							$result[] = '</optgroup>';

						$result[] = '<optgroup label="' . $item[0] . '">';
					$isOpen = true;
				} else
					$result[] = '<option value="' . $item[1] . '" ' . $selected . '  >' . $item[0] . '</option>';
			}
		}

		if ($config['foreign_table']) {
			$columns = $config['foreign_table_prefix'] . 'uid,' . $config['foreign_table_field'] . ' as title';

			if ($config['foreign_table_separator']) {
				$config['foreign_table_separator']['label'] = $this->replaceWithValues($config['foreign_table_separator']['label']);
				$columns .= ', ' . $config['foreign_table_prefix'] . $config['foreign_table_separator']['column'];
			}

			$oldSeperator = null;
			$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery($columns, $config['foreign_table'], '1=1 ' . $this->uObj->cObj->enableFields( $config['foreign_table']) .' '. $config['foreign_table_where'], '', $config['foreign_table_orderby']);
			while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
				if ($config['foreign_table_separator'] && call_user_func_array(explode("->", $config['foreign_table_separator']['function']), array($row[$config['foreign_table_separator']['column']], $oldSeperator))) {
					if ($isOpen)
						$result[] = '</optgroup>';

					$result[] = '<optgroup label="' . $config['foreign_table_separator']['label'] . '">';
					$isOpen = true;
				}

				$selected = $default == $row['uid'] ? ' selected="selected" ' : '';
				$result[] = '<option value="' . $row['uid'] . '" ' . $selected . '  >' . htmlentities($row['title'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '</option>';
				$oldSeperator = $row[$config['foreign_table_separator']['column']];
			}
		}
		if ($isOpen) {
			$result[] = '</optgroup>';
		}
		if (is_array($result))
			return implode("\n", $result);
	}

	/**
	 * Returns a select box containing its options
	 */
	protected function RenderSelect($id, $item) {
		return '<select id="' . $id . '" name="' . $id . '" ' . $this->getAttributes($item['config']) . '>' . $this->RenderOption($item['config'], $item['config']['default']) . '</select>';
	}

	/**
	 * Returns a table for entering sub items
	 */
	protected function RenderTable($id, $item) {
		$tableId = $id;
		$id = str_replace($this->config['form']['id'].'-', '', $id);
		//$subItemConf = array('config' => $item['config']['subitems_attributes']);
		$item['config']['header_attributes'] = $GLOBALS['TSFE']->tmpl->splitConfArray($item['config']['header_attributes'], count($item['config']['columns']));
		$item['config']['cell_attributes'] = $GLOBALS['TSFE']->tmpl->splitConfArray($item['config']['cell_attributes'], count($item['config']['columns']));
		$i = 0;
		$tblBody[] = '<tr>';
		foreach ($item['config']['columns'] as $name => $column) {
			if ($column['config']['validate']) {
				//if (strpos($item['config']['validate'],'required') !== false )
				$requiredParams['validate'] = $column['config']['validate'];

				$validates = explode(";", $column['config']['validate']);
				foreach ($validates as $val) {
					$cc = explode(',', $val);
					$typ = $cc[0];
					array_shift($cc);
					//$column['config']['onchange'] .= $this->config['form']['id'] . 'validator.validate($(\'#' . $this->BuildId($name) . '[0]' . '\'), \'' . $typ . '\', \'' . @implode(',', $cc) . '\');';
//					$column['config']['onblur'] .= $this->config['form']['id'] . 'validator.validate($(\'#' . $this->BuildId($name) . '[0]' . '\'), \'' . $typ . '\', \'' . @implode(',', $cc) . '\');';
				}

				unset($validates, $column['config']['default']);
			}

			if (!empty($item['valueArray'][0][$name])) {
				$column['config']['default'] = $item['valueArray'][0][$name];
			}

			$tblBody[] = str_replace(
				array('###LABEL###','###FIELD###'),
				array($this->RenderLabel($this->replaceWithValues($column['label']), $this->BuildId($id.'-'.$name) . '[0]') ,$this->RenderInput($this->BuildId($id.'-'.$name) . '[0]', $column)),
				$item['config']['inputContainer']
			);


			$js[] = $name;
			$i++;
		}
		$tblBody[] = '</tr>';

		if ($item['valueArray']) {
			for ($i = 1; $i < count($item['valueArray']); $i++) {
				$tblBody[] = '<tr>';
				foreach ($item['config']['columns'] as $name => $column) {
					//print_r($column['config']);

					if ($column['config']['validate']) {
						//if (strpos($item['config']['validate'],'required') !== false )
						$requiredParams['validate'] = $column['config']['validate'];

						$validates = explode(";", $column['config']['validate']);
						foreach ($validates as $val) {
							$cc = explode(',', $val);
							$typ = $cc[0];
							array_shift($cc);
//							$column['config']['onchange'] .= $this->config['form']['id'] . 'validator.validate($(\'#' . $this->BuildId($name) . '[0]' . '\'), \'' . $typ . '\', \'' . @implode(',', $cc) . '\');';
//							$column['config']['onblur'] .= $this->config['form']['id'] . 'validator.validate($(\'#' . $this->BuildId($name) . '[0]' . '\'), \'' . $typ . '\', \'' . @implode(',', $cc) . '\');';
						}

						unset($validates, $column['config']['default']);
					}

					if (!empty($item['valueArray'][$i][$name])) {
						$column['config']['default'] = $item['valueArray'][$i][$name];
					}

					$tblBody[] = str_replace(
						array('###LABEL###','###FIELD###'),
						array($this->RenderLabel($this->replaceWithValues($column['label']), $this->BuildId($id.'-'.$name) . '['.$i.']') ,$this->RenderInput($this->BuildId($id.'-'.$name) . '['.$i.']', $column) ),
						$item['config']['inputContainer']
					);
					$js[] = $name;
				}
				$tblBody[] = '</tr>';
			}
		}


		$jsonSubItems = str_replace('"', "'", json_encode($item['config']['columns']));
		$jsonCellAttr = str_replace('"', "'", json_encode($item['config']['cell_attributes']));

		$jsSettings = '{formId : \'' . $this->config['form']['id'] . '\', columns : ' . $jsonSubItems . ', cellAttributes: ' . $jsonCellAttr . ', max: '.$item['config']['max'].'}';

		$item['label'] = $this->replaceWithValues($item['label']);

		$table = '
			<table id="' . $tableId . '" '.$item['config']['tableAttributes'].' >
				<thead><tr>' . @implode("", $tblHeader) . '</tr></thead>
				<tbody>' . @implode("", $tblBody) . '</tbody>
			</table>
			<a class="' . $item['config']['add_class'] . '" href="#" onclick="' . $this->config['form']['id'] . 'util.addTableRow(\'' . $tableId . '\',' . $jsSettings . '); return false;" style="display: inline;" ><span>' . $item['label'] . '</span></a>
			<div></div>';

		return $table;

	}

	/**
	 * Returns one or at max. 10 checkboxes
	 */
	protected function RenderCheck($id, $item) {
		$i = 0;
		$origOnChange = $item['config']['onchange'];

		$this->execIProcFunc($item['config']);

		if (!is_array($item['config']['items']) && $item['config']['items'] != '')
			$item['config']['items'] = $this->getTranslationItems($item['config']['items']);

		$wrap = $this->splitConf($item['config']['wrap'], count($item['config']['items']));
        
		foreach ($item['config']['items'] as $itm) {
			// Seperator Label found
			if ($itm[1] === '--div--') {
				$result[] = $this->RenderLabel($itm[0],'', '', array(), '');
				continue;
			}			
			
			if ($item['config']['default'])
				$checked = (($item['config']['default'] | pow(2, $i)) == $item['config']['default']) ? ' checked="checked" ' : '';

			if ($item['config']['useValues']) {
				$item['config']['onchange'] = 'updateCheckboxValue2(\'' . $id . '\', this.value, this.checked);' . $origOnChange ;
				$value = htmlentities($itm[1], ENT_QUOTES | ENT_HTML401, 'UTF-8', false);
			}
			else {
				$item['config']['onchange'] = 'updateCheckboxValue(\'' . $id . '\', this.value, this.checked);' . $origOnChange;
				$value = pow(2, $i);
			}


			$result[] = $wrap[$i][0] . '<input type="checkbox" ' . $checked . ' name="' . $id . 'c" id="' . $id . '-' . $i . '" value="' . $value  . '" ' . $this->getAttributes($item['config']) . '/>' . $this->RenderLabel($itm[0], $id . '-' . $i, '', $item['config'], '') . $wrap[$i][1] .'';
            
			$i++;
		}
		if (is_array($result)) {
			
			if(!$item['config']['useValues'])
				$item['config']['default'] = intval($item['config']['default']);
			
			$result[] = '<input type="hidden" name="' . $id . '" id="' . $id . '" value="' . htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '"/>';
			return implode("\n", $result);
		}
	}

	/**
	 * Returns one or more radio buttons
	 */
	protected function RenderRadio($id, $item) {
		$this->execIProcFunc($item['config']);

		if (!is_array($item['config']['items']) && $item['config']['items'] != '')
			$item['config']['items'] = $this->getTranslationItems($item['config']['items'], 1);

		return $this->RenderRadioButtons($id, $item['config']['items'], $item);
	}

	/**
	 * Returns one or more radio buttons
	 */
	protected function RenderRadioButtons($id, $items, $config) {
		$i = 0;

		$wrap = $this->splitConf($config['config']['wrap'], count($items));

		foreach ($items as $item) {
			$selected = $config['config']['default'] == $item[1] ? ' checked="checked" ' : '';
			$result[] = $wrap[$i][0] . '<input type="radio" name="' . $id . '" id="' . $id . '-' . $i . '" value="' . htmlentities($item[1], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '" ' . $selected . ' ' . $this->getAttributes($config['config']) . '/>' . $this->RenderLabel($item[0], $id . '-' . $i, '', $item['config']) . $wrap[$i][1];
			$i++;
		}
		if (is_array($result))
			return implode("\n", $result);
	}

	/**
	 * Returns the image for the captcha validation
	 */
	protected function RenderCaptchaImage($id, $item) {
		return '<img id="' . $id . '" ' . $this->getAttributes($item['config']) . ' alt="" src="/fileadmin/inc/class.captcha.php?color=' . $item['config']['colors'] . '"/>';
	}

	/**
	 * Returns the text input for the captcha validation
	 */
	protected function RenderCaptchaText($id, $item) {
		return '<input id="' . $id . '" type="text" value="" name="' . $id . '" ' . $this->getAttributes($item['config']) . ' />';
	}
	 
	protected function RenderCaptcha($id, $item) {
		
		$publickey = $item['config']['publickey'];
		$texts = $item['config']['text'];
		if ($publickey) {
			$attributes = $this->getAttributes($item['config']);
			$recaptchaFields = <<<HTML
				<div id="recaptcha_widget" style="display:none">
					<div id="recaptcha_image" onclick="Recaptcha.reload();"></div>		
					<div class="recaptcha_reload"><a href="javascript:Recaptcha.reload()">{$this->replaceWithValues($texts['reload'])}</a></div>
					<div class="recaptcha_only_if_image"><a href="javascript:Recaptcha.switch_type('audio')">{$this->replaceWithValues($texts['getSound'])}</a></div>
					<div class="recaptcha_only_if_audio"><a href="javascript:Recaptcha.switch_type('image')">{$this->replaceWithValues($texts['getImage'])}</a></div>
					<div class="recaptcha_help"><a href="javascript:Recaptcha.showhelp()">{$this->replaceWithValues($texts['help'])}</a></div>
					<input type="text" id="recaptcha_response_field" name="recaptcha_response_field" {$attributes}/>
				</div>
HTML;
			$recaptchaFields .= recaptcha_get_html($publickey);
		}		
		
		$GLOBALS['TSFE']->additionalHeaderData['form_cp_style'] = '
		<style type="text/css">
		.c'.$item['config']['honeypotId'].'-outer {display: none}
		</style>
		';
		
		$this->config['form']['onsubmit'] = 'return checkSubmitTime('.$this->config['form']['renderStartTime'].');';
		
		if($item['config']['wrap']) {
			$item['config']['wrap'] = explode("|", $item['config']['wrap']);
	}

		$content = '
		<div id="' . $id . '-outer" >
			'.$item['config']['wrap'][0].'
			'. $this->RenderLabel($item['label'], $id, $this->config['form']['labelSuffix'], $item['config']).'
			<div class="clear">'.$recaptchaFields.'</div>
			<div class="c'.$item['config']['honeypotId'].'-outer" ><input type="text" size="30" class="formfield formfield304" name="'.$item['config']['honeypotId'].'-email" id="'.$item['config']['honeypotId'].'-email"  /></div>
			<!--<input type="text" size="30" class="formfield formfield304" name="'.$item['config']['honeypotId'].'-last_name" id="'.$item['config']['honeypotId'].'-last_name"  />-->
			<input type="text" size="30" style="display: none;" class="formfield formfield304" name="'.$item['config']['honeypotId'].'-first_name" id="'.$item['config']['honeypotId'].'-first_name"  />
			'.$item['config']['wrap'][1].'
		</div>
		'.t3lib_div::wrapJS('
		document.getElementById("' . $id . '-outer").style.display = "none";
		var renderStartTime = new Date();
		function checkSubmitTime(startTime) {
			var now = new Date()
			var diff = (now.getTime()/1000) - (renderStartTime.getTime()/1000);
			if(diff < '.$item['config']['completionTime'].' && document.getElementById("recaptcha_response_field").value.length == 0) {
				document.getElementById("' . $id . '-outer").style.display = "block";
				document.getElementById("' . $id . '-outer").innerHTML += \'<in\' + \'put type="hid\' + \'den" value="1" name="b6fd75d8-captcha\' + \'-check" />\';
					
				return false;
			}		
			return true;
		}
		');

		return $content;
	}
	

	/**
	 * Returns a hidden field
	 */
	protected function RenderHidden($id, $item) {
		return '<input type="hidden" id="' . $id . '" name="' . $id . '" value="' . htmlentities($item['config']['default'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '"/>';
	}

	/**
	 * Returns a file input field
	 */
	protected function RenderFile($id, $item) {
		if ($this->config['form']['method'] != "post")
			die("No file upload possible in 'get' forms!");

		$this->config['form']['encType'] = 'multipart/form-data';
        $jsClass = $this->replaceWithValues($item['config']['uploadButtonClass']);
        $jsText = $this->replaceWithValues($item['config']['uploadButtonText']);
        $item['config']['class'] .= ' file';
        $itemConfig2 = $this->getAttributes($item['config']);
        unset($item['config']['onblur'], $item['config']['onfocus'], $item['config']['onchange']);
		$textConfig = $item['config'];
		$textConfig['class'] = ' file fakefield';
        $itemConfig = $this->getAttributes($textConfig);
        
        $this->addAdditionalJS('file', <<< JS
            $(document).ready(function() {
                    $('input.file').each(function(){
                    	var \$t = $(this);
						\$t.css({opacity:0,'z-index':-1})
						.wrap('<div class="fileupload"></div>')
						.wrap('<div class="fakefile"></div>')
						.after('<a class="{$jsClass}" onclick="openFileBrowser(this);"><span>{$jsText}</span></a>')
						.parent().before($('<input id="fake-'+\$t.attr('id')+'" name="fake-'+\$t.attr('id')+'" readonly="readonly" onclick="openFileBrowser(this);" type="text" $itemConfig/>')
						.removeClass('file'));
					});
                        
                    if($.browser.mozilla) {
                        $('.fileupload .file').css({'z-index':'1'});
                        $('.fakefile .uploadButton').css({'cursor':'pointer'});
                    }
                    if($.browser.msie) {
                        $('.fileupload .file').css({'z-index':'1','cursor':'pointer'});
                        //$('.fakefile .uploadButton').css({'color':'inherit'});
                    }
                    if($.browser.opera) {
                        $('.fileupload .file').css({'z-index':'1','left':'-60px'});
                        //$('.fakefile .uploadButton').css({'color':'inherit'});
                    }
            });         
JS
);
		return '<input onchange="writeFilePath(this);" type="file" '.$itemConfig2.' id="' . $id . '" name="' . $id . '"/>';     
	}

	/**
	 * Builds the id for a given field containing the id of the form
	 */
	protected function BuildId($name) {
		return $this->config['form']['id'] . '-' . $name;
	}

	protected function renderDisableDoubleSubmit() {
		return '<input type="hidden" name="fid" value="' . htmlentities($_SESSION['Forms'][$this->config['form']['id']]['sid'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '" />';
	}

	/**
	 * Returns a label
	 */
	protected function RenderLabel($name, $for='', $suffix = '', $attributes = array(), $class='') { 
		$name = $this->replaceWithValues($name);
		$name .= $suffix;
		
		if (stristr($attributes['validate'],'required' )) {
			$name .= $this->config['form']['requiredSuffix'];
		}
        
        if ($class) $class = ' class="'.$class.'" ';

//		if (is_array($attributes))
	//		$attributes = array_intersect_key($attributes, array('class' => ''));

		//	unset($attributes['class']);

		if ($for != '')
			$for = 'for="' . $for . '"';

		return '<label ' . $for . $class . '>' . $name . '</label>';
	}

	/**
	 * Returns a submit button - either as real button or as an image
	 */
	protected function renderSubmit() {
		$config = array('type' => 'submit');

		if (count($this->errors)>0){
//			$config['onmousedown'] .= '$(\'' . $this->config['form']['id'] . '\').submit.delay(10);';
		}

		if (is_array($this->config['form']['submit']) && $this->config['form']['submit']['type'] == 'link') {
			$this->config['form']['submit']['text'] = $this->replaceWithValues($this->config['form']['submit']['text']);
            
            if(!$this->config['form']['submit']['nosubmit'])
            $onclick = ' onclick="$(\'#' . $this->config['form']['id'] . '\').submit();" ';
            
			return '<div class="clear-button"><a href="javascript:;" '.$onclick.' class="'.$this->config['form']['submit']['class'].'"><span>'.$this->config['form']['submit']['text'].'</span></a></div>';
		} elseif (is_array($this->config['form']['submit']) && $this->config['form']['submit']['type'] == 'button') {
			if ($this->config['form']['submit']['wrap']) {
				$wrap = explode("|", $this->config['form']['submit']['wrap']);
			}
			return '<button type="submit" '.$this->getAttributes($this->config['form']['submit']).' >'.$wrap[0].$this->config['form']['submit']['text'].$wrap[1].'</button>';
		} else if (is_array($this->config['form']['submit'])) {
			$img = $this->uObj->getConfig($this->config['form']['submit']['conf']);

			$this->config['form']['submit']['text'] = htmlentities($this->replaceWithValues($this->config['form']['submit']['text'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false));

			$img['altText'] = $this->config['form']['submit']['text'];
			$img['file.']['10.']['text'] = $this->uObj->cObj->caseshift($img['altText'], 'upper');
			return '<input type="image" src="' . $this->uObj->cObj->IMG_RESOURCE($img) . '" alt="' . $this->config['form']['submit']['text'] . '" '.$this->getAttributes($config).'/>';
		}
		else {

			$this->config['form']['submit'] = $this->replaceWithValues($this->config['form']['submit']);
			return '<input type="submit" value="' . htmlentities($this->config['form']['submit'], ENT_QUOTES | ENT_HTML401, 'UTF-8', false) . '" '.$this->getAttributes($config).'/>';
	}
	}

	/**
	 * Typo3-Like splitting
	 * Forms::splitConf()
	 *
	 * @param mixed $conf
	 * @param integer $count
	 * @return
	 */
	protected function splitConf($conf, $count = 1) {
		$tmp = $GLOBALS['TSFE']->tmpl->splitConfArray(array('wrap' => $conf), $count);

		foreach ($tmp as $key => &$value) {
			$value = explode('|', $value['wrap']);
		}
		return $tmp;
	}


	/////////////////////////////////////////////////////////////////////////////
	// Processing
	/////////////////////////////////////////////////////////////////////////////
	/**
	 * Processes the submitted data according the following scheme:
	 * 1. Assign either GET or POST data
	 * 2. Text representation of selectboxes get assigned
	 * 3. The data gets validated
	 * 4.a If no error occured during validation:
	 * 4.a.1. The data is saved into the database
	 * 4.a.1. The configured emails will be sent out
	 * 4.a.1. The configured success message will be returned
	 * 4.b If at least one error occured:
	 * 4.b.1 The form is rendered containing error messages
	 * 5. If no data is present, the form gets rendered
	 * @param bool $process defines if the form get's processed or only displayed
	 * @return mixed the string
	 */
	public function Process($process = true) {

		session_start();

		$this->callProcessCallbacks($this->config['form']['initProcess']);

		$this->fetchTranslations();

		if ($this->config['form']['disableDoubleSubmit']) {
			if ($_SESSION['Forms'][$this->config['form']['id']]['sid'] != $_POST['fid'])
				$process = false;

			$_SESSION['Forms'][$this->config['form']['id']]['sid'] = md5(microtime());
		}
		if ((!isset($this->config['form']['success']) || $_GET['success'] == $this->config['form']['success']) && (($this->config['form']['method'] == 'post' && $_POST) || ($this->config['form']['method'] == 'get' && $_GET)  )  ) {

			$this->processInput();

			foreach ($this->config['columns'] as $name => &$item) {
				if ($item['config']['userFunc'] && $item['config']['type'] != 'output') {
					if (strpos($item['config']['userFunc'], '->') !== false) {
						$item['config']['userFunc'] = explode('->', $item['config']['userFunc']);
						$item['value'] = call_user_func_array($item['config']['userFunc'], array($this->config['columns']));
					}
					$item['valueText'] = $item['value'];
				}
                
									
                if (count($this->errors)==0 && $item['config']['type'] == 'file') {
					if ($item['value']['error'] == 0) {
						$item['valueText'] = $item['value']['name'];
                        $fname = $this->getFilenameForUpload($item, $name);
						if ($fname) {
							rename($item['value']['tmp_name'], PATH_site . $item['config']['uploadfolder'] . $fname);
							chmod(PATH_site . $item['config']['uploadfolder'] . $fname,0755);
							$item['value'] = $item['config']['uploadfolder'] . $fname;
						}
                    }
                    else {
                        $item['value'] = '';
                        $item['valueText'] = '';
                    }
				}
			}


			$this->callProcessCallbacks($this->config['form']['preProcess']);
			if (count($this->errors) == 0 && $process) {
				$successFull = $this->Save();
				$this->callProcessCallbacks($this->config['form']['onSuccess']);
				$this->processMails();
                $this->successfullyProcessed = true;

				if ($this->config['form']['successMessage'])
					$content .= $this->replaceWithValues($this->config['form']['successMessage']);
                    if ($this->config['form']['successParam']) {
                        $content.= t3lib_div::wrapJS("_gaq.push(['_trackPageview', '".$_SERVER['REQUEST_URI']."?success=".$this->config['form']['successParam']."']);");
                    }
				else
					$content = $successFull;
				}
                else if (count($this->errors)>0 && process) {
					if ($this->config['form']['store'] == 'session') {
						$_SESSION[$this->config['form']['id']] = $this->config['columns'];
					}
					$content .= $this->Render();
                }
				else {
					$content .= $this->Render();
				}

			}
            else if ($_GET['error']) {
				if ($this->config['form']['store'] == 'session' && $_SESSION[$this->config['form']['id']]) {

					foreach ($_SESSION[$this->config['form']['id']] as $name => $item) {

						$this->config['columns'][$name]['value'] = $item['value'];
						$this->config['columns'][$name]['valueText'] = $item['valueText'];
						$this->config['columns'][$name]['isValid'] = $item['isValid'];

						if ($item['config']['default'])
							$this->config['columns'][$name]['config']['default'] = $item['config']['default'];

						if ($this->config['columns'][$name]['config']['validate'] && !$item['isValid'])
							$this->setError($this->config['columns'][$name], $name);
					}
					unset($_SESSION[$this->config['form']['id']]);
				}

				$content .= $this->Render();
            }
			else {
				$content .= $this->Render();
			}

		$this->callProcessCallbacks($this->config['form']['postProcess']);

		return $content;
	}


	/**
	 * Processed user defined functions if available
	 * Forms::callProcessCallbacks()
	 *
	 * @param mixed $callback
	 * @return void
	 */
	protected function callProcessCallbacks($callback) {

		$value = true;

		if ($callback) {
			if (!is_array($callback))
				$callback = explode("\n", $callback);

			foreach ($callback as $func) {
				$func = explode("->", $func);
				$result = call_user_func_array($func, array($this, $this->config));
				$value &= $result['success'];
				if(!$value) $this->config['errors'][$result['field']]['process'] = $result['error'];
			}
		}

		if (!$value)
			$this->errors[] = 'Error';
	}


	/**
	 * Processes the form input via post
	 * Forms::processPost()
	 *
	 * @return void
	 */
	protected function processInput() {
		session_start();

		foreach ($this->config['columns'] as $name => &$item) {
			if (in_array($item['config']['type'], array('const', 'output')))
				continue;

			$tmp = $this->config['form']['method'] == "post" ? t3lib_div::_POST($this->BuildId($name)) : t3lib_div::_GET($this->BuildId($name));

			$label = $item['label'];
			if ($this->isRequiredField($item))
				$label .= $this->config['form']['requiredSuffix'];

			$item['value'] = ($tmp == $label) ? '' : $tmp;
			
			$item['value'] = $tmp;
			if ($item['config']['inlineLabel']) {
				if ($tmp == $label)
					$item['value'] = '';
			}			

			if ($item['config']['type'] == 'date' && $item['value']) {
				$dateValues = explode('.', $item['value']);
				$item['valueText'] = $item['value'];
				$item['value'] = mktime(0, 0, 0, $dateValues[1], $dateValues[0], $dateValues[2]);
			}

			if ($item['config']['type'] == 'calendar' && $item['value']) {
				$item['value'] = round($item['value'] / 1000);
				$item['valueText'] = $this->config['form']['method'] == "post" ? t3lib_div::_POST($this->BuildId($name) . 'Text') : t3lib_div::_GET($this->BuildId($name) . 'Text');
			}

			if ($item['config']['type'] == 'file'){
				$item['value'] = $_FILES[$this->BuildId($name)];
			}
			
			if ($item['config']['type'] == 'table') {
				list($item['value'], $item['valueText'], $item['valueArray']) = $this->processTable($item,$name);
				continue;
			}

			if ($item['config']['type'] == 'check') {
				if (!is_array($item['config']['items']) && $item['config']['items'] != '')
					$item['config']['items'] = $this->getTranslationItems($item['config']['items']);
				
				for ($i = 0; $i < count($item['config']['items']); $i++) {
					$txt = $this->replaceWithValues($item['config']['items'][$i][0]);
					$item['valueText'] .= ((($item['value'] | pow(2, $i)) == $item['value']) ? '[x] ' . $txt : '[ ] ' . $txt) . "\r\n";
				}
			}


			// Validation
			if ($item['config']['validate'] && $this->evalDisplayCondition($item['config']['displayCond'])) { // edit RP: check if the field was visible
				$item['isValid'] = Validator::Validate($item['value'], $item['config']['validate']);
			}

			if ($item['config']['validate'] && $item['isValid'] !== true && $this->evalDisplayCondition($item['config']['displayCond'])) {
				$this->setError($item, $name);
			}
			if (isset($item['value']) && !$item['config']['defaultOverridesValue']) {
				$item['config']['default'] = $item['value'];
			}
			if (in_array($item['config']['type'], array('select', 'radio'))) {
				if ($item['config']['type'] == 'radio')
					$item['value']--;
				$item['valueText'] = $this->getSelectValue($item['value'], $item['config']);

				if ($item['config']['saveText'])
					$item['config']['default'] = $item['valueText'];
            	}
            	else {
				if (!isset($item['valueText']))
					$item['valueText'] = $item['value'];
			}
		}
		if (!$this->config['form']['disableCSRF']) {
			$csrfResult = Validator::Validate($this->config['form']['method'] == "post" ? t3lib_div::_POST($this->BuildId('csrf')) : t3lib_div::_GET($this->BuildId('csrf')), 'csrf');
			if ($csrfResult !== true) {
				$this->setError($csrfResult, 'csrf');
			}
		}
	}


	/**
     * Returns a unique new filename for the given item
     * @param item
     */  
    protected function getFilenameForUpload($item,$name) {
		$count = '1';
		$targetNameTmp = str_replace(array('Ä', 'Ö', 'Ü', 'ä', 'ö', 'ü', 'ß'), array('Ae', 'Oe', 'Ue', 'ae', 'oe', 'ue', 'ss'), $item['value']['name']);
		$fileExt = end(explode('.', $targetNameTmp));

		$fileTypes = explode(',', strtolower($item['config']['fileTypes']));
		if (!in_array(strtolower($fileExt), $fileTypes)) {

			$this->config['columns'][$name]['errorMessages']['error_upload'] = sprintf($this->replaceWithValues($this->config['form']['errorMessages']['file']), strtoupper($item['config']['fileTypes']));
			$this->config['columns'][$name]['isValid'] = array('error_upload');
			$this->setError($this->config['columns'][$name], $name);
			return;

		}

		if ($item['config']['renameTo']) {
			$targetNameTmp = $item['config']['renameTo'] . '.' . $fileExt;
		} else
			if ($item['config']['encrypt']) {
				switch ($item['config']['encrypt']) {
					case 'md5':
						$targetNameTmp = md5($item['value']['name'] . microtime()) . '.' . $fileExt;
						break;
					case 'sha1':
						$targetNameTmp = sha1($item['value']['name'] . microtime()) . '.' . $fileExt;
						break;
					case 'crc32':
						$targetNameTmp = crc32($item['value']['name'] . microtime()) . '.' . $fileExt;
						break;
				}
			}
		$found = true;

		while ($found) {
			$targetName = str_replace('.' . $fileExt, $count . '.' . $fileExt, $targetNameTmp);
			$found = file_exists(PATH_site . $item['config']['uploadfolder'] . $targetName);

			$count++;
		}
		return $targetName;
    }
        
	/**
	 * Sets the state of given item, that it contains an error
	 * Forms::setError()
	 *
	 * @param mixed $item
	 * @param mixed $name
	 * @return void
	 */
	public function setError(&$item, $name) {
		if ($item['isValid'] !== true)
			$this->errors[$name] = $item;

		$item['config']['class'] .= ' error ';
		$item['label'] = $this->replaceWithValues($item['label']);


		foreach ($item['isValid'] as $key => $value) {
			$errMsg[] = str_replace('###FIELD###', $item['label'],  $item['errorMessages'][$value]);
		}

		$this->config['errors'][$name] = str_replace('###FIELD###', $item['label'], $errMsg);
	}

	/**
	 * Processes the sub table data
	 */
	protected function processTable($item,$name) {
		$length = count(t3lib_div::_POST($this->BuildId($name.'-'.key($item['config']['columns']))));

		$valArr = array();
		foreach ($item['config']['columns'] as $key => $column) {
			$strlenCol[$key] = function_exists("mb_strlen") ? mb_strlen($column['label']) : strlen($column['label']);
			$valArr[0][$key] = $this->replaceWithValues($column['label']);
		}

		for ($i = 0; $i < $length; $i++) {
			foreach ($item['config']['columns'] as $key => $column) {
				$tmpVal = t3lib_div::_POST($this->BuildId($name.'-'.$key));
				$valArr[$i + 1][$key] = $tmpVal[$i];
				$strlenCol[$key] = max($strlenCol[$key], strlen($tmpVal[$i]));
			}
		}

		foreach ($valArr as $rowKey => $row) {
			foreach ($row as $colKey => $column) {
				$tmpArray[$colKey] = str_pad($column, $strlenCol[$colKey] + 4);
			}
			$rowText = @implode("", $tmpArray);
			if (trim($rowText) != "") {
				$textArray[$rowKey] = $rowText;
			}
		}

		$valueText = @implode("\n", $textArray);
		if (trim($valueText) == "") {
			$length = 0;
			$valueText = "";
		}

		array_shift($valArr);

		return array($length, $valueText, $valArr);

	}

	/**
	 * Returns the textual representation of the value of a select box field
	 * Forms::getSelectValue()
	 *
	 * @param mixed $value
	 * @param mixed $config
	 * @return string value
	 */
	protected function getSelectValue($value, $config) {
		$this->execIProcFunc($config);

		if (!is_array($config['items'])) {
			$config['items'] = $this->getTranslationItems($config['items']);
		}

		foreach ($config['items'] as $item) {
			$selected = $default == $item[1] ? ' selected="selected" ' : '';
			if ($item[1] == $value)
				$content = $item[0];
		}

		if ($config['foreign_table']) {
			$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery($config['foreign_table_prefix'] . 'uid,' . $config['foreign_table_field'] . ' as title', $config['foreign_table'], $config['foreign_table_prefix'] . 'uid = "' . mysql_real_escape_string($value) . '" ' . $config['foreign_table_where'], '', '');
			if ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
				$content = $row['title'];
			}
		}

		if ($config['range']['valueFormat']) {
			$content = sprintf($config['range']['valueFormat'], $value);
		}

		return $content;
	}

	/**
	 * Saves the form to defined storage
	 * Forms::Save()
	 *
	 * @return bool
	 */
	public function Save() {
		$store = explode(",", $this->config['form']['store']);
		foreach ($store as $storageMethod) {
			switch ($storageMethod) {
				case 'session':
					$this->insertIntoSession();
					break;
				case 'db':
					$this->InsertIntoDBNew();
					break;
				case 'none':
				default:
					$this->InsertIntoDB();
					break;
			}
		}
		return true;
	}


	/**
	 * New storage solution which allows saving the columns in different tables
	 * Forms::InsertIntoDBNew()
	 *
	 * @return void
	 */
	public function InsertIntoDBNew() {
		foreach ($this->config['tables'] as $table => $config) {
			$saveTable = array();
			$rows = explode(',', $config['columns']);
			foreach ($rows as $row) {
				if ($this->config['columns'][$row]['config']['type'] == 'table')
                    $saveTable[] = array('item' => $this->config['columns'][$row], 'name' => $row);
				if ($this->config['columns'][$row]['value'])
					$tables[$table][$row] = $this->config['columns'][$row];
			}
			//$save[$table][$name] = $item['config']['saveText'] ? $item['valueText'] : $item['value'];
			if($config['trigger']) {
				$config['trigger'] = explode('->', $config['trigger']);
				$operationDone = call_user_func_array($config['trigger'], array($table, $this->config['columns']));
				if($operationDone) continue;
			}

			if ($config['parent']) {
				$pConfig = explode('.', $config['parent']);
				$config['parentColumn'] = $config['parentColumn'] == "" ? 'parent' : $config['parentColumn'];

				$tables[$table][$config['parentColumn']]['value'] = $parents[$pConfig[0]][$pConfig[1]];
				if (!$config['noParentTable']) {
				$tables[$table]['parent_table']['value'] = $pConfig[0];
			}
			}

			if ($config['exists']) {
				$parent = $this->getRow($table, $tables[$table], $config);

				if ($parent == null)
					$parent = $this->insertTable($table, $tables[$table], $config);
				else 
					$this->updateTable($table, $tables[$table], $config);
                    
				$operationDone= true;
				$parents[$table] = $parent;
				$this->config['tables'][$table]['insertedRecord'] = $parent;
			}

			if (!$operationDone) {
				$parent = $this->insertTable($table, $tables[$table], $config);
				$this->config['tables'][$table]['insertedRecord'] = $parent;
			}
            if (!empty ($saveTable)) {
				$this->saveTable($saveTable,$parent);
			}
			$operationDone = false;
		}
	}

	protected function saveTable($items,$parent) {
		foreach ($items as $key => $item) {
			foreach ($item['item']['valueArray'] as $key => $value) {
				$value[$item['item']['config']['foreign_field']] = $parent['uid'];
				$GLOBALS['TYPO3_DB']->exec_INSERTquery($item['item']['config']['foreign_table'], $value);
			}
		}
	}

	protected function buildWhere($fields, $config) {
        if (!$config['exists']) {
            $config['exists']='uid';
        }
		if ($config['exists']) {
            $sqlFields = explode(',', $config['exists']);
    		foreach ($sqlFields as $field) {
    			$sql .= ' AND ' . $field . ' = "' . mysql_real_escape_string($fields[$field]['value']) . '"';
    		}
        }

		return $sql;
	}

	protected function getRow($table, $fields, $config) {
		
        $sql = $this->buildWhere($fields, $config);

		$res = $GLOBALS['TYPO3_DB']->exec_SELECTquery('*', $table, 'deleted=0 ' . $sql, '', '');
		return $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res);
	}

	protected function insertTable($table, $fields, $config) {
		foreach ($fields as $key => $value) {
			if ($value['value'])
				$row[$key] = $value['config']['saveText'] ? $value['valueText'] : $value['value'];
		}

		$GLOBALS['TYPO3_DB']->exec_INSERTquery($table, $row);
        $fields['uid']['value'] = $GLOBALS['TYPO3_DB']->sql_insert_id();
        return $this->getRow($table, $fields, $config);
	}

	protected function updateTable($table, $fields, $config) {
		$sql = $this->buildWhere($fields, $config);

		foreach ($fields as $key => $value) {
			if ($value['value'])
				$row[$key] = $value['config']['saveText'] ? $value['valueText'] : $value['value'];
		}

		unset($row['crdate']);
		$GLOBALS['TYPO3_DB']->exec_UPDATEquery($table, 'deleted=0 ' . $sql, $row);
	}
	/**
	 * Inserts the data into the database
	 */
	public function InsertIntoDB() {
		foreach ($this->config['columns'] as $name => $item) {
			if ($item['config']['suppress'] == 1)
				continue;

			$insertArray[$name] = $item['config']['saveText'] ? $item['valueText'] : $item['value'];
		}

		$GLOBALS['TYPO3_DB']->exec_INSERTquery($this->config['form']['table'], $insertArray);
		$parentId = $GLOBALS['TYPO3_DB']->sql_insert_id();
		foreach ($this->config['columns'] as $name => $item) {
			if ($item['config']['type'] == 'table' && $item['value'] != 0) {
				$length = count(t3lib_div::_POST($this->BuildId(key($item['config']['columns']))));

				for ($i = 0; $i < $length; $i++) {

					foreach ($item['config']['columns'] as $key => $column) {
						$tmpVal = t3lib_div::_POST($this->BuildId($key));
						$insertSubArray[$key] = $tmpVal[$i];

					}

					if (trim(implode("", $insertSubArray)) != "") {
						$insertSubArray[$item['config']['foreign_field']] = $parentId;
						$GLOBALS['TYPO3_DB']->exec_INSERTquery($item['config']['foreign_table'], $insertSubArray);
						unset($insertSubArray);
					}
				}
			}
		}
	}

	/**
	 * Saves the processed date in the session variable
	 */
	protected function insertIntoSession() {
		foreach ($this->config['columns'] as $name => $item) {
			if ($item['config']['suppress'] == 1)
				continue;

			if ($item['config']['type'] == 'table' && $item['value'] != 0) {
				$length = count(t3lib_div::_POST($this->BuildId(key($item['config']['columns']))));
				for ($i = 0; $i < $length; $i++) {
					foreach ($item['config']['columns'] as $key => $column) {
						$tmpVal = t3lib_div::_POST($this->BuildId($key));
						$insertSubArray[$key] = $tmpVal[$i];
					}
					$insertArray[$name][] = $insertSubArray;
				}
				}
                else {
				$insertArray[$name] = $item['config']['saveText'] ? $item['valueText'] : $item['value'];
			}
		}
		session_start();
		$_SESSION[$this->config['form']['id']] = $insertArray;
	}

	/**
	 * Process the email configuration array
	 */
	public function processMails() {
		foreach ($this->config['email'] as $key => $value) {
			$this->sendMail($value);
		}
	}

	/**
	 * Sends the given email
	 */
	public function sendMail($config) {
		// check against an user function, if this email must be sent
		if ($config['trigger']) {
			if (strpos($config['trigger'], '->') != false)
				$config['trigger'] = explode('->', $config['trigger']);
			$sendMail = call_user_func_array($config['trigger'], array($this->config['columns']));
			if (!$sendMail)
				return false;
		}
        

		$mail = new PHPMailer();
		$mail->CharSet = "utf-8";
		$mail->IsMail();
		$mail->IsHTML($config['isHTML']);
		$mail->From = $this->replaceWithValues($config['from']);
		$mail->FromName = $this->replaceWithValues($config['fromName']);

		$tos = explode(';', $config['to']);
		foreach ($tos as & $to) {
			$to = $this->replaceWithValues($to);
			$mail->AddAddress($to);
		}

		if ($config['bcc']) {
			$bccs = explode(';', $config['bcc']);
			foreach ($bccs as $bcc) {
				$to = $this->replaceWithValues($to);
				$mail->AddBCC($bcc);
			}
		}

		// Assign the subject - either from the translation table or from a string
        $config['subject'] = explode(" ", $config['subject']);
        foreach ($config['subject'] as &$value) {
            $value = $this->replaceWithValues($value);
        }
        $config['subject'] = implode(" ", $config['subject']);
        
		$mail->Subject = $this->replaceWithValues($config['subject']);

		// Assign the email template - either from the translation table or from a file
		$body = $this->replaceWithValues($config['template']);

		// Fill the email template with the labels and the field values
		foreach ($this->config['columns'] as $name => $item) {
			// edit RP - if field is not visible then hide it in the email
			if(!$this->evalDisplayCondition($item['config']['displayCond'])) continue;

			if ($item['config']['type'] == 'file') {
			  	if (in_array($key, $item['config']['sendAsAttachment']) && $item['value'] != '' ) {
//                	if (file_exists(PATH_site . $item['value']))
//						$mail->AddAttachment(PATH_site . $item['value']);
				}
				
				if (in_array($key, $item['config']['sendAsLink']) && $item['value'] != '' ) {
                	$item['valueText'] = 'http://' . $_SERVER['HTTP_HOST'] . $item['value'];
                }
			}

			if (empty($item['valueText'])) {
				$item['valueText'] = $item['value'];
			}

			if (empty($item['valueText'])) {
				$item['valueText'] = '-';
			}

			$item['label'] = $this->replaceWithValues($item['label']);
			$item['valueText'] = $this->replaceWithValues($item['valueText']);
			$value = strip_tags($item['valueText']);

			// Replace Placeholders in Subject
			$mail->Subject = str_replace('###' . strtoupper($name) . '###', $value, $mail->Subject);
			$mail->FromName = str_replace('###' . strtoupper($name) . '###', $value, $mail->FromName);
			$mail->From = str_replace('###' . strtoupper($name) . '###', $value, $mail->From);

			if (!$config['isHTML']) {
				$body = str_replace('###' . strtoupper($name) . '_LABEL###', strip_tags($item['label'].$this->config['form']['labelSuffixEmail']), $body);
				$body = str_replace('###' . strtoupper($name) . '###', $value, $body);
				}
				else {
				$body = str_replace('###' . strtoupper($name) . '_LABEL###', $item['label'].$this->config['form']['labelSuffix'], $body);
				$body = str_replace('###' . strtoupper($name) . '###', $item['valueText'], $body);
			}
		}
		$body = preg_replace_callback('/###LLL:(\w*)###/', create_function('$id', 'return Translations::Fetch($id[1]);'), $body);
		$body = preg_replace('/###[^#]*###/', '', $body);
		
		$mail->Body = $body;
		$mail->WordWrap = 0;
		//var_dump($mail);
		return $mail->send();
	}

	////////////////////////////////////////////////////////////////////////////
	// HELPER functions
	////////////////////////////////////////////////////////////////////////////

	/**
	 * Replaces given value with a value either from other columns or from an user function
	 * :columnName results in the value from the columnName
	 * ->functionName will call given function
	 */
	protected function replaceWithValues($value) {
		if (strpos($value, 'FIELD:') === 0) {
			$tmp = explode(':', $value);
			if ($tmp[2] == 'VALUE')
				$value = $this->config['columns'][$tmp[1]]['value'];
			else
				$value = $this->config['columns'][$tmp[1]]['valueText'];
		}

		if (strpos($value, 'LLL:') === 0)
			$value = Translations::Fetch(str_replace('LLL:', '', $value), $GLOBALS['TSFE']->type);

		if (strpos($value, 'FILE:') === 0)
			$value = file_get_contents(PATH_site . str_replace('FILE:', '', $value));

		if (strpos($value, 'TMPL:') === 0)
			$value = Templates::Fetch(str_replace('TMPL:', '', $value), $GLOBALS['TSFE']->type);


		if (strpos($value, '->') !== false) {
			$func = explode('->', $value);
			$config['items'] = call_user_func_array($func, array($this->config));
		}

		return $value;
	}

	protected function getTranslationItems($id, $start=0) {
		$items = explode('|', $this->replaceWithValues($id));
		$i = $start;
		foreach ($items as $item) {
			if ($item == '-')
				$result[] = array('---------------', '--div--');
			else {
				$result[] = array($item, $i);
				$i++;
			}
		}

		return $result;
	}

	function getErrorMessage() {
        return $this->config['errors'];
	}
	function setErrorMessage($error,$field) {
        if(is_array($error)&&!empty($error))
            $this->config['errors'][] = $error;
        elseif($field)
            $this->setError($this->config['columns'][$field],$field);
	
    }
    
	function getDayOptionString($selectedId = '', $noValue = '') {
		if ($noValue)
			$content .= '<option value="-1">' . $noValue . '</option>';

		for ($i = 1; $i <= 31; $i++) {
			$selected = ($i == $selectedId) ? 'selected="selected"' : '';

			$content .= '<option value="' . $i . '" ' . $selected . '>' . ($i) . '</option>';
		}
		return $content;
	}

	function getMonthOptionString($selectedId = '', $noValue = '') {
		if ($noValue)
			$content .= '<option value="-1">' . $noValue . '</option>';

		for ($i = 1; $i <= 12; $i++) {
			$selected = ($i == $selectedId) ? 'selected="selected"' : '';

			$monthT = mktime(0, 0, 0, $i, 1, 2009);
			$content .= '<option value="' . $i . '" ' . $selected . '>' . utf8_encode(strftime("%B", $monthT)) . '</option>';
		}
		return $content;
	}

	function getYearOptionString($selectedId = '', $order, $min, $max, $noValue = '') {
		if ($noValue)
			$content .= '<option value="-1">' . $noValue . '</option>';

		if (strtolower($order) == 'desc') {
			$step = -1;
			$start = $max;
			$end = $min - 1;
			}
			else {
			$step = 1;
			$start = $min;
			$end = $max + 1;
		}

		for ($i = $start; $i != $end; $i += $step) {
			$selected = ($i == $selectedId) ? 'selected="selected"' : '';
			$content .= '<option value="' . $i . '" ' . $selected . '>' . $i . '</option>';
		}
		return $content;
	}

	function execIProcFunc(&$config) {
		if ($config['IProcFunc']) {
			if (strpos($config['IProcFunc'], '->') != false)
				$config['IProcFunc'] = explode('->', $config['IProcFunc']);

			$config['items'] = call_user_func_array($config['IProcFunc'], array($config, $this->config));
		}
	}

	protected function fetchTranslations() {

		foreach ($this->config['columns'] as $key => &$value) {
			$value['label'] = $this->replaceWithValues($value['label']);

			if ($value['config']['validate']) {
				if (!$value['errorMessages']) {
					$validators = explode(';', $value['config']['validate']);
					foreach ($validators as $validator) {
						$valids = explode(',', $validator);
						$msg = $this->config['form']['errorMessages'][$valids[0]];
						$msg = $this->replaceWithValues($msg);

						$msg = str_replace('###FIELD###', $value['label'], $msg);
						for ($i = 1, $c = count($valids); $i <= $c; $i++)
							$msg = str_replace('###PARAM' . $i . '###', $valids[$i], $msg);

						$value['errorMessages'][$valids[0]] = $msg;
					}
				}
			}
		}
	}
}

?>