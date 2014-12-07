define([
    'lodash',
    'base/model'
], function(_, Model) {

    var Entities = Model.extend({
        init: function(values, intervals, bind) {

            values = _.extend({
                dim: 'geo',
                filter: {
                    'geo.cat': ['country'],
                    'geo.region': ['*']
                },
                selected: ['swe'],
		        //hover: ['arg'],
                entity_picker: {
                    visible: true
                }
            }, values);
        }
    });

    return Entities;
});