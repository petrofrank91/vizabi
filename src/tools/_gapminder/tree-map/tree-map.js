//Tree Map
define([
    'base/tool'
], function(Tool) {

    var TreeMap = Tool.extend({

        /**
         * Initializes the tool (Tree Map).
         * Executed once before any template is rendered.
         * @param {Object} config Initial config, with name and placeholder
         * @param {Object} options Options such as state, data, etc
         */
        init: function(config, options) {
            
            this.name = "tree-map";
            this.template = "tools/_gapminder/tree-map/tree-map";

	        //specifying components
            this.components = [{
                component: '_gapminder/buttonlist',
                placeholder: '.vzb-tool-buttonlist'
                //model: ['time']  //pass this model to this component 
            },
            {
                component: '_gapminder/header',
                placeholder: '.vzb-tool-title'
                //model: ['time']  //pass this model to this component 
            },
            {
                component: '_gapminder/timeslider',
                placeholder: '.vzb-tool-timeslider'
                //model: ['time']  //pass this model to this component 
            },
            {
                component: '_gapminder/tree-map',
                placeholder: '.vzb-tool-viz'
                //model: ['time']  //pass this model to this component 
            },
            ];

            //you may add default options
            //this.default_options = {};

            //constructor is the same as any tool
            this._super(config, options);
        },

        /**
         * Validating the tool model
         * @param model the current tool model to be validated
         */
        toolModelValidation: function(model) {

            /* Example of model validation for time and data */ 

            var time = this.model.state.time,
                marker = this.model.state.marker.label;

            //don't validate anything if data hasn't been loaded
            if (!marker.getItems() || marker.getItems().length < 1) {
                return;
            }

            var dateMin = marker.getLimits('time').min,
                dateMax = marker.getLimits('time').max;

            if (time.start < dateMin) {
                time.start = dateMin;
            }
            if (time.end > dateMax) {
                time.end = dateMax;
            }

            /* End of example */
        }
    });

    return TreeMap;
});