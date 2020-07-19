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
	sequencesAvailableEventListeners: [],
	disabledTableTriggersListAvailableEventListeners: [],
	enabledTableTriggersListAvailableEventListeners: [],
	tableTriggersListAvailableEventListeners: [],
	explainPlanAvailableEventListeners: [],
	viewsAvailableEventListeners: [],
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
		this.sequencesAvailableEventListeners = [];
		this.disabledTableTriggersListAvailableEventListeners = [];
		this.enabledTableTriggersListAvailableEventListeners = [];
		this.tableTriggersListAvailableEventListeners = [];
		this.explainPlanAvailableEventListeners = [];
		this.viewsAvailableEventListeners = [];
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
	    this.socket.on('sequences_result', function(result){
	      that.fireSequencesAvailableEvent(result);
	    });
	    this.socket.on('disabled_table_triggers_result', function(result){
	      that.fireDisabledTableTriggersListAvailableEvent(result);
	    });
	    this.socket.on('enabled_table_triggers_result', function(result){
	      that.fireEnabledTableTriggersListAvailableEvent(result);
	    });
	    this.socket.on('table_triggers_result', function(result){
	      that.fireTableTriggersListAvailableEvent(result);
	    });
	    this.socket.on('explain_plan_result', function(result){
	      that.fireExplainPlanAvailableEvent(result);
	    });
	    this.socket.on('views_result', function(result){
	      that.fireViewsAvailableEvent(result);
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
	addSequencesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.sequencesAvailableEventListeners.push(listener);
		}
	},
	removeSequencesAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.sequencesAvailableEventListeners.indexOf(listener);
			this.sequencesAvailableEventListeners.splice(index, 1);
		}
	},
	fireSequencesAvailableEvent: function(result) {
		this.sequencesAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addDisabledTableTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.disabledTableTriggersListAvailableEventListeners.push(listener);
		}
	},
	removeDisabledTableTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.disabledTableTriggersListAvailableEventListeners.indexOf(listener);
			this.disabledTableTriggersListAvailableEventListeners.splice(index, 1);
		}
	},
	fireDisabledTableTriggersListAvailableEvent: function(result) {
		this.disabledTableTriggersListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addEnabledTableTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.enabledTableTriggersListAvailableEventListeners.push(listener);
		}
	},
	removeEnabledTableTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.enabledTableTriggersListAvailableEventListeners.indexOf(listener);
			this.enabledTableTriggersListAvailableEventListeners.splice(index, 1);
		}
	},
	fireEnabledTableTriggersListAvailableEvent: function(result) {
		this.enabledTableTriggersListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTableTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.tableTriggersListAvailableEventListeners.push(listener);
		}
	},
	removeTableTriggersListAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.tableTriggersListAvailableEventListeners.indexOf(listener);
			this.tableTriggersListAvailableEventListeners.splice(index, 1);
		}
	},
	fireTableTriggersListAvailableEvent: function(result) {
		this.tableTriggersListAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addExplainPlanAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.explainPlanAvailableEventListeners.push(listener);
		}
	},
	removeExplainPlanAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.explainPlanAvailableEventListeners.indexOf(listener);
			this.explainPlanAvailableEventListeners.splice(index, 1);
		}
	},
	fireExplainPlanAvailableEvent: function(result) {
		this.explainPlanAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addViewsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.viewsAvailableEventListeners.push(listener);
		}
	},
	removeViewsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.viewsAvailableEventListeners.indexOf(listener);
			this.viewsAvailableEventListeners.splice(index, 1);
		}
	},
	fireViewsAvailableEvent: function(result) {
		this.viewsAvailableEventListeners.forEach(function(listener) {
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
	getSequences: function(schemaName) {
		this.socket.emit('get_sequences', schemaName);
	},
	getDisabledTableTriggersList: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_disabled_table_triggers', props);
	},
	getEnabledTableTriggersList: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_enabled_table_triggers', props);
	},
	getTableTriggersList: function(schemaName, tableName) {
		var props = {schemaName: schemaName, tableName: tableName};
		this.socket.emit('get_table_triggers', props);
	},
	getExplainPlan: function(sql) {
		this.socket.emit('get_explain_plan', sql);
	},
	getViews: function(schemaName) {
		this.socket.emit('get_views', schemaName);
	},
	destroy: function() {
		if(this.socket !== null) {
			this.socket.off('schemas_list_result');
		    this.socket.off('columns_to_normalize_result');
		    this.socket.off('disabled_constraints_result');
		    this.socket.off('enabled_constraints_result');
		    this.socket.off('constraints_list_result');
		    this.socket.off('columns_result');
		    this.socket.off('tables_result');
		    this.socket.off('indexes_result');
		    this.socket.off('roles_result');
		    this.socket.off('privileges_result');
		    this.socket.off('tablespaces_list_result');
		    this.socket.off('sequences_result');
		    this.socket.off('disabled_table_triggers_result');
		    this.socket.off('enabled_table_triggers_result');
		    this.socket.off('table_triggers_result');
		    this.socket.off('explain_plan_result');
		    this.socket.off('views_result');
			this.socket.disconnect();
			this.socket.destroy();
			this.socket = null;
		}
	}
});