/**
 * Warehouse-ws.js - This file contains the client side web services
 * interface to interact with server for fetching the required data
 */

/**
 * WarehouseConfiguration - This class is used to configure the warehouse
 * and build the metadata
 * @constructor
 */
var WarehouseConfiguration = Class.create({
	socket: null,
	testMetadataDBEventListeners: [],
	testWarehouseDBEventListeners: [],
	warehouseObjectsAvailableEventListeners: [],
	initialize: function() {
		this.socket = io('/warehouse_config');
		this.testMetadataDBSuccessEventListeners = [];
		this.testMetadataDBErrorEventListeners = [];
		this.testWarehouseDBSuccessEventListeners = [];
		this.testWarehouseDBErrorEventListeners = [];
		this.warehouseObjectsAvailableEventListeners = [];
		var that = this;
		this.socket.on('metadata_db_test_result', function(result) {
			that.fireTestMetadataDBSuccessEvent();
		});
		this.socket.on('metadata_db_test_error', function(result) {
			that.fireTestMetadataDBErrorEvent(result);
		});
		this.socket.on('warehouse_db_test_result', function(result) {
			that.fireTestWarehouseDBSuccessEvent();
		});
		this.socket.on('warehouse_db_test_error', function(result) {
			that.fireTestWarehouseDBErrorEvent(result);
		});
		this.socket.on('warehouse_objects_result', function(result) {
			that.fireWarehouseObjectsAvailableEvent(result);
		});
	},
	addTestMetadataDBSuccessEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.testMetadataDBSuccessEventListeners.push(listener);
		}
	},
	removeTestMetadataDBSuccessEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.testMetadataDBSuccessEventListeners.indexOf(listener);
			this.testMetadataDBSuccessEventListeners.splice(index, 1);
		}
	},
	fireTestMetadataDBSuccessEvent: function() {
		this.testMetadataDBSuccessEventListeners.forEach(function(listener) {
			listener();
		});
	},
	addTestMetadataDBErrorEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.testMetadataDBErrorEventListeners.push(listener);
		}
	},
	removeTestMetadataDBErrorEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.testMetadataDBErrorEventListeners.indexOf(listener);
			this.testMetadataDBErrorEventListeners.splice(index, 1);
		}
	},
	fireTestMetadataDBErrorEvent: function(result) {
		this.testMetadataDBErrorEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addTestWarehouseDBSuccessEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.testWarehouseDBSuccessEventListeners.push(listener);
		}
	},
	removeTestWarehouseDBSuccessEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.testWarehouseDBSuccessEventListeners.indexOf(listener);
			this.testWarehouseDBSuccessEventListeners.splice(index, 1);
		}
	},
	fireTestWarehouseDBSuccessEvent: function() {
		this.testWarehouseDBSuccessEventListeners.forEach(function(listener) {
			listener();
		});
	},
	addTestWarehouseDBErrorEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.testWarehouseDBErrorEventListeners.push(listener);
		}
	},
	removeTestWarehouseDBErrorEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.testWarehouseDBErrorEventListeners.indexOf(listener);
			this.testWarehouseDBErrorEventListeners.splice(index, 1);
		}
	},
	fireTestWarehouseDBErrorEvent: function(result) {
		this.testWarehouseDBErrorEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	addWarehouseObjectsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			this.warehouseObjectsAvailableEventListeners.push(listener);
		}
	},
	removeWarehouseObjectsAvailableEventListener: function(listener) {
		if(listener !== null && listener !== undefined) {
			var index = this.warehouseObjectsAvailableEventListeners.indexOf(listener);
			this.warehouseObjectsAvailableEventListeners.splice(index, 1);
		}
	},
	fireWarehouseObjectsAvailableEvent: function(result) {
		this.warehouseObjectsAvailableEventListeners.forEach(function(listener) {
			listener(result);
		});
	},
	testMetadataDB: function(username, password, connString) {
		var props = {username: username, password: password, connString: connString};
		this.socket.emit('metadata_db_test', props);
	},
	testWarehouseDB: function(username, password, connString) {
		var props = {username: username, password: password, connString: connString};
		this.socket.emit('warehouse_db_test', props);
	},
	getWarehouseObjectList: function(connName, username, password, connString) {
		var props = {connName: connName, username: username, password: password, connString: connString};
		this.socket.emit('get_warehouse_objects', props);
	}
});