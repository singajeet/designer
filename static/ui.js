

/**
 * TableTabUI: Provides the user interface components to display details of an provided database table
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the table to be shown as label in UI components
 */
var TableTabUI = Class.create({
	id: null,
	label: null,
	mainContent: null,
  columnsGrid: null,
  dataGrid: null,
  constraintsGrid: null,
  constraintDetailsGrid: null,
  grantsGrid: null,
  statisticsGrid: null,
  statisticsDetailsGrid: null,
  triggersGrid: null,
  triggersEditor: null,
  dependenciesGrid: null,
  dependenciesDetailsGrid: null,
  constraintsGridClickedEventListeners: [],
  statisticsGridClickedEventListeners: [],
  triggersGridClickedEventListeners: [],
  dependenciesGridClickedEventListeners: [],
	initialize: function(id, label) {
		this.id = id;
		this.label = label;
		this.mainContent = "";
    this.columnsGrid = null;
    this.dataGrid = null;
    this.constraintsGrid = null;
    this.constraintDetailsGrid = null;
    this.grantsGrid = null;
    this.statisticsGrid = null;
    this.statisticsDetailsGrid = null;
    this.triggersGrid = null;
    this.triggersEditor = null;
    this.dependenciesGrid = null;
    this.dependenciesDetailsGrid = null;
    this.constraintsGridClickedEventListeners = [];
    this.statisticsGridClickedEventListeners = [];
    this.triggersGridClickedEventListeners = [];
    this.dependenciesGridClickedEventListeners = [];
	},
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
	getTabContent: function() {
		this.mainContent = "<div id='" + this.id + "-table-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-table-columns-grid'>Columns</a></li>" +
                            "   <li><a href='#" + this.id + "-table-data-grid'>Data</a></li>" +
                            "   <li><a href='#" + this.id + "-table-constraints-grid'>Constraints</a></li>" +
                            "   <li><a href='#" + this.id + "-table-grants-grid'>Grants</a></li>" +
                            "   <li><a href='#" + this.id + "-table-statistics-grid'>Statistics</a></li>" +
                            "   <li><a href='#" + this.id + "-table-triggers-grid'>Triggers</a></li>" +
                            "   <li><a href='#" + this.id + "-table-dependencies-grid'>Dependencies</a></li>" +
                            "   <li><a href='#" + this.id + "-table-partitions-grid'>Partitions</a></li>" +
                            "   <li><a href='#" + this.id + "-table-indexes-grid'>Indexes</a></li>" +
                            "   <li><a href='#" + this.id + "-table-sql-grid'>SQL</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-table-columns-grid' tabname='columns' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-table-data-grid' tabname='data' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-table-constraints-grid' tabname='constraints' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-table-constraints-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-table-constraints-grid-details' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-table-grants-grid' tabname='grants' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-table-statistics-grid' tabname='statistics' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-table-statistics-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-table-statistics-grid-details' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-table-triggers-grid' tabname='triggers' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-table-triggers-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-table-triggers-grid-editor' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-table-dependencies-grid' tabname='dependencies' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-table-dependencies-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-table-dependencies-grid-details' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-table-partitions-grid' tabname='partitions' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-table-indexes-grid' tabname='indexes' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-table-sql-grid' tabname='sql' style='width: 100%; height: 93%;'></div>" +
                            "</div>";
        return this.mainContent;
	},
  initTab: function() {
    $j('#' + this.id + '-table-info-tabs').tabs();
  },
	createColumnsGrid: function() {
    if(this.columnsGrid === null) {
  		this.columnsGrid = $j('#' + this.id + '-table-columns-grid')
                          .w2grid({
                                  name: this.id + '-table-columns-properties',
                                  header: this.label + ' - Columns',
                                  show: { header: true,
                                          toolbar: true,
                                          lineNumbers: true,
                                          footer: true
                                        },
                                  multiSearch: true,
                                  searches: [
                                    { field: 'columnName', caption: 'Column Name', type: 'text'},
                                    { field: 'dataType', caption: 'Data Type', type: 'text'}
                                  ],
                                  columns: [
                                    {field: 'columnName', caption: 'Column Name', size: '150px'},
                                    {field: 'dataType', caption: 'Data Type', size: '150px'},
                                    {field: 'nullable', caption: 'Nullable', size: '70px'},
                                    {field: 'dataDefault', caption: 'Data Default', size: '100px'},
                                    {field: 'columnId', caption: 'Column ID', size: '80px'},
                                    {field: 'comments', caption: 'Comments', size: '100%'}
                                  ]
                                });
    }
	},
  isColumnsGridCreated: function() {
    if(this.columnsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getColumnsGrid: function() {
    return this.columnsGrid;
  },
  createDataGrid: function() {
    if(this.dataGrid === null) {
      this.dataGrid = $j('#' + this.id + '-table-data-grid')
                      .w2grid({
                              name: this.id + '-table-data-properties',
                              header: this.label + ' - Data',
                              show: { header: true,
                                      toolbar: true,
                                      lineNumbers: true,
                                      footer: true
                                    },
                              multiSearch: true
                            });
    }
  },
  isDataGridCreated: function() {
    if(this.dataGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDataGrid: function() {
    return this.dataGrid;
  },
  createConstraintsGrid: function() {
    var that = this;
    if(this.constraintsGrid === null) {
      this.constraintsGrid = $j('#' + this.id + '-table-constraints-grid-master')
                              .w2grid({
                                      name: this.id + '-table-constraints-properties-master',
                                      header: this.label + ' - Constraints',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'constraintName', caption: 'Constraint Name', size: '150px'},
                                        {field: 'constraintType', caption: 'Constraint Type', size: '100px'},
                                        {field: 'searchCondition', caption: 'Search Condition', size: '150px'},
                                        {field: 'rOwner', caption: 'Ref Owner', size: '100px'},
                                        {field: 'rTablename', caption: 'Ref Tablename', size: '100px'},
                                        {field: 'rConstraintName', caption: 'Ref Constraint Name', size: '100px'},
                                        {field: 'deleteRule', caption: 'Delete Rule', size: '100px'},
                                        {field: 'status', caption: 'Status', size: '80px'},
                                        {field: 'deferrable', caption: 'Deferrable', size: '80px'},
                                        {field: 'validated', caption: 'Validated', size: '80px'},
                                        {field: 'generated', caption: 'Generated', size: '80px'},
                                        {field: 'bad', caption: 'Bad', size: '80px'},
                                        {field: 'rely', caption: 'Rely', size: '80px'},
                                        {field: 'lastChange', caption: 'Last Change', size: '100px'},
                                        {field: 'indexOwner', caption: 'Index Owner', size: '100px'},
                                        {field: 'indexName', caption: 'Index Name', size: '100px'},
                                        {field: 'invalid', caption: 'Invalid', size: '80px'},
                                        {field: 'viewRelated', caption: 'View Related', size: '80px'}
                                      ],
                                      onClick: function(event) {
                                        var record = this.get(event.recid);
                                        that.fireConstraintsGridClickedEvent(record);
                                      }
                                    });
      this.constraintDetailsGrid = $j('#' + this.id + '-table-constraints-grid-details')
                                    .w2grid({
                                            name: this.id + '-table-constraints-properties-details',
                                            header: this.label + ' - Constraint Columns',
                                            show: { header: true,
                                                    toolbar: true,
                                                    lineNumbers: true,
                                                    footer: true
                                                  },
                                            multiSearch: true,
                                            columns: [
                                              {field: 'columnName', caption: 'Column Name', size: '150px'},
                                              {field: 'columnPosition', caption: 'Column Position', size: '200px'}
                                            ]
                                          });
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
  isConstraintDetailsGridCreated: function() {
    if(this.constraintDetailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getConstraintDetailsGrid: function() {
    return this.constraintDetailsGrid;
  },
  createGrantsGrid: function() {
    if(this.grantsGrid === null){
      this.grantsGrid = $j('#' + this.id + '-table-grants-grid')
                          .w2grid({
                                  name: this.id + '-table-grants-properties',
                                  header: this.label + ' - Grants',
                                  show: { header: true,
                                          toolbar: true,
                                          lineNumbers: true,
                                          footer: true
                                        },
                                  multiSearch: true,
                                  columns: [
                                    {field: 'privilege', caption: 'Privilege', size: '150px'},
                                    {field: 'grantee', caption: 'Grantee', size: '100px'},
                                    {field: 'grantable', caption: 'Grantable', size: '100px'},
                                    {field: 'grantor', caption: 'Grantor', size: '100px'},
                                    {field: 'objectName', caption: 'Object Name', size: '100px'},
                                  ]
                                });
    }
  },
  isGrantsGridCreated: function() {
    if(this.grantsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getGrantsGrid: function() {
    return this.grantsGrid;
  },
  createStatisticsGrid: function() {
    var that = this;
    if(this.statisticsGrid == null) {
      this.statisticsGrid = $j('#' + this.id + '-table-statistics-grid-master')
                              .w2grid({
                                      name: this.id + '-table-statistics-properties-master',
                                      header: this.label + ' - Statistics',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'name', caption: 'Name', size: '150px'},
                                        {field: 'value', caption: 'Value', size: '150px'}
                                      ],
                                      onClick: function(event) {
                                        var record = this.get(event.recid);
                                        that.fireStatisticsGridClickedEvent(record);
                                      }
                                    });
      this.statisticsDetailsGrid = $j('#' + this.id + '-table-statistics-grid-details')
                                    .w2grid({
                                            name: this.id + '-table-statistics-properties-details',
                                            header: this.label + ' - Statistics Details',
                                            show: { header: true,
                                                    toolbar: true,
                                                    lineNumbers: true,
                                                    footer: true
                                                  },
                                            multiSearch: true,
                                            columns: [
                                              {field: 'tableName', caption: 'Table Name', size: '150px'},
                                              {field: 'columnName', caption: 'Column Name', size: '150px'},
                                              {field: 'numDistinct', caption: 'Num Distinct', size: '150px'},
                                              {field: 'lowValue', caption: 'Low Value', size: '150px'},
                                              {field: 'highValue', caption: 'High Value', size: '150px'},
                                              {field: 'density', caption: 'Density', size: '150px'},
                                              {field: 'numNulls', caption: 'Num NULLs', size: '150px'},
                                              {field: 'numBuckets', caption: 'Num Buckets', size: '150px'},
                                              {field: 'lastAnalyzed', caption: 'Last Analyzed', size: '150px'},
                                              {field: 'sampleSize', caption: 'Sample Size', size: '150px'},
                                              {field: 'globalStats', caption: 'Global Stats', size: '150px'},
                                              {field: 'userStats', caption: 'User Stats', size: '150px'},
                                              {field: 'avgColLen', caption: 'Avg Column Length', size: '150px'},
                                              {field: 'histogram', caption: 'Histogram', size: '150px'}
                                            ]
                                          });
    }
  },
  isStatisticsGridCreated: function() {
    if(this.statisticsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getStatisticsGrid: function() {
    return this.statisticsGrid;
  },
  isStatisticsDetailsGridCreated: function() {
    if(this.statisticsDetailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getStatisticsDetailsGrid: function() {
    return this.statisticsDetailsGrid;
  },
  createTriggersGrid: function() {
    var that = this;
    if(this.triggersGrid === null) {
      this.triggersGrid = $j('#' + this.id + '-table-triggers-grid-master')
                              .w2grid({
                                      name: this.id + '-table-triggers-properties-master',
                                      header: this.label + ' - Triggers',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'triggerName', caption: 'Trigger Name', size: '150px'},
                                        {field: 'triggerType', caption: 'Trigger Type', size: '150px'},
                                        {field: 'triggerOwner', caption: 'Trigger Owner', size: '150px'},
                                        {field: 'triggeringEvent', caption: 'Triggering Event', size: '150px'},
                                        {field: 'status', caption: 'Status', size: '150px'},
                                        {field: 'tableName', caption: 'Table Name', size: '150px'}
                                      ],
                                      onClick: function(event) {
                                        var record = this.get(event.recid);
                                        that.fireTriggersGridClickedEvent(record);
                                      }
                                    });
      // ace.require("ace/ext/language_tools");
      this.triggersEditor = ace.edit(this.id + '-table-triggers-grid-editor');
      this.triggersEditor.setTheme('ace/theme/sqlserver');
      this.triggersEditor.session.setMode('ace/mode/sqlserver');
      this.triggersEditor.setReadOnly(true);
      // enable autocompletion and snippets
      // this.triggersEditor.setOptions({
      //     enableBasicAutocompletion: true,
      //     enableSnippets: true,
      //     enableLiveAutocompletion: true
      // });
    }
  },
  isTriggersGridCreated: function() {
    if(this.triggersGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getTriggersGrid: function() {
    return this.triggersGrid;
  },
  isTriggersEditorcreated: function() {
    if(this.triggersEditor === null) {
      return false;
    } else {
      return true;
    }
  },
  getTriggersEditor: function() {
    return this.triggersEditor;
  },
  createDependenciesGrid: function() {
    var that = this;
    if(this.dependenciesGrid === null) {
      this.dependenciesGrid = $j('#' + this.id + '-table-dependencies-grid-master')
                              .w2grid({
                                      name: this.id + '-table-dependencies-properties-master',
                                      header: this.label + ' - Dependencies',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'name', caption: 'Name', size: '150px'},
                                        {field: 'type', caption: 'Type', size: '150px'},
                                        {field: 'referencedOwner', caption: 'Referenced Owner', size: '150px'},
                                        {field: 'referencedName', caption: 'Referenced Name', size: '150px'},
                                        {field: 'referencedType', caption: 'Referenced Type', size: '150px'}
                                      ],
                                      onClick: function(event) {
                                        var record = this.get(event.recid);
                                        that.fireDependenciesGridClickedEvent(record);
                                      }
                                    });
      this.dependenciesDetailsGrid = $j('#' + this.id + '-table-dependencies-grid-details')
                                      .w2grid({
                                              name: this.id + '-table-dependencies-properties-details',
                                              header: this.label + ' - References',
                                              show: { header: true,
                                                      toolbar: true,
                                                      lineNumbers: true,
                                                      footer: true
                                                    },
                                              multiSearch: true,
                                              columns: [
                                                {field: 'name', caption: 'Name', size: '150px'},
                                                {field: 'type', caption: 'Type', size: '150px'},
                                                {field: 'referencedOwner', caption: 'Referenced Owner', size: '150px'},
                                                {field: 'referencedName', caption: 'Referenced Name', size: '150px'},
                                                {field: 'referencedType', caption: 'Referenced Type', size: '150px'}
                                              ]
                                            });
    }
  },
  isDependenciesGridCreated: function() {
    if(this.dependenciesGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDependenciesGrid: function() {
    return this.dependenciesGrid;
  },
  isDependenciesDetailsGridCreated: function() {
    if(this.dependenciesDetailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDependenciesDetailsGrid: function() {
    return this.dependenciesDetailsGrid;
  },
  addTabsBeforeActivateEventListener: function(listener) {
    $j('#' + this.id + '-table-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.columnsGrid !== null) {
      this.columnsGrid.destroy();
    }
    if(this.dataGrid !== null) {
      this.dataGrid.destroy();
    }
    if(this.constraintsGrid !== null) {
      this.constraintsGrid.destroy();
    }
    if(this.constraintDetailsGrid !== null) {
      this.constraintDetailsGrid.destroy();
    }
    if(this.grantsGrid !== null) {
      this.grantsGrid.destroy();
    }
    if(this.statisticsGrid !== null) {
      this.statisticsGrid.destroy();
    }
    if(this.statisticsDetailsGrid !== null) {
      this.statisticsDetailsGrid.destroy();
    }
    if(this.triggersGrid !== null) {
      this.triggersGrid.destroy();
    }
    if(this.triggersEditor !== null) {
      this.triggersEditor.destroy();
    }
    if(this.dependenciesGrid !== null) {
      this.dependenciesGrid.destroy();
    }
    if(this.dependenciesDetailsGrid !== null) {
      this.dependenciesDetailsGrid.destroy();
    }
  },
  addConstraintsGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.constraintsGridClickedEventListeners.push(listener);
    }
  },
  removeConstraintsGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.constraintsGridClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.constraintsGridClickedEventListeners.split(index, 1);
      }
    }
  },
  fireConstraintsGridClickedEvent: function(record) {
    var that = this;
    this.constraintsGridClickedEventListeners.forEach(function(listener){
      listener(record, that);
    });
  },
  addStatisticsGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.statisticsGridClickedEventListeners.push(listener);
    }
  },
  removeStatisticsGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.statisticsGridClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.statisticsGridClickedEventListeners.split(index, 1);
      }
    }
  },
  fireStatisticsGridClickedEvent: function(record) {
    var that = this;
    this.statisticsGridClickedEventListeners.forEach(function(listener){
      listener(record, that);
    });
  },
  addTriggersGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.triggersGridClickedEventListeners.push(listener);
    }
  },
  removeTriggersGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.triggersGridClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.triggersGridClickedEventListeners.split(index, 1);
      }
    }
  },
  fireTriggersGridClickedEvent: function(record) {
    var that = this;
    this.triggersGridClickedEventListeners.forEach(function(listener){
      listener(record, that);
    });
  },
  addDependenciesGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesGridClickedEventListeners.push(listener);
    }
  },
  removeDependenciesGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesGridClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.dependenciesGridClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDependenciesGridClickedEvent: function(record) {
    var that = this;
    this.dependenciesGridClickedEventListeners.forEach(function(listener){
      listener(record, that);
    });
  }
});