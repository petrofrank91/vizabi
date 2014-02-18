define([
        'd3'
    ],
    function(d3) {
        'use strict';

        var cache = {};
        var state;

        function init(s) {
            state = s;
        }

        function load(indicator, callback) {
            d3.json('http://vizabi-dev.gapminder.org.s3.amazonaws.com/data/bubble_map/' + indicator + '.json',
                function(d) {
                    cache[indicator] = d;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            );
        }

        function loadMap(callback) {
            d3.json('http://vizabi-dev.gapminder.org.s3.amazonaws.com/data/bubble_map/world-countries.json',
                function(d) {
                    cache.map = d;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            );
        }

        return {
            cache: cache,
            init: init,
            load: load,
            map: loadMap
        };
    }
);
