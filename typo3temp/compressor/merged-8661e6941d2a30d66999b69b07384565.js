
/***************************************************************
*  Copyright notice
*
*  (c) 2008-2011 Jeff Segars <jeff@webempoweredchurch.org>
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
*  A copy is found in the textfile GPL.txt and important notices to the license
*  from the author is found in LICENSE.txt distributed with these scripts.
*
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/


Element.addMethods({
	pngHack: function(element) {
		element = $(element);
		var transparentGifPath = 'clear.gif';

			// If there is valid element, it is an image and the image file ends with png:
		if (Object.isElement(element) && element.tagName === 'IMG' && element.src.endsWith('.png')) {
			var alphaImgSrc = element.src;
			var sizingMethod = 'scale';
			element.src = transparentGifPath;
		}

		if (alphaImgSrc) {
			element.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="#{alphaImgSrc}",sizingMethod="#{sizingMethod}")'.interpolate(
			{
				alphaImgSrc: alphaImgSrc,
				sizingMethod: sizingMethod
			});
		}

		return element;
	}
});

var IECompatibility = Class.create({

	/**
	 * initializes the compatibility class
	 */
	initialize: function() {
		Event.observe(document, 'dom:loaded', function() {
			$$('input[type="checkbox"]').invoke('addClassName', 'checkbox');
		}.bind(this));

		Event.observe(window, 'load', function() {
			if (Prototype.Browser.IE) {
				var version = parseFloat(navigator.appVersion.split(';')[1].strip().split(' ')[1]);
				if (version === 6) {
					$$('img').each(function(img) {
						img.pngHack();
					});
					$$('#typo3-menu li ul li').each(function(li) {
						li.setStyle({height: '21px'});
					});
				}
			}
		});
	}
});

if (Prototype.Browser.IE) {
	var TYPO3IECompatibilty = new IECompatibility();
}

/**
 * Initialize
 *
 * Adds a listener to be notified when the document is ready
 * (before onload and before images are loaded).
 * Shorthand of Ext.EventManager.onDocumentReady.
 *
 * @param {Function} fn The method the event invokes.
 * @param {Object} scope (optional) The scope (this reference) in which the handler function executes. Defaults to the browser window.
 * @param {boolean} options (optional) Options object as passed to {@link Ext.Element#addListener}. It is recommended that the options
 * {single: true} be used so that the handler is removed on first invocation.
 *
 * @return void
 */
Ext.onReady(function() {
		// Initialize QuickTips (Can be used anywhere)
	Ext.QuickTips.init();
		// Instantiate new viewport
	var viewport = new TYPO3.Form.Wizard.Viewport({});
		// When the window is resized, the viewport has to be resized as well
	Ext.EventManager.onWindowResize(viewport.doLayout, viewport);
});
Ext.apply(Ext, {
	merge: function(o, c) {
		if (o && c && typeof c == 'object') {
			for (var p in c){
				if ((typeof o[p] == 'object') && (typeof c[p] == 'object')) {
					Ext.merge(o[p], c[p]);
				} else {
					o[p] = c[p];
				}
			}
		}
		return o;
	},
	mergeIf: function(o, c) {
		if (o && c && typeof c == 'object') {
			for (var p in c){
				if ((typeof o[p] == 'object') && (typeof c[p] == 'object')) {
					Ext.mergeIf(o[p], c[p]);
				} else if (typeof o[p] == 'undefined') {
					o[p] = c[p];
				}
			}
		}
		return o;
	}
});
Ext.apply(Ext, {
	isEmptyObject: function(o) {
		for(var p in o) {
			return false;
		};
		return true;
	}
});
/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.ux.Spinner
 * @extends Ext.util.Observable
 * Creates a Spinner control utilized by Ext.ux.form.SpinnerField
 */
Ext.ux.Spinner = Ext.extend(Ext.util.Observable, {
	incrementValue: 1,
	alternateIncrementValue: 5,
	triggerClass: 'x-form-spinner-trigger',
	splitterClass: 'x-form-spinner-splitter',
	alternateKey: Ext.EventObject.shiftKey,
	defaultValue: 0,
	accelerate: false,

	constructor: function(config){
		Ext.ux.Spinner.superclass.constructor.call(this, config);
		Ext.apply(this, config);
		this.mimicing = false;
	},

	init: function(field){
		this.field = field;

		field.afterMethod('onRender', this.doRender, this);
		field.afterMethod('onEnable', this.doEnable, this);
		field.afterMethod('onDisable', this.doDisable, this);
		field.afterMethod('afterRender', this.doAfterRender, this);
		field.afterMethod('onResize', this.doResize, this);
		field.afterMethod('onFocus', this.doFocus, this);
		field.beforeMethod('onDestroy', this.doDestroy, this);
	},

	doRender: function(ct, position){
		var el = this.el = this.field.getEl();
		var f = this.field;

		if (!f.wrap) {
			f.wrap = this.wrap = el.wrap({
				cls: "x-form-field-wrap"
			});
		}
		else {
			this.wrap = f.wrap.addClass('x-form-field-wrap');
		}

		this.trigger = this.wrap.createChild({
			tag: "img",
			src: Ext.BLANK_IMAGE_URL,
			cls: "x-form-trigger " + this.triggerClass
		});

		if (!f.width) {
			this.wrap.setWidth(el.getWidth() + this.trigger.getWidth());
		}

		this.splitter = this.wrap.createChild({
			tag: 'div',
			cls: this.splitterClass,
			style: 'width:13px; height:2px;'
		});
		this.splitter.setRight((Ext.isIE) ? 1 : 2).setTop(10).show();

		this.proxy = this.trigger.createProxy('', this.splitter, true);
		this.proxy.addClass("x-form-spinner-proxy");
		this.proxy.setStyle('left', '0px');
		this.proxy.setSize(14, 1);
		this.proxy.hide();
		this.dd = new Ext.dd.DDProxy(this.splitter.dom.id, "SpinnerDrag", {
			dragElId: this.proxy.id
		});

		this.initTrigger();
		this.initSpinner();
	},

	doAfterRender: function(){
		var y;
		if (Ext.isIE && this.el.getY() != (y = this.trigger.getY())) {
			this.el.position();
			this.el.setY(y);
		}
	},

	doEnable: function(){
		if (this.wrap) {
			this.disabled = false;
			this.wrap.removeClass(this.field.disabledClass);
		}
	},

	doDisable: function(){
		if (this.wrap) {
			this.disabled = true;
			this.wrap.addClass(this.field.disabledClass);
			this.el.removeClass(this.field.disabledClass);
		}
	},

	doResize: function(w, h){
		if (typeof w == 'number') {
			this.el.setWidth(w - this.trigger.getWidth());
		}
		this.wrap.setWidth(this.el.getWidth() + this.trigger.getWidth());
	},

	doFocus: function(){
		if (!this.mimicing) {
			this.wrap.addClass('x-trigger-wrap-focus');
			this.mimicing = true;
			Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {
				delay: 10
			});
			this.el.on('keydown', this.checkTab, this);
		}
	},

	// private
	checkTab: function(e){
		if (e.getKey() == e.TAB) {
			this.triggerBlur();
		}
	},

	// private
	mimicBlur: function(e){
		if (!this.wrap.contains(e.target) && this.field.validateBlur(e)) {
			this.triggerBlur();
		}
	},

	// private
	triggerBlur: function(){
		this.mimicing = false;
		Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
		this.el.un("keydown", this.checkTab, this);
		this.field.beforeBlur();
		this.wrap.removeClass('x-trigger-wrap-focus');
		this.field.onBlur.call(this.field);
	},

	initTrigger: function(){
		this.trigger.addClassOnOver('x-form-trigger-over');
		this.trigger.addClassOnClick('x-form-trigger-click');
	},

	initSpinner: function(){
		this.field.addEvents({
			'spin': true,
			'spinup': true,
			'spindown': true
		});

		this.keyNav = new Ext.KeyNav(this.el, {
			"up": function(e){
				e.preventDefault();
				this.onSpinUp();
			},

			"down": function(e){
				e.preventDefault();
				this.onSpinDown();
			},

			"pageUp": function(e){
				e.preventDefault();
				this.onSpinUpAlternate();
			},

			"pageDown": function(e){
				e.preventDefault();
				this.onSpinDownAlternate();
			},

			scope: this
		});

		this.repeater = new Ext.util.ClickRepeater(this.trigger, {
			accelerate: this.accelerate
		});
		this.field.mon(this.repeater, "click", this.onTriggerClick, this, {
			preventDefault: true
		});

		this.field.mon(this.trigger, {
			mouseover: this.onMouseOver,
			mouseout: this.onMouseOut,
			mousemove: this.onMouseMove,
			mousedown: this.onMouseDown,
			mouseup: this.onMouseUp,
			scope: this,
			preventDefault: true
		});

		this.field.mon(this.wrap, "mousewheel", this.handleMouseWheel, this);

		this.dd.setXConstraint(0, 0, 10);
		this.dd.setYConstraint(1500, 1500, 10);
		this.dd.endDrag = this.endDrag.createDelegate(this);
		this.dd.startDrag = this.startDrag.createDelegate(this);
		this.dd.onDrag = this.onDrag.createDelegate(this);
	},

	onMouseOver: function(){
		if (this.disabled) {
			return;
		}
		var middle = this.getMiddle();
		this.tmpHoverClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-overup' : 'x-form-spinner-overdown';
		this.trigger.addClass(this.tmpHoverClass);
	},

	//private
	onMouseOut: function(){
		this.trigger.removeClass(this.tmpHoverClass);
	},

	//private
	onMouseMove: function(){
		if (this.disabled) {
			return;
		}
		var middle = this.getMiddle();
		if (((Ext.EventObject.getPageY() > middle) && this.tmpHoverClass == "x-form-spinner-overup") ||
		((Ext.EventObject.getPageY() < middle) && this.tmpHoverClass == "x-form-spinner-overdown")) {
		}
	},

	//private
	onMouseDown: function(){
		if (this.disabled) {
			return;
		}
		var middle = this.getMiddle();
		this.tmpClickClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-clickup' : 'x-form-spinner-clickdown';
		this.trigger.addClass(this.tmpClickClass);
	},

	//private
	onMouseUp: function(){
		this.trigger.removeClass(this.tmpClickClass);
	},

	//private
	onTriggerClick: function(){
		if (this.disabled || this.el.dom.readOnly) {
			return;
		}
		var middle = this.getMiddle();
		var ud = (Ext.EventObject.getPageY() < middle) ? 'Up' : 'Down';
		this['onSpin' + ud]();
	},

	//private
	getMiddle: function(){
		var t = this.trigger.getTop();
		var h = this.trigger.getHeight();
		var middle = t + (h / 2);
		return middle;
	},

	//private
	//checks if control is allowed to spin
	isSpinnable: function(){
		if (this.disabled || this.el.dom.readOnly) {
			Ext.EventObject.preventDefault(); //prevent scrolling when disabled/readonly
			return false;
		}
		return true;
	},

	handleMouseWheel: function(e){
		//disable scrolling when not focused
		if (this.wrap.hasClass('x-trigger-wrap-focus') == false) {
			return;
		}

		var delta = e.getWheelDelta();
		if (delta > 0) {
			this.onSpinUp();
			e.stopEvent();
		} else {
			if (delta < 0) {
				this.onSpinDown();
				e.stopEvent();
			}
		}
	},

	//private
	startDrag: function(){
		this.proxy.show();
		this._previousY = Ext.fly(this.dd.getDragEl()).getTop();
	},

	//private
	endDrag: function(){
		this.proxy.hide();
	},

	//private
	onDrag: function(){
		if (this.disabled) {
			return;
		}
		var y = Ext.fly(this.dd.getDragEl()).getTop();
		var ud = '';

		if (this._previousY > y) {
			ud = 'Up';
		} //up
		if (this._previousY < y) {
			ud = 'Down';
		} //down
		if (ud != '') {
			this['onSpin' + ud]();
		}

		this._previousY = y;
	},

	//private
	onSpinUp: function(){
		if (this.isSpinnable() == false) {
			return;
		}
		if (Ext.EventObject.shiftKey == true) {
			this.onSpinUpAlternate();
			return;
		}
		else {
			this.spin(false, false);
		}
		this.field.fireEvent("spin", this.field);
		this.field.fireEvent("spinup", this.field);
	},

	//private
	onSpinDown: function(){
		if (this.isSpinnable() == false) {
			return;
		}
		if (Ext.EventObject.shiftKey == true) {
			this.onSpinDownAlternate();
			return;
		}
		else {
			this.spin(true, false);
		}
		this.field.fireEvent("spin", this.field);
		this.field.fireEvent("spindown", this.field);
	},

	//private
	onSpinUpAlternate: function(){
		if (this.isSpinnable() == false) {
			return;
		}
		this.spin(false, true);
		this.field.fireEvent("spin", this);
		this.field.fireEvent("spinup", this);
	},

	//private
	onSpinDownAlternate: function(){
		if (this.isSpinnable() == false) {
			return;
		}
		this.spin(true, true);
		this.field.fireEvent("spin", this);
		this.field.fireEvent("spindown", this);
	},

	spin: function(down, alternate){
		var v = parseFloat(this.field.getValue());
		var incr = (alternate == true) ? this.alternateIncrementValue : this.incrementValue;
		(down == true) ? v -= incr : v += incr;

		v = (isNaN(v)) ? this.defaultValue : v;
		v = this.fixBoundries(v);
		this.field.setRawValue(v);
	},

	fixBoundries: function(value){
		var v = value;

		if (this.field.minValue != undefined && v < this.field.minValue) {
			v = this.field.minValue;
		}
		if (this.field.maxValue != undefined && v > this.field.maxValue) {
			v = this.field.maxValue;
		}

		return this.fixPrecision(v);
	},

	// private
	fixPrecision: function(value){
		var nan = isNaN(value);
		if (!this.field.allowDecimals || this.field.decimalPrecision == -1 || nan || !value) {
			return nan ? '' : value;
		}
		return parseFloat(parseFloat(value).toFixed(this.field.decimalPrecision));
	},

	doDestroy: function(){
		if (this.trigger) {
			this.trigger.remove();
		}
		if (this.wrap) {
			this.wrap.remove();
			delete this.field.wrap;
		}

		if (this.splitter) {
			this.splitter.remove();
		}

		if (this.dd) {
			this.dd.unreg();
			this.dd = null;
		}

		if (this.proxy) {
			this.proxy.remove();
		}

		if (this.repeater) {
			this.repeater.purgeListeners();
		}
		if (this.mimicing){
			Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
		}
	}
});

//backwards compat
Ext.form.Spinner = Ext.ux.Spinner;
/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.form');

/**
 * @class Ext.ux.form.SpinnerField
 * @extends Ext.form.NumberField
 * Creates a field utilizing Ext.ux.Spinner
 * @xtype spinnerfield
 */
Ext.ux.form.SpinnerField = Ext.extend(Ext.form.NumberField, {
	actionMode: 'wrap',
	deferHeight: true,
	autoSize: Ext.emptyFn,
	onBlur: Ext.emptyFn,
	adjustSize: Ext.BoxComponent.prototype.adjustSize,

	constructor: function(config) {
		var spinnerConfig = Ext.copyTo({}, config, 'incrementValue,alternateIncrementValue,accelerate,defaultValue,triggerClass,splitterClass');

		var spl = this.spinner = new Ext.ux.Spinner(spinnerConfig);

		var plugins = config.plugins
			? (Ext.isArray(config.plugins)
				? config.plugins.push(spl)
				: [config.plugins, spl])
			: spl;

		Ext.ux.form.SpinnerField.superclass.constructor.call(this, Ext.apply(config, {plugins: plugins}));
	},

	// private
	getResizeEl: function(){
		return this.wrap;
	},

	// private
	getPositionEl: function(){
		return this.wrap;
	},

	// private
	alignErrorIcon: function(){
		if (this.wrap) {
			this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
		}
	},

	validateBlur: function(){
		return true;
	}
});

Ext.reg('spinnerfield', Ext.ux.form.SpinnerField);

//backwards compat
Ext.form.SpinnerField = Ext.ux.form.SpinnerField;

/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.form');

/**
 * @class Ext.ux.form.TextFieldSubmit
 * @extends Ext.form.TriggerField
 * Creates a text field with a submit trigger button
 * @xtype textfieldsubmit
 */
Ext.ux.form.TextFieldSubmit = Ext.extend(Ext.form.TriggerField, {
	hideTrigger: true,

	triggerClass: 'x-form-submit-trigger',

	enableKeyEvents: true,

	onTriggerClick: function() {
		this.setHideTrigger(true);
		if (this.isValid()) {
			this.fireEvent('triggerclick', this);
		} else {
			this.setValue(this.startValue);
		}
	},

	initEvents: function() {
		Ext.ux.form.TextFieldSubmit.superclass.initEvents.call(this);
		this.on('keyup', function(field, event) {
			if (event.getKey() != event.ENTER && this.isValid()) {
				this.setHideTrigger(false);
			} else {
				this.setHideTrigger(true);
			}
		});
		this.on('keypress', function(field, event) {
			if (event.getKey() == event.ENTER) {
				event.stopEvent();
				this.onTriggerClick();
			}
		}, this);
	}
});

Ext.reg('textfieldsubmit', Ext.ux.form.TextFieldSubmit);

//backwards compat
Ext.form.TextFieldSubmit = Ext.ux.form.TextFieldSubmit;

/*!
 * Ext JS Library 3.1.1
 * Copyright(c) 2006-2010 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns('Ext.ux.grid');

/**
 * @class Ext.ux.grid.CheckColumn
 * @extends Object
 * GridPanel plugin to add a column with check boxes to a grid.
 * <p>Example usage:</p>
 * <pre><code>
// create the column
var checkColumn = new Ext.grid.CheckColumn({
   header: 'Indoor?',
   dataIndex: 'indoor',
   id: 'check',
   width: 55
});

// add the column to the column model
var cm = new Ext.grid.ColumnModel([{
	   header: 'Foo',
	   ...
	},
	checkColumn
]);

// create the grid
var grid = new Ext.grid.EditorGridPanel({
	...
	cm: cm,
	plugins: [checkColumn], // include plugin
	...
});
 * </code></pre>
 * In addition to storing a Boolean value within the record data, this
 * class toggles a css class between <tt>'x-grid3-check-col'</tt> and
 * <tt>'x-grid3-check-col-on'</tt> to alter the background image used for
 * a column.
 */
Ext.ux.grid.CheckColumn = function(config){
	Ext.apply(this, config);
	if(!this.id){
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Ext.ux.grid.CheckColumn.prototype ={
	init : function(grid){
		this.grid = grid;
		this.grid.on('render', function(){
			var view = this.grid.getView();
			view.mainBody.on('mousedown', this.onMouseDown, this);
		}, this);
	},

	onMouseDown : function(e, t){
		if(Ext.fly(t).hasClass(this.createId())){
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t);
			var record = this.grid.store.getAt(index);
			record.set(this.dataIndex, !record.data[this.dataIndex]);
		}
	},

	renderer : function(v, p, record){
		p.css += ' x-grid3-check-col-td';
		return String.format('<div class="x-grid3-check-col{0} {1}">&#160;</div>', v ? '-on' : '', this.createId());
	},

	createId : function(){
		return 'x-grid3-cc-' + this.id;
	}
};

// register ptype
Ext.preg('checkcolumn', Ext.ux.grid.CheckColumn);

// backwards compat
Ext.grid.CheckColumn = Ext.ux.grid.CheckColumn;
Ext.ux.grid.SingleSelectCheckColumn = Ext.extend(Ext.ux.grid.CheckColumn, {
	onMouseDown : function(e, t){
		if(Ext.fly(t).hasClass('x-grid3-cc-'+this.id)){
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t),
				dataIndex = this.dataIndex;
			this.grid.store.each(function(record, i){
				var value = (i == index && record.get(dataIndex) != true);
				if(value != record.get(dataIndex)){
					record.set(dataIndex, value);
				}
			});
		}
	}
});
/**
 * @author schiesser
 */
Ext.ns('Ext.ux.grid');

Ext.ux.grid.ItemDeleter = Ext.extend(Ext.grid.RowSelectionModel, {
	width: 25,
	sortable: false,
	dataIndex: 0, // this is needed, otherwise there will be an error

	menuDisabled: true,
	fixed: true,
	id: 'deleter',

	initEvents: function(){
		Ext.ux.grid.ItemDeleter.superclass.initEvents.call(this);
		this.grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
			if(columnIndex==grid.getColumnModel().getIndexById('deleter')) {
				var record = grid.getStore().getAt(rowIndex);
				grid.getStore().remove(record);
				grid.getView().refresh();
			}
		});
	},

	renderer: function(v, p, record, rowIndex){
		return '<div class="remove">&nbsp;</div>';
	}
});

Ext.namespace('TYPO3.Form.Wizard.Helpers');

TYPO3.Form.Wizard.Helpers.History = Ext.extend(Ext.util.Observable, {
	/**
	 * @cfg {Integer} maximum
	 * Maximum steps to go back or forward in history
	 */
	maximum: 20,

	/**
	 * @cfg {Integer} marker
	 * The current step in the history
	 */
	marker: 0,

	/**
	 * @cfg {Array} history
	 * Holds the configuration for each step in history
	 */
	history: [],

	/**
	 * #cfg {String} undoButtonId
	 * The id of the undo button
	 */
	undoButtonId: 'formwizard-history-undo',

	/**
	 * #cfg {String} redoButtonId
	 * The id of the redo button
	 */
	redoButtonId: 'formwizard-history-redo',

	/**
	 * Constructor
	 *
	 * @param config
	 */
	constructor: function(config){
			// Call our superclass constructor to complete construction process.
		TYPO3.Form.Wizard.Helpers.History.superclass.constructor.call(this, config);
	},

	/**
	 * Called when a component is added to a container or there was a change in
	 * one of the form components
	 *
	 * Gets the configuration of all (nested) components, starting at
	 * viewport-right, and adds this configuration to the history
	 *
	 * @returns {void}
	 */
	setHistory: function() {
		var configuration = Ext.getCmp('formwizard-right').getConfiguration();
		this.addToHistory(configuration);
	},

	/**
	 * Add a snapshot to the history
	 *
	 * @param {Object} configuration The form configuration snapshot
	 * @return {void}
	 */
	addToHistory: function(configuration) {
		while (this.history.length > this.marker) {
			this.history.pop();
		}
		this.history.push(Ext.encode(configuration));
		while (this.history.length > this.maximum) {
			this.history.shift();
		}
		this.marker = this.history.length;
		this.buttons();
	},

	/**
	 * Get the current snapshot from the history
	 *
	 * @return {Object} The current snapshot
	 */
	refresh: function() {
		var refreshObject = Ext.decode(this.history[this.marker-1]);
		Ext.getCmp('formwizard-right').loadConfiguration(refreshObject);
	},

	/**
	 * Get the previous snapshot from the history if available
	 *
	 * Unsets the active element, because this element will not be available anymore
	 *
	 * @return {Object} The previous snapshot
	 */
	undo: function() {
		if (this.marker >= 1) {
			this.marker--;
			var undoObject = Ext.decode(this.history[this.marker-1]);
			this.buttons();
			Ext.getCmp('formwizard-right').loadConfiguration(undoObject);
			TYPO3.Form.Wizard.Helpers.Element.unsetActive();
		}
	},

	/**
	 * Get the next snapshot from the history if available
	 *
	 * Unsets the active element, because this element will not be available anymore
	 *
	 * @return {Object} The next snapshot
	 */
	redo: function() {
		if (this.history.length > this.marker) {
			this.marker++;
			var redoObject = Ext.decode(this.history[this.marker-1]);
			this.buttons();
			Ext.getCmp('formwizard-right').loadConfiguration(redoObject);
			TYPO3.Form.Wizard.Helpers.Element.unsetActive();
		}
	},

	/**
	 * Turn the undo/redo buttons on or off
	 * according to marker in the history
	 *
	 * @return {void}
	 */
	buttons: function() {
		var undoButton = Ext.get(this.undoButtonId);
		var redoButton = Ext.get(this.redoButtonId);
		if (this.marker > 1) {
			undoButton.show();
		} else {
			undoButton.hide();
		}
		if (this.history.length > this.marker) {
			redoButton.show();
		} else {
			redoButton.hide();
		}
	}
});

TYPO3.Form.Wizard.Helpers.History = new TYPO3.Form.Wizard.Helpers.History();
Ext.namespace('TYPO3.Form.Wizard.Helpers');

TYPO3.Form.Wizard.Helpers.Element = Ext.extend(Ext.util.Observable, {
	/**
	 * @cfg {Object} active
	 * The current active form element
	 */
	active: null,

	/**
	 * Constructor
	 *
	 * @param config
	 */
	constructor: function(config){
			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'setactive': true
		});

			// Call our superclass constructor to complete construction process.
		TYPO3.Form.Wizard.Helpers.Element.superclass.constructor.call(this, config);
	},

	/**
	 * Fires the setactive event when a component is set as active
	 *
	 * @param component
	 */
	setActive: function(component) {
		var optionsTabIsValid = Ext.getCmp('formwizard-left-options').tabIsValid();

		if (optionsTabIsValid) {
			if (component == this.active) {
				this.active = null;
			} else {
				this.active = component;
			}
			this.fireEvent('setactive', this.active);
		} else {
			Ext.MessageBox.show({
				title: TYPO3.l10n.localize('options_error'),
				msg: TYPO3.l10n.localize('options_error_message'),
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.MessageBox.OK
			});
		}
	},

	/**
	 * Fires the setactive event when a component is unset.
	 *
	 * This means when the element is destroyed or when the form is reloaded
	 * using undo or redo
	 *
	 * @param component
	 */
	unsetActive: function(component) {
		if (
			this.active && (
				(component && component.getId() == this.active.getId()) ||
				!component
			)
		){
			this.active = null;
			this.fireEvent('setactive');
		}
	}
});

TYPO3.Form.Wizard.Helpers.Element = new TYPO3.Form.Wizard.Helpers.Element();
Ext.namespace('TYPO3.Form.Wizard');

/**
 * Button group to show on top of the form elements
 *
 * Most elements contain buttons to delete or edit the item. These buttons are
 * grouped in this component
 *
 * @class TYPO3.Form.Wizard.ButtonGroup
 * @extends Ext.Container
 */
TYPO3.Form.Wizard.ButtonGroup = Ext.extend(Ext.Container, {
	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'buttongroup',

	/**
	 * @cfg {Object|Function} defaults
	 * This option is a means of applying default settings to all added items
	 * whether added through the items config or via the add or insert methods.
	 */
	defaults: {
		xtype: 'button',
		template: new Ext.Template(
			'<span id="{4}"><button type="{0}" class="{3}"></button></span>'
		),
		tooltipType: 'title'
	},

	/** @cfg {Boolean} forceLayout
	 * If true the container will force a layout initially even if hidden or
	 * collapsed. This option is useful for forcing forms to render in collapsed
	 * or hidden containers. (defaults to false).
	 */
	forceLayout: true,

	/**
	 * Constructor
	 */
	initComponent: function() {
		var config = {
			items: [
				{
					iconCls: 't3-icon t3-icon-actions t3-icon-actions-edit t3-icon-edit-delete',
					tooltip: TYPO3.l10n.localize('elements_button_delete'),
					handler: this.removeElement,
					scope: this
				}, {
					iconCls: 't3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-open',
					tooltip: TYPO3.l10n.localize('elements_button_edit'),
					handler: this.setActive,
					scope: this
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.ButtonGroup.superclass.initComponent.apply(this, arguments);
	},

	/**
	 * Called by the click event of the remove button
	 *
	 * When clicking the remove button a confirmation will be asked by the
	 * container this button group is in.
	 */
	removeElement: function(button, event) {
		event.stopPropagation();
		this.ownerCt.confirmDeleteElement();
	},

	/**
	 * Called by the click event of the edit button
	 *
	 * Tells the element helper that this component is set as the active one
	 */
	setActive: function(button, event) {
		this.ownerCt.setActive(event, event.getTarget());
	}
});

Ext.reg('typo3-form-wizard-buttongroup', TYPO3.Form.Wizard.ButtonGroup);
Ext.namespace('TYPO3.Form.Wizard');

/**
 * Container abstract
 *
 * There are only two containers in a form, the form itself and fieldsets.
 *
 * @class TYPO3.Form.Wizard.Elements.Container
 * @extends Ext.Container
 */
TYPO3.Form.Wizard.Container = Ext.extend(Ext.Container, {
	/**
	 * @cfg {Mixed} autoEl
	 * A tag name or DomHelper spec used to create the Element which will
	 * encapsulate this Component.
	 */
	autoEl: 'ol',

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'formwizard-container',

	/**
	 * @cfg {Object|Function} defaults
	 * This option is a means of applying default settings to all added items
	 * whether added through the items config or via the add or insert methods.
	 */
	defaults: {
		autoHeight: true
	},

	/**
	 * Constructor
	 *
	 * Add the dummy to the container
	 */
	constructor: function(config) {
		Ext.apply(this, {
			items: [
				{
					xtype: 'typo3-form-wizard-elements-dummy'
				}
			]
		});
		TYPO3.Form.Wizard.Container.superclass.constructor.apply(this, arguments);
	},


	/**
	 * Constructor
	 */
	initComponent: function() {
		var config = {};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Container.superclass.initComponent.apply(this, arguments);

			// Initialize the drag and drop zone after rendering
		if (this.hasDragAndDrop) {
			this.on('render', this.initializeDragAndDrop, this);
		}

		this.on('render', this.checkOnEmpty, this);

			// Initialize the remove event, which will be fired when a component is removed from this container
		this.on('remove', this.checkOnEmpty, this);
	},

	/**
	 * Initialize the drag and drop zones
	 *
	 * @param container
	 */
	initializeDragAndDrop: function(container) {
		/**
		 * Initialize the drag zone
		 *
		 * A container can contain elements which can be moved within this and
		 * other (nested) containers.
		 */
		container.dragZone = new Ext.dd.DragZone(container.getEl(), {
			/**
			 * Called when a mousedown occurs in this container. Looks in Ext.dd.Registry
			 * for a valid target to drag based on the mouse down. Override this method
			 * to provide your own lookup logic (e.g. finding a child by class name). Make sure your returned
			 * object has a "ddel" attribute (with an HTML Element) for other functions to work.
			 * @param {EventObject} element The mouse down event element
			 * @return {Object} The dragData
			 */
			getDragData: function(element) {
				var sourceElement = element.getTarget('.formwizard-element');
				var sourceComponent = Ext.getCmp(sourceElement.id);
				if (sourceElement && sourceComponent.isEditable) {
					clonedElement = sourceElement.cloneNode(true);
					clonedElement.id = Ext.id();
					return container.dragData = {
						sourceEl: sourceElement,
						repairXY: Ext.fly(sourceElement).getXY(),
						ddel: clonedElement
					};
				}
			},

			onStartDrag: function(x, y) {
				Ext.getCmp('formwizard').addClass('hover-move');
			},

			endDrag: function(event) {
				Ext.getCmp('formwizard').removeClass('hover-move');
			},

			/**
			 * Called before a repair of an invalid drop to get the XY to animate to.
			 * By default returns the XY of this.dragData.ddel
			 * @param {EventObject} e The mouse up event
			 * @return {Array} The xy location (e.g. [100, 200])
			 */
			getRepairXY: function(e) {
				return container.dragData.repairXY;
			}
		});

		/**
		 * Initialize the drop zone
		 *
		 * A container can receive other form elements or other (nested) containers.
		 */
		container.dropZone = new Ext.dd.DropZone(container.getEl(), {
			/**
			 * Returns a custom data object associated with the DOM node that is the target of the event.  By default
			 * this looks up the event target in the Ext.dd.Registry, although you can override this method to
			 * provide your own custom lookup.
			 *
			 * The override has been done here to define if we are having this event on the container or a form element.
			 *
			 * @param {Event} e The event
			 * @return {Object} data The custom data
			 */
			getTargetFromEvent: function(event) {

				var containerElement = container.getEl();
				var formElementTarget = event.getTarget('.formwizard-element', 10, true);
				var formContainerTarget = event.getTarget('.formwizard-container', 10, true);
				var placeholderTarget = event.getTarget('#element-placeholder', 10, false);

				if (placeholderTarget) {
					formElementTarget = Ext.DomQuery.selectNode('.target-hover');
				}

				if (
					container.hasDragAndDrop &&
					formContainerTarget &&
					formElementTarget &&
					formContainerTarget.findParentNode('li', 10, true) == formElementTarget &&
					formContainerTarget == containerElement
				) {
					return null;
					// We are having this event on a form element
				} else if (
					container.hasDragAndDrop &&
					formElementTarget
				) {
					if (placeholderTarget) {
						return formElementTarget;
					}
					return event.getTarget('.formwizard-element');
					// We are having this event on a container
				} else {
					return null;
				}
			},

			/**
			 * Called while the DropZone determines that a Ext.dd.DragSource is being dragged over it,
			 * but not over any of its registered drop nodes.  The default implementation returns this.dropNotAllowed, so
			 * it should be overridden to provide the proper feedback if necessary.
			 *
			 * And so we did ;-) We are not using containers which can receive different elements, so we always return
			 * Ext.dd.DropZone.prototype.dropAllowed CSS class.
			 *
			 * @param {Ext.dd.DragSource} source The drag source that was dragged over this drop zone
			 * @param {Event} e The event
			 * @param {Object} data An object containing arbitrary data supplied by the drag source
			 * @return {String} status The CSS class that communicates the drop status back to the source so that the
			 * underlying Ext.dd.StatusProxy can be updated
			 */
			onContainerOver: function(dd, e, data) {
				if (Ext.get('element-placeholder')) {
					Ext.get('element-placeholder').remove();
				}
				return Ext.dd.DropZone.prototype.dropAllowed;
			},

			/**
			 * Called when the DropZone determines that a Ext.dd.DragSource has been dropped on it,
			 * but not on any of its registered drop nodes.  The default implementation returns false, so it should be
			 * overridden to provide the appropriate processing of the drop event if you need the drop zone itself to
			 * be able to accept drops.  It should return true when valid so that the drag source's repair action does not run.
			 *
			 * This is a tricky part. Because we are using multiple dropzones which are on top of each other, the event will
			 * be called multiple times, for each group one time. We cannot prevent this by disabling event bubbling and we
			 * dont't want to override the core of ExtJS. To prevent multiple creation of the same object, we add the variable
			 * 'processed' to the 'data' object. If it has been processed on drop, it will not be done a second time.
			 *
			 * @param {Ext.dd.DragSource} source The drag source that was dragged over this drop zone
			 * @param {Event} e The event
			 * @param {Object} data An object containing arbitrary data supplied by the drag source
			 * @return {Boolean} True if the drop was valid, else false
			 */
			onContainerDrop: function(dd, e, data) {
				if (
					container.hasDragAndDrop &&
					!data.processed
				) {
					var dropComponent = Ext.getCmp(data.sourceEl.id);
					container.dropElement(dropComponent, 'container');
					data.processed = true;
				}
				return true;
			},

			/**
			 * Called when the DropZone determines that a Ext.dd.DragSource has entered a drop node
			 * that has either been registered or detected by a configured implementation of getTargetFromEvent.
			 * This method has no default implementation and should be overridden to provide
			 * node-specific processing if necessary.
			 *
			 * Our implementation adds a dummy placeholder before or after the element the user is hovering over.
			 * This placeholder will show the user where the dragged element will be dropped in the form.
			 *
			 * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
			 * getTargetFromEvent for this node)
			 * @param {Ext.dd.DragSource} source The drag source that was dragged over this drop zone
			 * @param {Event} e The event
			 * @param {Object} data An object containing arbitrary data supplied by the drag source
			 */
			onNodeEnter : function(target, dd, e, data) {
				if (
					Ext.get(data.sourceEl).hasClass('formwizard-element') &&
					target.id != data.sourceEl.id
				) {
					var dropPosition = this.getDropPosition(target, dd);
					if (dropPosition == 'above') {
						Ext.DomHelper.insertBefore(target, {
							tag: 'li',
							id: 'element-placeholder',
							html: '&nbsp;'
						});
					} else {
						Ext.DomHelper.insertAfter(target, {
							tag: 'li',
							id: 'element-placeholder',
							html: '&nbsp;'
						});
					}
					Ext.fly(target).addClass('target-hover');
				}
			},

			/**
			 * Called when the DropZone determines that a Ext.dd.DragSource has been dragged out of
			 * the drop node without dropping.  This method has no default implementation and should be overridden to provide
			 * node-specific processing if necessary.
			 *
			 * Removes the temporary placeholder and the hover class from the element
			 *
			 * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
			 * getTargetFromEvent for this node)
			 * @param {Ext.dd.DragSource} source The drag source that was dragged over this drop zone
			 * @param {Event} e The event
			 * @param {Object} data An object containing arbitrary data supplied by the drag source
			 */
			onNodeOut : function(target, dd, e, data) {
				if (
						Ext.get(data.sourceEl).hasClass('formwizard-element') &&
						target.id != data.sourceEl.id
					) {
					if (e.type != 'mouseup') {
						if (Ext.get('element-placeholder')) {
							Ext.get('element-placeholder').remove();
						}
						Ext.fly(target).removeClass('target-hover');
					}
				}
			},

			/**
			 * Called while the DropZone determines that a Ext.dd.DragSource is over a drop node
			 * that has either been registered or detected by a configured implementation of getTargetFromEvent.
			 * The default implementation returns this.dropNotAllowed, so it should be
			 * overridden to provide the proper feedback.
			 *
			 * Based on the cursor position on the node we are hovering over, the temporary placeholder will be put
			 * above or below this node. If the position changes, the placeholder will be removed and put at the
			 * right spot.
			 *
			 * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
			 * getTargetFromEvent for this node)
			 * @param {Ext.dd.DragSource} source The drag source that was dragged over this drop zone
			 * @param {Event} e The event
			 * @param {Object} data An object containing arbitrary data supplied by the drag source
			 * @return {String} status The CSS class that communicates the drop status back to the source so that the
			 * underlying Ext.dd.StatusProxy can be updated
			 */
			onNodeOver: function(target, dd, e, data) {
				if (
						Ext.get(data.sourceEl).hasClass('formwizard-element') &&
						target.id != data.sourceEl.id
				) {
					var dropPosition = this.getDropPosition(target, dd);
						// The position of the target moved to the top
					if (
						dropPosition == 'above' &&
						target.nextElementSibling &&
						target.nextElementSibling.id == 'element-placeholder'
					) {
						Ext.get('element-placeholder').remove();
						Ext.DomHelper.insertBefore(target, {
							tag: 'li',
							id: 'element-placeholder',
							html: '&nbsp;'
						});
					} else if (
						dropPosition == 'below' &&
						target.previousElementSibling &&
						target.previousElementSibling.id == 'element-placeholder'
					) {
						Ext.get('element-placeholder').remove();
						Ext.DomHelper.insertAfter(target, {
							tag: 'li',
							id: 'element-placeholder',
							html: '&nbsp;'
						});
					}
					return Ext.dd.DropZone.prototype.dropAllowed;
				} else {
					return Ext.dd.DropZone.prototype.dropNotAllowed;
				}
			},

			/**
			 * Called when the DropZone determines that a Ext.dd.DragSource has been dropped onto
			 * the drop node.  The default implementation returns false, so it should be overridden to provide the
			 * appropriate processing of the drop event and return true so that the drag source's repair action does not run.
			 *
			 * Like onContainerDrop this is a tricky part. Because we are using multiple dropzones which are on top of each other, the event will
			 * be called multiple times, for each group one time. We cannot prevent this by disabling event bubbling and we
			 * dont't want to override the core of ExtJS. To prevent multiple creation of the same object, we add the variable
			 * 'processed' to the 'data' object. If it has been processed on drop, it will not be done a second time.
			 *
			 *
			 * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
			 * getTargetFromEvent for this node)
			 * @param {Ext.dd.DragSource} source The drag source that was dragged over this drop zone
			 * @param {Event} e The event
			 * @param {Object} data An object containing arbitrary data supplied by the drag source
			 * @return {Boolean} True if the drop was valid, else false
			 */
			onNodeDrop : function(target, dd, e, data) {
				if (
					Ext.get(data.sourceEl).hasClass('formwizard-element') &&
					target.id != data.sourceEl.id &&
					!data.processed
				) {

					var dropPosition = this.getDropPosition(target, dd);
					var dropComponent = Ext.getCmp(data.sourceEl.id);
					container.dropElement(dropComponent, dropPosition, target);
					data.processed = true;
					return true;
				}
			},
			/**
			 * Defines whether we are hovering at the top or bottom half of a node
			 *
			 * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
			 * getTargetFromEvent for this node)
			 * @param {Ext.dd.DragSource} source The drag source that was dragged over this drop zone
			 * @return {String} above when hovering over the top half, below if at the bottom half.
			 */
			getDropPosition: function(target, dd) {
				var top = Ext.lib.Dom.getY(target);
				var bottom = top + target.offsetHeight;
				var center = ((bottom - top) / 2) + top;
				var yPosition = dd.lastPageY + dd.deltaY;
				if (yPosition < center) {
					return 'above';
				} else if (yPosition >= center) {
					return 'below';
				}
			}
		});
	},

	/**
	 * Called by the dropzones onContainerDrop or onNodeDrop.
	 * Adds the component to the container.
	 *
	 * This function will look if it is a new element from the left buttons, if
	 * it is an existing element which is moved within this or from another
	 * container. It also decides if it is dropped within an empty container or
	 * if it needs a position within the existing elements of this container.
	 *
	 * @param component
	 * @param position
	 * @param target
	 */
	dropElement: function(component, position, target) {
			// Check if there are errors in the current active element
		var optionsTabIsValid = Ext.getCmp('formwizard-left-options').tabIsValid();

		var id = component.id;
		var droppedElement = {};

		if (Ext.get('element-placeholder')) {
			Ext.get('element-placeholder').remove();
		}
			// Only add or move an element when there is no error in the current active element
		if (optionsTabIsValid) {
				// New element in container
			if (position == 'container') {
					// Check if the dummy is present, which means there are no elements
				var dummy = this.findById('dummy');
				if (dummy) {
					this.remove(dummy, true);
				}
					// Add the new element to the container
				if (component.xtype != 'button') {
					droppedElement = this.add(
						component
					);
				} else {
					droppedElement = this.add({
						xtype: 'typo3-form-wizard-elements-' + id
					});
				}

				// Moved an element within this container
			} else if (this.findById(id)) {
				droppedElement = this.findById(id);
				var movedElementIndex = 0;
				var targetIndex = this.items.findIndex('id', target.id);

				if (position == 'above') {
					movedElementIndex = targetIndex;
				} else {
					movedElementIndex = targetIndex + 1;
				}

					// Tricky part, because this.remove does not remove the DOM element
					// See http://www.sencha.com/forum/showthread.php?102190
					// 1. remove component from container w/o destroying (2nd argument false)
					// 2. remove component's element from container and append it to body
					// 3. add/insert the component to the correct place back in the container
					// 4. call doLayout() on the container
				this.remove(droppedElement, false);
				var element = Ext.get(droppedElement.id);
				element.appendTo(Ext.getBody());

				this.insert(
					movedElementIndex,
					droppedElement
				);

				// New element for this container coming from another one
			} else {
				var index = 0;
				var targetIndex = this.items.findIndex('id', target.id);

				if (position == 'above') {
					index = targetIndex;
				} else {
					index = targetIndex + 1;
				}

					// Element moved
				if (component.xtype != 'button') {
					droppedElement = this.insert(
						index,
						component
					);
					// Coming from buttons
				} else {
					droppedElement = this.insert(
						index,
						{
							xtype: 'typo3-form-wizard-elements-' + id
						}
					);
				}
			}
			this.doLayout();
			TYPO3.Form.Wizard.Helpers.History.setHistory();
			TYPO3.Form.Wizard.Helpers.Element.setActive(droppedElement);

			// The current active element has errors, show it!
		} else {
			Ext.MessageBox.show({
				title: TYPO3.l10n.localize('options_error'),
				msg: TYPO3.l10n.localize('options_error_message'),
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.MessageBox.OK
			});
		}
	},

	/**
	 * Remove the element from this container
	 *
	 * @param element
	 */
	removeElement: function(element) {
		this.remove(element);
		TYPO3.Form.Wizard.Helpers.History.setHistory();
	},

	/**
	 * Called by the 'remove' event of this container.
	 *
	 * If an item has been removed from this container, except for the dummy
	 * element, it will look if there are other items existing. If not, it will
	 * put the dummy in this container to tell the user the container needs items.
	 *
	 * @param container
	 * @param component
	 */
	checkOnEmpty: function(container, component) {
		if (component && component.id != 'dummy' || !component) {
			if (this.items.getCount() == 0) {
				this.add({
					xtype: 'typo3-form-wizard-elements-dummy'
				});
				this.doLayout();
			}
		}
	},

	/**
	 * Called by the parent of this component when a change has been made in the
	 * form.
	 *
	 * Constructs an array out of this component and the children to add it to
	 * the history or to use when saving the form
	 *
	 * @returns {Array}
	 */
	getConfiguration: function() {
		var historyConfiguration = {
			hasDragAndDrop: this.hasDragAndDrop
		};

		if (this.items) {
			historyConfiguration.items = [];
			this.items.each(function(item, index, length) {
				historyConfiguration.items.push(item.getConfiguration());
			}, this);
		}
		return historyConfiguration;
	}
});

Ext.reg('typo3-form-wizard-container', TYPO3.Form.Wizard.Container);
Ext.namespace('TYPO3.Form.Wizard.Elements');

/**
 * Elements abstract
 *
 * @class TYPO3.Form.Wizard.Elements
 * @extends Ext.Container
 */
TYPO3.Form.Wizard.Elements = Ext.extend(Ext.Container, {
	/**
	 * @cfg {Mixed} autoEl
	 * A tag name or DomHelper spec used to create the Element which will
	 * encapsulate this Component.
	 */
	autoEl: 'li',

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'formwizard-element',

	/**
	 * @cfg {Object} buttonGroup
	 * Reference to the button group
	 */
	buttonGroup: null,

	/**
	 * @cfg {Boolean} isEditable
	 * Defines whether the element is editable. If the item is editable,
	 * a button group with remove and edit buttons will be added to this element
	 * and when the the element is clicked, an event is triggered to edit the
	 * element. Some elements, like the dummy, don't need this.
	 */
	isEditable: true,

	/**
	 * @cfg {Object} configuration
	 * The configuration of this element.
	 * This object contains the configuration of this component. It will be
	 * copied to the 'data' variable before rendering. 'data' is deleted after
	 * rendering the xtemplate, so we need a copy.
	 */
	configuration: {},

	/**
	 * Constructor
	 */
	initComponent: function() {
		this.addEvents({
			'configurationChange': true
		});

		var config = {};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Elements.superclass.initComponent.apply(this, arguments);

			// Add the elementClass to the component
		this.addClass(this.elementClass);

			// Add the listener setactive for the element helper
		TYPO3.Form.Wizard.Helpers.Element.on('setactive', this.toggleActive, this);

			// Set the data before rendering
		this.on('beforerender', this.beforeRender, this);

			// Initialize events after rendering
		this.on('afterrender', this.makeEditable, this);

			// Remove event listeners after the detruction of this component
		this.on('destroy', this.onDestroy, this);
	},

	/**
	 * Copy this.configuration to this.data before rendering
	 *
	 * When using tpl together with data, the data variable will be deleted
	 * after rendering the component. We do not want to lose this data, so we
	 * store it in a different variable 'configuration' which will be copied to
	 * data just before rendering
	 *
	 * All strings within the configuration object are HTML encoded first before
	 * displaying
	 *
	 * @param component This component
	 */
	beforeRender: function(component) {
		this.data = this.encodeConfiguration(this.configuration);
	},

	/**
	 * Html encode all strings in the configuration of an element
	 *
	 * @param unencodedData The configuration object
	 * @returns {Object}
	 */
	encodeConfiguration: function(unencodedData) {
		var encodedData = {};

		Ext.iterate(unencodedData, function (key, value, object) {
			if (Ext.isString(value)) {
				encodedData[key] = Ext.util.Format.htmlEncode(value);
			} else if (Ext.isObject(value)) {
				encodedData[key] = this.encodeConfiguration(value);
			} else {
				encodedData[key] = value;
			}
		}, this);

		return encodedData;
	},

	/**
	 * Add the buttongroup and a click event listener to this component when the
	 * component is editable.
	 */
	makeEditable: function() {
		if (this.isEditable) {
			if (!this.buttonGroup) {
				this.add({
					xtype: 'typo3-form-wizard-buttongroup',
					ref: 'buttonGroup'
				});
			}
			this.el.un('click', this.setActive, this);
			this.el.on('click', this.setActive, this);
				// Add hover class. Normally this would be done with overCls,
				// but this does not take bubbling (propagation) into account
			this.el.hover(
				function(){
					Ext.fly(this).addClass('hover');
				},
				function(){
					Ext.fly(this).removeClass('hover');
				},
				this.el,
				{
					stopPropagation: true
				}
			);
		}
	},

	/**
	 * Called on a click event of this component or when the element is added
	 *
	 * Tells the element helper that this component is set as the active one and
	 * swallows the click event to prevent bubbling
	 *
	 * @param event
	 * @param target
	 * @param object
	 */
	setActive: function(event, target, object) {
		TYPO3.Form.Wizard.Helpers.Element.setActive(this);
		event.stopPropagation();
	},

	/**
	 * Called when the element helper is firing the setactive event
	 *
	 * Adds an extra class 'active' to the element when the current component is
	 * the active one, otherwise removes the class 'active' when this component
	 * has this class
	 * @param component
	 */
	toggleActive: function(component) {
		if (this.isEditable) {
			var element = this.getEl();

			if (component && component.getId() == this.getId()) {
				if (!element.hasClass('active')) {
					element.addClass('active');
				}
			} else if (element.hasClass('active')) {
				element.removeClass('active');
			}
		}
	},

	/**
	 * Display a confirmation box when the delete button has been pressed.
	 *
	 * @param event
	 * @param target
	 * @param object
	 */
	confirmDeleteElement: function(event, target, object) {
		Ext.MessageBox.confirm(
			TYPO3.l10n.localize('elements_confirm_delete_title'),
			TYPO3.l10n.localize('elements_confirm_delete_description'),
			this.deleteElement,
			this
		);
	},

	/**
	 * Delete the component when the yes button of the confirmation box has been
	 * pressed.
	 *
	 * @param button The button which has been pressed (yes / no)
	 */
	deleteElement: function(button) {
		if (button == 'yes') {
			this.ownerCt.removeElement(this);
		}
	},

	/**
	 * Called by the parent of this component when a change has been made in the
	 * form.
	 *
	 * Constructs an array out of this component and the children to add it to
	 * the history or to use when saving the form
	 *
	 * @returns {Array}
	 */
	getConfiguration: function() {
		var historyConfiguration = {
			configuration: this.configuration,
			isEditable: this.isEditable,
			xtype: this.xtype
		};

		if (this.containerComponent) {
			historyConfiguration.elementContainer = this.containerComponent.getConfiguration();
		}
		return historyConfiguration;
	},

	/**
	 * Called when a configuration property has changed in the options tab
	 *
	 * Overwrites the configuration with the configuration from the form,
	 * adds a new snapshot to the history and renders this component again.
	 * @param formConfiguration
	 */
	setConfigurationValue: function(formConfiguration) {
		Ext.merge(this.configuration, formConfiguration);
		TYPO3.Form.Wizard.Helpers.History.setHistory();
		this.rendered = false;
		this.render();
		this.doLayout();
		this.fireEvent('configurationChange', this);
	},

	/**
	 * Remove a validation rule from this element
	 *
	 * @param type
	 */
	removeValidationRule: function(type) {
		if (this.configuration.validation[type]) {
			delete this.configuration.validation[type];
			TYPO3.Form.Wizard.Helpers.History.setHistory();
			if (this.xtype != 'typo3-form-wizard-elements-basic-form') {
				this.rendered = false;
				this.render();
				this.doLayout();
			}
		}
	},

	/**
	 * Remove a filter from this element
	 *
	 * @param type
	 */
	removeFilter: function(type) {
		if (this.configuration.filters[type]) {
			delete this.configuration.filters[type];
			TYPO3.Form.Wizard.Helpers.History.setHistory();
			if (this.xtype != 'typo3-form-wizard-elements-basic-form') {
				this.rendered = false;
				this.render();
				this.doLayout();
			}
		}
	},

	/**
	 * Fires after the component is destroyed.
	 *
	 * Removes the listener for the 'setactive' event of the element helper.
	 * Tells the element helper this element is destroyed and if set active,
	 * it should be unset as active.
	 */
	onDestroy: function() {
		TYPO3.Form.Wizard.Helpers.Element.un('setactive', this.toggleActive, this);
		TYPO3.Form.Wizard.Helpers.Element.unsetActive(this);
	}
});

Ext.reg('typo3-form-wizard-elements',TYPO3.Form.Wizard.Elements);
Ext.namespace('TYPO3.Form.Wizard.Elements');

/**
 * The dummy element
 *
 * This type will be shown when there is no element in a container which will be
 * form or fieldset and will be removed when there is an element added.
 *
 * @class TYPO3.Form.Wizard.Elements.Dummy
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Dummy = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'dummy',

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'dummy typo3-message message-information',

	/**
	 * @cfg {Object} configuration
	 * The configuration of this element.
	 * This object contains the configuration of this component. It will be
	 * copied to the 'data' variable before rendering. 'data' is deleted after
	 * rendering the xtemplate, so we need a copy.
	 */
	configuration: {
		title: TYPO3.l10n.localize('elements_dummy_title'),
		description: TYPO3.l10n.localize('elements_dummy_description')
	},

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<p><strong>{title}</strong></p>',
		'<p>{description}</p>'
	),

	/**
	 * @cfg {Boolean} isEditable
	 * Defines whether the element is editable. If the item is editable,
	 * a button group with remove and edit buttons will be added to this element
	 * and when the the element is clicked, an event is triggered to edit the
	 * element. Some elements, like the dummy, don't need this.
	 */
	isEditable: false
});

Ext.reg('typo3-form-wizard-elements-dummy', TYPO3.Form.Wizard.Elements.Dummy);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The BUTTON element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Button
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Button = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'button',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					name: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'button',
					value: TYPO3.l10n.localize('tx_form_domain_model_element_button.value')
				},
				filters: {},
				label: {
					value: ''
				},
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Button.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-button', TYPO3.Form.Wizard.Elements.Basic.Button);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The CHECKBOX element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Checkbox
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Checkbox = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'x-checkbox',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					name: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'checkbox',
					value: ''
				},
				filters: {},
				label: {
					value: TYPO3.l10n.localize('elements_label')
				},
				layout: 'back',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Checkbox.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-checkbox', TYPO3.Form.Wizard.Elements.Basic.Checkbox);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The FIELDSET element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Fieldset
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Fieldset = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'fieldset',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div>',
			'<fieldset {[this.getAttributes(values.attributes)]}>',
			'<tpl for="legend">',
				'<tpl if="value">',
					'<legend>{value}</legend>',
				'</tpl>',
			'</tpl>',
			'<ol></ol>',
			'</fieldset>',
		'</div>',
		{
			compiled: true,
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * @cfg {Array} elementContainer
	 * Configuration for the containerComponent
	 */
	elementContainer: {
		hasDragAndDrop: true
	},

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					"class": '',
					dir: '',
					id: '',
					lang: '',
					style: ''
				},
				legend: {
					value: TYPO3.l10n.localize('elements_legend')
				}
			}
		});

		TYPO3.Form.Wizard.Elements.Basic.Fieldset.superclass.constructor.apply(this, arguments);
	},

	/**
	 * Constructor
	 */
	initComponent: function() {
		var config = {};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// Initialize the container component
		this.containerComponent = new TYPO3.Form.Wizard.Container(this.elementContainer);

			// call parent
		TYPO3.Form.Wizard.Elements.Basic.Fieldset.superclass.initComponent.apply(this, arguments);

			// Initialize events after rendering
		this.on('afterrender', this.afterRender, this);
	},

	/**
	 * Called by the 'afterrender' event.
	 *
	 * Add the container component to this component
	 */
	afterRender: function() {
		this.addContainerAfterRender();

			// Call parent
		TYPO3.Form.Wizard.Elements.Basic.Form.superclass.afterRender.call(this);
	},

	/**
	 * Add the container component to this component
	 *
	 * Because we are using a XTemplate for rendering this component, we can
	 * only add the container after rendering, because the <ol> tag needs to be
	 * replaced with this container.
	 *
	 * The container needs to be rerendered when a configuration parameter
	 * (legend or attributes) of the ownerCt, for instance fieldset, has changed
	 * otherwise it will not show up
	 */
	addContainerAfterRender: function() {
		this.containerComponent.applyToMarkup(this.getEl().child('ol'));
		this.containerComponent.rendered = false;
		this.containerComponent.render();
		this.containerComponent.doLayout();
	}
});

Ext.reg('typo3-form-wizard-elements-basic-fieldset', TYPO3.Form.Wizard.Elements.Basic.Fieldset);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The FILEUPLOAD element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Fileupload
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Fileupload = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'fileupload',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					name: '',
					size: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'file'
				},
				filters: {},
				label: {
					value: TYPO3.l10n.localize('elements_label')
				},
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Fileupload.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-fileupload', TYPO3.Form.Wizard.Elements.Basic.Fileupload);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The FORM element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Form
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Form = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {Mixed} autoEl
	 * A tag name or DomHelper spec used to create the Element which will
	 * encapsulate this Component.
	 */
	autoEl: 'li',

	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'form',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<form {[this.getAttributes(values.attributes)]}>',
		'<ol></ol>',
		'</form>',
		{
			compiled: true,
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * @cfg {Boolean} isEditable
	 * Defines whether the element is editable. If the item is editable,
	 * a button group with remove and edit buttons will be added to this element
	 * and when the the element is clicked, an event is triggered to edit the
	 * element. Some elements, like the dummy, don't need this.
	 */
	isEditable: false,

	/**
	 * @cfg {Array} elementContainer
	 * Configuration for the containerComponent
	 */
	elementContainer: {
		hasDragAndDrop: true
	},

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accept: '',
					acceptcharset: '',
					action: '',
					"class": '',
					dir: '',
					enctype: 'application/x-www-form-urlencoded',
					id: '',
					lang: '',
					method: 'post',
					style: '',
					title: ''
				},
				prefix: 'tx_form',
				confirmation: true,
				postProcessor: {
					mail: {
						recipientEmail: '',
						senderEmail: ''
					}
				}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Form.superclass.constructor.apply(this, arguments);
	},

	/**
	 * Constructor
	 */
	initComponent: function() {
		var config = {};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// Initialize the container component
		this.containerComponent = new TYPO3.Form.Wizard.Container(this.elementContainer);

			// Call parent
		TYPO3.Form.Wizard.Elements.Basic.Form.superclass.initComponent.apply(this, arguments);

			// Initialize events after rendering
		this.on('afterrender', this.afterRender, this);
	},

	/**
	 * Called by the 'afterrender' event.
	 *
	 * Add the container component to this component
	 * Stop the submit event of the form, because this form does not need to be
	 * submitted
	 */
	afterRender: function() {
		this.addContainerAfterRender();

		this.getEl().child('form').on(
			'submit',
			function(eventObject, htmlElement, object) {
				eventObject.stopEvent();
			}
		);

			// Call parent
		TYPO3.Form.Wizard.Elements.Basic.Form.superclass.afterRender.call(this);
	},

	/**
	 * Add the container component to this component
	 *
	 * Because we are using a XTemplate for rendering this component, we can
	 * only add the container after rendering, because the <ol> tag needs to be
	 * replaced with this container.
	 */
	addContainerAfterRender: function() {
		this.containerComponent.applyToMarkup(this.getEl().child('ol'));
		this.containerComponent.rendered = false;
		this.containerComponent.render();
		this.containerComponent.doLayout();
	},

	/**
	 * Remove a post processor from this element
	 *
	 * @param type
	 */
	removePostProcessor: function(type) {
		if (this.configuration.postProcessor[type]) {
			delete this.configuration.postProcessor[type];
			TYPO3.Form.Wizard.Helpers.History.setHistory();
		}
	}
});

Ext.reg('typo3-form-wizard-elements-basic-form', TYPO3.Form.Wizard.Elements.Basic.Form);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The HIDDEN element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Hidden
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Hidden = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'hidden',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<input {[this.getAttributes(values.attributes)]} />',
		'</div>',
		{
			compiled: true,
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					"class": '',
					id: '',
					lang: '',
					name: '',
					style: '',
					type: 'hidden',
					value: ''
				},
				filters: {},
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Hidden.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-hidden', TYPO3.Form.Wizard.Elements.Basic.Hidden);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The PASSWORD element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Password
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Password = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'password',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					maxlength: '',
					name: '',
					readonly: '',
					size: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'password',
					value: ''
				},
				filters: {},
				label: {
					value: TYPO3.l10n.localize('elements_label')
				},
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Password.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-password', TYPO3.Form.Wizard.Elements.Basic.Password);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The RADIO element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Radio
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Radio = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'x-radio',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					name: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'radio',
					value: ''
				},
				filters: {},
				label: {
					value: TYPO3.l10n.localize('elements_label')
				},
				layout: 'back',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Radio.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-radio', TYPO3.Form.Wizard.Elements.Basic.Radio);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The RESET element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Reset
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Reset = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'reset',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					name: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'reset',
					value: TYPO3.l10n.localize('tx_form_domain_model_element_reset.value')
				},
				filters: {},
				label: {
					value: ''
				},
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Reset.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-reset', TYPO3.Form.Wizard.Elements.Basic.Reset);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The SELECT element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Select
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Select = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'select',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<select {[this.getAttributes(values.attributes)]}>',
				'<tpl for="options">',
					'<option {[this.getAttributes(values.attributes)]}>{data}</option>',
				'</tpl>',
			'</select>',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					"class": '',
					disabled: '',
					id: '',
					lang: '',
					multiple: '',
					name: '',
					size: '',
					style: '',
					tabindex: '',
					title: ''
				},
				filters: {},
				label: {
					value: TYPO3.l10n.localize('elements_label')
				},
				options: [
					{
						data: TYPO3.l10n.localize('elements_option_1')
					}, {
						data: TYPO3.l10n.localize('elements_option_2')
					}, {
						data: TYPO3.l10n.localize('elements_option_3')
					}
				],
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Select.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-select', TYPO3.Form.Wizard.Elements.Basic.Select);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The SUBMIT element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Submit
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Submit = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'submit',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					name: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'submit',
					value: TYPO3.l10n.localize('tx_form_domain_model_element_submit.value')
				},
				filters: {},
				label: {
					value: ''
				},
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Submit.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-submit', TYPO3.Form.Wizard.Elements.Basic.Submit);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The TEXTAREA element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Textarea
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Textarea = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'textarea',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<textarea {[this.getAttributes(values.attributes)]}>{data}</textarea>',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					"class": '',
					cols: '40',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					name: '',
					readonly: '',
					rows: '5',
					style: '',
					tabindex: '',
					title: ''
				},
				data: '',
				filters: {},
				label: {
					value: TYPO3.l10n.localize('elements_label')
				},
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Textarea.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-textarea', TYPO3.Form.Wizard.Elements.Basic.Textarea);
Ext.namespace('TYPO3.Form.Wizard.Elements.Basic');

/**
 * The TEXTLINE element
 *
 * @class TYPO3.Form.Wizard.Elements.Basic.Textline
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Basic.Textline = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'textline',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'front\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
			'<input {[this.getAttributes(values.attributes)]} />',
			'<tpl for="label">',
				'<tpl if="value && parent.layout == \'back\'">',
					'<label for="">{value}{[this.getMessage(parent.validation)]}</label>',
				'</tpl>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					accesskey: '',
					alt: '',
					"class": '',
					dir: '',
					disabled: '',
					id: '',
					lang: '',
					maxlength: '',
					name: '',
					readonly: '',
					size: '',
					style: '',
					tabindex: '',
					title: '',
					type: 'text',
					value: ''
				},
				filters: {},
				label: {
					value: TYPO3.l10n.localize('elements_label')
				},
				layout: 'front',
				validation: {}
			}
		});
		TYPO3.Form.Wizard.Elements.Basic.Textline.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-basic-textline', TYPO3.Form.Wizard.Elements.Basic.Textline);
Ext.namespace('TYPO3.Form.Wizard.Elements.Predefined');

/**
 * The predefined EMAIL element
 *
 * @class TYPO3.Form.Wizard.Elements.Predefined.Email
 * @extends TYPO3.Form.Wizard.Elements.Basic.Textline
 */
TYPO3.Form.Wizard.Elements.Predefined.Email = Ext.extend(TYPO3.Form.Wizard.Elements.Basic.Textline, {
	/**
	 * Initialize the component
	 */
	initComponent: function() {
		var config = {
			configuration: {
				attributes: {
					name: 'email'
				},
				label: {
					value: TYPO3.l10n.localize('elements_label_email')
				},
				validation: {
					required: {
						breakOnError: 0,
						showMessage: 1,
						message: TYPO3.l10n.localize('tx_form_system_validate_required.message'),
						error: TYPO3.l10n.localize('tx_form_system_validate_required.error')
					},
					email: {
						breakOnError: 0,
						showMessage: 1,
						message: TYPO3.l10n.localize('tx_form_system_validate_email.message'),
						error: TYPO3.l10n.localize('tx_form_system_validate_email.error')
					}
				}
			}
		};

			// MERGE config
		Ext.merge(this, config);

			// call parent
		TYPO3.Form.Wizard.Elements.Predefined.Email.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-predefined-email', TYPO3.Form.Wizard.Elements.Predefined.Email);
Ext.namespace('TYPO3.Form.Wizard.Elements.Predefined');

/**
 * The predefined CHECKBOX GROUP element
 *
 * @class TYPO3.Form.Wizard.Elements.Predefined.CheckboxGroup
 * @extends TYPO3.Form.Wizard.Elements.Basic.Fieldset
 */
TYPO3.Form.Wizard.Elements.Predefined.CheckboxGroup = Ext.extend(TYPO3.Form.Wizard.Elements.Basic.Fieldset, {
	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<fieldset {[this.getAttributes(values.attributes)]}>',
			'<tpl for="legend">',
				'<tpl if="value">',
					'<legend>{value}{[this.getMessage(parent.validation)]}</legend>',
				'</tpl>',
			'</tpl>',
			'<ol></ol>',
			'</fieldset>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Initialize the component
	 */
	initComponent: function() {
		var config = {
			elementContainer: {
				hasDragAndDrop: false
			},
			configuration: {
				attributes: {
					"class": 'fieldset-subgroup',
					dir: '',
					id: '',
					lang: '',
					style: ''
				},
				legend: {
					value: TYPO3.l10n.localize('elements_legend')
				},
				options: [
					{
						data: TYPO3.l10n.localize('elements_option_1')
					}, {
						data: TYPO3.l10n.localize('elements_option_2')
					}, {
						data: TYPO3.l10n.localize('elements_option_3')
					}
				],
				various: {
					name: ''
				},
				validation: {}
			}
		};

			// apply config
		Ext.apply(this, Ext.apply(config, this.initialConfig));

			// call parent
		TYPO3.Form.Wizard.Elements.Predefined.CheckboxGroup.superclass.initComponent.apply(this, arguments);

		this.on('configurationChange', this.rebuild, this);

		this.on('afterrender', this.rebuild, this);
	},

	/**
	 * Add the radio buttons to the containerComponent of this fieldset,
	 * according to the configuration options.
	 *
	 * @param component
	 */
	rebuild: function(component) {
		this.containerComponent.removeAll();
		if (this.configuration.options.size() > 0) {
			var dummy = this.containerComponent.findById('dummy');
			if (dummy) {
				this.containerComponent.remove(dummy, true);
			}
			this.configuration.options.each(function(option, index, length) {
				var checkbox = this.containerComponent.add({
					xtype: 'typo3-form-wizard-elements-basic-checkbox',
					isEditable: false,
					cls: ''
				});
				var checkboxConfiguration = {
					label: {
						value: option.data
					},
					attributes: {}
				};
				if (
					option.attributes &&
					option.attributes.selected &&
					option.attributes.selected == 'selected'
				) {
					checkboxConfiguration.attributes.checked = 'checked';
				}
				Ext.merge(checkbox.configuration, checkboxConfiguration);
			}, this);
			this.containerComponent.doLayout();
		}
	}
});

Ext.reg('typo3-form-wizard-elements-predefined-checkboxgroup', TYPO3.Form.Wizard.Elements.Predefined.CheckboxGroup);
Ext.namespace('TYPO3.Form.Wizard.Elements.Predefined');

/**
 * The predefined NAME element
 *
 * @class TYPO3.Form.Wizard.Elements.Predefined.Name
 * @extends TYPO3.Form.Wizard.Elements.Basic.Fieldset
 */
TYPO3.Form.Wizard.Elements.Predefined.Name = Ext.extend(TYPO3.Form.Wizard.Elements.Basic.Fieldset, {
	/**
	 * Initialize the component
	 */
	initComponent: function() {
		var config = {
			configuration: {
				attributes: {
					"class": 'predefined-name fieldset-subgroup fieldset-horizontal label-below',
					dir: '',
					id: '',
					lang: '',
					style: ''
				},
				legend: {
					value: TYPO3.l10n.localize('elements_legend_name')
				},
				various: {
					prefix: true,
					suffix: true,
					middleName: true
				}
			}
		};

			// apply config
		Ext.apply(this, Ext.apply(config, this.initialConfig));

			// call parent
		TYPO3.Form.Wizard.Elements.Predefined.Name.superclass.initComponent.apply(this, arguments);

		this.on('configurationChange', this.rebuild, this);

		this.on('afterrender', this.rebuild, this);
	},

	/**
	 * Add the fields to the containerComponent of this fieldset,
	 * according to the configuration options.
	 *
	 * @param component
	 */
	rebuild: function(component) {
		this.containerComponent.removeAll();
		var dummy = this.containerComponent.findById('dummy');
		if (dummy) {
			this.containerComponent.remove(dummy, true);
		}
		if (this.configuration.various.prefix) {
			var prefix = this.containerComponent.add({
				xtype: 'typo3-form-wizard-elements-basic-textline',
				isEditable: false,
				cls: '',
				configuration: {
					label: {
						value: TYPO3.l10n.localize('elements_label_prefix')
					},
					attributes: {
						name: 'prefix',
						size: 4
					},
					layout: 'back'
				}
			});
		}
		var firstName = this.containerComponent.add({
			xtype: 'typo3-form-wizard-elements-basic-textline',
			isEditable: false,
			cls: '',
			configuration: {
				label: {
					value: TYPO3.l10n.localize('elements_label_firstname')
				},
				attributes: {
					name: 'firstName',
					size: 10
				},
				layout: 'back',
				validation: {
					required: {
						breakOnError: 0,
						showMessage: true,
						message: '*',
						error: 'Required'
					}
				}
			}
		});
		if (this.configuration.various.middleName) {
			var middleName = this.containerComponent.add({
				xtype: 'typo3-form-wizard-elements-basic-textline',
				isEditable: false,
				cls: '',
				configuration: {
					label: {
						value: TYPO3.l10n.localize('elements_label_middlename')
					},
					attributes: {
						name: 'middleName',
						size: 6
					},
					layout: 'back'
				}
			});
		}
		var lastName = this.containerComponent.add({
			xtype: 'typo3-form-wizard-elements-basic-textline',
			isEditable: false,
			cls: '',
			configuration: {
				label: {
					value: TYPO3.l10n.localize('elements_label_lastname')
				},
				attributes: {
					name: 'lastName',
					size: 15
				},
				layout: 'back',
				validation: {
					required: {
						breakOnError: 0,
						showMessage: true,
						message: '*',
						error: 'Required'
					}
				}
			}
		});
		if (this.configuration.various.suffix) {
			var suffix = this.containerComponent.add({
				xtype: 'typo3-form-wizard-elements-basic-textline',
				isEditable: false,
				cls: '',
				configuration: {
					label: {
						value: TYPO3.l10n.localize('elements_label_suffix')
					},
					attributes: {
						name: 'suffix',
						size: 4
					},
					layout: 'back'
				}
			});
		}
		this.containerComponent.doLayout();
	}
});

Ext.reg('typo3-form-wizard-elements-predefined-name', TYPO3.Form.Wizard.Elements.Predefined.Name);
Ext.namespace('TYPO3.Form.Wizard.Elements.Predefined');

/**
 * The predefined RADIO GROUP element
 *
 * @class TYPO3.Form.Wizard.Elements.Predefined.RadioGroup
 * @extends TYPO3.Form.Wizard.Elements.Basic.Fieldset
 */
TYPO3.Form.Wizard.Elements.Predefined.RadioGroup = Ext.extend(TYPO3.Form.Wizard.Elements.Basic.Fieldset, {
	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<fieldset {[this.getAttributes(values.attributes)]}>',
			'<tpl for="legend">',
				'<tpl if="value">',
					'<legend>{value}{[this.getMessage(parent.validation)]}</legend>',
				'</tpl>',
			'</tpl>',
			'<ol></ol>',
			'</fieldset>',
		'</div>',
		{
			compiled: true,
			getMessage: function(rules) {
				var messageHtml = '';
				var messages = [];
				Ext.iterate(rules, function(rule, configuration) {
					if (configuration.showMessage) {
						messages.push(configuration.message);
					}
				}, this);

				messageHtml = ' <em>' + messages.join(', ') + '</em>';
				return messageHtml;

			},
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Initialize the component
	 */
	initComponent: function() {
		var config = {
			elementContainer: {
				hasDragAndDrop: false
			},
			configuration: {
				attributes: {
					"class": 'fieldset-subgroup',
					dir: '',
					id: '',
					lang: '',
					style: ''
				},
				legend: {
					value: TYPO3.l10n.localize('elements_legend')
				},
				options: [
					{
						data: TYPO3.l10n.localize('elements_option_1')
					}, {
						data: TYPO3.l10n.localize('elements_option_2')
					}, {
						data: TYPO3.l10n.localize('elements_option_3')
					}
				],
				various: {
					name: ''
				},
				validation: {}
			}
		};

			// apply config
		Ext.apply(this, Ext.apply(config, this.initialConfig));

			// call parent
		TYPO3.Form.Wizard.Elements.Predefined.RadioGroup.superclass.initComponent.apply(this, arguments);

		this.on('configurationChange', this.rebuild, this);

		this.on('afterrender', this.rebuild, this);
	},

	/**
	 * Add the radio buttons to the containerComponent of this fieldset,
	 * according to the configuration options.
	 *
	 * @param component
	 */
	rebuild: function(component) {
		this.containerComponent.removeAll();
		if (this.configuration.options.size() > 0) {
			var dummy = this.containerComponent.findById('dummy');
			if (dummy) {
				this.containerComponent.remove(dummy, true);
			}
			this.configuration.options.each(function(option, index, length) {
				var radio = this.containerComponent.add({
					xtype: 'typo3-form-wizard-elements-basic-radio',
					isEditable: false,
					cls: ''
				});
				var radioConfiguration = {
					label: {
						value: option.data
					},
					attributes: {}
				};
				if (
					option.attributes &&
					option.attributes.selected &&
					option.attributes.selected == 'selected'
				) {
					radioConfiguration.attributes.checked = 'checked';
				}
				Ext.merge(radio.configuration, radioConfiguration);
			}, this);
			this.containerComponent.doLayout();
		}
	}
});

Ext.reg('typo3-form-wizard-elements-predefined-radiogroup', TYPO3.Form.Wizard.Elements.Predefined.RadioGroup);
Ext.namespace('TYPO3.Form.Wizard.Elements.Content');

/**
 * The content HEADER element
 *
 * @class TYPO3.Form.Wizard.Elements.Content.Header
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Content.Header = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'header',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="various">',
				'<{headingSize} {[this.getAttributes(parent.attributes)]}>',
				'{content}',
				'</{type}>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					"class": 'content-header',
					dir: '',
					id: '',
					lang: '',
					style: '',
					title: ''
				},
				various: {
					headingSize: 'h1',
					content: TYPO3.l10n.localize('elements_header_content')
				}
			}
		});
		TYPO3.Form.Wizard.Elements.Content.Header.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-content-header', TYPO3.Form.Wizard.Elements.Content.Header);
Ext.namespace('TYPO3.Form.Wizard.Elements.Content');

/**
 * The content HEADER element
 *
 * @class TYPO3.Form.Wizard.Elements.Content.Header
 * @extends TYPO3.Form.Wizard.Elements
 */
TYPO3.Form.Wizard.Elements.Content.Textblock = Ext.extend(TYPO3.Form.Wizard.Elements, {
	/**
	 * @cfg {String} elementClass
	 * An extra CSS class that will be added to this component's Element
	 */
	elementClass: 'textblock',

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<div class="overflow-hidden">',
			'<tpl for="various">',
				'<div {[this.getAttributes(parent.attributes)]}>',
				'{content}',
				'</{type}>',
			'</tpl>',
		'</div>',
		{
			compiled: true,
			getAttributes: function(attributes) {
				var attributesHtml = '';
				Ext.iterate(attributes, function(key, value) {
					if (value) {
						attributesHtml += key + '="' + value + '" ';
					}
				}, this);
				return attributesHtml;
			}
		}
	),

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				attributes: {
					"class": 'content-textblock',
					dir: '',
					id: '',
					lang: '',
					style: '',
					title: ''
				},
				various: {
					content: TYPO3.l10n.localize('elements_textblock_content')
				}
			}
		});
		TYPO3.Form.Wizard.Elements.Content.Textblock.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-elements-content-textblock', TYPO3.Form.Wizard.Elements.Content.Textblock);
Ext.namespace('TYPO3.Form', 'TYPO3.Form.Wizard');

/**
 * The viewport
 *
 * @class TYPO3.Form.Wizard.Viewport
 * @extends Ext.Container
 */
TYPO3.Form.Wizard.Viewport = Ext.extend(Ext.Container, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard',

	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Mixed} renderTo
	 * Specify the id of the element, a DOM element or an existing Element that
	 * this component will be rendered into.
	 */
	renderTo: 'typo3-inner-docbody',

	/**
	 * @cfg {String} layout
	 * In order for child items to be correctly sized and positioned, typically
	 * a layout manager must be specified through the layout configuration option.
	 *
	 * The sizing and positioning of child items is the responsibility of the
	 * Container's layout manager which creates and manages the type of layout
	 * you have in mind.
	 */
	layout: 'border',

	/**
	 * Constructor
	 *
	 * Add the left and right part to the viewport
	 * Add the history buttons
	 * TODO Move the buttons to the docheader
	 */
	initComponent: function() {
		var config = {
			items: [
				{
					xtype: 'typo3-form-wizard-viewport-left'
				},{
					xtype: 'typo3-form-wizard-viewport-right'
				}
			]
		};

			// Add the buttons to the docheader
		this.addButtonsToDocHeader();

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.superclass.initComponent.apply(this, arguments);
	},

	/**
	 * Add the buttons to the docheader
	 *
	 * All buttons except close will be handled by the form wizard javascript
	 * The save and history buttons are put into separate buttongroups, click
	 * event listeners are added.
	 */
	addButtonsToDocHeader: function() {
		var docHeaderRow1 = Ext.get('typo3-docheader');
		var docHeaderButtonsBar = docHeaderRow1.first('.typo3-docheader-buttons');
		var docHeaderRow1ButtonsLeft = docHeaderButtonsBar.first('.left');

		var saveButtonGroup = Ext.DomHelper.append(docHeaderRow1ButtonsLeft, {
			tag: 'div',
			cls: 'buttongroup'
		});

		var save = new Ext.Element(
			Ext.DomHelper.append(saveButtonGroup, {
				tag: 'span',
				cls: 't3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-save',
				id: 'formwizard-save',
				title: TYPO3.l10n.localize('save')
			})
		);

		var saveAndClose = new Ext.Element(
				Ext.DomHelper.append(saveButtonGroup, {
					tag: 'span',
					cls: 't3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-save-close',
					id: 'formwizard-saveandclose',
					title: TYPO3.l10n.localize('saveAndClose')
				})
			);

		save.on('click', this.save, this);
		saveAndClose.on('click', this.saveAndClose, this);

		var historyButtonGroup = Ext.DomHelper.append(docHeaderRow1ButtonsLeft, {
			tag: 'div',
			cls: 'buttongroup'
		});

		var undo = new Ext.Element(
			Ext.DomHelper.append(historyButtonGroup, {
				tag: 'span',
				cls: 't3-icon t3-icon-actions t3-icon-actions-document t3-icon-view-go-back',
				id: 'formwizard-history-undo',
				title: TYPO3.l10n.localize('history_undo')
			})
		);

		var redo = new Ext.Element(
			Ext.DomHelper.append(historyButtonGroup, {
				tag: 'span',
				cls: 't3-icon t3-icon-actions t3-icon-actions-document t3-icon-view-go-forward',
				id: 'formwizard-history-redo',
				title: TYPO3.l10n.localize('history_redo')
			})
		);

		undo.hide();
		undo.on('click', this.undo, this);

		redo.hide();
		redo.on('click', this.redo, this);
	},

	/**
	 * Save the form
	 *
	 * @param event
	 * @param element
	 * @param object
	 */
	save: function(event, element, object) {
		var configuration = Ext.getCmp('formwizard-right').getConfiguration();

		Ext.Ajax.request({
			url: document.location.href,
			method: 'POST',
			params: {
				action: 'save',
				configuration: Ext.encode(configuration)
			},
			success: function(response, opts) {
				var responseObject = Ext.decode(response.responseText);
				Ext.MessageBox.alert(
					TYPO3.l10n.localize('action_save'),
					responseObject.message
				);
			},
			failure: function(response, opts) {
				var responseObject = Ext.decode(response.responseText);
				Ext.MessageBox.alert(
					TYPO3.l10n.localize('action_save'),
					TYPO3.l10n.localize('action_save_error') + ' ' + response.status
				);
			},
			scope: this
		});
	},

	/**
	 * Save the form and close the wizard
	 *
	 * @param event
	 * @param element
	 * @param object
	 */
	saveAndClose: function(event, element, object) {
		var configuration = Ext.getCmp('formwizard-right').getConfiguration();

		Ext.Ajax.request({
			url: document.location.href,
			method: 'POST',
			params: {
				action: 'save',
				configuration: Ext.encode(configuration)
			},
			success: function(response, opts) {
				var urlParameters = Ext.urlDecode(document.location.search.substring(1));
				document.location = urlParameters['P[returnUrl]'];
			},
			failure: function(response, opts) {
				var responseObject = Ext.decode(response.responseText);
				Ext.MessageBox.alert(
					TYPO3.l10n.localize('action_save'),
					TYPO3.l10n.localize('action_save_error') + ' ' + response.status
				);
			},
			scope: this
		});
	},

	/**
	 * Get the previous snapshot from the history if available
	 *
	 * @param event
	 * @param element
	 * @param object
	 */
	undo: function(event, element, object) {
		TYPO3.Form.Wizard.Helpers.History.undo();
	},

	/**
	 * Get the next snapshot from the history if available
	 *
	 * @param event
	 * @param element
	 * @param object
	 */
	redo: function(event, element, object) {
		TYPO3.Form.Wizard.Helpers.History.redo();
	}
});
Ext.namespace('TYPO3.Form.Wizard.Viewport');

/**
 * The tabpanel on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left
 * @extends Ext.TabPanel
 */
TYPO3.Form.Wizard.Viewport.Left = Ext.extend(Ext.TabPanel, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left',

	/**
	 * @cfg {Integer} width
	 * The width of this component in pixels (defaults to auto).
	 */
	width: 350,

	/**
	 * @cfg {String/Number} activeTab A string id or the numeric index of the tab that should be initially
	 * activated on render (defaults to undefined).
	 */
	activeTab: 0,

	/**
	 * @cfg {String} region
	 * Note: this config is only used when this BoxComponent is rendered
	 * by a Container which has been configured to use the BorderLayout
	 * layout manager (e.g. specifying layout:'border').
	 */
	region: 'west',

	/**
	 * @cfg {Boolean} autoScroll
	 * true to use overflow:'auto' on the components layout element and show
	 * scroll bars automatically when necessary, false to clip any overflowing
	 * content (defaults to false).
	 */
	autoScroll: true,

	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset border,
	 * but this can be further altered by setting {@link #bodyBorder} to false.
	 */
	border: false,

	/**
	 * @cfg {Object|Function} defaults
	 *
	 * This option is a means of applying default settings to all added items
	 * whether added through the items config or via the add or insert methods.
	 */
	defaults: {
		autoHeight: true,
		autoWidth: true
	},

	/**
	 * Constructor
	 *
	 * Add the tabs to the tabpanel
	 */
	initComponent: function() {
		var allowedTabs = TYPO3.Form.Wizard.Settings.defaults.showTabs.split(/[, ]+/);
		var tabs = [];

		allowedTabs.each(function(option, index, length) {
			var tabXtype = 'typo3-form-wizard-viewport-left-' + option;
			if (Ext.ComponentMgr.isRegistered(tabXtype)) {
				tabs.push({
					xtype: tabXtype
				});
			}
		}, this);

		var config = {
			items: tabs
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.superclass.initComponent.apply(this, arguments);

			// Set the focus when a tab has changed. We need this to remove focus from forms
		this.on('tabchange', this.setFocus, this);
	},

	/**
	 * Set the focus to a tab
	 *
	 * doLayout is necessary, because the tabs are sometimes emptied and filled
	 * again, for instance by the history. Otherwise after a history undo or redo
	 * the options and form tabs are empty.
	 *
	 * @param tabPanel
	 * @param tab
	 */
	setFocus: function(tabPanel, tab) {
		tabPanel.doLayout();
		tab.el.focus();
	},

	/**
	 * Set the options tab as active tab
	 *
	 * Called by the options panel when an element has been selected
	 */
	setOptionsTab: function() {
		this.setActiveTab('formwizard-left-options');
	}
});

Ext.reg('typo3-form-wizard-viewport-left', TYPO3.Form.Wizard.Viewport.Left);
Ext.namespace('TYPO3.Form.Wizard.Viewport');

/**
 * The form container on the right side
 *
 * @class TYPO3.Form.Wizard.Viewport.Right
 * @extends TYPO3.Form.Wizard.Elements.Container
 */
TYPO3.Form.Wizard.Viewport.Right = Ext.extend(Ext.Container, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-right',

	/**
	 * @cfg {Mixed} autoEl
	 * A tag name or DomHelper spec used to create the Element which will
	 * encapsulate this Component.
	 */
	autoEl: 'ol',

	/**
	 * @cfg {String} region
	 * Note: this config is only used when this BoxComponent is rendered
	 * by a Container which has been configured to use the BorderLayout
	 * layout manager (e.g. specifying layout:'border').
	 */
	region: 'center',

	/**
	 * @cfg {Boolean} autoScroll
	 * true to use overflow:'auto' on the components layout element and show
	 * scroll bars automatically when necessary, false to clip any overflowing
	 * content (defaults to false).
	 */
	autoScroll: true,

	/**
	 * Constructor
	 */
	initComponent: function() {
		var config = {
			items: [
				{
					xtype: 'typo3-form-wizard-elements-basic-form'
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Right.superclass.initComponent.apply(this, arguments);

			// Initialize the form after rendering
		this.on('afterrender', this.initializeForm, this);
	},

	/**
	 * Initialize the form after rendering
	 */
	initializeForm: function() {
		this.loadForm();
	},

	/**
	 * Load the form with an AJAX call
	 *
	 * Loads the configuration and initializes the history
	 */
	loadForm: function() {
		Ext.Ajax.request({
			url: document.location.href,
			method: 'POST',
			params: {
				action: 'load'
			},
			success: function(response, opts) {
				var responseObject = Ext.decode(response.responseText);
				this.loadConfiguration(responseObject.configuration);
				this.initializeHistory();
			},
			failure: function(response, opts) {
				var responseObject = Ext.decode(response.responseText);
				Ext.MessageBox.alert(
					'Loading form',
					'Server-side failure with status code ' + response.status
				);
			},
			scope: this
		});
	},

	/**
	 * Initialize the history
	 *
	 * After the form has been rendered for the first time, we need to add the
	 * initial configuration to the history, so it is possible to go back to the
	 * initial state of the form when it was loaded.
	 */
	initializeHistory: function() {
		TYPO3.Form.Wizard.Helpers.History.setHistory();
		this.setForm();
	},

	/**
	 * Called by the history class when a change has been made in the form
	 *
	 * Constructs an array out of this component and the children to add it to
	 * the history or to use when saving the form
	 *
	 * @returns {Array}
	 */
	getConfiguration: function() {
		var historyConfiguration = new Array;

		if (this.items) {
			this.items.each(function(item, index, length) {
				historyConfiguration.push(item.getConfiguration());
			}, this);
		}
		return historyConfiguration;
	},

	/**
	 * Load a previous configuration from the history
	 *
	 * Removes all the components from this container and adds the components
	 * from the history configuration depending on the 'undo' or 'redo' action.
	 *
	 * @param historyConfiguration
	 */
	loadConfiguration: function(historyConfiguration) {
		this.removeAll();
		this.add(historyConfiguration);
		this.doLayout();
		this.setForm();
	},

	/**
	 * Pass the form configuration to the left form tab
	 */
	setForm: function() {
		if (Ext.getCmp('formwizard-left-form')) {
			Ext.getCmp('formwizard-left-form').setForm(this.get(0));
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-right', TYPO3.Form.Wizard.Viewport.Right);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left');

/**
 * The elements panel in the elements tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Elements
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Elements = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-elements',

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'x-tab-panel-body-content',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('left_elements'),

	/**
	 * Constructor
	 *
	 * Add the form elements to the tab
	 */
	initComponent: function() {
		var allowedAccordions = TYPO3.Form.Wizard.Settings.defaults.tabs.elements.showAccordions.split(/[, ]+/);
		var accordions = [];

		allowedAccordions.each(function(option, index, length) {
			var accordionXtype = 'typo3-form-wizard-viewport-left-elements-' + option;
			if (Ext.ComponentMgr.isRegistered(accordionXtype)) {
				accordions.push({
					xtype: accordionXtype
				});
			}
		}, this);

		var config = {
			items: [
				{
					xtype: 'container',
					id: 'formwizard-left-elements-intro',
					tpl: new Ext.XTemplate(
						'<tpl for=".">',
							'<p><strong>{title}</strong></p>',
							'<p>{description}</p>',
						'</tpl>'
					),
					data: [{
						title: TYPO3.l10n.localize('left_elements_intro_title'),
						description: TYPO3.l10n.localize('left_elements_intro_description')
					}],
					cls: 'formwizard-left-dummy typo3-message message-information'
				}, {
					xtype: 'panel',
					layout: 'accordion',
					border: false,
					padding: 0,
					defaults: {
						autoHeight: true,
						cls: 'x-panel-accordion'
					},
					items: accordions
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Elements.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-elements', TYPO3.Form.Wizard.Viewport.Left.Elements);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Elements');

/**
 * The button group abstract for the elements tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup
 * @extends Ext.ButtonGroup
 */
TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Object|Function} defaults
	 * This option is a means of applying default settings to all added items
	 * whether added through the items config or via the add or insert methods.
	 */
	defaults: {
		xtype: 'button',
		scale: 'small',
		width: 140,
		iconAlign: 'left',
		cls: 'formwizard-element'
	},

	cls: 'formwizard-buttongroup',

	/**
	 * @cfg {Boolean} autoHeight
	 * true to use height:'auto', false to use fixed height (defaults to false).
	 * Note: Setting autoHeight: true means that the browser will manage the panel's height
	 * based on its contents, and that Ext will not manage it at all. If the panel is within a layout that
	 * manages dimensions (fit, border, etc.) then setting autoHeight: true
	 * can cause issues with scrolling and will not generally work as expected since the panel will take
	 * on the height of its contents rather than the height required by the Ext layout.
	 */
	autoHeight: true,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	/**
	 * @cfg {String} layout
	 * In order for child items to be correctly sized and positioned, typically
	 * a layout manager must be specified through the layout configuration option.
	 *
	 * The sizing and positioning of child items is the responsibility of the
	 * Container's layout manager which creates and manages the type of layout
	 * you have in mind.
	 */
	layout: 'table',

	/**
	 * @cfg {Object} layoutConfig
	 * This is a config object containing properties specific to the chosen
	 * layout if layout has been specified as a string.
	 */
	layoutConfig: {
		columns: 2
	},

	/**
	 * Constructor
	 *
	 * Add the buttons to the accordion
	 */
	initComponent: function() {
		var config = {};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup.superclass.initComponent.apply(this, arguments);

			// Initialize the dragzone after rendering
		this.on('render', this.initializeDrag, this);
	},

	/**
	 * Initialize the drag zone.
	 *
	 * @param buttonGroup
	 */
	initializeDrag: function(buttonGroup) {
		buttonGroup.dragZone = new Ext.dd.DragZone(buttonGroup.getEl(), {
			getDragData: function(element) {
				var sourceElement = element.getTarget('.formwizard-element');
				if (sourceElement) {
					clonedElement = sourceElement.cloneNode(true);
					clonedElement.id = Ext.id();
					return buttonGroup.dragData = {
						sourceEl: sourceElement,
						repairXY: Ext.fly(sourceElement).getXY(),
						ddel: clonedElement
					};
				}
			},
			getRepairXY: function() {
				return buttonGroup.dragData.repairXY;
			}
		});
	},

	/**
	 * Called when a button has been double clicked
	 *
	 * Tells the form in the right container to add a new element, according to
	 * the button which has been clicked.
	 *
	 * @param button
	 * @param event
	 */
	onDoubleClick: function(button, event) {
		var formContainer = Ext.getCmp('formwizard-right').get(0).containerComponent;
		formContainer.dropElement(button, 'container');
	}
});

Ext.reg('typo3-form-wizard-viewport-left-elements-buttongroup', TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Elements');

/**
 * The basic elements in the elements tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Elements.Basic
 * @extends TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup
 */
TYPO3.Form.Wizard.Viewport.Left.Elements.Basic = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-elements-basic',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('left_elements_basic'),

	/**
	 * Constructor
	 *
	 * Add the buttons to the accordion
	 */
	initComponent: function() {
		var allowedButtons = TYPO3.Form.Wizard.Settings.defaults.tabs.elements.accordions.basic.showButtons.split(/[, ]+/);
		var buttons = [];

		allowedButtons.each(function(option, index, length) {
			switch (option) {
				case 'button':
					buttons.push({
						text: TYPO3.l10n.localize('basic_button'),
						id: 'basic-button',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-button',
						scope: this
					});
					break;
				case 'checkbox':
					buttons.push({
						text: TYPO3.l10n.localize('basic_checkbox'),
						id: 'basic-checkbox',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-checkbox',
						scope: this
					});
					break;
				case 'fieldset':
					buttons.push({
						text: TYPO3.l10n.localize('basic_fieldset'),
						id: 'basic-fieldset',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-fieldset',
						scope: this
					});
					break;
				case 'fileupload':
					buttons.push({
						text: TYPO3.l10n.localize('basic_fileupload'),
						id: 'basic-fileupload',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-fileupload',
						scope: this
					});
					break;
				case 'hidden':
					buttons.push({
						text: TYPO3.l10n.localize('basic_hidden'),
						id: 'basic-hidden',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-hidden',
						scope: this
					});
					break;
				case 'password':
					buttons.push({
						text: TYPO3.l10n.localize('basic_password'),
						id: 'basic-password',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-password',
						scope: this
					});
					break;
				case 'radio':
					buttons.push({
						text: TYPO3.l10n.localize('basic_radio'),
						id: 'basic-radio',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-radio',
						scope: this
					});
					break;
				case 'reset':
					buttons.push({
						text: TYPO3.l10n.localize('basic_reset'),
						id: 'basic-reset',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-reset',
						scope: this
					});
					break;
				case 'select':
					buttons.push({
						text: TYPO3.l10n.localize('basic_select'),
						id: 'basic-select',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-select',
						scope: this
					});
					break;
				case 'submit':
					buttons.push({
						text: TYPO3.l10n.localize('basic_submit'),
						id: 'basic-submit',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-submit',
						scope: this
					});
					break;
				case 'textarea':
					buttons.push({
						text: TYPO3.l10n.localize('basic_textarea'),
						id: 'basic-textarea',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-textarea',
						scope: this
					});
					break;
				case 'textline':
					buttons.push({
						text: TYPO3.l10n.localize('basic_textline'),
						id: 'basic-textline',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-basic-textline',
						scope: this
					});
					break;
			}
		}, this);

		var config = {
			items: buttons
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Elements.Basic.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-elements-basic', TYPO3.Form.Wizard.Viewport.Left.Elements.Basic);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Elements');

/**
 * The predefined elements in the elements tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Elements.Predefined
 * @extends TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup
 */
TYPO3.Form.Wizard.Viewport.Left.Elements.Predefined = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-elements-predefined',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('left_elements_predefined'),

	/**
	 * Constructor
	 *
	 * Add the buttons to the accordion
	 */
	initComponent: function() {
		var allowedButtons = TYPO3.Form.Wizard.Settings.defaults.tabs.elements.accordions.predefined.showButtons.split(/[, ]+/);
		var buttons = [];

		allowedButtons.each(function(option, index, length) {
			switch (option) {
				case 'email':
					buttons.push({
						text: TYPO3.l10n.localize('predefined_email'),
						id: 'predefined-email',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-predefined-email',
						scope: this
					});
					break;
				case 'radiogroup':
					buttons.push({
						text: TYPO3.l10n.localize('predefined_radiogroup'),
						id: 'predefined-radiogroup',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-predefined-radiogroup',
						scope: this
					});
					break;
				case 'checkboxgroup':
					buttons.push({
						text: TYPO3.l10n.localize('predefined_checkboxgroup'),
						id: 'predefined-checkboxgroup',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-predefined-checkboxgroup',
						scope: this
					});
					break;
				case 'name':
					buttons.push({
						text: TYPO3.l10n.localize('predefined_name'),
						id: 'predefined-name',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-predefined-name',
						scope: this
					});
					break;
			}
		}, this);

		var config = {
			items: buttons
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Elements.Predefined.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-elements-predefined', TYPO3.Form.Wizard.Viewport.Left.Elements.Predefined);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Elements');

/**
 * The content elements in the elements tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Elements.Content
 * @extends TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup
 */
TYPO3.Form.Wizard.Viewport.Left.Elements.Content = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Elements.ButtonGroup, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-elements-content',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('left_elements_content'),

	/**
	 * Constructor
	 *
	 * Add the buttons to the accordion
	 */
	initComponent: function() {
		var allowedButtons = TYPO3.Form.Wizard.Settings.defaults.tabs.elements.accordions.content.showButtons.split(/[, ]+/);
		var buttons = [];

		allowedButtons.each(function(option, index, length) {
			switch (option) {
				case 'header':
					buttons.push({
						text: TYPO3.l10n.localize('content_header'),
						id: 'content-header',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-content-header',
						scope: this
					});
					break;
				case 'textblock':
					buttons.push({
						text: TYPO3.l10n.localize('content_textblock'),
						id: 'content-textblock',
						clickEvent: 'dblclick',
						handler: this.onDoubleClick,
						iconCls: 'formwizard-left-elements-content-textblock',
						scope: this
					});
					break;
			}
		}, this);

		var config = {
			items: buttons
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Elements.Content.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-elements-content', TYPO3.Form.Wizard.Viewport.Left.Elements.Content);
Ext.namespace('TYPO3.Form.Wizard.Viewport.LeftTYPO3.Form.Wizard.Elements');

/**
 * The options tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Options = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-options',

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'x-tab-panel-body-content',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('left_options'),

	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	/**
	 * @cfg {Object} validAccordions
	 * Keeps track which accordions are valid. Accordions contain forms which
	 * do client validation. If there is a validation change in a form in the
	 * accordion, a validation event will be fired, which changes one of these
	 * values
	 */
	validAccordions: {
		attributes: true,
		filters: true,
		label: true,
		legend: true,
		options: true,
		validation: true,
		various: true
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the tab
	 */
	initComponent: function() {
		var config = {
			items: [{
				xtype: 'typo3-form-wizard-viewport-left-options-dummy'
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.superclass.initComponent.apply(this, arguments);

			// if the active element changes in helper, this should be reflected here
		TYPO3.Form.Wizard.Helpers.Element.on('setactive', this.toggleActive, this);
	},

	/**
	 * Load options form according to element type
	 *
	 * This will be called whenever the current element changes
	 *
	 * @param component The current element
	 * @return void
	 */
	toggleActive: function(component) {
		if (component) {
			this.removeAll();
			this.add({
				xtype: 'typo3-form-wizard-viewport-left-options-panel',
				element: component,
				listeners: {
					'validation': {
						fn: this.validation,
						scope: this
					}
				}
			});
			this.ownerCt.setOptionsTab();
		} else {
			this.removeAll();
			this.add({
				xtype: 'typo3-form-wizard-viewport-left-options-dummy'
			});
		}
		this.tabEl.removeClassName('validation-error');
		Ext.iterate(this.validAccordions, function(key, value) {
			this.validAccordions[key] = true;
		}, this);
		this.doLayout();
	},

	/**
	 * Checks if a tab is valid by iterating all accordions on validity
	 *
	 * @returns {Boolean}
	 */
	tabIsValid: function() {
		var valid = true;

		Ext.iterate(this.validAccordions, function(key, value) {
			if (!value) {
				valid = false;
			}
		}, this);

		return valid;
	},

	/**
	 * Called by the validation listeners of the accordions
	 *
	 * Checks if all accordions are valid. If not, adds a class to the tab
	 *
	 * @param {String} accordion The accordion which fires the event
	 * @param {Boolean} isValid Accordion is valid or not
	 */
	validation: function(accordion, isValid) {
		this.validAccordions[accordion] = isValid;
		var tabIsValid = this.tabIsValid();

		if (this.tabEl) {
			if (tabIsValid && Ext.get(this.tabEl).hasClass('validation-error')) {
				this.tabEl.removeClassName('validation-error');
			} else if (!tabIsValid && !Ext.get(this.tabEl).hasClass('validation-error')) {
				this.tabEl.addClassName('validation-error');
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options', TYPO3.Form.Wizard.Viewport.Left.Options);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options');

/**
 * The options panel for a dummy item
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Dummy
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Dummy = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-options-dummy',

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'formwizard-left-dummy typo3-message message-information',

	/**
	 * @cfg {Mixed} data
	 * The initial set of data to apply to the tpl to update the content area of
	 * the Component.
	 */
	data: [{
		title: TYPO3.l10n.localize('options_dummy_title'),
		description: TYPO3.l10n.localize('options_dummy_description')
	}],

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<p><strong>{title}</strong></p>',
			'<p>{description}</p>',
		'</tpl>'
	)
});

Ext.reg('typo3-form-wizard-viewport-left-options-dummy', TYPO3.Form.Wizard.Viewport.Left.Options.Dummy);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options');

/**
 * The options panel
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Panel
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Panel = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Object} element
	 * The element for the options form
	 */
	element: null,

	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Object|Function} defaults
	 * This option is a means of applying default settings to all added items
	 * whether added through the items config or via the add or insert methods.
	 */
	defaults: {
		autoHeight: true,
		border: false,
		padding: 0
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the tab
	 */
	initComponent: function() {
		var accordions = this.getAccordionsBySettings();
		var accordionItems = new Array();

		// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		Ext.iterate(accordions, function(item, index, allItems) {
			var accordionXtype = 'typo3-form-wizard-viewport-left-options-forms-' + item;
			accordionItems.push({
				xtype: accordionXtype,
				element: this.element,
				listeners: {
					'validation': {
						fn: this.validation,
						scope: this
					}
				}
			});
		}, this);

		var config = {
			items: [{
				xtype: 'panel',
				layout: 'accordion',
				ref: 'accordion',
				defaults: {
					autoHeight: true,
					cls: 'x-panel-accordion'
				},
				items: accordionItems
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Panel.superclass.initComponent.apply(this, arguments);
	},

	/**
	 * Adds the accordions depending on the TSconfig settings
	 *
	 * It will first look at showAccordions for the tab, then it will filter it
	 * down with the accordions allowed for the element.
	 *
	 * @returns {Array}
	 */
	getAccordionsBySettings: function() {
		var accordions = [];
		if (this.element) {
			var elementType = this.element.xtype.split('-').pop();

			var allowedDefaultAccordions = [];
			try {
				allowedDefaultAccordions = TYPO3.Form.Wizard.Settings.defaults.tabs.options.showAccordions.split(/[, ]+/);
			} catch (error) {
				// The object has not been found
				allowedDefaultAccordions = [
					'legend',
					'label',
					'attributes',
					'options',
					'validation',
					'filters',
					'various'
				];
			}

			var allowedElementAccordions = [];
			try {
				allowedElementAccordions = TYPO3.Form.Wizard.Settings.elements[elementType].showAccordions.split(/[, ]+/);
			} catch (error) {
				// The object has not been found
				allowedElementAccordions = allowedDefaultAccordions;
			}

			Ext.iterate(allowedElementAccordions, function(item, index, allItems) {
				var accordionXtype = 'typo3-form-wizard-viewport-left-options-forms-' + item;
				if (
					Ext.isDefined(this.element.configuration[item]) &&
					allowedElementAccordions.indexOf(item) > -1 &&
					Ext.ComponentMgr.isRegistered(accordionXtype)
				) {
					accordions.push(item);
				}
			}, this);
		}

		return accordions;
	},

	/**
	 * Fire the validation event
	 *
	 * This is only a pass-through for the accordion validation events
	 *
	 * @param accordion
	 * @param valid
	 */
	validation: function(accordion, valid) {
		this.fireEvent('validation', accordion, valid);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-panel', TYPO3.Form.Wizard.Viewport.Left.Options.Panel);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms');

/**
 * The attributes properties of the element
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Attributes
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Attributes = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('options_attributes'),

	/** @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfieldsubmit',

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * Constructor
	 *
	 * @param config
	 */
	constructor: function(config){
			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

			// Call our superclass constructor to complete construction process.
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Attributes.superclass.constructor.call(this, config);
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the accordion
	 */
	initComponent: function() {
		var attributes = this.getAttributesBySettings();
		var formItems = new Array();

		Ext.iterate(attributes, function(item, index, allItems) {
			switch(item) {
				case 'accept':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_accept'),
						name: 'accept',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'acceptcharset':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_acceptcharset'),
						name: 'acceptcharset',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'accesskey':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_accesskey'),
						name: 'accesskey',
						maxlength: 1,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'action':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_action'),
						name: 'action',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'alt':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_alt'),
						name: 'alt',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'checked':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('attributes_checked'),
						name: 'checked',
						inputValue: 'checked',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'class':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_class'),
						name: 'class',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'cols':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_cols'),
						name: 'cols',
						xtype: 'spinnerfield',
						allowBlank: false,
						listeners: {
							'spin': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'dir':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_dir'),
						name: 'dir',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'dir',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('attributes_dir_ltr'), value: 'ltr'},
								{label: TYPO3.l10n.localize('attributes_dir_rtl'), value: 'rtl'}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'disabled':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('attributes_disabled'),
						name: 'disabled',
						inputValue: 'disabled',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'enctype':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_enctype'),
						name: 'enctype',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'enctype',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('attributes_enctype_1'), value: 'application/x-www-form-urlencoded'},
								{label: TYPO3.l10n.localize('attributes_enctype_2'), value: 'multipart/form-data'},
								{label: TYPO3.l10n.localize('attributes_enctype_3'), value: 'text/plain'}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'id':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_id'),
						name: 'id',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'label':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_label'),
						name: 'label',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'lang':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_lang'),
						name: 'lang',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'maxlength':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_maxlength'),
						name: 'maxlength',
						xtype: 'spinnerfield',
						listeners: {
							'spin': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'method':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_method'),
						name: 'method',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'method',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('attributes_method_get'), value: 'get'},
								{label: TYPO3.l10n.localize('attributes_method_post'), value: 'post'}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'multiple':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('attributes_multiple'),
						name: 'multiple',
						inputValue: 'multiple',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'name':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_name'),
						name: 'name',
						allowBlank:false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'readonly':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('attributes_readonly'),
						name: 'readonly',
						inputValue: 'readonly',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'rows':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_rows'),
						name: 'rows',
						xtype: 'spinnerfield',
						allowBlank: false,
						listeners: {
							'spin': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'selected':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('attributes_selected'),
						name: 'selected',
						inputValue: 'selected',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'size':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_size'),
						name: 'size',
						xtype: 'spinnerfield',
						listeners: {
							'spin': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'src':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_src'),
						name: 'src',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'style':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_style'),
						name: 'style',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'tabindex':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_tabindex'),
						name: 'tabindex',
						xtype: 'spinnerfield',
						listeners: {
							'spin': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'title':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_title'),
						name: 'title',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'type':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_type'),
						name: 'type',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'type',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('attributes_type_button'), value: 'button'},
								{label: TYPO3.l10n.localize('attributes_type_checkbox'), value: 'checkbox'},
								{label: TYPO3.l10n.localize('attributes_type_file'), value: 'file'},
								{label: TYPO3.l10n.localize('attributes_type_hidden'), value: 'hidden'},
								{label: TYPO3.l10n.localize('attributes_type_image'), value: 'image'},
								{label: TYPO3.l10n.localize('attributes_type_password'), value: 'password'},
								{label: TYPO3.l10n.localize('attributes_type_radio'), value: 'radio'},
								{label: TYPO3.l10n.localize('attributes_type_reset'), value: 'reset'},
								{label: TYPO3.l10n.localize('attributes_type_submit'), value: 'submit'},
								{label: TYPO3.l10n.localize('attributes_type_text'), value: 'text'}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'value':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('attributes_value'),
						name: 'value',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
			}
		}, this);

		var config = {
			items: [{
				xtype: 'fieldset',
				title: '',
				autoHeight: true,
				border: false,
				defaults: {
					width: 150,
					msgTarget: 'side'
				},
				defaultType: 'textfieldsubmit',
				items: formItems
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Attributes.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Fill the form with the configuration values
		this.fillForm();
	},

	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			var formConfiguration = {attributes: {}};
			formConfiguration.attributes[fieldName] = field.getValue();

			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * @return void
	 */
	fillForm: function() {
		this.getForm().setValues(this.element.configuration.attributes);
	},

	/**
	 * Get the attributes for the element
	 *
	 * Based on the elements attributes, the TSconfig general allowed attributes
	 * and the TSconfig allowed attributes for this type of element
	 *
	 * @returns object
	 */
	getAttributesBySettings: function() {
		var attributes = [];
		var elementAttributes = this.element.configuration.attributes;
		var elementType = this.element.xtype.split('-').pop();

		var allowedGeneralAttributes = [];
		try {
			allowedGeneralAttributes = TYPO3.Form.Wizard.Settings.defaults.tabs.options.accordions.attributes.showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedGeneralAttributes = [
				'accept',
				'acceptcharset',
				'accesskey',
				'action',
				'alt',
				'checked',
				'class',
				'cols',
				'dir',
				'disabled',
				'enctype',
				'id',
				'label',
				'lang',
				'maxlength',
				'method',
				'multiple',
				'name',
				'readonly',
				'rows',
				'selected',
				'size',
				'src',
				'style',
				'tabindex',
				'title',
				'type',
				'value'
			];
		}

		var allowedElementAttributes = [];
		try {
			allowedElementAttributes = TYPO3.Form.Wizard.Settings.elements[elementType].accordions.attributes.showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found
			allowedElementAttributes = allowedGeneralAttributes;
		}

		Ext.iterate(allowedElementAttributes, function(item, index, allItems) {
			if (allowedGeneralAttributes.indexOf(item) > -1 && Ext.isDefined(elementAttributes[item])) {
				attributes.push(item);
			}
		}, this);

		return attributes;
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'attributes', valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'attributes', valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-attributes', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Attributes);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms');

/**
 * The label properties and the layout of the element
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Label
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Label = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('options_label'),

	/** @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'x-panel-accordion',

	/**
	 * Constructor
	 *
	 * Add the form elements to the accordion
	 */
	initComponent: function() {
		var fields = this.getFieldsBySettings();
		var formItems = new Array();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		Ext.iterate(fields, function(item, index, allItems) {
			switch(item) {
				case 'label':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('label_label'),
						name: 'label',
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'layout':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('label_layout'),
						name: 'layout',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'layout',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('label_layout_front'), value: 'front'},
								{label: TYPO3.l10n.localize('label_layout_back'), value: 'back'}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				default:
			}
		}, this);

		var config = {
			items: [{
				xtype: 'fieldset',
				title: '',
				border: false,
				autoHeight: true,
				defaults: {
					width: 150,
					msgTarget: 'side'
				},
				defaultType: 'textfieldsubmit',
				items: formItems
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Label.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Fill the form with the configuration values
		this.fillForm();
	},

	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			if (fieldName == 'label') {
				var formConfiguration = {
					label: {
						value: field.getValue()
					}
				};
			} else {
				var formConfiguration = {};
				formConfiguration[fieldName] = field.getValue();
			}
			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * @param record The current question
	 * @return void
	 */
	fillForm: function() {
		this.getForm().setValues({
			label: this.element.configuration.label.value,
			layout: this.element.configuration.layout
		});
	},

	/**
	 * Get the fields for the element
	 *
	 * Based on the TSconfig general allowed fields
	 * and the TSconfig allowed fields for this type of element
	 *
	 * @returns object
	 */
	getFieldsBySettings: function() {
		var fields = [];
		var elementType = this.element.xtype.split('-').pop();

		var allowedGeneralFields = [];
		try {
			allowedGeneralFields = TYPO3.Form.Wizard.Settings.defaults.tabs.options.accordions.label.showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedGeneralFields = [
				'label',
				'layout'
			];
		}

		var allowedElementFields = [];
		try {
			allowedElementFields = TYPO3.Form.Wizard.Settings.elements[elementType].accordions.label.showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedElementFields = allowedGeneralFields;
		}

		Ext.iterate(allowedElementFields, function(item, index, allItems) {
			if (allowedGeneralFields.indexOf(item) > -1) {
				fields.push(item);
			}
		}, this);

		return fields;
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'label', valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'label', valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-label', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Label);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms');

/**
 * The legend properties of the element
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Legend
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Legend = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('options_legend'),

	/** @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'x-panel-accordion',

	/**
	 * Constructor
	 *
	 * Add the form elements to the accordion
	 */
	initComponent: function() {
			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		var config = {
			items: [{
				xtype: 'fieldset',
				title: '',
				autoHeight: true,
				border: false,
				defaults: {
					width: 150,
					msgTarget: 'side'
				},
				defaultType: 'textfieldsubmit',
				items: [
					{
						fieldLabel: TYPO3.l10n.localize('legend_legend'),
						name: 'legend',
						enableKeyEvents: true,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					}
				]
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Legend.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Fill the form with the configuration values
		this.fillForm();
	},

	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			if (fieldName == 'legend') {
				var formConfiguration = {
					legend: {
						value: field.getValue()
					}
				};
			} else {
				var formConfiguration = {};
				formConfiguration[fieldName] = field.getValue();
			}
			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * @param record The current question
	 * @return void
	 */
	fillForm: function() {
		this.getForm().setValues({
			legend: this.element.configuration.legend.value
		});
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'legend', valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'legend', valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-legend', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Legend);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms');

/**
 * The options properties of the element
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Options
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Options = Ext.extend(Ext.grid.EditorGridPanel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('options_fieldoptions'),

	/**
	 * @cfg {String} autoExpandColumn
	 * The id of a column in this grid that should expand to fill unused space.
	 * This value specified here can not be 0.
	 */
	autoExpandColumn: 'data',

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: '10px 0 10px 15px',

	/**
	 * @cfg {Number} clicksToEdit
	 * The number of clicks on a cell required to display the cell's editor (defaults to 2).
	 * Setting this option to 'auto' means that mousedown on the selected cell starts
	 * editing that cell.
	 */
	clicksToEdit: 1,

	/**
	 * @cfg {Object} viewConfig A config object that will be applied to the grid's UI view.  Any of
	 * the config options available for Ext.grid.GridView can be specified here. This option
	 * is ignored if view is specified.
	 */
	viewConfig:{
		forceFit: true,
		emptyText: TYPO3.l10n.localize('fieldoptions_emptytext'),
		scrollOffset: 0
	},

	/**
	 * Constructor
	 *
	 * Configure store and columns for the grid
	 */
	initComponent: function() {
		var optionRecord = Ext.data.Record.create([
			{
				name: 'data',
				mapping:'data',
				type: 'string'
			}, {
				name: 'selected',
				convert: this.convertSelected,
				type: 'bool'
			}
		]);

		var store = new Ext.data.JsonStore({
			idIndex: 1,
			fields: optionRecord,
			data: this.element.configuration.options,
			autoDestroy: true,
			autoSave: true,
			listeners: {
				'add': {
					scope: this,
					fn: this.storeOptions
				},
				'remove': {
					scope: this,
					fn: this.storeOptions
				},
				'update': {
					scope: this,
					fn: this.storeOptions
				}
			}
		});

		var checkColumn = new Ext.ux.grid.SingleSelectCheckColumn({
			id: 'selected',
			header: TYPO3.l10n.localize('fieldoptions_selected'),
			dataIndex: 'selected',
			width: 30
		});

		var itemDeleter = new Ext.ux.grid.ItemDeleter();

		var config = {
			store: store,
			cm: new Ext.grid.ColumnModel({
				defaults: {
					sortable: false
				},
				columns: [
					{
						id: 'data',
						header: TYPO3.l10n.localize('fieldoptions_data'),
						dataIndex: 'data',
						editor: new Ext.ux.form.TextFieldSubmit({
							allowBlank: false,
							listeners: {
								'triggerclick': function(field) {
									field.gridEditor.record.set('data', field.getValue());
								}
							}
						})
					},
					checkColumn,
					itemDeleter
				]
			}),
			selModel: itemDeleter,
			plugins: [checkColumn],
			tbar: [{
				text: TYPO3.l10n.localize('fieldoptions_button_add'),
				handler: this.addOption,
				scope: this
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Options.superclass.initComponent.apply(this, arguments);
	},

	/**
	 * Adds a new record to the grid
	 *
	 * Called when the button to add option in the top bar has been clicked
	 */
	addOption: function() {
		var option = this.store.recordType;
		var newOption = new option({
			data: TYPO3.l10n.localize('fieldoptions_new'),
			selected: false
		});
		this.stopEditing();
		this.store.add(newOption);
		this.startEditing(0, 0);
	},

	/**
	 * Stores the options in the element whenever a change has been done to the
	 * grid, like add, remove or update
	 *
	 * @param store
	 * @param record
	 */
	storeOptions: function(store, record) {
		if (record && record.dirty) {
			record.commit();
		} else {
			var option = {};
			var options = [];
			this.store.each(function(record) {
				var option = {
					data: record.get('data')
				};
				if (record.get('selected')) {
					option.attributes = {
						selected: 'selected'
					};
				}
				options.push(option);
			});
			this.element.configuration.options = [];
			var formConfiguration = {
				options: options
			};
			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Convert and remap the "selected" attribute. In HTML the attribute needs
	 * be as selected="selected", while the grid uses a boolean.
	 *
	 * @param v
	 * @param record
	 * @returns {Boolean}
	 */
	convertSelected: function(v, record) {
		if (record.attributes && record.attributes.selected) {
			if (record.attributes.selected == 'selected') {
				return true;
			}
		}
		return false;
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-options', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Options);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms');

/**
 * The various properties of the element
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Various
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Various = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('options_various'),

	/** @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * Constructor
	 *
	 * Add the form elements to the accordion
	 */
	initComponent: function() {
		var various = this.element.configuration.various;
		var formItems = new Array();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		Ext.iterate(various, function(key, value) {
			switch(key) {
				case 'name':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('various_properties_name'),
						name: 'name',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'content':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('various_properties_content'),
						name: 'content',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'headingSize':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('various_properties_headingsize'),
						name: 'headingSize',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'headingSize',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: 'H1', value: 'h1'},
								{label: 'H2', value: 'h2'},
								{label: 'H3', value: 'h3'},
								{label: 'H4', value: 'h4'},
								{label: 'H5', value: 'h5'}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'prefix':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('various_properties_prefix'),
						name: 'prefix',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'prefix',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('yes'), value: true},
								{label: TYPO3.l10n.localize('no'), value: false}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'suffix':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('various_properties_suffix'),
						name: 'suffix',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'suffix',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('yes'), value: true},
								{label: TYPO3.l10n.localize('no'), value: false}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'middleName':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('various_properties_middlename'),
						name: 'middleName',
						xtype: 'combo',
						mode: 'local',
						triggerAction: 'all',
						forceSelection: true,
						editable: false,
						hiddenName: 'middleName',
						displayField: 'label',
						valueField: 'value',
						store: new Ext.data.JsonStore({
							fields: ['label', 'value'],
							data: [
								{label: TYPO3.l10n.localize('yes'), value: true},
								{label: TYPO3.l10n.localize('no'), value: false}
							]
						}),
						listeners: {
							'select': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
			}
		}, this);

		var config = {
			items: [{
				xtype: 'fieldset',
				title: '',
				autoHeight: true,
				border: false,
				defaults: {
					width: 150,
					msgTarget: 'side'
				},
				defaultType: 'textfieldsubmit',
				items: formItems
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Various.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Fill the form with the configuration values
		this.fillForm();
	},

	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			var formConfiguration = {various: {}};
			formConfiguration.various[fieldName] = field.getValue();

			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * @return void
	 */
	fillForm: function() {
		this.getForm().setValues(this.element.configuration.various);
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'various', valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'various', valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-various', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Various);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms');

/**
 * The filters accordion panel in the element options in the left tabpanel
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('options_filters'),

	/**
	 * @cfg {Object} validFilters
	 * Keeps track which filters are valid. Filters contain forms which
	 * do client validation. If there is a validation change in a form in the
	 * filter, a validation event will be fired, which changes one of these
	 * values
	 */
	validFilters: {
		alphabetic: true,
		alphanumeric: true,
		currency: true,
		digit: true,
		integer: true,
		lowercase: true,
		regexp: true,
		removexss: true,
		stripnewlines: true,
		titlecase: true,
		trim: true,
		uppercase: true
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the accordion
	 */
	initComponent: function() {
		var filters = this.getFiltersBySettings();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		var config = {
			items: [{
				xtype: 'typo3-form-wizard-viewport-left-options-forms-filters-dummy',
				ref: 'dummy'
			}],
			tbar: [
				{
					xtype: 'combo',
					hideLabel: true,
					name: 'filters',
					ref: 'filters',
					mode: 'local',
					triggerAction: 'all',
					forceSelection: true,
					editable: false,
					hiddenName: 'filters',
					emptyText: TYPO3.l10n.localize('filters_emptytext'),
					width: 150,
					displayField: 'label',
					valueField: 'value',
					store: new Ext.data.JsonStore({
						fields: ['label', 'value'],
						data: filters
					}),
					listeners: {
						'select': {
							scope: this,
							fn: this.addFilter
						}
					}
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.superclass.initComponent.apply(this, arguments);

			// Initialize the filters when they are available for this element
		this.initFilters();
	},

	/**
	 * Called when constructing the filters accordion
	 *
	 * Checks if the element already has filters and loads these instead of the dummy
	 */
	initFilters: function() {
		var filters = this.element.configuration.filters;
		if (!Ext.isEmptyObject(filters)) {
			this.remove(this.dummy);
			Ext.iterate(filters, function(key, value) {
				this.add({
					xtype: 'typo3-form-wizard-viewport-left-options-forms-filters-' + key,
					element: this.element,
					configuration: value,
					listeners: {
						'validation': {
							fn: this.validation,
							scope: this
						}
					}
				});
			}, this);
		}
	},

	/**
	 * Add a filter to the filters list
	 *
	 * @param comboBox
	 * @param record
	 * @param index
	 */
	addFilter: function(comboBox, record, index) {
		var filter = comboBox.getValue();
		var xtype = 'typo3-form-wizard-viewport-left-options-forms-filters-' + filter;

		if (!Ext.isEmpty(this.findByType(xtype))) {
			Ext.MessageBox.alert(TYPO3.l10n.localize('filters_alert_title'), TYPO3.l10n.localize('filters_alert_description'));
		} else {
			this.remove(this.dummy);

			this.add({
				xtype: xtype,
				element: this.element,
				listeners: {
					'validation': {
						fn: this.validation,
						scope: this
					}
				}
			});
			this.doLayout();
		}
	},

	/**
	 * Remove a filter from the filters list
	 *
	 * Shows dummy when there is no filter for this element
	 *
	 * @param component
	 */
	removeFilter: function(component) {
		this.remove(component);
		this.validation(component.filter, true);
		if (this.items.length == 0) {
			this.add({
				xtype: 'typo3-form-wizard-viewport-left-options-forms-filters-dummy',
				ref: 'dummy'
			});
		}
		this.doLayout();
	},

	/**
	 * Get the allowed filters by the TSconfig settings
	 *
	 * @returns {Array}
	 */
	getFiltersBySettings: function() {
		var filters = [];
		var elementType = this.element.xtype.split('-').pop();

		var allowedDefaultFilters = [];
		try {
			allowedDefaultFilters = TYPO3.Form.Wizard.Settings.defaults.tabs.options.accordions.filtering.showFilters.split(/[, ]+/);
		} catch (error) {
			// The object has not been found
			allowedDefaultFilters = [
				'alphabetic',
				'alphanumeric',
				'currency',
				'digit',
				'integer',
				'lowercase',
				'regexp',
				'removexss',
				'stripnewlines',
				'titlecase',
				'trim',
				'uppercase'
			];
		}

		var allowedElementFilters = [];
		try {
			allowedElementFilters = TYPO3.Form.Wizard.Settings.elements[elementType].accordions.filtering.showFilters.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedElementFilters = allowedDefaultFilters;
		}

		Ext.iterate(allowedElementFilters, function(item, index, allItems) {
			if (allowedDefaultFilters.indexOf(item) > -1) {
				filters.push({label: TYPO3.l10n.localize('filters_' + item), value: item});
			}
		}, this);

		return filters;
	},

	/**
	 * Called by the validation listeners of the filters
	 *
	 * Checks if all filters are valid. If not, adds a class to the accordion
	 *
	 * @param {String} filter The filter which fires the event
	 * @param {Boolean} isValid Rule is valid or not
	 */
	validation: function(filter, isValid) {
		this.validFilters[filter] = isValid;
		var accordionIsValid = true;
		Ext.iterate(this.validFilters, function(key, value) {
			if (!value) {
				accordionIsValid = false;
			}
		}, this);
		if (this.el) {
			if (accordionIsValid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'filters', isValid);
			} else if (!accordionIsValid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'filters', isValid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The filter abstract
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	/**
	 * @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * @cfg {Object} Default filter configuration
	 */
	configuration: {},

	/**
	 * Constructor
	 */
	initComponent: function() {
		var fields = this.getFieldsBySettings();
		var formItems = new Array();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		Ext.iterate(fields, function(item, index, allItems) {
			switch(item) {
				case 'allowWhiteSpace':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('filters_properties_allowwhitespace'),
						name: 'allowWhiteSpace',
						inputValue: '1',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'decimalPoint':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('filters_properties_decimalpoint'),
						name: 'decimalPoint',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'thousandSeparator':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('filters_properties_thousandseparator'),
						name: 'thousandSeparator',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'expression':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('filters_properties_expression'),
						name: 'expression',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'characterList':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('filters_properties_characterlist'),
						name: 'characterList',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
			}
		}, this);

		if (Ext.isEmpty(formItems)) {
			formItems.push({
				xtype: 'box',
				autoEl: {
					tag: 'div'
				},
				width: 256,
				cls: 'typo3-message message-information',
				data: [{
					title: TYPO3.l10n.localize('filters_properties_none_title'),
					description: TYPO3.l10n.localize('filters_properties_none')
				}],
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
						'<p><strong>{title}</strong></p>',
						'<p>{description}</p>',
					'</tpl>'
				)

			});
		}

		formItems.push({
			xtype: 'button',
			text: TYPO3.l10n.localize('button_remove'),
			handler: this.removeFilter,
			scope: this
		});

		var config = {
			items: [
				{
					xtype: 'fieldset',
					title: this.filter,
					autoHeight: true,
					defaults: {
						width: 128,
						msgTarget: 'side'
					},
					defaultType: 'textfieldsubmit',
					items: formItems
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Strange, but we need to call doLayout() after render
		this.on('afterrender', this.newOrExistingFilter, this);
	},

	/**
	 * Decide whether this is a new or an existing one
	 *
	 * If new, the default configuration has to be added to the filters
	 * of the element, otherwise we can fill the form with the existing configuration
	 */
	newOrExistingFilter: function() {
		this.doLayout();
			// Existing filter
		if (this.element.configuration.filters[this.filter]) {
			this.fillForm();
			// New filter
		} else {
			this.addFilterToElement();
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * When filling, the events of all form elements should be suspended,
	 * otherwise the values are written back to the element, for instance on a
	 * check event on a checkbox.
	 */
	fillForm: function() {
		this.suspendEventsBeforeFilling();
		this.getForm().setValues(this.element.configuration.filters[this.filter]);
		this.resumeEventsAfterFilling();
	},

	/**
	 * Suspend the events on all items within this component
	 */
	suspendEventsBeforeFilling: function() {
		this.cascade(function(item) {
			item.suspendEvents();
		});
	},

	/**
	 * Resume the events on all items within this component
	 */
	resumeEventsAfterFilling: function() {
		this.cascade(function(item) {
			item.resumeEvents();
		});
	},

	/**
	 * Add this filter to the element
	 */
	addFilterToElement: function() {
		var formConfiguration = {filters: {}};
		formConfiguration.filters[this.filter] = this.configuration;

		this.element.setConfigurationValue(formConfiguration);

		this.fillForm();
	},

	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			var formConfiguration = {filters: {}};
			formConfiguration.filters[this.filter] = {};
			formConfiguration.filters[this.filter][fieldName] = field.getValue();

			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Remove the filter
	 *
	 * Called when the remove button of this filter has been clicked
	 */
	removeFilter: function() {
		this.ownerCt.removeFilter(this);
		this.element.removeFilter(this.filter);
	},

	/**
	 * Get the fields for the element
	 *
	 * Based on the TSconfig general allowed fields
	 * and the TSconfig allowed fields for this type of element
	 *
	 * @returns object
	 */
	getFieldsBySettings: function() {
		var fields = [];
		var filterFields = this.configuration;
		var elementType = this.element.xtype.split('-').pop();

		var allowedGeneralFields = [];
		try {
			allowedGeneralFields = TYPO3.Form.Wizard.Settings.defaults.tabs.options.accordions.filtering.filters[this.filter].showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedGeneralFields = [
				'allowWhiteSpace',
				'decimalPoint',
				'thousandSeparator',
				'expression',
				'characterList'
			];
		}

		var allowedElementFields = [];
		try {
			allowedElementFields = TYPO3.Form.Wizard.Settings.elements[elementType].accordions.filtering.filters[this.filter].showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedElementFields = allowedGeneralFields;
		}

		Ext.iterate(allowedElementFields, function(item, index, allItems) {
			if (allowedGeneralFields.indexOf(item) > -1 && Ext.isDefined(filterFields[item])) {
				fields.push(item);
			}
		}, this);

		return fields;
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', this.filter, valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', this.filter, valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-filter', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The dummy item when no filter is defined for an element
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Dummy
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Dummy = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'formwizard-left-dummy typo3-message message-information',

	/**
	 * @cfg {Mixed} data
	 * The initial set of data to apply to the tpl to update the content area of
	 * the Component.
	 */
	data: [{
		title: TYPO3.l10n.localize('filters_dummy_title'),
		description: TYPO3.l10n.localize('filters_dummy_description')
	}],

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<p><strong>{title}</strong></p>',
			'<p>{description}</p>',
		'</tpl>'
	)
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-dummy', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Dummy);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The alphabetic filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphabetic
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphabetic = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'alphabetic',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				allowWhiteSpace: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphabetic.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-alphabetic', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphabetic);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The alphanumeric filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphanumeric
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphanumeric = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'alphanumeric',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				allowWhiteSpace: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphanumeric.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-alphanumeric', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Alphanumeric);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The currency filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Currency
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Currency = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'currency',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				decimalPoint: '.',
				thousandSeparator: ','
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Currency.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-currency', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Currency);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The digit filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Digit
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Digit = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'digit'
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-digit', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Digit);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The integer filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Integer
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Integer = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'integer'
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-integer', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Integer);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The lower case filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.LowerCase
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.LowerCase = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'lowercase'
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-lowercase', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.LowerCase);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The regular expression filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.RegExp
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.RegExp = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'regexp',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				expression: ''
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.RegExp.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-regexp', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.RegExp);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The remove XSS filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.RemoveXSS
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.RemoveXSS = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'removexss'
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-removexss', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.RemoveXSS);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The strip new lines filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.StripNewLines
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.StripNewLines = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'stripnewlines'
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-stripnewlines', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.StripNewLines);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The title case filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.TitleCase
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.TitleCase = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'titlecase'
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-titlecase', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.TitleCase);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The trim filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Trim
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Trim = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'trim',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				characterList: ''
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Trim.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-trim', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Trim);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters');

/**
 * The upper case filter
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.UpperCase
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.UpperCase = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.Filter, {
	/**
	 * @cfg {String} filter
	 *
	 * The name of this filter
	 */
	filter: 'uppercase'
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-filters-uppercase', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Filters.UpperCase);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms');

/**
 * The validation accordion panel in the element options in the left tabpanel
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('options_validation'),

	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-options-validation',

	/**
	 * @cfg {Object} validRules
	 * Keeps track which rules are valid. Rules contain forms which
	 * do client validation. If there is a validation change in a form in the
	 * rule, a validation event will be fired, which changes one of these
	 * values
	 */
	validRules: {
		alphabetic: true,
		alphanumeric: true,
		between: true,
		date: true,
		digit: true,
		email: true,
		equals: true,
		fileallowedtypes: true,
		float: true,
		greaterthan: true,
		inarray: true,
		integer: true,
		ip: true,
		length: true,
		lessthan: true,
		regexp: true,
		required: true,
		uri: true
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the accordion
	 */
	initComponent: function() {
		var rules = this.getRulesBySettings();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		var config = {
			items: [{
				xtype: 'typo3-form-wizard-viewport-left-options-forms-validation-dummy',
				ref: 'dummy'
			}],
			tbar: [
				{
					xtype: 'combo',
					hideLabel: true,
					name: 'rules',
					ref: 'rules',
					mode: 'local',
					triggerAction: 'all',
					forceSelection: true,
					editable: false,
					hiddenName: 'rules',
					emptyText: TYPO3.l10n.localize('validation_emptytext'),
					width: 150,
					displayField: 'label',
					valueField: 'value',
					store: new Ext.data.JsonStore({
						fields: ['label', 'value'],
						data: rules
					}),
					listeners: {
						'select': {
							scope: this,
							fn: this.addRule
						}
					}
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.superclass.initComponent.apply(this, arguments);

			// Initialize the rules when they are available for this element
		this.initRules();
	},

	/**
	 * Called when constructing the validation accordion
	 *
	 * Checks if the element already has rules and loads these instead of the dummy
	 */
	initRules: function() {
		var rules = this.element.configuration.validation;
		if (!Ext.isEmptyObject(rules)) {
			this.remove(this.dummy);
			Ext.iterate(rules, function(key, value) {
				var xtype = 'typo3-form-wizard-viewport-left-options-forms-validation-' + key;
				if (Ext.ComponentMgr.isRegistered(xtype)) {
					this.add({
						xtype: xtype,
						element: this.element,
						configuration: value,
						listeners: {
							'validation': {
								fn: this.validation,
								scope: this
							}
						}
					});
				}
			}, this);
		}
	},

	/**
	 * Add a rule to the validation list
	 *
	 * @param comboBox
	 * @param record
	 * @param index
	 */
	addRule: function(comboBox, record, index) {
		var rule = comboBox.getValue();
		var xtype = 'typo3-form-wizard-viewport-left-options-forms-validation-' + rule;

		if (!Ext.isEmpty(this.findByType(xtype))) {
			Ext.MessageBox.alert(TYPO3.l10n.localize('validation_alert_title'), TYPO3.l10n.localize('validation_alert_description'));
		} else {
			this.remove(this.dummy);

			this.add({
				xtype: xtype,
				element: this.element,
				listeners: {
					'validation': {
						fn: this.validation,
						scope: this
					}
				}
			});
			this.doLayout();
		}
	},

	/**
	 * Remove a rule from the validation list
	 *
	 * Shows dummy when there is no validation rule for this element
	 *
	 * @param component
	 */
	removeRule: function(component) {
		this.remove(component);
		this.validation(component.rule, true);
		if (this.items.length == 0) {
			this.add({
				xtype: 'typo3-form-wizard-viewport-left-options-forms-validation-dummy',
				ref: 'dummy'
			});
		}
		this.doLayout();
	},

	/**
	 * Get the rules by the TSconfig settings
	 *
	 * @returns {Array}
	 */
	getRulesBySettings: function() {
		var rules = [];
		var elementType = this.element.xtype.split('-').pop();

		var allowedDefaultRules = [];
		try {
			allowedDefaultRules = TYPO3.Form.Wizard.Settings.defaults.tabs.options.accordions.validation.showRules.split(/[, ]+/);
		} catch (error) {
			// The object has not been found
			allowedDefaultRules = [
				'alphabetic',
				'alphanumeric',
				'between',
				'date',
				'digit',
				'email',
				'equals',
				'fileallowedtypes',
				'float',
				'greaterthan',
				'inarray',
				'integer',
				'ip',
				'length',
				'lessthan',
				'regexp',
				'required',
				'uri'
			];
		}

		var allowedElementRules = [];
		try {
			allowedElementRules = TYPO3.Form.Wizard.Settings.elements[elementType].accordions.validation.showRules.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedElementRules = allowedDefaultRules;
		}

		Ext.iterate(allowedElementRules, function(item, index, allItems) {
			if (allowedDefaultRules.indexOf(item) > -1) {
				rules.push({label: TYPO3.l10n.localize('validation_' + item), value: item});
			}
		}, this);

		return rules;
	},

	/**
	 * Called by the validation listeners of the rules
	 *
	 * Checks if all rules are valid. If not, adds a class to the accordion
	 *
	 * @param {String} rule The rule which fires the event
	 * @param {Boolean} isValid Rule is valid or not
	 */
	validation: function(rule, isValid) {
		this.validRules[rule] = isValid;
		var accordionIsValid = true;
		Ext.iterate(this.validRules, function(key, value) {
			if (!value) {
				accordionIsValid = false;
			}
		}, this);
		if (this.el) {
			if (accordionIsValid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'validation', isValid);
			} else if (!accordionIsValid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'validation', isValid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The validation rules abstract
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	/**
	 * @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: '',

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * Constructor
	 */
	initComponent: function() {
		var fields = this.getFieldsBySettings();
		var formItems = new Array();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		Ext.iterate(fields, function(item, index, allItems) {
			switch(item) {
				case 'message':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('validation_properties_message'),
						name: 'message',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'error':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('validation_properties_error'),
						name: 'error',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'breakOnError':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('validation_properties_breakonerror'),
						name: 'breakOnError',
						inputValue: '1',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'showMessage':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('validation_properties_showmessage'),
						name: 'showMessage',
						inputValue: '1',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'allowWhiteSpace':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('validation_properties_allowwhitespace'),
						name: 'allowWhiteSpace',
						inputValue: '1',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'minimum':
					formItems.push({
						xtype: 'spinnerfield',
						fieldLabel: TYPO3.l10n.localize('validation_properties_minimum'),
						name: 'minimum',
						minValue: 0,
						accelerate: true,
						listeners: {
							'spin': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'maximum':
					formItems.push({
						xtype: 'spinnerfield',
						fieldLabel: TYPO3.l10n.localize('validation_properties_maximum'),
						name: 'maximum',
						minValue: 0,
						accelerate: true,
						listeners: {
							'spin': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'inclusive':
					formItems.push({
						xtype: 'checkbox',
						fieldLabel: TYPO3.l10n.localize('validation_properties_inclusive'),
						name: 'inclusive',
						inputValue: '1',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'format':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('validation_properties_format'),
						name: 'format',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'field':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('validation_properties_field'),
						name: 'field',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'array':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('validation_properties_array'),
						name: 'array',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'expression':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('validation_properties_expression'),
						name: 'expression',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
				case 'types':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('validation_properties_types'),
						name: 'types',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
			}
		}, this);

		formItems.push({
			xtype: 'button',
			text: TYPO3.l10n.localize('button_remove'),
			handler: this.removeRule,
			scope: this
		});

		var config = {
			items: [
				{
					xtype: 'fieldset',
					title: TYPO3.l10n.localize('validation_' + this.rule),
					autoHeight: true,
					defaults: {
						width: 128,
						msgTarget: 'side'
					},
					defaultType: 'textfieldsubmit',
					items: formItems
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Strange, but we need to call doLayout() after render
		this.on('afterrender', this.newOrExistingRule, this);
	},

	/**
	 * Decide whether this is a new or an existing one
	 *
	 * If new, the default configuration has to be added to the validation rules
	 * of the element, otherwise we can fill the form with the existing configuration
	 */
	newOrExistingRule: function() {
		this.doLayout();
			// Existing rule
		if (this.element.configuration.validation[this.rule]) {
			this.fillForm();
			// New rule
		} else {
			this.addRuleToElement();
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * When filling, the events of all form elements should be suspended,
	 * otherwise the values are written back to the element, for instance on a
	 * check event on a checkbox.
	 */
	fillForm: function() {
		this.suspendEventsBeforeFilling();
		this.getForm().setValues(this.element.configuration.validation[this.rule]);
		this.resumeEventsAfterFilling();
	},

	/**
	 * Suspend the events on all items within this component
	 */
	suspendEventsBeforeFilling: function() {
		this.cascade(function(item) {
			item.suspendEvents();
		});
	},

	/**
	 * Resume the events on all items within this component
	 */
	resumeEventsAfterFilling: function() {
		this.cascade(function(item) {
			item.resumeEvents();
		});
	},

	/**
	 * Add this rule to the element
	 */
	addRuleToElement: function() {
		var formConfiguration = {validation: {}};
		formConfiguration.validation[this.rule] = this.configuration;

		this.element.setConfigurationValue(formConfiguration);

		this.fillForm();
	},

	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			var formConfiguration = {validation: {}};
			formConfiguration.validation[this.rule] = {};
			formConfiguration.validation[this.rule][fieldName] = field.getValue();

			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Remove the rule
	 *
	 * Called when the remove button of this rule has been clicked
	 */
	removeRule: function() {
		this.ownerCt.removeRule(this);
		this.element.removeValidationRule(this.rule);
	},

	/**
	 * Get the fields for the element
	 *
	 * Based on the TSconfig general allowed fields
	 * and the TSconfig allowed fields for this type of element
	 *
	 * @returns object
	 */
	getFieldsBySettings: function() {
		var fields = [];
		var ruleFields = this.configuration;
		var elementType = this.element.xtype.split('-').pop();

		var allowedGeneralFields = [];
		try {
			allowedGeneralFields = TYPO3.Form.Wizard.Settings.defaults.tabs.options.accordions.validation.rules[this.rule].showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedGeneralFields = [
				'message',
				'error',
				'breakOnError',
				'showMessage',
				'allowWhiteSpace',
				'minimum',
				'maximum',
				'inclusive',
				'format',
				'field',
				'array',
				'strict',
				'expression'
			];
		}

		var allowedElementFields = [];
		try {
			allowedElementFields = TYPO3.Form.Wizard.Settings.elements[elementType].accordions.validation.rules[this.rule].showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedElementFields = allowedGeneralFields;
		}

		Ext.iterate(allowedElementFields, function(item, index, allItems) {
			if (allowedGeneralFields.indexOf(item) > -1 && Ext.isDefined(ruleFields[item])) {
				fields.push(item);
			}
		}, this);

		return fields;
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', this.rule, valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', this.rule, valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-rule', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The dummy item when no validation rule is defined for an element
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Dummy
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Dummy = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'formwizard-left-dummy typo3-message message-information',

	/**
	 * @cfg {Mixed} data
	 * The initial set of data to apply to the tpl to update the content area of
	 * the Component.
	 */
	data: [{
		title: TYPO3.l10n.localize('validation_dummy_title'),
		description: TYPO3.l10n.localize('validation_dummy_description')
	}],

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<p><strong>{title}</strong></p>',
			'<p>{description}</p>',
		'</tpl>'
	)
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-dummy', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Dummy);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The alphabetic validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphabetic
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphabetic = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'alphabetic',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_alphabetic.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_alphabetic.error'),
				allowWhiteSpace: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphabetic.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-alphabetic', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphabetic);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The alphanumeric validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphanumeric
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphanumeric = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'alphanumeric',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_alphanumeric.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_alphanumeric.error'),
				allowWhiteSpace: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphanumeric.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-alphanumeric', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Alphanumeric);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The between validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Between
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Between = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'between',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_between.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_between.error'),
				minimum: 0,
				maximum: 0,
				inclusive: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Between.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-between', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Between);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The date validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Date
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Date = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'date',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_date.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_date.error'),
				format: '%e-%m-%Y'
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Date.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-date', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Date);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The digit validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Digit
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Digit = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'digit',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_digit.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_digit.error')
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Digit.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-digit', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Digit);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The email validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Email
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Email = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'email',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_email.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_email.error')
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Email.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-email', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Email);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The equals validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Email
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Equals = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'equals',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_equals.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_equals.error'),
				field: ''
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Equals.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-equals', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Equals);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.FileAllowedTypes');

/**
 * The allowed file types rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileAllowedTypes
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileAllowedTypes = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'fileallowedtypes',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_fileallowedtypes.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_fileallowedtypes.error'),
				types: ''
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileAllowedTypes.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-fileallowedtypes', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileAllowedTypes);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.FileMaximumSize');

/**
 * The maximum file size rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMaximumSize
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMaximumSize = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'filemaximumsize',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_filemaximumsize.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_filemaximumsize.error'),
				maximum: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMaximumSize.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-filemaximumsize', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMaximumSize);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.FileMinimumSize');

/**
 * The minimum file size rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMinimumSize
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMinimumSize = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'fileminimumsize',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_fileminimumsize.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_fileminimumsize.error'),
				minimum: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMinimumSize.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-fileminimumsize', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.FileMinimumSize);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The float validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Float
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Float = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'float',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_float.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_float.error')
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Float.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-float', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Float);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The greater than validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.GreaterThan
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.GreaterThan = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'greaterthan',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_greaterthan.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_greaterthan.error'),
				minimum: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.GreaterThan.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-greaterthan', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.GreaterThan);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The in arrayt validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.InArray
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.InArray = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'inarray',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_inarray.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_inarray.error'),
				array: '',
				strict: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.InArray.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-inarray', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.InArray);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The integer validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Integer
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Integer = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'integer',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_integer.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_integer.error')
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Integer.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-integer', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Integer);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The IP validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Ip
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Ip = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'ip',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_ip.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_ip.error')
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Ip.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-ip', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Ip);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The length validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Length
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Length = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'length',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_length.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_length.error'),
				minimum: 0,
				maximum: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Length.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-length', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Length);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The less than validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.LessThan
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.LessThan = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'lessthan',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_lessthan.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_lessthan.error'),
				maximum: 0
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.LessThan.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-lessthan', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.LessThan);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The regular expression validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.RegExp
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.RegExp = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'regexp',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_regexp.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_regexp.error'),
				expression: ''
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.RegExp.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-regexp', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.RegExp);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The required validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Required
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Required = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'required',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_required.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_required.error')
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Required.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-required', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Required);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation');

/**
 * The uri validation rule
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Uri
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule
 */
TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Uri = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Rule, {
	/**
	 * @cfg {String} rule
	 *
	 * The name of this rule
	 */
	rule: 'uri',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				breakOnError: 0,
				showMessage: 1,
				message: TYPO3.l10n.localize('tx_form_system_validate_uri.message'),
				error: TYPO3.l10n.localize('tx_form_system_validate_uri.error')
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Uri.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-options-forms-validation-uri', TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Validation.Uri);
Ext.namespace('TYPO3.Form.Wizard.Viewport.LeftTYPO3.Form.Wizard.Elements');

/**
 * The form tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Form = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-form',

	/**
	 * @cfg {String} cls
	 * An optional extra CSS class that will be added to this component's
	 * Element (defaults to ''). This can be useful for adding customized styles
	 * to the component or any of its children using standard CSS rules.
	 */
	cls: 'x-tab-panel-body-content',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('left_form'),

	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Object|Function} defaults
	 * This option is a means of applying default settings to all added items
	 * whether added through the items config or via the add or insert methods.
	 */
	defaults: {
		//autoHeight: true,
		border: false,
		padding: 0
	},

	/**
	 * @cfg {Object} validAccordions
	 * Keeps track which accordions are valid. Accordions contain forms which
	 * do client validation. If there is a validation change in a form in the
	 * accordion, a validation event will be fired, which changes one of these
	 * values
	 */
	validAccordions: {
		behaviour: true,
		prefix: true,
		attributes: true,
		postProcessor: true
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the tab
	 */
	initComponent: function() {
		var config = {
			items: [{
				xtype: 'panel',
				layout: 'accordion',
				ref: 'accordion',
				defaults: {
					autoHeight: true,
					cls: 'x-panel-accordion'
				}
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Form.superclass.initComponent.apply(this, arguments);
	},

	/**
	 * Called whenever a form has been added to the right container
	 *
	 * Sets element to the form component and calls the function to add the
	 * attribute fields
	 *
	 * @param form
	 */
	setForm: function(form) {
		var allowedAccordions = TYPO3.Form.Wizard.Settings.defaults.tabs.form.showAccordions.split(/[, ]+/);

		this.accordion.removeAll();
		if (form) {
			allowedAccordions.each(function(option, index, length) {
				switch (option) {
					case 'behaviour':
						this.accordion.add({
							xtype: 'typo3-form-wizard-viewport-left-form-behaviour',
							element: form,
							listeners: {
								'validation': {
									fn: this.validation,
									scope: this
								}
							}
						});
						break;
					case 'prefix':
						this.accordion.add({
							xtype: 'typo3-form-wizard-viewport-left-form-prefix',
							element: form,
							listeners: {
								'validation': {
									fn: this.validation,
									scope: this
								}
							}
						});
						break;
					case 'attributes':
						this.accordion.add({
							xtype: 'typo3-form-wizard-viewport-left-form-attributes',
							element: form,
							listeners: {
								'validation': {
									fn: this.validation,
									scope: this
								}
							}
						});
						break;
					case 'postProcessor':
						this.accordion.add({
							xtype: 'typo3-form-wizard-viewport-left-form-postprocessor',
							element: form,
							listeners: {
								'validation': {
									fn: this.validation,
									scope: this
								}
							}
						});
						break;
				}
			}, this);
		}
		this.doLayout();
	},

	/**
	 * Called by the validation listeners of the accordions
	 *
	 * Checks if all accordions are valid. If not, adds a class to the tab
	 *
	 * @param {String} accordion The accordion which fires the event
	 * @param {Boolean} isValid Accordion is valid or not
	 */
	validation: function(accordion, isValid) {
		this.validAccordions[accordion] = isValid;
		var tabIsValid = true;
		Ext.iterate(this.validAccordions, function(key, value) {
			if (!value) {
				tabIsValid = false;
			}
		}, this);
		if (this.tabEl) {
			if (tabIsValid && Ext.get(this.tabEl).hasClass('validation-error')) {
				this.tabEl.removeClassName('validation-error');
			} else if (!tabIsValid && !Ext.get(this.tabEl).hasClass('validation-error')) {
				this.tabEl.addClassName('validation-error');
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-form', TYPO3.Form.Wizard.Viewport.Left.Form);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Form');

/**
 * The behaviour panel in the accordion of the form tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form.Behaviour
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Form.Behaviour = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-form-behaviour',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('form_behaviour'),

	/**
	 * @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {Object} element
	 * The form component
	 */
	element: null,

	/**
	 * Constructor
	 *
	 * @param config
	 */
	constructor: function(config){
		// Call our superclass constructor to complete construction process.
		TYPO3.Form.Wizard.Viewport.Left.Form.Behaviour.superclass.constructor.call(this, config);
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the tab
	 */
	initComponent: function() {
		var config = {
			items: [{
				xtype: 'fieldset',
				title: '',
				ref: 'fieldset',
				autoHeight: true,
				border: false,
				defaults: {
					width: 150,
					msgTarget: 'side'
				},
				defaultType: 'checkbox',
				items: [
					{
						fieldLabel: TYPO3.l10n.localize('behaviour_confirmation_page'),
						name: 'confirmation',
						listeners: {
							'check': {
								scope: this,
								fn: this.storeValue
							}
						}
					}
				]
			}]
		};

		// Apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

		// Call parent
		TYPO3.Form.Wizard.Viewport.Left.Form.Behaviour.superclass.initComponent.apply(this, arguments);

		// Fill the form with the configuration values
		this.fillForm();
	},


	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		var fieldName = field.getName();

		var formConfiguration = {};
		formConfiguration[fieldName] = field.getValue();

		this.element.setConfigurationValue(formConfiguration);
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * @return void
	 */
	fillForm: function() {
		this.getForm().setValues(this.element.configuration);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-form-behaviour', TYPO3.Form.Wizard.Viewport.Left.Form.Behaviour);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Form');

/**
 * The attributes panel in the accordion of the form tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form.Attributes
 * @extends TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Attributes
 */
TYPO3.Form.Wizard.Viewport.Left.Form.Attributes = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Options.Forms.Attributes, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-form-attributes'
});

Ext.reg('typo3-form-wizard-viewport-left-form-attributes', TYPO3.Form.Wizard.Viewport.Left.Form.Attributes);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Form');

/**
 * The prefix panel in the accordion of the form tab on the left side
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form.Prefix
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Form.Prefix = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {String} id
	 * The unique id of this component (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the component
	 * later and you do not have an object reference available
	 * (e.g., using Ext.getCmp).
	 *
	 * Note that this id will also be used as the element id for the containing
	 * HTML element that is rendered to the page for this component.
	 * This allows you to write id-based CSS rules to style the specific
	 * instance of this component uniquely, and also to select sub-elements
	 * using this component's id as the parent.
	 */
	id: 'formwizard-left-form-prefix',

	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('form_prefix'),

	/** @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {Object} element
	 * The form component
	 */
	element: null,

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * Constructor
	 *
	 * @param config
	 */
	constructor: function(config){
			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

			// Call our superclass constructor to complete construction process.
		TYPO3.Form.Wizard.Viewport.Left.Form.Prefix.superclass.constructor.call(this, config);
	},

	/**
	 * Constructor
	 *
	 * Add the form elements to the tab
	 */
	initComponent: function() {
		var config = {
			items: [{
				xtype: 'fieldset',
				title: '',
				ref: 'fieldset',
				autoHeight: true,
				border: false,
				defaults: {
					width: 150,
					msgTarget: 'side'
				},
				defaultType: 'textfieldsubmit',
				items: [
					{
						fieldLabel: TYPO3.l10n.localize('prefix_prefix'),
						name: 'prefix',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					}
				]
			}]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Form.Prefix.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Fill the form with the configuration values
		this.fillForm();
	},


	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			var formConfiguration = {};
			formConfiguration[fieldName] = field.getValue();

			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * @param record The current question
	 * @return void
	 */
	fillForm: function() {
		this.getForm().setValues(this.element.configuration);
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'prefix', valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'prefix', valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-form-prefix', TYPO3.Form.Wizard.Viewport.Left.Form.Prefix);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Form');

/**
 * The post processor accordion panel in the form options in the left tabpanel
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessor
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessor = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} title
	 * The title text to be used as innerHTML (html tags are accepted) to
	 * display in the panel header (defaults to '').
	 */
	title: TYPO3.l10n.localize('form_postprocessor'),

	/**
	 * @cfg {Object} validPostProcessors
	 * Keeps track which post processors are valid. Post processors contain forms which
	 * do client validation. If there is a validation change in a form in the
	 * post processor, a validation event will be fired, which changes one of these
	 * values
	 */
	validPostProcessors: {
		mail: true
	},

	/**
	 * Constructor
	 *
	 * Add the post processors to the accordion
	 */
	initComponent: function() {
		var postProcessors = this.getPostProcessorsBySettings();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		var config = {
			items: [{
				xtype: 'typo3-form-wizard-viewport-left-form-postprocessors-dummy',
				ref: 'dummy'
			}]
			// TODO: When there are more post processors, the dropdown should be visible
			/*,
			tbar: [
				{
					xtype: 'combo',
					hideLabel: true,
					name: 'postprocessor',
					ref: 'postprocessor',
					mode: 'local',
					triggerAction: 'all',
					forceSelection: true,
					editable: false,
					hiddenName: 'postprocessor',
					emptyText: TYPO3.l10n.localize('postprocessor_emptytext'),
					width: 150,
					displayField: 'label',
					valueField: 'value',
					store: new Ext.data.JsonStore({
						fields: ['label', 'value'],
						data: postProcessors
					}),
					listeners: {
						'select': {
							scope: this,
							fn: this.addPostProcessor
						}
					}
				}
			]*/
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessor.superclass.initComponent.apply(this, arguments);

			// Initialize the post processors when they are available for this element
		this.initPostProcessors();
	},

	/**
	 * Called when constructing the post processor accordion
	 *
	 * Checks if the form already has post processors and loads these instead of the dummy
	 */
	initPostProcessors: function() {
		var postProcessors = this.element.configuration.postProcessor;
		if (!Ext.isEmptyObject(postProcessors)) {
			this.remove(this.dummy);
			Ext.iterate(postProcessors, function(key, value) {
				var xtype = 'typo3-form-wizard-viewport-left-form-postprocessors-' + key;
				if (Ext.ComponentMgr.isRegistered(xtype)) {
					this.add({
						xtype: xtype,
						element: this.element,
						configuration: value,
						listeners: {
							'validation': {
								fn: this.validation,
								scope: this
							}
						}
					});
				}
			}, this);
		}
	},

	/**
	 * Add a post processor to the list
	 *
	 * @param comboBox
	 * @param record
	 * @param index
	 */
	addPostProcessor: function(comboBox, record, index) {
		var postProcessor = comboBox.getValue();
		var xtype = 'typo3-form-wizard-viewport-left-form-postprocessors-' + postProcessor;

		if (!Ext.isEmpty(this.findByType(xtype))) {
			Ext.MessageBox.alert(TYPO3.l10n.localize('postprocessor_alert_title'), TYPO3.l10n.localize('postprocessor_alert_description'));
		} else {
			this.remove(this.dummy);

			this.add({
				xtype: xtype,
				element: this.element,
				listeners: {
					'validation': {
						fn: this.validation,
						scope: this
					}
				}
			});
			this.doLayout();
		}
	},

	/**
	 * Remove a post processor from the list
	 *
	 * Shows dummy when there is no post processor for the form
	 *
	 * @param component
	 */
	removePostProcessor: function(component) {
		this.remove(component);
		this.validation(component.processor, true);
		if (this.items.length == 0) {
			this.add({
				xtype: 'typo3-form-wizard-viewport-left-form-postprocessors-dummy',
				ref: 'dummy'
			});
		}
		this.doLayout();
	},

	getPostProcessorsBySettings: function() {
		var postProcessors = [];

		var allowedPostProcessors = [];
		try {
			allowedPostProcessors = TYPO3.Form.Wizard.Settings.defaults.tabs.form.accordions.postProcessor.showPostProcessors.split(/[, ]+/);
		} catch (error) {
			// The object has not been found
			allowedPostProcessors = [
				'mail'
			];
		}

		Ext.iterate(allowedPostProcessors, function(item, index, allItems) {
			postProcessors.push({label: TYPO3.l10n.localize('postprocessor_' + item), value: item});
		}, this);

		return postProcessors;
	},

	/**
	 * Called by the validation listeners of the post processors
	 *
	 * Checks if all post processors are valid. If not, adds a class to the accordion
	 *
	 * @param {String} postProcessor The post processor which fires the event
	 * @param {Boolean} isValid Post processor is valid or not
	 */
	validation: function(postProcessor, isValid) {
		this.validPostProcessors[postProcessor] = isValid;
		var accordionIsValid = true;
		Ext.iterate(this.validPostProcessors, function(key, value) {
			if (!value) {
				accordionIsValid = false;
			}
		}, this);
		if (this.el) {
			if (accordionIsValid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', 'postProcessor', accordionIsValid);
			} else if (!accordionIsValid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', 'postProcessor', accordionIsValid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-form-postprocessor', TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessor);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors');

/**
 * The post processor abstract
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.PostProcessor
 * @extends Ext.FormPanel
 */
TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.PostProcessor = Ext.extend(Ext.FormPanel, {
	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	/**
	 * @cfg {String} defaultType
	 *
	 * The default xtype of child Components to create in this Container when
	 * a child item is specified as a raw configuration object,
	 * rather than as an instantiated Component.
	 *
	 * Defaults to 'panel', except Ext.menu.Menu which defaults to 'menuitem',
	 * and Ext.Toolbar and Ext.ButtonGroup which default to 'button'.
	 */
	defaultType: 'textfield',

	/**
	 * @cfg {String} processor
	 *
	 * The name of this processor
	 */
	processor: '',

	/**
	 * @cfg {Boolean} monitorValid If true, the form monitors its valid state client-side and
	 * regularly fires the clientvalidation event passing that state.
	 * When monitoring valid state, the FormPanel enables/disables any of its configured
	 * buttons which have been configured with formBind: true depending
	 * on whether the form is valid or not. Defaults to false
	 */
	monitorValid: true,

	/**
	 * Constructor
	 */
	initComponent: function() {
		var fields = this.getFieldsBySettings();
		var formItems = new Array();

			// Adds the specified events to the list of events which this Observable may fire.
		this.addEvents({
			'validation': true
		});

		Ext.iterate(fields, function(item, index, allItems) {
			switch(item) {
				case 'recipientEmail':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('postprocessor_properties_recipientemail'),
						name: 'recipientEmail',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'senderEmail':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('postprocessor_properties_senderemail'),
						name: 'senderEmail',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
				case 'subject':
					formItems.push({
						fieldLabel: TYPO3.l10n.localize('postprocessor_properties_subject'),
						name: 'subject',
						allowBlank: false,
						listeners: {
							'triggerclick': {
								scope: this,
								fn: this.storeValue
							}
						}
					});
					break;
			}
		}, this);

		// TODO: Add the remove button when more post processors are available
		/*formItems.push({
			xtype: 'button',
			text: TYPO3.l10n.localize('button_remove'),
			handler: this.removePostProcessor,
			scope: this
		});*/

		var config = {
			items: [
				{
					xtype: 'fieldset',
					title: TYPO3.l10n.localize('postprocessor_' + this.processor),
					autoHeight: true,
					defaults: {
						width: 128,
						msgTarget: 'side'
					},
					defaultType: 'textfieldsubmit',
					items: formItems
				}
			]
		};

			// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));

			// call parent
		TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.PostProcessor.superclass.initComponent.apply(this, arguments);

			// Initialize clientvalidation event
		this.on('clientvalidation', this.validation, this);

			// Strange, but we need to call doLayout() after render
		this.on('afterrender', this.newOrExistingPostProcessor, this);
	},

	/**
	 * Decide whether this is a new or an existing one
	 *
	 * If new, the default configuration has to be added to the processors
	 * of the form, otherwise we can fill the form with the existing configuration
	 */
	newOrExistingPostProcessor: function() {
		this.doLayout();
			// Existing processor
		if (this.element.configuration.postProcessor[this.processor]) {
			this.fillForm();
			// New processor
		} else {
			this.addProcessorToElement();
		}
	},

	/**
	 * Fill the form with the configuration of the element
	 *
	 * When filling, the events of all form elements should be suspended,
	 * otherwise the values are written back to the element, for instance on a
	 * check event on a checkbox.
	 */
	fillForm: function() {
		this.suspendEventsBeforeFilling();
		this.getForm().setValues(this.element.configuration.postProcessor[this.processor]);
		this.resumeEventsAfterFilling();
	},

	/**
	 * Suspend the events on all items within this component
	 */
	suspendEventsBeforeFilling: function() {
		this.cascade(function(item) {
			item.suspendEvents();
		});
	},

	/**
	 * Resume the events on all items within this component
	 */
	resumeEventsAfterFilling: function() {
		this.cascade(function(item) {
			item.resumeEvents();
		});
	},

	/**
	 * Add this processor to the element
	 */
	addProcessorToElement: function() {
		var formConfiguration = {postProcessor: {}};
		formConfiguration.postProcessor[this.processor] = this.configuration;

		this.element.setConfigurationValue(formConfiguration);

		this.fillForm();
	},

	/**
	 * Store a changed value from the form in the element
	 *
	 * @param {Object} field The field which has changed
	 */
	storeValue: function(field) {
		if (field.isValid()) {
			var fieldName = field.getName();

			var formConfiguration = {postProcessor: {}};
			formConfiguration.postProcessor[this.processor] = {};
			formConfiguration.postProcessor[this.processor][fieldName] = field.getValue();

			this.element.setConfigurationValue(formConfiguration);
		}
	},

	/**
	 * Remove the processor
	 *
	 * Called when the remove button of this processor has been clicked
	 */
	removePostProcessor: function() {
		this.ownerCt.removePostProcessor(this);
		this.element.removePostProcessor(this.processor);
	},

	/**
	 * Get the fields for the element
	 *
	 * Based on the TSconfig general allowed fields
	 * and the TSconfig allowed fields for this type of element
	 *
	 * @returns object
	 */
	getFieldsBySettings: function() {
		var fields = [];
		var processorFields = this.configuration;

		var allowedFields = [];
		try {
			allowedFields = TYPO3.Form.Wizard.Settings.defaults.tabs.form.accordions.postProcessor.postProcessors[this.processor].showProperties.split(/[, ]+/);
		} catch (error) {
			// The object has not been found or constructed wrong
			allowedFields = [
				'recipientEmail',
				'senderEmail'
			];
		}

		Ext.iterate(allowedFields, function(item, index, allItems) {
			fields.push(item);
		}, this);

		return fields;
	},

	/**
	 * Called by the clientvalidation event
	 *
	 * Adds or removes the error class if the form is valid or not
	 *
	 * @param {Object} formPanel This formpanel
	 * @param {Boolean} valid True if the client validation is true
	 */
	validation: function(formPanel, valid) {
		if (this.el) {
			if (valid && this.el.hasClass('validation-error')) {
				this.removeClass('validation-error');
				this.fireEvent('validation', this.processor, valid);
			} else if (!valid && !this.el.hasClass('validation-error')) {
				this.addClass('validation-error');
				this.fireEvent('validation', this.processor, valid);
			}
		}
	}
});

Ext.reg('typo3-form-wizard-viewport-left-form-postprocessors-postprocessor', TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.PostProcessor);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors');

/**
 * The dummy item when no post processor is defined for the form
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.Dummy
 * @extends Ext.Panel
 */
TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.Dummy = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Boolean} border
	 * True to display the borders of the panel's body element, false to hide
	 * them (defaults to true). By default, the border is a 2px wide inset
	 * border, but this can be further altered by setting bodyBorder to false.
	 */
	border: false,

	/**
	 * @cfg {Number/String} padding
	 * A shortcut for setting a padding style on the body element. The value can
	 * either be a number to be applied to all sides, or a normal css string
	 * describing padding.
	 */
	padding: 0,

	cls: 'formwizard-left-dummy typo3-message message-information',

	/**
	 * @cfg {Mixed} data
	 * The initial set of data to apply to the tpl to update the content area of
	 * the Component.
	 */
	data: [{
		title: TYPO3.l10n.localize('postprocessor_dummy_title'),
		description: TYPO3.l10n.localize('postprocessor_dummy_description')
	}],

	/**
	 * @cfg {Mixed} tpl
	 * An Ext.Template, Ext.XTemplate or an array of strings to form an
	 * Ext.XTemplate. Used in conjunction with the data and tplWriteMode
	 * configurations.
	 */
	tpl: new Ext.XTemplate(
		'<tpl for=".">',
			'<p><strong>{title}</strong></p>',
			'<p>{description}</p>',
		'</tpl>'
	)
});

Ext.reg('typo3-form-wizard-viewport-left-form-postprocessors-dummy', TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.Dummy);
Ext.namespace('TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors');

/**
 * The mail post processor
 *
 * @class TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.Mail
 * @extends TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.PostProcessor
 */
TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.Mail = Ext.extend(TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.PostProcessor, {
	/**
	 * @cfg {String} processor
	 *
	 * The name of this processor
	 */
	processor: 'mail',

	/**
	 * Constructor
	 *
	 * Add the configuration object to this component
	 * @param config
	 */
	constructor: function(config) {
		Ext.apply(this, {
			configuration: {
				recipientEmail: '',
				senderEmail: ''
			}
		});
		TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.Mail.superclass.constructor.apply(this, arguments);
	}
});

Ext.reg('typo3-form-wizard-viewport-left-form-postprocessors-mail', TYPO3.Form.Wizard.Viewport.Left.Form.PostProcessors.Mail);
/*
 * This code has been copied from Project_CMS
 * Copyright (c) 2005 by Phillip Berndt (www.pberndt.com)
 *
 * Extended Textarea for IE and Firefox browsers
 * Features:
 *  - Possibility to place tabs in <textarea> elements using a simply <TAB> key
 *  - Auto-indenting of new lines
 *
 * License: GNU General Public License
 */

function checkBrowser() {
	browserName = navigator.appName;
	browserVer = parseInt(navigator.appVersion);

	ok = false;
	if (browserName == "Microsoft Internet Explorer" && browserVer >= 4) {
		ok = true;
	} else if (browserName == "Netscape" && browserVer >= 3) {
		ok = true;
	}

	return ok;
}

	// Automatically change all textarea elements
function changeTextareaElements() {
	if (!checkBrowser()) {
			// Stop unless we're using IE or Netscape (includes Mozilla family)
		return false;
	}

	document.textAreas = document.getElementsByTagName("textarea");

	for (i = 0; i < document.textAreas.length; i++) {
			// Only change if the class parameter contains "enable-tab"
		if (document.textAreas[i].className && document.textAreas[i].className.search(/(^| )enable-tab( |$)/) != -1) {
			document.textAreas[i].textAreaID = i;
			makeAdvancedTextArea(document.textAreas[i]);
		}
	}
}

	// Wait until the document is completely loaded.
	// Set a timeout instead of using the onLoad() event because it could be used by something else already.
window.setTimeout("changeTextareaElements();", 200);

	// Turn textarea elements into "better" ones. Actually this is just adding some lines of JavaScript...
function makeAdvancedTextArea(textArea) {
	if (textArea.tagName.toLowerCase() != "textarea") {
		return false;
	}

		// On attempt to leave the element:
		// Do not leave if this.dontLeave is true
	textArea.onblur = function(e) {
		if (!this.dontLeave) {
			return;
		}
		this.dontLeave = null;
		window.setTimeout("document.textAreas[" + this.textAreaID + "].restoreFocus()", 1);
		return false;
	}

		// Set the focus back to the element and move the cursor to the correct position.
	textArea.restoreFocus = function() {
		this.focus();

		if (this.caretPos) {
			this.caretPos.collapse(false);
			this.caretPos.select();
		}
	}

		// Determine the current cursor position
	textArea.getCursorPos = function() {
		if (this.selectionStart) {
			currPos = this.selectionStart;
		} else if (this.caretPos) {	// This is very tricky in IE :-(
			oldText = this.caretPos.text;
			finder = "--getcurrpos" + Math.round(Math.random() * 10000) + "--";
			this.caretPos.text += finder;
			currPos = this.value.indexOf(finder);

			this.caretPos.moveStart('character', -finder.length);
			this.caretPos.text = "";

			this.caretPos.scrollIntoView(true);
		} else {
			return;
		}

		return currPos;
	}

		// On tab, insert a tabulator. Otherwise, check if a slash (/) was pressed.
	textArea.onkeydown = function(e) {
		if (this.selectionStart == null &! this.createTextRange) {
			return;
		}
		if (!e) {
			e = window.event;
		}

			// Tabulator
		if (e.keyCode == 9) {
			this.dontLeave = true;
			this.textInsert(String.fromCharCode(9));
		}

			// Newline
		if (e.keyCode == 13) {
				// Get the cursor position
			currPos = this.getCursorPos();

				// Search the last line
			lastLine = "";
			for (i = currPos - 1; i >= 0; i--) {
				if(this.value.substring(i, i + 1) == '\n') {
					break;
				}
			}
			lastLine = this.value.substring(i + 1, currPos);

				// Search for whitespaces in the current line
			whiteSpace = "";
			for (i = 0; i < lastLine.length; i++) {
				if (lastLine.substring(i, i + 1) == '\t') {
					whiteSpace += "\t";
				} else if (lastLine.substring(i, i + 1) == ' ') {
					whiteSpace += " ";
				} else {
					break;
				}
			}

				// Another ugly IE hack
			if (navigator.appVersion.match(/MSIE/)) {
				whiteSpace = "\\n" + whiteSpace;
			}

				// Insert whitespaces
			window.setTimeout("document.textAreas["+this.textAreaID+"].textInsert(\""+whiteSpace+"\");", 1);
		}
	}

		// Save the current cursor position in IE
	textArea.onkeyup = textArea.onclick = textArea.onselect = function(e) {
		if (this.createTextRange) {
			this.caretPos = document.selection.createRange().duplicate();
		}
	}

		// Insert text at the current cursor position
	textArea.textInsert = function(insertText) {
		if (this.selectionStart != null) {
			var savedScrollTop = this.scrollTop;
			var begin = this.selectionStart;
			var end = this.selectionEnd;
			if (end > begin + 1) {
				this.value = this.value.substr(0, begin) + insertText + this.value.substr(end);
			} else {
				this.value = this.value.substr(0, begin) + insertText + this.value.substr(begin);
			}

			this.selectionStart = begin + insertText.length;
			this.selectionEnd = begin + insertText.length;
			this.scrollTop = savedScrollTop;
		} else if (this.caretPos) {
			this.caretPos.text = insertText;
			this.caretPos.scrollIntoView(true);
		} else {
			text.value += insertText;
		}

		this.focus();
	}
}
/***************************************************************
 *  Copyright notice
 *
 *  (c) 2010-2011 Steffen Kamper <steffen@typo3.org>
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
 *  A copy is found in the textfile GPL.txt and important notices to the license
 *  from the author is found in LICENSE.txt distributed with these scripts.
 *
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

Ext.ns('TYPO3', 'TYPO3.CSH.ExtDirect');

/**
 * Class to show tooltips for links that have the css t3-help-link
 * need the tags data-table and data-field (HTML5)
 */


TYPO3.ContextHelp = function() {

	/**
	 * Cache for CSH
	 * @type {Ext.util.MixedCollection}
	 */
	var cshHelp = new Ext.util.MixedCollection(true),
	tip;

	/**
	 * Shows the tooltip, triggered from mouseover event handler
	 *
	 */
	function showToolTipHelp() {
		var link = tip.triggerElement;
		if (!link) {
			return false;
		}
		var table = link.getAttribute('data-table');
		var field = link.getAttribute('data-field');
		var key = table + '.' + field;
		var response = cshHelp.key(key);
		tip.target = tip.triggerElement;
		if (response) {
			updateTip(response);
		} else {
				// If a table is defined, use ExtDirect call to get the tooltip's content
			if (table) {
				var description = '';
				if (typeof(top.TYPO3.LLL) !== 'undefined') {
					description = top.TYPO3.LLL.core.csh_tooltip_loading;
				} else if (opener && typeof(opener.top.TYPO3.LLL) !== 'undefined') {
					description = opener.top.TYPO3.LLL.core.csh_tooltip_loading;
				}

					// Clear old tooltip contents
				updateTip({
					description: description,
					cshLink: '',
					moreInfo: '',
					title: ''
				});
					// Load content
				TYPO3.CSH.ExtDirect.getTableContextHelp(table, function(response, options) {
					Ext.iterate(response, function(key, value){
						cshHelp.add(value);
						if (key === field) {
							updateTip(value);
								// Need to re-position because the height may have increased
							tip.show();
						}
					});
				}, this);

				// No table was given, use directly title and description
			} else {
				updateTip({
					description: link.getAttribute('data-description'),
					cshLink: '',
					moreInfo: '',
					title: link.getAttribute('data-title')
				});
			}
		}
	}

	/**
	 * Update tooltip message
	 *
	 * @param {Object} response
	 */
	function updateTip(response) {
		tip.body.dom.innerHTML = response.description;
		tip.cshLink = response.id;
		tip.moreInfo = response.moreInfo;
		if (tip.moreInfo) {
			tip.addClass('tipIsLinked');
		}
		tip.setTitle(response.title);
		tip.doAutoWidth();
	}

	return {
		/**
		 * Constructor
		 */
		init: function() {
			tip = new Ext.ToolTip({
				title: 'CSH', // needs a title for init because of the markup
				html: '',
					// The tooltip will appear above the label, if viewport allows
				anchor: 'bottom',
				minWidth: 160,
				maxWidth: 240,
				target: Ext.getBody(),
				delegate: 'span.t3-help-link',
				renderTo: Ext.getBody(),
				cls: 'typo3-csh-tooltip',
				shadow: false,
				dismissDelay: 0, // tooltip stays while mouse is over target
				autoHide: true,
				showDelay: 1000, // show after 1 second
				hideDelay: 300, // hide after 0.3 seconds
				closable: true,
				isMouseOver: false,
				listeners: {
					beforeshow: showToolTipHelp,
					render: function(tip) {
						tip.body.on({
							'click': {
								fn: function(event) {
									event.stopEvent();
									if (tip.moreInfo) {
										try {
											top.TYPO3.ContextHelpWindow.open(tip.cshLink);
										} catch(e) {
											// do nothing
										}
									}
									tip.hide();
								}
							}
						});
						tip.el.on({
							'mouseover': {
								fn: function() {
									if (tip.moreInfo) {
										tip.isMouseOver = true;
									}
								}
							},
							'mouseout': {
								fn: function() {
									if (tip.moreInfo) {
										tip.isMouseOver = false;
										tip.hide.defer(tip.hideDelay, tip, []);
									}
								}
							}
						});
					},
					hide: function(tip) {
						tip.setTitle('');
						tip.body.dom.innerHTML = '';
					},
					beforehide: function(tip) {
						return !tip.isMouseOver;
					},
					scope: this
				}
			});

			Ext.getBody().on({
				'keydown': {
					fn: function() {
						tip.hide();
					}
				},
				'click': {
					fn: function() {
						tip.hide();
					}
				}
			});

			/**
			 * Adds a sequence to Ext.TooltTip::showAt so as to increase vertical offset when anchor position is 'botton'
			 * This positions the tip box closer to the target element when the anchor is on the bottom side of the box
			 * When anchor position is 'top' or 'bottom', the anchor is pushed slightly to the left in order to align with the help icon, if any
			 *
			 */
			Ext.ToolTip.prototype.showAt = Ext.ToolTip.prototype.showAt.createSequence(
				function() {
					var ap = this.getAnchorPosition().charAt(0);
					if (this.anchorToTarget && !this.trackMouse) {
						switch (ap) {
							case 'b':
								var xy = this.getPosition();
								this.setPagePosition(xy[0]-10, xy[1]+5);
								break;
							case 't':
								var xy = this.getPosition();
								this.setPagePosition(xy[0]-10, xy[1]);
								break;
						}
					}
				}
			);

		},

		/**
		 * Opens the help window, triggered from click event handler
		 *
		 * @param {Event} event
		 * @param {Node} link
		 */
		openHelpWindow: function(event, link) {
			var id = link.getAttribute('data-table') + '.' + link.getAttribute('data-field');
			event.stopEvent();
			top.TYPO3.ContextHelpWindow.open(id);
		}
	}
}();

/**
 * Calls the init on Ext.onReady
 */
Ext.onReady(TYPO3.ContextHelp.init, TYPO3.ContextHelp);

/***************************************************************
 *  Copyright notice
 *
 *  (c) 2010-2011 Steffen Kamper <info@sk-typo3.de>
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

/**
 * Flashmessage rendered by ExtJS
 *
 *
 * @author Steffen Kamper <info@sk-typo3.de>
 */
Ext.ns('TYPO3');

/**
 * Object for named severities
 */
TYPO3.Severity = {
	notice: 0,
	information: 1,
	ok: 2,
	warning: 3,
	error: 4
};

/**
 * @class TYPO3.Flashmessage
 * Passive popup box singleton
 * @singleton
 *
 * Example (Information message):
 * TYPO3.Flashmessage.display(1, 'TYPO3 Backend - Version 4.4', 'Ready for take off', 3);
 */
TYPO3.Flashmessage = function() {
	var messageContainer;
	var severities = ['notice', 'information', 'ok', 'warning', 'error'];

	function createBox(severity, title, message) {
		return ['<div class="typo3-message message-', severity, '" style="width: 400px">',
				'<div class="t3-icon t3-icon-actions t3-icon-actions-message t3-icon-actions-message-close t3-icon-message-' + severity + '-close"></div>',
				'<div class="header-container">',
				'<div class="message-header">', title, '</div>',
				'</div>',
				'<div class="message-body">', message, '</div>',
				'</div>'].join('');
	}

	return {
		/**
		 * Shows popup
		 * @member TYPO3.Flashmessage
		 * @param int severity (0=notice, 1=information, 2=ok, 3=warning, 4=error)
		 * @param string title
		 * @param string message
		 * @param float duration in sec (default 5)
		 */
		display : function(severity, title, message, duration) {
			duration = duration || 5;
			if (!messageContainer) {
				messageContainer = Ext.DomHelper.insertFirst(document.body, {
					id   : 'msg-div',
					style: 'position:absolute;z-index:10000'
				}, true);
			}

			var box = Ext.DomHelper.append(messageContainer, {
				html: createBox(severities[severity], title, message)
			}, true);
			messageContainer.alignTo(document, 't-t');
			box.child('.t3-icon-actions-message-close').on('click',	function (e, t, o) {
				var node;
				node = new Ext.Element(Ext.get(t).findParent('div.typo3-message'));
				node.hide();
				Ext.removeNode(node.dom);
			}, box);
			box.slideIn('t').pause(duration).ghost('t', {remove: true});
		}
	};
}();
