gapminder.viz.bubble_map.bubbles = function bubble(properties) {
    "use strict";

    var svg = {};
    var group;

    var bubble_settings = {
        border: true,
        gradient: true
    };

    function init(properties) {
        group = properties.svg.append("g");
        svg = group.append("svg").attr("id", "bubbles");
        bubble_settings.border = properties.border;
        bubble_settings.gradient = properties.gradient;
    }

    function draw(data, grad_colors) {
        if (bubble_settings.gradient && grad_colors) gradient(grad_colors);
        bubbles(data);
    }

    function bubbles(data) {
        svg.selectAll(".bubbles").remove();
        svg.selectAll(".bubbles-border").remove();

        var shape = svg.selectAll(".bubbles")
            .data(data)
            .enter();

        var circle = shape.append("circle")
            .attr("class", "bubbles")
            .attr("id", function (d) {
                return d.id;
            })
            .attr("fill", function (d) {
                return d.color;
            })
            .attr("r", function (d) {
                return d.size;
            })
            .attr("cx", function (d) {
                return d.coordinates[0];
            })
            .attr("cy", function (d) {
                return d.coordinates[1];
            })
            .attr("shape-rendering", "geometricPrecision");

        shape.append("text")
            .attr("class", "bubbles")
            .attr("x", function (d) {
                return d.coordinates[0];
            })
            .attr("y", function (d) {
                return d.coordinates[1] + d.size + 32;
            })
            .text(function (d) {
                return d.text;
            });

        if (bubble_settings.border) {
            circle.attr("class", "bubbles-border");
        }
    }

    // full gradient? Experiment
    function gradient(colors) {
        for (var color in colors) {
            if (colors.hasOwnProperty(color)) {
                var gradient = svg.append("defs").append("linearGradient");

                gradient.attr("x1", "0%").attr("y1", "0%")
                    .attr("x2", "100%").attr("y2", "100%")
                    .attr("spreadMethod", "pad");

                // colors
                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", colors[color].from_color)
                    .attr("stop-opacity", 1);

                gradient.append("stop")
                    .attr("offset", "30%")
                    .attr("stop-color", colors[color].to_color)
                    .attr("stop-opacity", 1);

                gradient.attr("id", colors[color].id);
            }
        }
    }

    function change_settings(new_settings) {
        settings = new_settings;
    }

    init(properties);

    return {
        svg: svg,
        g: group,
        settings: change_settings,
        draw: draw
    };
};
