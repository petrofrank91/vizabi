gapminder.viz.chartGrid = function() {

    var svg;
    var chartRenderDiv;
    var isInteractive;
    var xAxisContainer;
    var yAxisContainer;
    var grid;
    var scatterContainer;
    var xLabel;
    var yLabel;
    var linkLayer;
    var labelLayer;
    var xDomain;
    var yDomain;
    var xScale;
    var yScale;
    var xAxis;
    var yAxis;

    var margin = {
        top: 20,
        right: 20,
        //bottom: 80,
        bottom: -15,
        left: 100
    };
    var availableWidth;
    var availableHeight;

    var vizState;
    var yearLabel;
    //var zoom;
    var g;

    var initializeChartLayers = function(renderDiv) {
        chartRenderDiv = renderDiv + "-scatterChart";

        svg = d3.select("#" + renderDiv)
            .append("svg")
            .style({display: "block"});


        svg.attr("id", chartRenderDiv)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("version", "1.1")
            .classed("chart", true)
            .classed("scatter", true);

        g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        yearLabel = g.append("text")
            .attr("id", "label-year");

        xLabel = g
            .append("svg:text")
            .attr("class", "axisLabel");

        yLabel = g
            .append("svg:text")
            .attr("class", "axisLabel")
            .attr("class", "axisLabel");

        xAxisContainer = g.append("g")
            .attr("class", "axis x");

        yAxisContainer = g.append("g")
            .attr("class", "axis y");

        grid = g.append("g")
            .attr("class", "grid");

        scatterContainer = g.append("g")
            .attr("class", "scatterContainer");

        linkLayer = g.append("g")
            .attr("class", "linkLayer");

        labelLayer = g.append("g")
            .attr("class","labelLayer");
    };

    var updateLayout = function(vizStateObj) {
        vizState = vizStateObj;
        var isInteractive = vizState.get("isInteractive");

        if (isInteractive) {
            availableWidth = ($(window).width()) - margin.left - margin.right;
            availableHeight = ($(window).height()) - margin.top - margin.bottom;

            svg.attr("viewBox", "70 0" + " " + availableWidth + " " + availableHeight * 1.14);
        } else {
            availableWidth = 1061.102362205;
            availableHeight = 772.755905512;

            svg.attr("viewBox", "70 0" + " " + availableWidth + " " + availableHeight * 1.12);
        }

        console.log("Update Layout", svg.style('width'), parseInt(svg.style('width')), "width");

        createXAxis();
        createYAxis();
        //setZoom();

        return [xScale, yScale];
    };

    var createXAxis = function() {
        var xLabelText = vizState.getDataHelper().getAxisNames()[0];
        if (!xLabelText) {
            xLabelText = vizState.get("xIndicator");
        }

        xLabel
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + availableWidth + "," + (availableHeight + margin.bottom * 0.6) + ")")
            .attr("font-size", "30px")
            .text(xLabelText)
            .append("svg:title")
            .text(function() {
                return vizState.getDataHelper().getAxisInfo()[0];
            });

        if (vizState.get("minXValue") !== undefined && vizState.get("maxXValue") !== undefined) {
            xDomain = [vizState.get("minXValue"), vizState.get("maxXValue")];
        } else {
            xDomain = [vizState.getDataHelper().getMinOfXIndicator(), vizState.getDataHelper().getMaxOfXIndicator()];
        }

        if (vizState.get("xAxisScale") === "log") {
            xScale = d3.scale.log().domain(xDomain).range([0, availableWidth]);
        } else {
            xScale = d3.scale.linear().domain(xDomain).range([0, availableWidth]);
        }

        xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function(d) {return "$" + d;})
            .ticks(10)
            .tickSize(-availableHeight, 0, 0)
            .tickPadding(5)
            .orient("bottom");

        if (vizState.get("xAxisTickValues")) {
            xAxis.tickValues(vizState.get("xAxisTickValues"));
        }

        xAxisContainer
            .attr("transform", "translate(0," + (availableHeight) + ")")
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

        if (vizState.get("minYValue") !== undefined && vizState.get("maxYValue") !== undefined) {
            yDomain = [vizState.get("minYValue"), vizState.get("maxYValue")];
        } else {
            yDomain = [vizState.getDataHelper().getMinOfYIndicator(), vizState.getDataHelper().getMaxOfYIndicator()];
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


        var g = d3.select("#" + chartRenderDiv).select("g").select(".axis.x");
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

    var setZoom = function () {
        var zoom = d3.behavior.zoom()
            .x(xScale)
            .y(yScale)
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

        g.call(zoom);
    };

    var zoomed = function () {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
    };


    return {
        initializeLayers: initializeChartLayers,
        updateLayout: updateLayout,
        getAvailableHeightAndWidth: getAvailableHeightAndWidth,
        getXAxisContainer: getXAxisContainer,
        getXLabel: getXLabel,
        getMargin: getMargin
    };
};