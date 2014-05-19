/*
The PAGE OBJECT template. 

Tells the PAGE object to use the parsed HTML template from the automaketemplate extension.
*/

metaMenu = HMENU
metaMenu{
	wrap = <ul>|</ul>
	special = directory
	special.value = 84
	1 = TMENU
	1 {
		noBlur = 1
		expAll = 1
		NO = 1
		NO {
			ATagParams = class="metaMenu"
			wrapItemAndSub = <li class="first">|</li> |*|<li class="spacer"></li><li>|</li> |*| <li class="spacer"></li><li class="last">|</li>
		}
		ACT < .NO
		ACT {
			ATagParams = class="active"
			wrapItemAndSub = <li class="first active">|</li> |*|<li class="spacer"></li><li class="active">|</li> |*| <li class="spacer"></li><li class="last active">|</li>
		}
	}
}
# Make the PAGE object
page = PAGE
page {
	# Regular pages always have typeNum = 0
	typeNum = 0

	# Add the icon that will appear in front of the url in the browser
	# This icon will also be used for the bookmark menu in browsers
	shortcutIcon = {$filepaths.images}favicon.ico

	config {
		#doctype = html5
		disableImgBorderAttr = 1
		disablePrefixComment = 1
		htmlTag_langKey = de-DE 
		meta.language = de
		spamProtectEmailAddresses = 2
		spamProtectEmailAddresses_atSubst = (at)
		spamProtectEmailAddresses_lastDotSubst = (dot) 
		pageTitleFirst = 1
		removeDefaultJS = 1
		removeDefaultCSS = 1
		inlineStyle2TempFile = 1
		simulateStaticDocuments = 0
		baseURL = http://localhost/apetape/
		tx_realurl_enable = 1
		prefixLocalAnchors = all
		
	}
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	


	includeJS.file1 = http://code.jquery.com/jquery-1.11.0.min.js
    includeJS.file2 = http://code.jquery.com/jquery-migrate-1.2.1.min.js
    includeJS.file3 = fileadmin/js/jquery-tools.js
    includeJS.file4 = fileadmin/js/jquery-ui-1.10.4.custom.js
    includeJS.file5 = fileadmin/js/jquery-ui-1.10.4.custom.min.js
    includeJS.file6 = fileadmin/js/jquery.address-1.5.js
    includeJS.file7 = fileadmin/js/jquery.address-1.5.min.js
    includeJS.file8 = fileadmin/js/jquery.validator.js
	
	includeJS.file9 = fileadmin/js/typo.js
	includeJS.file10 = fileadmin/js/buttons.js
	includeJS.file11 = fileadmin/js/controls.js
	includeJS.file12 = fileadmin/js/webAudio.js
	includeJS.file13 = fileadmin/js/be.js
	includeJS.file14 = fileadmin/js/keys.js
	
    includeCSS.file1 = fileadmin/css/jquery-ui-1.10.3.custom.css
    includeCSS.file2 = fileadmin/css/jquery-ui-1.10.3.custom.min.css
   	includeCSS.file3 = fileadmin/css/style.css
   	
    
	includeLibs.scriptlibrary = fileadmin/inc/class.tx_FEFunctions.php

	# Add class to bodytag to select which columns will be used in the HTML template
	# Labels for the values used in this field are defined in the TSconfig field of the root page of the website

	# Add a TEMPLATE object to the page
	# We use the template autoparser extension to easily replace parts of the HTML template by dynamic TypoScript objects

	10 = TEMPLATE
	10 {
		# Use the HTML template from the automake template plugin
		template = FILE
		template.file = fileadmin/mastertemplate.html

		marks {

		META < metaMenu

		LOGO = TEXT
		LOGO.preUserFunc = tx_FEFunctions->getLogo

		COPYRIGHT= TEXT
		COPYRIGHT.preUserFunc = tx_FEFunctions->getCopyright
		
		

		SUBTEMPLATE = TEMPLATE
		SUBTEMPLATE {
			template = FILE
			template.file.preUserFunc = tx_FEFunctions->getLayout
			marks {

				NAVI = TEXT
				NAVI.preUserFunc = tx_FEFunctions->getContentNavi

				CONTENT0 < styles.content.get
				CONTENT0.select.where = colPos=0

				CONTENT1 < styles.content.get
				CONTENT1.select.where = colPos=1

				CONTENT2 < styles.content.get
				CONTENT2.select.where = colPos=2

				FOOTER = TEXT
				FOOTER.preUserFunc = tx_FEFunctions->getFooter
			}
		}
		# Use the <body> subpart
		#workOnSubpart = DOCUMENT_BODY

		# Link content and page blocks to id's that have been enabled in the
		# automaketemplate template in the extension_configuration sysfolder
	}

	tt_content.list.10 >
	tt_content.content_szene.10 >
	
	
}

