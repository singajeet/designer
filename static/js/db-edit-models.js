
/**
 * DatabaseTable: This class represents an table in database and interacts with
 *  websocket calls to get table details
 * @constructor
 * @param {string} tableName - Name of the table in database
 */
var DatabaseEditableTable = Class.create({
	tableName: null,
	socket: null,
	columnsAvailableEventListeners: [],
	columnConstraintsAvailableEventListeners: [],
	columnIndexesAvailableEventListeners: [],
	identityColumnDetailsAvailableEventListeners: [],
	triggersListAvailableEventListeners: [],
	schemasListAvailableEventListeners: [],
	sequencesListAvailableEventListeners: [],
	typesListAvailableEventListeners: [],
	constraintsAvailableEventListeners: [],
	tablesListAvailableEventListeners: [],
	refConstraintsListAvailableEventListeners: [],
	columnsListAvailableEventListeners: [],
	associationAvailableEventListeners: [],
	constraintColumnsAvailableEventListeners: [],
	indexesListAvailableEventListeners: [],
	indexExpressionAvailableEventListeners: [],
	indexTypesListAvailableEventListeners: [],
	tablespacesListAvailableEventListeners: [],
	tableStorageAvailableEventListeners: [],
	tableTypeAvailableEventListeners: [],
	tableCommentsAvailableEventListeners: [],
	initialize: function(tableName) {
		this.tableName = tableName;
		this.socket = io('/oracle_db_table');
		this.columnsAvailableEventListeners = [];
		this.columnConstraintsAvailableEventListeners = [];
		this.columnIndexesAvailableEventListeners = [];
		this.identityColumnDetailsAvailableEventListeners = [];
		this.triggersListAvailableEventListeners = [];
		this.schemasListAvailableEventListeners = [];
		this.sequencesListAvailableEventListeners = [];
		this.typesListAvailableEventListeners = [];
		this.constraintsAvailableEventListeners = [];
		this.tablesListAvailableEventListeners = [];
		this.refConstraintsListAvailableEventListeners = [];
		this.columnsListAvailableEventListeners = [];
		this.associationAvailableEventListeners = [];
		this.constraintColumnsAvailableEventListeners = [];
		this.indexesListAvailableEventListeners = [];
		this.indexExpressionAvailableEventListeners = [];
		this.indexTypesListAvailableEventListeners = [];
		this.tablespacesListAvailableEventListeners = [];
		this.tableStorageAvailableEventListeners = [];
		this.tableTypeAvailableEventListeners = [];
		this.tableCommentsAvailableEventListeners = [];
	},
	addColumnsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.columnsAvailableEventListeners.push(listener);
		}
	},
	removeColumnsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.columnsAvailableEventListeners.indexOf(listener);
			this.columnsAvailableEventListeners.splice(index, 1);
		}
	},
	fireColumnsAvailableEvent: function(result) {
		this.columnsAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addColumnConstraintsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.columnConstraintsAvailableEventListeners.push(listener);
		}
	},
	removeColumnConstraintsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.columnConstraintsAvailableEventListeners.indexOf(listener);
			this.columnConstraintsAvailableEventListeners.splice(index, 1);
		}
	},
	fireColumnConstraintsAvailableEvent: function(result) {
		this.columnConstraintsAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addColumnIndexesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.columnIndexesAvailableEventListeners.push(listener);
		}
	},
	removeColumnIndexesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.columnIndexesAvailableEventListeners.indexOf(listener);
			this.columnIndexesAvailableEventListeners.splice(index, 1);
		}
	},
	fireColumnIndexesAvailableEvent: function(result) {
		this.columnIndexesAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addIdentityColumnDetailsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.identityColumnDetailsAvailableEventListeners.push(listener);
		}
	},
	removeIdentityColumnDetailsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.identityColumnDetailsAvailableEventListeners.indexOf(listener);
			this.identityColumnDetailsAvailableEventListeners.splice(index, 1);
		}
	},
	fireIdentityColumnDetailsAvailableEvent: function(result) {
		this.identityColumnDetailsAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.triggersListAvailableEventListeners.push(listener);
		}
	},
	removeTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.triggersListAvailableEventListeners.indexOf(listener);
			this.triggersListAvailableEventListeners.splice(index, 1);
		}
	},
	fireTriggersListAvailableEvent: function(result) {
		this.triggersListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addSchemasListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.schemasListAvailableEventListeners.push(listener);
		}
	},
	removeSchemasListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.schemasListAvailableEventListeners.indexOf(listener);
			this.schemasListAvailableEventListeners.splice(index, 1);
		}
	},
	fireSchemasListAvailableEvent: function(result, source) {
		this.schemasListAvailableEventListeners.forEach(function(listener) {
			listener(result, source);
		});
	},
	addSequencesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.sequencesListAvailableEventListeners.push(listener);
		}
	},
	removeSequencesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.sequencesListAvailableEventListeners.indexOf(listener);
			this.sequencesListAvailableEventListeners.splice(index, 1);
		}
	},
	fireSequencesListAvailableEvent: function(result) {
		this.sequencesListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTypesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.typesListAvailableEventListeners.push(listener);
		}
	},
	removeTypesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.typesListAvailableEventListeners.indexOf(listener);
			this.typesListAvailableEventListeners.splice(index, 1);
		}
	},
	fireTypesListAvailableEvent: function(result) {
		this.typesListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addConstraintsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.constraintsAvailableEventListeners.push(listener);
		}
	},
	removeConstraintsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.constraintsAvailableEventListeners.indexOf(listener);
			this.constraintsAvailableEventListeners.splice(index, 1);
		}
	},
	fireConstraintsAvailableEvent: function(result) {
		this.constraintsAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTablesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tablesListAvailableEventListeners.push(listener);
		}
	},
	removeTablesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tablesListAvailableEventListeners.indexOf(listener);
			this.tablesListAvailableEventListeners.splice(index, 1);
		}
	},
	fireTablesListAvailableEvent: function(result) {
		this.tablesListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addRefConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.refConstraintsListAvailableEventListeners.push(listener);
		}
	},
	removeRefConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.refConstraintsListAvailableEventListeners.indexOf(listener);
			this.refConstraintsListAvailableEventListeners.splice(index, 1);
		}
	},
	fireRefConstraintsListAvailableEvent: function(result) {
		this.refConstraintsListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addColumnsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.columnsListAvailableEventListeners.push(listener);
		}
	},
	removeColumnsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.columnsListAvailableEventListeners.indexOf(listener);
			this.columnsListAvailableEventListeners.splice(index, 1);
		}
	},
	fireColumnsListAvailableEvent: function(result, source) {
		this.columnsListAvailableEventListeners.forEach(function(listener) {
			listener(result, source);
		});
	},
	addAssociationAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.associationAvailableEventListeners.push(listener);
		}
	},
	removeAssociationAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.associationAvailableEventListeners.indexOf(listener);
			this.associationAvailableEventListeners.splice(index, 1);
		}
	},
	fireAssociationAvailableEvent: function(result) {
		this.associationAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addConstraintColumnsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.constraintColumnsAvailableEventListeners.push(listener);
		}
	},
	removeConstraintColumnsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.constraintColumnsAvailableEventListeners.indexOf(listener);
			this.constraintColumnsAvailableEventListeners.splice(index, 1);
		}
	},
	fireConstraintColumnsAvailableEvent: function(result) {
		this.constraintColumnsAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addIndexesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.indexesListAvailableEventListeners.push(listener);
		}
	},
	removeIndexesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.indexesListAvailableEventListeners.indexOf(listener);
			this.indexesListAvailableEventListeners.splice(index, 1);
		}
	},
	fireIndexesListAvailableEvent: function(result) {
		this.indexesListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addIndexExpressionAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.indexExpressionAvailableEventListeners.push(listener);
		}
	},
	removeIndexExpressionAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.indexExpressionAvailableEventListeners.indexOf(listener);
			this.indexExpressionAvailableEventListeners.splice(index, 1);
		}
	},
	fireIndexExpressionAvailableEvent: function(result) {
		this.indexExpressionAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addIndexTypesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.indexTypesListAvailableEventListeners.push(listener);
		}
	},
	removeIndexTypesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.indexTypesListAvailableEventListeners.indexOf(listener);
			this.indexTypesListAvailableEventListeners.splice(index, 1);
		}
	},
	fireIndexTypesListAvailableEvent: function(result) {
		this.indexTypesListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTablespacesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tablespacesListAvailableEventListeners.push(listener);
		}
	},
	removeTablespacesListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tablespacesListAvailableEventListeners.indexOf(listener);
			this.tablespacesListAvailableEventListeners.splice(index, 1);
		}
	},
	fireTablespacesListAvailableEvent: function(result, source) {
		this.tablespacesListAvailableEventListeners.forEach(function(listener) {
			listener(result, source);
		});
	},
	addTableStorageAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tableStorageAvailableEventListeners.push(listener);
		}
	},
	removeTableStorageAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tableStorageAvailableEventListeners.indexOf(listener);
			this.tableStorageAvailableEventListeners.splice(index, 1);
		}
	},
	fireTableStorageAvailableEvent: function(result) {
		this.tableStorageAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTableTypeAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tableTypeAvailableEventListeners.push(listener);
		}
	},
	removeTableTypeAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tableTypeAvailableEventListeners.indexOf(listener);
			this.tableTypeAvailableEventListeners.splice(index, 1);
		}
	},
	fireTableTypeAvailableEvent: function(result) {
		this.tableTypeAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTableCommentsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tableCommentsAvailableEventListeners.push(listener);
		}
	},
	removeTableCommentsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tableCommentsAvailableEventListeners.indexOf(listener);
			this.tableCommentsAvailableEventListeners.splice(index, 1);
		}
	},
	fireTableCommentsAvailableEvent: function(result) {
		this.tableCommentsAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	getColumns: function() {
		var that = this;
	    this.socket.on('columns_result_to_edit', function(result){
	      that.fireColumnsAvailableEvent(result);
	    });
	    this.socket.emit('get_columns_to_edit', this.tableName);
	},
	getColumnConstraints: function(columnName) {
		var that = this;
	    this.socket.on('column_constraints_result', function(result){
	      that.fireColumnConstraintsAvailableEvent(result);
	    });
	    var props = {'tableName': this.tableName, 'columnName': columnName};
	    this.socket.emit('get_column_constraints', props);
	},
	getColumnIndexes: function(columnName) {
		var that = this;
	    this.socket.on('column_indexes_result', function(result){
	      that.fireColumnIndexesAvailableEvent(result);
	    });
	    var props = {'tableName': this.tableName, 'columnName': columnName};
	    this.socket.emit('get_column_indexes', props);
	},
	getIdentityColumnDetails: function(columnName) {
		var that = this;
	    this.socket.on('identity_column_details_result', function(result){
	      that.fireIdentityColumnDetailsAvailableEvent(result);
	    });
	    var props = {'tableName': this.tableName, 'columnName': columnName};
	    this.socket.emit('get_identity_column_details', props);
	},
	getTriggersList: function() {
		var that = this;
	    this.socket.on('triggers_list_result', function(result){
	      that.fireTriggersListAvailableEvent(result);
	    });
	    this.socket.emit('get_triggers_list');
	},
	getSchemasList: function(source) {
		var that = this;
	    this.socket.on('schemas_list_result', function(result){
	      that.fireSchemasListAvailableEvent(result, source);
	    });
	    this.socket.emit('get_schemas_list');
	},
	getSequencesList: function(schemaName) {
		var that = this;
	    this.socket.on('sequences_list_result', function(result){
	      that.fireSequencesListAvailableEvent(result);
	    });
	    this.socket.emit('get_sequences_list', schemaName);
	},
	getTypesList: function(schemaName) {
		var that = this;
	    this.socket.on('types_list_result', function(result){
	      that.fireTypesListAvailableEvent(result);
	    });
	    this.socket.emit('get_types_list', schemaName);
	},
	getConstraints: function() {
		var that = this;
	    this.socket.on('constraints_result_to_edit', function(result){
	      that.fireConstraintsAvailableEvent(result);
	    });
	    this.socket.emit('get_constraints_to_edit', this.tableName);
	},
	getTablesList: function(schemaName) {
		var that = this;
	    this.socket.on('tables_list_result', function(result){
	      that.fireTablesListAvailableEvent(result);
	    });
	    this.socket.emit('get_tables_list', schemaName);
	},
	getRefConstraintsList: function(tableName) {
		var that = this;
	    this.socket.on('ref_constraints_list_result', function(result){
	      that.fireRefConstraintsListAvailableEvent(result);
	    });
	    this.socket.emit('get_ref_constraints_list', tableName);
	},
	getColumnsList: function(source) {
		var that = this;
	    this.socket.on('columns_list_result', function(result){
	      that.fireColumnsListAvailableEvent(result, source);
	    });
	    this.socket.emit('get_columns_list', this.tableName);
	},
	getAssociation: function(constraintName, refConstraintName) {
		var that = this;
	    this.socket.on('association_result', function(result){
	      that.fireAssociationAvailableEvent(result);
	    });
	    var props = {constraintName: constraintName, refConstraintName: refConstraintName};
	    this.socket.emit('get_association', props);
	},
	getConstraintColumns: function(constraintName) {
		var that = this;
	    this.socket.on('constraint_columns_result', function(result){
	      that.fireConstraintColumnsAvailableEvent(result);
	    });
	    this.socket.emit('get_constraint_columns', constraintName);
	},
	getIndexesList: function() {
		var that = this;
	    this.socket.on('indexes_list_result', function(result){
	      that.fireIndexesListAvailableEvent(result);
	    });
	    this.socket.emit('get_indexes_list', this.tableName);
	},
	getIndexExpression: function(indexName) {
		var that = this;
	    this.socket.on('index_expression_result', function(result){
	      that.fireIndexExpressionAvailableEvent(result);
	    });
	    this.socket.emit('get_index_expression', indexName);
	},
	getIndexTypesList: function(schemaName) {
		var that = this;
	    this.socket.on('index_types_list_result', function(result){
	      that.fireIndexTypesListAvailableEvent(result);
	    });
	    this.socket.emit('get_index_types_list', schemaName);
	},
	getTablespacesList: function(source) {
		var that = this;
	    this.socket.on('tablespaces_list_result', function(result){
	      that.fireTablespacesListAvailableEvent(result, source);
	    });
	    this.socket.emit('get_tablespaces_list');
	},
	getTableStorage: function() {
		var that = this;
	    this.socket.on('table_storge_result', function(result){
	      that.fireTableStorageAvailableEvent(result);
	    });
	    this.socket.emit('get_table_storage', this.tableName);
	},
	getTableType: function() {
		var that = this;
	    this.socket.on('table_type_result', function(result){
	      that.fireTableTypeAvailableEvent(result);
	    });
	    this.socket.emit('get_table_type', this.tableName);
	},
	getTableComments: function() {
		var that = this;
	    this.socket.on('table_comments_result', function(result){
	      that.fireTableCommentsAvailableEvent(result);
	    });
	    this.socket.emit('get_table_comments', this.tableName);
	}
});