define(['util', 'chart-grid-scale'], function (util, scale) {

    var vizBubble = function(callback) {
        var svg;
        var scatterContainer;
        var labelLayer;

        var width = 300;
        var height = 300;

        var countryLayers;
        var linkLayer;

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

        var update = function(state, chartScale, availableFrame) {
            vizState = state;
            isInteractive = state.get("isInteractive");

            scatterContainer = components.scatterContainer;
            linkLayer = components.linkLayer;
            labelLayer = components.labelLayer;
        };

        var update = function (state, chartScale, availableFrame) {
            vizState = state;
        };

        var updateLayout = function () {};

        var setUpChartInfoDivs = function() {
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
