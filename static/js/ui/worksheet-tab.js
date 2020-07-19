
/**
 * WorksheetTabUI: Provides the user interface components to display worksheet for interaction with database
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the worksheet to be shown as label in UI components
 */
var WorksheetTabUI = Class.create({
	id: null,
	label: null,
	schemaName: null,
	mainContent: null,
	sqlEditor: null,
	sqlEditorToolbar: null,
	sqlEditorResultToolbar: null,
	layout: null,
	resultGrid: null,
	scripts: [],
	sqlServer: null,
	db: null,
	commandSource: null,
	commandType: null,
	isTextLowerCase: null,
	initialize: function(id, label, schemaName) {
		this.id = id;
		this.label = label;
    	this.schemaName = schemaName;
		this.mainContent = "";
		this.sqlEditor = null;
		this.sqlEditorToolbar = null;
		this.sqlEditorResultToolbar = null;
		this.layout = null;
		this.resultGrid = null;
		this.scripts = [];
		this.commandSource = null;
		this.commandType = null;
		this.isTextLowerCase = true;
		this.sqlServer = new DatabaseSQL();
		this.db = new Database();
		var that = this;
		this.sqlServer.addSelectSuccessEventListener(function(result) {
			that.onSelectSuccess(result);
		});
		this.sqlServer.addSelectErrorEventListener(function(result) {
			that.onSelectError(result);
		});
		this.sqlServer.addSQLSuccessEventListener(function(result) {
			that.onSQLSuccess(result);
		});
		this.sqlServer.addSQLErrorEventListener(function(result) {
			that.onSQLError(result);
		});
		this.db.addExplainPlanAvailableEventListener(function(result) {
			that.onExplainPlanAvailable(result);
		});
	},
	getId: function() {
		return this.id;
	},
	getTabName: function() {
		return this.label;
	},
	getTabContent: function() {
		this.mainContent = `<div id='` + this.id + `-worksheet-tab' style='width: 100%; height: 100%;'>
								<div id='` + this.id + `-plsql-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>
                            	<div style='width: 100%; height: 2px'></div>
                            	<div id='` + this.id + `-worksheet-layout' style='width: 100%; height: 96%;'></div>
							</div>
							`;
		return this.mainContent;
	},
	initTab: function() {
		//$j('#' + this.id + '-table-info-tabs').tabs();
	},
	createSQLEditor: function() {
	    var that = this;
	    if(this.layout === null) {
	    	var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
	      	this.sqlEditorToolbar = $j('#' + this.id + '-plsql-sql-editor-toolbar')
	                                .w2toolbar({
	                                            name: this.id + '-plsql-sql-editor-toolbar',
	                                            items: [
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-run-btn',
	                                                icon: 'run_icon', hint: 'Run SQL'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-run-script-btn',
	                                                icon: 'run_script_icon', hint: 'Run Script'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-explain-btn',
	                                                icon: 'explain_icon', hint: 'Explain Plan...'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-autotrace-btn',
	                                                icon: 'autotrace_icon', hint: 'Autotrace...', disabled: true},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-tunning-advisor-btn',
	                                                icon: 'tunning_advisor_icon', hint: 'SQL Tunning Advisor...', disabled: true},
	                                              { type: 'break'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-commit-btn',
	                                                icon: 'commit_icon', hint: 'Commit'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-rollback-btn',
	                                                icon: 'rollback_icon', hint: 'Rollback'},
	                                              { type: 'break'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-unshared-worksheet-btn',
	                                                icon: 'unshared_worksheet_icon', hint: 'Unshared SQL Worksheet', disabled: true},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-clear-btn',
	                                                icon: 'clear_icon', hint: 'Clear'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-history-btn',
	                                                icon: 'history_icon', hint: 'SQL History'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-upper-lower-case-btn',
	                                                icon: 'upper_lower_case_icon', hint: 'To Upper/Lower/InitCap'},
	                                              { type: 'break'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-settings-btn',
	                                                icon: 'editor_settings_icon', hint: 'Editor Settings...'},
	                                              { type: 'break'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-shortcut-btn',
	                                                icon: 'shortcut_icon', hint: 'Keyboard Shortcuts...'},
	                                              { type: 'break'}
	                                              ],
	                                            onClick: function(event) {
	                                              var target = event.target;
	                                              if(target === that.id + '-plsql-sql-editor-toolbar-run-btn') {
	                                                that.executeSQL();
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-run-script-btn') {
	                                                that.executeScript(null);
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-clear-btn') {
	                                                that.sqlEditor.setValue('');
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-explain-btn') {
	                                                that.executeExplainPlan();
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-commit-btn') {
	                                                that.sqlServer.commit();
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-rollback-btn') {
	                                                that.sqlServer.rollback();
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-upper-lower-case-btn') {
	                                                if(that.isTextLowerCase) {
	                                                	that.sqlEditor.toUpperCase();
	                                                	that.isTextLowerCase = false;
	                                                } else {
	                                                	that.sqlEditor.toLowerCase();
	                                                	that.isTextLowerCase = true;
	                                                }
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-settings-btn') {
	                                                that.sqlEditor.showSettingsMenu();
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-shortcut-btn') {
	                                                that.sqlEditor.showKeyboardShortcuts();
	                                              } else if(target === that.id + '-plsql-sql-editor-toolbar-history-btn') {
	                                                that.showSQLHistory();
	                                              }
	                                            }
	                                          });
	      	this.layout = $j('#' + this.id + '-worksheet-layout').w2layout({
													name: this.id + '-worksheet-layout',
											        padding: 4,
											        panels: [
											            { type: 'main', style: pstyle, content: 'main' },
											            { type: 'bottom', size: 360, resizable: true, style: pstyle, content: 'bottom' }
											        ]
												});
	      	this.layout.content('main', '<div id="' + this.id + '-plsql-sql-editor" style="width: 100%; height: 100%;"></div>');

	      	var bottomHTML = `
	      		<div id='` + this.id + `-plsql-sql-result' style='width: 100%; height: 100%;'>
	      			<div><i class='run_icon' />Query Result</div>
	      			<div id='` + this.id + `-plsql-sql-editor-result-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>
	      			<div style='width: 100%; height: 2px'></div>
	      			<div id='` + this.id + `-worksheet-result' style='width: 100%; height: 84%; border: 1px solid lightgrey; overflow: auto;'></div>
	      		</div>
	      	`;

	      	this.layout.content('bottom', bottomHTML);

	      	this.sqlEditorResultToolbar = $j('#' + this.id + '-plsql-sql-editor-result-toolbar')
	                                .w2toolbar({
	                                            name: this.id + '-plsql-sql-editor-result-toolbar',
	                                            items: [
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-result-toolbar-print-btn',
	                                                icon: 'print_icon', hint: 'Print'},
	                                              { type: 'break'},
	                                              { type: 'button', id: this.id + '-plsql-sql-editor-result-toolbar-clear-btn',
	                                                icon: 'clear_icon', hint: 'Clear'}
	                                              ],
	                                            onClick: function(event) {
	                                              var target = event.target;
	                                              if(target === that.id + '-plsql-sql-editor-result-toolbar-print-btn') {
	                                                that.printResult();
	                                              } else if(target === that.id + '-plsql-sql-editor-result-toolbar-clear-btn') {
	                                                $j('#' + that.id + '-worksheet-result').empty();
	                                              }
	                                            }
	                                          });

	      	this.sqlEditor = ace.edit(this.id + '-plsql-sql-editor');
	      	ace.require('ace/ext/settings_menu').init(this.sqlEditor);
	      	ace.require('ace/ext/keybinding_menu').init(this.sqlEditor);
	      	this.sqlEditor.setTheme('ace/theme/sqlserver');
	      	this.sqlEditor.session.setMode('ace/mode/sqlserver');
	      	this.sqlEditor.setOptions({
		      	enableBasicAutocompletion: true,
		      	enableSnippets: true,
		      	enableLiveAutocompletion: true
	      	});
	    }
  	},
	isSQLEditorCreated: function() {
		if(this.sqlEditor === null) {
		  return false;
		} else {
		  return true;
		}
	},
	getSQLEditor: function() {
		return this.sqlEditor;
	},
	executeScript: function(sql) {
		
		if(sql === null) {
			sql = this.sqlEditor.getValue();
		}

		//sql = sql.replace(/\n/g, ' ').trim();
		sql = sql.trim();
		var isPLSQL = sql.toUpperCase().startsWith('DECLARE') || sql.toUpperCase().startsWith('BEGIN');
		if(!isPLSQL) {
			this.scripts = sql.split(';');
		} else {
			this.scripts = [sql];
		}
		this.commandSource = 'SCRIPT';		

		this.execute();
	},
	execute: function() {

		var sql = '';
		if(this.scripts.length > 0) {
			sql = this.scripts[0];
			this.scripts.splice(0, 1);
		} else {
			return;
		}

		sql = sql.trim();
		if(sql !== '') {
			this.saveSQLToHistory(sql);
			//DML Statements
			if(sql.toUpperCase().startsWith('INSERT')) {
				this.commandType = 'INSERT';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('UPDATE')) {
				this.commandType = 'UPDATE';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('DELETE')) {
				this.commandType = 'DELETE';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('MERGE')) {
				this.commandType = 'MERGE';
				this.sqlServer.execute_sql(sql);
			} 
			//DDL Create Statements
			else if(sql.toUpperCase().startsWith('CREATE TABLE')) {
				this.commandType = 'CREATE_TABLE';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE VIEW') || sql.toUpperCase().startsWith('CREATE OR REPLACE VIEW')) {
				this.commandType = 'CREATE_VIEW';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE INDEX') || sql.toUpperCase().startsWith('CREATE UNIQUE INDEX')
			 || sql.toUpperCase().startsWith('CREATE BITMAP INDEX')) {
				this.commandType = 'CREATE_INDEX';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE MATERIALIZED VIEW')) {
				this.commandType = 'CREATE_MV';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE PROCEDURE') || sql.toUpperCase().startsWith('CREATE OR REPLACE PROCEDURE')) {
				this.commandType = 'CREATE_PROCEDURE';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE FUNCTION') || sql.toUpperCase().startsWith('CREATE OR REPLACE FUNCTION')) {
				this.commandType = 'CREATE_FUNCTION';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE PACKAGE BODY') || sql.toUpperCase().startsWith('CREATE OR REPLACE PACKAGE BODY')) {
				this.commandType = 'CREATE_PACKAGE_BODY';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE PACKAGE') || sql.toUpperCase().startsWith('CREATE OR REPLACE PACKAGE')) {
				this.commandType = 'CREATE_PACKAGE';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE SEQUENCE')) {
				this.commandType = 'CREATE_SEQUENCE';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE SYNONYM') || sql.toUpperCase().startsWith('CREATE OR REPLACE SYNONYM')) {
				this.commandType = 'CREATE_SYNONYM';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE TRIGGER') || sql.toUpperCase().startsWith('CREATE OR REPLACE TRIGGER')) {
				this.commandType = 'CREATE_TRIGGER';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE TYPE') || sql.toUpperCase().startsWith('CREATE OR REPLACE TYPE')) {
				this.commandType = 'CREATE_TYPE';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE DATABASE LINK')) {
				this.commandType = 'CREATE_DATABASE_LINK';
				this.sqlServer.execute_sql(sql);
			} else if(sql.toUpperCase().startsWith('CREATE DIRECTORY')) {
				this.commandType = 'CREATE_DIRECTORY';
				this.sqlServer.execute_sql(sql);
			} 
			//Alter Statements
			 else if(sql.toUpperCase().startsWith('ALTER')) {
				this.commandType = 'ALTER';
				this.sqlServer.execute_sql(sql);
			}
			//Drop Statements
			 else if(sql.toUpperCase().startsWith('DROP')) {
				this.commandType = 'DROP';
				this.sqlServer.execute_sql(sql);
			}
			//Select Statements
			else if(sql.toUpperCase().startsWith('SELECT')) {
				this.sqlServer.executeSelect(sql);
			} 
			//Other Statements
			else {
				this.commandType = 'OTHERS';
				this.sqlServer.execute_sql(sql);
			}
		} else {
			this.execute();
		}
	},
	executeSQL: function() {
		var sql = this.getEditorSQL();
		sql = sql.trim();
		
		if(sql.toUpperCase().startsWith('SELECT') || sql.toUpperCase().startsWith('(SELECT')) {
			this.commandSource = 'SELECT';
			this.saveSQLToHistory(sql);
			this.sqlServer.executeSelect(sql);
		} else {
			this.executeScript(sql);
		}
	},
	onSelectSuccess: function(result) {
		if(result.length > 0) {
			if(this.commandSource === 'SELECT') {
				var row = result[0];
				var headers = Object.keys(row);

				var columns = [];
				headers.forEach(function(header) {
					var column = { field: header, caption: header, size: '100px' };
					columns.push(column);
				});

				if(this.resultGrid !== null) {
					this.resultGrid.destroy();
				}

				var counter = 1;
				result.forEach(function(row) {
					row['recid'] = counter;
					counter++;
				});

				this.resultGrid = $j('#' + this.id + '-worksheet-result').w2grid({
											name: this.id + '-worksheet-result',
	                                  		show: { header: false,
	                                          		toolbar: false,
	                                          		lineNumbers: true,
	                                          		footer: true
	                                        },
	                                        columns: columns
				});

				this.resultGrid.records = result;
				this.resultGrid.refresh();
			} else {
				var row = result[0];
				var headers = Object.keys(row);

				var html = '<br><table style="border: 1px solid black; border-collapse: collapse; margin-left: 10px;"><tr>';

				headers.forEach(function(header) {
					html += '<th style="border: 1px solid black">' + header + '</th>';
				});

				html += '</tr>';

				result.forEach(function(row) {
					html += '<tr>';
					headers.forEach(function(header) {
						var columnData = row[header];
						html += '<td style="border: 1px solid black">' + columnData + '</td>';
					});
					html += '</tr>';
				});

				html += '</table><br>';

				if(this.resultGrid !== null) {
					this.resultGrid.destroy();
					this.resultGrid = null;
					$j('#' + this.id + '-worksheet-result').empty();
				}
				$j('#' + this.id + '-worksheet-result').append(html);

				this.execute();
			}
		} else {
			if(this.resultGrid !== null) {
				this.resultGrid.destroy();
			}
			$j('#' + this.id + '-worksheet-result').empty();
			$j('#' + this.id + '-worksheet-result').append('0 row(s) selected.');
		}
	},
	onSelectError: function(result) {
		if(this.resultGrid !== null) {
			this.resultGrid.destroy();
		}
		$j('#' + this.id + '-worksheet-result').empty();
		$j('#' + this.id + '-worksheet-result').append('<pre>' + JSON.stringify(result) + '</pre>');
	},
	onExplainPlanAvailable: function(result) {
		if(result.length > 0) {
			var row = result[0];
				var headers = Object.keys(row);

				var columns = [];
				headers.forEach(function(header) {
					var column = { field: header, caption: header, size: '100px' };
					columns.push(column);
				});

				if(this.resultGrid !== null) {
					this.resultGrid.destroy();
				}

				this.resultGrid = $j('#' + this.id + '-worksheet-result').w2grid({
											name: this.id + '-worksheet-result',
	                                  		show: { header: false,
	                                          		toolbar: false,
	                                          		lineNumbers: true,
	                                          		footer: true
	                                        },
	                                        columns: [
	                                        	{ field: 'operation', caption: 'Operation', size: '100px'},
	                                        	{ field: 'options', caption: 'Options', size: '100px'},
	                                        	{ field: 'objectName', caption: 'Object Name', size: '100px'},
	                                        	{ field: 'objectType', caption: 'Object Type', size: '100px'},
	                                        	{ field: 'cost', caption: 'Cost', size: '100px'},
	                                        	{ field: 'cardinality', caption: 'Cardinality', size: '100px'},
	                                        	{ field: 'otherXml', caption: 'Other XML', size: '200px'},
	                                        	{ field: 'accessPredicates', caption: 'Access Predicates', size: '100px'}
	                                        ]
				});

				this.resultGrid.records = result;
				this.resultGrid.refresh();
		}
	},
	executeExplainPlan: function() {
		var sql = this.getEditorSQL();
		sql = sql.trim();
		this.db.getExplainPlan(sql);
	},
	getEditorSQL: function() {
		var sql = this.sqlEditor.getValue();
		var that = this;

		//check number of statements in sql
		var index = sql.indexOf(';');
		var lastIndex = sql.lastIndexOf(';');

		//we have multiple statements in the sql text
		if(index !== lastIndex) {
			//if no text is selected
			if(this.sqlEditor.getSelection().isEmpty()) {
				var cursorPositionRow = this.sqlEditor.getCursorPosition().row;
				var sqlArray = sql.split('\n');

				//cursor is not at line 1 (or index 0)
				if(cursorPositionRow !== 0) {
					var statementStartIndex = 0;
					//Search for semi-colon backwards to find the start of current statement
					for(var i = cursorPositionRow - 1; i >= 0; i--) {
						//if(i !== 0) { //if i == 0, i has reached on line 1 (index 0), that will serve as starting index for sql
							if(sqlArray[i].indexOf(';') >= 0) {
								statementStartIndex = i + 1;
								break;
							}
						//}
					}

					var statementEndIndex = cursorPositionRow;
					for(var i = cursorPositionRow; i < sqlArray.length; i++) {
						if(sqlArray[i].indexOf(';') >= 0) {
							statementEndIndex = i;
							break;
						}
					}

					//prepare sql
					sql = '';
					for(var i = statementStartIndex; i <= statementEndIndex; i++) {
						sql += sqlArray[i] + ' ';
					}
				} else {
					//cursor is at line 1 (or index 0)
					var statementEndIndex = 0;
					for(var i=0; i < sqlArray.length; i++) {
						if(sqlArray[i].indexOf(';') >= 0) {
							break;
						} else {
							statementEndIndex++;
						}
					}
					//prepare sql
					sql = '';
					for(var i = 0; i <= statementEndIndex; i++) {
						sql += sqlArray[i] + ' ';
					}
				}
			} else {
				//get the selected text
				sql = this.sqlEditor.getSelectedText();
			}
		}

		return sql;
	},
	saveSQLToHistory: function(sql) {
		if(typeof(Storage)) {
			if(localStorage.sqlHistory) {
				var history = JSON.parse(localStorage.sqlHistory);
				history.push(sql);
				localStorage.sqlHistory = JSON.stringify(history);
			} else {
				var history = [];
				history.push(sql);
				localStorage.sqlHistory = JSON.stringify(history);
			}
		}
	},
	showSQLHistory: function() {
		var html = `<div style='border: 1px solid lightgrey; height: 96%; margin: 5px; padding: 5px;' >
						<select id='sql-history-popup-select' size='17' style='width: 100%; height: 100%;'>
		`;
		var sqlHistory = [];
		if(typeof(Storage)) {
			if(localStorage.sqlHistory) {
				sqlHistory = JSON.parse(localStorage.sqlHistory);
			}
		}
		sqlHistory.forEach(function(sql) {
					html += '<option>' + sql + '</option>';
		});
		html += `		</select>
					</div>
		`;

		var buttonsHtml = `<button class='w2ui-btn' onclick='w2popup.close()'>Select</button>
						   <button class='w2ui-btn' onclick='w2popup.close()'>Close</button>`;

		var that = this;
		w2popup.open({
			title: 'SQL History',
			body: html,
			buttons: buttonsHtml,
			width: 800,
			height: 400,
			opacity: '0.5',
			modal: true,
			showClose: false,
			showMax: false,
			onClose: function(event) {
				var selectedOptions = $j('#sql-history-popup-select')[0].selectedOptions;
				if(selectedOptions.length > 0) {
					var sql = selectedOptions[0].innerHTML;
					if(sql !== null && sql !== undefined) {
						that.sqlEditor.insert(sql);
					}
				}
			}
		});

	},
	printResult: function() {
		var content = $j('#' + this.id + '-worksheet-result').html();

		var html = `
			<html>
				<head>
				</head>
				<body>
					` + content + `
				</body>
			</html>
		`;

		var printPopup = window.open('', '', 'height=600, width=800');
		printPopup.document.write(html);
		printPopup.print();
	},
	onSQLSuccess: function(result) {
		if(this.resultGrid !== null) {
			this.resultGrid.destroy();
			$j('#' + this.id + '-worksheet-result').empty();
		}
		
		if(this.commandType === 'INSERT'){
			$j('#' + this.id + '-worksheet-result').append(JSON.stringify(result) + ' row(s) inserted successfully!');
		} else if(this.commandType === 'DELETE'){
			$j('#' + this.id + '-worksheet-result').append(JSON.stringify(result) + ' row(s) deleted successfully!');
		} else if(this.commandType === 'UPDATE'){
			$j('#' + this.id + '-worksheet-result').append(JSON.stringify(result) + ' row(s) updated successfully!');
		} else if(this.commandType === 'CREATE_TABLE') {
			$j('#' + this.id + '-worksheet-result').append('Table created successfully!');
		} else if(this.commandType === 'CREATE_VIEW') {
			$j('#' + this.id + '-worksheet-result').append('View created successfully!');
		} else if(this.commandType === 'CREATE_INDEX') {
			$j('#' + this.id + '-worksheet-result').append('Index created successfully!');
		} else if(this.commandType === 'CREATE_MV') {
			$j('#' + this.id + '-worksheet-result').append('Materialized view created successfully!');
		} else if(this.commandType === 'CREATE_PROCEDURE') {
			$j('#' + this.id + '-worksheet-result').append('Procedure created successfully!');
		} else if(this.commandType === 'CREATE_FUNCTION') {
			$j('#' + this.id + '-worksheet-result').append('Function created successfully!');
		} else if(this.commandType === 'CREATE_PACKAGE_BODY') {
			$j('#' + this.id + '-worksheet-result').append('Package body created successfully!');
		} else if(this.commandType === 'CREATE_PACKAGE') {
			$j('#' + this.id + '-worksheet-result').append('Package created successfully!');
		} else if(this.commandType === 'CREATE_SEQUENCE') {
			$j('#' + this.id + '-worksheet-result').append('Sequence created successfully!');
		} else if(this.commandType === 'CREATE_SYNONYM') {
			$j('#' + this.id + '-worksheet-result').append('Synonym created successfully!');
		} else if(this.commandType === 'CREATE_TRIGGER') {
			$j('#' + this.id + '-worksheet-result').append('Trigger created successfully!');
		} else if(this.commandType === 'CREATE_TYPE') {
			$j('#' + this.id + '-worksheet-result').append('Type created successfully!');
		} else if(this.commandType === 'CREATE_DATABASE_LINK') {
			$j('#' + this.id + '-worksheet-result').append('Database link created successfully!');
		} else if(this.commandType === 'CREATE_DIRECTORY') {
			$j('#' + this.id + '-worksheet-result').append('Directory created successfully!');
		} else if(this.commandType === 'ALTER') {
			$j('#' + this.id + '-worksheet-result').append('Object altered successfully!');
		} else if(this.commandType === 'DROP') {
			$j('#' + this.id + '-worksheet-result').append('Object dropped successfully!');
		} else if(this.commandType === 'OTHERS'){
			$j('#' + this.id + '-worksheet-result').append('Anonymous block completed successfully!');
		}
	},
	onSQLError: function(result) {
		if(this.resultGrid !== null) {
			this.resultGrid.destroy();
		}
		$j('#' + this.id + '-worksheet-result').empty();
		$j('#' + this.id + '-worksheet-result').append('<pre>' + JSON.stringify(result) + '</pre>');
	},
	destroy: function() {
		if(this.layout !== null) {
			this.layout.destroy();
		}
	    if(this.sqlEditor !== null) {
	      this.sqlEditor.destroy();
	    }
	    if(this.sqlEditorToolbar !== null) {
	      this.sqlEditorToolbar.destroy();
	    }
	    if(this.sqlServer !== null) {
	    	this.sqlServer.destroy();
	    }
	    if(this.db !== null) {
	    	this.db.destroy();
	    }
  	}
});