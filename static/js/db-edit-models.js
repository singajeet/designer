
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
	initialize: function(tableName) {
		this.tableName = tableName;
		this.socket = io('/oracle_db_table');
		this.columnsAvailableEventListeners = [];
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
	getColumns: function() {
		var that = this;
	    this.socket.on('columns_result_to_edit', function(result){
	      that.fireColumnsAvailableEvent(result);
	    });
	    this.socket.emit('get_columns_to_edit', this.tableName);
	}
});