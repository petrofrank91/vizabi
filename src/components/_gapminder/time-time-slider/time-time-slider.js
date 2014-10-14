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
        value,
        data,
        minValue,
        maxValue,
        playing,
        playInterval;


    var TimeTimeslider = Component.extend({
        init: function(parent, options) {
            this.template = "components/_gapminder/time-time-slider/time-time-slider";

            // Same constructor as the superclass
            this._super(parent, options);
        },

        postRender: function() {
            var _this = this;
            playing = false;

            this.placeholder = utils.d3ToJquery(this.placeholder);
            container = utils.d3ToJquery(this.element);

            range = container.find(".input-range");
            value = $('.range-value');

            play = container.find("#play-button-play"),
            pause = container.find("#play-button-pause");

            play.click(function() {
                _this.play();
            });

            pause.click(function() {
                _this.pause();
            });

            this.events.bind('timeslider:dragging', function() {
                _this.pause();
            });

            range.on('input', function(){
                _this.setYear(parseFloat(this.value));
            });

            this.update();
        },


        resize: function() {
            this.update();
        },

        update: function() {
            var _this = this,
                year = this.model.getState("time");

            data = this.model.getData()[0],
                minValue = d3.min(data, function(d) {
                    return +d.time;
                }),
                maxValue = d3.max(data, function(d) {
                    return +d.time;
                });
            
            range.attr("min", minValue)
                 .attr("max", maxValue)
                 .attr("data-year", year)
                 .val(year);        
                 

            value.html(year);
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

       play: function() {
            //return if already playing
            if (playing) return;

            container.addClass("playing");

            var _this = this,
                year = this.model.getState("time");

            playInterval = setInterval(function() {
                if (year > maxValue) {
                    _this.pause();
                    return;
                } else {
                    year++;
                    _this.setYear(year);
                }
            }, 100);
        },

        pause: function() {
            container.removeClass("playing");
            clearInterval(playInterval);
        }
    });

    return TimeTimeslider;
});