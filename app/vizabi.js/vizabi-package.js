define(['util', 'bubble-chart-package'], function (util, bubbleChartPackage) {

    "use strict";

    var vizabi = {
        data_manager: {},
        viz: {tools: {}},
        components: {},
        tools: {},
        graphics: {},
        positions: {},
        version: "0.1.0"
    };

    // bubbleChart
    util.extend(vizabi, bubbleChartPackage);

    // chartGrid
    //util.extend(vizabi, chartGridPackage);

    // lineChart
    //util.extend(vizabi, lineChartPackage);

    return vizabi;

});