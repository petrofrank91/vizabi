define([
        'd3'
    ],
    function(d3) {
        'use strict';

        function order(d) {
            return d.sort(function(a, b) {
                return b.data.maxHeight - a.data.maxHeight;
            });
        }

        function stack(o) {
            return d3.layout.stack()
                .offset('zero')
                .values(function(d) { return d.data; })
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                (o);
        }

        function transition(d, geo, year, cache, stack) {
            var factor = year % 1;
            var future = Math.ceil(year);

            if (cache[geo][future]) {
                for (var i = 0; i < d.length; i++) {
                    var diff = cache[geo][future][i].height - d[i].height;
                    d[i].y = d[i].height + (diff * factor);
                }
            }
        }

        // non-stacked
        function getNonStackedMaxHeight(o) {
            var maxHeight = 0;

            var keys = Object.keys(o);

            for (var i = 0; i < keys.length; i++) {
                maxHeight = Math.max(maxHeight, o[keys[i]].geoMaxHeight);
            }

            return maxHeight;
        }

        function getStackedMaxHeight(o) {
            var allHeights = {};
            var highest = 0;

            for (var geo in o) {
                if (o.hasOwnProperty(geo)) {
                    for (var year in o[geo]) {
                        if (!isNaN(year)) {
                            if (o[geo].hasOwnProperty(year)) {
                                for (var x in o[geo][year]) {
                                    if (!isNaN(x)) {
                                        if (o[geo][year].hasOwnProperty(x)) {
                                            if (!allHeights[year]) {
                                                allHeights[year] = {};
                                            }

                                            if (!allHeights[year][x]) {
                                                allHeights[year][x] = 0;
                                            }

                                            allHeights[year][x] +=
                                                +o[geo][year][x].height;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (var year in allHeights) {
                if (allHeights.hasOwnProperty(year)) {
                    for (var x in allHeights[year]) {
                        if (allHeights[year].hasOwnProperty(x)) {
                            highest = Math.max(highest, allHeights[year][x]);
                        }
                    }
                }
            }

            return highest;
        }

        function getMaxHeight(d, stack) {
            return stack ? getStackedMaxHeight(d) : getNonStackedMaxHeight(d);
        }

        function fixNonStackedHeight(d, mountainHeight, maxHeight) {
            for (var i = 0; i < d.length; i++) {
                d[i].y = mountainHeight * d[i].y / maxHeight;
            }

            return d;
        }

        function fixStackedHeight(d, mountainHeight, maxHeight) {
            for (var i = 0; i < d.length; i++) {
                d[i].y = mountainHeight * d[i].y / maxHeight;
                d[i].y0 = mountainHeight * d[i].y0 / maxHeight;
            }

            return d;
        }

        function fixHeight(d, mountainHeight, maxHeight, stack) {
            return stack ?
                fixStackedHeight(d, mountainHeight, maxHeight) :
                fixNonStackedHeight(d, mountainHeight, maxHeight);
        }

        return {
            order: order,
            stack: stack,
            transition: transition,
            maxHeight: getMaxHeight,
            fixHeight: fixHeight
        };
    }
);
