define([
    'jquery',
    'lodash',
    'base/class',
    'd3',
    'queue'
], function($, _, Class, d3, queue) {

    var MultiCSVReader = Class.extend({

        init: function(reader_info) {
            this._name = 'multi-jcsv';
            this._data = [];
            this._basepath = reader_info.path + '/';
        },

        read: function(queries, language) {
            var _this = this,
                defer = $.Deferred(),
                q = queue(1);

            this._data = [];

            //Loops through each query
            for (var i = 0; i < queries.length; i++) {

                this._data[i] = {};
                var path = this._basepath;

                (function(order) {
                    var query = queries[i];
                    //IN a loop

                    var q_load = queue(),
                        q_indicator = queue()
                            .defer(d3.csv, path + 'indicators' + '.csv');

                    q_indicator.await(function(error, indicators) {
                        _.each(query.where['geo.category'], function(category) {
                            var data = {};
                            console.log(query.select);
                            _.each(query.select, function(select) {
                                _.each(indicators, function(indicator) {
                                    if (indicator.id === select) {
                                        var q_indicator_for_category = queue()
                                        .defer(d3.csv, path + '/' + select + '__' + category  + '.csv');
                                        q_indicator_for_category.await(function(error, data) {
                                            //TODO: Investigate why the reader is called twice ...
                                        });
                                    }
                                });
                            });

                        });

                    });

                })(i);
            }

            q.awaitAll(function(error, results) {
                defer.resolve();
            });

            return defer;
        },

        /**
         * Gets the data
         * @returns all data
         */
        getData: function() {
            return this._data;
        }
    });

    return MultiCSVReader;
});