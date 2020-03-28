/**
 * Module: designer.js
 * Description: Provides api to build interactive visual language editor
 * Author: Ajeet Singh
 * Date: 25-Aug-2019
 */

/**
 * A simple string formatter function, example:
 * console.log("Hello, {0}!".format("World"))
 * Source: https://coderwall.com/p/flonoa/simple-string-format-in-javascript
 */
String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

/**
 * Returns true if obj is plain obj {} else false if dict
 */
is_dict = function(obj) {
  if (!obj) return false;
  if (Array.isArray(obj)) return false;
  if (obj.constructor != Object) return false;
  return true;
}

/**
 * Point: This class represents an pixel on the canvas with x and y location
 * @constructor
 * @param {int} x - The x position of the point
 * @param {int} y - The y position of the point
 */
var Point = Class.create({
  x: 0,
  y: 0,
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },
  add: function(point) {
    this.x = this.x + point.x;
    this.y = this.y + point.y;
  },
  substract: function(point) {
    this.x = this.x - point.x;
    this.y = this.y - point.y;
  }
});

/**
 * RectDimension - Dimension class containing dimension of an rectangle
 * @constructor
 * @param {int} left - The left position of the rectangle
 * @param {int} top - Top position of the rectangle
 * @param {int} height - Height of the rectangle
 * @param {int} width - Width of the rectangle
 */
var RectDimension = Class.create({
  top: 0,
  left: 0,
  height: 0,
  width: 0,
  initialize: function(left, top, height, width) {
    this.left = left;
    this.top = top;
    this.height = height;
    this.width = width;
  }
});

/**
 * LineDimension: This dimension class containing dimension for line
 * @constructor
 * @param {Point} start - An instance of the Point class providing start location of line
 * @param {Point} end - Instance of the Point class providing end location of line
 * @param {boolean} hasArrow - Specify whether the line will have an arrow
 * @param {string} arrowType - Kind of the arrow this line will have
 */
var LineDimension = Class.create({
  start: undefined,
  end: undefined,
  hasArrow: true,
  arrowType: 'standard',
  _direction: '', //BT=>Bottom-Top; TB=>Top-Bottom; LR=>Left-Right; RL=>Right-Left
  initialize: function(start, end, hasArrow, arrowType) {
    this.start = start || new Point();
    this.end = end || new Point();
    this.hasArrow = hasArrow;
    this.arrowType = arrowType;
    this._direction = '';
  },
  _calculateDirection: function() {
    var dx = Math.abs(this.end.x - this.start.x);
    var dy = Math.abs(this.end.y - this.start.y);

    if (dy <= dx) { //X-Axis dominant
      if (dx >= 0) { //left to right
        this._direction = 'LR';
      } else { //right to left
        this._direction = 'RL';
      }
    } else { //Y-Axis dominant
      if (dy < 0) { //bottom to top
        this._direction = 'BT';
      } else { //top to bottom
        this._direction = 'TB';
      }
    }
    return this._direction;
  },
  /** Returns the direction of the arrow in the following form:
  * BT=>Bottom-Top; TB=>Top-Bottom; LR=>Left-Right; RL=>Right-Left
  */
  getDirection: function() {
    return this._calculateDirection();
  }
});

/**
 * CircleDimension: This dimension class containing dimension of an circle
 * @constructor
 * @param {int} cx - The x position of the circle on canvas
 * @param {int} cy - The y position of the circle on canvas
 * @param {int} r - radius of the circle
 */
var CircleDimension = Class.create({
  cx: 0,
  cy: 0,
  r: 0,
  initialize: function(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }
});

/**
 * EllipseDimension: This dimension class containing dimension of an ellipse
 * @constructor
 * @param {int} cx - The x position of the ellipse on canvas
 * @param {int} cy - The y position of the ellipse on canvas
 * @param {int} rx - horizontal radius of the ellipse
 * @param {int} ry - vertical radius of the ellipse
 */
var EllipseDimension = Class.create({
  cx: 0,
  cy: 0,
  rx: 0,
  ry: 0,
  initialize: function(cx, cy, rx, ry) {
    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
  }
});

/**
 * Enum: MouseState
 * Description: Provides different states of mouse
 */
var MouseState = {
  UP: 0,
  DOWN: 1,
  DRAG: 2,
  MOVE: 3,
  LEAVE: 4,
  properties: {
    0: {
      name: 'UP'
    },
    1: {
      name: 'DOWN'
    },
    2: {
      name: 'DRAG'
    },
    3: {
      name: 'MOVE'
    },
    4: {
      name: 'LEAVE'
    }
  }
};
if (Object.freeze) {
  Object.freeze(MouseState);
}

/**
 * Enum: ShapeType
 * Description: Various shapes available
 */
var ShapeType = {
  NONE: 9999,
  LINE: 0,
  RECTANGLE: 1,
  CIRCLE: 2,
  ELLIPSE: 3,
  POLYLINE: 4,
  POLYGON: 5,
  PATH: 6,
  BEZIRE_CURVE: 7,
  POINTER: 8,
  SELECTION: 9,
  CUSTOM: 10,
  NODE: 11,
  PORT: 12,
  properties: {
    9999: {
      name: 'NONE'
    },
    0: {
      name: 'LINE'
    },
    1: {
      name: 'RECTANGLE'
    },
    2: {
      name: 'CIRCLE'
    },
    3: {
      name: 'ELLIPSE'
    },
    4: {
      name: 'POLYLINE'
    },
    5: {
      name: 'POLYGONE'
    },
    6: {
      name: 'PATH'
    },
    7: {
      name: 'BEZIRE_CURVE'
    },
    8: {
      name: 'POINTER'
    },
    9: {
      name: 'SELECTION'
    },
    10: {
      name: 'CUSTOM'
    },
    11: {
      name: 'NODE'
    },
    12: {
      name: 'PORT'
    }
  }
};

/**
 * Enum: PortType
 * Description: Define port type as source or target
 */
var PortType = {
  SOURCE: 0,
  TARGET: 1,
  properties: {
    0: {
      name: 'SOURCE'
    },
    1: {
      name: 'TARGET'
    }
  }
};

/**
 * ToolGroup: this class represents an group of items inside
 * a toolbox that will be rendered as an Accordion
 */
const ToolGroup = Class.create({
  id: '',
  title: '',
  description: '',
  isOpen: false,
  tools: [],
  initialize: function(id, title, isOpen, tools, description){
    this.id = id;
    this.title = title;
    this.isOpen = isOpen || false;
    this.tools = tools || [];
    this.description = description;
  },
  addTool: function(tool){
    this.tools.push(tool);
  },
  removeTool: function(tool){
    var index = this.tools.indexOf(tool);
    this.tools.splice(index, 1);
    var toolToRemove = document.getElementById(tool.id);
    if (toolToRemove != undefined) {
      toolToRemove.parentNode.removeChild(toolToRemove);
    }
  },
  getTool: function(name, parentId){
    for (var i = 0; i < this.tools.length; i++) {
        if ((parentId + "_" + this.tools[i].getToolName() + "_tool") === name) {
          return this.tools[i];
        }
    }
    return null;
  },
  render: function(){
    var html = "<button id='" + this.id + "' class='accordion'>" + this.title + "</button>";
    html += "<div class='panel' id='" + this.id + "_panel'>";
    for (var i = 0; i < this.tools.length; i++) {
      html += this.tools[i].renderToolItem();
    }
    html += "</div>";
    return html;
  }
});

/**
 * ToolBox: class to render the tool groups and tool items within
 * each group
 */
const ToolBox = Class.create({
  id: '',
  parent: undefined,
  width: '50px',
  groups: [],
  initialize: function(id, parent, groups, width){
    this.id = id;
    this.parent = parent;
    this.groups = groups || [];
    this.width = width || '50px';
  },
  addGroup: function(group){
    this.groups.push(group);
  },
  removeGroup: function(group){
    var index = this.groups.indexOf(group);
    this.groups.splice(index, 1);
    var groupToRemove = document.getElementById(group.id);
    if(groupToRemove != undefined) {
      groupToRemove.parentNode.removeChild(groupToRemove);
    }
    var panelToRemove = document.getElementById(group.id + "_panel");
    if(panelToRemove != undefined) {
      panelToRemove.parentNode.removeChild(panelToRemove);
    }
  },
  getTool: function(name){
    for(var i=0; i < this.groups.length; i++){
      var tool = this.groups[i].getTool(name, this.parent.id);
      if(tool !== null && tool !== undefined){
        return tool;
      }
    }
    return null;
  },
  render: function(){
    var toolsHtml =
          `<div style='overflow-y: auto; max-height: 600px;' class='scroll'>
            <table style='width: 50px;' class='middle toolbox'>
              <tr>
                <th>Toolbox</th>
              </tr>
              <tr>
                <td>`;
        toolsHtml += this.parent.renderToolItem();
        for (var i = 0; i < this.groups.length; i++) {
          toolsHtml += this.groups[i].render();
        }
        toolsHtml +=
                `</td>
              </tr>
              <tr>
                <td style='text-align: center; font-size: 9px;'>`;
        toolsHtml += `X: <span id='x_label'></span>
                         Y: <span id='y_label'></span>
                </td>
              </tr>
              <tr>
                <td style='text-align: center; font-size: 9px;'>`;
        toolsHtml += `STATE: <span id='mouse_state'></span>`;
        toolsHtml += `</td>
              </tr>
            </table></div>`;
    return toolsHtml;
  },
  activate: function() {
    var accordions = document.getElementsByClassName("accordion");

    for (var i = 0; i < accordions.length; i++) {
      accordions[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }
});

/**
 * Canvas: class provides the functionality to hold the
 * nodes and edges objects
 *
 * @constructor
 * @param {string} id - A unique identifier for the canvas
 * @param {string} container_id - Id of the parent container, if not
 *                                provided Canvas will be attached to
 *                                body of the page
 * @param {string} height - Height of the canvas with unit
 * @param {string} width - Width of the canvas with unit
 * @param {Array} items - A list of direct child elements
 * @param {Array} grid - Size of each cell in the grid (in pixels)
 */
const Canvas = Class.create({
  id: '',
  containerId: undefined,
  height: undefined,
  width: undefined,
  css: 'canvas',
  svg: undefined,
  options: undefined,
  nodes: [],
  edges: [],
  ports: [],
  grid: [10, 10],
  // tools: [],
  toolBox: undefined,
  observable: undefined,
  menus: [],
  methods: undefined,
  mouseX: 0,
  mouseY: 0,
  mouseStartX: 0,
  mouseStartY: 0,
  mouseEndX: 0,
  mouseEndY: 0,
  mouseState: MouseState.UP,
  tempElement: undefined,
  shapeType: ShapeType.POINTER,
  toolName: 'POINTER',
  selectedTool: undefined,
  polyPoints: [],
  isCmdInPrgrs: false,
  lastClick: 0,
  isTap: false,
  draggables: [],
  offsetX: 0,
  offsetY: 0,
  initialize: function(id, containerId, height, width, nodes, edges, grid) {
    this.id = id;
    this.containerId = containerId;
    this.height = height;
    this.width = width;
    this.css = 'canvas';
    this.svg = undefined;
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.ports = [];
    this.grid = grid || [10, 10];
    // this.tools = [this];
    this.toolBox = undefined;
    this.observable = undefined;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseStartX = 0;
    this.mouseStartY = 0;
    this.mouseEndX = 0;
    this.mouseEndY = 0;
    this.tempElement = undefined;
    this.shapeType = ShapeType.POINTER;
    this.toolName = 'POINTER';
    this.selectedTool = this;
    this.polyPoints = [];
    this.isCmdInPrgrs = false;
    this.lastClick = 0;
    this.isTap = false;
    this.draggbles = [];
    this.offsetX = 0;
    this.offsetY = 0;
    var that = this;
    var deltaX = 0;
    var deltaY = 0;
    var ops = "";
    this.options = {
      container: '#' + id + '_svg',
      restrict: '#' + id + '_svg',
      proportions: false,
      rotationPoint: false,
      //themeColor: 'white',
      // each: {
      //   resize: true,
      //   move: true,
      //   rotate: false
      // },
      snap: {
        x: 10,
        y: 10,
        angle: 5
      },
      cursorMove: 'move',
      cursorRotate: 'crosshair',
      cursorResize: 'pointer',
      onMove(dx, dy) {
          deltaX = dx;
          deltaY = dy;
          ops = "MOVE";
          var node = that.getNode(this.el.id);
          node.onMove(dx, dy);
      },
      onResize(dx, dy, obj) {
          deltaX = dx;
          deltaY = dy;
          ops = "RESIZE";
          var node = that.getNode(this.el.id);
          node.onResize(dx, dy, obj);
      },
      onRotate(obj) {
          console.log(obj);
          var node = that.getNode(this.el.id);
          node.onRotate(obj);
      },
      onDrop(obj) {
          var node = that.getNode(this.el.id);
          if(ops === "MOVE"){
            node.setCoordinates(deltaX, deltaY);
          } else if(ops === "RESIZE"){
            node.setSize(deltaX, deltaY);
          }
          node.populateProperties();
          ops = "";
          node.onDrop(obj);
      }
    };
  },
  /**
   * Method: getToolName
   * Description: Returns the name of the curret tool
   */
  getToolName: function() {
    return this.toolName;
  },
  /**
   * Method: getShapeType
   * Description: Returns the shape type the current tool supports
   */
  getShapeType: function() {
    return this.shapeType;
  },
  /**
   * Method: initEdge
   * Description: Adds edge to canvas before
   * it is rendered. If you wish to add edge after canvas
   * has been rendered, please use add_edge()
   */
  initEdge: function(edge) {
    this.edges.push(edge);
  },
  /**
   * Method: addEdge
   * Description: Adds an edge to canvas after canvas is
   * rendered. This function adds selectable, resizable,
   * etc operations once edge is added
   */
  addEdge: function(edge) {
    this.edges.push(edge);
    edge.render();
  },
  /**
   * Method: removeEdge
   * Description: Removes an edge from the array
   */
  removeEdge: function(edge) {
    //Call destroy method of edge
    edge.destroy();
    var index = this.edges.indexOf(edge);
    this.edges.splice(index, 1);
    var edgeEle = document.getElementById(edge.id);
    var edgeG = edgeEle.parentNode;
    edgeG.parentNode.removeChild(edgeG);
  },
  /**
   * Method: initNode
   * Description: Adds an node to canvas before
   * it is rendered. If you wish to add node after canvas
   * has been rendered, please use add_node()
   */
  initNode: function(node) {
    this.nodes.push(node);
  },
  /**
   * Method: addNode
   * Description: Adds an node to canvas after canvas is
   * rendered. This function adds selectable, resizable,
   * etc operations once node is added
   */
  addNode: function(node) {
    this.nodes.push(node);
    node.render();
    // if(node.getShapeType() === ShapeType.NODE || node.getShapeType() === ShapeType.CUSTOM){
    //   this.options.rotatable = false;
    // } else {
    //   this.options.rotatable = true;
    // }

    var item = subjx('#' + node.id).drag(this.options)[0];
    this.draggables.push(item);

    var that = this;
    subjx('#' + node.id).on('click', e => {

      that.draggables.forEach(function(item, index){
        if(item.el.id === e.currentTarget.id){
          that.draggables.splice(index, 1);
        }
      });

      // if(node.getShapeType() === ShapeType.NODE || node.getShapeType() === ShapeType.CUSTOM){
      //   that.options.rotatable = false;
      // } else {
      //   that.options.rotatable = true;
      // }
      const xDraggable = subjx(e.currentTarget).drag(that.options, that.observable)[0];
      xDraggable.el.attributes['selected'].value = true;
      that.draggables.push(xDraggable);
      node.populateProperties();
    });
  },
  /**
   * Method: removeNode
   * Description: Removes an node from the array
   */
  removeNode: function(node) {
    //Call destroy method of node
    node.destroy();
    //remove node itself
    var index = this.nodes.indexOf(node);
    this.nodes.splice(index, 1);
    var nodeToRemove = document.getElementById(node.id);
    if (nodeToRemove != undefined) {
      nodeToRemove.parentNode.removeChild(nodeToRemove);
    }
  },
  /**
   * Method: addPort
   * Description: adds an port assigned to an node on the canvas
   */
  addPort: function(port) {
    this.ports.push(port);
    port.render();
  },
  /**
   * Method: removePort
   * Description: removes an port from the canvas
   */
  removePort: function(port) {
    //call destroy method of port
    port.destroy();
    var index = this.ports.indexOf(port);
    this.ports.splice(index, 1);
    var portToRemove = document.getElementById(port.id);
    if(portToRemove != undefined) {
      portToRemove.parentNode.removeChild(portToRemove);
    }
  },
  /**
   *
   * Method: getPort
   * Description: returns the port with the specified id
   */
  getPort: function(port_id) {
    for(var i=0; i<this.ports.length; i++){
      if(this.ports[i].id === port_id){
        return this.ports[i];
      }
    }
    return null;
  },
  /**
   *
   * Method: getPort
   * Description: returns the port with the specified id
   */
  getPortXY: function(x, y) {
    for(var i=0; i<this.ports.length; i++){
      if(x >= this.ports[i].x && y >= this.ports[i].y && x <= (this.ports[i].x + 10) && y <= (this.ports[i].y + 10)){
        return this.ports[i];
      }
    }
    return null;
  },
  /**
   * Method: addTool
   * Description: adds an tool to the toolbox of the canvas
   */
  // addTool: function(tool) {
  //   this.tools.push(tool);
  // },
  /**
   * Method: removeTool
   * Description: removes an tool from the toolbox of the canvas
   */
  // removeTool: function(tool) {
  //   var index = this.tools.indexOf(tool);
  //   this.tools.splice(index, 1);
  //   var toolToRemove = document.getElementById(tool.id);
  //   if (toolToRemove != undefined) {
  //     toolToRemove.parentNode.removeChild(toolToRemove);
  //   }
  // },
  /**
   * Method: setToolBox
   * Description: sets the toolbox instance for this canvas
   */
  setToolBox: function(toolBox) {
    this.toolBox = toolBox;
  },
  /**
   * Method: render
   * Description: Renders the HTML for Canvas component in parent element
   */
  render: function() {
    /*Renders the canvas along with Nodes and edges*/
    var html="<div id='layout' style='width: 100%; height: 100%'></div>";
    if (this.containerId === undefined) {
      this.dom = $j('body').prepend(html);
    } else {
      var container = $j(this.containerId);
      this.dom = $j(html).appendTo($j(container));
    }

    var that = this;
    var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
    $j('#layout').w2layout({
      name: 'layout',
      panels: [
        {type: 'top', size: 40, style: pstyle, content: 'top', resizable: false},
        { type: 'left', size: 140, style: pstyle, content: 'left', resizable: true },
        { type: 'main', style: pstyle, content: 'main' },
        { type: 'right', size: 250, style: pstyle, content: 'right', resizable: true },
        { type: 'bottom', size: 40, style: pstyle, content: 'bottom', resizable: false },
      ]
    });
    var toolsHtml = this.toolBox.render();
    // toolsHtml +=
    //       `<table style='width: 50px;' class='middle toolbox'>
    //           <tr>
    //             <th>Toolbox</th>
    //           </tr>
    //           <tr>
    //             <td>`;
    //               for (var i = 0; i < this.tools.length; i++) {
    //                 if (i === 0) {
    //                   toolsHtml += this.renderToolItem();
    //                 } else {
    //                   toolsHtml += this.tools[i].renderToolItem();
    //                 }
    //               }
    //               toolsHtml +=
    //             `</td>
    //           </tr>
    //           <tr>
    //             <td style='text-align: center; font-size: 9px;'>`;
    //             toolsHtml += `X: <span id='x_label'></span>
    //                      Y: <span id='y_label'></span>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td style='text-align: center; font-size: 9px;'>`;
    //     toolsHtml += `STATE: <span id='mouse_state'></span>`;
    //     toolsHtml += `</td>
    //           </tr>
    //         </table>`;
    //w2ui['layout'].content('left', toolsHtml);

    var svgHtml = "";
    svgHtml = "<svg class='" + this.css + `' style='top: 0px; left: 0px;
                height: 100%; width: 100%'
                id='` + this.id + "_svg' ></svg>";

    var mainHtml = "<table style='width: 100%; height: 100%;'><tr>";
    mainHtml += "<td style='width: 50px; vertical-align: top'>";
    mainHtml += toolsHtml + "</td><td>" + svgHtml + "</td></tr></table>";

    w2ui['layout'].content('main', mainHtml);
    //activate the toolbox
    this.toolBox.activate();
    this.offsetX = w2ui['layout'].get('left').size + 90;
    this.offsetY = w2ui['layout'].get('top').size + 20;

    w2ui['layout'].on('resize', function(event){
      if(event.panel === "left"){
        that.offsetX = w2ui['layout'].get('left').size + 90;
      }
    });

    w2ui['layout'].content('left', $j().w2sidebar({
      name: 'projectExplorer',
      nodes: [
        { id: 'projects', text: 'Projects', img: 'icon-folder', expanded: true, group: true,
          nodes: [{ id: 'project1', text: 'Project1', icon: 'fas fa-drafting-compass' },
                  { id: 'project2', text: 'Project2', icon: 'fas fa-drafting-compass' },
                  { id: 'project3', text: 'Project3', icon: 'fas fa-drafting-compass' }
                ]}
      ]
    }));

    //$j('#layout_layout_panel_right div:last').w2grid({
    w2ui['layout'].content('right', $j().w2grid({
      name: 'properties',
      header: 'Properties',
      show: { header: true,
              toolbar: true,
              lineNumbers: true,
              footer: true
            },
      multiSearch: true,
      searches: [
        { field: 'propName', caption: 'Name', type: 'text'},
        { field: 'propValue', caption: 'Value', type: 'text'}
      ],
      columns: [
        {field: 'propName', caption: 'Name', size: '100px'},
        {field: 'propValue', caption: 'Value', size: '100px', editable: { type: 'text'}}
      ],
      onChange: function(event){
        var rowIndex = event.index;
        var newValue = event.value_new;
        var colName = w2ui['properties'].getCellValue(rowIndex, 0);
        var selectionCounter = 0;

        var selectedItem = null;
        that.edges.forEach(function(item){
          if(item.isSelected()){
            selectedItem = item;
            selectionCounter++;
          }
        });

        //If selected item is not an edge, search in nodes
        if(selectedItem === null){
          that.nodes.forEach(function(item){
            if(item.isSelected()){
              selectedItem = item;
              selectionCounter++;
            }
          });
        }

        //If selected item is not a node, search in ports
        if(selectedItem === null){
          that.ports.forEach(function(port){
            if(port.isSelected()){
              selectedItem = port;
              selectionCounter++;
            }
          });
        }

        if(selectionCounter > 1){
          alert('Please select only one item on canvas. Multiple item selection is not allowed while making changes to properties.');
        } else {
          selectedItem.setProperty(colName, newValue);
          //w2ui['properties'].save();
        }
      }
    }));

    //$j('#layout_layout_panel_top div:last').w2toolbar({
    w2ui['layout'].content('top', $j().w2toolbar({
      name: 'mainToolbar',
      items: [
        { type: 'button', id: 'new-drawing', caption: 'New', img: 'far fa-file', hint: 'New Drawing'},
        { type: 'button', id: 'open-drawing', caption: 'Open', img: 'far fa-folder-open', hint: 'Open Drawing'},
        { type: 'button', id: 'save-drawing', caption: 'Save', img: 'far fa-save', hint: 'Save Drawing'},
        { type: 'break'},
        { type: 'button', id: 'clone-item', caption: 'Clone', img: 'far fa-copy', hint: 'Clone an item'},
        { type: 'break'},
        { type: 'button', id: 'erase-item', caption: 'Erase', img: 'fa fa-eraser', hint: 'Erase an item'},
        { type: 'break'},
        { type: 'button', id: 'undo', caption: 'Undo', img: 'fa fa-undo', hint: 'Undo'},
        { type: 'button', id: 'redo', caption: 'Redo', img: 'fas fa-redo', hint: 'Redo'},
        { type: 'break'},
        { type: 'button', id: 'settings', caption: 'Settings', img: 'fas fa-cogs', hint: 'Settings'},
        { type: 'break'},
        { type: 'spacer'},
        { type: 'button', id: 'about', caption: 'About', img: 'fa fa-info', hint: 'About'},
        { type: 'break'},
        { type: 'button', id: 'help', caption: 'Help', img: 'fa fa-question-circle', hine: 'help'}

      ]
    }));

    //$j('#layout_layout_panel_bottom div:last').w2toolbar({
    w2ui['layout'].content('bottom', $j().w2toolbar({
      name: 'footerToolbar',
      items: [
        { type: 'spacer' },
        { type: 'html', id: 'info',
            html: function(item){
              var html = "<div style='padding: 3px 10px'>Version 1.0</div>";
              return html;
            }
        }
      ]
    }));

    $j('[name="tools"]').bind('click', function(e) {
      var name = e.currentTarget.id;
      var tool = that.toolBox.getTool(name);
      if(tool !== null){
        that._changeTool(tool);
      } else {
        that._changeTool(that);
      }
      // for (var i = 0; i < that.tools.length; i++) {
      //   if ((that.id + "_" + that.tools[i].getToolName() + "_tool") === name) {
      //     that._changeTool(i);
      //   }
      // }
    });
    // for (var i = 0; i < this.nodes.length; i++) {
    //   this.nodes[i].registerPortHighlighters();
    // }

    this._registerMarkers();
    this._registerObserver();

  },
  _registerObserver: function() {
    this.mouseState = MouseState.UP;
    var svg = document.getElementById(this.id + '_svg');
    svg.addEventListener('mousemove', mouseMove);
    svg.addEventListener('touchmove', mouseMove);
    svg.addEventListener('mousedown', mouseDown);
    svg.addEventListener('touchstart', mouseDown);
    svg.addEventListener('mouseup', mouseUp);
    svg.addEventListener('touchend', mouseUp);
    svg.addEventListener('dblclick', mouseDblClick);
    var that = this;
    var isCtrlKeyPressed = false;
    this.isCmdInPrgrs = false;
    this.polyPoints = [];
    this.lastClick = 0;
    var selectedHandler = null;

    document.onkeydown = function(e){
      if(e.ctrlKey){
        isCtrlKeyPressed = true;
      }
    }

    document.onkeyup = function(e){
      if(e.keyIdentifier === "Control"){
        isCtrlKeyPressed = false;
      }
    }

    document.onkeypress = function(e){
      if(e.code === "Delete"){
        var itemNames = "";
        that.nodes.forEach(function(node){
          if(node.isSelected()){
            itemNames += node.id + ", ";
          }
        });
        that.edges.forEach(function(edge){
          if(edge.isSelected()){
            itemNames += edge.id + ", ";
          }
        });
        itemNames = itemNames.substring(0, itemNames.length-2);
        var result = confirm("Are you sure you want to delete following items:\n" + itemNames);
        if(!result){
          return;
        }
        //Using a for loop as: for(var i=0;i<that.nodes.length;i++)
        //produces an issues where "nodes.length" keeps reducing as we
        //remove an element from the array while variable "i" keeps
        //incrementing irrespective of the new value of "nodes.length".
        //As a result not all elements of the array are iterated because
        //variable "i" keeps incrementing and array is reduced with every
        //remove operation which means the condition "i<nodes.length"
        //becomes false even before remaining elements are iterated.

        //So we are usig two loops:
        //1)  the first one will iterate as per the original length of the
        //    "nodes" array and will not consider the new value of the length
        //    of "nodes" array
        //2)  the second "forEach" loop runs and removes the elements from the
        //    array and considers the updated value of the array length
        //The first loop make sures that the second loop keeps executing till
        //all elements in the array are iterated

        var nodesLength = that.nodes.length;
        for(var i=0; i < nodesLength; i++){
          that.nodes.forEach(function(node){
            if(node.isSelected()){
              that.draggables.forEach(function(item, index){
                if(item.el.id === node.id){
                  item.disable();
                  that.draggables.splice(index, 1);
                }
              });
              that.removeNode(node);
            }
          });
        }
        var edgesLength = that.edges.length;
        for(var i=0; i < edgesLength; i++){
          that.edges.forEach(function(edge){
            if(edge.isSelected()){
              that.removeEdge(edge);
            }
          });
        }
      }
    }

    function mouseMove(e) {
      e.preventDefault();
      that.mouseX = e.clientX - that.offsetX;
      that.mouseY = e.clientY - that.offsetY;
      if (that.mouseX === undefined || that.mouseY === undefined) {
        that.mouseX = e.touches[0].clientX;
        that.mouseY = e.touches[0].clientY;
      }
      $j('#x_label').text(parseInt(that.mouseX));
      $j('#y_label').text(parseInt(that.mouseY));
      if (that.mouseState === MouseState.DOWN || that.mouseState === MouseState.DRAG) {
        that.mouseState = MouseState.DRAG;

        if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.LINE) {
          that.tempElement.attr('x2', that.mouseX);
          that.tempElement.attr('y2', that.mouseY);
        } else if (that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.RECTANGLE) {
          that.tempElement.attr('width', that.mouseX - that.mouseStartX);
          that.tempElement.attr('height', that.mouseY - that.mouseStartY);
        } else if (that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.CIRCLE) {
          that.tempElement.attr('r', that.mouseX - that.mouseStartX);
        } else if (that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.ELLIPSE) {
          that.tempElement.attr('rx', that.mouseX - that.mouseStartX);
          that.tempElement.attr('ry', that.mouseY - that.mouseStartY);
        } else if (that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.NODE) {
          that.tempElement.attr('width', that.mouseX - that.mouseStartX);
          that.tempElement.attr('height', that.mouseY - that.mouseStartY);
        } else if (that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.CUSTOM) {
          that.tempElement.attr('width', that.mouseX - that.mouseStartX);
          that.tempElement.attr('height', that.mouseY - that.mouseStartY);
        }
      } else {
        that.mouseState = MouseState.MOVE;
        if (that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.POLYGON) {
          var polyPointString = '';
          for(var i=0; i < that.polyPoints.length; i++){
            polyPointString += that.polyPoints[i].x + ',' + that.polyPoints[i].y + ' ';
          }
          polyPointString += that.mouseX + ',' + that.mouseY;
          that.tempElement.attr('points', polyPointString);
        } else if (that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.POLYLINE) {
          var polyPointString = '';
          for(var i=0; i < that.polyPoints.length; i++){
            polyPointString += that.polyPoints[i].x + ',' + that.polyPoints[i].y + ' ';
          }
          polyPointString += that.mouseX + ',' + that.mouseY;
          that.tempElement.attr('points', polyPointString);
        }
        else if(that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.BEZIRE_CURVE){
          // var len = that.polyPoints.length;
          // that.polyPoints[len-1] = new Point(that.mouseX, that.mouseY);
      	  var data=[];
      	  for(var i=0;i<that.polyPoints.length;i++){
      		  var point = {x: that.polyPoints[i].x, y: that.polyPoints[i].y};
      	    data.push(point);
	         }
           data.push({x: that.mouseX, y: that.mouseY});
          // prepare a helper function
          var curveFunc = d3.line()
            .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
            .x(function(d) { return d.x })
            .y(function(d) { return d.y });
          that.tempElement.attr('d', curveFunc(data));
        }
      }
      $j('#mouse_state').text(MouseState.properties[that.mouseState].name);

    }

    function mouseDown(e) {
      e.preventDefault();
      if (that.mouseState === MouseState.UP || that.mouseState === MouseState.MOVE) {
        that.mouseState = MouseState.DOWN;
        $j('#mouse_state').text(MouseState.properties[that.mouseState].name);

        that.mouseStartX = e.clientX - that.offsetX;
        that.mouseStartY = e.clientY - that.offsetY;
	      that.isTap = false;
        if (that.mouseStartX === undefined || that.mouseStartY === undefined) {
          that.mouseStartX = e.touches[0].clientX;
          that.mouseStartY = e.touches[0].clientY;
	        that.isTap = true;
        }
        // if(that.selectedTool.getShapeType() === ShapeType.SELECT){
        //   if(e.target.id.endsWith('start_handler') || e.target.id.endsWith('end_handler')){
        //     selectedHandler = d3.select('#' + e.target.id);
        //   }
        // }
        if (e.currentTarget.id === (that.id + '_svg')) {
          var svg_id = '#' + that.id + '_svg';
          var svg = d3.select(svg_id);
          switch (that.selectedTool.getShapeType()) {
            case ShapeType.LINE:
              that.tempElement = svg.append('line')
                .attr('id', 'temp_id')
                .attr('x1', that.mouseStartX)
                .attr('y1', that.mouseStartY)
                .attr('x2', that.mouseStartX)
                .attr('y2', that.mouseStartY)
                .attr('style', 'stroke:green;stroke-width:2px;stroke-dasharray:2');
              break;
            case ShapeType.RECTANGLE:
              that.tempElement = svg.append('rect')
                .attr('id', 'temp_id')
                .attr('x', that.mouseStartX)
                .attr('y', that.mouseStartY)
                .attr('height', '5')
                .attr('width', '5')
                .attr('style', 'stroke: green; stroke-width: 2px; stroke-dasharray:2; fill:none');
              break;
            case ShapeType.NODE:
              that.tempElement = svg.append('rect')
                .attr('id', 'temp_id')
                .attr('x', that.mouseStartX)
                .attr('y', that.mouseStartY)
                .attr('height', '5')
                .attr('width', '5')
                .attr('style', 'stroke: green; stroke-width: 2px; stroke-dasharray:2; fill:none');
              break;
            case ShapeType.CUSTOM:
              that.tempElement = svg.append('rect')
                .attr('id', 'temp_id')
                .attr('x', that.mouseStartX)
                .attr('y', that.mouseStartY)
                .attr('height', '5')
                .attr('width', '5')
                .attr('style', 'stroke: green; stroke-width: 2px; stroke-dasharray:2; fill:none');
              break;
            case ShapeType.CIRCLE:
              that.tempElement = svg.append('circle')
                .attr('id', 'temp_id')
                .attr('cx', that.mouseStartX)
                .attr('cy', that.mouseStartY)
                .attr('r', '5')
                .attr('style', 'stroke: green; stroke-width: 2px; stroke-dasharray:2; fill:none');
              break;
            case ShapeType.ELLIPSE:
              that.tempElement = svg.append('ellipse')
                .attr('id', 'temp_id')
                .attr('cx', that.mouseStartX)
                .attr('cy', that.mouseStartY)
                .attr('rx', '5')
                .attr('ry', '5')
                .attr('style', 'stroke: green; stroke-width: 2px; stroke-dasharray: 2; fill:none');
              break;
            case ShapeType.POLYGON:
                var point = new Point(that.mouseStartX, that.mouseStartY);
                that.polyPoints.push(point);
                var pointString = '';
                for (var i = 0; i < that.polyPoints.length; i++) {
                  pointString += that.polyPoints[i].x + ',' + that.polyPoints[i].y + ' ';
                }
                if (that.tempElement !== undefined) {
                  that.tempElement.remove();
                  that.tempElement = undefined;
                }
                that.tempElement = svg.append('polygon')
		              .attr('id', 'temp_id')
                  .attr('points', pointString)
                  .attr('style', 'stroke: green; stroke-width: 2px; stroke-dasharray: 2; fill: none;');
          		  if((Date.now() - that.lastClick) < 300 && that.isTap){
          			  mouseDblClick(e);
          			  that.lastClick = 0;
          			  that.isTap = false;
          		  }
          		  that.lastClick = Date.now();
              break;
            case ShapeType.POLYLINE:
                var point = new Point(that.mouseStartX, that.mouseStartY);
                that.polyPoints.push(point);
                var pointString = '';
                for (var i = 0; i < that.polyPoints.length; i++) {
                  pointString += that.polyPoints[i].x + ',' + that.polyPoints[i].y + ' ';
                }
                if (that.tempElement !== undefined) {
                  that.tempElement.remove();
                  that.tempElement = undefined;
                }
                that.tempElement = svg.append('polyline')
		              .attr('id', 'temp_id')
                  .attr('points', pointString)
                  .attr('style', 'stroke: green; stroke-width: 2px; stroke-dasharray: 2; fill: none;');
          		  if((Date.now() - that.lastClick) < 300 && that.isTap){
          			  mouseDblClick(e);
          			  that.lastClick = 0;
          			  that.isTap = false;
          		  }
          		  that.lastClick = Date.now();
              break;
            case ShapeType.BEZIRE_CURVE:
              var point = new Point(that.mouseStartX, that.mouseStartY);
              that.polyPoints.push(point);
              var data = [];
              for(var i=0; i < that.polyPoints.length; i++){
                  var point = {x: that.polyPoints[i].x, y: that.polyPoints[i].y};
                  data.push(point);
              }
              // prepare a helper function
              var curveFunc = d3.line()
                .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
                .x(function(d) { return d.x })
                .y(function(d) { return d.y });

		            if (that.tempElement !== undefined) {
                  that.tempElement.remove();
                  that.tempElement = undefined;
                }

              // Add the path using this helper function
               that.tempElement = svg.append('path')
		            .attr('id', 'temp_id')
                .attr('d', curveFunc(data))
                .attr('stroke', 'green')
		            .attr('stroke-width', '2px')
		            .attr('stroke-dasharray', '2')
                .attr('fill', 'none');
              break;
            case ShapeType.POINTER:
              if(isCtrlKeyPressed){
                if (e.target.id === (that.id + '_svg')){
                  that.draggables.forEach(function(item){
                    item.disable();
                    item.el.attributes['selected'].value = false;
                  });
                  that.edges.forEach(function(edge){
                    edge.disable();
                  });
                  that.ports.forEach(function(port){
                    port.disable();
                  });
                }
              } else {
                that.draggables.forEach(function(item){
                  item.disable();
                  item.el.attributes['selected'].value = false;
                });
                // that.nodes.forEach(function(node){
                //   node.disable();
                // });
                that.edges.forEach(function(edge){
                  edge.disable();
                });
                that.ports.forEach(function(port){
                  port.disable();
                });
              }
              w2ui['properties'].clear();
          }
        }
      }
    }

    function mouseUp(e) {
      e.preventDefault();
      if (that.mouseState === MouseState.DOWN || that.mouseState === MouseState.DRAG) {
        that.mouseState = MouseState.UP;
        $j('#mouse_state').text(MouseState.properties[that.mouseState].name);
        that.mouseEndX = e.clientX - that.offsetX;
        that.mouseEndY = e.clientY - that.offsetY;
        if (that.mouseEndX === undefined || that.mouseEndY === undefined) {
          if (e.touches.length > 0) {
            that.mouseEndX = e.touches[0].clientX;
            that.mouseEndY = e.touches[0].clientY;
          } else {
            that.mouseEndX = that.mouseX;
            that.mouseEndY = that.mouseY;
          }
        }
        if(that.selectedTool.getShapeType() === ShapeType.POINTER){
          //TODO = Unselect all items if clicked on the canvas
        } else if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.LINE)
        {
          var name = prompt("Element Name:");
          var dx = that.mouseEndX - that.mouseStartX;
          var dy = that.mouseEndY - that.mouseStartY;
          if(dx < 30){
            that.mouseEndX += 30;
          }
          if(dy < 30){
            that.mouseEndY += 30;
          }
          var line = new Line(name, that, {
            x: that.mouseStartX,
            y: that.mouseStartY
          }, {
            x: that.mouseX, //that.mouseEndX,
            y: that.mouseY //that.mouseEndY
          });
          that.tempElement.remove();
          that.tempElement = undefined;
          that.addEdge(line);
          that._selectPointerTool();
        } else if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.RECTANGLE) {
          var name = prompt("Element Name:");
          var dx = that.mouseEndX - that.mouseStartX;
          var dy = that.mouseEndY - that.mouseStartY;
          if(dx < 30){
            that.mouseEndX += 30;
          }
          if(dy < 30){
            that.mouseEndY += 30;
          }
          var rectDim = new RectDimension(that.mouseStartX, that.mouseStartY, (that.mouseEndY - that.mouseStartY), (that.mouseEndX - that.mouseStartX));
          var node = new Rectangle(name, that, rectDim);
          that.tempElement.remove();
          that.tempElement = undefined;
          that.addNode(node);
          that._selectPointerTool();
        } else if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.NODE) {
          var name = prompt("Element Name:");
          var dx = that.mouseEndX - that.mouseStartX;
          var dy = that.mouseEndY - that.mouseStartY;
          if(dx < 30){
            that.mouseEndX += 30;
          }
          if(dy < 30){
            that.mouseEndY += 30;
          }
          var rectDim = new RectDimension(that.mouseStartX, that.mouseStartY, (that.mouseEndY - that.mouseStartY), (that.mouseEndX - that.mouseStartX));
          var node = new BasicNode(name, that, rectDim);
          that.tempElement.remove();
          that.tempElement = undefined;
          that.addNode(node);
          that._selectPointerTool();
        }  else if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.CUSTOM) {
          var name = prompt("Element Name:");
          var dx = that.mouseEndX - that.mouseStartX;
          var dy = that.mouseEndY - that.mouseStartY;
          if(dx < 30){
            that.mouseEndX += 30;
          }
          if(dy < 30){
            that.mouseEndY += 30;
          }
          var rectDim = new RectDimension(that.mouseStartX, that.mouseStartY, (that.mouseEndY - that.mouseStartY), (that.mouseEndX - that.mouseStartX));
          var classType = that.selectedTool.getClassType();
          var node = new classType(name, that, rectDim);
          that.tempElement.remove();
          that.tempElement = undefined;
          that.addNode(node);
          that._selectPointerTool();
        } else if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.CIRCLE) {
          var name = prompt("Element Name:");
          var dx = that.mouseEndX - that.mouseStartX;
          if(dx < 30){
            that.mouseEndX += 30;
          }
          var circDim = new CircleDimension(that.mouseStartX, that.mouseStartY, (that.mouseEndX - that.mouseStartX));
          var circ = new Circle(name, that, circDim);
          that.tempElement.remove();
          that.tempElement = undefined;
          that.addNode(circ);
          that._selectPointerTool();
        } else if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.ELLIPSE) {
          var name = prompt("Element Name:");
          var dx = that.mouseEndX - that.mouseStartX;
          var dy = that.mouseEndY - that.mouseStartY;
          if(dx < 30){
            that.mouseEndX += 30;
          }
          if(dy < 30){
            that.mouseEndY += 30;
          }
          var ellipDim = new EllipseDimension(that.mouseStartX, that.mouseStartY, (that.mouseEndX - that.mouseStartX), (that.mouseEndY - that.mouseStartY));
          var ellip = new Ellipse(name, that, ellipDim);
          that.tempElement.remove();
          that.tempElement = undefined;
          that.addNode(ellip);
          that._selectPointerTool();
        } else if(that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.BEZIRE_CURVE){
          if(that.polyPoints.length === 3){
            var name = prompt("Element Name:");
            var data = [];
            for(var i=0; i<that.polyPoints.length; i++){
              var point = {x: that.polyPoints[i].x, y: that.polyPoints[i].y};
              data.push(point);
            }
            that.tempElement.remove();
            that.tempElement = undefined;
            that.polyPoints = [];
            var bcurve = new BezireCurve(name, that, data);
            that.addEdge(bcurve);
            that._selectPointerTool();
          }
        }
      }
    }
    function mouseDblClick(e){
      if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.POLYGON) {
          var name = prompt("Element Name:");
          if(that.polyPoints.length > 1){
            //Remove the duplicate point inserted at the last of the array due to
            //double click action used to end the drawing of polygon on canvas
            that.polyPoints.pop();

            var polyPointString = '';
            for(var i=0; i<that.polyPoints.length; i++){
              polyPointString += that.polyPoints[i].x + ',' + that.polyPoints[i].y + ' ';
            }
            var poly = new Polygon(name, that, polyPointString);
            that.tempElement.remove();
            that.tempElement = undefined;
            that.addNode(poly);
            that.isCmdInPrgrs = false;
            that.polyPoints = [];
            that._selectPointerTool();
        }
      } else if(that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.POLYLINE){
          var name = prompt("Element Name:");
          if(that.polyPoints.length > 1){
            //Remove the duplicate point inserted at the last of the array due to
            //double click action used to end the drawing of polyline on canvas
            that.polyPoints.pop();

            var polyPointString = '';
            for(var i=0; i<that.polyPoints.length; i++){
              polyPointString += that.polyPoints[i].x + ',' + that.polyPoints[i].y + ' ';
            }
            var poly = new Polyline(name, that, polyPointString);
            that.tempElement.remove();
            that.tempElement = undefined;
            that.addEdge(poly);
            that.isCmdInPrgrs = false;
            that.polyPoints = [];
            that._selectPointerTool();
      	 }
       }
      }
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.id + "_POINTER_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.id + "_POINTER_tool' checked>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                    <defs>
                      <marker id="toolArrow" refX="6" refY="6" markerWidth="30" markerHeight="30" markerUnits="userSpaceOnUse" orient="auto">
                          <path d="M 0 0 12 6 0 12 3 6" style="fill: black;"></path>
                      </marker>
                    </defs>
                      <line x1='25' y1='25' x2='35' y2='35' style='stroke: black; stroke-width: 2px;' marker-end= 'url(#toolArrow)' transform='rotate(180 25 25)'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">POINTER</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
  _registerMarkers: function() {

    var svg_id = '#' + this.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    svg.append('svg:defs').append('svg:marker')
      .attr("id", "arrow_end")
      .attr("refX", 11)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "context-stroke");

    svg.append('svg:defs').append('svg:marker')
      .attr("id", "arrow_start")
      .attr("refX", 11)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 6 12 0 9 6 12 12")
      .style("fill", "context-stroke");
  },
  _changeTool(/*index*/ tool) {
    // if (index < this.tools.length) {
    //   this.selectedTool = this.tools[index];
    // }
    this.selectedTool = tool;
  },
  _selectPointerTool: function() {
    $j('#' + this.id + '_POINTER_tool').prop("checked", true).trigger('click');
  },
  getNode: function(id) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (id === this.nodes[i].id) {
        return this.nodes[i];
      }
    }
    return null;
  },
  getEdge: function(id) {
    for (var i = 0; i < this.edges.length; i++) {
      if (id === this.edges[i].id) {
        return this.edges[i];
      }
    }
  },
  getFirstPortOfNode: function(id) {
    var node = this.getNode(id);
    return node.getFirstPort();
  },
  getAllPortsOfNode: function(id) {
    var node = this.getNode(id);
    return node.getAllPorts();
  },
  getLastPortOfNode: function(id) {
    var node = this.getNode(id);
    return node.getLastPort();
  },
  getNextEmptyPortOfNode: function(id) {
    var node = this.getNode(id);
    return node.getNextEmptyPort();
  }
});

/**
 * Shape: Base class for all shapes that could be added to the cavas
 * @constructor
 */
var Shape = Class.create({
  id: "",
  title: "",
  description: "",
  shapeType: ShapeType.NONE,
  toolName: 'NONE',
  handlersVisible: true,
  selected: true,
  initialize: function(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.shapeType = ShapeType.NONE;
    this.toolName = 'NONE';
    this.handlersVisible = true;
    this.selected = true;
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {
    var svg = d3.select('#' + this.parentElement.id + '_svg');

    this.g = svg.append('g')
      .attr('id', this.id + '_g');
  },
  createHandlers: function() {
    var that = this;
    var offsetX = 0;
    var offsetY = 0;

     //Drag function to drag the handlers/controls which appears at each edge
    //of the line in form of filled circles
    this.dragHandlers = d3.drag()
      .on('start', function (e) { hDragStartHandler(e, that, this); })
      .on('drag', function (e) { hDragMoveHandler(e, that, this); })
      .on('end', function (e) { hDropHandler(e, that, this) });

    var shape = document.getElementById(this.id);
    this.bBox = shape.getBBox();
    shape.addEventListener('click', mouseClick);

    // var svg = d3.select('#' + this.parentElement.id + '_svg');

    this.g// = svg.append('g')
      // .attr('id', this.id + '_g')
      .call(this.dragHandlers);
    this.borderHandler = this.g.append('rect')
      .attr('id', this.id + '_g_border_handler')
      .attr('x', this.bBox.x)
      .attr('y', this.bBox.y)
      .attr('height', this.bBox.height)
      .attr('width', this.bBox.width)
      .attr('fill', '#00a8ff')
      .attr('fill-opacity', '0.1')
      .attr('stroke', '#00a8ff')
      .attr('stroke-dasharray', '3 3')
      .attr('vector-effect', 'non-scaling-stroke');
    this.ltHandler = this.g.append('circle')
      .attr('id', this.id + '_g_lt_handler')
      .attr('cx', this.bBox.x)
      .attr('cy', this.bBox.y)
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');
    this.lmHandler = this.g.append('circle')
      .attr('id', this.id + '_g_lm_handler')
      .attr('cx', this.bBox.x)
      .attr('cy', this.bBox.y + (this.bBox.height/2))
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');
    this.lbHandler = this.g.append('circle')
      .attr('id', this.id + '_g_lb_handler')
      .attr('cx', this.bBox.x)
      .attr('cy', this.bBox.y + (this.bBox.height))
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');
    this.mtHandler = this.g.append('circle')
      .attr('id', this.id + '_g_mt_handler')
      .attr('cx', this.bBox.x + (this.bBox.width/2))
      .attr('cy', this.bBox.y)
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');
    this.mbHandler = this.g.append('circle')
      .attr('id', this.id + '_g_mb_handler')
      .attr('cx', this.bBox.x + (this.bBox.width/2))
      .attr('cy', this.bBox.y + (this.bBox.height))
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');
    this.rtHandler = this.g.append('circle')
      .attr('id', this.id + '_g_rt_handler')
      .attr('cx', this.bBox.x + this.bBox.width)
      .attr('cy', this.bBox.y)
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');
    this.rmHandler = this.g.append('circle')
      .attr('id', this.id + '_g_rm_handler')
      .attr('cx', this.bBox.x + this.bBox.width)
      .attr('cy', this.bBox.y + (this.bBox.height/2))
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');
    this.rbHandler = this.g.append('circle')
      .attr('id', this.id + '_g_rb_handler')
      .attr('cx', this.bBox.x + this.bBox.width)
      .attr('cy', this.bBox.y + (this.bBox.height))
      .attr('r', '5.5')
      .attr('fill', '#00a8ff')
      .attr('stroke', '#fff')
      .attr('fill-opacity', '1')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('stroke-width', '1');

    function hDragStartHandler(e, shapeInstance, that) {
      offsetX = d3.event.x;
      offsetY = d3.event.y;
    }

    function hDragMoveHandler(e, shapeInstance, that) {
      //console.log(d3.event);
      d3.select(that).attr('transform', 'translate(' + (d3.event.x - offsetX) + ', ' + (d3.event.y - offsetY) + ')');
    }

    function hDropHandler(e, shapeInstance, that) {}

    function mouseClick(e) {
      if(that.handlersVisible === false) {
        that.handlersVisible = true;
        that.selected = true;
        that.borderHandler.attr('visibility', 'visible');
        that.ltHandler.attr('visibility', 'visible');
        that.lmHandler.attr('visibility', 'visible');
        that.lbHandler.attr('visibility', 'visible');
        that.mtHandler.attr('visibility', 'visible');
        that.mbHandler.attr('visibility', 'visible');
        that.rtHandler.attr('visibility', 'visible');
        that.rmHandler.attr('visibility', 'visible');
        that.rbHandler.attr('visibility', 'visible');
        that.populateProperties();
      }
    }
  },
  setSize: function(dx, dy) {},
  setCoordinates: function(dx, dy) {},
  onMove: function(dx, dy) {},
  onResize: function(dx, dy, obj) {},
  onRotate: function(obj) {},
  onDrop: function(obj) {},
  populateProperties: function() {},
  setProperty: function(propName, propValue) {},
  renderToolItem: function() {},
  disable: function() {
    this.handlersVisible = false;
    this.selected = false;
    this.borderHandler.attr('visibility', 'hidden');
    this.ltHandler.attr('visibility', 'hidden');
    this.lmHandler.attr('visibility', 'hidden');
    this.lbHandler.attr('visibility', 'hidden');
    this.mtHandler.attr('visibility', 'hidden');
    this.mbHandler.attr('visibility', 'hidden');
    this.rtHandler.attr('visibility', 'hidden');
    this.rmHandler.attr('visibility', 'hidden');
    this.rbHandler.attr('visibility', 'hidden');
  },
  destroy: function() {}
});

/**
 * Line: Defines an edge that will be used to connect two nodes with
 * each other. A Line can have direction and will be denoted by an arrow
 * on one or both end of the line
 * @constructor
 */
const Line = Class.create({
  id: "",
  title: "",
  description: "",
  lineDimension: undefined, //an instance of the LineDimension class
  elementLeft: undefined,
  elementRight: undefined,
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  shapeType: ShapeType.LINE,
  toolName: 'LINE',
  startHandler: undefined,
  endHandler: undefined,
  line: undefined,
  path: undefined,
  text: undefined,
  g: undefined,
  handlersVisible: true,
  dragHandlers: undefined,
  selected: true,
  startPort: null,
  endPort: null,
  lastHandlerMoved: '',
  initialize: function(id, parentElement, elementLeft, elementRight, title, lineColor, lineWidth, lineStroke, hasArrow, arrowType, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.lineDimension = new LineDimension();
    this.lineDimension.hasArrow = hasArrow || true;
    this.lineDimension.arrowType = arrowType || "END";
    this.elementLeft = elementLeft;
    this.elementRight = elementRight;
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.LINE;
    this.toolName = 'LINE';
    this.handlersVisible = true;
    this.selected = true;
    this.startPort = null;
    this.endPort = null;
    this.lastHandlerMoved = '';
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  setStartPoint: function(x, y) {
    this.lineDimension.start.x = x;
    this.lineDimension.start.y = y;
    this.line
      .attr('x1', this.lineDimension.start.x)
      .attr('y1', this.lineDimension.start.y);
    this.path.attr('d', this._calculatePath());
    this.startHandler
      .attr('cx', this.lineDimension.start.x)
      .attr('cy', this.lineDimension.start.y);
  },
  setEndPoint: function(x, y) {
    this.lineDimension.end.x = x;
    this.lineDimension.end.y = y;
    this.line
      .attr('x2', this.lineDimension.end.x)
      .attr('y2', this.lineDimension.end.y);
    this.path.attr('d', this._calculatePath());
    this.endHandler
      .attr('cx', this.lineDimension.end.x)
      .attr('cy', this.lineDimension.end.y);
  },
  show: function() {
    this.line
      .attr('visibility', 'visible');
    this.path
      .attr('visibility', 'visible');
    this.titleText
      .attr('visibility', 'visible');
  },
  hide: function() {
    this.line
      .attr('visibility', 'hidden');
    this.path
      .attr('visibility', 'hidden');
    this.titleText
      .attr('visibility', 'hidden');
  },
  render: function() {
    if (!is_dict(this.elementLeft) && !is_dict(this.elementRight)) {
      this.startPort = this.elementLeft;
      this.endPort = this.elementRight;
      this.lineDimension.start.x = this.elementLeft.x + 5;
      this.lineDimension.start.y = this.elementLeft.y + 5;
      this.lineDimension.end.x = this.elementRight.x + 5;
      this.lineDimension.end.y = this.elementRight.y + 5;
    } else {
      this.lineDimension.start.x = this.elementLeft.x;
      this.lineDimension.start.y = this.elementLeft.y;
      this.lineDimension.end.x = this.elementRight.x;
      this.lineDimension.end.y = this.elementRight.y;
    }

    this.makeElement();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    this.g = svg.append('g')
      .attr('id', this.id + '_g');

    this.path = this.g.append('path')
      .attr('id', this.id + '_path')
      .attr('d', this._calculatePath())
      .attr('style', 'stroke: ' + this.lineColor + '; stroke-width: 1px;');

    this.line = this.g.append('line')
      .attr('id', this.id)
      .attr('x1', this.lineDimension.start.x)
      .attr('y1', this.lineDimension.start.y)
      .attr('x2', this.lineDimension.end.x)
      .attr('y2', this.lineDimension.end.y)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;')
      .attr('marker-end', 'url(#arrow_end)')
      .attr('data-type', 'edge-base')
      // .attr('parentElement', this.parentElement.id)
      // .attr('title', this.title)
      // .attr('description', this.description)
      // .attr('hasArrow', this.lineDimension.hasArrow)
      // .attr('arrowType', this.lineDimension.arrowType)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      // .attr('startHandler', this.id + '_start_handler')
      // .attr('endHandler', this.id + '_end_handler')
      .attr('handlersVisible', this.handlersVisible)
      .attr('selected', this.selected);

    this.titleText = this.g.append('text')
      .attr('id', this.id + '_title_text')
      .attr('dy', -10)
      .append('textPath')
      .attr('xlink:href', '#' + this.id + '_path')
      .style('text-anchor', 'middle')
      .attr('startOffset', '50%')
      .text(this.title)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    // this.descriptionText = this.g.append('text')
    //   .attr('id', this.id + '_description_text')
    //   .attr('dy', 15)
    //   .append('textPath')
    //   .attr('xlink:href', '#' + this.id + '_path')
    //   .style('text-anchor', 'middle')
    //   .attr('startOffset', '50%')
    //   .text(this.description)
    //   .attr('font-family', 'sans-serif')
    //   .attr('font-size', '.7em');

    this.createHandlers();
    this.populateProperties();
  },
  _calculatePath: function() {
    return 'M ' + this.lineDimension.start.x + ' ' + this.lineDimension.start.y +
           ' l ' + (this.lineDimension.end.x - this.lineDimension.start.x) +
           ' ' + (this.lineDimension.end.y - this.lineDimension.start.y);
  },
  createHandlers: function() {

    var that = this;
    //Drag function to drag the handlers/controls which appears at each edge
    //of the line in form of filled circles
    this.dragHandlers = d3.drag()
      .on('drag', function (e) { hDragMoveHandler(e, that, this); })
      .on('end', function (e) { hDropHandler(e, that, this) });

    //Handlers/Controls attached to both edge of the line. These provides the
    //functionality to modify the length & direction of the line interactively
    //using mouse drag operation
    this.startHandler = this.g.append('circle')
        .attr('id', this.id + '_start_handler')
        .attr('cx', this.lineDimension.start.x)
        .attr('cy', this.lineDimension.start.y)
        .attr('r', 5)
        .attr('style', 'stroke: #00a8ff; fill: #00a8ff;')
        .call(this.dragHandlers);
    this.endHandler = this.g.append('circle')
        .attr('id', this.id + '_end_handler')
        .attr('cx', this.lineDimension.end.x)
        .attr('cy', this.lineDimension.end.y)
        .attr('r', 5)
        .attr('style', 'stroke: #00a8ff; fill: #00a8ff;')
        .call(this.dragHandlers);

    function hDropHandler(e, lineInstance, that){

      var x = d3.event.x;
      var y = d3.event.y;
      var port = lineInstance.parentElement.getPortXY(x, y);

      if(port === null){
        //if no port found on drop, it means the line needs to be disconnected
        //from existing connected port
        if(lineInstance.lastHandlerMoved === 'START') {
          if(lineInstance.startPort != null) {
            lineInstance.startPort.disconnect();
            lineInstance.startPort = null;
          }
        } else if(lineInstance.lastHandlerMoved === 'END') {
          if(lineInstance.endPort != null) {
            lineInstance.endPort.disconnect();
            lineInstance.endPort = null;
          }
        }
      } else {
        if(lineInstance.lastHandlerMoved === 'START') {
          lineInstance.setStartPoint(port.x + 10, port.y + 5);
          port.connect(lineInstance, PortType.SOURCE);
          lineInstance.startPort = port;
        } else if(lineInstance.lastHandlerMoved === 'END') {
          lineInstance.setEndPoint(port.x, port.y + 5);
          port.connect(lineInstance, PortType.TARGET);
          lineInstance.endPort = port;
        }
        console.log('LINE: Port found with id: ' + port.id);
      }

      lineInstance.populateProperties();
    }

    function hDragMoveHandler(e, lineInstance, that){
      var x = d3.event.x;
      var y = d3.event.y;

      //Change the position of the handler (circle) by setting the new cx & cy coordinates
      d3.select(that).attr('cx', x);
      d3.select(that).attr('cy', y);

      var target = d3.event.sourceEvent.target;

      //if dragged handler is attached to the start of the line, change the x1 & y1
      //coordinates of the line to the new x,y position
      if(target.id.endsWith('start_handler')){
        lineInstance.line.attr('x1', x);
        lineInstance.line.attr('y1', y);
        lineInstance.lineDimension.start.x = x;
        lineInstance.lineDimension.start.y = y;
        lineInstance.lastHandlerMoved = 'START';
      }
      //if dragged handler is attached to the end of the line, change the x2 & y2
      //coordinates of the line to the new x,y position
      else if (target.id.endsWith('end_handler')){
        lineInstance.line.attr('x2', x);
        lineInstance.line.attr('y2', y);
        lineInstance.lineDimension.end.x = x;
        lineInstance.lineDimension.end.y = y;
        lineInstance.lastHandlerMoved = 'END';
      }

      lineInstance.path.attr('d', lineInstance._calculatePath());
    }

    //Functionality to hide or show the handlers attached to the line at both
    //edges whenever the line is double clicked
    var line = document.getElementById(this.id);
    line.addEventListener('click', mouseClick);

    function mouseClick(e){
      //Find out the line which has been double clicked and selects the same
      //to the get the ids of the handlers attached to this line
      var lineName = e.target.id;
      var line = d3.select('#' + lineName);

      //Read the line's attribute 'handlersVisible' to find out whether handlers are
      //visible or not
      var handlersVisible = JSON.parse(line.attr('handlersVisible'));

      //Read the line's attributes 'startHandler' & 'endHandler' to get the names of the
      //handlers attached to the line and select same for further operation
      // var startHandlerName = line.attr('startHandler');
      // var startHandler = d3.select('#' + startHandlerName);
      // var endHandlerName = line.attr('endHandler');
      // var endHandler = d3.select('#' + endHandlerName);

      //Show the handlers of the line
      if(!handlersVisible){
        that.startHandler.attr('visibility', 'visible');
        that.endHandler.attr('visibility', 'visible');
        line.attr('handlersVisible', true);
        line.attr('selected', true);
        that.handlersVisible = true;
        that.selected = true;

        //populate properties
        that.populateProperties();
      }
    }
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
              { recid: 3, propName: 'X1', propValue: this.lineDimension.start.x,
                w2ui: { editable: false,
                        style: "color: grey"
                      }
              },
              { recid: 4, propName: 'Y1', propValue: this.lineDimension.start.y,
                w2ui: { editable: false,
                        style: "color: grey"
                      }
              },
              { recid: 5, propName: 'X2', propValue: this.lineDimension.end.x,
                w2ui: { editable: false,
                        style: "color: grey"
                      }
              },
              { recid: 6, propName: 'Y2', propValue: this.lineDimension.end.y,
                w2ui: { editable: false,
                        style: "color: grey"
                      }
              },
              { recid: 7, propName: 'Stroke Color', propValue: this.lineColor,
                  w2ui: { editable: { type: 'color'} }
              },
              { recid: 8, propName: 'Stroke Width', propValue: this.lineWidth},
              { recid: 9, propName: 'Has Arrow', propValue: this.lineDimension.hasArrow,
                w2ui: { editable: { type: 'combo', items: [ { id: 1, text: 'true' },
                                                            { id: 2, text: 'false' }
                                                          ],
                                                          filter: false }
                      }
              },
              { recid: 10, propName: 'Arrow Type', propValue: this.lineDimension.arrowType,
                w2ui: { editable: { type: 'combo', items: [ { id: 1, text: 'END' },
                                                            { id: 2, text: 'START' },
                                                            { id: 3, text: 'BOTH' }
                                                          ],
                                                          filter: false }
                      }
              },
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
              }
            ]
          }
        },
        { recid: 14, propName: 'Details',
          w2ui: {
            children: [
              { recid: 15, propName: 'Title', propValue: this.title},
              { recid: 16, propName: 'Description', propValue: this.description}
            ]
          }
        }
    ]);
    w2ui['properties'].expand(1);
  },
  disable: function(){
    this.startHandler.attr('visibility', 'hidden');
    this.endHandler.attr('visibility', 'hidden');
    this.line.attr('handlersVisible', false);
    this.line.attr('selected', false);
    this.handlersVisible = false;
    this.selected = false;
  },
  isSelected: function(){
    return this.selected;
  },
  setProperty: function(propName, propValue){
    if(propName === "Stroke Color"){
      this.lineColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Title"){
      this.title = propValue;
      this.titleText.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
      // this.descriptionText.text(this.description);
    } else if(propName === "Arrow Type"){
      this.lineDimension.arrowType = propValue;
      if(propValue === "END"){
        this.line.attr('marker-end', 'url(#arrow_end)');
        this.line.attr('marker-start', '');
      } else if(propValue === "START"){
        this.line.attr('marker-end', '');
        this.line.attr('marker-start', 'url(#arrow_start)');
      } else if(propValue === "BOTH"){
        this.line.attr('marker-end', 'url(#arrow_end)');
        this.line.attr('marker-start', 'url(#arrow_start)');
      }
    } else if(propName === "Has Arrow"){
      this.lineDimension.hasArrow = JSON.parse(propValue);
      if(this.lineDimension.hasArrow){
       if(this.lineDimension.arrowType === "END"){
          this.line.attr('marker-end', 'url(#arrow_end)');
          this.line.attr('marker-start', '');
        } else if(this.lineDimension.arrowType === "START"){
          this.line.attr('marker-end', '');
          this.line.attr('marker-start', 'url(#arrow_start)');
        } else if(this.lineDimension.arrowType === "BOTH"){
          this.line.attr('marker-end', 'url(#arrow_end)');
          this.line.attr('marker-start', 'url(#arrow_start)');
        }
      } else {
        this.line.attr('marker-end', '');
        this.line.attr('marker-start', '');
      }
    }
  },
  destroy: function() {
    if(this.startPort != null) {
      this.startPort.disconnect();
    }
    if(this.endPort != null) {
      this.endPort.disconnect();
    }
  },
  renderToolItem() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_LINE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_LINE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                    <defs>
                      <marker id="toolAdrnrCirl" refX="6" refY="6" markerWidth="30" markerHeight="30" markerUnits="userSpaceOnUse" orient="auto">

                          <circle cx='6' cy='6' r='3' style='stroke:blue;fill:blue;'></circle>
                      </marker>
                    </defs>
                      <line x1='23' y1='23' x2='38' y2='38' style='stroke: black; stroke-width: 2px;' marker-start='url(#toolAdrnrCirl)' marker-end= 'url(#toolAdrnrCirl)' transform='rotate(180 25 25)'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">LINE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

/**
 * Rectangle: Defines an Rectangle that will be represented as node in the graph diagram
 * @constructor
 */
var Rectangle = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  fillColor: 'white',
  shapeType: ShapeType.RECTANGLE,
  toolName: 'RECT',
  selected: true,
  opacity: 0.2,
  initialize: function(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.fillColor = fillColor || "white";
    this.shapeType = ShapeType.RECTANGLE;
    this.toolName = 'RECT';
    this.selected = true;
    this.opacity = opacity || 0.2;
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  render: function() {
    this.makeElement();
  },
  checkPointInside: function(point){
    //First get the dom element of this rectangle
    var rect = $j('#' + this.id);
    //Get the bounding box to find out the height and width
    var dim = rect.getBBox();
    this.rectDimension.width = dim.width;
    this.rectDimension.height = dim.height;

    //Calculate all 4 points of the rectangle
    var matrix = rect.getCTM();
    var svg = document.getElementById(this.parentElement.id + '_svg');
    var tl = svg.createSVGPoint();
    tl.x = $j(rect).attr('x');
    tl.y = $j(rect).attr('y');
    tl = tl.matrixTransform(matrix);
    this.rectDimension.left = tl.x;
    this.rectDimension.top = tl.y;

    var tr = svg.createSVGPoint();
    tr.x = parseInt($j(rect).attr('x')) + parseInt($j(rect).attr('width'));
    tr.y = $j(rect).attr('y');
    tr = tr.matrixTransform(matrix);

    var bl = svg.createSVGPoint();
    bl.x = $j(rect).attr('x');
    bl.y = parseInt($(rect).attr('y')) + parseInt($j(rect).attr('height'));
    bl = bl.matrixTransform(matrix);

    // var br = svg.createSVGPoint();
    // br.x = parseInt($j(rect).attr('x')) + parseInt($j(rect).attr('width'));
    // br.y = parseInt($(rect).attr('y')) + parseInt($j(rect).attr('height'));
    // br = br.matrixTransform(matrix);

    if(point.x >= tl.x && point.x <= tr.x && point.y >= tl.y && point.y <= bl.y){
      return true;
    } else {
      return false;
    }
  },
  makeElement: function() { //$super
    // $super();

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('height', this.rectDimension.height)
      .attr('width', this.rectDimension.width)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2))
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    //this.createHandlers();
    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.rectDimension.width = parseInt(this.line.attr('width'));
    this.rectDimension.height = parseInt(this.line.attr('height'));
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));
    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2));
  },
  setCoordinates: function(dx, dy){
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));
    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
  },
  onResize: function(dx, dy, obj){
    this.text.attr('visibility', 'hidden');
  },
  onRotate: function(obj){
    this.text.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      }
            ]
          }
        },
        { recid: 14, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 15, propName: 'Title', propValue: this.title},
                      { recid: 16, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {

  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_RECT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_RECT_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='21' y='21' height='17' width='17' style='stroke: black; stroke-width: 2px; fill:none' transform='rotate(180 23 23)'></rect>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">RECT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * Circle: Defines an circle that will be represented as node in the graph diagram
 * @constructor
 */
var Circle = Class.create({
  id: "",
  title: "",
  description: "",
  circDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  shapeType: ShapeType.CIRCLE,
  toolName: 'CIRCLE',
  selected: true,
  fillColor: 'white',
  opacity: 0.2,
  initialize: function(id, parentElement, circDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.circDimension = circDimension || new CircleDimension(10, 10, 50);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.CIRCLE;
    this.toolName = 'CIRCLE';
    this.selected = true;
    this.fillColor = fillColor || 'white';
    this.opacity = opacity || 0.2;
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    this.line = svg.append('circle')
      .attr('id', this.id)
      .attr('cx', this.circDimension.cx)
      .attr('cy', this.circDimension.cy)
      .attr('r', this.circDimension.r)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.circDimension.cx)
      .attr('y', this.circDimension.cy)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.circDimension.cx += (dx/2);
    this.circDimension.cy += (dy/2);
    this.circDimension.r += (dx/4);
    this.circDimension.r += (dy/4);
    this.text
      .attr('x', this.circDimension.cx)
      .attr('y', this.circDimension.cy);
  },
  setCoordinates: function(dx, dy){
    this.circDimension.cx += dx;
    this.circDimension.cy += dy;
    this.text
      .attr('x', this.circDimension.cx)
      .attr('y', this.circDimension.cy);
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
  },
  onResize: function(dx, dy, obj){},
  onRotate: function(obj){},
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      { recid: 3, propName: 'CX', propValue: this.circDimension.cx,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 4, propName: 'CY', propValue: this.circDimension.cy,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 5, propName: 'Radius', propValue: this.circDimension.r,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 6, propName: 'Stroke Color', propValue: this.lineColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 7, propName: 'Stroke Width', propValue: this.lineWidth},
                      { recid: 8, propName: 'Fill Color', propValue: this.fillColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 9, propName: 'Opacity', propValue: this.opacity},
                      { recid: 10, propName: 'Shape Type', propValue: this.shapeType,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 11, propName: 'Tool Name', propValue: this.toolName,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 12, propName: 'Is Selected', propValue: this.selected,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      }
            ]
          }
        },
        { recid: 13, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 14, propName: 'Title', propValue: this.title},
                      { recid: 15, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {

  },
  renderToolItem() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_CIRCLE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_CIRCLE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <circle cx='19' cy='19' r='10' style='stroke: black; stroke-width: 2px; fill:none' transform='rotate(180 18 18)'></circle>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">CIRCLE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

/**
 * Ellipse: Defines an ellipse that will be represented as node in the graph diagram
 * @constructor
 */
var Ellipse = Class.create({
  id: "",
  title: "",
  description: "",
  ellipDimension: undefined, //an instance of the EllipseDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  shapeType: ShapeType.ELLIPSE,
  toolName: 'ELLIPSE',
  selected: true,
  fillColor: 'white',
  opacity: 0.2,
  initialize: function(id, parentElement, ellipDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.ellipDimension = ellipDimension || new EllipseDimension(10, 10, 50, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.ELLIPSE;
    this.toolName = 'ELLIPSE';
    this.selected = true;
    this.fillColor = fillColor || 'white';
    this.opacity = opacity || 0.2;
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    this.line = svg.append('ellipse')
      .attr('id', this.id)
      .attr('cx', this.ellipDimension.cx)
      .attr('cy', this.ellipDimension.cy)
      .attr('rx', this.ellipDimension.rx)
      .attr('ry', this.ellipDimension.ry)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.ellipDimension.cx)
      .attr('y', this.ellipDimension.cy)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.ellipDimension.cx += (dx/2);
    this.ellipDimension.cy += (dy/2);
    this.ellipDimension.rx += (dx/2);
    this.ellipDimension.ry += (dy/2);
    this.text
      .attr('x', this.ellipDimension.cx)
      .attr('y', this.ellipDimension.cy);
  },
  setCoordinates: function(dx, dy){
    this.ellipDimension.cx += dx;
    this.ellipDimension.cy += dy;
    this.text
      .attr('x', this.ellipDimension.cx)
      .attr('y', this.ellipDimension.cy);
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
  },
  onResize: function(dx, dy, obj){},
  onRotate: function(obj){},
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      { recid: 3, propName: 'CX', propValue: this.ellipDimension.cx,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 4, propName: 'CY', propValue: this.ellipDimension.cy,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 5, propName: 'RadiusX', propValue: this.ellipDimension.rx,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 6, propName: 'RadiusY', propValue: this.ellipDimension.ry,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 7, propName: 'Stroke Color', propValue: this.lineColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 8, propName: 'Stroke Width', propValue: this.lineWidth},
                      { recid: 9, propName: 'Fill Color', propValue: this.fillColor,
                        w2ui: { editable: { type: 'color'} }
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
                      }
            ]
          }
        },
        { recid: 14, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 15, propName: 'Title', propValue: this.title},
                      { recid: 16, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {

  },
  renderToolItem() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_ELLIPSE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_ELLIPSE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <ellipse cx='15' cy='19' rx='15' ry='10' style='stroke: black; stroke-width: 2px; fill:none' transform='rotate(180 18 18)'></ellipse>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">ELLIPSE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

/**
 * Polygon: Defines an polygon that will be represented as node in the graph diagram
 * @constructor
 */
var Polygon = Class.create({
  id: "",
  title: "",
  description: "",
  polyPoints: '10,10 50,50 100,10', //an instance of the EllipseDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  shapeType: ShapeType.POLYGON,
  toolName: 'POLYGON',
  selected: true,
  fillColor: 'white',
  opacity: 0.2,
  initialize: function(id, parentElement, polyPoints, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.polyPoints = polyPoints || '10,10 50,50 100,10';
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.POLYGON;
    this.toolName = 'POLYGON';
    this.selected = true;
    this.fillColor = fillColor || 'white';
    this.opacity = opacity || 0.2;
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    this.line = svg.append('polygon')
      .attr('id', this.id)
      .attr('points', this.polyPoints)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    var polyPointsArray = this.polyPoints.split(' ');
    var firstPointString = polyPointsArray[0];
    var firstPoint = firstPointString.split(',');

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', parseInt(firstPoint[0]) + 20)
      .attr('y', parseInt(firstPoint[1]) + 20)
      //.attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.polyPoints = d3.select('#' + this.id).attr('points');
    var polyPointsArray = this.polyPoints.split(' ');
    this.text
      .attr('x', parseInt(polyPointsArray[0]) + 20)
      .attr('y', parseInt(polyPointsArray[1]) + 20);
  },
  setCoordinates: function(dx, dy){
    this.polyPoints = d3.select('#' + this.id).attr('points');
    var polyPointsArray = this.polyPoints.split(' ');
    this.text
      .attr('x', parseInt(polyPointsArray[0]) + 20)
      .attr('y', parseInt(polyPointsArray[1]) + 20);
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
  },
  onResize: function(dx, dy, obj){},
  onRotate: function(obj){},
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      { recid: 3, propName: 'Points', propValue: this.polyPoints,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 4, propName: 'Stroke Color', propValue: this.lineColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 5, propName: 'Stroke Width', propValue: this.lineWidth},
                      { recid: 6, propName: 'Fill Color', propValue: this.fillColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 7, propName: 'Opacity', propValue: this.opacity},
                      { recid: 8, propName: 'Shape Type', propValue: this.shapeType,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 9, propName: 'Tool Name', propValue: this.toolName,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 10, propName: 'Is Selected', propValue: this.selected,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      }
            ]
          }
        },
        { recid: 11, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 12, propName: 'Title', propValue: this.title},
                      { recid: 13, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {

  },
  renderToolItem() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_POLYGON_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_POLYGON_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <polygon points='5,10 0,30 25,25 28,10' style='stroke: black; stroke-width: 2px; fill:none' transform='rotate(180 18 18)'></polygon>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">POLYGON</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

/**
 * Polyline: Defines an edge that will be used to connect two nodes with
 * each other. A Polyline can have direction and will be denoted by an arrow
 * on one or both end of the line
 * @constructor
 */
var Polyline = Class.create({
  id: "",
  title: "",
  description: "",
  polyPoints: '10,10 50,50 100,10', //instances of the Point class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  shapeType: ShapeType.POLYLINE,
  toolName: 'POLYLINE',
  handlersVisible: true,
  selected: true,
  hasArrow: true,
  arrowType: "END",
  startPort: null,
  endPort: null,
  lastHandlerMoved: '',
  initialize: function(id, parentElement, polyPoints, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.polyPoints = polyPoints || '10,10 50,50 100,10';
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.POLYLINE;
    this.toolName = 'POLYLINE';
    this.handlersVisible = true;
    this.selected = true;
    this.hasArrow = true;
    this.arrowType = "END";
    this.startPort = null;
    this.endPort = null;
    this.lastHandlerMoved = '';
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  setStartPoint: function(x, y) {
    var polyPointsArray = this.polyPoints.trim().split(' ');
    polyPointsArray[0] = x + ',' + y;
    this.polyPoints = polyPointsArray.join(' ');
    this.line
      .attr('points', this.polyPoints);
    this.path.attr('d', this._calculatePath());
    this.handlers[0]
      .attr('cx', x)
      .attr('cy', y);
  },
  setEndPoint: function(x, y) {
    var lastIndex = this.polyPoints.trim().split(' ').length - 1;
    var polyPointsArray = this.polyPoints.trim().split(' ');
    polyPointsArray[lastIndex] = x + ',' + y;
    this.polyPoints = polyPointsArray.join(' ');
    this.line
      .attr('points', this.polyPoints);
    this.path.attr('d', this._calculatePath());
    this.handlers[lastIndex]
      .attr('cx', x)
      .attr('cy', y);
  },
  show: function() {
    this.line
      .attr('visibility', 'visible');
    this.path
      .attr('visibility', 'visible');
    this.text
      .attr('visibility', 'visible');
  },
  hide: function() {
    this.line
      .attr('visibility', 'hidden');
    this.path
      .attr('visibility', 'hidden');
    this.text
      .attr('visibility', 'hidden');
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    this.g = svg.append('g')
      .attr('id', this.id + '_g');

    this.path = this.g.append('path')
      .attr('id', this.id + '_path')
      .attr('d', this._calculatePath())
      .attr('style', 'stroke: ' + this.lineColor + '; stroke-width: 1px;');

    this.text = this.g.append('text')
      .attr('id', this.id + '_title_text')
      .attr('dy', -10)
      .append('textPath')
      .attr('xlink:href', '#' + this.id + '_path')
      .style('text-anchor', 'middle')
      .attr('startOffset', '50%')
      .text(this.title)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    this.line = this.g.append('polyline')
      .attr('id', this.id)
      .attr('points', this.polyPoints)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;')
      .attr('data-type', 'node-base')
      .attr('marker-end', 'url(#arrow_end)')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('handlersVisible', true)
      .attr('selected', true);

    this.createHandlers();
    this.populateProperties();
  },
  _calculatePath: function() {
    var pointsLength = this.polyPoints.trim().split(' ').length;
    var firstIndex = 0;
    var secondIndex = 1;
    if(pointsLength > 2){
      firstIndex = parseInt(pointsLength/2);
      secondIndex = firstIndex + 1;
    }
    var pointsArray = this.polyPoints.trim().split(' ');
    var firstPoint = pointsArray[firstIndex].split(',');
    var secondPoint = pointsArray[secondIndex].split(',');
    return "M " + firstPoint[0] + " " + firstPoint[1] + " l "
            + (parseInt(secondPoint[0]) - parseInt(firstPoint[0])) + " "
            + (parseInt(secondPoint[1]) - parseInt(firstPoint[1]));
  },
  createHandlers: function() {
    var polyPointsArray = this.polyPoints.trim().split(' ');
    var that = this;
    this.handlers = [];

    var dragHandlers = d3.drag()
      .on('drag', function(e) { dragMoveHandler(e, that, this); })
      .on('end', function(e) { dropHandler(e, that, this); });

    polyPointsArray.forEach(function(item, index){
      var point = item.split(',');
      var pointX = parseInt(point[0]);
      var pointY = parseInt(point[1]);

      var handler = that.g.append('circle')
        .attr('id', that.id + '_' + index + 'N_handler')
        .attr('cx', pointX)
        .attr('cy', pointY)
        .attr('r', 5)
        .attr('style', 'stroke: #00a8ff; fill: #00a8ff;')
        //.attr('line', that.id)
        .call(dragHandlers);
      that.handlers.push(handler);
    });

    var handlerNames = "";
    this.handlers.forEach(function(handler){
      handlerNames += handler.attr('id') + ',';
    });
    handlerNames = handlerNames.substring(0, handlerNames.length-1);
    this.line.attr('handlers', handlerNames);

    function dropHandler(e, lineInstance, that){
      var x = d3.event.x;
      var y = d3.event.y;
      var port = lineInstance.parentElement.getPortXY(x, y);

      if(port === null){
        //if no port found on drop, it means the line needs to be disconnected
        //from existing connected port
        if(lineInstance.lastHandlerMoved === 'START') {
          if(lineInstance.startPort != null) {
            lineInstance.startPort.disconnect();
            lineInstance.startPort = null;
          }
        } else if(lineInstance.lastHandlerMoved === 'END') {
          if(lineInstance.endPort != null) {
            lineInstance.endPort.disconnect();
            lineInstance.endPort = null;
          }
        }
      } else {
        if(lineInstance.lastHandlerMoved === 'START') {
          lineInstance.setStartPoint(port.x + 10, port.y + 5);
          port.connect(lineInstance, PortType.SOURCE);
          lineInstance.startPort = port;
        } else if(lineInstance.lastHandlerMoved === 'END') {
          lineInstance.setEndPoint(port.x, port.y + 5);
          port.connect(lineInstance, PortType.TARGET);
          lineInstance.endPort = port;
        }
        console.log('POLYLINE: Port found with id: ' + port.id);
      }
      lineInstance.populateProperties();
    }

    function dragMoveHandler(e, lineInstance, that){
      var x = d3.event.x;
      var y = d3.event.y;

      d3.select(that).attr('cx', x);
      d3.select(that).attr('cy', y);
      var target = d3.event.sourceEvent.target;

      var handlerString = target.id.replace(lineInstance.id + '_', '');
      var index = handlerString.indexOf('N_handler');
      var pointIndexAsString = handlerString.substr(0, index);
      var pointIndex = parseInt(pointIndexAsString);
      var points = lineInstance.polyPoints;
      points = points.trim();
      var pointsArray = points.split(' ');
      pointsArray[pointIndex] = x + ',' + y;
      var pointString = '';
      for(var i=0; i < pointsArray.length; i++){
        pointString += pointsArray[i] + ' ';
      }
      lineInstance.line.attr('points', pointString);
      lineInstance.polyPoints = pointString;

      lineInstance.path.attr('d', lineInstance._calculatePath());

      if(pointIndex === 0) {
        lineInstance.lastHandlerMoved = 'START';
      } else if(pointIndex === pointsArray.length - 1) {
        lineInstance.lastHandlerMoved = 'END';
      } else {
        lineInstance.lastHandlerMoved = '';
      }
    }

    var line = document.getElementById(this.id);
    line.addEventListener('click', mouseClick);

    function mouseClick(e){
      //Find out the line which has been double clicked and selects the same
      //to the get the ids of the handlers attached to this line
      var lineName = e.target.id;
      var line = d3.select('#' + lineName);

      //Read the line's attribute 'handlersVisible' to find out whether handlers are
      //visible or not
      var handlersVisible = JSON.parse(line.attr('handlersVisible'));
      var handlers = line.attr('handlers');
      var handlersArray = handlers.split(',');

      if(!handlersVisible){
        handlersArray.forEach(function(handlerName){
          var handler = d3.select('#' + handlerName);
          handler.attr('visibility', 'visible');
        });
        line.attr('handlersVisible', true);
        line.attr('selected', true);
        that.handlersVisible = true;
        that.selected = true;

        that.populateProperties();
      }
    }
  },
  disable: function(){
    this.handlers.forEach(function(handler){
      handler.attr('visibility', 'hidden');
    });
    this.line.attr('handlersVisible', false);
    this.line.attr('selected', false);
    this.handlersVisible = false;
    this.selected = false;
  },
  isSelected: function(){
    return this.selected;
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
                      { recid: 3, propName: 'Points', propValue: this.polyPoints,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 4, propName: 'Stroke Color', propValue: this.lineColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 5, propName: 'Stroke Width', propValue: this.lineWidth},
                      { recid: 6, propName: 'Has Arrow', propValue: this.hasArrow,
                        w2ui: { editable: { type: 'combo', items: [ { id: 1, text: 'true' },
                                                                    { id: 2, text: 'false' }
                                                                  ],
                                                                  filter: false }
                              }
                      },
                      { recid: 7, propName: 'Arrow Type', propValue: this.arrowType,
                        w2ui: { editable: { type: 'combo', items: [ { id: 1, text: 'END' },
                                                                    { id: 2, text: 'START' },
                                                                    { id: 3, text: 'BOTH' }
                                                                  ],
                                                                  filter: false }
                              }
                      },
                      { recid: 8, propName: 'Shape Type', propValue: this.shapeType,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 9, propName: 'Tool Name', propValue: this.toolName,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 10, propName: 'Is Selected', propValue: this.selected,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      }
            ]
          }
        },
        { recid: 11, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 12, propName: 'Title', propValue: this.title},
                      { recid: 13, propName: 'Description', propValue: this.description}
            ]
          }
        }
    ]);
    w2ui['properties'].expand(1);
  },
  setProperty: function(propName, propValue){
    if(propName === "Stroke Color"){
      this.lineColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;');
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    } else if(propName === "Arrow Type"){
      this.arrowType = propValue;
      if(propValue === "END"){
        this.line.attr('marker-end', 'url(#arrow_end)');
        this.line.attr('marker-start', '');
      } else if(propValue === "START"){
        this.line.attr('marker-end', '');
        this.line.attr('marker-start', 'url(#arrow_start)');
      } else if(propValue === "BOTH"){
        this.line.attr('marker-end', 'url(#arrow_end)');
        this.line.attr('marker-start', 'url(#arrow_start)');
      }
    } else if(propName === "Has Arrow"){
      this.hasArrow = JSON.parse(propValue);
      if(this.hasArrow){
       if(this.arrowType === "END"){
          this.line.attr('marker-end', 'url(#arrow_end)');
          this.line.attr('marker-start', '');
        } else if(this.arrowType === "START"){
          this.line.attr('marker-end', '');
          this.line.attr('marker-start', 'url(#arrow_start)');
        } else if(this.arrowType === "BOTH"){
          this.line.attr('marker-end', 'url(#arrow_end)');
          this.line.attr('marker-start', 'url(#arrow_start)');
        }
      } else {
        this.line.attr('marker-end', '');
        this.line.attr('marker-start', '');
      }
    }
  },
  destroy: function() {
    if(this.startPort != null) {
      this.startPort.disconnect();
    }
    if(this.endPort != null) {
      this.endPort.disconnect();
    }
  },
  renderToolItem() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_POLYLINE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_POLYLINE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <polyline points='5,10 0,30 25,10 28,30' style='stroke: black; stroke-width: 2px; fill:none' transform='rotate(180 18 18)'></polyline>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">POLYLINE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

/**
 * BezireCurve: Defines an edge that will be used to connect two nodes with
 * each other. A Bezire curve can have direction and will be denoted by an arrow
 * on one or both end of the line
 */
var BezireCurve = Class.create({
  id: "",
  title: "",
  description: "",
  curvePoints: '[{x: 100, y: 350}, {x: 150, y: -300}, {x: 300, y: 0}]', //instances of the Point class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  shapeType: ShapeType.BEZIRE_CURVE,
  toolName: 'BEZIRE_CURVE',
  controlPoint: undefined,
  handlersVisible: true,
  selected: true,
  hasArrow: true,
  arrowType: 'END',
  startPort: null,
  endPort: null,
  lastHandlerMoved: '',
  initialize: function(id, parentElement, curvePoints, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.curvePoints = curvePoints || '[{x: 100, y: 350}, {x: 150, y: -300}, {x: 300, y: 0}]';
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.BEZIRE_CURVE;
    this.toolName = 'BEZIRE_CURVE';
    this.controlPoint = undefined;
    this.handlersVisible = true;
    this.selected = true;
    this.hasArrow = true;
    this.arrowType = 'END';
    this.startPort = null;
    this.endPort = null;
    this.lastHandlerMoved = '';
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  setStartPoint: function(x, y) {
    this.curvePoints[0].x = x;
    this.curvePoints[0].y = y;
    this.line
      .attr('d', this.curveFunc(this.curvePoints))
    this.startHandler
      .attr('cx', x)
      .attr('cy', y);
  },
  setEndPoint: function(x, y) {
    this.curvePoints[2].x = x;
    this.curvePoints[2].y = y;
    this.line
      .attr('d', this.curveFunc(this.curvePoints))
    this.endHandler
      .attr('cx', x)
      .attr('cy', y);
  },
  show: function() {
    this.line
      .attr('visibility', 'visible');
    this.text
      .attr('visibility', 'visible');
  },
  hide: function() {
    this.line
      .attr('visibility', 'hidden');
    this.text
      .attr('visibility', 'hidden');
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);
    // prepare a helper function
    this.curveFunc = d3.line()
      .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
      .x(function(d) { return d.x })
      .y(function(d) { return d.y });

      this.g = svg.append('g')
        .attr('id', this.id + '_g');

      this.line = this.g.append('path')
      .attr('id', this.id)
      .attr('d', this.curveFunc(this.curvePoints))
      .attr('stroke', this.lineColor)
      .attr('stroke-width', this.lineWidth)
      .attr('fill', 'none')
      .attr('data-type', 'node-base-inner')
      .attr('marker-end', 'url(#arrow_end)')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('handlersVisible', true)
      .attr('selected', true)
      .attr('controlPoint', this.id + '_control_point')
      .attr('startHandler', this.id + '_start_handler')
      .attr('endHandler', this.id + '_end_handler');

      this.text = this.g.append('text')
      .attr('id', this.id + '_title_text')
      .attr('dy', -10)
      .append('textPath')
      .attr('xlink:href', '#' + this.id)
      .style('text-anchor', 'middle')
      .attr('startOffset', '50%')
      .text(this.title)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    this.createHandlers();
    this.populateProperties();
  },
  createHandlers: function() {

    var that = this;

    var dragHandlers = d3.drag()
      .on('drag', function(e) { dragMoveHandler(e, that, this); })
      .on('end', function(e) { dropHandler(e, that, this); });

    this.controlPoint = this.g.append('circle')
      .attr('id', this.id + '_control_point')
      .attr('cx', this.curvePoints[1].x)
      .attr('cy', this.curvePoints[1].y)
      .attr('r', '5')
      .attr('style', 'stroke: #DAA520; fill: #DAA520; stroke-width: 2px;')
      .attr('class', 'drag-svg')
      .attr('line', this.id)
      .call(dragHandlers);

    this.startHandler = this.g.append('circle')
      .attr('id', this.id + '_start_handler')
      .attr('cx', this.curvePoints[0].x)
      .attr('cy', this.curvePoints[0].y)
      .attr('r', '5')
      .attr('style', 'stroke: #00a8ff; fill: #00a8ff;')
      .attr('class', 'drag-svg')
      .attr('line', this.id)
      .call(dragHandlers);

    this.endHandler = this.g.append('circle')
      .attr('id', this.id + '_end_handler')
      .attr('cx', this.curvePoints[2].x)
      .attr('cy', this.curvePoints[2].y)
      .attr('r', '5')
      .attr('style', 'stroke: #00a8ff; fill: #00a8ff;')
      .attr('class', 'drag-svg')
      .attr('line', this.id)
      .call(dragHandlers);

    function dropHandler(e, lineInstance, that){
      var x = d3.event.x;
      var y = d3.event.y;
      var port = lineInstance.parentElement.getPortXY(x, y);

      if(port === null){
        //if no port found on drop, it means the line needs to be disconnected
        //from existing connected port
        if(lineInstance.lastHandlerMoved === 'START') {
          if(lineInstance.startPort != null) {
            lineInstance.startPort.disconnect();
            lineInstance.startPort = null;
          }
        } else if(lineInstance.lastHandlerMoved === 'END') {
          if(lineInstance.endPort != null) {
            lineInstance.endPort.disconnect();
            lineInstance.endPort = null;
          }
        }
      } else {
        if(lineInstance.lastHandlerMoved === 'START') {
          lineInstance.setStartPoint(port.x + 10, port.y + 5);
          port.connect(lineInstance, PortType.SOURCE);
          lineInstance.startPort = port;
        } else if(lineInstance.lastHandlerMoved === 'END') {
          lineInstance.setEndPoint(port.x, port.y + 5);
          port.connect(lineInstance, PortType.TARGET);
          lineInstance.endPort = port;
        }
        console.log('BEZIRE: Port found with id: ' + port.id);
      }
      lineInstance.populateProperties();
    }

    function dragMoveHandler(e, lineInstance, that){
      var x = d3.event.x;
      var y = d3.event.y;
      //d3.select(this).attr('transform', 'translate(' + x + ',' + y + ')');
      d3.select(that).attr('cx', x);
      d3.select(that).attr('cy', y);
      var target = d3.event.sourceEvent.target;

      var index = -1;
      if(target.id.endsWith('start_handler')){
        index = 0;
        lineInstance.lastHandlerMoved = 'START';
      } else if (target.id.endsWith('end_handler')){
        index = 2;
        lineInstance.lastHandlerMoved = 'END';
      } else if (target.id.endsWith('control_point')){
        index = 1;
        lineInstance.lastHandlerMoved = '';
      }

      var curvePoints = lineInstance.curvePoints;
      if(curvePoints !== undefined && curvePoints !== null && index !== -1){
        curvePoints[index].x = x;
        curvePoints[index].y = y;
        lineInstance.line.attr('d', lineInstance.curveFunc(curvePoints));
        lineInstance.curvePoints = curvePoints;
      }
    }

    var line = document.getElementById(this.id);
    line.addEventListener('click', mouseClick);

    function mouseClick(e){
      //Find out the line which has been double clicked and selects the same
      //to the get the ids of the handlers attached to this line
      var lineName = e.target.id;
      var line = d3.select('#' + lineName);

      //Read the line's attribute 'handlersVisible' to find out whether handlers are
      //visible or not
      var handlersVisible = JSON.parse(line.attr('handlersVisible'));
      //Get all the handlers for this curve
      var startHandlerName = line.attr('startHandler');
      var startHandler = d3.select('#' + startHandlerName);
      var endHandlerName = line.attr('endHandler');
      var endHandler = d3.select('#' + endHandlerName);
      var controlPointName = line.attr('controlPoint');
      var controlPoint = d3.select('#' + controlPointName);

      if(!handlersVisible){
        startHandler.attr('visibility', 'visible');
        endHandler.attr('visibility', 'visible');
        controlPoint.attr('visibility', 'visible');
        line.attr('handlersVisible', true);
        line.attr('selected', true);
        that.handlersVisible = true;
        that.selected = true;

        that.populateProperties();
      }
    }
  },
  disable: function(){
    this.controlPoint.attr('visibility', 'hidden');
    this.startHandler.attr('visibility', 'hidden');
    this.endHandler.attr('visibility', 'hidden');
    this.line.attr('handlersVisible', false);
    this.line.attr('selected', false);
    this.handlersVisible = false;
    this.selected = false;
  },
  isSelected: function(){
    return this.selected;
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
                      { recid: 3, propName: 'Points', propValue: JSON.stringify(this.curvePoints),
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 4, propName: 'Stroke Color', propValue: this.lineColor,
                        w2ui: { editable: { type: 'color'} }
                      },
                      { recid: 5, propName: 'Stroke Width', propValue: this.lineWidth},
                      { recid: 6, propName: 'Has Arrow', propValue: this.hasArrow,
                        w2ui: { editable: { type: 'combo', items: [ { id: 1, text: 'true' },
                                                                    { id: 2, text: 'false' }
                                                                  ],
                                                                  filter: false }
                              }
                      },
                      { recid: 7, propName: 'Arrow Type', propValue: this.arrowType,
                        w2ui: { editable: { type: 'combo', items: [ { id: 1, text: 'END' },
                                                                    { id: 2, text: 'START' },
                                                                    { id: 3, text: 'BOTH' }
                                                                  ],
                                                                  filter: false }
                              }
                      },
                      { recid: 8, propName: 'Shape Type', propValue: this.shapeType,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 9, propName: 'Tool Name', propValue: this.toolName,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 10, propName: 'Is Selected', propValue: this.selected,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      }
            ]
          }
        },
        { recid: 11, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 12, propName: 'Title', propValue: this.title},
                      { recid: 13, propName: 'Description', propValue: this.description}
            ]
          }
        }
    ]);
    w2ui['properties'].expand(1);
  },
  setProperty: function(propName, propValue){
    if(propName === "Stroke Color"){
      this.lineColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    } else if(propName === "Arrow Type"){
      this.arrowType = propValue;
      if(propValue === "END"){
        this.line.attr('marker-end', 'url(#arrow_end)');
        this.line.attr('marker-start', '');
      } else if(propValue === "START"){
        this.line.attr('marker-end', '');
        this.line.attr('marker-start', 'url(#arrow_start)');
      } else if(propValue === "BOTH"){
        this.line.attr('marker-end', 'url(#arrow_end)');
        this.line.attr('marker-start', 'url(#arrow_start)');
      }
    } else if(propName === "Has Arrow"){
      this.hasArrow = JSON.parse(propValue);
      if(this.hasArrow){
       if(this.arrowType === "END"){
          this.line.attr('marker-end', 'url(#arrow_end)');
          this.line.attr('marker-start', '');
        } else if(this.arrowType === "START"){
          this.line.attr('marker-end', '');
          this.line.attr('marker-start', 'url(#arrow_start)');
        } else if(this.arrowType === "BOTH"){
          this.line.attr('marker-end', 'url(#arrow_end)');
          this.line.attr('marker-start', 'url(#arrow_start)');
        }
      } else {
        this.line.attr('marker-end', '');
        this.line.attr('marker-start', '');
      }
    }
  },
  destroy: function() {
    if(this.startPort != null) {
      this.startPort.disconnect();
    }
    if(this.endPort != null) {
      this.endPort.disconnect();
    }
  },
  renderToolItem() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_BEZIRE_CURVE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_BEZIRE_CURVE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d='M 5 10 q 0 30 25 10' style='stroke: black; stroke-width: 2px; fill:none' transform='rotate(180 18 18)'></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">BEZIRE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

/**
 * Port: Defines a port for a given node where an connector (Edge) can be pluged in
 * @constructor
 */
const Port = Class.create({
  id: '',
  parentElement: undefined,
  value: '',
  connector: null,
  x: 0,
  y: 0,
  height: 10,
  width: 10,
  position: 'RIGHT',
  fillColor: 'lightblue',
  shapeType: ShapeType.PORT,
  selected: false,
  portType: undefined,
  showPortLabel: true,
  initialize: function(id, parentElement, x, y, position, showPortLabel, value, connector, height, width) {
    this.id = id;
    this.parentElement = parentElement;
    this.x = x;
    this.y = y;
    this.position = position || 'RIGHT';
    this.showPortLabel = (showPortLabel === null || showPortLabel === undefined) ? true : false;
    this.value = value;
    this.connector = connector || null;
    this.height = height || 10;
    this.width = width || 10;
    this.fillColor = 'lightblue';
    this.shapeType = ShapeType.PORT;
    this.selected = false;
    this.portType = undefined;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  isSelected: function() {
    return this.selected;
  },
  connect: function(connector, portType) {
    this.connector = connector;
    this.portType = portType;
    this.fillColor = 'green';
    this.line.attr('style', 'stroke: black; stroke-width: 1px; fill: ' + this.fillColor + ';');
  },
  disconnect: function() {
    this.connector = null;
    this.portType = undefined;
    this.fillColor = 'lightblue';
    this.line.attr('style', 'stroke: black; stroke-width: 1px; fill: ' + this.fillColor + ';');
  },
  moveTo: function(x, y) {
    this.x = x;
    this.y = y;

    this.line
      .attr('x', this.x)
      .attr('y', this.y);

    if(this.position === 'RIGHT'){
      this.text
        .attr('x', this.x - 10)
        .attr('y', this.y + (this.height/2) + 5);
    } else if(this.position === 'LEFT') {
      this.text
        .attr('x', this.x + 15)
        .attr('y', this.y + (this.height/2) + 5);
    } else if(this.position === 'TOP') {
      this.text
        .attr('x', this.x + 5)
        .attr('y', this.y + 20);
    } else if(this.position === 'BOTTOM') {
      this.text
        .attr('x', this.x + 5)
        .attr('y', this.y - 5);
    }

    if(this.connector != null){
      if(this.portType === PortType.SOURCE){
        this.connector.setStartPoint(this.x + 5, this.y + 5);
      } else if(this.portType === PortType.TARGET){
        this.connector.setEndPoint(this.x + 5, this.y + 5);
      }
    }
  },
  hide: function() {
    this.line.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    if(this.connector != null) {
      this.connector.hide();
    }
  },
  show: function() {
    this.line.attr('visibility', 'visible');
    if(this.showPortLabel){
      this.text.attr('visibility', 'visible');
    }
    if(this.connector != null) {
      this.connector.show();
    }
  },
  showLabel: function() {
    this.showPortLabel = true;
    this.text.attr('visibility', 'visible');
  },
  hideLabel: function() {
    this.showPortLabel = false;
    this.text.attr('visibility', 'hidden');
  },
  render: function() {
    this.makeElement();
  },
  makeElement: function() {
    var svg_id = '#' + this.parentElement.parentElement.id + '_svg';
    var svg = d3.select(svg_id);

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.x)
      .attr('y', this.y)
      .attr('height', this.height)
      .attr('width', this.width)
      .attr('style', 'stroke: black; stroke-width: 1px; fill: ' + this.fillColor + ';')
      .attr('data-type', 'node-base')
      .attr('parentElement', this.parentElement.id)
      .attr('shapeType', this.shapeType)
      .attr('selected', this.selected);

    if(this.position === 'RIGHT'){
      this.text = svg.append('text')
        .attr('id', this.id + '_text')
        .text(this.id)
        .attr('x', this.x - 10)
        .attr('y', this.y + (this.height/2) + 5)
        .attr('text-anchor', 'end')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '.7em');
    } else if(this.position === 'LEFT') {
      this.text = svg.append('text')
        .attr('id', this.id + '_text')
        .text(this.id)
        .attr('x', this.x + 15)
        .attr('y', this.y + (this.height/2) + 5)
        .attr('text-anchor', 'start')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '.7em');
    } else if(this.position === 'TOP') {
      this.text = svg.append('text')
        .attr('id', this.id + '_text')
        .text(this.id)
        .attr('x', this.x + 5)
        .attr('y', this.y + 20)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '.7em');
    } else if(this.position === 'BOTTOM') {
      this.text = svg.append('text')
        .attr('id', this.id + '_text')
        .text(this.id)
        .attr('x', this.x + 5)
        .attr('y', this.y - 5)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '.7em');
    }

    if(this.showPortLabel) {
      this.text.attr('visibility', 'visible');
    } else {
      this.text.attr('visibility', 'hidden');
    }

    this.createHandler();
  },
  createHandler: function() {

    var that = this;
    var svg_id = '#' + this.parentElement.parentElement.id + '_svg';
    var svg = d3.select(svg_id);

    var dragHandlers = d3.drag()
      .on('start', startHandler)
      .on('drag', dragMoveHandler)
      .on('end', dropHandler);

    function startHandler(e) {
      if(that.connector === null){
        that.tempElement = svg.append('line')
          .attr('id', 'temp_line')
          .attr('x1', that.x + (that.width/2))
          .attr('y1', that.y + (that.height/2))
          .attr('x2', that.x + 5)
          .attr('y2', that.y)
          .attr('style', 'stroke:green;stroke-width:2px;stroke-dasharray:2');
      }
    }

    function dragMoveHandler(e) {
      if(that.connector === null) {
        var x = d3.event.x;
        var y = d3.event.y;

        that.tempElement
          .attr('x2', x)
          .attr('y2', y);
      }
    }

    function dropHandler(e) {
      if(that.connector === null) {
        that.tempElement.remove();
        var port_id = d3.event.sourceEvent.target.id;
        var port = that.parentElement.parentElement.getPort(port_id);
        if(port != null){
          if(port.parentElement === that.parentElement){
            console.log("Cannot connect. Target Port & Source Port belongs to the same parent node");
          } else {
            console.log('Port found with id: ' + port_id);
            var name = prompt("Element Name:");
            var line = new Line(name, that.parentElement.parentElement, that, port);
            that.parentElement.parentElement.addEdge(line);
            that.connect(line, PortType.SOURCE);
            port.connect(line, PortType.TARGET);
          }
        } else {
          console.log('Port NOT found');
        }
      }
    }

    this.line.call(dragHandlers);

    var line = document.getElementById(this.id);
    line.addEventListener('click', mouseClick);

    function mouseClick(event) {
      that.selected = true;
      that.line.attr('selected', true);
      that.populateProperties();
    }

    line.addEventListener('mouseover', mouseOver);

    function mouseOver(event) {
      if(that.connector === null){
        that.line
        .attr('style', 'stroke: black; stroke-width: 1px; fill: #E06666;');
      }
    }

    line.addEventListener('mouseleave', mouseLeave);

    function mouseLeave(event) {
      that.line
      .attr('style', 'stroke: black; stroke-width: 1px; fill: ' + that.fillColor + ';');
    }
  },
  disable: function(){
    this.line.attr('selected', false);
    this.selected = false;
  },
  populateProperties: function() {
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
                      { recid: 3, propName: 'Shape Type', propValue: this.shapeType,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 4, propName: 'Is Selected', propValue: this.selected,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      }
                      ]
          }
        },
        {
          recid: 5, propName: 'Details',
          w2ui: {
            children: [
              { recid: 6, propName: 'Value', propValue: this.value}
            ]
          }
        }
    ]);
    w2ui['properties'].expand(1);
  },
  setProperty: function(propName, propValue) {
    this.value = propValue;
  },
  destroy: function() {
    var text = document.getElementById(this.id + '_text');
    text.parentNode.removeChild(text);
  }
});

/**
 * BasicNode: Defines a node which has two ports by default - input and output ports
 * @constructor
 */
const BasicNode = Class.create(Rectangle, {
  INPUT: 0,
  OUTPUT: 1,
  shapeType: ShapeType.NODE,
  toolName: 'NODE',
  initialize: function($super, id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, description) {
    $super(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, description);
    this.shapeType = ShapeType.NODE;
    this.toolName = 'NODE';
    this.ports[this.INPUT] = new Port(this.id + '_input', this, this.rectDimension.left - 5, (this.rectDimension.top + (this.rectDimension.height / 2)), 'LEFT');
    this.ports[this.OUTPUT] = new Port(this.id + '_output', this, (this.rectDimension.left + this.rectDimension.width) - 5, (this.rectDimension.top + (this.rectDimension.height / 2)), 'RIGHT');
  },
  render: function($super) {
    var svg_id = '#' + this.parentElement.id + '_svg';
    var svg = d3.select(svg_id);

    this.innerRect = svg.append('rect')
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('width', this.rectDimension.width)
      .attr('height', this.rectDimension.height/2)
      .attr('style', 'stroke-width: 2px; stroke: black; fill: violet; fill-opacity: 0.5');

    // this.border = svg.append('rect')
    //   .attr('x', this.rectDimension.left)
    //   .attr('y', this.rectDimension.top)
    //   .attr('width', this.rectDimension.width)
    //   .attr('height', this.rectDimension.height)
    //   .attr('style', 'stroke-width: ' + this.lineWidth + 'px; stroke: ' + this.lineColor + '; fill: none');

    $super();
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.addPort(port);
    });

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/4));
  },
  setProperty: function($super, propName, propValue){
    $super(propName, propValue);

    // this.border
    //   .attr('style', 'stroke-width: ' + this.lineWidth + 'px; stroke: ' + this.lineColor + '; fill: none');

  },
  setSize: function($super, dx, dy){
    $super(dx, dy);
    this.ports[this.INPUT].moveTo(this.rectDimension.left - 5, (this.rectDimension.top + (this.rectDimension.height / 2)));
    this.ports[this.OUTPUT].moveTo((this.rectDimension.left + this.rectDimension.width) - 5, (this.rectDimension.top + (this.rectDimension.height / 2)));

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/4));

    this.innerRect
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('width', this.rectDimension.width)
      .attr('height', this.rectDimension.height/2);

    // this.border
    //   .attr('x', this.rectDimension.left)
    //   .attr('y', this.rectDimension.top)
    //   .attr('width', this.rectDimension.width)
    //   .attr('height', this.rectDimension.height);
  },
  setCoordinates: function($super, dx, dy){
    $super(dx, dy);
    this.ports[this.INPUT].moveTo(this.rectDimension.left - 5, (this.rectDimension.top + (this.rectDimension.height / 2)));
    this.ports[this.OUTPUT].moveTo((this.rectDimension.left + this.rectDimension.width) - 5, (this.rectDimension.top + (this.rectDimension.height / 2)));

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/4));

    this.innerRect
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('width', this.rectDimension.width)
      .attr('height', this.rectDimension.height/2);

    // this.border
    //   .attr('x', this.rectDimension.left)
    //   .attr('y', this.rectDimension.top)
    //   .attr('width', this.rectDimension.width)
    //   .attr('height', this.rectDimension.height);
  },
  onMove: function($super, dx, dy){
    $super(dx, dy);
    this.ports.forEach(function(port){
      port.hide();
    });
    this.innerRect.attr('visibility', 'hidden');
    // this.border.attr('visibility', 'hidden');
  },
  onResize: function($super, dx, dy, obj){
    $super(dx, dy, obj);
    this.ports.forEach(function(port){
      port.hide();
    });
    this.innerRect.attr('visibility', 'hidden');
    // this.border.attr('visibility', 'hidden');
  },
  onRotate: function($super, obj){
    $super(obj);
  },
  onDrop: function($super, obj){
    $super(obj);
    this.ports.forEach(function(port){
      port.show();
    });
    this.innerRect.attr('visibility', 'visible');
    // this.border.attr('visibility', 'visible');
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_NODE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_NODE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='10' y='10' height='17' width='30' style='stroke: black; stroke-width: 2px; fill:none'></rect>
                      <rect x='10' y='10' height='8.5' width='30' style='stroke: black; stroke-width: 2px; fill: violet; fill-opacity: 0.8'></rect>
                      <rect x='8' y='16.5' height='4' width='4' style='stroke: black; stroke-width: 1px; fill:white'></rect>
                      <rect x='38' y='16.5' height='4' width='4' style='stroke: black; stroke-width: 1px; fill:white'></rect>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">NODE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
  destroy: function() {
    //remove ports
    if(this.ports.length > 0){
      for(var i=0; i < this.ports.length; i++){
        this.parentElement.removePort(this.ports[i]);
      }
    }
    this.text.remove();
    this.innerRect.remove();
  }
});

/**
 * FlowChartTerminator: An terminator node in an flowchart representing the start
 * or stop end of the flow
 * @constructor
 */
var FlowChartTerminator = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  fillColor: 'lightblue',
  shapeType: ShapeType.CUSTOM,
  toolName: 'FLOW_CHART_TERMINATOR',
  selected: true,
  opacity: 1,
  classType: FlowChartTerminator,
  TOP: 0,
  BOTTOM: 1,
  showPortsLabel: false,
  initialize: function(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.fillColor = fillColor || "lightblue";
    this.shapeType = ShapeType.CUSTOM;
    this.toolName = 'FLOW_CHART_TERMINATOR';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartTerminator;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
    this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
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

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('rx', this.rectDimension.height/2)
      .attr('ry', this.rectDimension.height/2)
      .attr('height', this.rectDimension.height)
      .attr('width', this.rectDimension.width)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.addPort(port);
    });

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.rectDimension.width = parseInt(this.line.attr('width'));
    this.rectDimension.height = parseInt(this.line.attr('height'));
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));
    this.line
      .attr('rx', this.rectDimension.height/2)
      .attr('ry', this.rectDimension.height/2);
    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
  },
  setCoordinates: function(dx, dy){
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));
    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);
    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.text.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      { recid: 16, propName: 'Title', propValue: this.title},
                      { recid: 17, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_TERMINATOR_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_TERMINATOR_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='10' y='10' height='18' width='30' rx='10' ry='10'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></rect>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">TERMINATOR</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartProcess: An process node in a flowchart
 * @constructor
 */
var FlowChartProcess = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  fillColor: 'lightblue',
  shapeType: ShapeType.CUSTOM,
  toolName: 'FLOW_CHART_PROCESS',
  selected: true,
  opacity: 1,
  classType: FlowChartProcess,
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
  showPortsLabel: false,
  initialize: function(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.fillColor = fillColor || "lightblue";
    this.shapeType = ShapeType.CUSTOM;
    this.toolName = 'FLOW_CHART_PROCESS';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartProcess;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
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

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('height', this.rectDimension.height)
      .attr('width', this.rectDimension.width)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.addPort(port);
    });

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.rectDimension.width = parseInt(this.line.attr('width'));
    this.rectDimension.height = parseInt(this.line.attr('height'));
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));
    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);
    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.text.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      { recid: 16, propName: 'Title', propValue: this.title},
                      { recid: 17, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_PROCESS_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_PROCESS_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='10' y='10' height='18' width='30'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></rect>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">PROCESS</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartDecision: An decision node in a flowchart
 * @constructor
 */
var FlowChartDecision = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  fillColor: 'lightblue',
  shapeType: ShapeType.CUSTOM,
  toolName: 'FLOW_CHART_DECISION',
  selected: true,
  opacity: 1,
  classType: FlowChartDecision,
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
  showPortsLabel: false,
  initialize: function(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.fillColor = fillColor || "lightblue";
    this.shapeType = ShapeType.CUSTOM;
    this.toolName = 'FLOW_CHART_DECISION';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartDecision;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
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

    var path = 'M ' + (this.rectDimension.left) + ' ' //left corner X
                + (this.rectDimension.top + this.rectDimension.height/2) + ' ' //left corner Y
                + (this.rectDimension.left + this.rectDimension.width/2) + ' ' //top corner X
                + (this.rectDimension.top) + ' ' //top corner Y
                + (this.rectDimension.left + this.rectDimension.width) + ' ' //right corner X
                + (this.rectDimension.top + this.rectDimension.height/2) + ' ' //right corner Y
                + (this.rectDimension.left + this.rectDimension.width/2) + ' ' //bottom corner X
                + (this.rectDimension.top + this.rectDimension.height) + ' ' //bottom corner Y
                + (this.rectDimension.left) + ' ' //left corner X
                + (this.rectDimension.top + this.rectDimension.height/2); //left corner Y

    this.line = svg.append('path')
      .attr('id', this.id)
      .attr('d', path)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.addPort(port);
    });

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.width = parseInt(bBox.width);
    this.rectDimension.height = parseInt(bBox.height);
    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);
    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);
    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.text.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      { recid: 16, propName: 'Title', propValue: this.title},
                      { recid: 17, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_DECISION_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_DECISION_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 19 25 10 40 19 25 28 10 19 25 10'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">DECISION</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartDocument: An document node in a flowchart
 * @constructor
 */
var FlowChartDocument = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  fillColor: 'lightblue',
  shapeType: ShapeType.CUSTOM,
  toolName: 'FLOW_CHART_DOCUMENT',
  selected: true,
  opacity: 1,
  classType: FlowChartDocument,
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
  showPortsLabel: false,
  initialize: function(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.fillColor = fillColor || "lightblue";
    this.shapeType = ShapeType.CUSTOM;
    this.toolName = 'FLOW_CHART_DOCUMENT';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartDocument;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
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

    var path = 'M ' + (this.rectDimension.left) + ' ' //left corner X
    + (this.rectDimension.top + this.rectDimension.height - 15) + ' ' //left corner Y
    + 'C ' + (this.rectDimension.left + (this.rectDimension.width/4)) + ' ' //1st curve point X
    + (this.rectDimension.top + this.rectDimension.height) + ' ' //1st curve point Y
    + (this.rectDimension.left + (this.rectDimension.width * 3/4)) + ' ' //2nd curve point X
    + (this.rectDimension.top + this.rectDimension.height - 30) + ' ' //2nd curve point Y
    + (this.rectDimension.left + this.rectDimension.width) + ' ' //end curve point X
    + (this.rectDimension.top + this.rectDimension.height - 15) + ' ' //end curve point Y
    + 'V ' + (this.rectDimension.top) + ' ' //vertical line to top
    + 'H ' + (this.rectDimension.left) + ' ' //horizontal line to left
    + 'Z'; //close the shape

    this.line = svg.append('path')
      .attr('id', this.id)
      .attr('d', path)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.addPort(port);
    });

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.width = parseInt(bBox.width);
    this.rectDimension.height = parseInt(bBox.height);
    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);
    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);
    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.text.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
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
                      { recid: 16, propName: 'Title', propValue: this.title},
                      { recid: 17, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_DOCUMENT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_DOCUMENT_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 24 C 17.5 29 32.5 19 40 24 V 10 H 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.5em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">DOCUMENT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartSubroutine: An subroutine or predefined process node in a flowchart
 * @constructor
 */
var FlowChartSubroutine = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "2",
  lineStroke: "Solid",
  fillColor: 'lightblue',
  shapeType: ShapeType.CUSTOM,
  toolName: 'FLOW_CHART_SUBROUTINE',
  selected: true,
  opacity: 1,
  classType: FlowChartSubroutine,
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
  showPortsLabel: false,
  initialize: function(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, fillColor, opacity, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "2";
    this.lineStroke = lineStroke || "Solid";
    this.fillColor = fillColor || "lightblue";
    this.shapeType = ShapeType.CUSTOM;
    this.toolName = 'FLOW_CHART_SUBROUTINE';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartSubroutine;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
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

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('height', this.rectDimension.height)
      .attr('width', this.rectDimension.width)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.vLine1 = svg.append('line')
      .attr('id', this.id + '_vline1')
      .attr('x1', this.rectDimension.left + 30)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + 30)
      .attr('y2', this.rectDimension.top + this.rectDimension.height)
      .attr('style', 'stroke: black; stroke-width: 3px');

    this.vLine2 = svg.append('line')
      .attr('id', this.id + '_vline2')
      .attr('x1', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y2', this.rectDimension.top + this.rectDimension.height)
      .attr('style', 'stroke: black; stroke-width: 3px');

    this.text = svg.append('text')
      .text(this.title)
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '.7em');

    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.addPort(port);
    });

    this.populateProperties();
  },
  isSelected: function(){
    return JSON.parse(this.line.attr('selected'));
  },
  setSize: function(dx, dy){
    this.rectDimension.width = parseInt(this.line.attr('width'));
    this.rectDimension.height = parseInt(this.line.attr('height'));
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.vLine1
      .attr('x1', this.rectDimension.left + 30)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + 30)
      .attr('y2', this.rectDimension.top + this.rectDimension.height);

    this.vLine2
      .attr('x1', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y2', this.rectDimension.top + this.rectDimension.height);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    this.rectDimension.left = parseInt(this.line.attr('x'));
    this.rectDimension.top = parseInt(this.line.attr('y'));

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.vLine1
      .attr('x1', this.rectDimension.left + 30)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + 30)
      .attr('y2', this.rectDimension.top + this.rectDimension.height);

    this.vLine2
      .attr('x1', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y2', this.rectDimension.top + this.rectDimension.height);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
    this.vLine1.attr('visibility', 'hidden');
    this.vLine2.attr('visibility', 'hidden');
  },
  onResize: function(dx, dy, obj){
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
    this.vLine1.attr('visibility', 'hidden');
    this.vLine2.attr('visibility', 'hidden');
  },
  onRotate: function(obj){
    this.text.attr('visibility', 'hidden');
    this.vLine1.attr('visibility', 'hidden');
    this.vLine2.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
    this.ports.forEach(function(port){
      port.show();
    });
    this.vLine1.attr('visibility', 'visible');
    this.vLine2.attr('visibility', 'visible');
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
                      { recid: 16, propName: 'Title', propValue: this.title},
                      { recid: 17, propName: 'Description', propValue: this.description}
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
    } else if(propName === "Title"){
      this.title = propValue;
      this.text.text(this.title);
    } else if(propName === "Description"){
      this.description = propValue;
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.vLine1.remove();
    this.vLine2.remove();
    this.text.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_SUBROUTINE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_SUBROUTINE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='10' y='10' height='18' width='30'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></rect>
                      <line x1='15' y1='10' x2='15' y2='28'
                        style='stroke: black; stroke-width: 2px'></line>
                      <line x1='35' y1='10' x2='35' y2='28'
                        style='stroke: black; stroke-width: 2px'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">SUBROUTINE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});
