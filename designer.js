/******
 * Module: designer.js
 * Description: Provides api to build interactive visual language editor
 * Author: Ajeet Singh
 * Date: 25-Aug-2019
 * *****/

/*********************************************************
 * A simple string formatter function, example:
 * console.log("Hello, {0}!".format("World"))
 * Source: https://coderwall.com/p/flonoa/simple-string-format-in-javascript
 **********************************************************/
String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

/****************
 * Returns true if obj is plain obj {} or dict
 * ***************/
is_dict = function(obj) {
  if (!obj) return false;
  if (Array.isArray(obj)) return false;
  if (obj.constructor != Object) return false;
  return true;
}

/***********************************************************
 * Point class
 ***********************************************************/
var Point = Class.create({
  x: 0,
  y: 0,
  initialize: function(x, y){
    this.x = x;
    this.y = y;
  },
  add: function(point){
    this.x = this.x + point.x;
    this.y = this.y + point.y;
  },
  substract: function(point){
    this.x = this.x - point.x;
    this.y = this.y - point.y;
  }
});
/***********************************************************
 * RectDimension - Dimension class containing dimension of an rectangle
 ***********************************************************/
 var RectDimension = Class.create({
  top: 0,
  left: 0,
  height: 0,
  width: 0,
  initialize: function(left, top, height, width){
    this.left = left;
    this.top = top;
    this.height = height;
    this.width = width;
  }
 });
 /**********************************************************
  * LineDimension - Dimension class containing dimension for line
  **********************************************************/
  var LineDimension = Class.create({
    start: undefined,
    end: undefined,
    hasArrow: true,
    arrowType: 'standard',
    _direction: '', //BT=>Bottom-Top; TB=>Top-Bottom; LR=>Left-Right; RL=>Right-Left
    initialize: function(start, end, hasArrow, arrowType){
      this.start = start || new Point();
      this.end = end || new Point();
      this.hasArrow = hasArrow;
      this.arrowType = arrowType;
      this._direction = '';
    },
    _calculateDirection: function(){
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
    getDirection: function(){
      return this._calculateDirection();
    }
  });
/***********************************************************
 * Circle dimension
 ***********************************************************/
var CircleDimension = Class.create({
  cx: 0,
  cy: 0,
  r: 0,
  initialize: function(cx, cy, r){
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }
});

/**********************************************************
 * Canvas: class provides the functionality to hold the
 * nodes and edges objects
 ***********************************************************/
var Canvas = Class.create({
  id: '',
  containerId: undefined,
  height: undefined,
  width: undefined,
  css: 'canvas',
  svg: undefined,
  options: undefined,
  nodes: [],
  edges: [],
  grid: [10, 10],
  tools: [],
  observable: undefined,
  menus: [],
  /*
   *  Constructor
   *          id (string):           A unique identifier for the canvas
   *          container_id (string): Id of the parent container, if not
   *                      provided Canvas will be attached to
   *                      body of the page
   *          height (string):    Height of the canvas with unit
   *          width (string):     Width of the canvas with unit
   *          items (Array):      A list of direct child elements
   *          grid (Array):       Size of each cell in the grid (in pixels)
   */
  initialize: function(id, containerId, height, width, nodes, edges, grid) {
    this.id = id;
    this.containerId = containerId;
    this.height = height;
    this.width = width;
    this.css = 'canvas';
    this.svg = undefined;
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.grid = grid || [10, 10];
    this.tools = ['SELECT', 'LINE'];
    this.observable = undefined;
    this.options = {
        container: '#' + id + '_svg',
        restrict: '#' + id + '_svg',
        proportions: true,
        rotationPoint: true,
        //themeColor: 'white',
        each: {
            resize: true,
            // move: true,
            // rotate: true
        },
        snap: {
            x: 20,
            y: 20,
            angle: 25
        },
        cursorMove: 'move',
        cursorRotate: 'crosshair',
        cursorResize: 'pointer'
    };
  },
  /*
   * Method: initEdge
   * Description: Adds edge to canvas before
   * it is rendered. If you wish to add edge after canvas
   * has been rendered, please use add_edge()
   */
  initEdge: function(edge) {
    this.edges.push(edge);
  },
  /*
   * Method: addEdge
   * Description: Adds an edge to canvas after canvas is
   * rendered. This function adds selectable, resizable,
   * etc operations once edge is added
   */
  addEdge: function(edge) {
    this.edges.push(edge);
    edge.render();
  },
  /*
   * Method: removeEdge
   * Description: Removes an edge from the array
   */
  removeEdge: function(edge) {
    var index = this.edges.indexOf(edge);
    this.edges.splice(index, 1);
    var edgeEle = document.getElementById(edge.id);
    edgeEle.parentNode.removeChild(edgeEle);
  },
  /*
   * Method: initNode
   * Description: Adds an node to canvas before
   * it is rendered. If you wish to add node after canvas
   * has been rendered, please use add_node()
   */
  initNode: function(node) {
    this.nodes.push(node);
  },
  /*
   * Method: addNode
   * Description: Adds an node to canvas after canvas is
   * rendered. This function adds selectable, resizable,
   * etc operations once node is added
   */
  addNode: function(node) {
    this.nodes.push(node);
    var addedNode = $j(node.render());
    if (this.containerId != undefined) {
      var container = $j(('#' + this.containerId));
      addedNode.appendTo(container);
    } else {
      addedNode.appendTo($j('body'));
    }
  },
  /*
   * Method: removeNode
   * Description: Removes an node from the array
   */
  removeNode: function(node) {
    var index = this.nodes.indexOf(node);
    this.nodes.splice(index, 1);
    var nodeToRemove = document.getElementById(node.id);
    if (nodeToRemove != undefined) {
      nodeToRemove.parentNode.removeChild(nodeToRemove);
    }
  },
  /*********************************************************
   * Method: addTool
   * Description: adds an tool to the toolbox of the canvas
   *********************************************************/
  addTool: function(tool){
    this.tools.push(tool);
  },
  /*********************************************************
   * Method: removeTool
   * Description: removes an tool from the toolbox of the canvas
   *********************************************************/
  removeTool: function(tool){
    var index = this.tools.indexOf(tool);
    this.tools.splice(index, 1);
    var toolToRemove = document.getElementById(tool.id);
    if(toolToRemove != undefined){
      toolToRemove.parentNode.removeChild(toolToRemove);
    }
  },
  /*
   * Method: render
   * Description: Renders the HTML for Canvas component in parent element
   */
  render: function() {
    /*Renders the canvas along with Nodes and edges*/
    var html = `<table style='height:100%; width: 100%'>
                  <tr>
                    <td style='width: 95%'>`;
                      //An outer div for SVG canvas
                      html +=
                        "<div id='" + this.id + "' style='height: 100%;'";
                        if (this.height != undefined && this.width != undefined) {
                          html += "style='height:" + this.height;
                          html += "; width:" + this.width + ";'  ";
                        } else if (this.height != undefined && this.width === undefined) {
                          html += "style='height:" + this.height + ";' ";
                        } else if (this.height === undefined && this.width != undefined) {
                          html += "style='width:" + this.width + ";' ";
                        }
                        html +=
                        " data-type='canvas'>";
                        html +=
                        "<svg class='" + this.css + `' style='top: 0px; left: 0px;
                                                              height: 100%; width: 100%'
                                                              id='` + this.id + "_svg' ></svg>"
                          /*Iterate through all the child nodes or edges of
                           * canvas and render each of it by concatnating its
                           * HTML to canvas's HTML
                           */
                          for (var i = 0; i < this.nodes.length; i++) {
                            html += this.nodes[i].render();
                          }
                        html +=
                        `</div>
                    </td>
                    <td style='width: 5%;vertical-align:top;'>`;
                    html +=
                      `<table style='width: 50px' class='middle toolbox'>
                        <tr>
                          <th>Toolbox</th>
                        </tr>
                        <tr>
                          <td>`;
                            for(var i=0; i < this.tools.length; i++){
                              if(i === 0){
                                html += this._render_select_tool_item(this.id, this.tools[i], i);
                              } else {
                                html += this._render_select_tool_item(this.id, this.tools[i], i);
                              }
                            }
                            html +=
                          `</td>
                        </tr>
                        <tr>
                          <td style='text-align: center;'>`;
                          html += `X: <span id='x_label'></span>
                                   Y: <span id='y_label'></span>
                          </td>
                        </tr>
                      </table>`;
                    html +=
                    `</td>
                  </tr>
                </table>`;

    if (this.containerId === undefined) {
      this.dom = $j('body').prepend(html);
    } else {
      var container = $j(this.containerId);
      this.dom = $j(html).appendTo($j(container));
    }
    var that = this;
    $j('[name="tools"]').bind('click', function(e){
      var name = e.currentTarget.id;
      for(var i=0; i < that.tools.length; i++){
        if((that.id + "_" + that.tools[i] + "_tool") === name){
          that._changeTool(i);
        }
      }
    });
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].registerPortHighlighters();
    }
    for (var i = 0; i < this.edges.length; i++) {
      this.edges[i].render();
    }
    this._registerActions();
    this._registerMarkers();
  },
  _render_select_tool_item(id, tool, index){
    var html = '';
    html += "<label for='" + id + "_" + tool + "_tool' >";
    html += `<input type='radio' name='tools' id='`
          + id + "_" + tool + "_tool";
      if(index < 1){
        html += "' checked>";
      } else {
        html += "'>";
      }
      html += "</input>";
      html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                    <defs>
                      <marker id="toolArrow" refX="6" refY="6" markerWidth="30" markerHeight="30" markerUnits="userSpaceOnUse" orient="auto">
                          <path d="M 0 0 12 6 0 12 3 6" style="fill: black;"></path>
                      </marker>
                    </defs>
                      <line x1='25' y1='25' x2='35' y2='35' style='stroke: black; stroke-width: 2px;' marker-end= 'url(#toolArrow)' transform='rotate(180 25 25)'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">` + tool + `</text>
                    </svg>
                 </div>`;
      html += "</label>";
      return html;
  },
  _registerActions: function() {
    this.observable = subjx.createObservable();

    this.svg = subjx('.drag-svg')
        .drag(this.options);

    this.svg.forEach(item => {
        subjx(item.controls).on('dblclick', () => {
            item.disable();
        });
    });

    that = this;
    subjx('.drag-svg').on('dblclick', e => {
        if (e.currentTarget.classList.contains('sjx-drag')) return;
        const xDraggable = subjx(e.currentTarget).drag(this.options, this.observable)[0];
        // adding event to controls
        const controls = xDraggable.controls;
        subjx(controls).on('dblclick', () => {
            xDraggable.disable();
        });
    });
  },
  _registerMarkers: function(){

    var svg_id = '#' + this.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    svg.append('svg:defs').append('svg:marker')
      .attr("id", "arrow")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "black");
  },
  _changeTool(index){
    if(index < this.tools.length){
      this.selectedTool = this.tools[index];
    }
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
/**********************************************************************
 * Defined an edge that will be used to connect two or more nodes with
 * each other. An can have direction and will be denoted by an Arrow
 * icon on one end or both end of the edge.
 **********************************************************************/
var Edge = Class.create({
  id: "",
  title: "",
  description: "",
  lineDimension: undefined, //an instance of the LineDimension class
  elementLeft: undefined,
  elementRight: undefined,
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  initialize: function(id, parentElement, elementLeft, elementRight, title, lineColor, lineWidth, lineStroke, hasArrow, arrowType, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.lineDimension = new LineDimension();
    this.lineDimension.hasArrow = hasArrow || true;
    this.lineDimension.arrowType = arrowType || "RIGHT";
    this.elementLeft = elementLeft;
    this.elementRight = elementRight;
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
  },
  render: function() {
    if (!is_dict(this.elementLeft) && !is_dict(this.elementRight)) {
      var node1 = this.parentElement.getNode(this.elementLeft.id);
      var node2 = this.parentElement.getNode(this.elementRight.id);
      var port1 = node1.getNextEmptyPort();
      var port2 = node2.getNextEmptyPort();

      this.lineDimension.start.x = port1.getConnectionPoint().x;
      this.lineDimension.start.y = port1.getConnectionPoint().y;
      this.lineDimension.end.x = port2.getConnectionPoint().x;
      this.lineDimension.end.y = port2.getConnectionPoint().y;
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

    this.line = svg.append('line')
      .attr('id', this.id)
      .attr('x1', this.lineDimension.start.x)
      .attr('y1', this.lineDimension.start.y)
      .attr('x2', this.lineDimension.end.x)
      .attr('y2', this.lineDimension.end.y)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;')
      .attr('marker-end', 'url(#arrow)')
      .attr('data-type', 'edge-base')
      .attr('class', 'drag-svg');
  }
});
