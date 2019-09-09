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
  dom: undefined,
  nodes: [],
  edges: [],
  grid: [10, 10],
  dragItems: {},
  tools: [],
  clickTapPosition: undefined,
  mouseTouchStatus: 'UP',
  selectedTool: undefined,
  selectedItem: undefined,
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
    this.dom = undefined;
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.grid = grid || [10, 10];
    this.dragItems = {};
    this.tools = [{name: 'SELECT', obj: undefined}, {name: 'LINE', obj: Edge}];
    this.clickTapPosition = undefined;
    this.mouseTouchStatus = 'UP';
    this.selectedTool = this.tools[0];
    this.selectedItem = undefined;
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
    var html = "<div id='" + this.id + "' ";
    //html += "class='" + this.css + "' ";
    if (this.height != undefined && this.width != undefined) {
      html += "style='height:" + this.height;
      html += "; width:" + this.width + ";'  ";
    } else if (this.height != undefined && this.width === undefined) {
      html += "style='height:" + this.height + ";' ";
    } else if (this.height === undefined && this.width != undefined) {
      html += "style='width:" + this.width + ";' ";
    }
    html += " data-type='canvas'>";
    for(var i=0; i < this.tools.length; i++){
      html += "<input type='radio' name='tools' id='" + this.id + "_" + this.tools[i].name + "_tool";
      if(i < 1){
        html += "' checked>" + this.tools[i].name;
      } else {
        html += "'>" + this.tools[i].name;
      }
      html += "</input>"
    }
    html += "<svg class='" + this.css + "' style='position:absolute; top: 25px; left: 5px; height: 100%; width: 100%' id='" + this.id + "_svg' ></svg>"
    /*Iterate through all the child nodes or edges of
     * canvas and render each of it by concatnating its
     * HTML to canvas's HTML
     */
    for (var i = 0; i < this.nodes.length; i++) {
      html += this.nodes[i].render();
    }
    html += "</div>";
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
        if((that.id + "_" + that.tools[i].name + "_tool") === name){
          that.selectedTool = that.tools[i];
        }
      }
    });
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].registerPortHighlighters();
    }
    for (var i = 0; i < this.edges.length; i++) {
      this.edges[i].render();
    }
    var svg = document.getElementById(this.id + '_svg');
    this.registerActions();
  },
  registerActions: function() {
    var canvas = document.getElementById(this.id + '_svg');
    var that = this;

    canvas.addEventListener('mousedown', deviceDown);
    canvas.addEventListener('touchstart', deviceDown);
    canvas.addEventListener('mousemove', deviceMove);
    canvas.addEventListener('touchmove', deviceMove)
    canvas.addEventListener('mouseup', deviceUp);
    canvas.addEventListener('touchend', deviceUp);

    function deviceDown(e) {
      e.preventDefault();
      var mouseX, mouseY;
      if (e.targetTouches && e.targetTouches[0]) {
        var pointerEvent = e.targetTouches[0];
        mouseX = pointerEvent.pageX;
        mouseY = pointerEvent.pageY;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
      that.mouseTouchStatus = 'DOWN';
      that.clickTapPosition = new Point(mouseX, mouseY);
      if(that.selectedTool.name === 'SELECT'){
        if(that.selectedItem !== undefined){
          that.selectedItem.mouseDown(that.clickTapPosition, 'MODIFY');
        }
      } else if(that.selectedTool.name === 'LINE'){
        var id = prompt('Item Name: ');
        if(id !== null && id !== ''){
          var line = new that.selectedTool.obj(id, that, {x: that.clickTapPosition.x, y: that.clickTapPosition.y}, {x: that.clickTapPosition.x, y: that.clickTapPosition.y + 100});

          //Create an instance of the selected tool and it to canvas's item collection
          that.addEdge(line);
          //Mark the new item as selected as well visual selected too
          that.selectedItem = line;
          line.select();
          //Change the tool from Line to Select tool
          //that.selectedTool = that.tools[0];
          that._changeTool(0);
          //Restore the mouse status back to UP
          that.mouseTouchStatus = 'UP';
       }
      }
    }

    function deviceMove(e){
      e.preventDefault();
      var mouseX, mouseY, action;
      if (e.targetTouches && e.targetTouches[0]) {
        var pointerEvent = e.targetTouches[0];
        mouseX = pointerEvent.pageX;
        mouseY = pointerEvent.pageY;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
      if(that.selectedTool.name === 'SELECT'){
        action = 'MODIFY';
      } else if(that.selectedTool.name === 'LINE'){
        action = 'NEW'
      }
      if(that.mouseTouchStatus === 'DOWN' || that.mouseTouchStatus === 'DRAG'){
        that.clickTapPosition = new Point(mouseX, mouseY);
        if(that.selectedItem !== undefined){
          that.selectedItem.mouseDrag(that.clickTapPosition, action);
        }
        that.mouseTouchStatus = 'DRAG';
      }
    }

    function deviceUp(e) {
      e.preventDefault();
      var mouseX, mouseY, action;
      if (e.targetTouches && e.targetTouches[0]) {
        var pointerEvent = e.targetTouches[0];
        mouseX = pointerEvent.pageX;
        mouseY = pointerEvent.pageY;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
      if(that.selectedTool.name === 'SELECT'){
        action = 'MODIFY';
      } else if(that.selectedTool.name === 'LINE'){
        action = 'NEW'
      }

      that.clickTapPosition = new Point(mouseX, mouseY);
      if (that.mouseTouchStatus !== 'DOWN') {   //if the last state of mouse/touch was not a down event
        if(that.mouseTouchStatus === 'DRAG'){
          //if the last state of mouse was drag, consider this as mouseup/touchend event
          if(that.selectedItem !== undefined){
            that.selectedItem.mouseUp(that.clickTapPosition, action);
          }
        }
        that.mouseTouchStatus = 'UP';
        return;
      }
      //if the last event was mousedown/touchstart or something else, iterate through all items
      //on canvas and select/unselect the item if it is under mouse position and can be
      //selected/unselected
      that.selectedItem = undefined;
      for (var i = 0; i < that.nodes.length; i++) {
        if (that.nodes[i].isSelectable({
            x: mouseX,
            y: mouseY
          })) {
          that.nodes[i].select();
          that.selectedItem = that.nodes[i];
        } else {
          that.nodes[i].unselect();
        }
      }
      for (var i = 0; i < that.edges.length; i++) {
        if (that.edges[i].isSelectable({
            x: mouseX,
            y: mouseY
          })) {
          that.edges[i].select();
          that.selectedItem = that.edges[i];
        } else {
          that.edges[i].unselect();
        }
      }
      that.mouseTouchStatus = 'UP';
    }
  },
  _changeTool(index){
    if(index < this.tools.length){
      this.selectedTool = this.tools[index];
      var toolName = this.id + "_" + this.tools[index].name + "_tool";
      $j('#' + toolName).prop('checked', true);
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
  rootNode: undefined,
  svg: undefined,
  dom: undefined,
  startAdorner: undefined,
  endAdorner: undefined,
  rotateAdorner: undefined,
  dragHandle: undefined,
  resizeHandle: undefined,
  isSelected: false,
  startPoint: undefined,
  currentPoint: undefined,
  endPoint: undefined,
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
    this.rootNode = undefined;
    this.svg = undefined;
    this.dom = undefined;
    this.startAdorner = undefined;
    this.endAdorner = undefined;
    this.rotateAdorner = undefined;
    this.dragHandle = undefined;
    this.resizeHandle = undefined;
    this.isSelected = false;
    this.startPoint = undefined;
    this.currentPoint = undefined;
    this.endPoint = undefined;
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
    //this.redraw();
    //this.draggable();
    //this.resizable();
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    this.svg = d3.select(svg_id);

    this.svg.append('svg:defs').append('svg:marker')
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

    var direction = this.lineDimension.getDirection();

    var startXOffset = 0;
    var startYOffset = 0;
    var endXOffset = 0;
    var endYOffset = 0;

    if (direction === 'LR' || direction === 'RL') { //X-Axis dominant
      startXOffset = 10;
      startYOffset = 5;
      endXOffset = -5;
      endYOffset = 5;
    } else { //Y-Axis dominant
      startXOffset = 5;
      startYOffset = 10;
      endXOffset = 5;
      endYOffset = -5;
    }

    this.g = this.svg.append('g')
      .attr('id', this.id + '_line_adorner')
      .attr('class', 'ui-selectable')
      .attr('style', '');

    var dragHandleData = [{x: this.lineDimension.start.x-10, y: this.lineDimension.start.y},
                          {x: this.lineDimension.end.x-10, y: this.lineDimension.end.y},
                          {x: this.lineDimension.end.x+10, y: this.lineDimension.end.y},
                          {x: this.lineDimension.start.x+10, y: this.lineDimension.start.y},
                          {x: this.lineDimension.start.x-10, y: this.lineDimension.start.y}];
    if(direction === 'LR' || direction === 'RL'){
      dragHandleData = [{x: this.lineDimension.start.x, y: this.lineDimension.start.y + 10},
                          {x: this.lineDimension.end.x, y: this.lineDimension.end.y + 10},
                          {x: this.lineDimension.end.x, y: this.lineDimension.end.y - 10},
                          {x: this.lineDimension.start.x, y: this.lineDimension.start.y - 10},
                          {x: this.lineDimension.start.x, y: this.lineDimension.start.y + 10}];
    }

    var lineFunction =d3.line()
                            .x(function(d) {return d.x})
                            .y(function(d) {return d.y});

    this.dragHandle = this.g
      .append('path')
      .attr('id', this.id + '_border')
      .attr('d', lineFunction(dragHandleData))
      .attr('style', 'stroke: green; stroke-width: 1px; stroke-dasharray: 2; fill: transparent;');

    this.resize_handle = this.g
      .append('circle')
      .attr('id', this.id + '_resizer')
      .attr('cx', this.lineDimension.start.x)
      .attr('cy', this.lineDimension.start.y)
      .attr('r', 20)
      .attr('style', 'stroke: red; stroke-width: 1px; stroke-dasharray: 2; fill: transparent;');

    this.startAdoner = this.g
      .append('rect')
      .attr('id', this.id + '_start_adorner')
      .attr('x', this.lineDimension.start.x - startXOffset)
      .attr('y', this.lineDimension.start.y - startYOffset)
      .attr('height', 10)
      .attr('width', 10)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'adorner-line-unselected');

    this.endAdoner = this.g
      .append('rect')
      .attr('id', this.id + '_end_adorner')
      .attr('x', this.lineDimension.end.x - endXOffset)
      .attr('y', this.lineDimension.end.y - endYOffset)
      .attr('height', 10)
      .attr('width', 10)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'adorner-line-unselected');

    if (direction === 'LR' || direction === 'RL') { //X-Axis dominant
      if (direction === 'LR') { //left to right
        this.rotateAdorner = this.g
          .append('svg:image')
          .attr('x', this.lineDimension.start.x + (this.lineDimension.end.x-this.lineDimension.start.x)/2)
          .attr('y', this.lineDimension.start.y + 36)
          .attr('height', 15)
          .attr('width', 15)
          .attr('xlink:href', 'images/handle-rotate.png')
          .attr('class', 'line_rotate_adorner');
      } else { //right to left
        this.rotateAdorner = this.g
          .append('svg:image')
          .attr('x', this.lineDimension.end.x + (this.lineDimension.start.x-this.lineDimension.endYOffsetq.x)/2)
          .attr('y', this.lineDimension.end.y + 36)
          .attr('height', 15)
          .attr('width', 15)
          .attr('xlink:href', 'images/handle-rotate.png')
          .attr('class', 'line_rotate_adorner');
      }
    } else { //Y Axis dominant
      if (direction === 'BT') { //bottom to top
        this.rotateAdorner = this.g
          .append('svg:image')
          .attr('x', this.lineDimension.start.x + 36)
          .attr('y', this.lineDimension.end.y + (this.lineDimension.start.y-this.lineDimension.end.y)/2)
          .attr('height', 15)
          .attr('width', 15)
          .attr('xlink:href', 'images/handle-rotate.png')
          .attr('class', 'line_rotate_adorner');
      } else { //top to bottom
        this.rotateAdorner = this.g
          .append('svg:image')
          .attr('x', this.lineDimension.end.x + 36)
          .attr('y', this.lineDimension.start.y + (this.lineDimension.end.y-this.lineDimension.start.y)/2)
          .attr('height', 15)
          .attr('width', 15)
          .attr('xlink:href', 'images/handle-rotate.png')
          .attr('class', 'line_rotate_adorner');
      }
    }

    this.line = this.g.append('line')
      .attr('id', this.id)
      .attr('x1', this.lineDimension.start.x)
      .attr('y1', this.lineDimension.start.y)
      .attr('x2', this.lineDimension.end.x)
      .attr('y2', this.lineDimension.end.y)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;')
      .attr('marker-end', 'url(#arrow)')
      .attr('data-type', 'edge-base');
  },
  isSelected: function() {
    return this.is_selected;
  },
  select: function() {
    this.is_selected = true;
    var item = document.getElementById(this.id + '_line_adorner');
    var childs = $j(item).children('[class*="adorner"]');
    childs.each(function(index, value) {
      value.style.display = 'inline';
    });
  },
  unselect: function() {
    this.is_selected = false;
    var item = document.getElementById(this.id + '_line_adorner');
    var childs = $j(item).children('[class*="adorner"]');
    childs.each(function(index, value) {
      value.style.display = 'none';
    });
  },
  isSelectable: function(point) {
    return this.isMouseOver(point);
  },
  isMouseOver: function(point){
    var item = document.getElementById(this.id + '_line_adorner');
    var bbox = item.getBoundingClientRect();
    if (point.x >= bbox.left && point.x < (bbox.left + bbox.width) && point.y >= bbox.top && point.y < (bbox.top + bbox.height)) {
      return true;
    }
    return false;
  },
  mouseDown: function(point, action){
    if(this.startPoint === undefined){
      this.startPoint = point;
    }
    this.dom = document.getElementById(this.id + '_line_adorner');
  },
  mouseDrag: function(point, action){
    if(action === 'MODIFY'){
      if(this.isMouseOver(point)){
        this.currentPoint = point;

        var dx = this.currentPoint.x - this.startPoint.x;
        var dy = this.currentPoint.y - this.startPoint.y;

        this.dom.setAttribute('transform', 'translate(' + dx + ' ' + dy + ')');
      }
    }
  },
  mouseUp: function(point, action){

  }
  /*draggable: function() {
    var dom = document.getElementById(this.id + '_line_adorner');
    var svg = document.getElementById(this.parentElement.id + "_svg");
    makeDraggable(svg, dom);
  },
  resizable: function() {
    var line_adorner = document.getElementById(this.id + '_line_adorner');
    var resizer = document.getElementById(this.id + '_resizer');
    var centerX;
    var centerY;
    var initAngle;
    var that = this;

    resizer.addEventListener('mousedown', startResize);
    resizer.addEventListener('touchstart', startResize);

    function startResize(e) {
      e.preventDefault();
      resizer.addEventListener('mousemove', resize);
      resizer.addEventListener('touchmove', resize);
      resizer.addEventListener('touchend', stopResize);
      resizer.addEventListener('mouseup', stopResize);
      centerX = that.endX;
      centerY = that.endY;
      var cursorX = that.startX;
      var cursorY = that.startY;
      dragEnabled = false;
      initAngle = Math.atan2(cursorY - centerY, cursorX - centerX) * (180 / Math.PI);
      console.log("Start cursor x,y: " + cursorX + ", " + cursorY);
      console.log("Start angle: " + initAngle);
    }

    function resize(e) {
      var cursorX = e.pageX;
      var cursorY = e.pageY;
      if (cursorX === undefined) {
        var touchObj = e.changedTouches[0];
        cursorX = parseInt(touchObj.clientX);
      }
      if (cursorY === undefined) {
        var touchObj = e.changedTouches[0];
        cursorY = parseInt(touchObj.clientY);
      }
      var angle = Math.atan2(cursorY - centerY, cursorX - centerX) * (180 / Math.PI) + Math.abs(initAngle);
      line_adorner.setAttribute("transform", "rotate(" + angle + " " + centerX + " " + centerY + ")");
      console.log("cursor x,y: " + cursorX + ", " + cursorY);
      console.log("angle: " + angle);
    }

    function stopResize(e) {
      dragEnabled = true;
      resizer.removeEventListener('mousemove', resize);
      resizer.removeEventListener('touchmove', resize);
    }
  }*/
});
