define(['jquery'], function($) {

    var chartGrid = function() {

        var svg;
        var chartRenderDiv;
        var isInteractive;
        var xAxisContainer;
        var yAxisContainer;
        var grid;
        var xLabel;
        var yLabel;
        var xDomain;
        var yDomain;
        var xScale;
        var yScale;
        var xAxis;
        var yAxis;
        var zoomScale;

        var margin = {
            top: 20,
            right: 20,
            bottom: -15,
            left: 100
        };
        var availableWidth;
        var availableHeight;

        var vizState;
        var yearLabel;
        var g;
        var searchLayer;


        var initializeChartLayers = function(renderDiv) {
            chartRenderDiv = renderDiv + "-scatterChart";
            xAxisContainer = components.xAxis;
            yAxisContainer = components.yAxis;

            yearLabel = components.yearLabel.append("text")
                .attr("id", "label-year");

            xLabel = components.xLabel
                .append("text")
                .attr("class", "axisLabel");

            yLabel = components.yLabel
                .append("text")
                .attr("class", "axisLabel")
                .attr("class", "axisLabel");

            components.search.append("rect")
                .attr("width", "100")
                .attr("height", "20")
                .attr("opacity", "0.2");
        };

        var updateLayout = function(vizStateObj, zoomScaleVal) {
            vizState = vizStateObj;
            zoomScale = zoomScaleVal;
            var isInteractive = vizState.get("isInteractive");

            if (isInteractive) {
                availableWidth = ($(window).width()) - margin.left - margin.right;
                availableHeight = ($(window).height()) - margin.top - margin.bottom;

            } else {
                availableWidth = 1061.102362205;
                availableHeight = 772.755905512;
            }

            createXAxis();
            createYAxis();

            return [xScale, yScale];
        };

        var createXAxis = function() {
            var xLabelText = vizState.getDataHelper().getAxisNames()[0];
            if (!xLabelText) {
                xLabelText = vizState.get("xIndicator");
            }

            xLabel
                .attr("text-anchor", "middle")
                .attr("font-size", "30px")
                .text(xLabelText)
                .append("svg:title")
                .text(function() {
                    return vizState.getDataHelper().getAxisInfo()[0];
                });

            var xDomain = [];
            if (vizState.get("minXValue") !== undefined && vizState.get("maxXValue") !== undefined) {
                var updatedMinX = vizState.get("updatedMinXValue");
                var minX = vizState.get("minXValue");

                if (updatedMinX && updatedMinX < minX) {
                    xDomain[0] = updatedMinX;
                } else {
                    xDomain[0] = minX;
                }

                var maxX = vizState.get("maxXValue");
                var updatedMaxX = vizState.get("updatedMaxXValue");

                if (updatedMaxX && updatedMaxX > maxX) {
                    xDomain[1] = updatedMaxX;
                } else {
                    xDomain[1] = maxX;
                }

            } else {
                xDomain = [vizState.getDataHelper().getMinOfXIndicator(), vizState.getDataHelper().getMaxOfXIndicator()];
            }

            if (zoomScale) {
                xDomain[0] /= zoomScale;
                xDomain[1] /= zoomScale;
            }

            if (vizState.get("xAxisScale") === "log") {
                xScale = d3.scale.log().domain(xDomain).range([0, availableWidth]);
            } else {
                xScale = d3.scale.linear().domain(xDomain).range([0, availableWidth]);
            }

            xAxis = d3.svg.axis()
                .scale(xScale)
                .tickFormat(function(d) {
                    return "$" + d;
                })
                .ticks(10)
                .tickSize(-availableHeight, 0, 0)
                .tickPadding(5)
                .orient("bottom");

            if (vizState.get("xAxisTickValues")) {
                xAxis.tickValues(vizState.get("xAxisTickValues"));
            }

            xAxisContainer
                .attr("stroke", "lightgrey")
                .classed("print", !vizState.get("isInteractive"))
                .call(xAxis);

            return xScale;
        };

        var createYAxis = function() {
            var yLabelText = vizState.getDataHelper().getAxisNames()[1];

            if (!yLabelText) {
                yLabelText = vizState.get("yIndicator");
            }

            yLabel
                .attr("text-anchor", "middle")
                .attr("font-size", "30px")
                .text(yLabelText)
                .append("svg:title")
                .text(function() {
                    return vizState.getDataHelper().getAxisInfo()[1];
                });

            var yDomain = [];
            if (vizState.get("minYValue") !== undefined && vizState.get("maxYValue") !== undefined) {
                var updatedMinY = vizState.get("updatedMinYValue");
                var minY = vizState.get("minYValue");

                if (updatedMinY && updatedMinY < minY) {
                    yDomain[0] = updatedMinY;
                } else {
                    yDomain[0] = minY;
                }

                var maxY = vizState.get("maxYValue");
                var updatedMaxY = vizState.get("updatedMaxYValue");

                if (updatedMaxY && updatedMaxY > maxY) {
                    yDomain[1] = updatedMaxY;
                } else {
                    yDomain[1] = maxY;
                }
            } else {
                yDomain = [vizState.getDataHelper().getMinOfYIndicator(), vizState.getDataHelper().getMaxOfYIndicator()];
            }
            if (zoomScale) {
                yDomain[0] /= zoomScale;
                yDomain[1] /= zoomScale;
            }

            if (vizState.get("yAxisScale") === "log") {
                yScale = d3.scale.log().domain(yDomain).range([availableHeight, 0]);
            } else {
                yScale = d3.scale.linear().domain(yDomain).range([availableHeight, 0]);
            }

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10)
                .tickSize(-availableWidth, 0, 0)
                .tickPadding(5);


            if (vizState.get("yAxisTickValues")) {
                yAxis.tickValues(vizState.get("yAxisTickValues"));
            }

            yAxisContainer
                .attr("stroke", "lightgrey")
                .classed("print", !vizState.get("isInteractive"))
                .call(yAxis);


            yearLabel
                .attr("x", g.node().getBBox().width / 2)
                .attr("y", g.node().getBBox().height / 2)
                .text(Math.floor(vizState.get("year")));
            return yScale;
        };

        var getAvailableHeightAndWidth = function() {
            return [availableHeight, availableWidth];
        };

        var getXAxisContainer = function() {
            return xAxisContainer;
        };

        var getXLabel = function() {
            return xLabel;
        };

        var getMargin = function() {
            return margin;
        };

        var getXScale = function() {
            return xScale;
        };

        var getYScale = function() {
            return yScale;
        };

        var getXAxis = function() {
            return xAxis;
        };

        var getYAxis = function() {
            return yAxis;
        };

        return {
            initializeLayers: initializeLayers,
            updateLayout: updateLayout,
            getAvailableHeightAndWidth: getAvailableHeightAndWidth,
            getXAxisContainer: getXAxisContainer,
            getXLabel: getXLabel,
            getMargin: getMargin,
            getXScale: getXScale,
            getYScale: getYScale,
            getXAxis: getXAxis,
            getYAxis: getYAxis

        };
    };

    return chartGrid;

});