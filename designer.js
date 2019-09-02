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
     * 	Constructor
     *					id (string):           A unique identifier for the canvas
     *					container_id (string): Id of the parent container, if not
     *											provided Canvas will be attached to
     *											body of the page
     *					height (string): 		Height of the canvas with unit
     *					width (string): 		Width of the canvas with unit
     *					items (Array): 			A list of direct child elements
     *					grid (Array): 			Size of each cell in the grid (in pixels)
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
    initEdge: function(edge){
	    this.edges.push(edge);
    },
    /*
     * Method: addEdge
     * Description: Adds an edge to canvas after canvas is
     * rendered. This function adds selectable, resizable,
     * etc operations once edge is added
     */
    addEdge: function(edge){
	    this.edges.push(edge);
	    edge.render();
    },
    /*
     * Method: removeEdge
     * Description: Removes an edge from the array
     */
    removeEdge: function(edge){
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
    addNode: function(node){
    	this.nodes.push(node);
    	var added_node = $j(node.render());
    	if(this.container_id != undefined){
    		var container = $j(('#' + this.container_id));
    		added_node.appendTo(container);
    	} else {
    		added_node.appendTo($j('body'));
    	}
    	if(this.selectable != undefined){
    		this.selectable.add(added_node);
    	}
    	if(this.draggables != undefined){
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
    	if(nodeToRemove != undefined){
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
        for(var i=0; i < this.nodes.length; i++){
            this.nodes[i].registerPortHighlighters();
        }
    	for(var i=0; i < this.edges.length; i++){
    		this.edges[i].render();
    	}
        this.addActions();
    },
    /*
     * Method: add_actions
     * Description: Makes all direct child elements as selectable, draggable, Rotatable and resizable
     */
    addActions: function() {

	   /*Make all items on canvas as selectable*/
    	this.selectable = new Selectable({
    		filter: '.ui-selectable',
            lasso: false
    	});

    	/*Make nodes draggable*/
    	this.draggable();

    	/*An pointer to current class instance to be used
    	 * in the following anonyomus class
    	 */
        var that = this;
    	this.selectable.on('selecteditem', function(item){
            if(item.node.nodeName === 'DIV'){
    			var childs = $j(item.node).children("[class*='adorner']");
    			childs.each(function(index, value){
    				value.style.display = 'inline';
    			});
	    		/*Apply resizable and rotateable function to
	     		* the selected item on canvas
	     		*/
            	that.resizable(item.node.id, that.draggables);
            	that.rotatable(item.node.id, that.draggables);
    		}
    	});
    	this.selectable.on('deselecteditem', function(item){
            if(item.node.nodeName === 'DIV'){
                var childs = $j(item.node).children("[class*='adorner']");
                childs.each(function(index, value) {
                    value.style.display = 'none';
                });
    		}
    	});
    },
    draggable: function(){
	   /*Make all items on canvas as draggable*/
        this.draggables = $j('.ui-draggable').draggabilly({
		  grid: this.grid
    	});
    	/*Due to bug in draggabilly lib, an rotated element
    	 * gets its position reset to original during drag
    	 * and after drag is done. Workaround is to save
    	 * the rotated position of element during drag start
    	 * into variable and reapply the same rotated value to
    	 * element once drag is completed
    	 */
        that = this;
    	this.draggables.on('dragStart', function(event, item){
    		var id = event.currentTarget.id;
    		var element = document.getElementById(id);
    		that.drag_items[id] = element.style.transform;
    	});
    	this.draggables.on('dragEnd', function(event, item){
    		var id = event.currentTarget.id;
    		var element = document.getElementById(id);
    		element.style.transform = that.drag_items[id];
    	});
	this.draggables.on('dragMove', function(event, item){
		var adorner_id = event.currentTarget.id;
		var element = document.getElementById(adorner_id);
		if(element.dataset['type'] === 'edge'){
			var idx = adorner_id.indexOf('_line_adorner');
			var id = adorner_id.substring(0, idx);
			for(var i=0; i < that.nodes.length; i++){
				var availPort = that.nodes[i].getNextEmptyPort();
				var edge = that.getEdge(id);
				edge.updatePosition();
				var startPoint = edge.getStartPoint();
				var endPoint = edge.getEndPoint();
				//do we have anything to disconnect first
				var allPorts = that.nodes[i].getAllPorts();
				for(var j=0; j < allPorts.length; j++){
					if(allPorts[j].isConnected){
						//check mouse point is in range of current port
						if(allPorts[j].canConnect(startPoint)){
							allPorts[j].disconnect(edge);
							that.draggables._pointerUp(event.originalEvent, item);
							return false;
						} else if(allPorts[j].canConnect(endPoint)){
							allPorts[j].disconnect(edge);
							that.draggables._pointerUp(event.originalEvent, item);
							return false;
						}
					}
				}
				if(availPort.canConnect(startPoint)){
					//edge.setStartPoint(startPoint.x, endPoint.y);
					if(!availPort.isConnected){
						availPort.connect(edge);
					} 
					that.draggables._pointerUp(event.originalEvent, item);
					return false;
				} else if(availPort.canConnect(endPoint)){
					//edge.setEndPoint(endPoint.x, endPoint.y);
					if(!availPort.isConnected){
						availPort.connect(edge);
					}
					that.draggables._pointerUp(event.originalEvent, item);
					return false;
				}
			}	
		}
	});
    },
    resizable: function(div, draggable) {
        /* Make node element as resizable */
        var index = div.indexOf('_node_adorner');
        if(index >= 0){
            item_id = div.substring(0, index);
            for(var i=0; i < this.nodes.length; i++){
                if(this.nodes[i].id === item_id){
                    this.nodes[i].resizable(draggable);
                }
            }
        } else {
            /* Make edge as resizable */
            var index = div.indexOf('_line_adorner');
            if(index >= 0){
                item_id = div.substring(0, index);
                for(var i=0; i < this.edges.length; i++){
                    if(this.edges[i].id === item_id){
                        this.edges[i].resizable(draggable);
                    }
                }
            }
        }
    },
    rotatable: function(div, draggable){
        var index = div.indexOf('_node_adorner');
        if(index >= 0){
            item_id = div.substring(0, index);
            for(var i=0; i < this.nodes.length; i++){
                if(this.nodes[i].id === item_id){
                    this.nodes[i].rotatable(this, draggable);
                }
            }
        } else {
		/* Make edge as rotatable */
		var index = div.indexOf('_line_adorner');
		if(index >= 0){
			item_id = div.substring(0, index);
			for(var i=0; i < this.edges.length; i++){
				if(this.edges[i].id === item_id){
					this.edges[i].rotatable(this, draggable);
				}
			}
		}
	}
    },
    getNode: function(id){
	    for(var i=0; i < this.nodes.length; i++){
		    if(id === this.nodes[i].id){
			    return this.nodes[i];
		    }
	    }
	    return null;
    },
    getEdge: function(id){
	    for(var i=0; i < this.edges.length; i++){
		    if(id === this.edges[i].id){
			    return this.edges[i];
		    }
	    }
    },
    getFirstPortOfNode: function(id){
	    var node = this.getNode(id);
	    return node.getFirstPort();
    },
    getAllPortsOfNode: function(id){
	    var node = this.getNode(id);
	    return node.getAllPorts();
    },
    getLastPortOfNode: function(id){
	    var node = this.getNode(id);
	    return node.getLastPort();
    },
    getNextEmptyPortOfNode: function(id){
	    var node = this.getNode(id);
	    return node.getNextEmptyPort();
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
    htmlContent: undefined,
    ports: [],
    /* CONSTANTS */
    ADORNER_INVISIBLE: '<div id="{0}_node_adorner" class="adorner-invisible ui-selectable ui-draggable" data-type="node">',
    TOP_LEFT_ADORNER: '<div id="{0}_tl_adorner" class="tl_adorner"></div> <!-- top-left -->',
    TOP_RIGHT_ADORNER: '<div id="{0}_tr_adorner" class="tr_adorner"></div> <!-- top-right -->',
    BOTTOM_LEFT_ADORNER: '<div id="{0}_bl_adorner" class="bl_adorner"></div> <!-- bottom-left -->',
    BOTTOM_RIGHT_ADORNER: '<div id="{0}_br_adorner" class="br_adorner"></div> <!-- bottom-right -->',
    TOP_MID_ADORNER: '<div id="{0}_tm_adorner" class="tm_adorner"></div> <!-- top-mid -->',
    LEFT_MID_ADORNER: '<div id="{0}_lm_adorner" class="lm_adorner"></div> <!-- left-mid -->',
    BOTTOM_MID_ADORNER: '<div id="{0}_bm_adorner" class="bm_adorner"></div> <!-- bottom-mid -->',
    RIGHT_MID_ADORNER: '<div id="{0}_rm_adorner" class="rm_adorner"></div> <!-- right-mid -->',
    ROTATE_ADORNER: '<div id="{0}_rotate_adorner" class="rotate_adorner"></div> <!-- rotate handle -->',
    NODE_TAG: '<div id="{0}" class="node" data-type="node-base" ><div class="node_header"><span>{1}</span></div>{2}</div>',
    ADORNER_INVISIBLE_END: '</div>',
    initialize: function(id, title, htmlContent, height, width) {
        this.id = id;
        this.title = title || '';
        this.htmlContent = htmlContent || undefined;
        this.height = height || undefined;
        this.width = width || undefined;
	    this.ports = [];
    },
    initPort: function(port){
	   this.ports.push(port);
    },
    removePort: function(port){
        var index = this.ports.indexOf(port);
        this.ports.splice(index, 1);
    	var portToRemove = document.getElementById(port.id);
    	if(portToRemove != undefined){
    		portToRemove.parentNode.removeChild(portToRemove);
	}
    },
    addPort: function(port){
	    var portElement = $j(port.render());
	    var node = $j(('#' + this.id));
	    this.initPort(port);
	    portElement.appendTo(node);
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
        if (this.htmlContent === undefined) {
            this.htmlContent = '';
        }
	    for(var i=0; i < this.ports.length; i++){
		  this.htmlContent += this.ports[i].render();
	    }
        html += this.NODE_TAG.format(this.id, this.title, this.htmlContent);
        html += this.ADORNER_INVISIBLE_END;
        return html;
    },
    registerPortHighlighters: function(){
        for(var i=0; i < this.ports.length; i++){
            this.ports[i].highlight();
        }
    },
    resizable: function(draggable) {
        const element = document.getElementById(this.id + '_node_adorner');
        var resizer_id = this.id + "_br_adorner";
        const resizer = document.getElementById(resizer_id);
        const minimum_size = 20;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;

        resizer.addEventListener('touchstart', startResize, false);
        resizer.addEventListener('mousedown', startResize, false);
        function startResize(e){
           draggable.draggabilly('disable');
           e.preventDefault();
           original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
           original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
           original_mouse_x = e.pageX;
           original_mouse_y = e.pageY;
           if(original_mouse_x === undefined){
                var touchObj = e.changedTouches[0];
                original_mouse_x = parseInt(touchObj.clientX);
           }
           if(original_mouse_y === undefined){
                var touchObj = e.changedTouches[0];
                original_mouse_y = parseInt(touchObj.clientY);
           }
            window.addEventListener('touchmove', resize);
            window.addEventListener('mousemove', resize);

            window.addEventListener('touchend', stopResize);
            window.addEventListener('mouseup', stopResize);
        }
        function resize(e){
            var cursorX = e.pageX;
            var cursorY = e.pageY;
            if(cursorX === undefined){
                var touchObj = e.changedTouches[0];
                cursorX = parseInt(touchObj.clientX);
            }
            if(cursorY === undefined){
                var touchObj = e.changedTouches[0];
                cursorY = parseInt(touchObj.clientY);
            }
            var deltaX = (cursorX - original_mouse_x);
            var deltaY = (cursorY - original_mouse_y);
            const width = original_width + (cursorX - original_mouse_x);
            const height = original_height + (cursorY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width + 'px'
            }
            if (height > minimum_size) {
              element.style.height = height + 'px'
            }
        }
        function stopResize(){
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('touchmove', resize);
            draggable.draggabilly('enable');
        }
    },
    rotatable: function(canvas, draggable){
        const pointer = document.getElementById(this.id + '_node_adorner');
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
        function startRotate(e){
            draggable.draggabilly('disable');
            window.addEventListener('mousemove', rotate);
            window.addEventListener('touchmove', rotate);

            window.addEventListener('mouseup', stopRotate);
            window.addEventListener('touchend', stopRotate);
        }
        function rotate(e){
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
            pointer.style.transform = 'rotate('+degrees+'deg)';
            /*Somehow the value of transform attribute is becoming blank
             *after rotation is stopped, so capturing the transform
             *value during rotation process and same will be applied
             *when drag stopped
             * DOESN'T MAKE ANY SENSE BUT IT WORKS!!!
             */
            canvas.drag_items[(node.id + '_node_adorner')] = pointer.style.transform;
        }
        function stopRotate(e){
            window.removeEventListener('mousemove', rotate);
            window.removeEventListener('touchmove', rotate);
            draggable.draggabilly('enable');
        }
    },
    getFirstPort: function(){
	if(this.ports.length > 0){
		return this.ports[0];
	}
	return null;
    },
    getAllPorts: function(){
	    return this.ports;
    },
    getLastPort: function(){
	if(this.ports.length > 0){
		return this.ports[this.ports.length-1];
	}
	return null;
    },
    getNextEmptyPort: function(){
	for(var i=0; i < this.ports.length; i++){
		if(!this.ports[i].isConnected){
			return this.ports[i];
		}
	}
	return null;
    }
});

/**********************************************************
 * Defines a port on the node where an edge can be connected
 * The port should have an magnet field to itself while any
 * of the edge element passby this port
 **********************************************************/
var Port = Class.create({
	id: '',
	title: '',
	description: '',
	position: {top: '25px', left: 'auto', bottom: 'auto', right: '-5px'},
	height: '10px',
	width: '10px',
	isConnected: false,
	connectedTo: undefined,
	cssClass: 'port',
	cssStyle: '',
	initialize: function(id, position, cssClass, cssStyle, title, description, height, width){
		this.id = id;
		this.position = position || {top: '25px', left: 'auto', bottom: 'auto', right: '-5px'};
		this.cssClass = cssClass || 'port';
		this.cssStyle = cssStyle || '';
		this.title = title || '';
		this.description = description || '';
		this.height = height || '10px';
		this.width = width || '10px';
	},
	render: function(){
		var html = "<div id='" + this.id + "' ";
		html += "data-type='port' ";
		html += "class='" + this.cssClass + "' ";
		html += "style='" + this.cssStyle + "; ";
		if(this.height != '10px'){
			html += 'height: ' + this.height + '; ';
		}
		if(this.width != '10px'){
			html += 'width: ' + this.width + ';';
		}
		var isAbsolute = false;
		if(this.position.top != 'auto'){
			html += 'top: ' + this.position.top + '; ';
			isAbsolute = true;
		}
		if(this.position.left != 'auto'){
			html += 'left: ' + this.position.left + '; ';
			isAbsolute = true;
		}
		if(this.position.bottom != 'auto'){
			html += 'bottom: ' + this.position.bottom + '; ';
			isAbsolute = true;
		}
		if(this.position.right != 'auto'){
			html += 'right: ' + this.position.right + '; ';
			isAbsolute = true;
		}
		if(isAbsolute){
			html += 'position: absolute; '
		}
		html += "' ></div>";
		return html;
	},
    highlight: function(){
        var port = document.getElementById(this.id);
        window.addEventListener('mousemove', mouseMove);

        function mouseMove(e){
            var portBox = port.getBoundingClientRect();
            var pointerEvent = e;
            var mouseX = 0;
            var mouseY = 0;
            if (e.targetTouches && e.targetTouches[0]) {
              e.preventDefault();
              pointerEvent = e.targetTouches[0];
              mouseX = pointerEvent.pageX;
              mouseY = pointerEvent.pageY;
            } else {
              mouseX = e.clientX;
              mouseY = e.clientY;
            }
            if(mouseX > portBox.left && mouseY > portBox.top && mouseX < (portBox.left + portBox.width) && mouseY < (portBox.top + portBox.height)){
                port.style.background = "green";
            } else {
                port.style.background = "#EF9A9A";
            }
        }
    },
	getConnectionPoint: function(){
		var port = document.getElementById(this.id);
		var portBox = port.getBoundingClientRect();
		var x = portBox.left + (portBox.width/2);
		var y = portBox.top + (portBox.height/2);
		return {'x': x, 'y': y};
	},
	canConnect: function(point){
        const port = document.getElementById(this.id);
        var portBox = port.getBoundingClientRect();
		if(point.x > portBox.left && point.y > portBox.top && point.x < (portBox.left + portBox.width) && point.y < (portBox.top + portBox.height)){
			return true;
		} else {
			return false;
		}
	},
	connect: function(edge){
		const port = document.getElementById(this.id);
        	var portBox = port.getBoundingClientRect();
		this.connectedTo = edge;
		this.isConnected = true;
		edge.setEndPoint(portBox.left, portBox.bottom);
		port.style.background = '#81C784';
	},
	disconnect: function(edge){
		const port = document.getElementById(this.id);
		this.connectedTo = undefined;
		this.isConnected = false;
		port.style.background = "#EF9A9A";
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
    arrowEnd: "RIGHT", /*Other values are LEFT, BOTH, NONE */
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
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x1_pos: '',
    y1_pos: '',
    x2_pos: '',
    y2_pos: '',
    labelStartPoint: undefined,
    initialize: function(id, parentElement, elementLeft, elementRight, title, lineColor, lineWidth, lineStroke, hasArrow, arrowEnd, description){
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
    makeElement: function(){
	this.mainDiv = d3.select(('#' + this.parentElement.id))
                .append('div')
                .attr('id', this.id + "_line_adorner")
                .attr('class', "ui-selectable ui-draggable")
	    	.attr('data-type', 'edge')
	    	.attr('data-subtype', 'straight-line');

	this.svg = this.mainDiv.append('svg')
	    		.attr('style', 'height: ' + this.height + 'px; width: ' + this.width + 'px;');
	this.startAdorner 
		= this.mainDiv
	    	.append('div')
	    	.attr('id', this.id + '_start_adorner')
	    	.attr('class','adorner-line-unselected');

	this.labelStartPoint
	    	= this.mainDiv
	    	.append('div')
	    	.append('span')
	    	.attr('text', 'x: , y:')
	    	.attr('id', this.id + '_label_start_point');

	this.endAdorner
		= this.mainDiv
	    	.append('div')
	    	.attr('id', this.id + '_end_adorner')
	    	.attr('class','adorner-line-unselected');

	this.rotateAdorner 
		= this.mainDiv
	    	.append('div')
	    	.attr('id', this.id + '_rotate_adorner')
	    	.attr('class', 'rotate_adorner');
        
	this.svg.append('svg:defs').append('svg:marker')
            .attr("id", "arrow")
            .attr("refX", 6)
            .attr("refY", 6)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("markerUnits","userSpaceOnUse")
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 12 6 0 12 3 6")
            .style("fill", "black");
	   
	this.line = this.svg.append('line')
            .attr('id', this.id)
            .attr('x1', this.x1)
        	.attr('y1', this.y1+2)
        	.attr('x2', this.x2+5)
        	.attr('y2', this.y2-5)
        	.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;')
            .attr('marker-end', 'url(#arrow)')
	    .attr('data-type', 'edge-base');
    },
    redraw: function(){
	    var style = "position: absolute !important; "
	    this.x1 = 0;
	    this.y1 = 0;
	    this.x2 = 0;
	    this.y2 = 0;
	    if(this.startX > this.endX){
		  this.width = this.startX - this.endX;
		  style += "left: " + (this.endX-2) + "px; ";
		  this.x1 = this.width;
		  this.x2 = 0;
	    } else {
		  this.width = this.endX - this.startX;
		  style += "left: " + (this.startX-2) + "px; ";
		  this.x1 = 0;
		  this.x2 = this.width;
	    }
	    if(this.startY > this.endY){
		  this.height = this.startY - this.endY;
		  style += "top: " + this.endY + "px; ";
		  this.y1 = this.height;
		  this.y2 = 0;
	    } else {
		  this.height = this.endY - this.startY;
		  style += "top: " + this.startY + "px; ";
		  this.y1 = 0;
		  this.y2 = this.height;
	    }
	    if(this.width == 0){
		    this.width = 10;
	    }
	    if(this.height == 0){
		    this.height = 10;
	    }
	    style += "width: " + this.width + "px; ";
	    style += "height: " + this.height + "px; ";
	    style += "border: 2px transparent solid !important";
	    this.svg.attr('style', 'height: ' + this.height + 'px; width: ' + this.width + 'px;');
	    this.mainDiv.attr('style', style);

	    var adorner_start_style = '';
	    if(this.x1 == 0 && this.y1 == 0){
		    adorner_start_style = "top: -5px; left: -8px;";
		    this.x1_pos = 'left';
		    this.y1_pos = 'top';
	    } else if(this.x1 == 0 && this.y1 > 0){
		    adorner_start_style = "left: -8px; bottom: -5px;";
		    this.x1_pos = 'left';
		    this.y1_pos = 'bottom';
	    } else if(this.x1 > 0 && this.y1 > 0){
		    adorner_start_style = "bottom: -5px; right: -8px;";
		    this.x1_pos = 'right';
		    this.y1_pos = 'bottom';
	    } else if(this.x1 > 0 && this.y1 == 0){
		    adorner_start_style = "right: -8px; top: -4px;";
		    this.x1_pos = 'right';
		    this.y1_pos = 'top';
	    }
        adorner_start_style += "background: #D1C4E9;cursor: nwse-resize"
	this.startAdorner.attr('style', adorner_start_style);
	this.labelStartPoint.attr('style', adorner_start_style);

	    var adorner_end_style = '';
	    if(this.x2 == 0 && this.y2 == 0){
		    adorner_end_style = "top: -5px; left: -8px;";
		    this.x2_pos = 'left';
		    this.y2_pos = 'top';
	    } else if(this.x2 == 0 && this.y2 > 0){
		    adorner_end_style = "left: -10px; bottom: -2px;";
		    this.x2_pos = 'left';
		    this.y2_pos = 'bottom';
	    } else if(this.x2 > 0 && this.y2 > 0){
		    adorner_end_style = "bottom: -5px; right: -8px;";
		    this.x2_pos = 'right';
		    this.y2_pos = 'bottom';
	    } else if(this.x2 > 0 && this.y2 == 0){
		    adorner_end_style = "right: -8px; top: -5px;";
		    this.x2_pos = 'right';
		    this.y2_pos = 'top';
	    }
	this.endAdorner.attr('style', adorner_end_style);
	
	this.line
        	.attr('x1', this.x1+5)
        	.attr('y1', this.y1+2)
        	.attr('x2', this.x2+5)
        	.attr('y2', this.y2-5)
        	.attr('style', 'stroke: ' + this.lineColor + ';stroke-width: ' + this.lineWidth + 'px;')
            .attr('marker-end', 'url(#arrow)');
    },
    render: function(){
	    var node1 = this.parentElement.getNode(this.elementLeft.id);
	    var node2 = this.parentElement.getNode(this.elementRight.id);
	    var port1 = node1.getNextEmptyPort();
	    var port2 = node2.getNextEmptyPort();

	    /*var element1 = document.getElementById(this.elementLeft.id);
	    var element2 = document.getElementById(this.elementRight.id);
	    var ele1Pos = element1.getBoundingClientRect();
	    var ele2Pos = element2.getBoundingClientRect();*/
	    this.startX = port1.getConnectionPoint().x; //ele1Pos.right;
	    this.startY = port1.getConnectionPoint().y; //ele1Pos.bottom;
	    this.endX = port2.getConnectionPoint().x; //ele2Pos.left;
	    this.endY = port2.getConnectionPoint().y; //ele2Pos.top;
	    alert(this.startX + ',' + this.startY + ',' + this.endX + ',' + this.endY);
	    this.makeElement();
	    this.redraw();
    },
    resizable: function(draggable){
        var element = document.getElementById(this.id + '_line_adorner');
        var resizer = document.getElementById(this.id + '_start_adorner');
        var line = document.getElementById(this.id);

        let original_width = 0;
        let original_x = 0;
        let original_mouse_x = 0;
	let original_height = 0;
	let original_y = 0;
	let original_mouse_y = 0;
	let centerX = 0;
	let centerY = 0;
        resizer.addEventListener('mousedown', startResize, false);
        resizer.addEventListener('touchstart', startResize, false);

	var that = this;
        function startResize(e){
            draggable.draggabilly('disable');
            e.preventDefault();
            original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
	    original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_mouse_x = e.pageX;
	    original_mouse_y = e.pageY;
            if(original_mouse_x === undefined){
                var touchObj = e.changedTouches[0];
                original_mouse_x = parseInt(touchObj.clientX);
            }
	    if(original_mouse_y === undefined){
		var touchObj = e.changedTouches[0];
		original_mouse_y = parseInt(touchObj.clientY);
	    }
	    centerX = that.endX - window.pageXOffset;
	    centerY = that.endY - window.pageYOffset;
            window.addEventListener('touchmove', resize);
            window.addEventListener('mousemove', resize);
            window.addEventListener('touchend', stopResize);
            window.addEventListener('mouseup', stopResize);
        }

        function resize(e){
            var cursorX = e.pageX;
	    var cursorY = e.pageY;
            if(cursorX === undefined){
                var touchObj = e.changedTouches[0];
                cursorX = parseInt(touchObj.clientX);
            }
	    if(cursorY === undefined){
		var touchObj = e.changedTouches[0];
		cursorY = parseInt(touchObj.clientY);
	    }
            var deltaX = (cursorX - original_mouse_x);
	    var deltaY = (cursorY - original_mouse_y);
	    var radians = Math.atan2(cursorX - centerX, cursorY - centerY);
	    var degrees = (radians * (180 / Math.PI) * -1);
	    element.style.transform = 'rotate('+degrees+'deg)';

            const width = original_width + deltaX;
            element.style.width = width + 'px';
            line.setAttribute('x1', width);
            line.parentElement.style.width = width + 'px';
        }
        function stopResize(){
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('touchmove', resize);
            draggable.draggabilly('enable');
        }
    },
    rotatable: function(canvas, draggable){
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
        function startRotate(e){
            draggable.draggabilly('disable');
            window.addEventListener('mousemove', rotate);
            window.addEventListener('touchmove', rotate);

            window.addEventListener('mouseup', stopRotate);
            window.addEventListener('touchend', stopRotate);
        }
        function rotate(e){
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
            pointer.style.transform = 'rotate('+degrees+'deg)';
            /*Somehow the value of transform attribute is becoming blank
             *after rotation is stopped, so capturing the transform
             *value during rotation process and same will be applied
             *when drag stopped
             * DOESN'T MAKE ANY SENSE BUT IT WORKS!!!
             */
            canvas.drag_items[(node.id + '_line_adorner')] = pointer.style.transform;
        }
        function stopRotate(e){
            window.removeEventListener('mousemove', rotate);
            window.removeEventListener('touchmove', rotate);
            draggable.draggabilly('enable');
        }
    },
    setStartPoint: function(x1, y1){
	    this.startX = x1;
	    this.startY = y1;
	    this.redraw();
    },
    setEndPoint: function(x2, y2){
	    this.endX = x2;
	    this.endY = y2;
	    this.redraw();
	    var l = document.getElementById(this.id + '_line_adorner');
	    var p = l.getBoundingClientRect();
	    //alert('Arrow is now at: ' + JSON.stringify(p) +"\n" + "xy: " + x2 + "," + y2);
    },
    getStartPoint: function(){
	return {x: this.startX, y: this.startY};
    },
    getEndPoint: function(){
	return {x: this.endX, y: this.endY};
    },
    updatePosition: function(){
	    var line_adorner = document.getElementById(this.id + '_line_adorner');
	    var pos = line_adorner.getBoundingClientRect();
	    this.startX = pos[this.x1_pos];
	    this.startY = pos[this.y1_pos];
	    this.endX = pos[this.x2_pos];
	    this.endY = pos[this.y2_pos];
    }
});
