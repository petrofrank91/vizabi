define([
        'util',
        'bubble-chart-package',
        'bubble-map/glue',
        'income-mountain/glue'
    ],
    function (util, bubbleChartPackage, bubbleMap, incomeMountain) {
        'use strict';

        var vizabi = {
            data_manager: {},
            viz: {tools: {}},
            components: {},
            tools: {},
            graphics: {},
            positions: {},
            version: '0.1.0'
        };

        // bubbleChart
        util.extend(vizabi, bubbleChartPackage);

        // chartGrid
        //util.extend(vizabi, chartGridPackage);

        // lineChart
        //util.extend(vizabi, lineChartPackage);

        // Bubble Map
        util.extend(vizabi, {
            bubbleMap: function(div, state, properties, i18nfn) {
                var viz = new bubbleMap();
                viz.init(div, state, properties, i18nfn);
                return viz;
            }
        });

        // Income Mountain
        util.extend(vizabi, {
            incomeMountain: function(div, state, properties, i18nfn) {
                incomeMountain.init(div, state, properties, i18nfn);
                return incomeMountain;
            }
        });

        return vizabi;
    }
);