
/**
 * ColumnsPanelUI: This class provides the user interface to edit the columns
 * of an given table
 * @constructor
 * @param {String} id: A unique identifier to create HTML contents
 * @param {String} label: A label to be shown on the required widgets
 */
var ColumnsPanelUI = Class.create({
	id: null,
	label: null,
	layout: null,
	columnsGrid: null,
	tabs: null,
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.columnsGrid = null;
		this.tabs = null;
	},
	createPanel: function() {
		if(this.layout === null) {
			this.layout = $j('#' + this.id).w2layout({
													name: this.id,
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' },
											            { type: 'bottom', size: 200, resizable: true, style: pstyle, content: 'bottom' }
											        ]
												});

			this.columnsGrid = $j().w2grid({
											name: this.id + '-grid',
											header: this.label + ' - Columns',
											show: { header: true,
											      toolbar: true,
											      lineNumbers: true
											    },
											columns: [
												{field: 'pk', caption: 'PK', size: '30px'},
												{field: 'columnName', caption: 'Column Name', size: '100px'},
												{field: 'dataType', caption: 'Data Type', size: '80px'},
												{field: 'size', caption: 'Size', size: '50px'},
												{field: 'notNull', caption: 'Not Null', size: '70px'},
												{field: 'default', caption: 'Default', size: '70px'},
												{field: 'comments', caption: 'Comments', size: '100%'}
											],
											toolbar: {
												items: [
													{type: 'break'},
													{id: this.id + '-grid-toolbar-add-column', type: 'button', caption: 'Add', icon: 'add_icon'},
													{id: this.id + '-grid-toolbar-drop-column', type: 'button', caption: 'Drop', icon: 'delete_icon'},
													{id: this.id + '-grid-toolbar-copy-column', type: 'button', caption: 'Copy', icon: 'copy_icon'}
												]
											}
										});
			this.layout.content('main', this.columnsGrid);

			var tabsHtml = `
				<div id="` + this.id + `-tabs" style="width: 100%;"></div>
				<div id="` + this.id + `-tab-content" style="padding: 10px 0px">tab1</div>
			`;
			this.layout.content('bottom', tabsHtml);

			this.tabs =	$j('#' + this.id + '-tabs').w2tabs({
									name: this.id + '-tabs',
									active: this.id + '-data-type-tab',
									tabs: [
										{id: this.id + '-data-type-tab', text: 'Data Type'},
										{id: this.id + '-constraints-tab', text: 'Constraints'},
										{id: this.id + '-indexes-tab', text: 'Indexes'},
										{id: this.id + '-lob-parameters-tab', text: 'LOB Parameters'},
										{id: this.id + '-identity-column-tab', text: 'Identity Column'}
									]
								});
		}
	},
	isPanelCreated: function() {
		if(this.layout === null) {
			return false;
		} else {
			return true;
		}
	},
	getPanel: function() {
		return this.layout;
	},
	getColumnsGrid: function() {
		return this.columnsGrid;
	},
	getTabs: function() {
		return this.tabs;
	},
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
		if(this.columnsGrid !== null) {
			this.columnsGrid.destroy();
		}
		if(this.tabs !== null) {
			this.tabs.destroy();
		}
	}
});