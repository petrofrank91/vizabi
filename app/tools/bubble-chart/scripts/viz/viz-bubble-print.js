gapminder.viz.vizBubblePrint = function (chartRenderDiv, vizState, vizStateChangeCallback) {

    var labelPosition = "top-right";
    var positions = {};
    var isDrag;
    var defaultFontColor = "black";
    var selectedLabel = "";
    var initOffset = { dx: 0, dy: 0, set: false };

    var xScale;
    var yScale;
    var bubbleSizeScale;
    var fontSizeScale;

    var addLabels = function (year) {
        var labelsData = [];
        var entitiesMeta = vizState.getDataHelper().getEntityMeta();

        $.each(entitiesMeta, function (index, geoName) {
            var entityCategory = geoName[0].parent;
            var o = {};

            o.id = index;
            o.x = vizState.getDataHelper().get(vizState.get("xIndicator"), index, year, vizState, entityCategory);
            o.y = vizState.getDataHelper().get(vizState.get("yIndicator"), index, year, vizState, entityCategory);
            o.size = vizState.getDataHelper().get(vizState.get("sizeIndicator"), index, year, vizState, entityCategory);

            o.labelPosition = labelPosition;
            o.labelPos = setLabelPos(o);

            //o.name = vizState.getDataHelper().getName(id, entity);
            o.name = vizState.getDataHelper().getName(index);
            if (o.x && o.y && o.size) {
                labelsData.push(o);
            }
        });

        return labelsData;
    };

    var dragEndPrint = function (d) {
        var label;

        if (isDrag) {
            var dragId = d3.select("#" + d.id + "label").attr("id");

            label = d3.select("#" + d.id + "label");

            positions[d.id] = {x: parseFloat(d3.select("#" + d.id + "label").attr("x")).toFixed(2), y: parseFloat(d3.select("#" + d.id + "label").attr("y")).toFixed(2), anchor: d3.select("#" + d.id + "label").attr("text-anchor")};
            vizStateChangeCallback({positions: positions});

            d3.select("#" + dragId).attr("fill", defaultFontColor);
            d3.select("#" + chartRenderDiv).selectAll(".highlightNode").remove();
            isDrag = false;
        }
        else {
            if (selectedLabel === "") {
                labelClicked(d.id + "label");
            }
            else {
                $("#alignButtons").hide();
                d3.select("#" + selectedLabel).attr("fill", defaultFontColor);

                label = d3.select("#" + selectedLabel);
                positions[selectedLabel.substring(0, selectedLabel.indexOf("label"))] = {x: parseFloat(label.attr("x")).toFixed(2), y: parseFloat(label.attr("y")).toFixed(2), anchor: label.attr("text-anchor")};

                vizStateChangeCallback({positions: positions});
                d3.select("#" + chartRenderDiv).selectAll(".highlightNode").remove();

                labelClicked(d.id + "label");
            }
        }
    };

    var dragMovePrint = function (d, i) {
        isDrag = true;

        var dragId = d3.select(this).attr("id");
        d3.select("#" + dragId).attr("fill", "red");

        var textElem = d3.select(this);
        if (!initOffset.set) {
            initOffset.dx = textElem.attr('x') - d3.event.x;
            initOffset.dy = textElem.attr('y') - d3.event.y;
            initOffset.set = true;
        }

        textElem.attr("x", d3.event.x + initOffset.dx)
            .attr("y", d3.event.y + initOffset.dy);


        var overNode = d3.select("#" + dragId.substring(0, dragId.indexOf("label"))).select("circle");
        var nodeX = parseInt(overNode.attr("cx"));
        var nodeY = parseInt(overNode.attr("cy"));
        var nodeR = parseInt(overNode.attr("r"));
        var nodeFill = overNode.attr("fill");

        var highlight = overNode.node().cloneNode(true);
        var highlightNode = d3.select(highlight)
            .attr("pointer-events", "none")
            .attr("class", "highlightNode")
            .attr("fill", "none")
            .attr("r", nodeR + 5)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1)
            .attr("stroke-width", "1px")
            .attr("stroke", nodeFill);

        overNode.node().parentNode.insertBefore(highlightNode.node(), overNode.node().nextSibling);

        positions[d.id] = {x: parseFloat(d3.select("#" + d.id + "label").attr("x")).toFixed(2), y: parseFloat(d3.select("#" + d.id + "label").attr("y")).toFixed(2), anchor: d3.select("#" + d.id + "label").attr("text-anchor")};
    };

    var dragStartPrint = function (d, i) {
        initOffset.set = false;
    };

    var drawLabels = function (bubbleSizeScaleObj, fontSizeScaleObj, xScaleObj, yScaleObj) {
        var year = vizState.get("year");
        var trails = vizState.get("trails");
        bubbleSizeScale = bubbleSizeScaleObj;
        fontSizeScale = fontSizeScaleObj;
        xScale = xScaleObj;
        yScale = yScaleObj;

        var labelsData = addLabels(year);

        if (labelsData.length === 0) {
            return;
        }

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

        var positions = vizState.get("positions");

        var labelText = labelContainer
            .append("text")
            .attr("class", "labelText")
            .attr("text-anchor", function (d) {
                if (typeof positions[d.id] === "undefined") {
                    if (labelPosition.indexOf("right") !== -1) {
                        return "end";
                    }
                    else if (labelPosition.indexOf("left") !== -1) {
                        return "start";
                    }
                    else {
                        return "middle";
                    }
                }
                else {
                    return positions[d.id].anchor;
                }
            })
            .attr("dominant-baseline", "central")
            .attr("font-family", "'Helvetica', sans-serif")
            .attr("id", function (d) {
                return d.id + "label";
            });

        d3.selectAll(".labelNode")
            .selectAll(".labelText")
            .attr("text-anchor", function (d) {
                if (typeof positions[d.id] === "undefined") {
                    if (labelPosition.indexOf("right") !== -1) {
                        return "start";
                    }
                    else if (labelPosition.indexOf("left") !== -1) {
                        return "end";
                    }
                    else {
                        return "middle";
                    }
                }
                else if (positions[d.id]) {
                    return positions[d.id].anchor;
                }
            })
            .style("font-size", function (d) {
                return Math.floor(fontSizeScale(d.size)) + "px";
            });


        if (vizState.get("editMode")) {
            var dragPrint = d3.behavior.drag()
                .on("dragstart", dragStartPrint)
                .on("drag", dragMovePrint)
                .on("dragend", dragEndPrint);

            d3.selectAll(".labelNode")
                .selectAll(".labelText")
                .call(dragPrint);
        }
        else {
            d3.selectAll(".labelNode")
                .selectAll(".labelText").on('mousedown.drag', null);

            if (selectedLabel) {
                d3.select("#" + selectedLabel).attr("fill", defaultFontColor);
                $("#alignButtons").hide();
                selectedLabel = "";
            }
        }

        labels.each(function (d) {
            d3.select(this).select(".labelText")
                .attr("x", function (d) {
                    if (positions[d.id]) {
                        return positions[d.id].x;
                    }
                    else {
                        return d.labelPos[0];
                    }
                })
                .attr("y", function (d) {
                    if (positions[d.id]) {
                        return positions[d.id].y;
                    }
                    else {
                        return d.labelPos[1];

                    }
                })
                .text(function (d) {
                    return d.name;
                });

            var bbox = d3.select(this).select(".labelText").node().getBBox();
            var a = {};
            a.x1 = bbox.x;
            a.y1 = bbox.y;
            a.x2 = a.x1 + bbox.width;
            a.y2 = a.y1;
            a.x3 = a.x1;
            a.y3 = a.y1 - bbox.height;
            a.x4 = a.x1 + bbox.width;
            a.y4 = a.y2 - bbox.height;

            d.neighbourhood = {x1: a.x1, y1: a.y1, x2: a.x2, y2: a.y2, x3: a.x3, y3: a.y3, x4: a.x4, y4: a.y4};

        });

        labels.exit().remove();
    };

    var setLabelPos = function (entityObj) {
        var labelPos;

        if (entityObj.labelPosition === "top") {
            labelPos = [xScale(entityObj.x), yScale(entityObj.y) - bubbleSizeScale(entityObj.size) - fontSizeScale(entityObj.size) / 2];
        }
        else if (entityObj.labelPosition === "bottom") {
            labelPos = [xScale(entityObj.x), yScale(entityObj.y) + bubbleSizeScale(entityObj.size) + fontSizeScale(entityObj.size) / 2];
        }
        else if (entityObj.labelPosition === "left") {
            labelPos = [xScale(entityObj.x) - bubbleSizeScale(entityObj.size), yScale(entityObj.y)];
        }
        else if (entityObj.labelPosition === "right") {
            labelPos = [xScale(entityObj.x) + bubbleSizeScale(entityObj.size), yScale(entityObj.y)];
        }
        if (entityObj.labelPosition === "top-right") {
            labelPos = [xScale(entityObj.x) + bubbleSizeScale(entityObj.size), yScale(entityObj.y) - bubbleSizeScale(entityObj.size)];
        }
        else if (entityObj.labelPosition === "top-left") {
            labelPos = [xScale(entityObj.x) - bubbleSizeScale(entityObj.size), yScale(entityObj.y) - bubbleSizeScale(entityObj.size)];
        }
        else if (entityObj.labelPosition === "bottom-left") {
            labelPos = [xScale(entityObj.x) - bubbleSizeScale(entityObj.size), yScale(entityObj.y) + bubbleSizeScale(entityObj.size)];
        }
        else if (entityObj.labelPosition === "bottom-right") {
            labelPos = [xScale(entityObj.x) + bubbleSizeScale(entityObj.size), yScale(entityObj.y) + bubbleSizeScale(entityObj.size)];
        }

        return labelPos;
    };

    var labelClicked = function (id) {
        if (vizState.get("editMode")) {
            selectedLabel = id;
            d3.select("#" + id).attr("fill", "red");

            var alignButton;
            if (d3.select("#" + id).attr("text-anchor") === "end") {
                alignButton = $("#rightAlign");
                alignButton[0].checked = true;
                alignButton.button("refresh");
            }
            else if (d3.select("#" + id).attr("text-anchor") === "middle") {
                alignButton = $("#midAlign");
                alignButton[0].checked = true;
                alignButton.button("refresh");
            }
            else if (d3.select("#" + id).attr("text-anchor") === "start") {
                alignButton = $("#leftAlign");
                alignButton[0].checked = true;
                alignButton.button("refresh");
            }

            var textPos = $("#" + id).offset();
            var width = d3.select("#" + id).node().getBBox();

            var overNode = d3.select("#" + id.substring(0, id.indexOf("label"))).select("circle");
            var nodeX = parseInt(overNode.attr("cx"));
            var nodeY = parseInt(overNode.attr("cy"));
            var nodeR = parseInt(overNode.attr("r"));
            var nodeFill = overNode.attr("fill");

            var highlight = overNode.node().cloneNode(true);
            var highlightNode = d3.select(highlight)
                .attr("pointer-events", "none")
                .attr("class", "highlightNode")
                .attr("fill", "none")
                .attr("r", nodeR + 4)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1)
                .attr("stroke-width", "3px")
                .attr("stroke", nodeFill);

            overNode.node().parentNode.insertBefore(highlightNode.node(), overNode.node().nextSibling);

            $("#alignButtons").css({"position": "relative", "top": textPos.top - 170, "left": textPos.left - 120});
            $("#languageSelect").css({"position": "relative", "top": -20, "left": -90}).appendTo($("#alignButtons"));
            $("#alignButtons").show();

        }
    };

    var registerClickEventListerners = function () {
        d3.select("body")
            .on("mousedown", function () {
                var target = d3.select(d3.event.target);

                if (target.attr("class") === "chart scatter" && selectedLabel !== "") {
                    var label = d3.select("#" + selectedLabel);

                    var selected = selectedLabel.substring(0, selectedLabel.indexOf("label"));

                    positions[selectedLabel.substring(0, selectedLabel.indexOf("label"))] = {x: parseFloat(label.attr("x")).toFixed(2), y: parseFloat(label.attr("y")).toFixed(2), anchor: label.attr("text-anchor")};
                    vizStateChangeCallback({positions: positions});

                    d3.select("#" + chartRenderDiv).selectAll(".highlightNode").remove();
                    label.attr("fill", defaultFontColor);

                    $("#alignButtons").hide();
                    $("#languageSelect").css({"position": "relative", "top": "20px", "left": "30px"}).appendTo("#selectBox");

                    selectedLabel = "";
                }

            })
            .on("keydown", function () {
                if (selectedLabel !== "" && vizState.get("editMode")) {
                    var label = d3.select("#" + selectedLabel);
                    var textPos = $("#" + selectedLabel).offset();

                    if (d3.event.keyCode === 65) {
                        label.attr("x", parseFloat(label.attr("x")) - 2);
                        $("#alignButtons").css({"position": "relative", "top": textPos.top - 170, "left": textPos.left - 122});
                    }
                    else if (d3.event.keyCode === 87) {
                        label.attr("y", parseFloat(label.attr("y")) - 2);
                        $("#alignButtons").css({"position": "relative", "top": textPos.top - 172, "left": textPos.left - 120});
                    }
                    else if (d3.event.keyCode === 68) {
                        label.attr("x", parseFloat(label.attr("x")) + 2);
                        $("#alignButtons").css({"position": "relative", "top": textPos.top - 170, "left": textPos.left - 118});

                    }
                    else if (d3.event.keyCode === 83) {
                        label.attr("y", parseFloat(label.attr("y")) + 2);
                        $("#alignButtons").css({"position": "relative", "top": textPos.top - 170, "left": textPos.left - 118});
                    }
                }
            });


    };

    var registerAlignButtonsEventListeners = function () {
        $("input:radio[name=setting]").change(function () {
            if ($('input:radio[name="setting"]:checked').val() === "leftAlign") {
                d3.select("#" + selectedLabel).attr("text-anchor", "start");
            }
            else if ($('input:radio[name="setting"]:checked').val() === "rightAlign") {
                d3.select("#" + selectedLabel).attr("text-anchor", "end");
            }
            else if ($('input:radio[name="setting"]:checked').val() === "midAlign") {
                d3.select("#" + selectedLabel).attr("text-anchor", "middle");
            }
        });
    };

    var bubbleClickHandlerPrint = function (d, i) {
        var overNode = d3.select("#" + d.id).select("circle");
        var nodeX = parseInt(overNode.attr("cx"));
        var nodeY = parseInt(overNode.attr("cy"));
        var nodeR = parseInt(overNode.attr("r"));
        var nodeFill = overNode.attr("fill");

        var highlight = overNode.node().cloneNode(true);
        var highlightNode = d3.select(highlight)
            .attr("pointer-events", "none")
            .attr("class", "highlightNode")
            .attr("fill", "none")
            .attr("r", nodeR + 4)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1)
            .attr("stroke-width", "3px")
            .attr("stroke", nodeFill);

        overNode.node().parentNode.insertBefore(highlightNode.node(), overNode.node().nextSibling);
        labelClicked(d.id + "label");
    };

    return {
        drawLabels: drawLabels,
        registerClickEventListerners: registerClickEventListerners,
        bubbleClickHandlerPrint: bubbleClickHandlerPrint,
        registerAlignButtonsEventListeners: registerAlignButtonsEventListeners,
        addLabels: addLabels,
    };
};