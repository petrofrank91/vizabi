define(['util'], function (util) {

    var vizBubble = function (callback) {
        var svg;
        var scatterContainer;
        var labelLayer;

        var width = 300;
        var height = 300;

        var countryLayers;
        var linkLayer;

        var xScale;
        var yScale;
        var bubbleSizeScale;
        var fontSizeScale;

        var availableWidth;
        var availableHeight;

        var chartRenderDiv;

        var vizState;
        var vizStateChangeCallback = callback;
        var vizData;
        var isInteractive;

        var labelAngel = "-0.5";
        var labelPositionInteractive = "_50";

        //var vizChart;
        var vizBubblePrint;

        var update = function (state, chartScale, availableFrame) {
            vizState = state;

            updateLayout(chartScale, availableFrame);
            updateEntityLayers();
            renderCurrentBubbles();
            drawTrails();
            updateSelected();
            drawLabels();
        };

        var initializeLayers = function (root, renderDiv, state) {
            chartRenderDiv = renderDiv + "-scatterChart";
            vizState = state;
            isInteractive = state.get("isInteractive");
        };

        var updateLayout = function (chartScale, availableFrame) {
            xScale = chartScale[0];
            yScale = chartScale[1];

            availableHeight = availableFrame[0];
            availableWidth = availableFrame[1];

            setBubbleAndFontSizeScale();
            setUpChartInfoDivs();
        };

        var setBubbleAndFontSizeScale = function () {
            if (!vizState.get("minBubbleSize") && !vizState.get("maxBubbleSize")) {
                bubbleSizeScale = d3.scale.sqrt().domain([vizState.getDataHelper().getMinOfSizeIndicator(), vizState.getDataHelper().getMaxOfSizeIndicator()]).range([1, 30]).exponent(0.5);
            }
            else {
                bubbleSizeScale = d3.scale.sqrt().domain([vizState.getDataHelper().getMinOfSizeIndicator(), vizState.getDataHelper().getMaxOfSizeIndicator()]).range([vizState.get("minBubbleSize"), vizState.get("maxBubbleSize")]).exponent(0.5);
            }

            if (!vizState.get("minFontSize") && !vizState.get("maxFontSize")) {
                fontSizeScale = d3.scale.sqrt().domain([0, 10e8]).range([7, 25]).exponent(0.5);
            }
            else {
                fontSizeScale = d3.scale.sqrt().domain([0, 10e8]).range([vizState.get("minFontSize"), vizState.get("maxFontSize")]).exponent(0.5);
            }
        };

        var updateEntityLayers = function () {
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


        var renderCurrentBubbles = function () {
            var year = vizState.get("year");
            var s = vizState.get("s");
            var opacity = vizState.get("opacity");
            var trails = vizState.get("trails");
            var category = vizState.get("entity") || vizState.get("category");
            var currentEntities = vizState.getDataHelper().getDataObject(year);

            var bubbles = d3.select("#" + chartRenderDiv).selectAll(".entityLayer")
                .data(countryLayers, function (d) {
                    return d.id;
                })
                .selectAll(".currentEntity").data(function (d) {
                    var id = d.id;
                    return currentEntities[id];
                });

            bubbles.enter().append("circle")
                .attr("class", "currentEntity")
                .attr("name", function (d) {
                    return d.id;
                })
                .attr("stroke-width", "0.8pt")
                .attr("stroke", function (d) {
                    return vizState.getDataHelper().getColor(d.id, "stroke", d.category);
                })
                .attr("fill", function (d) {
                    return vizState.getDataHelper().getColor(d.id, "fill", d.category);
                })
                .attr("pointer-events", "all")
                .attr("cursor", "pointer");


            if (isInteractive) {
                bubbles
                    .on("click", bubbleClickHandler)
                    .on("mouseover", bubbleOverHandler)
                    .on("mouseout", bubbleOutHandler);
            }
            else {
                bubbles.on("click", vizBubblePrint.bubbleClickHandlerPrint);
            }

            bubbles
                .attr("cx", function (d, i) {
                    return xScale(d.x);
                })
                .attr("cy", function (d, i) {
                    return yScale(d.y);
                })
                .attr("r", function (d, i) {
                    return bubbleSizeScale(d.size);
                });

            bubbles.exit().remove();
        };

        var drawTrails = function () {
            var entityLayersData = [];

            var entities = vizState.getDataHelper().getEntityMeta();

            for (var entity in entities) {
                if (entities.hasOwnProperty(entity)) {
                    var entityObj = entities[entity][0];
                    var layerData = {id: entityObj.id, children: []};
                    entityLayersData.push(layerData);

                    var selectedBubbles = vizState.get("s");
                    var trails = vizState.get("trails");
                    var id = layerData.id;

                    if (id in selectedBubbles && trails === "standard") {
                        var selected = selectedBubbles[id];

                        var trailLayerBubble = {id: "trailLayerBubble", data: []};
                        var trailLayerLine = {color: "#000", id: "trailLayerLine", data: []};
                        var children = layerData.children;
                        children.push(trailLayerLine, trailLayerBubble);

                        var trailStart = parseInt(selected.start);

                        //When moving into history, adjust trailStart
                        var year = vizState.get("year");
                        if (year < trailStart) {
                            trailStart = Math.ceil(year);
                        }

                        var trailEnd = parseInt(year);
                        if ("end" in selected) {
                            trailEnd = parseInt(selected.end);
                        }

                        //Prevent extra bubble from being drawn on full year
                        var rangeOfTrailEntities;
                        if (vizState.get("fraction") === 0) {
                            rangeOfTrailEntities = d3.range(trailStart, trailEnd, 1);
                        }
                        else {
                            rangeOfTrailEntities = d3.range(trailStart, trailEnd + 1, 1);
                        }

                        var trailBubbleData = [];

                        var trailEntities = rangeOfTrailEntities.map(function (year) {
                            var o = {};

                            o.x = vizState.getDataHelper().getDataForYear(vizState.get("xIndicator"), id, year, entityObj.parent);
                            o.y = vizState.getDataHelper().getDataForYear(vizState.get("yIndicator"), id, year, entityObj.parent);
                            o.size = vizState.getDataHelper().getDataForYear(vizState.get("sizeIndicator"), id, year, entityObj.parent);
                            o.color = vizState.getDataHelper().getColor(id, "fill");
                            o.id = id;
                            o.year = year;


                            if (o.x && o.y && o.size) {
                                trailBubbleData.push(o);
                            }
                        });

                        trailLayerBubble.data = trailBubbleData;

                        //trailLayerLine.data = _.clone(trailBubbleData);
                        trailLayerBubble.data = JSON.parse(JSON.stringify(trailBubbleData));

                        trailLayerLine.color = vizState.getDataHelper().getColor(id, "fill");

                        console.log("data", trailLayerBubble.data, vizState.get("fraction"));

                        var o = {};

                        o.x = vizState.getDataHelper().get(vizState.get("xIndicator"), id, year, vizState, entityObj.parent);
                        o.y = vizState.getDataHelper().get(vizState.get("yIndicator"), id, year, vizState, entityObj.parent);
                        o.size = vizState.getDataHelper().get(vizState.get("sizeIndicator"), id, year, vizState, entityObj.parent);

                        if (o.x && o.y && o.z) {
                            trailLayerLine.data.push(o);
                        }
                    }
                }
            }


            var trailContainers = d3.select("#" + chartRenderDiv).selectAll(".entityLayer")
                .data(entityLayersData, function (d) {
                    return d.id;
                })
                .selectAll(".trailContainer").data(function (d) {
                    return d.children;
                }, function (d) {
                    return d.id;
                });

            trailContainers.enter()
                .insert("svg:g", "circle")
                .attr("name", function (d) {
                    return d.id;
                })
                .attr("class", "trailContainer")
                .each(function (d) {
                    if (d.id === "trailLayerLine") {
                        d3.select(this).append("svg:path")
                            .attr("class", "trailPath")
                            .attr("fill", "none")
                            .attr("stroke-width", "1.5pt")
                            .attr("stroke", function (d) {
                                return d.color;
                            });
                    }
                });

            trailContainers.exit()
                .remove();

            var line = d3.svg.line()
                .x(function (d) {
                    return xScale(d.x);
                })
                .y(function (d) {
                    return yScale(d.y);
                });

            var trailPath = trailContainers
                .filter(function (d) {
                    return d.id === "trailLayerLine";
                })
                .select(".trailPath");

            trailPath.
                attr("d", function (d) {
                    return line(d.data);
                })
                .attr("stroke-opacity", 0.6);

            var trailBubbles = trailContainers.filter(function (d) {
                return d.id == "trailLayerBubble"
            })
                .selectAll(".trailEntity")
                .data(function (d) {
                    return d.data;
                });


            trailBubbles.enter()
                .append("svg:circle")
                .attr("class", "trailEntity")
                .attr("stroke-width", "0.5pt")
                .attr("cursor", "pointer")
                .attr("fill-opacity", 0.6)
                .attr("stroke-opacity", 0.6)
                .on("click", bubbleClickHandler)
                .on("mouseover", bubbleOverHandler)
                .on("mouseout", bubbleOutHandler);

            trailBubbles
                .attr("stroke", function (d) {
                    return vizState.getDataHelper().getColor(d.id, "stroke");
                })
                .attr("fill", function (d) {
                    return vizState.getDataHelper().getColor(d.id, "fill");
                })
                .attr("cx", function (d, i) {
                    return xScale(d.x);
                })
                .attr("cy", function (d, i) {
                    return yScale(d.y);
                })
                .attr("r", function (d, i) {
                    return bubbleSizeScale(d.size);
                });

            trailBubbles.exit().remove();

        };


        var updateSelected = function () {
            var entityMeta = vizState.getDataHelper().getEntityMeta();
            var selected = vizState.get("s");
            var opacity = vizState.get("opacity");
            var circles = d3.select("#" + chartRenderDiv).selectAll("circle.currentEntity, circle.trailEntity");

            var category = vizState.get("category");
            var entity = vizState.get("entity");

            for (var id in selected) {
                if (selected.hasOwnProperty(id)) {
                    if ((entity && entityMeta[id][0].parent !== entity) ||
                        (category.length > 0 && category.indexOf(entityMeta[id][0].parent) === -1)) {
                        delete selected[id];
                    }
                }
            }

            circles.each(function (d, i) {
                if (util.isEmptyObject(selected)) {
                    d3.select(this).attr("fill-opacity", 0.9);
                    d3.select(this).attr("stroke-opacity", 0.9);
                }

                else {
                    var id = d.id;

                    if (id in selected) {
                        d3.select(this).attr("fill-opacity", 0.9);
                        d3.select(this).attr("stroke-opacity", 0.9);
                    }
                    else {
                        d3.select(this).attr("fill-opacity", opacity);
                        d3.select(this).attr("stroke-opacity", opacity);
                    }
                }

            });
        };

        var bubbleOverHandler = function (d, i) {
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
                //.attr("dominant-baseline","central")
                .text(function () {
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
                .attr("transform", "translate(" + coordinates.x + "," + coordinates.y + ")");

            this.xValueLabel = d3.select("#" + chartRenderDiv).select(".labelLayer")
                .append("g")
                .attr("transform", "translate(" + nodeX + "," + (availableHeight + 15) + ")")
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
            var numberFormat = function (d) {
                return numFormat2(d.toPrecision(2));
            };

            var xValueText = this.xValueLabel
                .append("text")
                .attr("class", "xValueLabelText")
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")

                .attr("dominant-baseline", "central")
                .text(function () {
                    return numberFormat(d.x);
                });

            var xValueTextWidth = xValueText.node().getBBox().width;
            var xValueTextHeight = xValueText.node().getBBox().height;

            rectNodeX
                .attr("width", xValueTextWidth + paddingWidth)
                .attr("height", xValueTextHeight + paddingHeight)
                .attr("x", -xValueTextWidth / 2 - paddingWidth / 2)
                .attr("y", -xValueTextHeight / 2 - paddingWidth / 2);

            this.yValueLabel = d3.select("#" + chartRenderDiv).select(".labelLayer")
                .append("g")
                .attr("transform", "translate(" + -6 + "," + nodeY + ")")
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
                .text(function () {
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


        var bubbleOutHandler = function (name, i) {

            d3.select("#" + chartRenderDiv).selectAll(".highlightNode").remove();
            d3.select("#" + chartRenderDiv).selectAll(".highlightLabel").remove();

            d3.select("#" + chartRenderDiv).selectAll(".xValueLabel").remove();
            d3.select("#" + chartRenderDiv).selectAll(".yValueLabel").remove();

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

        var dragMove = function (d, i) {
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
                .filter(function (a) {
                    return a.id === d.id;
                })
                .attr("x1", perimeterX)
                .attr("y1", perimeterY)
                .attr("x2", labelCoordinates.x)
                .attr("y2", labelCoordinates.y);

            d3.select(this).attr("transform", "translate(" + labelCoordinates.x + "," + labelCoordinates.y + ")");
        };

        var dragEnd = function (d, i) {
            var selected = vizState.get("s");
            selected[d.id].labelPos = d.labelPos;

            vizStateChangeCallback({s: selected}, vizData);
        };

        var addLabelsToSelectedBubbles = function (selectedEntities, year) {
            var labelsData = [];

            for (var entityId in selectedEntities) {
                if (selectedEntities.hasOwnProperty(entityId)) {
                    var entity = selectedEntities[entityId];
                    var category = selectedEntities[entityId].category;

                    var o = {};
                    o.id = entityId;
                    o.name = vizState.getDataHelper().getName(entityId, category);
                    o.x = vizState.getDataHelper().get(vizState.get("xIndicator"), entityId, year, vizState, category);
                    o.y = vizState.getDataHelper().get(vizState.get("yIndicator"), entityId, year, vizState, category);
                    o.size = vizState.getDataHelper().get(vizState.get("sizeIndicator"), entityId, year, vizState, category);

                    if ("labelPos" in entity) {
                        o.labelPos = selectedEntities[entityId].labelPos;
                    }
                    else {
                        o.labelPos = labelAngel + labelPositionInteractive;
                    }

                    if (o.x && o.y && o.size) {
                        labelsData.push(o);
                    }
                }
            }

            return labelsData;
        };

        var bubbleClickHandler = function (d, i) {
            var currentYear = vizState.get("year");
            var selected = vizState.get("s");
            var id = d.id;

            if (id in selected) {
                delete selected[id];
            }
            else {
                selected[id] = {start: currentYear, category: d.category};
            }

            vizStateChangeCallback({s: selected});
            bubbleOutHandler();
        };

        var drawLabels = function () {
            if (isInteractive) {
                drawLabelsInInteractiveMode();
            }
            else {
                vizBubblePrint.drawLabels(fontSizeScale, fontSizeScale, xScale, yScale);
            }
        };

        var drawLabelsInInteractiveMode = function () {
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

            var dragInteractive = d3.behavior.drag()
                .on("drag", dragMove)
                .on("dragend", dragEnd);

            var labelContainer = labels.enter()
                .append("g")
                .attr("class", "labelNode")
                .attr("cursor", "pointer")
                .call(dragInteractive);

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

        var setUpChartInfoDivs = function () {
            //document.getElementById("chartInfo").innerHTML = vizState.getDataHelper().getChartInfo();
            //document.getElementById("chartFooter").innerHTML = "<b>Source</b>:" + vizState.getDataHelper().getChartFooter();
        };


        return {
            initialize: initializeLayers,
            updateLayout: updateLayout,
            update: update
        };
    };

    return vizBubble;

});
