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