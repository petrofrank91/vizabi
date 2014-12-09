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
            var select_array = this.selected,
                index_element = select_array.indexOf(d['geo']) ;
            
            if (index_element >= 0) {
                select_array.splice(index_element, 1);
            } else {
                select_array.push(d['geo']);
            }
            
            this.set("selected", select_array);
        },

        hoverEntity: function(d) {
            var hover_array = this.hover,
                index_element = hover_array.indexOf(d['geo']) ;
            
            if (index_element >= 0) {
                hover_array.splice(index_element, 1);
            } else {
                hover_array.push(d['geo']);
            }

            this.set("hover", hover_array);
        },


    });

    return Entities;
});