define([
    'jquery',
    'lodash',
    'base/class',
    'base/reader',
    'd3',
    'queue'
], function($, _, Class, Reader, d3, queue) {


    //TOOD: make it compatible with non-hook queries
    var MultiCSVReader = Reader.extend({

        init: function(reader_info) {
            this._super('multi-jcsv', [],
                reader_info.path + '/');

            // load meta, category, indicators

        },

        read: function(queries, language) {
            var _this = this,
                defer = $.Deferred();
            this._data = [];

            for (var i = 0; i < queries.length; i++) {

                this._data[i] = {};
                var path = this._basepath,
                    promises = [];
                console.log(queries);

                (function(order, query) {
                    var promise = $.Deferred(),
                        row = 0,
                        q = queue(),
                        q_data = queue(),
                        select = query.select,
                        //TODO: Remove the hack to decide loading categories or indicators
                        //Added to bypass this: https://github.com/Gapminder/vizabi/issues/63 
                        query_type = select[1];

                    // for each select statement, check if theres indicator available
                    q.defer(function(meta_callback) {
                        d3.csv(path + 'indicators' + '.csv', function(error, indicators) {
                            d3.csv(path + 'categories' + '.csv', function(error, categories) {
                                if (query_type === 'geo.name') {
                                    _(query.where['geo.category']).forEach(function(cat) {
                                        q_data.defer(function(callback) {
                                            d3.csv(path + cat + '.csv',
                                                function(error, data) {
                                                    _(query.where.geo).forEach(function(id) {
                                                        _(data).forEach(function(datum) {
                                                            if (datum.geo === id) {
                                                                for (var i = query.where.time[0][0]; i <= query.where.time[0][1]; i++) {
                                                                    _this._data[order][row] = {};
                                                                    _this._data[order][row]['geo'] = datum.geo;
                                                                    _this._data[order][row][query_type] = datum[query_type];
                                                                    _this._data[order][row]['time'] = i;
                                                                    row++;
                                                                }
                                                            }
                                                        });
                                                    });

                                                    callback();
                                                });
                                        });
                                    });

                                    q_data.await(function(error, result) {
                                        meta_callback();
                                    });
                                } else if (_this.isQueryIndicator(indicators, query_type)) {
                                    _(query.where['geo.category']).forEach(function(cat) {
                                            q_data.defer(function(callback) {
                                                d3.csv(path + '/' + query_type + '__' + cat + '.csv',
                                                    function(error, data) {
                                                        _(query.where.geo).forEach(function(id) {
                                                            console.log('id', id);
                                                            _(data).forEach(function(datum) {
                                                                console.log('datum',datum);
                                                                if (datum.geo === id && datum.time >= query.where.time[0][0] && datum.time <= query.where.time[0][1]) {
                                                                    _this._data[order][row] = {};
                                                                    _this._data[order][row]['geo'] = datum.geo;
                                                                    _this._data[order][row][query_type] = datum[query_type];
                                                                    _this._data[order][row]['time'] = datum.time;
                                                                    row++;

                                                                }
                                                            });
                                                        });

                                                        callback();
                                                    });
                                        });
                                    });

                                    q_data.await(function(error, result) {
                                        meta_callback();
                                    });
                                }
                            });
                        });
                    });

                    // all files loaded, continue.  
                    q.await(function(error, result) {
                        promise.resolve();
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

        isQueryIndicator: function(indicators, query) {
            return _.findIndex(indicators, {id: query}) > 0;
        }
    });

    return MultiCSVReader;
});