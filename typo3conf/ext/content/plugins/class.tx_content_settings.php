<?php
use TYPO3\CMS\Frontend\Plugin\AbstractPlugin;
use TYPO3\CMS\Core\Utility\GeneralUtility;
require_once(PATH_site . 'fileadmin/inc/class.Utils.php');
require_once(PATH_site . 'fileadmin/inc/class.Templates.php');
require_once(PATH_site . 'fileadmin/inc/class.View.php');

class tx_content_settings extends AbstractPlugin{

  /**
   * @var View
   */
  protected $view;

  function main($content, $conf) {

    #################################################################################
    $this->pi_initPIflexForm('config');
    $this->conf = $conf;
    $this->pi_setPiVarDefaults();
    $this->uObj = utils::GetInstance($this->cObj);
    $this->view = new  View($conf, $this->uObj);
    #################################################################################

    $data = array(
      'header' => $this->cObj->data['header'],
      'bodytext' => $this->cObj->data['bodytext'],
    );

    $stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_powermail_domain_model_mails','sender_ip=:server_address AND deleted=0 AND hidden=0','','ASC','');
    $stmt->bindValue(':server_address', $_SERVER['REMOTE_ADDR']);
    $stmt->execute();
    $mail = $stmt->fetch();

    $stm = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_powermail_domain_model_answers','mail=:server_address AND deleted=0 AND hidden=0','','ASC','');
    $stm->bindValue(':server_address', $mail['uid']);
    $stm->execute();
    $answers = $stm->fetchAll();
    
    if(!$answers){
      $button1 = 'U';
      $button2 = 'I';
      $button3 = 'O';
      $button4 = 'P';
      $controlTop = 'W';
      $controlLeft = 'A';
      $controlRight = 'D';
      $controlBottom = 'S';
    }
        
      
    foreach($answers as $answer){
      $key = strtoupper($answer['value']) ? strtoupper($answer['value']) : '';

      $stmt = $GLOBALS['TYPO3_DB']->prepare_SELECTquery('*','tx_powermail_domain_model_fields','uid=:field AND deleted=0 AND hidden=0','','ASC','');
      $stmt->bindValue(':field', $answer['field']);
      $stmt->execute();
      $field = $stmt->fetch();
        
      if($field['title'] == "button_1"){
        $button1 = $key;
      }else if($field['title'] == "button_2"){
        $button2 = $key;
      }else if($field['title'] == "button_3"){
        $button3 = $key;
      }else if($field['title'] == "button_4"){
        $button4 = $key;
      }else if($field['title'] == "control_top"){
        $controlTop = $key;
      }else if($field['title'] == "control_left"){
        $controlLeft = $key;
      }else if($field['title'] == "control_right"){
        $controlRight = $key;
      }else if($field['title'] == "control_bottom"){
        $controlBottom = $key;
      }else if($field['title'] == "button_5"){
        $wuerd = $key;
      }
    }
    $actualKeys[] = 
      '<div class="acutalKeys">Die bisherigen Tastenbelegungen sind:</div>
      <div class="keyRow"><div class="keyColumn actualButton-1">Button 1: '.$button1.'</div><div class="keyColumn acutalControlTop">Control Top: '.$controlTop.'</div></div>
      <div class="keyRow"><div class="keyColumn actualButton-2">Button 2: '.$button2.'</div><div class="keyColumn acutalControlLeft">Control Left: '.$controlLeft.'</div></div>
      <div class="keyRow"><div class="keyColumn actualButton-3">Button 3: '.$button3.'</div><div class="keyColumn acutalControlRight">Control Right: '.$controlRight.'</div></div> 
      <div class="keyRow"><div class="keyColumn actualButton-4">Button 4: '.$button4.'</div><div class="keyColumn acutalControlBottom">Control Bottom: '.$controlBottom.'</div></div>
      <div><div class="actualWuerd">Wuerd: '.$wuerd.'</div></div>
      </br></br>' 
    ;
    
    $contentTop = '<div class="contact">'.$this->view->renderText($data).'</div><div class="keys">'.implode('', $actualKeys).'</div>';
    
    return '<div class="settings">' . $contentTop . '</div>';
  }
  
}
