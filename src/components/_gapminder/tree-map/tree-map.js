//Tree Map
define([
    'd3',
    'base/component'
], function(d3, Component) {

    var TreeMap = Component.extend({

        /**
         * Initializes the component (Tree Map).
         * Executed once before any template is rendered.
         * @param {Object} config The options passed to the component
         * @param {Object} context The component's parent
         */
        init: function(config, context) {
            this.name = 'tree-map';
            this.template = 'components/_gapminder/' + this.name + '/' + this.name;

            //determine which models this component expects
            //Obs: you may want to remove or add new ones
            this.model_expects = [{
                name: "time",
                type: "time"
            }, {
                name: "entities",
                type: "entities"
            }, {
                name: "items",
                type: "model"
            }, {
                name: "language",
                type: "language"
            }];

            //specifying subcomponents
            this.components = [];

            //model bindings
            var _this = this;
            this.model_binds = {
                "change:time": function(evt) {
                    console.log("Event triggered - change:time");
                },
                "change:items": function(evt) {
                    console.log("Event triggered - change:items");
                },
                "readyOnce": function(evt) {
                    console.log("Event triggered - change:items - all models are ready for the first time");
                },
                "ready": function(evt) {
                    console.log("Event triggered - ready - all models are ready");
                    _this.update();
                }
            };

            //contructor is the same as any component
            this._super(config, context);
        },

        /**
         * Executes after the template is loaded and rendered.
         * Ideally, it contains HTML instantiations related to template
         * At this point, this.element and this.placeholder are available as d3 objects
         */
        domReady: function() {
            //E.g: var graph = this.element.select('.vzb-graph');
        },

        /**
         * Simple callback called when "ready" event is triggered
         * Ideally, only operations related to changes in the model
         * At this point, this.element is available as a d3 object
         * See model_binds above
         */
        update: function() {
            //E.g: var year = this.model.get('value');
        },

        /**
         * Executes everytime the container or vizabi is resized
         * Ideally,it contains only operations related to size
         */
        resize: function() {
            //E.g: var height = this.placeholder.style('height');
        },


    });

    return TreeMap ;

});