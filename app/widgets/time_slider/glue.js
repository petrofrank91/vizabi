gapminder.tools.time_slider = function(properties) {
    "use strict";

    var div;
    var svg;
    
    var def = { width: 900, height: 500 };
    var viz_window = { width: 900, height: 500 };
    
    var settings = {
        height: 80,
        width: 270,
        play_interval: 10,
        time_slash: 0.1,
        time_precision: 5,
        playing: false,
        sliding: false
    };
    
    var interval;
    
    var viz_components = {};

    var buttons = {};
    var state;
    var viz_window;
    var localConfigs;

    var scale = 1;
    
    var init = function init(properties) {
        div = properties.div;
        viz_components.time_slider = time_slider(properties);
        
        state = properties.state;
        viz_window = properties.viz_window;

        localConfigs = properties.localConfigs;
        
        // Get buttons and time information from the time_slider
        buttons = viz_components.time_slider.buttons;
        slide_moveable_button();
    };

    var toggle = function toggle(button) {
        if (button.attr("visibility") === "hidden") {
            button.attr("visibility", "visible");
        } else {
            button.attr("visibility", "hidden");
        }
    };

    var slide_moveable_button = function move_moveable_button() {
        var date = new Date(state.year, 0);
        var x = -12 + viz_components.time_slider.timeline_x(date);
        buttons.moveable_button.attr("transform", "translate(" + x + ", 33)");
    };

    var play = function play(callback) {
        if (settings.playing) {
            if (state.year + settings.time_slash <= localConfigs.final_year) {
                state.year += settings.time_slash;
                state.year = +state.year.toPrecision(settings.time_precision);
            } else {
                state.year = localConfigs.final_year;
                settings.playing = false;
            }
            
            viz_components.time_slider.update();
            slide_moveable_button();
        } else {
            toggle(buttons.play_button);
            toggle(buttons.pause_button);
            clearInterval(interval);
        }
        
        if (typeof callback === "function") {
            callback(state.year);
        }
    };
    
    var on_play = function on_play(callback) {
        buttons.play_button.on("click", function() {
            settings.playing = true;
            toggle(buttons.play_button);
            toggle(buttons.pause_button);
            
            // Playing speed (higher, tested on ios7)
            if ((navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i))) {
                interval = setInterval(play, settings.play_interval * 2.5, callback);
            } else {
                interval = setInterval(play, settings.play_interval, callback);
            }
        });
    };
        
    var on_stop = function on_stop(callback) {    
        buttons.pause_button.on("click", function() {
            settings.playing = false;
            toggle(buttons.play_button);
            toggle(buttons.pause_button);
            clearInterval(interval);
            
            if (typeof callback === "function") {
                callback(state.year);
            }
        });
    };
    
    var on_slide = function on_slide(callback, stopped_sliding) {
        // Bind clicks locally
        buttons.moveable_button.on("mousedown", function() {
            settings.sliding = true;
        });
        
        if ((navigator.userAgent.match(/iPhone/i)) ||
            (navigator.userAgent.match(/iPod/i)) ||
            (navigator.userAgent.match(/iPad/i))) {
            console.log('here')
            // Get the touch event
            buttons.moveable_button.on("touchstart", function() {
                settings.sliding = true;
            });

            // Touch movement
            window.addEventListener("touchmove", function(event) {
                if (settings.sliding) {
                    if (settings.playing) settings.playing = false;
                    
                    event.preventDefault();
                    // deslocamento
                    var find_where = displacement(event.pageX);

                    buttons.moveable_button.attr("transform",
                        "translate(" + (48 + find_where) + ", 33)"
                    );

                    var x_date = 60 + find_where;
                    
                    state.year = viz_components.time_slider
                        .timeline_x.invert(x_date).getFullYear();

                    // Update time-slider
                    viz_components.time_slider.update();
                    
                    // Callback
                    if (typeof callback === "function") callback(state.year);
                }
            })
            
            window.addEventListener("touchend", function() {
                settings.sliding = false;
                if (typeof stopped_sliding === "function") stopped_sliding(state.year);
            })
        } else {
            // Binds the mouse movement and release globally
            window.addEventListener("mousemove", function(event) {
                if (settings.sliding) {
                    if (settings.playing) settings.playing = false;

                    // deslocamento
                    var find_where = displacement(event.pageX);

                    buttons.moveable_button.attr("transform",
                        "translate(" + (48 + find_where) + ", 33)"
                    );

                    var x_date = 60 + find_where;
                    
                    state.year = viz_components.time_slider
                        .timeline_x.invert(x_date).getFullYear();

                    // Update time-slider
                    viz_components.time_slider.update();

                    // Callback
                    if (typeof callback === "function") callback(state.year);
                }
            });
    
            // If mouseup, stop sliding
            window.addEventListener("mouseup", function() {
                settings.sliding = false;
                if (typeof stopped_sliding === "function") stopped_sliding(state.year);
            });  
        }
    };

    function updateScale() {
        scale = viz_window.width / +properties.svg.attr('viewBox').split(' ')[2];
    }

    function displacement(clickPosition) {
        /* BAD */
        var coord = viz_components.time_slider.g.attr("transform")
            .replace("translate", "")
            .replace("(", "").replace(")", "")
            .split(",");

        var left = Number(coord[0]);
        var top = Number(coord[1]);

        // Gets the current position of the time-slider div
        var div_position = {
            left: div.property("offsetLeft"),
            top: div.property("offsetTop")
        };

        updateScale();
        linearScale.domain([0, 190 * scale]);
        var timesliderDisplacement = left * scale + 60 * scale + div_position.left;
        var find_where = linearScale(clickPosition - timesliderDisplacement);

        return find_where;
    }

    function timeline_movement(value) {
        return d3.scale.linear()
            .range([0, 190])
            .domain([60 * scale, 250 * scale])
            .clamp(true)
            (value);
    }

    var linearScale = d3.scale.linear()
        .range([0, 190])
        .domain([0, 190 * scale])
        .clamp(true);

    init(properties);
    
    return {
        g: viz_components.time_slider.g,
        on_play: on_play,
        on_stop: on_stop,
        on_slide: on_slide
    };
};

// A function to move everything with transform? (with all transforms that is)
