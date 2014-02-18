define([
        'd3',
        'bubble-map/data/loader',
        'bubble-map/data/operations'
    ],
    function(d3, loader, operations) {
        var state;

        var data = function() {
            this.cache = loader.cache;
        };

        data.prototype = {
            init: function(s) {
                state = s;
                operations.init(this.cache, s);
                loader.init(s);
            },

            load: function(indicator, callback) {
                loader.load(indicator, callback);
            },

            map: function(callback) {
                loader.map(callback);
            },

            getValue: function(indicator, geo) {
                return operations.getValue(indicator, geo);
            },

            getBubbleSize: function(value, bubSize) {
                return operations.getBubbleSize(value, bubSize);
            }
        }

        return data;
    }
);
