define([
    'jquery',
    'lodash',
    'base/class',
    'base/reader'
], function($, _, Class, Reader) {

    var LocalJSONReader = Reader.extend({

        /**
         * Initializes the reader.
         * @param {Object} reader_info Information about the reader
         */
        init: function(reader_info) {
            this._super('local-json', 
                [], reader_info.path);
        },

        /**
         * Reads from source
         * @param {Array} queries Queries to be performed
         * @param {String} language language
         * @returns a promise that will be resolved when data is read
         */
        read: function(queries, language) {
            var _this = this,
                defer = $.Deferred(),
                promises = [];

            //this specific reader has support for the tag {{LANGUAGE}}
            var path = this._basepath.replace("{{LANGUAGE}}", language);
            _this._data = [];

            //Loops through each query
            for (var i = 0; i < queries.length; i++) {

                this._data[i] = {};

                (function(order) {
                    var query = queries[i];
                    var promise = $.getJSON(path, function(res) {
                            //TODO: Improve local json filtering
                            _this._data[order] = _this.filter(query,res[0]);
                        })
                        .error(function() {
                            console.log("Error Happened While Loading File: " + fakeResponsePath);
                        });
                    promises.push(promise);
                })(i);
            }

            $.when.apply(null, promises).done(function() {
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

    return LocalJSONReader;
});