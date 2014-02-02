gapminder.viz.bubble_map = {};
gapminder.viz.bubble_map.bmap = function bmap(properties) {
    "use strict";

    var group;
    var outer_svg;
    var inner_svg;

    var projection = d3.geo.winkel3();
    var path = d3.geo.path().projection(projection);

    var init = function init(properties) {
        group = properties.svg.append("g");
        outer_svg = group.append("svg")
            .attr("preserveAspectRatio", "none")
            .attr("viewBox", "0 0 900 500");
        inner_svg = outer_svg.append("g").attr("id", "map"); // Map has own <g>
    };

    // Change here for map height/width alignment
    var set_projection = function set_projection(w, h) {
        if (!w) w = 390;
        if (!h) h = 254;
        projection.translate([w, h]);
        projection.scale(190);
    };

    var get_projected_lat = function get_lat(position) {
        return projection([position.longitude, position.latitude]);
    };

    var draw = function draw(data) {
        var shape = inner_svg.selectAll("path").data(data.features);

        shape.enter()
            .append("path")
            .attr("d", function (d) {
                return path(d);
            })
            .attr("fill", function (d) {
                return gapminder.entities.get_color(d.id, "mist_light");
            });
    };

    init(properties);
    set_projection();

    return {
        g: group,
        svg: outer_svg,
        draw: draw,
        map_position: set_projection,
        get_position: get_projected_lat
    };
};
