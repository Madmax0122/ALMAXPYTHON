document.addEventListener('DOMContentLoaded', function() {
    if (typeof fabric !== 'undefined') {
        var canvas = new fabric.Canvas('balcony-designer');

        // Drawing tools
        var lineToolEl = document.getElementById('lineTool'),
            rectangleToolEl = document.getElementById('rectangleTool'),
            squareToolEl = document.getElementById('squareTool');

        // Current drawing tool
        var currentTool = null;

        // Handle tool selection
        if (lineToolEl) {
            lineToolEl.onclick = function() {
                currentTool = 'line';
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush.width = 5;
                canvas.freeDrawingBrush.color = "#000000";
            };
        }

        if (rectangleToolEl) {
            rectangleToolEl.onclick = function() {
                currentTool = 'rectangle';
            };
        }

        if (squareToolEl) {
            squareToolEl.onclick = function() {
                currentTool = 'square';
            };
        }

        // Handle mouse events
        var startPoint = null;
        canvas.on('mouse:down', function(o) {
            startPoint = canvas.getPointer(o.e);
            if (currentTool === 'rectangle' || currentTool === 'square') {
                var rect = new fabric.Rect({
                    left: startPoint.x,
                    top: startPoint.y,
                    fill: 'transparent',
                    stroke: '#000000',
                    strokeWidth: 5,
                    width: 1,
                    height: 1
                });
                canvas.add(rect);
                canvas.setActiveObject(rect);
            }
        });

        canvas.on('mouse:move', function(o) {
            if (!startPoint) return;
            var pointer = canvas.getPointer(o.e);
            var activeObject = canvas.getActiveObject();
            if (currentTool === 'rectangle') {
                activeObject.set('width', Math.abs(pointer.x - startPoint.x));
                activeObject.set('height', Math.abs(pointer.y - startPoint.y));
            } else if (currentTool === 'square') {
                var size = Math.max(Math.abs(pointer.x - startPoint.x), Math.abs(pointer.y - startPoint.y));
                activeObject.set('width', size);
                activeObject.set('height', size);
            }
            activeObject.setCoords();
            canvas.renderAll();
        });

        canvas.on('mouse:up', function(o) {
            startPoint = null;
        });
    } else {
        // Handle the case where Fabric.js is not loaded.
    }
});