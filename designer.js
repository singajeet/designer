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
/***********************************************************
 * RectDimension - Dimension class containing dimension of an rectangle
 ***********************************************************/
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
/**********************************************************
 * LineDimension - Dimension class containing dimension for line
 **********************************************************/
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
  getDirection: function() {
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
  initialize: function(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }
});
/****
 * Ellipse Dimension
 ***/
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
/**********************************************************
 * Enum: MouseState
 * Description: Provides different states of mouse
 **********************************************************/
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
/***********************************************************
 * Enum: ShapeType
 * Description: Various shapes available
 ***********************************************************/
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
  SELECT: 8,
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
      name: 'SELECT'
    }
  }
};

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
  methods: undefined,
  mouseX: 0,
  mouseY: 0,
  mouseStartX: 0,
  mouseStartY: 0,
  mouseEndX: 0,
  mouseEndY: 0,
  mouseState: MouseState.UP,
  tempElement: undefined,
  shapeType: ShapeType.SELECT,
  toolName: 'SELECT',
  selectedTool: undefined,
  polyPoints: [],
  isCmdInPrgrs: false,
  lastClick: 0,
  isTap: false,
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
    this.tools = [this];
    this.observable = undefined;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseStartX = 0;
    this.mouseStartY = 0;
    this.mouseEndX = 0;
    this.mouseEndY = 0;
    this.tempElement = undefined;
    this.shapeType = ShapeType.SELECT;
    this.toolName = 'SELECT';
    this.selectedTool = this.tools[0];
    this.polyPoints = [];
    this.isCmdInPrgrs = false;
    this.lastClick = 0;
    this.isTap = false;
    this.options = {
      container: '#' + id + '_svg',
      restrict: '#' + id + '_svg',
      proportions: true,
      rotationPoint: true,
      //themeColor: 'white',
      each: {
        //resize: true,
        //move: true,
        //rotate: true
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
   * Method: getToolName
   * Description: Returns the name of the curret tool
   */
  getToolName: function() {
    return this.toolName;
  },
  /*
   * Method: getShapeType
   * Description: Returns the shape type the current tool supports
   */
  getShapeType: function() {
    return this.shapeType;
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
    var item = subjx('#' + edge.id).drag(this.options)[0];
    subjx(item.controls).on('dblclick', () => {
          item.disable();
    });
    subjx('#' + edge.id).on('dblclick', e => {
      if (e.currentTarget.classList.contains('sjx-drag')) return;
      const xDraggable = subjx(e.currentTarget).drag(this.options, this.observable)[0];
      // adding event to controls
      const controls = xDraggable.controls;
      subjx(controls).on('dblclick', () => {
        xDraggable.disable();
      });
    });
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
    var item = subjx('#' + node.id).drag(this.options)[0];
    subjx(item.controls).on('dblclick', () => {
          item.disable();
    });
    subjx('#' + node.id).on('dblclick', e => {
      if (e.currentTarget.classList.contains('sjx-drag')) return;
      const xDraggable = subjx(e.currentTarget).drag(this.options, this.observable)[0];
      // adding event to controls
      const controls = xDraggable.controls;
      subjx(controls).on('dblclick', () => {
        xDraggable.disable();
      });
    });
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
  addTool: function(tool) {
    this.tools.push(tool);
  },
  /*********************************************************
   * Method: removeTool
   * Description: removes an tool from the toolbox of the canvas
   *********************************************************/
  removeTool: function(tool) {
    var index = this.tools.indexOf(tool);
    this.tools.splice(index, 1);
    var toolToRemove = document.getElementById(tool.id);
    if (toolToRemove != undefined) {
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
                            for (var i = 0; i < this.tools.length; i++) {
                              if (i === 0) {
                                html += this.renderToolItem();
                              } else {
                                html += this.tools[i].renderToolItem();
                              }
                            }
                            html +=
                          `</td>
                        </tr>
                        <tr>
                          <td style='text-align: center; font-size: 9px;'>`;
                          html += `X: <span id='x_label'></span>
                                   Y: <span id='y_label'></span>
                          </td>
                        </tr>
                        <tr>
                          <td style='text-align: center; font-size: 9px;'>`;
                  html += `STATE: <span id='mouse_state'></span>`;
                  html += `</td>
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
    $j('[name="tools"]').bind('click', function(e) {
      var name = e.currentTarget.id;
      for (var i = 0; i < that.tools.length; i++) {
        if ((that.id + "_" + that.tools[i].getToolName() + "_tool") === name) {
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
    this.isCmdInPrgrs = false;
    this.polyPoints = [];
    this.lastClick = 0;

    function mouseMove(e) {
      e.preventDefault();
      that.mouseX = e.clientX;
      that.mouseY = e.clientY;
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
        } else if(that.tempElement != undefined && that.selectedTool.getShapeType() === ShapeType.BEZIRE_CURVE){
          var len = that.polyPoints.length;
          that.polyPoints[len-1] = new Point(that.mouseX, that.mouseY);
	  var data=[];
	  for(var i=0;i<that.polyPoints.length;i++){
		  var point = {x: that.polyPoints[i].x, y: that.polyPoints[i].y};
	   data.push(point);
	  }
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

        that.mouseStartX = e.clientX;
        that.mouseStartY = e.clientY;
	      that.isTap = false;
        if (that.mouseStartX === undefined || that.mouseStartY === undefined) {
          that.mouseStartX = e.touches[0].clientX;
          that.mouseStartY = e.touches[0].clientY;
	        that.isTap = true;
        }
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
            case ShapeType.SELECT:
              var items = $j('.drag-svg');
              for(var i=0; i<items.length; i++){
                var item = subjx(items[i]);
              }
          }
        }
      }
    }

    function mouseUp(e) {
      e.preventDefault();
      if (that.mouseState === MouseState.DOWN || that.mouseState === MouseState.DRAG) {
        that.mouseState = MouseState.UP;
        $j('#mouse_state').text(MouseState.properties[that.mouseState].name);
        that.mouseEndX = e.clientX;
        that.mouseEndY = e.clientY;
        if (that.mouseEndX === undefined || that.mouseEndY === undefined) {
          if (e.touches.length > 0) {
            that.mouseEndX = e.touches[0].clientX;
            that.mouseEndY = e.touches[0].clientY;
          } else {
            that.mouseEndX = that.mouseX;
            that.mouseEndY = that.mouseY;
          }
        }
        if(that.selectedTool.getShapeType() === ShapeType.SELECT){
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
            x: that.mouseEndX,
            y: that.mouseEndY
          });
          that.tempElement.remove();
          that.tempElement = undefined;
          that.addEdge(line);
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
          }
        }
      }
    }
    function mouseDblClick(e){
      if (that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.POLYGON) {
          var name = prompt("Element Name:");
          if(that.polyPoints.length > 1){
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
        }
      } else if(that.tempElement !== undefined && that.selectedTool.getShapeType() === ShapeType.POLYLINE){
          var name = prompt("Element Name:");
          if(that.polyPoints.length > 1){
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
      	 }
       }
      }
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.id + "_SELECT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.id + "_SELECT_tool' checked>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                    <defs>
                      <marker id="toolArrow" refX="6" refY="6" markerWidth="30" markerHeight="30" markerUnits="userSpaceOnUse" orient="auto">
                          <path d="M 0 0 12 6 0 12 3 6" style="fill: black;"></path>
                      </marker>
                    </defs>
                      <line x1='25' y1='25' x2='35' y2='35' style='stroke: black; stroke-width: 2px;' marker-end= 'url(#toolArrow)' transform='rotate(180 25 25)'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">SELECT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
  _registerActions: function() {
    this.observable = subjx.createObservable();

    this.svg = subjx('.drag-svg')
      .drag(this.options);

    if (this.svg !== undefined) {
      this.svg.forEach(item => {
        subjx(item.controls).on('dblclick', () => {
          item.disable();
        });
      });
    }

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
  _registerMarkers: function() {

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
  _changeTool(index) {
    if (index < this.tools.length) {
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
/*********************************************************************
 * Base class for all shapes that could be added to the cavas
 *********************************************************************/
var Shape = Class.create({
  id: "",
  title: "",
  description: "",
  shapeType: ShapeType.NONE,
  toolName: 'NONE',
  initialize: function(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.shapeType = ShapeType.NONE;
    this.toolName = 'NONE';
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
  },
  render: function() {},
  renderToolItem: function() {}
});
/**********************************************************************
 * Defines an line that will be used to connect two or more nodes with
 * each other. A Line can have direction and will be denoted by an Arrow
 * icon on one end or both end of the line.
 **********************************************************************/
var Line = Class.create({
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
  shapeType: ShapeType.LINE,
  toolName: 'LINE',
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
    this.shapeType = ShapeType.LINE;
    this.toolName = 'LINE';
  },
  getToolName: function() {
    return this.toolName;
  },
  getShapeType: function() {
    return this.shapeType;
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
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">LINE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});
/**********************************************************************
 * Defines an Rectangle that will represent an model in the graph diagram
 * A rectangle contain user configurable data known as attribute
 * which can be changed through property window.
 **********************************************************************/
var Rectangle = Class.create({
  id: "",
  title: "",
  description: "",
  rectDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  shapeType: ShapeType.RECTANGLE,
  toolName: 'RECT',
  initialize: function(id, parentElement, rectDimension, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.rectDimension = rectDimension || new RectDimension(10, 10, 100, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.RECTANGLE;
    this.toolName = 'RECT';
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

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('height', this.rectDimension.height)
      .attr('width', this.rectDimension.width)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;')
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg');
  },
  renderToolItem() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_RECT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_RECT_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='21' y='21' height='17' width='17' style='stroke: black; stroke-width: 2px; fill:none' transform='rotate(180 23 23)'></rect>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">RECT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

/**********************************************************************
 * Defined an circle that will represent an model in the graph diagram
 * A circle contain user configurable data known as attribute
 * which can be changed through property window.
 **********************************************************************/
var Circle = Class.create({
  id: "",
  title: "",
  description: "",
  circDimension: undefined, //an instance of the RectDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  shapeType: ShapeType.CIRCLE,
  toolName: 'CIRCLE',
  initialize: function(id, parentElement, circDimension, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.circDimension = circDimension || new CircleDimension(10, 10, 50);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.CIRCLE;
    this.toolName = 'CIRCLE';
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
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;')
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg');
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
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">CIRCLE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});
/**********************************************************************
 * Defines an ellipse that will represent an model in the graph diagram
 * A ellipse contain user configurable data known as attribute
 * which can be changed through property window.
 **********************************************************************/
var Ellipse = Class.create({
  id: "",
  title: "",
  description: "",
  ellipDimension: undefined, //an instance of the EllipseDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  shapeType: ShapeType.ELLIPSE,
  toolName: 'ELLIPSE',
  initialize: function(id, parentElement, ellipDimension, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.ellipDimension = ellipDimension || new EllipseDimension(10, 10, 50, 100);
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.ELLIPSE;
    this.toolName = 'ELLIPSE';
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
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;')
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg');
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
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">ELLIPSE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});
/**********************************************************************
 * Defines an polygon that will represent an model in the graph diagram
 * A polygon contain user configurable data known as attribute
 * which can be changed through property window.
 **********************************************************************/
var Polygon = Class.create({
  id: "",
  title: "",
  description: "",
  polyPoints: '10,10 50,50 100,10', //an instance of the EllipseDimension class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  shapeType: ShapeType.POLYGON,
  toolName: 'POLYGON',
  initialize: function(id, parentElement, polyPoints, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.polyPoints = polyPoints || '10,10 50,50 100,10';
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.POLYGON;
    this.toolName = 'POLYGON';
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
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;')
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg');
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
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">POLYGON</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});
/**********************************************************************
 * Defines an polyline that will represent an model in the graph diagram
 * A polyline contain user configurable data known as attribute
 * which can be changed through property window.
 **********************************************************************/
var Polyline = Class.create({
  id: "",
  title: "",
  description: "",
  polyPoints: '10,10 50,50 100,10', //instances of the Point class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  shapeType: ShapeType.POLYLINE,
  toolName: 'POLYLINE',
  initialize: function(id, parentElement, polyPoints, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.polyPoints = polyPoints || '10,10 50,50 100,10';
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.POLYLINE;
    this.toolName = 'POLYLINE';
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

    this.line = svg.append('polyline')
      .attr('id', this.id)
      .attr('points', this.polyPoints)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none;')
      .attr('data-type', 'node-base')
      .attr('class', 'drag-svg');
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
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">POLYLINE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});
/**********************************************************************
 * Defines an bezire curve that will represent an model in the graph diagram
 * A bezire curve contain user configurable data known as attribute
 * which can be changed through property window.
 **********************************************************************/
var BezireCurve = Class.create({
  id: "",
  title: "",
  description: "",
  curvePoints: '[{100,350}, {150,-300}, {300,0}]', //instances of the Point class
  ports: [],
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  shapeType: ShapeType.BEZIRE_CURVE,
  toolName: 'BEZIRE_CURVE',
  controlPoint: undefined,
  initialize: function(id, parentElement, curvePoints, ports, title, lineColor, lineWidth, lineStroke, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.curvePoints = curvePoints || '[{100,350}, {150,-300}, {300,0}]';
    this.ports = ports || [];
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
    this.shapeType = ShapeType.BEZIRE_CURVE;
    this.toolName = 'BEZIRE_CURVE';
    this.controlPoint = undefined;
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
    // prepare a helper function
    var curveFunc = d3.line()
      .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
      .x(function(d) { return d.x })
      .y(function(d) { return d.y });

      // Add the path using this helper function
      var g = svg.append('g')
	  	.attr('id', this.id)
	  	.attr('class', 'drag-svg');

	  	g.append('circle')
	  	.attr('cx', this.curvePoints[1].x)
	  	.attr('cy', this.curvePoints[1].y)
	  	.attr('r', '5.5')
	  	.attr('style', 'stroke: red; fill: none; stroke-width: 2px');
      this.line = g;
      g.append('path')
      //.attr('id', this.id)
      .attr('d', curveFunc(this.curvePoints))
      .attr('stroke', 'black')
      .attr('stroke-width', '2px')
      .attr('fill', 'none')
      .attr('data-type', 'node-base-inner');
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
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.7em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">BEZIRE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  },
});

