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

/**********************************************************
 * Canvas: class provides the functionality to hold the
 * nodes and edges objects
 ***********************************************************/
var Canvas = Class.create({
  id: '',
  container_id: undefined,
  height: undefined,
  width: undefined,
  css: 'canvas',
  instance: undefined,
  nodes: [],
  edges: [],
  grid: [10, 10],
  drag_items: {},
  draggables: undefined,
  selectable: undefined,
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
  initialize: function(id, container_id, height, width, nodes, edges, grid) {
    this.id = id;
    this.container_id = container_id;
    this.height = height;
    this.width = width;
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.grid = grid || [10, 10];
    this.drag_items = {};
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
    var added_node = $j(node.render());
    if (this.container_id != undefined) {
      var container = $j(('#' + this.container_id));
      added_node.appendTo(container);
    } else {
      added_node.appendTo($j('body'));
    }
    if (this.selectable != undefined) {
      this.selectable.add(added_node);
    }
    if (this.draggables != undefined) {
      this.draggables.destroy();
      this.draggable();
    }
    this.resizable(node.id, this.draggables);
    this.rotatable(node.id, this.draggables);
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
  /*
   * Method: render
   * Description: Renders the HTML for Canvas component in parent element
   */
  render: function() {
    /*Renders the canvas along with Nodes and edges*/
    var html = "<div id='" + this.id + "' ";
    html += "class='" + this.css + "' ";
    if (this.height != undefined && this.width != undefined) {
      html += "style='height:" + this.height;
      html += "; width:" + this.width + ";'  ";
    } else if (this.height != undefined && this.width === undefined) {
      html += "style='height:" + this.height + ";' ";
    } else if (this.height === undefined && this.width != undefined) {
      html += "style='width:" + this.width + ";' ";
    }
    html += " data-type='canvas'>";
    html += "<svg style='position:absolute; top: 0px; height: 100%; width: 100%' id='" + this.id + "_svg' ></svg>"
    /*Iterate through all the child nodes or edges of
     * canvas and render each of it by concatnating its
     * HTML to canvas's HTML
     */
    for (var i = 0; i < this.nodes.length; i++) {
      html += this.nodes[i].render();
    }
    html += "</div>";
    if (this.container_id === undefined) {
      this.instance = $j('body').prepend(html);
    } else {
      var container = $j(this.container_id);
      this.instance = $j(html).appendTo($j(container));
    }
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].registerPortHighlighters();
    }
    for (var i = 0; i < this.edges.length; i++) {
      this.edges[i].render();
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
  hasArrow: true,
  arrowEnd: "RIGHT",
  /*Other values are LEFT, BOTH, NONE */
  startX: "",
  startY: "",
  endX: "",
  endY: "",
  width: 0,
  height: 0,
  elementLeft: undefined,
  elementRight: undefined,
  parentElement: undefined,
  lineColor: "black",
  lineWidth: "3",
  lineStroke: "Solid",
  mainDiv: undefined,
  svg: undefined,
  line: undefined,
  startAdorner: undefined,
  endAdorner: undefined,
  rotateAdorner: undefined,
  initialize: function(id, parentElement, elementLeft, elementRight, title, lineColor, lineWidth, lineStroke, hasArrow, arrowEnd, description) {
    this.id = id;
    this.parentElement = parentElement;
    this.title = title || "";
    this.description = description || "";
    this.hasArrow = hasArrow || true;
    this.arrowEnd = arrowEnd || "RIGHT";
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.width = 0;
    this.height = 0;
    this.elementLeft = elementLeft;
    this.elementRight = elementRight;
    this.lineColor = lineColor || "black";
    this.lineWidth = lineWidth || "3";
    this.lineStroke = lineStroke || "Solid";
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

    var dx = Math.abs(this.endX - this.startX);
    var dy = Math.abs(this.endY - this.startY);
    var startXOffset = 0;
    var startYOffset = 0;
    var endXOffset = 0;
    var endYOffset = 0;

    if (dy <= dx) { //X-Axis dominant
      startXOffset = 10;
      startYOffset = 5;
      endXOffset = -5;
      endYOffset = 5;
      if (dx >= 0) { //left to right
        this.width = this.endX - this.startX;
      } else { //right to left
        this.width = this.startX - this.endX;
        }
      if (width === 0) {
        this.width = 20;
      }
    } else { //Y-Axis dominant
      startXOffset = 5;
      startYOffset = 10;
      endXOffset = 5;
      endYOffset = -5;
      if (dy >= 0) { //bottom to top
        this.height = this.startY - this.endY;
        } else { //top to bottom
        this.height = this.endY - this.startY;
        }
    }

    this.g = this.svg.append('g')
      .attr('id', this.id + '_line_adorner')
      .attr('class', 'ui-selectable ui-draggable');

    this.startAdoner = this.g
      .append('rect')
      .attr('id', this.id + '_start_adorner')
      .attr('x', this.startX - startXOffset)
      .attr('y', this.startY - startYOffset)
      .attr('height', 10)
      .attr('width', 10)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'adorner-line-unselected');

    this.endAdoner = this.g
      .append('rect')
      .attr('id', this.id + '_end_adorner')
      .attr('x', this.endX - endXOffset)
      .attr('y', this.endY - endYOffset)
      .attr('height', 10)
      .attr('width', 10)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'adorner-line-unselected');

    if(dy <= dx){ //X-Axis dominant
      if(dx >= 0){ //left to right
          this.rotateAdorner = this.g
          .append('rect')
          .attr('id', this.id + '_rotate_adorner')
          .attr('x', this.startX + (this.width/2))
          .attr('y', this.startY + 36)
          .attr('height', 15)
          .attr('width', 15)
          .attr('class', 'line_rotate_adorner');
        } else { //right to left
          this.rotateAdorner = this.g
          .append('rect')
          .attr('id', this.id + '_rotate_adorner')
          .attr('x', this.endX + (this.width/2))
          .attr('y', this.endY + 36)
          .attr('height', 15)
          .attr('width', 15)
          .attr('class', 'line_rotate_adorner');
        }
    } else { //Y Axis dominant
      if(dy >= 0){ //bottom to top
        this.rotateAdorner = this.g
          .append('rect')
          .attr('id', this.id + '_rotate_adorner')
          .attr('x', this.startX + 36)
          .attr('y', this.endY + (this.height/2))
          .attr('height', 15)
          .attr('width', 15)
          .attr('class', 'line_rotate_adorner');
      } else {
        this.rotateAdorner = this.g
          .append('rect')
          .attr('id', this.id + '_rotate_adorner')
          .attr('x', this.endX + 36)
          .attr('y', this.startY + (this.height/2))
          .attr('height', 15)
          .attr('width', 15)
          .attr('class', 'line_rotate_adorner');
      }
    }

    this.line = this.g.append('line')
      .attr('id', this.id)
      .attr('x1', this.startX)
      .attr('y1', this.startY)
      .attr('x2', this.endX)
      .attr('y2', this.endY)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;')
      .attr('marker-end', 'url(#arrow)')
      .attr('data-type', 'edge-base')
      .attr('class', 'ui-selectable ui-draggable');
  },
  redraw: function() {

  },
  render: function() {
    var node1 = this.parentElement.getNode(this.elementLeft.id);
    var node2 = this.parentElement.getNode(this.elementRight.id);
    var port1 = node1.getNextEmptyPort();
    var port2 = node2.getNextEmptyPort();

    this.startX = port1.getConnectionPoint().x;
    this.startY = port1.getConnectionPoint().y;
    this.endX = port2.getConnectionPoint().x;
    this.endY = port2.getConnectionPoint().y;

    this.makeElement();
    this.redraw();
  },
  resizable: function(draggable) {
    var element = document.getElementById(this.id + '_line_adorner');
    var resizer = document.getElementById(this.id + '_start_adorner');
    var line = document.getElementById(this.id);

    let original_width = 0;
    let original_x = 0;
    let original_mouse_x = 0;
    let original_height = 0;
    let original_y = 0;
    let original_mouse_y = 0;
    resizer.addEventListener('mousedown', startResize, false);
    resizer.addEventListener('touchstart', startResize, false);

    var that = this;

    function startResize(e) {
      draggable.draggabilly('disable');
      e.preventDefault();
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_mouse_x = e.pageX;
      if (original_mouse_x === undefined) {
        var touchObj = e.changedTouches[0];
        original_mouse_x = parseInt(touchObj.clientX);
      }
      window.addEventListener('touchmove', resize);
      window.addEventListener('mousemove', resize);
      window.addEventListener('touchend', stopResize);
      window.addEventListener('mouseup', stopResize);
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

      var deltaX = (cursorX - original_mouse_x);

      const width = original_width + deltaX;
      element.style.width = width + 'px';
      line.setAttribute('x1', width);
      line.parentElement.style.width = width + 'px';
    }

    function stopResize() {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('touchmove', resize);
      draggable.draggabilly('enable');
    }
  },
  rotatable: function(canvas, draggable) {
    const pointer = document.getElementById(this.id + '_line_adorner');
    var rotater_id = this.id + "_rotate_adorner";
    const rotater = document.getElementById(rotater_id);
    var pointerBox = pointer.getBoundingClientRect();
    var centerPoint = window.getComputedStyle(pointer).transformOrigin;
    var centers = centerPoint.split(" ");
    var centerY = pointerBox.top + parseInt(centers[1]) - window.pageYOffset;
    var centerX = pointerBox.left + parseInt(centers[0]) - window.pageXOffset;

    rotater.addEventListener('touchstart', startRotate, false);
    rotater.addEventListener('mousedown', startRotate, false);

    node = this;

    function startRotate(e) {
      draggable.draggabilly('disable');
      window.addEventListener('mousemove', rotate);
      window.addEventListener('touchmove', rotate);

      window.addEventListener('mouseup', stopRotate);
      window.addEventListener('touchend', stopRotate);
    }

    function rotate(e) {
      var pointerEvent = e;
      var mouseX = 0;
      var mouseY = 0;
      if (e.targetTouches && e.targetTouches[0]) {
        e.preventDefault();
        pointerEvent = e.targetTouches[0];
        mouseX = pointerEvent.pageX;
        mouseY = pointerEvent.pageY - 36;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY - 36;
      }
      var radians = Math.atan2(mouseX - centerX, mouseY - centerY);
      var degrees = (radians * (180 / Math.PI) * -1);
      pointer.style.transform = 'rotate(' + degrees + 'deg)';
      /*Somehow the value of transform attribute is becoming blank
       *after rotation is stopped, so capturing the transform
       *value during rotation process and same will be applied
       *when drag stopped
       * DOESN'T MAKE ANY SENSE BUT IT WORKS!!!
       */
      canvas.drag_items[(node.id + '_line_adorner')] = pointer.style.transform;
    }

    function stopRotate(e) {
      window.removeEventListener('mousemove', rotate);
      window.removeEventListener('touchmove', rotate);
      draggable.draggabilly('enable');
    }
  },
  setStartPoint: function(x1, y1) {
    this.startX = x1;
    this.startY = y1;
    this.redraw();
  },
  setEndPoint: function(x2, y2) {
    this.endX = x2;
    this.endY = y2;
    this.redraw();
    var l = document.getElementById(this.id + '_line_adorner');
    var p = l.getBoundingClientRect();
  },
  getStartPoint: function() {
    return {
      x: this.startX,
      y: this.startY
    };
  },
  getEndPoint: function() {
    return {
      x: this.endX,
      y: this.endY
    };
  }
});
