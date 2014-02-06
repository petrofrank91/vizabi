gapminder.bubble_map = function bubble_map(properties) {
    "use strict";

    var name = "bubble_map";

    var div;
    var svg;

    var width = 900;
    var height = 500;

    var viz_window = {
        width: 0, height: 0
    }

    var viz_components = {
        header: {}, bmap: {}, bubbles: {}, time_slider: {}
    };

    var data_handlers = {};
    var layout_manager;

    var ready = false;

    var state = {
        width: 900,
        height: 500,
        year: 1800,
        start_year: 1800,
        final_year: 2100,
        bubble_pop: 400000,
        map_data: {},
        bubble_data: [],
        population_data: {},
        border: true,
        gradient: true,
        gradient_colors: {},
        i18n: { dgettext: function (str1, str2) {
            return str2;
        } }
    };

    function init(properties) {
        state.width = properties.width || width;
        state.height = properties.height || height;
        state.year = +properties.year || state.year;
        state.i18n = properties.i18n || state.i18n;

        div = d3.select(properties.div).style("position", "relative");
        svg = div.append("svg").attr("id", properties.div + name)
            .attr("width", state.width).attr("height", state.height);
    }

    function init_helpers() {
        layout_manager = gapminder.layout_manager(div, state, viz_window);
        data_handlers.loader = gapminder.data_manager.bubble_map.loader();
    }

    function init_viz_components() {
        viz_components.header = gapminder.viz.tools.header({
            svg: svg,
            text: state.i18n.dgettext("popReg", "Billions of people per region")
        });

        viz_components.bmap = gapminder.viz.bubble_map.bmap({
            svg: svg,
            top: 40
        });

        viz_components.bubbles = gapminder.viz.bubble_map.bubbles({
            svg: viz_components.bmap.svg,
            border: state.border,
            gradient: state.gradient
        });

        // Send offsets instead of div?
        viz_components.time_slider = gapminder.tools.time_slider({
            div: div,
            svg: svg,
            state: state,
            viz_window: viz_window
        });
    }

    function bind_viz_positions() {
        // Excluded header since it is positioned at (0,0)
        layout_manager.add_layout({
            id: "normal",
            components: [
                {
                    id: "header",
                    element: viz_components.header.g,
                    type: "line",
                    anchor_point: { left: 15, top: 0 }
                },
                {
                    id: "map",
                    element: viz_components.bmap.g,
                    type: "line",
                    anchor_point: { left: 0, top: 40 }
                },
                {
                    id: "time_slider",
                    element: viz_components.time_slider.g,
                    type: "none",
                    anchor_point: { left: 300, top: 420 }
                }
            ]
        });
    }

    function load_data() {
        // Load map
        data_handlers.loader.load_map(state, function () {
            viz_components.bmap.draw(state.map_data); // unqueue!!
        });

        // Load population data
        data_handlers.loader.load_population(state);
    }

    function bind_time_slider() {
        var draw_routine = function () {
            fill_bubbles();
            viz_components.bubbles.draw(state.bubble_data);
        };

        viz_components.time_slider.on_play(draw_routine);
        viz_components.time_slider.on_stop(draw_routine);
        viz_components.time_slider.on_slide(draw_routine);
    };

    function update_positions() {
        layout_manager.update();
        layout_manager.reposition();
    }

    function transition(data) {
        var past = data[Math.floor(+state.year)];
        var future = data[Math.ceil(+state.year)];
        var factor = +state.year % 1;
        return past + (future - past) * factor;
    };

    function fill_bubbles() {
        var min_scale = Math.min(viz_window.width / 900, viz_window.height / 500);
        var length = state.bubble_data.length;

        for (var i = 0; i < length; i++) {
            var bubble = state.bubble_data[i];

            // Update bubble size
            var population = transition(state.population_data[bubble.region]);
            bubble.size = Math.sqrt((population / state.bubble_pop) / Math.PI);
            bubble.size *= min_scale;

            // Update bubble text (pop in billions)
            var pop_text = (population / 1000000000);
            bubble.text = pop_text < 0.5 ? pop_text.toFixed(2) : pop_text.toFixed(1);
        }
    };

    function set_initial_bubbles(geo_list) {
        for (var i = 0; i < geo_list.length; i++) {
            var geo = geo_list[i];
            var data = bubble_data(gapminder.entities.get_all_info(geo));
            data.id = geo;

            state.bubble_data.push(data);

            // Gradient color
            if (state.gradient) {
                set_grad_colors(data,
                    gapminder.entities.get_color(data.id, "mist_light"),
                    gapminder.entities.get_color(data.id));
            }
        }

        fill_bubbles();
        viz_components.bubbles.draw(state.bubble_data, state.gradient_colors);
    };

    function bubble_data(data) {
        return {
            id: data.id,
            region: data.region,
            size: 0,
            coordinates: viz_components.bmap.get_position(data),
            color: (state.gradient ? "url(#" + data.region + ")"
                : gapminder.entities.get_color(data.id))
        }
    };

    function set_grad_colors(data, from, to) {
        state.gradient_colors[data.id] = {
            id: data.region,
            from_color: from,
            to_color: to
        };
    };

    function resize_bubbles() {
        var min_scale = Math.min(viz_window.width / 900, viz_window.height / 500);

        for (var i = 0; i < state.bubble_data.length; i++) {
            var bubble = state.bubble_data[i];
            bubble.size *= min_scale;
        }

        viz_components.bubbles.draw(state.bubble_data);
    }

    function resize() {
        resize_bubbles();
        update_positions();
    }

    init(properties);
    init_helpers();
    init_viz_components();
    bind_viz_positions();
    bind_time_slider();
    load_data();
    update_positions();
    set_initial_bubbles(["PAN", "SWE", "THA", "UGA"]);
    resize_bubbles();

    return {
        svg: svg,
        state: state
    };
};
