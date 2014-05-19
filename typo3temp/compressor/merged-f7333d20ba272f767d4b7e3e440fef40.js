
/**
 * A JavaScript object to handle, edit, draw and export a grid. The grid is basically
 * a table with some colspan and rowspan. Each cell can additionally hold a name and
 * column.
 *
 * @author Thomas Hempel <thomas@typo3.org>
 */
Ext.namespace('TYPO3.Backend.t3Grid');

TYPO3.Backend.t3Grid = Ext.extend(Ext.Component, {

	constructor: function(config) {

		config = Ext.apply({
			colCount: config.colCount,
			rowCount: config.rowCount,
			data: config.data,
			nameLabel: config.nameLabel,
			columnLabel: config.columnLabel,
			targetElement: config.targetElement
		}, config);

		TYPO3.Backend.t3Grid.superclass.constructor.call(this, config);
	},

	/**
	 * Adds a row below the grid
	 */
	addRow: function() {
		var newRow = [];
		for (var i = 0; i < this.colCount; i++) {
			newRow[i] = {spanned:false,rowspan:1,colspan:1};
		}
		this.data.push(newRow);
		this.rowCount++;
	},

	/**
	 * Removes the last row of the grid and adjusts all cells that might be effected
	 * by that change. (Removing colspans)
	 *
	 * @returns void
	 */
	removeRow: function() {
		if (this.rowCount <= 1) return false;
		var newData = [];
		for (var rowIndex = 0; rowIndex < this.rowCount - 1; rowIndex++) {
			newData.push(this.data[rowIndex]);
		}

		// fix rowspan in former last row
		for (var colIndex = 0; colIndex < this.colCount; colIndex++) {
			if (this.data[this.rowCount - 1][colIndex].spanned == true) {
				this.findUpperCellWidthRowspanAndDecreaseByOne(colIndex, this.rowCount - 1);
			}
		}

		this.data = newData;
		this.rowCount--;
	},

	/**
	 * Takes a cell and looks above it if there are any cells that have colspans that
	 * spanns into the given cell. This is used when a row was removed from the grid
	 * to make sure that no cell with wrong colspans exists in the grid.
	 *
	 * @param col integer
	 * @param row integer
	 * @return void
	 */
	findUpperCellWidthRowspanAndDecreaseByOne: function(col, row) {
		var upperCell = this.getCell(col, row - 1);
		if (!upperCell) return false;

		if (upperCell.spanned == true) {
			this.findUpperCellWidthRowspanAndDecreaseByOne(col, row - 1);
		} else {
			if (upperCell.rowspan > 1) {
				this.removeRowspan(col, row - 1);
			}
		}
	},

	/**
	 * Removes the outermost right column from the grid.
	 *
	 * @return void
	 */
	removeColumn: function() {
		if (this.colCount <= 1) return false;
		var newData = [];

		for (var rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
			var newRow = [];
			for (colIndex = 0; colIndex < this.colCount - 1; colIndex++) {
				newRow.push(this.data[rowIndex][colIndex]);
			}
			if (this.data[rowIndex][this.colCount - 1].spanned == true) {
				this.findLeftCellWidthColspanAndDecreaseByOne(this.colCount - 1, rowIndex);
			}
			newData.push(newRow);
		}

		this.data = newData;
		this.colCount--;
	},

	/**
	 * Checks if there are any cells on the left side of a given cell with a
	 * rowspan that spans over the given cell.
	 *
	 * @param col integer
	 * @param row integer
	 * @return void
	 */
	findLeftCellWidthColspanAndDecreaseByOne: function(col, row) {
		var leftCell = this.getCell(col - 1, row);
		if (!leftCell) return false;

		if (leftCell.spanned == true) {
			this.findLeftCellWidthColspanAndDecreaseByOne(col - 1, row);
		} else {
			if (leftCell.colspan > 1) {
				this.removeColspan(col - 1, row);
			}
		}
	},

	/**
	 * Adds a column at the right side of the grid.
	 *
	 * @return void
	 */
	addColumn: function() {
		for (var rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
			this.data[rowIndex].push({
				spanned: false,
				rowspan: 1,
				colspan: 1,
				name: this.colCount + 'x' + rowIndex
			});
		}
		this.colCount++;
	},

	/**
	 * Draws the grid as table into a given container.
	 * It also adds all needed links and bindings to the cells to make it editable.
	 *
	 * @return void
	 */
	drawTable: function() {
		var domHelper = Ext.DomHelper;
		var newTable = {
			tag: 'table',
			children: [],
			id: 'base',
			border: '0',
			width: '100%',
			height: '100%',
			cls: 'editor',
			cellspacing: '0',
			cellpadding: '0'
		};

		var colgroups = {
			tag: 'colgroup',
			children: []
		};
		for (var col = 0; col < this.colCount; col++) {
			colgroups.children.push({
				tag: 'col',
				style: 'width:' + parseInt(100 / this.colCount, 10) + '%'
			});
		}
		newTable.children.push(colgroups);

		for (var row = 0; row < this.rowCount; row++) {
			var rowData = this.data[row];
			if (rowData.length == 0) continue;

			var rowSpec = {tag: 'tr', children:[]};

			for (var col = 0; col < this.colCount; col++) {
				var cell = this.data[row][col];
				if (cell.spanned == true) {
					continue;
				}

				var cellHtml = '<div class="cell_container"><a class="link_editor" id="e_'
						+ col + '_' + row + '" title="' + TYPO3.l10n.localize('editCell') + '" href="#"><!-- --></a>';
				if (this.cellCanSpanRight(col, row)) {
					cellHtml += '<a href="#" id="r_'
						+ col + '_' + row + '" title="' + TYPO3.l10n.localize('mergeCell') + '" class="link_expand_right"><!-- --></a>';
				}
				if (this.cellCanShrinkLeft(col, row)) {
					cellHtml += '<a href="#" id="l_'
						+ col + '_' + row + '" title="' + TYPO3.l10n.localize('splitCell') + '" class="link_shrink_left"><!-- --></a>';
				}
				if (this.cellCanSpanDown(col, row)) {
					cellHtml += '<a href="#" id="d_'
						+ col + '_' + row + '" title="' + TYPO3.l10n.localize('mergeCell') + '" class="link_expand_down"><!-- --></a>';
				}
				if (this.cellCanShrinkUp(col, row)) {
					cellHtml += '<a href="#" id="u_'
						+ col + '_' + row + '" title="' + TYPO3.l10n.localize('splitCell') + '" class="link_shrink_up"><!-- --></a>';
				}
				cellHtml += '</div>';

				cellHtml += '<div class="cell_data">' + TYPO3.l10n.localize('name') + ': ' + (cell.name ? cell.name : TYPO3.l10n.localize('notSet'))
						+ '<br />' + TYPO3.l10n.localize('column') + ': '
						+ (cell.column === undefined ? TYPO3.l10n.localize('notSet') : parseInt(cell.column, 10)) + '</div>';

				// create cells
				var child = {
					tag: 'td',
					height: parseInt(100 / this.rowCount, 10) * cell.rowspan + '%',
					width: parseInt(100 / this.colCount, 10) * cell.colspan + '%',
					html: cellHtml
				};
				if (cell.colspan > 1) {
					child.colspan = cell.colspan;
				}
				if (cell.rowspan > 1) {
					child.rowspan = cell.rowspan;
				}
				rowSpec.children.push(child);
			}

			newTable.children.push(rowSpec);

		}

		domHelper.overwrite(Ext.Element.get(this.targetElement), newTable);
		this.bindLinks();
	},

	/**
	 * Sets the name of a certain grid element.
	 *
	 * @param newName string
	 * @param col integer
	 * @param row integer
	 *
	 * @return boolean
	 */
	setName: function(newName, col, row) {
		var cell = this.getCell(col, row);
		if (!cell) return false;
		cell.name = newName;
		return true;
	},

	/**
	 * Sets the column field for a certain grid element. This is NOT the column of the
	 * element itself.
	 *
	 * @param newColumn integer
	 * @param col integer
	 * @param row integer
	 *
	 * @return boolean
	 */
	setColumn: function(newColumn, col, row) {
		var cell = this.getCell(col, row);
		if (!cell) return false;
		cell.column = newColumn;
		return true;
	},

	/**
	 * Searches for all a tags with certain classes and binds some actions to them.
	 *
	 * @return void
	 */
	bindLinks: function() {
		for (var row = 0; row < this.rowCount; row++) {
			for (var col = 0; col < this.colCount; col++) {
				// span right
				var el = Ext.Element.get('r_' + col + '_' + row);
				if (el) {
					el.addListener('click', function(e, sender, params) {
						this.addColspan(params.colIndex, params.rowIndex);
						this.drawTable();
					}, this, {stopEvent:true, colIndex:col, rowIndex:row});
				}

				// reduce to left
				var el = Ext.Element.get('l_' + col + '_' + row);
				if (el) {
					el.addListener('click', function(e, sender, params) {
						this.removeColspan(params.colIndex, params.rowIndex);
						this.drawTable();
					}, this, {stopEvent:true, colIndex:col, rowIndex:row});
				}

				// span down
				var el = Ext.Element.get('d_' + col + '_' + row);
				if (el) {
					el.addListener('click', function(e, sender, params) {
						this.addRowspan(params.colIndex, params.rowIndex);
						this.drawTable();
					}, this, {stopEvent:true, colIndex:col, rowIndex:row});
				}

				// reduce up
				var el = Ext.Element.get('u_' + col + '_' + row);
				if (el) {
					el.addListener('click', function(e, sender, params) {
						this.removeRowspan(params.colIndex, params.rowIndex);
						this.drawTable();
					}, this, {stopEvent:true, colIndex:col, rowIndex:row});
				}

				// edit
				var el = Ext.Element.get('e_' + col + '_' + row);
				if (el) {
					el.addListener('click', function(e, sender, params) {
						this.showOptions(sender, params.colIndex, params.rowIndex);
					}, this, {stopEvent:true, colIndex:col, rowIndex:row});
				}
			}
		}
	},

	/**
	 * Creates an ExtJs Window with two input fields and shows it. On save, the data
	 * is written into the grid element.
	 *
	 * @param sender DOM-object (the link)
	 * @param col integer
	 * @param row integer
	 */
	showOptions: function(sender, col, row) {
		var win;
		sender = Ext.get('base');
		var cell = this.getCell(col, row);
		if (!cell) return false;

		if (!win) {
			var fieldName = new Ext.form.TextField({
				fieldLabel: TYPO3.l10n.localize('name'),
				name: 'name',
				width: 270,
				value: cell.name,
				tabIndex: 1,
				listeners: {
					render: function(c) {
						Ext.QuickTips.register({
							target: c,
							text: TYPO3.l10n.localize('nameHelp')
						});
					}
				}
			});

			var fieldColumn = new Ext.form.NumberField({
				fieldLabel: TYPO3.l10n.localize('column'),
				name: 'column',
				width: 50,
				value: cell.column,
				tabIndex: 2,
				listeners: {
					render: function(c) {
						Ext.QuickTips.register({
							target: c,
							text: TYPO3.l10n.localize('columnHelp')
						});
					}
				}
			});

			win = new Ext.Window({
				layout: 'fit',
				title: TYPO3.l10n.localize('title'),
				width: 400,
				modal: true,
				closable: true,
				resizable: false,

				items: [
					{
						xtype: 'fieldset',
						autoHeight: true,
						autoWidth: true,
						labelWidth: 100,
						border: false,

						items: [fieldName, fieldColumn]
					}
				],

				buttons: [
					{
						iconCls:'save',
						text: TYPO3.l10n.localize('save'),
						handler: function(fieldName, fieldColumn, col, row) {
							t3Grid.setName(fieldName.getValue(), col, row);
							t3Grid.setColumn(fieldColumn.getValue(), col, row);
							win.close();
							t3Grid.drawTable();
						}.createDelegate(this, [fieldName, fieldColumn, col, row])
					}
				]
			});
		}
		win.show(this);
	},

	/**
	 * Returns a cell element from the grid.
	 *
	 * @param col integer
	 * @param row integer
	 * return Object
	 */
	getCell: function(col, row) {
		if (col > this.colCount - 1) return false;
		if (row > this.rowCount - 1) return false;
		return this.data[row][col];
	},

	/**
	 * Checks wether a cell can span to the right or not. A cell can span to the right
	 * if it is not in the last column and if there is no cell beside it that is
	 * already overspanned by some other cell.
	 *
	 * @param col integer
	 * @param row integer
	 *
	 * @return boolean
	 */
	cellCanSpanRight: function(col, row) {
		if (col == this.colCount - 1) {
			return false;
		}

		var cell = this.getCell(col, row);
		if (cell.rowspan > 1) {
			for (var rowIndex = row; rowIndex < row + cell.rowspan; rowIndex++) {
				var checkCell = this.getCell(col + cell.colspan, rowIndex);
				if (!checkCell || checkCell.spanned == true || checkCell.colspan > 1 || checkCell.rowspan > 1) {
					return false;
				}
			}
		} else {
			var checkCell = this.getCell(col + cell.colspan, row);
			if (!checkCell || cell.spanned == true || checkCell.spanned == true || checkCell.colspan > 1 || checkCell.rowspan > 1) {
				return false;
			}
		}

		return true;
	},

	/**
	 * Checks wether a cell can span down or not.
	 *
	 * @param col integer
	 * @param row integer
	 *
	 * @return boolean
	 */
	cellCanSpanDown: function(col, row) {
		if (row == this.rowCount - 1) {
			return false;
		}

		var cell = this.getCell(col, row);
		if (cell.colspan > 1) {
			// we have to check all cells on the right side for the complete colspan
			for (var colIndex = col; colIndex < col + cell.colspan; colIndex++) {
				var checkCell = this.getCell(colIndex, row + cell.rowspan);
				if (!checkCell || checkCell.spanned == true || checkCell.colspan > 1 || checkCell.rowspan > 1) {
					return false;
				}
			}
		} else {
			var checkCell = this.getCell(col, row + cell.rowspan);
			if (!checkCell || cell.spanned == true || checkCell.spanned == true || checkCell.colspan > 1 || checkCell.rowspan > 1) {
				return false;
			}
		}

		return true;
	},

	/**
	 * Checks if a cell can shrink to the left. It can shrink if the colspan of the
	 * cell is bigger than 1.
	 *
	 * @param col integr
	 * @param row integer
	 *
	 * @return boolean
	 */
	cellCanShrinkLeft: function(col, row) {
		return (this.data[row][col].colspan > 1);
	},

	/**
	 * Returns if a cell can shrink up. This is the case if a cell has at least
	 * a rowspan of 2.
	 *
	 * @param col integr
	 * @param row integer
	 *
	 * @return boolean
	 */
	cellCanShrinkUp: function(col, row) {
		return (this.data[row][col].rowspan > 1);
	},

	/**
	 * Adds a colspan to a grid element.
	 *
	 * @param col integr
	 * @param row integer
	 */
	addColspan: function(col, row) {
		var cell = this.getCell(col, row);
		if (!cell || !this.cellCanSpanRight(col, row)) return false;

		for (var rowIndex = row; rowIndex < row + cell.rowspan; rowIndex++) {
			this.data[rowIndex][col + cell.colspan].spanned = true;
		}
		cell.colspan += 1;
	},

	/**
	 * Adds a rowspan to grid element.
	 *
	 * @param col integr
	 * @param row integer
	 *
	 * @return void
	 */
	addRowspan: function(col, row) {
		var cell = this.getCell(col, row);
		if (!cell || !this.cellCanSpanDown(col, row)) return false;

		for (var colIndex = col; colIndex < col + cell.colspan; colIndex++) {
			this.data[row + cell.rowspan][colIndex].spanned = true;
		}
		cell.rowspan += 1;
	},

	/**
	 * Removes a colspan from a grid element.
	 *
	 * @param col integr
	 * @param row integer
	 *
	 * @return void
	 */
	removeColspan: function(col, row) {
		var cell = this.getCell(col, row);
		if (!cell || !this.cellCanShrinkLeft(col, row)) return false;

		cell.colspan -= 1;
		for (var rowIndex = row; rowIndex < row + cell.rowspan; rowIndex++) {
			this.data[rowIndex][col + cell.colspan].spanned = false;
		}
	},

	/**
	 * Removes a rowspan from a grid element.
	 *
	 * @param col integr
	 * @param row integer
	 *
	 * @return void
	 */
	removeRowspan: function(col, row) {
		var cell = this.getCell(col, row);
		if (!cell || !this.cellCanShrinkUp(col, row)) return false;

		cell.rowspan -= 1;
		for (var colIndex = col; colIndex < col + cell.colspan; colIndex++) {
			this.data[row + cell.rowspan][colIndex].spanned = false;
		}
	},

	/**
	 * Exports the current grid to a TypoScript notation that can be read by the
	 * page module and is human readable.
	 *
	 * @return string
	 */
	export2LayoutRecord: function() {
		var result = "backend_layout {\n\tcolCount = " + this.colCount + "\n\trowCount = " + this.rowCount + "\n\trows {\n";
		for (var row = 0; row < this.rowCount; row++) {
			result += "\t\t" + (row + 1) + " {\n";
			result += "\t\t\tcolumns {\n";
			colIndex = 0;
			for (var col = 0; col < this.colCount; col++) {
				var cell = this.getCell(col, row);
				if (cell && !cell.spanned) {
					colIndex++;
					result += "\t\t\t\t" + (colIndex) + " {\n";
					result += "\t\t\t\t\tname = " + ((!cell.name) ? col + "x" + row : cell.name) + "\n";
					if (cell.colspan > 1) result += "\t\t\t\t\tcolspan = " + cell.colspan + "\n";
					if (cell.rowspan > 1) result += "\t\t\t\t\trowspan = " + cell.rowspan + "\n";
					if (typeof(cell.column) === 'number') result += "\t\t\t\t\tcolPos = " + cell.column + "\n";
					result += "\t\t\t\t}\n";
				}

			}
			result += "\t\t\t}\n";
			result += "\t\t}\n";
		}

		result += "\t}\n}\n";
		return result;
	}
});

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
