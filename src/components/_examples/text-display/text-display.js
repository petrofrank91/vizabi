//Indicator Display
define([
    'd3',
    'lodash',
    'base/utils',
    'base/component'
], function(d3, _, utils, Component) {

    var EntityDisplay = Component.extend({

        init: function(options, context) {
            this.name = "text-display";
            this.template = "components/_examples/text-display/text-display";

            this._super(options, context);
        },


        update: function() {
            var _this = this,
                entities = this.model.entities.selected,
                data = this.model.data.getItems(),
                hover = this.model.entities.hover;

            var label = _this.element.select('.vzb-selected-entities'),
                input = label.select('input'),
                span = label.selectAll('span');
            
            label.selectAll("div").remove();

            label.selectAll("div")
                .data(entities)
                .enter()
                .append("div")
                .attr('class','vzb-text-item')
                .text(function(d) {
                    // find the name of selected entities in data
                    return _.find(data, {
                        'geo': d
                    })['geo.name'];
                })
                .style('color', function(d) {
                    return hover.indexOf(d) >= 0 ? '#F77481' : 'white';
                })
                .sort();
        }


    });

    return EntityDisplay;

});