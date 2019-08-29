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
    initialize: function(id, container_id, height, width, items, grid) {
        this.id = id;
        this.container_id = container_id;
        this.height = height;
        this.width = width;
        this.items = items || [];
        this.grid = grid || [10, 10];
	this.drag_items = {};
    },
    /*
     * Method: init_node
     * Description: Adds an node or edge node to canvas before
     * it is rendered. If you wish to add node after canvas
     * has been rendered, please use add_node()
     */
    initNode: function(node) {
        this.items.push(node);
    },
    /*
     * Method: add_node
     * Description: Adds an node to canvas after canvas is
     * rendered. This function adds selectable, resizable,
     * etc operations once node is added
     */
    addNode: function(node){
	this.items.push(node);
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
     * Method: remove_node
     * Description: Removes an node from the array
     */
    removeNode: function(node) {
        var index = this.items.indexOf(node);
        this.items.splice(index, 1);
	var node_to_remove = document.getElementById(node.id);
	if(node_to_remove != undefined){
		node_to_remove.parentNode.removeChild(node_to_remove);
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
        html += ">";
	/*Iterate through all the child nodes or edges of
	 * canvas and render each of it by concatnating its
	 * HTML to canvas's HTML
	 */
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
        for(var i=0; i < this.items.length; i++){
            this.items[i].registerPortHighlighters();
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
    		filter: '.adorner-invisible',
            lasso: false
    	});

	/*Make nodes draggable*/
	this.draggable();

	/*An pointer to current class instance to be used
	 * in the following anonyomus class
	 */
        var that = this;
    	this.selectable.on('selecteditem', function(item){
    		var childs = $j(item.node).children("[class*='adorner']");
    		childs.each(function(index, value){
    			value.style.display = 'inline';
    		});
	    /*Apply resizable and rotateable function to
	     * the selected item on canvas
	     */
            that.resizable(item.node.id, that.draggables);
            that.rotatable(item.node.id, that.draggables);
    	});
    	this.selectable.on('deselecteditem', function(item){
                    var childs = $j(item.node).children("[class*='adorner']");
                    childs.each(function(index, value) {
                        value.style.display = 'none';
                    });
    	});
    },
    draggable: function(){
	/*Make all items on canvas as draggable*/
        this.draggables = $j('.adorner-invisible').draggabilly({
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
    },
    resizable: function(div, draggable) {
        const element = document.getElementById(div);
        var index = div.indexOf('_node_adorner');
        var item_id = div.substring(0, index);
        var resizer_id = item_id + "_br_adorner";
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
    rotatable: function(div, draggable){
        var pointer = document.getElementById(div);
        var index = div.indexOf('_node_adorner');
        var item_id = div.substring(0, index);
        var rotater_id = item_id + "_rotate_adorner";
        const rotater = document.getElementById(rotater_id);
        var pointerBox = pointer.getBoundingClientRect();
        var centerPoint = window.getComputedStyle(pointer).transformOrigin;
        var centers = centerPoint.split(" ");
        var centerY = pointerBox.top + parseInt(centers[1]) - window.pageYOffset;
        var centerX = pointerBox.left + parseInt(centers[0]) - window.pageXOffset;

        rotater.addEventListener('touchstart', startRotate, false);
        rotater.addEventListener('mousedown', startRotate, false);
        that = this;
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
            that.drag_items[div] = pointer.style.transform;
        }
        function stopRotate(e){
            window.removeEventListener('mousemove', rotate);
            window.removeEventListener('touchmove', rotate);
            draggable.draggabilly('enable');
        }
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
    NODE_TAG: '<div id="{0}" class="node" ><div class="node_header"><span>{1}</span></div>{2}</div>',
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
	canConnect: function(edge){
        	const port = document.getElementById(this.id);
        	var portBox = port.getBoundingClientRect();
		if(edge.x > portBox.left && edge.y > portBox.top && edge.x < (portBox.left + portBox.width) && edge.y < (portBox.top + portBox.height)){
			return true;
		} else {
			return false;
		}
	},
	connect: function(edge){
		this.connectedTo = edge;
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
    elementLeft: undefined,
    elementRight: undefined,
    lineColor: "Black",
    lineWidth: "1px",
    lineStroke: "Solid",
    initialize: function(id, elementLeft, elementRight, title, lineColor, lineWidth, lineStroke, hasArrow, ArrowEnd, description){
        this.id = id;
        this.title = title || "";
        this.description = description || "";
        this.hasArrow = hasArrow || true;
        this.arrowEnd = arrowEnd || "RIGHT";
        this.startX = "0px";
        this.startY = "0px";
        this.endX = "0px";
        this.endY = "0px";
        this.elementLeft = elementLeft;
        this.elementRight = elementRight;
        this.lineColor = lineColor || "Black";
        this.lineWidth = lineWidth || "1px";
        this.lineStroke = lineStroke || "Solid";
    }
});
