
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
	simplePanelsId: [],
	columnsSubTabConstraintsGrid: null,
	columnsSubTabIndexesGrid: null,
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.columnsGrid = null;
		this.tabs = null;
		this.columnsSubTabConstraintsGrid = null;
		this.columnsSubTabIndexesGrid = null;
		this.simplePanelsId = [
			this.id + '-data-type-tab-content-simple-char-size-panel',
			this.id + '-data-type-tab-content-simple-number-precision-scale-panel',
			this.id + '-data-type-tab-content-simple-char-size-only-panel',
			this.id + '-data-type-tab-content-simple-number-precision-only-panel',
			this.id + '-data-type-tab-content-simple-interval-day-panel',
			this.id + '-data-type-tab-content-simple-interval-year-panel',
			this.id + '-data-type-tab-content-simple-timezone-panel'
		];
	},
	createPanel: function() {
		var that = this;
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
				<div id='` + this.id + `-tabs' style='width: 100%;'></div>
				<div id='` + this.id + `-data-type-tab-content' class='tab_content display_tab_content'>
					<div id='` + this.id + `-data-type-tab-content-selector-panel' style='line-height: 30px;'>
						<input type='radio' id='` + this.id + `-data-type-tab-content-selector-simple-radio' checked name='` + this.id + `-data-type-selector'>Simple</input>
						<input type='radio' id='` + this.id + `-data-type-tab-content-selector-complex-radio' name='` + this.id + `-data-type-selector'>Complex</input>
					</div>
					<div id='` + this.id + `-data-type-tab-content-simple-panel' class='data_type_panel display_data_type_panel'>
						<label for='` + this.id + `-data-type-tab-content-simple-column-type-select'>Column Type:&nbsp;&nbsp;</label>
						<select id='` + this.id + `-data-type-tab-content-simple-column-type-select' style='width: 250px;'>
							<option>VARCHAR2</option>
							<option>NUMBER</option>
							<option>DATE</option>
							<option>CLOB</option>
							<option>BLOB</option>
							<option disabled>──────────</option>
							<option>BFILE</option>
							<option>BINARY_DOUBLE</option>
							<option>BINARY_FLOAT</option>
							<option>BLOB</option>
							<option>CHAR</option>
							<option>CHAR VARYING</option>
							<option>CHARACTER</option>
							<option>CHARACTER VARYING</option>
							<option>CLOB</option>
							<option>DATE</option>
							<option>DEC</option>
							<option>DECIMAL</option>
							<option>DOUBLE PRECISION</option>
							<option>FLOAT</option>
							<option>INT</option>
							<option>INTEGER</option>
							<option>INTERVAL DAY</option>
							<option>INTERVAL YEAR</option>
							<option>LONG</option>
							<option>LONG RAW</option>
							<option>LONG VARCHAR</option>
							<option>NATIONAL CHAR</option>
							<option>NATIONAL CHAR VARYING</option>
							<option>NATIONAL CHARACTER</option>
							<option>NATIONAL CHARACTER VARYING</option>
							<option>NCHAR</option>
							<option>NCHAR VARYING</option>
							<option>NCLOB</option>
							<option>NUMBER</option>
							<option>NUMERIC</option>
							<option>NVARCHAR2</option>
							<option>RAW</option>
							<option>REAL</option>
							<option>ROWID</option>
							<option>SMALLINT</option>
							<option>TIMESTAMP</option>
							<option>UROWID</option>
							<option>VARCHAR</option>
							<option>VARCHAR2</option> 
						</select>
						<div id='` + this.id + `-data-type-tab-content-simple-char-size-panel' class='simple_panel display_simple_panel'>
							<label for='` + this.id + `-data-type-tab-content-simple-char-size-input'>Size:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
							<input id='` + this.id + `-data-type-tab-content-simple-char-size-input' style='width: 250px;' />
							<label for='` + this.id + `-data-type-tab-content-simple-char-unit-select' style='margin-left: 50px;'>Units:</label>
							<select id='` + this.id + `-data-type-tab-content-simple-char-unit-select' style='width: 200px;'>
								<option>--Not Specified--</option>
								<option>BYTE</option>
								<option>CHAR</option>
							</select>
						</div>
						<div id='` + this.id + `-data-type-tab-content-simple-number-precision-scale-panel' style='line-height: 30px;' class='simple_panel'>
							<label for='` + this.id + `-data-type-tab-content-simple-number-precision-input'>Precision:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
							<input id='` + this.id + `-data-type-tab-content-simple-number-precision-input' style='width: 250px;' />
							<label for='` + this.id + `-data-type-tab-content-simple-number-scale-input' style='margin-left: 50px;'>Scale:</label>
							<input id='` + this.id + `-data-type-tab-content-simple-number-scale-input' style='width: 200px;' />
						</div>
						<div id='` + this.id + `-data-type-tab-content-simple-char-size-only-panel' style='line-height: 30px;' class='simple_panel'>
							<label for='` + this.id + `-data-type-tab-content-simple-char-size-only-input'>Size:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
							<input id='` + this.id + `-data-type-tab-content-simple-char-size-only-input' style='width: 250px;' />
						</div>
						<div id='` + this.id + `-data-type-tab-content-simple-number-precision-only-panel' style='line-height: 30px;' class='simple_panel'>
							<label for='` + this.id + `-data-type-tab-content-simple-number-precision-only-input'>Precision:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
							<input id='` + this.id + `-data-type-tab-content-simple-number-precision-only-input' style='width: 250px;' />
						</div>
						<div id='` + this.id + `-data-type-tab-content-simple-interval-day-panel' style='line-height: 30px;' class='simple_panel'>
							<label for='` + this.id + `-data-type-tab-content-simple-interval-day-precision-input'>Day Precision:&nbsp;</label>
							<input id='` + this.id + `-data-type-tab-content-simple-interval-day-precision-input' style='width: 250px;' />
							<label for='` + this.id + `-data-type-tab-content-simple-interval-day-fraction-input' style='margin-left: 10px;'>Fractional Precision:</label>
							<input id='` + this.id + `-data-type-tab-content-simple-interval-day-fraction-input' style='width: 150px;' />
						</div>
						<div id='` + this.id + `-data-type-tab-content-simple-interval-year-panel' style='line-height: 30px;' class='simple_panel'>
							<label for='` + this.id + `-data-type-tab-content-simple-interval-year-precision-input'>Year Precision:&nbsp;</label>
							<input id='` + this.id + `-data-type-tab-content-simple-interval-year-precision-input' style='width: 250px;' />
						</div>
						<div id='` + this.id + `-data-type-tab-content-simple-timezone-panel' class='simple_panel'>
							<label for='` + this.id + `-data-type-tab-content-simple-timezone-precision-input'>Fractional Precision:</label>
							<input id='` + this.id + `-data-type-tab-content-simple-timezone-precision-input' style='width: 250px;' />
							<label for='` + this.id + `-data-type-tab-content-simple-timezone-select' style='margin-left: 40px;'>Time Zone:</label>
							<select id='` + this.id + `-data-type-tab-content-simple-timezone-select' style='width: 150px;'>
								<option>--Not Specified--</option>
								<option>TIME ZONE</option>
								<option>LOCAL TIME ZONE</option>
							</select>
						</div>
					</div>
					<div id='` + this.id + `-data-type-tab-content-complex-panel' class='data_type_panel'>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-data-type-tab-content-complex-schema-select'>Schema:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
							<select id='` + this.id + `-data-type-tab-content-complex-schema-select' style='width: 250px;'>
								<option>SYS</option>
							</select>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-data-type-tab-content-complex-column-type-select'>Column Type:</label>
							<select id='` + this.id + `-data-type-tab-content-complex-column-type-select' style='width: 250px;'>
								<option>ANYDATA</option>
								<option>ANYDATASET</option>
								<option>ANYTYPE</option>
								<option>DBURITYPE</option>
								<option>HTTPURITYPE</option>
								<option>URITYPE</option>
								<option>XDBURITYPE</option>
								<option>XMLTYPE</option>
							</select>
						</div>
					</div>
				</div>
				<div id='` + this.id + `-constraints-tab-content' class='tab_content'>
					<div id='` + this.id + `-constraints-tab-content-grid' style='width: 100%; height: 100%;'></div>
				</div>
				<div id='` + this.id + `-indexes-tab-content' class='tab_content'>
					<div id='` + this.id + `-indexes-tab-content-grid' style='width: 100%; height: 100%;'></div>
				</div>
				<div id='` + this.id + `-lob-parameters-tab-content' class='tab_content'>
					LOB Params
				</div>
				<div id='` + this.id + `-identity-column-tab-content' class='tab_content'>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-identity-column-tab-content-type-select'>Type:&nbsp;&nbsp;&nbsp;</label>
						<select id='` + this.id + `-identity-column-tab-content-type-select' style='width: 250px;'>
							<option>None</option>
							<option>Column Sequence</option>
						</select>
					</div>
				</div>
			`;
			this.layout.content('bottom', tabsHtml);

			$j('[name=' + this.id + '-data-type-selector]').on('click', function() {
				if(this.id === that.id + '-data-type-tab-content-selector-simple-radio') {
					$j('#' + that.id + '-data-type-tab-content-complex-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-simple-panel').addClass('display_data_type_panel');
				} else {
					$j('#' + that.id + '-data-type-tab-content-simple-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-complex-panel').addClass('display_data_type_panel');
				}
			});

			$j('#' + this.id + '-data-type-tab-content-simple-column-type-select').on('change', function(){
				if(this.value === 'CHAR' || this.value === 'CHAR VARYING' 
					|| this.value === 'CHARACTER' || this.value === 'CHARACTER VARYING'
					|| this.value === 'VARCHAR' || this.value === 'VARCHAR2') {
					that.changeSimplePanel('CHAR');
				} else if(this.value === 'NUMBER' || this.value === 'DEC' 
					|| this.value === 'DECIMAL' || this.value === 'NUMERIC') {
					that.changeSimplePanel('NUMBER');
				} else if(this.value === 'NATIONAL CHAR' || this.value === 'NATIONAL CHAR VARYING' 
					|| this.value === 'NATIONAL CHARACTER' || this.value === 'NATIONAL CHARACTER VARYING'
					|| this.value === 'NCHAR' || this.value === 'NCHAR VARYING' || this.value === 'NVARCHAR2'
					|| this.value === 'RAW' || this.value === 'UROWID') {
					that.changeSimplePanel('CHAR_SIZE_ONLY');
				} else if(this.value === 'FLOAT') {
					that.changeSimplePanel('NUMBER_PRECISION_ONLY');
				} else if(this.value === 'INTERVAL DAY') {
					that.changeSimplePanel('INTERVAL_DAY');
				} else if(this.value === 'INTERVAL YEAR') {
					that.changeSimplePanel('INTERVAL_YEAR');
				} else if(this.value === 'TIMESTAMP') {
					that.changeSimplePanel('TIMEZONE');
				} else {
					that.changeSimplePanel('NONE');
				}
			});

			this.tabs =	$j('#' + this.id + '-tabs').w2tabs({
									name: this.id + '-tabs',
									active: this.id + '-data-type-tab',
									tabs: [
										{id: this.id + '-data-type-tab', text: 'Data Type'},
										{id: this.id + '-constraints-tab', text: 'Constraints'},
										{id: this.id + '-indexes-tab', text: 'Indexes'},
										{id: this.id + '-lob-parameters-tab', text: 'LOB Parameters'},
										{id: this.id + '-identity-column-tab', text: 'Identity Column'}
									],
									onClick: function(event) {
										that.changeColumnsSubTab(event.target);
									}
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
	changeColumnsSubTab: function(id) {
		w2ui[this.id + '-tabs'].tabs.forEach(function(tab) {
			$j('#' + tab.id + '-content').removeClass('display_tab_content');
		});
		$j('#' + id + '-content').addClass('display_tab_content');
		if(id === this.id + '-constraints-tab') {
			this.createColumnsSubTabConstraintsGrid();
		} else if(id === this.id + '-indexes-tab') {
			this.createColumnsSubTabIndexesGrid();
		}
	},
	createColumnsSubTabConstraintsGrid: function() {
		if(this.columnsSubTabConstraintsGrid === null) {
			this.columnsSubTabConstraintsGrid = $j('#' + this.id + '-constraints-tab-content-grid').w2grid({
													name: this.id + '-constraints-tab-content-properties',
													header: 'Constraints on Column',
																				show: { header: true,
																				      toolbar: false,
																				      lineNumbers: false
																				    },
																				columns: [
																					{field: 'constraintName', caption: 'Constraint Name', size: '200px'},
																					{field: 'constraintType', caption: 'Constraint Type', size: '300px'},
																					{field: 'otherColumns', caption: 'Other Columns', size: '100%'}
																				]
												});
		}
	},
	createColumnsSubTabIndexesGrid: function() {
		if(this.columnsSubTabIndexesGrid === null) {
			this.columnsSubTabIndexesGrid = $j('#' + this.id + '-indexes-tab-content-grid').w2grid({
													name: this.id + '-indexes-tab-content-properties',
													header: 'Indexes on Column',
																				show: { header: true,
																				      toolbar: false,
																				      lineNumbers: false
																				    },
																				columns: [
																					{field: 'indexName', caption: 'Index Name', size: '200px'},
																					{field: 'indexType', caption: 'Index Type', size: '300px'},
																					{field: 'otherColumns', caption: 'Other Columns', size: '100%'}
																				]
												});
		}
	},
	changeSimplePanel: function(dataType) {
		this.simplePanelsId.forEach(function(panelId) {
			$j('#' + panelId).removeClass('display_simple_panel');
		});

		if(dataType === 'CHAR') {
			$j('#' + this.simplePanelsId[0]).addClass('display_simple_panel');
		} else if(dataType === 'NUMBER') {
			$j('#' + this.simplePanelsId[1]).addClass('display_simple_panel');
		} else if(dataType === 'CHAR_SIZE_ONLY') {
			$j('#' + this.simplePanelsId[2]).addClass('display_simple_panel');
		} else if(dataType === 'NUMBER_PRECISION_ONLY') {
			$j('#' + this.simplePanelsId[3]).addClass('display_simple_panel');
		} else if(dataType === 'INTERVAL_DAY') {
			$j('#' + this.simplePanelsId[4]).addClass('display_simple_panel');
		} else if(dataType === 'INTERVAL_YEAR') {
			$j('#' + this.simplePanelsId[5]).addClass('display_simple_panel');
		} else if(dataType === 'TIMEZONE') {
			$j('#' + this.simplePanelsId[6]).addClass('display_simple_panel');
		}
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
		if(this.columnsSubTabConstraintsGrid !== null) {
			this.columnsSubTabConstraintsGrid.destroy();
		}
		if(this.columnsSubTabIndexesGrid !== null) {
			this.columnsSubTabIndexesGrid.destroy();
		}
	}
});