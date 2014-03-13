define([
    'd3',
    'chart-grid-scale',
    'bubble-chart-events',
    'util',
    'bubble-chart-bubble-label',
    'bubble-chart-commons'
], function(d3, scale, bubbleEvents, util, bubbleLabels, commons) {

    var bubbles = function() {

        var g;
        var vizState;
        var countryLayers;
        var isInteractive;
        var _bubbleEvents;
        var bubbleSizeScale;
        var fontSizeScale;
        var vizStateChangedCallback;
        var _bubbleLabels;
        var labelAngel = "-0.5";
        var labelPositionInteractive = "_50";
        var availableWidth;
        var availableHeight;
        var paddingRight;
        var paddingTop;

        var init = function(svg, state, vizStateChanged) {
            g = svg
                .append("g")
                .attr("class", "scatterContainer");
            vizState = state;
            isInteractive = vizState.get("isInteractive");
            vizStateChangedCallback = vizStateChanged;
            _bubbleEvents = new bubbleEvents(state, svg, vizStateChangedCallback);
            _bubbleLabels = new bubbleLabels();
        };

        var setScales = function() {
            if (!vizState.get("minBubbleSize") && !vizState.get("maxBubbleSize")) {
                scale.init("bubble", "sqrt", [vizState.getDataHelper().getMinOfSizeIndicator(), vizState.getDataHelper().getMaxOfSizeIndicator()], [1, 30]);
            } else {
                scale.init("bubble", "sqrt", [vizState.getDataHelper().getMinOfSizeIndicator(), vizState.getDataHelper().getMaxOfSizeIndicator()], [vizState.get("minBubbleSize"), vizState.get("maxBubbleSize")]);
            }

            if (!vizState.get("minFontSize") && !vizState.get("maxFontSize")) {
                scale.init("font", "sqrt", [0, 10e8], [7, 25]);
            } else {
                scale.init("font", "sqrt", [0, 10e8], [vizState.get("minFontSize"), vizState.get("maxFontSize")]);
            }
        };

        var createLayers = function() {
            countryLayers = vizState.getDataHelper().getEntityLayerObject();

            var entityLayers = g
                .selectAll(".entityLayer")
                .data(countryLayers, function(d) {
                    return d.id;
                });

            var entityLayer = entityLayers
                .enter()
                .append("g")
                .attr("class", "entityLayer")
                .attr("name", function(d) {
                    return d.id;
                })
                .attr("id", function(d) {
                    return d.id;
                });

            entityLayers
                .sort(function(a, b) {
                    return b.max - a.max;
                });

            entityLayers.exit()
                .remove();
        };


        var createBubbles = function() {
            var year = vizState.get("year");
            var s = vizState.get("s");
            var opacity = vizState.get("opacity");
            var trails = vizState.get("trails");
            var category = vizState.get("entity") || vizState.get("category");
            var currentEntities = vizState.getDataHelper().getDataObject(year);

            var bubbles = g.selectAll(".entityLayer")
                .data(countryLayers, function(d) {
                    return d.id;
                })
                .selectAll(".currentEntity").data(function(d) {
                    var id = d.id;
                    return currentEntities[id];
                });

            bubbles.enter().append("circle")
                .attr("class", "currentEntity")
                .attr("name", function(d) {
                    return d.id;
                })
                .attr("stroke-width", "0.8pt")
                .attr("stroke", function(d) {
                    return vizState.getDataHelper().getColor(d.id, "stroke", d.category);
                })
                .attr("fill", function(d) {
                    return vizState.getDataHelper().getColor(d.id, "fill", d.category);
                })
                .attr("pointer-events", "all")
                .attr("cursor", "pointer");


            if (isInteractive) {
                bubbles
                    .on("click", _bubbleEvents.bubbleClickHandler)
                    .on("mouseover",  _bubbleEvents.bubbleOverHandler)
                    .on("mouseout", _bubbleEvents.bubbleOutHandler);
            } else {
                bubbles.on("click", vizBubblePrint.bubbleClickHandlerPrint);
            }

            bubbles
                .attr("cx", function(d, i) {
                    var xScale = scale.get("x")
                    return xScale(d.x);
                })
                .attr("cy", function(d, i) {
                    var yScale = scale.get("y")
                    return yScale(d.y);
                })
                .attr("r", function(d, i) {
                    var bubbleSizeScale = scale.get("bubble");
                    return bubbleSizeScale(d.size);
                });

            bubbles.exit().remove();
        };

        var drawTrails = function() {
            var entityLayersData = [];

            var entities = vizState.getDataHelper().getEntityMeta();

            for (var entity in entities) {
                if (entities.hasOwnProperty(entity)) {
                    var entityObj = entities[entity][0];
                    var layerData = {
                        id: entityObj.id,
                        children: []
                    };
                    entityLayersData.push(layerData);

                    var selectedBubbles = vizState.get("s");
                    var trails = vizState.get("trails");
                    var id = layerData.id;

                    if (id in selectedBubbles && trails === "standard") {
                        var selected = selectedBubbles[id];

                        var trailLayerBubble = {
                            id: "trailLayerBubble",
                            data: []
                        };
                        var trailLayerLine = {
                            color: "#000",
                            id: "trailLayerLine",
                            data: []
                        };
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
                        } else {
                            rangeOfTrailEntities = d3.range(trailStart, trailEnd + 1, 1);
                        }

                        var trailBubbleData = [];

                        var trailEntities = rangeOfTrailEntities.map(function(year) {
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


            var trailContainers = d3.selectAll(".entityLayer")
                .data(entityLayersData, function(d) {
                    return d.id;
                })
                .selectAll(".trailContainer").data(function(d) {
                    return d.children;
                }, function(d) {
                    return d.id;
                });

            trailContainers.enter()
                .insert("svg:g", "circle")
                .attr("name", function(d) {
                    return d.id;
                })
                .attr("class", "trailContainer")
                .each(function(d) {
                    if (d.id === "trailLayerLine") {
                        d3.select(this).append("svg:path")
                            .attr("class", "trailPath")
                            .attr("fill", "none")
                            .attr("stroke-width", "1.5pt")
                            .attr("stroke", function(d) {
                                return d.color;
                            });
                    }
                });

            trailContainers.exit()
                .remove();

            var line = d3.svg.line()
                .x(function(d) {
                    return xScale(d.x);
                })
                .y(function(d) {
                    return yScale(d.y);
                });

            var trailPath = trailContainers
                .filter(function(d) {
                    return d.id === "trailLayerLine";
                })
                .select(".trailPath");

            trailPath.
            attr("d", function(d) {
                return line(d.data);
            })
                .attr("stroke-opacity", 0.6);

            var trailBubbles = trailContainers.filter(function(d) {
                return d.id == "trailLayerBubble"
            })
                .selectAll(".trailEntity")
                .data(function(d) {
                    return d.data;
                });


            trailBubbles.enter()
                .append("svg:circle")
                .attr("class", "trailEntity")
                .attr("stroke-width", "0.5pt")
                .attr("cursor", "pointer")
                .attr("fill-opacity", 0.6)
                .attr("stroke-opacity", 0.6)
                .on("click", _bubbleEvents.bubbleClickHandler)
                .on("mouseover", _bubbleEvents.bubbleOverHandler(d,i, paddingRight, paddingTop))
                .on("mouseout", _bubbleEvents.bubbleOutHandler);

            trailBubbles
                .attr("stroke", function(d) {
                    return vizState.getDataHelper().getColor(d.id, "stroke");
                })
                .attr("fill", function(d) {
                    return vizState.getDataHelper().getColor(d.id, "fill");
                })
                .attr("cx", function(d, i) {
                    return xScale(d.x);
                })
                .attr("cy", function(d, i) {
                    return yScale(d.y);
                })
                .attr("r", function(d, i) {
                    return bubbleSizeScale(d.size);
                });

            trailBubbles.exit().remove();

        };


        var updateSelected = function() {
            var entityMeta = vizState.getDataHelper().getEntityMeta();
            var selected = vizState.get("s");
            var opacity = vizState.get("opacity");
            var circles = d3.selectAll("circle.currentEntity, circle.trailEntity");

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

            circles.each(function(d, i) {
                if (util.isEmptyObject(selected)) {
                    d3.select(this).attr("fill-opacity", 0.9);
                    d3.select(this).attr("stroke-opacity", 0.9);
                } else {
                    var id = d.id;

                    if (id in selected) {
                        d3.select(this).attr("fill-opacity", 0.9);
                        d3.select(this).attr("stroke-opacity", 0.9);
                    } else {
                        d3.select(this).attr("fill-opacity", opacity);
                        d3.select(this).attr("stroke-opacity", opacity);
                    }
                }

            });
        };

        var addLabelsData = function(selectedEntities, year) {
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
                    } else {
                        o.labelPos = labelAngel + labelPositionInteractive;
                    }

                    if (o.x && o.y && o.size) {
                        labelsData.push(o);
                    }
                }
            }

            return labelsData;
        };

        var drawLabels = function() {
            var year = vizState.get("year");
            var trails = vizState.get("trails");
            var selected = vizState.get("s");
            var labelsData = addLabelsData(selected, year);

            var labels = d3
                .select(".labelLayer")
                .selectAll(".labelNode")
                .data(labelsData, function(d) {
                    return d.id;
                });

            var dragInteractive = d3.behavior.drag()
                .on("drag", _bubbleEvents.dragMove)
                .on("dragend", _bubbleEvents.dragEnd);

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
                .text(function(d) {
                    return d.name;
                });

            labels.each(function(d) {

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

                var bubbleSizeScale = scale.get("bubble");
                var xScale = scale.get("x");
                var yScale = scale.get("y");

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

                d3.select(this).attr("transform", "translate(" + (labelCoordinates.x + paddingRight) + "," + (labelCoordinates.y + paddingTop + ")"));
            });

            labels.exit().remove();

            var labelLinks = d3.select(".linkLayer")
                .selectAll(".labelLink")
                .data(labelsData, function(d) {
                    return d.id;
                });

            labelLinks.enter().append("line")
                .attr("class", "labelLink")
                .attr("stroke", "#333")
                .attr("stroke-width", "1px")
                .attr("transform", "translate(" + paddingRight + "," + paddingTop + ")");

            labelLinks
                .attr("x1", function(d) {
                    return d.linkStartX;
                })
                .attr("y1", function(d) {
                    return d.linkStartY;
                })
                .attr("x2", function(d) {
                    return d.linkEndX;
                })
                .attr("y2", function(d) {
                    return d.linkEndY;
                });

            labelLinks.exit().remove();
        };


        var fitWithinLabelConstraints = function(bbox, x, y) {
            var coordinates = {
                x: x,
                y: y
            };
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

        var render = function(w, h) {
            if (w) availableWidth = w;
            if (h) availableHeight = h;

            setScales();
            createLayers();
            createBubbles();
            //drawTrails();
            updateSelected();
            setPaddings();
            drawLabels();


            return g.node().getBBox();
        };

        var getGroup = function() {
            return g;
        };

        var setPaddings = function() {
            var components = require("bubble-chart-components");
            var gridXTransform = components.get().xAxis.getAxisGrid().attr("transform");
            if (gridXTransform) {
                paddingRight = parseInt(gridXTransform.substring(gridXTransform.indexOf("(") + 1,
                    gridXTransform.indexOf(",")));
            }

            var gridYTransform = components.get().yAxis.getAxisGrid().attr("transform");
            if (gridYTransform) {
                paddingTop = parseInt(gridYTransform.substring(gridXTransform.indexOf(",") + 1,
                    gridXTransform.indexOf(")")));
            }

        };

        var getPaddingRight = function () {
            return paddingRight;
        };  

        var getPaddingTop = function () {
            return paddingTop;
        };

        return {
            init: init,
            render: render,
            getGroup: getGroup,
            getPaddingTop: getPaddingTop,
            getPaddingRight: getPaddingRight
        };  
    };

    return bubbles;
});