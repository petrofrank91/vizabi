gapminder.data_manager = {};
gapminder.data_manager.income_mountain = {};

// REMOVE XPOS AS SOON AS POSSIBLE FROM HERE
gapminder.data_manager.income_mountain.loader = function dm_income_mountain(properties, xpos) {
    "use strict";

    var income_mountain_data = {};

    var path = "http://vizabi-dev.gapminder.org.s3.amazonaws.com/data/income_mountain/";
    var extension = ".csv";

    // Loads csv with data for the Income Mountain
    var load_csv = function load_csv(geo, callback) {
        d3.csv(path + geo + extension, function(csv_data) {
            if (typeof callback === "function") {
                callback(csv_data);
            }
        });
    };

    // Loads a list of 'geo' locations. The geos that have not been cached
    // are loaded asynchronously and accessible to the returning object
    // once they are completely loaded.
    var load = function load(geo_list, callback) {
        var data_box = {};

        for (var i = 0; i < geo_list.length; i++) {
            if (!income_mountain_data[geo_list[i]]) {
                (function(geo) {
                    load_csv(geo, function(csv_data) {
                        // Store the loaded data
                        if (gapminder.entities.get_region(geo) === geo) {
                            income_mountain_data[geo] = nest(csv_data);
                        } else {
                            income_mountain_data[geo] = gdpGiniPopToObject(csv_data);
                        }
                        
                        data_box[geo] = income_mountain_data[geo];
                        
                        // Run any supplied callback function
                        if (typeof callback === "function") {
                            callback(csv_data);
                        }
                    });
                })(geo_list[i]);
            } else {
                data_box[geo_list[i]] = income_mountain_data[geo_list[i]];
            }
        }

        return data_box;
    };

    // Groups 'data' by year and creates the properties 'x', 'y' and 'y0' for
    // each drawable point. These properties are used for calculation of the
    // curve. Returns a data stick with the nested data.
    function nest(data) {
        var geo_max_height = 0;

        var data_stick = d3.nest()
            .key(function(d) {
                return d.year;
            })
            .rollup(function(d) {
                var year_data = [];
                var year_max_height = 0;
                
                d.forEach(function(p) {
                    year_max_height = Math.max(year_max_height, p.height);

                    year_data.push({
                        height: +p.height,
                        x: +p.x,
                        y: +p.height,
                        y0: 0
                    });
                });
                
                year_data.year_max_height = year_max_height;
                geo_max_height = Math.max(geo_max_height, year_max_height);

                return year_data;
            })
            .map(data);

        data_stick.geo_max_height = geo_max_height;

        return data_stick;
    }

    function gdpGiniPopToObject(points) {
        var geo_max_height = 0;

        var countryDataSet = d3.nest()
            .key(function(d) { return d.year; })
            .rollup(function(d) {
                var year_data = calculateNormalDensity(d[0].mean, d[0].variance, d[0].population);
                geo_max_height = Math.max(geo_max_height, year_data.year_max_height);
                return year_data;
            })
            .map(points);

        countryDataSet.geo_max_height = geo_max_height;
        return countryDataSet;
    }

    function calculateNormalDensity(mean, variance, population)
    {
        var year_data = [];
        var year_max_height = 0;

        var norm = new NormalDistribution(mean, Math.sqrt(variance));

        // Values are used to generate points that are applied to the densityArray below. We chose values that cover our gdp interval.
        var step = 0.6;     // Controls how many points we are going to generate. This affects the shape of the graph (less points, 'chubby' graph)
        var start = 1;
        var stop = 14.0;    // This covers our gdp

        var logIncomeRange = d3.range(start, stop, step);

        var densityArray = logIncomeRange.map(function(d)
        {
            year_data.push({
                height: norm.density(d) * population,
                x: d,
                y: norm.density(d) * population,
                y0: 0
            });

            year_max_height = Math.max(year_max_height, norm.density(d) * population);
        });

        year_data.year_max_height = year_max_height;

        return year_data;
    }

    return {
        load: load
    };
};
