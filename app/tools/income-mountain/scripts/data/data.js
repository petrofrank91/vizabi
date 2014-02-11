define([
        'income-mountain/data/loader.js',
        'income-mountain/data/operations.js'
    ],
    function(loader, operations) {
        'use strict';

        var cached = {};    // 'global' tool cache
        var drawable = {};  // Data that will be used for drawing
        var state;
        var properties;

        function init(s, p, callback) {
            state = s;
            properties = p;
            loader.init(cached);
            cached = load(callback);
        }

        function load(callback) {
            return loader.load(state.geo, callback);
        }

        function getCached() {
            return cached;
        }

        function getDrawable() {
            flush();

            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];
                drawable[geo] = cached[geo];
            }

            return process(drawable);
        }

        function flush() {
            drawable = {};
        }

        function process(d) {
            properties.maxHeight = operations.maxHeight(d, state.stack);

            return d;
        }

        function prepare(d) {
            for (var i = 0; i < d.length; i++) {
                operations.transition(d[i].data, d[i].id,
                    state.year, cached);
            }

            if (state.stack) {
                d = operations.stack(d);
            }

            for (var i = 0; i < d.length; i++) {
                operations.fixHeight(d[i].data, properties.mheight,
                    properties.maxHeight, state.stack);
            }

            return operations.order(d);
        }

        return {
            init: init,
            load: load,
            get: getDrawable,
            getCached: getCached,
            prepare: prepare
        };
    }
);
