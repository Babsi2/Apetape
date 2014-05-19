<?php
use TYPO3\CMS\Frontend\Plugin\AbstractPlugin;
use TYPO3\CMS\Core\Utility\GeneralUtility;
// use Apetape\Inc\Forms;
require_once(PATH_site . 'fileadmin/inc/class.tx_FEFunctions.php');
require_once(PATH_site . 'fileadmin/inc/class.forms.php');
require_once(PATH_site . 'fileadmin/inc/class.Templates.php');
require_once(PATH_site . 'fileadmin/inc/class.Translations.php');

class tx_content_settings extends AbstractPlugin
{
  var $prefixId = 'tx_content_settings';
  var $scriptRelPath = 'plugins/class.tx_content_settings';
  var $extKey = 'content';
  var $pi_checkCHash = TRUE;
  

  /**
   * @var Render
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
    $contentTop = '<div class="contact">'.$this->view->renderText($data).'</div>';
    
    // $mail = Templates::Fetch('contact_email');
    // $mail2 = Templates::Fetch('contact_email_customer');
    // $salutation = Templates::Fetch('email_signature');
    

    $columns = array(
      'tstamp' => array(
        'value' => time(),
        'config' => array(
          'type' => 'const',
        )
      ),
      'crdate' => array(
        'value' => time(),
        'config' => array(
          'type' => 'const',
        )
      ),
      'type' => array(
        'value' => '0',
        'config' => array(
          'type' => 'const',
        )
      ),
      'pid' => array(
        'value' => ($this->cObj->data['pages'] ? $this->cObj->data['pages'] : $this->cObj->data['pid']),
        'config' => array(
          'type' => 'const',
        )
      ),
      'module_sys_dmail_html' => array(
        'value' => '1',
        'config' => array(
          'type' => 'const',
        )
      ),
      'sys_language_uid' => array(
        'value' => $GLOBALS['TSFE']->config['config']['sys_language_uid'],
        'config' => array(
          'type' => 'const',
        )
      ),
      'server_address' => array(
        'value' => $_SERVER['REMOTE_ADDR'],
        'config' => array(
          'type' => 'const',
        )
      ),
      'button_1' => array(
        'label' => 'LLL:l_button1',
        'config' => array(
          'type' => 'input',
          'size' => 30,
          // 'validate' => 'length,2;required',
          'tabindex' => ++$tabindex
        )
      ),
      'button_2' => array(
        'label' => 'LLL:l_button2',
        'config' => array(
          //'inlineLabel' => 1,
          'type' => 'input',
          'size' => 30,
          // 'validate' => 'length,2;required',
          'tabindex' => ++$tabindex
        )
      ),
      'button_3' => array(
        'label' => 'LLL:l_button3',
        'config' => array(
          //'inlineLabel' => 1,
          'type' => 'input',
          'size' => 30,
          // 'validate' => 'required;email',
          'tabindex' => ++$tabindex
        )
      ),
      'button_4' => array(
        'label' => 'LLL:l_button4',
        'config' => array(
          'type' => 'input',
          'size' => 30,
          'tabindex' => ++$tabindex
        )
      ),
      'button_5' => array(
        'label' => 'LLL:l_button5',
        'config' => array(
          'type' => 'input',
          'size' => 30,
          'tabindex' => ++$tabindex
        )
      ),
      'control_top' => array(
        'label' => 'LLL:l_control_top',
        'config' => array(
          'type' => 'input',
          'size' => 30,
          // 'validate' => 'required',
          'tabindex' => ++$tabindex
        )
      ),
      'control_left' => array(
        'label' => 'LLL:l_control_left',
        'config' => array(
          'type' => 'input',
          'size' => 30,
          // 'validate' => 'required',
          'tabindex' => ++$tabindex
        )
      ),
      'control_bottom' => array(
        'label' => 'LLL:l_control_bottom',
        'config' => array(
          'type' => 'input',
          'size' => 30,
          // 'validate' => 'required',
          'tabindex' => ++$tabindex
        )
      ),
      'control_right' => array(
        'label' => 'LLL:l_control_right',
        'config' => array(
          'type' => 'input',
          'size' => 30,
          // 'validate' => 'required',
          'tabindex' => ++$tabindex
        )
      ),
    );


    $forms = new Forms(array(
          'form' => array(
            'method' => 'post',
            'action' => $this->cObj->getTypoLink_URL($GLOBALS['TSFE']->id),
            'successParam' => 1,
            'successMessage' => '<div class="formsuccess">' . nl2br(Translations::Fetch('form_success')) . '</div>',
            'id' => 'contactForm',
            'template' => 'FILE:typo3conf/ext/content/res/form.html',
            'submit' => array(
              'text' => '<span>'.Translations::Fetch('submit').'</span>',
              'type' => 'button'
            ),
            'submitAttributes' => array(
              'class' => 'submit',
            ),
            'class' => 'contact-form',
            'store' => 'db',
            'labelSuffix' => '',
            'requiredSuffix' => '&nbsp;<span class="required">*</span>',
            'singleError' => false,
            'errorMessages' => array(
              'number' => 'LLL:err_number',
              'email' => 'LLL:err_email',
              'length' => 'LLL:err_length',
              'captcha' => 'LLL:err_captcha',
              'required' => 'LLL:err_required',
              'date' => 'LLL:err_date',
              'recaptcha' => 'LLL:err_recaptcha',
              'honeypot' => Translations::Fetch('errcsrf'),
              'csrf' => Translations::Fetch('err_csrf'),
              'filltime' => 'LLL:err_csrf',
            ),
            'subheaders' => $subheaders,
          ),
          'defaults' => array(
            'onfocus' => array(
              'input' => 'this.select();',
            ),
            'class' => array(
              'select' => 'styled formfield meta-bold',
              'input' => 'formfield meta-bold',
              'submit' => 'submit',
              'radio' => '',
              'text' => 'formfield',
              'check' => 'styled',
              'captchaText' => 'formfield meta-bold',
              'captcha' => 'formfield'
            ),
            'style' => array(
              'label' => '',
              'select' => '',
              'input' => '',
              'radio' => '',
              'text' => '',
              'check' => '',
            ),
            'values' => $userValues,
          ),
          
          'columns' => $columns,
          'tables' => array(
            'tx_buttons_manual' => array('columns' => 'tstamp,crdate,type,pid,module_sys_dmail_html,sys_language_uid,server_address,button_1,button_2,button_3,button_4,button_5,control_top,control_left,control_bottom,control_right'),
          ),
        ));

    $content .= '<div class="form-container" >' . $forms->process() . '</div>';

    return '<div class="formheader scrollwrap">' . $contentTop . '</div>' . $content;
  }
  
}
