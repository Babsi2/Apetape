<?php

namespace Pixelart\Classes\Forms;

use Pixelart\Classes\Utils\Translations;
use Pixelart\Classes\Base\Utils;

/**
 * Hilfsklassen für häufig verwendete Funktionen von Formularen
 */
class FormHelper {
	/**
	 * Generiert eine Anrede
	 *
	 * @param array $fields
	 * @return string
	 */
	public static function generateSalutation(&$fields) {
		$msg = explode('|', Translations::Fetch('vsalutations'));
		$title = (trim($fields['title']['value']) != '') ? ' ' . $fields['title']['value'] : '';
		return str_replace(array('###GENDER###', '###LAST_NAME###', '###TITLE###'), array($fields['gender']['valueText'], $fields['last_name']['value'], $title), $msg[$fields['gender']['value']]);
	}

	/**
	 * generiert einen Namen
	 * @param array $fields
	 * @return string
	 */
	public static function generateName(&$fields) {
		return $fields['first_name']['valueText'] . ' ' . $fields['last_name']['valueText'];
	}

	/**
	 * Generiert einen Hash aus der E-Mail
	 *
	 * @param array $fields
	 * @return string
	 */
	public static function generateHash(&$fields) {
		return md5($fields['email']['value'].time());
	}

	/**
	 * Funktion zur Ermittlung eines Abstands zwischen <option> Elementen
	 *
	 * @param int $old
	 * @param int $new
	 * @return boolean
	 */
	public static function countrySeperator($old, $new) {
		return abs($old - $new) > 1;
	}

	/**
	 * Generiert einen Link
	 *
	 * @param array $fields
	 * @return string
	 */
	public static function generateLink(&$fields) {
		$uObj = utils::GetInstance();
		return 'http://' . $_SERVER['HTTP_HOST'] .'/'. $uObj->makeLink($fields['link']['config']['linkVal'], array('confirm' => md5($fields['email']['value'])));
	}

	/**
	 * Schreibt den übergegebenen Wert in die angegeben Spalte
	 *
	 * @param string $hash
	 * @param string $field
	 * @param mixed $value
	 */
	public static function updateNewsletter($hash, $field, $value) {
		$GLOBALS['TYPO3_DB']->exec_UPDATEquery('tt_address', 'hash="'.$hash.'"', array($field => $value));
	}

	/**
	 * Gibt den Benutzernamen zurück (=E-Mail)
	 *
	 * @param array $conf
	 * @return string
	 */
	public static function getUsername($conf) {
		return $conf['email']['value'];
	}

	/**
	 * Gibt das verschlüsselte Passwort zurück
	 *
	 * @param array $conf
	 * @return string
	 */
	public static function getPassword($conf) {
		if (empty($conf['disp_password']['value'])) {
			return $conf['disp_password']['origValue'];
		} else {
			return md5($conf['disp_password']['value']);
		}
	}
	/**
	 * Gibt ein zufälliges Passwort zurück
	 *
	 * @return string
	 */
	public static function getRandomPassword($length = 3, $numLength = 2, $consonant = "bcdfghklmnprstvwxz", $vowels = "aeou", $digits = "23456789") {
		$newpass = "";
		mt_srand((double)microtime()*1000000);

		for ($i = 0; $i < $length; $i++) {
		  $newpass .= $consonant[mt_rand(0, strlen($consonant)-1)];
		  $newpass .= $vowels[mt_rand(0, strlen($vowels)-1)];
		}

		for ($i = 0; $i < $numLength; $i++) {
		  $newpass .= $digits[mt_rand(0, strlen($digits)-1)];
		}

		return $newpass;
	}
	
	public static function sendNewsletter($fields) {
		return $fields['newsletter']['value'] > 0;
	}

}

?>