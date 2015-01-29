define([
    "lodash",
    "base/events",
    "base/class"
], function(_, Events, Class) {

    var Reader = Class.extend({
        
        /**
         * intials reader name, data object and its corresponding data path
         * @param  {String} reader_name - name of the reader
         * @param  {Object} data - data object
         * @param  {String} base_path - path to data
         * @return {[type]}
         */
        init: function(reader_name, data, base_path) {
            this._name = reader_name;
            this._data = data;
            this._basepath = base_path;
        },


        /**
         * Reads the csv files based on number of queries and a language 
         * @param  {array} queries - a set of queries  
         * @param  {String} language - language that result needs to be returned 
         * @return {Object} deferred - a jQuery deferred object
         */
        read: function(queries, language) {},

        /**
         * gets data object to data manager
         * @return {Object} the data object
         */
        getData: function() {},

        /**
         * perform basic filtering based on query on data object
         * @param  {Object} query - array of queries 
         * @param  {Object} data - data object
         * @return {Object} data - filtered data
         */
        filter: function(query, data) {
            for (var filter in query.where) {
                var wanted = query.where[filter];

                if (wanted[0] === "*") {
                    continue;
                }

                //if not time, normal filtering
                if (filter !== "time") {
                    data = _.filter(data, function(row) {
                        var val = row[filter],
                            found = -1;
                        //normalize
                        if (!_.isArray(val)) {
                            val = [val];
                        }
                        //find first occurence
                        return _.intersection(wanted, val).length > 0;
                    });
                }
                //in case it's time, special filtering
                else {
                    var timeRange = wanted[0],
                        min = timeRange[0],
                        max = timeRange[1] || min;

                    data = _.filter(data, function(row) {
                        var val = row[filter]
                        return val >= min && val <= max;
                    });
                }
            }

            //only selected items get returned
            data = _.map(data, function(row) {
                return _.pick(row, query.select);
            });

            return data;
        }

    });

    return Reader;
});