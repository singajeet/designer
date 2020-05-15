/**
 * DatabaseColumn: This class represents an column in database table
 * @constructor
 * @param {string} columnName - unique name of column in table
 * @param {string} columnType - data type of the column
 * @param {string} semantics - whether to use char or binary semantics
 * @param {int} {precision} - precision or size of the column
 * @param {int} {scale} - scale of column if data type is number
 * @param {bool} primaryKey - whether the column is primary key or not
 * @param {bool} notNull - whether the column can contain null values or not
 */
var DatabaseColumn = Class.create({
  columnName: null,
  columnType: null,
  semantics: null,
  precision: null,
  scale: null,
  primaryKey: null,
  notNull: null,
  initialize: function(columnName, columnType, semantics, precision, scale, primaryKey, notNull) {
    this.columnName = columnName;
    this.columnType = columnType;
    this.semantics = semantics;
    this.precision = precision;
    this.scale = scale;
    this.primaryKey = primaryKey;
    this.notNull = notNull;
  },
  getColumnName: function() {
    return this.columnName;
  },
  getColumnType: function() {
    return this.columnType;
  },
  getSemantics: function() {
    return this.semantics;
  },
  getPrecision: function() {
    return this.precision;
  },
  getScale: function() {
    return this.scale;
  },
  isPrimaryKey: function() {
    return this.primaryKey;
  },
  isNotNull: function() {
    return this.notNull;
  },
  setColumnName: function(value) {
    this.columnName = value;
  },
  setColumnType: function(value) {
    this.columnType = value;
  },
  setSemantics: function(value) {
    this.semantics = value;
  },
  setPrecision: function(value) {
    this.precision = value;
  },
  setScale: function(value) {
    this.scale = value;
  },
  setPrimaryKey: function(value) {
    this.primaryKey = value;
  },
  setNotNull: function(value) {
    this.notNull = value;
  }
});

/**
 * DatabaseTableNode: This class represents an table in database and will present the
 * GUI to user to interact for the creation and modification of tables
 * @constructor
 */
var DatabaseTableNode = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  fillColor: '#FFFFFF',
  shapeType: ShapeType.CUSTOM,
  toolName: 'DATABASE_TABLE',
  selected: true,
  opacity: 1,
  classType: DatabaseTableNode,
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
  showPortsLabel: false,
  columns: [],
  selectedRows: [],
  columnSeq: 1,
  schema: null,
  initialize: function(id, parentElement, rectDimension, columns, schema, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id.toLowerCase();
    this.parentElement = parentElement;
    this.title = title || id || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.fillColor = fillColor || "#FFFFFF";
    this.shapeType = ShapeType.CUSTOM;
    this.toolName = 'DATABASE_TABLE';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = DatabaseTableNode;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;
    this.columns = columns || [];
    this.selectedRows = [];
    this.columnSeq = 1;
    this.schema = schema || null;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    var table = null;
    var title = prompt('Please enter name of new table');
    var id = title.toLowerCase();

    table = new DatabaseTableNode(id, this.parentElement,
                                  new RectDimension(
                                                   this.rectDimension.left + 10,
                                                   this.rectDimension.top + 10,
                                                   this.rectDimension.height,
                                                   this.rectDimension.width),
                                  this.columns, this.schema,
                                  [], title, this.lineColor, this.lineWidth,
                                  this.lineStroke, this.fillColor, this.opacity,
                                  this.description);
    return table;
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  getClassType: function() {
    return this.classType;
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    var that = this;

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('height', this.rectDimension.height)
      .attr('width', this.rectDimension.width)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.headerLine1 = svg.append('line')
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 6)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 6)
      .attr('style', 'stroke: #006CE7; stroke-width: 2px');

    this.headerLine1Shadow = svg.append('line')
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 7)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 7)
      .attr('style', 'stroke: darkgrey; stroke-width: 1px');

    this.headerLine2 = svg.append('line')
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 10)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 10)
      .attr('style', 'stroke: #006CE7; stroke-width: 2px');

    this.headerLine2Shadow = svg.append('line')
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 11)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 11)
      .attr('style', 'stroke: darkgrey; stroke-width: 1px');

    this.headerLine3 = svg.append('line')
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 14)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 14)
      .attr('style', 'stroke: #006CE7; stroke-width: 2px');

    this.headerLine3Shadow = svg.append('line')
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 15)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 15)
      .attr('style', 'stroke: darkgrey; stroke-width: 1px');

    this.foreignObject = svg.append('foreignObject')
      .attr('id', this.id + '_foreign_object')
      .attr('x', this.rectDimension.left + 1)
      .attr('y', this.rectDimension.top + 20)
      .attr('height', this.rectDimension.height - 20)
      .attr('width', this.rectDimension.width - this.lineWidth);

    this.toolbar = this.foreignObject.append('xhtml:div')
      .attr('id', this.id + '_table_toolbar')
      .attr('class', 'node_toolbar');

    this.addColumnButton = this.toolbar.append('xhtml:button')
      .attr('id', this.id + '_add_column_button')
      .attr('class', 'node_toolbar_left_btn');
    this.addColumnButton.append('xhtml:i')
      .attr('class', 'fas fa-plus');

    this.removeColumnButton = this.toolbar.append('xhtml:button')
      .attr('id', this.id + '_remove_column_button')
      .attr('class', 'node_toolbar_left_btn');
    this.removeColumnButton.append('xhtml:i')
      .attr('class', 'fas fa-minus');

    this.editColumnButton = this.toolbar.append('xhtml:button')
      .attr('id', this.id + '_edit_column_button')
      .attr('class', 'node_toolbar_left_btn');
    this.editColumnButton.append('xhtml:i')
      .attr('class', 'fas fa-pencil-alt');

    this.commitColumnButton = this.toolbar.append('xhtml:button')
      .attr('id', this.id + '_commit_column_button')
      .attr('class', 'node_toolbar_right_btn');
    this.commitColumnButton.append('xhtml:i')
      .attr('class', 'fas fa-check');

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + 34)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    this.gridContainer = this.foreignObject.append('xhtml:div')
      .attr('style', 'overflow:auto; width: 100%; height: 80%; margin: 0px; padding: 0px');

    this.grid = this.gridContainer.append('xhtml:table')
      .attr('id', this.id + '_grid_table')
      .attr('class', 'node_table');

    this.gridHeaderRow = this.grid.append('xhtml:tr');
    this.gridHeaderRow.append('xhtml:td')
      .attr('class', 'node_table_header')
      .text('#');
    this.gridHeaderRow.append('xhtml:td')
      .attr('class', 'node_table_header')
      .text('Name');
    this.gridHeaderRow.append('xhtml:td')
      .attr('class', 'node_table_header')
      .text('Data Type');

    $j('#' + this.id + '_add_column_button').bind('click', function(e){
      that.showAddColumnDialog();
    });

    $j('#' + this.id + '_remove_column_button').bind('click', function(e){
      that.showRemoveColumnDialog();
    });

    $j('#' + this.id + '_edit_column_button').bind('click', function(e){
      that.showEditColumnDialog();
    });

    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.addPort(port);
    });

    this.populateProperties();
  },
  showAddColumnDialog: function() {
    var that = this;
    w2popup.open({
      width: 320,
      height: 320,
      title: 'New Column',
      body: '<div class="w2ui-left" style="line-height: 1.8">' +
            '   Please enter details of column below:<br>' +
            '   <table>' +
            '    <tr>' +
            '     <td>Column Name:</td>' +
            '     <td><input id="db-column-name" class="w2ui-input"/></td>' +
            '    </tr>' +
            '    <tr>' +
            '     <td>Column Type:</td>' +
            '     <td><select id="db-column-type" class="w2ui-input">' +
            '                   <option>CHAR</option>' +
            '                   <option>NCHAR</option>' +
            '                   <option>VARCHAR2</option>' +
            '                   <option>VARCHAR</option>' +
            '                   <option>NVARCHAR2</option>' +
            '                   <option>CLOB</option>' +
            '                   <option>NCLOB</option>' +
            '                   <option>LONG</option>' +
            '                   <option>NUMBER</option>' +
            '                   <option>BINARY_FLOAT</option>' +
            '                   <option>BINARY_DOUBLE</option>' +
            '                   <option>DATE</option>' +
            '                   <option>BLOB</option>' +
            '                   <option>BFILE</option>' +
            '                   <option>RAW</option>' +
            '                   <option>LONG RAW</option>' +
            '                   <option>ROWID</option>' +
            '         </select></td>' +
            '    </tr>' +
            '    <tr>' +
            '     <td>Semantics:</td>' +
            '     <td><select id="db-semantics-type" class="w2ui-input">' +
            '                 <option>BINARY</option>' +
            '                 <option>CHAR</option>' +
            '         </select></td>' +
            '    </tr>' +
            '    <tr>' +
            '     <td>Precision/Size:</td>' +
            '     <td><input id="db-precision" class="w2ui-input" /></td>' +
            '    </tr>' +
            '    <tr>' +
            '     <td>Scale:</td>' +
            '     <td><input id="db-scale" class="w2ui-input" /></td>' +
            '    </tr>' +
            '    <tr>' +
            '     <td>Primary Key:</td>' +
            '     <td><input id="db-primary-key" class="w2ui-input" type="checkbox"/>' +
            '    </tr>' +
            '    <tr>' +
            '     <td>Not Null:</td>' +
            '     <td><input id="db-not-null" class="w2ui-input" type="checkbox"/>' +
            '    </tr>' +
            '   </table>' +
            '</div>' +
            '<input type="hidden" id="db-col-info-available">',
      buttons: '<button class="w2ui-btn" onclick="$j(\'#db-col-info-available\')[0].value = true;w2popup.close();">Ok</button>'+
               '<button class="w2ui-btn" onclick="w2popup.close();">Cancel</button>',
      onClose: function(event) {
       if($j('#db-col-info-available')[0].value === "true"){
          var dbColumnName = $j('#db-column-name')[0].value;
          var dbColumnType = $j('#db-column-type')[0].value;
          var dbSemanticsType = $j('#db-semantics-type')[0].value;
          var dbPrecision = $j('#db-precision')[0].value;
          var dbScale = $j('#db-scale')[0].value;
          var dbPrimaryKey = $j('#db-primary-key')[0].checked;
          var dbNotNull = $j('#db-not-null')[0].checked;
          var col = new DatabaseColumn(dbColumnName, dbColumnType, dbSemanticsType, dbPrecision, dbScale, dbPrimaryKey, dbNotNull);
          that.addNewColumn(col);
        }
      }
    });
  },
  showRemoveColumnDialog: function() {
    var selectedColumns = '';
    var that = this;
    if(this.selectedRows.length > 0){
      this.selectedRows.forEach(function(rowId){
        selectedColumns += rowId.substr(rowId.indexOf('_') + 1) + ', ';
      });
      selectedColumns = selectedColumns.substr(0, selectedColumns.length - 2);

      w2confirm('Are you sure you want to delete following columns:<br>' + selectedColumns)
        .yes(function(){
          that.removeSelectedColumns();
        })
        .no(function(){});
    } else {
      w2alert('Please select atleast one column to be deleted')
        .ok(function(){});
    }
  },
  showEditColumnDialog: function() {
    var that = this;
    if(this.selectedRows.length === 0) {
      w2alert('Please select the record to be edited');
    } else if(this.selectedRows.length === 1){
      var columnName = this.selectedRows[0].substr(this.selectedRows[0].indexOf('_') + 1);
      var selectedRecord = this.getColumn(columnName);
      var dbColumnTypeOptions = ['CHAR', 'NCHAR', 'VARCHAR2', 'VARCHAR', 'NVARCHAR2', 'CLOB',
                                  'NCLOB', 'LONG', 'NUMBER', 'BINARY_FLOAT', 'BINARY_DOUBLE',
                                  'DATE', 'BLOB', 'BFILE', 'RAW', 'LONG RAW', 'ROWID'];
      var dbColumnTypeSelect = '<select id="db-column-type" class="w2ui-input">';
      for(var i=0; i<dbColumnTypeOptions.length; i++){
        if(dbColumnTypeOptions[i] === selectedRecord.getColumnType()){
          dbColumnTypeSelect += '<option selected>' + dbColumnTypeOptions[i] + '</option>';
        } else {
          dbColumnTypeSelect += '<option>' + dbColumnTypeOptions[i] + '</option>';
        }
      }
      dbColumnTypeSelect += '</select>';

      var dbSemanticsTypeOptions = ['BINARY', 'CHAR'];
      var dbSemanticsTypeSelect = '<select id="db-semantics-type" class="w2ui-input">';
      for(var i=0; i<dbSemanticsTypeOptions.length; i++){
        if(dbSemanticsTypeOptions[i] === selectedRecord.getSemantics()){
          dbSemanticsTypeSelect += '<option selected>' + dbSemanticsTypeOptions[i] + '</options>';
        } else {
          dbSemanticsTypeSelect += '<option>' + dbSemanticsTypeOptions[i] + '</options>';
        }
      }
      dbSemanticsTypeSelect += '</select>';

      w2popup.open({
        width: 320,
        height: 320,
        title: 'Edit Column',
        body: '<div class="w2ui-left" style="line-height: 1.8">' +
              '   Please edit details of column below:<br>' +
              '   <table>' +
              '    <tr>' +
              '     <td>Column Name:</td>' +
              '     <td><input id="db-column-name" class="w2ui-input" value="' + selectedRecord.getColumnName() + '" disabled/></td>' +
              '    </tr>' +
              '    <tr>' +
              '     <td>Column Type:</td>' +
              '     <td>' + dbColumnTypeSelect + '</td>' +
              '    </tr>' +
              '    <tr>' +
              '     <td>Semantics:</td>' +
              '     <td>' + dbSemanticsTypeSelect + '</td>' +
              '    </tr>' +
              '    <tr>' +
              '     <td>Precision/Size:</td>' +
              '     <td><input id="db-precision" class="w2ui-input" value="' + selectedRecord.getPrecision() + '" /></td>' +
              '    </tr>' +
              '    <tr>' +
              '     <td>Scale:</td>' +
              '     <td><input id="db-scale" class="w2ui-input" value="' + selectedRecord.getScale() + '" /></td>' +
              '    </tr>' +
              '    <tr>' +
              '     <td>Primary Key:</td>' +
              '     <td><input id="db-primary-key" class="w2ui-input" type="checkbox" ' + (selectedRecord.isPrimaryKey() ? 'checked' : '') + '/>' +
              '    </tr>' +
              '    <tr>' +
              '     <td>Not Null:</td>' +
              '     <td><input id="db-not-null" class="w2ui-input" type="checkbox" ' + (selectedRecord.isNotNull() ? 'checked' : '') + '/>' +
              '    </tr>' +
              '   </table>' +
              '</div>' +
              '<input type="hidden" id="db-col-info-available">',
        buttons: '<button class="w2ui-btn" onclick="$j(\'#db-col-info-available\')[0].value = true;w2popup.close();">Ok</button>'+
                 '<button class="w2ui-btn" onclick="w2popup.close();">Cancel</button>',
        onClose: function(event) {
          if($j('#db-col-info-available')[0].value === "true"){
            selectedRecord.setColumnName($j('#db-column-name')[0].value);
            selectedRecord.setColumnType($j('#db-column-type')[0].value);
            selectedRecord.setSemantics($j('#db-semantics-type')[0].value);
            selectedRecord.setPrecision($j('#db-precision')[0].value);
            selectedRecord.setScale($j('#db-scale')[0].value);
            selectedRecord.setPrimaryKey($j('#db-primary-key')[0].checked);
            selectedRecord.setNotNull($j('#db-not-null')[0].checked);
            that.editColumn(that.selectedRows[0], selectedRecord);
          }
        }
      });
    } else {
      w2alert('Multiple selection of records is not allowed for edit operation');
    }
  },
  getColumn: function(columnName){
    var selectedColumn = null;
    this.columns.forEach(function(column){
      if(column.getColumnName().toUpperCase() === columnName.toUpperCase()){
        selectedColumn = column;
      }
    });
    return selectedColumn;
  },
  getAllColumns: function(){
    return this.columns;
  },
  setSchema: function(schema){
    this.schema = schema;
    this.populateProperties();
  },
  getSchema: function(){
    return this.schema;
  },
  addNewColumn: function(column){
    var that = this;

    this.columns.push(column);

    var rowId = this.id + '_' + column.getColumnName().toLowerCase();

    var row = this.grid.append('xhtml:tr')
      .attr('id', rowId)
      .attr('class', 'node_table_row');

    $j('#' + rowId).bind('click', function(e){
      $j(this).toggleClass('node_table_row_clicked');

      var index = that.selectedRows.indexOf($j(this).attr('id'));
      if(index >= 0) {
        that.selectedRows.splice(index, 1);
      } else {
        that.selectedRows.push($j(this).attr('id'));
      }
    });

    row.append('xhtml:td')
      .attr('id', rowId + '_col_seq')
      .attr('class', 'node_table_cell')
      .text(this.columnSeq);

    this.columnSeq++;

    row.append('xhtml:td')
      .attr('id', rowId + '_col_name')
      .attr('class', 'node_table_cell')
      .text(column.getColumnName().toUpperCase());

    var columnType = column.getColumnType();
    if(columnType === 'CHAR' || columnType === 'NCHAR' || columnType === 'VARCHAR' || columnType === 'VARCHAR2' || columnType === 'NVARCHAR2') {
      columnType += '(' + column.getPrecision() + ')';
    } else if(columnType === 'NUMBER') {
      columnType += '(';

      if(column.getPrecision() !== '') {
        columnType += column.getPrecision();
      } else {
        columnType += '*';
      }

      if(column.getScale() !== '') {
        columnType += ', ' + column.getScale();
      }
      columnType += ')';
    }
    row.append('xhtml:td')
      .attr('id', rowId + '_col_type')
      .attr('class', 'node_table_cell')
      .text(columnType);
  },
  removeSelectedColumns: function(){
    var that = this;
    this.selectedRows.forEach(function(rowId){
        var columnName = rowId.substr(rowId.indexOf('_') + 1).toUpperCase();
        that.columns.forEach(function(column, index){
          if(column.getColumnName().toUpperCase() === columnName){
            that.columns.splice(index, 1);
          }
        });
        d3.select('#' + rowId).remove();
      });
    this.selectedRows.clear();
    console.log(this.columns);
  },
  editColumn: function(rowId, column){
    var colTypeTdId = '#' + rowId + '_col_type';

    var columnType = column.getColumnType();
    if(columnType === 'CHAR' || columnType === 'NCHAR' || columnType === 'VARCHAR' || columnType === 'VARCHAR2' || columnType === 'NVARCHAR2') {
      columnType += '(' + column.getPrecision() + ')';
    } else if(columnType === 'NUMBER') {
      columnType += '(';

      if(column.getPrecision() !== '') {
        columnType += column.getPrecision();
      } else {
        columnType += '*';
      }

      if(column.getScale() !== '') {
        columnType += ', ' + column.getScale();
      }
      columnType += ')';
    }

    d3.select(colTypeTdId).text(columnType);
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.rectDimension.width = parseInt(this.line.attr('width'));
    this.rectDimension.height = parseInt(this.line.attr('height'));
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));

    this.headerLine1
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 6)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 6);

    this.headerLine1Shadow
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 7)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 7);

    this.headerLine2
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 10)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 10);

    this.headerLine2Shadow
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 11)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 11);

    this.headerLine3
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 14)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 14);

    this.headerLine3Shadow
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 15)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 15);

    this.foreignObject
      .attr('x', this.rectDimension.left + 1)
      .attr('y', this.rectDimension.top + 20)
      .attr('height', this.rectDimension.height - 20)
      .attr('width', this.rectDimension.width - this.lineWidth);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + 34);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));

    this.headerLine1
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 6)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 6);

    this.headerLine1Shadow
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 7)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 7);

    this.headerLine2
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 10)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 10);

    this.headerLine2Shadow
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 11)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 11);

    this.headerLine3
      .attr('x1', this.rectDimension.left + 5)
      .attr('y1', this.rectDimension.top + 14)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 14);

    this.headerLine3Shadow
      .attr('x1', this.rectDimension.left + 6)
      .attr('y1', this.rectDimension.top + 15)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + 15);

    this.foreignObject
      .attr('x', this.rectDimension.left + 1)
      .attr('y', this.rectDimension.top + 20)
      .attr('height', this.rectDimension.height - 20)
      .attr('width', this.rectDimension.width - this.lineWidth);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + 34);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.headerLine1.attr('visibility', 'hidden');
    this.headerLine1Shadow.attr('visibility', 'hidden');
    this.headerLine2.attr('visibility', 'hidden');
    this.headerLine2Shadow.attr('visibility', 'hidden');
    this.headerLine3.attr('visibility', 'hidden');
    this.headerLine3Shadow.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.foreignObject.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.headerLine1.attr('visibility', 'hidden');
    this.headerLine1Shadow.attr('visibility', 'hidden');
    this.headerLine2.attr('visibility', 'hidden');
    this.headerLine2Shadow.attr('visibility', 'hidden');
    this.headerLine3.attr('visibility', 'hidden');
    this.headerLine3Shadow.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.foreignObject.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.headerLine1.attr('visibility', 'hidden');
    this.headerLine1Shadow.attr('visibility', 'hidden');
    this.headerLine2.attr('visibility', 'hidden');
    this.headerLine2Shadow.attr('visibility', 'hidden');
    this.headerLine3.attr('visibility', 'hidden');
    this.headerLine3Shadow.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.foreignObject.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.headerLine1.attr('visibility', 'visible');
    this.headerLine1Shadow.attr('visibility', 'visible');
    this.headerLine2.attr('visibility', 'visible');
    this.headerLine2Shadow.attr('visibility', 'visible');
    this.headerLine3.attr('visibility', 'visible');
    this.headerLine3Shadow.attr('visibility', 'visible');
    this.text.attr('visibility', 'visible');
    this.foreignObject.attr('visibility', 'visible');
    this.ports.forEach(function(port){
      port.show();
    });
  },
  populateProperties: function(){
    w2ui['properties'].clear();
    w2ui['properties'].add([
        { recid: 1, propName: 'Layout',
          w2ui: {
            children: [
                      { recid: 2, propName: 'Id', propValue: this.id,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 3, propName: 'X', propValue: this.rectDimension.left,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 4, propName: 'Y', propValue: this.rectDimension.top,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 5, propName: 'Height', propValue: this.rectDimension.height,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 6, propName: 'Width', propValue: this.rectDimension.width,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 7, propName: 'Stroke Color', propValue: this.lineColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 8, propName: 'Stroke Width', propValue: this.lineWidth},
                      { recid: 9, propName: 'Fill Color', propValue: this.fillColor,
                        w2ui: {editable: { type: 'color'} }
                      },
                      { recid: 10, propName: 'Opacity', propValue: this.opacity},
                      { recid: 11, propName: 'Shape Type', propValue: this.shapeType,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 12, propName: 'Tool Name', propValue: this.toolName,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 13, propName: 'Is Selected', propValue: this.selected,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      {
                        recid: 14, propName: 'Show Ports Label', propValue: this.showPortsLabel,
                          w2ui: { editable: { type: 'combo', items: [ { id: 1, text: 'true' },
                                                                      { id: 2, text: 'false' }
                                                                    ],
                                              filter: false
                                            }
                                }
                      }
            ]
          }
        },
        { recid: 15, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 16, propName: 'Table Name', propValue: this.title},
                      { recid: 17, propName: 'Description', propValue: this.description},
                      { recid: 18, propName: 'Schema', propValue: (this.schema !== null ? this.schema.getSchemaName() : '')}
            ]
          }
        }
    ]);
    w2ui['properties'].expand(1);
  },
  setProperty: function(propName, propValue){
    if(propName === "Stroke Color"){
      this.lineColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
    } else if(propName === "Fill Color"){
      this.fillColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
    } else if(propName === "Opacity"){
      this.opacity = parseFloat(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
    } else if(propName === "Show Ports Label"){
      this.showPortsLabel = JSON.parse(propValue);
      if(this.showPortsLabel){
        this.ports.forEach(function(port){
          port.showLabel();
        });
      } else {
        this.ports.forEach(function(port){
          port.hideLabel();
        });
      }
    } else if(propName === "Table Name"){
      this.title = propValue;
      this.text.text(this.title);
      this.rename(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
    }
  },
  rename: function(newTableName) {

  },
  destroy: function() {
    var that = this;
    this.headerLine1.remove();
    this.headerLine1Shadow.remove();
    this.headerLine2.remove();
    this.headerLine2Shadow.remove();
    this.headerLine3.remove();
    this.headerLine3Shadow.remove();
    this.foreignObject.remove();
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_DATABASE_TABLE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_DATABASE_TABLE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='10' y='5' height='5' width='30'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></rect>
                      <rect x='10' y='10' height='18' width='30'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></rect>
                      <line x1='15' y1='10' x2='15' y2='28'
                        style='stroke: black; stroke-width: 1px;'></line>
                      <line x1='20' y1='10' x2='20' y2='28'
                        style='stroke: black; stroke-width: 1px;'></line>
                      <line x1='25' y1='10' x2='25' y2='28'
                        style='stroke: black; stroke-width: 1px;'></line>
                      <line x1='30' y1='10' x2='30' y2='28'
                        style='stroke: black; stroke-width: 1px;'></line>
                      <line x1='35' y1='10' x2='35' y2='28'
                        style='stroke: black; stroke-width: 1px;'></line>
                      <line x1='10' y1='16' x2='40' y2='16'
                        style='stroke: black; stroke-width: 1px;'></line>
                      <line x1='10' y1='22' x2='40' y2='22'
                        style='stroke: black; stroke-width: 1px;'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">TABLE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});