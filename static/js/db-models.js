/**
 * DatabaseConnection: This class holds information regarding the database connection
 * and is used to show dialog to user to collect the DB connection information
 * @constructor
 */
var DatabaseConnection = Class.create({
  connectionName: null,
  connectionString: null,
  username: null,
  password: null,
  connectionInfoAvailableEventListeners: [],
  connectedEventListeners: [],
  connected: false,
  databaseFolderId: null,
  initialize: function(databaseFolderId) {
    this.databaseFolderId = databaseFolderId;
    this.connectionName = null;
    this.connectionString = null;
    this.username = null;
    this.password = null;
    this.connectionInfoAvailableEventListeners = [];
    this.connected = false;
  },
  isConnected: function() {
    return this.connected;
  },
  getDatabaseFolderId: function() {
    return this.databaseFolderId;
  },
  getConnectionName: function() {
    return this.connectionName;
  },
  getConnectionString: function() {
    return this.connectionString;
  },
  getUsername: function() {
    return this.username;
  },
  getPassword: function () {
    return this.password;
  },
  setDatabaseFolderd: function(value) {
    this.databaseFolderId = value;
  },
  setConnectionName: function(value) {
    this.connectionName = value;
  },
  setConnectionString: function(value) {
    this.connectionString = value;
  },
  setUsername: function(value) {
    this.username = value;
  },
  setPassword: function (value) {
    this.password = value;
  },
  promptConnection: function() {
    var that = this;
    w2popup.open({
      width: 320,
      height: 275,
      title: 'Database Connection',
      body: '<div class="w2ui-left" style="line-height: 1.8">' +
        '<table>' +
        ' <tr>' +
        '  <td colspan="2">Please enter database connection information below:</td>' +
        ' </tr>' +
        ' <tr>' +
        '  <td>Connection Name:</td>' +
        '  <td><input id="db-connection-name" class="w2ui-input"></td>' +
        ' </tr>' +
        ' <tr>' +
        '  <td>Connection String:</td>' +
        '  <td><input id="db-connection-string" class="w2ui-input"></td>' +
        ' </tr>' +
        ' <tr>' +
        '  <td>Username:</td>' +
        '  <td> <input id="db-username" class="w2ui-input"></td>' +
        ' </tr>' +
        ' <tr>' +
        '  <td>Password:</td>' +
        '  <td><input id="db-password" type="password" class="w2ui-input"></td>' +
        ' </tr>' +
        '</table>' +
        '</div>' +
        '<input type="hidden" id="db-conn-info-available">',
      buttons: '<button class="w2ui-btn" onclick="$j(\'#db-conn-info-available\')[0].value = true; w2popup.close()">Ok</button>'+
               '<button class="w2ui-btn" onclick="w2popup.close()">Cancel</button>',
      onClose: function(event) {
        if($j('#db-conn-info-available')[0].value === "true"){
          that.connectionName = $j('#db-connection-name')[0].value;
          that.connectionString = $j('#db-connection-string')[0].value;
          that.username = $j('#db-username')[0].value;
          that.password = $j('#db-password')[0].value;
          that.fireConnectionInfoAvailableEvent();
        }
      }
    });
  },
  connect: function() {
    var socket = io('/oracle_db_connection');
    var that = this;

    socket.on('connected', function(e) {
      that.connected = true;
      that.fireConnectedEvent();
    });

    socket.on('failed', function(e) {
      w2alert('Connection failed!<br>' + e.message);
    });

    var props = {'connectionString': this.connectionString, 'username': this.username, 'password': this.password};
    socket.emit('db_connect', props);
  },
  addConnectedEventListener: function(listener) {
    if(listener != null && listener != undefined) {
      this.connectedEventListeners.push(listener);
    }
  },
  removeConnectedEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.connectedEventListeners.indexOf(listener);
      this.connectedEventListeners.splice(index, 1);
    }
  },
  fireConnectedEvent: function() {
    this.connectedEventListeners.forEach(function(listener){
      listener();
    });
  },
  addConnectionInfoAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.connectionInfoAvailableEventListeners.push(listener);
    }
  },
  removeConnectionInfoAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      var index = this.connectionInfoAvailableEventListeners.indexOf(listener);
      this.connectionInfoAvailableEventListeners.splice(index, 1);
    }
  },
  fireConnectionInfoAvailableEvent: function() {
    var that = this;
    this.connectionInfoAvailableEventListeners.forEach(function(listener){
      listener(that.databaseFolderId, that.connectionName, that.connectionString, that.username, that.password, that);
    });
  }
});

/**
 * DatabaseSchema: This class represents an schema in database
 * @constructor
 * @param {DatabaseConnection} connection - an instance of DatabaseConnection class
 */
var DatabaseSchema = Class.create({
  schemaName: null,
  connection: null,
  tables: [],
  views: [],
  indexes: [],
  materializedViews: [],
  procedures: [],
  functions: [],
  packages: [],
  sequences: [],
  synonyms: [],
  publicSynonyms: [],
  triggers: [],
  types: [],
  queues: [],
  databaseLinks: [],
  publicDatabaseLinks: [],
  directories: [],
  tablesAvailableEventListeners: [],
  viewsAvailableEventListeners: [],
  indexesAvailableEventListeners: [],
  materializedViewsAvailableEventListeners: [],
  proceduresAvailableEventListeners: [],
  functionsAvailableEventListeners: [],
  packagesAvailableEventListeners: [],
  sequencesAvailableEventListeners: [],
  synonymsAvailableEventListeners: [],
  publicSynonymsAvailableEventListeners: [],
  triggersAvailableEventListeners: [],
  typesAvailableEventListeners: [],
  queuesAvailableEventListeners: [],
  databaseLinksAvailableEventListeners: [],
  publicDatabaseLinksAvailableEventListeners: [],
  directoriesAvailableEventListeners: [],
  initialize: function(connection) {
    this.connection = connection;
    this.schemaName = this.connection.getUsername().toUpperCase();

    tablesAvailableEventListeners = [];
    viewsAvailableEventListeners = [];
    indexesAvailableEventListeners = [];
    materializedViewsAvailableEventListeners = [];
    proceduresAvailableEventListeners = [];
    functionsAvailableEventListeners = [];
    packagesAvailableEventListeners = [];
    sequencesAvailableEventListeners = [];
    synonymsAvailableEventListeners = [];
    publicSynonymsAvailableEventListeners = [];
    triggersAvailableEventListeners = [];
    typesAvailableEventListeners = [];
    queuesAvailableEventListeners = [];
    databaseLinksAvailableEventListeners = [];
    publicDatabaseLinksAvailableEventListeners = [];
    directoriesAvailableEventListeners = [];
  },
  addTablesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.tablesAvailableEventListeners.push(listener);
    }
  },
  removeTablesAvailableEventListener: function(listener) {
    var index = this.tablesAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.tablesAvailableEventListeners.splice(index, 1);
    }
  },
  fireTablesAvailableEvent: function(result) {
    this.tablesAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addViewsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.viewsAvailableEventListeners.push(listener);
    }
  },
  removeViewsAvailableEventListener: function(listener) {
    var index = this.viewsAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.viewsAvailableEventListeners.splice(index, 1);
    }
  },
  fireViewsAvailableEvent: function(result) {
    this.viewsAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addIndexesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.indexesAvailableEventListeners.push(listener);
    }
  },
  removeIndexesAvailableEventListener: function(listener) {
    var index = this.indexesAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.indexesAvailableEventListeners.splice(index, 1);
    }
  },
  fireIndexesAvailableEvent: function(result) {
    this.indexesAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addMViewsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.materializedViewsAvailableEventListeners.push(listener);
    }
  },
  removeMViewsAvailableEventListener: function(listener) {
    var index = this.materializedViewsAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.materializedViewsAvailableEventListeners.splice(index, 1);
    }
  },
  fireMViewsAvailableEvent: function(result) {
    this.materializedViewsAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addProceduresAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.proceduresAvailableEventListeners.push(listener);
    }
  },
  removeProceduresAvailableEventListener: function(listener) {
    var index = this.proceduresAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.proceduresAvailableEventListeners.splice(index, 1);
    }
  },
  fireProceduresAvailableEvent: function(result) {
    this.proceduresAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addFunctionsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.functionsAvailableEventListeners.push(listener);
    }
  },
  removeFunctionsAvailableEventListener: function(listener) {
    var index = this.functionsAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.functionsAvailableEventListeners.splice(index, 1);
    }
  },
  fireFunctionsAvailableEvent: function(result) {
    this.functionsAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addPackagesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.packagesAvailableEventListeners.push(listener);
    }
  },
  removePackagesAvailableEventListener: function(listener) {
    var index = this.packagesAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.packagesAvailableEventListeners.splice(index, 1);
    }
  },
  firePackagesAvailableEvent: function(result) {
    this.packagesAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addSequencesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.sequencesAvailableEventListeners.push(listener);
    }
  },
  removeSequencesAvailableEventListener: function(listener) {
    var index = this.sequencesAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.sequencesAvailableEventListeners.splice(index, 1);
    }
  },
  fireSequencesAvailableEvent: function(result) {
    this.sequencesAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addSynonymsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.synonymsAvailableEventListeners.push(listener);
    }
  },
  removeSynonymsAvailableEventListener: function(listener) {
    var index = this.synonymsAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.synonymsAvailableEventListeners.splice(index, 1);
    }
  },
  fireSynonymsAvailableEvent: function(result) {
    this.synonymsAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addPublicSynonymsAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.publicSynonymsAvailableEventListeners.push(listener);
    }
  },
  removePublicSynonymsAvailableEventListener: function(listener) {
    var index = this.publicSynonymsAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.publicSynonymsAvailableEventListeners.splice(index, 1);
    }
  },
  firePublicSynonymsAvailableEvent: function(result) {
    this.publicSynonymsAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addTriggersAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.triggersAvailableEventListeners.push(listener);
    }
  },
  removeTriggersAvailableEventListener: function(listener) {
    var index = this.triggersAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.triggersAvailableEventListeners.splice(index, 1);
    }
  },
  fireTriggersAvailableEvent: function(result) {
    this.triggersAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addTypesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.typesAvailableEventListeners.push(listener);
    }
  },
  removeTypesAvailableEventListener: function(listener) {
    var index = this.typesAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.typesAvailableEventListeners.splice(index, 1);
    }
  },
  fireTypesAvailableEvent: function(result) {
    this.typesAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addQueuesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.queuesAvailableEventListeners.push(listener);
    }
  },
  removeQueuesAvailableEventListener: function(listener) {
    var index = this.queuesAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.queuesAvailableEventListeners.splice(index, 1);
    }
  },
  fireQueuesAvailableEvent: function(result) {
    this.queuesAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addDatabaseLinksAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.databaseLinksAvailableEventListeners.push(listener);
    }
  },
  removeDatabaseLinksAvailableEventListener: function(listener) {
    var index = this.databaseLinksAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.databaseLinksAvailableEventListeners.splice(index, 1);
    }
  },
  fireDatabaseLinksAvailableEvent: function(result) {
    this.databaseLinksAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addPublicDatabaseLinksAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.publicDatabaseLinksAvailableEventListeners.push(listener);
    }
  },
  removePublicDatabaseLinksAvailableEventListener: function(listener) {
    var index = this.publicDatabaseLinksAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.publicDatabaseLinksAvailableEventListeners.splice(index, 1);
    }
  },
  firePublicDatabaseLinksAvailableEvent: function(result) {
    this.publicDatabaseLinksAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  addDirectoriesAvailableEventListener: function(listener) {
    if(listener !== null && listener !== undefined) {
      this.directoriesAvailableEventListeners.push(listener);
    }
  },
  removeDirectoriesAvailableEventListener: function(listener) {
    var index = this.directoriesAvailableEventListeners.indexOf(listener);
    if(index >= 0) {
      this.directoriesAvailableEventListeners.splice(index, 1);
    }
  },
  fireDirectoriesAvailableEvent: function(result) {
    this.directoriesAvailableEventListeners.forEach(function(listener) {
      listener(result);
    });
  },
  populateSchemaObjects: function() {
    if(this.connection.isConnected()) {
      this._populateSchemaObjects();
    } else {
      this.connection.addConnectedEventListener(this._populateSchemaObjects);
    }
  },
  _populateSchemaObjects: function() {
    var socket = io('/oracle_db_schema')
    var that = this;
    socket.on('tables_result', function(result){
      that.tables = result;
      that.fireTablesAvailableEvent(result);
    });

    socket.on('views_result', function(result){
      that.views = result;
      that.fireViewsAvailableEvent(result);
    });

    socket.on('indexes_result', function(result){
      that.indexes = result;
      that.fireIndexesAvailableEvent(result);
    });

    socket.on('mviews_result', function(result){
      that.materializedViews = result;
      that.fireMViewsAvailableEvent(result);
    });

    socket.on('procedures_result', function(result){
      that.procedures = result;
      that.fireProceduresAvailableEvent(result);
    });

    socket.on('functions_result', function(result){
      that.functions = result;
      that.fireFunctionsAvailableEvent(result);
    });

    socket.on('packages_result', function(result){
      that.packages = result;
      that.firePackagesAvailableEvent(result);
    });

    socket.on('sequences_result', function(result){
      that.sequences = result;
      that.fireSequencesAvailableEvent(result);
    });

    socket.on('synonyms_result', function(result){
      that.synonyms = result;
      that.fireSynonymsAvailableEvent(result);
    });

    socket.on('public_synonyms_result', function(result){
      that.publicSynonyms = result;
      that.firePublicSynonymsAvailableEvent(result);
    });

    socket.on('triggers_result', function(result){
      that.triggers = result;
      that.fireTriggersAvailableEvent(result);
    });

    socket.on('types_result', function(result){
      that.types = result;
      that.fireTypesAvailableEvent(result);
    });

    socket.on('queues_result', function(result){
      that.queues = result;
      that.fireQueuesAvailableEvent(result);
    });

    socket.on('dblinks_result', function(result){
      that.databaseLinks = result;
      that.fireDatabaseLinksAvailableEvent(result);
    });

    socket.on('public_dblinks_result', function(result){
      that.publicDatabaseLinks = result;
      that.firePublicDatabaseLinksAvailableEvent(result);
    });

    socket.on('directories_result', function(result){
      that.directories = result;
      that.fireDirectoriesAvailableEvent(result);
    });

    socket.emit('set_schema', this.schemaName)
    socket.emit('get_tables');
    socket.emit('get_views');
    socket.emit('get_indexes');
    socket.emit('get_mviews');
    socket.emit('get_procedures');
    socket.emit('get_functions');
    socket.emit('get_packages');
    socket.emit('get_sequences');
    socket.emit('get_synonyms');
    // socket.emit('get_public_synonyms');
    socket.emit('get_triggers');
    socket.emit('get_types');
    socket.emit('get_queues');
    socket.emit('get_dblinks');
    socket.emit('get_public_dblinks');
    socket.emit('get_directories');
  },
  getSchemaName: function() {
    return this.schemaName;
  },
  getConnection: function() {
    return this.connection;
  },
  getTables: function() {
    return this.tables;
  },
  getViews: function() {
    return this.views;
  },
  getIndexes: function() {
    return this.indexes;
  },
  getMaterializedViews: function() {
    return this.materializedViews;
  },
  getProcedures: function() {
    return this.procedures;
  },
  getFunctions: function() {
    return this.functions;
  },
  getPackages: function() {
    return this.packages;
  },
  getSequences: function() {
    return this.sequences;
  },
  getSynonyms: function() {
    return this.synonyms;
  },
  getPublicSynonyms: function() {
    return this.publicSynonyms;
  },
  getTriggers: function() {
    return this.triggers;
  },
  getTypes: function() {
    return this.types;
  },
  getQueues: function() {
    return this.queues;
  },
  getDatabaseLinks: function() {
    return this.databaseLinks;
  },
  getPublicDatabaseLinks: function() {
    return this.publicDatabaseLinks;
  },
  getDirectories: function() {
    return this.directories;
  }
});