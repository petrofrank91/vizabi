var graphics = {
    move_button: "m22.881718,10.764284c-0.475458,-5.471561 -5.19836,-9.764284 -10.792168,-9.764284c-5.605913,0 -10.58994,4.309327 -11.048798,9.799001c-0.040752,0.315464 0.006039,0.636966 0.006039,0.964504l0,8.97638c0,4.928179 5.512316,10.285027 10.857103,14.280397c4.802883,-3.368973 11.000465,-9.352219 11.000465,-14.280397l0,-8.97638c0,-0.338104 0.02264,-0.670172 -0.022642,-0.999221z",
    play_triangle: "m16.104044,9.928802c-0.298447,-0.136328 -0.72585,-0.38319 -1.063597,-0.394244c-0.729534,0.046671 -1.408713,0.637422 -1.408713,1.375551l0,16.248697c0,0.731989 0.670582,1.316599 1.390289,1.36941c0.346345,-0.006142 0.693916,-0.20756 1.007102,-0.40284l13.194235,-8.11084c0.622681,-0.404068 0.655842,-1.509418 0.01351,-1.968756l-13.132826,-8.116979z",
    pause_bar1: "m17.071117,27.009705c0,0.817007 -0.661329,1.479578 -1.47958,1.479578l-1.728666,0c-0.818252,0 -1.479578,-0.662571 -1.479578,-1.479578l0,-15.991412c0,-0.817004 0.661326,-1.479578 1.479578,-1.479578l1.728666,0c0.817009,0 1.47958,0.662574 1.47958,1.479578l0,15.991412z",
    pause_bar2: "m25.644701,27.009705c0,0.817007 -0.662569,1.479578 -1.479576,1.479578l-1.728666,0c-0.818253,0 -1.47958,-0.662571 -1.47958,-1.479578l0,-15.991412c0,-0.817004 0.660082,-1.479578 1.47958,-1.479578l1.728666,0c0.817007,0 1.479576,0.662574 1.479576,1.479578l0,15.991412z"
};

var time_slider = function time_slider(properties) {
    "use strict";

    var group;

    var state;
    var localConfigs; // Change var name to.. timeSliderConfigs?

    var buttons = {
        play_button: {},
        pause_button: {},
        moveable_button: {}
    };

    var timeline_x = {}; // future timeline X scale

    var init = function init(properties) {
        group = properties.svg.append("g");
        state = properties.state;
        localConfigs = properties.localConfigs;
        timeline_x = d3.time.scale().range([60, 250])
            .domain([new Date(localConfigs.start_year, 0), new Date(localConfigs.final_year, 0)])
            .clamp(true);
    };

    var timeline = function timeline() {
        var parse_time = d3.time.format("%Y").parse;

        var time_values = [
            new Date(localConfigs.start_year, 0),
            new Date(localConfigs.start_year + (localConfigs.final_year - localConfigs.start_year) / 2, 0),
            new Date(localConfigs.final_year, 0)
        ];

        var xAxis = d3.svg.axis().scale(timeline_x)
            .tickValues(time_values)
            .tickSize(15, 0, 3)
            .tickPadding(11)
            .tickSubdivide(1)
            .tickFormat(function (d) {
                return d.getFullYear();
            });

        group.append("g")
            .attr("class", "timeline")
            .attr("transform", "translate(0,46)")
            .call(xAxis);
    };

    var play_button = function play_button() {
        var button = group.append("g")
            .attr("class", "play_button");

        button.append("circle")
            .attr("r", 18.032)
            .attr("cx", 19.032)
            .attr("cy", 19.032);

        button.append("path")
            .attr("d", graphics.play_triangle);

        button.attr("transform", "translate(0, 27)")
            .attr("visibility", "visible");

        buttons.play_button = button;
    };

    var pause_button = function pause_button() {
        var button = group.append("g")
            .attr("class", "pause_button");

        button.append("circle")
            .attr("r", 18.032)
            .attr("cx", 19.032)
            .attr("cy", 19.032);

        button.append("path")
            .attr("d", graphics.pause_bar1);

        button.append("path")
            .attr("d", graphics.pause_bar2);

        button.attr("transform", "translate(0, 27)")
            .attr("visibility", "hidden");

        buttons.pause_button = button;
    };

    var moveable_button = function moveable_button() {
        var button = group.append("g")
            .attr("class", "moveable_button");

        // Miterlimit?
        button.append("path")
            .attr("stroke-miterlimit", 10)
            .attr("d", graphics.move_button);

        button.append("rect")
            .attr("x", 8.146993)
            .attr("y", 9.002818)
            .attr("width", 2.985586)
            .attr("height", 12.574781);

        button.append("rect")
            .attr("x", 12.77933)
            .attr("y", 9.002818)
            .attr("width", 2.985586)
            .attr("height", 12.574781);

        button.attr("transform", "translate(48, 33)");

        buttons.moveable_button = button;
    };

    var year_text = function year_text() {
        var text = group.selectAll(".time_slider_year")
            .data([state.year], function (d) {
                return d;
            });

        text.enter()
            .append("text")
            .attr("class", "time_slider_year")
            .attr("x", 155)
            .attr("y", 30)
            .text(function (d) {
                return Math.floor(state.year);
            });

        text.exit().remove();
    };

    var update = function update() {
        year_text();
    };

    init(properties);
    timeline();
    play_button();
    pause_button();
    moveable_button();
    year_text();

    return {
        g: group,
        buttons: buttons,
        update: update,
        timeline_x: timeline_x
    };
};
