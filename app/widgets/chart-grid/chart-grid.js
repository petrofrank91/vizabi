define(['jquery', 'chart-grid-scale'], function($, scale) {

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


        var initializeLayers = function(renderDiv, components) {
            chartRenderDiv = renderDiv;
        };

        var updateLayout = function(vizStateObj, zoomScaleVal) {
            vizState = vizStateObj;
            zoomScale = zoomScaleVal;
            var isInteractive = vizState.get("isInteractive");

            return [xScale, yScale];
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
