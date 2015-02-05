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

        /**
         * Initializes the reader.
         * @param {Object} reader_info Information about the reader
         */
        init: function(reader_info) {
            this._super('multi-jcsv', [],
                reader_info.path + '/');
        },

        read: function(queries, language) {
            var _this = this,
                defer = $.Deferred();
            this._data = [];

            for (var i = 0; i < queries.length; i++) {

                this._data[i] = [];
                var path = this._basepath,
                    promises = [];

                (function(query_num, query) {
                    var promise = $.Deferred(),
                        row = 0,
                        q = queue(),
                        select = query.select,
                        //TODO: Remove the hack to decide loading categories or indicators
                        //Added to bypass this: https://github.com/Gapminder/vizabi/issues/63 
                        query_type = select[1];

                    q.defer(function(meta_callback) {
                        d3.csv(path + 'indicators' + '.csv', function(error, indicators) {
                            d3.csv(path + 'categories' + '.csv', function(error, categories) {
                                
                                if (query_type === 'geo.name') {
                                    _this.selectCategories(query, path, query_num, meta_callback);
                                } else if (_this.isQueryIndicator(indicators, query_type)) {
                                    _this.selectIndicators(query, path, query_type, query_num, meta_callback);
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

            // all queries loaded, proceed 
            $.when.apply(null, promises).done(function() {
                defer.resolve();
            });

            return defer;
        },

        getData: function() {
            return this._data;
        },

        /**
         * checks if the query is an indicator
         * @param  {object} indicators - array of indicator object
         * @param  {String} select - select statement
         * @return {Boolean} if it is an indicator
         */
        isQueryIndicator: function(indicators, select) {
            return _.findIndex(indicators, {
                id: select
            }) >= 0;
        },

        /**
         * reads categories from multiple CSV files and once all of them are read, executes a callback
         * @param  {Object} query - the query object
         * @param  {String} path - path to data files
         * @param  {Number} query_num - query number (used as key to store data for each query) 
         * @param  {Object} outer_callback - callback to execute after all files are loaded
         * @return {null}
         */
        selectCategories: function(query, path, query_num, outer_callback) {
            var _this = this,
                q_data = queue(),
                row = 0;

            _(query.where['geo.category']).forEach(function(cat) {
                q_data.defer(function(callback) {
                    d3.csv(path + cat + '.csv',
                        function(error, data) {
                            _(query.where.geo).forEach(function(id) {
                                _(data).forEach(function(datum) {
                                    row = _this.addCategory(datum,id, query.where.time[0][0], query.where.time[0][1], query_num, row);
                                });
                            });

                            callback();
                        });
                });
            });

            q_data.await(function(error, result) {
                outer_callback();
            });
        },
        
        /**
         * Adds the category if it is in select clause of the query
         * @param {Object} datum - data row object
         * @param {String} id - select clause id 
         * @param {Number} minYear - minimum year requested in query
         * @param {Number} maxYear - maximum year requested in query
         * @param {Number} query_num - query number (used as key to store data for each query)
         * @param {Number} row - row number (as key in the data object)
         */
        addCategory: function(datum, id, minYear, maxYear, query_num, row) {
            if (datum.geo === id) {
                for (var i = minYear; i <= maxYear; i++) {
                    this._data[query_num][row] = {};
                    this._data[query_num][row]['geo'] = datum.geo;
                    this._data[query_num][row]['geo.name'] = datum['geo.name'];
                    this._data[query_num][row]['time'] = i;
                    row++;
                }
            }

            return row;
        },

        /**
         * reads indicators from multiple CSV files and once all of them are read, executes a callback
         * @param  {Object} query - the query object
         * @param  {String} path - path to data files
         * @param  {Number} query_num - query number (used as key to store data for each query) 
         * @param  {Object} outer_callback - callback to execute after all files are loaded
         * @return {null}
         */
        selectIndicators: function(query, path, indicator, query_num, outer_callback) {
            var _this = this,
                q_data = queue(),
                row = 0;

            _(query.where['geo.category']).forEach(function(cat) {
                q_data.defer(function(callback) {
                    d3.csv(path + indicator + '__' + cat + '.csv',
                        function(error, data) {
                            _(query.where.geo).forEach(function(id) {
                                _(data).forEach(function(datum) {
                                    row = _this.addIndicator(datum, id, query.where.time[0][0], query.where.time[0][1], query_num, indicator, row);
                                });
                            });

                            callback();
                        });
                });
            });

            q_data.await(function(error, result) {
                outer_callback();
            });
        },


        /**
         * Adds the indicator if it is in select clause of the query
         * @param {Object} datum - data row object
         * @param {String} id - select clause id 
         * @param {Number} minYear - minimum year requested in query
         * @param {Number} maxYear - maximum year requested in query
         * @param {Number} query_num - query number (used as key to store data for each query)
         * * @param {Number} indicator - indicator name 
         * @param {Number} row - row number (as key in the data object)
         */
        addIndicator: function(datum, id, minYear, maxYear, query_num, indicator, row) {
            if (datum.geo === id && datum.time >= minYear && datum.time <= maxYear) {
                this._data[query_num][row] = {};
                this._data[query_num][row]['geo'] = datum.geo;
                this._data[query_num][row][indicator] = datum[indicator];
                this._data[query_num][row]['time'] = datum.time;
                row++;
            }

            return row;
        }


    });

    return MultiCSVReader;
});