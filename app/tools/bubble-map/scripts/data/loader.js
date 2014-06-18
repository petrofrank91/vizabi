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
            d3.json(CONFIG.VIZABI_DATA_URL + 'bubble-map/' + indicator + '.json',
                function(d) {
                    cache[indicator] = d;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            );
        }

        function loadMap(callback) {
            d3.json(CONFIG.VIZABI_DATA_URL + 'bubble-map/world-countries.json',
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
