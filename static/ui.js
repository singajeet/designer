

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
  indexesGrid: null,
  indexesDetailsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  constraintsGridClickedEventListeners: [],
  statisticsGridClickedEventListeners: [],
  triggersGridClickedEventListeners: [],
  dependenciesGridClickedEventListeners: [],
  indexesGridClickedEventListeners: [],
  columnsReloadButtonClickedEventListeners: [],
  dataReloadButtonClickedEventListeners: [],
  constraintsReloadButtonClickedEventListeners: [],
  grantsReloadButtonClickedEventListeners: [],
  statisticsReloadButtonClickedEventListeners: [],
  triggersReloadButtonClickedEventListeners: [],
  dependenciesReloadButtonClickedEventListeners: [],
  indexesReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
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
    this.indexesGrid = null;
    this.indexesDetailsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;

    this.constraintsGridClickedEventListeners = [];
    this.statisticsGridClickedEventListeners = [];
    this.triggersGridClickedEventListeners = [];
    this.dependenciesGridClickedEventListeners = [];
    this.indexesGridClickedEventListeners = [];

    this.columnsReloadButtonClickedEventListeners = [];
    this.dataReloadButtonClickedEventListeners = [];
    this.constraintsReloadButtonClickedEventListeners = [];
    this.grantsReloadButtonClickedEventListeners = [];
    this.statisticsReloadButtonClickedEventListeners = [];
    this.triggersReloadButtonClickedEventListeners = [];
    this.dependenciesReloadButtonClickedEventListeners = [];
    this.indexesReloadButtonClickedEventListeners = [];
    this.sqlReloadButtonClickedEventListeners = [];
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
                            "   <li><a href='#" + this.id + "-table-sql-editor-layout'>SQL</a></li>" +
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
                            " <div id='" + this.id + "-table-partitions-grid' tabname='partitions' style='width: 100%; height: 93%;'>" +
                            "   <div style='height: 100%; width: 100%; border: 1px solid lightgrey; padding: 5px; text-align: center'>" +
                            "     <h1 style='margin-top: 20%'>This feature is not available yet!</h1>" +
                            "   </div>" +
                            " </div>" +
                            " <div id='" + this.id + "-table-indexes-grid' tabname='indexes' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-table-indexes-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-table-indexes-grid-details' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-table-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-table-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-table-sql-editor' style='width: 100%; height: 96%;'></div>" + 
                            " </div>"
                            "</div>";
        return this.mainContent;
	},
  initTab: function() {
    $j('#' + this.id + '-table-info-tabs').tabs();
  },
	createColumnsGrid: function() {
    var that = this;
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
                                  ],
                                  onReload: function(event) {
                                    that.fireColumnsReloadButtonClickedEvent();
                                  }
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
    var that = this;
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
                              multiSearch: true,
                              onReload: function(event) {
                                that.fireDataReloadButtonClickedEvent();
                              }
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
                                      },
                                      onReload: function(event) {
                                        that.fireConstraintsReloadButtonClickedEvent();
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
    var that = this;
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
                                  ],
                                  onReload: function(event) {
                                    that.fireGrantsReloadButtonClickedEvent();
                                  }
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
                                      },
                                      onReload: function(event) {
                                        that.fireStatisticsReloadButtonClickedEvent();
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
                                      },
                                      onReload: function(event) {
                                        that.fireTriggersReloadButtonClickedEvent();
                                      }
                                    });

      this.triggersEditor = ace.edit(this.id + '-table-triggers-grid-editor');
      this.triggersEditor.setTheme('ace/theme/sqlserver');
      this.triggersEditor.session.setMode('ace/mode/sqlserver');
      this.triggersEditor.setReadOnly(true);
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
                                      },
                                      onReload: function(event) {
                                        that.fireDependenciesReloadButtonClickedEvent();
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
  createIndexesGrid: function() {
    var that = this;
    if(this.indexesGrid === null) {
      this.indexesGrid = $j('#' + this.id + '-table-indexes-grid-master')
                              .w2grid({
                                      name: this.id + '-table-indexes-properties-master',
                                      header: this.label + ' - Indexes',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'indexName', caption: 'Index Name', size: '150px'},
                                        {field: 'uniqueness', caption: 'Uniqueness', size: '150px'},
                                        {field: 'status', caption: 'Status', size: '150px'},
                                        {field: 'indexType', caption: 'Index Type', size: '150px'},
                                        {field: 'temporary', caption: 'Temporary', size: '150px'},
                                        {field: 'partitioned', caption: 'Partitioned', size: '150px'},
                                        {field: 'funcIdxStatus', caption: 'Function Index Status', size: '150px'},
                                        {field: 'joinIndex', caption: 'Join Index', size: '150px'},
                                        {field: 'columns', caption: 'Columns', size: '150px'},
                                      ],
                                      onClick: function(event) {
                                        var record = this.get(event.recid);
                                        that.fireIndexesGridClickedEvent(record);
                                      },
                                      onReload: function(event) {
                                        that.fireIndexesReloadButtonClickedEvent();
                                      }
                                    });
      this.indexesDetailsGrid = $j('#' + this.id + '-table-indexes-grid-details')
                                      .w2grid({
                                              name: this.id + '-table-indexes-properties-details',
                                              header: this.label + ' - Index Details',
                                              show: { header: true,
                                                      toolbar: true,
                                                      lineNumbers: true,
                                                      footer: true
                                                    },
                                              multiSearch: true,
                                              columns: [
                                                {field: 'indexName', caption: 'Index Name', size: '150px'},
                                                {field: 'tableOwner', caption: 'Table Owner', size: '150px'},
                                                {field: 'tableName', caption: 'Table Name', size: '150px'},
                                                {field: 'columnName', caption: 'Column Name', size: '150px'},
                                                {field: 'columnPosition', caption: 'Column Position', size: '150px'},
                                                {field: 'columnLength', caption: 'Column Length', size: '150px'},
                                                {field: 'charLength', caption: 'Char Length', size: '150px'},
                                                {field: 'descend', caption: 'Descend', size: '150px'},
                                                {field: 'columnExpression', caption: 'Column Expression', size: '150px'},
                                              ]
                                            });
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
  isIndexesDetailsGridCreated: function() {
    if(this.indexesDetailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getIndexesDetailsGrid: function() {
    return this.indexesDetailsGrid;
  },
  createSQLEditor: function() {
    var that = this;
    if(this.sqlEditor === null) {
      this.sqlEditorToolbar = $j('#' + this.id + '-table-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-table-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-table-sql-editor-toolbar-refresh-sql-btn', 
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-table-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      // ace.require("ace/ext/language_tools");
      this.sqlEditor = ace.edit(this.id + '-table-sql-editor');
      this.sqlEditor.setTheme('ace/theme/sqlserver');
      this.sqlEditor.session.setMode('ace/mode/sqlserver');
      this.sqlEditor.setReadOnly(true);
      // enable autocompletion and snippets
      // this.triggersEditor.setOptions({
      //     enableBasicAutocompletion: true,
      //     enableSnippets: true,
      //     enableLiveAutocompletion: true
      // });
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
    if(this.indexesGrid !== null) {
      this.indexesGrid.destroy();
    }
    if(this.indexesDetailsGrid !== null) {
      this.indexesDetailsGrid.destroy();
    }
    if(this.sqlEditor !== null) {
      this.sqlEditor.destroy();
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
  },
  addIndexesGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.indexesGridClickedEventListeners.push(listener);
    }
  },
  removeIndexesGridClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.indexesGridClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.indexesGridClickedEventListeners.split(index, 1);
      }
    }
  },
  fireIndexesGridClickedEvent: function(record) {
    var that = this;
    this.indexesGridClickedEventListeners.forEach(function(listener){
      listener(record, that);
    });
  },
  addColumnsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.columnsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeColumnsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.columnsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.columnsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireColumnsReloadButtonClickedEvent: function() {
    var that = this;
    this.columnsReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addDataReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dataReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeDataReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dataReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.dataReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDataReloadButtonClickedEvent: function() {
    var that = this;
    this.dataReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addConstraintsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.constraintsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeConstraintsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.constraintsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.constraintsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireConstraintsReloadButtonClickedEvent: function() {
    var that = this;
    this.constraintsReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addGrantsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.grantsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeGrantsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.grantsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.grantsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireGrantsReloadButtonClickedEvent: function() {
    var that = this;
    this.grantsReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addStatisticsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.statisticsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeStatisticsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.statisticsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.statisticsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireStatisticsReloadButtonClickedEvent: function() {
    var that = this;
    this.statisticsReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addTriggersReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.triggersReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeTriggersReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.triggersReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.triggersReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireTriggersReloadButtonClickedEvent: function() {
    var that = this;
    this.triggersReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addDependenciesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.dependenciesReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeDependenciesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.dependenciesReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.dependenciesReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDependenciesReloadButtonClickedEvent: function() {
    var that = this;
    this.dependenciesReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addIndexesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.indexesReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeIndexesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.indexesReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.indexesReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireIndexesReloadButtonClickedEvent: function() {
    var that = this;
    this.indexesReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addSQLReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sqlReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeSQLReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.sqlReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.sqlReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireSQLReloadButtonClickedEvent: function() {
    var that = this;
    this.sqlReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  }
});

/**
 * ViewTabUI: Provides the user interface components to display details of an provided database view
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the view to be shown as label in UI components
 */
var ViewTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  columnsGrid: null,
  dataGrid: null,
  grantsGrid: null,
  triggersGrid: null,
  triggersEditor: null,
  dependenciesGrid: null,
  dependenciesDetailsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  triggersGridClickedEventListeners: [],
  dependenciesGridClickedEventListeners: [],
  columnsReloadButtonClickedEventListeners: [],
  dataReloadButtonClickedEventListeners: [],
  grantsReloadButtonClickedEventListeners: [],
  triggersReloadButtonClickedEventListeners: [],
  dependenciesReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.columnsGrid = null;
    this.dataGrid = null;
    this.grantsGrid = null;
    this.triggersGrid = null;
    this.triggersEditor = null;
    this.dependenciesGrid = null;
    this.dependenciesDetailsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.triggersGridClickedEventListeners = [];
    this.dependenciesGridClickedEventListeners = [];
    this.columnsReloadButtonClickedEventListeners = [];
    this.dataReloadButtonClickedEventListeners = [];
    this.grantsReloadButtonClickedEventListeners = [];
    this.triggersReloadButtonClickedEventListeners = [];
    this.dependenciesReloadButtonClickedEventListeners = [];
    this.sqlReloadButtonClickedEventListeners = [];
  },
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
  getTabContent: function() {
    this.mainContent = "<div id='" + this.id + "-view-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-view-columns-grid'>Columns</a></li>" +
                            "   <li><a href='#" + this.id + "-view-data-grid'>Data</a></li>" +
                            "   <li><a href='#" + this.id + "-view-grants-grid'>Grants</a></li>" +
                            "   <li><a href='#" + this.id + "-view-triggers-grid'>Triggers</a></li>" +
                            "   <li><a href='#" + this.id + "-view-dependencies-grid'>Dependencies</a></li>" +
                            "   <li><a href='#" + this.id + "-view-sql-editor-layout'>SQL</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-view-columns-grid' tabname='columns' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-view-data-grid' tabname='data' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-view-grants-grid' tabname='grants' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-view-triggers-grid' tabname='triggers' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-view-triggers-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-view-triggers-grid-editor' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-view-dependencies-grid' tabname='dependencies' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-view-dependencies-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-view-dependencies-grid-details' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-view-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-view-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-view-sql-editor' style='width: 100%; height: 96%;'></div>" + 
                            " </div>"
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-view-info-tabs').tabs();
  },
  createColumnsGrid: function() {
    var that = this;
    if(this.columnsGrid === null) {
      this.columnsGrid = $j('#' + this.id + '-view-columns-grid')
                          .w2grid({
                                  name: this.id + '-view-columns-properties',
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
                                  ],
                                  onReload: function(event) {
                                    that.fireColumnsReloadButtonClickedEvent();
                                  }
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
    var that = this;
    if(this.dataGrid === null) {
      this.dataGrid = $j('#' + this.id + '-view-data-grid')
                      .w2grid({
                              name: this.id + '-view-data-properties',
                              header: this.label + ' - Data',
                              show: { header: true,
                                      toolbar: true,
                                      lineNumbers: true,
                                      footer: true
                                    },
                              multiSearch: true,
                              onReload: function(event) {
                                that.fireDataReloadButtonClickedEvent();
                              }
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
  createGrantsGrid: function() {
    var that = this;
    if(this.grantsGrid === null){
      this.grantsGrid = $j('#' + this.id + '-view-grants-grid')
                          .w2grid({
                                  name: this.id + '-view-grants-properties',
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
                                  ],
                                  onReload: function(event) {
                                    that.fireGrantsReloadButtonClickedEvent();
                                  }
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
  createTriggersGrid: function() {
    var that = this;
    if(this.triggersGrid === null) {
      this.triggersGrid = $j('#' + this.id + '-view-triggers-grid-master')
                              .w2grid({
                                      name: this.id + '-view-triggers-properties-master',
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
                                      },
                                      onReload: function(event) {
                                        that.fireTriggersReloadButtonClickedEvent();
                                      }
                                    });

      this.triggersEditor = ace.edit(this.id + '-view-triggers-grid-editor');
      this.triggersEditor.setTheme('ace/theme/sqlserver');
      this.triggersEditor.session.setMode('ace/mode/sqlserver');
      this.triggersEditor.setReadOnly(true);
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
      this.dependenciesGrid = $j('#' + this.id + '-view-dependencies-grid-master')
                              .w2grid({
                                      name: this.id + '-view-dependencies-properties-master',
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
                                      },
                                      onReload: function(event) {
                                        that.fireDependenciesReloadButtonClickedEvent();
                                      }
                                    });
      this.dependenciesDetailsGrid = $j('#' + this.id + '-view-dependencies-grid-details')
                                      .w2grid({
                                              name: this.id + '-view-dependencies-properties-details',
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
  createSQLEditor: function() {
    var that = this;
    if(this.sqlEditor === null) {
      this.sqlEditorToolbar = $j('#' + this.id + '-view-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-view-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-view-sql-editor-toolbar-refresh-sql-btn', 
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-view-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-view-sql-editor');
      this.sqlEditor.setTheme('ace/theme/sqlserver');
      this.sqlEditor.session.setMode('ace/mode/sqlserver');
      this.sqlEditor.setReadOnly(true);
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
  addTabsBeforeActivateEventListener: function(listener) {
    $j('#' + this.id + '-view-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.columnsGrid !== null) {
      this.columnsGrid.destroy();
    }
    if(this.dataGrid !== null) {
      this.dataGrid.destroy();
    }
    if(this.grantsGrid !== null) {
      this.grantsGrid.destroy();
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
    if(this.sqlEditor !== null) {
      this.sqlEditor.destroy();
    }
  },
});