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
function makeDraggable(canvas, item, boundX1, boundY1, boundX2, boundY2) {
        var svg = canvas;

        svg.addEventListener('mousedown', startDrag);
        svg.addEventListener('mousemove', drag);
        svg.addEventListener('mouseup', endDrag);
        svg.addEventListener('mouseleave', endDrag);
        svg.addEventListener('touchstart', startDrag);
        svg.addEventListener('touchmove', drag);
        svg.addEventListener('touchend', endDrag);
        svg.addEventListener('touchleave', endDrag);
        svg.addEventListener('touchcancel', endDrag);

        var selectedElement, offset, transform,
            bbox, minX, maxX, minY, maxY, confined;

        var boundaryX1 = boundX1 || 0;
        var boundaryX2 = boundX2 || 0;
        var boundaryY1 = boundY1 || 0;
        var boundaryY2 = boundY2 || 0;

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
               selectedElement.nodeName === 'image'){
                  selectedElement = evt.target.parentNode;
            }

            offset = getMousePosition(evt);

            // Make sure the first transform on the element is a translate transform
            var transforms = selectedElement.transform.baseVal;

            if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
              // Create an transform that translates by (0, 0)
              var translate = svg.createSVGTransform();
              translate.setTranslate(0, 0);
              selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }

            // Get initial translation
            transform = transforms.getItem(0);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;

            confined = evt.target.classList.contains('confine');
            if (confined) {
                bbox = selectedElement.getBBox();
                minX = boundaryX1 - bbox.x;
                maxX = boundaryX2 - bbox.x - bbox.width;
                minY = boundaryY1 - bbox.y;
                maxY = boundaryY2 - bbox.y - bbox.height;
            }
        }

        function drag(evt) {
          if (selectedElement) {
            evt.preventDefault();

            var coord = getMousePosition(evt);
            var dx = coord.x - offset.x;
            var dy = coord.y - offset.y;

            if (confined) {
                if (dx < minX) { dx = minX; }
                else if (dx > maxX) { dx = maxX; }
                if (dy < minY) { dy = minY; }
                else if (dy > maxY) { dy = maxY; }
            }

            transform.setTranslate(dx, dy);
          }
        }

        function endDrag(evt) {
          selectedElement = false;
        }
      }
