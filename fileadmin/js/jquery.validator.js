var curFieldValue = null;

function FormValidator (form, config) {
	this.form = form;
	this.config = config;
	this.formData = {};
}

FormValidator.prototype = ({
	
	validateForm:function(submit) {
		var allValid = this.validateSubpart(this.form);
		if(submit && allValid){
			$('#'+this.form).submit();
		}
		else
			return allValid;
	},

	validateSubpart:function(id, noswitch) {
		
		var allValid = true,
			oneValid = true,
			expression = '',
			toBeChecked = [];
		
		$('#' + id + ' :input').each(function(){
			var $t = $(this);
                
			if ($t.attr('type') != 'image')
				toBeChecked.unshift($t);
		});
		
		for(var i=toBeChecked.length;i--;) {
			oneValid = this.validate2(toBeChecked[i].attr('id'));						
			allValid = allValid && oneValid; 
		}
					
		allValid = (allValid && uniqueUsername && uniqueEmail);		
		if(allValid && !noswitch)
			this.switchNext(id);
		else
			this.visualFeedback(id);
		
		return allValid;
	},
    
    switchNext:function(id) {
		var $curStep = $('#'+id);
		if ($curStep.hasClass('formSubPart') && $curStep.next('.formSubPart'))
			$curStep.hide(500).next('.formSubPart').show(500);
    },
    
	// switch to previous Subpart
	switchBack:function(id) {
		var $curStep = $('#'+id).next();
		if ($curStep.hasClass('formSubPart') && $curStep.prev('.formSubPart'))
			$curStep.hide(500).prev('.formSubPart').show(500);
	},
	visualFeedback:function(id) {
		var $curStep = $('#'+id);
		$curStep.parents('#regForm').animate({marginLeft: 10}, 30).delay(30).animate({marginLeft: -10}, 50).delay(50).animate({marginLeft: 0}, 30);
	},
	
	/*
	 * Validate field by Id
	 * ->collect Formdata in this.formData
	 * ->switch error state
	 */
	validate2:function(target, field2) {
		var shortId = "",
			field = null;

		if (typeof(target) == 'string')
			field = $('#'+target);
		else 
			field = $(target);

		shortId = this.getFieldId(field.attr('id'));
			
		if (field == null) 
			field = field2;
		
				
		this.formData[shortId] = field.val() == field.attr('title') ? null : field.val();

		if(typeof(this.config[shortId]) == 'undefined')
			return true;
		if(typeof(this.config[shortId].config) == 'undefined')
			return true;
		if(typeof(this.config[shortId].config.validate) == 'undefined')
			return true;			

		var isValid = true,
            newValid = true,
            valids = [], 
			validators = this.config[shortId].config.validate.split(';');
		
		for(var i=validators.length;i--;) {
			valids = validators[i].split(',');

   			newValid = this.validate(shortId, valids[0], valids);
			isValid = isValid && newValid;
			
			//if (!newValid)
			//	this.formData[shortId] = null;	
			this.switchFieldState(field, shortId, isValid, valids[0]);
		}	
		return isValid;
	},
	
	// subroutine for Validation
	validate:function(fieldId, type, config) {
		if (config[1] == 'nojs')
			return true;

		switch(type) {
			case 'email':return this.validateEmail(fieldId, config);
			case 'url':return this.validateUrl(fieldId, config);
			case 'length':return this.validateLength(fieldId, config);
			case 'range':return this.validateRange(fieldId, config);
			case 'required':return this.validateRequired(fieldId, config);
			case 'number':return this.validateNumber(fieldId, config);
			case 'date':return this.validateDate(fieldId, config);
			case 'list':return this.validateList(fieldId, config);
			case 'creditcard':return this.validateCreditCard(fieldId, config);
			case 'equalto':return this.validateEqualTo(fieldId, config);
			case 'vat':return this.validateVat(fieldId, config);
			case 'captcha':return true;
		}
        return true;
	},
	
	validateVat:function(fieldId, config) {
			if (this.formData[fieldId] == null)
				return true;
				
			country = this.formData[$config[1]].toUpper();
			var regexs = {'AT':/^ATU[0-9]{8}$/,'BE':/^BE0?[0-9]{*}$/,'CZ':/^CZ[0-9]{8,10}$/,'DE':/^DE[1-9][0-9]{8}$/,'CY':/^CY[0-9]{8}[A-Z]$/,'DK':/^DK[0-9]{8}$/,'EE':/^EE[0-9]{9}$/,'GR':/^GR[0-9]{9}$/,'ES':/^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/,'FI':/^[0-9]{8}$/,'FR':/^FR[0-9A-Z]{2}[0-9]{9}$/,'GB':/^GB([0-9]{9}|[0-9]{12})~(GD|HA)[0-9]{3}$/,'HU':/^HU[0-9]{8}$/,'IE':/^IE[0-9][A-Z0-9\\+\\*][0-9]{5}[A-Z]$/,'IT':/^IT[0-9]{11}$/,'LT':/^LT([0-9]{9}|[0-9]{12})$/,'LU':/^LU[0-9]{8}$/,'LV':/^LV[0-9]{11}$/,'MT':/^MT[0-9]{8}$/,'NL':/^NL[0-9]{9}B[0-9]{2}$/,'PL':/^PL[0-9]{10}$/,'PT':/^PT[0-9]{9}$/,'SE':/^SE[0-9]{12}$/,'SI':/^SI[0-9]{8}$/,'SK':/^SK[0-9]{10}$/},
				regex = regexs[country];

			if (regex == '')
				return false;
			return regex.test(this.formData[fieldId]);
	},
	
	validateLength:function (fieldId, config) {	
		if(!this.formData[fieldId])
			return false;
		var length = this.formData[fieldId].length,
			isValid = (length >= config[1]);
		if (config[2])
			isValid = isValid && (length <= config[2]);		
		return isValid;
	},
	
	validateRequired:function (fieldId, config) {
		if (this.formData[fieldId] == null)
			return false;
			
		var tmp = new Number(this.formData[fieldId]);
		if (tmp != NaN)	
			return tmp !=0;
		else
			return this.formData[fieldId].length > 0 ;
		
	},
	
	validateRange:function (fieldId, config) {
		var isValid = (this.formData[fieldId] >= config[1]);
		if (config[2])
			isValid = isValid && (this.formData[fieldId] <= config[2]);		
		return isValid;
	},
	
	validateNumber:function(fieldId, config) {
		return !isNaN(this.formData[fieldId]);
	},
	
	validateList:function(fieldId, config) {
		return config.indexOf(this.formData[fieldId]) != -1;
	},
	
	validateRegex:function(fieldId, config) {
		return config[1].test(this.formData[fieldId]);
	},
	
	validateCreditCard:function(fieldId, config) {
		return this.validateRegex(fieldId, new Array('', /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/));
	},
	
	validateEmail:function(fieldId, config) {
		return this.validateRegex(fieldId, new Array('', /^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,6}$/));
	},
		
	validateUrl:function(fieldId, config) {
		
	},
	
	validateDate:function (fieldId, config) {
		var values = this.formData[fieldId].split('.'),
			dateValue = new Date(values[2], values[1], values[0]);
            
		if (values[0] == -1 || values[1] == -1 || values[2] == -1)
			return false;
            
		if (isNaN(dateValue.getTime()))
			return false;

		if (config[1]) {
			var minDateValues = config[1].split('.');
			var minDate = new Date(minDateValues[2], minDateValues[1], minDateValues[0]);
			if (minDate > dateValue)
				return false;
		}
		if (config[2]) {
			var maxDateValues = config[2].split('.');
			var maxDate = new Date(maxDateValues[2], maxDateValues[1], maxDateValues[0]);
			if (maxDate < dateValue)
				return false;
		}
		
		return true;
	},
	
	validateEqualTo:function(fieldId, config) {
		return this.formData[fieldId] == this.formData[config[1]];
	},
	
	switchFieldState:function (field, fieldId, isValid, type){   
		field.toggleClass('error', !isValid);
		if (isValid){
			if (type == 'date')
				$('#'+field.id+'day,#'+field.id+'month,#'+field.id+'year').removeClass('error');
			this.removeErrorMessage(fieldId, type);
		}
		else {
			if (type == 'date')
				$('#'+field.id+'day,#'+field.id+'month,#'+field.id+'year').addClass('error');
			this.addErrorMessage(field, fieldId, type);
		}
	},
	
	addErrorMessage:function (field, fieldId, messageType) {
		if ($('#'+this.getFullFieldId(fieldId) + '-error').length == 0) {
			msg = this.config[fieldId].errorMessages[messageType];
			$(field).after($('<label class="error"></label>').attr('for', this.getFullFieldId(fieldId)).attr('id', this.getFullFieldId(fieldId)+ '-error').html(msg));
		}
	},
	
	removeErrorMessage:function (fieldId) {
		$('#'+this.getFullFieldId(fieldId) + '-error').remove();
	},
	
	getFieldId:function(field) {
		if(typeof field != "undefined")
			return field.replace(this.form + "-", '');
		else
			return "";
	},
	getFullFieldId:function(field) {
		return this.form + "-" + field;
	}
});

function FormUtils () {}
FormUtils.prototype = ({
	addTableRow : function (id,config) {
		var trLen = $("#"+id +" tbody tr").length,
		  newTr  = $("#"+id +" tbody tr:first").clone();
		$(newTr).addClass('tmp-newRow');
		$("#"+id +" tbody").append(newTr);

		$("#"+id +" tbody tr.tmp-newRow").html($("#"+id +" tbody tr.tmp-newRow").html().replace(/\[0\]/g,"["+trLen+"]"));
		$("#"+id +" tbody tr.tmp-newRow").html($("#"+id +" tbody tr.tmp-newRow").html().replace(/error/g,""));

		$("#"+id +" tbody tr.tmp-newRow input").val("");
		$("#"+id +" tbody tr.tmp-newRow").removeClass('tmp-newRow');	
	},
	
	setBlank : function(element,label) {
		if ($("#"+element).val() == label) {
			$("#"+element).val("");
		}
	},
	
	setDefault : function(element,label) {
		if ($("#"+element).val() == "") {
			$("#"+element).val(label);
		}
	},
	
	setBlankPassword : function(element,label) {
		element.type = "password";
		this.setBlank(element,label);
	},
	
	setDefaultPassword : function(element,label) {
		//element.type = "text";
		this.setDefault(element,label);
	}	
});


/*
 * woow
 */
function updateCheckboxValue(id, value, checked) {
	
	var tmp = $('#'+id);
	if (checked)
		tmp.val(tmp.val()*1 + value*1);
	else
		tmp.val(tmp.val()*1 - value*1);
	
}
function newCaptcha(id, colors) {
	var time = new Date();
	id.src = "/fileadmin/inc/class.captcha.php?&stamp=" + time.getMilliseconds() + "&color=" + colors;
}



/*
 * custom fileupload field
 */

function writeFilePath(element) {
    var $t = $(element);
    if(!$.browser.mozilla) {
    	//removing fakepath "C:\fakepath\abc.xy"
	    path = $t.val().split('\\');
		file = path[path.length-1];
	    $t.parent().siblings('input').val(file);
  	}
  	else
  		$t.parent().siblings('input').val($t.val());
}

function openFileBrowser(element) {

	if($.browser.msie){
		return;
	}

    var $t = $(element);
    if($t.parent().hasClass('fakefile')) {
	    //Button clicked
	    $t.siblings('input').click();
    }
     if($t.parent().hasClass('fileupload') && $t.val() == '') {
        //Inputfield clicked
        $t.siblings('.fakefile').children('input').click();
    }     
}

function UpdateDate(id) {
	$('#'+id).val($('#'+id + 'day').val() + '.' + $('#'+id + 'month').val() + '.' + $('#'+id + 'year').val());
}