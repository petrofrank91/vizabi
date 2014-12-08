define([
    'lodash',
    'base/model'
], function(_, Model) {

    var Entities = Model.extend({
        init: function(values, intervals, bind) {

            //NOTE: deep extend is not supported
            values = _.extend({
                show: {
                    dim: 'geo',
                    filter: {
                        'geo.cat': ['country'],
                        'geo.region': ['*'],
                    }
                },
                selected: ['swe'],
                hover: ['arg'],
                entity_picker: {
                    visible: true
                }
            }, values, true);

            this._super(values, intervals, bind);
        },

        selectEntity: function(d) {
            var select_array = this.selected;
            if (select_array.indexOf(d) >= 0) {
                elect_array = _.without(select_array, d)
            } else {
                select_array.push(d);
            }
            this.set("selected", select_array);
        },

        hoverEntity: function(d) {
            var hover_array = this.hover;
            if (hover_array.indexOf(d) >= 0) {
                hover_array = _.without(hover_array, d)
            } else {
                hover_array.push(d);
            }
            
            this.set("hover", hover_array);
        },


    });

    return Entities;
});