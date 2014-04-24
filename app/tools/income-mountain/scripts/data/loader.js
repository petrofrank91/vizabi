// This module is supposed to be deprecated by the DataMan
define([
        'd3',
        'entities',
        'data-manager',
        'jstat',
    ],
    function(d3, entities, dataManager) {
        'use strict';

        var cache;
        var specialCases = ['AFR', 'AME', 'ASI', 'EUR', 'WORLD'];

        // Initialize the module with a 'cache' object.
        function init(c) {
            cache = c;
        }

        function load(geoArray, startYear, endYear, callback) {
            var newData = {};
            
            for (var i = 0; i < geoArray.length; i++) {
                var geo = geoArray[i];

                if (!cache[geo]) {
                    var reqObj = {
                        item: geo,
                        start: startYear,
                        end: endYear
                    };

                    if (specialCases.indexOf(geo) !== -1) {
                        (function(o) {
                            dataManager.getIMShapes(o, function(json) {
                                cache[o.item] =
                                    yearHeights(json[o.item.toLowerCase()]);
                                newData[o.item] = cache[o.item];

                                if (typeof callback === 'function') {
                                    callback(json);
                                }
                            });
                        })(reqObj);
                    } else {
                        (function(o) {
                            dataManager.getIMRaw(o, function(json) {
                                cache[o.item] =
                                    makeShapes(json[o.item.toLowerCase()]);
                                newData[o.item] = cache[o.item];
                                
                                if (typeof callback === 'function') {
                                    callback(json);
                                }
                            });
                        })(reqObj);
                    }
                } else {
                    newData[geo] = cache[geo];
                }
            }

            return cache;
        }

        function yearHeights(data) {
            for (var prop in data) {
                if (data.hasOwnProperty(prop) && prop !== 'geoMaxHeight') {
                    data[prop].maxHeight = 0;
                    for (var i = 0; i < data[prop].length; i++) {
                        data[prop].maxHeight = Math.max(data[prop][i].height,
                            data[prop].maxHeight);
                    }
                }
            }

            return data;
        }

        function makeShapes(points) {
            var geoMaxHeight = 0;

            var countryDataSet = d3.nest()
                .key(function(d) { return d.year; })
                .rollup(function(d) {
                    var yearData = calculateNormalDensity(d[0].mean,
                        d[0].variance, d[0].population);
                    geoMaxHeight = Math.max(geoMaxHeight, yearData.maxHeight);
                    
                    return yearData;
                })
                .map(points);

            countryDataSet.geoMaxHeight = geoMaxHeight;
            return countryDataSet;
        }

        function calculateNormalDensity(mean, variance, population)
        {
            var yearData = [];
            var yearMaxHeight = 0;

            var norm = new NormalDistribution(mean, Math.sqrt(variance));

            // Values are used to generate points that are applied to the
            // mapping below. We chose values that cover our gdp interval.
            var step = 0.6;     // Controls how many points we are going to
                                //generate. This affects the shape of the graph
                                // (less points, 'chubby' graph)
            var start = 1;
            var stop = 14.0;    // This covers our gdp

            var logIncomeRange = d3.range(start, stop, step);

            logIncomeRange.map(function(d) {
                yearData.push({
                    height: norm.density(d) * population,
                    x: d,
                    y: norm.density(d) * population,
                    y0: 0
                });

                yearMaxHeight = Math.max(yearMaxHeight,
                    norm.density(d) * population);
            });

            yearData.maxHeight = yearMaxHeight;

            return yearData;
        }

        return {
            init: init,
            load: load
        };
    }
);
