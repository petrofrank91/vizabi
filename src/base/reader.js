define([
    "lodash",
    "base/events",
    "base/class"
], function(_, Events, Class) {

    var Reader = Class.extend({
        init: function(reader_name, data, base_path) {
            this._name = reader_name;
            this._data = data;
            this._basepath = base_path;
        },

        read: function(queries, language) {},

        getData: function() {},

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
                        var found = _.findIndex(val, function(j) {
                            return wanted.indexOf(j) !== -1;
                        });

                        //if found, include
                        return found !== -1;
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