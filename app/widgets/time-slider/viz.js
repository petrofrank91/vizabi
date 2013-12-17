gapminder.viz.time_slider = function time_slider(properties) {
    "use strict";
    
    var svg;
    
    var state;
    var localConfigs; // Change var name to.. timeSliderConfigs?

    var buttons = {
        play_button: {},
        pause_button: {},
        moveable_button: {}
    };
    
    var timeline_x = {}; // future timeline X scale

    var init = function init(properties) {
        svg = properties.svg.append("g");
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
            .tickSize(15, 0, 2)
            .tickPadding(11)
            .tickSubdivide(1)
            .tickFormat(function(d) { return d.getFullYear(); });

        svg.append("g")
            .attr("class", "timeline")
            .attr("transform", "translate(0,46)")
            .call(xAxis);
    };
    
    var play_button = function play_button() {    
        var button = svg.append("g")
            .attr("class", "play_button");
        
        button.append("circle")
            .attr("r", 18.032)
            .attr("cx", 19.032)
            .attr("cy", 19.032);
        
        button.append("path")
            .attr("d", gapminder.graphics.time_slider.play_triangle);
        
        button.attr("transform", "translate(0, 27)")
            .attr("visibility", "visible");
        
        buttons.play_button = button;
    };
    
    var pause_button = function pause_button() {
        var button = svg.append("g")
            .attr("class", "pause_button");
        
        button.append("circle")
            .attr("r", 18.032)
            .attr("cx", 19.032)
            .attr("cy", 19.032);
        
        button.append("path")
            .attr("d", gapminder.graphics.time_slider.pause_bar1);
        
        button.append("path")
            .attr("d", gapminder.graphics.time_slider.pause_bar2);
        
        button.attr("transform", "translate(0, 27)")
            .attr("visibility", "hidden");
        
        buttons.pause_button = button;
    };
    
    var moveable_button = function moveable_button() {
        var button = svg.append("g")
            .attr("class", "moveable_button");

        // Miterlimit?
        button.append("path")
            .attr("stroke-miterlimit", 10)
            .attr("d", gapminder.graphics.time_slider.move_button);
        
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
        var text = svg.selectAll(".time_slider_year")
            .data([state.year], function(d) { return d; });
        
        text.enter()
            .append("text")
            .attr("class", "time_slider_year")
            .attr("x", 155)
            .attr("y", 30)
            .text(function(d) { return Math.floor(state.year); });
        
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
        svg: svg,
        buttons: buttons,
        update: update,
        timeline_x: timeline_x
    };
};
