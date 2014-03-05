<?PHP

/* * *************************************************************
 * Form Validation
 * $Id: class.Validator.php 11 2010-01-04 12:54:59Z mwallner $
 * ************************************************************* */

class Validator {

	public static function Validate($input, $config) {
		$tmp = new self();
		$configs = explode(';', $config);

		foreach ($configs as $config) {
			$cc = explode(',', $config);

			if (!call_user_func_array(array($tmp, 'Validate' . $cc[0]), array($input, $cc))) {
				$isValid[] = $cc[0];
			}
		}

		if (is_array($isValid))
			return $isValid;
		else
			return true;
	}

	protected function validateRegex($input, $config) {
		return preg_match($config[1], $input) == 1;
	}

	protected function validateHoneypot($input, $config) {
		if ($_REQUEST[$config[1] . '-email'] == "" && $_REQUEST[$config[1] . '-first_name'] == "" && $_REQUEST[$config[1] . '-last_name'] == "") {
			return true;
		}
		return false;
	}

	protected function validateCaptcha($input, $config) {
		session_start();
		$current = microtime(true);
		if ($current - $_SESSION['form_rendering_start'] < $config[1] && $_REQUEST['b6fd75d8-captcha-check'] == 1) {
			$isValid = (strtoupper($input) == $_SESSION['captcha_text']);
			$_SESSION['captcha_text'] = '';
			unset($_SESSION['captcha_text']);
			return $isValid;
		}
		return true;
	}

	protected function validateRecaptcha($input, $config) {
		session_start();
		$current = microtime(true);
		if ($current - $_SESSION['form_rendering_start'] < $config[1] && $_REQUEST['b6fd75d8-captcha-check'] == 1) {
			$privatekey = $config[2];
			$resp = recaptcha_check_answer($privatekey, $_SERVER["REMOTE_ADDR"], $_POST["recaptcha_challenge_field"], $_POST["recaptcha_response_field"]);
			return $resp->is_valid;
		}

		return true;
	}

	protected function validateCalcCaptcha($input, $config) {
		session_start();
		$isValid = ($input == $_SESSION['captcha_result']);
		$_SESSION['captcha_result'] = '';
		unset($_SESSION['captcha_result']);
		return $isValid;
	}

	protected function validateRequired($input, $config) {
		if($input['tmp_name']) return true; // $_FILES lg RP
		if ($config[1]) {
			if ($config[1] == $input)
				return false;
		}
		if (is_numeric($input))
			return ($input != 0);
		else
			return strlen($input) > 0;
	}

	protected function validateCreditCard($input, $config = array()) {
		$cards = array(
			'visa' => '4[0-9]{12}(?:[0-9]{3})?',
			'mastercard' => '5[1-5][0-9]{14}',
			'american' => '3[47][0-9]{13}',
			'diners' => '3(?:0[0-5]|[68][0-9])[0-9]{11}',
			'discover' => '6(?:011|5[0-9]{2})[0-9]{12}',
			'jcb' => '(?:2131|1800|35\d{3})\d{11}',
		);

		if (count($config) > 1) {
			for ($i = 1; $i < count($config); $i++) {
				$tmp[] = $cards[$config[$i]];
			}

			$nConfig[1] = '/^(?:' . implode('|', $tmp) . ')$/';
		}
		else
			$nConfig[1] = '/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/';

		return $this->validateRegex($input, $nConfig);
	}

	protected function validateEmail($input, $config = array()) {
		if ($input == '')
			return true; // warum?
		$config[1] = '/^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,6}$/';
		return $this->validateRegex($input, $config);
	}

	protected function validateUrl($input, $config = array()) {
		if ($input == '')
			return true; // warum?
		$nConfig[1] = '/^(?#Protocol)(?:(?:ht|f)tp(?:s?)\:\/\/|~/|/)?(?#Username:Password)(?:\w+:\w+@)?(?#Subdomains)(?:(?:[-\w]+\.)+(?#TopLevel Domains)(?:[a-z]{2,6}))(?#Port)(?::[\d]{1,5})?(?#Directories)(?:(?:(?:/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|/)+|\?|#)?(?#Query)(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?#Anchor)(?:#(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)?$/';
		return $this->validateRegex($input, $nConfig);
	}

	protected function validateNum($input, $config = array()) {
		$nConfig[1] = '/^[0-9]*$/';
		return $this->validateRegex($input, $nConfig);
	}

	protected function validatePhone($input, $config = array()) {
		return $this->validateRegex($input,array(1 => '/^[\+]?[0-9\/ ()-]*$/'));
	}

	protected function validateLength($input, $config = array()) {
		if ($input == "")
			return true;

		$isValid = strlen($input) >= $config[1];
		if ($config[2])
			$isValid &= strlen($input) <= $config[2];

		return $isValid;
	}

	protected function validateNumber($input, $config = array()) {
		return is_numeric($input) || $input == '';
	}

	protected function validateDate($input, $config = array()) {

		if (!$input)
			return true;

		if ($config[1]) {
			$minDateValues = explode('.', $config[1]);
			$minDate = mktime(0, 0, 0, $minDateValues[1], $minDateValues[0], substr($minDateValues[2], -2));
			if ($minDate > $input)
				return false;
		}

		if ($config[2]) {
			$maxDateValues = explode('.', $config[2]);
			$maxDate = mktime(0, 0, 0, $maxDateValues[1], $maxDateValues[0], substr($maxDateValues[2], -2));
			if ($maxDate < $input)
				return false;
		}

		return true;
	}

	protected function validateList($input, $config = array()) {
		array_shift($config);  // edit RP: skip first item in array because its the validation name (list) which should not be evaluated as true
		return in_array($input, $config);
	}

	protected function validateRange($input, $config = array()) {
		if (!is_numeric($input))
			return false;

		$isValid = ($input >= $config[1]);
		if ($config[2])
			$isValid &= $input <= $config[2];

		return $isValid;
	}

	protected function validateCsrf($input, $config = array()) {
		session_start();
		$isValid = ($input == $_SESSION['csrf_token']);
		$_SESSION['csrf_token'] = '';
		unset($_SESSION['csrf_token']);

		return $isValid;
	}

	protected function validateIsnot($input, $config = array()) {
		$isnot = t3lib_div::_POST($config[1]);
		if ($input != $isnot)
			return true;
		else
			return false;
	}

	protected function validateIssame($input, $config = array()) {
		$isnot = t3lib_div::_POST($config[1]);
		if ($input == $isnot)
			return true;
		else
			return false;
	}

	protected function validateUniqueusername($input, $config = array()) {
		$orig = t3lib_div::_POST($config[1]);
		if ($input == $orig)
			return true;

		$model = ShopModel::GetInstance();
		return !$model->UserExists($input);
	}

	protected function validateBirthday($input, $config = array()) {
		$year = intval($input);
		$day = intval(t3lib_div::_POST($config[1]));
		$month = intval(t3lib_div::_POST($config[2]));

		if ($day || $month || $year) {
			return checkdate($month, $day, $year);
		}
		return true;
	}

}

?>