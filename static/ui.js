

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
                            " </div>" +
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
                                  toolbar: {
                                    items: [
                                      {type: 'break'},
                                      {id: this.id + '-edit-table', type: 'button', caption: 'Edit', icon: 'edit_icon'}
                                    ],
                                    onClick: function(event) {
                                      if(event.target === that.id + '-edit-table') {
                                        window.history.pushState(null, null, '?id=' + that.id);
                                        w2popup.load({ url: '/edit-table', showMax: true, modal: true, showClose: false });
                                      }
                                    }
                                  },
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
                                        {field: 'columns', caption: 'Columns', size: '150px'}
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
                                                {field: 'columnExpression', caption: 'Column Expression', size: '150px'}
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
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
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
  errorsGrid: null,
  triggersGridClickedEventListeners: [],
  dependenciesGridClickedEventListeners: [],
  columnsReloadButtonClickedEventListeners: [],
  dataReloadButtonClickedEventListeners: [],
  grantsReloadButtonClickedEventListeners: [],
  triggersReloadButtonClickedEventListeners: [],
  dependenciesReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  errorsReloadButtonClickedEventListeners: [],
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
    this.errorsGrid = null;
    this.triggersGridClickedEventListeners = [];
    this.dependenciesGridClickedEventListeners = [];
    this.columnsReloadButtonClickedEventListeners = [];
    this.dataReloadButtonClickedEventListeners = [];
    this.grantsReloadButtonClickedEventListeners = [];
    this.triggersReloadButtonClickedEventListeners = [];
    this.dependenciesReloadButtonClickedEventListeners = [];
    this.sqlReloadButtonClickedEventListeners = [];
    this.errorsReloadButtonClickedEventListeners = [];
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
                            "   <li><a href='#" + this.id + "-view-errors-grid'>Errors</a></li>" +
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
                            " </div>" +
                            " <div id='" + this.id + "-view-errors-grid' tabname='errors' style='width: 100%; height: 93%;'></div>" +
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
                                    {field: 'comments', caption: 'Comments', size: '100%'},
                                    {field: 'insertable', caption: 'Insertable', size: '100%'},
                                    {field: 'updatable', caption: 'Updatable', size: '100%'},
                                    {field: 'deletable', caption: 'Deletable', size: '100%'}
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
                                        {field: 'viewName', caption: 'View Name', size: '150px'}
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
  createErrorsGrid: function() {
    var that = this;
    if(this.errorsGrid === null) {
      this.errorsGrid = $j('#' + this.id + '-view-errors-grid')
                              .w2grid({
                                      name: this.id + '-view-errors-properties',
                                      header: this.label + ' - Errors',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'attribute', caption: 'Attribute', size: '150px'},
                                        {field: 'linePosition', caption: 'Line : Position', size: '150px'},
                                        {field: 'text', caption: 'Text', size: '150px'}
                                      ],
                                      onReload: function(event) {
                                        that.fireErrorsReloadButtonClickedEvent();
                                      }
                                    });
    }
  },
  isErrorsGridCreated: function() {
    if(this.errorsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getErrorsGrid: function() {
    return this.errorsGrid;
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
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
    if(this.errorsGrid !== null) {
      this.errorsGrid.destroy();
    }
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
  },
  addErrorsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.errorsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeErrorsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.errorsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.errorsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireErrorsReloadButtonClickedEvent: function() {
    var that = this;
    this.errorsReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  }
});

/**
 * IndexTabUI: Provides the user interface components to display details of an provided database index
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the index to be shown as label in UI components
 */
var IndexTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  columnsGrid: null,
  statisticsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  columnsReloadButtonClickedEventListeners: [],
  statisticsReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.columnsGrid = null;
    this.statisticsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.columnsReloadButtonClickedEventListeners = [];
    this.statisticsReloadButtonClickedEventListeners = [];
    this.sqlReloadButtonClickedEventListeners = [];
  },
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
  getTabContent: function() {
    this.mainContent = "<div id='" + this.id + "-index-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-index-columns-grid'>Columns</a></li>" +
                            "   <li><a href='#" + this.id + "-index-statistics-grid'>Statistics</a></li>" +
                            "   <li><a href='#" + this.id + "-index-sql-editor-layout'>SQL</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-index-columns-grid' tabname='columns' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-index-statistics-grid' tabname='statistics' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-index-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-index-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-index-sql-editor' style='width: 100%; height: 96%;'></div>" +
                            " </div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-index-info-tabs').tabs();
  },
  createColumnsGrid: function() {
    var that = this;
    if(this.columnsGrid === null) {
      this.columnsGrid = $j('#' + this.id + '-index-columns-grid')
                            .w2grid({
                                    name: this.id + '-index-columns-properties',
                                    header: this.label + ' - Columns',
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
                                      {field: 'descend', caption: 'Descend', size: '150px'}
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
  createStatisticsGrid: function() {
    var that = this;
    if(this.statisticsGrid === null) {
      this.statisticsGrid = $j('#' + this.id + '-index-statistics-grid')
                            .w2grid({
                                    name: this.id + '-index-statistics-properties',
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
                                    onReload: function(event) {
                                      that.fireStatisticsReloadButtonClickedEvent();
                                    }
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
  createSQLEditor: function() {
    var that = this;
    if(this.sqlEditor === null) {
      this.sqlEditorToolbar = $j('#' + this.id + '-index-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-index-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-index-sql-editor-toolbar-refresh-sql-btn',
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-index-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-index-sql-editor');
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
    $j('#' + this.id + '-index-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.columnsGrid !== null) {
      this.columnsGrid.destroy();
    }
    if(this.statisticsGrid !== null) {
      this.statisticsGrid.destroy();
    }
    if(this.sqlEditor !== null) {
      this.sqlEditor.destroy();
    }
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
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
 * MaterializedViewTabUI: Provides the user interface components to display details of an provided database mview
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the mview to be shown as label in UI components
 */
var MaterializedViewTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  columnsGrid: null,
  dataGrid: null,
  grantsGrid: null,
  indexesGrid: null,
  indexesDetailsGrid: null,
  dependenciesGrid: null,
  dependenciesDetailsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  indexesGridClickedEventListeners: [],
  dependenciesGridClickedEventListeners: [],
  columnsReloadButtonClickedEventListeners: [],
  dataReloadButtonClickedEventListeners: [],
  grantsReloadButtonClickedEventListeners: [],
  indexesReloadButtonClickedEventListeners: [],
  dependenciesReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.columnsGrid = null;
    this.dataGrid = null;
    this.grantsGrid = null;
    this.indexesGrid = null;
    this.indexesDetailsGrid = null;
    this.dependenciesGrid = null;
    this.dependenciesDetailsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.indexesGridClickedEventListeners = [];
    this.dependenciesGridClickedEventListeners = [];
    this.columnsReloadButtonClickedEventListeners = [];
    this.dataReloadButtonClickedEventListeners = [];
    this.grantsReloadButtonClickedEventListeners = [];
    this.indexesReloadButtonClickedEventListeners = [];
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
    this.mainContent = "<div id='" + this.id + "-mview-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-mview-columns-grid'>Columns</a></li>" +
                            "   <li><a href='#" + this.id + "-mview-data-grid'>Data</a></li>" +
                            "   <li><a href='#" + this.id + "-mview-grants-grid'>Grants</a></li>" +
                            "   <li><a href='#" + this.id + "-mview-indexes-grid'>Indexes</a></li>" +
                            "   <li><a href='#" + this.id + "-mview-dependencies-grid'>Dependencies</a></li>" +
                            "   <li><a href='#" + this.id + "-mview-sql-editor-layout'>SQL</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-mview-columns-grid' tabname='columns' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-mview-data-grid' tabname='data' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-mview-grants-grid' tabname='grants' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-mview-indexes-grid' tabname='indexes' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-mview-indexes-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-mview-indexes-grid-details' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-mview-dependencies-grid' tabname='dependencies' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-mview-dependencies-grid-master' style='width: 100%; height: 50%;'></div>" +
                            "   <div id='" + this.id + "-mview-dependencies-grid-details' style='width: 100%; height: 50%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-mview-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-mview-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-mview-sql-editor' style='width: 100%; height: 96%;'></div>" +
                            " </div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-mview-info-tabs').tabs();
  },
  createColumnsGrid: function() {
    var that = this;
    if(this.columnsGrid === null) {
      this.columnsGrid = $j('#' + this.id + '-mview-columns-grid')
                          .w2grid({
                                  name: this.id + '-mview-columns-properties',
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
      this.dataGrid = $j('#' + this.id + '-mview-data-grid')
                      .w2grid({
                              name: this.id + '-mview-data-properties',
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
      this.grantsGrid = $j('#' + this.id + '-mview-grants-grid')
                          .w2grid({
                                  name: this.id + '-mview-grants-properties',
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
  createIndexesGrid: function() {
    var that = this;
    if(this.indexesGrid === null) {
      this.indexesGrid = $j('#' + this.id + '-mview-indexes-grid-master')
                              .w2grid({
                                      name: this.id + '-mview-indexes-properties-master',
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
                                        {field: 'columns', caption: 'Columns', size: '150px'}
                                      ],
                                      onClick: function(event) {
                                        var record = this.get(event.recid);
                                        that.fireIndexesGridClickedEvent(record);
                                      },
                                      onReload: function(event) {
                                        that.fireIndexesReloadButtonClickedEvent();
                                      }
                                    });
      this.indexesDetailsGrid = $j('#' + this.id + '-mview-indexes-grid-details')
                                  .w2grid({
                                          name: this.id + '-mview-indexes-properties-details',
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
                                            {field: 'columnExpression', caption: 'Column Expression', size: '150px'}
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
  createDependenciesGrid: function() {
    var that = this;
    if(this.dependenciesGrid === null) {
      this.dependenciesGrid = $j('#' + this.id + '-mview-dependencies-grid-master')
                              .w2grid({
                                      name: this.id + '-mview-dependencies-properties-master',
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
      this.dependenciesDetailsGrid = $j('#' + this.id + '-mview-dependencies-grid-details')
                                      .w2grid({
                                              name: this.id + '-mview-dependencies-properties-details',
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
      this.sqlEditorToolbar = $j('#' + this.id + '-mview-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-mview-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-mview-sql-editor-toolbar-refresh-sql-btn',
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-mview-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-mview-sql-editor');
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
    $j('#' + this.id + '-mview-info-tabs').on('tabsbeforeactivate', listener);
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
    if(this.indexesGrid !== null) {
      this.indexesGrid.destroy();
    }
    if(this.indexesDetailsGrid !== null) {
      this.indexesDetailsGrid.destroy();
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
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
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
 * PLSQLTabUI: Provides the user interface components to display details of an provided database procedures, functions, packages and package body
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the procedures, functions, packages or package body to be shown as label in UI components
 */
var PLSQLTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  errorsGrid: null,
  dependenciesGrid: null,
  profilesGrid: null,
  grantsGrid: null,
  referencesGrid: null,
  sqlReloadButtonClickedEventListeners: [],
  errorsReloadButtonClickedEventListeners: [],
  dependenciesReloadButtonClickedEventListeners: [],
  profilesReloadButtonClickedEventListeners: [],
  grantsReloadButtonClickedEventListeners: [],
  referencesReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.errorsGrid = null;
    this.dependenciesGrid = null;
    this.profilesGrid = null;
    this.grantsGrid = null;
    this.referencesGrid = null;
    this.sqlReloadButtonClickedEventListeners = [];
    this.errorsReloadButtonClickedEventListeners = [];
    this.dependenciesReloadButtonClickedEventListeners = [];
    this.profilesReloadButtonClickedEventListeners = [];
    this.grantsReloadButtonClickedEventListeners = [];
    this.referencesReloadButtonClickedEventListeners = [];
  },
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
  getTabContent: function() {
    this.mainContent = "<div id='" + this.id + "-plsql-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-plsql-sql-editor-layout'>Code</a></li>" +
                            "   <li><a href='#" + this.id + "-plsql-errors-grid'>Errors</a></li>" +
                            "   <li><a href='#" + this.id + "-plsql-dependencies-grid'>Dependencies</a></li>" +
                            "   <li><a href='#" + this.id + "-plsql-profiles-grid'>Profiles</a></li>" +
                            "   <li><a href='#" + this.id + "-plsql-grants-grid'>Grants</a></li>" +
                            "   <li><a href='#" + this.id + "-plsql-references-grid'>References</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-plsql-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-plsql-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-plsql-sql-editor' style='width: 100%; height: 96%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-plsql-errors-grid' tabname='errors' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-plsql-dependencies-grid' tabname='dependencies' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-plsql-profiles-grid' tabname='profiles' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-plsql-grants-grid' tabname='grants' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-plsql-references-grid' tabname='references' style='width: 100%; height: 93%;'></div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-plsql-info-tabs').tabs();
  },
  createSQLEditor: function() {
    var that = this;
    if(this.sqlEditor === null) {
      this.sqlEditorToolbar = $j('#' + this.id + '-plsql-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-plsql-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-plsql-sql-editor-toolbar-refresh-sql-btn',
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-plsql-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-plsql-sql-editor');
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
  createErrorsGrid: function() {
    var that = this;
    if(this.errorsGrid === null) {
      this.errorsGrid = $j('#' + this.id + '-plsql-errors-grid')
                              .w2grid({
                                      name: this.id + '-plsql-errors-properties',
                                      header: this.label + ' - Errors',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'attribute', caption: 'Attribute', size: '150px'},
                                        {field: 'linePosition', caption: 'Line : Position', size: '150px'},
                                        {field: 'text', caption: 'Text', size: '150px'}
                                      ],
                                      onReload: function(event) {
                                        that.fireErrorsReloadButtonClickedEvent();
                                      }
                                    });
    }
  },
  isErrorsGridCreated: function() {
    if(this.errorsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getErrorsGrid: function() {
    return this.errorsGrid;
  },
  createDependenciesGrid: function() {
    var that = this;
    if(this.dependenciesGrid === null) {
      this.dependenciesGrid = $j('#' + this.id + '-plsql-dependencies-grid')
                              .w2grid({
                                      name: this.id + '-plsql-dependencies-properties',
                                      header: this.label + ' - Dependencies',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'name', caption: 'Name', size: '150px'},
                                        {field: 'owner', caption: 'Owner', size: '150px'},
                                        {field: 'type', caption: 'Type', size: '150px'},
                                        {field: 'objectId', caption: 'Object ID', size: '150px'},
                                        {field: 'status', caption: 'Status', size: '150px'},
                                        {field: 'typeLink', caption: 'Type Link', size: '150px'}
                                      ],
                                      onReload: function(event) {
                                        that.fireDependenciesReloadButtonClickedEvent();
                                      }
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
  createProfilesGrid: function() {
    var that = this;
    if(this.profilesGrid === null) {

    }
  },
  isProfilesGridCreated: function() {
    if(this.profilesGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getProfilesGrid: function() {
    return this.profilesGrid;
  },
  createGrantsGrid: function() {
    var that = this;
    if(this.grantsGrid === null){
      this.grantsGrid = $j('#' + this.id + '-plsql-grants-grid')
                          .w2grid({
                                  name: this.id + '-plsql-grants-properties',
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
  createReferencesGrid: function() {
    var that = this;
    if(this.referencesGrid === null) {
      this.referencesGrid = $j('#' + this.id + '-plsql-references-grid')
                              .w2grid({
                                      name: this.id + '-plsql-references-properties',
                                      header: this.label + ' - References',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'name', caption: 'Name', size: '150px'},
                                        {field: 'owner', caption: 'Owner', size: '150px'},
                                        {field: 'type', caption: 'Type', size: '150px'},
                                        {field: 'objectId', caption: 'Object ID', size: '150px'},
                                        {field: 'status', caption: 'Status', size: '150px'},
                                        {field: 'typeLink', caption: 'Type Link', size: '150px'}
                                      ],
                                      onReload: function(event) {
                                        that.fireReferencesReloadButtonClickedEvent();
                                      }
                                    });
    }
  },
  isReferencesGridCreated: function() {
    if(this.referencesGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getReferencesGrid: function() {
    return this.referencesGrid;
  },
  addTabsBeforeActivateEventListener: function(listener) {
    $j('#' + this.id + '-plsql-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.sqlEditor !== null) {
      this.sqlEditor.destroy();
    }
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
    if(this.errorsGrid !== null) {
      this.errorsGrid.destroy();
    }
    if(this.dependenciesGrid !== null) {
      this.dependenciesGrid.destroy();
    }
    if(this.profilesGrid !== null) {
      this.profilesGrid.destroy();
    }
    if(this.grantsGrid !== null) {
      this.grantsGrid.destroy();
    }
    if(this.referencesGrid !== null) {
      this.referencesGrid.destroy();
    }
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
  },
  addErrorsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.errorsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeErrorsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.errorsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.errorsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireErrorsReloadButtonClickedEvent: function() {
    var that = this;
    this.errorsReloadButtonClickedEventListeners.forEach(function(listener){
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
  addProfilesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.profilesReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeProfilesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.profilesReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.profilesReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireProfilesReloadButtonClickedEvent: function() {
    var that = this;
    this.profilesReloadButtonClickedEventListeners.forEach(function(listener){
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
  addReferencesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.referencesReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeReferencesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.referencesReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.referencesReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireReferencesReloadButtonClickedEvent: function() {
    var that = this;
    this.referencesReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  }
});

/**
 * SequenceTabUI: Provides the user interface components to display details of an provided database sequence
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the sequence to be shown as label in UI components
 */
var SequenceTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  detailsGrid: null,
  dependenciesGrid: null,
  dependenciesDetailsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  detailsReloadButtonClickedEventListeners: [],
  dependenciesReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.detailsGrid = null;
    this.dependenciesGrid = null;
    this.dependenciesDetailsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.detailsReloadButtonClickedEventListeners = [];
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
    this.mainContent = "<div id='" + this.id + "-sequences-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-sequences-details-grid'>Details</a></li>" +
                            "   <li><a href='#" + this.id + "-sequences-dependencies-grid'>Dependencies</a></li>" +
                            "   <li><a href='#" + this.id + "-sequences-sql-editor-layout'>SQL</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-sequences-details-grid' tabname='details' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-sequences-dependencies-grid' tabname='dependencies' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-sequences-dependencies-grid-master' style='width: 100%; height: 50%'></div>" +
                            "   <div id='" + this.id + "-sequences-dependencies-grid-details' style='width: 100%; height: 50%'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-sequences-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-sequences-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-sequences-sql-editor' style='width: 100%; height: 96%;'></div>" +
                            " </div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-sequences-info-tabs').tabs();
  },
  createDetailsGrid: function() {
    var that = this;
    if(this.detailsGrid === null) {
      this.detailsGrid = $j('#' + this.id + '-sequences-details-grid')
                            .w2grid({
                                    name: this.id + '-sequences-details-properties',
                                    header: this.label + ' - Details',
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
                                    onReload: function(event) {
                                      that.fireDetailsReloadButtonClickedEvent();
                                    }
                                  });
    }
  },
  isDetailsGridCreated: function() {
    if(this.detailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDetailsGrid: function() {
    return this.detailsGrid;
  },
  createDependenciesGrid: function() {
    var that = this;
    if(this.dependenciesGrid === null) {
      this.dependenciesGrid = $j('#' + this.id + '-sequences-dependencies-grid-master')
                            .w2grid({
                                    name: this.id + '-sequences-dependencies-properties-master',
                                    header: this.label + ' - Dependencies',
                                    show: { header: true,
                                            toolbar: true,
                                            lineNumbers: true,
                                            footer: true
                                          },
                                    multiSearch: true,
                                    columns: [
                                      {field: 'objectId', caption: 'Object ID', size: '150px'},
                                      {field: 'objectType', caption: 'Object Type', size: '150px'},
                                      {field: 'objectName', caption: 'Object Name', size: '150px'},
                                      {field: 'status', caption: 'Status', size: '150px'},
                                      {field: 'typeLink', caption: 'Type Link', size: '150px'}
                                    ],
                                    onReload: function(event) {
                                      that.fireDependenciesReloadButtonClickedEvent();
                                    }
                                  });
      this.dependenciesDetailsGrid = $j('#' + this.id + '-sequences-dependencies-grid-details')
                                      .w2grid({
                                              name: this.id + '-sequences-dependencies-properties-details',
                                              header: this.label + ' - References',
                                              show: { header: true,
                                                      toolbar: true,
                                                      lineNumbers: true,
                                                      footer: true
                                                    },
                                              multiSearch: true,
                                              columns: [
                                                {field: 'objectId', caption: 'Object ID', size: '150px'},
                                                {field: 'objectType', caption: 'Object Type', size: '150px'},
                                                {field: 'objectName', caption: 'Object Name', size: '150px'},
                                                {field: 'status', caption: 'Status', size: '150px'},
                                                {field: 'typeLink', caption: 'Type Link', size: '150px'}
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
      this.sqlEditorToolbar = $j('#' + this.id + '-sequences-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-sequences-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-sequences-sql-editor-toolbar-refresh-sql-btn',
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-sequences-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-sequences-sql-editor');
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
    $j('#' + this.id + '-sequences-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.detailsGrid !== null) {
      this.detailsGrid.destroy();
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
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
  },
  addDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.detailsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDetailsReloadButtonClickedEvent: function() {
    var that = this;
    this.detailsReloadButtonClickedEventListeners.forEach(function(listener){
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
 * SynonymTabUI: Provides the user interface components to display details of an provided database synonym
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the synonym to be shown as label in UI components
 */
var SynonymTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  detailsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  detailsReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.detailsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.detailsReloadButtonClickedEventListeners = [];
    this.sqlReloadButtonClickedEventListeners = [];
  },
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
  getTabContent: function() {
    this.mainContent = "<div id='" + this.id + "-synonym-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-synonym-details-grid'>Details</a></li>" +
                            "   <li><a href='#" + this.id + "-synonym-sql-editor-layout'>SQL</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-synonym-details-grid' tabname='details' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-synonym-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-synonym-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-synonym-sql-editor' style='width: 100%; height: 96%;'></div>" +
                            " </div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-synonym-info-tabs').tabs();
  },
  createDetailsGrid: function() {
    var that = this;
    if(this.detailsGrid === null) {
      this.detailsGrid = $j('#' + this.id + '-synonym-details-grid')
                            .w2grid({
                                    name: this.id + '-synonym-details-properties',
                                    header: this.label + ' - Details',
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
                                    onReload: function(event) {
                                      that.fireDetailsReloadButtonClickedEvent();
                                    }
                                  });
    }
  },
  isDetailsGridCreated: function() {
    if(this.detailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDetailsGrid: function() {
    return this.detailsGrid;
  },
  createSQLEditor: function() {
    var that = this;
    if(this.sqlEditor === null) {
      this.sqlEditorToolbar = $j('#' + this.id + '-synonym-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-synonym-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-synonym-sql-editor-toolbar-refresh-sql-btn',
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-synonym-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-synonym-sql-editor');
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
    $j('#' + this.id + '-synonym-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.detailsGrid !== null) {
      this.detailsGrid.destroy();
    }
    if(this.sqlEditor !== null) {
      this.sqlEditor.destroy();
    }
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
  },
  addDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.detailsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDetailsReloadButtonClickedEvent: function() {
    var that = this;
    this.detailsReloadButtonClickedEventListeners.forEach(function(listener){
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
 * DatabaseLinkTabUI: Provides the user interface components to display details of an provided database db link
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the db link to be shown as label in UI components
 */
var DatabaseLinkTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  detailsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  detailsReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.detailsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.detailsReloadButtonClickedEventListeners = [];
    this.sqlReloadButtonClickedEventListeners = [];
  },
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
  getTabContent: function() {
    this.mainContent = "<div id='" + this.id + "-dblink-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-dblink-details-grid'>Details</a></li>" +
                            "   <li><a href='#" + this.id + "-dblink-sql-editor-layout'>SQL</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-dblink-details-grid' tabname='details' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-dblink-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-dblink-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-dblink-sql-editor' style='width: 100%; height: 96%;'></div>" +
                            " </div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-dblink-info-tabs').tabs();
  },
  createDetailsGrid: function() {
    var that = this;
    if(this.detailsGrid === null) {
      this.detailsGrid = $j('#' + this.id + '-dblink-details-grid')
                            .w2grid({
                                    name: this.id + '-dblink-details-properties',
                                    header: this.label + ' - Details',
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
                                    onReload: function(event) {
                                      that.fireDetailsReloadButtonClickedEvent();
                                    }
                                  });
    }
  },
  isDetailsGridCreated: function() {
    if(this.detailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDetailsGrid: function() {
    return this.detailsGrid;
  },
  createSQLEditor: function() {
    var that = this;
    if(this.sqlEditor === null) {
      this.sqlEditorToolbar = $j('#' + this.id + '-dblink-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-dblink-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-dblink-sql-editor-toolbar-refresh-sql-btn',
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-dblink-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-dblink-sql-editor');
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
    $j('#' + this.id + '-dblink-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.detailsGrid !== null) {
      this.detailsGrid.destroy();
    }
    if(this.sqlEditor !== null) {
      this.sqlEditor.destroy();
    }
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
  },
  addDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.detailsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDetailsReloadButtonClickedEvent: function() {
    var that = this;
    this.detailsReloadButtonClickedEventListeners.forEach(function(listener){
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
 * DatabaseDirectoryTabUI: Provides the user interface components to display details of an provided database directory
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the directory to be shown as label in UI components
 */
var DatabaseDirectoryTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  detailsGrid: null,
  detailsReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.detailsGrid = null;
    this.detailsReloadButtonClickedEventListeners = [];
  },
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
  getTabContent: function() {
    this.mainContent = "<div id='" + this.id + "-directory-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-directory-details-grid'>Details</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-directory-details-grid' tabname='details' style='width: 100%; height: 93%;'></div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-directory-info-tabs').tabs();
  },
  createDetailsGrid: function() {
    var that = this;
    if(this.detailsGrid === null) {
      this.detailsGrid = $j('#' + this.id + '-directory-details-grid')
                            .w2grid({
                                    name: this.id + '-directory-details-properties',
                                    header: this.label + ' - Details',
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
                                    onReload: function(event) {
                                      that.fireDetailsReloadButtonClickedEvent();
                                    }
                                  });
    }
  },
  isDetailsGridCreated: function() {
    if(this.detailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDetailsGrid: function() {
    return this.detailsGrid;
  },
  addTabsBeforeActivateEventListener: function(listener) {
    $j('#' + this.id + '-directory-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.detailsGrid !== null) {
      this.detailsGrid.destroy();
    }
  },
  addDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.detailsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDetailsReloadButtonClickedEvent: function() {
    var that = this;
    this.detailsReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  }
});

/**
 * QueueTabUI: Provides the user interface components to display details of an provided database queue
 * @constructor
 * @param {string} id - A unique id to create HTML content
 * @param {string} label - Name of the queue to be shown as label in UI components
 */
var QueueTabUI = Class.create({
  id: null,
  label: null,
  mainContent: null,
  detailsGrid: null,
  sqlEditor: null,
  sqlEditorToolbar: null,
  schedulesGrid: null,
  subscribersGrid: null,
  detailsReloadButtonClickedEventListeners: [],
  sqlReloadButtonClickedEventListeners: [],
  schedulesReloadButtonClickedEventListeners: [],
  subscribersReloadButtonClickedEventListeners: [],
  initialize: function(id, label) {
    this.id = id;
    this.label = label;
    this.mainContent = "";
    this.detailsGrid = null;
    this.sqlEditor = null;
    this.sqlEditorToolbar = null;
    this.schedulesGrid = null;
    this.subscribersGrid = null;
    this.detailsReloadButtonClickedEventListeners = [];
    this.sqlReloadButtonClickedEventListeners = [];
    this.schedulesReloadButtonClickedEventListeners = [];
    this.subscribersReloadButtonClickedEventListeners = [];
  },
  getId: function() {
    return this.id;
  },
  getTabName: function() {
    return this.label;
  },
  getTabContent: function() {
    this.mainContent = "<div id='" + this.id + "-queue-info-tabs' style='width: 100%; height: 100%;'>" +
                            " <ul>" +
                            "   <li><a href='#" + this.id + "-queue-details-grid'>Details</a></li>" +
                            "   <li><a href='#" + this.id + "-queue-sql-editor-layout'>SQL</a></li>" +
                            "   <li><a href='#" + this.id + "-queue-schedules-grid'>Schedules</a></li>" +
                            "   <li><a href='#" + this.id + "-queue-subscribers-grid'>Subscribers</a></li>" +
                            " </ul>" +
                            " <div id='" + this.id + "-queue-details-grid' tabname='details' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-queue-sql-editor-layout' tabname='sql' style='width: 100%; height: 93%;'>" +
                            "   <div id='" + this.id + "-queue-sql-editor-toolbar' style='width: 100%; height: 33px; border: 1px solid lightgrey;'></div>" +
                            "   <div style='width: 100%; height: 2px'></div>" +
                            "   <div id='" + this.id + "-queue-sql-editor' style='width: 100%; height: 96%;'></div>" +
                            " </div>" +
                            " <div id='" + this.id + "-queue-schedules-grid' tabname='schedules' style='width: 100%; height: 93%;'></div>" +
                            " <div id='" + this.id + "-queue-subscribers-grid' tabname='subscribers' style='width: 100%; height: 93%;'></div>" +
                            "</div>";
        return this.mainContent;
  },
  initTab: function() {
    $j('#' + this.id + '-queue-info-tabs').tabs();
  },
  createDetailsGrid: function() {
    var that = this;
    if(this.detailsGrid === null) {
      this.detailsGrid = $j('#' + this.id + '-queue-details-grid')
                            .w2grid({
                                    name: this.id + '-queue-details-properties',
                                    header: this.label + ' - Details',
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
                                    onReload: function(event) {
                                      that.fireDetailsReloadButtonClickedEvent();
                                    }
                                  });
    }
  },
  isDetailsGridCreated: function() {
    if(this.detailsGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getDetailsGrid: function() {
    return this.detailsGrid;
  },
  createSQLEditor: function() {
    var that = this;
    if(this.sqlEditor === null) {
      this.sqlEditorToolbar = $j('#' + this.id + '-queue-sql-editor-toolbar')
                                .w2toolbar({
                                            name: this.id + '-queue-sql-editor-toolbar',
                                            items: [
                                              { type: 'button', id: this.id + '-queue-sql-editor-toolbar-refresh-sql-btn',
                                                caption: 'Refresh', icon: 'refresh_icon', hint: 'Refresh SQL'},
                                              ],
                                            onClick: function(event) {
                                              var target = event.target;
                                              if(target === that.id + '-queue-sql-editor-toolbar-refresh-sql-btn') {
                                                that.fireSQLReloadButtonClickedEvent();
                                              }
                                            }
                                          });
      this.sqlEditor = ace.edit(this.id + '-queue-sql-editor');
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
  createSchedulesGrid: function() {
    var that = this;
    if(this.schedulesGrid === null) {
      this.schedulesGrid = $j('#' + this.id + '-queue-schedules-grid')
                            .w2grid({
                                    name: this.id + '-queue-schedules-properties',
                                    header: this.label + ' - Schedules',
                                    show: { header: true,
                                            toolbar: true,
                                            lineNumbers: true,
                                            footer: true
                                          },
                                    multiSearch: true,
                                    columns: [
                                      {field: 'QNAME', caption: 'QNAME', size: '150px'},
                                      {field: 'DESTINATION', caption: 'DESTINATION', size: '150px'},
                                      {field: 'START_DATE', caption: 'START DATE', size: '150px'},
                                      {field: 'START_TIME', caption: 'START TIME', size: '150px'},
                                      {field: 'PROPAGATION_WINDOW', caption: 'PROPAGATION WINDOW', size: '150px'},
                                      {field: 'NEXT_TIME', caption: 'NEXT TIME', size: '150px'},
                                      {field: 'LATENCY', caption: 'LATENCY', size: '150px'},
                                      {field: 'SCHEDULE_DISABLED', caption: 'SCHEDULE DISABLED', size: '150px'},
                                      {field: 'PROCESS_NAME', caption: 'PROCESS NAME', size: '150px'},
                                      {field: 'SESSION_ID', caption: 'SESSION ID', size: '150px'},
                                      {field: 'INSTANCE', caption: 'INSTANCE', size: '150px'},
                                      {field: 'LAST_RUN_DATE', caption: 'LAST RUN DATE', size: '150px'},
                                      {field: 'LAST_RUN_TIME', caption: 'LAST RUN TIME', size: '150px'},
                                      {field: 'CURRENT_START_DATE', caption: 'CURRENT START DATE', size: '150px'},
                                      {field: 'CURRENT_START_TIME', caption: 'CURRENT START TIME', size: '150px'},
                                      {field: 'NEXT_RUN_DATE', caption: 'NEXT RUN DATE', size: '150px'},
                                      {field: 'NEXT_RUN_TIME', caption: 'NEXT RUN TIME', size: '150px'},
                                      {field: 'TOTAL_TIME', caption: 'TOTAL TIME', size: '150px'},
                                      {field: 'TOTAL_NUMBER', caption: 'TOTAL NUMBER', size: '150px'},
                                      {field: 'TOTAL_BYTES', caption: 'TOTAL BYTES', size: '150px'},
                                      {field: 'MAX_NUMBER', caption: 'MAX NUMBER', size: '150px'},
                                      {field: 'MAX_BYTES', caption: 'MAX BYTES', size: '150px'},
                                      {field: 'AVG_NUMBER', caption: 'AVG NUMBER', size: '150px'},
                                      {field: 'AVG_SIZE', caption: 'AVG SIZE', size: '150px'},
                                      {field: 'AVG_TIME', caption: 'AVG TIME', size: '150px'},
                                      {field: 'FAILURES', caption: 'FAILURES', size: '150px'},
                                      {field: 'LAST_ERROR_DATE', caption: 'LAST ERROR DATE', size: '150px'},
                                      {field: 'LAST_ERROR_TIME', caption: 'LAST ERROR TIME', size: '150px'},
                                      {field: 'LAST_ERROR_MSG', caption: 'LAST ERROR MSG', size: '150px'},
                                      {field: 'MESSAGE_DELIVERY_MODE', caption: 'MESSAGE DELIVERY MODE', size: '150px'},
                                      {field: 'ELAPSED_DEQUEUE_TIME', caption: 'ELAPSED DEQUEUE TIME', size: '150px'},
                                      {field: 'ELAPSED_PICKLE_TIME', caption: 'ELAPSED PICKLE TIME', size: '150px'},
                                      {field: 'JOB_NAME', caption: 'JOB NAME', size: '150px'}
                                    ],
                                    onReload: function(event) {
                                      that.fireSchedulesReloadButtonClickedEvent();
                                    }
                                  });
    }
  },
  isSchedulesGridCreated: function() {
    if(this.schedulesGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getSchedulesGrid: function() {
    return this.schedulesGrid;
  },
  createSubscribersGrid: function() {
    var that = this;
    if(this.subscribersGrid === null) {
      this.subscribersGrid = $j('#' + this.id + '-queue-subscribers-grid')
                              .w2grid({
                                      name: this.id + '-queue-subscribers-properties',
                                      header: this.label + ' - Subscribers',
                                      show: { header: true,
                                              toolbar: true,
                                              lineNumbers: true,
                                              footer: true
                                            },
                                      multiSearch: true,
                                      columns: [
                                        {field: 'QUEUE_NAME', caption: 'QUEUE NAME', size: '150px'},
                                        {field: 'QUEUE_TABLE', caption: 'QUEUE TABLE', size: '150px'},
                                        {field: 'CONSUMER_NAME', caption: 'CONSUMER NAME', size: '150px'},
                                        {field: 'ADDRESS', caption: 'ADDRESS', size: '150px'},
                                        {field: 'PROTOCOL', caption: 'PROTOCOL', size: '150px'},
                                        {field: 'TRANSFORMATION', caption: 'TRANSFORMATION', size: '150px'},
                                        {field: 'RULE', caption: 'RULE', size: '150px'},
                                        {field: 'DELIVERY_MODE', caption: 'DELIVERY MODE', size: '150px'},
                                        {field: 'NONDURABLE', caption: 'NONDURABLE', size: '150px'},
                                        {field: 'QUEUE_TO_QUEUE', caption: 'QUEUE TO QUEUE', size: '150px'}
                                      ],
                                      onReload: function(event) {
                                        that.fireSubscribersReloadButtonClickedEvent();
                                      }
                                    });
    }
  },
  isSubscribersGridCreated: function() {
    if(this.subscribersGrid === null) {
      return false;
    } else {
      return true;
    }
  },
  getSubscribersGrid: function() {
    return this.subscribersGrid;
  },
  addTabsBeforeActivateEventListener: function(listener) {
    $j('#' + this.id + '-queue-info-tabs').on('tabsbeforeactivate', listener);
  },
  destroy: function() {
    if(this.detailsGrid !== null) {
      this.detailsGrid.destroy();
    }
    if(this.sqlEditor !== null) {
      this.sqlEditor.destroy();
    }
    if(this.sqlEditorToolbar !== null) {
      this.sqlEditorToolbar.destroy();
    }
    if(this.schedulesGrid !== null) {
      this.schedulesGrid.destroy();
    }
    if(this.subscribersGrid !== null) {
      this.subscribersGrid.destroy();
    }
  },
  addDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.detailsReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeDetailsReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.detailsReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.detailsReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireDetailsReloadButtonClickedEvent: function() {
    var that = this;
    this.detailsReloadButtonClickedEventListeners.forEach(function(listener){
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
  },
  addSchedulesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.schedulesReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeSchedulesReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.schedulesReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.schedulesReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireSchedulesReloadButtonClickedEvent: function() {
    var that = this;
    this.schedulesReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  },
  addSubscribersReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.subscribersReloadButtonClickedEventListeners.push(listener);
    }
  },
  removeSubscribersReloadButtonClickedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.subscribersReloadButtonClickedEventListeners.indexOf(listener);
      if(index !== -1) {
        this.subscribersReloadButtonClickedEventListeners.split(index, 1);
      }
    }
  },
  fireSubscribersReloadButtonClickedEvent: function() {
    var that = this;
    this.subscribersReloadButtonClickedEventListeners.forEach(function(listener){
      listener(that);
    });
  }
});