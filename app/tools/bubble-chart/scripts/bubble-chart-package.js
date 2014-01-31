define(['bubble-chart-glue', 'bubble-chart-datahelper'], function (bubbleChart, bubbleChartDataHelper) {

    "use strict";

    // supposed to be available at window.vizabi
    var gapminder = {
        data: {
            bubbleChartDataHelper: bubbleChartDataHelper,
        },
        components: {},
        viz: {},
        bubbleChart: bubbleChart,
    };

    return gapminder;

});