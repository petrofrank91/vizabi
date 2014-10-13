define([
    'jquery',
    'd3',
    'base/utils',
    'base/component',
    'jqueryui_slider'
], function($, d3, utils, Component) {

    var container,
        timeslider,
        range,
        value;
        //handle;


    var TimeTimeslider = Component.extend({
        init: function(parent, options) {
            this.template = "components/_gapminder/time-time-slider/time-time-slider";

            // Same constructor as the superclass
            this._super(parent, options);
        },

        postRender: function() {
            this.placeholder = utils.d3ToJquery(this.placeholder);
            container = utils.d3ToJquery(this.element);

            range = container.find(".input-range");
            value = $('.range-value');
            this.update();
        },


        resize: function() {
            this.update();
        },

        update: function() {
            var _this = this,
                year = this.model.getState("time");

            var data = this.model.getData()[0],
                minValue = d3.min(data, function(d) {
                    return +d.time;
                }),
                maxValue = d3.max(data, function(d) {
                    return +d.time;
                });
            
            range.attr("value", year);
            value.html(year);

            range.on('input', function(){
                value.html(this.value);
                //_this.setYear(this.value);
                console.log("Setting range");
            });

            range.attr("min", minValue)
                     .attr("max", maxValue);

            range.attr("data-year", year);
        },

        getYear: function() {
            return this.model.getState("time");
        },

        setYear: function(year, silent) {
            //update state

            this.model.setState({
                time: year
            }, silent);

            this.update();
        },

    });

    return TimeTimeslider;
});