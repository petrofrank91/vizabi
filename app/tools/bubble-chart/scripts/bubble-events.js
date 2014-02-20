define(['d3'], function(d3) {

    var bubbleEvents = function(vizState, g, vizStateChangeCallback) {

        var availableWidth = ($(window).width());
        var availableHeight = ($(window).height());

        var bubbleClickHandler = function(d, i) {
            var currentYear = vizState.get("year");
            var selected = vizState.get("s");
            var id = d.id;

            if (id in selected) {
                delete selected[id];
            } else {
                selected[id] = {
                    start: currentYear,
                    category: d.category
                };
            }

            vizStateChangeCallback({
                s: selected
            });
            bubbleOutHandler();
        };

        var bubbleOutHandler = function(name, i) {

            d3.selectAll(".highlightNode").remove();
            d3.selectAll(".highlightLabel").remove();

            d3.selectAll(".xValueLabel").remove();
            d3.selectAll(".yValueLabel").remove();

        };

        var bubbleOverHandler = function(d, i) {
            var id = d.id;
            var selected = vizState.get("s");
            var currentEntity;
            var alreadySelected;

            (d.year === vizState.get("year")) ? currentEntity = true : currentEntity = false;

            (id in selected) ? alreadySelected = true : alreadySelected = false;

            if (currentEntity && alreadySelected) {
                return false;
            }

            this.overNode = d3.select(d3.event.target).node();

            var overNode = d3.select(this.overNode);

            var nodeX = parseInt(overNode.attr("cx"));
            var nodeY = parseInt(overNode.attr("cy"));
            var nodeR = parseInt(overNode.attr("r"));
            var nodeFill = overNode.attr("fill");

            this.highlightNode = this.overNode.cloneNode(true);

            var highlightNode = d3.select(this.highlightNode)
                .attr("pointer-events", "none")
                .attr("class", "highlightNode")
                .attr("fill", "none")
                .attr("r", nodeR + 5)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1)
                .attr("stroke-width", "3px")
                .attr("stroke", nodeFill);

            d3.select(this.overNode.parentNode.insertBefore(this.highlightNode, this.overNode.nextSibling));


            this.highlightLabel = d3
                .select(".labelLayer")
                .append("g")
                .attr("class", "highlightLabel")
                .attr("pointer-events", "none");

            var rectNode = this.highlightLabel
                .append("rect")
                .attr("class", "highlightBG");

            var textNode = this.highlightLabel
                .append("text")
                .attr("x", "0px")
                .attr("y", "0px")
                .attr("font-size", "20px")
                .attr("class", "entityLabel")
                .attr("text-anchor", "middle")
            //.attr("dominant-baseline","central")
            .text(function() {
                var text;
                currentEntity ? text = vizState.getDataHelper().getName(d.id, d.category) : text = vizState.getDataHelper().getName(d.id) + ", " + d.year;
                return text;
            });

            var textNodeBbox = textNode.node().getBBox();
            var textNodeBBoxWidth = textNodeBbox.width;
            var textNodeBBoxHeight = textNodeBbox.height;

            var paddingWidth = 8;
            var paddingHeight = 8;

            rectNode
                .attr("width", textNodeBBoxWidth + paddingWidth)
                .attr("height", textNodeBBoxHeight + paddingHeight)
                .attr("x", -textNodeBBoxWidth / 2 - paddingWidth / 2)
                .attr("y", -textNodeBBoxHeight / 2 - paddingWidth / 2)
                .attr("fill", "#fff")
                .attr("stroke", nodeFill)
                .attr("stroke-width", "3px")
                .attr("ry", "5px")
                .attr("rx", "5px");

            var bbox = this.highlightLabel.node().getBBox();

            var preferredX = nodeX + bbox.width / 2 + nodeR + 5;
            var preferredY = nodeY - bbox.height / 2 - nodeR - 5;
            var coordinates = fitWithinLabelConstraints(bbox, preferredX, preferredY);

            this.highlightLabel
            //.attr("transform", "translate(" + coordinates.x + "," + coordinates.y + ")");

            this.xValueLabel = d3.select(".labelLayer")
                .append("g")
            //.attr("transform", "translate(" + nodeX + "," + (availableHeight + 15) + ")")
            .attr("class", "xValueLabel")
                .attr("pointer-events", "none");

            var rectNodeX = this.xValueLabel
                .append("rect")
                .attr("class", "xValueLabelBG")
                .attr("fill", "#fff")
                .attr("stroke-width", "1px")
                .attr("ry", "5px")
                .attr("rx", "5px")
                .attr("stroke", "#999");

            var numFormat2 = d3.format(",g");
            var numberFormat = function(d) {
                return numFormat2(d.toPrecision(2));
            };

            var xValueText = this.xValueLabel
                .append("text")
                .attr("class", "xValueLabelText")
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")

            .attr("dominant-baseline", "central")
                .text(function() {
                    return numberFormat(d.x);
                });

            var xValueTextWidth = xValueText.node().getBBox().width;
            var xValueTextHeight = xValueText.node().getBBox().height;

            rectNodeX
                .attr("width", xValueTextWidth + paddingWidth)
                .attr("height", xValueTextHeight + paddingHeight)
                .attr("x", -xValueTextWidth / 2 - paddingWidth / 2)
                .attr("y", -xValueTextHeight / 2 - paddingWidth / 2);

            this.yValueLabel = d3.select(".labelLayer")
                .append("g")
            //.attr("transform", "translate(" + -6 + "," + nodeY + ")")
            .attr("class", "yValueLabel")
                .attr("pointer-events", "none");

            var rectNodeY = this.yValueLabel
                .append("rect")
                .attr("class", "yValueLabelBG")
                .attr("fill", "#fff")
                .attr("stroke-width", "1px")
                .attr("ry", "5px")
                .attr("rx", "5px")
                .attr("stroke", "#999");

            var yValueText = this.yValueLabel
                .append("text")
                .attr("class", "yValueLabelTex")
                .attr("text-anchor", "end")
                .attr("font-weight", "bold")
                .attr("dominant-baseline", "central")
                .text(function() {
                    return numberFormat(d.y);
                });

            var yValueTextWidth = yValueText.node().getBBox().width;
            var yValueTextHeight = yValueText.node().getBBox().height;

            rectNodeY
                .attr("width", yValueTextWidth + paddingWidth)
                .attr("height", yValueTextHeight + paddingHeight)
                .attr("x", -yValueTextWidth - paddingWidth / 2)
                .attr("y", -yValueTextHeight / 2 - paddingWidth / 2);
        };

        var dragMove = function(d, i) {
            var preferredX = d3.event.x;
            var preferredY = d3.event.y;

            var bbox = d3.select(this).node().getBBox();
            var labelCoordinates = fitWithinLabelConstraints(bbox, preferredX, preferredY);

            var radius = bubbleSizeScale(d.size);
            var bubbleX = xScale(d.x);
            var bubbleY = yScale(d.y);

            var x = labelCoordinates.x - bubbleX;
            var y = labelCoordinates.y - bubbleY;

            var angle = Math.atan2(y, x);
            var distance = Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)));

            var perimeterX = bubbleX + radius * Math.cos(angle);
            var perimeterY = bubbleY + radius * Math.sin(angle);

            d.labelPos = angle + "_" + (distance - radius);

            var labelLink = d3.selectAll(".labelLink")
                .filter(function(a) {
                    return a.id === d.id;
                })
                .attr("x1", perimeterX)
                .attr("y1", perimeterY)
                .attr("x2", labelCoordinates.x)
                .attr("y2", labelCoordinates.y);

            //d3.select(this).attr("transform", "translate(" + labelCoordinates.x + "," + labelCoordinates.y + ")");
        };

        var dragEnd = function(d, i) {
            var selected = vizState.get("s");
            selected[d.id].labelPos = d.labelPos;

            vizStateChangeCallback({
                s: selected
            }, vizData);
        };

        var fitWithinLabelConstraints = function (bbox, x, y) {

            var coordinates = {x: x, y: y};
            var padding = 5;

            var minX = bbox.width / 2 + padding;
            var maxX = availableWidth - (bbox.width / 2) - padding;
            var minY = bbox.height / 2 + padding;
            var maxY = availableHeight - (bbox.height / 2) - padding;

            if (x < minX) {
                coordinates.x = minX;
            }
            if (x > maxX) {
                coordinates.x = maxX;
            }
            if (y < minY) {
                coordinates.y = minY;
            }
            if (y > maxY) {
                coordinates.y = maxY;
            }

            return coordinates;
        };

        return {
            bubbleClickHandler: bubbleClickHandler,
            bubbleOverHandler: bubbleOverHandler,
            bubbleOutHandler: bubbleOutHandler,
            dragMove: dragMove,
            dragEnd: dragEnd
        };
    };

    return bubbleEvents;
});