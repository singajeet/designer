/******************************************************************************
 * Dragging functionality from the below source:
 * https://raw.githubusercontent.com/petercollingridge/code-for-blog/master/svg-interaction/draggable/draggable_restricted.svg
 *
 * Changes made to use it in the designer library
 * Changed by: Ajeet Singh
 * Date: 09/04/2019
 ******************************************************************************/

/*******************************************************************************
 * Makes the parameter "item" (an HTML or SVG element) as draggable over the
 * "canvas" passed as argument too
 *******************************************************************************/
	var dragEnabled = true;
	function dispose(svg, item){
		svg = undefined;
		item.removeEventListener('mousedown', startDrag);
		item.removeEventListener('mousemove', drag);
		item.removeEventListener('mouseup', endDrag);
        	item.removeEventListener('mouseleave', endDrag);
        	item.removeEventListener('touchstart', startDrag);
        	item.removeEventListener('touchmove', drag);
        	item.removeEventListener('touchend', endDrag);
        	item.removeEventListener('touchleave', endDrag);
        	item.removeEventListener('touchcancel', endDrag);
		item = undefined;
		drag_enabled = false;
	}
	function makeDraggable(svg, item) {
        	item.addEventListener('mousedown', startDrag);
        	item.addEventListener('mousemove', drag);
        	item.addEventListener('mouseup', endDrag);
        	item.addEventListener('mouseleave', endDrag);
        	item.addEventListener('touchstart', startDrag);
        	item.addEventListener('touchmove', drag);
        	item.addEventListener('touchend', endDrag);
        	item.addEventListener('touchleave', endDrag);
        	item.addEventListener('touchcancel', endDrag);

		var selectedElement, offset, transform;
        	function getMousePosition(evt) {
          		var CTM = svg.getScreenCTM();
          		if (evt.touches) { evt = evt.touches[0]; }
          		return {
            			x: (evt.clientX - CTM.e) / CTM.a,
            			y: (evt.clientY - CTM.f) / CTM.d
          		};
        	}

        	function startDrag(evt) {
          		selectedElement = item;
            		
			if(selectedElement.nodeName === 'line' ||
               		selectedElement.nodeName === 'rect' ||
               		selectedElement.nodeName === 'image')
			{
                  		selectedElement = evt.target.parentNode;
            		}
            		offset = getMousePosition(evt);
            		// Make sure the first transform on the element is a translate transform
            		var transforms = selectedElement.transform.baseVal;

            		if (transforms.length === 0 || 
			transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
              			// Create an transform that translates by (0, 0)
              			var translate = svg.createSVGTransform();
              			translate.setTranslate(0, 0);
              			selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            		}

            		// Get initial translation
            		transform = transforms.getItem(0);
            		offset.x -= transform.matrix.e;
            		offset.y -= transform.matrix.f;
        	}

        	function drag(evt) {
			if(!dragEnabled){
				return;
			}
          		if (selectedElement) {
            			evt.preventDefault();

            			var coord = getMousePosition(evt);
            			var dx = coord.x - offset.x;
            			var dy = coord.y - offset.y;

            			transform.setTranslate(dx, dy);
				selectedElement.style.left = coord.x;
				selectedElement.style.top = coord.y;
				selectedElement.style.bottom = selectedElement.style.bottom;
				selectedElement.style.right = selectedElement.style.right;
          		}
        	}

        	function endDrag(evt) {
          		selectedElement = false;
        	}
	}
