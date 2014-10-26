//Indicator Display
define([
    'd3',
    'underscore',
    'base/component'
], function(d3, _, Component) {

    var countries;

    var IndicatorDisplay = Component.extend({

		/*
         * INIT:
         * Executed once, before template loading
         */
        init: function(context, options) {
            this.name = "indicator-display";
            this.template = "components/_examples/indicator-display/indicator-display";
            this.tool = context;
            
            this._super(context, options);
        },

        /*
         * POSTRENDER:
         * Executed after template is loaded
         * Ideally, it contains instantiations related to template
         */
        postRender: function() {
            this.update();
        },


        /*
         * UPDATE:
         * Executed whenever data is changed
         * Ideally, it contains only operations related to data events
         */
        update: function() {
            var _this = this,
                indicator = this.model.getState("indicator"),
                year = this.model.getState("time"),
                countries = this.model.getData()[0],
                currCountries = {},
                step = (year.toString().split('.')[1] || []);


            var countriesByname = d3.nest().key(function(d) {
                return d['geo.name'];
            })
            .entries(countries);

            var currCountries = [] ;
            for (var i=0; i < countriesByname.length; i++) {
                var prev, next, cur = {};
                cur['geo.name'] = countriesByname[i].key;
                for (var j=0; j < countriesByname[i].values.length; j++) {
                    if (countriesByname[i].values[j].time == Math.floor(year)) {
                        prev = countriesByname[i].values[j][indicator];
                    }
                    if (countriesByname[i].values[j].time == Math.round(year)) {
                        next = countriesByname[i].values[j][indicator];
                    }
                }
                cur[indicator] = _this.model.interpolate(prev, next, step);                
                cur.time = year;

                currCountries.push(cur);
            }


            this.element.selectAll("p").remove();

            this.element.selectAll("p")
                .data(currCountries)
                .enter()
                .append("p");
            
            this.resize(); 
                
        },

        /*
         * RESIZE:
         * Executed whenever the container is resized
         * Ideally, it contains only operations related to size
         */
        resize: function() {
            var indicator = this.model.getState("indicator");

            if (this.getLayoutProfile() === 'small') {
                this.element.selectAll("p")
                .text(function(d) {
                    return d["geo.name"] + ": " + Math.round(d[indicator] / 100000) / 10 + " M"; 
                });
            }
            else {
                this.element.selectAll("p")
                .text(function(d) {
                    return d["geo.name"] + ": " + d[indicator]; 
                });
            }
        }

    });

    return IndicatorDisplay;

});