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
  items: [],
  grid: [10, 10],
  /*
   * 	Constructor
   *					id (string): 						A unique identifier for the canvas
   *					container_id (string): 	Id of the parent container, if not
   *																	provided Canvas will be attached to
   *																	body of the page
   *					height (string): 				Height of the canvas with unit
   *					width (string): 				Width of the canvas with unit
   *					items (Array): 					A list of direct child elements
   *					grid (Array): 					Size of each cell in the grid (in pixels)
   */
  initialize: function(id, container_id, height, width, items, grid) {
    this.id = id;
    this.container_id = container_id;
    this.height = height;
    this.width = width;
    this.items = items || [];
    this.grid = grid || [10, 10];
  },
  /*
   * Method: add_node
   * Description: Adds an node or edge node to canvas
   */
  add_node: function(node) {
    this.items.push(node);
  },
  /*
   * Method: remove_node
   * Description: Removes an node from the array
   */
  remove_node: function(node) {
    var index = this.items.indexOf(node);
    this.items.splice(index, 1);
  },
  /*
   * Method: render
   * Description: Renders the HTML for Canvas component in parent element
   */
  render: function() {
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
    html += ">";
    for (var i = 0; i < this.items.length; i++) {
      html += this.items[i].render();
    }
    html += "</div>";
    if (this.container_id === undefined) {
      this.instance = $j('body').prepend(html);
    } else {
      var container = $j(this.container_id);
      this.instance = $j(html).appendTo($j(container));
    }
    this.add_actions();
  },
  /*
   * Method: add_actions
   * Description: Makes all direct child elements as selectable, draggable and resizable
   */
  add_actions: function() {
    var selector_id = '#' + this.id;
    var selector = $j(selector_id);
    selector.selectable({
      selected: function(event, ui) {
        var childs = $j(ui.selected).children("[class*='adorner']");
        childs.each(function(index, value) {
          value.style.display = 'inline';
        });
        $j(ui.selected).draggable({
          grid: this.grid
        });
        var node = $j(ui.selected).children("[class*='node']");
        $j(ui.selected).resizable({
          alsoResize: node
        });
      },
      unselected: function(event, ui) {
        var childs = $j(ui.unselected).children("[class*='adorner']");
        childs.each(function(index, value) {
          value.style.display = 'none';
        });
        $j(ui.unselected).draggable("destroy");
        $j(ui.unselected).resizable("destroy");
      }
    });
  }
});

/***********************************************************************
 * Node: class represents an node on the canvas which have the functionality
 * 			to be selected, dragged and resize. The node will have the adorner
 *				highlighted whenever that element is selected. The content of
 * 			of the node can be passed as HTML markup which will be rendered
 * 			inside the node element
 ************************************************************************/
var Node = Class.create({
  id: '',
  title: '',
  height: undefined,
  width: undefined,
  css: 'node',
  html_content: undefined,
  /* CONSTANTS */
  ADORNER_INVISIBLE: '<div id="{0}_node_adorner" class="adorner-invisible">',
  TOP_LEFT_ADORNER: '<div id="{0}_tl_adorner" class="tl_adorner"></div> <!-- top-left -->',
  TOP_RIGHT_ADORNER: '<div id="{0}_tr_adorner" class="tr_adorner"></div> <!-- top-right -->',
  BOTTOM_LEFT_ADORNER: '<div id="{0}_bl_adorner" class="bl_adorner"></div> <!-- bottom-left -->',
  BOTTOM_RIGHT_ADORNER: '<div id="{0}_br_adorner" class="br_adorner"></div> <!-- bottom-right -->',
  TOP_MID_ADORNER: '<div id="{0}_tm_adorner" class="tm_adorner"></div> <!-- top-mid -->',
  LEFT_MID_ADORNER: '<div id="{0}_lm_adorner" class="lm_adorner"></div> <!-- left-mid -->',
  BOTTOM_MID_ADORNER: '<div id="{0}_bm_adorner" class="bm_adorner"></div> <!-- bottom-mid -->',
  RIGHT_MID_ADORNER: '<div id="{0}_rm_adorner" class="rm_adorner"></div> <!-- right-mid -->',
  ROTATE_ADORNER: '<div id="{0}_rotate_adorner" class="rotate_adorner"></div> <!-- rotate handle -->',
  NODE_TAG: '<div id="{0}" class="node" >{1}</div>',
  ADORNER_INVISIBLE_END: '</div>',
  initialize: function(id, title, html_content, height, width) {
    this.id = id;
    this.title = title || '';
    this.html_content = html_content || undefined;
    this.height = height || undefined;
    this.width = width || undefined;
  },
  render: function() {
    var html = '';
    html += this.ADORNER_INVISIBLE.format(this.id);
    html += this.TOP_LEFT_ADORNER.format(this.id);
    html += this.TOP_RIGHT_ADORNER.format(this.id);
    html += this.BOTTOM_LEFT_ADORNER.format(this.id);
    html += this.BOTTOM_RIGHT_ADORNER.format(this.id);
    html += this.TOP_MID_ADORNER.format(this.id);
    html += this.LEFT_MID_ADORNER.format(this.id);
    html += this.BOTTOM_MID_ADORNER.format(this.id);
    html += this.RIGHT_MID_ADORNER.format(this.id);
    html += this.ROTATE_ADORNER.format(this.id);
    if (this.html_content === undefined) {
      this.html_content = '';
    }
    html += this.NODE_TAG.format(this.id, this.html_content);
    html += this.ADORNER_INVISIBLE_END;
    return html;
  }
});
