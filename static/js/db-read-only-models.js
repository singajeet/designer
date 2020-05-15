/*********************************************************************************
 *                        DATABASE OBJECTS APIs
 *********************************************************************************/

/**
 * DatabaseTable: This class represents an table in database and interacts with
 *  websocket calls to get table details
 * @constructor
 * @param {string} tableName - Name of the table in database
 */
var DatabaseTable = Class.create({
  tableName: null,
  socket: null,
  tabId: null,
  columnsAvailableEventListeners: [],
  columnHeadersAvailableEventListeners: [],
  dataAvailableEventListeners: [],
  constraintsAvailableEventListeners: [],
  constraintDetailsAvailableEventListeners: [],
  grantsAvailableEventListeners: [],
  statisticsAvailableEventListeners: [],
  statisticsDetailsAvailableEventListeners: [],
  triggersAvailableEventListeners: [],
  triggerBodyAvailableEventListeners: [],
  dependenciesAvailableEventListeners: [],
  dependenciesDetailsAvailableEventListeners: [],
  detailsAvailableEventListeners: [],
  partitionsAvailableEventListeners: [],
  indexesAvailableEventListeners: [],
  indexesDetailsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  clustersAvailableEventListeners: [],
  initialize: function(tableName, tabId) {
    this.tableName = tableName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_table');
    this.columnsAvailableEventListeners = [];
    this.columnHeadersAvailableEventListeners = [];
    this.dataAvailableEventListeners = [];
    this.constraintsAvailableEventListeners = [];
    this.constraintDetailsAvailableEventListeners = [];
    this.grantsAvailableEventListeners = [];
    this.statisticsAvailableEventListeners = [];
    this.statisticsDetailsAvailableEventListeners = [];
    this.triggersAvailableEventListeners = [];
    this.triggerBodyAvailableEventListeners = [];
    this.dependenciesAvailableEventListeners = [];
    this.dependenciesDetailsAvailableEventListeners = [];
    this.detailsAvailableEventListeners = [];
    this.partitionsAvailableEventListeners = [];
    this.indexesAvailableEventListeners = [];
    this.indexesDetailsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
    this.clustersAvailableEventListeners = [];
  },
  addColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnsAvailableEventListeners.push(listener);
    }
  },
  addColumnHeadersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnHeadersAvailableEventListeners.push(listener);
    }
  },
  addDataAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dataAvailableEventListeners.push(listener);
    }
  },
  addConstraintsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.constraintsAvailableEventListeners.push(listener);
    }
  },
  addConstraintDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.constraintDetailsAvailableEventListeners.push(listener);
    }
  },
  addGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.grantsAvailableEventListeners.push(listener);
    }
  },
  addStatisticsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.statisticsAvailableEventListeners.push(listener);
    }
  },
  addStatisticsDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.statisticsDetailsAvailableEventListeners.push(listener);
    }
  },
  addTriggersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.triggersAvailableEventListeners.push(listener);
    }
  },
  addTriggerBodyAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.triggerBodyAvailableEventListeners.push(listener);
    }
  },
  addDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesAvailableEventListeners.push(listener);
    }
  },
  addDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesDetailsAvailableEventListeners.push(listener);
    }
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  addPartitionsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.partitionsAvailableEventListeners.push(listener);
    }
  },
  addIndexesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.indexesAvailableEventListeners.push(listener);
    }
  },
  addIndexesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.indexesDetailsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  addClustersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.clustersAvailableEventListeners.push(listener);
    }
  },
  removeColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnsAvailableEventListeners.indexOf(listener);
      this.columnsAvailableEventListeners.splice(index, 1);
    }
  },
  removeColumnHeadersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnHeadersAvailableEventListeners.indexOf(listener);
      this.columnHeadersAvailableEventListeners.splice(index, 1);
    }
  },
  removeDataAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dataAvailableEventListeners.indexOf(listener);
      this.dataAvailableEventListeners.splice(index, 1);
    }
  },
  removeConstraintsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.constraintsAvailableEventListeners.indexOf(listener);
      this.constraintsAvailableEventListeners.splice(index, 1);
    }
  },
  removeConstraintDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.constraintDetailsAvailableEventListeners.indexOf(listener);
      this.constraintDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.grantsAvailableEventListeners.indexOf(listener);
      this.grantsAvailableEventListeners.splice(index, 1);
    }
  },
  removeStatisticsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.statisticsAvailableEventListeners.indexOf(listener);
      this.statisticsAvailableEventListeners.splice(index, 1);
    }
  },
  removeStatisticsDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.statisticsDetailsAvailableEventListeners.indexOf(listener);
      this.statisticsDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeTriggersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.triggersAvailableEventListeners.indexOf(listener);
      this.triggersAvailableEventListeners.splice(index, 1);
    }
  },
  removeTriggerBodyAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.triggerBodyAvailableEventListeners.indexOf(listener);
      this.triggerBodyAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesAvailableEventListeners.indexOf(listener);
      this.dependenciesAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesDetailsAvailableEventListeners.indexOf(listener);
      this.dependenciesDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  removePartitionsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.partitionsAvailableEventListeners.indexOf(listener);
      this.partitionsAvailableEventListeners.splice(index, 1);
    }
  },
  removeIndexesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.indexesAvailableEventListeners.indexOf(listener);
      this.indexesAvailableEventListeners.splice(index, 1);
    }
  },
  removeIndexesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.indexesDetailsAvailableEventListeners.indexOf(listener);
      this.indexesDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  removeClustersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.clustersAvailableEventListeners.indexOf(listener);
      this.clustersAvailableEventListeners.splice(index, 1);
    }
  },
  fireColumnsAvailableEvent: function(result) {
    var that = this;
    this.columnsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireColumnHeadersAvailableEvent: function(result) {
    var that = this;
    this.columnHeadersAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
    this.socket.emit('get_data', this.tableName);
  },
  fireDataAvailableEvent: function(result) {
    var that = this;
    this.dataAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireConstraintsAvailableEvent: function(result) {
    var that = this;
    this.constraintsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireConstraintDetailsAvailableEvent: function(result) {
    var that = this;
    this.constraintDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireGrantsAvailableEvent: function(result) {
    var that = this;
    this.grantsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireStatisticsAvailableEvent: function(result) {
    var that = this;
    this.statisticsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireStatisticsDetailsAvailableEvent: function(result) {
    var that = this;
    this.statisticsDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireTriggersAvailableEvent: function(result) {
    var that = this;
    this.triggersAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireTriggerBodyAvailableEvent: function(result) {
    var that = this;
    this.triggerBodyAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesAvailableEvent: function(result) {
    var that = this;
    this.dependenciesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesDetailsAvailableEvent: function(result) {
    var that = this;
    this.dependenciesDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  firePartitionsAvailableEvent: function(result) {
    var that = this;
    this.partitionsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireIndexesAvailableEvent: function(result) {
    var that = this;
    this.indexesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireIndexesDetailsAvailableEvent: function(result) {
    var that = this;
    this.indexesDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireClustersAvailableEvent: function(result) {
    var that = this;
    this.clustersAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getColumns: function() {
    var that = this;
    this.socket.on('columns_result', function(result){
      that.fireColumnsAvailableEvent(result);
    });
    this.socket.emit('get_columns', this.tableName);
  },
  getData: function() {
    var that = this;
    this.socket.on('column_headers_result', function(result){
      that.fireColumnHeadersAvailableEvent(result);
    });
    this.socket.on('data_result', function(result){
      that.fireDataAvailableEvent(result);
    });
    this.socket.emit('get_column_headers', this.tableName);
  },
  getConstraints: function() {
    var that = this;
    this.socket.on('constraints_result', function(result){
      that.fireConstraintsAvailableEvent(result);
    });
    this.socket.emit('get_constraints', this.tableName);
  },
  getConstraintDetails: function(constraintName) {
    var that = this;
    this.socket.on('constraint_details_result', function(result){
      that.fireConstraintDetailsAvailableEvent(result);
    });
    var props = {'tableName': this.tableName, 'constraintName': constraintName};
    this.socket.emit('get_constraint_details', props);
  },
  getGrants: function() {
    var that = this;
    this.socket.on('grants_result', function(result){
      that.fireGrantsAvailableEvent(result);
    });
    this.socket.emit('get_grants', this.tableName);
  },
  getStatistics: function() {
    var that = this;
    this.socket.on('statistics_result', function(result){
      that.fireStatisticsAvailableEvent(result);
    });
    this.socket.emit('get_statistics', this.tableName);
  },
  getStatisticsDetails: function() {
    var that = this;
    this.socket.on('statistics_details_result', function(result){
      that.fireStatisticsDetailsAvailableEvent(result);
    });
    this.socket.emit('get_statistics_details', this.tableName);
  },
  getTriggers: function() {
    var that = this;
    this.socket.on('triggers_result', function(result){
      that.fireTriggersAvailableEvent(result);
    });
    this.socket.emit('get_triggers', this.tableName);
  },
  getTriggerBody: function(triggerName) {
    var that = this;
    this.socket.on('trigger_body_result', function(result){
      that.fireTriggerBodyAvailableEvent(result);
    });
    this.socket.emit('get_trigger_body', triggerName);
  },
  getDependencies: function() {
    var that = this;
    this.socket.on('dependencies_result', function(result){
      that.fireDependenciesAvailableEvent(result);
    });
    this.socket.emit('get_dependencies', this.tableName);
  },
  getDependenciesDetails: function() {
    var that = this;
    this.socket.on('dependencies_details_result', function(result){
      that.fireDependenciesDetailsAvailableEvent(result);
    });
    this.socket.emit('get_dependencies_details', this.tableName);
  },
  getIndexes: function() {
    var that = this;
    this.socket.on('indexes_result', function(result){
      that.fireIndexesAvailableEvent(result);
    });
    this.socket.emit('get_indexes', this.tableName);
  },
  getIndexesDetails: function(indexName) {
    var that = this;
    this.socket.on('indexes_details_result', function(result){
      that.fireIndexesDetailsAvailableEvent(result);
    });
    var props = {'tableName': this.tableName, 'indexName': indexName};
    this.socket.emit('get_indexes_details', props);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.tableName);
  }
});

/**
 * DatabaseView: This class represents an view in database and interacts with
 *  websocket calls to get view details
 * @constructor
 * @param {string} viewName - Name of the view in database
 */
var DatabaseView = Class.create({
  viewName: null,
  socket: null,
  tabId: null,
  columnsAvailableEventListeners: [],
  columnHeadersAvailableEventListeners: [],
  dataAvailableEventListeners: [],
  grantsAvailableEventListeners: [],
  triggersAvailableEventListeners: [],
  triggerBodyAvailableEventListeners: [],
  dependenciesAvailableEventListeners: [],
  dependenciesDetailsAvailableEventListeners: [],
  detailsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  errorsAvailableEventListeners: [],
  initialize: function(viewName, tabId) {
    this.viewName = viewName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_view');
    this.columnsAvailableEventListeners = [];
    this.columnHeadersAvailableEventListeners = [];
    this.dataAvailableEventListeners = [];
    this.grantsAvailableEventListeners = [];
    this.triggersAvailableEventListeners = [];
    this.triggerBodyAvailableEventListeners = [];
    this.dependenciesAvailableEventListeners = [];
    this.dependenciesDetailsAvailableEventListeners = [];
    this.detailsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
    this.errorsAvailableEventListeners = [];
  },
  addColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnsAvailableEventListeners.push(listener);
    }
  },
  addColumnHeadersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnHeadersAvailableEventListeners.push(listener);
    }
  },
  addDataAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dataAvailableEventListeners.push(listener);
    }
  },
  addGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.grantsAvailableEventListeners.push(listener);
    }
  },
  addTriggersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.triggersAvailableEventListeners.push(listener);
    }
  },
  addTriggerBodyAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.triggerBodyAvailableEventListeners.push(listener);
    }
  },
  addDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesAvailableEventListeners.push(listener);
    }
  },
  addDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesDetailsAvailableEventListeners.push(listener);
    }
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  addErrorsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.errorsAvailableEventListeners.push(listener);
    }
  },
  removeColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnsAvailableEventListeners.indexOf(listener);
      this.columnsAvailableEventListeners.splice(index, 1);
    }
  },
  removeColumnHeadersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnHeadersAvailableEventListeners.indexOf(listener);
      this.columnHeadersAvailableEventListeners.splice(index, 1);
    }
  },
  removeDataAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dataAvailableEventListeners.indexOf(listener);
      this.dataAvailableEventListeners.splice(index, 1);
    }
  },
  removeGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.grantsAvailableEventListeners.indexOf(listener);
      this.grantsAvailableEventListeners.splice(index, 1);
    }
  },
  removeTriggersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.triggersAvailableEventListeners.indexOf(listener);
      this.triggersAvailableEventListeners.splice(index, 1);
    }
  },
  removeTriggerBodyAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.triggerBodyAvailableEventListeners.indexOf(listener);
      this.triggerBodyAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesAvailableEventListeners.indexOf(listener);
      this.dependenciesAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesDetailsAvailableEventListeners.indexOf(listener);
      this.dependenciesDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  removeErrorsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.errorsAvailableEventListeners.indexOf(listener);
      this.errorsAvailableEventListeners.splice(index, 1);
    }
  },
  fireColumnsAvailableEvent: function(result) {
    var that = this;
    this.columnsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireColumnHeadersAvailableEvent: function(result) {
    var that = this;
    this.columnHeadersAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
    this.socket.emit('get_data', this.viewName);
  },
  fireDataAvailableEvent: function(result) {
    var that = this;
    this.dataAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireGrantsAvailableEvent: function(result) {
    var that = this;
    this.grantsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireTriggersAvailableEvent: function(result) {
    var that = this;
    this.triggersAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireTriggerBodyAvailableEvent: function(result) {
    var that = this;
    this.triggerBodyAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesAvailableEvent: function(result) {
    var that = this;
    this.dependenciesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesDetailsAvailableEvent: function(result) {
    var that = this;
    this.dependenciesDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireErrorsAvailableEvent: function(result) {
    var that = this;
    this.errorsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getColumns: function() {
    var that = this;
    this.socket.on('columns_result', function(result){
      that.fireColumnsAvailableEvent(result);
    });
    this.socket.emit('get_columns', this.viewName);
  },
  getData: function() {
    var that = this;
    this.socket.on('column_headers_result', function(result){
      that.fireColumnHeadersAvailableEvent(result);
    });
    this.socket.on('data_result', function(result){
      that.fireDataAvailableEvent(result);
    });
    this.socket.emit('get_column_headers', this.viewName);
  },
  getGrants: function() {
    var that = this;
    this.socket.on('grants_result', function(result){
      that.fireGrantsAvailableEvent(result);
    });
    this.socket.emit('get_grants', this.viewName);
  },
  getTriggers: function() {
    var that = this;
    this.socket.on('triggers_result', function(result){
      that.fireTriggersAvailableEvent(result);
    });
    this.socket.emit('get_triggers', this.viewName);
  },
  getTriggerBody: function(triggerName) {
    var that = this;
    this.socket.on('trigger_body_result', function(result){
      that.fireTriggerBodyAvailableEvent(result);
    });
    this.socket.emit('get_trigger_body', triggerName);
  },
  getDependencies: function() {
    var that = this;
    this.socket.on('dependencies_result', function(result){
      that.fireDependenciesAvailableEvent(result);
    });
    this.socket.emit('get_dependencies', this.viewName);
  },
  getDependenciesDetails: function() {
    var that = this;
    this.socket.on('dependencies_details_result', function(result){
      that.fireDependenciesDetailsAvailableEvent(result);
    });
    this.socket.emit('get_dependencies_details', this.viewName);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.viewName);
  },
  getErrors: function() {
    var that = this;
    this.socket.on('errors_result', function(result){
      that.fireErrorsAvailableEvent(result);
    });
    this.socket.emit('get_errors', this.viewName);
  }
});

/**
 * DatabaseIndex: This class represents an index in database and interacts with
 *  websocket calls to get index details
 * @constructor
 * @param {string} indexName - Name of the index in database
 */
var DatabaseIndex = Class.create({
  indexName: null,
  socket: null,
  tabId: null,
  columnsAvailableEventListeners: [],
  statisticsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  initialize: function(indexName, tabId) {
    this.indexName = indexName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_index');
    this.columnsAvailableEventListeners = [];
    this.statisticsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
  },
  addColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnsAvailableEventListeners.push(listener);
    }
  },
  addStatisticsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.statisticsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  removeColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnsAvailableEventListeners.indexOf(listener);
      this.columnsAvailableEventListeners.splice(index, 1);
    }
  },
  removeStatisticsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.statisticsAvailableEventListeners.indexOf(listener);
      this.statisticsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  fireColumnsAvailableEvent: function(result) {
    var that = this;
    this.columnsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireStatisticsAvailableEvent: function(result) {
    var that = this;
    this.statisticsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getColumns: function() {
    var that = this;
    this.socket.on('columns_result', function(result){
      that.fireColumnsAvailableEvent(result);
    });
    this.socket.emit('get_columns', this.indexName);
  },
  getStatistics: function() {
    var that = this;
    this.socket.on('statistics_result', function(result){
      that.fireStatisticsAvailableEvent(result);
    });
    this.socket.emit('get_statistics', this.indexName);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.indexName);
  }
});

/**
 * DatabaseMaterializedView: This class represents an table in database and interacts with
 *  websocket calls to get mview details
 * @constructor
 * @param {string} mviewName - Name of the mview in database
 */
var DatabaseMaterializedView = Class.create({
  mviewName: null,
  socket: null,
  tabId: null,
  columnsAvailableEventListeners: [],
  columnHeadersAvailableEventListeners: [],
  dataAvailableEventListeners: [],
  grantsAvailableEventListeners: [],
  dependenciesAvailableEventListeners: [],
  dependenciesDetailsAvailableEventListeners: [],
  detailsAvailableEventListeners: [],
  indexesAvailableEventListeners: [],
  indexesDetailsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  initialize: function(mviewName, tabId) {
    this.mviewName = mviewName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_mview');
    this.columnsAvailableEventListeners = [];
    this.columnHeadersAvailableEventListeners = [];
    this.dataAvailableEventListeners = [];
    this.grantsAvailableEventListeners = [];
    this.dependenciesAvailableEventListeners = [];
    this.dependenciesDetailsAvailableEventListeners = [];
    this.detailsAvailableEventListeners = [];
    this.indexesAvailableEventListeners = [];
    this.indexesDetailsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
  },
  addColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnsAvailableEventListeners.push(listener);
    }
  },
  addColumnHeadersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnHeadersAvailableEventListeners.push(listener);
    }
  },
  addDataAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dataAvailableEventListeners.push(listener);
    }
  },
  addGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.grantsAvailableEventListeners.push(listener);
    }
  },
  addDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesAvailableEventListeners.push(listener);
    }
  },
  addDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesDetailsAvailableEventListeners.push(listener);
    }
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  addIndexesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.indexesAvailableEventListeners.push(listener);
    }
  },
  addIndexesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.indexesDetailsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  removeColumnsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnsAvailableEventListeners.indexOf(listener);
      this.columnsAvailableEventListeners.splice(index, 1);
    }
  },
  removeColumnHeadersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnHeadersAvailableEventListeners.indexOf(listener);
      this.columnHeadersAvailableEventListeners.splice(index, 1);
    }
  },
  removeDataAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dataAvailableEventListeners.indexOf(listener);
      this.dataAvailableEventListeners.splice(index, 1);
    }
  },
  removeGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.grantsAvailableEventListeners.indexOf(listener);
      this.grantsAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesAvailableEventListeners.indexOf(listener);
      this.dependenciesAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesDetailsAvailableEventListeners.indexOf(listener);
      this.dependenciesDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeIndexesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.indexesAvailableEventListeners.indexOf(listener);
      this.indexesAvailableEventListeners.splice(index, 1);
    }
  },
  removeIndexesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.indexesDetailsAvailableEventListeners.indexOf(listener);
      this.indexesDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  fireColumnsAvailableEvent: function(result) {
    var that = this;
    this.columnsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireColumnHeadersAvailableEvent: function(result) {
    var that = this;
    this.columnHeadersAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
    this.socket.emit('get_data', this.mviewName);
  },
  fireDataAvailableEvent: function(result) {
    var that = this;
    this.dataAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireGrantsAvailableEvent: function(result) {
    var that = this;
    this.grantsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesAvailableEvent: function(result) {
    var that = this;
    this.dependenciesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesDetailsAvailableEvent: function(result) {
    var that = this;
    this.dependenciesDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireIndexesAvailableEvent: function(result) {
    var that = this;
    this.indexesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireIndexesDetailsAvailableEvent: function(result) {
    var that = this;
    this.indexesDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getColumns: function() {
    var that = this;
    this.socket.on('columns_result', function(result){
      that.fireColumnsAvailableEvent(result);
    });
    this.socket.emit('get_columns', this.mviewName);
  },
  getData: function() {
    var that = this;
    this.socket.on('column_headers_result', function(result){
      that.fireColumnHeadersAvailableEvent(result);
    });
    this.socket.on('data_result', function(result){
      that.fireDataAvailableEvent(result);
    });
    this.socket.emit('get_column_headers', this.mviewName);
  },
  getGrants: function() {
    var that = this;
    this.socket.on('grants_result', function(result){
      that.fireGrantsAvailableEvent(result);
    });
    this.socket.emit('get_grants', this.mviewName);
  },
  getDependencies: function() {
    var that = this;
    this.socket.on('dependencies_result', function(result){
      that.fireDependenciesAvailableEvent(result);
    });
    this.socket.emit('get_dependencies', this.mviewName);
  },
  getDependenciesDetails: function() {
    var that = this;
    this.socket.on('dependencies_details_result', function(result){
      that.fireDependenciesDetailsAvailableEvent(result);
    });
    this.socket.emit('get_dependencies_details', this.mviewName);
  },
  getIndexes: function() {
    var that = this;
    this.socket.on('indexes_result', function(result){
      that.fireIndexesAvailableEvent(result);
    });
    this.socket.emit('get_indexes', this.mviewName);
  },
  getIndexesDetails: function(indexName) {
    var that = this;
    this.socket.on('indexes_details_result', function(result){
      that.fireIndexesDetailsAvailableEvent(result);
    });
    var props = {'mviewName': this.mviewName, 'indexName': indexName};
    this.socket.emit('get_indexes_details', props);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.mviewName);
  }
});

/**
 * DatabasePLSQL: This class represents an procedure, function or Package in database and interacts with
 *  websocket calls to get the details
 * @constructor
 * @param {string} tableName - Name of the plsql object in database
 */
var DatabasePLSQL = Class.create({
  objectName: null,
  objectType: null,
  socket: null,
  tabId: null,
  sqlAvailableEventListeners: [],
  errorsAvailableEventListeners: [],
  dependenciesAvailableEventListeners: [],
  profilesAvailableEventListeners: [],
  grantsAvailableEventListeners: [],
  referencesAvailableEventListeners: [],
  detailsAvailableEventListeners: [],
  initialize: function(objectName, tabId, nodeType) {
    this.objectName = objectName;
    this.objectType = '';
    if(nodeType === DatabaseNavNodeType.PROCEDURE) {
      this.objectType = 'PROCEDURE';
    } else if(nodeType === DatabaseNavNodeType.FUNCTION) {
      this.objectType = 'FUNCTION';
    } else if(nodeType === DatabaseNavNodeType.PACKAGE) {
      this.objectType = 'PACKAGE';
    } else if(nodeType === DatabaseNavNodeType.PACKAGE_BODY) {
      this.objectType = 'PACKAGE BODY';
    } else if(nodeType === DatabaseNavNodeType.TRIGGER) {
      this.objectType = 'TRIGGER'
    } else if(nodeType === DatabaseNavNodeType.TYPE) {
      this.objectType = 'TYPE'
    } else if(nodeType === DatabaseNavNodeType.TYPE_BODY) {
      this.objectType = 'TYPE BODY'
    }
    this.tabId = tabId;
    this.socket = io('/oracle_db_plsql');
    this.sqlAvailableEventListeners = [];
    this.errorsAvailableEventListeners = [];
    this.dependenciesAvailableEventListeners = [];
    this.profilesAvailableEventListeners = [];
    this.grantsAvailableEventListeners = [];
    this.referencesAvailableEventListeners = [];
    this.detailsAvailableEventListeners = [];
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  addErrorsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.errorsAvailableEventListeners.push(listener);
    }
  },
  addDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesAvailableEventListeners.push(listener);
    }
  },
  addProfilesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.profilesAvailableEventListeners.push(listener);
    }
  },
  addGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.grantsAvailableEventListeners.push(listener);
    }
  },
  addReferencesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.referencesAvailableEventListeners.push(listener);
    }
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  removeErrorsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.errorsAvailableEventListeners.indexOf(listener);
      this.errorsAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesAvailableEventListeners.indexOf(listener);
      this.dependenciesAvailableEventListeners.splice(index, 1);
    }
  },
  removeProfilesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.profilesAvailableEventListeners.indexOf(listener);
      this.profilesAvailableEventListeners.splice(index, 1);
    }
  },
  removeGrantsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.grantsAvailableEventListeners.indexOf(listener);
      this.grantsAvailableEventListeners.splice(index, 1);
    }
  },
  removeReferencesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.referencesAvailableEventListeners.indexOf(listener);
      this.referencesAvailableEventListeners.splice(index, 1);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireErrorsAvailableEvent: function(result) {
    var that = this;
    this.errorsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesAvailableEvent: function(result) {
    var that = this;
    this.dependenciesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireProfilesAvailableEvent: function(result) {
    var that = this;
    this.profilesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireGrantsAvailableEvent: function(result) {
    var that = this;
    this.grantsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireReferencesAvailableEvent: function(result) {
    var that = this;
    this.referencesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.objectName, this.objectType);
  },
  getErrors: function() {
    var that = this;
    this.socket.on('errors_result', function(result){
      that.fireErrorsAvailableEvent(result);
    });
    this.socket.emit('get_errors', this.objectName);
  },
  getDependencies: function() {
    var that = this;
    this.socket.on('dependencies_result', function(result){
      that.fireDependenciesAvailableEvent(result);
    });
    this.socket.emit('get_dependencies', this.objectName, this.objectType);
  },
  getProfiles: function() {
    var that = this;
    this.socket.on('profiles_result', function(result){
      that.fireProfilesAvailableEvent(result);
    });
    this.socket.emit('get_profiles', this.objectName);
  },
  getGrants: function() {
    var that = this;
    this.socket.on('grants_result', function(result){
      that.fireGrantsAvailableEvent(result);
    });
    this.socket.emit('get_grants', this.objectName);
  },
  getReferences: function() {
    var that = this;
    this.socket.on('references_result', function(result){
      that.fireReferencesAvailableEvent(result);
    });
    this.socket.emit('get_references', this.objectName, this.objectType);
  }
});

/**
 * DatabaseSequence: This class represents an sequence in database and interacts with
 *  websocket calls to get sequence details
 * @constructor
 * @param {string} sequenceName - Name of the sequence in database
 */
var DatabaseSequence = Class.create({
  sequenceName: null,
  socket: null,
  tabId: null,
  detailsAvailableEventListeners: [],
  dependenciesAvailableEventListeners: [],
  dependenciesDetailsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  initialize: function(sequenceName, tabId) {
    this.sequenceName = sequenceName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_sequence');
    this.detailsAvailableEventListeners = [];
    this.dependenciesAvailableEventListeners = [];
    this.dependenciesDetailsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  addDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesAvailableEventListeners.push(listener);
    }
  },
  addDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesDetailsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesAvailableEventListeners.indexOf(listener);
      this.dependenciesAvailableEventListeners.splice(index, 1);
    }
  },
  removeDependenciesDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesDetailsAvailableEventListeners.indexOf(listener);
      this.dependenciesDetailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesAvailableEvent: function(result) {
    var that = this;
    this.dependenciesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireDependenciesDetailsAvailableEvent: function(result) {
    var that = this;
    this.dependenciesDetailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getDetails: function() {
    var that = this;
    this.socket.on('details_result', function(result){
      that.fireDetailsAvailableEvent(result);
    });
    this.socket.emit('get_details', this.sequenceName);
  },
  getDependencies: function() {
    var that = this;
    this.socket.on('dependencies_result', function(result){
      that.fireDependenciesAvailableEvent(result);
    });
    this.socket.emit('get_dependencies', this.sequenceName);
  },
  getDependenciesDetails: function() {
    var that = this;
    this.socket.on('dependencies_details_result', function(result){
      that.fireDependenciesDetailsAvailableEvent(result);
    });
    this.socket.emit('get_dependencies_details', this.sequenceName);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.sequenceName);
  }
});

/**
 * DatabaseSynonym: This class represents an synonym in database and interacts with
 *  websocket calls to get synonym details
 * @constructor
 * @param {string} synonymName - Name of the synonym in database
 */
var DatabaseSynonym = Class.create({
  synonymName: null,
  socket: null,
  tabId: null,
  detailsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  initialize: function(synonymName, tabId) {
    this.synonymName = synonymName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_synonym');
    this.detailsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getDetails: function() {
    var that = this;
    this.socket.on('details_result', function(result){
      that.fireDetailsAvailableEvent(result);
    });
    this.socket.emit('get_details', this.synonymName);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.synonymName);
  }
});

/**
 * DatabaseLink: This class represents an link in database and interacts with
 *  websocket calls to get link details
 * @constructor
 * @param {string} linkName - Name of the link in database
 */
var DatabaseLink = Class.create({
  linkName: null,
  socket: null,
  tabId: null,
  detailsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  initialize: function(linkName, tabId) {
    this.linkName = linkName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_link');
    this.detailsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getDetails: function() {
    var that = this;
    this.socket.on('details_result', function(result){
      that.fireDetailsAvailableEvent(result);
    });
    this.socket.emit('get_details', this.linkName);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.linkName);
  }
});

/**
 * DatabaseDirectory: This class represents an directory in database and interacts with
 *  websocket calls to get directory details
 * @constructor
 * @param {string} directoryName - Name of the directory in database
 */
var DatabaseDirectory = Class.create({
  directoryName: null,
  socket: null,
  tabId: null,
  detailsAvailableEventListeners: [],
  initialize: function(directoryName, tabId) {
    this.directoryName = directoryName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_directory');
    this.detailsAvailableEventListeners = [];
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getDetails: function() {
    var that = this;
    this.socket.on('details_result', function(result){
      that.fireDetailsAvailableEvent(result);
    });
    this.socket.emit('get_details', this.directoryName);
  }
});

/**
 * DatabaseQueue: This class represents an queue in database and interacts with
 *  websocket calls to get queue details
 * @constructor
 * @param {string} queueName - Name of the queue in database
 */
var DatabaseQueue = Class.create({
  queueName: null,
  socket: null,
  tabId: null,
  detailsAvailableEventListeners: [],
  sqlAvailableEventListeners: [],
  schedulesAvailableEventListeners: [],
  subscribersAvailableEventListeners: [],
  initialize: function(queueName, tabId) {
    this.queueName = queueName;
    this.tabId = tabId;
    this.socket = io('/oracle_db_queue');
    this.detailsAvailableEventListeners = [];
    this.sqlAvailableEventListeners = [];
    this.schedulesAvailableEventListeners = [];
    this.subscribersAvailableEventListeners = [];
  },
  addDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsAvailableEventListeners.push(listener);
    }
  },
  addSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlAvailableEventListeners.push(listener);
    }
  },
  addSchedulesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.schedulesAvailableEventListeners.push(listener);
    }
  },
  addSubscribersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.subscribersAvailableEventListeners.push(listener);
    }
  },
  removeDetailsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsAvailableEventListeners.indexOf(listener);
      this.detailsAvailableEventListeners.splice(index, 1);
    }
  },
  removeSQLAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlAvailableEventListeners.indexOf(listener);
      this.sqlAvailableEventListeners.splice(index, 1);
    }
  },
  removeSchedulesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.schedulesAvailableEventListeners.indexOf(listener);
      this.schedulesAvailableEventListeners.splice(index, 1);
    }
  },
  removeSubscribersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.subscribersAvailableEventListeners.indexOf(listener);
      this.subscribersAvailableEventListeners.splice(index, 1);
    }
  },
  fireDetailsAvailableEvent: function(result) {
    var that = this;
    this.detailsAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSQLAvailableEvent: function(result) {
    var that = this;
    this.sqlAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSchedulesAvailableEvent: function(result) {
    var that = this;
    this.schedulesAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  fireSubscribersAvailableEvent: function(result) {
    var that = this;
    this.subscribersAvailableEventListeners.forEach(function(listener){
      listener(result, that.tabId);
    });
  },
  getDetails: function() {
    var that = this;
    this.socket.on('details_result', function(result){
      that.fireDetailsAvailableEvent(result);
    });
    this.socket.emit('get_details', this.queueName);
  },
  getSQL: function() {
    var that = this;
    this.socket.on('sql_result', function(result){
      that.fireSQLAvailableEvent(result);
    });
    this.socket.emit('get_sql', this.queueName);
  },
  getSchedules: function() {
    var that = this;
    this.socket.on('schedules_result', function(result){
      that.fireSchedulesAvailableEvent(result);
    });
    this.socket.emit('get_schedules', this.queueName);
  },
  getSubscribers: function() {
    var that = this;
    this.socket.on('subscribers_result', function(result){
      that.fireSubscribersAvailableEvent(result);
    });
    this.socket.emit('get_subscribers', this.queueName);
  }
});