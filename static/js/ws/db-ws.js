/**
 * Database: This class represents an SQL to be executed in database and interacts with
 *  websocket calls to execute same
 * @constructor
 */
var Database = Class.create({
	socket: null,
	schemaListAvailableEventListeners: [],
	columnsToNormalizeAvailableEventListeners: [],
	disabledConstraintsListAvailableEventListeners: [],
	enabledConstraintsListAvailableEventListeners: [],
	constraintsListAvailableEventListeners: [],
	columnsAvailableEventListeners: [],
	tablesAvailableEventListeners: [],
	initialize: function() {
		this.socket = io('/oracle_db');
		this.schemaListAvailableEventListeners = [];
		this.columnsToNormalizeAvailableEventListeners = [];
		this.disabledConstraintsListAvailableEventListeners = [];
		this.enabledConstraintsListAvailableEventListeners = [];
		this.constraintsListAvailableEventListeners = [];
		this.columnsAvailableEventListeners = [];
		this.tablesAvailableEventListeners = [];
		var that = this;
	    this.socket.on('schemas_list_result', function(result){
	      that.fireSchemaListAvailableEvent(result);
	    });
	    this.socket.on('columns_to_normalize_result', function(result){
	      that.fireColumnsToNormalizeAvailableEvent(result);
	    });
	    this.socket.on('disabled_constraints_result', function(result){
	      that.fireDisabledConstraintsListAvailableEvent(result);
	    });
	    this.socket.on('enabled_constraints_result', function(result){
	      that.fireEnabledConstraintsListAvailableEvent(result);
	    });
	    this.socket.on('constraints_list_result', function(result){
	      that.fireConstraintsListAvailableEvent(result);
	    });
	    this.socket.on('columns_result', function(result){
	      that.fireColumnsAvailableEvent(result);
	    });
	    this.socket.on('tables_result', function(result){
	      that.fireTablesAvailableEvent(result);
	    });
	},
	addSchemaListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.schemaListAvailableEventListeners.push(listener);
		}
	},
	removeSchemaListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.schemaListAvailableEventListeners.indexOf(listener);
			this.schemaListAvailableEventListeners.splice(index, 1);
		}
	},
	fireSchemaListAvailableEvent: function(result) {
		this.schemaListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addColumnsToNormalizeAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.columnsToNormalizeAvailableEventListeners.push(listener);
		}
	},
	removeColumnsToNormalizeAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.columnsToNormalizeAvailableEventListeners.indexOf(listener);
			this.columnsToNormalizeAvailableEventListeners.splice(index, 1);
		}
	},
	fireColumnsToNormalizeAvailableEvent: function(result) {
		this.columnsToNormalizeAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addDisabledConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.disabledConstraintsListAvailableEventListeners.push(listener);
		}
	},
	removeDisabledConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.disabledConstraintsListAvailableEventListeners.indexOf(listener);
			this.disabledConstraintsListAvailableEventListeners.splice(index, 1);
		}
	},
	fireDisabledConstraintsListAvailableEvent: function(result) {
		this.disabledConstraintsListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addEnabledConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.enabledConstraintsListAvailableEventListeners.push(listener);
		}
	},
	removeEnabledConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.enabledConstraintsListAvailableEventListeners.indexOf(listener);
			this.enabledConstraintsListAvailableEventListeners.splice(index, 1);
		}
	},
	fireEnabledConstraintsListAvailableEvent: function(result) {
		this.enabledConstraintsListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.constraintsListAvailableEventListeners.push(listener);
		}
	},
	removeConstraintsListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.constraintsListAvailableEventListeners.indexOf(listener);
			this.constraintsListAvailableEventListeners.splice(index, 1);
		}
	},
	fireConstraintsListAvailableEvent: function(result) {
		this.constraintsListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
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
	addTablesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tablesAvailableEventListeners.push(listener);
		}
	},
	removeTablesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tablesAvailableEventListeners.indexOf(listener);
			this.tablesAvailableEventListeners.splice(index, 1);
		}
	},
	fireTablesAvailableEvent: function(result) {
		this.tablesAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	getSchemaList: function() {
	    this.socket.emit('get_schemas_list');
	},
	getColumnsToNormalize: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_columns_to_normalize', props);
	},
	getDisabledConstraintsList: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_disabled_constraints', props);
	},
	getEnabledConstraintsList: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_enabled_constraints', props);
	},
	getConstraintsList: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_constraints_list', props);
	},
	getColumns: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_columns', props);
	},
	getTables: function(schemaName) {
		this.socket.emit('get_tables', schemaName);
	},
	destroy: function() {
		this.socket.disconnect();
		this.socket.destroy();
		this.socket = null;
	}
});