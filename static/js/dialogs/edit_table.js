
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
	constraintsGrid: null,
	indexesGrid: null,
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.columnsGrid = null;
		this.tabs = null;
		this.constraintsGrid = null;
		this.indexesGrid = null;
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
			var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
			this.layout = $j('#' + this.id).w2layout({
													name: this.id,
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' },
											            { type: 'bottom', size: 210, resizable: true, style: pstyle, content: 'bottom' }
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
						<input type='radio' id='` + this.id + `-data-type-tab-content-selector-virtual-radio' name='` + this.id + `-data-type-selector'>Virtual</input>
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
					<div id='` + this.id + `-data-type-tab-content-virtual-panel' class='data_type_panel'>
						<div>
							<label for='` + this.id + `-data-type-tab-content-virtual-expression-input' style='vertical-align: top;'>Virtual Expression:</label>
							<textarea id='` + this.id + `-data-type-tab-content-virtual-expression-input' style='width: 520px; height: 50px; margin-top: 5px;' />
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-data-type-tab-content-virtual-column-type-select'>Column Type:</label>
							<select id='` + this.id + `-data-type-tab-content-virtual-column-type-select' style='margin-left: 30px;'>
								<option>--Derived--</option>
								<option disabled>──────────</option>
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
					<div style='line-height: 30px;' class="wrap-collabsible">
						<input id='` + this.id + `-lob-parameters-tab-content-define-check' class='toggle' type='checkbox'>
  						<label for='` + this.id + `-lob-parameters-tab-content-define-check' class='lbl-toggle'>Define LOB Parameters</label>
  						<div class='collapsible-content'>
  							<div class='content-inner'>
								<div>
									<label for='` + this.id + `-lob-parameters-tab-content-segment-name-input'>LOB Segment Name:</label>
									<input id='` + this.id + `-lob-parameters-tab-content-segment-name-input' />
									<label for='` + this.id + `-lob-parameters-tab-content-storage-in-row-select' style='margin-left: 40px;'>Storage In Row:</label>
									<select id='` + this.id + `-lob-parameters-tab-content-storage-in-row-select' style='width: 180px;'>
										<option>--Not Specified--</option>
										<option>Enabled</option>
										<option>Disabled</option>
									</select>
								</div>
								<div>
									<label for='` + this.id + `-lob-parameters-tab-content-chunk-input'>Chunk:</label>
									<input id='` + this.id + `-lob-parameters-tab-content-chunk-input' style='margin-left: 82px;' />
									<label for='` + this.id + `-lob-parameters-tab-content-pct-version-input' style='margin-left: 40px;'>Pct Version:</label>
									<input id='` + this.id + `-lob-parameters-tab-content-pct-version-input' style='margin-left: 28px; width: 180px;'/>
								</div>
								<div>
									<label for='` + this.id + `-lob-parameters-tab-content-freepools-input'>FreePools:</label>
									<input id='` + this.id + `-lob-parameters-tab-content-freepools-input' style='margin-left: 62px;'/>
									<input type='checkbox' id='` + this.id + `-lob-parameters-tab-content-retention' style='margin-left: 40px;'>Retention</input>
								</div>
								<div>
									<label for='` + this.id + `-lob-parameters-tab-content-cache-select'>Cache:</label>
									<select id='` + this.id + `-lob-parameters-tab-content-cache-select' style='margin-left: 83px; width: 173px;'>
										<option>--Not Specified--</option>
										<option>CACHE</option>
									</select>
								</div>
							</div>
						</div>
					</div>
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
					$j('#' + that.id + '-data-type-tab-content-virtual-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-simple-panel').addClass('display_data_type_panel');
				} else if(this.id === that.id + '-data-type-tab-content-selector-complex-radio') {
					$j('#' + that.id + '-data-type-tab-content-simple-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-virtual-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-complex-panel').addClass('display_data_type_panel');
				} else {
					$j('#' + that.id + '-data-type-tab-content-simple-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-complex-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-virtual-panel').addClass('display_data_type_panel');
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
			this.createConstraintsGrid();
		} else if(id === this.id + '-indexes-tab') {
			this.createIndexesGrid();
		}
	},
	createConstraintsGrid: function() {
		if(this.constraintsGrid === null) {
			this.constraintsGrid = $j('#' + this.id + '-constraints-tab-content-grid').w2grid({
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
		} else {
			this.constraintsGrid.refresh();
		}
	},
	getConstraintsGrid: function() {
		return this.constraintsGrid;
	},
	createIndexesGrid: function() {
		if(this.indexesGrid === null) {
			this.indexesGrid = $j('#' + this.id + '-indexes-tab-content-grid').w2grid({
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
		} else {
			this.indexesGrid.refresh();
		}
	},
	getIndexesGrid: function() {
		return this.indexesGrid;
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
		if(this.constraintsGrid !== null) {
			this.constraintsGrid.destroy();
		}
		if(this.indexesGrid !== null) {
			this.indexesGrid.destroy();
		}
	},
	refresh: function() {
		if(this.columnsGrid !== null) {
			this.columnsGrid.refresh();
		}
		if(this.constraintsGrid !== null) {
			this.constraintsGrid.refresh();
		}
		if(this.indexesGrid !== null) {
			this.indexesGrid.refresh();
		}
	}
});

/**
 * ConstraintsPanelUI: This class provides the user interface to edit the constraints
 * of an given table
 * @constructor
 * @param {String} id: A unique identifier to create HTML contents
 * @param {String} label: A label to be shown on the required widgets
 */
var ConstraintsPanelUI = Class.create({
	id: null,
	label: null,
	layout: null,
	constraintsGrid: null,
	associationsGrid: null,
	initialize: function(id,label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.constraintsGrid = null;
		this.associationsGrid = null;
	},
	createPanel: function() {
		var that = this;
		if(this.layout === null) {
			var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
			this.layout = $j('#' + this.id).w2layout({
													name: this.id,
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' },
											            { type: 'bottom', size: 300, resizable: true, style: pstyle, content: 'bottom' }
											        ]
												});

			this.constraintsGrid = $j().w2grid({
											name: this.id + '-grid',
											header: this.label + ' - Constraints',
											show: { header: true,
											      toolbar: true,
											      lineNumbers: true
											    },
											columns: [
												{field: 'type', caption: 'Type', size: '150px'},
												{field: 'name', caption: 'Name', size: '150px'},
												{field: 'enabled', caption: 'Enabled', size: '100px'},
												{field: 'deferrableState', caption: 'Deferrable State', size: '100%'}
											],
											toolbar: {
												items: [
													{type: 'break'},
													{id: this.id + '-grid-toolbar-add-constraint', type: 'menu', text: 'Add', icon: 'add_icon', count: 4,
														items: [
															{id: this.id + '-grid-toolbar-add-constraint-primary-key', text: 'New Primary Key Constraint', icon: 'primary_key_icon'},
															{id: this.id + '-grid-toolbar-add-constraint-unique', text: 'New Unique Constraint', icon: 'key_icon'},
															{id: this.id + '-grid-toolbar-add-constraint-foreign-key', text: 'New Foreign Key Constraint', icon: 'foreign_key_icon'},
															{id: this.id + '-grid-toolbar-add-constraint-check', text: 'New Check Constraint', icon: 'constraint_icon'}
														]
													},
													{id: this.id + '-grid-toolbar-drop-constraint', type: 'button', caption: 'Drop', icon: 'delete_icon'}
												]
											}
										});
			this.layout.content('main', this.constraintsGrid);

			var bottomHtml = `
				<div id='` + this.id + `-primary-unique-constraint-panel' class='constraints_panel'>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-primary-unique-constraint-panel-using-index-select'>Using Index:</label>
						<select id='` + this.id + `-primary-unique-constraint-panel-using-index-select' style='margin-left: 10px; width: 300px;'>
							<option>--DEFAULT--</option>
						</select>
					</div>
					<div>
						<table style='width: 100%;'>
							<tr>
								<td>Available Columns:</td>
								<td></td>
								<td>Selected Columns:</td>
								<td></td>
							</tr>
							<tr>
								<td>
									<select id='` + this.id + `-primary-unique-constraint-panel-available-columns-select' size='13' style='width: 100%;'>
										<option>Column1</option>
										<option>Column3</option>
										<option>Column4</option>
									</select>
								</td>
								<td style='width: 40px;'>
									<table>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-right-button'><i class='shuttle_right_icon' /></button></td>
										</tr>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-right-all-button'><i class='shuttle_right_all_icon' /></button></td>
										</tr>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-left-button'><i class='shuttle_left_icon' /></button></td>
										</tr>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-left-all-button'><i class='shuttle_left_all_icon' /></button></td>
										</tr>
									</table>
								</td>
								<td>
									<select id='` + this.id + `-primary-unique-constraint-panel-selected-columns-select' size='13' style='width: 100%;'>
										<option>Column2</option>
									</select>
								</td>
								<td style='width: 40px;'>
									<table>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-first-button'><i class='first_icon' /></button></td>
										</tr>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-previous-button'><i class='previous_icon' /></button></td>
										</tr>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-next-button'><i class='next_icon' /></button></td>
										</tr>
										<tr>
											<td><button id='` + this.id + `-primary-unique-constraint-panel-last-button'><i class='last_icon' /></button></td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</div>
				</div>
				<div id='` + this.id + `-foreign-constraint-panel' class='constraints_panel display_constraints_panel' style='height: 100%;'>
					<table style='height: 100%; width: 100%;'>
						<tr>
							<td style='width: 50%; vertical-align: top;'>
								<div>
									<div>
										<label for='` + this.id + `-foreign-constraint-panel-schema-select'>Schema:</label>
										<select id='` + this.id + `-foreign-constraint-panel-schema-select' style='margin-left: 15px; width: 220px;'>
										</select>
									</div>
									<div>
										<label for='` + this.id + `-foreign-constraint-panel-table-select'>Table:</label>
										<select id='` + this.id + `-foreign-constraint-panel-table-select' style='margin-left: 32px; width: 220px;'>
										</select>
									</div>
									<div>
										<label for='` + this.id + `-foreign-constraint-panel-constraints-select'>Constraint:</label>
										<select id='` + this.id + `-foreign-constraint-panel-constraints-select' style='margin-left: 1px; width: 220px;'>
										</select>
									</div>
									<div>
										<label for='` + this.id + `-foreign-constraint-panel-on-delete-select'>On Delete:</label>
										<select id='` + this.id + `-foreign-constraint-panel-on-delete-select' style='margin-left: 2px; width: 220px;'>
											<option>No Action</option>
											<option>Cascade</option>
											<option>Set Null</option>
										</select>
									</div>
								</div>
							</td>
							<td>
								<div id='` + this.id + `-foreign-constraint-panel-associations-grid' style='height: 100%;'></div>
							</td>
						</tr>
					</table>
				</div>
				<div id='` + this.id + `-check-constraint-panel' class='constraints_panel'>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-check-constraint-panel-check-condition-input'>Check Condition:</label>
					</div>
					<div style='height: 100%; width: 100%;'>
						<textarea id='` + this.id + `-check-constraint-panel-check-condition-input' style='width: 650px; height: 247px;' />
					</div>
				</div>
			`;
			this.layout.content('bottom', bottomHtml);

			//Need to call when foreign-key panel is shown
			this.createAssociationsGrid();
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
	getConstraintsGrid: function() {
		return this.constraintsGrid;
	},
	createAssociationsGrid: function() {
		if(this.associationsGrid === null) {
			this.associationsGrid = $j('#' + this.id + '-foreign-constraint-panel-associations-grid').w2grid({
																		name: this.id + '-foreign-constraint-panel-associations-properties',
																		header: 'Associations',
																		show: { header: true,
																		      toolbar: false,
																		      lineNumbers: false
																		    },
																		columns: [
																			{field: 'localColumn', caption: 'Local Column', size: '150px'},
																			{field: 'referencedColumn', caption: 'Referenced Column', size: '100%'}
																		]
																	});
		}
	},
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
		if(this.constraintsGrid !== null) {
			this.constraintsGrid.destroy();
		}
	},
	refresh: function() {
		if(this.constraintsGrid !== null) {
			this.constraintsGrid.refresh();
		}
		if(this.associationsGrid !== null) {
			this.associationsGrid.refresh();
		}
	}
});

/**
 * IndexesPanelUI: This class provides the user interface to edit the indexes
 * of an given table
 * @constructor
 * @param {String} id: A unique identifier to create HTML contents
 * @param {String} label: A label to be shown on the required widgets
 */
var IndexesPanelUI = Class.create({
	id: null,
	label: null,
	layout: null,
	expressionsGrid: null,
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.expressionsGrid = null;
	},
	createPanel: function() {
		var that = this;
		if(this.layout === null) {
			var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
			this.layout = $j('#' + this.id).w2layout({
													name: this.id,
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' },
											            { type: 'left', size: 250, resizable: false, style: pstyle, content: 'left' }
											        ]
												});

			var leftHtml = `
				<div style='line-height: 22px; margin-top: 5px; border: 1px solid darkgrey; padding: 5px;'>
					<label>Indexes:</label>
					<div style='float: right'>
						<button id='` + this.id + `-index-add-button' style='height: 22px;'><i class='add_icon' /></button>
						<button id='` + this.id + `-index-drop-button' style='height: 22px;'><i class='delete_icon' /></button>
					</div>
				</div>
				<div style='width: 100%;'>
					<select id='` + this.id + `-indexes-list' size='33' style='width: 100%;'>
					</select>
				</div>
			`;
			this.layout.content('left', leftHtml);

			var mainHtml = `
				<div style='line-height: 30px; margin-top: 5px;'>
					<label for='` + this.id + `-index-name'>Name:</label>
					<input id='` + this.id + `-index-name' style='width: 320px; margin-left: 30px;' />
				</div>
				<div style='line-height: 30px;'>
					<label for='` + this.id + `-index-type-select'>Index Type:</label>
					<select id='` + this.id + `-index-type-select' style='width: 300px;'>
						<option>Non-Unique</option>
						<option>Unique</option>
						<option>Bitmap</option>
						<option>Domain</option>
					</select>
					<a href='#' onclick="
										$j(this).w2overlay({
											openAbove: true,
											tipLeft: 12,
											html: '<div style=\\'padding: 10px;\\'>Help on Types of Index</div>'
										});
									"><i class='assist_icon' /></a>
				</div>
				<div id='` + this.id + `-expressions-grid' class='index_expression_grid'></div> <!-- or height: 53% -->
				<div id='` + this.id + `-domain-index-type-panel' class='index_domain_panel'>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-domain-index-type-schema-select'>Index Type Schema:</label>
						<select id='` + this.id + `-domain-index-type-schema-select' style='width: 266px;'>
						</select>
					</div>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-domain-index-type-select'>Index Type:</label>
						<select id='` + this.id + `-domain-index-type-select' style='margin-left: 53px; width: 245px;'>
						</select>
						<a href='#' onclick="
											$j(this).w2overlay({
												openAbove: true,
												tipLeft: 12,
												html: '<div style=\\'padding: 10px;\\'>Help on Domain Type of Index</div>'
											});
										"><i class='assist_icon' /></a>
					</div>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-domain-index-type-parameters-input' style='vertical-align: top;'>Parameters:</label>
						<textarea id='` + this.id + `-domain-index-type-parameters-input' style='width: 243px; height: 100px; margin-left: 52px;' />
						<a href='#' onclick="
											$j(this).w2overlay({
												openAbove: true,
												tipLeft: 12,
												html: '<div style=\\'padding: 10px;\\'>Help on various parameters for Domain Type Index</div>'
											});
										" style='vertical-align: top;'><i class='assist_icon' /></a>
					</div>
				</div>
				<div style='line-height: 30px; float: right;'>
					<button id='` + this.id + `-index-advance-button'>Advanced...</button>
				</div>
			`;
			this.layout.content('main', mainHtml);

			$j('#' + this.id + '-index-type-select').on('change', function() {
				if(this.value === 'Domain') {
					$j('#' + that.id + '-expressions-grid').addClass('index_compact_expression_grid');
					$j('#' + that.id + '-domain-index-type-panel').addClass('display_index_domain_panel');
				} else {
					$j('#' + that.id + '-expressions-grid').removeClass('index_compact_expression_grid');
					$j('#' + that.id + '-domain-index-type-panel').removeClass('display_index_domain_panel');
				}
			});

			$j('#' + this.id + '-index-advance-button').on('click', function() {
				var advanceHtml = `
					<div style='font-size: 12px;'>
						<div class='message_popup_header'>
							Edit Index - Advance
						</div>
						<div style='margin: 5px; border: 1px solid lightgrey; padding: 10px; height: 510px;'>
							<div style='width: 100%; height: 15%;'>
								<div style='float: left;'>
									<div style='line-height: 30px;'>
										<label for=''>Schema:</label>
										<select id='' style='width: 400px;'>
										</select>
									</div>
									<div style='line-height: 30px;'>
										<label for=''>Name:</label>
										<input id='' style='margin-left: 13px; width: 400px;' />
									</div>
								</div>
								<div style='float: right; margin-top: 10px;'>
									<img src="/static/icons/header/database.png">
								</div>
							</div>
							<div style='width: 100%; height: 85%'>
								<div id='-index-advance-tabs' style='width: 100%'></div>
								<div id='-index-advance-properties-tab-panel' class='index_advance_tab_panel display_index_advance_tab_panel'>
									<div style='padding: 10px 5px;'>
										<div style='line-height: 30px;'>
											<label for=''>Key Compression:</label>
											<select id=''>
												<option>None</option>
												<option>Defult</option>
												<option>Select</option>
											</select>
											<label for='' style='margin-left: 10px;'>Prefix Length:</label>
											<input id='' style='width: 350px;' disabled>
											<a id='-index-advance-key-compression-help' onclick="
												$j(this).w2overlay({
													openAbove: true,
													tipLeft: 12,
													html: '<div style=\\'padding: 10px;\\'>Help on Key Compression of an Index</div>'
												});
											" href='#' style='vertical-align: top;'><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for=''>Parallel Degree:</label>
											<select id='' style='margin-left: 14px;'>
												<option>--Not Specified--</option>
												<option selected>None</option>
												<option>Defult</option>
												<option>Select</option>
											</select>
											<label for='' style='margin-left: 10px;'>Degree:</label>
											<input id='' style='width: 325px;' disabled>
											<a id='-index-advance-paralled-degree-help' onclick="
												$j(this).w2overlay({
													openAbove: true,
													tipLeft: 12,
													html: '<div style=\\'padding: 10px;\\'>Help on Parallel Degree of an Index</div>'
												});
											" href='#' style='vertical-align: top;'><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for=''>Reverse:</label>
											<select id='' style='margin-left: 56px; width: 520px;'>
												<option>Reverse</option>
												<option selected>No Reverse</option>
											</select>
											<a id='-index-advance-reverse-help' onclick="
												$j(this).w2overlay({
													openAbove: true,
													tipLeft: 12,
													html: '<div style=\\'padding: 10px;\\'>Help on Reverse Option of an Index</div>'
												});
											" href='#' style='vertical-align: top;'><i class='assist_icon' /></a>
										</div>
									</div>
								</div>
								<div id='-index-advance-storage-tab-panel' class='index_advance_tab_panel'></div>
							</div>
						</div>
					</div>
				`;
				w2popup.message({
					body: advanceHtml,
					buttons: '<button class="w2ui-btn" onclick="w2popup.message();">Apply</button>' +
							 '<button class="w2ui-btn" onclick="w2popup.message();">Close</button> ',
					height: 600,
					width: 700,
					onOpen: function(event) {
						$j('#' + '-index-advance-tabs').w2tabs({
									name: that.id + '-index-advance-tabs',
									active: that.id + '-index-advance-properties-tab',
									tabs: [
										{id: that.id + '-index-advance-properties-tab', text: 'Properties'},
										{id: that.id + '-index-advance-storage-tab', text: 'Storage'}
									],
									onClick: function(event) {
										if(event.target === that.id + '-index-advance-properties-tab') {
											$j('#' + '-index-advance-storage-tab-panel').removeClass('display_index_advance_tab_panel');
											$j('#' + '-index-advance-properties-tab-panel').addClass('display_index_advance_tab_panel');
										} else {
											$j('#' + '-index-advance-properties-tab-panel').removeClass('display_index_advance_tab_panel');
											$j('#' + '-index-advance-storage-tab-panel').addClass('display_index_advance_tab_panel');
										}
									}
								});
					},
					onClose: function(event) {
						w2ui[that.id + '-index-advance-tabs'].destroy();
					}
				});
			});

			this.expressionsGrid = $j('#' + this.id + '-expressions-grid').w2grid({
											name: this.id + '-grid',
											header: 'Expressions',
											show: { header: true,
											      toolbar: true,
											      lineNumbers: true
											    },
											columns: [
												{field: 'expression', caption: 'Expression', size: '250px'},
												{field: 'order', caption: 'Order', size: '100%'}
											],
											toolbar: {
												items: [
													{type: 'break'},
													{id: this.id + '-grid-toolbar-add-expression', type: 'button', caption: 'Add', icon: 'add_icon'},
													{id: this.id + '-grid-toolbar-delete-expression', type: 'button', caption: 'Delete', icon: 'delete_icon'}
												]
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
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
		if(this.expressionsGrid !== null) {
			this.expressionsGrid.destroy();
		}
	},
	refresh: function() {
		if(this.expressionsGrid !== null) {
			this.expressionsGrid.refresh();
		}
	}
});