gapminder.data_manager.income_mountain.operations = function (state, incomeMountainState) {
    "use strict";

    // Should this be at loader?
    function get_year() {
        var data = [];
        var year = Math.floor(state.year);

        for (var i = 0; i < state.geo.length; i++) {
            var geo = state.geo[i];

            if (incomeMountainState.cachedData[geo] && incomeMountainState.cachedData[geo][year]) {
                // Linearly adjusts points according to year
                transition(geo, incomeMountainState.cachedData[geo][year]);

                data.push({
                    name: gapminder.entities.get_name(geo),
                    data: incomeMountainState.cachedData[geo][year],
                    color: gapminder.entities.get_color(geo),
                    geo_max_height: incomeMountainState.cachedData[geo].geo_max_height
                });
            }
        }

        if (state.stack && data.length) {
            stack_mountains()(data);
        }

        incomeMountainState.drawData = data;
    }

    function fix_mountain_height(data, pixelsHeight) {
        for (var i = 0; i < data.length; i++) {
            data[i].y = pixelsHeight * data[i].height / incomeMountainState.maxHeight;
            if (state.stack) {
                data[i].y0 = pixelsHeight * (data[i].y0 / incomeMountainState.maxHeight);
            }
        }
    }

    // Calculates the maximum height for the income_mountain. TODO: Improve
    // calculation when mountain is stacked.
    function calculate_max_height() {
        var max_height = 0;

        if (state.stack) {
            // Should do point-by-point, but this should do for now!
            var loaded_geos = [];

            for (var geo in incomeMountainState.cachedData) {
                if (incomeMountainState.cachedData.hasOwnProperty(geo)) {
                    loaded_geos.push(geo);
                }
            }

            for (var year = incomeMountainState.startYear; year <= incomeMountainState.finalYear; year++) {
                var points_max = {};
                for (var i = 0; i < loaded_geos.length; i++) {
                    var geo = loaded_geos[i];
                    if (incomeMountainState.cachedData[geo][year]) {
                        var points = incomeMountainState.cachedData[geo][year];

                        points.forEach(function (p, j) {
                            if (!points_max[j]) points_max[j] = 0;
                            points_max[j] += p.height;
                        });
                    }
                }

                for (var k in points_max) {
                    if (points_max.hasOwnProperty(k)) {
                        max_height = Math.max(max_height, points_max[k]);
                    }
                }
            }
        } else {
            for (var geo in incomeMountainState.cachedData) {
                if (incomeMountainState.cachedData.hasOwnProperty(geo)) {
                    max_height = Math.max(max_height,
                        incomeMountainState.cachedData[geo].geo_max_height);
                }
            }
        }

        incomeMountainState.maxHeight = max_height;
    }

    // Adjust the data, giving it a 'transition' effect when showing data
    // between years. Data is increased linearly from year Y to year Y+1.
    function transition(geo, current_data) {
        var future_year = Math.ceil(state.year);
        var factor = state.year % 1;

        if (incomeMountainState.cachedData[geo][future_year]) {
            var future_data = incomeMountainState.cachedData[geo][future_year];

            for (var i = 0; i < current_data.length; i++) {
                var difference = future_data[i].height - current_data[i].height;
                current_data[i].y = current_data[i].height + (difference * factor);
            }
        }
    }

    // Orders the mountain for drawing (smaller mountain on front)
    function order_mountains() {
        if (state.stack) return;

        var length = incomeMountainState.drawData.length;

        for (var i = 0; i < length; i++) {
            incomeMountainState.drawData.sort(function (a, b) {
                return b.data.year_max_height - a.data.year_max_height;
            });
        }
    }

    // To be called when the income mountain is supposed to stacked
    function stack_mountains() {
        return d3.layout.stack()
            .offset("zero")
            .values(function (d) {
                return d.data;
            })
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });
    }

    return {
        get_year: get_year,
        calculate_max_height: calculate_max_height,
        fix_mountain_height: fix_mountain_height,
        order: order_mountains,
        stack: stack_mountains
    };
};
