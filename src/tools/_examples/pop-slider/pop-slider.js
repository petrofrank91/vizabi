define([
    'base/tool'
], function(Tool) {

    var lineChart = Tool.extend({
        init: function(parent, options) {

            this.name = 'pop-slider';
            this.template = "tools/_examples/pop-slider/pop-slider";
            this.placeholder = options.placeholder;

            this.state = options.state;

            this.addComponent('_gapminder/header', {
                placeholder: '.vizabi-tool-title'
            });

            this.addComponent('_examples/year-display', {
                placeholder: '.vizabi-tool-year'
            });

            this.addComponent('_examples/indicator-display', {
                placeholder: '.vizabi-tool-display'
            });

            this.addComponent('_gapminder/time-time-slider', {
                placeholder: '.vizabi-tool-timeslider',
                step: 0.1
            });

            this.addComponent('_gapminder/buttonlist', {
                placeholder: '.vizabi-tool-buttonlist',
                buttons: [{
                            id: "geo",
                            title: "Country",
                            icon: "globe",

                        }],
                data: options.data
            });

            this._super(parent, options);
        },

        getQuery: function() {
            var query = [{
                select: [
                    'geo',
                    'time',
                    'geo.name',
                    this.model.getState("indicator")
                ],
                where: {
                    geo: this.model.getState("show").geo,
                    'geo.category': this.model.getState("show")['geo.category'],
                    time: this.model.getState("timeRange")
                }
            }];

            return query;
        }
    });


    return lineChart;
});