
function getXY(id,x,y,table,offset,offsetCoords,xField,yField) {

	document.editform["data["+table+"]["+id+"]["+xField+"]_hr"].value = (x)-offsetCoords;
	document.editform["data["+table+"]["+id+"]["+xField+"]"].value = (x)-offsetCoords;
	document.editform["data["+table+"]["+id+"]["+yField+"]_hr"].value = (y)-offsetCoords;
	document.editform["data["+table+"]["+id+"]["+yField+"]"].value = (y)-offsetCoords;
	document.getElementById("dot"+id+"").style.left = (x-offset)+"px";
	document.getElementById("dot"+id+"").style.top = (y-offset)+"px";
}

function getXYText(id,x,y,table,field) {
	dot = document.createElement('div');
	dot.setAttribute('style','background:url(../fileadmin/images/be_dot.gif);position:absolute;top:'+y+'px;left:'+x+'px;width:3px; height:3px;');
	document.getElementById('teamPositionMap').appendChild(dot);
	
	if(document.editform["data["+table+"]["+id+"]["+field+"]"].value.length>1) x=','+x;
//	document.editform["data["+table+"]["+id+"]["+field+"]_hr"].value = document.editform["data["+table+"]["+id+"]["+field+"]"].value + ","+x+","+y;
	document.editform["data["+table+"]["+id+"]["+field+"]"].value = document.editform["data["+table+"]["+id+"]["+field+"]"].value + x+","+y;
	document.getElementById("dot"+id+"").style.left = (x)+"px";
	document.getElementById("dot"+id+"").style.top = (y)+"px";
}

//$.noConflict();




function onEndCrop(table, id, coords ,ratio, suffix) {
	var value = (coords.x1*ratio).round() + ',' + (coords.y1*ratio).round() + '|' + (coords.x2*ratio).round() + ',' + (coords.y2*ratio).round();
	//var value = coords.x1 + ',' + coords.y1 + '|' + coords.x2 + ',' + coords.y2;
	document.editform["data["+table+"]["+id+"][crop_coords_"+suffix+"]"].value = value;
	document.editform["data["+table+"]["+id+"][crop_coords_"+suffix+"]_hr"].value = value;

}

function hideCropper(id){

}

function initCropper(table,id,options,ratio) { 

	window.thisid = id;
	var base_options = { 
		handles: true, 
		parent: '#parent_'+id,
		show: true,
		persistent: true,
		onSelectEnd: function(img,selection){
			var imgid = jQuery(img).attr('id').split('_');
            
			id = imgid[1];
			suffix = imgid[2];
			onEndCrop(table, id,selection,ratio,suffix);
		} 
	}
    

	jQuery.extend(base_options,options);
    
	try {
    	jQuery('#crop_'+id).imgAreaSelect(base_options);
	} catch (e) {}
} 


(function($){
	$(".typo3-dyntabmenu-tabs td a").live("click",function(){
		if($(this).parents("td").hasClass("tabact")) {
			$(".be_crop").trigger("load");
		}
	});
	
	
	
	
	$(".recipes-wl-add").live("click", function(){
		$(".recipe-wl-selection").remove();
		var el = $(this);
		$.get(top.TS.PATH_typo3 + 'ajax.php', {ajaxID: "RecipeDB::getWatchlistSelection", recipe: $(this).data("uid")}, function(data) {
			$("body").append(data);
			var offset = el.offset();
			$(".recipe-wl-selection").offset({left: offset.left, top: offset.top});
		});
	});
	
	$(".recipes-wl-add-bulk").live("click", function(){

		var el = $(this);
		var ids = [];
		var found = false;
		
		$(".recipe-wl-selection").remove();
		$('.typo3-dblist').find('.checkRecipe:checked').each(function(){
			found = true;
			ids.push($(this).val());
		});
		if(!found){
			alert('Es sind keine Rezepte ausgewählt');
			return;
		}
		
		
		$.get(top.TS.PATH_typo3 + 'ajax.php', {ajaxID: "RecipeDB::getWatchlistSelection", recipe: ids.join(',')}, function(data) {
			$("body").append(data);
			var offset = el.offset();
			$(".recipe-wl-selection").offset({left: offset.left, top: offset.top});
		});
		return false;
	});
	
	
	$('.checkRecipeAll').live("click", function(){
		
		
		if($(this).is(':checked')){
			$('.typo3-dblist').find('.checkRecipe').attr('checked','checked');
		}else{
			$('.typo3-dblist').find('.checkRecipe').removeAttr('checked');
		}
		
	});
	
	
	$(".recipe-wl-sel-close").live("click", function(){
		$(".recipe-wl-selection").remove();
	});
	
	$(".recipes-wl-remove").live("click", function(){
		var offset = $(this).offset();
		$(this).parents("tr").remove();
		$.get(top.TS.PATH_typo3 + 'ajax.php', {ajaxID: "RecipeDB::removeFromWatchlist", recipe: $(this).data("uid"), watchlist: $(this).data("watchlist")}, function(data) {
			$("body").append(data);
			$(".recipe-wl-selection").offset({left: offset.left, top: offset.top});
		});
	});
	
	$(".save-wl-button").live("click", function(){
		$.get(top.TS.PATH_typo3 + 'ajax.php', {ajaxID: "RecipeDB::addToWatchlist", recipe: $("#recipetoadd").val(), watchlist: $("#recipe-wl-select").val(), newname: $("#new-wl-name").val()}, function(data) {
			$(".recipe-wl-content").html(data);
		});
	});
	
	$(".watchlist-edit").live("click", function(){
		var offset = $(this).offset();
		$(this).parents("tr").remove();
		$.get(top.TS.PATH_typo3 + 'ajax.php', {ajaxID: "RecipeDB::editWatchlist", watchlist: $(this).data("uid")}, function(data) {
			$("body").append(data);
			$(".recipe-wl-selection").offset({left: offset.left, top: offset.top});
		});
	});
	$(".save-edit-wl-button").live("click", function(){
		$("#watchlistContainer select option[selected]").text($("#new-wl-name").val())
		$.get(top.TS.PATH_typo3 + 'ajax.php', {ajaxID: "RecipeDB::editWatchlistSave", watchlist: $("#watchlisttoadd").val(), newname: $("#new-wl-name").val()}, function(data) {
			$(".recipe-wl-content").html(data);
		});
	});
	
	$("a.show-new-link").live("click", function(){
		$(".new-wl-container").show();
	});
	
	$.fn.autoGrowInput = function(o) {

		o = $.extend({
			maxWidth: 220,
			minWidth: 30,
			comfortZone: 30
		}, o);

		this.filter('input:text').each(function(){

			var minWidth = o.minWidth || $(this).width(),
			val = '',
			input = $(this),
			testSubject = $('<tester/>').css({
				position: 'absolute',
				top: -9999,
				left: -9999,
				width: 'auto',
				fontSize: input.css('fontSize'),
				fontFamily: input.css('fontFamily'),
				fontWeight: input.css('fontWeight'),
				letterSpacing: input.css('letterSpacing'),
				whiteSpace: 'nowrap'
			}),
			check = function() {

				if (val === (val = input.val())) {
					return;
				}

				// Enter new content into testSubject
				var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				testSubject.html(escaped);

				// Calculate new width + whether to change
				var testerWidth = testSubject.width(),
				newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
				currentWidth = input.width(),
				isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
				|| (newWidth > minWidth && newWidth < o.maxWidth);

				// Animate width
				if (isValidWidthChange) {
					input.width(newWidth);
				}

			};

			testSubject.insertAfter(input);

			$(this).bind('keyup keydown blur update change', check);

		});

		return this;

	};

})(jQuery);

function getAutoCompleteField(field, table, searchField) {
	jQuery("#"+field+"Suggest").autoGrowInput({
		maxWidth:100
	});

	//attach autocomplete
	jQuery("#"+field+"Suggest").autocomplete({
		minLength: 1,
		//define callback to format results
		source: function( request, response ) {
			request.ajaxID = "RecipeDB::findRecord";
			request.table = table;
			request.field = searchField;
			
			//pass request to server
			jQuery.getJSON(top.TS.PATH_typo3 + 'ajax.php', request, function(data) {
				response( data.result ); 
			});
		},
					
		//define select handler
		select: function(e, ui) {

			//create formatted friend
			var text = ui.item.label,
			id = ui.item.id,
			type = ui.item.type
			wrapper = jQuery("<span>").addClass('search_item_wrapper'),
			span = jQuery("<span>").text(text).attr('id',id).attr('rel',text).addClass('search_item_inner'),
			a = jQuery("<a>").addClass("remove").attr({
				href: "javascript:",
				title: text+ " entfernen"
			}).text("x").appendTo(span);
						
			span.appendTo(wrapper);
			wrapper.insertBefore("#"+field+"Suggest");
		},
					
		//define select handler
		change: function() {
						
			//prevent 'to' field being updated and correct position
			jQuery("#"+field+"Suggest").val("").css("top", 0);
		},
                    
		open: function (e,ui){
			jQuery('.ui-menu-item:nth-child(even)').addClass('even');
		}
	});
				
	//add click handler to div
	jQuery("#"+field+"SuggestField").click(function(){
					
		//focus 'to' field
		jQuery('#search_default').remove();
		jQuery("#"+field+"Suggest").focus();
	});
				
	//add live handler for clicks on remove links
	jQuery("#"+field+"SuggestField .remove").live("click", function(){
		jQuery(this).parent().parent().remove();
					
		//correct 'to' field position
		if(jQuery("#"+field+"SuggestField span").length === 0) {
			jQuery("#"+field+"Suggest").css("top", 0);
		}				
	});	
	
	jQuery("#"+field+"Suggest").live('keypress',function(e){
            
		var code = (e.keyCode ? e.keyCode : e.which),
		value = jQuery(this).val();
            
            
		if(code == 8 && value == ''){
			jQuery(this).prev().remove();
			return;
		}
            
		if(value.match(/^ *$/)){
			jQuery(this).val('');
			return;
		}
            
		if(code == 32){
			jQuery('.ui-autocomplete').hide();
			var wrapper = jQuery("<span>").addClass('search_item_wrapper'),
			span =jQuery("<span>").text(value).attr('rel',value).addClass('search_item_inner'),
			a = jQuery("<a>").addClass("remove").attr({
				href: "javascript:",
				title: value+' entfernen'
			}).text("x").appendTo(span);
        		
			span.appendTo(wrapper);
			wrapper.insertBefore("#"+field+"Suggest");
                
			jQuery(this).val('');
			return;
		}
	});
	jQuery("#"+field+"Suggest").trigger("change");
	
}

function reindexSortables(event, ui) {
	var order = {};
	var i = 0;
	jQuery("#watchlist-table tr.db_list_normal").each(function(){
		order[jQuery(this).data("uid")] = ++i;
	})
	jQuery.getJSON(top.TS.PATH_typo3 + 'ajax.php', {ajaxID: "RecipeDB::reOrderWatchlist", watchlist: jQuery("#watchlist-table ").data("watchlist"), "order": order});
}