require.config({
    paths: {

        // packages
        'bubble-chart-package': '../../tools/bubble-chart/scripts/bubble-chart-package',
        'vizabi-package': '../../vizabi.js/vizabi-package',

        // common deps
        'd3': '../../bower_components/d3/d3',
        'jquery': '../../bower_components/jquery/jquery',
        'jquery.ui': '../../bower_components/jquery-ui/ui/jquery-ui',
        /*
         'jquery.ui.core': '../../bower_components/jquery-ui/ui/jquery.ui.core',
         'jquery.ui.widget': '../../bower_components/jquery-ui/ui/jquery.ui.widget',
         'jquery.ui.mouse': '../../bower_components/jquery-ui/ui/jquery.ui.mouse',
         'jquery.ui.slider': '../../bower_components/jquery-ui/ui/jquery.ui.slider',
         */
        'util': "helpers/util",

        // bubble chart
        'bubble-chart-model': "../../tools/bubble-chart/scripts/bubble-chart-model",
        'bubble-chart-model-validator': "../../tools/bubble-chart/scripts/bubble-chart-model-validator",
        'bubble-chart-glue': "../../tools/bubble-chart/scripts/bubble-chart-glue",
        'bubble-chart-datahelper': "../../tools/bubble-chart/scripts/bubble-chart-datahelper",
        'viz-bubble': "../../tools/bubble-chart/scripts/viz/viz-bubble",
        'viz-bubble-print': "../../tools/bubble-chart/scripts/viz/viz-bubble-print",

        // data-cube related
        'queue-async': "../../bower_components/queue-async/queue",
        'data-cube': "../../vizabi-components/data-cube/data-cube",
        'reader-multiple-json': "../../vizabi-components/data-cube/loader/reader-multiple-json",
        'reader-single-csv': "../../vizabi-components/data-cube/loader/reader-single-csv",
        'reader-multiple-csv': "../../vizabi-components/data-cube/loader/reader-multiple-csv",
        'reader-multi-csv': "../../vizabi-components/data-cube/loader/reader-multi-csv",
        'loader-factory': "../../vizabi-components/data-cube/loader-factory",
        'i18n-helper': "../../vizabi-components/data-cube/i18n-helper",

        // widgets
        'settings-button': "../../widgets/settings-button/settings-button",
        'time-slider-jQueryUI': "../../widgets/time-slider-jQueryUI/time-slider-jQueryUI",
        'chart-grid': "../../widgets/chart-grid/chart-grid",

        /* aliases to project-specific files */
        //'tool': '../../tools/{{project}}/scripts', // replaced in main-processed.js

    },
    shim: {
        // simple shims
        'jquery': {'exports': 'jQuery'},
        'd3': {exports: "d3"},
        'queue-async': {exports: "queue"},

        // jQuery UI Slider dependency chain START
        'jquery.ui.core': ['jquery'],
        'jquery.ui.widget': ['jquery.ui.core'],
        'jquery.ui.mouse': ['jquery.ui.widget'],
        'jquery.ui.slider': ['jquery.ui.mouse']
        // jQuery UI Slider dependency chain END

    },
    waitSeconds: 30
});

// Define jQuery as AMD module
define.amd.jQuery = true;

require([
    'jquery',
    'vizabi-package'
    //'project/app',
    //'domReady',
    //'tools',
], function ($, vizabi, domReady) {

    console.log('@main');

    //domReady(function () {
    //console.log('@domReady');
    var chartState = {
        dataPath: "data/",
        year: 1960,
        xIndicator: "tfr1",
        yIndicator: "mort",
        sizeIndicator: "pop",
        entity: "unstates",
        isInteractive: true,
        fileFormat: "multipleJSON"
    };

    var renderDiv = "chart-1";

    var app = new vizabi.bubbleChart(renderDiv, chartState);

    /*
     // Create a new tool view
     var view = new toolView({
     });

     // Render the view internally
     view.render();

     // Add the rendered div element to the DOM
     view.$el.appendTo($('div.container'));
     */

    //});

});