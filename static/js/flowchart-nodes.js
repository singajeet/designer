/**********************************************************************************
 *                            FLOWCHART APIs
 **********************************************************************************/

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
  clone: function() {
    return new FlowChartTerminator(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
  clone: function() {
    return new FlowChartProcess(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
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
  clone: function() {
    return new FlowChartDecision(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
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
  LEFT: 1,
  RIGHT: 2,
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
    this.LEFT = 1;
    this.RIGHT = 2;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    return new FlowChartDocument(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
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
  clone: function() {
    return new FlowChartSubroutine(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

    this.vLine2 = svg.append('line')
      .attr('id', this.id + '_vline2')
      .attr('x1', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + this.rectDimension.width - 30)
      .attr('y2', this.rectDimension.top + this.rectDimension.height)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Fill Color"){
      this.fillColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Opacity"){
      this.opacity = parseFloat(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
      this.vLine1.attr('id', this.id + '_vline1');
      this.vLine2.attr('id', this.id + '_vline2');
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

/**
 * FlowChartDelay: An delay node in a flowchart
 * @constructor
 */
var FlowChartDelay = Class.create({
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
  toolName: 'FLOW_CHART_DELAY',
  selected: true,
  opacity: 1,
  classType: FlowChartDelay,
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
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
    this.toolName = 'FLOW_CHART_DELAY';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartDelay;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
    }
  },
  clone: function() {
    return new FlowChartDelay(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var xdelta = this.rectDimension.height/2;
    var ydelta = 10;

    var path = 'M ' + this.rectDimension.left + ' ' + this.rectDimension.top + ' '//position XY
    + 'V ' + (this.rectDimension.top + this.rectDimension.height) + ' ' //vertical line
    + 'H ' + (this.rectDimension.left + this.rectDimension.width - xdelta) + ' '//horizontal lin
    + 'C ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //1st curve point X
    + (this.rectDimension.top + this.rectDimension.height - 10) + ' ' //1st curve point Y
    + (this.rectDimension.left + this.rectDimension.width) + ' ' //2nd curve point X
    + (this.rectDimension.top + 10) + ' ' //2nd curve point Y
    + (this.rectDimension.left + this.rectDimension.width - xdelta) + ' ' //curve end point X
    + (this.rectDimension.top) + ' ' //curve end point Y
    + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_DELAY_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_DELAY_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d='M 10 10 V 28 H 35 C 40 26 40 12 35 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">DELAY</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartData: An data node in a flowchart
 * @constructor
 */
var FlowChartData = Class.create({
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
  toolName: 'FLOW_CHART_DATA',
  selected: true,
  opacity: 1,
  classType: FlowChartData,
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
    this.toolName = 'FLOW_CHART_DATA';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartData;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartData(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var xdelta = this.rectDimension.height/2;
    var ydelta = 10;

    var path = 'M ' + this.rectDimension.left + ' ' //left bottom (LB) corner X
      + (this.rectDimension.top + this.rectDimension.height) + ' ' //left bottom (LB) corner Y
      + 'H ' + (this.rectDimension.left + this.rectDimension.width - 30) + ' ' //Horiz Line
      + 'L ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //Right side line X
      + (this.rectDimension.top) + ' ' //Right side line Y
      + 'H ' + (this.rectDimension.left + 30) + ' ' //Horizontal line
      + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_DATA_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_DATA_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d='M 10 28 H 35 L 40 10 H 15 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">DATA</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartMultiDocument: An multi document node in a flowchart
 * @constructor
 */
var FlowChartMultiDocument = Class.create({
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
  toolName: 'FLOW_CHART_MULTI_DOCUMENT',
  selected: true,
  opacity: 1,
  classType: FlowChartMultiDocument,
  TOP: 0,
  LEFT: 1,
  RIGHT: 2,
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
    this.toolName = 'FLOW_CHART_MULTI_DOCUMENT';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartMultiDocument;
    this.TOP = 0;
    this.LEFT = 1;
    this.RIGHT = 2;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    return new FlowChartMultiDocument(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
  _calculatePath: function() {
    return 'M ' + (this.rectDimension.left) + ' ' //left corner X
    + (this.rectDimension.top + this.rectDimension.height - 15) + ' ' //left corner Y
    + 'C ' + (this.rectDimension.left + (this.rectDimension.width/4)) + ' ' //1st curve point X
    + (this.rectDimension.top + this.rectDimension.height) + ' ' //1st curve point Y
    + (this.rectDimension.left + (this.rectDimension.width * 3/4)) + ' ' //2nd curve point X
    + (this.rectDimension.top + this.rectDimension.height - 30) + ' ' //2nd curve point Y
    + (this.rectDimension.left + this.rectDimension.width - 14) + ' ' //end curve point X
    + (this.rectDimension.top + this.rectDimension.height - 15) + ' ' //end curve point Y
    + 'V ' + (this.rectDimension.top + 14) + ' ' //vertical line to top
    + 'H ' + (this.rectDimension.left) + ' ' //horizontal line to left
    + 'Z'; //close the shape
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    this.rect1 = svg.append('rect')
      .attr('id', this.id + '_rect1')
      .attr('x', this.rectDimension.left + 14)
      .attr('y', this.rectDimension.top)
      .attr('width', this.rectDimension.width - 14)
      .attr('height', this.rectDimension.height - 36)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity);

    this.rect2 = svg.append('rect')
      .attr('id', this.id + '_rect2')
      .attr('x', this.rectDimension.left + 7)
      .attr('y', this.rectDimension.top + 7)
      .attr('width', this.rectDimension.width - 14)
      .attr('height', this.rectDimension.height - 33)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity);

    var path = this._calculatePath();

    this.path = svg.append('path')
      .attr('id', this.id + '_path')
      .attr('d', path)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity);

    this.line = svg.append('rect')
      .attr('id', this.id)
      .attr('x', this.rectDimension.left)
      .attr('y', this.rectDimension.top)
      .attr('height', this.rectDimension.height)
      .attr('width', this.rectDimension.width)
      .attr('style', 'stroke: none; stroke-width: 0px; fill: white; fill-opacity: 0')
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

    this.rect1
      .attr('x', this.rectDimension.left + 14)
      .attr('y', this.rectDimension.top)
      .attr('width', this.rectDimension.width - 14)
      .attr('height', this.rectDimension.height - 36);

    this.rect2
      .attr('x', this.rectDimension.left + 7)
      .attr('y', this.rectDimension.top + 7)
      .attr('width', this.rectDimension.width - 14)
      .attr('height', this.rectDimension.height - 33);

    this.path.attr('d', this._calculatePath());

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

    this.rect1
      .attr('x', this.rectDimension.left + 14)
      .attr('y', this.rectDimension.top)
      .attr('width', this.rectDimension.width - 14)
      .attr('height', this.rectDimension.height - 36);

    this.rect2
      .attr('x', this.rectDimension.left + 7)
      .attr('y', this.rectDimension.top + 7)
      .attr('width', this.rectDimension.width - 14)
      .attr('height', this.rectDimension.height - 33);

    this.path.attr('d', this._calculatePath());

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5));
    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.rect1.attr('visibility', 'hidden');
    this.rect2.attr('visibility', 'hidden');
    this.path.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.rect1.attr('visibility', 'hidden');
    this.rect2.attr('visibility', 'hidden');
    this.path.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.rect1.attr('visibility', 'hidden');
    this.rect2.attr('visibility', 'hidden');
    this.path.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onDrop: function(obj){
    this.rect1.attr('visibility', 'visible');
    this.rect2.attr('visibility', 'visible');
    this.path.attr('visibility', 'visible');
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
      this.rect1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.rect2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.path.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.rect1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.rect2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.path.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
    } else if(propName === "Fill Color"){
      this.fillColor = '#' + propValue;
      this.rect1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.rect2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.path.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
    } else if(propName === "Opacity"){
      this.opacity = parseFloat(propValue);
      this.rect1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.rect2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.path.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
      this.rect1.attr('id', this.id + '_rect1');
      this.rect2.attr('id', this.id + '_rect2');
      this.path.attr('id', this.id + '_path');
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
    this.rect1.remove();
    this.rect2.remove();
    this.path.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_MULTI_DOCUMENT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_MULTI_DOCUMENT_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='16' y='9' height='10' width='20'
                        style='stroke: black; stroke-width: 2px; fill:white'></rect>
                      <rect x='13' y='12' height='10' width='20'
                        style='stroke: black; stroke-width: 2px; fill:white'></rect>
                      <path d = 'M 10 24 C 15 29 25 19 30 24 V 15 H 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:white'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.5em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">MULTI DOC</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartPreparation: An preparation/initialization node in a flowchart
 * @constructor
 */
var FlowChartPreparation = Class.create({
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
  toolName: 'FLOW_CHART_PREPARATION',
  selected: true,
  opacity: 1,
  classType: FlowChartPreparation,
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
    this.toolName = 'FLOW_CHART_PREPARATION';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartPreparation;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartPreparation(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
  _calculatePath: function() {
    return 'M ' + (this.rectDimension.left) + ' ' //left middle (LM) corner X
      + (this.rectDimension.top + (this.rectDimension.height/2)) + ' ' //LM corner Y
      + 'L ' + (this.rectDimension.left + 30) + ' ' //LB corner X
      + (this.rectDimension.top + this.rectDimension.height) + ' ' //LB corner Y
      + 'H ' + (this.rectDimension.left + this.rectDimension.width - 30) + ' ' //Horiz line
      + 'L ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //RM corner X
      + (this.rectDimension.top + (this.rectDimension.height/2)) + ' ' //RM corner Y
      + 'L ' + (this.rectDimension.left + this.rectDimension.width - 30) + ' ' //RT corner X
      + (this.rectDimension.top) + ' ' //RT corner Y
      + 'H ' + (this.rectDimension.left + 30) + ' ' //Horiz Line
      + 'Z';
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    var path = this._calculatePath();

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
    this.ports.forEach(function(port){
      port.hide();
    });
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_PREPARATION_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_PREPARATION_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 19 L 15 28 H 35 L 40 19 L 35 10 H 15 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.5em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">PREP / INIT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartDisplay: An display node in a flowchart
 * @constructor
 */
var FlowChartDisplay = Class.create({
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
  toolName: 'FLOW_CHART_DISPLAY',
  selected: true,
  opacity: 1,
  classType: FlowChartDisplay,
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
    this.toolName = 'FLOW_CHART_DISPLAY';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartDisplay;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartDisplay(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
  _calculatePath: function() {
    var xdelta = this.rectDimension.height/2;

    return 'M ' + (this.rectDimension.left + xdelta) + ' ' //TL corner X
    + (this.rectDimension.top) + ' ' //TL corner Y
    + 'C ' + (this.rectDimension.left + xdelta - (xdelta/2)) + ' ' //curve 1 point 1 X
    + (this.rectDimension.top + 10) + ' ' //curve 1 point 1 Y
    + (this.rectDimension.left + 10) + ' ' //curve 1 point 2 X
    + (this.rectDimension.top + (this.rectDimension.height/2) - (xdelta/2)) + ' '//c 1 point 2 Y
    + (this.rectDimension.left) + ' ' //curve 1 end point X
    + (this.rectDimension.top + (this.rectDimension.height/2)) + ' ' //curve 1 end point Y
    + (this.rectDimension.left + 10) + ' ' //curve 2 point 1 X
    + (this.rectDimension.top + (this.rectDimension.height/2) + (xdelta/2)) + ' '//c 2 point 1 Y
    + (this.rectDimension.left + xdelta - (xdelta/2)) + ' ' //curve 2 point 2 X
    + (this.rectDimension.top + this.rectDimension.height - 10) + ' ' //curve 2 point 2 Y
    + (this.rectDimension.left + xdelta) + ' ' //curve 2 end point X
    + (this.rectDimension.top + this.rectDimension.height) + ' ' //curve 2 end point Y
    + 'H ' + (this.rectDimension.left + this.rectDimension.width - 30) + ' ' //Horiz line
    + 'C ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //curve 3 point 1 X
    + (this.rectDimension.top + this.rectDimension.height - 10) + ' ' //curve 3 point 1 Y
    + (this.rectDimension.left + this.rectDimension.width) + ' ' //curve 3 point 2 X
    + (this.rectDimension.top + 10) + ' ' //curve 3 point 2 Y
    + (this.rectDimension.left + this.rectDimension.width - 30) + ' ' //curve 3 end point X
    + (this.rectDimension.top) + ' ' //curve 3 end point Y
    + 'Z';
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    var path = this._calculatePath();

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
    this.ports.forEach(function(port){
      port.hide();
    });
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_DISPLAY_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_DISPLAY_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 20 10 C 13 12 11 16 10 19 C 11 22 13 26 20 28 H 35 C 40 22 40 16 35 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.5em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">DISPLAY</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartInput: An input node in a flowchart
 * @constructor
 */
var FlowChartInput = Class.create({
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
  toolName: 'FLOW_CHART_INPUT',
  selected: true,
  opacity: 1,
  classType: FlowChartInput,
  LEFT: 0,
  RIGHT: 1,
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
    this.toolName = 'FLOW_CHART_INPUT';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartInput;
     this.LEFT = 0;
    this.RIGHT = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    return new FlowChartInput(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
                + (this.rectDimension.top + this.rectDimension.height/3) + ' ' //left corner Y
                + 'V ' + (this.rectDimension.top + this.rectDimension.height) + ' '//Vert line
                + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' '//Hoiz line
                + 'V ' + (this.rectDimension.top) + ' ' //Vertical line
                + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_INPUT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_INPUT_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 15 V 28 H 40 V 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">INPUT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartLoop: An loop node in a flowchart
 * @constructor
 */
var FlowChartLoop = Class.create({
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
  toolName: 'FLOW_CHART_LOOP',
  selected: true,
  opacity: 1,
  classType: FlowChartLoop,
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
    this.toolName = 'FLOW_CHART_LOOP';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartLoop;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartLoop(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var path = 'M ' + (this.rectDimension.left) + ' ' //top left corner X
                + (this.rectDimension.top) + ' ' //top left corner Y
                + 'L ' + (this.rectDimension.left + 20) + ' ' //BL corner X
                + (this.rectDimension.top + this.rectDimension.height) + ' ' //BL corner Y
                + (this.rectDimension.left + this.rectDimension.width - 20) + ' '//BR corner X
                + (this.rectDimension.top + this.rectDimension.height) + ' '//BR corner Y
                + 'L ' + (this.rectDimension.left + this.rectDimension.width) + ' '//TR corner X
                + (this.rectDimension.top) + ' ' //TR corner Y
                + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_LOOP_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_LOOP_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 10 L 15 28 H 35 L 40 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">LOOP</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartLoopLimit: An Loop limit node in a flowchart
 * @constructor
 */
var FlowChartLoopLimit = Class.create({
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
  toolName: 'FLOW_CHART_LOOP_LIMIT',
  selected: true,
  opacity: 1,
  classType: FlowChartLoopLimit,
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
    this.toolName = 'FLOW_CHART_LOOP_LIMIT';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartLoopLimit;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartLoopLimit(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var path = 'M ' + (this.rectDimension.left + 25) + ' ' //top left corner X
                + (this.rectDimension.top) + ' ' //top left corner Y
                + 'L ' + (this.rectDimension.left) + ' ' //ML corner X
                + (this.rectDimension.top + 25) + ' ' //ML corner Y
                + 'V ' + (this.rectDimension.top + this.rectDimension.height) + ' '//Vert line
                + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' '//Horiz line
                + 'V ' + (this.rectDimension.top + 25) + ' ' //Vertical line
                + 'L ' + (this.rectDimension.left + this.rectDimension.width - 25) + ' '//line X
                + (this.rectDimension.top) + ' ' //line Y
                + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_LOOP_LIMIT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_LOOP_LIMIT_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 15 10 L 10 15 V 28 H 40 V 15 L 35 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.5em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">LOOP LIMIT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartStoredData: An Stored data node in a flowchart
 * @constructor
 */
var FlowChartStoredData = Class.create({
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
  toolName: 'FLOW_CHART_STORED_DATA',
  selected: true,
  opacity: 1,
  classType: FlowChartStoredData,
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
    this.toolName = 'FLOW_CHART_STORED_DATA';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartStoredData;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartStoredData(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var xdelta = this.rectDimension.height/4;

    var path = 'M ' + (this.rectDimension.left + xdelta) + ' ' //top left corner X
      + (this.rectDimension.top) + ' ' //top left corner Y
      + 'C ' + (this.rectDimension.left) + ' ' //curve 1 point 1 X
      + (this.rectDimension.top + 10) + ' ' //curve 1 point 1 Y
      + (this.rectDimension.left) + ' ' //curve 1 point 2 X
      + (this.rectDimension.top + this.rectDimension.height - 10) + ' ' //curve 1 point 2 Y
      + (this.rectDimension.left + xdelta) + ' ' //curve 1 point end X
      + (this.rectDimension.top + this.rectDimension.height) + ' '//curve 1 p end Y
      + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //Horiz line
      + 'C ' + (this.rectDimension.left + this.rectDimension.width - xdelta) + ' '//curve 2 X1
      + (this.rectDimension.top + this.rectDimension.height - 10) + ' ' //curve 2 Y1
      + (this.rectDimension.left + this.rectDimension.width - xdelta) + ' '//curve 2 X2
      + (this.rectDimension.top + 10) + ' ' //curve 2 Y2
      + (this.rectDimension.left + this.rectDimension.width) + ' ' //curve 2 end X
      + (this.rectDimension.top) + ' ' //curve 2 end Y
      + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_STORED_DATA_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_STORED_DATA_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 15 10 C 10 12 10 26 15 28 H 40 C 35 26 35 12 40 10 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">STORED DATA</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartConnector: An connector node in a flowchart
 * @constructor
 */
var FlowChartConnector = Class.create({
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
  toolName: 'FLOW_CHART_CONNECTOR',
  selected: true,
  opacity: 1,
  classType: FlowChartConnector,
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
    this.toolName = 'FLOW_CHART_CONNECTOR';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartConnector;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    return new FlowChartConnector(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    this.line = svg.append('circle')
      .attr('id', this.id)
      .attr('cx', this.cx)
      .attr('cy', this.cy)
      .attr('r', this.r)
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

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5));
    this.ports[this.LEFT].moveTo((this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);
    this.rectDimension.width = parseInt(bBox.width);
    this.rectDimension.height = parseInt(bBox.height);

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5));
    this.ports[this.LEFT].moveTo((this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
                      },
                      { recid: 15, propName: 'CX', propValue: this.cx,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 16, propName: 'CY', propValue: this.cy,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 17, propName: 'Radius', propValue: this.r,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
            ]
          }
        },
        { recid: 18, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 19, propName: 'Title', propValue: this.title},
                      { recid: 20, propName: 'Description', propValue: this.description}
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_CONNECTOR_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_CONNECTOR_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <circle cx='25' cy='19' r='12'
                        style='stroke: black; stroke-width: 2px; fill: none;'></circle>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">CONNECTOR</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartOffPageConnector: An loop node in a flowchart
 * @constructor
 */
var FlowChartOffPageConnector = Class.create({
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
  toolName: 'FLOW_CHART_OFF_PAGE_CONNECTOR',
  selected: true,
  opacity: 1,
  classType: FlowChartOffPageConnector,
  TOP: 0,
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
    this.toolName = 'FLOW_CHART_OFF_PAGE_CONNECTOR';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartOffPageConnector;
    this.TOP = 0;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
    }
  },
  clone: function() {
    return new FlowChartOffPageConnector(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var path = 'M ' + (this.rectDimension.left) + ' ' //mid left (ML) corner X
                + (this.rectDimension.top + (this.rectDimension.height/2)) + ' ' //ML corner Y
                + 'V ' + (this.rectDimension.top) + ' ' //Vertical line
                + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //Horiz line
                + 'V ' + (this.rectDimension.top + (this.rectDimension.height/2)) + ' '//V line
                + 'L ' + (this.rectDimension.left + (this.rectDimension.width/2)) + ' '
                + (this.rectDimension.top + this.rectDimension.height) + ' '
                + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_OFF_PAGE_CONNECTOR_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_OFF_PAGE_CONNECTOR_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 15 V 5 H 40 V 15 L 25 25 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='32' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">OFF-PAGE</text>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">CONNECTOR</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartOR: An OR node in a flowchart
 * @constructor
 */
var FlowChartOR = Class.create({
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
  toolName: 'FLOW_CHART_OR',
  selected: true,
  opacity: 1,
  classType: FlowChartOR,
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
    this.toolName = 'FLOW_CHART_OR';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartOR;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    return new FlowChartOR(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    this.line = svg.append('circle')
      .attr('id', this.id)
      .attr('cx', this.cx)
      .attr('cy', this.cy)
      .attr('r', this.r)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    this.line1 = svg.append('line')
      .attr('id', this.id + '_line1')
      .attr('x1', this.cx - this.r)
      .attr('y1', this.cy)
      .attr('x2', this.cx + this.r)
      .attr('y2', this.cy)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

    this.line2 = svg.append('line')
      .attr('id', this.id + '_line2')
      .attr('x1', this.cx)
      .attr('y1', this.cy - this.r)
      .attr('x2', this.cx)
      .attr('y2', this.cy + this.r)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

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

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    this.line1
      .attr('x1', this.cx - this.r)
      .attr('y1', this.cy)
      .attr('x2', this.cx + this.r)
      .attr('y2', this.cy);

    this.line2
      .attr('x1', this.cx)
      .attr('y1', this.cy - this.r)
      .attr('x2', this.cx)
      .attr('y2', this.cy + this.r);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5));
    this.ports[this.LEFT].moveTo((this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);
    this.rectDimension.width = parseInt(bBox.width);
    this.rectDimension.height = parseInt(bBox.height);

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    this.line1
      .attr('x1', this.cx - this.r)
      .attr('y1', this.cy)
      .attr('x2', this.cx + this.r)
      .attr('y2', this.cy);

    this.line2
      .attr('x1', this.cx)
      .attr('y1', this.cy - this.r)
      .attr('x2', this.cx)
      .attr('y2', this.cy + this.r);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5));
    this.ports[this.LEFT].moveTo((this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.line1.attr('visibility', 'hidden');
    this.line2.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.line1.attr('visibility', 'hidden');
    this.line2.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.line1.attr('visibility', 'hidden');
    this.line2.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onDrop: function(obj){
    this.line1.attr('visibility', 'visible');
    this.line2.attr('visibility', 'visible');
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
                      },
                      { recid: 15, propName: 'CX', propValue: this.cx,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 16, propName: 'CY', propValue: this.cy,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 17, propName: 'Radius', propValue: this.r,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
            ]
          }
        },
        { recid: 18, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 19, propName: 'Title', propValue: this.title},
                      { recid: 20, propName: 'Description', propValue: this.description}
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
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Fill Color"){
      this.fillColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Opacity"){
      this.opacity = parseFloat(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
      this.line1.attr('id', this.id + '_line1');
      this.line2.attr('id', this.id + '_line2');
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
    this.line1.remove();
    this.line2.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_OR_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_OR_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <circle cx='25' cy='19' r='12'
                        style='stroke: black; stroke-width: 2px; fill: none;'></circle>
                      <line x1='13' y1='19' x2='37' y2='19'
                        style='stroke: black; stroke-width: 2px;'></line>
                      <line x1='25' y1='7' x2='25' y2='31'
                        style='stroke: black; stroke-width: 2px;'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">OR</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartAND: An AND node in a flowchart
 * @constructor
 */
var FlowChartAND = Class.create({
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
  toolName: 'FLOW_CHART_AND',
  selected: true,
  opacity: 1,
  classType: FlowChartAND,
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
  showPortsLabel: false,
  ANGLE1: 45,
  ANGLE2: 135,
  ANGLE3: 225,
  ANGLE4: 315,
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
    this.toolName = 'FLOW_CHART_AND';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartAND;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    this.showPortsLabel = false;
    this.ANGLE1 = Math.PI * 45 / 180;
    this.ANGLE2 = Math.PI * 135 / 180;
    this.ANGLE3 = Math.PI * 225 / 180;
    this.ANGLE4 = Math.PI * 315 / 180;

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5), 'BOTTOM', false);
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    return new FlowChartAND(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    this.line = svg.append('circle')
      .attr('id', this.id)
      .attr('cx', this.cx)
      .attr('cy', this.cy)
      .attr('r', this.r)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + ';fill-opacity: ' + this.opacity)
      .attr('data-type', 'node-base')
      //.attr('class', 'drag-svg')
      .attr('parentElement', this.parentElement.id)
      .attr('title', this.title)
      .attr('description', this.description)
      .attr('shapeType', this.shapeType)
      .attr('toolName', this.toolName)
      .attr('selected', this.selected);

    var line1X1 = this.cx + this.r * Math.cos(this.ANGLE1);
    var line1Y1 = this.cy - this.r * Math.sin(this.ANGLE1);
    var line1X2 = this.cx + this.r * Math.cos(this.ANGLE3);
    var line1Y2 = this.cy - this.r * Math.sin(this.ANGLE3);

    this.line1 = svg.append('line')
      .attr('id', this.id + '_line1')
      .attr('x1', line1X1)
      .attr('y1', line1Y1)
      .attr('x2', line1X2)
      .attr('y2', line1Y2)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

    var line2X1 = this.cx - this.r * Math.cos(this.ANGLE2);
    var line2Y1 = this.cy + this.r * Math.sin(this.ANGLE2);
    var line2X2 = this.cx - this.r * Math.cos(this.ANGLE4);
    var line2Y2 = this.cy + this.r * Math.sin(this.ANGLE4);

    this.line2 = svg.append('line')
      .attr('id', this.id + '_line2')
      .attr('x1', line2X1)
      .attr('y1', line2Y1)
      .attr('x2', line2X2)
      .attr('y2', line2Y2)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

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

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);

    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    var line1X1 = this.cx + this.r * Math.cos(this.ANGLE1);
    var line1Y1 = this.cy - this.r * Math.sin(this.ANGLE1);
    var line1X2 = this.cx + this.r * Math.cos(this.ANGLE3);
    var line1Y2 = this.cy - this.r * Math.sin(this.ANGLE3);

    var line2X1 = this.cx - this.r * Math.cos(this.ANGLE2);
    var line2Y1 = this.cy + this.r * Math.sin(this.ANGLE2);
    var line2X2 = this.cx - this.r * Math.cos(this.ANGLE4);
    var line2Y2 = this.cy + this.r * Math.sin(this.ANGLE4);

    this.line1
      .attr('x1', line1X1)
      .attr('y1', line1Y1)
      .attr('x2', line1X2)
      .attr('y2', line1Y2);

    this.line2
      .attr('x1', line2X1)
      .attr('y1', line2Y1)
      .attr('x2', line2X2)
      .attr('y2', line2Y2);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5));
    this.ports[this.LEFT].moveTo((this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);
    this.rectDimension.width = parseInt(bBox.width);
    this.rectDimension.height = parseInt(bBox.height);

    this.cx = (this.rectDimension.left + (this.rectDimension.width/2));
    this.cy = (this.rectDimension.top + (this.rectDimension.height/2));
    this.r = (this.rectDimension.width/2);
    if((this.rectDimension.height/2) < this.r) {
      this.r = (this.rectDimension.height/2);
    }

    var line1X1 = this.cx + this.r * Math.cos(this.ANGLE1);
    var line1Y1 = this.cy - this.r * Math.sin(this.ANGLE1);
    var line1X2 = this.cx + this.r * Math.cos(this.ANGLE3);
    var line1Y2 = this.cy - this.r * Math.sin(this.ANGLE3);

    var line2X1 = this.cx - this.r * Math.cos(this.ANGLE2);
    var line2Y1 = this.cy + this.r * Math.sin(this.ANGLE2);
    var line2X2 = this.cx - this.r * Math.cos(this.ANGLE4);
    var line2Y2 = this.cy + this.r * Math.sin(this.ANGLE4);

    this.line1
      .attr('x1', line1X1)
      .attr('y1', line1Y1)
      .attr('x2', line1X2)
      .attr('y2', line1Y2);

    this.line2
      .attr('x1', line2X1)
      .attr('y1', line2Y1)
      .attr('x2', line2X2)
      .attr('y2', line2Y2);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.TOP].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy - this.r - 5));
    this.ports[this.BOTTOM].moveTo((this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.cy + this.r - 5));
    this.ports[this.LEFT].moveTo((this.cx - this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.cx + this.r - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.line1.attr('visibility', 'hidden');
    this.line2.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.line1.attr('visibility', 'hidden');
    this.line2.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.line1.attr('visibility', 'hidden');
    this.line2.attr('visibility', 'hidden');
    this.text.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onDrop: function(obj){
    this.line1.attr('visibility', 'visible');
    this.line2.attr('visibility', 'visible');
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
                      },
                      { recid: 15, propName: 'CX', propValue: this.cx,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 16, propName: 'CY', propValue: this.cy,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
                      { recid: 17, propName: 'Radius', propValue: this.r,
                          w2ui: { editable: false,
                                  style: "color: grey"
                                }
                      },
            ]
          }
        },
        { recid: 18, propName: 'Details',
          w2ui: {
            children: [
                      { recid: 19, propName: 'Title', propValue: this.title},
                      { recid: 20, propName: 'Description', propValue: this.description}
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
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Fill Color"){
      this.fillColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Opacity"){
      this.opacity = parseFloat(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.line1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.line2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
      this.line1.attr('id', this.id + '_line1');
      this.line2.attr('id', this.id + '_line2');
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
    this.line1.remove();
    this.line2.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_AND_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_AND_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <circle cx='25' cy='19' r='12'
                        style='stroke: black; stroke-width: 2px; fill: none;'></circle>
                      <line x1='33' y1='10.5' x2='16.5' y2='27'
                        style='stroke: black; stroke-width: 2px;'></line>
                      <line x1='33' y1='27' x2='16' y2='10.5'
                        style='stroke: black; stroke-width: 2px;'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">AND</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartCollate: An collate node in a flowchart
 * @constructor
 */
var FlowChartCollate = Class.create({
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
  toolName: 'FLOW_CHART_COLLATE',
  selected: true,
  opacity: 1,
  classType: FlowChartCollate,
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
    this.toolName = 'FLOW_CHART_COLLATE';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartCollate;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartCollate(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var path = 'M ' + (this.rectDimension.left) + ' ' //TL corner X
            + (this.rectDimension.top) + ' ' //TL corner Y
            + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //Horiz line
            + 'L ' + (this.rectDimension.left + (this.rectDimension.width/2)) + ' '//Mid X
            + (this.rectDimension.top + (this.rectDimension.height/2) - 2) + ' '//Mid Y
            + 'Z '
            + 'M ' + (this.rectDimension.left) + ' ' //Move to LB X
            + (this.rectDimension.top + this.rectDimension.height) + ' ' //Move to LB Y
            + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //Horiz line
            + 'L ' + (this.rectDimension.left + (this.rectDimension.width/2)) + ' '//Mid X
            + (this.rectDimension.top + (this.rectDimension.height/2) + 4) + ' '//Mid Y
            + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_COLLATE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_COLLATE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 10 H 40 L 25 18 Z M 10 28 H 40 L 25 20 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">COLLATE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartSort: An sort node in a flowchart
 * @constructor
 */
var FlowChartSort = Class.create({
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
  toolName: 'FLOW_CHART_SORT',
  selected: true,
  opacity: 1,
  classType: FlowChartSort,
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
    this.toolName = 'FLOW_CHART_SORT';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartSort;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartSort(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var path = 'M ' + (this.rectDimension.left) + ' ' //Mid X
          + (this.rectDimension.top + (this.rectDimension.height/2) - 2) + ' ' //Mid Y
          + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' '//Horiz line
          + 'L ' + (this.rectDimension.left + (this.rectDimension.width/2)) + ' ' //TM X
          + (this.rectDimension.top) + ' ' //TM Y
          + 'Z '
          + 'M ' + (this.rectDimension.left) + ' ' //Mid X
          + (this.rectDimension.top + (this.rectDimension.height/2) + 4) + ' ' //Mid Y
          + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' ' //Horiz Line
          + 'L ' + (this.rectDimension.left + (this.rectDimension.width/2)) + ' ' //BM X
          + (this.rectDimension.top + this.rectDimension.height) + ' ' //BM Y
          + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_SORT_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_SORT_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 17 H 40 L 25 10 Z M 10 21 H 40 L 25 28 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">SORT</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartMerge: An merge node in a flowchart
 * @constructor
 */
var FlowChartMerge = Class.create({
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
  toolName: 'FLOW_CHART_MERGE',
  selected: true,
  opacity: 1,
  classType: FlowChartMerge,
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
    this.toolName = 'FLOW_CHART_MERGE';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartMerge;
    this.TOP = 0;
    this.BOTTOM = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.TOP] = new Port(this.id + '_top', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top - 5), 'TOP', false);
      this.ports[this.BOTTOM] = new Port(this.id + '_bottom', this, (this.rectDimension.left + (this.rectDimension.width/2) - 5), (this.rectDimension.top + this.rectDimension.height - 5), 'BOTTOM', false);
    }
  },
  clone: function() {
    return new FlowChartMerge(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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

    var path = 'M ' + (this.rectDimension.left) + ' ' //TL X
          + (this.rectDimension.top) + ' ' //TL Y
          + 'H ' + (this.rectDimension.left + this.rectDimension.width) + ' '//Horiz line
          + 'L ' + (this.rectDimension.left + (this.rectDimension.width/2)) + ' ' //BM X
          + (this.rectDimension.top + this.rectDimension.height) + ' ' //BM Y
          + 'Z';

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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_MERGE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_MERGE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 10 H 40 L 25 28 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">MERGE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartInternalStorage: An internal storage node in a flowchart
 * @constructor
 */
var FlowChartInternalStorage = Class.create({
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
  toolName: 'FLOW_CHART_INTERNAL_STORAGE',
  selected: true,
  opacity: 1,
  classType: FlowChartInternalStorage,
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
    this.toolName = 'FLOW_CHART_INTERNAL_STORAGE';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartInternalStorage;
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
  clone: function() {
    return new FlowChartInternalStorage(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
      .attr('x1', this.rectDimension.left)
      .attr('y1', this.rectDimension.top + 20)
      .attr('x2', this.rectDimension.left + this.rectDimension.width)
      .attr('y2', this.rectDimension.top + 20)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

    this.vLine2 = svg.append('line')
      .attr('id', this.id + '_vline2')
      .attr('x1', this.rectDimension.left + 20)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + 20)
      .attr('y2', this.rectDimension.top + this.rectDimension.height)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');

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
      .attr('x1', this.rectDimension.left)
      .attr('y1', this.rectDimension.top + 20)
      .attr('x2', this.rectDimension.left + this.rectDimension.width)
      .attr('y2', this.rectDimension.top + 20);

    this.vLine2
      .attr('x1', this.rectDimension.left + 20)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + 20)
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
      .attr('x1', this.rectDimension.left)
      .attr('y1', this.rectDimension.top + 20)
      .attr('x2', this.rectDimension.left + this.rectDimension.width)
      .attr('y2', this.rectDimension.top + 20);

    this.vLine2
      .attr('x1', this.rectDimension.left + 20)
      .attr('y1', this.rectDimension.top)
      .attr('x2', this.rectDimension.left + 20)
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Fill Color"){
      this.fillColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
    } else if(propName === "Opacity"){
      this.opacity = parseFloat(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.vLine1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
      this.vLine2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;');
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.TOP].rename(this.id + '_top');
      this.ports[this.BOTTOM].rename(this.id + '_bottom');
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
      this.vLine1.attr('id', this.id + '_vline1');
      this.vLine2.attr('id', this.id + '_vline2');
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
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_INTERNAL_STORAGE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_INTERNAL_STORAGE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <rect x='10' y='5' height='18' width='30'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></rect>
                      <line x1='10' y1='10' x2='40' y2='10'
                        style='stroke: black; stroke-width: 2px'></line>
                      <line x1='15' y1='5' x2='15' y2='23'
                        style='stroke: black; stroke-width: 2px'></line>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='32' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">INTERNAL</text>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.45em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">STORAGE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});

/**
 * FlowChartDatabase: An database node in a flowchart
 * @constructor
 */
var FlowChartDatabase = Class.create({
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
  toolName: 'FLOW_CHART_DATABASE',
  selected: true,
  opacity: 1,
  classType: FlowChartDatabase,
  LEFT: 0,
  RIGHT: 1,
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
    this.toolName = 'FLOW_CHART_DATABASE';
    this.selected = true;
    this.opacity = opacity || 1;
    this.classType = FlowChartDatabase;
    this.LEFT = 0;
    this.RIGHT = 1;
    this.showPortsLabel = false;

    if(this.ports.length === 0) {
      this.ports[this.LEFT] = new Port(this.id + '_left', this, (this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'LEFT', false);
      this.ports[this.RIGHT] = new Port(this.id + '_right', this, (this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5), 'RIGHT', false);
    }
  },
  clone: function() {
    return new FlowChartDatabase(this.id + '_copy', this.parentElement,
                                   new RectDimension(
                                                     this.rectDimension.left + 10,
                                                     this.rectDimension.top + 10,
                                                     this.rectDimension.height,
                                                     this.rectDimension.width),
                                   [], this.title, this.lineColor, this.lineWidth,
                                   this.lineStroke, this.fillColor, this.opacity,
                                   this.description);
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
  _calculateCurvePath: function(index, ydelta) {
    return 'M ' + (this.rectDimension.left) + ' '
      + (this.rectDimension.top + ydelta + (index * 10)) + ' '
      + 'C ' + (this.rectDimension.left + 10) + ' '
      + (this.rectDimension.top + (2 * ydelta) + (index * 10)) + ' '
      + (this.rectDimension.left + this.rectDimension.width - 10) + ' '
      + (this.rectDimension.top + (2 * ydelta) + (index * 10)) + ' '
      + (this.rectDimension.left + this.rectDimension.width) + ' '
      + (this.rectDimension.top + ydelta + (index * 10));
  },
  makeElement: function() {

    var svg_id = '#' + this.parentElement.id + '_svg';
    //Points the same thing but in D3 format
    var svg = d3.select(svg_id);

    var ydelta = this.rectDimension.width/8;

    var path = 'M ' + (this.rectDimension.left) + ' ' //LT corner X
      + (this.rectDimension.top + ydelta) + ' ' //LT corner Y
      + 'C ' + (this.rectDimension.left + 10) + ' ' //curve 1 point 1 X
      + (this.rectDimension.top) + ' ' //curve 1 point 1 Y
      + (this.rectDimension.left + this.rectDimension.width - 10) + ' '//curve 1 point 2 X
      + (this.rectDimension.top) + ' ' //curve 1 point 2 Y
      + (this.rectDimension.left + this.rectDimension.width) + ' ' //curve 1 end point X
      + (this.rectDimension.top + ydelta)
      + 'V ' + (this.rectDimension.top + this.rectDimension.height - ydelta) + ' '//Vertic line
      + 'C ' + (this.rectDimension.left + this.rectDimension.width - 10) + ' '//curve2 point1 X
      + (this.rectDimension.top + this.rectDimension.height) + ' ' //curve2 point 1 Y
      + (this.rectDimension.left + 10) + ' ' //curve 2 point 2 X
      + (this.rectDimension.top + this.rectDimension.height) + ' ' //curve 2 point 2 Y
      + (this.rectDimension.left) + ' ' //curve 2 end point X
      + (this.rectDimension.top + this.rectDimension.height - ydelta) + ' ' //curve2 endpoint Y
      + 'Z';

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

    var curve1Path = this._calculateCurvePath(0, ydelta);

    this.curve1 = svg.append('path')
      .attr('id', this.id + '_curve1')
      .attr('d', curve1Path)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');

    var curve2Path = this._calculateCurvePath(1, ydelta);

    this.curve2 = svg.append('path')
      .attr('id', this.id + '_curve2')
      .attr('d', curve2Path)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');

    var curve3Path = this._calculateCurvePath(2, ydelta);

    this.curve3 = svg.append('path')
      .attr('id', this.id + '_curve3')
      .attr('d', curve3Path)
      .attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');

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

    var ydelta = this.rectDimension.width/8;
    var curve1Path = this._calculateCurvePath(0, ydelta);
    var curve2Path = this._calculateCurvePath(1, ydelta);
    var curve3Path = this._calculateCurvePath(2, ydelta);

    this.curve1.attr('d', curve1Path);
    this.curve2.attr('d', curve2Path);
    this.curve3.attr('d', curve3Path);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  setCoordinates: function(dx, dy){
    var element = document.getElementById(this.id);
    var bBox = element.getBBox();

    this.rectDimension.left = parseInt(bBox.x);
    this.rectDimension.top = parseInt(bBox.y);

    var ydelta = this.rectDimension.width/8;
    var curve1Path = this._calculateCurvePath(0, ydelta);
    var curve2Path = this._calculateCurvePath(1, ydelta);
    var curve3Path = this._calculateCurvePath(2, ydelta);

    this.curve1.attr('d', curve1Path);
    this.curve2.attr('d', curve2Path);
    this.curve3.attr('d', curve3Path);

    this.text
      .attr('x', this.rectDimension.left + (this.rectDimension.width/2))
      .attr('y', this.rectDimension.top + (this.rectDimension.height/2) + 5);

    this.ports[this.LEFT].moveTo((this.rectDimension.left - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
    this.ports[this.RIGHT].moveTo((this.rectDimension.left + this.rectDimension.width - 5), (this.rectDimension.top + (this.rectDimension.height/2) - 5));
  },
  onMove: function(dx, dy){
    this.text.attr('visibility', 'hidden');
    this.curve1.attr('visibility', 'hidden');
    this.curve2.attr('visibility', 'hidden');
    this.curve3.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onResize: function(dx, dy, obj){
    this.text.attr('visibility', 'hidden');
    this.curve1.attr('visibility', 'hidden');
    this.curve2.attr('visibility', 'hidden');
    this.curve3.attr('visibility', 'hidden');
    this.ports.forEach(function(port){
      port.hide();
    });
  },
  onRotate: function(obj){
    this.text.attr('visibility', 'hidden');
    this.curve1.attr('visibility', 'hidden');
    this.curve2.attr('visibility', 'hidden');
    this.curve3.attr('visibility', 'hidden');
  },
  onDrop: function(obj){
    this.text.attr('visibility', 'visible');
    this.curve1.attr('visibility', 'visible');
    this.curve2.attr('visibility', 'visible');
    this.curve3.attr('visibility', 'visible');
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
                      { recid: 2, propName: 'Id', propValue: this.id},
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
      this.curve1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve3.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
    } else if(propName === "Stroke Width"){
      this.lineWidth = parseInt(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.curve1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve3.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
    } else if(propName === "Fill Color"){
      this.fillColor = '#' + propValue;
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.curve1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve3.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
    } else if(propName === "Opacity"){
      this.opacity = parseFloat(propValue);
      this.line.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: ' + this.fillColor + '; fill-opacity: ' + this.opacity);
      this.curve1.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve2.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
      this.curve3.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px; fill: none');
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
    } else if(propName === 'Id'){
      this.id = propValue;
      this.line.attr('id', this.id);
      this.ports[this.LEFT].rename(this.id + '_left');
      this.ports[this.RIGHT].rename(this.id + '_right');
      this.curve1.attr('id', this.id + '_curve1');
      this.curve2.attr('id', this.id + '_curve2');
      this.curve3.attr('id', this.id + '_curve3');
    }
  },
  destroy: function() {
    var that = this;
    this.ports.forEach(function(port){
      that.parentElement.removePort(port);
    });
    this.text.remove();
    this.curve1.remove();
    this.curve2.remove();
    this.curve3.remove();
  },
  renderToolItem: function() {
    var html = '';
    html += "<label for='" + this.parentElement.id + "_FLOW_CHART_DATABASE_tool' >";
    html += `<input type='radio' name='tools' id='` +
      this.parentElement.id + "_FLOW_CHART_DATABASE_tool";
    html += "'>";
    html += "</input>";
    html += `<div class="tool-button">
                    <svg style='width: 50px; height: 50px;'>
                      <path d = 'M 10 14 C 12 10 38 10 40 14 V 28 C 38 32 12 32 10 28 Z'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <path d = 'M 10 14 C 12 18 38 18 40 14'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <path d = 'M 10 17 C 12 21 38 21 40 17'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <path d = 'M 10 20 C 12 24 38 24 40 20'
                        style='stroke: black; stroke-width: 2px; fill:none'
                        ></path>
                      <text alignment-baseline="central" text-anchor="middle" x='50%' y='40' font-size='.55em' style='stroke:none;fill:black' font-family="Arial, Helvetica, sans-serif">DATABASE</text>
                    </svg>
                 </div>`;
    html += "</label>";
    return html;
  }
});
