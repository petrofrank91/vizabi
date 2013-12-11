gapminder.data_manager.bubble_map = {};
gapminder.data_manager.bubble_map.loader = function dm_bubble_map_loader() {
    "use strict";
    
    function load_map(state, callback) {
        d3.json("../../data/bubble_map/world-countries.json", function(d)
        {
            state.map_data = d;
            if (typeof callback === "function") { callback(); }
        });
    };
    
    // Change this to the actual data!!!!
    function load_pop(state, callback) {
        state.population_data = bubble_map_data;
        if (typeof callback === "function") { callback(); }
    }

    return {
        load_map: load_map,
        load_population: load_pop
    };
};
