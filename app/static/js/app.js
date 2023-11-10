document.addEventListener('DOMContentLoaded', function() {
    if (typeof fabric !== 'undefined') {
        var canvas = new fabric.Canvas('balcony-designer');

        // Drawing tools
        var lineToolEl = document.getElementById('lineTool'),
            rectangleToolEl = document.getElementById('rectangleTool'),
            squareToolEl = document.getElementById('squareTool');

        // Current drawing tool
        var currentTool = null;

        // Store line endpoints
        var lineEndpoints = [];

        // Snapping threshold in pixels
        var snapThreshold = 10;

        // Function to find a snap point, if any
        function findSnapPoint(point) {
            for (var i = 0; i < lineEndpoints.length; i++) {
                var endPoint = lineEndpoints[i];
                if (Math.abs(point.x - endPoint.x) <= snapThreshold &&
                    Math.abs(point.y - endPoint.y) <= snapThreshold) {
                    return endPoint;
                }
            }
            return point;
        }

        // Function to create a green circle indicator
        function createCircleIndicator(point) {
            return new fabric.Circle({
                left: point.x,
                top: point.y,
                radius: 5,
                fill: 'green',
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false
            });
        }

        // Tool selection handlers
        lineToolEl.onclick = function() {
            currentTool = 'line';
        };
        rectangleToolEl.onclick = function() {
            currentTool = 'rectangle';
        };
        squareToolEl.onclick = function() {
            currentTool = 'square';
        };

        // Drawing start point
        var startPoint = null;

        // Mouse down event
        canvas.on('mouse:down', function(o) {
            startPoint = findSnapPoint(canvas.getPointer(o.e));
            if (currentTool === 'line') {
                var line = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
                    fill: 'transparent',
                    stroke: '#000000',
                    strokeWidth: 5,
                    selectable: false // Disable line selection
                });
                canvas.add(line);
                canvas.setActiveObject(line);
            } else if (currentTool === 'rectangle' || currentTool === 'square') {
                // Existing rectangle/square drawing logic
            }
        });

        // Mouse move event
        canvas.on('mouse:move', function(o) {
            if (!startPoint || currentTool !== 'line') return;

            var pointer = canvas.getPointer(o.e);
            var activeLine = canvas.getActiveObject();

            if (activeLine && activeLine.type === 'line') {
                activeLine.set({ x2: pointer.x, y2: pointer.y });
                activeLine.setCoords();
                canvas.renderAll();
            }
        });

        // Mouse up event
        canvas.on('mouse:up', function(o) {
            if (currentTool === 'line' && startPoint) {
                var endPoint = findSnapPoint(canvas.getPointer(o.e));
                var activeLine = canvas.getActiveObject();

                if (activeLine && activeLine.type === 'line') {
                    // Update line's endpoint and store it
                    activeLine.set({ x2: endPoint.x, y2: endPoint.y, selectable: false }).setCoords();
                    lineEndpoints.push({ x: startPoint.x, y: startPoint.y, line: activeLine });
                    lineEndpoints.push({ x: endPoint.x, y: endPoint.y, line: activeLine });
                
                    activeLine.set({ hasControls: false, hasBorders: false });
                }

                canvas.renderAll();
            }
            startPoint = null;
        });

        // Hover event for lines
        canvas.on('mouse:over', function(e) {
            var object = e.target;
            if (object && object.type === 'line') {
                // Add green circle indicators at line endpoints
                var startCircle = createCircleIndicator({ x: object.x1, y: object.y1 });
                var endCircle = createCircleIndicator({ x: object.x2, y: object.y2 });
                canvas.add(startCircle);
                canvas.add(endCircle);
                canvas.renderAll();
            }
        });

        // Mouse out event for lines
        canvas.on('mouse:out', function(e) {
            var object = e.target;
            if (object && object.type === 'line') {
                // Remove green circle indicators
                canvas.remove(canvas.getObjects('circle')[0]);
                canvas.remove(canvas.getObjects('circle')[0]);
                canvas.renderAll();
            }
        });

        canvas.on('object:added', function(e) {
            if (e.target.type === 'line') {
                e.target.set({ selectable: false });
            }
        });

    } else {
        // Handle the case where Fabric.js is not loaded
        console.error('Fabric.js is not loaded.');
    }
});
