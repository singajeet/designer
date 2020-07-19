
/**
 * ColumnsPanelUI: This class provides the user interface to edit the columns
 * of an given table
 * @constructor
 * @param {String} id: A unique identifier to create HTML contents
 * @param {String} label: A label to be shown on the required widgets
 */
var NewTableColumnsPanelUI = Class.create({
	id: null,
	label: null,
	schemaName: null,
	layout: null,
	columnsGrid: null,
	tabs: null,
	simplePanelsId: [],
	constraintsGrid: null,
	indexesGrid: null,
	columnSelectedEventListeners: [],
	complexTypeSchemaChangedEventListeners: [],
	identityColumnSchemaChangedEventListeners: [],
	originalData: [],
	complexDataType: [],
	removedColumns: [],
	initialize: function(id, label, schemaName) {
		this.id = id;
		this.label = label;
		this.schemaName = schemaName;
		this.layout = null;
		this.columnsGrid = null;
		this.tabs = null;
		this.constraintsGrid = null;
		this.indexesGrid = null;
		this.columnSelectedEventListeners = [];
		this.complexTypeSchemaChangedEventListeners = [];
		this.identityColumnSchemaChangedEventListeners = [];
		this.originalData = [];
		this.complexDataType = [];
		this.removedColumns = [];
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
											reorderRows: true,
											columns: [
												{field: 'pk', caption: 'PK', size: '30px', sortable: true,
                									editable: { type: 'text' }
            									},
												{field: 'columnName', caption: 'Column Name', size: '100px', sortable: true,
													editable: { type: 'text' }
												},
												{field: 'dataType', caption: 'Data Type', size: '80px', sortable: true,
													editable: { type: 'select', 
													items: [
															'VARCHAR2',
															'NUMBER',
															'DATE',
															'CLOB',
															'BLOB',
															'──────────',
															'BFILE',
															'BINARY_DOUBLE',
															'BINARY_FLOAT',
															'BLOB',
															'CHAR',
															'CHAR VARYING',
															'CHARACTER',
															'CHARACTER VARYING',
															'CLOB',
															'DATE',
															'DEC',
															'DECIMAL',
															'DOUBLE PRECISION',
															'FLOAT',
															'INT',
															'INTEGER',
															'INTERVAL DAY',
															'INTERVAL YEAR',
															'LONG',
															'LONG RAW',
															'LONG VARCHAR',
															'NATIONAL CHAR',
															'NATIONAL CHAR VARYING',
															'NATIONAL CHARACTER',
															'NATIONAL CHARACTER VARYING',
															'NCHAR',
															'NCHAR VARYING',
															'NCLOB',
															'NUMBER',
															'NUMERIC',
															'NVARCHAR2',
															'RAW',
															'REAL',
															'ROWID',
															'SMALLINT',
															'TIMESTAMP',
															'UROWID',
															'VARCHAR',
															'VARCHAR2'
															]}
												},
												{field: 'size', caption: 'Size', size: '50px', sortable: true,
													editable: { type: 'int' }
												},
												{field: 'notNull', caption: 'Not Null', size: '70px', style: 'text-align: center', sortable: true,
                									editable: { type: 'checkbox', style: 'text-align: center' }
                								},
												{field: 'default', caption: 'Default', size: '70px', sortable: true,
													editable: { type: 'text' }
												},
												{field: 'comments', caption: 'Comments', size: '100%', sortable: true,
													editable: { type: 'text' }
												}
											],
											menu: [
												{id: this.id + '-grid-context-menu-copy-column', text: 'Copy Column', icon: 'copy_icon'},
												{id: this.id + 'sep_1', text: '--'},
												{id: this.id + '-grid-context-menu-drop-column', text: 'Drop Column', icon: 'delete_icon'}
											], 
											toolbar: {
												items: [
													{type: 'break'},
													{id: this.id + '-grid-toolbar-add-column', type: 'button', caption: 'Add', icon: 'add_icon'},
													{id: this.id + '-grid-toolbar-drop-column', type: 'button', caption: 'Drop', icon: 'delete_icon'},
													{id: this.id + '-grid-toolbar-copy-column', type: 'button', caption: 'Copy', icon: 'copy_icon'}
												],
												onClick: function(event) {
													var grid = w2ui[that.id + '-grid'];
													if(event.target === that.id + '-grid-toolbar-add-column') {
														grid.add({recid: grid.records.length + 1, columnName: 'COLUMN1', dataType: 'VARCHAR2', size: '20', mode: 'NEW', pkConstraintName: null, pkIndexName: null, columnType: 'simple', pkType: null, pk: null});
													} else if(event.target === that.id + '-grid-toolbar-drop-column') {
														var recids = grid.getSelection();
														recids.forEach(function(recid) {
															var record = grid.get(recid);
															if(record['mode'] !== 'NEW') {
																that.removedColumns.push(record['columnName']);
															}
															grid.remove(recid);
														});
														var topRecid = grid.records[0]['recid'];
														grid.select(topRecid);
													} else if(event.target === that.id + '-grid-toolbar-copy-column') {
														grid.save();
														var records = grid.getSelection();
														records.forEach(function(recid) {
															var record = grid.get(recid);
															var newRecord = Object.clone(record);
															newRecord['recid'] = grid.records.length + 1;
															newRecord['mode'] = 'COPIED';
															grid.add(newRecord);
														});
													}
												}
											},
											onClick: function(event) {
												if(event.column === 0) {
													var recid = event.recid;
													var recordIndex = parseInt(recid) - 1;
													var cellValue = this.getCellValue(recordIndex, 0);
													if(cellValue === '') {
														this.set(recid, {pk: '<img src="/static/icons/primarykey.png" />'});
													} else {
														this.set(recid, {pk: ''});
													}

													var record = this.get(recid);
													if(record['pkType'] === 'EXISTING') {
														record['pkType'] = 'REMOVE_EXISTING';
													} else if(record['pkType'] === 'REMOVE_EXISTING') {
														record['pkType'] = 'EXISTING';
													} else if(record['pkType'] === null) {
														record['pkType'] = 'NEW';
													} else if(record['pkType'] === 'NEW') {
														record['pkType'] = null;
													}
												}
											},
											onSelect: function(event) {
												if(that.lastClickedRecid !== event.recid){
													event.onComplete = function() {that.updateControls();};
												}
												that.lastClickedRecid = event.recid;
											},
											onUnselect: function(event) {
												
											},
											onChange: function(event) {
												if(event.column === 2) { //DataType column has been changed
													var value = event.value_new;
													$j('#' + that.id + '-data-type-tab-content-selector-simple-radio').prop('checked', true).trigger('click');
													this.set(event.recid, {size: ''});
													$j('#' + that.id + '-data-type-tab-content-simple-column-type-select').val(value).trigger('change');
												} else if(event.column === 3) { //Size column has been changed
													var dataType = this.getCellValue(event.index, 2); //get data type from current selected row
													
													if(dataType === 'CHAR' || dataType === 'CHAR VARYING' 
														|| dataType === 'CHARACTER' || dataType === 'CHARACTER VARYING'
														|| dataType === 'VARCHAR' || dataType === 'VARCHAR2') {
														$j('#' + that.id + '-data-type-tab-content-simple-char-size-input').val(event.value_new);
													} else if(dataType === 'NUMBER' || dataType === 'DEC' 
														|| dataType === 'DECIMAL' || dataType === 'NUMERIC') {
														$j('#' + that.id + '-data-type-tab-content-simple-number-precision-input').val(event.value_new);
													} else if(dataType === 'NATIONAL CHAR' || dataType === 'NATIONAL CHAR VARYING' 
														|| dataType === 'NATIONAL CHARACTER' || dataType === 'NATIONAL CHARACTER VARYING'
														|| dataType === 'NCHAR' || dataType === 'NCHAR VARYING' || dataType === 'NVARCHAR2'
														|| dataType === 'RAW' || dataType === 'UROWID') {
														$j('#' + that.id + '-data-type-tab-content-simple-char-size-only-input').val(event.value_new);
													} else if(dataType === 'FLOAT') {
														$j('#' + that.id + '-data-type-tab-content-simple-number-precision-only-input').val(event.value_new);
													} else if(dataType === 'INTERVAL DAY') {
														$j('#' + that.id + '-data-type-tab-content-simple-interval-day-precision-input').val(event.value_new);
													} else if(dataType === 'INTERVAL YEAR') {
														$j('#' + that.id + '-data-type-tab-content-simple-interval-year-precision-input').val(event.value_new);
													} else if(dataType === 'TIMESTAMP') {
														$j('#' + that.id + '-data-type-tab-content-simple-timezone-precision-input').val(event.value_new);
													} else {
														
													}
												}
											},
											onContextMenu: function(event) {

											},
											onMenuClick: function(event) {

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
								<option selected>XMLTYPE</option>
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
										<option>NOCACHE</option>
										<option>CACHE READS</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id='` + this.id + `-identity-column-tab-content' class='tab_content'>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-identity-column-tab-content-type-select'>Type:&nbsp;&nbsp;&nbsp;</label>
						<select id='` + this.id + `-identity-column-tab-content-type-select' style='width: 570px;'>
							<option>None</option>
						</select>
					</div>
					<div id='` + this.id + `-identity-column-tab-content-details-panel' class='identity_column_panel'>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-identity-column-tab-content-details-panel-trigger-input'>Trigger:</label>
							<input id='` + this.id + `-identity-column-tab-content-details-panel-trigger-input'
									list='` + this.id + `-identity-column-tab-content-details-panel-trigger-list' style='margin-left: 68px; width: 500px;'/>
							<datalist id='` + this.id + `-identity-column-tab-content-details-panel-trigger-list'>
							</datalist>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-identity-column-tab-content-details-panel-sequence-schema-input'>Sequence Schema:</label>
							<input id='` + this.id + `-identity-column-tab-content-details-panel-sequence-schema-input'
									list='` + this.id + `-identity-column-tab-content-details-panel-sequence-schema-list' style='width: 500px;' />
							<datalist id='` + this.id + `-identity-column-tab-content-details-panel-sequence-schema-list'>
							</datalist>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-identity-column-tab-content-details-panel-sequence-input'>Sequence:</label>
							<input id='` + this.id + `-identity-column-tab-content-details-panel-sequence-input'
									list='` + this.id + `-identity-column-tab-content-details-panel-sequence-list' style='margin-left: 54px; width: 500px;' />
							<datalist id='` + this.id + `-identity-column-tab-content-details-panel-sequence-list'>
							</datalist>
						</div>
						<div style='line-height: 30px;'>
							<input type='checkbox' id='` + this.id + `-identity-column-tab-content-details-panel-is-null-checkbox' checked>Check column is null before inserting value from sequence</input>
						</div>
					</div>
				</div>
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
									],
									onClick: function(event) {
										that.changeColumnsSubTab(event.target);
									}
								});

			$j('[name=' + this.id + '-data-type-selector]').on('click', function() {
				if(this.id === that.id + '-data-type-tab-content-selector-simple-radio') {
					$j('#' + that.id + '-data-type-tab-content-complex-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-virtual-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-simple-panel').addClass('display_data_type_panel');

					var newValue = $j('#' + that.id + '-data-type-tab-content-simple-column-type-select').val();
					var newSize = '';

					if(newValue === 'CHAR' || newValue === 'CHAR VARYING' 
						|| newValue === 'CHARACTER' || newValue === 'CHARACTER VARYING'
						|| newValue === 'VARCHAR' || newValue === 'VARCHAR2') {
						newSize = '20';
					}

					var records = that.columnsGrid.getSelection();
					that.columnsGrid.save();
					records.forEach(function(recid) {
						that.columnsGrid.set(recid, {dataType: newValue, columnType: 'simple', size: newSize, virtual: 'NO'});
					});
				} else if(this.id === that.id + '-data-type-tab-content-selector-complex-radio') {
					$j('#' + that.id + '-data-type-tab-content-simple-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-virtual-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-complex-panel').addClass('display_data_type_panel');

					var newValue = $j('#' + that.id + '-data-type-tab-content-complex-column-type-select').val();
					var newSchemaValue = $j('#' + that.id + '-data-type-tab-content-complex-schema-select').val();
					var records = that.columnsGrid.getSelection();
					that.columnsGrid.save();
					records.forEach(function(recid) {
						that.columnsGrid.set(recid, {dataType: newValue, columnType: 'complex', size: '', schema: newSchemaValue, virtual: 'NO'});
					});
				} else {
					$j('#' + that.id + '-data-type-tab-content-simple-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-complex-panel').removeClass('display_data_type_panel');
					$j('#' + that.id + '-data-type-tab-content-virtual-panel').addClass('display_data_type_panel');

					var records = that.columnsGrid.getSelection();
					that.columnsGrid.save();
					records.forEach(function(recid) {
						that.columnsGrid.set(recid, {dataType: '<img src="/static/icons/function.png" />--Derived--', columnType: 'virtual', size: '', virtual: 'YES'});
					});
				}
			});

			//Char Size event handler
			$j('#' + this.id + '-data-type-tab-content-simple-char-size-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {size: newValue});
				});
			});

			//Char Unit event handler
			$j('#' + this.id + '-data-type-tab-content-simple-char-unit-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {unit: newValue});
				});
			});

			//Number precision event handler
			$j('#' + this.id + '-data-type-tab-content-simple-number-precision-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {size: newValue});
				});
			});

			//Number scale event handler
			$j('#' + this.id + '-data-type-tab-content-simple-number-scale-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {scale: newValue});
				});
			});

			//Char size only event handler
			$j('#' + this.id + '-data-type-tab-content-simple-char-size-only-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {size: newValue});
				});
			});

			//Number precision only event handler
			$j('#' + this.id + '-data-type-tab-content-simple-number-precision-only-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {size: newValue});
				});
			});

			//Interval day precision event handler
			$j('#' + this.id + '-data-type-tab-content-simple-interval-day-precision-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {size: newValue});
				});
			});

			//Interval day fraction event handler
			$j('#' + this.id + '-data-type-tab-content-simple-interval-day-fraction-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {scale: newValue});
				});
			});

			//Interval year precision event handler
			$j('#' + this.id + '-data-type-tab-content-simple-interval-year-precision-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {size: newValue});
				});
			});

			//Timezone precision event handler
			$j('#' + this.id + '-data-type-tab-content-simple-timezone-precision-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {size: newValue});
				});
			});

			//Timezone event handler
			$j('#' + this.id + '-data-type-tab-content-simple-timezone-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {unit: newValue});
				});
			});

			//Simple data type event handler
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

					var records = that.columnsGrid.getSelection();
					var newValue = this.value;
					that.columnsGrid.save();
					records.forEach(function(recid) {
						that.columnsGrid.set(recid, {size: ''});
					});
				}

				if(this.value === 'BLOB' || this.value === 'CLOB' || this.value === 'NCLOB') {
					that.tabs.enable(that.id + '-lob-parameters-tab');
				} else {
					that.tabs.disable(that.id + '-lob-parameters-tab');
				}

				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {dataType: newValue});
				});
			});

			//Complex data type event handler
			$j('#' + this.id + '-data-type-tab-content-complex-column-type-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {dataType: newValue, size: ''});
				});
			});

			//Complex schema event handler
			$j('#' + this.id + '-data-type-tab-content-complex-schema-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {schema: newValue});
				});
				that.fireComplexTypeSchemaChangedEvent(this.value);
			});

			//Virtual data type event handler
			$j('#' + this.id + '-data-type-tab-content-virtual-column-type-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {dataType: newValue});
				});
			});

			//Virtual expression event handler
			$j('#' + this.id + '-data-type-tab-content-virtual-expression-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {expression: newValue, default: newValue});
				});
			});

			//LOB Storage Enabled event handler
			$j('#' + this.id + '-lob-parameters-tab-content-define-check').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.checked;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobStorageEnabled: newValue});
				});
			});

			//LOB Segment Name event handler
			$j('#' + this.id + '-lob-parameters-tab-content-segment-name-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobSegmentName: newValue});
				});
			});

			//LOB Storage in row event handler
			$j('#' + this.id + '-lob-parameters-tab-content-storage-in-row-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobStorageInRow: newValue});
				});
			});

			//LOB chunk event handler
			$j('#' + this.id + '-lob-parameters-tab-content-chunk-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobChunk: newValue});
				});
			});

			//LOB pct version event handler
			$j('#' + this.id + '-lob-parameters-tab-content-pct-version-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobPctVersion: newValue});
				});
			});

			//LOB freepools handler
			$j('#' + this.id + '-lob-parameters-tab-content-freepools-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobFreePools: newValue});
				});
			});

			//LOB retention event handler
			$j('#' + this.id + '-lob-parameters-tab-content-retention').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.checked;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobRetention: newValue});
				});
			});

			//LOB cache event handler
			$j('#' + this.id + '-lob-parameters-tab-content-cache-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {lobCache: newValue});
				});
			});

			//Identity column type event handler
			$j('#' + this.id + '-identity-column-tab-content-type-select').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var isValuePopulated = that.columnsGrid.get(records[0])['identityColumnType'] === 'Column Sequence' ? true : false;
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {identityColumnType: newValue});
				});

				if(newValue === 'Column Sequence') {
					$j('#' + that.id + '-identity-column-tab-content-details-panel').addClass('display_identity_column_panel');

					if(!isValuePopulated) {
						$j('#' + that.id + '-identity-column-tab-content-details-panel-trigger-input').val(that.label + '_TRG').trigger('change');
						$j('#' + that.id + '-identity-column-tab-content-details-panel-sequence-schema-input').val(that.schemaName).trigger('change');
						$j('#' + that.id + '-identity-column-tab-content-details-panel-sequence-input').val(that.label + '_SEQ').trigger('change');
						$j('#' + that.id + '-identity-column-tab-content-details-panel-is-null-checkbox').prop('checked', true).trigger('change');
					}
				} else {
					$j('#' + that.id + '-identity-column-tab-content-details-panel').removeClass('display_identity_column_panel');
				}
			});

			//Identity column trigger event handler
			$j('#' + this.id + '-identity-column-tab-content-details-panel-trigger-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {identityColumnTrigger: newValue});
				});
			});

			$j('#' + this.id + '-identity-column-tab-content-details-panel-trigger-input').on('click', function() {
				this.value='';
			});

			//Identity column sequence schema event handler
			$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-schema-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {identityColumnSequenceSchema: newValue});
				});
				that.fireIdentityColumnSchemaChangedEvent(this.value);
			});

			$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-schema-input').on('click', function() {
				this.value='';
			});

			//Identity column sequence event handler
			$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-input').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.value;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {identityColumnSequence: newValue});
				});
			});

			$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-input').on('click', function() {
				this.value='';
			});

			//Identity column is null event handler
			$j('#' + this.id + '-identity-column-tab-content-details-panel-is-null-checkbox').on('change', function() {
				var records = that.columnsGrid.getSelection();
				var newValue = this.checked;
				that.columnsGrid.save();
				records.forEach(function(recid) {
					that.columnsGrid.set(recid, {identityColumnIsNull: newValue});
				});
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
	loadData: function(data) {
		var that = this;
		data.forEach(function(record) {
			var copy = Object.clone(record);
			that.originalData.push(copy);
		});
		this.columnsGrid.records = data;
		this.columnsGrid.refresh();
		this.columnsGrid.unlock();
		this.columnsGrid.select(1);
	},
	updateControls: function() {
		var recid = this.columnsGrid.getSelection()[0];
		var record = this.columnsGrid.get(recid);
		var columnName = record['columnName'];
		var dataType = record['dataType'];
		var size = record['size'];
		var scale = record['scale'];
		var unit = record['unit'];
		var virtual = record['virtual'];
		var virtualExpression = record['expression'] !== null && record['expression'] !== undefined ? record['expression'] : record['default'];
		var schema = record['schema'];

		var lobStorageEnabled = record['lobStorageEnabled'];
		var lobSegmentName = record['lobSegmentName'];
		var lobStorageInRow = record['lobStorageInRow'];
		var lobChunk = record['lobChunk'];
		var lobPctVersion = record['lobPctVersion'];
		var lobFreePools = record['lobFreePools'];
		var lobRetention = record['lobRetention'];
		var lobCache = record['lobCache'];

		var identityColumnType = record['identityColumnType'];
		var identityColumnTrigger = record['identityColumnTrigger'];
		var identityColumnSequenceSchema = record['identityColumnSequenceSchema'];
		var identityColumnSequence = record['identityColumnSequence'];
		var identityColumnIsNull = record['identityColumnIsNull'];

		if(dataType === 'BLOB' || dataType === 'CLOB' || dataType === 'NCLOB') {
			this.tabs.enable(this.id + '-lob-parameters-tab');
			$j('#' + this.id + '-lob-parameters-tab-content-define-check').prop('checked', lobStorageEnabled);
			if(lobStorageEnabled === true) {
				$j('#' + this.id + '-lob-parameters-tab-content-define-check').prop('disabled', true);
			} else {
				$j('#' + this.id + '-lob-parameters-tab-content-define-check').prop('disabled', false);
			}
			$j('#' + this.id + '-lob-parameters-tab-content-segment-name-input').val(lobSegmentName);
			$j('#' + this.id + '-lob-parameters-tab-content-storage-in-row-select').val(lobStorageInRow);
			$j('#' + this.id + '-lob-parameters-tab-content-chunk-input').val(lobChunk);
			$j('#' + this.id + '-lob-parameters-tab-content-pct-version-input').val(lobPctVersion);
			$j('#' + this.id + '-lob-parameters-tab-content-freepools-input').val(lobFreePools);
			if(lobRetention === true) {
				$j('#' + this.id + '-lob-parameters-tab-content-retention').prop('checked', true);
			}
			$j('#' + this.id + '-lob-parameters-tab-content-cache-select').val(lobCache);
		} else {
			this.tabs.disable(this.id + '-lob-parameters-tab');
			if(this.tabs.active === this.id + '-lob-parameters-tab') {
				this.tabs.click(this.id + '-data-type-tab');
			}
		}

		if(this.complexDataType.indexOf(dataType) >= 0) {
			$j('#' + this.id + '-data-type-tab-content-selector-complex-radio').prop('checked', true).trigger('click');
			$j('#' + this.id + '-data-type-tab-content-complex-column-type-select').val(dataType).trigger('change');
			$j('#' + this.id + '-data-type-tab-content-complex-schema-select').val(schema);
		} else if(virtual === 'YES') {
			$j('#' + this.id + '-data-type-tab-content-selector-virtual-radio').prop('checked', true).trigger('click');
			$j('#' + this.id + '-data-type-tab-content-virtual-column-type-select').val(dataType).trigger('change');
			$j('#' + this.id + '-data-type-tab-content-virtual-expression-input').val(virtualExpression);
		} else {
			$j('#' + this.id + '-data-type-tab-content-selector-simple-radio').prop('checked', true).trigger('click');
			$j('#' + this.id + '-data-type-tab-content-simple-column-type-select').val(dataType).trigger('change');

			if(dataType === 'CHAR' || dataType === 'CHAR VARYING' 
				|| dataType === 'CHARACTER' || dataType === 'CHARACTER VARYING'
				|| dataType === 'VARCHAR' || dataType === 'VARCHAR2') {
				$j('#' + this.id + '-data-type-tab-content-simple-char-size-input').val(size).trigger('change');
				$j('#' + this.id + '-data-type-tab-content-simple-char-unit-select').val(unit);
			} else if(dataType === 'NUMBER' || dataType === 'DEC' 
				|| dataType === 'DECIMAL' || dataType === 'NUMERIC') {
				$j('#' + this.id + '-data-type-tab-content-simple-number-precision-input').val(size).trigger('change');
				$j('#' + this.id + '-data-type-tab-content-simple-number-scale-input').val(scale).trigger('change');
			} else if(dataType === 'NATIONAL CHAR' || dataType === 'NATIONAL CHAR VARYING' 
				|| dataType === 'NATIONAL CHARACTER' || dataType === 'NATIONAL CHARACTER VARYING'
				|| dataType === 'NCHAR' || dataType === 'NCHAR VARYING' || dataType === 'NVARCHAR2'
				|| dataType === 'RAW' || dataType === 'UROWID') {
				$j('#' + this.id + '-data-type-tab-content-simple-char-size-only-input').val(size).trigger('change');
			} else if(dataType === 'FLOAT') {
				$j('#' + this.id + '-data-type-tab-content-simple-number-precision-only-input').val(size).trigger('change');
			} else if(dataType === 'INTERVAL DAY') {
				$j('#' + this.id + '-data-type-tab-content-simple-interval-day-precision-input').val(size).trigger('change');
			} else if(dataType === 'INTERVAL YEAR') {
				$j('#' + this.id + '-data-type-tab-content-simple-interval-year-precision-input').val(size).trigger('change');
			} else if(dataType === 'TIMESTAMP') {
				$j('#' + this.id + '-data-type-tab-content-simple-timezone-precision-input').val(size).trigger('change');
			}
		}

		if(dataType === 'NUMBER') {
			var found = false;
			$j('#' + this.id + '-identity-column-tab-content-type-select option').each(function() {
				if($j(this).val() === 'Column Sequence') {
					found = true;
				}
			});
			if(!found){
				$j('#' + this.id + '-identity-column-tab-content-type-select').append('<option>Column Sequence</option>');
			} else {
				$j('#' + this.id + '-identity-column-tab-content-type-select').val('None').trigger('change');
			}

			if(identityColumnType !== null && identityColumnType !== undefined && identityColumnType !== '') {
				$j('#' + this.id + '-identity-column-tab-content-type-select').val(identityColumnType).trigger('change');
				$j('#' + this.id + '-identity-column-tab-content-details-panel-trigger-input').val(identityColumnTrigger);
				$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-schema-input').val(identityColumnSequenceSchema);
				$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-input').val(identityColumnSequence);
				$j('#' + this.id + '-identity-column-tab-content-details-panel-is-null-checkbox').prop('checked', identityColumnIsNull);
			}
		} else {
			$j('#' + this.id + '-identity-column-tab-content-type-select option').each(function() {
				if($j(this).val() === 'Column Sequence') {
					$j(this).remove();
				}
			}).trigger('change');
		}

		this.fireColumnSelectedEvent(columnName);
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
			var recid = this.columnsGrid.getSelection()[0];
			var record = this.columnsGrid.get(recid);
			var columnName = record['columnName'];
			this.fireColumnSelectedEvent(columnName);
		} else {
			this.constraintsGrid.refresh();
		}
	},
	isConstraintsGridCreated: function() {
		if(this.constraintsGrid === null) {
			return false;
		} else {
			return true;
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
			var recid = this.columnsGrid.getSelection()[0];
			var record = this.columnsGrid.get(recid);
			var columnName = record['columnName'];
			this.fireColumnSelectedEvent(columnName);
		} else {
			this.indexesGrid.refresh();
		}
	},
	isIndexesGridCreated: function() {
		if(this.indexesGrid === null) {
			return false;
		} else {
			return true;
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
			//First change trigger with empty and then with value
			$j('#' + this.id + '-data-type-tab-content-simple-char-size-input').val('').trigger('change');
			$j('#' + this.id + '-data-type-tab-content-simple-char-size-input').val('20').trigger('change');
		} else if(dataType === 'NUMBER') {
			$j('#' + this.simplePanelsId[1]).addClass('display_simple_panel');
			$j('#' + this.id + '-data-type-tab-content-simple-number-precision-input').val('').trigger('change');
			$j('#' + this.id + '-data-type-tab-content-simple-number-scale-input').val('').trigger('change');
		} else if(dataType === 'CHAR_SIZE_ONLY') {
			$j('#' + this.simplePanelsId[2]).addClass('display_simple_panel');
			$j('#' + this.id + '-data-type-tab-content-simple-char-size-only-input').val('').trigger('change');
		} else if(dataType === 'NUMBER_PRECISION_ONLY') {
			$j('#' + this.simplePanelsId[3]).addClass('display_simple_panel');
			$j('#' + this.id + '-data-type-tab-content-simple-number-precision-only-input').val('').trigger('change');
		} else if(dataType === 'INTERVAL_DAY') {
			$j('#' + this.simplePanelsId[4]).addClass('display_simple_panel');
			$j('#' + this.id + '-data-type-tab-content-simple-interval-day-precision-input').val('').trigger('change');
		} else if(dataType === 'INTERVAL_YEAR') {
			$j('#' + this.simplePanelsId[5]).addClass('display_simple_panel');
			$j('#' + this.id + '-data-type-tab-content-simple-interval-year-precision-input').val('').trigger('change');
		} else if(dataType === 'TIMEZONE') {
			$j('#' + this.simplePanelsId[6]).addClass('display_simple_panel');
			$j('#' + this.id + '-data-type-tab-content-simple-timezone-precision-input').val('').trigger('change');
		}
	},
	addColumnSelectedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.columnSelectedEventListeners.push(listener);
		}
	},
	removeColumnSelectedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.columnSelectedEventListeners.indexOf(listener);
			this.columnSelectedEventListeners.splice(index, 1);
		}
	},
	fireColumnSelectedEvent: function(columnName) {
		this.columnSelectedEventListeners.forEach(function(listener) {
			listener(columnName);
		});
	},
	showIdentityColumnPanel: function() {
		$j('#' + this.id + '-identity-column-tab-content-type-select').val('Column Sequence').trigger('change');
		var records = this.columnsGrid.getSelection();
		this.columnsGrid.save();
		var that = this;
		records.forEach(function(recid) {
			that.columnsGrid.set(recid, {identityColumnTriggerAction: 'EXISTING'});
		});
	},
	setIdentityColumnTrigger: function(triggerName) {
		$j('#' + this.id + '-identity-column-tab-content-details-panel-trigger-input').val(triggerName);
	},
	setIdentityColumnSequenceSchema: function(schemaName) {
		$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-schema-input').val(schemaName);
	},
	setIdentityColumnSequence: function(sequenceName) {
		$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-input').val(sequenceName);
	},
	populateComplexSchemaList: function(list) {
		var that = this;
		list.forEach(function(item) {
			var selected = '';
			if(item === 'SYS') {
				selected = 'selected';
			}
			$j('#' + that.id + '-data-type-tab-content-complex-schema-select').append('<option ' + selected + '>' + item + '</option>');
		});
	},
	populateComplexTypesList: function(list) {
		var that = this;
		$j('#' + this.id + '-data-type-tab-content-complex-column-type-select').empty();
		this.complexDataType.clear();
		list.forEach(function(item) {
			var selected = '';
			if(item === 'XMLTYPE') {
				selected = 'selected';
			}
			$j('#' + that.id + '-data-type-tab-content-complex-column-type-select').append('<option ' + selected + '>' + item + '</option>');
			that.complexDataType.push(item);
		});
	},
	populateTriggersList: function(list) {
		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-identity-column-tab-content-details-panel-trigger-list').append('<option>' + item + '</option>');
		});
	},
	populateSequenceSchemasList: function(list) {
		var that = this;
		list.forEach(function(item) {
			var selected = '';
			if(item === that.schemaName) {
				selected = 'selected';
			}
			$j('#' + that.id + '-identity-column-tab-content-details-panel-sequence-schema-list').append('<option ' + selected + '>' + item + '</option>');
		});
	},
	populateSequencesList: function(list) {
		$j('#' + this.id + '-identity-column-tab-content-details-panel-sequence-list').empty();
		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-identity-column-tab-content-details-panel-sequence-list').append('<option>' + item + '</option>');
		});
	},
	addComplexTypeSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.complexTypeSchemaChangedEventListeners.push(listener);
		}
	},
	removeComplexTypeSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.complexTypeSchemaChangedEventListeners.indexOf(listener);
			this.complexTypeSchemaChangedEventListeners.splice(index, 1);
		}
	},
	fireComplexTypeSchemaChangedEvent: function(value) {
		this.complexTypeSchemaChangedEventListeners.forEach(function(listener) {
			listener(value);
		});
	},
	addIdentityColumnSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.identityColumnSchemaChangedEventListeners.push(listener);
		}
	},
	removeIdentityColumnSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.identityColumnSchemaChangedEventListeners.indexOf(listener);
			this.identityColumnSchemaChangedEventListeners.splice(index, 1);
		}
	},
	fireIdentityColumnSchemaChangedEvent: function(value) {
		this.identityColumnSchemaChangedEventListeners.forEach(function(listener) {
			listener(value);
		});
	},
	getOriginalRecord: function(recid) {
		var recordToReturn = null;
		this.originalData.forEach(function(record) {
			if(record['recid'] === recid) {
				recordToReturn = record;
			}
		});
		return recordToReturn;
	},
	getChanges: function() {
		var that = this;
		var deltaChanges = [];
		//this.originalData.forEach(function(originalRecord) {
		this.columnsGrid.records.forEach(function(gridRecord) {
			//var recid = originalRecord['recid'];
			var recid = gridRecord['recid'];
			//var gridRecord = that.columnsGrid.get(recid);
			var originalRecord = that.getOriginalRecord(recid);
			if(originalRecord !== null) {
				var changedRecord = {};

				changedRecord['recid'] = recid;
				changedRecord['mode'] = gridRecord['mode'];
				changedRecord['pkConstraintName'] = originalRecord['pkConstraintName'];
				changedRecord['pkIndexName'] = originalRecord['pkIndexName'];
				changedRecord['columnType'] = gridRecord['columnType'];
				changedRecord['virtual'] = gridRecord['virtual'];
				changedRecord['pkType'] = gridRecord['pkType'];

				changedRecord['pk'] = gridRecord['pk'] !== originalRecord['pk'] ? gridRecord['pk'] : null;

				changedRecord['columnName'] = gridRecord['columnName'] !== originalRecord['columnName'] ? gridRecord['columnName'] : null;
				changedRecord['originalColumnName'] = originalRecord['columnName'];
				
				changedRecord['dataType'] = gridRecord['dataType'] !== originalRecord['dataType'] ? gridRecord['dataType'] : null;
				changedRecord['originalDataType'] = originalRecord['dataType'];

				changedRecord['size'] = parseInt(gridRecord['size']) !== parseInt(originalRecord['size']) ? (Number.isNaN(parseInt(gridRecord['size'])) ? null : parseInt(gridRecord['size'])) : null;
				changedRecord['notNull'] = gridRecord['notNull'] !== originalRecord['notNull'] ? gridRecord['notNull'] : null;
				changedRecord['default'] = gridRecord['default'] !== originalRecord['default'] ? gridRecord['default'] : null;
				changedRecord['comments'] = gridRecord['comments'] !== originalRecord['comments'] ? gridRecord['comments'] : null;
				changedRecord['scale'] = parseInt(gridRecord['scale']) !== parseInt(originalRecord['scale']) ? (Number.isNaN(parseInt(gridRecord['scale'])) ? null : parseInt(gridRecord['scale'])) : null;
				
				changedRecord['unit'] = gridRecord['unit'] !== originalRecord['unit'] ? gridRecord['unit'] : null;
				changedRecord['originalUnit'] = originalRecord['unit'];

				changedRecord['schema'] = gridRecord['schema'] !== originalRecord['schema'] ? gridRecord['schema'] : null;
				changedRecord['expression'] = gridRecord['expression'] !== originalRecord['expression'] ? gridRecord['expression'] : null;

				changedRecord['lobStorageEnabled'] = gridRecord['lobStorageEnabled'] !== originalRecord['lobStorageEnabled'] ? gridRecord['lobStorageEnabled'] : null;
				changedRecord['lobSegmentName'] = gridRecord['lobSegmentName'] !== originalRecord['lobSegmentName'] ? gridRecord['lobSegmentName'] : null;
				changedRecord['lobStorageInRow'] = gridRecord['lobStorageInRow'] !== originalRecord['lobStorageInRow'] ? gridRecord['lobStorageInRow'] : null;
				changedRecord['lobChunk'] = gridRecord['lobChunk'] !== originalRecord['lobChunk'] ? gridRecord['lobChunk'] : null;
				changedRecord['lobPctVersion'] = gridRecord['lobPctVersion'] !== originalRecord['lobPctVersion'] ? gridRecord['lobPctVersion'] : null;
				changedRecord['lobFreePools'] = gridRecord['lobFreePools'] !== originalRecord['lobFreePools'] ? gridRecord['lobFreePools'] : null;
				changedRecord['lobRetention'] = gridRecord['lobRetention'] !== originalRecord['lobRetention'] ? gridRecord['lobRetention'] : null;
				changedRecord['lobCache'] = gridRecord['lobCache'] !== originalRecord['lobCache'] ? gridRecord['lobCache'] : null;

				changedRecord['identityColumnTriggerAction'] = gridRecord['identityColumnTriggerAction'];
				changedRecord['identityColumnType'] = gridRecord['identityColumnType'];
				changedRecord['identityColumnTrigger'] = gridRecord['identityColumnTrigger'];
				changedRecord['identityColumnSequenceSchema'] = gridRecord['identityColumnSequenceSchema'];
				changedRecord['identityColumnSequence'] = gridRecord['identityColumnSequence'];
				changedRecord['identityColumnIsNull'] = gridRecord['identityColumnIsNull'];

				deltaChanges.push(changedRecord);
			} else {
				deltaChanges.push(gridRecord);
			}
		});
		var ddlArray = [];
		ddlArray = ddlArray.concat(this.getRemovedColumns());
		ddlArray = ddlArray.concat(this.getColumnRenameChanges(deltaChanges));
		ddlArray = ddlArray.concat(this.getColumnChanges(deltaChanges));
		ddlArray = ddlArray.concat(this.getPrimaryKeyChanges(deltaChanges));
		return ddlArray;
	},
	getRemovedColumns: function() {
		var ddlArray = [];
		var that = this;
		this.removedColumns.forEach(function(column) {
			var ddl = '';
			ddl += 'ALTER TABLE ' + that.label;
			ddl += '\nDROP COLUMN ' + column;
			ddlArray.push(ddl);
		});

		return ddlArray;
	},
	getColumnRenameChanges: function(deltaChanges) {
		var that = this;
		var ddlArray = [];
		deltaChanges.forEach(function(record) {
			if(record['columnName'] !== null && record['mode'] !== 'NEW' && record['mode'] !== 'COPIED') {
				var ddl = '';
				ddl += 'ALTER TABLE ' + that.label + ' RENAME COLUMN ' + record['originalColumnName'] + ' TO ' + record['columnName'] + ';';
				ddlArray.push(ddl);
			}
		});

		return ddlArray;
	},
	getColumnChanges: function(deltaChanges) {
		var that = this;
		var ddlArray = [];
		var identityColumnChangesApplied = false;

		deltaChanges.forEach(function(record) {
			var ddl = '';
			var changesInRecord = false;

			if(record['dataType'] !== null || (record['size'] !== null && record['size'] !== '') || (record['scale'] !== null && record['scale'] !== '')
				|| record['unit'] !== null || (record['default'] !== null && record['default'] !== '') || record['notNull'] !== null) {
				changesInRecord = true;
			}

			if(changesInRecord === true) {
				var columnChange = record['columnName'] !== null ? record['columnName'] : record['originalColumnName'];

				if(record['dataType'] !== null || record['size'] !== null || record['scale'] !== null
					|| record['unit'] !== null || record['expression'] !== null) {
					
					var dataType = record['dataType'] !== null ? record['dataType'] : record['originalDataType'];
					
					if(record['columnType'] === 'simple') {
						columnChange += ' ' + dataType;
					} else if(record['columnType'] === 'complex') {
						columnChange += ' ' + record['schema'] + '.' + dataType;
					} else if(record['columnType'] === 'virtual' || record['virtual'] === 'YES') {
						if(dataType !== null && dataType.indexOf('--Derived') < 0) {
							columnChange += ' ' + dataType + ' AS ( ' + record['expression'] + ' ) VIRTUAL';
						} else {
							columnChange += ' AS ( ' + record['expression'] + ' ) VIRTUAL';
						}
					}
						
					if(record['columnType'] === 'simple') {
						if(dataType === 'CHAR' || dataType === 'CHAR VARYING' 
							|| dataType === 'CHARACTER' || dataType === 'CHARACTER VARYING'
							|| dataType === 'VARCHAR' || dataType === 'VARCHAR2') {

							var unit = (record['unit'] !== null ? record['unit'] : record['originalUnit']);

							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += '(' + record['size'];
							}
							if(record['size'] !== null && record['size'] !== undefined && unit !== null && unit !== undefined) {
								columnChange +=  ' ' + unit;
							}
							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += ')';
							}

						} else if(dataType === 'NUMBER' || dataType === 'DEC' 
							|| dataType === 'DECIMAL' || dataType === 'NUMERIC') {

							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += '(' + record['size'];
							}
							if(record['size'] !== null && record['size'] !== undefined && record['scale'] !== null && record['scale'] !== undefined) {
								columnChange +=  ', ' + record['scale'];
							}
							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += ')';
							}
							
						} else if(dataType === 'NATIONAL CHAR' || dataType === 'NATIONAL CHAR VARYING' 
							|| dataType === 'NATIONAL CHARACTER' || dataType === 'NATIONAL CHARACTER VARYING'
							|| dataType === 'NCHAR' || dataType === 'NCHAR VARYING' || dataType === 'NVARCHAR2'
							|| dataType === 'RAW' || dataType === 'UROWID') {
							
							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += '(' + record['size'] + ')';
							}

						} else if(dataType === 'FLOAT') {

							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += '(' + record['size'] + ')';
							}
							
						} else if(dataType === 'INTERVAL DAY') {

							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += '(' + record['size'] +')';
							}

							if(record['scale'] !== null && record['scale'] !== undefined) {
								columnChange += ' TO SECOND(' + record['scale'] + ')';
							} else {
								columnChange += ' TO SECOND';
							}
							
						} else if(dataType === 'INTERVAL YEAR') {
							
							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += '(' + record['size'] + ') TO MONTH';
							} else {
								columnChange += ' TO MONTH';
							}

						} else if(dataType === 'TIMESTAMP') {
							
							if(record['size'] !== null && record['size'] !== undefined) {
								columnChange += '(' + record['size'] + ')';
							}
							if(record['unit'] !== null && record['unit'] !== undefined) {
								columnChange +=  ' WITH ' + record['unit'];
							}

						}
					}
				}

				if(record['default'] !== null && record['default'] !== undefined && record['columnType'] !== 'virtual') {
					columnChange += ' DEFAULT ' + record['default'];
				}

				if(record['notNull'] !== null && record['notNull'] !== undefined) {
					if(record['notNull'] === true) {
						columnChange += ' NOT NULL';
					} else if(record['notNull'] === false) {
						columnChange += ' NULL';
					}
				}

				if(record['mode'] === 'NEW' || record['mode'] === 'COPIED') {
					ddl += 'ALTER TABLE ' + that.label;
					ddl += '\nADD (' + columnChange + ');';
					ddlArray.push(ddl);
					ddl = '';
				} else if(record['columnType'] !== 'virtual') {
					ddl += 'ALTER TABLE ' + that.label;
					ddl += '\nMODIFY (' + columnChange + ');';
					ddlArray.push(ddl);
					ddl = '';
				} else {
					ddl += 'ALTER TABLE ' + that.label;
					ddl += '\nDROP COLUMN ' + (record['columnName'] !== null ? record['columnName'] : record['originalColumnName']) + ';';
					ddlArray.push(ddl);
					ddl = '';

					ddl += 'ALTER TABLE ' + that.label;
					ddl += '\nADD (' + columnChange + ');';
					ddlArray.push(ddl);
					ddl = '';
				}

				if(record['lobStorageEnabled'] === true) {
					ddl += 'ALTER TABLE ' + that.label + ' MOVE';
					ddl += '\nLOB (' + (record['columnName'] !== null ? record['columnName'] : record['originalColumnName']) + ')';
					ddl += ' STORE AS ' + record['lobSegmentName'];

					var bracketsRequired = (record['lobStorageInRow'] !== null && record['lobStorageInRow'] !== undefined) ||
											(record['lobChunk'] !== null && record['lobChunk'] !== undefined) ||
											(record['lobPctVersion'] !== null && record['lobPctVersion'] !== undefined) ||
											(record['lobFreePools'] !== null && record['lobFreePools'] !== undefined) ||
											(record['lobRetention'] !== null && record['lobRetention'] !== undefined) ||
											(record['lobCache'] !== null && record['lobCache'] !== undefined);
					if(bracketsRequired) {
						ddl += '\n(';
					}

					if(record['lobStorageInRow'] === 'Enabled') {
						ddl += '\n\tENABLE STORAGE IN ROW';
					}
					if(record['lobStorageInRow'] === 'Disabled') {
						ddl += '\n\tDISABLE STORAGE IN ROW';
					}
					if(record['lobChunk'] !== null && record['lobChunk'] !== undefined) {
						ddl += '\n\tCHUNK ' + record['lobChunk'];
					}
					if(record['lobPctVersion'] !== null && record['lobPctVersion'] !== undefined) {
						ddl += '\n\tPCTVERSION ' + record['lobPctVersion'];
					}
					if(record['lobFreePools'] !== null && record['lobFreePools'] !== undefined) {
						ddl += '\n\tFREEPOOLS ' + record['lobFreePools'];
					}
					if(record['lobRetention'] === true) {
						ddl += '\n\tRETENTION';
					}
					if(record['lobCache'] !== null && record['lobCache'] !== undefined) {
						ddl += '\n\t' + record['lobCache'];
					}

					if(bracketsRequired) {
						ddl += '\n)';
					}
					ddl += ';';
					ddlArray.push(ddl);
					ddl = '';
				}
			}

			if(record['identityColumnTriggerAction'] === null || record['identityColumnTriggerAction'] === undefined) {
				if(record['identityColumnType'] === 'Column Sequence' && identityColumnChangesApplied === false) {
					identityColumnChangesApplied = true;
					var colName = record['columnName'] !== null ? record['columnName'] : record['originalColumnName'];

					ddl += 'CREATE SEQUENCE ' + record['identityColumnSequence'] + ';';
					ddlArray.push(ddl);
					ddl = '';

					ddl += 'CREATE TRIGGER ' + record['identityColumnTrigger'];
					ddl += '\nBEFORE INSERT ON ' + that.label;
					ddl += '\nFOR EACH ROW';
					ddl += '\nBEGIN';
					ddl += '\n\t<<COLUMN_SEQUENCES>>';
					ddl += '\n\tBEGIN';
					ddl += '\n\t\tIF INSERTING';
					if(record['identityColumnIsNull'] === true) {
						ddl += ' AND :NEW.' + colName + ' IS NULL';
					}
					ddl += ' THEN';
					ddl += '\n\t\t\tSELECT ' + record['identityColumnSequence'] + '.NEXTVAL INTO :NEW.' + colName + ' FROM SYS.DUAL;';
					ddl += '\n\t\tEND IF;'
					ddl += '\n\tEND COLUMN_SEQUENCES;';
					ddl += '\nEND;'
					ddl += '\n;';
					ddlArray.push(ddl);
					ddl = '';
				}
			}
		});

		return ddlArray;
	},
	getPrimaryKeyChanges: function(deltaChanges) {
		var changesInPK = false;
		var pkConstraintName = null;
		var pkIndexName = null;
		var ddl = '';
		var ddlArray = [];
		var that = this;
		//Check if any changes made for primary key
		//and get the primary key constraint if available
		deltaChanges.forEach(function(record) {
			if(record['pkType'] === 'NEW' || record['pkType'] === 'REMOVE_EXISTING') {
				changesInPK = true;
			}
			if(record['pkConstraintName'] !== null) {
				pkConstraintName = record['pkConstraintName'];
			}
			if(record['pkIndexName'] !== null) {
				pkIndexName = record['pkIndexName'];
			}
		});

		//if changes are made for the primary key
		if(changesInPK === true) {
			//Drop the existing primary key constraint if available
			if(pkConstraintName !== null) {
				ddl += 'ALTER TABLE ' + this.label;
				ddl += '\nDROP CONSTRAINT ' + pkConstraintName + ';';
				ddlArray.push(ddl);
				ddl = '';
			}

			//Get all the columns marked for primary key
			var pkColumns = '';
			deltaChanges.forEach(function(changedRecord) {
				//Since Primary Key changes are not at the column level
				//but are at the table level, the delta changes will not
				//have full information about the PK changes. So we have
				//to fetch this info from the table (columnsGrid)
				var record = that.columnsGrid.get(changedRecord['recid']);
				if(record['pk'] !== null && record['pk'] !== '') {
					if(pkColumns === '') {
						pkColumns += record['columnName'];
					} else {
						pkColumns += ',\n' + record['columnName'];
					}
				}
			});
			//if columns are marked for primary key
			//create DDL for same
			if(pkColumns !== '') {
				ddl += 'ALTER TABLE ' + this.label;
				ddl += '\nADD CONSTRAINT ';
				if(pkConstraintName !== null) {
					ddl += pkConstraintName + ' PRIMARY KEY';
				} else {
					ddl += this.label + '_PK PRIMARY KEY';
				}
				ddl += '\n(\n';
				ddl += pkColumns;
				ddl += '\n)';
				if(pkIndexName !== null) {
					ddl += '\nUSING INDEX';
					ddl += '\n(';
					ddl += '\n\tCREATE UNIQUE INDEX ' + pkIndexName + '1 ON ' + this.label + ' ';
					ddl += '(' + pkColumns.replace(/,\n/g, ' ASC, ') + ' ASC' + ')';
					ddl += '\n)';
				}
				ddl += '\nENABLE;';
				ddlArray.push(ddl);
				ddl = '';
			}
		}

		return ddlArray;
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
var NewTableConstraintsPanelUI = Class.create({
	id: null,
	label: null,
	layout: null,
	constraintsGrid: null,
	associationsGrid: null,
	columnsList: [],
	originalData: [],
	constraintSelectedEventListeners: [],
	schemaChangedEventListeners: [],
	tableChangedEventListeners: [],
	refConstraintChangedEventListeners: [],
	constraintSelectedColumnsDict: {},
	constraintAvailableColumnsDict: {},
	droppedConstraints: [],
	initialize: function(id,label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.constraintsGrid = null;
		this.associationsGrid = null;
		this.columnsList = [];
		this.originalData = [];
		this.constraintSelectedEventListeners = [];
		this.schemaChangedEventListeners = [];
		this.tableChangedEventListeners = [];
		this.refConstraintChangedEventListeners = [];
		this.constraintSelectedColumnsDict = {};
		this.constraintAvailableColumnsDict = {};
		this.droppedConstraints = [];
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
											reorderRows: true,
											columns: [
												{field: 'type', caption: 'Type', size: '150px', sortable: true},
												{field: 'name', caption: 'Name', size: '150px', sortable: true,
													editable: { type: 'text' }
												},
												{field: 'enabled', caption: 'Enabled', size: '100px', sortable: true,
                									editable: { type: 'checkbox', style: 'text-align: center' }
                								},
												{field: 'deferrableState', caption: 'Deferrable State', size: '100%', sortable: true,
													editable: { type: 'select', 
													items: [
														'Not Deferrable',
														'Initially Immediate',
														'Initially Deferred'
													]}
												}
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
												],
												onClick: function(event) {
													var grid = w2ui[that.id + '-grid'];
													if(event.target === that.id + '-grid-toolbar-add-constraint' + ':' + that.id + '-grid-toolbar-add-constraint-primary-key') {
														grid.add({recid: grid.records.length + 1, type: '<img src="/static/icons/primarykey.png" /> Primary Key', constraintType: 'P', mode: 'NEW', name: 'CONSTRAINT1', enabled: true, deferrableState: 'Not Deferrable', constraintName: 'CONSTRAINT1'});
													} else if(event.target === that.id + '-grid-toolbar-add-constraint' + ':' + that.id + '-grid-toolbar-add-constraint-unique') {
														grid.add({recid: grid.records.length + 1, type: '<img src="/static/icons/key.png" /> Unique', constraintType: 'U', mode: 'NEW', name: 'CONSTRAINT1', enabled: true, deferrableState: 'Not Deferrable', constraintName: 'CONSTRAINT1'});
													} else if(event.target === that.id + '-grid-toolbar-add-constraint' + ':' + that.id + '-grid-toolbar-add-constraint-foreign-key') {
														grid.add({recid: grid.records.length + 1, type: '<img src="/static/icons/foreignkey.png" /> Foreign Key', constraintType: 'R', mode: 'NEW', name: 'CONSTRAINT1', enabled: true, deferrableState: 'Not Deferrable', constraintName: 'CONSTRAINT1'});
													} else if(event.target === that.id + '-grid-toolbar-add-constraint' + ':' + that.id + '-grid-toolbar-add-constraint-check') {
														grid.add({recid: grid.records.length + 1, type: '<img src="/static/icons/constraint.png" /> Check', constraintType: 'C', mode: 'NEW', name: 'CONSTRAINT1', enabled: true, deferrableState: 'Not Deferrable', constraintName: 'CONSTRAINT1'});
													} else if(event.target === that.id + '-grid-toolbar-drop-constraint') {
														var records = grid.getSelection();
														records.forEach(function(recid) {
															var record = grid.get(recid);
															if(record['mode'] !== 'NEW') {
																that.droppedConstraints.push(record['name']);
															}
															grid.remove(recid);
															grid.refresh();
														});
														var topRecid = grid.records[0]['recid'];
														grid.select(topRecid);
													}
												}
											},
											onSelect: function(event) {
												var grid = this;
												if(that.lastClickedRecid !== event.recid){
													event.onComplete = function() {
														var recid = event.recid;
														var record = grid.get(recid);
														that.changeConstraintPanel(record);
													};
												}
												that.lastClickedRecid = event.recid;												
											},
											onRefresh: function(event) {
												var recs = this.find({constraintType: 'P'});
												if(recs.length > 0) {
													this.toolbar.disable(that.id + '-grid-toolbar-add-constraint' + ':' + that.id + '-grid-toolbar-add-constraint-primary-key');
												} else {
													this.toolbar.enable(that.id + '-grid-toolbar-add-constraint' + ':' + that.id + '-grid-toolbar-add-constraint-primary-key');
												}
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
										<label for='` + this.id + `-foreign-constraint-panel-schema-input'>Schema:</label>
										<input id='` + this.id + `-foreign-constraint-panel-schema-input' autocomplete='off'
												list='` + this.id + `-foreign-constraint-panel-schema-list' style='margin-left: 15px; width: 220px;' />
										<datalist id='` + this.id + `-foreign-constraint-panel-schema-list'>
										</datalist>
									</div>
									<div>
										<label for='` + this.id + `-foreign-constraint-panel-table-input'>Table:</label>
										<input id='` + this.id + `-foreign-constraint-panel-table-input' autocomplete='off'
												list='` + this.id + `-foreign-constraint-panel-table-list' style='margin-left: 32px; width: 220px;' />
										<datalist id='` + this.id + `-foreign-constraint-panel-table-list'>
										</datalist>
									</div>
									<div>
										<label for='` + this.id + `-foreign-constraint-panel-constraints-input'>Constraint:</label>
										<input id='` + this.id + `-foreign-constraint-panel-constraints-input' autocomplete='off'
												list='` + this.id + `-foreign-constraint-panel-constraints-list' style='margin-left: 1px; width: 220px;' />
										<datalist id='` + this.id + `-foreign-constraint-panel-constraints-list'>
										</datalist>
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

			//Populate Available Columns Select box
			$j('#' + this.id + '-primary-unique-constraint-panel-available-columns-select').empty();

			this.columnsList.forEach(function(column) {
				$j('#' + that.id + '-primary-unique-constraint-panel-available-columns-select').append('<option>' + column + '</option>');
			});

			//Index name event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-using-index-select').on('change', function() {
				var records = that.constraintsGrid.getSelection();
				var newValue = this.value;
				that.constraintsGrid.save();
				records.forEach(function(recid) {
					that.constraintsGrid.set(recid, {indexName: newValue});
				});
			});

			//Move Right button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-right-button').on('click', function() {
				that.moveToSelectedList();
			});

			//Move All Right button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-right-all-button').on('click', function() {
				that.moveAllToSelectedList();
			});

			//Move Left button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-left-button').on('click', function() {
				that.moveToAvailableList();
			});

			//Move All Left button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-left-all-button').on('click', function() {
				that.moveAllToAvailableList();
			});

			//Move to Top button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-first-button').on('click', function() {
				that.moveToTop();
			});

			//Move up button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-previous-button').on('click', function() {
				that.moveUp();
			});

			//Move down button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-next-button').on('click', function() {
				that.moveDown();
			});

			//Move to bottom button event handler
			$j('#' + this.id + '-primary-unique-constraint-panel-last-button').on('click', function() {
				that.moveToBottom();
			});

			//Constraint Schema event handlers
			$j('#' + this.id + '-foreign-constraint-panel-schema-input').on('change', function() {
				var records = that.constraintsGrid.getSelection();
				var newValue = this.value;
				that.constraintsGrid.save();
				records.forEach(function(recid) {
					that.constraintsGrid.set(recid, {refOwner: newValue});
				});
				that.fireSchemaChangedEvent(newValue);
			});

			$j('#' + this.id + '-foreign-constraint-panel-schema-input').on('click', function() {
				this.value = '';
			});

			//Constraint Table event handlers
			$j('#' + this.id + '-foreign-constraint-panel-table-input').on('change', function() {
				var records = that.constraintsGrid.getSelection();
				var newValue = this.value;
				that.constraintsGrid.save();
				records.forEach(function(recid) {
					that.constraintsGrid.set(recid, {refTable: newValue});
				});
				that.fireTableChangedEvent(newValue);
			});

			$j('#' + this.id + '-foreign-constraint-panel-table-input').on('click', function() {
				this.value = '';
			});

			//Referenced Constraint event handlers
			$j('#' + this.id + '-foreign-constraint-panel-constraints-input').on('change', function() {
				var records = that.constraintsGrid.getSelection();
				var newValue = this.value;
				that.constraintsGrid.save();
				// records.forEach(function(recid) {
				// 	that.constraintsGrid.set(recid, {refConstraintName: newValue});
				// });
				var record = that.constraintsGrid.get(records[0]);
				var constraintName = record['constraintName'];
				that.fireRefConstraintChangedEvent(constraintName, newValue);
			});

			$j('#' + this.id + '-foreign-constraint-panel-constraints-input').on('click', function() {
				this.value = '';
			});

			//Delete Rule event handler
			$j('#' + this.id + '-foreign-constraint-panel-on-delete-select').on('change', function() {
				var records = that.constraintsGrid.getSelection();
				var newValue = this.value;
				that.constraintsGrid.save();
				records.forEach(function(recid) {
					that.constraintsGrid.set(recid, {deleteRule: newValue});
				});
			});

			//Check Condition event handler
			$j('#' + this.id + '-check-constraint-panel-check-condition-input').on('change', function() {
				var records = that.constraintsGrid.getSelection();
				var newValue = this.value;
				that.constraintsGrid.save();
				records.forEach(function(recid) {
					that.constraintsGrid.set(recid, {checkCondition: newValue});
				});
			});

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
	loadData: function(data) {
		var that = this;
		data.forEach(function(record) {
			var copy = Object.clone(record);
			that.originalData.push(copy);
		});
		this.constraintsGrid.records = data;
		this.constraintsGrid.refresh();
		this.constraintsGrid.unlock();
		this.constraintsGrid.select(1);
	},
	createAssociationsGrid: function() {
		var that = this;
		if(this.associationsGrid === null) {
			this.associationsGrid = $j('#' + this.id + '-foreign-constraint-panel-associations-grid').w2grid({
																		name: this.id + '-foreign-constraint-panel-associations-properties',
																		header: 'Associations',
																		show: { header: true,
																		      toolbar: true,
																		      toolbarSave: true,
																		      lineNumbers: false
																		    },
																		columns: [
																			{field: 'localColumn', caption: 'Local Column', size: '150px',
																				editable: { type: 'select', 
																				items: this.columnsList}
																			},
																			{field: 'referencedColumn', caption: 'Referenced Column', size: '100%'}
																		],
																		onSave: function(event) {
																			var grid = this;
																			event.onComplete = function() {
																				var records = that.constraintsGrid.getSelection();
																				records.forEach(function(recid) {
																					var record = that.constraintsGrid.get(recid);
																					if(record['mode'] !== 'NEW') {
																						that.constraintsGrid.set(recid, {mode: 'CHANGED', associationDetails: grid.records});
																					}
																				});
																			};
																		}
 																	});
		}
	},
	isAssociationsGridCreated: function() {
		if(this.associationsGrid === null) {
			return false;
		} else {
			return true;
		}
	},
	getAssociationsGrid: function() {
		return this.associationsGrid;
	},
	changeConstraintPanel: function(record) {
		var recid = record['recid'];
		var mode = record['mode'];
		var constraintName = record['constraintName'];
		var constraintType = record['constraintType'];

		var checkCondition = record['checkCondition'];

		var refOwner = record['refOwner'];
		var refTable = record['refTable'];
		var refConstraintName = record['refConstraintName'];
		var deleteRule = record['deleteRule'];
		var indexName = record['indexName'];

		if(this.constraintAvailableColumnsDict[recid] === null || this.constraintAvailableColumnsDict[recid] === undefined) {
			if(mode !== 'NEW') {
				this.fireConstraintSelectedEvent(constraintName, constraintType);
			}
		} else {
			$j('#' + this.id + '-primary-unique-constraint-panel-available-columns-select').empty();
			var that = this;
			var availableColumns = this.constraintAvailableColumnsDict[recid];
			availableColumns.forEach(function(column) {
				$j('#' + that.id + '-primary-unique-constraint-panel-available-columns-select').append('<option>' + column + '</option>');
			});

			$j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').empty();
			var selectedColumns = this.constraintSelectedColumnsDict[recid];
			selectedColumns.forEach(function(item) {
				$j('#' + that.id + '-primary-unique-constraint-panel-selected-columns-select').append('<option>' + item + '</option>');
			});
		}

		if(constraintType === 'P' || constraintType === 'U') {
			$j('#' + this.id + '-foreign-constraint-panel').removeClass('display_constraints_panel');
			$j('#' + this.id + '-check-constraint-panel').removeClass('display_constraints_panel');
			$j('#' + this.id + '-primary-unique-constraint-panel').addClass('display_constraints_panel');

			if(indexName === null || indexName === undefined) {
				$j('#' + this.id + '-primary-unique-constraint-panel-using-index-select').val('');
				$j('#' + this.id + '-primary-unique-constraint-panel-using-index-select').prop('disabled', true);
			} else {
				$j('#' + this.id + '-primary-unique-constraint-panel-using-index-select').val(indexName);
			}
		} else if(constraintType === 'R') {
			$j('#' + this.id + '-check-constraint-panel').removeClass('display_constraints_panel');
			$j('#' + this.id + '-primary-unique-constraint-panel').removeClass('display_constraints_panel');
			$j('#' + this.id + '-foreign-constraint-panel').addClass('display_constraints_panel');

			if(mode !== 'NEW') {
				$j('#' + this.id + '-foreign-constraint-panel-schema-input').val(refOwner).trigger('change');
				$j('#' + this.id + '-foreign-constraint-panel-table-input').val(refTable).trigger('change');
				$j('#' + this.id + '-foreign-constraint-panel-constraints-input').val(refConstraintName).trigger('change');
				$j('#' + this.id + '-foreign-constraint-panel-on-delete-select').val(deleteRule);
			} else {
				this.associationsGrid.clear();
				$j('#' + this.id + '-foreign-constraint-panel-schema-input').val(refOwner);
				$j('#' + this.id + '-foreign-constraint-panel-table-input').val(refTable);
				if(refConstraintName !== undefined) {
					$j('#' + this.id + '-foreign-constraint-panel-constraints-input').val(refConstraintName).trigger('change');
				} else {
					$j('#' + this.id + '-foreign-constraint-panel-constraints-input').val(refConstraintName);
				}
				$j('#' + this.id + '-foreign-constraint-panel-on-delete-select').val(deleteRule);
			}
		} else if(constraintType === 'C') {
			$j('#' + this.id + '-foreign-constraint-panel').removeClass('display_constraints_panel');
			$j('#' + this.id + '-primary-unique-constraint-panel').removeClass('display_constraints_panel');
			$j('#' + this.id + '-check-constraint-panel').addClass('display_constraints_panel');

			$j('#' + this.id + '-check-constraint-panel-check-condition-input').val(checkCondition);
		}
		this.constraintsGrid.save();
	},
	populateIndexesList: function(result) {
		$j('#' + this.id + '-primary-unique-constraint-panel-using-index-select').empty();
		var that = this;
		result.forEach(function(item) {
			$j('#' + that.id + '-primary-unique-constraint-panel-using-index-select').append('<option>' + item['indexName'] + '</option>');
		});			
	},
	addConstraintSelectedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.constraintSelectedEventListeners.push(listener);
		}
	},
	removeConstraintSelectedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.constraintSelectedEventListeners.indexOf(listener);
			this.constraintSelectedEventListeners.splice(index, 1);
		}
	},
	fireConstraintSelectedEvent: function(constraintName, constraintType) {
		this.constraintSelectedEventListeners.forEach(function(listener) {
			listener(constraintName, constraintType);
		});
	},
	populateReferencedSchemasList: function(list) {
		$j('#' + this.id + '-foreign-constraint-panel-schema-list').empty();

		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-foreign-constraint-panel-schema-list').append('<option>' + item + '</option>');
		});
	},
	populateReferencedTablesList: function(list) {
		$j('#' + this.id + '-foreign-constraint-panel-table-list').empty();

		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-foreign-constraint-panel-table-list').append('<option>' + item + '</option>');
		});
	},
	populateReferencedConstraintsList: function(list) {
		$j('#' + this.id + '-foreign-constraint-panel-constraints-list').empty();

		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-foreign-constraint-panel-constraints-list').append('<option>' + item + '</option>');
		});
	},
	addSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.schemaChangedEventListeners.push(listener);
		}
	},
	removeSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.schemaChangedEventListeners.indexOf(listener);
			this.schemaChangedEventListeners.splice(index, 1);
		}
	},
	fireSchemaChangedEvent: function(schemaName) {
		this.schemaChangedEventListeners.forEach(function(listener) {
			listener(schemaName);
		});
	},
	addTableChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tableChangedEventListeners.push(listener);
		}
	},
	removeTableChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tableChangedEventListeners.indexOf(listener);
			this.tableChangedEventListeners.splice(index, 1);
		}
	},
	fireTableChangedEvent: function(tableName) {
		this.tableChangedEventListeners.forEach(function(listener) {
			listener(tableName);
		});
	},
	addRefConstraintChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.refConstraintChangedEventListeners.push(listener);
		}
	},
	removeRefConstraintChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.refConstraintChangedEventListeners.indexOf(listener);
			this.refConstraintChangedEventListeners.splice(index, 1);
		}
	},
	fireRefConstraintChangedEvent: function(constraintName, refConstraintName) {
		this.refConstraintChangedEventListeners.forEach(function(listener) {
			listener(constraintName, refConstraintName);
		});
	},
	populateColumnsList: function(list) {
		this.columnsList = list;
	},
	populateAssociationGrid: function(result) {
		var refConstraintNameTextboxValue = $j('#' + this.id + '-foreign-constraint-panel-constraints-input').val();
		var records = this.constraintsGrid.getSelection();
		var that = this;
		records.forEach(function(recid) {
			var record = that.constraintsGrid.get(recid);
			if(record['refConstraintName'] === refConstraintNameTextboxValue) {
				if(record['associationDetails'] === null || record['associationDetails'] === undefined) {
					that.constraintsGrid.set(recid, {associationDetails: result});
					that.associationsGrid.records = result;
					that.associationsGrid.refresh();
					that.associationsGrid.unlock();
				} else {
					that.associationsGrid.records = record['associationDetails'];
					that.associationsGrid.refresh();
					that.associationsGrid.unlock();
				}
			} else {
				that.constraintsGrid.set(recid, {associationDetails: result, refConstraintName: refConstraintNameTextboxValue});
				that.associationsGrid.records = result;
				that.associationsGrid.refresh();
				that.associationsGrid.unlock();
			}
		});
	},
	moveToSelectedList: function() {
		var selectedItem = $j('#' + this.id + '-primary-unique-constraint-panel-available-columns-select').children('option:selected');
		if(selectedItem.length > 0) {
			$j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').append(selectedItem[0].outerHTML);
			
			var records = this.constraintsGrid.getSelection();
			var that = this;
			records.forEach(function(recid) {
				if(that.constraintSelectedColumnsDict[recid] !== null && that.constraintSelectedColumnsDict[recid] !== undefined) {
					that.constraintSelectedColumnsDict[recid].push(selectedItem[0].value);
				} else {
					that.constraintSelectedColumnsDict[recid] = [selectedItem[0].value];
				}

				var index = that.constraintAvailableColumnsDict[recid].indexOf(selectedItem[0].value);
				that.constraintAvailableColumnsDict[recid].splice(index, 1);

				that.constraintsGrid.set(recid, {mode: 'CHANGED'});
			});

			selectedItem.remove();
		}
	},
	moveAllToSelectedList: function() {
		var that = this;
		$j('#' + this.id + '-primary-unique-constraint-panel-available-columns-select').children().each(function() {
			var html = $j(this)[0].outerHTML;
			$j('#' + that.id + '-primary-unique-constraint-panel-selected-columns-select').append(html);

			var records = that.constraintsGrid.getSelection();
			var value = $j(this)[0].value;
			records.forEach(function(recid) {
				if(that.constraintSelectedColumnsDict[recid] !== null && that.constraintSelectedColumnsDict[recid] !== undefined) {
					that.constraintSelectedColumnsDict[recid].push(value);
				} else {
					that.constraintSelectedColumnsDict[recid] = [value];
				}

				var index = that.constraintAvailableColumnsDict[recid].indexOf(value);
				that.constraintAvailableColumnsDict[recid].splice(index, 1);

				that.constraintsGrid.set(recid, {mode: 'CHANGED'});
			});

			$j(this).remove();
		});
	},
	moveToAvailableList: function() {
		var selectedItem = $j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children('option:selected');
		if(selectedItem.length > 0) {
			$j('#' + this.id + '-primary-unique-constraint-panel-available-columns-select').append(selectedItem[0].outerHTML);

			var records = this.constraintsGrid.getSelection();
			var that = this;
			records.forEach(function(recid) {
				if(that.constraintAvailableColumnsDict[recid] !== null && that.constraintAvailableColumnsDict[recid] !== undefined) {
					that.constraintAvailableColumnsDict[recid].push(selectedItem[0].value);
				} else {
					that.constraintAvailableColumnsDict[recid] = [selectedItem[0].value];
				}

				var index = that.constraintSelectedColumnsDict[recid].indexOf(selectedItem[0].value);
				that.constraintSelectedColumnsDict[recid].splice(index, 1);

				that.constraintsGrid.set(recid, {mode: 'CHANGED'});
			});

			selectedItem.remove();
		}
	},
	moveAllToAvailableList: function() {
		var that = this;
		$j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children().each(function() {
			var html = $j(this)[0].outerHTML;
			$j('#' + that.id + '-primary-unique-constraint-panel-available-columns-select').append(html);

			var records = that.constraintsGrid.getSelection();
			var value = $j(this)[0].value;
			records.forEach(function(recid) {
				if(that.constraintAvailableColumnsDict[recid] !== null && that.constraintAvailableColumnsDict[recid] !== undefined) {
					that.constraintAvailableColumnsDict[recid].push(value);
				} else {
					that.constraintAvailableColumnsDict[recid] = [value];
				}

				var index = that.constraintSelectedColumnsDict[recid].indexOf(value);
				that.constraintSelectedColumnsDict[recid].splice(index, 1);

				that.constraintsGrid.set(recid, {mode: 'CHANGED'});
			});

			$j(this).remove();
		});
	},
	moveToTop: function() {
		var selectedItem = $j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children('option:selected');
		if(selectedItem.length > 0) {
			$j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children().first().before(selectedItem);
		}
	},
	moveUp: function() {
		var selectedItem = $j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children('option:selected');
		if(selectedItem.length > 0) {
			selectedItem.prev().before(selectedItem);
		}
	},
	moveDown: function() {
		var selectedItem = $j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children('option:selected');
		if(selectedItem.length > 0) {
			selectedItem.next().after(selectedItem);
		}
	},
	moveToBottom: function() {
		var selectedItem = $j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children('option:selected');
		if(selectedItem.length > 0) {
			$j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').children().last().after(selectedItem);
		}
	},
	populateConstraintColumns: function(list) {
		$j('#' + this.id + '-primary-unique-constraint-panel-available-columns-select').empty();
		var that = this;
		var availableColumns = [];
		this.columnsList.forEach(function(column) {
			var index = list.indexOf(column);
			if(index < 0) {
				$j('#' + that.id + '-primary-unique-constraint-panel-available-columns-select').append('<option>' + column + '</option>');
				availableColumns.push(column);
			}
		});

		$j('#' + this.id + '-primary-unique-constraint-panel-selected-columns-select').empty();
		var selectedColumns = [];
		list.forEach(function(item) {
			$j('#' + that.id + '-primary-unique-constraint-panel-selected-columns-select').append('<option>' + item + '</option>');
			selectedColumns.push(item);
		});

		var records = this.constraintsGrid.getSelection();
		records.forEach(function(recid) {
			that.constraintSelectedColumnsDict[recid] = selectedColumns;
			that.constraintAvailableColumnsDict[recid] = availableColumns;
		});
	},
	getOriginalRecord: function(recid) {
		var recordToReturn = null;
		this.originalData.forEach(function(record) {
			if(record['recid'] === recid) {
				recordToReturn = record;
			}
		});
		return recordToReturn;
	},
	getChanges: function() {
		var that = this;
		var deltaChanges = [];
		//If constraints grid was never navigated and created
		if(this.constraintsGrid === null) {
			return deltaChanges;
		}
		this.constraintsGrid.records.forEach(function(gridRecord) {
			var recid = gridRecord['recid'];
			var originalRecord = that.getOriginalRecord(recid);
			
			if(originalRecord !== null) {
				var changedRecord = {};

				changedRecord['recid'] = recid;
				changedRecord['name'] = originalRecord['name'] !== gridRecord['name'] ? gridRecord['name'] : null;
				changedRecord['originalName'] = originalRecord['name'];
				changedRecord['enabled'] = originalRecord['enabled'] !== gridRecord['enabled'] ? gridRecord['enabled'] : null;
				changedRecord['deferrableState'] = originalRecord['deferrableState'] !== gridRecord['deferrableState'] ? gridRecord['deferrableState'] : null;
				changedRecord['constraintType'] = originalRecord['constraintType'];
				
				changedRecord['checkCondition'] = originalRecord['checkCondition'] !== gridRecord['checkCondition'] ? gridRecord['checkCondition'] : null;
				changedRecord['originalCheckCondition'] = originalRecord['checkCondition'];
				changedRecord['refOwner'] = originalRecord['refOwner'] !== gridRecord['refOwner'] ? gridRecord['refOwner'] : null;
				changedRecord['refTable'] = originalRecord['refTable'] !== gridRecord['refTable'] ? gridRecord['refTable'] : null;
				changedRecord['originalRefTable'] = originalRecord['refTable'];
				changedRecord['refConstraintName'] = originalRecord['refConstraintName'] !== gridRecord['refConstraintName'] ? gridRecord['refConstraintName'] : null;
				changedRecord['deleteRule'] = originalRecord['deleteRule'] !== gridRecord['deleteRule'] ? gridRecord['deleteRule'] : null;
				changedRecord['indexName'] = originalRecord['indexName'] !== gridRecord['indexName'] ? gridRecord['indexName'] : null;
				changedRecord['originalIndexName'] = originalRecord['indexName'] !== null && originalRecord['indexName'] !== undefined ? originalRecord['indexName'] : null;
				changedRecord['constraintColumns'] = gridRecord['constraintColumns'];
				changedRecord['associationDetails'] = gridRecord['associationDetails'];

				changedRecord['mode'] = gridRecord['mode'];

				deltaChanges.push(changedRecord);
			} else {
				deltaChanges.push(gridRecord);
			}
		});
		var ddlArray = [];
		ddlArray = ddlArray.concat(this.getDroppedConstraints());
		ddlArray = ddlArray.concat(this.getConstraintNameChanges(deltaChanges));
		ddlArray = ddlArray.concat(this.getConstraintEnabledDisabledChanges(deltaChanges));
		ddlArray = ddlArray.concat(this.getPrimaryUniqueKeyConstraintChanges(deltaChanges));
		ddlArray = ddlArray.concat(this.getForeignKeyConstraintChanges(deltaChanges));
		ddlArray = ddlArray.concat(this.getCheckConstraintChanges(deltaChanges));
		return ddlArray;
	},
	getDroppedConstraints: function() {
		var ddlArray = [];
		var that = this;
		this.droppedConstraints.forEach(function(constraint) {
			var ddl = '';
			ddl += 'ALTER TABLE ' + that.label;
			ddl += '\nDROP CONSTRAINT ' + constraint + ';';
			ddlArray.push(ddl);
			ddl = '';
		});

		return ddlArray;
	},
	getConstraintNameChanges: function(deltaChanges) {
		var that = this;
		var ddlArray = [];
		deltaChanges.forEach(function(record) {
			if(record['name'] !== null && record['mode'] !== 'NEW') {
				var ddl = '';
				ddl += 'ALTER TABLE ' + that.label;
				ddl += '\nRENAME CONSTRAINT ' + record['originalName'] + ' TO ' + record['name'] + ';';
				ddlArray.push(ddl);
			}
		});

		return ddlArray;
	},
	getConstraintEnabledDisabledChanges: function(deltaChanges) {
		var that = this;
		var ddlArray = [];
		deltaChanges.forEach(function(record) {
			if(record['enabled'] !== null && record['mode'] !== 'NEW') {
				var ddl = '';
				ddl += 'ALTER TABLE ' + that.label;
				ddl += '\nMODIFY CONSTRAINT ' + (record['name'] !== null ? record['name'] : record['originalName']);
				if(record['enabled'] === true) {
					ddl += ' ENABLE;'; 
				} else {
					ddl += ' DISABLE;';
				}
				ddlArray.push(ddl);
			}
		});

		return ddlArray;
	},
	getPrimaryUniqueKeyConstraintChanges: function(deltaChanges) {
		var that = this;
		var ddlArray = [];
		deltaChanges.forEach(function(record) {
			if(record['deferrableState'] !== null || record['indexName'] !== null || record['mode'] === 'CHANGED' || record['mode'] === 'NEW') {
				if(record['constraintType'] === 'P' || record['constraintType'] === 'U') {
					var ddl = '';

					if(record['mode'] !== 'NEW') {
						ddl += 'ALTER TABLE ' + that.label;
						ddl += '\nDROP CONSTRAINT ' + (record['name'] !== null ? record['name'] : record['originalName']) + ';';
						ddlArray.push(ddl);
						ddl = '';
					}

					ddl += 'ALTER TABLE ' + that.label;
					ddl += '\nADD CONSTRAINT ' + (record['name'] !== null ? record['name'] : record['originalName']);
					if(record['constraintType'] === 'P') {
						ddl +=  ' PRIMARY KEY';
					} else {
						ddl += ' UNIQUE';
					}
					ddl += '\n(';
					var recid = record['recid'];
					if(that.constraintSelectedColumnsDict[recid] !== null && that.constraintSelectedColumnsDict[recid] !== undefined) {
						var constraintColumns = that.constraintSelectedColumnsDict[recid];
						if(constraintColumns.length > 0) {
							var columns = '';
							constraintColumns.forEach(function(column) {
								if(columns === '') {
									columns += '\n\t' + column;
								} else {
									columns += ',\n\t' + column;
								}
							});
							ddl += columns;
						}
					}
					ddl += '\n)';
					//Apply DEFERRABLE keyword with selected option
					if(record['deferrableState'] === 'Initially Immediate') {
						ddl += '\nDEFERRABLE INITIALLY IMMEDIATE';
					} else if(record['deferrableState'] === 'Initially Deferred') {
						ddl += '\nDEFERRABLE INITIALLY DEFERRED';
					}
					//Apply Index if applicable
					if((record['indexName'] !== null && record['indexName'] !== undefined) || 
						(record['originalIndexName'] !== null && record['originalIndexName'] !== undefined)) {
						ddl += '\nUSING INDEX';
						ddl += '\n(';
						ddl += '\n\tCREATE INDEX ' + (record['indexName'] !== null ? record['indexName'] : record['originalIndexName']) + '1';
						ddl += ' ON ' + that.label + '(';
						var recid = record['recid'];
						if(that.constraintSelectedColumnsDict[recid] !== null && that.constraintSelectedColumnsDict[recid] !== undefined) {
							var constraintColumns = that.constraintSelectedColumnsDict[recid];
							if(constraintColumns.length > 0) {
								var columns = '';
								constraintColumns.forEach(function(column) {
									if(columns === '') {
										columns += column + ' ASC';
									} else {
										columns += ', ' + column + ' ASC';
									}
								});
								ddl += columns;
							}
						}
						ddl += ')';
						ddl += '\n)';
					}
					//Apply ENABLE or DISABLE keyword
					if(record['enabled'] === null) {
						ddl += '\nENABLE;';
					} else {
						if(record['enabled'] === true) {
							ddl += '\nENABLE;';
						} else {
							ddl += '\nDISABLE;';
						}
					}
					ddlArray.push(ddl);
					ddl = '';
				}
			}
		});

		return ddlArray;
	},
	getForeignKeyConstraintChanges: function(deltaChanges) {
		var that = this;
		var ddlArray = [];
		deltaChanges.forEach(function(record) {
			if(record['deferrableState'] !== null || record['refTable'] !== null || record['mode'] === 'CHANGED' || record['deleteRule'] !== null || record['mode'] === 'NEW') {
				if(record['constraintType'] === 'R') {
					var ddl = '';

					if(record['mode'] !== 'NEW') {
						ddl += 'ALTER TABLE ' + that.label;
						ddl += '\nDROP CONSTRAINT ' + (record['name'] !== null ? record['name'] : record['originalName']) + ';';
						ddlArray.push(ddl);
						ddl = '';
					}
				
					ddl += 'ALTER TABLE ' + that.label;
					ddl += '\nADD CONSTRAINT ' + (record['name'] !== null ? record['name'] : record['originalName']) + ' FOREIGN KEY';
					ddl += '\n(';
					var associationDetails = record['associationDetails'];
					var columns = '';
					associationDetails.forEach(function(association) {
						if(columns === '') {
							columns += '\n\t' + association['localColumn'];
						} else {
							columns += ',\n\t' + association['localColumn'];
						}
					});
					ddl += columns;
					ddl += '\n)';
					ddl += '\nREFERENCES ' + (record['refTable'] !== null ? record['refTable'] : record['originalRefTable']);
					ddl += '\n(';
					var columns = '';
					associationDetails.forEach(function(association) {
						if(columns === '') {
							columns += '\n\t' + association['referencedColumn'];
						} else {
							columns += ',\n\t' + association['referencedColumn'];
						}
					});
					ddl += columns;
					ddl += '\n)';
					//Apply DEFERRABLE keyword with selected option
					if(record['deferrableState'] === 'Initially Immediate') {
						ddl += '\nDEFERRABLE INITIALLY IMMEDIATE';
					} else if(record['deferrableState'] === 'Initially Deferred') {
						ddl += '\nDEFERRABLE INITIALLY DEFERRED';
					}
					ddl += '\n';
					//Apply ON DELETE Rule
					if(record['deleteRule'] === 'Cascade') {
						ddl += 'ON DELETE CASCADE ';
					} else if(record['deleteRule'] === 'Set Null') {
						ddl += 'ON DELETE SET NULL ';
					}
					//Apply ENABLE or DISABLE keyword
					if(record['enabled'] === null) {
						ddl += 'ENABLE;';
					} else {
						if(record['enabled'] === true) {
							ddl += 'ENABLE;';
						} else {
							ddl += 'DISABLE;';
						}
					}
					ddlArray.push(ddl);
					ddl = '';
				}
			}
		});
		return ddlArray;
	},
	getCheckConstraintChanges: function(deltaChanges) {
		var that = this;
		var ddlArray = [];
		deltaChanges.forEach(function(record) {
			if(record['deferrableState'] !== null || record['checkCondition'] !== null || record['mode'] === 'NEW') {
				if(record['constraintType'] === 'C') {
					var ddl = '';

					if(record['mode'] !== 'NEW') {
						ddl += 'ALTER TABLE ' + that.label;
						ddl += '\nDROP CONSTRAINT ' + (record['name'] !== null ? record['name'] : record['originalName']) + ';';
						ddlArray.push(ddl);
						ddl = '';
					}
				
					ddl += 'ALTER TABLE ' + that.label;
					ddl += '\nADD CONSTRAINT ' + (record['name'] !== null ? record['name'] : record['originalName']) + ' CHECK';
					ddl += '\n(';
					ddl += (record['checkCondition'] !== null ? record['checkCondition'] : record['originalCheckCondition']);
					ddl += ')';
					//Apply DEFERRABLE keyword with selected option
					if(record['deferrableState'] === 'Initially Immediate') {
						ddl += '\nDEFERRABLE INITIALLY IMMEDIATE';
					} else if(record['deferrableState'] === 'Initially Deferred') {
						ddl += '\nDEFERRABLE INITIALLY DEFERRED';
					}
					//Apply ENABLE or DISABLE keyword
					if(record['enabled'] === null) {
						ddl += '\nENABLE;';
					} else {
						if(record['enabled'] === true) {
							ddl += '\nENABLE;';
						} else {
							ddl += '\nDISABLE;';
						}
					}
					ddlArray.push(ddl);
					ddl = '';
				}
			}
		});
		return ddlArray;
	},
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
		if(this.constraintsGrid !== null) {
			this.constraintsGrid.destroy();
		}
		if(this.associationsGrid !== null) {
			this.associationsGrid.destroy();
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
var NewTableIndexesPanelUI = Class.create({
	id: null,
	label: null,
	schemaName: null,
	layout: null,
	expressionsGrid: null,
	indexSelectedEventListeners: [],
	indexTypeSchemaChangedEventListeners: [],
	columnsList: [],
	newIndexCounter: 1,
	tablespacesList: [],
	originalData: [],
	droppedIndexes: [],
	initialize: function(id, label, schemaName) {
		this.id = id;
		this.label = label;
		this.schemaName = schemaName;
		this.layout = null;
		this.expressionsGrid = null;
		this.indexSelectedEventListeners = [];
		this.indexTypeSchemaChangedEventListeners = [];
		this.columnsList = [];
		this.newIndexCounter = 1;
		this.tablespacesList = [];
		this.originalData = [];
		this.droppedIndexes = [];
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
						<label for='` + this.id + `-domain-index-type-schema-input'>Index Type Schema:</label>
						<input id='` + this.id + `-domain-index-type-schema-input' autocomplete='off'
								list='` + this.id + `-domain-index-type-schema-list' style='width: 266px;' />
						<datalist id='` + this.id + `-domain-index-type-schema-list'>
						</datalist>
					</div>
					<div style='line-height: 30px;'>
						<label for='` + this.id + `-domain-index-type-input'>Index Type:</label>
						<input id='` + this.id + `-domain-index-type-input' autocomplete='off'
								list='` + this.id + `-domain-index-type-list' style='margin-left: 53px; width: 245px;' />
						<datalist id='` + this.id + `-domain-index-type-list'>
						</datalist>
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

			$j('#' + this.id + '-index-name').on('change', function() {
				var newName = this.value;
				var selectedOption = $j('#' + that.id + '-indexes-list')[0].selectedOptions[0];
				selectedOption.value = newName;
				selectedOption.text = newName;
			});

			$j('#' + this.id + '-index-type-select').on('change', function() {
				var selectedOption = $j('#' + that.id + '-indexes-list')[0].selectedOptions[0];
				var existingIndexType = selectedOption.getAttribute('indexType');
				var mode = selectedOption.getAttribute('mode');
				if(existingIndexType !== this.value && mode !== 'NEW') {
					var message = '';
					if(this.value === 'Unique' || this.value === 'Non-Unique') {
						message = '<div style="text-align: left">To make the given changes, it is necessary to replace (or drop and create) the given object.';
						message += '<br />The drop will be cascaded.';
						message += '<br /><br />The properties changed that require this are:';
						message += '<br />Index Type';
						message += '<br /><br />Do you wish to allow this (data could be lost)?</div>';
					} else if(this.value === 'Bitmap' || this.value === 'Domain') {
						message = '<div style="text-align: left">To change Index Type to "' + this.value + '" the following properties must be removed from this object:';
						message += '<br /><br />Key Compression';
						message += '<br />Reverse';
						message += '<br /><br />Do you wish to continue?</div>';
					}

					var indexType = this;
					w2confirm({
						title: 'Confirmation',
						msg: message,
						width: 650,
						height: 220
					})
					.yes(function() {
						that.setAttribute('indexType', indexType.value);
					})
					.no(function() {
						var selectedOption = $j('#' + that.id + '-indexes-list')[0].selectedOptions[0];
						var existingIndexType = selectedOption.getAttribute('indexType');
						indexType.value = existingIndexType;
					});
				} else {
					if(mode === 'NEW') {
						that.setAttribute('indexType', this.value);
					}
				}

				if(this.value === 'Domain') {
					$j('#' + that.id + '-expressions-grid').addClass('index_compact_expression_grid');
					$j('#' + that.id + '-domain-index-type-panel').addClass('display_index_domain_panel');
				} else {
					$j('#' + that.id + '-expressions-grid').removeClass('index_compact_expression_grid');
					$j('#' + that.id + '-domain-index-type-panel').removeClass('display_index_domain_panel');
					that.expressionsGrid.refresh();
				}

				if(this.value === 'Domain') {
					$j('#' + that.id + '-index-advance-button').prop('disabled', true);
				} else {
					$j('#' + that.id + '-index-advance-button').prop('disabled', false);
				}
			});

			$j('#' + this.id + '-index-advance-button').on('click', function() {
				var advanceHtml = `
					<div style='font-size: 12px;'>
						<div class='message_popup_header'>
							Edit Index - Advance
						</div>
						<div style='margin: 5px; border: 1px solid lightgrey; padding: 10px; height: 350px;'>
							<div style='width: 100%; height: 15%;'>
								<div style='float: left;'>
									<div style='line-height: 30px;'>
										<label for='` + that.id + `-index-advance-schema-select'>Schema:</label>
										<select id='` + that.id + `-index-advance-schema-select' style='width: 400px;'>
										</select>
									</div>
									<div style='line-height: 30px;'>
										<label for='` + that.id + `-index-advance-name-input'>Name:</label>
										<input id='` + that.id + `-index-advance-name-input' style='margin-left: 13px; width: 400px;' />
									</div>
								</div>
								<div style='float: right; margin-top: 10px;'>
									<img src="/static/icons/header/database.png">
								</div>
							</div>
							<div style='width: 100%; height: 85%'>
								<div id='` + that.id + `-index-advance-tabs' style='width: 100%'></div>
								<div id='` + that.id + `-index-advance-properties-tab-panel' class='index_advance_tab_panel display_index_advance_tab_panel'>
									<div style='padding: 10px 5px;'>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-key-compression-select'>Key Compression:</label>
											<select id='` + that.id + `-index-advance-key-compression-select'>
												<option>None</option>
												<option>Default</option>
												<option>Select</option>
											</select>
											<label for='` + that.id + `-index-advance-key-compression-prefix-length-input' style='margin-left: 10px;'>Prefix Length:</label>
											<input id='` + that.id + `-index-advance-key-compression-prefix-length-input' style='width: 346px;' disabled>
											<a onclick="
												$j(this).w2overlay({
													openAbove: true,
													tipLeft: 12,
													html: '<div style=\\'padding: 10px;\\'>Help on Key Compression of an Index</div>'
												});
											" href='#' style='vertical-align: top;'><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-parallel-degree-select'>Parallel Degree:</label>
											<select id='` + that.id + `-index-advance-parallel-degree-select' style='margin-left: 14px;'>
												<option>--Not Specified--</option>
												<option selected>None</option>
												<option>Default</option>
												<option>Select</option>
											</select>
											<label for='` + that.id + `-index-advance-parallel-degree-input' style='margin-left: 10px;'>Degree:</label>
											<input id='` + that.id + `-index-advance-parallel-degree-input' style='width: 325px;' disabled>
											<a onclick="
												$j(this).w2overlay({
													openAbove: true,
													tipLeft: 12,
													html: '<div style=\\'padding: 10px;\\'>Help on Parallel Degree of an Index</div>'
												});
											" href='#' style='vertical-align: top;'><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-reverse-select'>Reverse:</label>
											<select id='` + that.id + `-index-advance-reverse-select' style='margin-left: 56px; width: 520px;'>
												<option>Reverse</option>
												<option selected>No Reverse</option>
											</select>
											<a onclick="
												$j(this).w2overlay({
													openAbove: true,
													tipLeft: 12,
													html: '<div style=\\'padding: 10px;\\'>Help on Reverse Option of an Index</div>'
												});
											" href='#' style='vertical-align: top;'><i class='assist_icon' /></a>
										</div>
									</div>
								</div>
								<div id='` + that.id + `-index-advance-storage-tab-panel' class='index_advance_tab_panel'>
									<div style='padding: 10px 5px;'>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-tablespace-select'>Tablespace:</label>
											<select id='` + that.id + `-index-advance-tablespace-select' style='width: 540px; margin-left: 10px;'>
											</select>
										</div>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-percent-free-input'>Percent Free:</label>
											<input id='` + that.id + `-index-advance-percent-free-input' style='width: 100px;' />
											<label for='` + that.id + `-index-advance-percent-used-input' style='margin-left: 20px;'>Percent Used:</label>
											<input id='` + that.id + `-index-advance-percent-used-input' style='width: 100px;' />
											<a href='#' onclick="
													$j(this).w2overlay({
														openAbove: true,
														tipLeft: 12,
														html: '<div style=\\'padding: 10px;\\'>Help on Percent Free & Used in Index Storage</div>'
													});
												" style="float: right; margin-right: 13px;"><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-logging-select'>Logging:</label>
											<select id='` + that.id + `-index-advance-logging-select' style='margin-left: 28px; width: 100px;'>
												<option>On</option>
												<option>Off</option>
											</select>
											<label for='` + that.id + `-index-advance-initrans-input' style='margin-left: 20px;'>Initrans:</label>
											<input id='` + that.id + `-index-advance-initrans-input' style='margin-left: 32px; width: 100px;' />
											<a href='#' onclick="
													$j(this).w2overlay({
														openAbove: true,
														tipLeft: 12,
														html: '<div style=\\'padding: 10px;\\'>Help on Logging and Initrans options of an Index Storage</div>'
													});
												" style="float: right; margin-right: 13px;"><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-buffer-mode-select'>Buffer Mode:</label>
											<select id='` + that.id + `-index-advance-buffer-mode-select' style='margin-left: 2px; width: 100px;'>
												<option>DEFAULT</option>
												<option>KEEP</option>
												<option>RECYCLE</option>
											</select>
											<label for='` + that.id + `-index-advance-freelists-input' style='margin-left: 20px;'>Freelists:</label>
											<input id='` + that.id + `-index-advance-freelists-input' style='margin-left: 29px; width: 100px;' />
											<label for='` + that.id + `-index-advance-freelist-groups-input' style='margin-left: 20px;'>Freelist Groups:</label>
											<input id='` + that.id + `-index-advance-freelist-groups-input' style='width: 100px;' />
											<a href='#' onclick="
													$j(this).w2overlay({
														openAbove: true,
														tipLeft: 12,
														html: '<div style=\\'padding: 10px;\\'>Help on Buffer Mode, Freelists <br/> & Freelist Groups option of an Index</div>'
													});
												"><i class='assist_icon' /></a>
										</div>
										<hr />
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-initial-extent-input'>Initial Extent:</label>
											<input id='` + that.id + `-index-advance-initial-extent-input' style='margin-left: 24px; width: 100px;' />
											<select id='` + that.id + `-index-advance-initial-extent-select'>
												<option> </option>
												<option>K</option>
												<option>M</option>
												<option>G</option>
												<option>T</option>
											</select>
											<label for='` + that.id + `-index-advance-next-extent-input' style='margin-left: 16px;'>Next Extent:</label>
											<input id='` + that.id + `-index-advance-next-extent-input' style='width: 222px;' />
											<select id='` + that.id + `-index-advance-next-extent-select'>
												<option> </option>
												<option>K</option>
												<option>M</option>
												<option>G</option>
												<option>T</option>
											</select>
											<a href='#' onclick="
													$j(this).w2overlay({
														openAbove: true,
														tipLeft: 12,
														html: '<div style=\\'padding: 10px;\\'>Help on Initial & Next Extent option of Index Storage</div>'
													});
												"><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-min-extent-input'>Min Extent:</label>
											<input id='` + that.id + `-index-advance-min-extent-input' style='margin-left: 37px; width: 100px;'/>
											<select id='` + that.id + `-index-advance-min-extent-select'>
												<option> </option>
												<option>K</option>
												<option>M</option>
												<option>G</option>
												<option>T</option>
											</select>
											<label for='` + that.id + `-index-advance-max-extent-input' style='margin-left: 16px;'>Max Extent:</label>
											<input id='` + that.id + `-index-advance-max-extent-input' style='margin-left: 5px; width: 128px;'/>
											<select id='` + that.id + `-index-advance-max-extent-select'>
												<option> </option>
												<option>K</option>
												<option>M</option>
												<option>G</option>
												<option>T</option>
											</select>
											<input type='checkbox' id='` + that.id + `-index-advance-max-extent-checkbox' style='margin-left: 16px;'>Unlimited</input>
											<a href='#' onclick="
													$j(this).w2overlay({
														openAbove: true,
														tipLeft: 12,
														html: '<div style=\\'padding: 10px;\\'>Help on Min & Max Extent options of Index Storage</div>'
													});
												"><i class='assist_icon' /></a>
										</div>
										<div style='line-height: 30px;'>
											<label for='` + that.id + `-index-advance-percent-increase-input'>Percent Increase:</label>
											<input id='` + that.id + `-index-advance-percent-increase-input' style='width: 145px;'/>
											<a href='#' onclick="
													$j(this).w2overlay({
														openAbove: true,
														tipLeft: 12,
														html: '<div style=\\'padding: 10px;\\'>Help on Percent Increase options of Index Storage</div>'
													});
												" style="float: right; margin-right: 13px;"><i class='assist_icon' /></a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				`;
				w2popup.message({
					body: advanceHtml,
					buttons: '<button class="w2ui-btn" onclick="w2popup.message();">Apply</button>' +
							 '<button class="w2ui-btn" onclick="w2popup.message();">Close</button> ',
					height: 440,
					width: 700,
					onOpen: function(event) {
						$j('#' + that.id + '-index-advance-tabs').w2tabs({
									name: that.id + '-index-advance-tabs',
									active: that.id + '-index-advance-properties-tab',
									tabs: [
										{id: that.id + '-index-advance-properties-tab', text: 'Properties'},
										{id: that.id + '-index-advance-storage-tab', text: 'Storage'}
									],
									onClick: function(event) {
										if(event.target === that.id + '-index-advance-properties-tab') {
											$j('#' + that.id + '-index-advance-storage-tab-panel').removeClass('display_index_advance_tab_panel');
											$j('#' + that.id + '-index-advance-properties-tab-panel').addClass('display_index_advance_tab_panel');
										} else {
											$j('#' + that.id + '-index-advance-properties-tab-panel').removeClass('display_index_advance_tab_panel');
											$j('#' + that.id + '-index-advance-storage-tab-panel').addClass('display_index_advance_tab_panel');
										}
									}
								});

						var selectedOption = $j('#' + that.id + '-indexes-list')[0].selectedOptions[0];
						var indexName = selectedOption.value;
						var keyCompression = selectedOption.getAttribute('keyCompression');
						var prefixLength = selectedOption.getAttribute('prefixLength');
						var parallelDegree = selectedOption.getAttribute('parallelDegree');
						var degree = selectedOption.getAttribute('degree');
						var reverse = selectedOption.getAttribute('reverse');
						var tablespaceName = selectedOption.getAttribute('tablespaceName');
						var pctFree = selectedOption.getAttribute('pctFree');
						var logging = selectedOption.getAttribute('logging');
						var initrans = selectedOption.getAttribute('initrans');
						var bufferMode = selectedOption.getAttribute('bufferMode');
						var freeLists = selectedOption.getAttribute('freeLists');
						var freeListGroups = selectedOption.getAttribute('freeListGroups');
						var initialExtent = selectedOption.getAttribute('initialExtent');
						var nextExtent = selectedOption.getAttribute('nextExtent');
						var minExtent = selectedOption.getAttribute('minExtent');
						var maxExtent = selectedOption.getAttribute('maxExtent');
						var unlimited = selectedOption.getAttribute('unlimited');
						var pctIncrease = selectedOption.getAttribute('pctIncrease');

						if(keyCompression !== 'null'){
							$j('#' + that.id + '-index-advance-key-compression-select').val(keyCompression);
						} else {
							$j('#' + that.id + '-index-advance-key-compression-select').val('None');
						}
						if(prefixLength !== 'null') {
							$j('#' + that.id + '-index-advance-key-compression-prefix-length-input').val(prefixLength);
						} else {
							$j('#' + that.id + '-index-advance-key-compression-prefix-length-input').val('');
						}
						if(parallelDegree !== 'null') {
							$j('#' + that.id + '-index-advance-parallel-degree-select').val(parallelDegree);
						} else {
							$j('#' + that.id + '-index-advance-parallel-degree-select').val('None');
						}
						if(degree !== 'null') {
							$j('#' + that.id + '-index-advance-parallel-degree-input').val(degree);
						} else {
							$j('#' + that.id + '-index-advance-parallel-degree-input').val('');
						}
						if(reverse !== 'null') {
							$j('#' + that.id + '-index-advance-reverse-select').val(reverse);
						} else {
							$j('#' + that.id + '-index-advance-reverse-select').val('No Reverse');
						}

						$j('#' + that.id + '-index-advance-tablespace-select').empty();
						that.tablespacesList.forEach(function(item) {
							$j('#' + that.id + '-index-advance-tablespace-select').append('<option>' + item + '</option>');
						});

						if(tablespaceName !== 'null') {
							$j('#' + that.id + '-index-advance-tablespace-select').val(tablespaceName);
						} else {
							$j('#' + that.id + '-index-advance-tablespace-select').val('');
						}
						if(pctFree !== 'null') {
							$j('#' + that.id + '-index-advance-percent-free-input').val(pctFree);
						} else {
							$j('#' + that.id + '-index-advance-percent-free-input').val('');
						}
						$j('#' + that.id + '-index-advance-percent-used-input').val('');
						if(logging !== 'null') {
							$j('#' + that.id + '-index-advance-logging-select').val(logging);
						} else {
							$j('#' + that.id + '-index-advance-logging-select').val('Off');
						}
						if(initrans !== 'null') {
							$j('#' + that.id + '-index-advance-initrans-input').val(initrans);
						} else {
							$j('#' + that.id + '-index-advance-initrans-input').val('');
						}
						if(bufferMode !== 'null') {
							$j('#' + that.id + '-index-advance-buffer-mode-select').val(bufferMode);
						} else {
							$j('#' + that.id + '-index-advance-buffer-mode-select').val('DEFAULT');
						}
						if(freeLists !== 'null') {
							$j('#' + that.id + '-index-advance-freelists-input').val(freeLists);
						} else {
							$j('#' + that.id + '-index-advance-freelists-input').val('');
						}
						if(freeListGroups !== 'null') {
							$j('#' + that.id + '-index-advance-freelist-groups-input').val(freeListGroups);
						} else {
							$j('#' + that.id + '-index-advance-freelist-groups-input').val('');
						}

						if(initialExtent !== 'null') {
							var result = that.calcUnit(initialExtent);
							var number = result.substr(0, result.indexOf(' '));
							var unit = result.substr(result.indexOf(' ') + 1);
							$j('#' + that.id + '-index-advance-initial-extent-input').val(number);
							$j('#' + that.id + '-index-advance-initial-extent-select').val(unit);
						} else {
							$j('#' + that.id + '-index-advance-initial-extent-input').val('');
							$j('#' + that.id + '-index-advance-initial-extent-select').val(' ');
						}

						if(nextExtent !== 'null') {
							var result = that.calcUnit(nextExtent);
							var number = result.substr(0, result.indexOf(' '));
							var unit = result.substr(result.indexOf(' ') + 1);
							$j('#' + that.id + '-index-advance-next-extent-input').val(number);
							$j('#' + that.id + '-index-advance-next-extent-select').val(unit);
						} else {
							$j('#' + that.id + '-index-advance-next-extent-input').val('');
							$j('#' + that.id + '-index-advance-next-extent-select').val(' ');
						}

						if(minExtent !== 'null') {
							var result = that.calcUnit(minExtent);
							var number = result.substr(0, result.indexOf(' '));
							var unit = result.substr(result.indexOf(' ') + 1);
							$j('#' + that.id + '-index-advance-min-extent-input').val(number);
							$j('#' + that.id + '-index-advance-min-extent-select').val(unit);
						} else {
							$j('#' + that.id + '-index-advance-min-extent-input').val('');
							$j('#' + that.id + '-index-advance-min-extent-select').val(' ');
						}

						if(maxExtent !== 'null') {
							var result = that.calcUnit(maxExtent);
							var number = result.substr(0, result.indexOf(' '));
							var unit = result.substr(result.indexOf(' ') + 1);
							$j('#' + that.id + '-index-advance-max-extent-input').val(number);
							$j('#' + that.id + '-index-advance-max-extent-select').val(unit);
						} else {
							$j('#' + that.id + '-index-advance-max-extent-input').val('');
							$j('#' + that.id + '-index-advance-max-extent-select').val(' ');
						}

						$j('#' + that.id + '-index-advance-max-extent-checkbox').prop('checked', JSON.parse(unlimited));

						if(pctIncrease !== 'null') {
							$j('#' + that.id + '-index-advance-percent-increase-input').val(pctIncrease);
						} else {
							$j('#' + that.id + '-index-advance-percent-increase-input').val('');
						}

						$j('#' + that.id + '-index-advance-schema-select').empty();
						$j('#' + that.id + '-domain-index-type-schema-list').children().each(function() {
							$j('#' + that.id + '-index-advance-schema-select').append('<option>' + this.value + '</option>');
						});

						$j('#' + that.id + '-index-advance-name-input').val(indexName);
						$j('#' + that.id + '-index-advance-schema-select').val(that.schemaName);

						//Key Compression event handler
						$j('#' + that.id + '-index-advance-key-compression-select').on('change', function() {
							that.setAttribute('keyCompression', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
							if(this.value === 'Select') {
								$j('#' + that.id + '-index-advance-key-compression-prefix-length-input').prop('disabled', false);
							} else {
								$j('#' + that.id + '-index-advance-key-compression-prefix-length-input').prop('disabled', true);
							}
						});

						//Prefix length event handler
						$j('#' + that.id + '-index-advance-key-compression-prefix-length-input').on('change', function() {
							that.setAttribute('prefixLength', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Parallel degree event handler
						$j('#' + that.id + '-index-advance-parallel-degree-select').on('change', function() {
							that.setAttribute('parallelDegree', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
							if(this.value === 'Select') {
								$j('#' + that.id + '-index-advance-parallel-degree-input').prop('disabled', false);
							} else {
								$j('#' + that.id + '-index-advance-parallel-degree-input').prop('disabled', true);
							}
						});

						//Degree event handler
						$j('#' + that.id + '-index-advance-parallel-degree-input').on('change', function() {
							that.setAttribute('degree', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Reverse event handler
						$j('#' + that.id + '-index-advance-reverse-select').on('change', function() {
							that.setAttribute('reverse', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Tablespace event handler
						$j('#' + that.id + '-index-advance-tablespace-select').on('change', function() {
							that.setAttribute('tablespaceName', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Pct Free event handler
						$j('#' + that.id + '-index-advance-percent-free-input').on('change', function() {
							that.setAttribute('pctFree', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Logging event handler
						$j('#' + that.id + '-index-advance-logging-select').on('change', function() {
							that.setAttribute('logging', this.value === 'on' ? 'On' : 'Off');
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Initrans event handler
						$j('#' + that.id + '-index-advance-initrans-input').on('change', function() {
							that.setAttribute('initrans', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Buffer Pool event handler
						$j('#' + that.id + '-index-advance-buffer-mode-select').on('change', function() {
							that.setAttribute('bufferMode', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//FreeList event handler
						$j('#' + that.id + '-index-advance-freelists-input').on('change', function() {
							that.setAttribute('freeLists', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//FreeLists Group event handler
						$j('#' + that.id + '-index-advance-freelist-groups-input').on('change', function() {
							that.setAttribute('freeListGroups', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Initial Extent event handler
						$j('#' + that.id + '-index-advance-initial-extent-input').on('change', function() {
							var unit = $j('#' + that.id + '-index-advance-initial-extent-select').val();

							if(unit === null || unit === undefined) {
								that.setAttribute('initialExtent', this.value);
							} else {
								that.setAttribute('initialExtent', that.getCalculatedValue(this.value, unit));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Initial Extent Select event handler
						$j('#' + that.id + '-index-advance-initial-extent-select').on('change', function() {
							var value = $j('#' + that.id + '-index-advance-initial-extent-input').val();

							if(this.value === null || this.value === undefined) {
								that.setAttribute('initialExtent', value);
							} else {
								that.setAttribute('initialExtent', that.getCalculatedValue(value, this.value));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Next Extent event handler
						$j('#' + that.id + '-index-advance-next-extent-input').on('change', function() {
							var unit = $j('#' + that.id + '-index-advance-next-extent-select').val();

							if(unit === null || unit === undefined) {
								that.setAttribute('nextExtent', this.value);
							} else {
								that.setAttribute('nextExtent', that.getCalculatedValue(this.value, unit));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Next Extent Select event handler
						$j('#' + that.id + '-index-advance-next-extent-select').on('change', function() {
							var value = $j('#' + that.id + '-index-advance-next-extent-input').val();

							if(this.value === null || this.value === undefined) {
								that.setAttribute('nextExtent', value);
							} else {
								that.setAttribute('nextExtent', that.getCalculatedValue(value, this.value));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Min Extent event handler
						$j('#' + that.id + '-index-advance-min-extent-input').on('change', function() {
							var unit = $j('#' + that.id + '-index-advance-min-extent-select').val();

							if(unit === null || unit === undefined) {
								that.setAttribute('minExtent', this.value);
							} else {
								that.setAttribute('minExtent', that.getCalculatedValue(this.value, unit));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Min Extent Select event handler
						$j('#' + that.id + '-index-advance-min-extent-select').on('change', function() {
							var value = $j('#' + that.id + '-index-advance-min-extent-input').val();

							if(this.value === null || this.value === undefined) {
								that.setAttribute('minExtent', value);
							} else {
								that.setAttribute('minExtent', that.getCalculatedValue(value, this.value));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Max Extent event handler
						$j('#' + that.id + '-index-advance-max-extent-input').on('change', function() {
							var unit = $j('#' + that.id + '-index-advance-max-extent-select').val();

							if(unit === null || unit === undefined) {
								that.setAttribute('maxExtent', this.value);
							} else {
								that.setAttribute('maxExtent', that.getCalculatedValue(this.value, unit));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Max Extent Select event handler
						$j('#' + that.id + '-index-advance-max-extent-select').on('change', function() {
							var value = $j('#' + that.id + '-index-advance-max-extent-input').val();

							if(this.value === null || this.value === undefined) {
								that.setAttribute('maxExtent', value);
							} else {
								that.setAttribute('maxExtent', that.getCalculatedValue(value, this.value));
							}
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Unlimited event handler
						$j('#' + that.id + '-index-advance-max-extent-checkbox').on('change', function() {
							that.setAttribute('unlimited', this.value === 'on' ? 'true' : 'false');
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});

						//Pct Increase event handler
						$j('#' + that.id + '-index-advance-percent-increase-input').on('change', function() {
							that.setAttribute('pctIncrease', this.value);
							var mode = that.getAttribute('mode');
							if(mode !== 'NEW' && mode !== 'CHANGED') {
								that.setAttribute('mode', 'CHANGED');
							}
						});
					},
					onClose: function(event) {
						w2ui[that.id + '-index-advance-tabs'].destroy();
					}
				});
			});

			this.expressionsGrid = $j('#' + this.id + '-expressions-grid').w2grid({
											name: this.id + '-expressions-grid',
											header: 'Expressions',
											show: { header: true,
											      toolbar: true,
											      toolbarSave: true,
											      lineNumbers: true
											    },
											reorderRows: true,
											columns: [
												{field: 'expression', caption: 'Expression', size: '250px',
													editable: { type: 'combo', items: this.columnsList, filter: false }
												},
												{field: 'order', caption: 'Order', size: '100%',
													editable: { type: 'select', items: ['ASC', 'DESC', 'None'] }
												}
											],
											toolbar: {
												items: [
													{type: 'break'},
													{id: this.id + '-grid-toolbar-add-expression', type: 'button', icon: 'add_icon'},
													{id: this.id + '-grid-toolbar-delete-expression', type: 'button', icon: 'delete_icon'}
												],
												onClick: function(event) {
													var grid = w2ui[that.id + '-expressions-grid'];
													if(event.target === that.id + '-grid-toolbar-add-expression') {
														grid.add({recid: grid.records.length + 1, expression: that.columnsList[0], order: 'ASC'})
														that.setAttribute('indexExpressions', JSON.stringify(grid.records));
														var mode = that.getAttribute('mode');
														if(mode !== 'NEW' && mode !== 'CHANGED') {
															that.setAttribute('mode', 'CHANGED');
														}
													} else if(event.target === that.id + '-grid-toolbar-delete-expression') {
														var records = grid.getSelection();
														records.forEach(function(record) {
															grid.remove(record);
														});
														that.setAttribute('indexExpressions', JSON.stringify(grid.records));
														var mode = that.getAttribute('mode');
														if(mode !== 'NEW' && mode !== 'CHANGED') {
															that.setAttribute('mode', 'CHANGED');
														}
													}
												}
											},
											onSave: function(event) {
												var grid = this;
												event.onComplete = function() {
													that.setAttribute('indexExpressions', JSON.stringify(grid.records));
													var mode = that.getAttribute('mode');
													if(mode !== 'NEW' && mode !== 'CHANGED') {
														that.setAttribute('mode', 'CHANGED');
													}
												};
											}
										});

			$j('#' + this.id + '-indexes-list').on('click', function() {
				var indexName = this.value;
				var selectedOption = $j(this)[0].selectedOptions[0];
				var indexType = selectedOption.getAttribute('indexType');

				$j('#' + that.id + '-index-name').val(indexName);
				$j('#' + that.id + '-index-type-select').val(indexType).trigger('change');

				if(indexType === 'Domain') {
					var iTypeOwner = selectedOption.getAttribute('iTypeOwner');
					var iTypeName = selectedOption.getAttribute('iTypeName');
					var parameters = selectedOption.getAttribute('parameters');

					if(parameters === 'null') {
						parameters = '';
					}

					$j('#' + that.id + '-domain-index-type-schema-input').val(iTypeOwner).trigger('change');
					$j('#' + that.id + '-domain-index-type-input').val(iTypeName);
					$j('#' + that.id + '-domain-index-type-parameters-input').val(parameters);
				}
				that.fireIndexSelectedEvent(indexName);
			});

			//Index Type Schema event handlers
			$j('#' + this.id + '-domain-index-type-schema-input').on('change', function() {
				that.fireIndexTypeSchemaChangedEvent(this.value);
				that.setAttribute('iTypeOwner', this.value);
				var mode = that.getAttribute('mode');
				if(mode !== 'NEW' && mode !== 'CHANGED') {
					that.setAttribute('mode', 'CHANGED');
				}
			});

			$j('#' + this.id + '-domain-index-type-schema-input').on('click', function() {
				this.value = '';
				that.setAttribute('iTypeOwner', this.value);
			});

			//Index Type event handlers
			$j('#' + this.id + '-domain-index-type-input').on('change', function() {
				that.setAttribute('iTypeName', this.value);
				var mode = that.getAttribute('mode');
				if(mode !== 'NEW' && mode !== 'CHANGED') {
					that.setAttribute('mode', 'CHANGED');
				}
			});

			$j('#' + this.id + '-domain-index-type-input').on('click', function() {
				this.value = '';
				that.setAttribute('iTypeName', this.value);
			});

			//Index type parameters event handlers
			$j('#' + this.id + '-domain-index-type-parameters-input').on('change', function() {
				that.setAttribute('parameters', this.value);
				var mode = that.getAttribute('mode');
				if(mode !== 'NEW' && mode !== 'CHANGED') {
					that.setAttribute('mode', 'CHANGED');
				}
			});

			//Index add button event handler
			$j('#' + this.id + '-index-add-button').on('click', function() {
				that.addNewIndex();
			});

			//Index drop button event handler
			$j('#' + this.id + '-index-drop-button').on('click', function() {
				that.dropIndexes();
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
	isExpressionsGridCreated: function() {
		if(this.expressionsGrid === null) {
			return false;
		} else {
			return true;
		}
	},
	getExpressionsGrid: function() {
		return this.expressionsGrid;
	},
	populateExpressionGrid: function(result) {
		var selectedOption = $j('#' + this.id + '-indexes-list')[0].selectedOptions[0];
		var expressions = selectedOption.getAttribute('indexExpressions');

		if(expressions === null || expressions === undefined) {
			this.expressionsGrid.records = result;
			this.expressionsGrid.refresh();
			this.expressionsGrid.unlock();

			this.setAttribute('indexExpressions', JSON.stringify(result));
		} else {
			this.expressionsGrid.records = JSON.parse(expressions);
			this.expressionsGrid.refresh();
			this.expressionsGrid.unlock();
		}
	},
	getPanel: function() {
		return this.layout;
	},
	selectIndex: function(index) {
		$j('#' + this.id + '-indexes-list')[0].selectedIndex = index;
		$j('#' + this.id + '-indexes-list').trigger('click');
	},
	setAttribute: function(attrName, attrValue) {
		var selectedOption = $j('#' + this.id + '-indexes-list')[0].selectedOptions[0];
		selectedOption.setAttribute(attrName, attrValue);
	},
	getAttribute: function(attrName) {
		var selectedOption = $j('#' + this.id + '-indexes-list')[0].selectedOptions[0];
		return selectedOption.getAttribute(attrName);
	},
	populateIndexesList: function(list) {
		$j('#' + this.id + '-indexes-list').empty();
		var that = this;
		
		list.forEach(function(item) {
			var copy = Object.clone(item);
			that.originalData.push(copy);

			var recid = item['recid']
			var indexName = item['indexName'];
			var indexType = item['indexType'];
			var iTypeOwner = item['iTypeOwner'];
			var iTypeName = item['iTypeName'];
			var parameters = item['parameters'];
			var keyCompression = item['keyCompression'];
			var prefixLength = item['prefixLength'];
			var parallelDegree = item['parallelDegree'];
			var degree = item['degree'];
			var reverse = item['reverse'];
			var tablespaceName = item['tablespaceName'];
			var pctFree = item['pctFree'];
			var logging = item['logging'];
			var initrans = item['initrans'];
			var bufferMode = item['bufferMode'];
			var freeLists = item['freeLists'];
			var freeListGroups = item['freeListGroups'];
			var initialExtent = item['initialExtent'];
			var nextExtent = item['nextExtent'];
			var minExtent = item['minExtent'];
			var maxExtent = item['maxExtent'];
			var unlimited = item['unlimited'];
			var pctIncrease = item['pctIncrease'];

			$j('#' + that.id + '-indexes-list').append('<option ' 
														+ 'recid="' + recid + '" '
														+ 'indexType="' + indexType + '" '
														+ 'iTypeOwner="' + iTypeOwner + '" '
														+ 'iTypeName="' + iTypeName + '" '
														+ 'parameters="' + parameters + '" '
														+ 'keyCompression="' + keyCompression + '" '
														+ 'prefixLength="' + prefixLength + '" '
														+ 'parallelDegree="' + parallelDegree + '" '
														+ 'degree="' + degree + '" '
														+ 'reverse="' + reverse + '" '
														+ 'tablespaceName="' + tablespaceName + '" '
														+ 'pctFree="' + pctFree + '" '
														+ 'logging="' + logging + '" '
														+ 'initrans="' + initrans + '" '
														+ 'bufferMode="' + bufferMode + '" '
														+ 'freeLists="' + freeLists + '" '
														+ 'freeListGroups="' + freeListGroups + '" '
														+ 'initialExtent="' + initialExtent + '" '
														+ 'nextExtent="' + nextExtent + '" '
														+ 'minExtent="' + minExtent + '" '
														+ 'maxExtent="' + maxExtent + '" '
														+ 'unlimited="' + unlimited + '" '
														+ 'pctIncrease="' + pctIncrease + '" '
														+ '>' + indexName + '</option>');
		});
	},
	addIndexSelectedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.indexSelectedEventListeners.push(listener);
		}
	},
	removeIndexSelectedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.indexSelectedEventListeners.indexOf(listener);
			this.indexSelectedEventListeners.splice(index, 1);
		}
	},
	fireIndexSelectedEvent: function(indexName) {
		this.indexSelectedEventListeners.forEach(function(listener) {
			listener(indexName);
		});
	},
	addIndexTypeSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.indexTypeSchemaChangedEventListeners.push(listener);
		}
	},
	removeIndexTypeSchemaChangedEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.indexTypeSchemaChangedEventListeners.indexOf(listener);
			this.indexTypeSchemaChangedEventListeners.splice(index, 1);
		}
	},
	fireIndexTypeSchemaChangedEvent: function(schemaName) {
		this.indexTypeSchemaChangedEventListeners.forEach(function(listener) {
			listener(schemaName);
		});
	},
	populateIndexTypeSchemasList: function(list) {
		$j('#' + this.id + '-domain-index-type-schema-list').empty();

		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-domain-index-type-schema-list').append('<option>' + item + '</option>');
		});
	},
	populateIndexTypesList: function(list) {
		$j('#' + this.id + '-domain-index-type-list').empty();

		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-domain-index-type-list').append('<option>' + item + '</option>');
		});
	},
	addNewIndex: function() {
		var newIndexName = this.label + '_INDEX' + this.newIndexCounter++;
		$j('#' + this.id + '-indexes-list').append('<option indexType="Non-Unique" mode="NEW">' + newIndexName + '</option>');

		var newItemIndex = $j('#' + this.id + '-indexes-list').children().length;
		this.selectIndex(newItemIndex - 1);

		this.expressionsGrid.clear();

		$j('#' + this.id + '-domain-index-type-schema-input').val('SYS').trigger('change');
		$j('#' + this.id + '-domain-index-type-input').val('');
		$j('#' + this.id + '-domain-index-type-parameters-input').val('');
	},
	dropIndexes: function() {
		var selectedOption = $j('#' + this.id + '-indexes-list')[0].selectedOptions[0];
		var mode = selectedOption.getAttribute('mode');
		if(mode !== 'NEW') {
			this.droppedIndexes.push(selectedOption.value);
		}
		selectedOption.remove();
		if($j('#' + this.id + '-indexes-list')[0].length > 0) {
			$j('#' + this.id + '-indexes-list')[0].selectedIndex = 0;
			$j('#' + this.id + '-indexes-list').trigger('click');
		}
	},
	populateColumnsList: function(list) {
		this.columnsList = list;
	},
	calcUnit: function(value) { 
		var units = [' ', 'K', 'M', 'G', 'T']; 
		var uIndex = 0; 
		while(value >= 1024) { 
			value = value/1024; 
			uIndex++;
		} 
		return value + ' ' + units[uIndex];
	},
	getCalculatedValue(value, unit) {
		if(unit === 'K') {
			return parseInt(value) * 1024;
		} else if(unit === 'M') {
			return parseInt(value) * 1024 * 1024;
		} else if(unit === 'G') {
			return parseInt(value) * 1024 * 1024 * 1024;
		} else if(unit === 'T') {
			return parseInt(value) * 1024 * 1024 * 1024 * 1024;
		}
	},
	populateTablespacesList: function(list) {
		this.tablespacesList = list;
	},
	getOriginalRecord: function(recid) {
		var recordToReturn = null;
		this.originalData.forEach(function(record) {
			if(record['recid'] === parseInt(recid)) {
				recordToReturn = record;
			}
		});
		return recordToReturn;
	},
	getChanges: function() {
		var ddlArray = [];
		var deltaChanges = [];
		var that = this;

		if(!this.isPanelCreated()) {
			return ddlArray;
		}

		var optionList = $j('#' + this.id + '-indexes-list').children();
		optionList.each(function(){
			var option = $j(this);
			var indexName = option.val();
			var recid = option.attr('recid');
			var mode = option.attr('mode');
			var indexType = option.attr('indexType');
			var iTypeOwner = option.attr('iTypeOwner');
			var iTypeName = option.attr('iTypeName');
			var parameters = option.attr('parameters');
			var keyCompression = option.attr('keyCompression');
			var prefixLength = option.attr('prefixLength');
			var parallelDegree = option.attr('parallelDegree');
			var degree = option.attr('degree');
			var reverse = option.attr('reverse');
			var tablespaceName = option.attr('tablespaceName');
			var pctFree = option.attr('pctFree');
			var logging = option.attr('logging');
			var initrans = option.attr('initrans');
			var bufferMode = option.attr('bufferMode');
			var freeLists = option.attr('freeLists');
			var freeListGroups = option.attr('freeListGroups');
			var initialExtent = option.attr('initialExtent');
			var nextExtent = option.attr('nextExtent');
			var minExtent = option.attr('minExtent');
			var maxExtent = option.attr('maxExtent');
			var unlimited = option.attr('unlimited');
			var pctIncrease = option.attr('pctIncrease');
			var indexExpressions = null;
			if(option.attr('indexExpressions') !== undefined) {
				indexExpressions = JSON.parse(option.attr('indexExpressions'));
			}

			var originalRecord = that.getOriginalRecord(recid);
			var changedRecord = {};
			changedRecord['mode'] = mode;
			if(originalRecord !== null) {
				changedRecord['indexName'] = indexName !== originalRecord['indexName'] ? indexName : null;
				changedRecord['originalIndexName'] = originalRecord['indexName'];
				changedRecord['indexType'] = indexType !== originalRecord['indexType'] ? indexType : null;
				changedRecord['originalIndexType'] = originalRecord['indexType'];
				changedRecord['iTypeOwner'] = iTypeOwner !== originalRecord['iTypeOwner'] ? iTypeOwner : null;
				changedRecord['iTypeName'] = iTypeName !== originalRecord['iTypeName'] ? iTypeName : null;
				changedRecord['parameters'] = parameters !== originalRecord['parameters'] ? parameters : null;
				changedRecord['indexExpressions'] = indexExpressions;

				changedRecord['keyCompression'] = keyCompression !== originalRecord['keyCompression'] ? keyCompression : originalRecord['keyCompression'];
				changedRecord['prefixLength'] = prefixLength !== originalRecord['prefixLength'] ? prefixLength : originalRecord['prefixLength'];
				changedRecord['parallelDegree'] = parallelDegree !== originalRecord['parallelDegree'] ? parallelDegree : originalRecord['parallelDegree'];
				changedRecord['degree'] = degree !== originalRecord['degree'] ? degree : originalRecord['degree'];
				changedRecord['reverse'] = reverse !== originalRecord['reverse'] ? reverse : originalRecord['reverse'];
				changedRecord['tablespaceName'] = tablespaceName !== originalRecord['tablespaceName'] ? tablespaceName : originalRecord['tablespaceName'];
				changedRecord['pctFree'] = pctFree !== originalRecord['pctFree'] ? pctFree : originalRecord['pctFree'];
				changedRecord['logging'] = logging !== originalRecord['logging'] ? logging : originalRecord['logging'];
				changedRecord['initrans'] = initrans !== originalRecord['initrans'] ? initrans : originalRecord['initrans'];
				changedRecord['bufferMode'] = bufferMode !== originalRecord['bufferMode'] ? bufferMode : originalRecord['bufferMode'];
				changedRecord['freeLists'] = freeLists !== originalRecord['freeLists'] ? freeLists : originalRecord['freeLists'];
				changedRecord['freeListGroups'] = freeListGroups !== originalRecord['freeListGroups'] ? freeListGroups : originalRecord['freeListGroups'];
				changedRecord['initialExtent'] = initialExtent !== originalRecord['initialExtent'] ? initialExtent : originalRecord['initialExtent'];
				changedRecord['nextExtent'] = nextExtent !== originalRecord['nextExtent'] ? nextExtent : originalRecord['nextExtent'];
				changedRecord['minExtent'] = minExtent !== originalRecord['minExtent'] ? minExtent : originalRecord['minExtent'];
				changedRecord['maxExtent'] = maxExtent !== originalRecord['maxExtent'] ? maxExtent : originalRecord['maxExtent'];
				changedRecord['unlimited'] = JSON.parse(unlimited !== originalRecord['unlimited'] ? unlimited : originalRecord['unlimited']);
				changedRecord['pctIncrease'] = pctIncrease !== originalRecord['pctIncrease'] ? pctIncrease : originalRecord['pctIncrease'];
			} else {
				changedRecord['indexName'] = indexName;
				changedRecord['originalIndexName'] = indexName;
				changedRecord['indexType'] = indexType;
				changedRecord['iTypeOwner'] = iTypeOwner;
				changedRecord['iTypeName'] = iTypeName;
				changedRecord['parameters'] = parameters;
				changedRecord['indexExpressions'] = indexExpressions;

				changedRecord['keyCompression'] = keyCompression;
				changedRecord['prefixLength'] = prefixLength;
				changedRecord['parallelDegree'] = parallelDegree;
				changedRecord['degree'] = degree;
				changedRecord['reverse'] = reverse;
				changedRecord['tablespaceName'] = tablespaceName;
				changedRecord['pctFree'] = pctFree;
				changedRecord['logging'] = logging;
				changedRecord['initrans'] = initrans;
				changedRecord['bufferMode'] = bufferMode;
				changedRecord['freeLists'] = freeLists;
				changedRecord['freeListGroups'] = freeListGroups;
				changedRecord['initialExtent'] = initialExtent;
				changedRecord['nextExtent'] = nextExtent;
				changedRecord['minExtent'] = minExtent;
				changedRecord['maxExtent'] = maxExtent;
				if(unlimited !== undefined && unlimited !== null) {
					changedRecord['unlimited'] = JSON.parse(unlimited);
				}
				changedRecord['pctIncrease'] = pctIncrease
			}
			deltaChanges.push(changedRecord);
		});

		ddlArray = ddlArray.concat(this.getDroppedIndexes());
		ddlArray = ddlArray.concat(this.getIndexNameChanges(deltaChanges));
		ddlArray = ddlArray.concat(this.getIndexChanges(deltaChanges));
		return ddlArray;
	},
	getDroppedIndexes: function() {
		var ddlArray = [];

		this.droppedIndexes.forEach(function(index) {
			var ddl = 'DROP INDEX ' + index + ';';
			ddlArray.push(ddl);
		});

		return ddlArray;
	},
	getIndexNameChanges: function(deltaChanges) {
		var ddlArray = [];
		var that = this;

		deltaChanges.forEach(function(record) {
			if(record['indexName'] !== null && record['mode'] !== 'NEW') {
				var ddl = 'ALTER INDEX ' + record['originalIndexName'];
				ddl += '\nRENAME TO ' + record['indexName'];
				ddlArray.push(ddl);
			}
		});

		return ddlArray;
	},
	getIndexChanges: function(deltaChanges) {
		var ddlArray = [];
		var that = this;

		deltaChanges.forEach(function(record) {
			if(record['indexType'] !== null || record['mode'] === 'NEW' || record['mode'] === 'CHANGED') {

				if(record['mode'] !== 'NEW') {
					var ddl = 'DROP INDEX ' + record['originalIndexName'] + ';';
					ddlArray.push(ddl);
				}

				ddl = 'CREATE ';
				if(record['indexType'] === 'Unique') {
					ddl += 'UNIQUE ';
				} else if(record['indexType'] === 'Bitmap') {
					ddl += 'BITMAP ';
				}
				ddl += 'INDEX ' + (record['indexName'] !== null ? record['indexName'] : record['originalIndexName']);
				ddl += ' ON ' + that.label + '(';
				var indexExpressions = record['indexExpressions'];
				var columns = '';
				indexExpressions.forEach(function(indexExpression) {
					if(columns === '') {
						columns = indexExpression['expression'] + ' ' + indexExpression['order'];
					} else {
						columns += ', ' + indexExpression['expression'] + ' ' + indexExpression['order'];
					}
				});
				ddl += columns;
				ddl += ')';
				if(record['indexType'] !== 'Domain' && record['originalIndexType'] !== 'Domain') {
					if(record['logging'] === 'On') {
						ddl += '\nLOGGING';
					}
					if(record['tablespaceName'] !== null && record['tablespaceName'] !== undefined) {
						ddl += '\nTABLESPACE ' + record['tablespaceName'];
					}
					if(record['pctFree'] !== null && record['pctFree'] !== undefined) {
						ddl += '\nPCTFREE ' + record['pctFree'];
					}
					if(record['initrans'] !== null && record['initrans'] !== undefined) {
						ddl += '\nINITRANS ' + record['initrans'];
					}
					if((record['initialExtent'] !== null && record['initialExtent'] !== undefined)
						|| (record['nextExtent'] !== null && record['nextExtent'] !== undefined)
						|| (record['minExtent'] !== null && record['minExtent'] !== undefined)
						|| (record['maxExtent'] !== null && record['maxExtent'] !== undefined)
						|| (record['unlimited'] !== null && record['unlimited'] !== undefined)
						|| (record['bufferMode'] !== null && record['bufferMode'] !== undefined)) {
						ddl += '\nSTORAGE';
						ddl += '\n(';
						if(record['initialExtent'] !== null && record['initialExtent'] !== undefined) {
							ddl += '\n\tINITIAL ' + record['initialExtent'];
						}
						if(record['nextExtent'] !== null && record['nextExtent'] !== undefined) {
							ddl += '\n\tNEXT ' + record['nextExtent'];
						}
						if(record['minExtent'] !== null && record['minExtent'] !== undefined) {
							ddl += '\n\tMINEXTENTS ' + record['minExtent'];
						}
						if(record['unlimited'] === true) {
							ddl += '\n\tMAXEXTENTS UNLIMITED';
						} else if(record['maxExtent'] !== null && record['maxExtent'] !== undefined) {
							ddl += '\n\tMAXEXTENTS ' + record['maxExtent'];
						}
						if(record['bufferMode'] !== null && record['bufferMode'] !== undefined) {
							ddl += '\n\tBUFFER_POOL ' + record['bufferMode'];
						}
						ddl += '\n)';
					}
				
					if(record['parallelDegree'] === 'None') {
						ddl += '\nNOPARALLEL';
					} else if(record['parallelDegree'] === 'Default') {
						ddl += '\nPARALLEL';
					} else if(record['parallelDegree'] === 'Select') {
						ddl += '\nPARALLEL ' + record['degree'];
					}
					if(record['indexType'] === 'Unique' || record['indexType'] === 'Non-Unique'
						|| record['originalIndexType'] === 'Unique' || record['originalIndexType'] === 'Non-Unique') {
						if(record['keyCompression'] === 'Select') {
							ddl += '\nCOMPRESS ' + record['prefixLength'];
						} else if(record['keyCompression'] === 'Default') {
							ddl += '\nCOMPRESS';
						}
						if(record['reverse'] === 'Reverse') {
							ddl += '\nREVERSE';
						}
					}
				} else {
					ddl += ' INDEXTYPE IS ' + record['iTypeOwner'] + '.' + record['iTypeName'];
					if(record['parameters'] !== null && record['parameters'] !== undefined) {
						ddl += '\nPARAMETERS(\'' + record['parameters'] + '\')';
					}
					ddl += '\nNOPARALLEL';
				}
				ddl += ';';
				ddlArray.push(ddl);
				ddl = '';
			}
		});

		return ddlArray;
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

/**
 * StoragePanelUI: This class provides the user interface to edit the storage
 * of an given table
 * @constructor
 * @param {String} id: A unique identifier to create HTML contents
 * @param {String} label: A label to be shown on the required widgets
 */
var NewTableStoragePanelUI = Class.create({
	id: null,
	label: null,
	layout: null,
	record: {},
	originalData: {},
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.record = {};
		this.originalData = {};
	},
	createPanel: function() {
		var that = this;
		if(this.layout === null) {
			var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
			this.layout = $j('#' + this.id).w2layout({
													name: this.id,
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' }
											        ]
												});

			var mainHtml = `
				<div style='width: 100%; height: 100%;'>
					<div style='padding: 10px 5px;'>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-parallel-degree-select'>Parallel Degree:</label>
							<select id='` + this.id + `-parallel-degree-select'>
								<option>--Not Specified--</option>
								<option selected>None</option>
								<option>Default</option>
								<option>Select</option>
							</select>
							<label for='` + this.id + `-parallel-degree-input'>Degree:</label>
							<input id='` + this.id + `-parallel-degree-input' style='width: 340px;' />
						</div>
						<hr />
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-tablespace-select'>Tablespace:</label>
							<select id='` + this.id + `-tablespace-select' style='width: 540px; margin-left: 10px;'>
							</select>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-percent-free-input'>Percent Free:</label>
							<input id='` + this.id + `-percent-free-input' style='width: 100px;' />
							<label for='` + this.id + `-percent-used-input' style='margin-left: 20px;'>Percent Used:</label>
							<input id='` + this.id + `-percent-used-input' style='width: 100px;' />
							<a href='#' onclick="
									$j(this).w2overlay({
										openAbove: true,
										tipLeft: 12,
										html: '<div style=\\'padding: 10px;\\'>Help on Percent Free & Used in Index Storage</div>'
									});
								" style="float: right;"><i class='assist_icon' /></a>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-logging-select'>Logging:</label>
							<select id='` + this.id + `-logging-select' style='margin-left: 28px; width: 100px;'>
								<option>On</option>
								<option>Off</option>
							</select>
							<label for='` + this.id + `-initrans-input' style='margin-left: 20px;'>Initrans:</label>
							<input id='` + this.id + `-initrans-input' style='margin-left: 32px; width: 100px;' />
							<a href='#' onclick="
									$j(this).w2overlay({
										openAbove: true,
										tipLeft: 12,
										html: '<div style=\\'padding: 10px;\\'>Help on Logging and Initrans options of an Index Storage</div>'
									});
								" style="float: right;"><i class='assist_icon' /></a>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-buffer-mode-select'>Buffer Mode:</label>
							<select id='` + this.id + `-buffer-mode-select' style='margin-left: 2px; width: 100px;'>
								<option>DEFAULT</option>
								<option>KEEP</option>
								<option>RECYCLE</option>
							</select>
							<label for='` + this.id + `-freelists-input' style='margin-left: 20px;'>Freelists:</label>
							<input id='` + this.id + `-freelists-input' style='margin-left: 29px; width: 100px;' />
							<label for='` + this.id + `-freelist-groups-input' style='margin-left: 20px;'>Freelist Groups:</label>
							<input id='` + this.id + `-freelist-groups-input' style='width: 100px;' />
							<a href='#' onclick="
									$j(this).w2overlay({
										openAbove: true,
										tipLeft: 12,
										html: '<div style=\\'padding: 10px;\\'>Help on Buffer Mode, Freelists <br/> & Freelist Groups option of an Index</div>'
									});
								"><i class='assist_icon' /></a>
						</div>
						<hr />
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-initial-extent-input'>Initial Extent:</label>
							<input id='` + this.id + `-initial-extent-input' style='margin-left: 24px; width: 100px;' />
							<select id='` + this.id + `-initial-extent-select'>
								<option> </option>
								<option>K</option>
								<option>M</option>
								<option>G</option>
								<option>T</option>
							</select>
							<label for='` + this.id + `-next-extent-input' style='margin-left: 16px;'>Next Extent:</label>
							<input id='` + this.id + `-next-extent-input' style='width: 222px;' />
							<select id='` + this.id + `-next-extent-select'>
								<option> </option>
								<option>K</option>
								<option>M</option>
								<option>G</option>
								<option>T</option>
							</select>
							<a href='#' onclick="
									$j(this).w2overlay({
										openAbove: true,
										tipLeft: 12,
										html: '<div style=\\'padding: 10px;\\'>Help on Initial & Next Extent option of Index Storage</div>'
									});
								"><i class='assist_icon' /></a>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-min-extent-input'>Min Extent:</label>
							<input id='` + this.id + `-min-extent-input' style='margin-left: 37px; width: 100px;'/>
							<select id='` + this.id + `-min-extent-select'>
								<option> </option>
								<option>K</option>
								<option>M</option>
								<option>G</option>
								<option>T</option>
							</select>
							<label for='` + this.id + `-max-extent-input' style='margin-left: 16px;'>Max Extent:</label>
							<input id='` + this.id + `-max-extent-input' style='margin-left: 5px; width: 128px;'/>
							<select id='` + this.id + `-max-extent-select'>
								<option> </option>
								<option>K</option>
								<option>M</option>
								<option>G</option>
								<option>T</option>
							</select>
							<input type='checkbox' id='` + this.id + `-max-extent-checkbox' style='margin-left: 16px;'>Unlimited</input>
							<a href='#' onclick="
									$j(this).w2overlay({
										openAbove: true,
										tipLeft: 12,
										html: '<div style=\\'padding: 10px;\\'>Help on Min & Max Extent options of Index Storage</div>'
									});
								"><i class='assist_icon' /></a>
						</div>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-percent-increase-input'>Percent Increase:</label>
							<input id='` + this.id + `-percent-increase-input' style='width: 145px;'/>
							<a href='#' onclick="
									$j(this).w2overlay({
										openAbove: true,
										tipLeft: 12,
										html: '<div style=\\'padding: 10px;\\'>Help on Percent Increase options of Index Storage</div>'
									});
								" style="float: right;"><i class='assist_icon' /></a>
						</div>
					</div>
				</div>
			`;
			this.layout.content('main', mainHtml);

			$j('#' + this.id + '-parallel-degree-select').on('change', function() {
				if(this.value === 'Select') {
					$j('#' + that.id + '-parallel-degree-input').prop('disabled', false);
				} else {
					$j('#' + that.id + '-parallel-degree-input').prop('disabled', true);
				}
			});

			$j('#' + this.id + '-max-extent-checkbox').on('change', function() {
				if(this.checked) {
					$j('#' + that.id + '-max-extent-input').prop('disabled', true);
					$j('#' + that.id + '-max-extent-select').prop('disabled', true);
					$j('#' + that.id + '-max-extent-input').val('');
					$j('#' + that.id + '-max-extent-select').val('');
				} else {
					$j('#' + that.id + '-max-extent-input').prop('disabled', false);
					$j('#' + that.id + '-max-extent-select').prop('disabled', false);
					$j('#' + that.id + '-max-extent-input').val('1');
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
	populateTableStorage: function(result) {
		this.record = result[0];
		this.originalData = Object.clone(this.record);

		var parallelDegree = this.record['parallelDegree'];
		var degree = this.record['degree'];
		var tablespaceName = this.record['tablespaceName'];
		var pctFree = this.record['pctFree'];
		var pctUsed = this.record['pctUsed'];
		var logging = this.record['logging'];
		var initrans = this.record['initrans'];
		var bufferMode = this.record['bufferMode'];
		var freeLists = this.record['freeLists'];
		var freeListGroups = this.record['freeListGroups'];
		var initialExtent = this.record['initialExtent'];
		var nextExtent = this.record['nextExtent'];
		var minExtent = this.record['minExtent'];
		var maxExtent = this.record['maxExtent'];
		var unlimited = this.record['unlimited'];
		var pctIncrease = this.record['pctIncrease'];

		if(parallelDegree !== 'null' && parallelDegree !== null) {
			$j('#' + this.id + '-parallel-degree-select').val(parallelDegree);
		} else {
			$j('#' + this.id + '-parallel-degree-select').val(' ');
		}
		if(degree !== 'null' && degree !== null) {
			$j('#' + this.id + '-parallel-degree-input').val(degree);
		} else {
			$j('#' + this.id + '-parallel-degree-input').val('');
		}
		if(tablespaceName !== 'null' && tablespaceName !== null) {
			$j('#' + this.id + '-tablespace-select').val(tablespaceName);
		} else {
			$j('#' + this.id + '-tablespace-select').val('');
		}
		if(pctFree !== 'null' && pctFree !== null) {
			$j('#' + this.id + '-percent-free-input').val(pctFree);
		} else {
			$j('#' + this.id + '-percent-free-input').val('');
		}
		if(pctUsed !== 'null' && pctUsed !== null) {
			$j('#' + this.id + '-percent-used-input').val(pctUsed);
		} else {
			$j('#' + this.id + '-percent-used-input').val('');
		}
		if(logging !== 'null' && logging !== null) {
			$j('#' + this.id + '-logging-select').val(logging);
		} else {
			$j('#' + this.id + '-logging-select').val('');
		}
		if(initrans !== 'null' && initrans !== null) {
			$j('#' + this.id + '-initrans-input').val(initrans);
		} else {
			$j('#' + this.id + '-initrans-input').val('');
		}
		if(bufferMode !== 'null' && bufferMode !== null) {
			$j('#' + this.id + '-buffer-mode-select').val(bufferMode);
		} else {
			$j('#' + this.id + '-buffer-mode-select').val('');
		}
		if(freeLists !== 'null' && freeLists !== null) {
			$j('#' + this.id + '-freelists-input').val(freeLists);
		} else {
			$j('#' + this.id + '-freelists-input').val('');
		}
		if(freeListGroups !== 'null' && freeListGroups !== null) {
			$j('#' + this.id + '-freelist-groups-input').val(freeListGroups);
		} else {
			$j('#' + this.id + '-freelist-groups-input').val('');
		}
		if(initialExtent !== 'null' && initialExtent !== null) {
			var result = this.calcUnit(initialExtent);
			var number = result.substr(0, result.indexOf(' '));
			var unit = result.substr(result.indexOf(' ') + 1);
			$j('#' + this.id + '-initial-extent-input').val(number);
			$j('#' + this.id + '-initial-extent-select').val(unit);
		} else {
			$j('#' + this.id + '-initial-extent-input').val('');
			$j('#' + this.id + '-initial-extent-select').val(' ');
		}
		if(nextExtent !== 'null' && nextExtent !== null) {
			var result = this.calcUnit(nextExtent);
			var number = result.substr(0, result.indexOf(' '));
			var unit = result.substr(result.indexOf(' ') + 1);
			$j('#' + this.id + '-next-extent-input').val(number);
			$j('#' + this.id + '-next-extent-select').val(unit);
		} else {
			$j('#' + this.id + '-next-extent-input').val('');
			$j('#' + this.id + '-next-extent-select').val(' ');
		}
		if(minExtent !== 'null' && minExtent !== null) {
			var result = this.calcUnit(minExtent);
			var number = result.substr(0, result.indexOf(' '));
			var unit = result.substr(result.indexOf(' ') + 1);
			$j('#' + this.id + '-min-extent-input').val(number);
			$j('#' + this.id + '-min-extent-select').val(unit);
		} else {
			$j('#' + this.id + '-min-extent-input').val('');
			$j('#' + this.id + '-min-extent-select').val(' ');
		}
		if(maxExtent !== 'null' && maxExtent !== null) {
			var result = this.calcUnit(maxExtent);
			var number = result.substr(0, result.indexOf(' '));
			var unit = result.substr(result.indexOf(' ') + 1);
			$j('#' + this.id + '-max-extent-input').val(number);
			$j('#' + this.id + '-max-extent-select').val(unit);
		} else {
			$j('#' + this.id + '-max-extent-input').val('');
			$j('#' + this.id + '-max-extent-select').val(' ');
		}
		if(unlimited !== 'null') {
			$j('#' + this.id + '-max-extent-checkbox').prop('checked', JSON.parse(unlimited)).trigger('change');
		}
		if(pctIncrease !== 'null' && pctIncrease !== null) {
			$j('#' + this.id + '-percent-increase-input').val(pctIncrease);
		} else {
			$j('#' + this.id + '-percent-increase-input').val('');
		}
	},
	calcUnit: function(value) { 
		var units = [' ', 'K', 'M', 'G', 'T']; 
		var uIndex = 0; 
		while(value >= 1024) { 
			value = value/1024; 
			uIndex++;
		} 
		return value + ' ' + units[uIndex];
	},
	getCalculatedValue: function(value, unit) {
		if(value === null) {
			return null;
		}
		if(unit === null || unit === undefined || unit === '') {
			return parseInt(value);
		} else if(unit === 'K') {
			return parseInt(value) * 1024;
		} else if(unit === 'M') {
			return parseInt(value) * 1024 * 1024;
		} else if(unit === 'G') {
			return parseInt(value) * 1024 * 1024 * 1024;
		} else if(unit === 'T') {
			return parseInt(value) * 1024 * 1024 * 1024 * 1024;
		}
	},
	populateTablespacesList: function(list) {
		$j('#' + this.id + '-tablespace-select').empty();

		var that = this;
		list.forEach(function(item) {
			$j('#' + that.id + '-tablespace-select').append('<option>' + item + '</option>');
		});
	},
	getChanges: function() {
		var ddlArray = [];

		if(!this.isPanelCreated()) {
			return ddlArray;
		}

		var parallelDegree = $j('#' + this.id + '-parallel-degree-select').val();
		var degree = $j('#' + this.id + '-parallel-degree-input').val();
		var tablespaceName = $j('#' + this.id + '-tablespace-select').val();
		var pctFree = $j('#' + this.id + '-percent-free-input').val();
		if(pctFree === '') {
			pctFree = null;
		}
		var pctUsed = $j('#' + this.id + '-percent-used-input').val();
		if(pctUsed === '') {
			pctUsed = null;
		}
		var logging = $j('#' + this.id + '-logging-select').val();
		var initrans = $j('#' + this.id + '-initrans-input').val();
		if(initrans === '') {
			initrans = null;
		}
		var bufferMode = $j('#' + this.id + '-buffer-mode-select').val();
		var freeLists = $j('#' + this.id + '-freelists-input').val();
		if(freeLists === '') {
			freeLists = null;
		}
		var freeListGroups = $j('#' + this.id + '-freelist-groups-input').val();
		if(freeListGroups === '') {
			freeListGroups = null;
		}
		var initialExtent = $j('#' + this.id + '-initial-extent-input').val();
		if(initialExtent === '') {
			initialExtent = null;
		}
		var initialExtentUnit = $j('#' + this.id + '-initial-extent-select').val();
		var nextExtent = $j('#' + this.id + '-next-extent-input').val();
		if(nextExtent === '') {
			nextExtent = null;
		}
		var nextExtentUnit = $j('#' + this.id + '-next-extent-select').val();
		var minExtent = $j('#' + this.id + '-min-extent-input').val();
		if(minExtent === '') {
			minExtent = null;
		}
		var minExtentUnit = $j('#' + this.id + '-min-extent-select').val();
		var maxExtent = $j('#' + this.id + '-max-extent-input').val();
		if(maxExtent === '') {
			maxExtent = null;
		}
		var maxExtentUnit = $j('#' + this.id + '-max-extent-select').val();
		var unlimited = $j('#' + this.id + '-max-extent-checkbox').prop('checked');
		var pctIncrease = $j('#' + this.id + '-percent-increase-input').val();
		if(pctIncrease === '') {
			pctIncrease = null;
		}

		var changedRecord = {};
		changedRecord['parallelDegree'] = parallelDegree !== this.originalData['parallelDegree'] ? parallelDegree : null;
		changedRecord['degree'] = degree !== this.originalData['degree'] ? degree : null;
		changedRecord['tablespaceName'] = tablespaceName !== this.originalData['tablespaceName'] ? tablespaceName : null;
		changedRecord['pctFree'] = pctFree !== String(this.originalData['pctFree']) ? pctFree : null;
		changedRecord['pctUsed'] = pctUsed !== String(this.originalData['pctUsed']) ? pctUsed : null;
		changedRecord['logging'] = logging !== this.originalData['logging'] ? logging : null;
		changedRecord['initrans'] = initrans !== String(this.originalData['initrans']) ? initrans : null;
		changedRecord['bufferMode'] = bufferMode !== this.originalData['bufferMode'] ? bufferMode : null;
		changedRecord['freeLists'] = freeLists !== String(this.originalData['freeLists']) ? freeLists : null;
		changedRecord['freeListGroups'] = freeListGroups !== String(this.originalData['freeListGroups']) ? freeListGroups : null;
		changedRecord['initialExtent'] = this.getCalculatedValue(initialExtent, initialExtentUnit) !== parseInt(this.originalData['initialExtent']) ? this.getCalculatedValue(initialExtent, initialExtentUnit) : null;
		changedRecord['nextExtent'] = this.getCalculatedValue(nextExtent, nextExtentUnit) !== parseInt(this.originalData['nextExtent']) ? this.getCalculatedValue(nextExtent, nextExtentUnit) : null;
		changedRecord['minExtent'] = this.getCalculatedValue(minExtent, minExtentUnit) !== parseInt(this.originalData['minExtent']) ? this.getCalculatedValue(minExtent, minExtentUnit) : null;
		changedRecord['maxExtent'] = this.getCalculatedValue(maxExtent, maxExtentUnit) !== parseInt(this.originalData['maxExtent']) ? this.getCalculatedValue(maxExtent, maxExtentUnit) : null;
		if(this.originalData['unlimited'] !== 'null' && this.originalData['unlimited'] !== null && this.originalData['unlimited'] !== undefined) {
			changedRecord['unlimited'] = unlimited !== JSON.parse(this.originalData['unlimited']) ? unlimited : null;
		} else {
			changedRecord['unlimited'] = null;
		}
		changedRecord['pctIncrease'] = pctIncrease !== String(this.originalData['pctIncrease']) ? pctIncrease : null;
		
		if(changedRecord['parallelDegree'] !== null || changedRecord['degree'] !== null) {
			var ddl = 'ALTER TABLE ' + this.label;
			if(changedRecord['parallelDegree'] === 'Default') {
				ddl += '\nPARALLEL;';
			} else if(changedRecord['parallelDegree'] === 'Select') {
				ddl += '\nPARALLEL ' + changedRecord['degree'] + ';';
			} else if(changedRecord['parallelDegree'] === 'None') {
				ddl += '\nNOPARALLEL;';
			} else if(changedRecord['degree'] !== null) {
				ddl += '\nPARALLEL ' + changedRecord['degree'] + ';';
			}

			ddlArray.push(ddl);
		}

		if(changedRecord['tablespaceName'] !== null || changedRecord['freeLists'] !== null || changedRecord['freeListGroups'] !== null) {
			var ddl = '';
			ddl = 'ALTER TABLE ' + this.label + ' MOVE';
			if(changedRecord['tablespaceName'] !== null) {
				ddl += '\nTABLESPACE ' + changedRecord['tablespaceName'];
			}
			if(changedRecord['freeLists'] !== null || changedRecord['freeListGroups'] !== null) {
				ddl += '\nSTORAGE';
				ddl += '\n(';
				if(changedRecord['freeLists'] !== null) {
					ddl += '\n\tFREELISTS ' + changedRecord['freeLists'];
				}
				if(changedRecord['freeListGroups'] !== null) {
					ddl += '\n\tFREELIST GROUPS ' + changedRecord['freeListGroups'];
				}
				ddl += '\n)';
			}
			ddl += ';';
			ddlArray.push(ddl);
		}

		var ddl = '';
		if(changedRecord['logging'] === 'On') {
			ddl += '\nLOGGING';
		} else if(changedRecord['logging'] === 'Off') {
			ddl += '\nNOLOGGING';
		}
		if(changedRecord['pctFree'] !== null) {
			ddl += '\nPCTFREE ' + changedRecord['pctFree'];
		}
		if(changedRecord['pctUsed'] !== null) {
			ddl += '\nPCTUSED ' + changedRecord['pctUsed'];
		}
		if(changedRecord['initrans'] !== null) {
			ddl += '\nINITRANS ' + changedRecord['initrans'];
		}

		if(changedRecord['bufferMode'] !== null || changedRecord['initialExtent'] !== null
			|| changedRecord['nextExtent'] !== null || changedRecord['minExtent']
			|| changedRecord['maxExtent'] !== null || changedRecord['unlimited'] !== null
			|| changedRecord['pctIncrease']) {
			ddl += '\nSTORAGE';
			ddl += '\n('
			if(changedRecord['bufferMode'] !== null) {
				ddl += '\n\tBUFFER_POOL ' + changedRecord['bufferMode'];
			}
			if(changedRecord['initialExtent'] !== null) {
				ddl += '\n\tINITIAL ' + changedRecord['initialExtent'];
			}
			if(changedRecord['nextExtent'] !== null) {
				ddl += '\n\tNEXT ' + changedRecord['nextExtent'];
			}
			if(changedRecord['minExtent'] !== null) {
				ddl += '\n\tMINEXTENTS ' + changedRecord['minExtent'];
			}
			if(changedRecord['unlimited'] === true) {
				ddl += '\n\tMAXEXTENTS UNLIMITED';
			} else if(changedRecord['maxExtent'] !== null && changedRecord['unlimited'] === false) {
				ddl += '\n\tMAXEXTENTS ' +  + changedRecord['maxExtent'];
			}
			if(changedRecord['pctIncrease'] !== null) {
				ddl += '\n\tPCTINCREASE ' + changedRecord['pctIncrease'];
			}
			ddl += '\n)';
		}

		if(ddl !== '') {
			ddl = 'ALTER TABLE ' + this.label + ddl + ';';
			ddlArray.push(ddl);
		}

		return ddlArray;
	},
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
	},
	refresh: function() {

	}
});

/**
 * CommentsPanelUI: This class provides the user interface to edit the comments
 * of an given table
 * @constructor
 * @param {String} id: A unique identifier to create HTML contents
 * @param {String} label: A label to be shown on the required widgets
 */
var NewTableCommentsPanelUI = Class.create({
	id: null,
	label: null,
	layout: null,
	originalData: null,
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.originalData = null;
	},
	createPanel: function() {
		if(this.layout === null) {
			var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
			this.layout = $j('#' + this.id).w2layout({
													name: this.id,
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' }
											        ]
												});

			var mainHtml = `
				<div style='width: 100%; height: 100%;'>
					<div style='padding: 10px 5px;'>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-comments-input'>Comments:</label>
						</div>
						<textarea id='` + this.id + `-comments-input' style='height: 528px; width: 638px;' />
					</div>
				</div>
			`;
			this.layout.content('main', mainHtml);
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
	populateTableComments: function(result) {
		this.originalData = result[0];
		$j('#' + this.id + '-comments-input').val(result[0]);
	},
	getChanges: function() {
		var ddlArray = [];

		if(!this.isPanelCreated()) {
			return ddlArray;
		}

		var comments = $j('#' + this.id + '-comments-input').val();

		if(comments !== this.originalData) {
			var ddl = 'COMMENT ON TABLE ' + this.label + ' IS \'' + comments + '\';';
			ddlArray.push(ddl);
		}		

		return ddlArray;
	},
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
	},
	refresh: function() {

	}
});

/**
 * DDLPanelUI: This class provides the user interface to display the DDL
 * of an given table
 * @constructor
 * @param {String} id: A unique identifier to create HTML contents
 * @param {String} label: A label to be shown on the required widgets
 */
var NewTableDDLPanelUI = Class.create({
	id: null,
	label: null,
	layout: null,
	sqlEditor: null,
	list: null,
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.layout = null;
		this.sqlEditor = null;
		this.list = null;
	},
	createPanel: function(items) {
		var that = this;
		if(this.layout === null) {
			var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
			this.layout = $j('#' + this.id).w2layout({
													name: this.id,
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' }
											        ]
												});

			var mainHtml = `
				<div style='width: 100%; height: 100%;'>
					<div style='padding: 10px 5px;'>
						<div style='line-height: 30px;'>
							<label for='` + this.id + `-ddl-input'>SQL Statement(s):</label>
						</div>
						<div style='line-height: 30px;'>
							<input id='` + this.id + `-ddl-create-radio' name='` + this.id + `-ddl-view-type-radio' type='radio'>Create</input>
							<input id='` + this.id + `-ddl-update-radio' name='` + this.id + `-ddl-view-type-radio' type='radio' checked style='margin-left: 30px;'>Update (for current edit)</input>
							<input id='` + this.id + `-ddl-update-list-view-radio' name='` + this.id + `-ddl-view-type-radio' type='radio' style='margin-left: 30px;'>List View (for current edit)</input>
						</div>
						<div id='` + this.id + `-ddl-input' class='ddl_view display_ddl_view'></div>
						<div id='` + this.id + `-list-view' class='ddl_view'></div>
						<div style='line-height: 30px;'>
							<button id='` + this.id + `-save-button' style='float: right;'>Save...</button>
						</div>
					</div>
				</div>
			`;
			this.layout.content('main', mainHtml);

			this.sqlEditor = ace.edit(this.id + '-ddl-input');
			this.sqlEditor.setTheme('ace/theme/sqlserver');
			this.sqlEditor.session.setMode('ace/mode/sqlserver');
			this.sqlEditor.setReadOnly(true);

			this.list = new ListView(this.id + '-list-view', items);

			$j('[name=' + this.id + '-ddl-view-type-radio]').on('click', function() {
				if(this.id === that.id + '-ddl-update-radio') {
					$j('#' + that.id + '-list-view').removeClass('display_ddl_view');
					$j('#' + that.id + '-ddl-input').addClass('display_ddl_view');
					that.sqlEditor.resize();
				} else if(this.id === that.id + '-ddl-update-list-view-radio') {
					$j('#' + that.id + '-ddl-input').removeClass('display_ddl_view');
					$j('#' + that.id + '-list-view').addClass('display_ddl_view');
				} else if(this.id === that.id + '-ddl-create-radio') {
					$j('#' + that.id + '-ddl-input').removeClass('display_ddl_view');
					$j('#' + that.id + '-list-view').removeClass('display_ddl_view');
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
	setDDL: function(ddl) {
		this.sqlEditor.setValue(ddl);
	},
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
		if(this.sqlEditor !== null) {
			this.sqlEditor.destroy();
		}
	},
	refresh: function(items) {
		this.list.refresh(items);
	}
});