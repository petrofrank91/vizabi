// This module is supposed to be deprecated by the DataMan
define([
        'd3',
        'entities',
        'jstat',
    ],
    function(d3, entities) {
        'use strict';

        var path = 'http://vizabi-dev.gapminder.org.s3.amazonaws.com/data/income_mountain/';
        var extension = '.csv';

        var cache;

        // Initialize the module with a 'cache' object.
        function init(c) {
            cache = c;
        }

        function loadCSV(geo, callback) {
            d3.csv(path + geo + extension, function(csvData) {
                if (typeof callback === 'function') {
                    callback(csvData);
                }
            });
        }

        function load(geoArray, callback) {
            var newData = {};

            for (var i = 0; i < geoArray.length; i++) {
                var geo = geoArray[i];
                if (!cache[geo]) {
                    (function(geo) {
                        loadCSV(geo, function(csvData) {
                            // Store the loaded data
                            if (entities.get_region(geo) === geo) {
                                cache[geo] = nest(csvData);
                            } else {
                                cache[geo] = gdpGiniPopToObject(csvData);
                            }
                            
                            newData[geo] = cache[geo];
                            
                            // Run any supplied callback function
                            if (typeof callback === 'function') {
                                callback(csvData);
                            }
                        });
                    })(geo);
                } else {
                    newData[geo] = cache[geo];
                }
            }

            return newData;
        }

        // Groups 'data' by year and creates the properties 'x', 'y' and 'y0' for
        // each drawable point. These properties are used for calculation of the
        // curve. Returns a data stick with the nested data.
        function nest(data) {
            var geoMaxHeight = 0;

            var dataSet = d3.nest()
                .key(function(d) {
                    return d.year;
                })
                .rollup(function(d) {
                    var yearData = [];
                    var yearMaxHeight = 0;
                    
                    d.forEach(function(p) {
                        yearMaxHeight = Math.max(yearMaxHeight, p.height);

                        yearData.push({
                            height: +p.height,
                            x: +p.x,
                            y: +p.height,
                            y0: 0
                        });
                    });
                    
                    yearData.maxHeight = yearMaxHeight;
                    geoMaxHeight = Math.max(geoMaxHeight, yearMaxHeight);

                    return yearData;
                })
                .map(data);

            dataSet.geoMaxHeight = geoMaxHeight;

            return dataSet;
        }

        function gdpGiniPopToObject(points) {
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
