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
	indexesAvailableEventListeners: [],
	rolesAvailableEventListeners: [],
	privilegesAvailableEventListeners: [],
	tablespaceListAvailableEventListeners: [],
	initialize: function() {
		this.socket = io('/oracle_db');
		this.schemaListAvailableEventListeners = [];
		this.columnsToNormalizeAvailableEventListeners = [];
		this.disabledConstraintsListAvailableEventListeners = [];
		this.enabledConstraintsListAvailableEventListeners = [];
		this.constraintsListAvailableEventListeners = [];
		this.columnsAvailableEventListeners = [];
		this.tablesAvailableEventListeners = [];
		this.indexesAvailableEventListeners = [];
		this.rolesAvailableEventListeners = [];
		this.privilegesAvailableEventListeners = [];
		this.tablespaceListAvailableEventListeners = [];
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
	    this.socket.on('indexes_result', function(result){
	      that.fireIndexesAvailableEvent(result);
	    });
	    this.socket.on('roles_result', function(result){
	      that.fireRolesAvailableEvent(result);
	    });
	    this.socket.on('privileges_result', function(result){
	      that.firePrivilegesAvailableEvent(result);
	    });
	    this.socket.on('tablespaces_list_result', function(result){
	      that.fireTablespaceListAvailableEvent(result);
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
	addIndexesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.indexesAvailableEventListeners.push(listener);
		}
	},
	removeIndexesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.indexesAvailableEventListeners.indexOf(listener);
			this.indexesAvailableEventListeners.splice(index, 1);
		}
	},
	fireIndexesAvailableEvent: function(result) {
		this.indexesAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addRolesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.rolesAvailableEventListeners.push(listener);
		}
	},
	removeRolesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.rolesAvailableEventListeners.indexOf(listener);
			this.rolesAvailableEventListeners.splice(index, 1);
		}
	},
	fireRolesAvailableEvent: function(result) {
		this.rolesAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addPrivilegesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.privilegesAvailableEventListeners.push(listener);
		}
	},
	removePrivilegesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.privilegesAvailableEventListeners.indexOf(listener);
			this.privilegesAvailableEventListeners.splice(index, 1);
		}
	},
	firePrivilegesAvailableEvent: function(result) {
		this.privilegesAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTablespaceListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tablespaceListAvailableEventListeners.push(listener);
		}
	},
	removeTablespaceListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tablespaceListAvailableEventListeners.indexOf(listener);
			this.tablespaceListAvailableEventListeners.splice(index, 1);
		}
	},
	fireTablespaceListAvailableEvent: function(result) {
		this.tablespaceListAvailableEventListeners.forEach(function(listener) {
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
	getIndexes: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_indexes', props);
	},
	getRoles: function() {
	    this.socket.emit('get_roles');
	},
	getPrivileges: function(schemaName, tableName, grantee) {
		var props = {schemaName: schemaName, tableName: tableName, grantee: grantee};
		this.socket.emit('get_privileges', props);
	},
	getTablespaceList: function() {
	    this.socket.emit('get_tablespaces_list');
	},
	destroy: function() {
		this.socket.disconnect();
		this.socket.destroy();
		this.socket = null;
	}
});