gapminder.vizLine = function (callback) {

    var scatterContainer;
    var labelLayer;

    var countryLayers;

    var xScale;
    var yScale;

    var availableWidth;
    var availableHeight;

    var chartRenderDiv;

    var vizState;
    var isInteractive;

    var labelAngel = "-0.5";
    var labelPositionInteractive = "_50";

    var vizChart;

    var update = function (state) {
        vizState = state;

        updateLayout();
        createEntityLayers();
        renderLines();
        drawLabels();
    };

    var initializeLayers = function (root, renderDiv, state) {
        chartRenderDiv = renderDiv + "-scatterChart";
        vizState = state;
        isInteractive = state.get("isInteractive");

        vizChart = new gapminder.viz.chartGrid();
        vizChart.initializeLayers(root, renderDiv);
    };

    var updateLayout = function () {
        var scaleFunctions = vizChart.updateLayout(vizState);
        yScale = scaleFunctions[1];

        var availableFrame = vizChart.getAvailableHeightAndWidth();
        availableHeight = availableFrame[0];
        availableWidth = availableFrame[1];

        createXAxis();

        setUpChartInfoDivs();
    };

    var createXAxis = function () {
        var xDomain = [vizState.getDataHelper().getMinYear(), vizState.getDataHelper().getMaxYear()];
        xScale = d3.scale.linear().domain(xDomain).range([0, availableWidth]);

        var xLabelText = "Time";
        var xLabel = vizChart.getXLabel();
        var margin = vizChart.getMargin();

        xLabel
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + availableWidth / 2 + "," + (availableHeight + margin.bottom * 0.6) + ")")
            .attr("font-size", "30px")
            .text(xLabelText)
            .append("svg:title")
            .text(function () {
                return vizState.getDataHelper().getAxisInfo()[0];
            });

        var formatX = d3.format("  0");
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(formatX)
            .ticks(10)
            .tickSize(-availableHeight, 0, 0)
            .tickPadding(5)
            .orient("bottom");

        var xAxisContainer = vizChart.getXAxisContainer();
        xAxisContainer
            .attr("transform", "translate(0," + (availableHeight) + ")")
            .attr("stroke", "lightgrey")
            .classed("print", !vizState.get("isInteractive"))
            .call(xAxis);

        d3.selectAll("text")
            .attr("stroke-width", "0px")
            .attr("stroke", "black")
            .attr("font-size", "20px");
    };

    var createEntityLayers = function () {
        countryLayers = vizState.getDataHelper().getEntityLayerObject();

        var entityLayers = d3.select("#" + chartRenderDiv + " .scatterContainer").selectAll(".entityLayer")
            .data(countryLayers, function (d) {
                return d.id;
            });

        var entityLayer = entityLayers
            .enter()
            .append("g")
            .attr("class", "entityLayer")
            .attr("name", function (d) {
                return d.id;
            })
            .attr("id", function (d) {
                return d.id;
            });

        entityLayers
            .sort(function (a, b) {
                return b.max - a.max;
            });

        entityLayers.exit()
            .remove();
    };


    var renderLines = function () {
        var year = vizState.get("year");
        var s = vizState.get("s");
        var opacity = vizState.get("opacity");
        var trails = vizState.get("trails");
        var category = vizState.get("entity") || vizState.get("category");
        var yIndicator = vizState.get("yIndicator");
        var currentEntities = vizState.getDataHelper().getDataObject(yIndicator, year);

        var line = d3.svg.line()
            .x(function (d) {
                return xScale(d.x);
            })
            .y(function (d) {
                return yScale(d.y);
            })
            .interpolate("linear");

        var lines = d3.selectAll(".entityLayer")
            .data(countryLayers, function (d) {
                return (d && d.id) || d3.select(this).attr("id");
            })
            .selectAll(".currentEntity").data(function (d) {
                return [currentEntities[d.id]];
            });

        lines
            .enter()
            .append("svg:path")
            .attr("d", line)
            .attr("stroke", "black");

        lines
            .filter(function (d) {
                return d.length > 0;
            })
            .attr("stroke", "black")
            .attr("name", function (d) {
                return d.id;
            })
            .attr("stroke-width", "0.8pt")
            .attr("stroke", function (d) {
                return vizState.getDataHelper().getColor(d[0].id, "stroke", d[0].category);
            })
            .attr("fill", function (d) {
                return vizState.getDataHelper().getColor(d[0].id, "fill", d[0].category);
            })
            .attr("pointer-events", "all")
            .attr("cursor", "pointer");


        lines
            .on("mouseover", LineOverHandler)
            .on("mouseout", lineOutHandler);

        lines
            .exit()
            .remove();
    };

    var drawLabels = function () {
        var year = vizState.get("year");
        var trails = vizState.get("trails");

        var selected = vizState.get("s");
        var labelsData = addLabelsToSelectedBubbles(selected, year);

        var labels = d3.select("#" + chartRenderDiv)
            .select(".labelLayer")
            .selectAll(".labelNode")
            .data(labelsData, function (d) {
                return d.id;
            });


        var labelContainer = labels.enter()
            .append("g")
            .attr("class", "labelNode")
            .attr("cursor", "pointer");

        labelContainer.append("rect")
            .attr("cursor", "pointer")
            .attr("class", "labelBG");


        var labelText = labelContainer
            .append("text")
            .attr("class", "labelText")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-family", "'Helvetica', sans-serif")
            .attr("x", "0")
            .attr("y", "0")
            .attr("font-size", "23px")
            .attr("pointer-events", "none")
            .text(function (d) {
                return d.name;
            });

        labels.each(function (d) {

            var bbox = d3.select(this).select(".labelText").node().getBBox();
            var width = bbox.width;
            var height = bbox.height;

            var paddingWidth = 8;
            var paddingHeight = 8;

            d3.select(this).select(".labelBG")
                .attr("width", width + paddingWidth)
                .attr("height", height + paddingHeight)
                .attr("x", -width / 2 - paddingWidth / 2)
                .attr("y", -height / 2 - paddingWidth / 2)
                .attr("fill", "#fff")
                .attr("stroke", "#999")
                .attr("stroke-width", "2px")
                .attr("ry", "5px")
                .attr("rx", "5px");


            var angle = -1 / 4 * Math.PI;
            var distanceFromPerimeter = 50;

            var labelPos = d.labelPos;
            angle = parseFloat(labelPos.split("_")[0]);
            distanceFromPerimeter = parseFloat(labelPos.split("_")[1]);

            var radius = bubbleSizeScale(d.size);
            var bubbleX = xScale(d.x);
            var bubbleY = yScale(d.y);

            var perimeterX = bubbleX + radius * Math.cos(angle);
            var perimeterY = bubbleY + radius * Math.sin(angle);

            var labelCoordinates = {};
            labelCoordinates.x = bubbleX + (distanceFromPerimeter + radius) * Math.cos(angle);
            labelCoordinates.y = bubbleY + (distanceFromPerimeter + radius) * Math.sin(angle);

            var preferredX = labelCoordinates.x;
            var preferredY = labelCoordinates.y;

            labelCoordinates = fitWithinLabelConstraints(bbox, preferredX, preferredY);

            d.linkStartX = perimeterX;
            d.linkStartY = perimeterY;
            d.linkEndX = labelCoordinates.x;
            d.linkEndY = labelCoordinates.y;

            d3.select(this).attr("transform", "translate(" + labelCoordinates.x + "," + labelCoordinates.y + ")");
        });

        labels.exit().remove();

        var labelLinks = d3.select("#" + chartRenderDiv).select(".linkLayer").selectAll(".labelLink")
            .data(labelsData, function (d) {
                return d.id;
            });

        labelLinks.enter().append("svg:line")
            .attr("class", "labelLink")
            .attr("stroke", "#333")
            .attr("stroke-width", "1px");

        labelLinks
            .attr("x1", function (d) {
                return d.linkStartX;
            })
            .attr("y1", function (d) {
                return d.linkStartY;
            })
            .attr("x2", function (d) {
                return d.linkEndX;
            })
            .attr("y2", function (d) {
                return d.linkEndY;
            });

        labelLinks.exit().remove();
    };


    var LineOverHandler = function (d, i) {
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

        this.highlightLabel = d3.select("#" + chartRenderDiv)
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
            .text(function () {
                var text;
                currentEntity ? text = vizState.getDataHelper().getName(d[0].id, d[0].category) : text = vizState.getDataHelper().getName(d[0].id);
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
    };

    var addLabelsToSelectedBubbles = function (selected, year) {
        var labelsData = [];

        $.each(selected, function (key, object) {
            var id = key;
            var o = {};
            var category = object.category;

            o.id = id;
            o.name = vizState.getDataHelper().getName(id, category);
            o.x = year;
            o.y = vizState.getDataHelper().get(vizState.get("yIndicator"), id, year, vizState, category);

            if ("labelPos" in object) {
                o.labelPos = object.labelPos;
            }
            else {
                o.labelPos = labelAngel + labelPositionInteractive;
            }

            if (o.x && o.y) {
                labelsData.push(o);
            }
        });

        return labelsData;
    };

    var lineOutHandler = function () {
        d3.select("#" + chartRenderDiv).selectAll(".highlightNode").remove();
        d3.select("#" + chartRenderDiv).selectAll(".highlightLabel").remove();
    };

    var setUpChartInfoDivs = function () {
        $("#chartInfo").html(vizState.getDataHelper().getChartInfo()).css({"font-size": 13});
        $("#chartFooter").html("<b>Source</b>:" + vizState.getDataHelper().getChartFooter()).css({"font-size": 13});
    };


    return {
        initialize: initializeLayers,
        updateLayout: updateLayout,
        update: update
    };
};