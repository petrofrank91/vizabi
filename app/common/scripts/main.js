require.config({
    paths: {

        // packages
        'bubble-chart-package': '../../tools/bubble-chart/scripts/bubble-chart-package',
        'vizabi-package': '../../vizabi.js/vizabi-package',

        // common deps
        'd3': '../../bower_components/d3/d3',
        'jquery': '../../bower_components/jquery/jquery',
        'jquery.ui': '../../bower_components/jquery-ui/ui/jquery-ui',
        'jstat': '../../bower_components/rm-jstat/jstat',
        'entities': 'libs/entities',
        'jed': '../../bower_components/jed/jed',
        'zepto': '../../bower_components/zepto/zepto.min',
        /*
         'jquery.ui.core': '../../bower_components/jquery-ui/ui/jquery.ui.core',
         'jquery.ui.widget': '../../bower_components/jquery-ui/ui/jquery.ui.widget',
         'jquery.ui.mouse': '../../bower_components/jquery-ui/ui/jquery.ui.mouse',
         'jquery.ui.slider': '../../bower_components/jquery-ui/ui/jquery.ui.slider',
         */
        'util': 'helpers/util',


        // sprintf
        'sprintf': '../../bower_components/sprintf/src/sprintf.min',

        // bubble chart
        'bubble-chart-model': '../../tools/bubble-chart/scripts/bubble-chart-model',
        'bubble-chart-model-validator': '../../tools/bubble-chart/scripts/bubble-chart-model-validator',
        'bubble-chart-glue': '../../tools/bubble-chart/scripts/bubble-chart-glue',
        'bubble-chart-datahelper': '../../tools/bubble-chart/scripts/bubble-chart-datahelper',
        'viz-bubble': '../../tools/bubble-chart/scripts/viz/viz-bubble',
        'viz-bubble-print': '../../tools/bubble-chart/scripts/viz/viz-bubble-print',

        // income mountain
        'income-mountain': '../../tools/income-mountain',

        // bubble map
        'bubble-map': '../../tools/bubble-map',

        // data-cube related
        'queue-async': '../../bower_components/queue-async/queue',
        'data-cube': '../../vizabi-components/data-cube/data-cube',
        'reader-multiple-json': '../../vizabi-components/data-cube/loader/reader-multiple-json',
        'reader-single-csv': '../../vizabi-components/data-cube/loader/reader-single-csv',
        'reader-multiple-csv': '../../vizabi-components/data-cube/loader/reader-multiple-csv',
        'reader-multi-csv': '../../vizabi-components/data-cube/loader/reader-multi-csv',
        'loader-factory': '../../vizabi-components/data-cube/loader-factory',
        'i18n-helper': '../../vizabi-components/data-cube/i18n-helper',

        // components
        'layout-manager': '../../vizabi-components/layout-manager/layout-manager',
        'i18n-manager': '../../vizabi-components/i18n-manager/i18n-manager'

        // widgets
        'settings-button': '../../widgets/settings-button/settings-button',
        'time-slider-jQueryUI': '../../widgets/time-slider-jQueryUI/time-slider-jQueryUI',
        'chart-grid': '../../widgets/chart-grid/chart-grid',
        // timesliders
        'time-slider-1': '../../widgets/time-slider/slider-types/1/ts1',

        /* aliases to project-specific files */
        'project': '../../{{project}}/scripts' // variable replaced by grunt task and ends up in main-processed.js

    },
    shim: {
        // simple shims
        'd3': {exports: 'd3'},
        'jquery': {'exports': 'jQuery'},
        'jquery.ui': {deps: ['jquery'], exports: 'jQuery'},
        'queue-async': {exports: 'queue'},
        'zepto': {exports: 'Zepto'},
        'sprintf': {exports: 'sprintf'},

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
    'vizabi-package'
], function (vizabi) {

    //if (typeof(console) !== 'undefined' && console.log) console.log('@vizabi amd loaded', window.vizabi, vizabi);

    // attach vizabi to global scope if window.vizabi is already available - this is only true in the case of google maps style inclusion so we consider it safe
    if (typeof (window.vizabi) !== 'undefined') {
        window.vizabi = vizabi;
        window.vizabi.ready = function(callback) {
            callback();
        }
    }

    // dispatch event that vizabi is loaded
    var fireEvent = function (event) {
        if (document.createEventObject) {
            // dispatch for IE
            var evt = document.createEventObject();
            return this.fireEvent('on' + event, evt)
        } else {
            // dispatch for firefox + others
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(event, true, true); // event type,bubbling,cancelable
            return !this.dispatchEvent(evt);
        }
    };
    fireEvent.call(window.document, 'vizabiLoaded');

    //domReady(function () {
    //console.log('@domReady');
    //});

});
