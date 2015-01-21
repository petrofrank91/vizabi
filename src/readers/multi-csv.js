define([
    'jquery',
    'lodash',
    'base/class',
    'd3',
    'queue'
], function($, _, Class, d3, queue) {


    //TOOD: make it compatible with non-hook queries
    var MultiCSVReader = Class.extend({

        init: function(reader_info) {
            this._name = 'multi-jcsv';
            this._data = [];
            this._basepath = reader_info.path + '/';
        },

        read: function(queries, language) {
            var _this = this,
                defer = $.Deferred();

            this._data = [];

            for (var i = 0; i < queries.length; i++) {

                this._data[i] = {};
                var path = this._basepath,
                    promises = [];

                (function(order, query) {
                    var promise = $.Deferred(),
                        row = 0,
                        q = queue();

                    d3.csv(path + 'indicators' + '.csv', function(error, indicators) {
                        file_not_found = true;
                        _.each(query.where['geo.category'], function(category) {
                            _.each(query.select, function(select) {
                                _.each(indicators, function(indicator) {
                                    // for each select statement, check if theres indicator available
                                    if (indicator.id === select) {
                                        file_not_found = false;
                                        // stack csv loading functions into a bazillian asynchronous task
                                        q.defer(function(callback) {
                                            d3.csv(path + '/' + select + '__' + category + '.csv',
                                                function(error, data) {
                                                    data = _this.filter(query, data);
                                                    _.each(data, function(datum) {
                                                        console.log("this in closure" + _this + _this._data);
                                                        _this._data[order][row] = datum;
                                                        row++;
                                                    });

                                                    callback();
                                                });
                                        });
                                    }
                                });
                            });
                        });

                        // all files loaded, continue.  
                        q.await(function(error, result) {
                            promise.resolve();
                            // Filter
                            // change files
                            // 
                        });

                        // if corresponding files cannot be found -> empty data
                        if (file_not_found) {
                            promise.resolve();
                        }
                    });

                    promises.push(promise);

                })(i, queries[i]);
            }

            $.when.apply(null, promises).done(function() {
                defer.resolve();
            });

            return defer;
        },

        getData: function() {
            return this._data;
        },

        filter: function(query, data) {
            for (var filter in query.where) {
                var wanted = query.where[filter];

                if (wanted[0] === "*") {
                    continue;
                }

                if (filter === "time") {
                    var timeRange = wanted[0],
                        min = timeRange[0],
                        max = timeRange[1] || min;

                    data = _.filter(data, function(row) {
                        var val = row[filter]
                        return val >= min && val <= max;
                    });
                }

                //TODO: more filtering
            }

            return data;
        }
    });

    return MultiCSVReader;
});